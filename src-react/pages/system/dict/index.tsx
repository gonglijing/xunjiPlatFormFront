import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import systemApi from '../../../api/system';
import './index.css';

interface DictItem {
  id: number;
  name: string;
  type: string;
  description: string;
  status: number;
  createdAt: string;
}

const DictList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    name: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DictItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await systemApi.system.dict.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取字典列表失败');
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
    setParams({ pageNum: 1, pageSize: 10, name: '' });
  };

  const showEdit = (record?: DictItem) => {
    setSelectedItem(record || null);
    setEditVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字典吗？',
      onOk: async () => {
        try {
          await systemApi.system.dict.del(id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '字典名称', dataIndex: 'name', key: 'name' },
    { title: '字典类型', dataIndex: 'type', key: 'type' },
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
      width: 200,
      render: (_: any, record: DictItem) => (
        <Space>
          <Button
            type="link"
            icon={<FolderOutlined />}
            onClick={() => navigate(`/system/dict/data/${record.type}`)}
          >
            数据
          </Button>
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
    <div className="system-dict-container">
      <Card
        title="字典管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showEdit()}>
            新增
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="字典名称"
            style={{ width: 200 }}
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
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
  data: DictItem | null;
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
        await systemApi.system.dict.edit({ ...data, ...values });
      } else {
        await systemApi.system.dict.add(values);
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
      title={data?.id ? '编辑字典' : '新增字典'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} labelWidth={80}>
        <Form.Item name="name" label="字典名称" rules={[{ required: true }]}>
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item name="type" label="字典类型" rules={[{ required: true }]}>
          <Input placeholder="请输入字典类型" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DictList;
