// 网络 API 接口
import { get, post, put, del } from '../../utils/request';

export default {
  // 服务器
  server: {
    getList: (params?: object) => get('/network/server/list', params),
    add: (data: object) => post('/network/server/add', data),
    edit: (data: object) => put('/network/server/edit', data),
    del: (params: object) => del('/network/server/delete', params),
    detail: (id: number) => get('/network/server/detail', { id }),
    status: (data: object) => post('/network/server/status', data),
  },
  
  // 隧道
  tunnel: {
    getList: (params?: object) => get('/network/tunnel/list', params),
    add: (data: object) => post('/network/tunnel/add', data),
    edit: (data: object) => put('/network/tunnel/edit', data),
    del: (params: object) => del('/network/tunnel/delete', params),
    detail: (id: number) => get('/network/tunnel/detail', { id }),
    status: (data: object) => post('/network/tunnel/status', data),
  },
};
