const PLANS = {
  basic: {
    name: 'basic',
    label: 'Basic',
    templates: ['Modern', 'Professional', 'Minimal'],
    resumeLimitText: '3 resumes total',
    downloadPdf: true,
    screeningHistory: true
  },
  pro: {
    name: 'pro',
    label: 'Pro',
    templates: ['Modern', 'Professional', 'Minimal', 'Creative', 'Executive'],
    resumeLimitText: '3 resumes per week',
    durationDays: 30,
    downloadPdf: true,
    screeningHistory: true
  },
  premium: {
    name: 'premium',
    label: 'Premium',
    templates: ['Modern', 'Professional', 'Minimal', 'Creative', 'Executive', 'ATS Focused', 'Technical'],
    resumeLimitText: '20 resumes per month',
    durationDays: 30,
    downloadPdf: true,
    screeningHistory: true,
    companySuggestions: true
  }
};

function getActivePlan(user) {
  if (!user?.plan?.name) return PLANS.basic;
  if (user.plan.expiresAt && new Date(user.plan.expiresAt) < new Date()) return PLANS.basic;
  return PLANS[user.plan.name] || PLANS.basic;
}

module.exports = { PLANS, getActivePlan };
