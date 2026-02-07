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
const NetworkTunnel = lazy(() => import('./pages/iot/network/tunnel'));
const Certificate = lazy(() => import('./pages/iot/certificate'));
const NoticeConfig = lazy(() => import('./pages/iot/notice/config'));
const NoticeLog = lazy(() => import('./pages/iot/notice/log'));
const SystemUser = lazy(() => import('./pages/system/user'));
const SystemRole = lazy(() => import('./pages/system/role'));
const SystemMenu = lazy(() => import('./pages/system/menu'));
const SystemDict = lazy(() => import('./pages/system/dict'));
const SystemConfig = lazy(() => import('./pages/system/config'));
const SystemApi = lazy(() => import('./pages/system/api'));
const SystemMonitorServer = lazy(() => import('./pages/system/monitor/server'));
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
        <Route path="network/tunnel" element={<NetworkTunnel />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="notice/config/*" element={<NoticeConfig />} />
        <Route path="notice/log" element={<NoticeLog />} />

        {/* 系统管理 */}
        <Route path="system/user/*" element={<SystemUser />} />
        <Route path="system/role/*" element={<SystemRole />} />
        <Route path="system/menu/*" element={<SystemMenu />} />
        <Route path="system/dict/*" element={<SystemDict />} />
        <Route path="system/config/*" element={<SystemConfig />} />
        <Route path="system/api" element={<SystemApi />} />
        <Route path="system/monitor/server" element={<SystemMonitorServer />} />
        
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
