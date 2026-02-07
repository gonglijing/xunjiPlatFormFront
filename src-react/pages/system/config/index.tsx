import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, message, Tabs } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';
const { TabPane } = Tabs;
const ConfigList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // 加载配置数据
    form.setFieldsValue({
      systemName: 'XunjiIOT',
      copyright: '© 2024 Xunji Cloud Technology',
    });
  }, [form]);
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // 保存配置
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="config-list-container">
      <Card title="系统配置">
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本配置" key="1">
            <Form form={form} layout="vertical">
              <Form.Item name="systemName" label="系统名称">
                <Input placeholder="请输入系统名称" />
              </Form.Item>
              <Form.Item name="copyright" label="版权信息">
                <Input.TextArea placeholder="请输入版权信息" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSubmit}>
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="安全配置" key="2">
            <Form form={form} layout="vertical">
              <Form.Item name="tokenExpire" label="Token过期时间(分钟)">
                <Input type="number" placeholder="请输入过期时间" />
              </Form.Item>
              <Form.Item name="captchaEnabled" label="启用验证码" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSubmit}>
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
export default ConfigList;
