import React, { useEffect } from 'react';
import { Spin, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setMenus } from '../../store/slice/menuSlice';
import { setToken, setUserInfo } from '../../store/slice/userSlice';
import sysApi from '../../api/system';
import { normalizeAssetUrl } from '../../utils/url';
import './index.css';

const getTimeState = () => {
  const timeNow = new Date();
  const hours = timeNow.getHours();
  if (hours >= 6 && hours < 9) return '早上好';
  if (hours >= 9 && hours < 12) return '上午好';
  if (hours >= 12 && hours < 14) return '中午好';
  if (hours >= 14 && hours < 18) return '下午好';
  if (hours >= 18 && hours < 22) return '晚上好';
  return '夜里好';
};

const SsoLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ type: string }>();

  useEffect(() => {
    let mounted = true;

    const runOauthLogin = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        if (!code) {
          message.error('SSO 回调参数缺失');
          navigate('/login', { replace: true });
          return;
        }

        const type = params.type || '';
        const oauthRes: any = await sysApi.login.oauth({
          code,
          types: type,
          provider: type,
          state: searchParams.get('state') || '',
        });
        const oauthData = oauthRes?.data || oauthRes;

        const token = oauthData?.token || oauthData?.loginUser?.token || oauthData?.userInfo?.token;
        if (!token) {
          message.error('SSO 登录失败，未获取到 token');
          navigate('/login', { replace: true });
          return;
        }

        dispatch(setToken(token));

        const currentUserRes: any = await sysApi.login.currentUser();
        const currentRes = currentUserRes?.data || currentUserRes;
        const currentUserInfo = currentRes?.Info || currentRes?.info || currentRes?.userInfo || null;
        const menuTree = currentRes?.Data || currentRes?.data || [];

        if (currentUserInfo) {
          const userInfo = {
            ...currentUserInfo,
            avatar: normalizeAssetUrl(currentUserInfo.avatar),
          };
          dispatch(setUserInfo(userInfo));
          localStorage.setItem('xunji_user_info', JSON.stringify(userInfo));
          localStorage.setItem('userId', String(currentUserInfo.id || currentUserInfo.Id || ''));
        }

        dispatch(setMenus(Array.isArray(menuTree) ? menuTree : []));

        if (mounted) {
          const sysinfo = JSON.parse(localStorage.getItem('sysinfo') || '{}');
          const homeRoute = sysinfo.systemHomePageRoute || '/home';
          message.success(`${getTimeState()}，登录成功`);
          navigate(homeRoute, { replace: true });
        }
      } catch (error) {
        message.error('SSO 登录失败');
        navigate('/login', { replace: true });
      }
    };

    runOauthLogin();

    return () => {
      mounted = false;
    };
  }, [dispatch, location.search, navigate, params.type]);

  return (
    <div className="sso-page">
      <Spin size="large" tip="SSO 登录中，请稍候..." />
    </div>
  );
};

export default SsoLogin;
