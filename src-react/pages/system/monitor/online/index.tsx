import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal } from 'antd';
import { SyncOutlined, LogoutOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

interface OnlineItem {
  id: number;
  userName: string;
  token: string;
  ip: string;
  createdAt: string;
  explorer: string;
  os: string;
}

const OnlineList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnlineItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.monitor.online();
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取在线用户失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleForceLogout = (record: OnlineItem) => {
    Modal.confirm({
      title: '确认强退',
      content: `确定要强退用户 "${record.userName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.monitor.kickout(record.id);
          message.success('强退成功');
          fetchData();
        } catch (error) {
          message.error('强退失败');
        }
      },
    });
  };

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'userName', key: 'userName', width: 120 },
    { title: 'Token', dataIndex: 'token', key: 'token', width: 200, ellipsis: true },
    { title: '登录地址', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '登录时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    { title: '浏览器', dataIndex: 'explorer', key: 'explorer', width: 120 },
    { title: '操作系统', dataIndex: 'os', key: 'os', width: 120, ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: OnlineItem) => (
        <Button type="link" danger icon={<LogoutOutlined />} onClick={() => handleForceLogout(record)}>
          强退
        </Button>
      ),
    },
  ];

  return (
    <div className="online-container">
      <Card title="在线用户">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
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

export default OnlineList;
