import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditBlacklistProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditBlacklist: React.FC<EditBlacklistProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1 });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.id) {
        await sysApi.system.blacklist.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.system.blacklist.add(values);
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
      title={data?.id ? '编辑黑名单' : '新增黑名单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="ip" label="IP地址" rules={[{ required: true }]}>
          <Input placeholder="请输入IP地址" />
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={0}>停用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBlacklist;
