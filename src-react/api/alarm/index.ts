// 告警 API 接口
import { get, post, put, del } from '../utils/request';

export default {
  // 告警列表
  getList: (params?: object) => get('/alarm/list', params),
  
  // 告警详情
  detail: (id: number) => get('/alarm/detail', { id }),
  
  // 告警处理
  handle: (data: object) => post('/alarm/handle', data),
  
  // 告警规则
  rule: {
    getList: (params?: object) => get('/alarm/rule/list', params),
    add: (data: object) => post('/alarm/rule/add', data),
    edit: (data: object) => put('/alarm/rule/edit', data),
    del: (params: object) => del('/alarm/rule/delete', params),
  },
};
