import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

/** --- 1. Type Aliases --- **/

type ID = string | number | null;

/** --- 2. Interfaces --- **/

export interface Customer {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  birthdate: string | Date;
  region?: string;
  country?: any;
}

// Interface for the payload sent during updates which might include IDs
interface CustomerPayload extends Partial<Customer> {
  countryID?: ID;
  regionID?: ID;
}

/** --- 3. Service Class --- **/

class CustomerService {
  private static BASE_URL = "http://localhost:8080/api";

  // Helper to get headers with proper Axios typing
  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  static async createCustomer(
    customer: Customer, 
    countryID: ID = null, 
    regionID: ID = null
  ): Promise<AxiosResponse<any>> {
    console.log("customer:", customer);
    console.log("customer countryID:", countryID);
    console.log("customer regionID:", regionID);

    const params: { countryID?: string | number; regionID?: string | number } = {};
    if (countryID) params.countryID = countryID;
    if (regionID) params.regionID = regionID;

    try {
      const response = await axios.post(`${this.BASE_URL}/customers`, customer, {
        headers: this.getAuthHeaders(),
        params
      });

      console.log('Customer created successfully:', response.data);
      return response;
    } catch (error: any) {
      this.handleError(error, 'creating');
      throw error;
    }
  }

  static async updateCustomer(
    id: string | number, 
    customer: Customer, 
    countryID: ID, 
    regionID: ID
  ): Promise<AxiosResponse<any>> {
    console.log("customer:", customer);
    console.log("customer countryID:", countryID);
    console.log("customer regionID:", regionID);

    const payload: CustomerPayload = { ...customer };
    if (countryID) payload.countryID = countryID;
    if (regionID) payload.regionID = regionID;

    const url = `${this.BASE_URL}/customers/${id}`;

    try {
      const response = await axios.put(url, payload, {
        headers: this.getAuthHeaders()
      });

      console.log('Customer updated successfully:', response.data);
      return response;
    } catch (error: any) {
      this.handleError(error, 'updating');
      throw error;
    }
  }

  // Centralized error handling
  private static handleError(error: any, action: string) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request: Check your token and permissions');
      alert('Unauthorized access. Please login again.');
    } else {
      console.error(`Error ${action} customer:`, error.response ? error.response.data : error.message);
    }
  }
}

export default CustomerService;