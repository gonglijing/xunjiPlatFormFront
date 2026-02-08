import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Tag,
  Upload,
} from 'antd';
import type { TableColumnsType, UploadProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  UploadOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import deviceApi from '../../../api/device';
import './index.css';

type ModelTabType = 'property' | 'function' | 'event' | 'tag';

type AnyRecord = Record<string, unknown>;

interface ProductDetailInfo extends AnyRecord {
  key?: string;
  productKey?: string;
  name?: string;
  productName?: string;
  deviceType?: string;
  categoryName?: string;
  messageProtocol?: string;
  transportProtocol?: string;
  desc?: string;
  status?: number | string | boolean;
}

interface ModelItem extends AnyRecord {
  id?: number | string;
  key?: string;
  identifier?: string;
  name?: string;
  dataType?: string;
  rw?: string;
  type?: string;
  async?: boolean | number;
  desc?: string;
}

interface ModelFormValues {
  key: string;
  name: string;
  dataType?: string;
  rw?: string;
  type?: string;
  desc?: string;
}

const asRecord = (value: unknown): AnyRecord => {
  if (typeof value === 'object' && value !== null) {
    return value as AnyRecord;
  }
  return {};
};

const toList = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const toStringValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}`;
  return '';
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true';
  return false;
};

const getCurrentTime = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}`;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const getModelList = (response: unknown): ModelItem[] => {
  const rawPayload = asRecord(response).data ?? response;
  const payload = asRecord(rawPayload);
  const list = payload.list ?? payload.Data ?? rawPayload;
  return toList<ModelItem>(list);
};

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
  const [importing, setImporting] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [modelModalType, setModelModalType] = useState<ModelTabType>('property');
  const [editingRow, setEditingRow] = useState<ModelItem | null>(null);
  const [modelSaving, setModelSaving] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductDetailInfo | null>(null);
  const [propertyList, setPropertyList] = useState<ModelItem[]>([]);
  const [functionList, setFunctionList] = useState<ModelItem[]>([]);
  const [eventList, setEventList] = useState<ModelItem[]>([]);
  const [tagList, setTagList] = useState<ModelItem[]>([]);
  const [modelForm] = Form.useForm<ModelFormValues>();

  const currentProductKey =
    toStringValue(productInfo?.key) || toStringValue(productInfo?.productKey) || productKey;
  const isDeployed = toBoolean(productInfo?.status);

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

      const detailPayload = asRecord(asRecord(detailRes).data ?? detailRes);
      const detailInfo = detailPayload.Info ?? detailPayload.data ?? detailPayload;

      setProductInfo(asRecord(detailInfo) as ProductDetailInfo);
      setPropertyList(getModelList(propertyRes));
      setFunctionList(getModelList(functionRes));
      setEventList(getModelList(eventRes));
      setTagList(getModelList(tagRes));
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
      const targetProductKey = currentProductKey || productKey;
      if (!targetProductKey) {
        message.error('缺少产品标识，操作失败');
        return;
      }

      if (nextStatus === 'deploy') {
        await deviceApi.product.deploy(targetProductKey);
      } else {
        await deviceApi.product.undeploy(targetProductKey);
      }
      message.success(nextStatus === 'deploy' ? '发布成功' : '取消发布成功');
      fetchDetail();
    } catch {
      message.error(nextStatus === 'deploy' ? '发布失败' : '取消发布失败');
    }
  };

  const handleImportModel: NonNullable<UploadProps['customRequest']> = async (options) => {
    const { file, onSuccess, onError } = options;
    if (!currentProductKey) {
      message.error('缺少产品标识，无法导入');
      onError?.(new Error('MISSING_PRODUCT_KEY'));
      return;
    }

    setImporting(true);
    try {
      const uploadFile = file as File;
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('productKey', currentProductKey);
      await deviceApi.product.importModel(formData);
      message.success('物模型导入成功');
      onSuccess?.({});
      fetchDetail();
    } catch (error) {
      message.error('物模型导入失败');
      onError?.(error instanceof Error ? error : new Error('IMPORT_MODEL_FAILED'));
    } finally {
      setImporting(false);
    }
  };

  const handleExportModel = async () => {
    if (!currentProductKey) {
      message.error('缺少产品标识，无法导出');
      return;
    }
    try {
      const res = await deviceApi.product.exportModel({ productKey: currentProductKey });
      const blob = res instanceof Blob
        ? res
        : new Blob([JSON.stringify(res || {}, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `TSL-${currentProductKey}-${getCurrentTime()}.json`);
      message.success('物模型导出成功');
    } catch {
      message.error('物模型导出失败');
    }
  };

  const openModelModal = (type: ModelTabType, row?: ModelItem) => {
    setModelModalType(type);
    setEditingRow(row || null);
    setModelModalOpen(true);
    modelForm.resetFields();

    if (row) {
      modelForm.setFieldsValue({
        key: toStringValue(row.key),
        name: toStringValue(row.name),
        dataType: toStringValue(row.dataType),
        rw: toStringValue(row.rw),
        type: toStringValue(row.type),
        desc: toStringValue(row.desc),
      });
    }
  };

  const handleDeleteModel = async (type: ModelTabType, row: ModelItem) => {
    const modelKey = toStringValue(row.key);
    const targetProductKey = currentProductKey || productKey;
    if (!modelKey || !targetProductKey) {
      message.error('缺少 key，无法删除');
      return;
    }
    try {
      await modelApiMap[type].del(targetProductKey, modelKey);
      message.success('删除成功');
      fetchDetail();
    } catch {
      message.error('删除失败');
    }
  };

  const handleSaveModel = async () => {
    setModelSaving(true);
    try {
      const targetProductKey = currentProductKey || productKey;
      if (!targetProductKey) {
        message.error('缺少产品标识，无法保存');
        return;
      }

      const values = await modelForm.validateFields();
      const payload: AnyRecord = {
        ...(editingRow ?? {}),
        ...values,
        productKey: targetProductKey,
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

  const renderModelTable = (type: ModelTabType, list: ModelItem[]) => {
    const columns: TableColumnsType<ModelItem> = [
      { title: '标识', dataIndex: 'key', key: 'key', width: 180 },
      { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
    ];

    if (type === 'property') {
      columns.push({ title: '数据类型', dataIndex: 'dataType', key: 'dataType', width: 140 });
      columns.push({ title: '读写类型', dataIndex: 'rw', key: 'rw', width: 120 });
    }

    if (type === 'event') {
      columns.push({ title: '类型', dataIndex: 'type', key: 'type', width: 120 });
    }

    if (type === 'function') {
      columns.push({
        title: '异步',
        dataIndex: 'async',
        key: 'async',
        width: 100,
        render: (value: unknown) => (toBoolean(value) ? '是' : '否'),
      });
    }

    columns.push({ title: '描述', dataIndex: 'desc', key: 'desc' });
    columns.push({
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: unknown, row: ModelItem) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openModelModal(type, row)}>编辑</Button>
          <Popconfirm title="确认删除该模型项？" onConfirm={() => handleDeleteModel(type, row)}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    });

    return (
      <>
        <div className="model-table-toolbar">
          <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => openModelModal(type)}>
            新增
          </Button>
        </div>
        <Table
          rowKey={(row) => toStringValue(row.key) || toStringValue(row.identifier) || toStringValue(row.id)}
          size="small"
          dataSource={list}
          pagination={false}
          columns={columns}
        />
      </>
    );
  };

  return (
    <div className="product-detail-page">
      <Card
        loading={loading}
        title={(
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span>产品详情</span>
            <Tag color={isDeployed ? 'success' : 'default'}>{isDeployed ? '已发布' : '未发布'}</Tag>
          </Space>
        )}
        extra={(
          <Space>
            {isDeployed ? (
              <Button onClick={() => handleDeploy('undeploy')}>取消发布</Button>
            ) : (
              <Button type="primary" onClick={() => handleDeploy('deploy')}>发布</Button>
            )}
            <Upload
              accept=".json,application/json"
              showUploadList={false}
              customRequest={handleImportModel}
              disabled={importing}
            >
              <Button icon={<UploadOutlined />} loading={importing}>导入模型</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExportModel}>导出模型</Button>
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
        title={`${editingRow ? '编辑' : '新增'}${
          modelModalType === 'property'
            ? '属性'
            : modelModalType === 'function'
              ? '功能'
              : modelModalType === 'event'
                ? '事件'
                : '标签'
        }`}
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
