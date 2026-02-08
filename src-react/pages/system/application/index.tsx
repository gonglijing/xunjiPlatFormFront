import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Switch } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import applicationApi from '../../../api/application';
import './index.css';

interface ApplicationItem {
  id: number;
  appName: string;
  appKey: string;
  appSecret: string;
  description: string;
  status: number;
  createdAt: string;
}

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApplicationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ApplicationItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await applicationApi.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取应用列表失败');
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
    setParams({ pageNum: 1, pageSize: 10, keyWord: '' });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: ApplicationItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDetail = (record: ApplicationItem) => {
    navigate(`/application/edit/${record.id}`);
  };

  const handleDelete = (record: ApplicationItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除应用 "${record.appName}" 吗?`,
      onOk: async () => {
        try {
          await applicationApi.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleStatusChange = async (record: ApplicationItem) => {
    try {
      await applicationApi.changeStatus({ id: record.id, status: record.status === 1 ? 0 : 1 });
      message.success('状态修改成功');
      fetchData();
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '应用名称', dataIndex: 'appName', key: 'appName', width: 150 },
    { title: 'AppKey', dataIndex: 'appKey', key: 'appKey', width: 180 },
    { title: 'AppSecret', dataIndex: 'appSecret', key: 'appSecret', width: 180, ellipsis: true },
    { title: '描述', dataIndex: 'description', key: 'description', width: 150, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      width: 180,
      render: (_: any, record: ApplicationItem) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="application-list-container">
      <Card
        title="应用管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增应用
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="应用名称"
            style={{ width: 200 }}
            value={params.keyWord}
            onChange={(e) => setParams({ ...params, keyWord: e.target.value })}
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
    </div>
  );
};

export default ApplicationList;
