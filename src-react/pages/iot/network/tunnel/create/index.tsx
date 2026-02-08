import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Switch, Button, Space, message, Tabs, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import networkApi from '../../../../../api/network';
import './index.css';

const { TextArea } = Input;

const TunnelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [serverList, setServerList] = useState<any[]>([]);
  const isEdit = !!id;

  useEffect(() => {
    fetchServers();
    if (isEdit) {
      fetchDetail();
    } else {
      // Set default values
      form.setFieldsValue({
        status: 0,
        types: 'tcp-client',
        serial: {
          baud_rate: 9600,
          data_bits: 8,
          stop_bits: 1,
          parity: 'none',
        },
        heartbeat: { enable: false },
        retry: { enable: false, timeout: 5, maximum: 3 },
      });
    }
  }, [id, form]);

  const fetchServers = async () => {
    try {
      const res: any = await networkApi.server.getList({ status: 1 });
      setServerList(res.list || []);
    } catch (error) {
      console.error('获取服务器列表失败');
    }
  };

  const fetchDetail = async () => {
    try {
      const res: any = await networkApi.tunnel.detail(Number(id));
      if (res) {
        form.setFieldsValue(res);
      }
    } catch (error) {
      message.error('获取通道信息失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEdit) {
        await networkApi.tunnel.edit({ id: Number(id), ...values });
        message.success('编辑成功');
      } else {
        await networkApi.tunnel.add(values);
        message.success('创建成功');
      }
      navigate('/network/tunnel');
    } catch (error: any) {
      if (error.errorFields) return;
      message.error(isEdit ? '编辑失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const tunnelType = Form.useWatch('types', form);
  const isSerial = tunnelType === 'serial';

  return (
    <div className="tunnel-create-container">
      <Card
        title={isEdit ? '编辑通道' : '新建通道'}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/network/tunnel')}>
              返回
            </Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" initialValues={{ types: 'tcp-client', status: 0 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="基本信息" key="basic">
              <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input placeholder="请填写名称" maxLength={20} />
              </Form.Item>

              <Form.Item name="types" label="类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  <Select.Option value="tcp-client">TCP Client</Select.Option>
                  <Select.Option value="tcp-server">TCP Server</Select.Option>
                  <Select.Option value="udp-client">UDP Client</Select.Option>
                  <Select.Option value="serial">串口</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="serverId" label="服务器" rules={[{ required: true }]}>
                <Select placeholder="请选择服务器">
                  {serverList.map((server: any) => (
                    <Select.Option key={server.id} value={server.id}>
                      {server.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {!isSerial && (
                <Form.Item name="addr" label="地址">
                  <Input placeholder="IP:端口" />
                </Form.Item>
              )}

              <Form.Item name="status" label="启用">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Tabs.TabPane>

            {isSerial && (
              <Tabs.TabPane tab="串口参数" key="serial">
                <Form.Item name={['serial', 'port']} label="端口">
                  <Input placeholder="/dev/ttyS0" />
                </Form.Item>

                <Form.Item name={['serial', 'baud_rate']} label="波特率">
                  <Select placeholder="请选择波特率">
                    <Select.Option value={9600}>9600</Select.Option>
                    <Select.Option value={19200}>19200</Select.Option>
                    <Select.Option value={38400}>38400</Select.Option>
                    <Select.Option value={57600}>57600</Select.Option>
                    <Select.Option value={115200}>115200</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name={['serial', 'data_bits']} label="数据位">
                  <Select placeholder="请选择数据位">
                    <Select.Option value={5}>5</Select.Option>
                    <Select.Option value={6}>6</Select.Option>
                    <Select.Option value={7}>7</Select.Option>
                    <Select.Option value={8}>8</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name={['serial', 'stop_bits']} label="停止位">
                  <Select placeholder="请选择停止位">
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={2}>2</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name={['serial', 'parity']} label="检验位">
                  <Select placeholder="请选择检验位">
                    <Select.Option value="none">无</Select.Option>
                    <Select.Option value="odd">奇校验</Select.Option>
                    <Select.Option value="even">偶校验</Select.Option>
                  </Select>
                </Form.Item>
              </Tabs.TabPane>
            )}

            {!isSerial && (
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
                  <InputNumber min={1} style={{ width: '100%' }} placeholder="请填写超时时间" />
                </Form.Item>
              </Tabs.TabPane>
            )}

            {(isSerial || tunnelType === 'tcp-client' || tunnelType === 'udp-client') && (
              <Tabs.TabPane tab="断线重连" key="retry">
                <Form.Item name={['retry', 'enable']} label="启用" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>

                <Form.Item name={['retry', 'timeout']} label="间隔(秒)">
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请填写间隔时间" />
                </Form.Item>

                <Form.Item name={['retry', 'maximum']} label="最大次数">
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="请填写最大次数" />
                </Form.Item>
              </Tabs.TabPane>
            )}

            <Tabs.TabPane tab="协议适配" key="protocol">
              <Form.Item name={['protocol', 'name']} label="协议">
                <Select placeholder="请选择协议">
                  <Select.Option value="SagooMqtt">Sagoo Mqtt</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name={['protocol', 'options']} label="协议参数">
                <TextArea rows={6} placeholder="请填写协议参数 (JSON格式)" />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Card>
    </div>
  );
};

export default TunnelCreate;
