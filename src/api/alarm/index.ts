import { get, post, del, put } from '/@/utils/request';
import type { ApiPageResult, ApiParams, ApiPagedQuery } from '/@/api/types/http';

type AlarmRule = ApiParams;
type AlarmLog = ApiParams;

export default {
  common: {
    trigger_type: (productKey: string) => get<ApiParams[]>('/alarm/rule/trigger_type', { productKey }),
    trigger_param: (productKey: string) => get<ApiParams[]>('/alarm/rule/trigger_param', { productKey }),
    trigger_params: (params: ApiParams) => get<ApiParams[]>('/alarm/rule/trigger_param', params),
    operator: (productKey?: string) => get<ApiParams[]>('/alarm/rule/operator', { productKey }),
    getList: (params: ApiPagedQuery) => get<ApiPageResult<AlarmRule>>('/alarm/rule/list', params),
    add: (data: ApiParams) => post('/alarm/rule/add', data),
    delete: (id: number) => del('/alarm/rule/del', { id }),
    edit: (data: ApiParams) => put('/alarm/rule/edit', data),
    detail: (id: number) => get<AlarmRule>('/alarm/rule/detail', { id }),
    deploy: (data: ApiParams) => post('/alarm/rule/deploy', data),
    undeploy: (data: ApiParams) => post('/alarm/rule/undeploy', data),
    level_edit: (data: ApiParams) => put('/alarm/level/edit', data),
    level_all: (productKey: string) => get<ApiParams[]>('/alarm/level/all', { productKey }),
  },
  log: {
    getList: (params: ApiPagedQuery) => get<ApiPageResult<AlarmLog>>('/alarm/log/list', params),
    detail: (id: number) => get<AlarmLog>('/alarm/log/detail', { id }),
    handle: (data: ApiParams) => post('/alarm/log/handle', data),
  },
}
