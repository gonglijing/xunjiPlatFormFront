import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

interface EditAttributeProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditAttribute: React.FC<EditAttributeProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
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
      title={data?.id ? '编辑属性' : '新增属性'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="字段名称" rules={[{ required: true }]}>
          <Input placeholder="请输入字段名称" />
        </Form.Item>
        <Form.Item name="title" label="字段标题" rules={[{ required: true }]}>
          <Input placeholder="请输入字段标题" />
        </Form.Item>
        <Form.Item name="types" label="字段类型" rules={[{ required: true }]}>
          <Select placeholder="请选择字段类型">
            <Select.Option value="text">文本</Select.Option>
            <Select.Option value="number">数字</Select.Option>
            <Select.Option value="date">日期</Select.Option>
            <Select.Option value="select">下拉选择</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAttribute;
