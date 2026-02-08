import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, message, Switch } from 'antd';
import { PlusOutlined, SyncOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import EditTask from './component/editTask';
import './index.css';

interface TaskItem {
  jobId: number;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  cronExpression: string;
  status: number;
  remark: string;
}

const TaskList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TaskItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    jobName: '',
    jobGroup: '',
    status: null as number | null,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<TaskItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.system.task.getList(params);
      setData(res.list || []);
      setTotal(res.total || 0);
    } catch (error) {
      message.error('获取任务列表失败');
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
    setParams({ pageNum: 1, pageSize: 10, jobName: '', jobGroup: '', status: null });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: TaskItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleStatusChange = async (record: TaskItem) => {
    try {
      await sysApi.system.task.changeStatus({ jobId: record.jobId, status: record.status === 0 ? 1 : 0 });
      message.success(record.status === 0 ? '任务已禁用' : '任务已启用');
      fetchData();
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const handleRun = async (record: TaskItem) => {
    Modal.confirm({
      title: '执行任务',
      content: `确定要立即执行任务 "${record.jobName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.task.runOnce(record.jobId);
          message.success('任务执行成功');
        } catch (error) {
          message.error('任务执行失败');
        }
      },
    });
  };

  const handleDelete = (record: TaskItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务 "${record.jobName}" 吗?`,
      onOk: async () => {
        try {
          await sysApi.system.task.del(record.jobId);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const getStatusTag = (status: number) => (
    <Tag color={status === 0 ? 'success' : 'error'}>
      {status === 0 ? '启用' : '禁用'}
    </Tag>
  );

  const columns = [
    { title: 'ID', dataIndex: 'jobId', key: 'jobId', width: 80 },
    { title: '任务名称', dataIndex: 'jobName', key: 'jobName', width: 150, ellipsis: true },
    { title: '任务分组', dataIndex: 'jobGroup', key: 'jobGroup', width: 120 },
    { title: '调用目标', dataIndex: 'invokeTarget', key: 'invokeTarget', width: 150, ellipsis: true },
    { title: 'Cron表达式', dataIndex: 'cronExpression', key: 'cronExpression', width: 120 },
    { title: '描述', dataIndex: 'remark', key: 'remark', width: 150, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: TaskItem) => (
        <Switch
          checked={status === 0}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={() => handleStatusChange(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: TaskItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleRun(record)}>
            执行
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="task-list-container">
      <Card title="任务调度">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="任务名称"
            style={{ width: 150 }}
            value={params.jobName}
            onChange={(e) => setParams({ ...params, jobName: e.target.value })}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="任务组名"
            style={{ width: 150 }}
            allowClear
            value={params.jobGroup || undefined}
            onChange={(value) => setParams({ ...params, jobGroup: value || '' })}
          >
            <Select.Option value="DEFAULT">默认</Select.Option>
            <Select.Option value="SYSTEM">系统</Select.Option>
          </Select>
          <Select
            placeholder="任务状态"
            style={{ width: 100 }}
            allowClear
            value={params.status}
            onChange={(value) => setParams({ ...params, status: value ?? null })}
          >
            <Select.Option value={0}>启用</Select.Option>
            <Select.Option value={1}>禁用</Select.Option>
          </Select>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增任务
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="jobId"
          loading={loading}
          pagination={{
            total,
            current: params.pageNum,
            pageSize: params.pageSize,
            onChange: (page, pageSize) => setParams({ ...params, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <EditTask
        visible={editVisible}
        data={editingItem}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default TaskList;
