import React, { useState, useEffect } from 'react';
import { Card, Tree, Table, Button, Space, Input, message, Modal } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import deviceApi from '../../../../api/device';
import EditDossier from './component/editDossier';
import './index.css';

interface DossierItem {
  id: number;
  deviceName: string;
  deviceKey: string;
  deviceNumber: string;
  deviceCategory: string;
  installTime: string;
}

const DossierList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<DossierItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
    categoryId: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DossierItem | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const fetchTreeData = async () => {
    try {
      const res: any = await deviceApi.dev_asset.getList({});
      setTreeData(res.Data || []);
    } catch (error) {
      console.error('获取分类树失败');
    }
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const res: any = await deviceApi.dev_asset.getList(params);
      setTableData(res.Data || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取档案列表失败');
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

  const handleEdit = (record: DossierItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = (record: DossierItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除档案 "${record.deviceName}" 吗?`,
      onOk: async () => {
        message.info('删除功能开发中');
      },
    });
  };

  const columns = [
    { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
    { title: '设备KEY', dataIndex: 'deviceKey', key: 'deviceKey', width: 150, ellipsis: true },
    { title: '设备编码', dataIndex: 'deviceNumber', key: 'deviceNumber', width: 120 },
    { title: '设备类型', dataIndex: 'deviceCategory', key: 'deviceCategory', width: 120 },
    { title: '安装时间', dataIndex: 'installTime', key: 'installTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: DossierItem) => (
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
    <div className="dossier-list-container">
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
        <Card title="设备档案" style={{ flex: 1 }}>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input
              placeholder="名称"
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
              新增档案
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

      <EditDossier
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchTableData}
      />
    </div>
  );
};

export default DossierList;
