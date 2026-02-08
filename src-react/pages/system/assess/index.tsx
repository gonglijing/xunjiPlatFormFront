import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, DatePicker, Select } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import assessApi from '../../../api/assess';
import './index.css';

interface AssessItem {
  id: number;
  name: string;
  type: string;
  status: number;
  createdAt: string;
}

const AssessList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssessItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await assessApi.assess.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取考核列表失败');
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
    navigate('/system/assess');
  };

  const handleEdit = (record: AssessItem) => {
    navigate(`/system/assess?id=${record.id}`);
  };

  const handleGenerate = async (record: AssessItem) => {
    Modal.confirm({
      title: '生成考核',
      content: `确定要为 "${record.name}" 生成考核吗?`,
      onOk: async () => {
        try {
          message.info('生成功能开发中');
        } catch (error) {
          message.error('生成失败');
        }
      },
    });
  };

  const handleDelete = (record: AssessItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除考核 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await assessApi.assess.del(record.id);
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
    { title: '考核名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '考核类型', dataIndex: 'type', key: 'type', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'warning'}>
          {status === 1 ? '已完成' : '进行中'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: AssessItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleGenerate(record)}>
            生成
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="assess-list-container">
      <Card
        title="考核评估"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增考核
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="考核名称"
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

export default AssessList;
