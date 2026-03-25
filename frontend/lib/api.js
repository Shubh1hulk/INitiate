import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),

  // User
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  addTrainingData: (data) => api.post('/user/training-data', data),
  analyzePersonality: () => api.post('/user/analyze-personality'),

  // Digital Twin Chat
  createChat: (data) => api.post('/twin/chat', data),
  getChats: () => api.get('/twin/chats'),
  getChat: (chatId) => api.get(`/twin/chat/${chatId}`),
  sendMessage: (chatId, data) => api.post(`/twin/chat/${chatId}/message`, data),

  // Simulator
  generateSimulation: (data) => api.post('/simulator/simulate', data),
  getSimulations: () => api.get('/simulator/simulations'),
  getSimulation: (simulationId) => api.get(`/simulator/simulation/${simulationId}`),
  saveSimulation: (simulationId) => api.put(`/simulator/simulation/${simulationId}/save`),
  compareSimulations: (data) => api.post('/simulator/compare', data),
};

export default api;
