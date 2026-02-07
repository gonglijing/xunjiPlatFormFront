import { get, post, del, put } from '/@/utils/request';

export default {
  system: {
    // 系统 API 管理
    api: {
      getList: (params?: object) => get('/system/api/list', params),
      add: (data: object) => post('/system/api/add', data),
      edit: (data: object) => put('/system/api/edit', data),
      del: (id: number) => del('/system/api/delete', { id }),
      detail: (id: number) => get('/system/api/detail', { id }),
      refresh: () => post('/system/api/refresh'),
    },
    // 基础配置
    config: {
      get: () => get('/system/config/get'),
      edit: (data: object) => put('/system/config/edit', data),
    },
    // 字典数据
    dict: {
      getList: (params?: object) => get('/system/dict/list', params),
      add: (data: object) => post('/system/dict/add', data),
      edit: (data: object) => put('/system/dict/edit', data),
      del: (id: number) => del('/system/dict/delete', { id }),
      detail: (id: number) => get('/system/dict/detail', { id }),
      // 字典数据项
      dataList: (dictId: number) => get('/system/dict/data/list', { dictId }),
      addData: (data: object) => post('/system/dict/data/add', data),
      editData: (data: object) => put('/system/dict/data/edit', data),
      delData: (id: number) => del('/system/dict/data/delete', { id }),
    },
    // 任务调度
    task: {
      getList: (params?: object) => get('/system/task/list', params),
      add: (data: object) => post('/system/task/add', data),
      edit: (data: object) => put('/system/task/edit', data),
      del: (id: number) => del('/system/task/delete', { id }),
      detail: (id: number) => get('/system/task/detail', { id }),
      changeStatus: (data: object) => post('/system/task/changeStatus', data),
      runOnce: (id: number) => post('/system/task/runOnce', { id }),
    },
    // 监控
    monitor: {
      // 服务监控
      server: () => get('/system/monitor/server'),
      // 登录日志
      loginLog: (params?: object) => get('/system/monitor/loginLog/list', params),
      // 操作日志
      operLog: (params?: object) => get('/system/monitor/operLog/list', params),
      // 在线用户
      online: () => get('/system/monitor/online/list'),
      kickout: (id: number) => post('/system/monitor/online/kickout', { id }),
      // 通知公告
      notice: (params?: object) => get('/system/monitor/notice/list', params),
      publishNotice: (data: object) => post('/system/monitor/notice/publish', data),
      // 缓存监控
      cache: () => get('/system/monitor/cache'),
      // 插件监控
      plugin: (params?: object) => get('/system/monitor/plugin/list', params),
    },
    // 数据源
    dbInit: {
      getList: (params?: object) => get('/system/dbInit/list', params),
      test: (data: object) => post('/system/dbInit/test', data),
      add: (data: object) => post('/system/dbInit/add', data),
      edit: (data: object) => put('/system/dbInit/edit', data),
      del: (id: number) => del('/system/dbInit/delete', { id }),
      sync: (id: number) => post('/system/dbInit/sync', { id }),
    }
  }
};
