import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Upload } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import EditPlugin from './component/editPlugin';
import './index.css';

interface PluginItem {
  id: number;
  name: string;
  types: string;
  handleType: string;
  description: string;
  author: string;
  status: number;
}

const PluginList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PluginItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PluginItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.monitor.plugin(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取插件列表失败');
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

  const handleEdit = (record: PluginItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleStatusChange = async (record: PluginItem, status: number) => {
    try {
      message.info('状态切换功能开发中');
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = (record: PluginItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除插件 "${record.name}" 吗?`,
      onOk: async () => {
        message.info('删除功能开发中');
      },
    });
  };

  const handleUpload = () => {
    message.info('上传插件功能开发中');
  };

  const getStatusTag = (status: number) => {
    const config: Record<number, { color: string; text: string }> = {
      1: { color: 'success', text: '正常' },
      0: { color: 'error', text: '停用' },
      '-1': { color: 'default', text: '未知' },
    };
    const item = config[status] || config[-1];
    return <Tag color={item.color}>{item.text}</Tag>;
  };

  const columns = [
    { title: '序号', width: 80, render: (_: any, __: any, index: number) => (params.pageSize * (params.pageNum - 1) + index + 1) },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '插件类型', dataIndex: 'types', key: 'types', width: 120 },
    { title: '功能类型', dataIndex: 'handleType', key: 'handleType', width: 120 },
    { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PluginItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 1 ? (
            <Button type="link" size="small" onClick={() => handleStatusChange(record, 0)}>
              停用
            </Button>
          ) : (
            <Button type="link" size="small" onClick={() => handleStatusChange(record, 1)}>
              启用
            </Button>
          )}
          {record.status === 0 && (
            <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="plugin-list-container">
      <Card title="插件监控">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="关键字"
            style={{ width: 180 }}
            value={params.keyWord}
            onChange={(e) => setParams({ ...params, keyWord: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<SyncOutlined />} onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={handleUpload}>
            上传插件ZIP
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增插件
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

      <EditPlugin
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default PluginList;
