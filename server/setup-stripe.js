require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setup() {
  try {
    // Pro Plan
    const proProduct = await stripe.products.create({
      name: 'ResumeAI Pro Plan',
      description: 'Monthly Pro subscription with up to 5 resumes and 50 ATS scans.'
    });
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 14900, // ₹149
      currency: 'inr',
      recurring: { interval: 'month' }
    });

    // Premium Plan
    const premiumProduct = await stripe.products.create({
      name: 'ResumeAI Premium Plan',
      description: 'Monthly Premium subscription with unlimited resumes and ATS scans.'
    });
    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 29900, // ₹299
      currency: 'inr',
      recurring: { interval: 'month' }
    });

    console.log(`PRO_PRICE_ID=${proPrice.id}`);
    console.log(`PREMIUM_PRICE_ID=${premiumPrice.id}`);
  } catch (error) {
    console.error('Error creating Stripe plans:', error);
  }
}

setup();
