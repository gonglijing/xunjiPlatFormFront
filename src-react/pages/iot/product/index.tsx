import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Input, Select, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import productApi from '../../../api/product';
import deviceApi from '../../../api/device';
import './index.css';
const { Search } = Input;
const { Option } = Select;
interface ProductItem {
  id: number;
  productName: string;
  productKey: string;
  categoryId: number;
  categoryName: string;
  status: number;
  createdAt: string;
}
const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState('');
  const [deviceType, setDeviceType] = useState<string>('');
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await productApi.getList({
        pageNum,
        pageSize,
        keyWord: searchKey,
        deviceType,
        status,
      });
      if (res.code === 0 || res.code === 200) {
        setData(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    } catch (error) {
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [pageNum, pageSize, searchKey, deviceType, status]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await deviceApi.category.getList({});
        const payload = res?.data || res;
        const list = payload?.category || payload?.list || payload || [];
        setCategoryOptions(Array.isArray(list) ? list : []);
      } catch {
        setCategoryOptions([]);
      }
    };
    fetchCategories();
  }, []);
  
  const handleSearch = (value: string) => {
    setSearchKey(value);
    setPageNum(1);
  };
  
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleEdit = (record: ProductItem) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleDelete = async (id: number) => {
    try {
      const res = await productApi.del({ id });
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
      
      if (editingProduct) {
        const res = await productApi.edit({ ...editingProduct, ...values });
        if (res.code === 0 || res.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.msg || '更新失败');
        }
      } else {
        const res = await productApi.add(values);
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
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '产品密钥',
      dataIndex: 'productKey',
      key: 'productKey',
    },
    {
      title: '产品分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
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
      render: (_: any, record: ProductItem) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/product/detail/${record.productKey || record.id}`)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此产品吗?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="product-list-container">
      <Card
        title="产品管理"
        extra={
          <Space>
            <Search placeholder="搜索产品名称" onSearch={handleSearch} style={{ width: 200 }} allowClear />
            <Input placeholder="设备类型" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} style={{ width: 120 }} />
            <Select placeholder="发布状态" value={status} allowClear onChange={setStatus} style={{ width: 120 }}>
              <Option value={1}>已发布</Option>
              <Option value={0}>未发布</Option>
            </Select>
            <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>创建产品</Button>
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
            pageSize,
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
        title={editingProduct ? '编辑产品' : '创建产品'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="productName" label="产品名称" rules={[{ required: true, message: '请输入产品名称' }]}>
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item name="productKey" label="产品密钥" rules={[{ required: true, message: '请输入产品密钥' }]}>
            <Input placeholder="请输入产品密钥" />
          </Form.Item>
          <Form.Item name="categoryId" label="产品分类">
            <Select allowClear placeholder="请选择分类">
              {categoryOptions.map((item) => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="deviceType" label="设备类型">
            <Input placeholder="请输入设备类型" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ProductList;
