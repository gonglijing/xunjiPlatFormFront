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

const MenuRender: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { menus } = useSelector((state: RootState) => state.menu);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenus = async () => {
      if (menus.length > 0) return;
      
      try {
        setLoading(true);
        const res = await sysApi.menu.getList({});
        if (res.code === 0 || res.code === 200) {
          dispatch(setMenus(res.data || []));
        }
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
    return menuList.map((item) => ({
      key: item.path || item.id?.toString(),
      label: item.title || item.menuName,
      icon: item.icon ? <span className={`iconfont ${item.icon}`} /> : undefined,
      path: item.path,
      children: item.children ? convertToMenuItems(item.children) : undefined,
    }));
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
        if (item.children) {
          const childPath = item.path || parentPath;
          const found = item.children.some((child: any) => 
            path.startsWith(child.path || child.id?.toString())
          );
          if (found) {
            keys.push(item.path || item.id?.toString());
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
      theme="dark"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={getOpenKeys()}
      items={menuItems}
      onClick={handleMenuClick}
      className="sidebar-menu"
    />
  );
};

export default MenuRender;
