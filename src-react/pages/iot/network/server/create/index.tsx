import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Switch, Button, Space, message, Tabs, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import networkApi from '../../../../../api/network';
import systemApi from '../../../../../api/system';
import './index.css';

const { TextArea } = Input;

const toBoolFlag = (value: any) => value === true || value === 1 || value === '1';
const toNumberFlag = (value: any) => (toBoolFlag(value) ? 1 : 0);

const normalizeProtocolOptionsForForm = (value: any) => {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null || value === '') return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const normalizeProtocolOptionsForSubmit = (value: any) => {
  if (typeof value !== 'string') return value ?? {};
  const trimmed = value.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error('PROTOCOL_JSON_INVALID');
  }
};

const ServerCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [certificateList, setCertificateList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  const isEdit = !!id;

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit) {
        try {
          const res: any = await networkApi.server.detail(Number(id));
          const formData = res || {};
          const protocolConfig = formData.protocol || {};

          form.setFieldsValue({
            ...formData,
            status: toBoolFlag(formData.status),
            isTls: toBoolFlag(formData.isTls),
            heartbeat: {
              ...(formData.heartbeat || {}),
              enable: toBoolFlag(formData?.heartbeat?.enable),
            },
            protocol: {
              ...protocolConfig,
              options: normalizeProtocolOptionsForForm(protocolConfig.options),
            },
          });
        } catch (error) {
          message.error('获取服务器信息失败');
        }
      }
    };

    fetchData();
    fetchCertificates();
  }, [id, form]);

  const fetchCertificates = async () => {
    try {
      const res: any = await systemApi.certificate.getList({ status: 1 });
      setCertificateList(res?.Info || res?.list || res?.data || []);
    } catch (error) {
      console.error('获取证书列表失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const protocolOptions = normalizeProtocolOptionsForSubmit(values?.protocol?.options);

      const payload = {
        ...values,
        status: toNumberFlag(values.status),
        isTls: toNumberFlag(values.isTls),
        heartbeat: values?.heartbeat
          ? {
              ...values.heartbeat,
              enable: toNumberFlag(values.heartbeat.enable),
            }
          : values.heartbeat,
        protocol: values?.protocol
          ? {
              ...values.protocol,
              options: protocolOptions,
            }
          : values.protocol,
      };

      setLoading(true);
      if (isEdit) {
        await networkApi.server.edit({ id: Number(id), ...payload });
        message.success('编辑成功');
      } else {
        await networkApi.server.add(payload);
        message.success('创建成功');
      }
      navigate('/network/server');
    } catch (error: any) {
      if (error?.errorFields) return;
      if (error?.message === 'PROTOCOL_JSON_INVALID') {
        message.error('协议参数请填写合法 JSON');
        return;
      }
      message.error(isEdit ? '编辑失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const serverType = Form.useWatch('types', form);
  const isTls = Form.useWatch('isTls', form);

  return (
    <div className="server-create-container">
      <Card
        title={isEdit ? '编辑服务器' : '新建服务器'}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/network/server')}>
              返回
            </Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            types: 'tcp',
            status: false,
            isTls: false,
            heartbeat: { enable: false },
            protocol: { options: '' },
          }}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="基本信息" key="basic">
              <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input placeholder="请填写名称" maxLength={20} />
              </Form.Item>

              <Form.Item name="types" label="类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  <Select.Option value="tcp">TCP</Select.Option>
                  <Select.Option value="mqtt_server">MQTT Server</Select.Option>
                  <Select.Option value="coap_server">CoAP Server</Select.Option>
                  <Select.Option value="http_server">HTTP Server</Select.Option>
                </Select>
              </Form.Item>

              {serverType === 'tcp' && (
                <Form.Item name="addr" label="地址" rules={[{ required: true }]}>
                  <Input placeholder="请填写地址和端口" />
                </Form.Item>
              )}

              <Form.Item name="isTls" label="开启TLS" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>

              {isTls && serverType !== 'mqtt_server' && (
                <Form.Item name="certificateId" label="选择证书">
                  <Select placeholder="请选择证书">
                    {certificateList.map((cert: any) => (
                      <Select.Option key={cert.id} value={cert.id}>
                        {cert.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {isTls && serverType === 'mqtt_server' && (
                <Form.Item name="authType" label="接入方式">
                  <Select placeholder="选择接入方式">
                    <Select.Option value={1}>Basic</Select.Option>
                    <Select.Option value={2}>AccessToken</Select.Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item name="status" label="启用" valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane tab="注册包" key="register">
              <Form.Item name={['register', 'regex']} label="正则表达式">
                <TextArea rows={4} placeholder="请填写正则表达式" />
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane tab="协议适配" key="protocol">
              <Form.Item name={['protocol', 'name']} label="协议">
                <Select placeholder="请选择协议适配">
                  <Select.Option value="SagooMqtt">Sagoo Mqtt</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name={['protocol', 'options']} label="协议参数">
                <TextArea rows={6} placeholder="请填写协议参数 (JSON格式)" />
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane tab="心跳包" key="heartbeat">
              <Form.Item name={['heartbeat', 'enable']} label="启用" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>

              <Form.Item name={['heartbeat', 'text']} label="心跳文本">
                <Input placeholder="请填写心跳文本" />
              </Form.Item>

              <Form.Item name={['heartbeat', 'hex']} label="心跳HEX">
                <Input placeholder="请填写心跳HEX" />
              </Form.Item>

              <Form.Item name={['heartbeat', 'timeout']} label="超时时间(秒)">
                <InputNumber min={1} placeholder="请填写超时时间" style={{ width: '100%' }} />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Card>
    </div>
  );
};

export default ServerCreate;
