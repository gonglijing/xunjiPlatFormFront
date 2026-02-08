import { del, get, post, put } from '/@/utils/request';
import { withId } from './shared';

export default {
  // 消息模板
  getList: (params?: object) => get('/message/template/list', params),
  add: (data: object) => post('/message/template/add', data),
  edit: (data: object) => put('/message/template/edit', data),
  del: (id: number) => del('/message/template/delete', withId(id)),
  detail: (id: number) => get('/message/template/detail', withId(id)),
  // 发送消息
  send: (data: object) => post('/message/send', data),
};
