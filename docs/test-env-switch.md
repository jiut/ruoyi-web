# 环境变量切换功能测试指南

## 🎯 功能概述

项目已成功实现通过 `VITE_USE_MOCK_DATA` 环境变量来切换数据源：

- `VITE_USE_MOCK_DATA=true`: 使用本地模拟数据（开发模式）
- `VITE_USE_MOCK_DATA=false`: 使用后端API数据（生产模式）

## 🔧 修复完成的问题

### 1. 导入错误修复
✅ 修复了 `useDesigner.ts` 中 `parseSkillTags` 和 `sortTagsByCategory` 的导入错误
✅ 正确使用 `SkillTagUtils` 静态方法调用
✅ 统一了所有文件中的技能标签工具类使用

### 2. 已实现的功能
✅ 设计师API支持环境变量切换 (`src/api/talent/designer.ts`)
✅ 设计师Composable支持数据源切换 (`src/composables/talent/useDesigner.ts`)
✅ 设计师列表页面使用新的数据架构 (`src/views/talent/designers/index.vue`)
✅ 岗位模块已支持环境变量切换 (`src/composables/talent/useJob.ts`)

## 🚀 使用方法

### 步骤1: 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
# 开发模式 - 使用模拟数据
VITE_USE_MOCK_DATA=true
VITE_APP_API_BASE_URL=http://localhost:8080
VITE_GLOB_API_URL=http://localhost:8080

# 应用配置
VITE_GLOB_APP_TITLE="星海人才"
VITE_GLOB_APP_SHORT_NAME="星海人才"
VITE_GLOB_APP_PWA=false
```

### 步骤2: 切换数据源

**开发模式（推荐）:**
```bash
VITE_USE_MOCK_DATA=true
```

**生产模式:**
```bash
VITE_USE_MOCK_DATA=false
VITE_APP_API_BASE_URL=https://your-api-domain.com
VITE_GLOB_API_URL=https://your-api-domain.com
```

### 步骤3: 重启开发服务器

```bash
npm run dev
```

## 🔍 验证功能

### 1. 控制台调试信息
打开浏览器控制台，应该能看到：

**模拟数据模式:**
```
🔍 设计师API环境变量调试信息:
  VITE_USE_MOCK_DATA: true
  USE_MOCK_DATA: true

🔧 使用模拟数据 - 设计师列表
```

**API模式:**
```
🔍 设计师API环境变量调试信息:
  VITE_USE_MOCK_DATA: false
  USE_MOCK_DATA: false

🚀 使用后端API - 设计师列表
```

### 2. 功能测试清单

- [ ] 设计师列表页面正常加载
- [ ] 筛选功能正常工作（职业、技能、地区、工作状态、年限）
- [ ] 分页功能正常
- [ ] 搜索功能正常
- [ ] 技能标签显示正确（颜色和分类）
- [ ] 设计师详情页面正常
- [ ] 加载状态显示正确

### 3. 切换测试

1. 将 `VITE_USE_MOCK_DATA` 设置为 `true`，重启服务器
2. 验证使用模拟数据（控制台会显示调试信息）
3. 将 `VITE_USE_MOCK_DATA` 设置为 `false`，重启服务器
4. 验证尝试连接后端API（可能会显示网络错误，这是正常的）

## 📊 当前支持的模块

### ✅ 已完成
- **设计师模块**: 完整支持环境变量切换
- **岗位模块**: 完整支持环境变量切换

### 🔄 待扩展
- 院校数据库模块
- 学生作品库模块
- 企业信息模块

## 🐛 常见问题

### Q: 导入错误 "does not provide an export named"
**A:** 确保使用正确的导入方式：
```typescript
// 正确 ✅
import SkillTagUtils from '@/utils/skillTagUtils'
const skills = SkillTagUtils.parseSkillTags(skillsStr)

// 错误 ❌
import { parseSkillTags } from '@/utils/skillTagUtils'
```

### Q: 环境变量不生效
**A:**
1. 确保环境变量文件名正确（`.env`）
2. 重启开发服务器
3. 清除浏览器缓存

### Q: 控制台没有调试信息
**A:** 检查浏览器控制台的日志级别设置，确保显示所有日志

## 🎉 完成状态

✅ **环境变量切换功能已完全实现！**

项目现在可以灵活地在开发和生产环境之间切换数据源，为开发和部署提供了极大的便利性。

---

**最后更新**: 2024年6月24日
**版本**: v1.0.0
**作者**: AI Assistant
