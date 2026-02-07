import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, message, Tag } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import alarmApi from '../../../api/alarm';
import './index.css';
const { Search } = Input;
const AlarmList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [form] = Form.useForm();
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟数据
      setData([
        { id: 1, name: '温度过高告警', deviceName: '设备001', level: 'high', status: 'triggered', createdAt: '2024-01-01 10:30' },
        { id: 2, name: '设备离线告警', deviceName: '设备002', level: 'medium', status: 'resolved', createdAt: '2024-01-01 10:25' },
      ]);
    } catch (error) { message.error('获取告警列表失败'); }
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);
  
  const columns = [
    { title: '告警名称', dataIndex: 'name', key: 'name' },
    { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName' },
    { title: '告警级别', dataIndex: 'level', key: 'level', render: (l: string) => (
      <Tag color={l === 'high' ? 'red' : l === 'medium' ? 'orange' : 'blue'}>
        {l === 'high' ? '严重' : l === 'medium' ? '中等' : '一般'}
      </Tag>
    )},
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'triggered' ? 'red' : 'green'}>{s === 'triggered' ? '已触发' : '已解除'}</Tag>
    )},
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];
  
  return (
    <div className="alarm-list-container">
      <Card title="告警管理" extra={
        <Space>
          <Search placeholder="搜索告警" style={{ width: 200 }} />
          <Button icon={<SyncOutlined />} onClick={fetchData}>刷新</Button>
        </Space>
      }>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
    </div>
  );
};
export default AlarmList;
