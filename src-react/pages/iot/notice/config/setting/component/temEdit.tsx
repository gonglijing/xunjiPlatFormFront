import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import noticeApi from '../../../../../../api/notice';

interface EditTemplateProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTemplate: React.FC<EditTemplateProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && data) {
      // Load template data if needed
      form.setFieldsValue({
        title: data.title + ' - 模板',
      });
    } else if (visible && !data) {
      form.resetFields();
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // In a real implementation, this would save the template
      message.success('模板保存成功');
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="模板配置"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="template_title" label="模板标题">
          <Input placeholder="请输入模板标题" />
        </Form.Item>

        <Form.Item name="template_content" label="模板内容">
          <Input.TextArea rows={6} placeholder="请输入模板内容，支持变量替换，如：{device_name}、{alarm_value}等" />
        </Form.Item>

        <Form.Item name="template_type" label="模板类型">
          <Select placeholder="请选择模板类型">
            <Select.Option value="text">文本模板</Select.Option>
            <Select.Option value="markdown">Markdown模板</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTemplate;
