import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Dropdown, Tooltip } from 'antd';
import {
  CloseOutlined,
  ReloadOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './tagsView.css';

interface TagView {
  path: string;
  title: string;
  fullPath: string;
  affix?: boolean;
}

const TagsView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState('/');
  const [items, setItems] = useState<TagView[]>([]);

  // 标签名称映射
  const tagNameMap: Record<string, string> = {
    '/': '首页',
    '/dashboard': '仪表盘',
    '/iot': 'IoT管理',
    '/iot/alarm': '告警管理',
    '/iot/device': '设备管理',
    '/iot/network': '网络管理',
    '/iot/product': '产品管理',
    '/iot/property': '属性管理',
    '/iot/certificate': '证书管理',
    '/system': '系统管理',
    '/system/user': '用户管理',
    '/system/role': '角色管理',
    '/system/menu': '菜单管理',
    '/system/config': '系统配置',
    '/system/dict': '字典管理',
    '/system/assess': '评估管理',
    '/personal': '个人中心',
  };

  // 初始化标签
  const initTags = useCallback(() => {
    const tags: TagView[] = [
      {
        path: '/',
        title: '首页',
        fullPath: '/',
        affix: true,
      },
    ];
    setItems(tags);
    setActiveKey('/');
  }, []);

  // 添加标签
  const addTag = useCallback(() => {
    const path = location.pathname;
    const title = tagNameMap[path] || path;

    // 如果已存在，不重复添加
    if (items.some((item) => item.path === path)) {
      setActiveKey(path);
      return;
    }

    const newTag: TagView = {
      path,
      title,
      fullPath: location.pathname + location.search,
    };

    setItems([...items, newTag]);
    setActiveKey(path);
  }, [items, location]);

  useEffect(() => {
    addTag();
  }, [addTag]);

  // 刷新页面
  const refreshPage = () => {
    window.location.reload();
  };

  // 关闭标签
  const closeTag = (path: string) => {
    if (items.length <= 1) return;

    const index = items.findIndex((item) => item.path === path);
    const newItems = items.filter((item) => item.path !== path);

    if (path === activeKey) {
      const newIndex = index > 0 ? index - 1 : 0;
      setActiveKey(newItems[newIndex].path);
      navigate(newItems[newIndex].path);
    }

    setItems(newItems);
  };

  // 右键菜单
  const onContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();

    const menuItems = [
      {
        key: 'refresh',
        icon: <ReloadOutlined />,
        label: '刷新',
      },
      {
        key: 'close',
        icon: <CloseOutlined />,
        label: '关闭',
        disabled: items.length <= 1,
      },
      {
        key: 'closeOther',
        icon: <CloseOutlined />,
        label: '关闭其他',
      },
      {
        key: 'closeLeft',
        icon: <ColumnWidthOutlined />,
        label: '关闭左侧',
      },
      {
        key: 'closeRight',
        icon: <ColumnWidthOutlined />,
        label: '关闭右侧',
      },
    ];

    // 过滤选项
    const currentIndex = items.findIndex((item) => item.path === path);
    if (currentIndex === 0) {
      menuItems[3].disabled = true;
    }
    if (currentIndex === items.length - 1) {
      menuItems[4].disabled = true;
    }

    // 显示菜单
    // 注意：在实际项目中需要使用 Dropdown 的 open 方法，这里简化处理
  };

  // 点击标签
  const onTabClick = (key: string) => {
    navigate(key);
    setActiveKey(key);
  };

  // 移除其他标签
  const closeOther = () => {
    const affixTag = items.find((item) => item.path === '/');
    setItems(affixTag ? [affixTag] : []);
    setActiveKey('/');
    navigate('/');
  };

  // 关闭左侧标签
  const closeLeft = () => {
    const currentIndex = items.findIndex((item) => item.path === activeKey);
    const newItems = items.slice(currentIndex);
    setItems(newItems);
  };

  // 关闭右侧标签
  const closeRight = () => {
    const currentIndex = items.findIndex((item) => item.path === activeKey);
    const newItems = items.slice(0, currentIndex + 1);
    setItems(newItems);
  };

  return (
    <div className="tagsView-container">
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onTabClick={onTabClick}
        hideAdd
        onEdit={(key, action) => {
          if (action === 'remove') {
            closeTag(key as string);
          }
        }}
        items={items.map((item) => ({
          key: item.path,
          label: (
            <span onContextMenu={(e) => onContextMenu(e, item.path)}>
              <Tooltip title={item.title} placement="bottom">
                <span>{item.title}</span>
              </Tooltip>
            </span>
          ),
        }))}
      />
    </div>
  );
};

export default TagsView;
