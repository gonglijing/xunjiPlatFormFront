import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import noticeApi from '../../../../../../api/notice';

interface EditTemplateProps {
  visible: boolean;
  data: any;
  sendGateway: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTemplate: React.FC<EditTemplateProps> = ({ visible, data, sendGateway, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!visible) return;

      if (!data?.id) {
        setCurrentTemplate(null);
        form.resetFields();
        return;
      }

      try {
        const res: any = await noticeApi.template.configIddetail(data.id);
        const payload = res?.data || res?.Data || res || {};
        setCurrentTemplate(payload || null);
        form.setFieldsValue({
          code: payload?.code || '',
          title: payload?.title || data?.title || '',
          content: payload?.content || '',
        });
      } catch (error) {
        setCurrentTemplate(null);
        form.setFieldsValue({
          code: '',
          title: data?.title || '',
          content: '',
        });
      }
    };

    loadTemplate();
  }, [visible, data, form]);

  const handleSubmit = async () => {
    if (!data?.id) {
      message.error('请先选择通知配置');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        ...(currentTemplate || {}),
        ...values,
        configId: data.id,
        sendGateway,
      };

      await noticeApi.template.save(payload);
      message.success('模板保存成功');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="设置配置模板"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={680}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="code" label="模板代码" rules={[{ required: true, message: '请输入模板代码' }]}>
          <Input placeholder="请输入代码" />
        </Form.Item>

        <Form.Item name="title" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>

        <Form.Item name="content" label="模板内容" rules={[{ required: true, message: '请输入模板内容' }]}>
          <Input.TextArea rows={8} placeholder="请输入内容" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTemplate;
