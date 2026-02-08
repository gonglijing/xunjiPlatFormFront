import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import sysApi from '../../../../api/system';

interface EditConfigProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditConfig: React.FC<EditConfigProps> = ({ visible, data, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [moduleList, setModuleList] = useState<any[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res: any = await sysApi.system.dict.dataList({ dictType: 'param_class_type', status: 1 });
        setModuleList(res.list || []);
      } catch (error) {
        console.error('获取模块分类失败');
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue(data);
      } else {
        form.resetFields();
        form.setFieldsValue({ configType: 0, moduleClassify: '' });
      }
    }
  }, [visible, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (data?.configId) {
        await sysApi.system.config.edit({ ...data, ...values });
        message.success('编辑成功');
      } else {
        await sysApi.system.config.add(values);
        message.success('新增成功');
      }
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) return;
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={data?.configId ? '编辑参数' : '新增参数'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="configName" label="参数名称" rules={[{ required: true }]}>
          <Input placeholder="请输入参数名称" />
        </Form.Item>
        <Form.Item name="configKey" label="参数键名" rules={[{ required: true }]}>
          <Input placeholder="请输入参数键名" />
        </Form.Item>
        <Form.Item name="configValue" label="参数键值" rules={[{ required: true }]}>
          <Input.TextArea rows={3} placeholder="请输入参数键值" />
        </Form.Item>
        <Form.Item name="moduleClassify" label="模块分类">
          <Select placeholder="请选择模块分类">
            {moduleList.map((item: any) => (
              <Select.Option key={item.dictValue} value={item.dictValue}>
                {item.dictLabel}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="configType" label="系统内置">
          <Select
            options={[
              { label: '否', value: 0 },
              { label: '是', value: 1 },
            ]}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditConfig;
