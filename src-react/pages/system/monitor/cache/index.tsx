import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Descriptions, message, Spin, Button, Table } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import getOrigin from '../../../../utils/origin';
import './index.css';

interface CacheInfoData {
  clients?: Record<string, any>;
  cpu?: Record<string, any>;
  memory?: Record<string, any>;
  stats?: Record<string, any>;
  server?: Record<string, any>;
  keyspace?: Record<string, any>;
  keyspaceList?: string[];
}

const CacheMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CacheInfoData>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.monitor.cache();
      setData(res || {});
    } catch (error) {
      message.error('获取缓存信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const es = new EventSource(getOrigin(`${import.meta.env.VITE_SERVER_URL || ''}/subscribe/redisinfo`));

    const mergeData = (key: keyof CacheInfoData) => (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data || '{}');
        if (key === 'keyspace') {
          setData((prev) => ({
            ...prev,
            keyspace: payload,
            keyspaceList: Object.keys(payload || {}),
          }));
          return;
        }
        setData((prev) => ({ ...prev, [key]: payload }));
      } catch {
        // ignore invalid event payload
      }
    };

    es.addEventListener('stats', mergeData('stats'));
    es.addEventListener('clients', mergeData('clients'));
    es.addEventListener('cpu', mergeData('cpu'));
    es.addEventListener('server', mergeData('server'));
    es.addEventListener('memory', mergeData('memory'));
    es.addEventListener('keyspace', mergeData('keyspace'));

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

  const keyspaceData = (data.keyspaceList || []).map((item) => ({
    key: item,
    name: item,
    keys: data.keyspace?.[item]?.keys || 0,
    expires: data.keyspace?.[item]?.expires || 0,
    avgTtl: data.keyspace?.[item]?.avg_ttl || 0,
  }));

  if (!Object.keys(data || {}).length) {
    return (
      <div className="cache-monitor-container" style={{ textAlign: 'center', padding: 50 }}>
        <Spin spinning={loading}>
          <div style={{ height: 200 }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="cache-monitor-container">
      <Card
        title="缓存监控"
        extra={(
          <Button icon={<SyncOutlined />} onClick={fetchData} loading={loading}>
            刷新
          </Button>
        )}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="客户端信息" loading={loading}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="当前客户端连接数">{data.clients?.connected_clients || 0}</Descriptions.Item>
                <Descriptions.Item label="输出缓冲区队列对象个数最大值">{data.clients?.client_recent_max_output_buffer || 0}</Descriptions.Item>
                <Descriptions.Item label="输入缓冲区占用最大容量">{formatBytes(data.clients?.client_recent_max_input_buffer || 0)}</Descriptions.Item>
                <Descriptions.Item label="等待阻塞命令的客户端数量">{data.clients?.blocked_clients || 0}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="CPU 信息" loading={loading}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="CPU核心数">{data.cpu?.used_cpu_sys || data.cpu?.used_cores || 0}</Descriptions.Item>
                <Descriptions.Item label="系统 CPU">{data.cpu?.sys || data.cpu?.used_cpu_sys || '0%'}</Descriptions.Item>
                <Descriptions.Item label="用户 CPU">{data.cpu?.user || data.cpu?.used_cpu_user || '0%'}</Descriptions.Item>
                <Descriptions.Item label="Redis CPU">{data.cpu?.redis || data.cpu?.used_cpu_sys_children || '0%'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="内存信息" loading={loading}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="已用内存">{formatBytes(data.memory?.used_memory || 0)}</Descriptions.Item>
                <Descriptions.Item label="内存峰值">{formatBytes(data.memory?.used_memory_peak || 0)}</Descriptions.Item>
                <Descriptions.Item label="内存使用率">{data.memory?.used_memory_peak_perc || '0%'}</Descriptions.Item>
                <Descriptions.Item label="内存碎片率">{data.memory?.mem_fragmentation_ratio || '0'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="服务信息" loading={loading}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Redis版本">{data.server?.redis_version || '-'}</Descriptions.Item>
                <Descriptions.Item label="运行模式">{data.server?.redis_mode || '-'}</Descriptions.Item>
                <Descriptions.Item label="运行天数">{data.server?.uptime_in_days || 0}</Descriptions.Item>
                <Descriptions.Item label="监听端口">{data.server?.tcp_port || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Card title="基础统计信息" style={{ marginTop: 16 }} loading={loading}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="连接过的客户端总数">{data.stats?.total_connections_received || 0}</Descriptions.Item>
            <Descriptions.Item label="执行过的命令总数">{data.stats?.total_commands_processed || 0}</Descriptions.Item>
            <Descriptions.Item label="每秒处理命令条数">{data.stats?.instantaneous_ops_per_sec || 0}</Descriptions.Item>
            <Descriptions.Item label="过期键数量">{data.stats?.expired_keys || 0}</Descriptions.Item>
            <Descriptions.Item label="命中次数">{data.stats?.keyspace_hits || 0}</Descriptions.Item>
            <Descriptions.Item label="不命中次数">{data.stats?.keyspace_misses || 0}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Keyspace统计信息" style={{ marginTop: 16 }} loading={loading}>
          <Table
            size="small"
            rowKey="name"
            pagination={false}
            dataSource={keyspaceData}
            columns={[
              { title: 'key名称', dataIndex: 'name' },
              { title: '当前数据库key总数', dataIndex: 'keys' },
              { title: '带有过期时间的key总数', dataIndex: 'expires' },
              { title: '平均存活时间(ms)', dataIndex: 'avgTtl' },
            ]}
          />
        </Card>
      </Card>
    </div>
  );
};

export default CacheMonitor;
