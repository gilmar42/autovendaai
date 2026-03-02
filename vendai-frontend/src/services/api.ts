import axios from 'axios';

const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
const normalizedBaseUrl = (envApiUrl || 'http://127.0.0.1:8000/api/v1/').replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/`,
});

// Interceptor para adicionar o tenant_id (empresa fixa no MVP)
api.interceptors.request.use((config) => {
  config.headers['X-Tenant-Id'] = 'my-company-01'; // Mock para MVP
  return config;
});

export default api;
