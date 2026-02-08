import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { SettingOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

interface NoticeGateway {
  value: string;
  label: string;
  remark: string;
  status: number;
}

const NoticeConfigList: React.FC = () => {
  const navigate = useNavigate();
  const [gateways, setGateways] = useState<NoticeGateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching gateways from API
    setGateways([
      { value: 'dingtalk', label: '钉钉', remark: '通过钉钉群机器人发送通知', status: 1 },
      { value: 'wechat', label: '企业微信', remark: '通过企业微信发送通知', status: 1 },
      { value: 'email', label: '邮件', remark: '通过邮件发送通知', status: 1 },
      { value: 'webhook', label: 'Webhook', remark: '通过Webhook发送通知', status: 1 },
    ]);
    setLoading(false);
  }, []);

  const getGatewayIcon = (value: string) => {
    const icons: Record<string, string> = {
      dingtalk: 'dingtalk.svg',
      wechat: 'wechat.svg',
      email: 'email.svg',
      webhook: 'webhook.svg',
    };
    return icons[value] || 'default.svg';
  };

  const toSetting = (value: string) => {
    navigate(`/notice/config/setting/${value}`);
  };

  const toEdit = (value: string) => {
    message.info('配置功能开发中');
  };

  return (
    <div className="notice-config-container">
      <Card title="通知服务配置">
        <Row gutter={[16, 16]}>
          {gateways.filter(g => g.status === 1).map((item) => (
            <Col span={12} key={item.value}>
              <div className="gateway-card">
                <div className="gateway-content">
                  <div className="gateway-left">
                    <img
                      src={`/imgs/notice/${getGatewayIcon(item.value)}`}
                      alt={item.label}
                      className="gateway-icon"
                    />
                    <div className="gateway-info">
                      <div className="gateway-title">{item.label}</div>
                      <div className="gateway-desc">{item.remark}</div>
                    </div>
                  </div>
                  <div className="gateway-right">
                    <Button
                      type="primary"
                      icon={<SettingOutlined />}
                      onClick={() => toSetting(item.value)}
                      style={{ marginRight: 8 }}
                    >
                      管理
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => toEdit(item.value)}
                    >
                      配置
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default NoticeConfigList;
