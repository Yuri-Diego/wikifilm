import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// URL base da API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Instância Axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função auxiliar para tratar erros HTTP
function handleAxiosError(error) {
  const status = error.response?.status;
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Erro desconhecido";

  throw new Error(`${status || "Erro"}: ${message}`);
}

// Função genérica para requisições HTTP 
export async function apiRequest(method, url, data) {
  try {
    const response = await api.request({
      method,
      url,
      data,
    });
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const getQueryFn =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const endpoint = queryKey.join("/");
      const response = await api.get(endpoint);

      return response.data;
    } catch (error) {
      const status = error.response?.status;

      if (unauthorizedBehavior === "returnNull" && status === 401) {
        return null;
      }

      handleAxiosError(error);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
