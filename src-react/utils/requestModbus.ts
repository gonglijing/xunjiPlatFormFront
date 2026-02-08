import { AxiosError } from 'axios';
import { message } from 'antd';
import getOrigin from './origin';
import { createHttpClient, createRequestMethods } from './httpClient';

const service = createHttpClient({
  baseURL: getOrigin(import.meta.env.VITE_MODBUS_API || '/modbus'),
  onResponseError: (error: AxiosError<{ message?: string }>) => {
    message.error(error?.response?.data?.message || error?.message || '请求失败');
  },
});

const methods = createRequestMethods(service);

export const { get, post } = methods;

export default service;
