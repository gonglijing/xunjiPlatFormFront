import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Descriptions, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import systemApi from '../../../../api/system';
import './index.css';

interface ServerInfo {
  cpu?: {
    coreNum: number;
    used: number;
    free: number;
  };
  memory?: {
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  };
  disk?: {
    total: number;
    used: number;
    free: number;
    usedPercent: number;
  };
  goVersion?: string;
  os?: string;
  machine?: string;
  numCPU?: number;
  memTotal?: number;
}

const ServerMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ServerInfo | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await systemApi.system.monitor.server();
      setData(res || null);
    } catch (error) {
      message.error('获取服务器信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const cpuColumns = [
    { title: '核心数', dataIndex: 'coreNum', key: 'coreNum' },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => `${v}%` },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => `${v}%` },
  ];

  const memoryColumns = [
    { title: '总内存', dataIndex: 'total', key: 'total', render: (v: number) => formatBytes(v) },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => formatBytes(v) },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => formatBytes(v) },
    { title: '使用率', dataIndex: 'usedPercent', key: 'usedPercent', render: (v: number) => `${v}%` },
  ];

  const diskColumns = [
    { title: '总容量', dataIndex: 'total', key: 'total', render: (v: number) => formatBytes(v) },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => formatBytes(v) },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => formatBytes(v) },
    { title: '使用率', dataIndex: 'usedPercent', key: 'usedPercent', render: (v: number) => `${v}%` },
  ];

  return (
    <div className="system-monitor-container">
      <Card
        title="服务监控"
        extra={
          <Button icon={<SyncOutlined />} onClick={fetchData} loading={loading}>
            刷新
          </Button>
        }
      >
        <Spin spinning={loading}>
          {data && (
            <>
              <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="操作系统">{data.os}</Descriptions.Item>
                <Descriptions.Item label="系统架构">{data.machine}</Descriptions.Item>
                <Descriptions.Item label="CPU核心数">{data.numCPU}</Descriptions.Item>
                <Descriptions.Item label="总内存">{formatBytes(data.memTotal || 0)}</Descriptions.Item>
                <Descriptions.Item label="Go版本">{data.goVersion}</Descriptions.Item>
              </Descriptions>

              <Card title="CPU信息" style={{ marginBottom: 16 }}>
                <Table
                  dataSource={[data.cpu || {}]}
                  columns={cpuColumns}
                  pagination={false}
                  rowKey="coreNum"
                />
              </Card>

              <Card title="内存信息" style={{ marginBottom: 16 }}>
                <Table
                  dataSource={[data.memory || {}]}
                  columns={memoryColumns}
                  pagination={false}
                  rowKey="total"
                />
              </Card>

              <Card title="磁盘信息">
                <Table
                  dataSource={[data.disk || {}]}
                  columns={diskColumns}
                  pagination={false}
                  rowKey="total"
                />
              </Card>
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ServerMonitor;
