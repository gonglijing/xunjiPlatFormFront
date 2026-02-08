import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, TreeSelect, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditMenuProps {
  visible: boolean;
  data: any;
  menuTree: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditMenu: React.FC<EditMenuProps> = ({ visible, data, menuTree, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          ...data,
          pid: data.pid || 0,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ type: 0, isHide: 0, orderNum: 1, pid: 0 });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.id) {
        await sysApi.menu.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.menu.add(values);
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
      title={data?.id ? '编辑菜单' : '新增菜单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="pid" label="上级菜单">
          <TreeSelect
            treeData={[{ id: 0, title: '根目录', children: menuTree }]}
            fieldNames={{ value: 'id', label: 'title', children: 'children' }}
            placeholder="请选择上级菜单"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="title" label="菜单名称" rules={[{ required: true }]}>
          <Input placeholder="请输入菜单名称" />
        </Form.Item>
        <Form.Item name="icon" label="菜单图标">
          <Input placeholder="请输入菜单图标（如: icon-home）" />
        </Form.Item>
        <Form.Item name="path" label="路由路径">
          <Input placeholder="请输入路由路径" />
        </Form.Item>
        <Form.Item name="component" label="组件路径">
          <Input placeholder="请输入组件路径（如: layout/index）" />
        </Form.Item>
        <Form.Item name="orderNum" label="排序">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入排序" />
        </Form.Item>
        <Form.Item name="type" label="菜单类型">
          <Select
            options={[
              { label: '目录', value: 0 },
              { label: '菜单', value: 1 },
              { label: '按钮', value: 2 },
            ]}
          />
        </Form.Item>
        <Form.Item name="isHide" label="显示状态">
          <Select
            options={[
              { label: '显示', value: 0 },
              { label: '隐藏', value: 1 },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMenu;
