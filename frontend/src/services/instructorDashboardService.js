import api from './api';

// ── PAYOUTS ──────────────────────────────────────────────────────────────────
export const getPayoutData = async () => {
  const response = await api.get('/instructor/payouts');
  return response.data;
};

export const requestWithdrawal = async (amount, method) => {
  const response = await api.post('/instructor/withdraw', { amount, paymentMethod: method });
  return response.data;
};

// ── REVIEWS ──────────────────────────────────────────────────────────────────
export const getReviewData = async () => {
  const response = await api.get('/instructor/reviews');
  return response.data;
};

// ── SETTINGS ─────────────────────────────────────────────────────────────────
export const updateSettings = async (data) => {
  const response = await api.put('/instructor/settings', data);
  return response.data;
};

// ── HELP CENTER ──────────────────────────────────────────────────────────────
export const submitTicket = async (data) => {
  const response = await api.post('/instructor/support/tickets', data);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get('/instructor/support/tickets');
  return response.data;
};
