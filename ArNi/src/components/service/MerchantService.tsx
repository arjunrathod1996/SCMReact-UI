import axios, { AxiosResponse, RawAxiosRequestHeaders } from "axios";

/** --- 1. Interfaces --- **/

export interface Merchant {
  id?: string | number;
  name: string;
  mobileNumber: string;
  displayPhone: string;
  locality: string;
  address: string;
  category: string;
  business?: { id: string | number; name: string };
  region?: { id: string | number; city: string };
  creationTime?: string;
}

export interface MerchantUser {
  id?: string | number;
  email: string;
  password?: string;
  roleName: string;
  validityDate: Date | string | null;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** --- 2. Service Class --- **/

class MerchantService {
  private static BASE_URL = "http://localhost:8080/api";

  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Saves or updates a merchant. 
   */
  static async saveMerchant(
    merchant: Partial<Merchant>,
    id: string | number | null = null,
    businessID: string | number | null = null,
    regionID: string | number | null = null
  ): Promise<Merchant> {
    const params = new URLSearchParams();
    if (id) params.append("id", id.toString());
    if (businessID) params.append("businessID", businessID.toString());
    if (regionID) params.append("regionID", regionID.toString());

    const url = `${this.BASE_URL}/merchant${params.toString() ? `?${params.toString()}` : ""}`;

    try {
      const response: AxiosResponse<Merchant> = await axios.post(url, merchant, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error saving or updating merchant:", error);
      throw error;
    }
  }

  /**
   * FIXED: Added the missing deleteMerchant method
   */
  static async deleteMerchant(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.BASE_URL}/merchant/${id}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("Error deleting merchant:", error);
      throw error;
    }
  }

  /**
   * Fetches merchants with pagination support.
   */
  static async fetchMerchantPageWise(
    page: number = 1,
    size: number = 10
  ): Promise<PaginatedResponse<Merchant>> {
    try {
      const response: AxiosResponse<PaginatedResponse<Merchant>> = await axios.get(
        `${this.BASE_URL}/merchantPageWise`,
        {
          params: {
            page: page - 1,
            size,
            sort: "id,desc",
          },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching merchants page-wise:", error);
      throw error;
    }
  }

  static async searchMerchant(name: string): Promise<Merchant[]> {
    try {
      const response: AxiosResponse<Merchant[]> = await axios.get(
        `${this.BASE_URL}/merchant/search`,
        {
          params: { name },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching merchants:", error);
      throw error;
    }
  }

  static async saveUser(
    userData: MerchantUser,
    id: string | number | null = null,
    businessID: string | number | null = null,
    merchantID: string | number | null = null
  ): Promise<any> {
    const params: { id?: string | number; businessID?: string | number; merchantID?: string | number } = {};
    if (id) params.id = id;
    if (businessID) params.businessID = businessID;
    if (merchantID) params.merchantID = merchantID;

    try {
      const response = await axios.post(`${this.BASE_URL}/merchant/user`, userData, {
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "application/json",
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving merchant user:", error);
      throw error;
    }
  }
}

export default MerchantService;