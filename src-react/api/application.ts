import { get, post, del, put } from '/@/utils/request';

export default {
  getList: (params?: object) => get('/application/list', params),
  getAll: () => get('/application/getAll'),
  add: (data: object) => post('/application/add', data),
  edit: (data: object) => put('/application/edit', data),
  del: (id: number) => del('/application/delete', { id }),
  detail: (id: number) => get('/application/detail', { id }),
  changeStatus: (data: object) => post('/application/changeStatus', data),
};
