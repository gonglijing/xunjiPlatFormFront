import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message } from 'antd';
import noticeApi from '../../../../../../api/notice';

interface EditConfigProps {
  visible: boolean;
  data: any;
  sendGateway: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditConfig: React.FC<EditConfigProps> = ({ visible, data, sendGateway, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
        form.setFieldsValue({ types: 1, sendGateway });
      }
    }
  }, [visible, data, form, sendGateway]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.id) {
        await noticeApi.config.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await noticeApi.config.add({ ...values, sendGateway });
        message.success('新增成功');
      }
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={data?.id ? '编辑通知配置' : '新增通知配置'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="配置名称" rules={[{ required: true }]}>
          <Input placeholder="请输入配置名称" />
        </Form.Item>

        <Form.Item name="types" label="通知方式">
          <Select>
            <Select.Option value={1}>即时发送</Select.Option>
            <Select.Option value={2}>预约发送</Select.Option>
          </Select>
        </Form.Item>

        {sendGateway === 'dingtalk' && (
          <>
            <Form.Item name="access_token" label="Access Token">
              <Input.Password placeholder="请输入Access Token" />
            </Form.Item>
            <Form.Item name="keyword" label="关键字">
              <Input placeholder="请输入关键字" />
            </Form.Item>
          </>
        )}

        {sendGateway === 'wechat' && (
          <>
            <Form.Item name="corp_id" label="企业ID">
              <Input placeholder="请输入企业ID" />
            </Form.Item>
            <Form.Item name="corp_secret" label="应用密钥">
              <Input.Password placeholder="请输入应用密钥" />
            </Form.Item>
            <Form.Item name="agent_id" label="应用ID">
              <Input placeholder="请输入应用ID" />
            </Form.Item>
            <Form.Item name="to_user" label="接收用户">
              <Input placeholder="请输入接收用户" />
            </Form.Item>
          </>
        )}

        {sendGateway === 'email' && (
          <>
            <Form.Item name="smtp_host" label="SMTP服务器">
              <Input placeholder="请输入SMTP服务器" />
            </Form.Item>
            <Form.Item name="smtp_port" label="SMTP端口">
              <Input type="number" placeholder="请输入SMTP端口" />
            </Form.Item>
            <Form.Item name="smtp_user" label="用户名">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item name="smtp_password" label="密码">
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item name="from_user" label="发件人">
              <Input placeholder="请输入发件人" />
            </Form.Item>
            <Form.Item name="to_user" label="收件人">
              <Input placeholder="请输入收件人，多个用逗号分隔" />
            </Form.Item>
          </>
        )}

        {sendGateway === 'webhook' && (
          <Form.Item name="webhook_url" label="Webhook URL">
            <Input placeholder="请输入Webhook URL" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditConfig;
