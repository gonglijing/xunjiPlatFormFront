export type ApiParams = Record<string, unknown>;

export interface ApiPageResult<T = ApiParams> {
	list: T[];
	total: number;
	page: number;
	[key: string]: unknown;
}

export interface ApiPagedQuery extends ApiParams {
	pageNum?: number;
	pageSize?: number;
	keyWord?: string;
}
