import api from '../components/api/api';
import axios from 'axios';

// Types
export interface AuthResponse {
  token: string;
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  role?: string[];     
  phoneNumber?: string;
  city?: string;  
}



export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
  city: string;
}

export interface GetUserResponse {
  statusCode: number;
  message: string;
  ourUsers: UserProfile;
}

export interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  ourUsersList: UserProfile[];
}

export interface Business {
  id?: string | number;
  name: string;
  fullName: string;
  address: string;
  description: string;
  category: string;
  creationTime?: string;
}

export interface Category {
  id: number | string;
  name: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('email',email);
    const response = await axios.post(`${window?.config?.API_BASE_URL}/login/authenticate`, { email, password });
    const token = response.data.jwtToken || response.data.token;
    if (token) {
      return { token };
    } else {
      throw new Error('Token not found in response');
    }
  },

  sendOtp: async (phoneNumber: string): Promise<string> => {
    const response = await axios.post(`${window?.config?.API_BASE_URL}/auth/generate-otp/${phoneNumber}`);
    return response.data;
  },

  loginWithPhone: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
    const response = await axios.post(`${window?.config?.API_BASE_URL}/auth/verify-otp/${phoneNumber}/${otp}`);
    const token = response.data.token || response.data.jwtToken;
    if (token) {
      return { token };
    } else {
      throw new Error('Token not found in response');
    }
  },

  register: async (userData: RegisterRequest, token: string): Promise<any> => {
    const response = await axios.post(`${window?.config?.API_BASE_URL}/admin/register`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${window?.config?.API_BASE_URL}/user/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },
};

// User Management API
export const userAPI = {
  getUserById: async (userId: string, token: string): Promise<GetUserResponse> => {
    const response = await axios.get(`${window?.config?.API_BASE_URL}/admin/get-users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateUser: async (userId: string, userData: UserProfile, token: string): Promise<any> => {
    const response = await axios.put(`${window?.config?.API_BASE_URL}/admin/update/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAllUsers: async (token: string): Promise<GetAllUsersResponse> => {
    const response = await axios.get(`${window?.config?.API_BASE_URL}/admin/get-all-users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteUser: async (userId: string, token: string): Promise<any> => {
    const response = await axios.delete(`${window?.config?.API_BASE_URL}/admin/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// Business API
export const businessAPI = {
  fetchBusinesses: async (): Promise<Business[]> => {
    const response = await api.get('/businesses');
    return response.data;
  },

  saveBusiness: async (business: Business): Promise<Business> => {
    const response = await api.post('/business', business);
    return response.data;
  },

  updateBusiness: async (id: string | number, business: Business): Promise<Business> => {
    const response = await api.put(`/business/${id}`, business);
    return response.data;
  },

  deleteBusiness: async (id: string | number): Promise<void> => {
    await api.delete(`/business/${id}`);
  },

  fetchCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
};

// Add more API groups as needed