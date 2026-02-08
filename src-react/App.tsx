import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './pages/layout';
import Login from './pages/login';
import { Loading } from './components';

// 懒加载页面组件
const Home = lazy(() => import('./pages/iot/dashboard'));
const Device = lazy(() => import('./pages/iot/device'));
const DeviceCategory = lazy(() => import('./pages/iot/deviceCategory'));
const DeviceInstance = lazy(() => import('./pages/iot/deviceInstance'));
const DeviceInstanceDetail = lazy(() => import('./pages/iot/deviceInstanceDetail'));
const Product = lazy(() => import('./pages/iot/product'));
const ProductDetail = lazy(() => import('./pages/iot/productDetail'));
const DeviceChannel = lazy(() => import('./pages/iot/deviceChannel'));
const DeviceTemplate = lazy(() => import('./pages/iot/deviceTemplate'));
const Alarm = lazy(() => import('./pages/iot/alarm'));
const AlarmLog = lazy(() => import('./pages/iot/alarm/log'));
const AlarmSetting = lazy(() => import('./pages/iot/alarm/setting'));
const Network = lazy(() => import('./pages/iot/network'));
const NetworkServer = lazy(() => import('./pages/iot/network/server'));
const NetworkServerCreate = lazy(() => import('./pages/iot/network/server/create'));
const NetworkServerEdit = lazy(() => import('./pages/iot/network/server/edit'));
const NetworkTunnel = lazy(() => import('./pages/iot/network/tunnel'));
const NetworkTunnelCreate = lazy(() => import('./pages/iot/network/tunnel/create'));
const NetworkTunnelEdit = lazy(() => import('./pages/iot/network/tunnel/edit'));
const Certificate = lazy(() => import('./pages/iot/certificate'));
const NoticeConfig = lazy(() => import('./pages/iot/notice/config'));
const NoticeConfigSetting = lazy(() => import('./pages/iot/notice/config/setting'));
const NoticeLog = lazy(() => import('./pages/iot/notice/log'));
const SystemUser = lazy(() => import('./pages/system/user'));
const SystemRole = lazy(() => import('./pages/system/role'));
const SystemMenu = lazy(() => import('./pages/system/menu'));
const SystemDict = lazy(() => import('./pages/system/dict'));
const SystemConfig = lazy(() => import('./pages/system/config'));
const SystemApi = lazy(() => import('./pages/system/api'));
const SystemMonitorServer = lazy(() => import('./pages/system/monitor/server'));
const SystemMonitorOperLog = lazy(() => import('./pages/system/monitor/operLog'));
const SystemMonitorLoginLog = lazy(() => import('./pages/system/monitor/loginLog'));
const SystemMonitorOnline = lazy(() => import('./pages/system/monitor/online'));
const SystemMonitorCache = lazy(() => import('./pages/system/monitor/cache'));
const SystemMonitorPlugin = lazy(() => import('./pages/system/monitor/plugin'));
const SystemTask = lazy(() => import('./pages/system/task'));
const SystemDbInit = lazy(() => import('./pages/system/dbInit'));
const SystemDept = lazy(() => import('./pages/system/dept'));
const SystemPost = lazy(() => import('./pages/system/post'));
const SystemBlacklist = lazy(() => import('./pages/system/blacklist'));
const SystemBasicConfig = lazy(() => import('./pages/system/basicConfig'));
const SystemApplication = lazy(() => import('./pages/system/application'));
const SystemAssess = lazy(() => import('./pages/system/assess'));
const LimitsBackEnd = lazy(() => import('./pages/limits/backEnd/page'));
const LimitsFrontEnd = lazy(() => import('./pages/limits/frontEnd/page'));
const PropertyAttribute = lazy(() => import('./pages/iot/property/attribute'));
const PropertyDossier = lazy(() => import('./pages/iot/property/dossier'));
const Personal = lazy(() => import('./pages/personal'));
const SsoLogin = lazy(() => import('./pages/sso'));
const Page404 = lazy(() => import('./pages/error/404'));
const Page401 = lazy(() => import('./pages/error/401'));

const LoadingPage = () => (
  <Loading visible />
);

// 路由懒加载包装
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingPage />}>
    {children}
  </Suspense>
);

// 路由守卫组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!token) {
    const params = new URLSearchParams(location.search);
    const hasParams = params.size > 0;
    const redirect = encodeURIComponent(location.pathname);
    const paramsValue = hasParams
      ? `&params=${encodeURIComponent(JSON.stringify(Object.fromEntries(params.entries())))}`
      : '';
    return <Navigate to={`/login?redirect=${redirect}${paramsValue}`} replace />;
  }

  return <LazyRoute>{children}</LazyRoute>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sso/:type" element={<LazyRoute><SsoLogin /></LazyRoute>} />
      
      {/* 受保护路由 */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        
        {/* IoT 管理 */}
        <Route path="device/*" element={<Device />} />
        <Route path="device/category" element={<DeviceCategory />} />
        <Route path="device/instance" element={<DeviceInstance />} />
        <Route path="device/instance/:deviceKey" element={<DeviceInstanceDetail />} />
        <Route path="device/channel" element={<DeviceChannel />} />
        <Route path="device/template" element={<DeviceTemplate />} />
        <Route path="product/*" element={<Product />} />
        <Route path="product/detail/:productKey" element={<ProductDetail />} />
        <Route path="alarm/*" element={<Alarm />} />
        <Route path="alarm/log" element={<AlarmLog />} />
        <Route path="alarm/setting" element={<AlarmSetting />} />
        <Route path="network/*" element={<Network />} />
        <Route path="network/server" element={<NetworkServer />} />
        <Route path="network/server/create" element={<NetworkServerCreate />} />
        <Route path="network/server/edit/:id" element={<NetworkServerEdit />} />
        <Route path="network/tunnel/*" element={<NetworkTunnel />} />
        <Route path="network/tunnel/create" element={<NetworkTunnelCreate />} />
        <Route path="network/tunnel/edit/:id" element={<NetworkTunnelEdit />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="notice/config/*" element={<NoticeConfig />} />
        <Route path="notice/config/setting/:gateway" element={<NoticeConfigSetting />} />
        <Route path="notice/log" element={<NoticeLog />} />

        {/* 系统管理 */}
        <Route path="system/user/*" element={<SystemUser />} />
        <Route path="system/role/*" element={<SystemRole />} />
        <Route path="system/menu/*" element={<SystemMenu />} />
        <Route path="system/dict/*" element={<SystemDict />} />
        <Route path="system/dict/data/:dictType" element={<SystemDict />} />
        <Route path="system/config/*" element={<SystemConfig />} />
        <Route path="system/api" element={<SystemApi />} />
        <Route path="system/monitor/server" element={<SystemMonitorServer />} />
        <Route path="system/monitor/operLog" element={<SystemMonitorOperLog />} />
        <Route path="system/monitor/loginLog" element={<SystemMonitorLoginLog />} />
        <Route path="system/monitor/online" element={<SystemMonitorOnline />} />
        <Route path="system/monitor/cache" element={<SystemMonitorCache />} />
        <Route path="system/monitor/plugin" element={<SystemMonitorPlugin />} />
        <Route path="system/task" element={<SystemTask />} />
        <Route path="system/dbInit" element={<SystemDbInit />} />
        <Route path="system/dept" element={<SystemDept />} />
        <Route path="system/post" element={<SystemPost />} />
        <Route path="system/blacklist" element={<SystemBlacklist />} />
        <Route path="system/basicConfig/*" element={<SystemBasicConfig />} />
        <Route path="system/application" element={<SystemApplication />} />
        <Route path="system/assess/*" element={<SystemAssess />} />
        <Route path="limits/backEnd/page" element={<LimitsBackEnd />} />
        <Route path="limits/frontEnd/page" element={<LimitsFrontEnd />} />
        <Route path="property/attribute" element={<PropertyAttribute />} />
        <Route path="property/dossier" element={<PropertyDossier />} />
        
        {/* 个人中心 */}
        <Route path="personal" element={<Personal />} />
      </Route>
      
      {/* 错误页面 */}
      <Route path="/404" element={<Page404 />} />
      <Route path="/401" element={<Page401 />} />
      
      {/* 404 重定向 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;
