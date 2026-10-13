import api from './api';

export const interviewService = {
  // Get all interviews or for specific application
  getAll: async (applicationId = null) => {
    const params = applicationId ? { applicationId } : {};
    const response = await api.get('/interviews', { params });
    return response.data;
  },

  // Get single interview by ID
  getById: async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  // Get upcoming interviews
  getUpcoming: async () => {
    const response = await api.get('/interviews/upcoming');
    return response.data;
  },

  // Get past interviews
  getPast: async () => {
    const response = await api.get('/interviews/past');
    return response.data;
  },

  // Create an interview
  create: async (data) => {
    const response = await api.post('/interviews', data);
    return response.data;
  },

  // Update an interview
  update: async (id, data) => {
    const response = await api.put(`/interviews/${id}`, data);
    return response.data;
  },

  // Update interview status (e.g. COMPLETED, CANCELLED)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/interviews/${id}/status`, { status });
    return response.data;
  },

  // Delete an interview
  delete: async (id) => {
    await api.delete(`/interviews/${id}`);
  },
};
