import React, { useState, useEffect } from 'react';
import { Card, Menu, Alert } from 'antd';
import BasicConfig from './basic';
import SafeConfig from './safe';
import './index.css';

const BasicConfigPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');

  const menuItems = [
    { key: '1', label: '基础配置' },
    { key: '2', label: '安全配置' },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case '1':
        return <BasicConfig />;
      case '2':
        return <SafeConfig />;
      default:
        return <BasicConfig />;
    }
  };

  return (
    <div className="basic-config-container">
      <Card style={{ width: 240, float: 'left' }} bodyStyle={{ padding: 0 }}>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={({ key }) => setActiveKey(key)}
          style={{ width: 240, borderRight: 0 }}
          items={menuItems}
        />
      </Card>
      <Card style={{ flex: 1, marginLeft: 16 }}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default BasicConfigPage;
