import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import deviceApi from '../../../api/device';
import './index.css';

interface InstanceItem {
  id?: number;
  key?: string;
  name?: string;
  productName?: string;
  status?: number;
  runStatus?: number;
  onlineAt?: string;
  createdAt?: string;
}

const DeviceInstancePage: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<InstanceItem | null>(null);
  const [rows, setRows] = useState<InstanceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {
      const raw = queryForm.getFieldsValue();
      const queryParams = {
        pageNum,
        pageSize,
        ...raw,
      };
      const res: any = await deviceApi.instance.getList(queryParams);
      const payload = res?.data || res;
      const list = payload?.list || payload?.Data || payload || [];
      const count = payload?.total || payload?.Total || 0;
      setRows(Array.isArray(list) ? list : []);
      setTotal(Number(count) || 0);
    } catch {
      message.error('获取设备实例失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [pageNum, pageSize]);

  const handleSearch = async () => {
    setPageNum(1);
    await fetchList();
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    editForm.resetFields();
    setModalOpen(true);
  };

  const handleOpenEdit = (row: InstanceItem) => {
    setEditingRow(row);
    editForm.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = async (row: InstanceItem) => {
    if (!row.key) {
      message.error('缺少 deviceKey，无法删除');
      return;
    }
    try {
      await deviceApi.instance.del([row.key]);
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
      if (editingRow?.key) {
        await deviceApi.instance.edit({ ...editingRow, ...values });
      } else {
        await deviceApi.instance.add(values);
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
    <div className="device-instance-page">
      <Card
        title="设备实例"
        extra={(
          <Space>
            <Form form={queryForm} layout="inline">
              <Form.Item name="name" label="设备名称">
                <Input placeholder="请输入设备名称" allowClear />
              </Form.Item>
              <Form.Item name="key" label="设备标识">
                <Input placeholder="请输入标识" allowClear />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select allowClear style={{ width: 120 }} placeholder="请选择">
                  <Select.Option value={1}>在线</Select.Option>
                  <Select.Option value={0}>离线</Select.Option>
                </Select>
              </Form.Item>
            </Form>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button icon={<SyncOutlined />} onClick={fetchList}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新建设备</Button>
          </Space>
        )}
      >
        <Table
          rowKey={(row) => row.key || String(row.id)}
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
            { title: '设备标识', dataIndex: 'key', key: 'key', width: 180 },
            { title: '设备名称', dataIndex: 'name', key: 'name', width: 200 },
            { title: '所属产品', dataIndex: 'productName', key: 'productName', width: 180 },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (value: number) => (value ? <Tag color="success">在线</Tag> : <Tag>离线</Tag>),
            },
            { title: '在线时间', dataIndex: 'onlineAt', key: 'onlineAt', width: 180 },
            { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
            {
              title: '操作',
              key: 'action',
              fixed: 'right',
              width: 220,
              render: (_: any, row: InstanceItem) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => row.key && navigate(`/device/instance/${row.key}`)}
                  >
                    详情
                  </Button>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEdit(row)}>编辑</Button>
                  <Popconfirm title="确认删除该实例？" onConfirm={() => handleDelete(row)}>
                    <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingRow ? '编辑设备实例' : '新建设备实例'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="设备名称" rules={[{ required: true, message: '请输入设备名称' }]}>
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item name="key" label="设备标识" rules={[{ required: true, message: '请输入设备标识' }]}>
            <Input placeholder="请输入设备标识" disabled={Boolean(editingRow?.key)} />
          </Form.Item>
          <Form.Item name="productKey" label="产品标识" rules={[{ required: true, message: '请输入产品标识' }]}>
            <Input placeholder="请输入产品标识" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceInstancePage;
