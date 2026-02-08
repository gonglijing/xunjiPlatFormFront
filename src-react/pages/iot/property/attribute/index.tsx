import React, { useState, useEffect } from 'react';
import { Card, Tree, Table, Button, Space, Input, message } from 'antd';
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

const AttributeList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<AttributeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
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
      const res: any = await deviceApi.dev_asset_metadata.getList({});
      setTreeData(res.Data || []);
    } catch (error) {
      console.error('获取分类树失败');
    }
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const res: any = await deviceApi.dev_asset_metadata.getList(params);
      setTableData(res.Data || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取属性列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeData();
    fetchTableData();
  }, [params]);

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    setSelectedKeys(selectedKeys as string[]);
    if (selectedKeys.length > 0) {
      setParams({ ...params, categoryId: selectedKeys[0] as string });
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
    message.info('删除功能开发中');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '字段名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '字段标题', dataIndex: 'title', key: 'title', width: 120 },
    { title: '字段类型', dataIndex: 'types', key: 'types', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: AttributeItem) => (
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
