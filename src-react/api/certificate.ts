import { get, post, del, put } from '/@/utils/request';
import { withId } from './shared';

export default {
  certificate: {
    getList: (params?: object) => get('/system/certificate/list', params),
    getAll: () => get('/system/certificate/getAll'),
    add: (data: object) => post('/system/certificate/add', data),
    edit: (data: object) => put('/system/certificate/edit', data),
    del: (id: number) => del('/system/certificate/delete', withId(id)),
    editStatus: (data: object) => post('/system/certificate/editStatus', data),
  }
};
