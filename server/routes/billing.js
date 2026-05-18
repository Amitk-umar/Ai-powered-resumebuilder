const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const { PLANS } = require('../config/plans');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Find a plan key by stripe price ID
const getPlanKeyByPriceId = (priceId) => {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceId === priceId) return key;
  }
  return 'basic';
};

// Create Checkout Session
router.post('/checkout-session', authMiddleware, asyncHandler(async (req, res) => {
  const { planKey } = req.body;
  const plan = PLANS[planKey];
  
  if (!plan || !plan.stripePriceId) {
    throw new ApiError(400, 'Invalid plan selected for checkout');
  }

  const user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const sessionConfig = {
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`,
    client_reference_id: user._id.toString(),
    customer_email: user.email,
    metadata: {
      userId: user._id.toString(),
      planName: planKey
    }
  };

  if (user.stripeCustomerId) {
    sessionConfig.customer = user.stripeCustomerId;
    delete sessionConfig.customer_email;
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);

  res.json({ url: session.url });
}));

// Verify Checkout Session (Manually updates DB to prevent relying solely on webhooks)
router.post('/verify-session', authMiddleware, asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    throw new ApiError(400, 'Session ID is required');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') {
    throw new ApiError(400, 'Payment not successful');
  }

  const userId = session.client_reference_id || session.metadata?.userId;
  const subscriptionId = session.subscription;
  const customerId = session.customer;

  if (userId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    const planKey = getPlanKeyByPriceId(priceId);

    const user = await User.findByIdAndUpdate(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      'plan.name': planKey,
      'plan.status': subscription.status,
      'plan.startedAt': new Date(subscription.current_period_start * 1000),
      'plan.expiresAt': new Date(subscription.current_period_end * 1000)
    }, { new: true });

    if (!user) {
      throw new ApiError(404, 'User not found in database. Please log out and log back in.');
    }

    return res.json({ success: true, plan: user.plan });
  }

  res.json({ success: false, message: 'User not identified in session' });
}));

// Customer Portal
router.post('/portal', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  if (!user.stripeCustomerId) {
    throw new ApiError(400, 'No active subscription found');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
  });

  res.json({ url: portalSession.url });
}));

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // If you have a webhook secret configured, uncomment and use it
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    // For now, in test mode without webhook secret, just parse body:
    event = JSON.parse(req.body);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        if (userId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          const planKey = getPlanKeyByPriceId(priceId);

          await User.findByIdAndUpdate(userId, {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            'plan.name': planKey,
            'plan.status': subscription.status,
            'plan.startedAt': new Date(subscription.current_period_start * 1000),
            'plan.expiresAt': new Date(subscription.current_period_end * 1000)
          });
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        const priceId = subscription.items.data[0].price.id;
        const planKey = getPlanKeyByPriceId(priceId);
        
        // Find user by customerId
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.stripeSubscriptionId = subscription.id;
          user.stripePriceId = priceId;
          user.plan.name = subscription.status === 'active' || subscription.status === 'trialing' ? planKey : 'basic';
          user.plan.status = subscription.status;
          user.plan.startedAt = new Date(subscription.current_period_start * 1000);
          user.plan.expiresAt = new Date(subscription.current_period_end * 1000);
          await user.save();
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;
