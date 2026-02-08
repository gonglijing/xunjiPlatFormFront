import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Descriptions, message, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

const CacheMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

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
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!data) {
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
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="客户端信息" loading={loading}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="当前客户端连接数">
                {data.clients?.connected_clients || 0}
              </Descriptions.Item>
              <Descriptions.Item label="输出缓冲区队列对象个数最大值">
                {data.clients?.client_recent_max_output_buffer || 0}
              </Descriptions.Item>
              <Descriptions.Item label="输入缓冲区占用最大容量">
                {formatBytes(data.clients?.client_recent_max_input_buffer || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="等待阻塞命令的客户端数量">
                {data.clients?.blocked_clients || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="CPU 信息" loading={loading}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="CPU核心数">
                {data.cpu?.used_cores || 0}
              </Descriptions.Item>
              <Descriptions.Item label="系统 CPU">
                {data.cpu?.sys || '0%'}
              </Descriptions.Item>
              <Descriptions.Item label="用户 CPU">
                {data.cpu?.user || '0%'}
              </Descriptions.Item>
              <Descriptions.Item label="Redis CPU">
                {data.cpu?.redis || '0%'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="内存信息" loading={loading}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="已用内存">
                {formatBytes(data.memory?.used_memory || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="内存峰值">
                {formatBytes(data.memory?.used_memory_peak || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="内存使用率">
                {data.memory?.used_memory_peak_perc || '0%'}
              </Descriptions.Item>
              <Descriptions.Item label="内存碎片率">
                {data.memory?.mem_fragmentation_ratio || '0'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="统计信息" loading={loading}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="键值数量">
                {data.stats?.keyspace_hits || 0}
              </Descriptions.Item>
              <Descriptions.Item label="键值命中率">
                {data.stats?.keyspace_misses || 0}
              </Descriptions.Item>
              <Descriptions.Item label="过期键数量">
                {data.stats?.expired_keys || 0}
              </Descriptions.Item>
              <Descriptions.Item label="驱逐键数量">
                {data.stats?.evicted_keys || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CacheMonitor;
