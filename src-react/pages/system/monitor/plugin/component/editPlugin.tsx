import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import sysApi from '../../../../../api/system';

interface EditPluginProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPlugin: React.FC<EditPluginProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      message.success(data?.id ? '编辑成功' : '新增成功');
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
      title={data?.id ? '编辑插件' : '新增插件'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="插件名称" rules={[{ required: true }]}>
          <Input placeholder="请输入插件名称" />
        </Form.Item>
        <Form.Item name="types" label="插件类型" rules={[{ required: true }]}>
          <Select placeholder="请选择插件类型">
            <Select.Option value="protocol">协议插件</Select.Option>
            <Select.Option value="auth">认证插件</Select.Option>
            <Select.Option value="custom">自定义插件</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="handleType" label="功能类型">
          <Input placeholder="请输入功能类型" />
        </Form.Item>
        <Form.Item name="author" label="作者">
          <Input placeholder="请输入作者" />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={3} placeholder="请输入插件说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPlugin;
