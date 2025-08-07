# Mock数据配置更新说明

## 变更概述

项目中的 `VITE_USE_MOCK_DATA` 环境变量配置逻辑已更新，新增了 `auto` 模式，以提供更灵活的数据源切换功能。

## 配置选项

### 新的配置逻辑

| 配置值 | 行为说明 |
|--------|----------|
| `'true'` | 强制使用mock数据（无论是否登录） |
| `'false'` | 强制使用后端API（无论是否登录） |
| `'auto'` | **[新增]** 智能模式：未登录时使用mock数据，登录后使用后端API |
| 未设置或其他值 | 使用开发环境默认配置（开发环境为true，生产环境为false） |

### 推荐配置

```bash
# .env 文件
# 开发环境推荐使用 auto 模式
VITE_USE_MOCK_DATA=auto
```

## 实现细节

### 核心函数更新

`src/utils/authUtils.ts` 中的 `shouldUseMockData()` 函数已更新：

```typescript
export function shouldUseMockData(): boolean {
  // 如果环境变量明确设置为true，强制使用mock数据
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true')
    return true

  // 如果环境变量明确设置为false，强制使用后端API
  if (import.meta.env.VITE_USE_MOCK_DATA === 'false')
    return false

  // 如果环境变量设置为auto，根据登录状态决定：未登录使用mock，登录后使用API
  if (import.meta.env.VITE_USE_MOCK_DATA === 'auto')
    return !isLoggedIn()

  // 默认情况下（未设置或其他值），使用开发环境配置
  return import.meta.env.DEV
}
```

### 已更新的文件

以下文件已更新为使用统一的 `shouldUseMockData()` 函数：

1. **`src/utils/authUtils.ts`** - 核心逻辑函数
2. **`src/api/talent/designer.ts`** - 设计师API
3. **`src/composables/talent/useSchool.ts`** - 院校相关功能
4. **`src/views/talent/designers/index.vue`** - 调试信息显示

### 使用场景

#### 开发阶段
```bash
# 未登录用户可以浏览mock数据
# 登录后的开发者可以测试真实API
VITE_USE_MOCK_DATA=auto
```

#### 纯前端开发
```bash
# 始终使用mock数据，无需后端支持
VITE_USE_MOCK_DATA=true
```

#### API集成测试
```bash
# 始终使用后端API，测试真实接口
VITE_USE_MOCK_DATA=false
```

## 向后兼容性

- 现有的 `true` 和 `false` 配置保持不变
- 未设置环境变量时的行为保持兼容
- 所有现有功能正常工作

## 测试方法

1. **测试auto模式：**
   ```bash
   # 设置环境变量
   VITE_USE_MOCK_DATA=auto

   # 重启开发服务器
   npm run dev

   # 验证：未登录时显示mock数据，登录后切换到API数据
   ```

2. **测试其他模式：**
   ```bash
   # 强制mock模式
   VITE_USE_MOCK_DATA=true

   # 强制API模式
   VITE_USE_MOCK_DATA=false
   ```

## 注意事项

- 修改环境变量后需要重启开发服务器
- `auto` 模式依赖用户登录状态，确保登录功能正常工作
- 在生产环境中建议使用 `false` 确保使用真实API
