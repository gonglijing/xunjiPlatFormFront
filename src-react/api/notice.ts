import { withId, withIds } from './shared';
import { tdel, tget, tpost, tput } from './typed';
import type {
  ApiNormalizedListResult,
  ApiNormalizedResult,
  ApiParams,
  NoticeConfig,
  NoticeLog,
  NoticeTemplate,
} from './types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number, key = 'id') => tget<ApiNormalizedResult<T>>(url, withId(id, key));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

/** 通知配置 */
const config = {
  getList: (params?: Query) => list<NoticeConfig>('/notice/config/list', params),
  getAll: () => tget<ApiNormalizedResult<NoticeConfig[]>>('/notice/config/getAll'),
  add: (data: Query) => create('/notice/config/add', data),
  edit: (data: Query) => update('/notice/config/edit', data),
  del: (id: number | number[]) => remove('/notice/config/delete', withIds(id)),
  delete: (id: number | number[]) => remove('/notice/config/delete', withIds(id)),
  detail: (id: number) => detail<NoticeConfig>('/notice/config/get', id),
  changeStatus: (data: Query) => create('/notice/config/changeStatus', data),
  test: (data: Query) => create('/notice/config/test', data),
};

/** 通知模板 */
const template = {
  getList: (params?: Query) => list<NoticeTemplate>('/notice/template/list', params),
  add: (data: Query) => create('/notice/template/add', data),
  edit: (data: Query) => update('/notice/template/edit', data),
  del: (id: number | number[]) => remove('/notice/template/delete', withIds(id)),
  delete: (id: number | number[]) => remove('/notice/template/delete', withIds(id)),
  save: (data: Query) => create('/notice/template/save', data),
  detail: (id: number) => detail<NoticeTemplate>('/notice/template/get', id),
  configIddetail: (configId: number) => tget<ApiNormalizedResult<NoticeTemplate>>('/notice/template/getbyconfig', { configId }),
};

/** 通知日志 */
const log = {
  getList: (params?: Query) => list<NoticeLog>('/notice/log/search', params),
  detail: (id: number) => detail<NoticeLog>('/notice/log/detail', id),
  resend: (id: number) => create('/notice/log/resend', withId(id)),
  del: (id: number | number[]) => remove('/notice/log/del', withIds(id)),
  delete: (id: number | number[]) => remove('/notice/log/del', withIds(id)),
};

export default {
  config,
  template,
  log,
  notice: {
    config,
    template,
    log,
  },
};
