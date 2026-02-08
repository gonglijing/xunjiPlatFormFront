import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Tag, Flex, Space, message } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DesktopOutlined,
  ApiOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import datahubApi from '../../../api/datahub';
import './index.css';

interface AlarmLite {
  id: number;
  title: string;
  device: string;
  time: string;
  level: 'high' | 'medium' | 'low';
}

interface ActivityLite {
  id: number;
  action: string;
  target: string;
  time: string;
}

type DashboardRecord = Record<string, unknown>;

const asRecord = (value: unknown): DashboardRecord => {
  if (typeof value === 'object' && value !== null) {
    return value as DashboardRecord;
  }
  return {};
};

const toList = <T = DashboardRecord>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];

  const record = asRecord(payload);
  if (Array.isArray(record.list)) return record.list as T[];
  if (Array.isArray(record.data)) return record.data as T[];
  if (Array.isArray(record.Data)) return record.Data as T[];
  if (Array.isArray(record.Info)) return record.Info as T[];

  return [];
};

const toNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeLevel = (name?: string): 'high' | 'medium' | 'low' => {
  const text = `${name || ''}`;
  if (text.includes('严重') || text.includes('高')) return 'high';
  if (text.includes('警') || text.includes('中')) return 'medium';
  return 'low';
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0);
  const [stats, setStats] = useState({
    totalDevice: 0,
    onlineDevice: 0,
    offlineDevice: 0,
    alarmCount: 0,
  });
  const [trend, setTrend] = useState({
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    msg: [0, 0, 0, 0, 0, 0],
    alarm: [0, 0, 0, 0, 0, 0],
  });
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [recentAlarms, setRecentAlarms] = useState<AlarmLite[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityLite[]>([]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const year = `${new Date().getFullYear()}`;
      const month = `${new Date().getMonth() + 1}`.padStart(2, '0');
      const day = `${new Date().getDate()}`.padStart(2, '0');
      const date = `${year}-${month}-${day}`;

      const settled = await Promise.allSettled([
        datahubApi.iotManage.deviceOnlineOfflineCount(),
        datahubApi.iotManage.getAlarmList({ pageNum: 1, pageSize: 5 }),
        datahubApi.iotManage.deviceDataCount('year'),
        datahubApi.iotManage.deviceAlertCountByYearMonth(year),
        datahubApi.iotManage.deviceAlarmLevelCount('year', date),
        datahubApi.iotManage.productCount(),
      ]);

      const take = (index: number) => {
        const result = settled[index];
        if (!result || result.status !== 'fulfilled') {
          return null;
        }
        return result.value;
      };

      const onlineRaw = take(0);
      const alarmRaw = take(1);
      const msgTrendRaw = take(2);
      const alarmTrendRaw = take(3);
      const alarmLevelRaw = take(4);
      const productRaw = take(5);

      const onlinePayload = asRecord(asRecord(onlineRaw).data ?? onlineRaw);
      const onlineDevice = toNumber(
        onlinePayload.online ??
          onlinePayload.onlineCount ??
          onlinePayload.onlineNum ??
          onlinePayload.Online
      );
      const offlineDevice = toNumber(
        onlinePayload.offline ??
          onlinePayload.offlineCount ??
          onlinePayload.offlineNum ??
          onlinePayload.Offline
      );
      const totalDevice = toNumber(
        onlinePayload.total ??
          onlinePayload.totalCount ??
          onlinePayload.Total,
        onlineDevice + offlineDevice
      );

      const alarmPayload = asRecord(asRecord(alarmRaw).data ?? alarmRaw);
      const alarmList = toList(alarmPayload);
      const alarmCount = toNumber(alarmPayload.total ?? alarmPayload.Total, alarmList.length);

      const msgTrendList = toList(asRecord(msgTrendRaw).data ?? msgTrendRaw);
      const alarmTrendList = toList(asRecord(alarmTrendRaw).data ?? alarmTrendRaw);
      const trendSource = msgTrendList.length ? msgTrendList : alarmTrendList;
      const trendLabels = trendSource.map((entry, index: number) => {
        const item = asRecord(entry);
        return String(item.Title || item.title || item.month || item.Month || `${index + 1}月`);
      });
      const msgTrendData = (msgTrendList.length ? msgTrendList : trendSource).map((entry) => {
        const item = asRecord(entry);
        return toNumber(item.Value ?? item.value ?? item.count ?? item.total);
      });
      const alarmTrendData = (alarmTrendList.length ? alarmTrendList : trendSource).map((entry) => {
        const item = asRecord(entry);
        return toNumber(item.Value ?? item.value ?? item.count ?? item.total);
      });

      const levelList = toList(asRecord(alarmLevelRaw).data ?? alarmLevelRaw);
      const nextPieData = levelList
        .map((entry, index: number) => {
          const item = asRecord(entry);
          return {
            name: String(item.Title || item.title || item.name || `级别${index + 1}`),
            value: toNumber(item.Value ?? item.value ?? item.count),
          };
        })
        .filter((item) => item.value > 0);

      const productPayload = asRecord(asRecord(productRaw).data ?? productRaw);
      const productCount = toNumber(
        productPayload.count ?? productPayload.total ?? productPayload.Total ?? productPayload.value
      );

      const nextRecentAlarms: AlarmLite[] = alarmList.slice(0, 3).map((entry, index: number) => {
        const item = asRecord(entry);
        const alarmLevel = asRecord(item.alarmLevel);
        const timestamp = String(item.createdAt || item.time || '');
        return {
          id: toNumber(item.id, index + 1),
          title: String(item.ruleName || item.name || '告警事件'),
          device: String(item.deviceKey || item.productKey || '-'),
          time: (timestamp.slice(11, 16) || '--:--'),
          level: normalizeLevel(String(alarmLevel.name || item.level || '')),
        };
      });

      const now = new Date();
      const timeText = `${`${now.getHours()}`.padStart(2, '0')}:${`${now.getMinutes()}`.padStart(2, '0')}`;
      const nextRecentActivities: ActivityLite[] = [
        { id: 1, action: '设备总数更新', target: `${totalDevice} 台`, time: timeText },
        { id: 2, action: '在线设备统计', target: `${onlineDevice} 台`, time: timeText },
        { id: 3, action: '产品总数统计', target: `${productCount} 个`, time: timeText },
      ];

      setStats({ totalDevice, onlineDevice, offlineDevice, alarmCount });
      setTrend({
        xAxis: trendLabels.length ? trendLabels : ['1月', '2月', '3月', '4月', '5月', '6月'],
        msg: msgTrendData.length ? msgTrendData : [0, 0, 0, 0, 0, 0],
        alarm: alarmTrendData.length ? alarmTrendData : [0, 0, 0, 0, 0, 0],
      });
      setPieData(nextPieData.length ? nextPieData : [{ name: '暂无数据', value: 1 }]);
      setRecentAlarms(nextRecentAlarms);
      setRecentActivities(nextRecentActivities);
      setChartKey((prev) => prev + 1);
    } catch (error) {
      message.error('获取看板数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onlineRate = stats.totalDevice > 0 ? ((stats.onlineDevice / stats.totalDevice) * 100).toFixed(1) : '0.0';
  const offlineRate = stats.totalDevice > 0 ? ((stats.offlineDevice / stats.totalDevice) * 100).toFixed(1) : '0.0';

  const deviceTrendOption = {
    title: {
      text: '设备趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: trend.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '消息量',
        type: 'line',
        data: trend.msg,
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '告警量',
        type: 'line',
        data: trend.alarm,
        smooth: true,
        itemStyle: { color: '#ff4d4f' },
      },
    ],
  };

  const deviceStatusOption = {
    title: {
      text: '告警级别分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '告警级别',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: pieData,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="设备总数"
              value={stats.totalDevice}
              prefix={<DesktopOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="在线设备"
              value={stats.onlineDevice}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#52c41a' } }}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a', marginLeft: 8 }}>
                  <ArrowUpOutlined /> {onlineRate}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="离线设备"
              value={stats.offlineDevice}
              prefix={<ApiOutlined />}
              styles={{ content: { color: '#ff4d4f' } }}
              suffix={
                <span style={{ fontSize: 14, color: '#ff4d4f', marginLeft: 8 }}>
                  <ArrowDownOutlined /> {offlineRate}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="告警数量"
              value={stats.alarmCount}
              prefix={<WarningOutlined />}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={14}>
          <Card title="设备趋势">
            <ReactECharts key={`trend-${chartKey}`} option={deviceTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="告警级别分布">
            <ReactECharts key={`status-${chartKey}`} option={deviceStatusOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="最近告警" loading={loading}>
            <Space direction="vertical" style={{ width: '100%' }} size={0}>
              {recentAlarms.map((item) => (
                <Flex key={item.id} align="center" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Flex align="center">
                    <Avatar
                      style={{
                        backgroundColor: item.level === 'high' ? '#ff4d4f' : item.level === 'medium' ? '#faad14' : '#1890ff',
                        marginRight: 12,
                      }}
                      icon={<WarningOutlined />}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.title}</div>
                      <div style={{ color: '#999', fontSize: 12 }}>{`${item.device} - ${item.time}`}</div>
                    </div>
                  </Flex>
                  <Tag color={item.level === 'high' ? 'red' : item.level === 'medium' ? 'orange' : 'blue'}>
                    {item.level === 'high' ? '严重' : item.level === 'medium' ? '中等' : '一般'}
                  </Tag>
                </Flex>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近活动" loading={loading}>
            <Space direction="vertical" style={{ width: '100%' }} size={0}>
              {recentActivities.map((item) => (
                <Flex key={item.id} align="center" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Flex align="center">
                    <Avatar style={{ backgroundColor: '#1890ff', marginRight: 12 }}>{item.action[0]}</Avatar>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.action}</div>
                      <div style={{ color: '#999', fontSize: 12 }}>{`${item.target} - ${item.time}`}</div>
                    </div>
                  </Flex>
                </Flex>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
