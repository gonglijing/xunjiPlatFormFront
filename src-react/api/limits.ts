import { get, post, del, put } from '/@/utils/request';
import { withId } from './shared';

type LimitParams = Record<string, unknown>;

function createLimitCrud(prefix: string) {
  return {
    getList: (params?: LimitParams) => get(`${prefix}/list`, params),
    add: (data: LimitParams) => post(`${prefix}/add`, data),
    edit: (data: LimitParams) => put(`${prefix}/edit`, data),
    del: (id: number) => del(`${prefix}/delete`, withId(id)),
    detail: (id: number) => get(`${prefix}/detail`, withId(id)),
  };
}

const backEnd = createLimitCrud('/limits/backEnd');
const page = createLimitCrud('/limits/frontEnd/page');
const btn = createLimitCrud('/limits/frontEnd/btn');

export default {
  limits: {
    // 后端权限
    backEnd,
    // 前端页面权限
    frontEnd: {
      page,
      btn,
    },
  },
};
