import axios, { AxiosResponse, RawAxiosRequestHeaders } from "axios";

/** --- 1. Interfaces --- **/

export interface DocumentType {
  id: string | number;
  name: string;
  description?: string;
}

export interface DomainRisk {
  id: string | number;
  name: string;
  riskLevel?: string;
}

/** --- 2. Service Class --- **/

class DocumentTypeService {
  private static BASE_URL = `${window?.config?.API_BASE_URL}/api`;

  /**
   * Generates authorization headers for API requests.
   * Uses RawAxiosRequestHeaders to satisfy Axios type requirements.
   */
  private static getAuthHeaders(): RawAxiosRequestHeaders {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Searches for Document Types by name.
   */
  static async searchDocumentType(name: string): Promise<DocumentType[]> {
    console.log("Searching for DocumentType with name: " + name);

    try {
      const response: AxiosResponse<DocumentType[]> = await axios.get(
        `${this.BASE_URL}/documentType/search`,
        {
          params: { name },
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching document Type:", error);
      throw error;
    }
  }

  /**
   * Searches for Domain Risks by name.
   */
  static async searchDomainRisks(name: string): Promise<DomainRisk[]> {
    console.log("Searching for Domain Risks with name: " + name);

    try {
      const response: AxiosResponse<DomainRisk[]> = await axios.get(
        `${this.BASE_URL}/domainRisk/search`,
        {
          params: { name },
          headers: this.getAuthHeaders(),
        }
      );
      console.log("Data Domain Risk: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching domain Risk:", error);
      throw error;
    }
  }
}

export default DocumentTypeService;