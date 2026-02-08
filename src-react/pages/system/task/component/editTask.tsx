import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditTaskProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 0, misfirePolicy: 3 });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.jobId) {
        await sysApi.system.task.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.system.task.add(values);
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
      title={data?.jobId ? '编辑任务' : '新增任务'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="jobName" label="任务名称" rules={[{ required: true }]}>
          <Input placeholder="请输入任务名称" />
        </Form.Item>

        <Form.Item name="jobGroup" label="任务分组" rules={[{ required: true }]}>
          <Select placeholder="请选择任务分组">
            <Select.Option value="DEFAULT">默认</Select.Option>
            <Select.Option value="SYSTEM">系统</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="invokeTarget" label="调用目标" rules={[{ required: true }]}>
          <Input placeholder="请输入调用目标 (如: ryTask.ryParams)" />
        </Form.Item>

        <Form.Item name="cronExpression" label="Cron表达式" rules={[{ required: true }]}>
          <Input placeholder="请输入Cron表达式 (如: 0/5 * * * * ?)" />
        </Form.Item>

        <Form.Item name="misfirePolicy" label="执行策略">
          <Select placeholder="请选择执行策略">
            <Select.Option value={1}>立即执行</Select.Option>
            <Select.Option value={2}>执行一次</Select.Option>
            <Select.Option value={3}>放弃执行</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={0}>启用</Select.Option>
            <Select.Option value={1}>禁用</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTask;
