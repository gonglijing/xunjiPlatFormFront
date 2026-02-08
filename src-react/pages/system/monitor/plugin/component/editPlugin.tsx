import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Switch } from 'antd';
import sysApi from '../../../../../api/system';

interface EditPluginProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const toCommaText = (value: any) => {
  if (Array.isArray(value)) return value.join(',');
  if (typeof value !== 'string') return value || '';
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join(',');
    return value;
  } catch {
    return value;
  }
};

const EditPlugin: React.FC<EditPluginProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          ...data,
          author: toCommaText(data.author),
          args: toCommaText(data.args),
          frontendUi: Number(data.frontendUi) === 1,
          frontendConfiguration: Number(data.frontendConfiguration) === 1,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await sysApi.plugin.edit({
        ...data,
        ...values,
        frontendUi: values.frontendUi ? 1 : 0,
        frontendConfiguration: values.frontendConfiguration ? 1 : 0,
      });
      message.success('编辑成功');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑插件内容"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="types" label="插件类型" rules={[{ required: true, message: '请输入插件类型' }]}>
          <Input placeholder="请输入插件类型" />
        </Form.Item>
        <Form.Item name="handleType" label="功能类型" rules={[{ required: true, message: '请输入功能类型' }]}>
          <Input placeholder="请输入功能类型" />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={3} placeholder="请输入说明" />
        </Form.Item>
        <Form.Item name="version" label="版本">
          <Input placeholder="请输入版本" />
        </Form.Item>
        <Form.Item name="author" label="作者">
          <Input placeholder="请输入作者，多个用逗号分隔" />
        </Form.Item>
        <Form.Item name="icon" label="插件图标">
          <Input placeholder="请输入图标地址" />
        </Form.Item>
        <Form.Item name="link" label="插件网址">
          <Input placeholder="请输入插件网址" />
        </Form.Item>
        <Form.Item name="command" label="运行指令">
          <Input placeholder="请输入运行指令" />
        </Form.Item>
        <Form.Item name="args" label="指令参数">
          <Input placeholder="请输入指令参数，多个用逗号分隔" />
        </Form.Item>
        <Form.Item name="frontendUi" label="有无插件页面" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => getFieldValue('frontendUi') ? (
            <Form.Item name="frontendUrl" label="插件页面地址">
              <Input placeholder="请输入插件页面地址" />
            </Form.Item>
          ) : null}
        </Form.Item>
        <Form.Item name="frontendConfiguration" label="显示配置页面" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPlugin;
