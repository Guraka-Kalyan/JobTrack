import api from './api';

export const applicationService = {
  // Fetch all applications or filtered
  getAll: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  // Fetch single application by ID
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Create a new application
  create: async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Update existing application
  update: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },

  // Delete an application
  delete: async (id) => {
    await api.delete(`/applications/${id}`);
  },

  // Update follow-up status/date
  updateFollowUp: async (id, payload) => {
    const response = await api.patch(`/applications/${id}/follow-up`, payload);
    return response.data;
  },

  // Get all applications that have follow-ups
  getFollowUps: async () => {
    const response = await api.get('/applications/follow-ups');
    return response.data;
  },
};
