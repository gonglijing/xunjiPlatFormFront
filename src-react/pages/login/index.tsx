import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Switch } from 'antd';
import { UserOutlined, LockOutlined, MoonOutlined, SunnyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUserInfo, setPermissions } from '../../store/slice/userSlice';
import { setTheme } from '../../store/slice/appSlice';
import sysApi from '../../api/system';
import { encrypt } from '../../utils/rsa';
import './index.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showImg, setShowImg] = useState(false);
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

  const redirect = location.search.replace('?redirect=', '') || '/';

  // 切换深色模式
  const toggleDarkMode = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    dispatch(setTheme(theme));
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : '');
    document.body.className = checked ? 'dark-theme' : '';
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
      setSysinfo(res);
    }).catch((err: any) => {
      console.error('获取系统信息失败:', err);
    }).finally(() => setShowImg(true));
  }, []);

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
      if (res.code === 0 || res.code === 200) {
        const { token } = res.data;

        // 存储 token
        dispatch(setToken(token));

        // 获取用户信息
        const userRes = await sysApi.login.currentUser();
        if (userRes.code === 0 || userRes.code === 200) {
          dispatch(setUserInfo(userRes.data.userInfo));
          dispatch(setPermissions(userRes.data.permissions || []));
        }

        message.success(`${getTimeState()}，登录成功`);
        navigate(redirect, { replace: true });
      } else {
        message.error(res.msg || '登录失败');
      }
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
        unCheckedChildren={<SunnyOutlined />}
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
