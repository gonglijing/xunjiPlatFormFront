import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Switch, Space } from 'antd';
import { UserOutlined, LockOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUserInfo, setPermissions } from '../../store/slice/userSlice';
import { setMenus } from '../../store/slice/menuSlice';
import { setTheme } from '../../store/slice/appSlice';
import sysApi from '../../api/system';
import { encrypt } from '../../utils/rsa';
import { normalizeAssetUrl } from '../../utils/url';
import { applyThemeToDocument } from '../../utils/theme';
import './index.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [ssoList, setSsoList] = useState<any[]>([]);
  const [sysinfo, setSysinfo] = useState({
    systemName: 'XunjiIOT',
    systemLogo: '',
    systemLoginPIC: '',
    buildVersion: '',
    buildTime: '',
    systemCopyright: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const redirect = decodeURIComponent(searchParams.get('redirect') || '/');
  const redirectParamsText = searchParams.get('params');

  // 切换深色模式
  const toggleDarkMode = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    dispatch(setTheme(theme));
    applyThemeToDocument(theme);
  };

  // 格式化时间问候语
  const getTimeState = () => {
    const timeNow = new Date();
    const hours = timeNow.getHours();
    if (hours >= 6 && hours < 12) return '早上好';
    if (hours >= 12 && hours < 18) return '下午好';
    if (hours >= 18 && hours < 24) return '晚上好';
    return '凌晨好';
  };

  useEffect(() => {
    // 获取系统信息用于显示
    sysApi.sysinfo().then((res: any) => {
      const info = res?.data || res;
      setSysinfo(info || {});
    }).catch((err: any) => {
      console.error('获取系统信息失败:', err);
    }).finally(() => setShowImg(true));

    sysApi.login.ssoList().then((res: any) => {
      let providers: any[] = [];
      const listSource = res?.data || res;
      if (Array.isArray(listSource)) {
        providers = listSource;
      } else if (Array.isArray(listSource?.providers)) {
        providers = listSource.providers;
      } else if (Array.isArray(res?.providers)) {
        providers = res.providers;
      } else if (Array.isArray(listSource?.list)) {
        providers = listSource.list;
      } else if (Array.isArray(res?.list)) {
        providers = res.list;
      }
      setSsoList(providers.filter((item) => Number(item?.status) === 1));
    }).catch(() => {
      setSsoList([]);
    });
  }, []);

  const parseRedirectQuery = () => {
    if (!redirectParamsText) {
      return undefined;
    }
    try {
      const parsed = JSON.parse(decodeURIComponent(redirectParamsText));
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  const gotoAfterLogin = () => {
    const query = parseRedirectQuery();
    if (redirect && redirect !== '/') {
      navigate({
        pathname: redirect,
        search: query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : '',
      }, { replace: true });
      return;
    }

    const sys = JSON.parse(localStorage.getItem('sysinfo') || '{}');
    navigate(sys.systemHomePageRoute || '/home', { replace: true });
  };

  const oauthLogin = async (provider: string) => {
    try {
      const callbackUrl = encodeURIComponent(`${window.location.origin}/#/sso/${provider}`);
      window.location.href = `/api/v1/oauth/login?provider=${provider}&redirect_uri=${callbackUrl}`;
    } catch {
      message.error('SSO 登录暂不可用');
    }
  };

  const onFinish = async (values: { userName: string; password: string }) => {
    if (loading) return;
    setLoading(true);

    try {
      // 检查是否启用 RSA 加密
      let password = values.password;
      if (sessionStorage.isRsaEnabled === '1') {
        password = encrypt(values.password);
      }

      const res = await sysApi.login.login({
        userName: values.userName,
        password: password,
      });
      const loginRes = res?.data || res;

      const token = loginRes?.token || res?.token;
      if (!token) {
        message.error('登录失败');
        return;
      }

      if (Number(loginRes?.isChangePwd) === 1 || Number(res?.isChangePwd) === 1) {
        message.error(`密码已超过${sessionStorage.sysPasswordChangePeriod || '--'}天未修改，请先修改密码再登录`);
        return;
      }

      dispatch(setToken(token));

      const [columnRes, buttonRes, uploadFileRes] = await Promise.all([
        sysApi.getInfoByKey('sys.column.switch').catch(() => null),
        sysApi.getInfoByKey('sys.button.switch').catch(() => null),
        sysApi.getInfoByKey('sys.uploadFile.way').catch(() => null),
      ]);
      const isSecurityControlEnabled = sessionStorage.getItem('isSecurityControlEnabled') || '';
      localStorage.setItem('btnNoAuth', (isSecurityControlEnabled && Number(buttonRes?.data?.configValue)) ? '' : '1');
      localStorage.setItem('colNoAuth', (isSecurityControlEnabled && Number(columnRes?.data?.configValue)) ? '' : '1');
      localStorage.setItem('uploadFileWay', uploadFileRes?.data?.configValue || '0');

      const currentUserRes: any = await sysApi.login.currentUser();
      const currentRes = currentUserRes?.data || currentUserRes;
      const user = currentRes?.Info || currentRes?.info || currentRes?.userInfo || loginRes?.userInfo || {};
      const menuTree = currentRes?.Data || currentRes?.data || [];

      const mergedUserInfo = {
        ...user,
        avatar: normalizeAssetUrl(user?.avatar),
      };
      dispatch(setUserInfo(mergedUserInfo));
      dispatch(setPermissions(user?.permissions || []));
      dispatch(setMenus(Array.isArray(menuTree) ? menuTree : []));
      localStorage.setItem('userId', String(user?.id || user?.Id || ''));

      message.success(`${getTimeState()}，登录成功`);
      gotoAfterLogin();
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ opacity: showImg ? 1 : 0 }}>
      {/* 深色模式切换 */}
      <Switch
        className="login-theme-switch"
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        onChange={toggleDarkMode}
      />

      <div className="login-left">
        <div className="login-logo">
          {sysinfo.systemLogo && <img src={sysinfo.systemLogo} alt="logo" className="logo-img" />}
          <span className="logo-text">{sysinfo.systemName}</span>
        </div>

        <img
          src={sysinfo.systemLoginPIC || '/imgs/login-box-bg.svg'}
          alt="login"
          className="login-image"
        />

        <div className="login-version">
          {sysinfo.buildVersion && <span>v{sysinfo.buildVersion}</span>}
          {sysinfo.buildTime && <span>{new Date(sysinfo.buildTime).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2 className="login-title">账号登录</h2>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="userName"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="off"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="off"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button"
              >
                登 录
              </Button>
            </Form.Item>

            {ssoList.length > 0 && (
              <Form.Item>
                <Space wrap>
                  {ssoList.map((item) => (
                    <Button key={item.name} onClick={() => oauthLogin(item.name)}>
                      {item.name} 登录
                    </Button>
                  ))}
                </Space>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
