import { get, del, put } from '/@/utils/request';
import type { ApiPageResult, ApiParams, ApiPagedQuery } from '/@/api/types/http';

type MessageItem = ApiParams;

export default {
  // 获取所有未读消息
  allUnRead: () => get<ApiPageResult<MessageItem>>('/system/message/allUnRead'),
  // 一键清空消息
  clear: () => get('/system/message/clear'),
  // 批量删除消息
  del: (ids: number[]) => del('/system/message/del', { ids }),
  // 获取消息列表
  getList: (data: ApiPagedQuery) => get<ApiPageResult<MessageItem>>('/system/message/list', data),
  // 阅读消息
  read: (id: number) => put('/system/message/read', { id }),
  // 获取所有未读消息数量
  unReadCount: () => get<number | ApiParams>('/system/message/unReadCount')
}
