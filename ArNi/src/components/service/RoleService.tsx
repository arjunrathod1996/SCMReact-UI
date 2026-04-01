import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { Role } from '../../types';

/** --- 1. Interfaces --- **/

/** --- 2. Service Class --- **/

class RoleService {
  private static readonly BASE_URL: string = `${window.config.API_BASE_URL}/api`;

  /**
   * Generates authorization headers.
   * Uses RawAxiosRequestHeaders to avoid index signature errors.
   */
  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Fetches all available roles from the backend.
   */
  static async getRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<Role[]> = await axios.get(`${this.BASE_URL}/roles`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      // Improved error handling with TypeScript types
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
      throw error;
    }
  }
}

export default RoleService;