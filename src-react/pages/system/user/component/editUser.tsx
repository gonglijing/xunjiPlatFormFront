import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, TreeSelect, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditUserProps {
  visible: boolean;
  data: any;
  deptData: any[];
  roleData: any[];
  postData: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditUser: React.FC<EditUserProps> = ({
  visible,
  data,
  deptData,
  roleData,
  postData,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          ...data,
          roleIds: data.roleIds ? data.roleIds.split(',').map(Number) : [],
          postIds: data.postIds ? data.postIds.split(',').map(Number) : [],
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const submitData = {
        ...values,
        roleIds: values.roleIds?.join(','),
        postIds: values.postIds?.join(','),
      };

      if (data?.id) {
        await sysApi.user.edit({ ...data, ...submitData });
        message.success('编辑成功');
      } else {
        await sysApi.user.add(submitData);
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
      title={data?.id ? '编辑用户' : '新增用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="deptId" label="组织" rules={[{ required: true }]}>
          <TreeSelect
            treeData={deptData}
            fieldNames={{ value: 'deptId', label: 'deptName', children: 'children' }}
            placeholder="请选择组织"
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="userNickname" label="姓名" rules={[{ required: true }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        {!data && (
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item name="mobile" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="roleIds" label="角色" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="请选择角色"
            options={roleData.map((r: any) => ({ label: r.name, value: r.id }))}
          />
        </Form.Item>
        <Form.Item name="postIds" label="岗位">
          <Select
            mode="multiple"
            placeholder="请选择岗位"
            options={postData.map((p: any) => ({ label: p.name, value: p.id }))}
          />
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

export default EditUser;
