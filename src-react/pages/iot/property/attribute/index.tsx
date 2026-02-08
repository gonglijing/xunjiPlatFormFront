import React, { useEffect, useState } from 'react';
import { Card, Tree, Table, Button, Space, Input, message, Modal } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import deviceApi from '../../../../api/device';
import EditAttribute from './component/editAttribute';
import './index.css';

interface AttributeItem {
  id: number;
  name: string;
  title: string;
  types: string;
  createdAt: string;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  keyWord: string;
  categoryId: string;
}

type AnyRecord = Record<string, unknown>;

const asRecord = (value: unknown): AnyRecord => {
  if (typeof value === 'object' && value !== null) {
    return value as AnyRecord;
  }
  return {};
};

const toList = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const AttributeList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<AnyRecord[]>([]);
  const [tableData, setTableData] = useState<AttributeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<QueryParams>({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
    categoryId: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AttributeItem | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const fetchTreeData = async () => {
    try {
      const res = await deviceApi.dev_asset_metadata.getList({});
      const resRecord = asRecord(res);
      const rawPayload = resRecord.data ?? res;
      const payload = asRecord(rawPayload);
      const list = resRecord.Data ?? payload.Data ?? payload.list ?? rawPayload;

      setTreeData(toList<AnyRecord>(list));
    } catch {
      message.error('获取分类树失败');
    }
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const res = await deviceApi.dev_asset_metadata.getList(params);
      const resRecord = asRecord(res);
      const rawPayload = resRecord.data ?? res;
      const payload = asRecord(rawPayload);
      const list = resRecord.Data ?? payload.Data ?? payload.list ?? rawPayload;
      const count = resRecord.total ?? payload.total ?? payload.Total ?? 0;

      setTableData(toList<AttributeItem>(list));
      setTotal(toNumber(count));
    } catch {
      message.error('获取属性列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeData();
    fetchTableData();
  }, [params]);

  const handleTreeSelect = (nextSelectedKeys: React.Key[]) => {
    const keys = nextSelectedKeys.map((item) => String(item));
    setSelectedKeys(keys);
    if (keys.length > 0) {
      setParams({ ...params, categoryId: keys[0] });
    }
  };

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, keyWord: '', categoryId: '' });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: AttributeItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = (record: AttributeItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除属性 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await deviceApi.dev_asset_metadata.delete({ ids: record.id });
          message.success('删除成功');
          fetchTableData();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: TableColumnsType<AttributeItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '字段名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '字段标题', dataIndex: 'title', key: 'title', width: 120 },
    { title: '字段类型', dataIndex: 'types', key: 'types', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: AttributeItem) => (
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
    <div className="attribute-list-container">
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        <Card title="分类" style={{ width: 250 }}>
          <Tree
            treeData={treeData}
            onSelect={handleTreeSelect}
            selectedKeys={selectedKeys}
            fieldNames={{ title: 'label', key: 'id' }}
            height={500}
          />
        </Card>
        <Card title="属性列表" style={{ flex: 1 }}>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input
              placeholder="关键字"
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
              新增属性
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={tableData}
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

      <EditAttribute
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchTableData}
      />
    </div>
  );
};

export default AttributeList;
