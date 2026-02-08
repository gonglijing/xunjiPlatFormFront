import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, message, DatePicker, Modal } from 'antd';
import { SyncOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const getCurrentTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}`;
};

const getListAndTotal = (res: any) => {
  const list = res?.list || res?.data?.list || res?.Data || [];
  const total = res?.total ?? res?.data?.total ?? res?.Total ?? list.length;
  return { list, total };
};

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
      const res: any = await sysApi.log.getList(params);
      const { list, total: listTotal } = getListAndTotal(res);
      setData(list);
      setTotal(listTotal);
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
    setParams((prev) => ({ ...prev, pageNum: 1 }));
  };

  const handleReset = () => {
    setParams({ pageNum: 1, pageSize: 10, ipaddr: '', loginLocation: '', status: -1, dateRange: [] });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      message.error('请选择要删除的日志');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedIds.length} 条日志吗？`,
      onOk: async () => {
        try {
          await sysApi.log.del(selectedIds);
          message.success('删除成功');
          setSelectedIds([]);
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleExport = async () => {
    try {
      const res: any = await sysApi.log.export(params);
      const blob = res instanceof Blob ? res : new Blob([JSON.stringify(res || {}, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `login-log-${getCurrentTime()}.xlsx`);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
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
            onChange={(e) => setParams((prev) => ({ ...prev, ipaddr: e.target.value }))}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder="登录地点"
            style={{ width: 150 }}
            value={params.loginLocation}
            onChange={(e) => setParams((prev) => ({ ...prev, loginLocation: e.target.value }))}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            value={params.status === -1 ? undefined : params.status}
            onChange={(value) => setParams((prev) => ({ ...prev, status: value ?? -1 }))}
          >
            <Select.Option value={1}>成功</Select.Option>
            <Select.Option value={0}>失败</Select.Option>
          </Select>
          <DatePicker.RangePicker
            onChange={(_dates, dateStrings) => setParams((prev) => ({ ...prev, dateRange: dateStrings as string[] }))}
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
            onChange: (page, pageSize) => setParams((prev) => ({ ...prev, pageNum: page, pageSize })),
          }}
        />
      </Card>
    </div>
  );
};

export default LoginLogList;
