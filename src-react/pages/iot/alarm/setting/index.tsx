import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Tag, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import alarmApi from '../../../../api/alarm';
import './index.css';

interface AlarmRuleItem {
  id: number;
  name: string;
  productKey: string;
  status: number;
  alarmLevel?: { name: string };
  triggerType?: string;
  createdAt: string;
}

const AlarmSettingList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlarmRuleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    name: '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AlarmRuleItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await alarmApi.rule.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取告警规则列表失败');
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
    setParams({ pageNum: 1, pageSize: 10, name: '' });
  };

  const showEdit = (record?: AlarmRuleItem) => {
    setSelectedItem(record || null);
    setEditVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条告警规则吗？',
      onOk: async () => {
        try {
          await alarmApi.rule.del({ ids: [id] });
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleStatusChange = async (record: AlarmRuleItem) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await alarmApi.rule.edit({ ...record, status: newStatus });
      message.success('状态修改成功');
      fetchData();
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '产品标识', dataIndex: 'productKey', key: 'productKey' },
    { title: '告警级别', dataIndex: ['alarmLevel', 'name'], key: 'alarmLevel' },
    { title: '触发类型', dataIndex: 'triggerType', key: 'triggerType' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number, record: AlarmRuleItem) => (
        <Tag color={status === 1 ? 'green' : 'red'} onClick={() => handleStatusChange(record)} style={{ cursor: 'pointer' }}>
          {status === 1 ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: AlarmRuleItem) => (
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
    <div className="alarm-setting-container">
      <Card
        title="告警规则管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showEdit()}>
            新增规则
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="规则名称"
            style={{ width: 200 }}
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<SyncOutlined />} onClick={handleReset}>
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

      <EditModal visible={editVisible} data={selectedItem} onClose={() => setEditVisible(false)} onSuccess={fetchData} />
    </div>
  );
};

interface EditModalProps {
  visible: boolean;
  data: AlarmRuleItem | null;
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
      form.setFieldsValue({ status: 1 });
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (data?.id) {
        await alarmApi.rule.edit({ ...data, ...values });
      } else {
        await alarmApi.rule.add(values);
      }
      message.success(data?.id ? '编辑成功' : '新增成功');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('操作失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={data?.id ? '编辑告警规则' : '新增告警规则'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="规则名称" rules={[{ required: true }]}>
          <Input placeholder="请输入规则名称" />
        </Form.Item>
        <Form.Item name="productKey" label="产品标识" rules={[{ required: true }]}>
          <Input placeholder="请输入产品标识" />
        </Form.Item>
        <Form.Item name="alarmLevelId" label="告警级别" rules={[{ required: true }]}>
          <Select placeholder="请选择告警级别">
            <Select.Option value={1}>严重</Select.Option>
            <Select.Option value={2}>警告</Select.Option>
            <Select.Option value={3}>提示</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="triggerType" label="触发类型" rules={[{ required: true }]}>
          <Select placeholder="请选择触发类型">
            <Select.Option value="threshold">阈值触发</Select.Option>
            <Select.Option value="change">变化触发</Select.Option>
            <Select.Option value="time">定时触发</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AlarmSettingList;
