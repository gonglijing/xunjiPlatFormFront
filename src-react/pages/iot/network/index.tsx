import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import networkApi from '../../../api/network';
import './index.css';
const { Search } = Input;
const NetworkList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await networkApi.server.getList({});
      if (res.code === 0 || res.code === 200) {
        setData(res.data?.list || []);
      }
    } catch (error) { message.error('获取网络服务器列表失败'); }
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);
  
  const handleAdd = () => { form.resetFields(); setModalVisible(true); };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      message.success('操作成功');
      setModalVisible(false);
      fetchData();
    } catch (error) { message.error('操作失败'); }
    finally { setLoading(false); }
  };
  
  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'addr', key: 'addr' },
    { title: '类型', dataIndex: 'types', key: 'types' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: number) => <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '运行中' : '已停止'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];
  
  return (
    <div className="network-list-container">
      <Card title="网络服务器" extra={
        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增服务器</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
      <Modal title="新增服务器" open={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input placeholder="请输入名称" /></Form.Item>
          <Form.Item name="addr" label="地址" rules={[{ required: true }]}><Input placeholder="请输入地址" /></Form.Item>
          <Form.Item name="types" label="类型" rules={[{ required: true }]}><Input placeholder="请输入类型" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default NetworkList;
