import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { toCanonicalPath } from '../../../utils/routePath';
import { resolveRouteTitle } from '../../../utils/routeMeta';
import './tagsView.css';

interface TagView {
  path: string;
  title: string;
  affix?: boolean;
}

const TagsView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState('/');
  const [items, setItems] = useState<TagView[]>([]);

  const initTags = useCallback(() => {
    const tags: TagView[] = [
      {
        path: '/home',
        title: '仪表盘',
        affix: true,
      },
    ];
    setItems(tags);
    setActiveKey('/home');
  }, []);

  useEffect(() => {
    if (!items.length) {
      initTags();
    }
  }, [initTags, items.length]);

  const addTag = useCallback(() => {
    const path = toCanonicalPath(location.pathname);
    const title = resolveRouteTitle(path);

    setItems((prev) => {
      if (prev.some((item) => item.path === path)) {
        return prev;
      }

      const newTag: TagView = {
        path,
        title,
      };

      return [...prev, newTag];
    });
    setActiveKey(path);
  }, [location.pathname]);

  useEffect(() => {
    addTag();
  }, [addTag]);

  const closeTag = (path: string) => {
    if (items.length <= 1) return;

    const index = items.findIndex((item) => item.path === path);
    const nextItems = items.filter((item) => item.path !== path);

    setItems(nextItems);

    if (path === activeKey) {
      const nextIndex = index > 0 ? index - 1 : 0;
      const nextPath = nextItems[nextIndex]?.path || '/home';
      setActiveKey(nextPath);
      navigate(nextPath);
    }
  };

  const onTabClick = (key: string) => {
    navigate(key);
    setActiveKey(key);
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
            <span>
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
