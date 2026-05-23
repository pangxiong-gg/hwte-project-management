import axios from 'axios';
import type { User, Project, LoginResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password })
};

// Organization
export const orgApi = {
  get: () => api.get('/organizations')
};

// Projects
export const projectApi = {
  getAll: (status?: string) =>
    api.get<Project[]>('/projects', { params: { status } }),
  get: (id: string) =>
    api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) =>
    api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data)
};

export default api;