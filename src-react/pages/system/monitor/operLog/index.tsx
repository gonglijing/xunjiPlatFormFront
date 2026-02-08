import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, message, DatePicker } from 'antd';
import { SyncOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

interface OperLogItem {
  operId: number;
  title: string;
  businessType: number;
  operatorType: number;
  operName: string;
  deptName: string;
  operIp: string;
  operLocation: string;
  operTime: string;
  status: number;
  msg: string;
}

const OperLogList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OperLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    title: '',
    operName: '',
    businessType: undefined as number | undefined,
    status: -1,
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OperLogItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.monitor.operLog(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取操作日志失败');
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
    setParams({ pageNum: 1, pageSize: 10, title: '', operName: '', businessType: undefined, status: -1 });
  };

  const handleDelete = async (ids: number[]) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${ids.length} 条日志吗?`,
      onOk: async () => {
        message.info('删除功能开发中');
      },
    });
  };

  const handleDetail = (record: OperLogItem) => {
    setSelectedItem(record);
    setDetailVisible(true);
  };

  const getBusinessType = (type: number) => {
    const types: Record<number, { label: string; color: string }> = {
      0: { label: '其他', color: 'default' },
      1: { label: '新增', color: 'success' },
      2: { label: '修改', color: 'warning' },
      3: { label: '删除', color: 'error' },
    };
    return types[type] || { label: '未知', color: 'default' };
  };

  const getOperatorType = (type: number) => {
    const types: Record<number, string> = {
      0: '其他',
      1: '后台用户',
      2: '手机端用户',
    };
    return types[type] || '未知';
  };

  const columns = [
    { title: '编号', dataIndex: 'operId', key: 'operId', width: 80 },
    { title: '系统模块', dataIndex: 'title', key: 'title', width: 120, ellipsis: true },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (type: number) => {
        const info = getBusinessType(type);
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '操作类型',
      dataIndex: 'operatorType',
      key: 'operatorType',
      width: 100,
      render: (_: any, record: OperLogItem) => getOperatorType(record.operatorType),
    },
    { title: '操作人员', dataIndex: 'operName', key: 'operName', width: 100 },
    { title: '组织', dataIndex: 'deptName', key: 'deptName', width: 120 },
    { title: '主机', dataIndex: 'operIp', key: 'operIp', width: 140, ellipsis: true },
    { title: '操作地点', dataIndex: 'operLocation', key: 'operLocation', width: 120, ellipsis: true },
    {
      title: '操作状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '正常' : '异常'}
        </Tag>
      ),
    },
    { title: '操作时间', dataIndex: 'operTime', key: 'operTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: OperLogItem) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详细
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="oper-log-container">
      <Card title="操作日志">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="系统模块"
            style={{ width: 200 }}
            value={params.title}
            onChange={(e) => setParams({ ...params, title: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder="操作人员"
            style={{ width: 150 }}
            value={params.operName}
            onChange={(e) => setParams({ ...params, operName: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="业务类型"
            style={{ width: 120 }}
            allowClear
            value={params.businessType}
            onChange={(value) => setParams({ ...params, businessType: value })}
          >
            <Select.Option value={0}>其他</Select.Option>
            <Select.Option value={1}>新增</Select.Option>
            <Select.Option value={2}>修改</Select.Option>
            <Select.Option value={3}>删除</Select.Option>
          </Select>
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            value={params.status === -1 ? undefined : params.status}
            onChange={(value) => setParams({ ...params, status: value ?? -1 })}
          >
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={0}>异常</Select.Option>
          </Select>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(selectedIds)}>
            删除日志
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="operId"
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

      <Modal
        title="操作详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div>
            <p><strong>系统模块：</strong>{selectedItem.title}</p>
            <p><strong>请求方式：</strong>-</p>
            <p><strong>操作方法：</strong>-</p>
            <p><strong>请求参数：</strong></p>
            <pre style={{ background: '#f5f5f5', padding: 10, overflow: 'auto', maxHeight: 200 }}>
              {selectedItem.msg || '无'}
            </pre>
            <p><strong>返回参数：</strong>-</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperLogList;
