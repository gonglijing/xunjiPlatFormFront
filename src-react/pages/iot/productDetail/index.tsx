import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, message, Modal, Popconfirm, Space, Table, Tabs, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import deviceApi from '../../../api/device';
import './index.css';

type ModelTabType = 'property' | 'function' | 'event' | 'tag';

const modelApiMap = {
  property: {
    add: deviceApi.model.propertyAdd,
    edit: deviceApi.model.propertyEdit,
    del: deviceApi.model.propertyDel,
  },
  function: {
    add: deviceApi.model.functionAdd,
    edit: deviceApi.model.functionEdit,
    del: deviceApi.model.functionDel,
  },
  event: {
    add: deviceApi.model.eventAdd,
    edit: deviceApi.model.eventEdit,
    del: deviceApi.model.eventDel,
  },
  tag: {
    add: deviceApi.model.tagAdd,
    edit: deviceApi.model.tagEdit,
    del: deviceApi.model.tagDel,
  },
} as const;

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { productKey = '' } = useParams<{ productKey: string }>();
  const [loading, setLoading] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [modelModalType, setModelModalType] = useState<ModelTabType>('property');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [modelSaving, setModelSaving] = useState(false);
  const [productInfo, setProductInfo] = useState<any>(null);
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [functionList, setFunctionList] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [tagList, setTagList] = useState<any[]>([]);
  const [modelForm] = Form.useForm();

  const fetchDetail = async () => {
    if (!productKey) return;
    setLoading(true);
    try {
      const [detailRes, propertyRes, functionRes, eventRes, tagRes] = await Promise.all([
        deviceApi.product.detail(productKey),
        deviceApi.model.property({ productKey, pageNum: 1, pageSize: 999 }),
        deviceApi.model.function({ productKey, pageNum: 1, pageSize: 999 }),
        deviceApi.model.event({ productKey, pageNum: 1, pageSize: 999 }),
        deviceApi.model.tag({ productKey, pageNum: 1, pageSize: 999 }),
      ]);

      const detailData = detailRes?.data || detailRes;
      setProductInfo(detailData?.Info || detailData?.data || detailData || {});
      setPropertyList((propertyRes?.data || propertyRes)?.list || (propertyRes?.data || propertyRes) || []);
      setFunctionList((functionRes?.data || functionRes)?.list || (functionRes?.data || functionRes) || []);
      setEventList((eventRes?.data || eventRes)?.list || (eventRes?.data || eventRes) || []);
      setTagList((tagRes?.data || tagRes)?.list || (tagRes?.data || tagRes) || []);
    } catch {
      message.error('获取产品详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [productKey]);

  const handleDeploy = async (nextStatus: 'deploy' | 'undeploy') => {
    try {
      if (nextStatus === 'deploy') {
        await deviceApi.product.deploy(productKey);
      } else {
        await deviceApi.product.undeploy(productKey);
      }
      message.success(nextStatus === 'deploy' ? '发布成功' : '取消发布成功');
      fetchDetail();
    } catch {
      message.error(nextStatus === 'deploy' ? '发布失败' : '取消发布失败');
    }
  };

  const openModelModal = (type: ModelTabType, row?: any) => {
    setModelModalType(type);
    setEditingRow(row || null);
    setModelModalOpen(true);
    modelForm.resetFields();
    if (row) {
      modelForm.setFieldsValue({
        key: row.key,
        name: row.name,
        dataType: row.dataType,
        rw: row.rw,
        type: row.type,
        desc: row.desc,
      });
    }
  };

  const handleDeleteModel = async (type: ModelTabType, row: any) => {
    if (!row?.key) {
      message.error('缺少 key，无法删除');
      return;
    }
    try {
      await modelApiMap[type].del(productKey, row.key);
      message.success('删除成功');
      fetchDetail();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSaveModel = async () => {
    setModelSaving(true);
    try {
      const values = await modelForm.validateFields();
      const payload = {
        ...editingRow,
        ...values,
        productKey,
      };
      if (editingRow) {
        await modelApiMap[modelModalType].edit(payload);
      } else {
        await modelApiMap[modelModalType].add(payload);
      }
      message.success(editingRow ? '更新成功' : '创建成功');
      setModelModalOpen(false);
      fetchDetail();
    } catch {
      message.error('保存失败');
    } finally {
      setModelSaving(false);
    }
  };

  const renderModelTable = (type: ModelTabType, list: any[]) => (
    <>
      <div className="model-table-toolbar">
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => openModelModal(type)}>
          新增
        </Button>
      </div>
      <Table
        rowKey={(row) => row.key || row.identifier || row.id}
        size="small"
        dataSource={list}
        pagination={false}
        columns={[
          { title: '标识', dataIndex: 'key', key: 'key', width: 180 },
          { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
          ...(type === 'property' ? [{ title: '数据类型', dataIndex: 'dataType', key: 'dataType', width: 140 } as any] : []),
          ...(type === 'property' ? [{ title: '读写类型', dataIndex: 'rw', key: 'rw', width: 120 } as any] : []),
          ...(type === 'event' ? [{ title: '类型', dataIndex: 'type', key: 'type', width: 120 } as any] : []),
          ...(type === 'function' ? [{ title: '异步', dataIndex: 'async', key: 'async', width: 100, render: (v: any) => (v ? '是' : '否') } as any] : []),
          { title: '描述', dataIndex: 'desc', key: 'desc' },
          {
            title: '操作',
            key: 'action',
            width: 160,
            render: (_: any, row: any) => (
              <Space>
                <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openModelModal(type, row)}>编辑</Button>
                <Popconfirm title="确认删除该模型项？" onConfirm={() => handleDeleteModel(type, row)}>
                  <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </>
  );

  return (
    <div className="product-detail-page">
      <Card
        loading={loading}
        title={(
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span>产品详情</span>
            <Tag color={productInfo?.status ? 'success' : 'default'}>{productInfo?.status ? '已发布' : '未发布'}</Tag>
          </Space>
        )}
        extra={(
          <Space>
            {productInfo?.status ? (
              <Button onClick={() => handleDeploy('undeploy')}>取消发布</Button>
            ) : (
              <Button type="primary" onClick={() => handleDeploy('deploy')}>发布</Button>
            )}
            <Button icon={<UploadOutlined />}>导入模型</Button>
            <Button icon={<DownloadOutlined />}>导出模型</Button>
          </Space>
        )}
      >
        <Descriptions bordered size="small" column={3}>
          <Descriptions.Item label="产品标识">{productInfo?.key || productInfo?.productKey}</Descriptions.Item>
          <Descriptions.Item label="产品名称">{productInfo?.name || productInfo?.productName}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{productInfo?.deviceType || '-'}</Descriptions.Item>
          <Descriptions.Item label="分类">{productInfo?.categoryName || '-'}</Descriptions.Item>
          <Descriptions.Item label="消息协议">{productInfo?.messageProtocol || '-'}</Descriptions.Item>
          <Descriptions.Item label="接入协议">{productInfo?.transportProtocol || '-'}</Descriptions.Item>
          <Descriptions.Item label="描述" span={3}>{productInfo?.desc || '-'}</Descriptions.Item>
        </Descriptions>

        <Tabs
          className="product-detail-tabs"
          items={[
            {
              key: 'property',
              label: `属性(${propertyList.length})`,
              children: renderModelTable('property', propertyList),
            },
            {
              key: 'function',
              label: `功能(${functionList.length})`,
              children: renderModelTable('function', functionList),
            },
            {
              key: 'event',
              label: `事件(${eventList.length})`,
              children: renderModelTable('event', eventList),
            },
            {
              key: 'tag',
              label: `标签(${tagList.length})`,
              children: renderModelTable('tag', tagList),
            },
          ]}
        />
      </Card>

      <Modal
        title={`${editingRow ? '编辑' : '新增'}${modelModalType === 'property' ? '属性' : modelModalType === 'function' ? '功能' : modelModalType === 'event' ? '事件' : '标签'}`}
        open={modelModalOpen}
        onOk={handleSaveModel}
        onCancel={() => setModelModalOpen(false)}
        confirmLoading={modelSaving}
      >
        <Form form={modelForm} layout="vertical">
          <Form.Item name="key" label="标识" rules={[{ required: true, message: '请输入标识' }]}>
            <Input placeholder="请输入标识" disabled={Boolean(editingRow)} />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          {modelModalType === 'property' && (
            <>
              <Form.Item name="dataType" label="数据类型">
                <Input placeholder="如 int/string/bool" />
              </Form.Item>
              <Form.Item name="rw" label="读写类型">
                <Input placeholder="如 r/w/rw" />
              </Form.Item>
            </>
          )}
          {modelModalType === 'event' && (
            <Form.Item name="type" label="事件类型">
              <Input placeholder="如 info/warn/error" />
            </Form.Item>
          )}
          <Form.Item name="desc" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
