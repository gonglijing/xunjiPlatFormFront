export const toCanonicalPath = (rawPath?: string) => {
  let path = rawPath || '/';
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  path = path.replace(/\/{2,}/g, '/');
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  if (path === '/iotmanager' || path === '/iotmanager/dashboard' || path === '/dashboard') {
    return '/home';
  }

  if (path.startsWith('/iotmanager/noticeservices/')) {
    path = `/notice/${path.slice('/iotmanager/noticeservices/'.length)}`;
  } else if (path.startsWith('/iotmanager/noticeservices')) {
    path = '/notice/config';
  } else if (path.startsWith('/iotmanager/')) {
    path = `/${path.slice('/iotmanager/'.length)}`;
  }

  if (path === '/device/product') {
    path = '/product';
  }
  if (path.startsWith('/device/product/detail/')) {
    path = `/product/detail/${path.slice('/device/product/detail/'.length)}`;
  }

  if (path === '/noticeservices/config') {
    path = '/notice/config';
  }
  if (path === '/noticeservices/log') {
    path = '/notice/log';
  }
  if (path.startsWith('/noticeservices/config/setting/')) {
    path = `/notice/config/setting/${path.slice('/noticeservices/config/setting/'.length)}`;
  }

  if (path.startsWith('/network/server/detail/')) {
    path = `/network/server/edit/${path.slice('/network/server/detail/'.length)}`;
  }
  if (path.startsWith('/network/tunnel/detail/')) {
    path = `/network/tunnel/edit/${path.slice('/network/tunnel/detail/'.length)}`;
  }

  if (path === '/system/manage/blacklist') {
    path = '/system/blacklist';
  }

  return path;
};
