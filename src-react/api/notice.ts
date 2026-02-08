import { get, post, del, put } from '/@/utils/request';

const config = {
  getList: (params?: object) => get('/notice/config/list', params),
  getAll: () => get('/notice/config/getAll'),
  add: (data: object) => post('/notice/config/add', data),
  edit: (data: object) => put('/notice/config/edit', data),
  del: (id: number) => del('/notice/config/delete', { id }),
  detail: (id: number) => get('/notice/config/detail', { id }),
  changeStatus: (data: object) => post('/notice/config/changeStatus', data),
  test: (data: object) => post('/notice/config/test', data),
};

const log = {
  getList: (params?: object) => get('/notice/log/search', params),
  detail: (id: number) => get('/notice/log/detail', { id }),
  resend: (id: number) => post('/notice/log/resend', { id }),
};

export default {
  config,
  log,
  notice: {
    config,
    log,
  },
};
