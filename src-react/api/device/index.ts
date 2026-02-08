import { withId } from '../shared';
import { tdel, tfile, tget, tpost, tput, tupload } from '../typed';
import type {
  ApiNormalizedListResult,
  ApiNormalizedResult,
  ApiParams,
  Device,
  DeviceCategory,
  DeviceChannel,
  DeviceInstance,
  Product,
} from '../types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, params: Query) => tget<ApiNormalizedResult<T>>(url, params);
const create = (url: string, data: Query | FormData) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query | FormData) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

/** 设备与物模型相关 API（React） */
export default {
  common: {
    singleImg: (data: FormData) => {
      data.append('source', '0');
      return create('/common/singleImg', data);
    },
  },

  getList: (params?: Query) => list<Device>('/device/list', params),
  detail: (id: number) => detail<Device>('/device/detail', withId(id)),
  add: (data: Query) => create('/device/add', data),
  edit: (data: Query) => update('/device/edit', data),
  del: (params: Query) => remove('/device/delete', params),
  status: (params: Query) => create('/device/status', params),
  import: (data: FormData) => create('/device/import', data),
  export: (params?: Query) => tget<ApiNormalizedResult<AnyRecord>>('/device/export', params),

  channel: {
    getList: (params?: Query) => list<DeviceChannel>('/device/channel/list', params),
    add: (data: Query) => create('/device/channel/add', data),
    edit: (data: Query) => update('/device/channel/edit', data),
    del: (params: Query) => remove('/device/channel/delete', params),
  },

  product: {
    pageList: (params?: Query) => list<Product>('/product/page_list', params),
    getList: (params?: Query) => list<Product>('/product/list', params),
    detail: (productKeyOrId: string | number) => {
      if (typeof productKeyOrId === 'string') {
        return detail<Product>('/product/detail', { productKey: productKeyOrId });
      }
      return detail<Product>('/product/detail', withId(productKeyOrId));
    },
    add: (data: Query) => create('/product/add', data),
    edit: (data: Query) => update('/product/edit', data),
    del: (params: Query) => remove('/product/delete', params),
    deleteByKeys: (keys: string[]) => remove('/product/del', { keys }),
    deploy: (productKey: string) => create('/product/deploy', { productKey }),
    undeploy: (productKey: string) => create('/product/undeploy', { productKey }),
    connectIntro: (productKey: string) => detail<AnyRecord>('/product/connect_intro', { productKey }),
    importModel: (data: FormData) => tupload<ActionResult>('/product/tsl/import', data),
    exportModel: (params: Query) => tfile<Blob>('/product/tsl/export', params),
    propertySet: (data: Query) => create('/product/property/set', data),
    getPropertyAll: (params: Query) => list<AnyRecord>('/product/tsl/property/all', params),
    getDataType: (params?: Query) => tget<ApiNormalizedResult<AnyRecord>>('/product/tsl/data_type', params),
  },

  category: {
    getList: (params?: Query) => list<DeviceCategory>('/product/category/list', params),
    add: (data: Query) => create('/product/category/add', data),
    edit: (data: Query) => update('/product/category/edit', data),
    del: (id: number) => remove('/product/category/del', withId(id)),
  },

  instance: {
    getList: (params?: Query) => list<DeviceInstance>('/product/device/page_list', params),
    add: (data: Query) => create('/product/device/add', data),
    edit: (data: Query) => update('/product/device/edit', data),
    del: (keys: string[]) => remove('/product/device/del', { keys }),
    detail: (deviceKey: string) => detail<DeviceInstance>('/product/device/detail', { deviceKey }),
    getLogList: (params?: Query) => list<AnyRecord>('/product/log/search', params),
    getLogCategory: (params?: Query) => list<AnyRecord>('/product/log/type', params),
    getRunStatus: (params?: Query) => tget<ApiNormalizedResult<AnyRecord>>('/product/device/run_status', params),
    getPropertyLog: (params?: Query) => list<AnyRecord>('/product/device/property/list', params),
    online: (data: Query) => create('/product/device/online', data),
    offline: (data: Query) => create('/product/device/offline', data),
    deploy: (deviceKey: string) => create('/product/device/deploy', { deviceKey }),
    undeploy: (deviceKey: string) => create('/product/device/undeploy', { deviceKey }),
  },

  model: {
    property: (params: Query) => list<AnyRecord>('/product/tsl/property/list', params),
    propertyAdd: (data: Query) => create('/product/tsl/property/add', data),
    propertyEdit: (data: Query) => update('/product/tsl/property/edit', data),
    propertyDel: (productKey: string, key: string) => remove('/product/tsl/property/del', { productKey, key }),

    function: (params: Query) => list<AnyRecord>('/product/tsl/function/list', params),
    functionAdd: (data: Query) => create('/product/tsl/function/add', data),
    functionEdit: (data: Query) => update('/product/tsl/function/edit', data),
    functionDel: (productKey: string, key: string) => remove('/product/tsl/function/del', { productKey, key }),

    event: (params: Query) => list<AnyRecord>('/product/tsl/event/list', params),
    eventAdd: (data: Query) => create('/product/tsl/event/add', data),
    eventEdit: (data: Query) => update('/product/tsl/event/edit', data),
    eventDel: (productKey: string, key: string) => remove('/product/tsl/event/del', { productKey, key }),

    tag: (params: Query) => list<AnyRecord>('/product/tsl/tag/list', params),
    tagAdd: (data: Query) => create('/product/tsl/tag/add', data),
    tagEdit: (data: Query) => update('/product/tsl/tag/edit', data),
    tagDel: (productKey: string, key: string) => remove('/product/tsl/tag/del', { productKey, key }),
  },

  tabDeviceFunction: {
    getList: (params: Query) => list<AnyRecord>('/product/tsl/function/all', params),
    do: (data: Query) => create('/product/function/do', data),
  },

  dev_asset: {
    getList: (params?: Query) => list<AnyRecord>('/product/dev_asset/list', params),
    add: (params: Query) => create('/product/dev_asset/add', params),
    edit: (params: Query) => update('/product/dev_asset/edit', params),
    detail: (params: Query) => detail<AnyRecord>('/product/dev_asset/get', params),
    delete: (params: Query) => remove('/product/dev_asset/delete', params),
  },

  dev_asset_metadata: {
    getList: (params?: Query) => list<AnyRecord>('/product/dev_asset_metadata/list', params),
    add: (params: Query) => create('/product/dev_asset_metadata/add', params),
    edit: (params: Query) => update('/product/dev_asset_metadata/edit', params),
    detail: (params: Query) => detail<AnyRecord>('/product/dev_asset_metadata/key', params),
    delete: (params: Query) => remove('/product/dev_asset_metadata/delete', params),
  },
};
