import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Use current backend URL
const API_BASE_URL = 'http://localhost:5000/api';

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

export const serviceApi = {
  getAll: () =>
    apiRequest('/services', 'GET'),
  getById: (id: number) =>
    apiRequest(`/services/${id}`, 'GET'),
  getByStore: (storeId: number) =>
    apiRequest(`/services/store/${storeId}`, 'GET'),
  create: (serviceData: any) =>
    apiRequest('/services', 'POST', serviceData),
  update: (id: number, serviceData: any) =>
    apiRequest(`/services/${id}`, 'PUT', serviceData),
  delete: (id: number) =>
    apiRequest(`/services/${id}`, 'DELETE'),
};

export const jobApi = {
  getAll: () =>
    apiRequest('/jobs', 'GET'),
  getById: (id: number) =>
    apiRequest(`/jobs/${id}`, 'GET'),
  getByStore: (storeId: number) =>
    apiRequest(`/jobs/store/${storeId}`, 'GET'),
  create: (jobData: any) =>
    apiRequest('/jobs', 'POST', jobData),
  update: (id: number, jobData: any) =>
    apiRequest(`/jobs/${id}`, 'PUT', jobData),
  delete: (id: number) =>
    apiRequest(`/jobs/${id}`, 'DELETE'),
};

export const announcementApi = {
  getAll: () =>
    apiRequest('/announcements', 'GET'),
  getById: (id: number) =>
    apiRequest(`/announcements/${id}`, 'GET'),
  getByStore: (storeId: number) =>
    apiRequest(`/announcements/store/${storeId}`, 'GET'),
  create: (announcementData: any) =>
    apiRequest('/announcements', 'POST', announcementData),
  update: (id: number, announcementData: any) =>
    apiRequest(`/announcements/${id}`, 'PUT', announcementData),
  delete: (id: number) =>
    apiRequest(`/announcements/${id}`, 'DELETE'),
};

// Legacy compatibility for existing screens
export const apiService = {
  login: (credentials: any) => authApi.login(credentials.username, credentials.password),
  register: (userData: any) => authApi.register(userData),
  getStores: () => storeApi.getAll(),
  getStore: (id: number) => storeApi.getById(id),
  createStore: (storeData: any) => storeApi.create(storeData),
  updateStore: (id: number, storeData: any) => storeApi.update(id, storeData),
  getProducts: () => productApi.getAll(),
  getProductsByStore: (storeId: number) => productApi.getByStore(storeId),
  createProduct: (productData: any) => productApi.create(productData),
  updateProduct: (id: number, productData: any) => productApi.update(id, productData),
  deleteProduct: (id: number) => productApi.delete(id),
  getServices: () => serviceApi.getAll(),
  getServicesByStore: (storeId: number) => serviceApi.getByStore(storeId),
  createService: (serviceData: any) => serviceApi.create(serviceData),
  updateService: (id: number, serviceData: any) => serviceApi.update(id, serviceData),
  deleteService: (id: number) => serviceApi.delete(id),
  getJobs: () => jobApi.getAll(),
  getJobsByStore: (storeId: number) => jobApi.getByStore(storeId),
  createJob: (jobData: any) => jobApi.create(jobData),
  updateJob: (id: number, jobData: any) => jobApi.update(id, jobData),
  deleteJob: (id: number) => jobApi.delete(id),
  getAnnouncements: () => announcementApi.getAll(),
  getAnnouncementsByStore: (storeId: number) => announcementApi.getByStore(storeId),
  createAnnouncement: (announcementData: any) => announcementApi.create(announcementData),
  updateAnnouncement: (id: number, announcementData: any) => announcementApi.update(id, announcementData),
  deleteAnnouncement: (id: number) => announcementApi.delete(id),
  getUserProfile: () => userApi.getProfile(),
  updateUserProfile: (profileData: any) => userApi.updateProfile(profileData),
};