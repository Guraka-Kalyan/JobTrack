import api from './api';

export const studyService = {
  // Get all study sessions or filtered by subject/date
  getAll: async (params = {}) => {
    const response = await api.get('/study-sessions', { params });
    return response.data;
  },

  // Get single session
  getById: async (id) => {
    const response = await api.get(`/study-sessions/${id}`);
    return response.data;
  },

  // Create study session
  create: async (data) => {
    const response = await api.post('/study-sessions', data);
    return response.data;
  },

  // Update study session
  update: async (id, data) => {
    const response = await api.put(`/study-sessions/${id}`, data);
    return response.data;
  },

  // Toggle completion status
  toggleComplete: async (id) => {
    const response = await api.patch(`/study-sessions/${id}/toggle-complete`);
    return response.data;
  },

  // Delete study session
  delete: async (id) => {
    await api.delete(`/study-sessions/${id}`);
  },

  // Get study summary
  getSummary: async () => {
    const response = await api.get('/study-sessions/summary');
    return response.data;
  },
};
