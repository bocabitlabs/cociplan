import axios from "axios";

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface IApiResponse {
  [key: string]: string;
}

const getAxiosOptionsWithAuth = () => ({
  headers: {
    Accept: "application/json",
  },
});

export const getAxiosHeadersWithAuth = () => ({
  Accept: "application/json",
});
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/`,
});

export { apiClient, getAxiosOptionsWithAuth };
