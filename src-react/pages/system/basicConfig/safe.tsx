import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, InputNumber, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';

interface ConfigItem {
  configKey: string;
  configName: string;
  configValue: string;
  [key: string]: any;
}

const toBool = (value: any) => value === '1' || value === 1 || value === true;

const SafeConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configMap, setConfigMap] = useState<Record<string, ConfigItem>>({});

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
        securityEnabled: toBool(map['sys.is.security.control.enabled']?.configValue),
        rsaEnabled: toBool(map['sys.is.rsa.enabled']?.configValue),
        singleLogin: toBool(map['sys.is.single.login']?.configValue),
        changePwdFirstLogin: toBool(map['sys.change.password.for.first.login']?.configValue),
        tokenExpire: Number(map['sys.token.expiry.date']?.configValue || 30),
        maxRetryCount: Number(map['sys.password.error.num']?.configValue || 0),
        lockoutTime: Number(map['sys.again.login.date']?.configValue || 10),
        changePeriodSwitch: toBool(map['sys.password.change.period.switch']?.configValue),
        changePeriod: Number(map['sys.password.change.period']?.configValue || 90),
        uppercase: toBool(map['sys.require.uppercase.letter']?.configValue),
        lowercase: toBool(map['sys.require.lowercase.letter']?.configValue),
        digit: toBool(map['sys.require.digit']?.configValue),
        complexity: toBool(map['sys.require.complexity']?.configValue),
        minimum: Number(map['sys.password.minimum.length']?.configValue || 8),
        buttonSwitch: toBool(map['sys.button.switch']?.configValue),
        columnSwitch: toBool(map['sys.column.switch']?.configValue),
        apiSwitch: toBool(map['sys.api.switch']?.configValue),
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
      const setConfig = (key: string, value: string | number, configName?: string) => {
        if (!nextMap[key]) {
          nextMap[key] = {
            configKey: key,
            configName: configName || key,
            configValue: String(value),
          } as ConfigItem;
        } else {
          nextMap[key] = { ...nextMap[key], configValue: String(value) };
        }
      };

      setConfig('sys.is.security.control.enabled', values.securityEnabled ? '1' : '0', '是否启用安全控制');
      setConfig('sys.is.rsa.enabled', values.rsaEnabled ? '1' : '0', '是否启用RSA');
      setConfig('sys.is.single.login', values.singleLogin ? '1' : '0', '是否单一登录');
      setConfig('sys.change.password.for.first.login', values.changePwdFirstLogin ? '1' : '0', '首次登录是否更改密码');
      setConfig('sys.token.expiry.date', values.tokenExpire ?? 30, 'TOKEN过期时间');
      setConfig('sys.password.error.num', values.maxRetryCount ?? 0, '密码输入错误次数');
      setConfig('sys.again.login.date', values.lockoutTime ?? 10, '允许再次登录时间');
      setConfig('sys.password.change.period.switch', values.changePeriodSwitch ? '1' : '0', '密码更换周期开关');
      setConfig('sys.password.change.period', values.changePeriod ?? 90, '密码更换周期');
      setConfig('sys.require.uppercase.letter', values.uppercase ? '1' : '0', '是否包含大写字母');
      setConfig('sys.require.lowercase.letter', values.lowercase ? '1' : '0', '是否包含小写字母');
      setConfig('sys.require.digit', values.digit ? '1' : '0', '是否包含数字');
      setConfig('sys.require.complexity', values.complexity ? '1' : '0', '是否包含复杂字符');
      setConfig('sys.password.minimum.length', values.minimum ?? 8, '密码长度');
      setConfig('sys.button.switch', values.buttonSwitch ? '1' : '0', '按钮开关');
      setConfig('sys.column.switch', values.columnSwitch ? '1' : '0', '列表开关');
      setConfig('sys.api.switch', values.apiSwitch ? '1' : '0', 'API开关');
      setConfig('sys.allowed.origins', values.allowedOrigins || '', '允许的来源');

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
        <Divider orientation="left">安全控制</Divider>
        <Form.Item name="securityEnabled" label="是否启用安全控制" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="rsaEnabled" label="是否启用RSA" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Divider orientation="left">登录设置</Divider>
        <Form.Item name="singleLogin" label="是否单一登录" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="changePwdFirstLogin" label="首次登录是否更改密码" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="tokenExpire" label="TOKEN过期时间(分钟)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入Token过期时间" />
        </Form.Item>
        <Form.Item name="maxRetryCount" label="密码输入错误次数">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入最大登录失败次数" />
        </Form.Item>
        <Form.Item name="lockoutTime" label="允许再次登录时间(分钟)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入锁定时间" />
        </Form.Item>
        <Form.Item name="changePeriodSwitch" label="密码更换周期开关" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="changePeriod" label="密码更换周期(天)">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入密码更换周期" />
        </Form.Item>

        <Divider orientation="left">密码策略设置</Divider>
        <Form.Item name="uppercase" label="是否包含大写字母" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="lowercase" label="是否包含小写字母" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="digit" label="是否包含数字" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="complexity" label="是否包含复杂字符" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="minimum" label="密码长度">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入密码长度" />
        </Form.Item>

        <Divider orientation="left">权限设置</Divider>
        <Form.Item name="buttonSwitch" label="按钮开关" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="columnSwitch" label="列表开关" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
        <Form.Item name="apiSwitch" label="API开关" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Divider orientation="left">来源控制</Divider>
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
