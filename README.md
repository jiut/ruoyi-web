# RuoYi-Web

[English](./README_EN.md) | 简体中文

一个基于 Vue 3 的现代化 AI 聊天应用前端，支持 ChatGPT、Midjourney 等多种 AI 功能。

## ✨ 功能特性

- 🤖 **ChatGPT 对话** - 支持多轮对话，智能回复
- 🎨 **Midjourney 绘图** - AI 图像生成和编辑
- 🎵 **语音功能** - 语音识别和文字转语音
- 📱 **响应式设计** - 支持桌面端和移动端
- 🌍 **国际化** - 多语言支持
- 🎨 **主题切换** - 明暗主题切换

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Naive UI + Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: TailwindCSS + Less
- **图标**: Iconify
- **PWA**: Vite PWA Plugin

## 📋 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 (或使用 pnpm/yarn)

## 🚀 快速开始

### 下载项目

```bash
git clone https://gitee.com/ageerle/ruoyi-web
cd ruoyi-web
```

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
npm run dev
```

项目将在 `http://localhost:1002` 启动

### 打包构建

```bash
npm run build
```

## 📦 可用脚本

```bash
# 开发环境启动
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 自动修复代码格式
npm run lint:fix

# 文档开发
npm run docs:dev

# 文档构建
npm run docs:build
```

## 🔧 配置说明

项目使用环境变量进行配置，请根据需要创建 `.env` 文件：

```env
# API 基础地址
VITE_APP_API_BASE_URL=your_api_url

# 是否启用 PWA
VITE_GLOB_APP_PWA=true
```

## 📁 项目结构

```
ruoyi-web/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── hooks/             # 组合式函数
│   ├── locales/           # 国际化
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   └── main.ts            # 入口文件
├── docs/                  # 文档和截图
└── package.json
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目基于 MIT 许可证开源。

## 👨‍💻 作者

- **ageer** - [ageerle@163.com](mailto:ageerle@163.com)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
