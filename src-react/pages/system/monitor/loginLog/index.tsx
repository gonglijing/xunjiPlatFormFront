import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, message, DatePicker } from 'antd';
import { SyncOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

interface LoginLogItem {
  infoId: number;
  loginName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: number;
  msg: string;
  loginTime: string;
  module: string;
}

const LoginLogList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoginLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    ipaddr: '',
    loginLocation: '',
    status: -1,
    dateRange: [] as string[],
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.monitor.loginLog(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取登录日志失败');
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
    setParams({ pageNum: 1, pageSize: 10, ipaddr: '', loginLocation: '', status: -1, dateRange: [] });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      message.error('请选择要删除的日志');
      return;
    }
    message.info('删除功能开发中');
  };

  const handleExport = () => {
    message.info('导出功能开发中');
  };

  const columns = [
    { title: '编号', dataIndex: 'infoId', key: 'infoId', width: 80 },
    { title: '登录名称', dataIndex: 'loginName', key: 'loginName', width: 120 },
    { title: '登录地址', dataIndex: 'ipaddr', key: 'ipaddr', width: 140, ellipsis: true },
    { title: '登录地点', dataIndex: 'loginLocation', key: 'loginLocation', width: 120, ellipsis: true },
    { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 120 },
    { title: '操作系统', dataIndex: 'os', key: 'os', width: 120, ellipsis: true },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    { title: '操作信息', dataIndex: 'msg', key: 'msg', width: 150, ellipsis: true },
    { title: '登录日期', dataIndex: 'loginTime', key: 'loginTime', width: 160 },
    { title: '登录模块', dataIndex: 'module', key: 'module', width: 120, ellipsis: true },
  ];

  return (
    <div className="login-log-container">
      <Card title="登录日志">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="登录IP"
            style={{ width: 150 }}
            value={params.ipaddr}
            onChange={(e) => setParams({ ...params, ipaddr: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder="登录地点"
            style={{ width: 150 }}
            value={params.loginLocation}
            onChange={(e) => setParams({ ...params, loginLocation: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            value={params.status === -1 ? undefined : params.status}
            onChange={(value) => setParams({ ...params, status: value ?? -1 })}
          >
            <Select.Option value={1}>成功</Select.Option>
            <Select.Option value={0}>失败</Select.Option>
          </Select>
          <DatePicker.RangePicker
            onChange={(_dates, dateStrings) => setParams({ ...params, dateRange: dateStrings as [string, string] })}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleDelete}>
            删除日志
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出日志
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="infoId"
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as number[]),
          }}
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

export default LoginLogList;
