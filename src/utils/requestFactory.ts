import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

type UploadMethod = 'get' | 'post';

interface SuccessData {
	Data?: unknown;
	Total?: number;
	currentPage?: number;
	Info?: unknown;
	Report?: unknown;
	[key: string]: unknown;
}

interface StandardResponse {
	code?: number;
	message?: string;
	data?: SuccessData | unknown;
	[key: string]: unknown;
}

interface RequestFactoryOptions {
	baseURL: string;
	enableFast401Redirect?: boolean;
	supportReportField?: boolean;
}

function isObject(data: unknown): data is Record<string, unknown> {
	return data !== null && typeof data === 'object';
}

function redirectToLogin() {
	localStorage.clear();
	sessionStorage.clear();
	window.location.href = '/';
}

function handleUnauthorized(enableFast401Redirect: boolean) {
	if (enableFast401Redirect) {
		const comeTime = Number(sessionStorage.getItem('comeTime') || 0);
		if (comeTime > 0 && Date.now() - comeTime < 1000) {
			redirectToLogin();
			return;
		}
	}

	ElMessageBox.alert('登录状态已过期，请重新登录', '提示', {
		confirmButtonText: '确定',
		showCancelButton: false,
		closeOnHashChange: false,
		closeOnPressEscape: false,
		closeOnClickModal: false,
		showClose: false,
	})
		.then(() => {
			redirectToLogin();
		})
		.catch(() => {});
}

function parseSuccessData<T>(response: AxiosResponse, supportReportField: boolean): T {
	const res = (response.data || {}) as StandardResponse;
	const responseData = isObject(res.data) ? (res.data as SuccessData) : undefined;

	if (responseData?.Total !== undefined) {
		return {
			list: responseData.Data,
			total: responseData.Total,
			page: responseData.currentPage,
			...responseData,
		} as T;
	}

	if (responseData?.Info && responseData?.Data) {
		return responseData as T;
	}

	if (!responseData || responseData.Data === undefined) {
		return res.data as T;
	}

	if (supportReportField && responseData.Report !== undefined) {
		return responseData as T;
	}

	return responseData.Data as T;
}

function handleHttpError(error: AxiosError) {
	ElMessage.closeAll();
	const url = error.config?.url || 'unknown';
	const status = error.response?.status;

	if ((error.message || '').includes('timeout')) {
		ElMessage.error(`网络超时: ${url}`);
		return;
	}
	if (error.message === 'Network Error') {
		ElMessage.error(`网络连接错误: ${url}`);
		return;
	}

	const statusText = error.response?.statusText;
	if (status && statusText) {
		ElMessage.error(`${status} ${statusText}: ${url}`);
		return;
	}

	ElMessage.error(`接口路径找不到: ${url}`);
}

export function createRequestClient(options: RequestFactoryOptions) {
	const service = axios.create({
		baseURL: options.baseURL,
		timeout: 120000,
		headers: { 'Content-Type': 'application/json' },
	});

	service.interceptors.request.use(
		(config) => {
			const token = sessionStorage.getItem('token');
			if (token) {
				config.headers = {
					...(config.headers || {}),
					Authorization: `Bearer ${token}`,
				};
			}
			if (import.meta.env.DEV) {
				console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	service.interceptors.response.use(
		(response) => {
			const res = (response.data || {}) as StandardResponse;
			const code = res?.code;

			if (code === 401) {
				handleUnauthorized(Boolean(options.enableFast401Redirect));
				return Promise.reject(new Error('登录状态已过期，请重新登录'));
			}

			if (code === undefined && res?.message === undefined) {
				return response;
			}

			if (code !== 0) {
				ElMessage.closeAll();
				ElMessage.error(res?.message || '请求失败');
				return Promise.reject(new Error(res?.message || '请求失败'));
			}

			return parseSuccessData(response, Boolean(options.supportReportField));
		},
		(error: AxiosError) => {
			handleHttpError(error);
			return Promise.reject(error);
		}
	);

	const get = <T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		return service({
			url,
			method: 'get',
			...config,
			params,
		}) as Promise<T>;
	};

	const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		return service({
			url,
			method: 'post',
			...config,
			data,
		}) as Promise<T>;
	};

	const put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		return service({
			url,
			method: 'put',
			...config,
			data,
		}) as Promise<T>;
	};

	const del = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
		return service({
			url,
			method: 'delete',
			...config,
			data,
		}) as Promise<T>;
	};

	const file = <T = unknown>(url: string, params?: unknown, method: UploadMethod = 'get'): Promise<T> => {
		if (method === 'get') {
			return service({
				url,
				method,
				params,
				timeout: 120000,
				responseType: 'arraybuffer',
			}) as Promise<T>;
		}
		return service({
			url,
			method,
			timeout: 120000,
			data: params,
			responseType: 'blob',
		}) as Promise<T>;
	};

	return {
		service,
		get,
		post,
		put,
		del,
		file,
	};
}
