import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, SettingOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditRole from './component/editRole';
import Permission from './component/permission';
import './index.css';

interface RoleItem {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  remark: string;
  createdAt: string;
}

const RoleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoleItem[]>([]);
  const [params, setParams] = useState({
    name: '',
    status: -1,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.role.getList(params);
      setData(res || []);
    } catch (error) {
      message.error('获取角色列表失败');
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
    setParams({ name: '', status: -1 });
  };

  const handleAdd = () => {
    setEditingRole(null);
    setEditVisible(true);
  };

  const handleEdit = (record: RoleItem) => {
    setEditingRole(record);
    setEditVisible(true);
  };

  const handleDelete = async (record: RoleItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 "${record.name}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.role.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handlePermission = (record: RoleItem) => {
    setEditingRole(record);
    setPermissionVisible(true);
  };

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '角色标识', dataIndex: 'code', key: 'code', width: 150 },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    { title: '描述', dataIndex: 'remark', key: 'remark', ellipsis: true },
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
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: RoleItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handlePermission(record)}>
            权限
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="role-list-container">
      <Card title="角色管理">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="角色名称"
            style={{ width: 200 }}
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <EditRole
        visible={editVisible}
        data={editingRole}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />

      <Permission
        visible={permissionVisible}
        role={editingRole}
        onClose={() => setPermissionVisible(false)}
      />
    </div>
  );
};

export default RoleList;
