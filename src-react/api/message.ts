import { get, post } from '/@/utils/request';

export default {
  // 消息模板
  getList: (params?: object) => get('/message/template/list', params),
  add: (data: object) => post('/message/template/add', data),
  edit: (data: object) => put('/message/template/edit', data),
  del: (id: number) => del('/message/template/delete', { id }),
  detail: (id: number) => get('/message/template/detail', { id }),
  // 发送消息
  send: (data: object) => post('/message/send', data),
};
