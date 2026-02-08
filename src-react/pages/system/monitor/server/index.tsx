import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Descriptions, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import systemApi from '../../../../api/system';
import getOrigin from '../../../../utils/origin';
import './index.css';

interface ServerState {
  cpu?: Record<string, any>;
  memory?: Record<string, any>;
  disk?: Record<string, any>;
  host?: Record<string, any>;
  go?: Record<string, any>;
  os?: string;
  machine?: string;
  numCPU?: number;
  memTotal?: number;
  goVersion?: string;
}

const ServerMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ServerState | null>(null);

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

    const es = new EventSource(getOrigin(`${import.meta.env.VITE_SERVER_URL || ''}/subscribe/sysenv`));

    const safeParse = (event: MessageEvent) => {
      try {
        return JSON.parse(event.data || '{}');
      } catch {
        return {};
      }
    };

    es.addEventListener('host', (event: MessageEvent) => {
      const host = safeParse(event);
      setData((prev) => ({
        ...(prev || {}),
        host,
        os: host.os || prev?.os,
        machine: host.kernelArch || prev?.machine,
        numCPU: host.procs || prev?.numCPU,
      }));
    });

    es.addEventListener('go', (event: MessageEvent) => {
      const go = safeParse(event);
      setData((prev) => ({
        ...(prev || {}),
        go,
        goVersion: go.goVersion || prev?.goVersion,
      }));
    });

    es.addEventListener('cpu', (event: MessageEvent) => {
      const cpu = safeParse(event);
      setData((prev) => ({ ...(prev || {}), cpu }));
    });

    es.addEventListener('mem', (event: MessageEvent) => {
      const memory = safeParse(event);
      setData((prev) => ({
        ...(prev || {}),
        memory,
        memTotal: memory.total || prev?.memTotal,
      }));
    });

    es.addEventListener('disk', (event: MessageEvent) => {
      const disk = safeParse(event);
      setData((prev) => ({ ...(prev || {}), disk }));
    });

    return () => {
      es.close();
    };
  }, []);

  const formatBytes = (bytes: number | string) => {
    const value = Number(bytes || 0);
    if (!value) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const percentValue = (value: any) => {
    if (value === undefined || value === null || value === '') return '0%';
    const num = Number(value);
    if (Number.isNaN(num)) return `${value}`;
    return `${num.toFixed(2)}%`;
  };

  const cpuUsed = data?.cpu?.used ?? data?.cpu?.Used ?? data?.cpu?.UsedPercent?.[0] ?? 0;
  const cpuFree = data?.cpu?.free ?? data?.cpu?.Free ?? (100 - Number(cpuUsed));

  const cpuColumns = [
    { title: '核心数', dataIndex: 'coreNum', key: 'coreNum' },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => percentValue(v) },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => percentValue(v) },
  ];

  const memoryColumns = [
    { title: '总内存', dataIndex: 'total', key: 'total', render: (v: number) => formatBytes(v) },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => formatBytes(v) },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => formatBytes(v) },
    { title: '使用率', dataIndex: 'usedPercent', key: 'usedPercent', render: (v: number) => percentValue(v) },
  ];

  const diskColumns = [
    { title: '总容量', dataIndex: 'total', key: 'total', render: (v: number) => formatBytes(v) },
    { title: '已使用', dataIndex: 'used', key: 'used', render: (v: number) => formatBytes(v) },
    { title: '空闲', dataIndex: 'free', key: 'free', render: (v: number) => formatBytes(v) },
    { title: '使用率', dataIndex: 'usedPercent', key: 'usedPercent', render: (v: number) => percentValue(v) },
  ];

  const cpuRow = {
    coreNum: data?.cpu?.coreNum ?? data?.cpu?.Cores ?? data?.numCPU ?? 0,
    used: cpuUsed,
    free: cpuFree,
  };

  const memoryRow = {
    total: data?.memory?.total ?? data?.memTotal ?? 0,
    used: data?.memory?.used ?? data?.memory?.goUsed ?? 0,
    free: data?.memory?.free ?? data?.memory?.available ?? 0,
    usedPercent: data?.memory?.usedPercent ?? 0,
  };

  const diskRow = {
    total: data?.disk?.total ?? 0,
    used: data?.disk?.used ?? 0,
    free: data?.disk?.free ?? 0,
    usedPercent: data?.disk?.usedPercent ?? 0,
  };

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
                <Descriptions.Item label="操作系统">{data.os || data.host?.os || '-'}</Descriptions.Item>
                <Descriptions.Item label="系统架构">{data.machine || data.host?.kernelArch || '-'}</Descriptions.Item>
                <Descriptions.Item label="主机名称">{data.host?.hostname || '-'}</Descriptions.Item>
                <Descriptions.Item label="CPU核心数">{cpuRow.coreNum}</Descriptions.Item>
                <Descriptions.Item label="总内存">{formatBytes(memoryRow.total || 0)}</Descriptions.Item>
                <Descriptions.Item label="Go版本">{data.goVersion || data.go?.goVersion || '-'}</Descriptions.Item>
              </Descriptions>

              <Card title="CPU信息" style={{ marginBottom: 16 }}>
                <Table dataSource={[cpuRow]} columns={cpuColumns} pagination={false} rowKey="coreNum" />
              </Card>

              <Card title="内存信息" style={{ marginBottom: 16 }}>
                <Table dataSource={[memoryRow]} columns={memoryColumns} pagination={false} rowKey="total" />
              </Card>

              <Card title="磁盘信息" style={{ marginBottom: 16 }}>
                <Table dataSource={[diskRow]} columns={diskColumns} pagination={false} rowKey="total" />
              </Card>

              <Card title="运行环境信息">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="启动时间">{data.go?.startTime || '-'}</Descriptions.Item>
                  <Descriptions.Item label="运行时长">{data.go?.runTime || '-'}</Descriptions.Item>
                  <Descriptions.Item label="运行内存">{data.go?.goMem || '-'}</Descriptions.Item>
                  <Descriptions.Item label="语言环境">{data.go?.goName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="磁盘占用">{data.go?.goSize || '-'}</Descriptions.Item>
                  <Descriptions.Item label="项目地址">{data.go?.pwd || '-'}</Descriptions.Item>
                  <Descriptions.Item label="协程数量">{data.go?.goroutine || '-'}</Descriptions.Item>
                  <Descriptions.Item label="服务器IP">{data.host?.intranet_ip || '-'} / {data.host?.public_ip || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ServerMonitor;
