// src/services/apiService.js
import { API_ENDPOINTS } from '../config/api';

// Helper function untuk API request
export const apiRequest = async (url, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`API Request: ${method} ${url}`, body);
    console.log(`Full request URL: ${url}`, method, body);
    // Di fungsi apiRequest, tambahkan logging yang lebih detail
    console.log(`API Request details:`, {
      url,
      method,
      headers: options.headers,
      body
    });
    const response = await fetch(url, options);
    console.log(`API Response status:`, response.status);
    
    // Di dalam fungsi apiRequest, tambahkan log response untuk debugging
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Error response raw text:', responseText);
      
      // Coba parse sebagai JSON untuk debugging
      try {
        const responseObj = JSON.parse(responseText);
        console.log('Error response parsed:', responseObj);
      } catch (e) {
        console.log('Error response is not valid JSON');
      }
      
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        if (responseText && responseText.trim().startsWith('{')) {
          const errorData = JSON.parse(responseText);
          
          // Handle berbagai format error yang mungkin dikembalikan API
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'object') {
            // Jika object, convert ke string yang bermakna
            errorMessage = Object.keys(errorData)
              .map(key => `${key}: ${errorData[key]}`)
              .join(', ');
          }
        }
      } catch (parseErr) {
        console.error('Error parsing error response:', parseErr);
        if (responseText) {
          errorMessage = `${errorMessage} - ${responseText}`;
        }
      }
      
      throw new Error(errorMessage);
    }
  
    // Untuk methods selain GET yang tidak mengembalikan data
    if (method !== 'GET' && response.status === 204) {
      return null;
    }

    // Setelah response:
    console.log(`API Response status:`, response.status);
    return await response.json();
  } catch (error) {
    console.error(`API Error: ${method} ${url}`, error);
    
    // Perbaiki error message agar tidak menampilkan [object Object]
    if (error.toString() === "[object Object]") {
      try {
        const errorString = JSON.stringify(error);
        throw new Error(`API Error: ${errorString}`);
      } catch (e) {
        throw new Error(`API Error: Terjadi kesalahan yang tidak dapat diidentifikasi`);
      }
    }
    
    throw error;
  }
};

// Item API
export const getItems = () => apiRequest(API_ENDPOINTS.ITEMS.GET_ALL);
export const getItemById = (id) => apiRequest(API_ENDPOINTS.ITEMS.GET_BY_ID(id));
export const createItem = (itemData) => apiRequest(API_ENDPOINTS.ITEMS.CREATE, 'POST', itemData);
export const updateItem = (id, itemData) => apiRequest(API_ENDPOINTS.ITEMS.UPDATE(id), 'PUT', itemData);
export const deleteItem = (id) => apiRequest(API_ENDPOINTS.ITEMS.DELETE(id), 'DELETE');

// Category API
export const getCategories = () => apiRequest(API_ENDPOINTS.CATEGORIES.GET_ALL);
export const createCategory = (categoryData) => apiRequest(API_ENDPOINTS.CATEGORIES.CREATE, 'POST', categoryData);
export const updateCategory = (id, categoryData) => 
  apiRequest(API_ENDPOINTS.CATEGORIES.UPDATE(id), 'PUT', categoryData);
export const deleteCategory = (id) => apiRequest(API_ENDPOINTS.CATEGORIES.DELETE(id), 'DELETE');

// Borrow API
export const getBorrows = async () => {
  try {
    // Ubah endpoint untuk mendapatkan data dengan relasi (include user)
    const response = await apiRequest(`${API_ENDPOINTS.BORROWS.GET_ALL}?include=user,barang`);
    return response;
  } catch (error) {
    console.error("Error fetching borrows:", error);
    throw error;
  }
};
export const createBorrow = (borrowData) => apiRequest(API_ENDPOINTS.BORROWS.CREATE, 'POST', borrowData);
export const updateBorrow = (id, borrowData) => 
  apiRequest(API_ENDPOINTS.BORROWS.UPDATE(id), 'PATCH', borrowData);

// Return API
export const getReturns = () => apiRequest(API_ENDPOINTS.RETURNS.GET_ALL);
export const createReturn = (returnData) => apiRequest(API_ENDPOINTS.RETURNS.CREATE, 'POST', returnData);

// User API
export const getUsers = () => apiRequest(API_ENDPOINTS.USERS.GET_ALL);
export const getUser = (id) => apiRequest(API_ENDPOINTS.USERS.GET_BY_ID(id));
export const updateUser = (id, userData) => apiRequest(API_ENDPOINTS.USERS.UPDATE(id), 'PUT', userData);

// Perbaiki fungsi returnBorrowedItem untuk menggunakan endpoint update standar
export const returnBorrowedItem = async (id, returnData) => {
  console.log(`Returning borrowed item ID ${id} with data:`, returnData);
  
  // Hanya gunakan PATCH
  return updateBorrow(id, returnData);
};

// Contoh fungsi registerUser
export async function registerUser(data) {
  const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const responseText = await response.text();
  if (!response.ok) {
    let errorMsg = 'Gagal mendaftar. Username/email mungkin sudah digunakan.';
    try {
      const errJson = JSON.parse(responseText);
      if (errJson.detail) errorMsg = errJson.detail;
      if (errJson.message) errorMsg = errJson.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return JSON.parse(responseText);
}