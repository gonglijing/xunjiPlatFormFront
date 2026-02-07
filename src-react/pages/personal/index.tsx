import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Row, Col, DatePicker, Radio } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUserInfo } from '../../store/slice/userSlice';
import sysApi from '../../api/system';
import { normalizeAssetUrl } from '../../utils/url';
import './index.css';

const sexOptions = [
  { label: '保密', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
];

const Personal: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const fetchCurrentUser = async () => {
    try {
      const userId = Number(localStorage.getItem('userId')) || Number((userInfo as any)?.id);
      if (!userId) {
        return;
      }
      const userRes: any = await sysApi.user.detail(userId);
      const userData = userRes?.data || userRes;
      const user = {
        ...userData,
        avatar: normalizeAssetUrl(userData?.avatar),
      };
      setCurrentUser(user);
      form.setFieldsValue({
        id: user.id,
        userName: user.userName,
        userNickname: user.userNickname,
        mobile: user.mobile,
        userEmail: user.userEmail,
        sex: user.sex,
        birthday: user.birthday ? dayjs(user.birthday) : undefined,
        address: user.address,
        describe: user.describe,
        avatar: user.avatar,
      });
    } catch {
      message.error('获取个人信息失败');
    }
  };
  
  useEffect(() => {
    fetchCurrentUser();
  }, [form]);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const params = {
        ...values,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : '',
        id: Number(values.id || currentUser?.id),
      };
      await sysApi.user.editUserInfo(params);
      const nextInfo = {
        ...(userInfo || {}),
        userNickname: params.userNickname,
        avatar: params.avatar || currentUser?.avatar || '',
      };
      dispatch(setUserInfo(nextInfo as any));
      message.success('保存成功');
      await fetchCurrentUser();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done' && info.file.response?.code === 0) {
      const avatarUrl = normalizeAssetUrl(info.file.response?.data?.full_path || info.file.response?.data?.url || '');
      form.setFieldValue('avatar', avatarUrl);
      setCurrentUser((prev: any) => ({ ...(prev || {}), avatar: avatarUrl }));
      const userId = Number(form.getFieldValue('id') || currentUser?.id || (userInfo as any)?.id);
      if (userId && avatarUrl) {
        try {
          await sysApi.user.setAvatar(userId, avatarUrl);
        } catch {
          message.error('头像保存失败');
          setAvatarLoading(false);
          return;
        }
      }
      const nextInfo = {
        ...(userInfo || {}),
        avatar: avatarUrl,
      };
      dispatch(setUserInfo(nextInfo as any));
      setAvatarLoading(false);
      message.success('头像上传成功');
      return;
    }
    if (info.file.status === 'error') {
      setAvatarLoading(false);
      message.error('头像上传失败');
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
                action="/api/v1/common/singleImg"
                data={{ source: localStorage.getItem('uploadFileWay') || '0' }}
                headers={{
                  Authorization: `Bearer ${localStorage.getItem('xunji_token') || localStorage.getItem('token')}`,
                }}
                onChange={handleAvatarChange}
              >
                <div className={`avatar-wrapper ${avatarLoading ? 'loading' : ''}`}>
                  <img
                    src={form.getFieldValue('avatar') || currentUser?.avatar || userInfo?.avatar || '/default-avatar.svg'}
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
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="userName" label="用户名">
                <Input disabled />
              </Form.Item>
              
              <Form.Item name="userNickname" label="昵称">
                <Input placeholder="请输入昵称" />
              </Form.Item>

              <Form.Item name="sex" label="性别">
                <Radio.Group options={sexOptions} />
              </Form.Item>

              <Form.Item name="birthday" label="生日">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item name="mobile" label="手机号">
                <Input placeholder="请输入手机号" />
              </Form.Item>

              <Form.Item name="userEmail" label="邮箱">
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item name="address" label="联系地址">
                <Input placeholder="请输入联系地址" />
              </Form.Item>

              <Form.Item name="describe" label="简介">
                <Input.TextArea placeholder="请输入简介" rows={3} />
              </Form.Item>

              <Form.Item name="avatar" hidden>
                <Input />
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
