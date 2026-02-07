export interface DeviceOutput {
  id: number;
  key: string;
  name: string;
  productKey: string;
  productName: string;
  status: number;
  onlineTimeout: number;
  version: string;
  registryTime: string | null;
  lastOnlineTime: string | null;
  address: string;
  desc: string;
  lng: string;
  lat: string;
  extensionInfo: string;
  product: ProductOutput;
}

export interface ProductOutput {
  key: string;
  name: string;
  messageProtocol: string;
  transportProtocol: string;
  deviceType: string;
  metadata: string;
}

export interface DeviceListResponse {
  list: DeviceOutput[];
  total: number;
  page: number;
}

export interface RunStatusProperty {
  key: string;
  name: string;
  type: string;
  unit: string;
  value: unknown;
  list: unknown[];
}

export interface RunStatusResponse {
  status: number;
  lastOnlineTime: string | null;
  properties: RunStatusProperty[];
}

export interface ModelDataResponse {
  Data: unknown[];
  Total: number;
}

export interface DeviceLogItem {
  type: string;
  ts: string;
  content: string;
}
