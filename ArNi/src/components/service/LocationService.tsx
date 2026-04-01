import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

/** --- 1. Interfaces --- **/

export interface Country {
  id?: string | number;
  name: string;
  callingCode?: string;
  creationTime?: string;
}

export interface Region {
  id?: string | number;
  state: string;
  city: string;
  zone: string;
  country?: Country;
  creationTime?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** --- 2. Service Class --- **/

class LocationService {
  private static BASE_URL = "http://localhost:8080/api";

  /**
   * Helper to retrieve authorization headers with proper Axios typing.
   */
  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  static async saveCountry(country: Country, id: string | number | null = null): Promise<Country> {
    const url = id ? `${this.BASE_URL}/location/country?id=${id}` : `${this.BASE_URL}/location/country`;
    try {
      const response: AxiosResponse<Country> = await axios.post(url, country, { 
        headers: this.getAuthHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error("Error saving country:", error);
      throw error;
    }
  }

  static async saveRegion(
    region: Region, 
    id: string | number | null = null, 
    countryID: string | number | null = null
  ): Promise<Region> {
    const params: { id?: string | number; countryID?: string | number } = {};
    if (id) params.id = id;
    if (countryID) params.countryID = countryID;

    try {
      const response: AxiosResponse<Region> = await axios.post(`${this.BASE_URL}/location/region`, region, {
        headers: this.getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error("Error saving region:", error);
      throw error;
    }
  }

  static async fetchCountries(page: number, size: number): Promise<PaginatedResponse<Country>> {
    try {
      const response: AxiosResponse<PaginatedResponse<Country>> = await axios.get(
        `${this.BASE_URL}/location/countryPageWise`, 
        {
          headers: this.getAuthHeaders(),
          params: { page, size }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  }

  static async fetchRegions(
    page: number = 1, 
    size: number = 10, 
    name: string | null = null, 
    startDate: string | null = null, 
    endDate: string | null = null
  ): Promise<PaginatedResponse<Region>> {
    const params = { 
      page: page - 1, // API usually expects 0-based index
      size, 
      name, 
      startDate, 
      endDate,
      sort: "id,desc"
    };

    try {
      const response: AxiosResponse<PaginatedResponse<Region>> = await axios.get(
        `${this.BASE_URL}/location/regionPageWise`, 
        {
          headers: this.getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  }

  static async searchCountries(name: string = ''): Promise<AxiosResponse<Country[]>> {
    console.log("Searching for country with name: " + name);
    try {
      const response: AxiosResponse<Country[]> = await axios.get(`${this.BASE_URL}/country/search`, {
        headers: this.getAuthHeaders(),
        params: { name }
      });
      return response;
    } catch (error) {
      console.error("Error searching countries:", error);
      throw error;
    }
  }

  static async searchRegion(city: string): Promise<AxiosResponse<Region[]>> {
    console.log("Searching for regions with name: " + city);
    try {
      const response: AxiosResponse<Region[]> = await axios.get(`${this.BASE_URL}/location/search`, {
        headers: this.getAuthHeaders(),
        params: { city }
      });
      return response;
    } catch (error) {
      console.error("Error searching regions:", error);
      throw error;
    }
  }

  static async mockLiveLocation(latitude: number, longitude: number): Promise<any> {
    try {
      const response = await axios.get(`${this.BASE_URL}/location/mock-live-location`, {
        headers: this.getAuthHeaders(),
        params: { latitude, longitude }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching mock live location:", error);
      throw error;
    }
  }
}

export default LocationService;