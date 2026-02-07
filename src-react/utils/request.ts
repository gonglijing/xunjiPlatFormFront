// API 请求封装
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

function normalizeResponseData(payload: any) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  if (payload.Total !== undefined) {
    return {
      ...payload,
      list: payload.Data || [],
      total: payload.Total || 0,
      page: payload.currentPage,
    };
  }

  if (payload.Info !== undefined && payload.Data !== undefined) {
    return payload;
  }

  if (payload.Data !== undefined) {
    return payload.Data;
  }

  return payload;
}

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('xunji_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    if (res?.code === undefined) {
      return res;
    }

    if (res.code === 200 || res.code === 0) {
      const normalizedData = normalizeResponseData(res.data);
      return {
        ...res,
        ...(normalizedData && typeof normalizedData === 'object' ? normalizedData : {}),
        data: normalizedData,
      };
    }
    message.error(res.msg || res.message || '请求失败');
    return Promise.reject(new Error(res.msg || res.message || '请求失败'));
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem('xunji_token');
          localStorage.removeItem('token');
          localStorage.removeItem('xunji_user_info');
          sessionStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        default:
          message.error(data?.msg || '服务器错误');
      }
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export default service;

// GET 请求
export const get = <T = any>(url: string, params?: object): Promise<T> => {
  return service.get(url, { params }) as Promise<T>;
};

// POST 请求
export const post = <T = any>(url: string, data?: object): Promise<T> => {
  return service.post(url, data) as Promise<T>;
};

// PUT 请求
export const put = <T = any>(url: string, data?: object): Promise<T> => {
  return service.put(url, data) as Promise<T>;
};

// DELETE 请求
export const del = <T = any>(url: string, params?: object): Promise<T> => {
  return service.delete(url, { params }) as Promise<T>;
};

// 文件上传
export const upload = <T = any>(url: string, formData: FormData): Promise<T> => {
  return service.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<T>;
};
