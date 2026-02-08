import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, TreeSelect, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditDeptProps {
  visible: boolean;
  data: any;
  deptTree: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditDept: React.FC<EditDeptProps> = ({ visible, data, deptTree, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({ ...data, parentId: data.parentId || undefined });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1, orderNum: 1 });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.deptId) {
        await sysApi.system.dept.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.system.dept.add(values);
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
      title={data?.deptId ? '编辑组织' : '新增组织'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="parentId" label="上级组织">
          <TreeSelect
            treeData={deptTree}
            treeNodeLabelProp="deptName"
            treeNodeValueProp="deptId"
            placeholder="请选择上级组织"
            allowClear
            fieldNames={{ value: 'deptId', label: 'deptName', children: 'children' }}
          />
        </Form.Item>

        <Form.Item name="deptName" label="组织名称" rules={[{ required: true }]}>
          <Input placeholder="请输入组织名称" />
        </Form.Item>

        <Form.Item name="orderNum" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入排序" />
        </Form.Item>

        <Form.Item name="leader" label="负责人">
          <Input placeholder="请输入负责人" />
        </Form.Item>

        <Form.Item name="phone" label="联系电话">
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDept;
