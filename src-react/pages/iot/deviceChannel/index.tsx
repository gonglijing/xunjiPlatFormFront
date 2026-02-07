import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import deviceApi from '../../../api/device';
import './index.css';

interface ChannelItem {
  id?: number;
  number?: string;
  title?: string;
  connectType?: string;
  slaveId?: string;
  createdAt?: string;
}

const DeviceChannelPage: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ChannelItem | null>(null);
  const [rows, setRows] = useState<ChannelItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchList = async () => {
    setLoading(true);
    try {
      const query = queryForm.getFieldsValue();
      const res: any = await deviceApi.channel.getList({
        page: pageNum,
        size: pageSize,
        ...query,
      });
      const payload = res?.data || res;
      const list = payload?.list || payload?.Data || payload || [];
      const count = payload?.total || payload?.Total || 0;
      setRows(Array.isArray(list) ? list : []);
      setTotal(Number(count) || 0);
    } catch {
      message.error('获取通道列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [pageNum, pageSize]);

  const handleSearch = () => {
    setPageNum(1);
    fetchList();
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    editForm.resetFields();
    setModalOpen(true);
  };

  const handleOpenEdit = (row: ChannelItem) => {
    setEditingRow(row);
    editForm.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = async (row: ChannelItem) => {
    try {
      await deviceApi.channel.del({ number: row.number, id: row.id });
      message.success('删除成功');
      fetchList();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = await editForm.validateFields();
      if (editingRow) {
        await deviceApi.channel.edit({ ...editingRow, ...values });
      } else {
        await deviceApi.channel.add(values);
      }
      message.success(editingRow ? '更新成功' : '创建成功');
      setModalOpen(false);
      fetchList();
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="device-channel-page">
      <Card
        title="设备通道"
        extra={(
          <Space>
            <Form form={queryForm} layout="inline">
              <Form.Item name="title" label="通道名称">
                <Input placeholder="请输入通道名称" allowClear />
              </Form.Item>
              <Form.Item name="number" label="编号">
                <Input placeholder="请输入编号" allowClear />
              </Form.Item>
            </Form>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button icon={<SyncOutlined />} onClick={fetchList}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增通道</Button>
          </Space>
        )}
      >
        <Table
          rowKey={(row) => row.number || String(row.id)}
          dataSource={rows}
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            },
          }}
          columns={[
            { title: '通道编号', dataIndex: 'number', key: 'number', width: 180 },
            { title: '通道名称', dataIndex: 'title', key: 'title', width: 180 },
            { title: '连接类型', dataIndex: 'connectType', key: 'connectType', width: 150 },
            { title: '设备地址', dataIndex: 'slaveId', key: 'slaveId', width: 120 },
            { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
            {
              title: '操作',
              key: 'action',
              width: 180,
              render: (_: any, row: ChannelItem) => (
                <Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEdit(row)}>编辑</Button>
                  <Popconfirm title="确认删除该通道？" onConfirm={() => handleDelete(row)}>
                    <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingRow ? '编辑通道' : '新增通道'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="通道名称" rules={[{ required: true, message: '请输入通道名称' }]}>
            <Input placeholder="请输入通道名称" />
          </Form.Item>
          <Form.Item name="number" label="通道编号" rules={[{ required: true, message: '请输入通道编号' }]}>
            <Input placeholder="请输入通道编号" disabled={Boolean(editingRow?.number)} />
          </Form.Item>
          <Form.Item name="connectType" label="连接类型">
            <Input placeholder="如 TCP/RTU" />
          </Form.Item>
          <Form.Item name="slaveId" label="设备地址">
            <Input placeholder="请输入设备地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceChannelPage;

