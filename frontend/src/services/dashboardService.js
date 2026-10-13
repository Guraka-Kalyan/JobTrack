import api from './api';

export const dashboardService = {
  // Get complete dashboard summary
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  // Get analytics overview
  getAnalyticsOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
};
