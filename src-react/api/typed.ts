import { del, file, get, post, put, upload } from '../utils/request';

export const tget = <T>(url: string, params?: object) => get<T>(url, params);
export const tpost = <T>(url: string, data?: object | FormData) => post<T>(url, data as object);
export const tput = <T>(url: string, data?: object | FormData) => put<T>(url, data as object);
export const tdel = <T>(url: string, params?: object) => del<T>(url, params);
export const tfile = <T>(url: string, params?: object, method: 'get' | 'post' = 'get') => file<T>(url, params, method);
export const tupload = <T>(url: string, formData: FormData) => upload<T>(url, formData);
