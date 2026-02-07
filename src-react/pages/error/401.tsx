import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Page401: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="error-page">
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default Page401;
