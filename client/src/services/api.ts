// src/services/api.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT 토큰을 헤더에 추가하는 인터셉터
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = (userData: any) => api.post('/auth/signup', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);
export const getRanking = () => api.get('/usre/ranking');

export default api;
