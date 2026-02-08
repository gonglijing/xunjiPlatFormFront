import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, message } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditPost from './component/editPost';
import './index.css';

interface PostItem {
  postId: number;
  postCode: string;
  postName: string;
  postSort: number;
  status: number;
  remark: string;
  createdAt: string;
}

const PostList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    postName: '',
    postCode: '',
    status: -1,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PostItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.post.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取岗位列表失败');
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
    setParams({ pageNum: 1, pageSize: 10, postName: '', postCode: '', status: -1 });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: PostItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = (record: PostItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除岗位 "${record.postName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.post.del(record.postId);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    { title: '岗位编码', dataIndex: 'postCode', key: 'postCode', width: 150 },
    { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
    { title: '排序', dataIndex: 'postSort', key: 'postSort', width: 80 },
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
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: PostItem) => (
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
    <div className="post-list-container">
      <Card title="岗位管理">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="岗位名称"
            style={{ width: 150 }}
            value={params.postName}
            onChange={(e) => setParams({ ...params, postName: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder="岗位编码"
            style={{ width: 150 }}
            value={params.postCode}
            onChange={(e) => setParams({ ...params, postCode: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={params.status === -1 ? undefined : params.status}
            onChange={(value) => setParams({ ...params, status: value ?? -1 })}
          >
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增岗位
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="postId"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditPost
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default PostList;
