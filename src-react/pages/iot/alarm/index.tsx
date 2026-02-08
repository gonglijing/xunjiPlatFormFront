import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import alarmApi from '../../../api/alarm';
import './index.css';

const { Search } = Input;

interface AlarmItem {
  id: number;
  type: number;
  ruleName: string;
  productKey: string;
  deviceKey: string;
  status: number;
  createdAt: string;
  alarmLevel?: { name?: string };
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

const AlarmList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AlarmItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await alarmApi.log.getList(params);
      const rawPayload = asRecord(res).data ?? res;
      const payload = asRecord(rawPayload);
      const list = payload.list ?? payload.Data ?? rawPayload;
      const count = payload.total ?? payload.Total ?? 0;

      setData(toList<AlarmItem>(list));
      setTotal(toNumber(count));
    } catch {
      message.error('获取告警列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = (value?: string) => {
    setParams((prev) => ({
      ...prev,
      pageNum: 1,
      keyWord: value ?? prev.keyWord,
    }));
  };

  const columns: TableColumnsType<AlarmItem> = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (type: number) => (type === 1 ? '规则告警' : '设备自主告警'),
    },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', ellipsis: true },
    { title: '产品标识', dataIndex: 'productKey', key: 'productKey', width: 150, ellipsis: true },
    { title: '设备标识', dataIndex: 'deviceKey', key: 'deviceKey', width: 150, ellipsis: true },
    {
      title: '规则级别',
      dataIndex: ['alarmLevel', 'name'],
      key: 'alarmLevel',
      width: 120,
      render: (name?: string) => name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (rowStatus: number) => (
        <Tag color={rowStatus === 0 ? 'red' : rowStatus === 1 ? 'green' : 'default'}>
          {rowStatus === 0 ? '未处理' : rowStatus === 1 ? '已处理' : '已忽略'}
        </Tag>
      ),
    },
    { title: '告警时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  ];

  return (
    <div className="alarm-list-container">
      <Card
        title="告警管理"
        extra={(
          <Space>
            <Search
              placeholder="搜索规则名称"
              style={{ width: 220 }}
              value={params.keyWord}
              onChange={(e) => setParams({ ...params, keyWord: e.target.value })}
              onSearch={(value) => handleSearch(value)}
            />
            <Button icon={<SyncOutlined />} onClick={() => fetchData()}>
              刷新
            </Button>
          </Space>
        )}
      >
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
    </div>
  );
};

export default AlarmList;
