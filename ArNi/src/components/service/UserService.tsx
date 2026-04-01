import axios, { AxiosResponse } from "axios";
import { User } from "../../store";

// 1. Define Types for your responses
export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
  city: string;
}

// FIX: Added the missing GetUserResponse interface
export interface GetUserResponse {
  statusCode: number;
  message: string;
  ourUsers: User; // This is the key your component looks for
}

export interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  ourUsersList: User[];
}

class UserService {
  private static BASE_URL = "http://localhost:8080";

  // Helper to get authorization header
  private static getHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  /** --- AUTH METHODS --- **/

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse = await axios.post(`${this.BASE_URL}/login/authenticate`, { email, password });
      // Supporting both 'jwtToken' or 'token' keys based on your previous code
      const token = response.data.jwtToken || response.data.token;

      if (token) {
        return { token };
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error: any) {
      console.error("Login error:", error.response || error.message);
      throw new Error(error.response?.data || error.message || "An error occurred");
    }
  }

  static async sendOtp(phoneNumber: string): Promise<string> {
    try {
      const response: AxiosResponse<string> = await axios.post(`${this.BASE_URL}/auth/generate-otp/${phoneNumber}`);
      return response.data;
    } catch (error: any) {
      console.error("Send OTP error:", error.response || error.message);
      throw new Error(error.response?.data || error.message || 'Failed to send OTP');
    }
  }

  static async loginWithPhone(phoneNumber: string, otp: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse = await axios.post(`${this.BASE_URL}/auth/verify-otp/${phoneNumber}/${otp}`);
      
      const token = response.data.token || response.data.jwtToken;

      if (token) {
        return { token };
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error: any) {
      console.error("Phone Login error:", error.response || error.message);
      throw new Error(error.response?.data || error.message || "An error occurred");
    }
  }

  /** --- USER METHODS --- **/

  static async register(userData: RegisterRequest, token: string | null): Promise<any> {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(`${this.BASE_URL}/admin/register`, userData, config);
    return response.data;
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      // Switched from fetch to axios for consistency
      const response: AxiosResponse<User> = await axios.get(
        `${this.BASE_URL}/user/current`, 
        this.getHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  /** --- UTILS --- **/

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  static logout(): void {
    localStorage.removeItem('token');
  }

  /** --- USER MANAGEMENT METHODS (ADMIN) --- **/

  // FIXED: Added missing getUserById method
  static async getUserById(userId: string, token: string): Promise<GetUserResponse> {
    try {
      const response: AxiosResponse<GetUserResponse> = await axios.get(
        `${this.BASE_URL}/admin/get-users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error fetching user");
    }
  }

  // FIXED: Added missing updateUser method
  static async updateUser(userId: string, userData: User, token: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.put(
        `${this.BASE_URL}/admin/update/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error updating user");
    }
  }

  // FIXED: Added missing getAllUsers method
  static async getAllUsers(token: string): Promise<GetAllUsersResponse> {
    try {
      const response: AxiosResponse<GetAllUsersResponse> = await axios.get(
        `${this.BASE_URL}/admin/get-all-users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error fetching all users");
    }
  }

  // FIXED: Added missing deleteUser method
  static async deleteUser(userId: string, token: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.delete(
        `${this.BASE_URL}/admin/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error deleting user");
    }
  }
}



export default UserService;