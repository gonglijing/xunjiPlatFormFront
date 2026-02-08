import { get, post, del, put } from '/@/utils/request';
import getOrigin from '../utils/origin';
import { withId } from './shared';

const assessBaseUrl = getOrigin(import.meta.env.VITE_ASSESS_URL || '');
const withAssessBase = (path: string) => (assessBaseUrl ? `${assessBaseUrl}${path}` : path);

const setup = {
  getList: (params?: object) => get(withAssessBase('/setup'), params),
  setItem: (data?: object) => post(withAssessBase('/setup'), data || {}),
  deleteItem: (params?: object) => del(withAssessBase('/setup'), params || {}),
  getDataSourceInfo: (params?: object) => get(withAssessBase('/datasetup/target'), params),
  testDataSource: (params?: object) => post(withAssessBase('/datasetup/test'), params || {}),
  addDataSourceInfo: (data?: object) => post(withAssessBase('/datasetup'), data || {}),
  editDataSourceInfo: (data?: object) => put(withAssessBase('/datasetup'), data || {}),
  editataSourceInfo: (data?: object) => put(withAssessBase('/datasetup'), data || {}),
};

export default {
  assess: {
    getList: (params?: object) => get('/assess/list', params),
    add: (data: object) => post('/assess/add', data),
    edit: (data: object) => put('/assess/edit', data),
    del: (id: number) => del('/assess/delete', withId(id)),
    detail: (id: number) => get('/assess/detail', withId(id)),
    generate: (data: object) => post('/assess/generate', data),
  },
  records: {
    getList: (params?: object) => get('/assess/records/list', params),
    detail: (id: number) => get('/assess/records/detail', withId(id)),
    generate: (data: object) => post('/assess/records/generate', data),
  },
  total: {
    getList: (params?: object) => get('/assess/total/list', params),
    detail: (id: number) => get('/assess/total/detail', withId(id)),
    generate: (data: object) => post('/assess/total/generate', data),
  },
  setup,
  getList: setup.getList,
  setItem: setup.setItem,
  deleteItem: setup.deleteItem,
  getDataSourceInfo: setup.getDataSourceInfo,
  testDataSource: setup.testDataSource,
  addDataSourceInfo: setup.addDataSourceInfo,
  editataSourceInfo: setup.editataSourceInfo,
};
