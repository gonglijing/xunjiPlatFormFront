import { withId, withIds } from './shared';
import { tdel, tfile, tget, tpost, tput } from './typed';
import type {
  ApiNormalizedListResult,
  ApiNormalizedResult,
  ApiParams,
  Certificate,
  Dict,
  DictData,
  SystemApi,
  SystemBlacklist,
  SystemConfig,
  SystemDept,
  SystemMenu,
  SystemMessage,
  SystemPlugin,
  SystemPost,
  SystemRole,
  SystemTask,
  SystemUser,
} from './types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number, key = 'id') => tget<ApiNormalizedResult<T>>(url, withId(id, key));
const create = (url: string, data: Query | FormData) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query | FormData) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);

/** 登录与用户会话相关接口 */
const login = {
  login: (data: Query) => create('/login', data),
  logout: () => create('/loginOut', {}),
  currentUser: () => tget<ApiNormalizedResult<AnyRecord>>('/system/user/currentUser'),
  captcha: () => tget<ApiNormalizedResult<AnyRecord>>('/captcha'),
  ssoList: () => tget<ApiNormalizedResult<AnyRecord>>('/system/sys_oauth/list_front'),
  oauth: (data: Query) => create('/oauth', data),
};

/** 系统主资源接口（用户、角色、菜单、字典等） */
const system = {
  user: {
    getList: (params?: Query) => list<SystemUser>('/system/user/list', params),
    add: (data: Query) => create('/system/user/add', data),
    edit: (data: Query) => update('/system/user/edit', data),
    del: (id: number) => remove('/system/user/delete', withId(id)),
    detail: (id: number) => detail<SystemUser>('/system/user/detail', id),
    resetPassword: (id: number, password: string) => create('/system/user/resetPwd', { id, password }),
    setStatus: (id: number, status: number) => create('/system/user/changeStatus', { id, status }),
  },
  role: {
    getList: (params?: Query) => list<SystemRole>('/system/role/list', params),
    add: (data: Query) => create('/system/role/add', data),
    edit: (data: Query) => update('/system/role/edit', data),
    del: (id: number) => remove('/system/role/delete', withId(id)),
    detail: (id: number) => detail<SystemRole>('/system/role/detail', id),
    auth: {
      tree: (roleId: number) => tget<ApiNormalizedResult<AnyRecord>>('/system/role/auth/tree', { roleId }),
      update: (data: Query) => create('/system/role/auth/update', data),
    },
  },
  dept: {
    getList: (params?: Query) => list<SystemDept>('/system/dept/list', params),
    add: (data: Query) => create('/system/dept/add', data),
    edit: (data: Query) => update('/system/dept/edit', data),
    del: (id: number) => remove('/system/dept/delete', withId(id)),
    detail: (id: number) => detail<SystemDept>('/system/dept/detail', id),
  },
  post: {
    getList: (params?: Query) => list<SystemPost>('/system/post/list', params),
    add: (data: Query) => create('/system/post/add', data),
    edit: (data: Query) => update('/system/post/edit', data),
    del: (id: number) => remove('/system/post/delete', withId(id)),
    detail: (id: number) => detail<SystemPost>('/system/post/detail', id),
  },
  menu: {
    getList: (params?: Query) => list<SystemMenu>('/system/menu/list', params),
    add: (data: Query) => create('/system/menu/add', data),
    edit: (data: Query) => update('/system/menu/edit', data),
    del: (id: number) => remove('/system/menu/delete', withId(id)),
    detail: (id: number) => detail<SystemMenu>('/system/menu/detail', id),
    tree: () => tget<ApiNormalizedResult<SystemMenu[]>>('/system/menu/tree'),
  },
  api: {
    getList: (params?: Query) => list<SystemApi>('/system/api/list', params),
    add: (data: Query) => create('/system/api/add', data),
    edit: (data: Query) => update('/system/api/edit', data),
    del: (id: number) => remove('/system/api/delete', withId(id)),
    detail: (id: number) => detail<SystemApi>('/system/api/detail', id),
    refresh: () => create('/system/api/refresh', {}),
  },
  config: {
    get: () => tget<ApiNormalizedResult<SystemConfig>>('/system/config/get'),
    getList: (params?: Query) => list<SystemConfig>('/common/config/list', params),
    add: (data: Query) => create('/common/config/add', data),
    edit: (data: Query) => update('/common/config/edit', data),
    del: (ids: number[] | number) => remove('/common/config/delete', withIds(ids)),
  },
  dict: {
    getList: (params?: Query) => list<Dict>('/common/dict/type/list', params),
    add: (data: Query) => create('/common/dict/type/add', data),
    edit: (data: Query) => update('/common/dict/type/edit', data),
    del: (ids: number[] | number) => remove('/common/dict/type/delete', withIds(ids)),
    detail: (id: number) => detail<Dict>('/common/dict/type/detail', id),
    dataList: (params?: Query) => list<DictData>('/common/dict/data/list', params),
    addData: (data: Query) => create('/common/dict/data/add', data),
    editData: (data: Query) => update('/common/dict/data/edit', data),
    delData: (ids: number[] | number) => remove('/common/dict/data/delete', withIds(ids)),
  },
  task: {
    getList: (params?: Query) => list<SystemTask>('/system/task/list', params),
    add: (data: Query) => create('/system/task/add', data),
    edit: (data: Query) => update('/system/task/edit', data),
    del: (id: number) => remove('/system/task/delete', withId(id)),
    detail: (id: number) => detail<SystemTask>('/system/task/detail', id),
    changeStatus: (data: Query) => create('/system/task/changeStatus', data),
    runOnce: (id: number) => create('/system/task/runOnce', withId(id)),
  },
  monitor: {
    server: () => tget<ApiNormalizedResult<AnyRecord>>('/system/monitor/server'),
    loginLog: (params?: Query) => list<AnyRecord>('/system/login/log/list', params),
    operLog: (params?: Query) => list<AnyRecord>('/system/oper/log/list', params),
    online: (params?: Query) => list<SystemUser>('/system/userOnline/list', params),
    kickout: (id: number) => remove('/system/userOnline/strongBack', withId(id)),
    notice: (params?: Query) => list<SystemMessage>('/system/monitor/notice/list', params),
    publishNotice: (data: Query) => create('/system/monitor/notice/publish', data),
    cache: () => tget<ApiNormalizedResult<AnyRecord>>('/system/monitor/cache'),
    plugin: (params?: Query) => list<SystemPlugin>('/system/plugins/list', params),
  },
  dbInit: {
    getList: (params?: Query) => list<AnyRecord>('/system/dbInit/list', params),
    test: (data: Query | number) => create('/system/dbInit/test', typeof data === 'number' ? withId(data) : data),
    add: (data: Query) => create('/system/dbInit/add', data),
    edit: (data: Query) => update('/system/dbInit/edit', data),
    del: (id: number) => remove('/system/dbInit/delete', withId(id)),
    sync: (id: number) => create('/system/dbInit/sync', withId(id)),
  },
  blacklist: {
    getList: (params?: Query) => list<SystemBlacklist>('/system/blacklist/list', params),
    add: (data: Query) => create('/system/blacklist/add', data),
    edit: (data: Query) => update('/system/blacklist/edit', data),
    del: (ids: number[] | number) => remove('/system/blacklist/delete', withIds(ids)),
    changeStatus: (data: Query) => create('/system/blacklist/status', data),
    detail: (params?: Query) => tget<ApiNormalizedResult<SystemBlacklist>>('/system/blacklist/get', params),
  },
};

const certificate = {
  getList: (params?: Query) => list<Certificate>('/system/certificate/list', params),
  getAll: () => tget<ApiNormalizedResult<Certificate[]>>('/system/certificate/getAll'),
  add: (data: Query) => create('/system/certificate/add', data),
  edit: (data: Query) => update('/system/certificate/edit', data),
  del: (id: number) => remove('/system/certificate/delete', withId(id)),
  editStatus: (data: Query) => create('/system/certificate/editStatus', data),
};

const role = {
  ...system.role,
  addRole: system.role.add,
  editRole: system.role.edit,
  deleteRole: system.role.del,
};

const user = {
  ...system.user,
  editUserInfo: (data: Query) => update('/system/user/editUserInfo', data),
  setAvatar: (id: number, avatar: string) => update('/system/user/editAvatar', { ...withId(id), avatar }),
};

const log = {
  getList: (params?: Query) => list<AnyRecord>('/system/login/log/list', params),
  export: (params?: Query) => tfile<Blob>('/system/login/log/export', params),
  del: (infoIds: number[] | number) => remove('/system/login/log/del', withIds(infoIds, 'infoIds')),
  detail: (infoId: number) => detail<AnyRecord>('/system/login/log/detail', infoId, 'infoId'),
  clearLog: () => create('/system/login/log/clear', {}),
};

const oper = {
  getList: (params?: Query) => list<AnyRecord>('/system/oper/log/list', params),
  del: (operIds: number[] | number) => remove('/system/oper/log/del', withIds(operIds, 'operIds')),
  detail: (operId: number) => detail<AnyRecord>('/system/oper/log/detail', operId, 'operId'),
  clearLog: () => create('/system/oper/log/clear', {}),
};

const online = {
  getList: (params?: Query) => list<SystemUser>('/system/userOnline/list', params),
  strongBack: (id: number) => remove('/system/userOnline/strongBack', withId(id)),
};

const plugin = {
  getList: (params?: Query) => list<SystemPlugin>('/system/plugins/list', params),
  del: (ids: number[] | number) => remove('/system/plugins/del', withIds(ids)),
  changeStatus: (data: Query) => create('/system/plugins/set', data),
  edit: (data: Query) => update('/system/plugins/edit', data),
  addPluginFile: (formData: FormData) => create('/system/plugins/add', formData),
};

const blackList = {
  getList: (params?: Query) => list<SystemBlacklist>('/system/blacklist/list', params),
  add: (data: Query) => create('/system/blacklist/add', data),
  delete: (ids: number[] | number) => remove('/system/blacklist/delete', withIds(ids)),
  edit: (data: Query) => update('/system/blacklist/edit', data),
  detail: (params?: Query) => tget<ApiNormalizedResult<SystemBlacklist>>('/system/blacklist/get', params),
  changeStatus: (data: Query) => create('/system/blacklist/status', data),
};

const basicConfig = {
  getDetails: (params?: Query) => tget<ApiNormalizedResult<AnyRecord>>('/common/getSysConfigSetting', params),
  setDetails: (data: Query) => update('/common/editSysConfigSetting', data),
  getEmailSetting: () => tget<ApiNormalizedResult<AnyRecord>>('/common/getEmailSetting'),
  editEmailSetting: (data: Query) => update('/common/editEmailSetting', data),
  getSecuritySetting: () => tget<ApiNormalizedResult<AnyRecord>>('/common/getSecuritySetting'),
  editSecuritySetting: (data: Query) => update('/common/editSecuritySetting', data),
};

const message = {
  allUnRead: () => tget<ApiNormalizedResult<number>>('/system/message/allUnRead'),
  clear: () => tget<ApiNormalizedResult<number>>('/system/message/clear'),
  del: (ids: number[] | number) => remove('/system/message/del', withIds(ids)),
  getList: (params?: Query) => list<SystemMessage>('/system/message/list', params),
  read: (id: number) => update('/system/message/read', withId(id)),
  unReadCount: () => tget<ApiNormalizedResult<number>>('/system/message/unReadCount'),
};

export default {
  sysinfo: () => tget<ApiNormalizedResult<AnyRecord>>('/sysinfo'),
  getInfoByKey: (ConfigKey: string) => tget<ApiNormalizedResult<SystemConfig>>('/common/config/getInfoByKey', { ConfigKey }),
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
  message,
  system,
};
