import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';
const RoleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sysApi.role.getList({ pageNum, pageSize });
      if (res.code === 0 || res.code === 200) {
        setData(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    } catch (error) { message.error('获取角色列表失败'); }
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, [pageNum, pageSize]);
  
  const handleAdd = () => { setEditingRole(null); form.resetFields(); setModalVisible(true); };
  const handleEdit = (record: any) => { setEditingRole(record); form.setFieldsValue(record); setModalVisible(true); };
  const handleDelete = async (id: number) => {
    try {
      const res = await sysApi.role.deleteRole(id);
      if (res.code === 0) { message.success('删除成功'); fetchData(); }
      else { message.error(res.msg || '删除失败'); }
    } catch (error) { message.error('删除失败'); }
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingRole) {
        const res = await sysApi.role.editRole({ ...editingRole, ...values });
        if (res.code === 0) { message.success('更新成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '更新失败'); }
      } else {
        const res = await sysApi.role.addRole(values);
        if (res.code === 0) { message.success('创建成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '创建失败'); }
      }
    } catch (error) { message.error('操作失败'); }
    finally { setLoading(false); }
  };
  
  const columns = [
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '角色标识', dataIndex: 'roleKey', key: 'roleKey' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: number) => <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="role-list-container">
      <Card title="角色管理" extra={
        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{
          current: pageNum, pageSize, total, showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, s) => { setPageNum(p); setPageSize(s); },
        }} />
      </Card>
      <Modal title={editingRole ? '编辑角色' : '新增角色'} open={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}><Input placeholder="请输入角色名称" /></Form.Item>
          <Form.Item name="roleKey" label="角色标识" rules={[{ required: true }]}><Input placeholder="请输入角色标识" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default RoleList;
