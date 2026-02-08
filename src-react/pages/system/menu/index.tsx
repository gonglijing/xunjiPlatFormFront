import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, message, Tag, Modal, Form, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, FolderOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditMenu from './component/editMenu';
import './index.css';

interface MenuItem {
  id: number;
  title: string;
  path: string;
  component: string;
  icon: string;
  orderNum: number;
  type: number;
  isHide: number;
  pid: number;
  children?: MenuItem[];
}

const MenuList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MenuItem[]>([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.menu.getList({});
      setData(res || []);
    } catch (error) {
      message.error('获取菜单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = (record?: MenuItem) => {
    setEditingMenu(record || null);
    setEditVisible(true);
  };

  const handleEdit = (record: MenuItem) => {
    setEditingMenu(record);
    setEditVisible(true);
  };

  const handleDelete = async (record: MenuItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除菜单 "${record.title}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.menu.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: MenuItem) => (
        <span>
          {record.type === 0 ? <FolderOutlined style={{ marginRight: 8 }} /> : null}
          {title}
        </span>
      ),
    },
    { title: '路由路径', dataIndex: 'path', key: 'path', width: 180 },
    { title: '组件路径', dataIndex: 'component', key: 'component', width: 200, ellipsis: true },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 80 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: number) => (
        <Tag color={type === 0 ? 'blue' : type === 1 ? 'green' : 'orange'}>
          {type === 0 ? '目录' : type === 1 ? '菜单' : '按钮'}
        </Tag>
      ),
    },
    {
      title: '显示状态',
      dataIndex: 'isHide',
      key: 'isHide',
      width: 100,
      render: (isHide: number) => (
        <Tag color={isHide === 0 ? 'success' : 'default'}>
          {isHide === 0 ? '显示' : '隐藏'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: MenuItem) => (
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
    <div className="menu-list-container">
      <Card title="菜单管理" extra={
        <Space>
          <Button icon={<SyncOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增菜单
          </Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
          defaultExpandAllRows
        />
      </Card>

      <EditMenu
        visible={editVisible}
        data={editingMenu}
        menuTree={data}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default MenuList;
