import { get, post, del, put } from "/@/utils/request";
import type { ApiPageResult, ApiParams, ApiPagedQuery } from '/@/api/types/http';

type NoticeConfig = ApiParams;
type NoticeTemplate = ApiParams;
type NoticeLog = ApiParams;

export default {
  config: {
    getList: (params: ApiPagedQuery) => get<ApiPageResult<NoticeConfig>>("/notice/config/list", params),
    add: (data: ApiParams) => post("/notice/config/add", data),
    delete: (ids: number) => del("/notice/config/delete", { ids }),
    edit: (data: ApiParams) => put("/notice/config/edit", data),
    detail: (id: number) => get<NoticeConfig>("/notice/config/get", { id }),
    save: (data: ApiParams) => post("/system/plugins_config/save", data),
    getbyname: (data: ApiParams) => get<ApiParams>("/system/plugins_config/getbyname", data),
  },
  template: {
    getList: (params: ApiPagedQuery) => get<ApiPageResult<NoticeTemplate>>("/notice/template/list", params),
    add: (data: ApiParams) => post("/notice/template/add", data),
    delete: (ids: number) => del("/notice/template/delete", { ids }),
    edit: (data: ApiParams) => put("/notice/template/edit", data),
    save: (data: ApiParams) => post("/notice/template/save", data),
    detail: (id: number) => get<NoticeTemplate>("/notice/template/get", { id }),
    configIddetail: (configId: number) => get<NoticeTemplate>("/notice/template/getbyconfig", { configId }),
  },
  log:{
    getList: (params: ApiPagedQuery) => get<ApiPageResult<NoticeLog>>("/notice/log/search", params),
    delete: (ids: number) => del("/notice/log/del", { ids }),
  }
};
