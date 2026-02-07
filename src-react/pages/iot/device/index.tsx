import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Input, Select, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import deviceApi from '../../../api/device';
import './index.css';
const { Search } = Input;
const { Option } = Select;
interface DeviceItem {
  id: number;
  deviceName: string;
  deviceKey: string;
  productId: number;
  productName: string;
  status: number;
  onlineTime?: string;
  offlineTime?: string;
  createdAt: string;
}
const DeviceList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeviceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceItem | null>(null);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await deviceApi.getList({
        pageNum,
        pageSize,
        keyWord: searchKey,
        status,
      });
      if (res.code === 0 || res.code === 200) {
        setData(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    } catch (error) {
      message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [pageNum, pageSize, searchKey, status]);
  
  const handleSearch = (value: string) => {
    setSearchKey(value);
    setPageNum(1);
  };
  
  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleEdit = (record: DeviceItem) => {
    setEditingDevice(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleDelete = async (id: number) => {
    try {
      const res = await deviceApi.del({ id });
      if (res.code === 0 || res.code === 200) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(res.msg || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingDevice) {
        // 编辑
        const res = await deviceApi.edit({ ...editingDevice, ...values });
        if (res.code === 0 || res.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.msg || '更新失败');
        }
      } else {
        // 新增
        const res = await deviceApi.add(values);
        if (res.code === 0 || res.code === 200) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.msg || '创建失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备密钥',
      dataIndex: 'deviceKey',
      key: 'deviceKey',
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DeviceItem) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此设备吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="device-list-container">
      <Card
        title="设备管理"
        extra={
          <Space>
            <Search
              placeholder="搜索设备名称"
              onSearch={handleSearch}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="设备状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setStatus(value)}
            >
              <Option value={1}>在线</Option>
              <Option value={0}>离线</Option>
            </Select>
            <Button icon={<SyncOutlined />} onClick={fetchData}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建设备
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            },
          }}
        />
      </Card>
      
      <Modal
        title={editingDevice ? '编辑设备' : '新建设备'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="deviceName"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            name="deviceKey"
            label="设备密钥"
            rules={[{ required: true, message: '请输入设备密钥' }]}
          >
            <Input placeholder="请输入设备密钥" />
          </Form.Item>
          <Form.Item
            name="productId"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select placeholder="请选择产品">
              <Option value={1}>产品1</Option>
              <Option value={2}>产品2</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default DeviceList;
