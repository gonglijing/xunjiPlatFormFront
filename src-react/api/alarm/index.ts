import { withId } from '../shared';
import { tdel, tget, tpost, tput } from '../typed';
import type {
  AlarmLevel,
  AlarmLog,
  AlarmRule,
  ApiNormalizedListResult,
  ApiNormalizedResult,
  ApiParams,
} from '../types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number, key = 'id') => tget<ApiNormalizedResult<T>>(url, withId(id, key));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

const rule = {
  getList: (params?: Query) => list<AlarmRule>('/alarm/rule/list', params),
  add: (data: Query) => create('/alarm/rule/add', data),
  edit: (data: Query) => update('/alarm/rule/edit', data),
  del: (params: Query) => remove('/alarm/rule/delete', params),
};

const log = {
  getList: (params?: Query) => list<AlarmLog>('/alarm/log/list', params),
  detail: (id: number) => detail<AlarmLog>('/alarm/log/detail', id),
  handle: (data: Query) => create('/alarm/log/handle', data),
};

/** 告警相关接口（规则/日志/通用能力） */
export default {
  getList: (params?: Query) => list<AlarmRule>('/alarm/list', params),
  detail: (id: number) => detail<AlarmRule>('/alarm/detail', id),
  handle: (data: Query) => create('/alarm/handle', data),

  rule,
  log,
  common: {
    getList: rule.getList,
    add: rule.add,
    edit: rule.edit,
    delete: (id: number) => remove('/alarm/rule/del', withId(id)),
    detail: (id: number) => detail<AlarmRule>('/alarm/rule/detail', id),
    deploy: (data: Query) => create('/alarm/rule/deploy', data),
    undeploy: (data: Query) => create('/alarm/rule/undeploy', data),
    level_all: (productKey: string) => tget<ApiNormalizedResult<AlarmLevel[]>>('/alarm/level/all', { productKey }),
    trigger_type: (productKey: string) => tget<ApiNormalizedResult<AnyRecord>>('/alarm/rule/trigger_type', { productKey }),
    trigger_params: (params: Query) => tget<ApiNormalizedResult<AnyRecord>>('/alarm/rule/trigger_param', params),
    operator: (productKey?: string) => tget<ApiNormalizedResult<string[]>>('/alarm/rule/operator', { productKey }),
  },
};
