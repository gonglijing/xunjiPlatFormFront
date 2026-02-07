# Xunji Platform Frontend

<div align="center">

[![Vue](https://img.shields.io/badge/vue-3.x-green)](https://v3.vuejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-4.6-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-2.9-yellow)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/element--plus-2.2.28-green)](https://element-plus.org/)
[![Ant Design](https://img.shields.io/badge/ant--design-6.x-blue)](https://ant.design/)
[![License](https://img.shields.io/badge/license-GPL3.0-success)](LICENSE)

</div>

---

## 📋 Project Overview

**Xunji Platform Frontend** is a modern, dual-framework IoT platform frontend supporting both **Vue 3** and **React 18**. Built with **Element Plus** (Vue) and **Ant Design** (React), it provides a comprehensive management interface for IoT device management, real-time monitoring, data analysis, and system administration.

### 🎯 Core Features

- **🔄 Dual Framework Support** - Switch seamlessly between Vue 3 and React 18
- **🎨 Modern UI** - Element Plus (Vue) + Ant Design (React) for professional appearance
- **📱 Responsive Design** - Adapts to desktop, tablet, and mobile screens
- **🔐 Secure Authentication** - Multiple auth methods with RSA encryption and token management
- **📊 Rich Visualization** - ECharts integration for dashboards and charts
- **🌐 Internationalization** - Built-in i18n support for multi-language
- **⚡ High Performance** - Vite-powered development and optimized builds

---

## 📁 Project Structure

```
xunjiPlatFormFront/
├── public/                      # Static assets
│   ├── imgs/                    # Images and icons
│   │   ├── logo-mini.svg       # Mini logo
│   │   ├── login-box-bg.svg     # Login background
│   │   └── ...
│   └── favicon.ico
│
├── src/                         # Vue 3 source code (Legacy)
│   ├── api/                     # API interface definitions
│   │   ├── alarm/              # Alarm management
│   │   ├── application/        # Application management
│   │   ├── device/             # Device management
│   │   ├── system/             # System management
│   │   └── ...
│   ├── components/             # Reusable Vue components
│   │   ├── auth/               # Permission components
│   │   ├── chart/              # ECharts wrappers
│   │   ├── upload/             # File upload
│   │   └── ...
│   ├── views/                  # Page views
│   │   ├── login/              # Login pages
│   │   ├── iot/                # IoT management
│   │   └── system/             # System management
│   ├── layout/                 # Layout components
│   ├── store/                  # Vuex store modules
│   ├── router/                 # Vue Router configuration
│   └── hooks/                  # Vue 3 Composition hooks
│
├── src-react/                   # React 18 source code (New)
│   ├── api/                     # API interface definitions
│   │   ├── alarm/              # Alarm management
│   │   ├── device/             # Device management
│   │   ├── system/             # System management
│   │   └── ...
│   ├── components/             # Reusable React components
│   │   ├── auth/               # Permission components
│   │   ├── chart/              # Chart components
│   │   ├── pagination/         # Pagination
│   │   └── upload/             # File upload
│   ├── pages/                  # Page components
│   │   ├── login/              # Login page
│   │   ├── iot/                # IoT management
│   │   │   ├── dashboard/       # Dashboard
│   │   │   ├── device/         # Device management
│   │   │   ├── product/        # Product management
│   │   │   └── alarm/          # Alarm management
│   │   ├── system/             # System management
│   │   │   ├── user/           # User management
│   │   │   ├── role/           # Role management
│   │   │   ├── menu/           # Menu management
│   │   │   └── config/         # System config
│   │   ├── error/              # Error pages (401, 404)
│   │   └── personal/           # Personal center
│   ├── hooks/                  # React hooks
│   ├── i18n/                   # Internationalization
│   ├── router/                 # React Router
│   ├── store/                 # Redux Toolkit store
│   │   ├── slice/              # Store slices
│   │   │   ├── userSlice.ts   # User state
│   │   │   ├── appSlice.ts    # App state
│   │   │   └── menuSlice.ts   # Menu state
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   ├── utils/                  # Utility functions
│   │   ├── request.ts          # Axios wrapper
│   │   └── rsa.ts             # RSA encryption
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point
│
├── .env                        # Default environment
├── .env.development            # Development environment
├── .env.golocal                # Go local environment
├── .env.production             # Production environment
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json               # Dependencies
```

---

## 🛠️ Technology Stack

### Vue 3 Stack (Legacy)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue** | 3.2.x | Frontend Framework |
| **Element Plus** | 2.2.28 | UI Component Library |
| **TypeScript** | 4.6+ | Type Safety |
| **Vite** | 2.9 | Build Tool |
| **Vue Router** | 4.0 | Routing |
| **Vuex** | 4.0 | State Management |
| **Vue i18n** | 9.1 | Internationalization |
| **Axios** | 0.26 | HTTP Client |

### React 18 Stack (New)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | Frontend Framework |
| **Ant Design** | 6.x | UI Component Library |
| **TypeScript** | 4.6+ | Type Safety |
| **Vite** | 2.9 | Build Tool |
| **React Router** | 6.x | Routing |
| **Redux Toolkit** | 2.x | State Management |
| **Redux Toolkit Query** | 2.x | Data Fetching |
| **Axios** | 0.26 | HTTP Client |

### Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **ECharts** | 5.3.3 | Interactive Charts |
| **ECharts GL** | 2.0.9 | 3D Visualization |
| **ECharts WordCloud** | 2.0.0 | Word Cloud |
| **AntV G2Plot** | 2.4.20 | Chart Library |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
yarn install

# Or using npm
npm install

# Or using pnpm
pnpm install
```

### Development

```bash
# Start React development server (default)
yarn dev

# Start Vue development server
yarn dev:vue

# Development server runs at http://localhost:3000
```

### Build

```bash
# Build React production bundle (default)
yarn build

# Build Vue production bundle
yarn build:vue

# Build for Go local environment
yarn build:golocal

# Build for open environment
yarn build:open

# Build for test environment
yarn build:test
```

---

## ⚙️ Environment Variables

### Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Default configuration |
| `.env.development` | Development environment |
| `.env.golocal` | Go local environment |
| `.env.production` | Production environment |

### Key Variables

```bash
# API Configuration
VITE_API_URL='/api/v1'
VITE_SERVER_HOSTNAME='127.0.0.1:8199'
VITE_SERVER_URL=''

# WebSocket
VITE_WS_URL='ws://127.0.0.1:8199/api/v1/websocket'

# Framework Selection
VITE_APP_FRAMEWORK='react'  # 'react' or 'vue'
```

---

## 📡 API Integration

### Vue API Layer (`src/api/`)

```typescript
// src/api/system/index.ts
import request from '@/utils/request';

export default {
  sysinfo: () => get('/sysinfo'),
  login: {
    login: (data: object) => post('/login', data),
    currentUser: () => get('/system/user/currentUser'),
    logout: () => post('/loginOut'),
  },
  // ...
};
```

### React API Layer (`src-react/api/`)

```typescript
// src-react/api/system/index.ts
import request from '@/utils/request';

export const login = (data: LoginParams) => {
  return request({
    url: '/login',
    method: 'post',
    data,
    headers: {
      'rsa-key': data.rsaKey,  // RSA encrypted password
    },
  });
};

export const getSysinfo = () => {
  return request.get('/sysinfo');
};
```

---

## 🔐 Authentication

### Vue Login Component

Located in `src/views/login/`:

```vue
<template>
  <div class="login-container">
    <el-form :model="loginForm" :rules="rules" ref="formRef">
      <el-form-item prop="userName">
        <el-input v-model="loginForm.userName" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
```

### React Login Component

Located in `src-react/pages/login/`:

```tsx
// src-react/pages/login/index.tsx
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginForm) => {
    const { userName, password } = values;
    // RSA encrypt password before sending
    const encryptedPassword = await rsaEncrypt(password);
    await login({ userName, password: encryptedPassword });
  };

  return (
    <div className="login-container">
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="userName" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
```

---

## 🎨 Layout System

### Vue Layout (`src/layout/`)

```
src/layout/
├── index.vue          # Main layout container
├── component/         # Layout sub-components
├── navMenu/           # Navigation menu
├── navBars/           # Navigation bars (navbar, tagsView)
├── logo/              # Logo component
├── main/              # Main content area
└── footer/            # Footer
```

### React Layout (`src-react/pages/layout/`)

```
src-react/pages/layout/
├── index.tsx          # Main layout container
├── component/         # Layout sub-components
│   ├── breadcrumb.tsx # Breadcrumb
│   └── tagsView.tsx   # Tags view
├── navMenu/           # Navigation menu
├── navBars/           # Navigation bars
└── index.css         # Layout styles
```

---

## 📦 Key Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vue | ^3.2.37 | Vue 3 Framework |
| react | ^18.x | React 18 Framework |
| vue-router | ^4.0.13 | Vue Routing |
| react-router-dom | ^6.x | React Routing |
| vuex | ^4.0.2 | Vue State |
| @reduxjs/toolkit | ^2.x | React State |
| element-plus | 2.2.28 | Vue UI Components |
| antd | ^6.2.3 | React UI Components |
| axios | ^0.26 | HTTP Client |
| echarts | ^5.3.3 | Charts |

### Utility Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| dayjs | ^1.11.8 | Date handling |
| jsrsasign | ^10.8.6 | RSA Encryption |
| mitt | ^3.0.0 | Event Emitter |
| sass | ^1.49.9 | CSS Preprocessor |

---

## 🔧 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'react' ? react() : vue(),
    compression({ algorithm: 'gzip' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@entry': mode === 'react' 
        ? path.resolve(__dirname, 'src-react/main.tsx')
        : path.resolve(__dirname, 'src/main.ts'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8199', changeOrigin: true },
      '/ws': { target: 'ws://127.0.0.1:8199', ws: true },
    },
  },
}));
```

---

## 🔐 Security Features

1. **RSA Password Encryption**
   - Password encrypted client-side before transmission
   - RSA public key from `/sysinfo` endpoint

2. **Token Authentication**
   - JWT token management
   - Automatic token injection in requests
   - Secure storage in localStorage

3. **Request Interceptors**
   - Automatic Authorization header injection
   - Response error handling
   - 401 redirect to login

4. **Permission Control**
   - Route-level permission guards
   - Button-level permission components
   - Role-based access control (RBAC)

---

## 📱 Responsive Design

The application is fully responsive:

| Viewport | Breakpoint | Layout |
|----------|------------|--------|
| Desktop | ≥1200px | Full sidebar, multi-column |
| Laptop | 992px - 1199px | Collapsed sidebar |
| Tablet | 768px - 991px | Single column |
| Mobile | <768px | Hidden sidebar, drawer menu |

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

- **GitHub**: https://github.com/gonglijing/xunjiPlatFormFront
- **Backend**: https://github.com/gonglijing/xunjiPlatFormBack

---

<div align="center">

**Made with ❤️ for IoT Applications**

</div>
