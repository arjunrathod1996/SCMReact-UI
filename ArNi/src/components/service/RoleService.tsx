import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

/** --- 1. Interfaces --- **/

export interface Role {
  id: string | number;
  name: string; // The value usually sent to the backend (e.g., 'ROLE_ADMIN')
  tag: string;  // The human-readable label (e.g., 'Admin')
}

/** --- 2. Service Class --- **/

class RoleService {
  private static BASE_URL = "http://localhost:8080/api";

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