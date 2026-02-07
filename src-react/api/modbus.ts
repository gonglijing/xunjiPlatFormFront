import { get, post } from '../utils/requestModbus';

export default {
  template: {
    getList: (params?: object) => get('/template', params),
    add: (data: object) => post('/template/add', data),
    edit: (data: object) => post('/template/edit', data),
    del: (data: object) => post('/template/delete', data),
  },
  dataArea: {
    getList: (params?: object) => get('/data_area', params),
    add: (data: object) => post('/data_area/add', data),
    edit: (data: object) => post('/data_area/edit', data),
    del: (data: object) => post('/data_area/delete', data),
  },
};

