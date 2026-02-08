import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Select } from 'antd';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';

interface DbInitItem {
  id: number;
  name: string;
  dsn: string;
  dbName: string;
  dbType: string;
  status: number;
  remark: string;
  createdAt: string;
}

const DbInitList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DbInitItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DbInitItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.dbInit.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取数据源列表失败');
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

  const handleEdit = (record: DbInitItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleTest = async (record: DbInitItem) => {
    try {
      await sysApi.system.dbInit.test(record.id);
      message.success('连接测试成功');
    } catch (error) {
      message.error('连接测试失败');
    }
  };

  const handleSync = async (record: DbInitItem) => {
    Modal.confirm({
      title: '同步数据',
      content: `确定要同步数据源 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.dbInit.sync(record.id);
          message.success('同步成功');
        } catch (error) {
          message.error('同步失败');
        }
      },
    });
  };

  const handleDelete = (record: DbInitItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除数据源 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.dbInit.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const getDbTypeName = (type: string) => {
    const types: Record<string, string> = {
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      sqlite: 'SQLite',
      mssql: 'SQL Server',
      oracle: 'Oracle',
    };
    return types[type] || type;
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '数据库类型', dataIndex: 'dbType', key: 'dbType', width: 120, render: (type: string) => getDbTypeName(type) },
    { title: '数据库名称', dataIndex: 'dbName', key: 'dbName', width: 120 },
    { title: 'DSN', dataIndex: 'dsn', key: 'dsn', width: 200, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '正常' : '异常'}
        </Tag>
      ),
    },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 150, ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: DbInitItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<ReloadOutlined />} onClick={() => handleTest(record)}>
            测试
          </Button>
          <Button type="link" size="small" onClick={() => handleSync(record)}>
            同步
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dbinit-list-container">
      <Card title="数据源管理">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="数据源名称"
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增数据源
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

export default DbInitList;
