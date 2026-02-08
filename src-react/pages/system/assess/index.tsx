import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import assessApi from '../../../api/assess';
import getOrigin from '../../../utils/origin';
import './index.css';

interface TargetRange {
  start_value?: number;
  end_value?: number;
  base_value?: number;
}

interface TargetItem {
  name: string;
  title: string;
  weight: number;
  ranges: TargetRange[];
  [key: string]: any;
}

interface AssessRow {
  id: number;
  itemCode: string;
  title: string;
  explain: string;
  status: number;
  createdAt: string;
  targets: TargetItem[];
  raw: any;
}

interface TaskConfig {
  target: string;
  uri: string;
  object: string;
  get_time: string;
  state: number;
  [key: string]: any;
}

const toList = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.Data)) return payload.Data;
  return [];
};

const normalizeTargets = (targets: any): TargetItem[] => {
  if (!Array.isArray(targets)) return [];
  return targets.map((item: any) => ({
    name: item?.name || '',
    title: item?.title || '',
    weight: Number(item?.weight || 0),
    ranges: Array.isArray(item?.ranges)
      ? item.ranges.map((range: any) => ({
          start_value: range?.start_value !== undefined ? Number(range.start_value) : undefined,
          end_value: range?.end_value !== undefined ? Number(range.end_value) : undefined,
          base_value: range?.base_value !== undefined ? Number(range.base_value) : undefined,
        }))
      : [],
    ...item,
  }));
};

const assessBaseUrl = getOrigin(import.meta.env.VITE_ASSESS_URL || '');

const AssessList: React.FC = () => {
  const [queryParams, setQueryParams] = useState({
    pageNum: 1,
    pageSize: 10,
    keyWord: '',
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState<AssessRow[]>([]);
  const [total, setTotal] = useState(0);

  const [editVisible, setEditVisible] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editingRow, setEditingRow] = useState<AssessRow | null>(null);
  const [editingTargets, setEditingTargets] = useState<TargetItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editForm] = Form.useForm();

  const [targetVisible, setTargetVisible] = useState(false);
  const [targetSaving, setTargetSaving] = useState(false);
  const [targetForm] = Form.useForm();
  const [targetEditIndex, setTargetEditIndex] = useState<number>(-1);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailModalLoading, setDetailModalLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<AssessRow | null>(null);

  const [taskVisible, setTaskVisible] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);
  const [taskTesting, setTaskTesting] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskIsEdit, setTaskIsEdit] = useState(false);
  const [taskTestResult, setTaskTestResult] = useState<any>('');
  const [taskTarget, setTaskTarget] = useState<TargetItem | null>(null);
  const [taskForm] = Form.useForm();

  const currentItemCode = useMemo(() => {
    const formCode = editForm.getFieldValue('itemCode');
    return formCode || editingRow?.itemCode || editingRow?.raw?.item_code || '';
  }, [editForm, editingRow]);

  const normalizeRow = (item: any, index: number): AssessRow => ({
    id: Number(item?.id || item?.ID || index + 1),
    itemCode: item?.item_code || item?.itemCode || '',
    title: item?.title || item?.name || '',
    explain: item?.explain || item?.description || '',
    status: Number(item?.status ?? 1),
    createdAt: item?.createdAt || item?.createTime || item?.create_at || '',
    targets: normalizeTargets(item?.targets),
    raw: item,
  });

  const fetchTableData = async () => {
    setTableLoading(true);
    try {
      let setupRes: any = null;
      try {
        setupRes = await assessApi.getList({ keyWord: queryParams.keyWord });
      } catch (error) {
        setupRes = null;
      }

      if (setupRes) {
        const payload = setupRes?.data || setupRes;
        const source = Array.isArray(payload) ? payload : toList(payload);
        const normalized = source.map(normalizeRow);
        const filtered = queryParams.keyWord
          ? normalized.filter((item) =>
              [item.title, item.explain, item.itemCode].some((value) => `${value || ''}`.includes(queryParams.keyWord))
            )
          : normalized;

        const hasTotal = payload?.total !== undefined || payload?.Total !== undefined;
        const totalCount = Number(payload?.total || payload?.Total || filtered.length) || 0;
        const paged = hasTotal
          ? filtered
          : filtered.slice((queryParams.pageNum - 1) * queryParams.pageSize, queryParams.pageNum * queryParams.pageSize);

        setTableData(paged);
        setTotal(totalCount);
        return;
      }

      const fallbackRes: any = await assessApi.assess.getList(queryParams);
      const list = toList(fallbackRes?.data || fallbackRes).map(normalizeRow);
      setTableData(list);
      setTotal(Number(fallbackRes?.total || fallbackRes?.Total || list.length) || 0);
    } catch (error) {
      message.error('获取考核列表失败');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [queryParams]);

  const loadAssessDetail = async (itemCode: string, fallback: any) => {
    if (!itemCode) return fallback;
    try {
      const res: any = await assessApi.getList({ itemcode: itemCode });
      const payload = res?.data || res;
      if (Array.isArray(payload)) return payload[0] || fallback;
      return payload || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const openDetailModal = async (record: AssessRow) => {
    setDetailVisible(true);
    setDetailModalLoading(true);
    try {
      const detailRaw = await loadAssessDetail(record.itemCode, record.raw);
      setDetailRow(normalizeRow(detailRaw, 0));
    } finally {
      setDetailModalLoading(false);
    }
  };

  const closeDetailModal = () => {
    setDetailVisible(false);
    setDetailModalLoading(false);
    setDetailRow(null);
  };

  const buildDetailDocText = (row: AssessRow) => {
    const targetNames = (row.targets || []).map((item) => item.name).filter(Boolean).join(', ') || '-';
    return [
      `详细介绍：${row.explain || '-'}`,
      'SecretKey：调用 API 的安全密码，请联系管理员获取',
      `入口URL：${assessBaseUrl}/data`,
      '请求方式：POST',
      `Body参数 itemcode：${row.itemCode || '-'}`,
      `Body参数 name：${targetNames}`,
      'Body参数 value：当前值',
      'Body参数 form_info：平台数据',
      `出口URL：${assessBaseUrl}/index`,
      '请求方式：GET',
      `Query参数 itemcode：${row.itemCode || '-'}`,
    ].join('\n');
  };

  const copyDetailDoc = async () => {
    if (!detailRow) {
      message.info('暂无可复制内容');
      return;
    }

    const content = buildDetailDocText(detailRow);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      message.success('接口文档已复制');
    } catch (error) {
      message.error('复制失败');
    }
  };

  const exportDetailDocTxt = () => {
    if (!detailRow) {
      message.info('暂无可导出内容');
      return;
    }

    const content = buildDetailDocText(detailRow);
    const safeItemCode = (detailRow.itemCode || 'detail').replace(/[^\w.-]+/g, '_');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assess-interface-${safeItemCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('TXT 已导出');
  };

  const openEditModal = async (record?: AssessRow) => {
    setEditingRow(record || null);
    setEditVisible(true);
    setDetailLoading(Boolean(record));

    if (!record) {
      setEditingTargets([]);
      editForm.setFieldsValue({
        title: '',
        explain: '',
        itemCode: '',
      });
      setDetailLoading(false);
      return;
    }

    const detail = await loadAssessDetail(record.itemCode, record.raw);
    const targets = normalizeTargets(detail?.targets || record.targets || []);

    editForm.setFieldsValue({
      title: detail?.title || record.title,
      explain: detail?.explain || record.explain,
      itemCode: detail?.item_code || record.itemCode,
    });
    setEditingTargets(targets);
    setDetailLoading(false);
  };

  const closeEditModal = () => {
    setEditVisible(false);
    setEditingRow(null);
    setEditingTargets([]);
    setDetailLoading(false);
  };

  const saveAssess = async () => {
    try {
      const values = await editForm.validateFields();
      setEditSaving(true);

      const payload = {
        ...(editingRow?.raw || {}),
        title: values.title,
        explain: values.explain || '',
        item_code: values.itemCode || editingRow?.itemCode || editingRow?.raw?.item_code || '',
        targets: editingTargets,
      };

      await assessApi.setItem(payload);
      message.success(editingRow ? '编辑成功' : '新增成功');
      closeEditModal();
      fetchTableData();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('保存失败');
      }
    } finally {
      setEditSaving(false);
    }
  };

  const openTargetModal = (target?: TargetItem, index = -1) => {
    setTargetEditIndex(index);
    setTargetVisible(true);

    targetForm.setFieldsValue({
      name: target?.name || '',
      title: target?.title || '',
      weight: target?.weight ?? undefined,
      ranges: (target?.ranges || []).map((item) => ({
        start_value: item.start_value,
        end_value: item.end_value,
        base_value: item.base_value,
      })),
    });
  };

  const closeTargetModal = () => {
    setTargetVisible(false);
    setTargetEditIndex(-1);
    targetForm.resetFields();
  };

  const saveTarget = async () => {
    try {
      const values = await targetForm.validateFields();
      setTargetSaving(true);

      const ranges: TargetRange[] = Array.isArray(values.ranges) ? values.ranges : [];
      for (const range of ranges) {
        const start = Number(range?.start_value);
        const end = Number(range?.end_value);
        const score = Number(range?.base_value);
        if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(score)) {
          message.error('请完善取值范围与得分');
          setTargetSaving(false);
          return;
        }
        if (start >= end) {
          message.error('取值范围必须满足最小值小于最大值');
          setTargetSaving(false);
          return;
        }
      }

      const target: TargetItem = {
        name: values.name,
        title: values.title,
        weight: Number(values.weight),
        ranges,
      };

      setEditingTargets((prev) => {
        if (targetEditIndex >= 0) {
          const next = [...prev];
          next[targetEditIndex] = target;
          return next;
        }
        return [...prev, target];
      });

      closeTargetModal();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('保存指标项失败');
      }
    } finally {
      setTargetSaving(false);
    }
  };

  const deleteTarget = (index: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该指标项吗?',
      onOk: () => {
        setEditingTargets((prev) => prev.filter((_, idx) => idx !== index));
      },
    });
  };

  const openTaskModal = async (target: TargetItem) => {
    const itemCode = currentItemCode;
    if (!itemCode) {
      message.info('请先保存指标，再配置任务接口');
      return;
    }

    setTaskVisible(true);
    setTaskTarget(target);
    setTaskLoading(true);
    setTaskTestResult('');

    try {
      const res: any = await assessApi.getDataSourceInfo({
        item_code: itemCode,
        target_name: target.name,
      });

      const payload = res?.data || res;
      if (payload) {
        setTaskIsEdit(true);
        taskForm.setFieldsValue({
          ...payload,
          target: payload.target || target.name,
          state: Number(payload.state ?? 1),
        });
      } else {
        setTaskIsEdit(false);
        taskForm.setFieldsValue({
          target: target.name,
          uri: '',
          object: '',
          get_time: '',
          state: 1,
        });
      }
    } catch (error) {
      setTaskIsEdit(false);
      taskForm.setFieldsValue({
        target: target.name,
        uri: '',
        object: '',
        get_time: '',
        state: 1,
      });
    } finally {
      setTaskLoading(false);
    }
  };

  const closeTaskModal = () => {
    setTaskVisible(false);
    setTaskTarget(null);
    setTaskTestResult('');
    setTaskIsEdit(false);
    taskForm.resetFields();
  };

  const testTaskSource = async () => {
    const uri = taskForm.getFieldValue('uri');
    const object = taskForm.getFieldValue('object');
    if (!uri || !object) {
      message.error('请先填写 URL 和取值项');
      return;
    }

    setTaskTesting(true);
    try {
      const res = await assessApi.testDataSource({ uri, object });
      setTaskTestResult(res?.data ?? res);
      message.success('检测完成');
    } catch (error) {
      message.error('检测失败');
    } finally {
      setTaskTesting(false);
    }
  };

  const saveTaskSource = async () => {
    try {
      const values = await taskForm.validateFields();
      setTaskSaving(true);

      const payload: TaskConfig = {
        ...values,
        item_code: currentItemCode,
        target: values.target || taskTarget?.name,
      };

      if (taskIsEdit) {
        await assessApi.editataSourceInfo(payload);
      } else {
        await assessApi.addDataSourceInfo(payload);
      }

      message.success('任务接口保存成功');
      closeTaskModal();
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('任务接口保存失败');
      }
    } finally {
      setTaskSaving(false);
    }
  };

  const callGenerateApi = async (record: AssessRow) => {
    const payload = {
      id: record.id,
      assessId: record.id,
      itemcode: record.itemCode,
    };

    const handlers = [
      () => assessApi.assess.generate(payload),
      () => assessApi.records.generate(payload),
      () => assessApi.total.generate(payload),
      () => assessApi.testDataSource(payload),
    ];

    let lastError: any = null;
    for (const request of handlers) {
      try {
        await request();
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('生成失败');
  };

  const generateAssess = (record: AssessRow) => {
    Modal.confirm({
      title: '生成考核',
      content: `确定要为 "${record.title}" 生成考核吗?`,
      onOk: async () => {
        try {
          await callGenerateApi(record);
          message.success('生成成功');
          fetchTableData();
        } catch (error) {
          message.error('生成失败，请检查考核服务接口配置');
        }
      },
    });
  };

  const deleteAssess = (record: AssessRow) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除考核 "${record.title}" 吗?`,
      onOk: async () => {
        try {
          if (record.itemCode) {
            await assessApi.deleteItem({ itemcode: record.itemCode });
          } else {
            await assessApi.assess.del(record.id);
          }
          message.success('删除成功');
          fetchTableData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const targetColumns = [
    {
      title: '标识',
      dataIndex: 'name',
      key: 'name',
      width: 130,
    },
    {
      title: '数据项',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '权重(%)',
      dataIndex: 'weight',
      key: 'weight',
      width: 90,
    },
    {
      title: '取值范围',
      dataIndex: 'ranges',
      key: 'ranges',
      render: (ranges: TargetRange[]) => {
        if (!Array.isArray(ranges) || ranges.length === 0) return '-';
        return (
          <Space wrap>
            {ranges.map((item, idx) => (
              <Tag key={idx}>{`${item.start_value}~${item.end_value} => ${item.base_value}`}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: TargetItem, index: number) => (
        <Space>
          <Button type="link" size="small" onClick={() => openTargetModal(record, index)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => openTaskModal(record)}
            disabled={!currentItemCode}
          >
            任务接口
          </Button>
          <Button type="link" size="small" danger onClick={() => deleteTarget(index)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const assessColumns = [
    { title: '名称', dataIndex: 'title', key: 'title', width: 180 },
    { title: '描述', dataIndex: 'explain', key: 'explain', ellipsis: true },
    { title: '编码', dataIndex: 'itemCode', key: 'itemCode', width: 140 },
    {
      title: '指标数',
      dataIndex: 'targets',
      key: 'targets',
      width: 90,
      render: (targets: TargetItem[]) => (Array.isArray(targets) ? targets.length : 0),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'warning'}>
          {status === 1 ? '可用' : '停用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: AssessRow) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openDetailModal(record)}>
            详细
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => generateAssess(record)}>
            生成
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => deleteAssess(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="assess-list-container">
      <Card
        title="考核评估"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditModal()}>
            新建
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="名称/描述/编码"
            style={{ width: 240 }}
            value={queryParams.keyWord}
            onChange={(e) => setQueryParams({ ...queryParams, keyWord: e.target.value })}
            onPressEnter={() => setQueryParams({ ...queryParams, pageNum: 1 })}
          />
          <Button type="primary" icon={<SyncOutlined />} onClick={() => setQueryParams({ ...queryParams, pageNum: 1 })}>
            查询
          </Button>
          <Button onClick={() => setQueryParams({ pageNum: 1, pageSize: 10, keyWord: '' })}>
            重置
          </Button>
        </Space>

        <Table
          columns={assessColumns}
          dataSource={tableData}
          rowKey={(row) => row.itemCode || String(row.id)}
          loading={tableLoading}
          pagination={{
            total,
            current: queryParams.pageNum,
            pageSize: queryParams.pageSize,
            onChange: (page, pageSize) => setQueryParams({ ...queryParams, pageNum: page, pageSize }),
          }}
        />
      </Card>

      <Modal
        title={editingRow ? '编辑指标' : '新增指标'}
        open={editVisible}
        onCancel={closeEditModal}
        onOk={saveAssess}
        confirmLoading={editSaving}
        width={960}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" disabled={detailLoading}>
          <Form.Item name="title" label="评价名称" rules={[{ required: true, message: '请输入评价名称' }]}>
            <Input placeholder="请输入评价名称" />
          </Form.Item>
          <Form.Item name="explain" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="itemCode" label="编码">
            <Input placeholder="保存后由后端生成或返回" disabled />
          </Form.Item>
        </Form>

        <div className="assess-target-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openTargetModal()}>
            增加指标项
          </Button>
          {!currentItemCode && <span className="assess-tip">未保存前无法配置“任务接口”</span>}
        </div>

        <Table
          columns={targetColumns}
          dataSource={editingTargets}
          rowKey={(_, index) => String(index)}
          pagination={false}
          size="small"
        />
      </Modal>

      <Modal
        title={targetEditIndex >= 0 ? '编辑标识项' : '新建标识项'}
        open={targetVisible}
        onCancel={closeTargetModal}
        onOk={saveTarget}
        confirmLoading={targetSaving}
        width={760}
        destroyOnClose
      >
        <Form form={targetForm} layout="vertical">
          <Form.Item name="name" label="标识" rules={[{ required: true, message: '请输入标识' }]}>
            <Input placeholder="请输入标识" />
          </Form.Item>
          <Form.Item name="title" label="数据项名称" rules={[{ required: true, message: '请输入数据项名称' }]}>
            <Input placeholder="请输入数据项名称" />
          </Form.Item>
          <Form.Item name="weight" label="权重(%)" rules={[{ required: true, message: '请输入权重' }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入权重" />
          </Form.Item>
          <Form.List name="ranges">
            {(fields, { add, remove }) => (
              <div className="target-range-block">
                <div className="target-range-header">
                  <span>取值范围</span>
                  <Button size="small" onClick={() => add()}>
                    添加范围
                  </Button>
                </div>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                    <Form.Item
                      {...field}
                      name={[field.name, 'start_value']}
                      rules={[{ required: true, message: '最小值' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber placeholder="最小值" />
                    </Form.Item>
                    <span>~</span>
                    <Form.Item
                      {...field}
                      name={[field.name, 'end_value']}
                      rules={[{ required: true, message: '最大值' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber placeholder="最大值" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'base_value']}
                      rules={[{ required: true, message: '得分' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber placeholder="得分" />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)}>
                      删除
                    </Button>
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title="数据源配置接口"
        open={taskVisible}
        onCancel={closeTaskModal}
        onOk={saveTaskSource}
        confirmLoading={taskSaving}
        width={720}
        destroyOnClose
      >
        <Form form={taskForm} layout="vertical" disabled={taskLoading}>
          <Form.Item name="target" label="指标名称">
            <Input disabled />
          </Form.Item>
          <Form.Item name="uri" label="URL" rules={[{ required: true, message: '请输入 URL' }]}>
            <Input placeholder="请输入数据源 URL" />
          </Form.Item>
          <Form.Item name="object" label="取值项" rules={[{ required: true, message: '请输入取值项' }]}>
            <Input placeholder="请输入取值项" />
          </Form.Item>
          <Form.Item name="get_time" label="取值周期" rules={[{ required: true, message: '请输入取值周期' }]}>
            <Input placeholder="CRON 表达式，例如 0 0 0 1 * *" />
          </Form.Item>
          <Form.Item name="state" label="是否启用" initialValue={1}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 2 },
              ]}
            />
          </Form.Item>
          <Space>
            <Button loading={taskTesting} onClick={testTaskSource}>
              检测
            </Button>
            <span className="assess-tip">目标指标：{taskTarget?.name || '-'}</span>
            <span className="assess-tip">模式：{taskIsEdit ? '编辑' : '新增'}</span>
          </Space>
          {(taskTestResult || taskTestResult === 0) && (
            <div className="assess-test-result">测试结果：{String(taskTestResult)}</div>
          )}
        </Form>
      </Modal>

      <Modal
        title="指标详情"
        open={detailVisible}
        onCancel={closeDetailModal}
        footer={
          <Space>
            <Button onClick={copyDetailDoc} disabled={!detailRow}>
              复制接口文档
            </Button>
            <Button onClick={exportDetailDocTxt} disabled={!detailRow}>
              导出TXT
            </Button>
            <Button type="primary" onClick={closeDetailModal}>
              关闭
            </Button>
          </Space>
        }
        width={820}
        destroyOnClose
      >
        <div className="assess-detail-wrap">
          <div className="assess-detail-item">
            <div className="assess-detail-label">详细介绍</div>
            <div className="assess-detail-value">{detailRow?.explain || "-"}</div>
          </div>
          <div className="assess-detail-item">
            <div className="assess-detail-label">SecretKey</div>
            <div className="assess-detail-value">调用 API 的安全密码，请联系管理员获取</div>
          </div>
          <div className="assess-detail-item">
            <div className="assess-detail-label">入口接口</div>
            <div className="assess-detail-value">
              <div>URL：{assessBaseUrl + "/data"}</div>
              <div>请求方式：POST</div>
              <div>Body 参数：itemcode = {detailRow?.itemCode || "-"}</div>
              <div>Body 参数：name = {(detailRow?.targets || []).map((item) => item.name).filter(Boolean).join(", ") || "-"}</div>
              <div>Body 参数：value = 当前值</div>
              <div>Body 参数：form_info = 平台数据</div>
            </div>
          </div>
          <div className="assess-detail-item">
            <div className="assess-detail-label">出口接口</div>
            <div className="assess-detail-value">
              <div>URL：{assessBaseUrl + "/index"}</div>
              <div>请求方式：GET</div>
              <div>Query 参数：itemcode = {detailRow?.itemCode || "-"}</div>
            </div>
          </div>
        </div>
        {detailModalLoading && <div className="assess-tip" style={{ marginTop: 8 }}>加载中...</div>}
      </Modal>
    </div>
  );
};

export default AssessList;
