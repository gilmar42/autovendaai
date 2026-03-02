import axios from 'axios';

const envApiUrl = process.env.REACT_APP_API_URL;
const normalizedBaseUrl = (envApiUrl || 'http://127.0.0.1:5000/api').replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

// Funções utilitárias removidas (não há mais tokens)
export function setTokens() {}
export function clearTokens() {}
export function getAccessToken() { return null; }
export function getRefreshToken() { return null; }

export default api;
