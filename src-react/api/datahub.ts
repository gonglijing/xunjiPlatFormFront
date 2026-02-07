import { get, post, del, put } from '/@/utils/request';

export default {
  api: {
    getList: (params?: object) => get('/datahub/api/list', params),
    add: (data: object) => post('/datahub/api/add', data),
    edit: (data: object) => put('/datahub/api/edit', data),
    del: (id: number) => del('/datahub/api/delete', { id }),
    detail: (id: number) => get('/datahub/api/detail', { id }),
  },
  topic: {
    getList: (params?: object) => get('/datahub/topic/list', params),
    add: (data: object) => post('/datahub/topic/add', data),
    edit: (data: object) => put('/datahub/topic/edit', data),
    del: (id: number) => del('/datahub/topic/delete', { id }),
    detail: (id: number) => get('/datahub/topic/detail', { id }),
  },
};
