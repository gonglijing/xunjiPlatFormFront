import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Tag, Flex, Space } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DesktopOutlined,
  ApiOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import './index.css';
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartKey, setChartKey] = useState(0);
  const [stats, setStats] = useState({
    totalDevice: 0,
    onlineDevice: 0,
    offlineDevice: 0,
    alarmCount: 0,
  });

  useEffect(() => {
    // 模拟获取数据
    setTimeout(() => {
      setStats({
        totalDevice: 128,
        onlineDevice: 98,
        offlineDevice: 30,
        alarmCount: 5,
      });
      setLoading(false);
      // 强制重新渲染图表以避免卸载错误
      setChartKey(prev => prev + 1);
    }, 1000);
  }, []);
  
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '在线设备',
        type: 'line',
        data: [85, 88, 90, 92, 95, 96, 98],
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '离线设备',
        type: 'line',
        data: [20, 18, 15, 12, 10, 8, 30],
        smooth: true,
        itemStyle: { color: '#ff4d4f' },
      },
    ],
  };
  
  const deviceStatusOption = {
    title: {
      text: '设备状态分布',
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
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        data: [
          { value: stats.onlineDevice, name: '在线', itemStyle: { color: '#52c41a' } },
          { value: stats.offlineDevice, name: '离线', itemStyle: { color: '#ff4d4f' } },
        ],
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
                  <ArrowUpOutlined /> 5%
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
                  <ArrowDownOutlined /> 2%
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
          <Card title="设备状态分布">
            <ReactECharts key={`status-${chartKey}`} option={deviceStatusOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="最近告警" loading={loading}>
            <Space orientation="vertical" style={{ width: '100%' }} size={0}>
              {[
                { id: 1, title: '设备离线告警', device: '设备001', time: '10:30', level: 'high' },
                { id: 2, title: '温度过高告警', device: '设备002', time: '10:25', level: 'medium' },
                { id: 3, title: '信号弱告警', device: '设备003', time: '10:20', level: 'low' },
              ].map((item) => (
                <Flex key={item.id} align="center" justify="space-between" style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Flex align="center">
                    <Avatar
                      style={{
                        backgroundColor:
                          item.level === 'high'
                            ? '#ff4d4f'
                            : item.level === 'medium'
                            ? '#faad14'
                            : '#1890ff',
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
            <Space orientation="vertical" style={{ width: '100%' }} size={0}>
              {[
                { id: 1, action: '设备上线', target: '设备001', time: '10:30' },
                { id: 2, action: '配置更新', target: '产品001', time: '10:25' },
                { id: 3, action: '新建设备', target: '设备004', time: '10:20' },
              ].map((item) => (
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
