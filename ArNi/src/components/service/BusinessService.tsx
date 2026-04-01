import axios, { AxiosResponse, RawAxiosRequestHeaders } from "axios";

/** --- 1. Interfaces --- **/

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

/** --- 2. Service Class --- **/

class BusinessService {
  private static BASE_URL = `${window.config.API_BASE_URL}/api`;

  // FIX: Use RawAxiosRequestHeaders instead of a custom interface
  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  static async fetchBusinesses(): Promise<Business[]> {
    try {
      const response: AxiosResponse<Business[]> = await axios.get(
        `${this.BASE_URL}/businesses`, 
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw error;
    }
  }

  static async saveBusiness(business: Business): Promise<Business> {
    try {
      const response: AxiosResponse<Business> = await axios.post(
        `${this.BASE_URL}/business`, 
        business, 
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving business:", error);
      throw error;
    }
  }

  static async updateBusiness(business: Business): Promise<Business> {
    try {
      const response: AxiosResponse<Business> = await axios.put(
        `${this.BASE_URL}/business/${business.id}`, 
        business, 
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating business:", error);
      throw error;
    }
  }

  static async deleteBusiness(id: string | number): Promise<void> {
    try {
      await axios.delete(`${this.BASE_URL}/business/${id}`, { 
        headers: this.getAuthHeaders() 
      });
    } catch (error) {
      console.error("Error deleting business:", error);
      throw error;
    }
  }

  static async fetchCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/categories`, { 
        headers: this.getAuthHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async searchBusiness(name: string): Promise<Business[]> {
    try {
      const response: AxiosResponse<Business[]> = await axios.get(
        `${this.BASE_URL}/business/search`, 
        {
          params: { name },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching businesses:", error);
      throw error;
    }
  }

  static async searchBusinesses(
    name?: string, 
    fullName?: string, 
    category?: string, 
    startDate?: string | null, 
    endDate?: string | null, 
    page?: number, 
    size?: number
  ): Promise<any> {
    const params = { name, fullName, category, startDate, endDate, page, size };

    try {
      const response = await axios.get(`${this.BASE_URL}/businesses/search`, {
        headers: this.getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error("Error searching businesses with filters:", error);
      throw error;
    }
  }
}

export default BusinessService;