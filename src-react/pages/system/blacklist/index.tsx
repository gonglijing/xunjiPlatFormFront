import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditBlacklist from './component/editBlacklist';
import './index.css';

interface BlacklistItem {
  id: number;
  ip: string;
  remark: string;
  status: number;
  createdAt: string;
}

const Blacklist: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlacklistItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<BlacklistItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.blacklist.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取黑名单列表失败');
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

  const handleEdit = (record: BlacklistItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleStatusChange = async (record: BlacklistItem, status: number) => {
    try {
      await sysApi.blackList.changeStatus({ id: record.id, status });
      message.success(status === 1 ? '已启用' : '已禁用');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = (record: BlacklistItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除黑名单 IP "${record.ip}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.blackList.delete([record.id]);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      message.error('请选择要删除的数据');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedIds.length} 条黑名单吗?`,
      onOk: async () => {
        try {
          await sysApi.blackList.delete(selectedIds);
          message.success('批量删除成功');
          setSelectedIds([]);
          fetchData();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  const columns = [
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 180 },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: BlacklistItem) => (
        <Tag
          color={status === 1 ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleStatusChange(record, status === 1 ? 0 : 1)}
        >
          {status === 1 ? '正常' : '停用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: BlacklistItem) => (
        <Space>
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
    <div className="blacklist-container">
      <Card title="IP黑名单">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="IP地址"
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
            新建
          </Button>
          {selectedIds.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
              批量删除 ({selectedIds.length})
            </Button>
          )}
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as number[]),
          }}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditBlacklist
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Blacklist;
