import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import sysApi from '../../../../api/system';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGateways = async () => {
      setLoading(true);
      try {
        const res: any = await sysApi.system.dict.dataList({ dictType: 'notice_send_gateway', status: 1, pageSize: 999 });
        const list = res?.list || res?.data || res?.Data || [];
        const mapped = Array.isArray(list)
          ? list.map((item: any) => ({
              value: item.dictValue,
              label: item.dictLabel,
              remark: item.remark || '',
              status: Number(item.status ?? 1),
            }))
          : [];
        setGateways(mapped);
      } catch (error) {
        setGateways([
          { value: 'dingtalk', label: '钉钉', remark: '通过钉钉群机器人发送通知', status: 1 },
          { value: 'wechat', label: '企业微信', remark: '通过企业微信发送通知', status: 1 },
          { value: 'email', label: '邮件', remark: '通过邮件发送通知', status: 1 },
          { value: 'webhook', label: 'Webhook', remark: '通过Webhook发送通知', status: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
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

  return (
    <div className="notice-config-container">
      <Card title="通知服务配置" loading={loading}>
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
                    >
                      管理
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
