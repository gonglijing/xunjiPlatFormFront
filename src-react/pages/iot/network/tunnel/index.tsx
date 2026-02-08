import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Switch, Popconfirm } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import networkApi from '../../../../api/network';
import './index.css';

interface TunnelItem {
  id: number;
  name: string;
  serverId: number;
  serverName: string;
  status: number;
  createdAt: string;
}

const TunnelList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TunnelItem[]>([]);
  const [total, setTotal] = useState(0);
  const [key, setKey] = useState('');
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await networkApi.tunnel.getList({
        ...params,
        keyWord: key,
      });
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取通道列表失败');
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
    setKey('');
    setParams({ pageNum: 1, pageSize: 10 });
  };

  const toCreate = () => {
    navigate('/network/tunnel/create');
  };

  const toDetail = (id: number) => {
    navigate(`/network/tunnel/edit/${id}`);
  };

  const toEdit = (id: number) => {
    navigate(`/network/tunnel/edit/${id}`);
  };

  const handleStatusChange = async (record: TunnelItem) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await networkApi.tunnel.status({ id: record.id, status: newStatus });
      message.success(newStatus ? '已启用' : '已禁用');
      fetchData();
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await networkApi.tunnel.del({ ids: [id] });
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '服务器', dataIndex: 'serverName', key: 'serverName' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>{status === 1 ? '启动' : '未启动'}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: TunnelItem) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => toDetail(record.id)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => toEdit(record.id)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个通道吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
          <Switch
            size="small"
            checked={record.status === 1}
            onChange={() => handleStatusChange(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="network-tunnel-container">
      <Card
        title="网络通道管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={toCreate}>
            新建
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="通道名称"
            style={{ width: 200 }}
            value={key}
            onChange={(e) => setKey(e.target.value)}
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

export default TunnelList;
