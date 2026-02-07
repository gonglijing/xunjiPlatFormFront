import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import deviceApi from '../../../api/device';
import './index.css';

interface CategoryItem {
  id: number;
  parentId: number;
  name: string;
  desc?: string;
  sort?: number;
  children?: CategoryItem[];
}

const DeviceCategoryPage: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CategoryItem | null>(null);
  const [tableData, setTableData] = useState<CategoryItem[]>([]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = queryForm.getFieldsValue();
      const res: any = await deviceApi.category.getList(params);
      const payload = res?.data || res;
      const list = payload?.category || payload?.list || payload || [];
      setTableData(Array.isArray(list) ? list : []);
    } catch {
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleOpenAdd = (parentId?: number) => {
    setEditingRow(null);
    editForm.resetFields();
    editForm.setFieldsValue({ parentId: parentId || 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (row: CategoryItem) => {
    setEditingRow(row);
    editForm.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = async (row: CategoryItem) => {
    try {
      await deviceApi.category.del(row.id);
      message.success('删除成功');
      fetchList();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingRow) {
        await deviceApi.category.edit({ ...editingRow, ...values });
      } else {
        await deviceApi.category.add(values);
      }
      message.success(editingRow ? '更新成功' : '创建成功');
      setModalOpen(false);
      fetchList();
    } catch {
      message.error('保存失败');
    }
  };

  return (
    <div className="device-category-page">
      <Card
        title="设备分类"
        extra={(
          <Space>
            <Form form={queryForm} layout="inline" onFinish={fetchList}>
              <Form.Item name="name" label="分类名称">
                <Input placeholder="请输入分类名称" allowClear />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              </Form.Item>
            </Form>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenAdd()}>新增分类</Button>
          </Space>
        )}
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={tableData}
          pagination={false}
          defaultExpandAllRows
          columns={[
            { title: '分类名称', dataIndex: 'name', key: 'name' },
            { title: '描述', dataIndex: 'desc', key: 'desc' },
            { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
            {
              title: '操作',
              key: 'action',
              width: 220,
              render: (_: any, row: CategoryItem) => (
                <Space>
                  <Button type="link" onClick={() => handleOpenAdd(row.id)}>新增</Button>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEdit(row)}>编辑</Button>
                  <Popconfirm title={`确认删除分类：${row.name}？`} onConfirm={() => handleDelete(row)}>
                    <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingRow ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="parentId" hidden><Input /></Form.Item>
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="desc" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <Input type="number" placeholder="请输入排序" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceCategoryPage;

