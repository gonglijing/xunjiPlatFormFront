import { toCanonicalPath } from './routePath';

const ROUTE_TITLE_MAP: Record<string, string> = {
  '/': '首页',
  '/home': '仪表盘',
  '/alarm': '告警管理',
  '/alarm/log': '告警日志',
  '/alarm/setting': '告警设置',
  '/device': '设备管理',
  '/device/category': '设备分类',
  '/device/instance': '设备实例',
  '/device/channel': '设备通道',
  '/device/template': '设备模板',
  '/network': '网络管理',
  '/network/server': '网络服务',
  '/network/tunnel': '网络通道',
  '/product': '产品管理',
  '/certificate': '证书管理',
  '/notice': '通知服务',
  '/notice/config': '通知配置',
  '/notice/log': '通知日志',
  '/property/attribute': '属性定义',
  '/property/dossier': '档案定义',
  '/system': '系统管理',
  '/system/user': '用户管理',
  '/system/role': '角色管理',
  '/system/menu': '菜单管理',
  '/system/config': '系统配置',
  '/system/dict': '字典管理',
  '/system/api': '接口管理',
  '/system/monitor': '系统监控',
  '/system/monitor/server': '服务监控',
  '/system/monitor/operLog': '操作日志',
  '/system/monitor/loginLog': '登录日志',
  '/system/monitor/online': '在线用户',
  '/system/monitor/cache': '缓存监控',
  '/system/monitor/plugin': '插件监控',
  '/system/monitor/notice': '站内消息',
  '/system/blacklist': '黑名单管理',
  '/system/basicConfig': '基础配置',
  '/system/application': '应用管理',
  '/system/assess': '评估管理',
  '/personal': '个人中心',
};

const DYNAMIC_ROUTE_TITLE_RESOLVERS: Array<(path: string) => string | null> = [
  (path) => (path.startsWith('/product/detail/') ? '产品详情' : null),
  (path) => (path.startsWith('/device/instance/') ? '设备详情' : null),
  (path) => (path.startsWith('/notice/config/setting/') ? '通知设置' : null),
  (path) => (path.startsWith('/network/server/edit/') ? '编辑服务器' : null),
  (path) => (path.startsWith('/network/tunnel/edit/') ? '编辑通道' : null),
];

export const resolveRouteTitle = (rawPath: string, fallback?: string) => {
  const path = toCanonicalPath(rawPath);

  const staticTitle = ROUTE_TITLE_MAP[path];
  if (staticTitle) {
    return staticTitle;
  }

  for (const resolver of DYNAMIC_ROUTE_TITLE_RESOLVERS) {
    const title = resolver(path);
    if (title) {
      return title;
    }
  }

  return fallback || path;
};
