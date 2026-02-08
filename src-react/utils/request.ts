// API 请求封装
import { AxiosError } from 'axios';
import { message } from 'antd';
import { clearAuthStorage, createHttpClient, createRequestMethods } from './httpClient';

type NormalizedListPayload = {
  Total?: number;
  Data?: unknown[];
  currentPage?: number;
  Info?: unknown;
  [key: string]: unknown;
};

function normalizeResponseData(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const data = payload as NormalizedListPayload;

  if (data.Total !== undefined) {
    return {
      ...data,
      list: data.Data || [],
      total: data.Total || 0,
      page: data.currentPage,
    };
  }

  if (data.Info !== undefined && data.Data !== undefined) {
    return data;
  }

  if (data.Data !== undefined) {
    return data.Data;
  }

  return data;
}

// 创建 axios 实例
const service = createHttpClient({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  normalizePayload: normalizeResponseData,
  onResponseError: (error: AxiosError<{ msg?: string; message?: string }>) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          clearAuthStorage();
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        default:
          message.error(data?.msg || data?.message || '服务器错误');
      }
      return;
    }
    message.error('网络错误');
  },
});

export default service;

const methods = createRequestMethods(service);

export const { get, post, put, del, file, upload } = methods;
