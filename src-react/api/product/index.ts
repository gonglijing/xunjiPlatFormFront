// 产品 API 接口
import { get, post, put, del } from '../../utils/request';

export default {
  // 产品列表
  getList: (params?: object) => get('/product/list', params),
  
  // 产品详情
  detail: (id: number) => get('/product/detail', { id }),
  
  // 添加产品
  add: (data: object) => post('/product/add', data),
  
  // 编辑产品
  edit: (data: object) => put('/product/edit', data),
  
  // 删除产品
  del: (params: object) => del('/product/delete', params),
  
  // 产品分类
  category: {
    getList: (params?: object) => get('/product/category/list', params),
    add: (data: object) => post('/product/category/add', data),
    edit: (data: object) => put('/product/category/edit', data),
    del: (params: object) => del('/product/category/delete', params),
  },
};
