import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';
const { Search } = Input;
const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sysApi.user.getList({ pageNum, pageSize, keyWord: searchKey });
      if (res.code === 0 || res.code === 200) {
        setData(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchData(); }, [pageNum, pageSize, searchKey]);
  
  const handleSearch = (value: string) => { setSearchKey(value); setPageNum(1); };
  
  const handleAdd = () => { setEditingUser(null); form.resetFields(); setModalVisible(true); };
  
  const handleEdit = (record: any) => { setEditingUser(record); form.setFieldsValue(record); setModalVisible(true); };
  
  const handleDelete = async (id: number) => {
    try {
      const res = await sysApi.user.del(id);
      if (res.code === 0 || res.code === 200) {
        message.success('删除成功'); fetchData();
      } else { message.error(res.msg || '删除失败'); }
    } catch (error) { message.error('删除失败'); }
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingUser) {
        const res = await sysApi.user.edit({ ...editingUser, ...values });
        if (res.code === 0) { message.success('更新成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '更新失败'); }
      } else {
        const res = await sysApi.user.add(values);
        if (res.code === 0) { message.success('创建成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '创建失败'); }
      }
    } catch (error) { message.error('操作失败'); }
    finally { setLoading(false); }
  };
  
  const columns = [
    { title: '用户名', dataIndex: 'userName', key: 'userName' },
    { title: '昵称', dataIndex: 'userNickname', key: 'userNickname' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: number) => <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除此用户吗?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="user-list-container">
      <Card title="用户管理" extra={
        <Space>
          <Search placeholder="搜索用户" onSearch={handleSearch} style={{ width: 200 }} allowClear />
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{
          current: pageNum, pageSize, total, showSizeChanger: true, showQuickJumper: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, s) => { setPageNum(p); setPageSize(s); },
        }} />
      </Card>
      <Modal title={editingUser ? '编辑用户' : '新增用户'} open={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="用户名" rules={[{ required: true }]}><Input placeholder="请输入用户名" /></Form.Item>
          <Form.Item name="userNickname" label="昵称"><Input placeholder="请输入昵称" /></Form.Item>
          {!editingUser && <Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password placeholder="请输入密码" /></Form.Item>}
        </Form>
      </Modal>
    </div>
  );
};
export default UserList;
