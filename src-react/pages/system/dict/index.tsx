import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';
const DictList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDict, setEditingDict] = useState<any>(null);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sysApi.dict.getTypeList({});
      if (res.code === 0 || res.code === 200) {
        setData(res.data || []);
      }
    } catch (error) { message.error('获取字典列表失败'); }
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);
  
  const handleAdd = () => { setEditingDict(null); form.resetFields(); setModalVisible(true); };
  const handleEdit = (record: any) => { setEditingDict(record); form.setFieldsValue(record); setModalVisible(true); };
  const handleDelete = async (ids: number[]) => {
    try {
      const res = await sysApi.dict.deleteType(ids);
      if (res.code === 0) { message.success('删除成功'); fetchData(); }
      else { message.error(res.msg || '删除失败'); }
    } catch (error) { message.error('删除失败'); }
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingDict) {
        const res = await sysApi.dict.editType({ ...editingDict, ...values });
        if (res.code === 0) { message.success('更新成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '更新失败'); }
      } else {
        const res = await sysApi.dict.addType(values);
        if (res.code === 0) { message.success('创建成功'); setModalVisible(false); fetchData(); }
        else { message.error(res.msg || '创建失败'); }
      }
    } catch (error) { message.error('操作失败'); }
    finally { setLoading(false); }
  };
  
  const columns = [
    { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
    { title: '字典类型', dataIndex: 'dictType', key: 'dictType' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: number) => <Tag color={s === 1 ? 'success' : 'error'}>{s === 1 ? '启用' : '禁用'}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作', key: 'action', render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete([record.id])}>删除</Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="dict-list-container">
      <Card title="字典管理" extra={
        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增字典</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
      <Modal title={editingDict ? '编辑字典' : '新增字典'} open={modalVisible} onOk={handleModalOk} onCancel={() => setModalVisible(false)} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item name="dictName" label="字典名称" rules={[{ required: true }]}><Input placeholder="请输入字典名称" /></Form.Item>
          <Form.Item name="dictType" label="字典类型" rules={[{ required: true }]}><Input placeholder="请输入字典类型" /></Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default DictList;
