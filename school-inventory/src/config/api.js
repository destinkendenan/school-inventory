// src/config/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  USERS: {
    GET_PROFILE: `${API_BASE_URL}/users/me`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
  },
  ITEMS: {
    GET_ALL: `${API_BASE_URL}/items`,
    GET_BY_ID: (id) => `${API_BASE_URL}/items/${id}`,
    CREATE: `${API_BASE_URL}/items`,
    UPDATE: (id) => `${API_BASE_URL}/items/${id}`,
    DELETE: (id) => `${API_BASE_URL}/items/${id}`,
  },
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/categories`,
    GET_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id) => `${API_BASE_URL}/categories/${id}`,
  },
  BORROWS: {
    GET_ALL: `${API_BASE_URL}/borrows`,
    GET_BY_ID: (id) => `${API_BASE_URL}/borrows/${id}`,
    CREATE: `${API_BASE_URL}/borrows`,
    UPDATE: (id) => `${API_BASE_URL}/borrows/${id}`,
    DELETE: (id) => `${API_BASE_URL}/borrows/${id}`,
    RETURN: (id) => `${API_BASE_URL}/borrows/${id}/return`
  }
};