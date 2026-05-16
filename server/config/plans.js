const PLANS = {
  basic: {
    name: 'basic',
    label: 'Basic',
    templates: ['Modern', 'Professional', 'Minimal'],
    resumeLimitText: '1 resume total',
    maxResumes: 1,
    maxAtsScans: 3,
    downloadPdf: true,
    screeningHistory: true,
    stripePriceId: null
  },
  pro: {
    name: 'pro',
    label: 'Pro',
    templates: ['Modern', 'Professional', 'Minimal', 'Creative', 'Executive'],
    resumeLimitText: '5 resumes total',
    maxResumes: 5,
    maxAtsScans: 50,
    durationDays: 30,
    downloadPdf: true,
    screeningHistory: true,
    stripePriceId: 'price_1TXjlXKFqx4P8r4M3KlQB3fu'
  },
  premium: {
    name: 'premium',
    label: 'Premium',
    templates: ['Modern', 'Professional', 'Minimal', 'Creative', 'Executive', 'ATS Focused', 'Technical'],
    resumeLimitText: 'Unlimited resumes',
    maxResumes: 999999, // practically unlimited
    maxAtsScans: 999999,
    durationDays: 30,
    downloadPdf: true,
    screeningHistory: true,
    companySuggestions: true,
    stripePriceId: 'price_1TXjlYKFqx4P8r4MyzxPg7H5'
  }
};

function getActivePlan(user) {
  if (!user?.plan?.name) return PLANS.basic;
  if (user.plan.expiresAt && new Date(user.plan.expiresAt) < new Date()) return PLANS.basic;
  return PLANS[user.plan.name] || PLANS.basic;
}

module.exports = { PLANS, getActivePlan };
