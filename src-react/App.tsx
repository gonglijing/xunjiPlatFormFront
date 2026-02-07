import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './pages/layout';
import Login from './pages/login';
import { Loading } from './components';

// 懒加载页面组件
const Home = lazy(() => import('./pages/iot/dashboard'));
const Device = lazy(() => import('./pages/iot/device'));
const Product = lazy(() => import('./pages/iot/product'));
const Alarm = lazy(() => import('./pages/iot/alarm'));
const Network = lazy(() => import('./pages/iot/network'));
const SystemUser = lazy(() => import('./pages/system/user'));
const SystemRole = lazy(() => import('./pages/system/role'));
const SystemMenu = lazy(() => import('./pages/system/menu'));
const SystemDict = lazy(() => import('./pages/system/dict'));
const SystemConfig = lazy(() => import('./pages/system/config'));
const Personal = lazy(() => import('./pages/personal'));
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
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <LazyRoute>{children}</LazyRoute>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<Login />} />
      
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
        <Route path="product/*" element={<Product />} />
        <Route path="alarm/*" element={<Alarm />} />
        <Route path="network/*" element={<Network />} />
        
        {/* 系统管理 */}
        <Route path="system/user/*" element={<SystemUser />} />
        <Route path="system/role/*" element={<SystemRole />} />
        <Route path="system/menu/*" element={<SystemMenu />} />
        <Route path="system/dict/*" element={<SystemDict />} />
        <Route path="system/config/*" element={<SystemConfig />} />
        
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
