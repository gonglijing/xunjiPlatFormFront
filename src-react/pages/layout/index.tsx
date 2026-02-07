import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Switch } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, setTheme } from '../../store/slice/appSlice';
import { logout } from '../../store/slice/userSlice';
import MenuRender from './navMenu';
import BreadcrumbNav from './component/breadcrumb';
import TagsView from './component/tagsView';
import './index.css';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.app);

  // 切换深色模式
  const toggleDarkMode = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : '');
    document.body.className = checked ? 'dark-theme' : '';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case 'personal':
        navigate('/personal');
        break;
      case 'settings':
        navigate('/system/config');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      key: 'personal',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={theme}
        className="main-sider"
      >
        <div className="logo-container">
          {!collapsed ? (
            <div className="logo-full">
              <img src="/logo.svg" alt="logo" className="logo-img" />
              <span className="logo-text">XunjiIOT</span>
            </div>
          ) : (
            <img src="/logo.svg" alt="logo" className="logo-img-collapsed" />
          )}
        </div>
        <MenuRender />
      </Sider>

      <Layout>
        <Header className="main-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
          </div>

          <div className="header-breadcrumb">
            <BreadcrumbNav />
          </div>

          <div className="header-right">
            <Space size="middle">
              {/* 深色模式切换 */}
              <Switch
                size="small"
                checked={theme === 'dark'}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                onChange={toggleDarkMode}
                className="theme-switch"
              />

              <Badge count={5} size="small">
                <Button type="text" icon={<BellOutlined />} className="header-icon" />
              </Badge>

              <Button
                type="text"
                icon={<FullscreenOutlined />}
                className="header-icon"
                onClick={() => document.documentElement.requestFullscreen()}
              />

              <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
                <div className="user-info">
                  <Avatar
                    src={userInfo?.avatar || '/default-avatar.svg'}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <span className="user-name">{userInfo?.userName || 'Admin'}</span>
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* 标签页 */}
        <TagsView />

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
