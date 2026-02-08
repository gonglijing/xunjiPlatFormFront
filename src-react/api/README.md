# API Layer Conventions (React)

本目录用于维护 React 端 API 封装，目标是：

- 统一请求入口与参数构造
- 提供稳定的强类型返回
- 保持历史调用兼容（函数名/模块结构尽量不破坏）

## 1. 基础能力

### 1.1 请求层

- `../utils/request.ts`：主业务请求实例
- `../utils/requestModbus.ts`：Modbus 请求实例
- `./typed.ts`：强类型请求别名
  - `tget<T>()`
  - `tpost<T>()`
  - `tput<T>()`
  - `tdel<T>()`
  - `tfile<T>()`
  - `tupload<T>()`

### 1.2 参数工具

- `./shared.ts`
  - `withId(id, key?)`
  - `withIds(ids, key?)`

## 2. 返回类型约定

在 `types/index.ts` 统一维护：

- `ApiEnvelope<T>`：后端原始包裹结构
- `ApiNormalizedResult<T>`：前端归一化后的常用结构
- `ApiNormalizedListResult<T>`：列表归一化结果

说明：

- 请求拦截器已将多数业务响应展平，页面侧通常可直接使用 `res.list/res.total` 或 `res.data`
- 新增 API 时优先返回 `ApiNormalizedResult<T>` 或 `ApiNormalizedListResult<T>`

## 3. 新增 API 模块模板

```ts
import { withId } from './shared';
import { tget, tpost, tput, tdel } from './typed';
import type { ApiNormalizedListResult, ApiNormalizedResult, ApiParams } from './types';

type Query = ApiParams;
type AnyRecord = Record<string, unknown>;
type ActionResult = ApiNormalizedResult<AnyRecord>;

const list = <T>(url: string, params?: Query) => tget<ApiNormalizedListResult<T>>(url, params);
const detail = <T>(url: string, id: number) => tget<ApiNormalizedResult<T>>(url, withId(id));
const create = (url: string, data: Query) => tpost<ActionResult>(url, data);
const update = (url: string, data: Query) => tput<ActionResult>(url, data);
const remove = (url: string, params: Query) => tdel<ActionResult>(url, params);
```

## 4. 已迁移模块（强类型）

- `system.ts`
- `device/index.ts`
- `notice.ts`
- `datahub.ts`
- `application.ts`
- `alarm/index.ts`
- `network/index.ts`

## 5. 维护建议

- 优先在 `types/index.ts` 维护领域模型，避免散落 `any`
- 新接口优先复用 `list/detail/create/update/remove` 小工具
- 若接口字段不稳定，可先使用 `Record<string, unknown>` 兜底，再逐步收敛

## 6. 页面层类型收敛进度

### 6.1 已收敛页面

- `pages/iot/dashboard/index.tsx`
- `pages/iot/notice/log/index.tsx`
- `pages/iot/deviceChannel/index.tsx`
- `pages/iot/productDetail/index.tsx`
- `pages/iot/product/index.tsx`
- `pages/iot/deviceInstance/index.tsx`
- `pages/iot/alarm/index.tsx`
- `pages/iot/deviceTemplate/index.tsx`
- `pages/iot/deviceCategory/index.tsx`
- `pages/iot/certificate/index.tsx`
- `pages/iot/network/server/index.tsx`
- `pages/iot/network/tunnel/index.tsx`
- `pages/iot/property/attribute/index.tsx`

### 6.2 当前策略

- 页面侧优先使用 `unknown + 守卫函数`（`asRecord`/`toList`/`toStringValue`）替代 `any`
- 列表渲染参数统一为 `(_: unknown, row: Xxx)`
- 动态列优先通过显式列类型（如 `TableColumnsType<T>`）拼装，避免 `as any`

### 6.3 后续建议

- 新增复杂页面时先补充领域类型，再落地页面逻辑
- 对历史模块采用“先去 any、再细化领域模型”的渐进式迁移
