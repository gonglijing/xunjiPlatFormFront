export interface UserInfo {
  id: number;
  userName: string;
  userNickname: string;
  avatar: string;
  email: string;
  mobile: string;
  remark: string;
  status: number;
  deptId: number;
  createdAt: string;
}

export interface ApiInfo {
  id: number;
  parentId: number;
  name: string;
  types: number;
  apiTypes: string;
  method: string;
  address: string;
  remark: string;
  status: number;
  sort: number;
}

export interface RoleInfo {
  id: number;
  parentId: number;
  name: string;
  listOrder: number;
  status: number;
  remark: string;
}
