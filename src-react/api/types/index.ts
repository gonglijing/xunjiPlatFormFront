// API 响应类型定义
export interface ApiEnvelope<T = unknown> {
  code: number;
  message?: string;
  msg?: string;
  data: T;
}

export type ApiNormalizedResult<T> = T & {
  code?: number;
  message?: string;
  msg?: string;
  data?: T;
};

export type ApiNormalizedListResult<T> = ApiNormalizedResult<ApiListResult<T>>;

export interface ApiListResult<T> {
  list: T[];
  total: number;
  page?: number;
}

export interface ApiPageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface ApiParams {
  [key: string]: unknown;
}

export interface ApiPagedQuery {
  pageNum?: number;
  pageSize?: number;
  [key: string]: unknown;
}

export interface ApiIdParam {
  id: number | string;
}

export interface ApiIdsParam {
  ids: Array<number | string>;
}

// 告警相关类型
export interface AlarmRule {
  id: number;
  name: string;
  productKey: string;
  status: number;
  alarmLevel?: { id: number; name: string };
  triggerType?: string;
  description?: string;
  createdAt: string;
}

export interface AlarmLog {
  id: number;
  type: number;
  ruleName: string;
  productKey: string;
  deviceKey: string;
  status: number;
  data?: string;
  content?: string;
  alarmLevel?: { id: number; name: string };
  product?: { name: string };
  device?: { name: string };
  createdAt: string;
}

// 设备相关类型
export interface Device {
  id: number;
  name: string;
  deviceKey: string;
  productKey: string;
  status: number;
  isOnline: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  productKey: string;
  categoryId: number;
  dataType: string;
  status: number;
  createdAt: string;
}

export interface DeviceChannel {
  id: number;
  name?: string;
  deviceKey?: string;
  status?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DeviceCategory {
  id: number;
  name?: string;
  status?: number;
  [key: string]: unknown;
}

export interface DeviceInstance {
  id: number;
  deviceKey: string;
  productKey?: string;
  status?: number;
  createdAt?: string;
  [key: string]: unknown;
}

// 网络相关类型
export interface NetworkServer {
  id: number;
  name: string;
  types: string;
  addr: string;
  status: number;
  createdAt: string;
}

export interface NetworkTunnel {
  id: number;
  name: string;
  serverId: number;
  serverName: string;
  status: number;
  createdAt: string;
}

// 证书相关类型
export interface Certificate {
  id: number;
  name: string;
  standard: string;
  description: string;
  status: number;
  createdAt: string;
}

// 通知相关类型
export interface NoticeConfig {
  id: number;
  gateway: string;
  name: string;
  config: string;
  status: number;
  createdAt: string;
}

export interface NoticeLog {
  id: number;
  title: string;
  gateway: string;
  status: number;
  content?: string;
  sendTime: string;
  createdAt: string;
}

export interface NoticeTemplate {
  id: number;
  title?: string;
  name?: string;
  configId?: number;
  status?: number;
  content?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DatahubApi {
  id: number;
  name?: string;
  method?: string;
  path?: string;
  status?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DatahubTopic {
  id: number;
  name?: string;
  topic?: string;
  status?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AnalysisPoint {
  title?: string;
  value?: number;
  count?: number;
  month?: string;
  [key: string]: unknown;
}

// 字典相关类型
export interface Dict {
  id: number;
  name: string;
  type: string;
  description: string;
  status: number;
  createdAt: string;
}

export interface DictData {
  id: number;
  dictId: number;
  label: string;
  value: string;
  sort: number;
  status: number;
}

// 系统相关类型
export interface SystemUser {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  roleId: number;
  roleName: string;
  createdAt: string;
}

export interface SystemRole {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: number;
  sort: number;
  createdAt: string;
}

export interface SystemApi {
  id: number;
  path: string;
  method: string;
  description?: string;
  status: number;
  createdAt: string;
}

export interface SystemConfig {
  id: number;
  name: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  createdAt: string;
}

export interface AppInfo {
  id: number;
  name?: string;
  code?: string;
  status?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AlarmLevel {
  id: number;
  name?: string;
  level?: string;
  [key: string]: unknown;
}

export interface SystemDept {
  id: number;
  name?: string;
  parentId?: number;
  status?: number;
  [key: string]: unknown;
}

export interface SystemPost {
  id: number;
  name?: string;
  code?: string;
  status?: number;
  [key: string]: unknown;
}

export interface SystemMenu {
  id: number;
  name?: string;
  path?: string;
  parentId?: number;
  status?: number;
  [key: string]: unknown;
}

export interface SystemTask {
  id: number;
  name?: string;
  cron?: string;
  status?: number;
  [key: string]: unknown;
}

export interface SystemPlugin {
  id: number;
  name?: string;
  code?: string;
  status?: number;
  [key: string]: unknown;
}

export interface SystemBlacklist {
  id: number;
  ip?: string;
  status?: number;
  [key: string]: unknown;
}

export interface SystemMessage {
  id: number;
  title?: string;
  content?: string;
  isRead?: number;
  createdAt?: string;
  [key: string]: unknown;
}
