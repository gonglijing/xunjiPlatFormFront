import React from 'react';
import { Card, Alert, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LimitsBackEnd: React.FC = () => {
  const navigate = useNavigate();

  const onGoToFrontEndPage = () => {
    navigate('/limits/frontEnd/page');
  };

  return (
    <div className="limits-back-end-container">
      <Alert
        message="温馨提示"
        description="此页面无法模拟后端控制路由，此功能需要后端配合。本地演示请前往前端控制路由页面。"
        type="warning"
        showIcon
      />
      <Card style={{ marginTop: 16 }}>
        <Button type="primary" icon={<RightOutlined />} onClick={onGoToFrontEndPage}>
          立即前往前端控制路由
        </Button>
      </Card>
    </div>
  );
};

export default LimitsBackEnd;
