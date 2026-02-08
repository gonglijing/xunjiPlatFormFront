import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import sysApi from '../../../../../api/system';

interface EditDicDataProps {
  visible: boolean;
  data: any;
  dictType: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDicData: React.FC<EditDicDataProps> = ({ visible, data, dictType, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
        form.setFieldsValue({ dictSort: 1, status: 1 });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.dictCode) {
        await sysApi.system.dict.editData({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.system.dict.addData({ ...values, dictType });
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
      title={data?.dictCode ? '编辑字典数据' : '新增字典数据'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="dictLabel" label="字典标签" rules={[{ required: true }]}>
          <Input placeholder="请输入字典标签" />
        </Form.Item>
        <Form.Item name="dictValue" label="字典键值" rules={[{ required: true }]}>
          <Input placeholder="请输入字典键值" />
        </Form.Item>
        <Form.Item name="dictSort" label="排序">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入排序" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDicData;
