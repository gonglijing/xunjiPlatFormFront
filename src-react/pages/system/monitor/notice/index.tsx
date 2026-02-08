import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, message } from 'antd';
import sysApi from '../../../../api/system';
import './index.css';

interface MessageInfo {
  title?: string;
  content?: string;
  createdAt?: string;
  [key: string]: any;
}

interface NoticeRow {
  id: number;
  isRead: boolean;
  messageInfo: MessageInfo;
  raw: any;
}

const toList = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.Info)) return payload.Info;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.Data)) return payload.Data;
  return [];
};

const normalizeRow = (item: any, index: number): NoticeRow => {
  const msg = item?.MessageInfo || item?.messageInfo || item?.message || {};
  return {
    id: Number(item?.id || item?.ID || index + 1),
    isRead: Boolean(item?.isRead ?? item?.read ?? item?.status === 1),
    messageInfo: {
      title: msg?.title || item?.title || '-',
      content: msg?.content || item?.content || '-',
      createdAt: msg?.createdAt || item?.createdAt || item?.createTime || '-',
    },
    raw: item,
  };
};

const NoticeList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<NoticeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      let res: any;
      try {
        res = await sysApi.message.getList(params);
      } catch (error) {
        res = await sysApi.system.monitor.notice(params);
      }

      const payload = res?.data || res;
      const list = toList(payload).map(normalizeRow);
      const totalCount = Number(payload?.total || payload?.Total || res?.total || res?.Total || list.length) || 0;

      setTableData(list);
      setTotal(totalCount);
    } catch (error) {
      message.error('获取通知消息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const markAsRead = async (record: NoticeRow) => {
    try {
      await sysApi.message.read(record.id);
      message.success('已设置为已读');
      fetchData();
    } catch (error) {
      message.error('设置已读失败');
    }
  };

  const removeItem = (record: NoticeRow) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定删除这条消息吗？',
      onOk: async () => {
        try {
          await sysApi.message.del([record.id]);
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
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => params.pageSize * (params.pageNum - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: ['messageInfo', 'title'],
      key: 'title',
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: ['messageInfo', 'content'],
      key: 'content',
      ellipsis: true,
    },
    {
      title: '发生时间',
      dataIndex: ['messageInfo', 'createdAt'],
      key: 'createdAt',
      width: 170,
    },
    {
      title: '状态',
      key: 'isRead',
      width: 90,
      align: 'center' as const,
      render: (_: any, record: NoticeRow) => (
        <Tag color={record.isRead ? 'success' : 'default'}>{record.isRead ? '已读' : '未读'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center' as const,
      render: (_: any, record: NoticeRow) => (
        <Space>
          {!record.isRead && (
            <Button type="link" size="small" onClick={() => markAsRead(record)}>
              设为已读
            </Button>
          )}
          <Button type="link" size="small" danger onClick={() => removeItem(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="monitor-notice-container">
      <Card title="站内消息">
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ pageNum: page, pageSize }),
          }}
        />
      </Card>
    </div>
  );
};

export default NoticeList;
