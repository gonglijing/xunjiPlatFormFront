// 设备 API 接口
import { get, post, put, del } from '../utils/request';

export default {
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
    getList: (params?: object) => get('/product/list', params),
    detail: (id: number) => get('/product/detail', { id }),
    add: (data: object) => post('/product/add', data),
    edit: (data: object) => put('/product/edit', data),
    del: (params: object) => del('/product/delete', params),
  },
};
