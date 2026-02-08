import React, { useMemo, useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setMenus } from '../../../store/slice/menuSlice';
import sysApi from '../../../api/system';
import { toCanonicalPath } from '../../../utils/routePath';
import './index.css';

interface MenuTreeItem {
  path?: string;
  routePath?: string;
  url?: string;
  name?: string;
  title?: string;
  menuName?: string;
  icon?: string;
  menuType?: number | string;
  isHide?: number | string;
  children?: MenuTreeItem[];
}

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface MenuRenderProps {
  theme?: 'light' | 'dark';
}

const normalizePath = (path?: string) => toCanonicalPath(path || '/');

const getItemPath = (item: MenuTreeItem, fallbackPath = '/') =>
  normalizePath(item.path || item.routePath || item.url || item.name || fallbackPath);

const convertToMenuItems = (menuList: MenuTreeItem[]): MenuItem[] => {
  if (!Array.isArray(menuList)) {
    return [];
  }

  return menuList
    .filter((item) => Number(item?.menuType) !== 2 && Number(item?.isHide) !== 1)
    .map((item) => {
      const path = getItemPath(item);
      const children = item.children ? convertToMenuItems(item.children) : undefined;

      return {
        key: path,
        label: item.title || item.menuName || item.name || path,
        icon: item.icon ? <span className={`iconfont ${item.icon}`} /> : undefined,
        children: children && children.length > 0 ? children : undefined,
      };
    })
    .filter((item) => Boolean(item.label));
};

const collectOpenKeys = (path: string, items: MenuTreeItem[]) => {
  const keys: string[] = [];

  const walk = (list: MenuTreeItem[]): boolean => {
    for (const item of list) {
      const itemPath = getItemPath(item);
      if (itemPath === path) {
        return true;
      }

      if (item.children?.length) {
        const matched = walk(item.children);
        if (matched) {
          keys.push(itemPath);
          return true;
        }
      }
    }
    return false;
  };

  walk(items);
  return keys;
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

  const handleMenuClick = (e: { key: string }) => {
    if (e.key) {
      navigate(normalizePath(e.key));
    }
  };

  const safeMenus = Array.isArray(menus) ? (menus as MenuTreeItem[]) : [];
  const currentPath = normalizePath(location.pathname);
  const menuItems = useMemo(() => convertToMenuItems(safeMenus), [safeMenus]);
  const openKeys = useMemo(() => collectOpenKeys(currentPath, safeMenus), [currentPath, safeMenus]);

  if (loading) {
    return (
      <div className="menu-loading">
        <Spin size="small">
          <div style={{ padding: 50, textAlign: 'center' }}>加载中...</div>
        </Spin>
      </div>
    );
  }

  return (
    <Menu
      mode="inline"
      theme={theme}
      selectedKeys={[currentPath]}
      openKeys={openKeys}
      items={menuItems}
      onClick={handleMenuClick}
      className="sidebar-menu"
    />
  );
};

export default MenuRender;
