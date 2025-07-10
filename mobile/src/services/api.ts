import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Use current backend URL
const API_BASE_URL = 'https://your-domain.replit.app/api';

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method,
      headers,
    };
    
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API methods for different endpoints
export const authApi = {
  login: (username: string, password: string) =>
    apiRequest('/auth/login', 'POST', { username, password }),
  register: (userData: any) =>
    apiRequest('/auth/register', 'POST', userData),
  getProfile: () =>
    apiRequest('/auth/me', 'GET'),
};

export const storeApi = {
  getAll: () =>
    apiRequest('/stores', 'GET'),
  getById: (id: number) =>
    apiRequest(`/stores/${id}`, 'GET'),
  create: (storeData: any) =>
    apiRequest('/stores', 'POST', storeData),
  update: (id: number, storeData: any) =>
    apiRequest(`/stores/${id}`, 'PUT', storeData),
  delete: (id: number) =>
    apiRequest(`/stores/${id}`, 'DELETE'),
};

export const productApi = {
  getAll: () =>
    apiRequest('/products', 'GET'),
  getById: (id: number) =>
    apiRequest(`/products/${id}`, 'GET'),
  getByStore: (storeId: number) =>
    apiRequest(`/products/store/${storeId}`, 'GET'),
  create: (productData: any) =>
    apiRequest('/products', 'POST', productData),
  update: (id: number, productData: any) =>
    apiRequest(`/products/${id}`, 'PUT', productData),
  delete: (id: number) =>
    apiRequest(`/products/${id}`, 'DELETE'),
};

export const userApi = {
  getProfile: () =>
    apiRequest('/users/profile', 'GET'),
  updateProfile: (userData: any) =>
    apiRequest('/users/profile', 'PUT', userData),
};