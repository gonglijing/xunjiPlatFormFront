import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

type ApiResponse = {
  code?: number;
  msg?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
};

type HttpErrorHandler = (error: AxiosError<ApiResponse>) => void;

type CreateHttpClientOptions = {
  baseURL: string;
  timeout?: number;
  normalizePayload?: (payload: unknown) => unknown;
  flattenObjectPayload?: boolean;
  onResponseError?: HttpErrorHandler;
};

const DEFAULT_TIMEOUT = 30000;

function getAuthToken() {
  return localStorage.getItem('xunji_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getErrorMessage(payload?: ApiResponse) {
  if (!payload) {
    return '请求失败';
  }
  return String(payload.msg || payload.message || '请求失败');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function clearAuthStorage() {
  localStorage.removeItem('xunji_token');
  localStorage.removeItem('token');
  localStorage.removeItem('xunji_user_info');
  sessionStorage.removeItem('token');
}

export function createHttpClient({
  baseURL,
  timeout = DEFAULT_TIMEOUT,
  normalizePayload,
  flattenObjectPayload = true,
  onResponseError,
}: CreateHttpClientOptions): AxiosInstance {
  const service = axios.create({
    baseURL,
    timeout,
  });

  service.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const envelope = response.data;

      if (!isRecord(envelope) || envelope.code === undefined) {
        return envelope;
      }

      if (envelope.code === 200 || envelope.code === 0) {
        const normalizedData = normalizePayload ? normalizePayload(envelope.data) : envelope.data;
        const normalizedResponse: ApiResponse = {
          ...envelope,
          data: normalizedData,
        };
        if (flattenObjectPayload && isRecord(normalizedData)) {
          return {
            ...normalizedResponse,
            ...normalizedData,
          };
        }
        return normalizedResponse;
      }

      const errMessage = getErrorMessage(envelope);
      message.error(errMessage);
      return Promise.reject(new Error(errMessage));
    },
    (error: AxiosError<ApiResponse>) => {
      if (onResponseError) {
        onResponseError(error);
      } else {
        const errMessage = getErrorMessage(error.response?.data) || error.message || '请求失败';
        message.error(errMessage);
      }
      return Promise.reject(error);
    }
  );

  return service;
}

export type RequestMethods = {
  get: <T = unknown>(url: string, params?: object) => Promise<T>;
  post: <T = unknown>(url: string, data?: object) => Promise<T>;
  put: <T = unknown>(url: string, data?: object) => Promise<T>;
  del: <T = unknown>(url: string, params?: object) => Promise<T>;
  file: <T = unknown>(url: string, params?: object, method?: 'get' | 'post') => Promise<T>;
  upload: <T = unknown>(url: string, formData: FormData) => Promise<T>;
};

export function createRequestMethods(service: AxiosInstance): RequestMethods {
  return {
    get: <T = unknown>(url: string, params?: object) => service.get(url, { params }) as Promise<T>,
    post: <T = unknown>(url: string, data?: object) => service.post(url, data) as Promise<T>,
    put: <T = unknown>(url: string, data?: object) => service.put(url, data) as Promise<T>,
    del: <T = unknown>(url: string, params?: object) => service.delete(url, { params }) as Promise<T>,
    file: <T = unknown>(url: string, params?: object, method: 'get' | 'post' = 'get') => {
      const config: AxiosRequestConfig = { responseType: 'blob' };
      if (method === 'post') {
        return service.post(url, params, config) as Promise<T>;
      }
      return service.get(url, { ...config, params }) as Promise<T>;
    },
    upload: <T = unknown>(url: string, formData: FormData) =>
      service.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }) as Promise<T>,
  };
}
