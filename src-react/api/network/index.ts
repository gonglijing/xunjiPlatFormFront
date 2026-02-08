import { withId } from '../shared';
import { tdel, tget, tpost, tput } from '../typed';
import type { ApiNormalizedListResult, ApiNormalizedResult, ApiParams, NetworkServer, NetworkTunnel } from '../types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number) => tget<ApiNormalizedResult<T>>(url, withId(id));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

/** 网络服务与隧道接口 */
export default {
  server: {
    getList: (params?: Query) => list<NetworkServer>('/network/server/list', params),
    add: (data: Query) => create('/network/server/add', data),
    edit: (data: Query) => update('/network/server/edit', data),
    del: (params: Query) => remove('/network/server/delete', params),
    detail: (id: number) => detail<NetworkServer>('/network/server/detail', id),
    status: (data: Query) => create('/network/server/status', data),
  },

  tunnel: {
    getList: (params?: Query) => list<NetworkTunnel>('/network/tunnel/list', params),
    add: (data: Query) => create('/network/tunnel/add', data),
    edit: (data: Query) => update('/network/tunnel/edit', data),
    del: (params: Query) => remove('/network/tunnel/delete', params),
    detail: (id: number) => detail<NetworkTunnel>('/network/tunnel/detail', id),
    status: (data: Query) => create('/network/tunnel/status', data),
  },
};
