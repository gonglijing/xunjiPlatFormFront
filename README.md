# XunjiIOT Frontend

<div align="center">
<img width="120px" src="https://raw.githubusercontent.com/xunji-cloud/.github/main/profile/logo.svg">

[![Vue](https://img.shields.io/badge/vue-3.x-green)](https://v3.vuejs.org/)
[![Element Plus](https://img.shields.io/badge/element-plus-2.2.28-green)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/typescript-4.6-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-2.9-yellow)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-GPL3.0-success)](https://github.com/xunji-cloud/xunjiot/blob/main/LICENSE)

</div>

English | [中文文档](./README_ZH.md)

---

## 📋 Overview

**XunjiIOT Frontend** is the web-based user interface for the XunjiIOT IoT platform. It is built with **Vue 3**, **Element Plus**, and **TypeScript**, providing a modern, responsive, and user-friendly interface for managing IoT devices, monitoring data, configuring alerts, and administering the system.

### 🎯 Core Values

- **🎨 Modern UI** - Vue 3 + Element Plus for a clean, professional appearance
- **📱 Responsive Design** - Adapts to desktop, tablet, and mobile screens
- **🔐 Secure Authentication** - Multiple authentication methods with token management
- **📊 Rich Data Visualization** - ECharts integration for charts and dashboards
- **🌐 International Support** - Built-in i18n for multi-language support
- **⚡ High Performance** - Vite build tool for fast development and optimized production builds

---

## 🛠️ Technology Stack

### Core Technologies

| Technology | Version | Purpose | Description |
|------------|---------|---------|-------------|
| **Vue** | 3.2.x | Frontend Framework | Modern, declarative UI framework |
| **Element Plus** | 2.2.28 | UI Component Library | Rich component library |
| **TypeScript** | 4.6+ | Type Language | Type safety and better developer experience |
| **Vite** | 2.9 | Build Tool | Lightning-fast development server and builds |
| **Vue Router** | 4.0 | Routing | SPA routing with lazy loading |
| **Vuex** | 4.0 | State Management | Centralized state management |
| **Vue i18n** | 9.1 | Internationalization | Multi-language support |
| **Axios** | 0.26 | HTTP Client | API requests with interceptors |

### Visualization & Charts

| Technology | Version | Purpose |
|------------|---------|---------|
| **ECharts** | 5.3.3 | Interactive charts and data visualization |
| **ECharts GL** | 2.0.9 | 3D visualization support |
| **ECharts WordCloud** | 2.0.0 | Word cloud visualization |
| **AntV G2Plot** | 2.4.20 | Chart library |

### UI Components & Plugins

| Technology | Version | Purpose |
|------------|---------|---------|
| **wangEditor** | 4.7.12 | Rich text editor |
| **vue-codemirror** | 6.1.1 | Code editor with syntax highlighting |
| **vue-grid-layout** | 3.0.0 | Drag-and-drop grid layout |
| **splitpanes** | 3.1.1 | Resizable split panes |
| **SortableJS** | 1.14.0 | Drag and drop sorting |
| **CropperJS** | 1.5.12 | Image cropping |
| **vue3-cron** | 1.1.8 | Cron expression editor |
| **QRCodeJS2** | 0.0.2 | QR code generation |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **dayjs** | 1.11.8 | Date/time manipulation |
| **NProgress** | 0.2.0 | Progress bar for navigation |
| **Screenfull** | 6.0.1 | Fullscreen functionality |
| **PrintJS** | 1.6.0 | Print functionality |
| **XLSX with Styles** | 0.17.2 | Excel export with styling |
| **mitt** | 3.0.0 | Event emitter |
| **jsrsasign** | 10.8.6 | Cryptographic library |

---

## 📁 Project Structure

```
xunjiot-ui/
├── public/                    # Static assets
│   ├── deviceImportExample.xlsx
│   ├── favicon.ico
│   ├── imgs/                  # SVG icons and images
│   └── worker.js              # Web worker for background tasks
├── src/
│   ├── api/                   # API interface definitions
│   │   ├── alarm/             # Alarm management APIs
│   │   ├── application/       # Application management
│   │   ├── assess/            # Assessment APIs
│   │   ├── certificateManagement/ # Certificate APIs
│   │   ├── common/            # Common API utilities
│   │   ├── datahub/           # Data hub APIs
│   │   ├── device/            # Device management APIs
│   │   ├── message/           # Message APIs
│   │   ├── network/           # Network management APIs
│   │   ├── notice/            # Notification APIs
│   │   └── system/            # System management APIs
│   ├── assets/                # Static assets
│   │   ├── img/               # Images and icons
│   │   ├── *.svg              # SVG icons
│   │   └── *.png              # PNG images
│   ├── components/            # Reusable Vue components
│   │   ├── auth/              # Authentication components
│   │   │   ├── auth.vue       # Permission button component
│   │   │   ├── authAll.vue    # Permission all component
│   │   │   └── auths.vue      # Multiple permissions component
│   │   ├── chart/             # Chart components
│   │   │   ├── index.vue      # ECharts wrapper
│   │   │   └── options.ts     # Chart configurations
│   │   ├── chartDom/          # DOM chart component
│   │   ├── codeEditor/        # Code editor
│   │   ├── copy/              # Copy to clipboard
│   │   ├── cropper/           # Image cropper
│   │   ├── devantd/           # Dev ant design component
│   │   ├── editor/            # Rich text editor
│   │   ├── iconSelector/      # Icon selector
│   │   ├── jsontree/          # JSON tree viewer
│   │   ├── lrLayout/          # Left-right layout
│   │   ├── noticeBar/         # Notice bar
│   │   ├── pagination/        # Pagination component
│   │   ├── svgIcon/           # SVG icon component
│   │   ├── upload/            # File upload
│   │   └── vue3cron/          # Cron expression editor
│   ├── hooks/                 # Vue 3 Composition API hooks
│   │   ├── useCommon.ts       # Common utilities
│   │   ├── useCommonIce104.ts # ICE104 protocol utilities
│   │   └── useCommonModbus.ts # Modbus protocol utilities
│   ├── i18n/                  # Internationalization
│   │   ├── index.ts           # i18n configuration
│   │   ├── lang/              # Language files
│   │   └── pages/             # Page-level translations
│   ├── layout/                # Layout components
│   │   ├── component/         # Layout sub-components
│   │   ├── footer/            # Footer component
│   │   ├── index.vue          # Main layout
│   │   ├── lockScreen/        # Lock screen
│   │   ├── logo/              # Logo component
│   │   ├── main/              # Main content area
│   │   ├── navBars/           # Navigation bars
│   │   ├── navMenu/           # Navigation menus
│   │   └── routerView/        # Router view container
│   ├── main.ts                # Application entry point
│   ├── router/                # Router configuration
│   │   ├── backEnd.ts         # Backend route management
│   │   ├── frontEnd.ts        # Frontend route configuration
│   │   ├── index.ts           # Router initialization
│   │   └── route.ts           # Route definitions
│   ├── store/                 # State management
│   │   ├── index.ts           # Store configuration
│   │   ├── interface/         # TypeScript interfaces
│   │   └── modules/           # Store modules
│   ├── theme/                 # Theme and styling
│   │   ├── app.scss           # Main styles
│   │   ├── dark.scss          # Dark theme
│   │   ├── element.scss       # Element Plus overrides
│   │   ├── fast.scss          # Fast theme
│   │   ├── index.scss         # Theme index
│   │   ├── loading.scss       # Loading styles
│   │   ├── media/             # Responsive media queries
│   │   └── other.scss         # Other styles
│   ├── utils/                 # Utility functions
│   ├── views/                 # Page views
│   │   ├── error/             # Error pages (401, 404)
│   │   ├── iot/               # IoT management pages
│   │   ├── limits/            # Permission limit pages
│   │   ├── login/             # Login pages
│   │   ├── personal/          # Personal center
│   │   ├── sso/               # SSO login
│   │   └── system/            # System management pages
│   ├── App.vue                # Root component
│   └── main.ts                # Entry point
├── .env                       # Default environment
├── .env.development           # Development environment
├── .env.development.local     # Local development environment
├── .env.golocal               # Go local environment
├── .env.open                  # Open environment
├── .env.test                  # Test environment
├── index.html                 # HTML template
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── yarn.lock                  # Yarn lock file
```

---

## ✨ Implementation Details

### A. API Layer (API接口层)

The API layer provides TypeScript interfaces and service functions for communicating with the backend.

#### A.1 API Structure

```typescript
// src/api/device/index.ts
import request from '@/utils/request';

// Device interface definition
export interface DeviceInfo {
  id: number;
  deviceName: string;
  deviceKey: string;
  productId: number;
  status: number;
  onlineTime?: string;
  offlineTime?: string;
  createdAt: string;
  updatedAt: string;
}

// Get device list
export const getDeviceList = (params: any) => {
  return request({
    url: '/api/v1/device/list',
    method: 'get',
    params,
  });
};

// Get device detail
export const getDeviceDetail = (id: number) => {
  return request({
    url: `/api/v1/device/${id}`,
    method: 'get',
  });
};

// Add device
export const addDevice = (data: DeviceInfo) => {
  return request({
    url: '/api/v1/device',
    method: 'post',
    data,
  });
};

// Update device
export const updateDevice = (data: DeviceInfo) => {
  return request({
    url: '/api/v1/device',
    method: 'put',
    data,
  });
};

// Delete device
export const deleteDevice = (id: number) => {
  return request({
    url: `/api/v1/device/${id}`,
    method: 'delete',
  });
};
```

#### A.2 API Modules

| Module | Files | Description |
|--------|-------|-------------|
| **Alarm** | `src/api/alarm/index.ts` | Alarm rules, logs, handling |
| **Application** | `src/api/application/index.ts` | Application management |
| **Certificate** | `src/api/certificateManagement/index.ts` | Certificate management |
| **DataHub** | `src/api/datahub/index.ts` | Data center operations |
| **Device** | `src/api/device/index.ts, modbus.ts` | Device management, Modbus config |
| **Message** | `src/api/message/index.ts` | Message management |
| **Network** | `src/api/network/index.ts` | Network configuration |
| **Notice** | `src/api/notice/index.ts` | Notification management |
| **System** | `src/api/system/index.ts, dbInit/*` | System configuration |

### B. Components (组件层)

#### B.1 Authentication Components (权限组件)

Located in `src/components/auth/`:

```vue
<!-- auth.vue - Permission button component -->
<template>
  <el-button
    v-if="checkPermission(permission)"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
import { usePermission } from '@/hooks/useCommon';

defineProps({
  permission: {
    type: String,
    required: true,
  },
});

const { checkPermission } = usePermission();
</script>
```

**Components:**
- `auth.vue` - Single permission check
- `authAll.vue` - All permissions required
- `auths.vue` - Multiple permissions support

#### B.2 Chart Components (图表组件)

Located in `src/components/chart/`:

```vue
<!-- index.vue - ECharts wrapper -->
<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';

const props = defineProps<{
  options: EChartsOption;
  width?: string;
  height?: string;
}>();

const chartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(props.options);
  }
};

useResizeObserver(chartRef, () => {
  chartInstance?.resize();
});

onMounted(initChart);
onUnmounted(() => chartInstance?.dispose());
</script>
```

**Chart Configuration (`options.ts`):**
```typescript
// Line chart configuration
export const getLineChartOptions = (data: any[], xData: string[]) => ({
  tooltip: { trigger: 'axis' },
  legend: { data: data.map(d => d.name) },
  xAxis: { type: 'category', data: xData },
  yAxis: { type: 'value' },
  series: data.map(d => ({
    name: d.name,
    type: 'line',
    data: d.values,
    smooth: true,
  })),
});

// Gauge chart configuration
export const getGaugeChartOptions = (value: number, title: string) => ({
  series: [{
    type: 'gauge',
    detail: { formatter: '{value}%' },
    data: [{ value, name: title }],
  }],
});
```

#### B.3 Upload Components (上传组件)

Located in `src/components/upload/`:

| Component | Purpose |
|-----------|---------|
| `index.vue` | Main upload component |
| `imgUpload.vue` | Image upload with preview |
| `fileUpload.vue` | File upload |

**Features:**
- Drag and drop upload
- Progress tracking
- File type validation
- Size limit checking
- Preview functionality

#### B.4 Code Editor (代码编辑器)

Located in `src/components/codeEditor/`:

```vue
<!-- index.vue - CodeMirror editor -->
<template>
  <codemirror
    v-model="code"
    :options="cmOptions"
    :style="{ height: height + 'px' }"
  />
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { oneDark } from '@codemirror/theme-one-dark';

const props = defineProps<{
  modelValue: string;
  language?: string;
  height?: number;
  readonly?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const code = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const cmOptions = {
  mode: props.language || 'javascript',
  theme: oneDark,
  readOnly: props.readonly || false,
  lineNumbers: true,
  indentUnit: 2,
};
</script>
```

#### B.5 Cron Editor (Cron表达式编辑器)

Located in `src/components/vue3cron/`:

```vue
<!-- index.vue -->
<template>
  <div class="cron-editor">
    <el-tabs v-model="activeName">
      <el-tab-pane label="Second" name="second">
        <cron-second v-model="cronExpression.second" />
      </el-tab-pane>
      <el-tab-pane label="Minute" name="minute">
        <cron-minute v-model="cronExpression.minute" />
      </el-tab-pane>
      <el-tab-pane label="Hour" name="hour">
        <cron-hour v-model="cronExpression.hour" />
      </el-tab-pane>
      <el-tab-pane label="Day" name="day">
        <cron-day v-model="cronExpression.day" />
      </el-tab-pane>
      <el-tab-pane label="Month" name="month">
        <cron-month v-model="cronExpression.month" />
      </el-tab-pane>
      <el-tab-pane label="Week" name="week">
        <cron-week v-model="cronExpression.week" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
```

#### B.6 Icon Selector (图标选择器)

Located in `src/components/iconSelector/`:

```vue
<!-- index.vue -->
<template>
  <div class="icon-selector">
    <el-input
      v-model="searchKey"
      placeholder="Search icons"
      prefix-icon="Search"
      clearable
    />
    <div class="icon-list">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        class="icon-item"
        :class="{ active: selectedIcon === icon }"
        @click="selectIcon(icon)"
      >
        <component :is="icon" />
      </div>
    </div>
  </div>
</template>
```

### C. Layout System (布局系统)

Located in `src/layout/`:

#### C.1 Main Layout (`index.vue`)

```vue
<template>
  <div class="layout-container">
    <sidebar />
    <main class="main-content">
      <navbar />
      <tags-view />
      <app-main />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './navMenu/index.vue';
import Navbar from './navBars/index.vue';
import TagsView from './navBars/tagsView.vue';
import AppMain from './main/index.vue';
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
```

#### C.2 Navigation Menu (`navMenu/`)

```vue
<!-- navMenu/index.vue -->
<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    class="nav-menu"
  >
    <template v-for="route in menuRoutes" :key="route.path">
      <menu-item :route="route" />
    </template>
  </el-menu>
</template>
```

**Features:**
- Recursive menu rendering
- Icon support
- Collapse/expand
- Active menu highlighting
- Permission-based menu filtering

#### C.3 Tags View (`navBars/tagsView.vue`)

```vue
<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        :class="['tags-view-item', { active: isActive(tag) }]"
        @click.middle="closeTag(tag)"
      >
        {{ tag.title }}
        <el-icon v-if="!isAffix(tag)" @click.prevent.stop="closeTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </scroll-pane>
  </div>
</template>
```

**Features:**
- Multiple tag management
- Quick close operations
- Affix tags (pinned views)
- Scroll navigation

#### C.4 Lock Screen (`lockScreen/`)

```vue
<!-- lockScreen/index.vue -->
<template>
  <div class="lock-screen">
    <div class="lock-content">
      <el-avatar :size="80" :src="userInfo.avatar" />
      <h3>{{ userInfo.username }}</h3>
      <el-input
        v-model="password"
        type="password"
        placeholder="Enter password to unlock"
        @keyup.enter="unlock"
      />
      <el-button type="primary" @click="unlock">Unlock</el-button>
    </div>
  </div>
</template>
```

### D. Routing System (路由系统)

Located in `src/router/`:

#### D.1 Route Configuration (`route.ts`)

```typescript
// src/router/route.ts
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'Login', public: true },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/iot/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'Odometer' },
      },
    ],
  },
  {
    path: '/iot',
    component: () => import('@/layout/index.vue'),
    redirect: '/iot/device',
    meta: { title: 'IoT Management', icon: 'Cpu' },
    children: [
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/iot/device/index.vue'),
        meta: { title: 'Device Management', icon: 'Connection' },
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/iot/product/index.vue'),
        meta: { title: 'Product Management', icon: 'Box' },
      },
    ],
  },
];

export default routes;
```

#### D.2 Router Guards

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { permissionStore } from '@/store/modules/permission';
import { userStore } from '@/store/modules/user';
import { getToken } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      const hasPermissions = permissionStore.routes.length > 0;
      if (hasPermissions) {
        next();
      } else {
        try {
          await userStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes();
          accessRoutes.forEach(route => {
            router.addRoute(route);
          });
          next({ ...to, replace: true });
        } catch (error) {
          await userStore.logout();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    if (to.meta.public) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

export default router;
```

### E. State Management (状态管理)

Located in `src/store/`:

#### E.1 Store Modules

```typescript
// src/store/modules/user.ts
import { defineStore } from 'vuex';
import { UserState } from '../interface';
import { login, logout, getInfo } from '@/api/system';
import { getToken, setToken, removeToken } from '@/utils/auth';

export const userStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: getToken(),
    name: '',
    username: '',
    avatar: '',
    roles: [],
    permissions: [],
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userAvatar: (state) => state.avatar,
    userRoles: (state) => state.roles,
  },
  
  actions: {
    async login(userInfo: any) {
      try {
        const res = await login(userInfo);
        setToken(res.data.token);
        this.token = res.data.token;
        return res;
      } catch (error) {
        throw error;
      }
    },
    
    async getInfo() {
      try {
        const res = await getInfo();
        this.name = res.data.name;
        this.username = res.data.username;
        this.avatar = res.data.avatar;
        this.roles = res.data.roles;
        this.permissions = res.data.permissions;
      } catch (error) {
        throw error;
      }
    },
    
    async logout() {
      try {
        await logout();
      } finally {
        this.resetState();
        removeToken();
      }
    },
    
    resetState() {
      this.token = '';
      this.name = '';
      this.username = '';
      this.avatar = '';
      this.roles = [];
      this.permissions = [];
    },
  },
});
```

#### E.2 Permission Store

```typescript
// src/store/modules/permission.ts
import { defineStore } from 'vuex';
import { PermissionState } from '../interface';
import { asyncRoutes, constantRoutes } from '@/router/route';
import { filterAsyncRoutes } from '@/utils/permission';

export const permissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  
  getters: {
    permission_routes: (state) => state.routes,
    sidebarRoutes: (state) => state.sidebarRouters,
  },
  
  actions: {
    generateRoutes(roles: string[]) {
      return new Promise((resolve) => {
        let accessedRoutes;
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes;
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
        }
        this.addRoutes = accessedRoutes;
        this.routes = constantRoutes.concat(accessedRoutes);
        resolve(accessedRoutes);
      });
    },
  },
});
```

### F. Utility Functions (工具函数)

Located in `src/utils/`:

#### F.1 Request Utility

```typescript
// src/utils/request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken } from './auth';
import router from '@/router';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code === 200) {
      return res;
    }
    ElMessage.error(res.msg || 'Request failed');
    return Promise.reject(new Error(res.msg || 'Error'));
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          ElMessageBox.confirm('Token expired, please login again', 'Confirm', {
            confirmButtonText: 'Re-login',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }).then(() => {
            router.push('/login');
          });
          break;
        case 403:
          router.push('/403');
          break;
        case 404:
          router.push('/404');
          break;
        default:
          ElMessage.error(data.msg || 'Service error');
      }
    }
    return Promise.reject(error);
  }
);

export default service;
```

#### F.2 Auth Utility

```typescript
// src/utils/auth.ts
import { useCache } from '@/hooks/useCommon';

const TOKEN_KEY = 'xunji_token';
const USER_INFO_KEY = 'xunji_user_info';

export const getToken = () => {
  return useCache().get(TOKEN_KEY);
};

export const setToken = (token: string) => {
  useCache().set(TOKEN_KEY, token, 24 * 60 * 60 * 1000); // 24 hours
};

export const removeToken = () => {
  useCache().remove(TOKEN_KEY);
};

export const getUserInfo = () => {
  return useCache().get(USER_INFO_KEY);
};

export const setUserInfo = (userInfo: any) => {
  useCache().set(USER_INFO_KEY, userInfo);
};
```

#### F.3 Permission Utility

```typescript
// src/utils/permission.ts
import i18n from '@/i18n';

export const usePermission = () => {
  const { t } = i18n.global;
  
  // Check if user has permission
  const hasPermission = (permission: string): boolean => {
    const permissions = JSON.parse(localStorage.getItem('xunji_permissions') || '[]');
    return permissions.includes(permission);
  };
  
  // Check if user has any of the permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };
  
  // Check if user has all of the permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };
  
  // Filter routes by permission
  const filterAsyncRoutes = (routes: any[], roles: string[]) => {
    const res: any[] = [];
    routes.forEach(route => {
      const tmp = { ...route };
      if (hasPermission(tmp.meta?.permission)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles);
        }
        res.push(tmp);
      }
    });
    return res;
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    filterAsyncRoutes,
  };
};
```

### G. Views (页面视图)

Located in `src/views/`:

#### G.1 IoT Management Views (`src/views/iot/`)

| View | Path | Description |
|------|------|-------------|
| **Dashboard** | `dashboard/index.vue` | IoT dashboard with charts |
| **Device** | `device/index.vue` | Device list and management |
| **Device Detail** | `device/detail.vue` | Device detail page |
| **Device Monitor** | `device/monitor.vue` | Real-time device monitoring |
| **Product** | `product/index.vue` | Product management |
| **Product Detail** | `product/detail.vue` | Product thing model |
| **Alarm** | `alarm/index.vue` | Alarm rules and logs |
| **Alarm Setting** | `alarm/alarmSetting.vue` | Alarm configuration |
| **DataHub** | `datahub/index.vue` | Data center |
| **Network** | `network/index.vue` | Network management |
| **Scene** | `scene/index.vue` | Scene automation |

**Dashboard Implementation:**
```vue
<!-- views/iot/dashboard/index.vue -->
<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in statistics" :key="stat.key">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card>
          <template #header>Device Trend</template>
          <chart :options="lineChartOptions" height="300px" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>Device Status</template>
          <chart :options="pieChartOptions" height="300px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getStatistics } from '@/api/device';
import { getLineChartOptions, getGaugeChartOptions } from '@/components/chart/options';

const statistics = ref([]);
const lineChartOptions = ref({});
const pieChartOptions = ref({});

onMounted(async () => {
  const res = await getStatistics();
  statistics.value = res.data.statistics;
  lineChartOptions.value = getLineChartOptions(res.data.trend);
  pieChartOptions.value = getGaugeChartOptions(res.data.status);
});
</script>
```

#### G.2 System Management Views (`src/views/system/`)

| View | Description |
|------|-------------|
| **User** | User management (add, edit, delete, assign roles) |
| **Role** | Role management (permissions, menus) |
| **Menu** | Menu management (tree structure) |
| **Dept** | Department management |
| **Dict** | Dictionary management |
| **Config** | System configuration |
| **Job** | Scheduled tasks |
| **Logs** | Operation logs, login logs |

#### G.3 Login View (`src/views/login/`)

```vue
<!-- views/login/index.vue -->
<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="@/assets/logo.svg" class="logo" />
        <h1>XunjiIOT</h1>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Username"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="captcha">
          <div class="captcha-wrapper">
            <el-input
              v-model="loginForm.captcha"
              placeholder="Captcha"
              prefix-icon="Picture"
              @keyup.enter="handleLogin"
            />
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img" />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">Remember me</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            class="login-btn"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <el-button link @click="handleOAuthLogin('github')">
          <img src="@/assets/github.svg" /> GitHub
        </el-button>
        <el-button link @click="handleOAuthLogin('wechat')">
          <img src="@/assets/wechat.svg" /> WeChat
        </el-button>
      </div>
    </div>
  </div>
</template>
```

### H. Internationalization (国际化)

Located in `src/i18n/`:

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n';
import zh from './lang/zh';
import en from './lang/en';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  messages: {
    zh,
    en,
  },
});

export default i18n;
```

**Translation Structure:**
```typescript
// src/i18n/lang/zh.ts
export default {
  common: {
    ok: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    search: '搜索',
    reset: '重置',
    loading: '加载中...',
    noData: '暂无数据',
  },
  menu: {
    dashboard: '首页',
    device: '设备管理',
    product: '产品管理',
    alarm: '告警管理',
    system: '系统管理',
  },
  device: {
    title: '设备列表',
    name: '设备名称',
    key: '设备密钥',
    status: '状态',
    online: '在线',
    offline: '离线',
  },
};
```

### I. Theme System (主题系统)

Located in `src/theme/`:

#### I.1 Main Theme (`index.scss`)

```scss
// Variables
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

$background-color: #f5f7fa;
$border-color: #dcdfe6;
$text-color: #606266;

// Mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin card-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
```

#### I.2 Dark Theme (`dark.scss`)

```scss
.dark-theme {
  --bg-color: #141414;
  --text-color: #e0e0e0;
  --border-color: #434343;
  --primary-color: #409eff;
  
  background-color: var(--bg-color);
  color: var(--text-color);
  
  .el-card {
    background-color: #1f1f1f;
    border-color: var(--border-color);
  }
}
```

#### I.3 Responsive Design (`media/`)

```scss
// media/pad.scss
@media screen and (max-width: 992px) {
  .sidebar-container {
    width: 54px !important;
  }
  
  .main-content {
    margin-left: 54px !important;
  }
}

// media/mobile.scss
@media screen and (max-width: 768px) {
  .sidebar-container {
    display: none !important;
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}
```

### J. Custom Hooks (自定义Hooks)

Located in `src/hooks/`:

#### J.1 useCommon Hook

```typescript
// src/hooks/useCommon.ts
import { ref, computed } from 'vue';
import { useCache } from '@/hooks/useCommon';

export function useCommon() {
  const collapsed = ref(false);
  
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
  };
  
  // Cache management
  const cache = useCache();
  
  // Permission check
  const checkPermission = (permission: string): boolean => {
    const permissions = JSON.parse(
      localStorage.getItem('xunji_permissions') || '[]'
    );
    return permissions.includes(permission);
  };
  
  // Format date
  const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  };
  
  // Debounce function
  const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    delay = 300
  ): ((...args: Parameters<T>) => void) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };
  
  // Throttle function
  const throttle = <T extends (...args: any[]) => any>(
    fn: T,
    delay = 300
  ): ((...args: Parameters<T>) => void) => {
    let lastTime = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastTime > delay) {
        fn(...args);
        lastTime = now;
      }
    };
  };
  
  return {
    collapsed,
    toggleCollapse,
    cache,
    checkPermission,
    formatDate,
    debounce,
    throttle,
  };
}
```

#### J.2 useCommonModbus Hook

```typescript
// src/hooks/useCommonModbus.ts
export function useCommonModbus() {
  // Modbus function codes
  const FC_READ_COILS = 0x01;
  const FC_READ_DISCRETE = 0x02;
  const FC_READ_HOLDING = 0x03;
  const FC_READ_INPUT = 0x04;
  const FC_WRITE_SINGLE = 0x05;
  const FC_WRITE_MULTIPLE = 0x0F;
  
  // Build Modbus request
  const buildRequest = (
    slaveId: number,
    functionCode: number,
    startAddr: number,
    quantity: number,
    values?: number[]
  ): Uint8Array => {
    const request = new Uint8Array(6 + (values ? values.length * 2 : 0));
    request[0] = slaveId;
    request[1] = functionCode;
    request[2] = (startAddr >> 8) & 0xFF;
    request[3] = startAddr & 0xFF;
    request[4] = (quantity >> 8) & 0xFF;
    request[5] = quantity & 0xFF;
    
    if (values) {
      request[6] = values.length;
      values.forEach((val, idx) => {
        request[7 + idx * 2] = (val >> 8) & 0xFF;
        request[8 + idx * 2] = val & 0xFF;
      });
    }
    
    return request;
  };
  
  // Parse Modbus response
  const parseResponse = (response: Uint8Array): number[] => {
    const values: number[] = [];
    const byteCount = response[2];
    for (let i = 0; i < byteCount; i++) {
      const value = response[3 + i];
      for (let bit = 0; bit < 8; bit++) {
        values.push((value >> bit) & 0x01);
      }
    }
    return values;
  };
  
  return {
    FC_READ_COILS,
    FC_READ_DISCRETE,
    FC_READ_HOLDING,
    FC_READ_INPUT,
    FC_WRITE_SINGLE,
    FC_WRITE_MULTIPLE,
    buildRequest,
    parseResponse,
  };
}
```

---

## 🔧 Configuration

### Environment Variables

| File | Purpose |
|------|---------|
| `.env` | Default configuration (never modify) |
| `.env.golocal` | Go local environment config |
| `.env.development` | Development environment |
| `.env.development.local` | Local development (git ignored) |
| `.env.open` | Open environment |
| `.env.test` | Test environment |

**Example `.env.development.local`:**
```bash
# Environment
ENV = 'development'

# WebSocket URL
VITE_WS_URL = 'ws://127.0.0.1:8199/api/v1/websocket'

# Server configuration
VITE_SERVER_PROTOCOL = 'http:'
VITE_SERVER_HOSTNAME = '127.0.0.1:8199'
VITE_SERVER_URL = ''
VITE_API_URL = '/api/v1'
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8199',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8199',
        ws: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/theme/index.scss";`,
      },
    },
  },
});
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "experimentalDecorators": true,
    "strictFunctionTypes": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies using yarn
yarn install

# Or using npm
npm install
```

### Development

```bash
# Start React development server (default)
yarn run dev

# Start legacy Vue development server
yarn run dev:vue

# Development server will run at http://localhost:3000
```

### Build

```bash
# Build React production bundle (default)
yarn run build

# Build legacy Vue production bundle
yarn run build:vue

# Build for Go local environment
yarn run build:golocal

# Build for open environment
yarn run build:open

# Build for test environment
yarn run build:test
```

### React Migration Status

- `src-react/` contains a React implementation with:
  - login page (`/login`), captcha, token storage, RSA-encrypted password support
  - auth guard route handling (`/` protected)
  - basic layout + home dashboard
  - system config page (`/system/basic-config`) including basic + security settings
  - dict type management page (`/system/dict-types`) with query/pagination/create/update/delete
  - 401/404 pages
- `src/main.ts` now loads framework entry through `@entry` alias.
- `VITE_APP_FRAMEWORK=react|vue` selects React or Vue build/runtime.

### Deployment

```bash
# Deploy to server (requires SSH access configured)
npm run deploy
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vue | ^3.2.37 | Core framework |
| vue-router | ^4.0.13 | Routing |
| vuex | ^4.0.2 | State management |
| element-plus | 2.2.28 | UI components |
| axios | ^0.26.0 | HTTP client |
| echarts | ^5.3.3 | Charts |
| dayjs | ^1.11.8 | Date handling |
| vue-i18n | 9.1.10 | i18n |
| sass | ^1.49.9 | CSS preprocessor |
| typescript | ^4.6.2 | Type checking |
| vite | ^2.9.16 | Build tool |

---

## 🔐 Security Features

1. **Token Management**
   - JWT token authentication
   - Automatic token refresh
   - Secure storage (localStorage)

2. **Permission Control**
   - Route-level permission
   - Button-level permission
   - Role-based access control

3. **API Security**
   - Request/response interceptors
   - Automatic token injection
   - Error handling and redirects

4. **Data Validation**
   - Form validation
   - Input sanitization
   - XSS protection

---

## 📱 Responsive Design

The application is fully responsive and adapts to:
- Desktop (≥1200px)
- Laptop (992px - 1199px)
- Tablet (768px - 991px)
- Mobile (<768px)

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

---

## 📄 License

This project is licensed under the [GPL-3.0](LICENSE) License.

---

## 📞 Contact

- **Official Website**: http://www.xunji.cn
- **Documentation**: http://iotdoc.xunji.cn/
- **GitHub**: https://github.com/xunji-cloud/xunjiot
- **QQ Group**: 686637608

---

<div align="center">

**Made with ❤️ by the XunjiIOT Team**

If this project helps you, please consider clicking ⭐ **Star** in the upper right corner to support us!

</div>
