import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import sysApi from '../../../api/system';
import './index.css';

interface ConfigItem {
  configKey: string;
  configName: string;
  configValue: string;
  [key: string]: any;
}

const BasicConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res: any = await sysApi.basicConfig.getDetails({ types: 0 });
      const list: ConfigItem[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : Array.isArray(res?.Data)
            ? res.Data
            : [];

      setConfigItems(list);

      const pick = (names: string[], keys: string[] = []) => {
        const item = list.find((entry) => names.includes(entry.configName) || keys.includes(entry.configKey));
        return item?.configValue || '';
      };

      form.setFieldsValue({
        siteName: pick(['系统名称'], ['sys.name']),
        icp: pick(['系统版权'], ['sys.copyright']),
        logo: pick(['系统LOGO'], ['sys.logo']),
        miniLogo: pick(['系统LOGO（小图标）'], ['sys.logo.mini']),
        loginImage: pick(['登录展示图'], ['sys.login.background']),
      });
    } catch (error) {
      message.error('加载基础配置失败');
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

      const updateByName: Record<string, string> = {
        '系统名称': values.siteName,
        '系统版权': values.icp,
        '系统LOGO': values.logo,
        '系统LOGO（小图标）': values.miniLogo,
        '登录展示图': values.loginImage,
      };

      const updateByKey: Record<string, string> = {
        'sys.name': values.siteName,
        'sys.copyright': values.icp,
        'sys.logo': values.logo,
        'sys.logo.mini': values.miniLogo,
        'sys.login.background': values.loginImage,
      };

      const nextConfig: ConfigItem[] = configItems.length
        ? configItems.map((item) => {
            const byName = updateByName[item.configName];
            const byKey = item.configKey ? updateByKey[item.configKey] : undefined;
            const nextValue = byName !== undefined ? byName : byKey;
            if (nextValue !== undefined) {
              return { ...item, configValue: nextValue };
            }
            return item;
          })
        : [];

      const fallbackItems: ConfigItem[] = [
        { configKey: 'sys.name', configName: '系统名称', configValue: values.siteName },
        { configKey: 'sys.copyright', configName: '系统版权', configValue: values.icp },
        { configKey: 'sys.logo', configName: '系统LOGO', configValue: values.logo },
        { configKey: 'sys.logo.mini', configName: '系统LOGO（小图标）', configValue: values.miniLogo },
        { configKey: 'sys.login.background', configName: '登录展示图', configValue: values.loginImage },
      ];

      fallbackItems.forEach((item) => {
        const exists = nextConfig.some((entry) => entry.configName === item.configName || entry.configKey === item.configKey);
        if (!exists) {
          nextConfig.push(item);
        }
      });

      await sysApi.basicConfig.setDetails({ ConfigInfo: nextConfig });
      message.success('保存成功');
      setConfigItems(nextConfig);
    } catch (error: any) {
      if (!error?.errorFields) {
        message.error('保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basic-config-content">
      <h3>基础配置</h3>
      <Form form={form} layout="vertical">
        <Form.Item name="siteName" label="系统名称" rules={[{ required: true, message: '请输入系统名称' }]}>
          <Input placeholder="请输入系统名称" />
        </Form.Item>
        <Form.Item name="icp" label="系统版权" rules={[{ required: true, message: '请输入系统版权' }]}>
          <Input placeholder="请输入系统版权" />
        </Form.Item>
        <Form.Item name="logo" label="系统LOGO" rules={[{ required: true, message: '请输入系统LOGO地址' }]}>
          <Input placeholder="请输入系统LOGO地址" />
        </Form.Item>
        <Form.Item name="miniLogo" label="系统LOGO（小图标）" rules={[{ required: true, message: '请输入小图标地址' }]}>
          <Input placeholder="请输入系统LOGO（小图标）地址" />
        </Form.Item>
        <Form.Item name="loginImage" label="登录展示图" rules={[{ required: true, message: '请输入登录展示图地址' }]}>
          <Input placeholder="请输入登录展示图地址" />
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

export default BasicConfig;
