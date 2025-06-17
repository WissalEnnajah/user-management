// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('accessToken', res.data.token);
  localStorage.setItem('refreshToken', res.data.refreshToken);
  return res.data;
};

const logout = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  axios.post(`${API_URL}/logout`, { refreshToken });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const refreshToken = async () => {
  const token = localStorage.getItem('refreshToken');
  const res = await axios.post(`${API_URL}/refresh`, { refreshToken: token });
  return res.data.accessToken;
};

export default {
  login,
  logout,
  refreshToken,
};
