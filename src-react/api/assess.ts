import { get, post, del, put } from '/@/utils/request';

export default {
  assess: {
    // 评估指标
    getList: (params?: object) => get('/assess/index/list', params),
    add: (data: object) => post('/assess/index/add', data),
    edit: (data: object) => put('/assess/index/edit', data),
    del: (id: number) => del('/assess/index/delete', { id }),
    detail: (id: number) => get('/assess/index/detail', { id }),
    // 评估记录
    records: {
      getList: (params?: object) => get('/assess/record/list', params),
      detail: (id: number) => get('/assess/record/detail', { id }),
      generate: (data: object) => post('/assess/record/generate', data),
    },
    // 综合评估
    total: {
      getList: (params?: object) => get('/assess/total/list', params),
      detail: (id: number) => get('/assess/total/detail', { id }),
      generate: (data: object) => post('/assess/total/generate', data),
    }
  }
};
