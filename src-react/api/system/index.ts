// 系统 API 接口
import { get, post, put, del } from '../../utils/request';

export default {
  // 系统信息
  sysinfo: () => get('/sysinfo'),
  
  // 登录
  login: {
    login: (data: object) => post('/login', data),
    logout: () => post('/loginOut'),
    currentUser: () => get('/system/user/currentUser'),
    captcha: () => get('/captcha'),
    ssoList: () => get('/system/sys_oauth/list_front'),
    oauth: (data: object) => post('/oauth', data),
  },
  
  // API 管理
  api: {
    getList: (params?: object) => get('/system/api/tree', params),
    getAll: () => get('/system/api/GetAll'),
    detail: (id: number) => get('/system/api/detail', { id }),
    add: (data: object) => post('/system/api/add', data),
    edit: (data: object) => put('/system/api/edit', data),
    del: (id: number) => del('/system/api/del', { id }),
  },
  
  // 菜单管理
  menu: {
    getList: (params: object) => get('/system/menu/tree', params),
    detail: (id: number) => get('/system/menu/detail', { id }),
    add: (data: object) => post('/system/menu/add', data),
    edit: (data: object) => put('/system/menu/edit', data),
    del: (id: number) => del('/system/menu/del', { id }),
  },
  
  // 角色管理
  role: {
    getList: (params: object) => get('/system/role/tree', params),
    getRole: (id: number) => get('/system/role/getInfoById', { id }),
    addRole: (data: object) => post('/system/role/add', data),
    editRole: (data: object) => put('/system/role/edit', data),
    deleteRole: (id: number) => del('/system/role/delInfoById', { id }),
  },
  
  // 用户管理
  user: {
    getList: (params: object) => get('/system/user/list', params),
    getAllList: (params: object) => get('/system/user/getAll', params),
    detail: (id: number) => get('/system/user/getInfoById', { id }),
    add: (data: object) => post('/system/user/add', data),
    edit: (data: object) => put('/system/user/edit', data),
    editUserInfo: (data: object) => put('/system/user/editUserInfo', data),
    setAvatar: (id: number, avatar: string) => put('/system/user/editAvatar', { id, avatar }),
    del: (id: number) => del('/system/user/delInfoById', { id }),
    setStatus: (id: number, status: number) => put('/system/user/editStatus', { id, status }),
  },
  
  // 字典管理
  dict: {
    getTypeList: (params: object) => get('/common/dict/type/list', params),
    getDataList: (params: object) => get('/common/dict/data/list', params),
    addType: (data: object) => post('/common/dict/type/add', data),
    editType: (data: object) => put('/common/dict/type/edit', data),
    addData: (data: object) => post('/common/dict/data/add', data),
    editData: (data: object) => put('/common/dict/data/edit', data),
    deleteType: (ids: number[]) => del('/common/dict/type/delete', { ids }),
    deleteData: (ids: number[]) => del('/common/dict/data/delete', { ids }),
  },
  
  // 配置管理
  config: {
    getList: (params: object) => get('/common/config/list', params),
    add: (data: object) => post('/common/config/add', data),
    edit: (data: object) => put('/common/config/edit', data),
    del: (ids: number[]) => del('/common/config/delete', { ids }),
  },
  
  // 部门管理
  dept: {
    getList: (params: object) => get('/system/dept/tree', params),
    add: (data: object) => post('/system/dept/add', data),
    edit: (data: object) => put('/system/dept/edit', data),
    del: (deptId: number) => del('/system/dept/del', { deptId }),
  },
  
  // 岗位管理
  post: {
    getList: (params: object) => get('/system/post/tree', params),
    add: (data: object) => post('/system/post/add', data),
    edit: (data: object) => put('/system/post/edit', data),
    del: (postId: number) => del('/system/post/del', { postId }),
  },
  
  // 组织机构
  org: {
    getList: (params: object) => get('/system/organization/tree', params),
    add: (data: object) => post('/system/organization/add', data),
    edit: (data: object) => put('/system/organization/edit', data),
    del: (id: number) => del('/system/organization/del', { id }),
  },
  
  // 日志管理
  log: {
    getList: (params: object) => get('/system/login/log/list', params),
    del: (infoIds: number[]) => del('/system/login/log/del', { infoIds }),
    clearLog: () => post('/system/login/log/clear'),
  },
  
  // 操作日志
  oper: {
    getList: (params: object) => get('/system/oper/log/list', params),
    del: (operIds: number) => del('/system/oper/log/del', { operIds }),
    clearLog: () => post('/system/oper/log/clear'),
  },
  
  // 在线用户
  online: {
    getList: (params: object) => get('/system/userOnline/list', params),
    strongBack: (id: number) => del('/system/userOnline/strongBack', { id }),
  },
  
  // 任务调度
  task: {
    getList: (params: object) => get('/system/job/list', params),
    add: (data: object) => post('/system/job/add', data),
    edit: (data: object) => put('/system/job//edit', data),
    del: (id: number) => del('/system/job/delJobById', { id }),
    run: (id: number) => put('/system/job/run', { id }),
    start: (id: number) => put('/system/job/start', { id }),
    stop: (id: number) => put('/system/job/stop', { id }),
  },

  getInfoByKey: (ConfigKey: string) => get('/common/config/getInfoByKey', { ConfigKey }),
};
