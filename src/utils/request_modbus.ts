import { AxiosRequestConfig } from 'axios';
import getOrigin from '/@/utils/origin';
import { createRequestClient } from '/@/utils/requestFactory';

const client = createRequestClient({
	baseURL: getOrigin(import.meta.env.VITE_MODBUS_API),
});

const { service } = client;

export default service;

export function get<T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<T> {
	return client.get<T>(url, params, config);
}

export function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
	return client.post<T>(url, data, config);
}

export function put<T = unknown>(url: string, data?: unknown): Promise<T> {
	return client.put<T>(url, data);
}
export function del<T = unknown>(url: string, data?: unknown): Promise<T> {
	return client.del<T>(url, data);
}


export function file<T = unknown>(url: string, params?: unknown, method: 'get' | 'post' = 'get'): Promise<T> {
	return client.file<T>(url, params, method);
}
