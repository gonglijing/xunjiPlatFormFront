import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';

interface EditDossierProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDossier: React.FC<EditDossierProps> = ({ visible, data, onClose, onSuccess }) => {
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
      title={data?.id ? '编辑档案' : '新增档案'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]}>
          <Input placeholder="请输入设备名称" />
        </Form.Item>
        <Form.Item name="deviceKey" label="设备KEY" rules={[{ required: true }]}>
          <Input placeholder="请输入设备KEY" />
        </Form.Item>
        <Form.Item name="deviceNumber" label="设备编码">
          <Input placeholder="请输入设备编码" />
        </Form.Item>
        <Form.Item name="deviceCategory" label="设备类型">
          <Input placeholder="请输入设备类型" />
        </Form.Item>
        <Form.Item name="installTime" label="安装时间">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDossier;
