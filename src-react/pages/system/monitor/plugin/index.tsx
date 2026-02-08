import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, message, Upload } from 'antd';
import { SyncOutlined, UploadOutlined } from '@ant-design/icons';
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
  [key: string]: any;
}

const getListAndTotal = (res: any) => {
  const list = res?.list || res?.data?.list || res?.Data || [];
  const total = res?.total ?? res?.data?.total ?? res?.Total ?? list.length;
  return { list, total };
};

const normalizeAuthor = (author: any) => {
  if (Array.isArray(author)) return author.join(',');
  if (typeof author !== 'string') return author || '-';
  try {
    const parsed = JSON.parse(author);
    if (Array.isArray(parsed)) return parsed.join(',');
    return author;
  } catch {
    return author;
  }
};

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
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.plugin.getList(params);
      const { list, total: listTotal } = getListAndTotal(res);
      setData(list);
      setTotal(listTotal);
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
    setParams((prev) => ({ ...prev, pageNum: 1 }));
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, keyWord: '' });
  };

  const handleEdit = (record: PluginItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleStatusChange = async (record: PluginItem, status: number) => {
    try {
      await sysApi.plugin.changeStatus({ id: record.id, status });
      message.success('状态更新成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = (record: PluginItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除插件 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.plugin.del([record.id]);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options || {};
    if (!file) {
      onError?.(new Error('请选择文件'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file as File);

    setUploading(true);
    try {
      await sysApi.plugin.addPluginFile(formData);
      message.success('上传成功');
      onSuccess?.({}, file);
      fetchData();
    } catch (error) {
      message.error('上传失败');
      onError?.(error);
    } finally {
      setUploading(false);
    }
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
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 140,
      render: (author: any) => normalizeAuthor(author),
    },
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
            onChange={(e) => setParams((prev) => ({ ...prev, keyWord: e.target.value }))}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<SyncOutlined />} onClick={handleReset}>
            重置
          </Button>
          <Upload accept=".zip" showUploadList={false} customRequest={handleUpload}>
            <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
              上传插件ZIP
            </Button>
          </Upload>
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
            onChange: (page, pageSize) => setParams((prev) => ({ ...prev, pageNum: page, pageSize })),
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
