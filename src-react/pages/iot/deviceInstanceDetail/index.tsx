import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Descriptions, Form, Input, InputNumber, Radio, message, Modal, Select, Space, Table, Tabs, Tag } from 'antd';
import { ArrowLeftOutlined, PoweroffOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import deviceApi from '../../../api/device';
import './index.css';

const numberTypes = ['int', 'float', 'double', 'date'];

const getValueType = (schema: any) => schema?.valueType?.type || schema?.type || '';

const normalizeTypedValue = (rawValue: any, valueType: string) => {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return rawValue;
  }
  if (valueType === 'array' || valueType === 'object') {
    if (typeof rawValue === 'string') {
      try {
        return JSON.parse(rawValue);
      } catch {
        throw new Error('JSON_PARSE_ERROR');
      }
    }
    return rawValue;
  }
  if (numberTypes.includes(valueType)) {
    return Number(rawValue);
  }
  return rawValue;
};

const renderTypedInput = (schema: any) => {
  const valueType = getValueType(schema);
  const unit = schema?.valueType?.unit;

  if (valueType === 'enum') {
    return (
      <Select placeholder="请选择">
        {(schema?.valueType?.elements || []).map((item: any) => (
          <Select.Option key={String(item.value)} value={item.value}>
            {item.text || item.label || String(item.value)}
          </Select.Option>
        ))}
      </Select>
    );
  }

  if (valueType === 'boolean') {
    return (
      <Radio.Group>
        <Radio value>{schema?.valueType?.trueText || '是'}</Radio>
        <Radio value={false}>{schema?.valueType?.falseText || '否'}</Radio>
      </Radio.Group>
    );
  }

  if (numberTypes.includes(valueType)) {
    return (
      <Space.Compact style={{ width: '100%' }}>
        <InputNumber style={{ width: unit ? 'calc(100% - 48px)' : '100%' }} placeholder="请输入" />
        {unit ? <Input value={unit} readOnly style={{ width: 48, textAlign: 'center' }} /> : null}
      </Space.Compact>
    );
  }

  if (valueType === 'array' || valueType === 'object') {
    return <Input.TextArea rows={3} placeholder="请输入 JSON 字符串" />;
  }

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input style={{ width: unit ? 'calc(100% - 48px)' : '100%' }} placeholder="请输入" />
      {unit ? <Input value={unit} readOnly style={{ width: 48, textAlign: 'center' }} /> : null}
    </Space.Compact>
  );
};

const DeviceInstanceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { deviceKey = '' } = useParams<{ deviceKey: string }>();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [logList, setLogList] = useState<any[]>([]);
  const [propertyLog, setPropertyLog] = useState<any[]>([]);
  const [functionList, setFunctionList] = useState<any[]>([]);
  const [propertySchemaList, setPropertySchemaList] = useState<any[]>([]);
  const [invokeModalOpen, setInvokeModalOpen] = useState(false);
  const [setAttrModalOpen, setSetAttrModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<any>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [invokeResult, setInvokeResult] = useState('');
  const [funcForm] = Form.useForm();
  const [attrForm] = Form.useForm();

  const fetchDetail = async () => {
    if (!deviceKey) {
      return;
    }
    setLoading(true);
    try {
      const [detailRes, logRes, propertyRes] = await Promise.all([
        deviceApi.instance.detail(deviceKey),
        deviceApi.instance.getLogList({ deviceKey, pageNum: 1, pageSize: 20 }).catch(() => []),
        deviceApi.instance.getPropertyLog({ deviceKey, pageNum: 1, pageSize: 20 }).catch(() => []),
      ]);
      const detailData = detailRes?.data || detailRes;
      const detailInfo = detailData?.Info || detailData?.data || detailData || {};
      const logs = (logRes as any)?.data?.list || (logRes as any)?.list || (logRes as any)?.data || (logRes as any) || [];
      const propertyLogs = (propertyRes as any)?.data?.list || (propertyRes as any)?.list || (propertyRes as any)?.data || (propertyRes as any) || [];
      setDetail(detailInfo);
      setLogList(Array.isArray(logs) ? logs : []);
      setPropertyLog(Array.isArray(propertyLogs) ? propertyLogs : []);

      const productKey = detailInfo?.productKey;
      if (productKey) {
        const [functionsRes, propertySchemaRes] = await Promise.all([
          deviceApi.tabDeviceFunction.getList({ productKey }).catch(() => []),
          deviceApi.product.getPropertyAll({ productKey }).catch(() => []),
        ]);
        const functions = (functionsRes as any)?.data || functionsRes || [];
        const propertySchema = (propertySchemaRes as any)?.data || propertySchemaRes || [];
        setFunctionList(Array.isArray(functions) ? functions : []);
        setPropertySchemaList(Array.isArray(propertySchema) ? propertySchema : []);
      }
    } catch {
      message.error('获取实例详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [deviceKey]);

  const changeOnlineStatus = async (target: 'online' | 'offline') => {
    try {
      if (target === 'online') {
        await deviceApi.instance.online({ deviceKey });
      } else {
        await deviceApi.instance.offline({ deviceKey });
      }
      message.success(target === 'online' ? '上线成功' : '下线成功');
      fetchDetail();
    } catch {
      message.error(target === 'online' ? '上线失败' : '下线失败');
    }
  };

  const changeDeployStatus = async (target: 'deploy' | 'undeploy') => {
    try {
      if (target === 'deploy') {
        await deviceApi.instance.deploy(deviceKey);
      } else {
        await deviceApi.instance.undeploy(deviceKey);
      }
      message.success(target === 'deploy' ? '部署成功' : '取消部署成功');
      fetchDetail();
    } catch {
      message.error(target === 'deploy' ? '部署失败' : '取消部署失败');
    }
  };

  const openInvokeModal = () => {
    setSelectedFunction(null);
    setInvokeResult('');
    funcForm.resetFields();
    setInvokeModalOpen(true);
  };

  const openSetAttrModal = () => {
    setSelectedProperty(null);
    attrForm.resetFields();
    setSetAttrModalOpen(true);
  };

  const functionOptions = useMemo(
    () => functionList.map((item: any) => ({ label: `${item.name || item.key}`, value: item.key, raw: item })),
    [functionList]
  );

  const propertyOptions = useMemo(
    () => propertySchemaList.map((item: any) => ({ label: `${item.name || item.key}`, value: item.key, raw: item })),
    [propertySchemaList]
  );

  const runFunction = async () => {
    if (!selectedFunction?.key) {
      message.info('请先选择功能');
      return;
    }
    setActionLoading(true);
    try {
      const values = await funcForm.validateFields();
      const payload: any = {};
      (selectedFunction.inputs || []).forEach((input: any) => {
        const rawValue = values[input.key];
        if (rawValue !== undefined && rawValue !== '') {
          payload[input.key] = normalizeTypedValue(rawValue, getValueType(input));
        }
      });
      const res = await deviceApi.tabDeviceFunction.do({
        deviceKey,
        funcKey: selectedFunction.key,
        params: payload,
      });
      setInvokeResult(JSON.stringify((res as any)?.data || res || {}, null, 2));
      message.success('执行成功');
    } catch (error: any) {
      if (error?.message === 'JSON_PARSE_ERROR') {
        message.error('请输入正确的 JSON 参数格式');
      } else {
        message.error('执行失败');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const submitSetAttr = async () => {
    if (!selectedProperty?.key) {
      message.info('请先选择属性');
      return;
    }
    setActionLoading(true);
    try {
      const values = await attrForm.validateFields();
      const parsedValue = normalizeTypedValue(values.value, getValueType(selectedProperty));
      await deviceApi.product.propertySet({
        deviceKey,
        params: {
          [selectedProperty.key]: parsedValue,
        },
      });
      message.success('下发成功');
      setSetAttrModalOpen(false);
      fetchDetail();
    } catch (error: any) {
      if (error?.message === 'JSON_PARSE_ERROR') {
        message.error('请输入正确的 JSON 属性值格式');
      } else {
        message.error('下发失败');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="device-instance-detail-page">
      <Card
        loading={loading}
        title={(
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span>设备实例详情</span>
            <Tag color={detail?.status ? 'success' : 'default'}>{detail?.status ? '在线' : '离线'}</Tag>
          </Space>
        )}
        extra={(
          <Space>
            <Button icon={<PlayCircleOutlined />} onClick={() => changeOnlineStatus('online')}>上线</Button>
            <Button icon={<PauseCircleOutlined />} onClick={() => changeOnlineStatus('offline')}>下线</Button>
            <Button type="primary" onClick={() => changeDeployStatus('deploy')}>部署</Button>
            <Button icon={<PoweroffOutlined />} onClick={() => changeDeployStatus('undeploy')}>取消部署</Button>
            <Button onClick={openInvokeModal}>功能调用</Button>
            <Button onClick={openSetAttrModal}>属性下发</Button>
          </Space>
        )}
      >
        <Descriptions bordered size="small" column={3}>
          <Descriptions.Item label="设备标识">{detail?.key || detail?.deviceKey || deviceKey}</Descriptions.Item>
          <Descriptions.Item label="设备名称">{detail?.name || detail?.deviceName || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属产品">{detail?.productName || '-'}</Descriptions.Item>
          <Descriptions.Item label="设备地址">{detail?.address || detail?.deviceAddress || '-'}</Descriptions.Item>
          <Descriptions.Item label="运行状态">{detail?.runStatus || '-'}</Descriptions.Item>
          <Descriptions.Item label="最后上线">{detail?.onlineAt || detail?.onlineTime || '-'}</Descriptions.Item>
        </Descriptions>

        <Tabs
          className="device-instance-detail-tabs"
          items={[
            {
              key: 'log',
              label: `设备日志(${logList.length})`,
              children: (
                <Table
                  rowKey={(row) => row.id || row.time || Math.random()}
                  size="small"
                  dataSource={logList}
                  pagination={false}
                  columns={[
                    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
                    { title: '类型', dataIndex: 'type', key: 'type', width: 140 },
                    { title: '内容', dataIndex: 'content', key: 'content' },
                  ]}
                />
              ),
            },
            {
              key: 'property',
              label: `属性上报(${propertyLog.length})`,
              children: (
                <Table
                  rowKey={(row) => row.id || row.time || Math.random()}
                  size="small"
                  dataSource={propertyLog}
                  pagination={false}
                  columns={[
                    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
                    { title: '属性标识', dataIndex: 'key', key: 'key', width: 180 },
                    { title: '属性值', dataIndex: 'value', key: 'value', width: 180 },
                    { title: '来源', dataIndex: 'source', key: 'source' },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="功能调用"
        open={invokeModalOpen}
        onCancel={() => setInvokeModalOpen(false)}
        onOk={runFunction}
        confirmLoading={actionLoading}
        width={760}
      >
        <Form layout="vertical" form={funcForm}>
          <Form.Item label="功能" required>
            <Select
              placeholder="请选择功能"
              options={functionOptions}
              onChange={(val) => {
                const target = functionOptions.find((item) => item.value === val)?.raw;
                setSelectedFunction(target || null);
                funcForm.resetFields();
                setInvokeResult('');
              }}
            />
          </Form.Item>

          {(selectedFunction?.inputs || []).map((input: any) => (
            <Form.Item
              key={input.key}
              label={`${input.name || input.key}(${input.valueType?.type || '-'})`}
              name={input.key}
              rules={[{ required: true, message: '请输入参数值' }]}
            >
              {renderTypedInput(input)}
            </Form.Item>
          ))}

          <Form.Item label="执行结果">
            <Input.TextArea value={invokeResult} readOnly rows={6} placeholder="执行后展示结果" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="属性下发"
        open={setAttrModalOpen}
        onCancel={() => setSetAttrModalOpen(false)}
        onOk={submitSetAttr}
        confirmLoading={actionLoading}
      >
        <Form layout="vertical" form={attrForm}>
          <Form.Item label="属性" required>
            <Select
              placeholder="请选择属性"
              options={propertyOptions}
              onChange={(val) => {
                const target = propertyOptions.find((item) => item.value === val)?.raw;
                setSelectedProperty(target || null);
                attrForm.resetFields();
              }}
            />
          </Form.Item>
          <Form.Item label="属性值" name="value" rules={[{ required: true, message: '请输入属性值' }]}>
            {renderTypedInput(selectedProperty || {})}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceInstanceDetailPage;
