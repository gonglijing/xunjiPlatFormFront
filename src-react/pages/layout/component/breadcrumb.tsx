import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './breadcrumb.css';

const { Text } = Typography;

// 面包屑名称映射
const breadcrumbNameMap: Record<string, string> = {
  '/': '首页',
  '/home': '仪表盘',
  '/iot': 'IoT管理',
  '/alarm': '告警管理',
  '/device': '设备管理',
  '/network': '网络管理',
  '/product': '产品管理',
  '/system': '系统管理',
  '/system/user': '用户管理',
  '/system/role': '角色管理',
  '/system/menu': '菜单管理',
  '/system/config': '系统配置',
  '/system/dict': '字典管理',
  '/system/assess': '评估管理',
  '/personal': '个人中心',
};

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 生成面包屑路径
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: { path: string; breadcrumbName: string }[] = [];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = breadcrumbNameMap[currentPath] || path;
      breadcrumbs.push({
        path: currentPath,
        breadcrumbName: name,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="breadcrumb-nav">
      <Breadcrumb
        items={[
          {
            href: '/',
            title: <HomeOutlined />,
          },
          ...breadcrumbs.map((item, index) => ({
            href: item.path,
            title: (
              <span
                className={index === breadcrumbs.length - 1 ? 'breadcrumb-current' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  if (index < breadcrumbs.length - 1) {
                    navigate(item.path);
                  }
                }}
              >
                {item.breadcrumbName}
              </span>
            ),
          })),
        ]}
      />
    </div>
  );
};

export default BreadcrumbNav;
