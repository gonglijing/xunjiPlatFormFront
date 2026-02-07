import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import sysApi from '../../api/system';
import './index.css';
const Personal: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        userName: userInfo.userName,
        userNickname: userInfo.userNickname,
        avatar: userInfo.avatar,
      });
    }
  }, [userInfo, form]);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await sysApi.user.editUserInfo(values);
      if (res.code === 0 || res.code === 200) {
        message.success('保存成功');
      } else {
        message.error(res.msg || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setAvatarLoading(false);
      message.success('头像上传成功');
    }
  };
  
  return (
    <div className="personal-container">
      <Row gutter={24}>
        <Col span={8}>
          <Card title="个人信息">
            <div className="avatar-section">
              <Upload
                name="avatar"
                showUploadList={false}
                action="/api/v1/system/user/editAvatar"
                headers={{
                  Authorization: `Bearer ${localStorage.getItem('xunji_token')}`,
                }}
                onChange={handleAvatarChange}
              >
                <div className="avatar-wrapper">
                  <img
                    src={userInfo?.avatar || '/default-avatar.svg'}
                    alt="avatar"
                    className="avatar-image"
                  />
                  <div className="avatar-overlay">
                    <UploadOutlined />
                    <span>更换头像</span>
                  </div>
                </div>
              </Upload>
            </div>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card title="基本资料">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item name="userName" label="用户名">
                <Input disabled />
              </Form.Item>
              
              <Form.Item name="userNickname" label="昵称">
                <Input placeholder="请输入昵称" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Personal;
