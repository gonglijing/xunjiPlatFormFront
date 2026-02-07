import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Select, DatePicker, Tag, Modal, Form, Input, message } from 'antd';
import { SearchOutlined, RedoOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import alarmApi from '../../../../api/alarm';
import './index.css';

const { RangePicker } = DatePicker;

interface AlarmLogItem {
  id: number;
  type: number;
  ruleName: string;
  productKey: string;
  deviceKey: string;
  status: number;
  createdAt: string;
  alarmLevel?: { name: string };
}

interface DetailModalProps {
  visible: boolean;
  data: AlarmLogItem | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, data, onClose }) => {
  if (!data) return null;

  return (
    <Modal title="告警详情" open={visible} onCancel={onClose} footer={null} width={700}>
      <Form labelWidth={100} labelPosition="left">
        <Form.Item label="规则名称">{data.ruleName}</Form.Item>
        <Form.Item label="告警类型">
          {data.type === 1 ? '规则告警' : '设备自主告警'}
        </Form.Item>
        <Form.Item label="产品标识">{data.productKey}</Form.Item>
        <Form.Item label="设备标识">{data.deviceKey}</Form.Item>
        <Form.Item label="告警级别">
          <Tag color="red">{data.alarmLevel?.name || '未知'}</Tag>
        </Form.Item>
        <Form.Item label="告警时间">{data.createdAt}</Form.Item>
        <Form.Item label="告警状态">
          <Tag color={data.status === 0 ? 'red' : data.status === 1 ? 'green' : 'default'}>
            {data.status === 0 ? '未处理' : data.status === 1 ? '已处理' : '已忽略'}
          </Tag>
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface HandleModalProps {
  visible: boolean;
  data: AlarmLogItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const HandleModal: React.FC<HandleModalProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue({ status: 1, content: '' });
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await alarmApi.log.handle({ id: data?.id, ...values });
      message.success('处理成功');
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('处理失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="告警处理"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} labelWidth={100} labelPosition="left">
        <Form.Item name="status" label="处理状态" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>已处理</Select.Option>
            <Select.Option value={2}>忽略</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="content" label="处理意见" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="请输入处理意见" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AlarmLogList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlarmLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    status: undefined as number | undefined,
    dateRange: [] as string[],
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [handleVisible, setHandleVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AlarmLogItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await alarmApi.log.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取告警日志失败');
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
    setParams({ pageNum: 1, pageSize: 10, status: undefined, dateRange: [] });
  };

  const showDetail = (record: AlarmLogItem) => {
    setSelectedItem(record);
    setDetailVisible(true);
  };

  const showHandle = (record: AlarmLogItem) => {
    setSelectedItem(record);
    setHandleVisible(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => (type === 1 ? '规则告警' : '设备自主告警'),
    },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', ellipsis: true },
    { title: '产品标识', dataIndex: 'productKey', key: 'productKey', ellipsis: true },
    { title: '设备标识', dataIndex: 'deviceKey', key: 'deviceKey', ellipsis: true },
    {
      title: '告警级别',
      dataIndex: ['alarmLevel', 'name'],
      key: 'alarmLevel',
      width: 100,
    },
    {
      title: '告警状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 0 ? 'red' : status === 1 ? 'green' : 'default'}>
          {status === 0 ? '未处理' : status === 1 ? '已处理' : '已忽略'}
        </Tag>
      ),
    },
    { title: '告警时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: AlarmLogItem) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 0 && (
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => showHandle(record)}>
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="alarm-log-container">
      <Card title="告警日志">
        <Space style={{ marginBottom: 16 }} wrap>
          <RangePicker
            onChange={(dates, dateStrings) => {
              setParams({ ...params, dateRange: dateStrings as [string, string] });
            }}
          />
          <Select
            placeholder="告警状态"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => setParams({ ...params, status: value })}
          >
            <Select.Option value={0}>未处理</Select.Option>
            <Select.Option value={1}>已处理</Select.Option>
            <Select.Option value={2}>已忽略</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<RedoOutlined />} onClick={handleReset}>
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

      <DetailModal visible={detailVisible} data={selectedItem} onClose={() => setDetailVisible(false)} />
      <HandleModal
        visible={handleVisible}
        data={selectedItem}
        onClose={() => setHandleVisible(false)}
        onSuccess={() => {
          setHandleVisible(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default AlarmLogList;
