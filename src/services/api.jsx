// src/services/api.js
import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // adapte à ton backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// ➕ Intercepteur pour ajouter le token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Intercepteur pour gérer le refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await authService.refreshToken();
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // rejoue la requête
      } catch (e) {
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
