import getOrigin from '/@/utils/origin';
import { createRequestClient } from '/@/utils/requestFactory';

const client = createRequestClient({
	baseURL: getOrigin(import.meta.env.VITE_API_URL),
	enableFast401Redirect: true,
	supportReportField: true,
});

const { service } = client;

export default service;

export function get<T = unknown>(url: string, params?: unknown): Promise<T> {
	return client.get<T>(url, params);
}

export function post<T = unknown>(url: string, data?: unknown): Promise<T> {
	return client.post<T>(url, data);
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
