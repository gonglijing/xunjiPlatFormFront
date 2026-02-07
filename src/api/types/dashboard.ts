export interface CountDataItem {
  Title: string;
  Value: number;
}

export interface ProductCountResponse {
  total: number;
  enable: number;
  disable: number;
}

export interface DeviceCountResponse {
  online: number;
  total: number;
  disable: number;
}

export interface DeviceDataTotalResponse {
  number: number;
}
