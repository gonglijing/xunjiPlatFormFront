import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { toCanonicalPath } from '../../../utils/routePath';
import { resolveRouteTitle } from '../../../utils/routeMeta';
import './breadcrumb.css';

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const pathname = toCanonicalPath(location.pathname);
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: { path: string; breadcrumbName: string }[] = [];

    let currentPath = '';
    paths.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        path: currentPath,
        breadcrumbName: resolveRouteTitle(currentPath, segment),
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
