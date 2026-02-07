import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import getOrigin from './origin';

const service = axios.create({
  baseURL: getOrigin(import.meta.env.VITE_MODBUS_API || '/modbus'),
  timeout: 30000,
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem('xunji_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res?.code === 0 || res?.code === 200) {
      return {
        ...res,
        ...(res?.data && typeof res.data === 'object' ? res.data : {}),
      };
    }
    if (res?.code === undefined) {
      return res;
    }
    message.error(res?.msg || res?.message || '请求失败');
    return Promise.reject(new Error(res?.msg || res?.message || '请求失败'));
  },
  (error) => {
    message.error(error?.response?.data?.message || error?.message || '请求失败');
    return Promise.reject(error);
  }
);

export const get = <T = any>(url: string, params?: object): Promise<T> => service.get(url, { params }) as Promise<T>;
export const post = <T = any>(url: string, data?: object): Promise<T> => service.post(url, data) as Promise<T>;

export default service;

