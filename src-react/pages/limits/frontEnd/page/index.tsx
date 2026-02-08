import React, { useState, useEffect } from 'react';
import { Card, Alert, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LimitsFrontEnd: React.FC = () => {
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState('admin');

  const onRadioChange = (e: any) => {
    setUserAuth(e.target.value);
    message.info('切换用户权限功能演示，请刷新页面查看效果');
  };

  return (
    <div className="limits-front-end-container">
      <Alert
        message="温馨提示"
        description="此权限页面代码及效果只作为演示使用，若出现不可逆转的bug，请尝试刷新页面。"
        type="warning"
        showIcon
      />
      <Alert
        message={`当前用户权限：[${userAuth}]`}
        type="success"
        style={{ marginTop: 16 }}
        showIcon
      />
      <Card headerTitle="切换用户演示，前端控制不同用户显示不同页面、按钮权限" style={{ marginTop: 16 }}>
        <Radio.Group value={userAuth} onChange={onRadioChange}>
          <Radio.Button value="admin">管理员</Radio.Button>
          <Radio.Button value="common">普通用户</Radio.Button>
        </Radio.Group>
      </Card>
    </div>
  );
};

export default LimitsFrontEnd;
