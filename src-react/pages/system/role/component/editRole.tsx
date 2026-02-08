import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditRoleProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRole: React.FC<EditRoleProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (data?.id) {
      form.setFieldsValue(data);
      return;
    }

    form.resetFields();
    form.setFieldsValue({ status: 1, sort: 0 });
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.id) {
        await sysApi.role.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.role.add(values);
        message.success('新增成功');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('操作失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={data?.id ? '编辑角色' : '新增角色'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item name="code" label="角色标识" rules={[{ required: true, message: '请输入角色标识' }]}>
          <Input placeholder="请输入角色标识" />
        </Form.Item>

        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入排序" />
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="remark" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRole;
