import { get, post, del, put } from '/@/utils/request';

export default {
  assess: {
    getList: (params?: object) => get('/assess/list', params),
    add: (data: object) => post('/assess/add', data),
    edit: (data: object) => put('/assess/edit', data),
    del: (id: number) => del('/assess/delete', { id }),
    detail: (id: number) => get('/assess/detail', { id }),
  },
  records: {
    getList: (params?: object) => get('/assess/records/list', params),
    detail: (id: number) => get('/assess/records/detail', { id }),
    generate: (data: object) => post('/assess/records/generate', data),
  },
  total: {
    getList: (params?: object) => get('/assess/total/list', params),
    detail: (id: number) => get('/assess/total/detail', { id }),
    generate: (data: object) => post('/assess/total/generate', data),
  },
};
