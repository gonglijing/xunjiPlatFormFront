import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message, Tabs, Popconfirm } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditConfig from './component/editConfig';
import './index.css';

interface ConfigItem {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: number;
  remark: string;
  moduleClassify: string;
}

const ConfigList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConfigItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    configName: '',
    configType: '',
    moduleClassify: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tabList, setTabList] = useState<{ dictLabel: string; dictValue: string }[]>([
    { dictLabel: '全部', dictValue: '' },
  ]);
  const [activeTab, setActiveTab] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.config.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取配置列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initTableData();
  }, []);

  const initTableData = async () => {
    try {
      const res: any = await sysApi.system.dict.dataList({ dictType: 'param_class_type', status: 1 });
      const list = res.list || [];
      setTabList([{ dictLabel: '全部', dictValue: '' }, ...list]);
      fetchData();
    } catch (error) {
      fetchData();
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setParams({ ...params, moduleClassify: key, pageNum: 1 });
  };

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, configName: '', configType: '', moduleClassify: activeTab });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: ConfigItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = async (record: ConfigItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除配置 "${record.configName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.config.del(record.configId);
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
      content: `确定要删除选中的 ${selectedIds.length} 项配置吗?`,
      onOk: async () => {
        try {
          await Promise.all(selectedIds.map(id => sysApi.system.config.del(id)));
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
    { title: 'ID', dataIndex: 'configId', key: 'configId', width: 80 },
    { title: '参数名称', dataIndex: 'configName', key: 'configName', width: 150 },
    { title: '参数键名', dataIndex: 'configKey', key: 'configKey', width: 150, ellipsis: true },
    { title: '参数键值', dataIndex: 'configValue', key: 'configValue', width: 150 },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '系统内置',
      dataIndex: 'configType',
      key: 'configType',
      width: 100,
      render: (type: number) => (
        <Tag color={type === 1 ? 'success' : 'default'}>
          {type === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ConfigItem) => (
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
    <div className="config-list-container">
      <Card title="参数配置">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="参数名称"
            style={{ width: 200 }}
            value={params.configName}
            onChange={(e) => setParams({ ...params, configName: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="系统内置"
            style={{ width: 120 }}
            allowClear
            value={params.configType ? Number(params.configType) : undefined}
            onChange={(value) => setParams({ ...params, configType: value?.toString() || '' })}
          >
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增参数
          </Button>
          {selectedIds.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
              批量删除 ({selectedIds.length})
            </Button>
          )}
        </Space>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {tabList.map((tab) => (
            <Tabs.TabPane tab={tab.dictLabel} key={tab.dictValue} />
          ))}
        </Tabs>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          rowKey="configId"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditConfig
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default ConfigList;
