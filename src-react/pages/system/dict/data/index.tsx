import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message, Popconfirm } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import sysApi from '../../../../api/system';
import EditDicData from './component/editDicData';
import './index.css';

interface DictDataItem {
  id: number;
  dictCode: number;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  status: number;
  remark: string;
}

const DictDataList: React.FC = () => {
  const navigate = useNavigate();
  const { dictType } = useParams<{ dictType: string }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictDataItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    dictLabel: '',
    dictType: dictType || '',
    status: -1,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DictDataItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.dict.dataList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取字典数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dictType) {
      setParams({ ...params, dictType });
    }
  }, [dictType]);

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ ...params, pageNum: 1, pageSize: 10, dictLabel: '', status: -1 });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: DictDataItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = async (record: DictDataItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除字典项 "${record.dictLabel}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.dict.delData(record.dictCode);
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
      content: `确定要删除选中的 ${selectedIds.length} 项字典数据吗?`,
      onOk: async () => {
        try {
          await Promise.all(selectedIds.map(id => sysApi.system.dict.delData(id)));
          message.success('删除成功');
          fetchData();
          setSelectedIds([]);
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 100 },
    { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
    { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue', width: 150 },
    { title: '排序', dataIndex: 'dictSort', key: 'dictSort', width: 80 },
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
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: DictDataItem) => (
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

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as number[]);
    },
  };

  return (
    <div className="dict-data-container">
      <Card
        title={`字典数据 - ${dictType}`}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/system/dict')}>
              返回
            </Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="字典标签"
            style={{ width: 200 }}
            value={params.dictLabel}
            onChange={(e) => setParams({ ...params, dictLabel: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="状态"
            style={{ width: 120 }}
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
            新增
          </Button>
          {selectedIds.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
              批量删除 ({selectedIds.length})
            </Button>
          )}
        </Space>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          rowKey="dictCode"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditDicData
        visible={editVisible}
        data={editingItem}
        dictType={dictType || ''}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default DictDataList;
