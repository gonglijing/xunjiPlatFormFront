import { withId } from './shared';
import { tdel, tget, tpost, tput } from './typed';
import type {
  AlarmLog,
  AnalysisPoint,
  ApiNormalizedListResult,
  ApiNormalizedResult,
  ApiParams,
  DatahubApi,
  DatahubTopic,
} from './types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number, key = 'id') => tget<ApiNormalizedResult<T>>(url, withId(id, key));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

/** 数据中台 API 与 IoT 看板接口 */
export default {
  api: {
    getList: (params?: Query) => list<DatahubApi>('/datahub/api/list', params),
    add: (data: Query) => create('/datahub/api/add', data),
    edit: (data: Query) => update('/datahub/api/edit', data),
    del: (id: number) => remove('/datahub/api/delete', withId(id)),
    detail: (id: number) => detail<DatahubApi>('/datahub/api/detail', id),
  },
  topic: {
    getList: (params?: Query) => list<DatahubTopic>('/datahub/topic/list', params),
    add: (data: Query) => create('/datahub/topic/add', data),
    edit: (data: Query) => update('/datahub/topic/edit', data),
    del: (id: number) => remove('/datahub/topic/delete', withId(id)),
    detail: (id: number) => detail<DatahubTopic>('/datahub/topic/detail', id),
  },
  iotManage: {
    getOverviewData: () => tget<ApiNormalizedResult<AnyRecord>>('/thing/overview'),
    getAlarmList: (params?: Query) => list<AlarmLog>('/alarm/log/list', params),
    getAlarmDetail: (id: number) => detail<AlarmLog>('/alarm/log/detail', id),
    getAlarmHandle: (data: Query) => create('/alarm/log/handle', data),
    deviceDataTotalCount: (dateType: 'year' | 'month' | 'day') => tget<ApiNormalizedResult<AnalysisPoint[]>>('/analysis/deviceDataTotalCount', { dateType }),
    deviceOnlineOfflineCount: () => tget<ApiNormalizedResult<AnyRecord>>('/analysis/deviceOnlineOfflineCount'),
    deviceDataCount: (dateType: 'year' | 'month') => tget<ApiNormalizedResult<AnalysisPoint[]>>('/analysis/deviceDataCount', { dateType }),
    deviceAlertCountByYearMonth: (year?: string) => tget<ApiNormalizedResult<AnalysisPoint[]>>('/analysis/deviceAlertCountByYearMonth', { year }),
    deviceAlarmLevelCount: (dateType: 'year' | 'month' | 'day', date: string) =>
      tget<ApiNormalizedResult<AnalysisPoint[]>>('/analysis/deviceAlarmLevelCount', { dateType, date }),
    productCount: () => tget<ApiNormalizedResult<AnyRecord>>('/analysis/productCount'),
  },
};
