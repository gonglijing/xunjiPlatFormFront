// React 应用入口
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './styles/index.css';
import sysApi from './api/system';

// 初始化系统配置
const initSystemConfig = () => {
  sysApi.sysinfo().then((res: any) => {
    localStorage.setItem('sysinfo', JSON.stringify(res));
    // 使用的是 base64 加密的，格式：sysPasswordChangePeriod + "|" + isSecurityControlEnabled + "|" + isRsaEnabled
    if (res.target) {
      const [sysPasswordChangePeriod, isSecurityControlEnabled, isRsaEnabled] = window.atob(res.target).split('|');
      sessionStorage.setItem('isSecurityControlEnabled', Number(isSecurityControlEnabled) ? '1' : '');
      sessionStorage.setItem('isRsaEnabled', (Number(isSecurityControlEnabled) && Number(isRsaEnabled)) ? '1' : '');
      sessionStorage.setItem('sysPasswordChangePeriod', sysPasswordChangePeriod);
    }
  }).catch((err: any) => {
    console.error('初始化系统配置失败:', err);
  });
};

// 初始化配置
initSystemConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> // 移除 StrictMode 以避免 echarts-for-react 卸载错误
    <Provider store={store}>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);
