import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, InputNumber, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
import './index.css';

interface ConfigItem {
  configKey: string;
  configName: string;
  configValue: string;
  [key: string]: any;
}

const SafeConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configMap, setConfigMap] = useState<Record<string, ConfigItem>>({});

  const getValue = (key: string, fallback = '') => configMap[key]?.configValue ?? fallback;

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.basicConfig.getDetails({ types: 1 });
      const list: ConfigItem[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : Array.isArray(res?.Data)
            ? res.Data
            : [];

      const map: Record<string, ConfigItem> = {};
      list.forEach((item) => {
        if (item?.configKey) {
          map[item.configKey] = item;
        }
      });
      setConfigMap(map);

      form.setFieldsValue({
        captchaEnabled: (map['sys.is.security.control.enabled']?.configValue || '0') === '1',
        tokenExpire: Number(map['sys.token.expiry.date']?.configValue || 30),
        maxRetryCount: Number(map['sys.password.error.num']?.configValue || 0),
        lockoutTime: Number(map['sys.again.login.date']?.configValue || 10),
        allowedOrigins: map['sys.allowed.origins']?.configValue || '',
      });
    } catch (error) {
      message.error('加载安全配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const nextMap = { ...configMap };
      const setConfig = (key: string, value: string | number) => {
        if (!nextMap[key]) {
          nextMap[key] = {
            configKey: key,
            configName: key,
            configValue: String(value),
          } as ConfigItem;
        } else {
          nextMap[key] = { ...nextMap[key], configValue: String(value) };
        }
      };

      setConfig('sys.is.security.control.enabled', values.captchaEnabled ? '1' : '0');
      setConfig('sys.token.expiry.date', values.tokenExpire ?? 30);
      setConfig('sys.password.error.num', values.maxRetryCount ?? 0);
      setConfig('sys.again.login.date', values.lockoutTime ?? 10);
      setConfig('sys.allowed.origins', values.allowedOrigins || '');

      await sysApi.basicConfig.setDetails({ ConfigInfo: Object.values(nextMap) });
      setConfigMap(nextMap);
      message.success('保存成功');
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="safe-config-content">
      <h3>安全配置</h3>
      <Form form={form} layout="vertical">
        <Form.Item name="captchaEnabled" label="启用安全控制" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="tokenExpire" label="Token过期时间(分钟)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入Token过期时间" />
        </Form.Item>
        <Form.Item name="maxRetryCount" label="最大登录失败次数">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入最大登录失败次数" />
        </Form.Item>
        <Form.Item name="lockoutTime" label="锁定时间(分钟)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入锁定时间" />
        </Form.Item>
        <Form.Item name="allowedOrigins" label="允许的来源">
          <Input.TextArea rows={3} placeholder="请输入允许的来源，多个用逗号分隔" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSubmit}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SafeConfig;
