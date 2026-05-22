import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export default api;

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password })
};

export const orgApi = {
  get: () => api.get('/organizations'),
  createDivision: (data: any) => api.post('/organizations/divisions', data),
  createDepartment: (data: any) => api.post('/organizations/departments', data),
  createTeam: (data: any) => api.post('/organizations/teams', data)
};

export const userApi = {
  getAll: () => api.get('/users'),
  get: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  deactivate: (id: string) => api.delete(`/users/${id}`),
  assignRoles: (id: string, data: any) => api.post(`/users/${id}/roles`, data)
};

export const projectApi = {
  getAll: (status?: string) => api.get('/projects', { params: { status } }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  addTeam: (id: string, data: any) => api.post(`/projects/${id}/team`, data),
  createMilestone: (id: string, data: any) => api.post(`/projects/${id}/milestones`, data),
  createFeasibility: (id: string) => api.post(`/projects/${id}/feasibility`, data),
  createCharter: (id: string, data: any) => api.post(`/projects/${id}/charter`, data)
};

export const approvalApi = {
  getAll: (status?: string) => api.get('/approvals', { params: { status } }),
  createWorkflow: (data: any) => api.post('/approvals/workflows', data),
  create: (data: any) => api.post('/approvals', data),
  submit: (id: string, data: any) => api.post(`/approvals/${id}/submit`, data)
};