import axios from "axios";

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface IApiResponse {
  [key: string]: string;
}

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/`,
});

export { apiClient };
