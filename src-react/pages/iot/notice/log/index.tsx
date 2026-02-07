import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, DatePicker, Tag, Modal, message } from 'antd';
import { SearchOutlined, RedoOutlined, EyeOutlined } from '@ant-design/icons';
import noticeApi from '../../../api/notice';
import './index.css';

const { RangePicker } = DatePicker;

interface NoticeLogItem {
  id: number;
  title: string;
  gateway: string;
  status: number;
  sendTime: string;
  content: string;
}

const NoticeLogList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NoticeLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    status: undefined as number | undefined,
    dateRange: [] as string[],
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NoticeLogItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await noticeApi.log.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取通知日志失败');
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

  const showDetail = (record: NoticeLogItem) => {
    setSelectedItem(record);
    setDetailVisible(true);
  };

  const handleResend = async (id: number) => {
    try {
      await noticeApi.log.resend(id);
      message.success('重发成功');
      fetchData();
    } catch (error) {
      message.error('重发失败');
    }
  };

  const gatewayMap: Record<string, string> = {
    dingtalk: '钉钉',
    wechat: '企业微信',
    email: '邮件',
    webhook: 'Webhook',
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: '发送方式',
      dataIndex: 'gateway',
      key: 'gateway',
      width: 120,
      render: (gateway: string) => gatewayMap[gateway] || gateway,
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '发送成功' : '发送失败'}
        </Tag>
      ),
    },
    { title: '发送时间', dataIndex: 'sendTime', key: 'sendTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: NoticeLogItem) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 0 && (
            <Button type="link" onClick={() => handleResend(record.id)}>
              重发
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="notice-log-container">
      <Card title="通知日志">
        <Space style={{ marginBottom: 16 }} wrap>
          <RangePicker
            onChange={(_dates, dateStrings) => {
              setParams({ ...params, dateRange: dateStrings as [string, string] });
            }}
          />
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

      <Modal
        title="通知详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div>
            <p><strong>标题：</strong>{selectedItem.title}</p>
            <p><strong>发送方式：</strong>{gatewayMap[selectedItem.gateway] || selectedItem.gateway}</p>
            <p><strong>发送状态：</strong>
              <Tag color={selectedItem.status === 1 ? 'success' : 'error'}>
                {selectedItem.status === 1 ? '发送成功' : '发送失败'}
              </Tag>
            </p>
            <p><strong>发送时间：</strong>{selectedItem.sendTime}</p>
            <p><strong>内容：</strong></p>
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
              {selectedItem.content}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NoticeLogList;
