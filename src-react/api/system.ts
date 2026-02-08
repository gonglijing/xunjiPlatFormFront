import { get, post, del, put, file } from '/@/utils/request';

const toIds = (value: number | number[]) => (Array.isArray(value) ? value : [value]);

const login = {
  login: (data: object) => post('/login', data),
  logout: () => post('/loginOut'),
  currentUser: () => get('/system/user/currentUser'),
  captcha: () => get('/captcha'),
  ssoList: () => get('/system/sys_oauth/list_front'),
  oauth: (data: object) => post('/oauth', data),
};

const system = {
  user: {
    getList: (params?: object) => get('/system/user/list', params),
    add: (data: object) => post('/system/user/add', data),
    edit: (data: object) => put('/system/user/edit', data),
    del: (id: number) => del('/system/user/delete', { id }),
    detail: (id: number) => get('/system/user/detail', { id }),
    resetPassword: (id: number, password: string) => post('/system/user/resetPwd', { id, password }),
    setStatus: (id: number, status: number) => post('/system/user/changeStatus', { id, status }),
  },
  role: {
    getList: (params?: object) => get('/system/role/list', params),
    add: (data: object) => post('/system/role/add', data),
    edit: (data: object) => put('/system/role/edit', data),
    del: (id: number) => del('/system/role/delete', { id }),
    detail: (id: number) => get('/system/role/detail', { id }),
    auth: {
      tree: (roleId: number) => get('/system/role/auth/tree', { roleId }),
      update: (data: object) => post('/system/role/auth/update', data),
    },
  },
  dept: {
    getList: (params?: object) => get('/system/dept/list', params),
    add: (data: object) => post('/system/dept/add', data),
    edit: (data: object) => put('/system/dept/edit', data),
    del: (id: number) => del('/system/dept/delete', { id }),
    detail: (id: number) => get('/system/dept/detail', { id }),
  },
  post: {
    getList: (params?: object) => get('/system/post/list', params),
    add: (data: object) => post('/system/post/add', data),
    edit: (data: object) => put('/system/post/edit', data),
    del: (id: number) => del('/system/post/delete', { id }),
    detail: (id: number) => get('/system/post/detail', { id }),
  },
  menu: {
    getList: (params?: object) => get('/system/menu/list', params),
    add: (data: object) => post('/system/menu/add', data),
    edit: (data: object) => put('/system/menu/edit', data),
    del: (id: number) => del('/system/menu/delete', { id }),
    detail: (id: number) => get('/system/menu/detail', { id }),
    tree: () => get('/system/menu/tree'),
  },
  api: {
    getList: (params?: object) => get('/system/api/list', params),
    add: (data: object) => post('/system/api/add', data),
    edit: (data: object) => put('/system/api/edit', data),
    del: (id: number) => del('/system/api/delete', { id }),
    detail: (id: number) => get('/system/api/detail', { id }),
    refresh: () => post('/system/api/refresh'),
  },
  config: {
    get: () => get('/system/config/get'),
    getList: (params?: object) => get('/common/config/list', params),
    add: (data: object) => post('/common/config/add', data),
    edit: (data: object) => put('/common/config/edit', data),
    del: (ids: number[] | number) => del('/common/config/delete', { ids: toIds(ids) }),
  },
  dict: {
    getList: (params?: object) => get('/common/dict/type/list', params),
    add: (data: object) => post('/common/dict/type/add', data),
    edit: (data: object) => put('/common/dict/type/edit', data),
    del: (ids: number[] | number) => del('/common/dict/type/delete', { ids: toIds(ids) }),
    detail: (id: number) => get('/common/dict/type/detail', { id }),
    dataList: (params?: object) => get('/common/dict/data/list', params),
    addData: (data: object) => post('/common/dict/data/add', data),
    editData: (data: object) => put('/common/dict/data/edit', data),
    delData: (ids: number[] | number) => del('/common/dict/data/delete', { ids: toIds(ids) }),
  },
  task: {
    getList: (params?: object) => get('/system/task/list', params),
    add: (data: object) => post('/system/task/add', data),
    edit: (data: object) => put('/system/task/edit', data),
    del: (id: number) => del('/system/task/delete', { id }),
    detail: (id: number) => get('/system/task/detail', { id }),
    changeStatus: (data: object) => post('/system/task/changeStatus', data),
    runOnce: (id: number) => post('/system/task/runOnce', { id }),
  },
  monitor: {
    server: () => get('/system/monitor/server'),
    loginLog: (params?: object) => get('/system/login/log/list', params),
    operLog: (params?: object) => get('/system/oper/log/list', params),
    online: (params?: object) => get('/system/userOnline/list', params),
    kickout: (id: number) => del('/system/userOnline/strongBack', { id }),
    notice: (params?: object) => get('/system/monitor/notice/list', params),
    publishNotice: (data: object) => post('/system/monitor/notice/publish', data),
    cache: () => get('/system/monitor/cache'),
    plugin: (params?: object) => get('/system/plugins/list', params),
  },
  dbInit: {
    getList: (params?: object) => get('/system/dbInit/list', params),
    test: (data: object | number) => post('/system/dbInit/test', typeof data === 'number' ? { id: data } : data),
    add: (data: object) => post('/system/dbInit/add', data),
    edit: (data: object) => put('/system/dbInit/edit', data),
    del: (id: number) => del('/system/dbInit/delete', { id }),
    sync: (id: number) => post('/system/dbInit/sync', { id }),
  },
  blacklist: {
    getList: (params?: object) => get('/system/blacklist/list', params),
    add: (data: object) => post('/system/blacklist/add', data),
    edit: (data: object) => put('/system/blacklist/edit', data),
    del: (ids: number[] | number) => del('/system/blacklist/delete', { ids: toIds(ids) }),
    changeStatus: (data: object) => post('/system/blacklist/status', data),
    detail: (params?: object) => get('/system/blacklist/get', params),
  },
};

const certificate = {
  getList: (params?: object) => get('/system/certificate/list', params),
  getAll: () => get('/system/certificate/getAll'),
  add: (data: object) => post('/system/certificate/add', data),
  edit: (data: object) => put('/system/certificate/edit', data),
  del: (id: number) => del('/system/certificate/delete', { id }),
  editStatus: (data: object) => post('/system/certificate/editStatus', data),
};

const role = {
  ...system.role,
  addRole: system.role.add,
  editRole: system.role.edit,
  deleteRole: system.role.del,
};

const user = {
  ...system.user,
  editUserInfo: (data: object) => put('/system/user/editUserInfo', data),
  setAvatar: (id: number, avatar: string) => put('/system/user/editAvatar', { id, avatar }),
};

const log = {
  getList: (params?: object) => get('/system/login/log/list', params),
  export: (params?: object) => file('/system/login/log/export', params),
  del: (infoIds: number[] | number) => del('/system/login/log/del', { infoIds: toIds(infoIds) }),
  detail: (infoId: number) => get('/system/login/log/detail', { infoId }),
  clearLog: () => post('/system/login/log/clear'),
};

const oper = {
  getList: (params?: object) => get('/system/oper/log/list', params),
  del: (operIds: number[] | number) => del('/system/oper/log/del', { operIds: toIds(operIds) }),
  detail: (operId: number) => get('/system/oper/log/detail', { operId }),
  clearLog: () => post('/system/oper/log/clear'),
};

const online = {
  getList: (params?: object) => get('/system/userOnline/list', params),
  strongBack: (id: number) => del('/system/userOnline/strongBack', { id }),
};

const plugin = {
  getList: (params?: object) => get('/system/plugins/list', params),
  del: (ids: number[] | number) => del('/system/plugins/del', { ids: toIds(ids) }),
  changeStatus: (data: object) => post('/system/plugins/set', data),
  edit: (data: object) => put('/system/plugins/edit', data),
  addPluginFile: (formData: FormData) => post('/system/plugins/add', formData),
};

const blackList = {
  getList: (params?: object) => get('/system/blacklist/list', params),
  add: (data: object) => post('/system/blacklist/add', data),
  delete: (ids: number[] | number) => del('/system/blacklist/delete', { ids: toIds(ids) }),
  edit: (data: object) => put('/system/blacklist/edit', data),
  detail: (params?: object) => get('/system/blacklist/get', params),
  changeStatus: (data: object) => post('/system/blacklist/status', data),
};

const basicConfig = {
  getDetails: (params?: object) => get('/common/getSysConfigSetting', params),
  setDetails: (data: object) => put('/common/editSysConfigSetting', data),
  getEmailSetting: () => get('/common/getEmailSetting'),
  editEmailSetting: (data: object) => put('/common/editEmailSetting', data),
  getSecuritySetting: () => get('/common/getSecuritySetting'),
  editSecuritySetting: (data: object) => put('/common/editSecuritySetting', data),
};

export default {
  sysinfo: () => get('/sysinfo'),
  getInfoByKey: (ConfigKey: string) => get('/common/config/getInfoByKey', { ConfigKey }),
  login,
  user,
  role,
  menu: system.menu,
  dept: system.dept,
  post: system.post,
  api: system.api,
  certificate,
  log,
  oper,
  online,
  plugin,
  blackList,
  basicConfig,
  system,
};
