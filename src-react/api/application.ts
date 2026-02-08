import { withId } from './shared';
import { tdel, tget, tpost, tput } from './typed';
import type { ApiNormalizedListResult, ApiNormalizedResult, ApiParams, AppInfo } from './types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = (url: string, params?: Query) => tget<ApiNormalizedListResult<AppInfo>>(url, params);
const detail = (id: number) => tget<ApiNormalizedResult<AppInfo>>('/application/detail', withId(id));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (id: number) => tdel<ActionResult>('/application/delete', withId(id));

/** 应用管理接口 */
export default {
  getList: (params?: Query) => list('/application/list', params),
  getAll: () => tget<ApiNormalizedResult<AppInfo[]>>('/application/getAll'),
  add: (data: Query) => create('/application/add', data),
  edit: (data: Query) => update('/application/edit', data),
  del: (id: number) => remove(id),
  detail,
  changeStatus: (data: Query) => create('/application/changeStatus', data),
};
