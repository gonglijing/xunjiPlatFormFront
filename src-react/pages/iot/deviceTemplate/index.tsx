import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import modbusApi from '../../../api/modbus';
import getOrigin from '../../../utils/origin';
import './index.css';

interface TemplateItem {
  id?: number;
  number?: string;
  title?: string;
  mode?: number;
  remarks?: string;
}

const DeviceTemplatePage: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TemplateItem | null>(null);
  const [rows, setRows] = useState<TemplateItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const fetchList = async () => {
    setLoading(true);
    try {
      const query = queryForm.getFieldsValue();
      const res: any = await modbusApi.template.getList({ page, size, ...query });
      const payload = res?.data || res;
      const list = payload?.list || payload?.Data || payload || [];
      const count = payload?.total || payload?.Total || 0;
      setRows(Array.isArray(list) ? list : []);
      setTotal(Number(count) || 0);
    } catch {
      message.error('获取模板列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, size]);

  const handleSearch = () => {
    setPage(1);
    fetchList();
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    editForm.resetFields();
    setModalOpen(true);
  };

  const handleOpenEdit = (row: TemplateItem) => {
    setEditingRow(row);
    editForm.setFieldsValue(row);
    setModalOpen(true);
  };

  const handleDelete = async (row: TemplateItem) => {
    try {
      await modbusApi.template.del({ number: row.number });
      message.success('删除成功');
      fetchList();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = await editForm.validateFields();
      if (editingRow?.number) {
        await modbusApi.template.edit({ ...editingRow, ...values });
      } else {
        await modbusApi.template.add(values);
      }
      message.success(editingRow ? '更新成功' : '创建成功');
      setModalOpen(false);
      fetchList();
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = (row: TemplateItem) => {
    if (!row.number) return;
    const url = getOrigin(`${import.meta.env.VITE_MODBUS_API}/data_area/export?number=${row.number}`);
    window.open(url);
  };

  return (
    <div className="device-template-page">
      <Card
        title="设备模板"
        extra={(
          <Space>
            <Form form={queryForm} layout="inline">
              <Form.Item name="title" label="模板名称">
                <Input placeholder="请输入模板名称" allowClear />
              </Form.Item>
            </Form>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
            <Button icon={<SyncOutlined />} onClick={fetchList}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增模板</Button>
          </Space>
        )}
      >
        <Table
          rowKey={(row) => row.number || String(row.id)}
          dataSource={rows}
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total,
            showSizeChanger: true,
            onChange: (nextPage, nextSize) => {
              setPage(nextPage);
              setSize(nextSize);
            },
          }}
          columns={[
            { title: '模板名称', dataIndex: 'title', key: 'title', width: 220 },
            {
              title: '模式',
              dataIndex: 'mode',
              key: 'mode',
              width: 140,
              render: (mode: number) => (mode === 0 ? '顺序读取' : '批量读取'),
            },
            { title: '备注', dataIndex: 'remarks', key: 'remarks' },
            {
              title: '操作',
              key: 'action',
              width: 280,
              render: (_: any, row: TemplateItem) => (
                <Space>
                  <Button type="link" onClick={() => handleExport(row)}>导出</Button>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenEdit(row)}>详情</Button>
                  <Popconfirm title="确认删除该模板？" onConfirm={() => handleDelete(row)}>
                    <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingRow ? '编辑模板' : '新增模板'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="number" label="模板编号" rules={[{ required: true, message: '请输入模板编号' }]}>
            <Input placeholder="请输入模板编号" disabled={Boolean(editingRow?.number)} />
          </Form.Item>
          <Form.Item name="mode" label="模式" initialValue={0}>
            <Select>
              <Select.Option value={0}>顺序读取</Select.Option>
              <Select.Option value={1}>批量读取</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceTemplatePage;

