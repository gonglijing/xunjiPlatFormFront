// 设备 API 接口
import { get, post, put, del, file, upload } from '../../utils/request';

export default {
  common: {
    singleImg: (data: FormData) => {
      data.append('source', '0');
      return post('/common/singleImg', data);
    },
  },

  // 设备列表
  getList: (params?: object) => get('/device/list', params),
  
  // 设备详情
  detail: (id: number) => get('/device/detail', { id }),
  
  // 添加设备
  add: (data: object) => post('/device/add', data),
  
  // 编辑设备
  edit: (data: object) => put('/device/edit', data),
  
  // 删除设备
  del: (params: object) => del('/device/delete', params),
  
  // 设备状态
  status: (params: object) => post('/device/status', params),
  
  // 批量导入
  import: (data: FormData) => post('/device/import', data),
  
  // 导出设备
  export: (params?: object) => get('/device/export', params),
  
  // Modbus 通道
  channel: {
    getList: (params?: object) => get('/device/channel/list', params),
    add: (data: object) => post('/device/channel/add', data),
    edit: (data: object) => put('/device/channel/edit', data),
    del: (params: object) => del('/device/channel/delete', params),
  },
  
  // 产品相关
  product: {
    pageList: (params?: object) => get('/product/page_list', params),
    getList: (params?: object) => get('/product/list', params),
    detail: (productKeyOrId: string | number) => {
      if (typeof productKeyOrId === 'string') {
        return get('/product/detail', { productKey: productKeyOrId });
      }
      return get('/product/detail', { id: productKeyOrId });
    },
    add: (data: object) => post('/product/add', data),
    edit: (data: object) => put('/product/edit', data),
    del: (params: object) => del('/product/delete', params),
    deleteByKeys: (keys: string[]) => del('/product/del', { keys }),
    deploy: (productKey: string) => post('/product/deploy', { productKey }),
    undeploy: (productKey: string) => post('/product/undeploy', { productKey }),
    connectIntro: (productKey: string) => get('/product/connect_intro', { productKey }),
    importModel: (data: FormData) => upload('/product/tsl/import', data),
    exportModel: (params: object) => file('/product/tsl/export', params),
    propertySet: (data: object) => post('/product/property/set', data),
    getPropertyAll: (params: object) => get('/product/tsl/property/all', params),
    getDataType: (params?: object) => get('/product/tsl/data_type', params),
  },

  category: {
    getList: (params?: object) => get('/product/category/list', params),
    add: (data: object) => post('/product/category/add', data),
    edit: (data: object) => put('/product/category/edit', data),
    del: (id: number) => del('/product/category/del', { id }),
  },

  instance: {
    getList: (params?: object) => get('/product/device/page_list', params),
    add: (data: object) => post('/product/device/add', data),
    edit: (data: object) => put('/product/device/edit', data),
    del: (keys: string[]) => del('/product/device/del', { keys }),
    detail: (deviceKey: string) => get('/product/device/detail', { deviceKey }),
    getLogList: (params?: object) => get('/product/log/search', params),
    getLogCategory: (params?: object) => get('/product/log/type', params),
    getRunStatus: (params?: object) => get('/product/device/run_status', params),
    getPropertyLog: (params?: object) => get('/product/device/property/list', params),
    online: (data: object) => post('/product/device/online', data),
    offline: (data: object) => post('/product/device/offline', data),
    deploy: (deviceKey: string) => post('/product/device/deploy', { deviceKey }),
    undeploy: (deviceKey: string) => post('/product/device/undeploy', { deviceKey }),
  },

  model: {
    property: (params: object) => get('/product/tsl/property/list', params),
    propertyAdd: (data: object) => post('/product/tsl/property/add', data),
    propertyEdit: (data: object) => put('/product/tsl/property/edit', data),
    propertyDel: (productKey: string, key: string) => del('/product/tsl/property/del', { productKey, key }),

    function: (params: object) => get('/product/tsl/function/list', params),
    functionAdd: (data: object) => post('/product/tsl/function/add', data),
    functionEdit: (data: object) => put('/product/tsl/function/edit', data),
    functionDel: (productKey: string, key: string) => del('/product/tsl/function/del', { productKey, key }),

    event: (params: object) => get('/product/tsl/event/list', params),
    eventAdd: (data: object) => post('/product/tsl/event/add', data),
    eventEdit: (data: object) => put('/product/tsl/event/edit', data),
    eventDel: (productKey: string, key: string) => del('/product/tsl/event/del', { productKey, key }),

    tag: (params: object) => get('/product/tsl/tag/list', params),
    tagAdd: (data: object) => post('/product/tsl/tag/add', data),
    tagEdit: (data: object) => put('/product/tsl/tag/edit', data),
    tagDel: (productKey: string, key: string) => del('/product/tsl/tag/del', { productKey, key }),
  },

  tabDeviceFunction: {
    getList: (params: object) => get('/product/tsl/function/all', params),
    do: (data: object) => post('/product/function/do', data),
  },
};
