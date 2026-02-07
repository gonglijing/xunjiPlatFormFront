import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, message, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';
const MenuList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sysApi.menu.getList({});
      if (res.code === 0 || res.code === 200) {
        setData(res.data || []);
      }
    } catch (error) { message.error('获取菜单列表失败'); }
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);
  
  const handleAdd = () => { setEditingMenu(null); form.resetFields(); setModalVisible(true); };
  const handleEdit = (record: any) => { setEditingMenu(record); form.setFieldsValue(record); setModalVisible(true); };
  const handleDelete = async (id: number) => {
    try {
      const res = await sysApi.menu.del(id);
      if (res.code === 0) { message.success('删除成功'); fetchData(); }
      else { message.error(res.msg || '删除失败'); }
    } catch (error) { message.error('删除失败'); }
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingMenu) {
        const res = await sysApi.menu.edit({ ...editingMenu, ...values });
        if (res.code === 0) { message.success('更新成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '更新失败'); }
      } else {
        const res = await sysApi.menu.add(values);
        if (res.code === 0) { message.success('创建成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '创建失败'); }
      }
    } catch (error) { message.error('操作失败'); }
    finally { setLoading(false); }
  };
  
  const columns = [
    { title: '菜单名称', dataIndex: 'title', key: 'title' },
    { title: '菜单路径', dataIndex: 'path', key: 'path' },
    { title: '组件路径', dataIndex: 'component', key: 'component' },
    { title: '图标', dataIndex: 'icon', key: 'icon' },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: number) => (t === 0 ? '目录' : t === 1 ? '菜单' : '按钮') },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];
  
  const treeData = data.map((item: any) => ({ title: item.title, key: item.id, children: item.children ? item.children.map((c: any) => ({ title: c.title, key: c.id })) : [] }));
  
  return (
    <div className="menu-list-container">
      <Card title="菜单管理" extra={
        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增菜单</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
      <Modal title={editingMenu ? '编辑菜单' : '新增菜单'} open={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)} confirmLoading={loading} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="菜单名称" rules={[{ required: true }]}><Input placeholder="请输入菜单名称" /></Form.Item>
          <Form.Item name="path" label="菜单路径"><Input placeholder="请输入菜单路径" /></Form.Item>
          <Form.Item name="component" label="组件路径"><Input placeholder="请输入组件路径" /></Form.Item>
          <Form.Item name="orderNum" label="排序"><Input type="number" placeholder="请输入排序" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default MenuList;
