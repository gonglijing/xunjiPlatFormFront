import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Button, Space, Input, Tag, Modal, message, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import noticeApi from '../../../../../api/notice';
import EditConfig from './component/setEdit';
import EditTemplate from './component/temEdit';
import './index.css';

interface NoticeItem {
  id: number;
  title: string;
  sendGateway: string;
  types: number;
}

const NoticeConfigList: React.FC = () => {
  const navigate = useNavigate();
  const { gateway } = useParams<{ gateway: string }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NoticeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 20,
    keyWord: '',
    sendGateway: gateway || '',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<NoticeItem | null>(null);

  useEffect(() => {
    if (!gateway) return;
    setParams((prev) => ({
      ...prev,
      pageNum: 1,
      keyWord: '',
      sendGateway: gateway,
    }));
  }, [gateway]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await noticeApi.config.getList(params);
      const list = res?.list || res?.Data || res?.data || [];
      setData(Array.isArray(list) ? list : []);
      setTotal(Number(res?.total || res?.Total || 0));
    } catch (error) {
      message.error('获取通知配置列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, pageNum: 1 }));
  };

  const handleReset = () => {
    setParams((prev) => ({
      ...prev,
      pageNum: 1,
      pageSize: 20,
      keyWord: '',
    }));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setEditVisible(true);
  };

  const handleEdit = (record: NoticeItem) => {
    setEditingItem(record);
    setEditVisible(true);
  };

  const handleTemplate = (record: NoticeItem) => {
    setEditingItem(record);
    setTemplateVisible(true);
  };

  const handleDelete = async (record: NoticeItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除通知配置 "${record.title}" 吗?`,
      onOk: async () => {
        try {
          await noticeApi.config.del(record.id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const getGatewayIcon = (gw: string) => {
    const icons: Record<string, string> = {
      dingtalk: 'dingtalk.svg',
      wechat: 'wechat.svg',
      email: 'email.svg',
      webhook: 'webhook.svg',
    };
    return icons[gw] || 'default.svg';
  };

  const getGatewayName = (gw: string) => {
    const names: Record<string, string> = {
      dingtalk: '钉钉',
      wechat: '企业微信',
      email: '邮件',
      webhook: 'Webhook',
    };
    return names[gw] || gw || '-';
  };

  const currentGateway = useMemo(() => params.sendGateway || gateway || '', [params.sendGateway, gateway]);

  return (
    <div className="notice-setting-container">
      <Card
        title={`通知配置 - ${getGatewayName(currentGateway)}`}
        extra={
          <Space>
            <Button onClick={() => navigate('/notice/config')}>返回</Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="配置名称"
            style={{ width: 240 }}
            value={params.keyWord}
            onChange={(e) => setParams((prev) => ({ ...prev, keyWord: e.target.value }))}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleAdd}>
            新增通知
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col span={8} key={item.id}>
              <div className="notice-card">
                <div className="notice-card-body">
                  <div className="notice-card-avatar">
                    <img width={88} height={88} src={`/imgs/notice/${getGatewayIcon(currentGateway)}`} alt={item.title} />
                  </div>
                  <div className="notice-card-content">
                    <div className="notice-card-title">{item.title}</div>
                    <div className="notice-card-type">
                      通知方式：
                      <Tag color={item.types === 1 ? 'blue' : 'green'}>{item.types === 1 ? '即时发送' : '预约发送'}</Tag>
                    </div>
                  </div>
                </div>
                <div className="notice-card-tools">
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>
                    修改
                  </Button>
                  <Button type="link" icon={<FolderOutlined />} onClick={() => handleTemplate(item)}>
                    模板配置
                  </Button>
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item)}>
                    删除
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {total > 0 && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Pagination
              total={total}
              current={params.pageNum}
              pageSize={params.pageSize}
              onChange={(page, pageSize) => setParams((prev) => ({ ...prev, pageNum: page, pageSize }))}
              showSizeChanger
              showTotal={(t) => `共 ${t} 条`}
            />
          </div>
        )}

        {total === 0 && <div style={{ textAlign: 'center', padding: '28px' }}>暂无数据</div>}
      </Card>

      <EditConfig
        visible={editVisible}
        data={editingItem}
        sendGateway={currentGateway}
        onClose={() => setEditVisible(false)}
        onSuccess={fetchData}
      />

      <EditTemplate
        visible={templateVisible}
        data={editingItem}
        sendGateway={currentGateway}
        onClose={() => setTemplateVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default NoticeConfigList;
