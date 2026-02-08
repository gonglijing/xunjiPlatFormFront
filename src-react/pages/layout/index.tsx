import React, { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Avatar, Dropdown, Badge, Button, Space, Switch } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  FullscreenOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSidebarCollapsed, setTheme } from '../../store/slice/appSlice';
import { logout } from '../../store/slice/userSlice';
import { clearMenus } from '../../store/slice/menuSlice';
import MenuRender from './navMenu';
import BreadcrumbNav from './component/breadcrumb';
import TagsView from './component/tagsView';
import { applyThemeToDocument } from '../../utils/theme';
import './index.css';

const requestFullscreenSafely = async () => {
  const element = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
    msRequestFullscreen?: () => Promise<void> | void;
  };

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (element.requestFullscreen) {
      await element.requestFullscreen();
      return;
    }
    if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
      return;
    }
    if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    }
  } catch {
    // ignore
  }
};

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { theme, sidebarCollapsed } = useSelector((state: RootState) => state.app);

  // 切换深色模式
  const toggleDarkMode = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    applyThemeToDocument(newTheme);
  };

  const handleLogout = () => {
    dispatch(clearMenus());
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleMenuClick = (e: { key: string }) => {
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

  const userMenuItems = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <Layout className="main-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        theme={theme}
        className="main-sider"
      >
        <div className="logo-container">
          {!sidebarCollapsed ? (
            <div className="logo-full">
              <img src="/logo.svg" alt="logo" className="logo-img" />
              <span className="logo-text">XunjiIOT</span>
            </div>
          ) : (
            <img src="/logo.svg" alt="logo" className="logo-img-collapsed" />
          )}
        </div>
        <MenuRender theme={theme} />
      </Sider>

      <Layout>
        <Header className="main-header">
          <div className="header-left">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))}
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
                onClick={() => requestFullscreenSafely()}
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
