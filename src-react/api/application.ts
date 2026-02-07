import { get, post, del, put } from '/@/utils/request';

export default {
  application: {
    getList: (params?: object) => get('/system/app/list', params),
    add: (data: object) => post('/system/app/add', data),
    edit: (data: object) => put('/system/app/edit', data),
    del: (id: number) => del('/system/app/delete', { id }),
    detail: (id: number) => get('/system/app/detail', { id }),
    changeStatus: (data: object) => post('/system/app/changeStatus', data),
  }
};
