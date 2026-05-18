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

// Safely convert a Stripe Unix timestamp (seconds) to a Date.
// Returns null instead of "Invalid Date" if the value is missing.
const safeDate = (unixSeconds) => {
  if (unixSeconds == null || isNaN(unixSeconds)) return null;
  const d = new Date(unixSeconds * 1000);
  return isNaN(d.getTime()) ? null : d;
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
  try {
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

      // Normalise plan.status — Stripe may return 'trialing' which the enum must accept
      const planStatus = ['active', 'expired', 'canceled', 'past_due', 'unpaid', 'trialing'].includes(subscription.status)
        ? subscription.status
        : 'active';

      const updateData = {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        'plan.name': planKey,
        'plan.status': planStatus,
      };

      // Only set date fields if Stripe returned valid timestamps
      const startedAt = safeDate(subscription.current_period_start);
      const expiresAt = safeDate(subscription.current_period_end);
      if (startedAt) updateData['plan.startedAt'] = startedAt;
      if (expiresAt) updateData['plan.expiresAt'] = expiresAt;

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!user) {
        throw new ApiError(404, 'User not found in database. Please log out and log back in.');
      }

      return res.json({ success: true, plan: user.plan });
    }

    res.json({ success: false, message: 'User not identified in session' });
  } catch (err) {
    console.error('Detailed verify-session error:', err);
    // Return the actual error message so the frontend can display it instead of "Internal server error"
    throw new ApiError(500, `Verification Failed: ${err.message}`);
  }
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
    // For now, in test mode without webhook secret, just parsing body:
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

          const planStatus = ['active', 'expired', 'canceled', 'past_due', 'unpaid', 'trialing'].includes(subscription.status)
            ? subscription.status
            : 'active';

          const webhookUpdateData = {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            'plan.name': planKey,
            'plan.status': planStatus,
          };

          const whStartedAt = safeDate(subscription.current_period_start);
          const whExpiresAt = safeDate(subscription.current_period_end);
          if (whStartedAt) webhookUpdateData['plan.startedAt'] = whStartedAt;
          if (whExpiresAt) webhookUpdateData['plan.expiresAt'] = whExpiresAt;

          await User.findByIdAndUpdate(userId, webhookUpdateData);
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
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          const validStatus = ['active', 'expired', 'canceled', 'past_due', 'unpaid', 'trialing'].includes(subscription.status)
            ? subscription.status
            : 'active';

          user.stripeSubscriptionId = subscription.id;
          user.stripePriceId = priceId;
          user.plan.name = isActive ? planKey : 'basic';
          user.plan.status = validStatus;

          const subStartedAt = safeDate(subscription.current_period_start);
          const subExpiresAt = safeDate(subscription.current_period_end);
          if (subStartedAt) user.plan.startedAt = subStartedAt;
          if (subExpiresAt) user.plan.expiresAt = subExpiresAt;

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
