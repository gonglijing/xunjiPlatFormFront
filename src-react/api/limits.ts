import { get, post, del, put } from '/@/utils/request';

export default {
  limits: {
    // 后端权限
    backEnd: {
      getList: (params?: object) => get('/limits/backEnd/list', params),
      add: (data: object) => post('/limits/backEnd/add', data),
      edit: (data: object) => put('/limits/backEnd/edit', data),
      del: (id: number) => del('/limits/backEnd/delete', { id }),
      detail: (id: number) => get('/limits/backEnd/detail', { id }),
    },
    // 前端页面权限
    frontEnd: {
      page: {
        getList: (params?: object) => get('/limits/frontEnd/page/list', params),
        add: (data: object) => post('/limits/frontEnd/page/add', data),
        edit: (data: object) => put('/limits/frontEnd/page/edit', data),
        del: (id: number) => del('/limits/frontEnd/page/delete', { id }),
        detail: (id: number) => get('/limits/frontEnd/page/detail', { id }),
      },
      btn: {
        getList: (params?: object) => get('/limits/frontEnd/btn/list', params),
        add: (data: object) => post('/limits/frontEnd/btn/add', data),
        edit: (data: object) => put('/limits/frontEnd/btn/edit', data),
        del: (id: number) => del('/limits/frontEnd/btn/delete', { id }),
        detail: (id: number) => get('/limits/frontEnd/btn/detail', { id }),
      }
    }
  }
};
