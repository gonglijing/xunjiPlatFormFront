import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import sysApi from '../../../../api/system';
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
        cdnUrl: pick(['登录展示图'], ['sys.login.background']),
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

      const updateMap: Record<string, string> = {
        系统名称: values.siteName,
        系统版权: values.icp,
        系统LOGO: values.logo,
        登录展示图: values.cdnUrl,
      };

      const nextConfig = configItems.length
        ? configItems.map((item) => {
          if (updateMap[item.configName] !== undefined) {
            return { ...item, configValue: updateMap[item.configName] };
          }
          return item;
        })
        : [
            { configName: '系统名称', configValue: values.siteName },
            { configName: '系统版权', configValue: values.icp },
            { configName: '系统LOGO', configValue: values.logo },
            { configName: '登录展示图', configValue: values.cdnUrl },
          ];

      await sysApi.basicConfig.setDetails({ ConfigInfo: nextConfig });
      message.success('保存成功');
      setConfigItems(nextConfig as ConfigItem[]);
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
        <Form.Item name="siteName" label="站点名称" rules={[{ required: true, message: '请输入站点名称' }]}>
          <Input placeholder="请输入站点名称" />
        </Form.Item>
        <Form.Item name="icp" label="ICP备案号" rules={[{ required: true, message: '请输入ICP备案号' }]}>
          <Input placeholder="请输入ICP备案号" />
        </Form.Item>
        <Form.Item name="logo" label="站点Logo" rules={[{ required: true, message: '请输入站点Logo地址' }]}>
          <Input placeholder="请输入站点Logo地址" />
        </Form.Item>
        <Form.Item name="cdnUrl" label="登录展示图">
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
