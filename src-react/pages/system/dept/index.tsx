import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, message, Switch, Tree } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditDept from './component/editDept';
import './index.css';

interface DeptItem {
  deptId: number;
  parentId: number;
  deptName: string;
  status: number;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  children?: DeptItem[];
}

const DeptList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeptItem[]>([]);
  const [params, setParams] = useState({
    deptName: '',
    status: -1,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DeptItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.dept.getList(params);
      setData(res || []);
    } catch (error) {
      message.error('获取组织列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    setParams({ deptName: '', status: -1 });
  };

  const handleAdd = (record?: DeptItem) => {
    setEditingItem(record || null);
    setEditVisible(true);
  };

  const handleEdit = (record: DeptItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleDelete = (record: DeptItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除组织 "${record.deptName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.dept.del(record.deptId);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    { title: '组织名称', dataIndex: 'deptName', key: 'deptName', width: 200 },
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
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 80 },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 150 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: DeptItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleAdd(record)}>
            新增
          </Button>
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
    <div className="dept-list-container">
      <Card title="组织管理">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="组织名称"
            style={{ width: 200 }}
            value={params.deptName}
            onChange={(e) => setParams({ ...params, deptName: e.target.value })}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增组织
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="deptId"
          loading={loading}
          pagination={false}
          defaultExpandAllRows
        />
      </Card>

      <EditDept
        visible={editVisible}
        data={editingItem}
        deptTree={data}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default DeptList;
