import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import systemApi from '../../../api/system';
import './index.css';

interface ApiItem {
  id: number;
  path: string;
  method: string;
  description: string;
  status: number;
  createdAt: string;
}

const ApiList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    path: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApiItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await systemApi.system.api.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取API列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, path: '' });
  };

  const handleRefresh = async () => {
    try {
      await systemApi.system.api.refresh();
      message.success('刷新成功');
      fetchData();
    } catch (error) {
      message.error('刷新失败');
    }
  };

  const showEdit = (record?: ApiItem) => {
    setSelectedItem(record || null);
    setEditVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个API吗？',
      onOk: async () => {
        try {
          await systemApi.system.api.del(id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const methodColors: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red',
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'API路径', dataIndex: 'path', key: 'path', ellipsis: true },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => (
        <Tag color={methodColors[method] || 'default'}>{method}</Tag>
      ),
    },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: ApiItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="system-api-container">
      <Card
        title="API管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showEdit()}>
              新增
            </Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="API路径"
            style={{ width: 200 }}
            value={params.path}
            onChange={(e) => setParams({ ...params, path: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditModal visible={editVisible} data={selectedItem} onClose={() => setEditVisible(false)} onSuccess={fetchData} />
    </div>
  );
};

interface EditModalProps {
  visible: boolean;
  data: ApiItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue(data);
    } else if (visible && !data) {
      form.resetFields();
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (data?.id) {
        await systemApi.system.api.edit({ ...data, ...values });
      } else {
        await systemApi.system.api.add(values);
      }
      message.success(data?.id ? '编辑成功' : '新增成功');
      onSuccess();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={data?.id ? '编辑API' : '新增API'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} labelWidth={80}>
        <Form.Item name="path" label="API路径" rules={[{ required: true }]}>
          <Input placeholder="/api/v1/..." />
        </Form.Item>
        <Form.Item name="method" label="请求方法" rules={[{ required: true }]}>
          <Select placeholder="请选择请求方法">
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入API描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiList;
