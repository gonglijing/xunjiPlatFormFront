import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, Select, Upload, message, Switch } from 'antd';
import type { TableColumnsType, UploadProps } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import certificateApi from '../../../api/certificate';
import './index.css';

interface CertificateItem {
  id: number;
  name: string;
  standard: string;
  description: string;
  status: number;
  createdAt: string;
  fileContent?: string;
  publicKeyContent?: string;
  privateKeyContent?: string;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  name: string;
  status: number;
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

const CertificateList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CertificateItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<QueryParams>({
    pageNum: 1,
    pageSize: 10,
    name: '',
    status: -1,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CertificateItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await certificateApi.certificate.getList(params);
      const resRecord = asRecord(res);
      const rawPayload = resRecord.data ?? res;
      const payload = asRecord(rawPayload);
      const list = resRecord.Info ?? payload.Info ?? payload.list ?? payload.Data ?? rawPayload;
      const count = payload.total ?? payload.Total ?? resRecord.total ?? 0;

      setData(toList<CertificateItem>(list));
      setTotal(toNumber(count));
    } catch {
      message.error('获取证书列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    setParams({ ...params, pageNum: 1 });
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, name: '', status: -1 });
  };

  const showEdit = (record?: CertificateItem) => {
    setSelectedItem(record || null);
    setEditVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个证书吗？',
      onOk: async () => {
        try {
          await certificateApi.certificate.del(id);
          message.success('删除成功');
          fetchData();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleStatusChange = async (record: CertificateItem) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await certificateApi.certificate.editStatus({ id: record.id, status: newStatus });
      message.success('状态修改成功');
      fetchData();
    } catch {
      message.error('状态修改失败');
    }
  };

  const columns: TableColumnsType<CertificateItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '证书名称', dataIndex: 'name', key: 'name' },
    {
      title: '证书标准',
      dataIndex: 'standard',
      key: 'standard',
      render: (val: string) => {
        const dict: Record<string, string> = {
          '1': 'RFC',
          '2': 'PKCS',
          '3': 'X.509',
        };
        return dict[val] || val;
      },
    },
    { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (rowStatus: number, record: CertificateItem) => (
        <Switch
          checked={rowStatus === 1}
          onChange={() => handleStatusChange(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: CertificateItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="certificate-container">
      <Card
        title="证书管理"
        extra={(
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showEdit()}>
            新增证书
          </Button>
        )}
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="证书名称"
            style={{ width: 200 }}
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="状态"
            style={{ width: 120 }}
            allowClear
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

      <EditModal
        visible={editVisible}
        data={selectedItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

interface EditModalProps {
  visible: boolean;
  data: CertificateItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue(data);
    } else if (visible && !data) {
      form.resetFields();
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (data?.id) {
        await certificateApi.certificate.edit(values);
      } else {
        await certificateApi.certificate.add(values);
      }
      message.success(data?.id ? '编辑成功' : '新增成功');
      onSuccess();
      onClose();
    } catch {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const beforePublicUpload: NonNullable<UploadProps['beforeUpload']> = (file) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => {
      const result = event.target?.result;
      form.setFieldsValue({ publicKeyContent: typeof result === 'string' ? result : '' });
    };
    return false;
  };

  const beforePrivateUpload: NonNullable<UploadProps['beforeUpload']> = (file) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => {
      const result = event.target?.result;
      form.setFieldsValue({ privateKeyContent: typeof result === 'string' ? result : '' });
    };
    return false;
  };

  return (
    <Modal
      title={data?.id ? '编辑证书' : '新增证书'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} labelWidth={100} labelPosition="left">
        <Form.Item name="standard" label="证书标准" rules={[{ required: true }]}> 
          <Select placeholder="请选择证书标准">
            <Select.Option value="1">RFC</Select.Option>
            <Select.Option value="2">PKCS</Select.Option>
            <Select.Option value="3">X.509</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="name" label="证书名称" rules={[{ required: true }]}> 
          <Input placeholder="请输入证书名称" />
        </Form.Item>
        <Form.Item name="fileContent" label="证书文件" rules={[{ required: true }]}> 
          <Input placeholder="证书文件路径" disabled />
        </Form.Item>
        <Form.Item name="publicKeyContent" label="证书公钥" rules={[{ required: true }]}> 
          <Input.TextArea rows={4} placeholder="证书公钥内容" disabled />
          <Upload beforeUpload={beforePublicUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>上传公钥</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="privateKeyContent" label="证书私钥" rules={[{ required: true }]}> 
          <Input.TextArea rows={4} placeholder="证书私钥内容" disabled />
          <Upload beforeUpload={beforePrivateUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>上传私钥</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={3} placeholder="请输入说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CertificateList;
