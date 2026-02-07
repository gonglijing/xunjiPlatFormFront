import React, { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setMenus } from '../../../store/slice/menuSlice';
import sysApi from '../../../api/system';
import './index.css';

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

interface MenuRenderProps {
  theme?: 'light' | 'dark';
}

const normalizePath = (path?: string) => {
  if (!path) return '/';
  if (path.startsWith('/')) return path;
  return `/${path}`;
};

const MenuRender: React.FC<MenuRenderProps> = ({ theme = 'dark' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { menus } = useSelector((state: RootState) => state.menu);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenus = async () => {
      if (menus.length > 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res: any = await sysApi.login.currentUser();
        const currentRes = res?.data || res;
        const menuTree = currentRes?.Data || currentRes?.data || [];
        dispatch(setMenus(Array.isArray(menuTree) ? menuTree : []));
      } catch (error) {
        console.error('获取菜单失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenus();
  }, [dispatch, menus.length]);
  
  // 转换菜单数据为 Ant Design Menu 格式
  const convertToMenuItems = (menuList: any[]): MenuItem[] => {
    if (!Array.isArray(menuList)) {
      return [];
    }

    return menuList
      .filter((item) => Number(item?.menuType) !== 2 && Number(item?.isHide) !== 1)
      .map((item) => {
        const path = normalizePath(item.path || item.routePath || item.url || item.name);
        const children = item.children ? convertToMenuItems(item.children) : undefined;
        return {
          key: path,
          label: item.title || item.menuName || item.name,
          icon: item.icon ? <span className={`iconfont ${item.icon}`} /> : undefined,
          path,
          children: children && children.length > 0 ? children : undefined,
        };
      })
      .filter((item) => Boolean(item.label));
  };
  
  const handleMenuClick = (e: { key: string }) => {
    if (e.key) {
      navigate(e.key);
    }
  };
  
  // 根据当前路径获取展开的菜单
  const getOpenKeys = () => {
    const path = location.pathname;
    const keys: string[] = [];
    
    const findParent = (items: any[], parentPath = '') => {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        const itemPath = normalizePath(item.path || item.routePath || item.url || item.name);
        if (item.children) {
          const childPath = itemPath || parentPath;
          const found = item.children.some((child: any) => 
            path.startsWith(normalizePath(child.path || child.routePath || child.url || child.name))
          );
          if (found) {
            keys.push(itemPath);
            findParent(item.children, childPath);
          }
        }
      }
    };
    
    findParent(Array.isArray(menus) ? menus : []);
    return keys;
  };
  
  if (loading) {
    return (
      <div className="menu-loading">
        <Spin size="small">
          <div style={{ padding: 50, textAlign: 'center' }}>加载中...</div>
        </Spin>
      </div>
    );
  }
  
  const menuItems = convertToMenuItems(menus);
  
  return (
    <Menu
      mode="inline"
      theme={theme}
      selectedKeys={[location.pathname]}
      defaultOpenKeys={getOpenKeys()}
      items={menuItems}
      onClick={handleMenuClick}
      className="sidebar-menu"
    />
  );
};

export default MenuRender;
