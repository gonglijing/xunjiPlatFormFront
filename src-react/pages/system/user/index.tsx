import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, Select, DatePicker, Tag, message, Popconfirm, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditUser from './component/editUser';
import './index.css';

interface UserItem {
  id: number;
  userName: string;
  userNickname: string;
  dept?: { deptName: string };
  rolesNames: string;
  mobile: string;
  status: number;
  createdAt: string;
}

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWords: '',
    status: -1,
    deptId: '',
    dateRange: [] as string[],
  });
  const [deptData, setDeptData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const treeRef = useRef<any>(null);
  const [filterText, setFilterText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.user.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  useEffect(() => {
    const loadDeptData = async () => {
      const res: any = await sysApi.dept.getList({ status: 1 });
      setDeptData(res || []);
    };
    const loadRoleData = async () => {
      const res: any = await sysApi.role.getList({ status: 1 });
      setRoleData(res || []);
    };
    const loadPostData = async () => {
      const res: any = await sysApi.post.getList({ status: 1 });
      setPostData(res || []);
    };
    loadDeptData();
    loadRoleData();
    loadPostData();
  }, []);

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, keyWords: '', status: -1, deptId: '', dateRange: [] });
    setFilterText('');
  };

  const handleNodeClick = (deptId: string) => {
    setParams({ ...params, deptId });
  };

  const handleAdd = () => {
    setEditingUser(null);
    setEditVisible(true);
  };

  const handleEdit = (record: UserItem) => {
    setEditingUser(record);
    setEditVisible(true);
  };

  const handleDelete = async (record: UserItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${record.userName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.user.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleResetPwd = async (record: UserItem) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置用户 "${record.userName}" 的密码吗?`,
      onOk: async () => {
        try {
          await sysApi.user.resetPassword(record.id, '123456');
          message.success('密码已重置为 123456');
        } catch (error) {
          message.error('重置失败');
        }
      },
    });
  };

  const handleStatusChange = async (record: UserItem) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await sysApi.user.setStatus(record.id, newStatus);
      message.success(newStatus ? '已启用' : '已禁用');
      fetchData();
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const deptProps = {
    id: 'deptId',
    children: 'children',
    label: 'deptName',
  };

  const columns = [
    { title: '用户名', dataIndex: 'userName', key: 'userName', width: 120 },
    { title: '姓名', dataIndex: 'userNickname', key: 'userNickname', width: 100 },
    { title: '组织', dataIndex: ['dept', 'deptName'], key: 'deptName', width: 120 },
    { title: '角色', dataIndex: 'rolesNames', key: 'rolesNames', width: 120, ellipsis: true },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: UserItem) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: UserItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
          <Button type="link" size="small" onClick={() => handleResetPwd(record)}>
            重置密码
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-list-container" style={{ display: 'flex', gap: 16 }}>
      <Card title="组织架构" style={{ width: 280, flexShrink: 0 }}>
        <Input
          placeholder="搜索组织"
          prefix={<SearchOutlined />}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: 16 }}
          allowClear
        />
        <Tree
          ref={treeRef}
          treeData={deptData}
          fieldNames={deptProps}
          defaultExpandAll
          selectedKeys={params.deptId ? [params.deptId] : []}
          onSelect={(_selectedKeys, info) => {
            const deptId = info.node?.deptId || '';
            handleNodeClick(deptId);
          }}
          style={{ width: '100%' }}
        />
      </Card>

      <Card title="用户管理" style={{ flex: 1 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="用户名/姓名搜索"
            style={{ width: 200 }}
            value={params.keyWords}
            onChange={(e) => setParams({ ...params, keyWords: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="用户状态"
            style={{ width: 120 }}
            allowClear
            value={params.status === -1 ? undefined : params.status}
            onChange={(value) => setParams({ ...params, status: value ?? -1 })}
          >
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
          <DatePicker.RangePicker
            onChange={(_dates, dateStrings) => setParams({ ...params, dateRange: dateStrings as [string, string] })}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<SyncOutlined />} onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
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
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditUser
        visible={editVisible}
        data={editingUser}
        deptData={deptData}
        roleData={roleData}
        postData={postData}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default UserList;
