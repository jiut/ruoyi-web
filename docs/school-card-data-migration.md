# SchoolCard 组件数据迁移完成报告

## 概述

成功将 `SchoolCard.vue` 组件中的硬编码数据迁移到 `mockSchools.ts`，并实现了通过 `VITE_USE_MOCK_DATA` 环境变量控制数据源切换的功能。

## 迁移内容

### 1. 数据函数迁移

将以下硬编码的数据函数从 `SchoolCard.vue` 迁移到 `mockSchools.ts`：

- `formatEmploymentRate()` → `getMockEmploymentRate()`
- `formatFacultyStrength()` → `getMockFacultyStrength()`
- `formatStudentScore()` → `getMockStudentScore()`
- `getAdvantagePrograms()` → `getMockAdvantagePrograms()`

### 2. 新增的 Mock 数据结构

在 `mockSchools.ts` 中新增：

```typescript
// SchoolCard组件所需的格式化数据
interface SchoolCardStatsData {
  employmentRates: string[]
  facultyStrengths: string[]
  studentScores: string[]
  advantagePrograms: Record<string, string[]>
}

// 模拟SchoolCard卡片统计数据
export const mockSchoolCardStats: SchoolCardStatsData = {
  employmentRates: ['96.8%', '95.2%', '92.8%', '91.5%', '89.3%', '87.6%'],
  facultyStrengths: ['5.0', '4.9', '4.8', '4.7', '4.6', '4.5'],
  studentScores: ['4.9', '4.8', '4.7', '4.6', '4.5', '4.4'],
  advantagePrograms: {
    'COMPREHENSIVE': ['UI/UX设计', '视觉传达'],
    'ART': ['视觉传达', '产品设计'],
    'ENGINEERING': ['工业设计', '数字媒体'],
    'NORMAL': ['艺术教育', '美术学'],
    'FINANCE': ['品牌设计', '广告设计']
  }
}
```

### 3. 环境变量配置

组件现在根据 `VITE_USE_MOCK_DATA` 环境变量自动切换数据源：

```typescript
// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)
```

### 4. 数据获取函数更新

所有数据获取函数都已更新为支持环境变量切换：

```typescript
// 格式化就业率 - 根据环境变量切换数据源
const formatEmploymentRate = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockEmploymentRate(school.id)
  } else {
    // TODO: 调用后端API获取真实数据
    return '请配置后端API'
  }
}
```

## 测试功能

### 开发模式（使用 Mock 数据）

在 `.env` 文件中设置：
```bash
VITE_USE_MOCK_DATA=true
```

此时组件将显示模拟数据，控制台会输出：
```
🔍 SchoolCard 环境变量调试信息:
  VITE_USE_MOCK_DATA: true
  USE_MOCK_DATA: true
```

### 生产模式（使用后端 API）

在 `.env` 文件中设置：
```bash
VITE_USE_MOCK_DATA=false
```

此时组件将尝试调用后端API（目前显示"请配置后端API"），控制台会输出：
```
🔍 SchoolCard 环境变量调试信息:
  VITE_USE_MOCK_DATA: false
  USE_MOCK_DATA: false
```

## 优势

1. **统一数据管理**：所有Mock数据集中在 `mockSchools.ts` 文件中
2. **环境变量控制**：通过 `VITE_USE_MOCK_DATA` 轻松切换数据源
3. **代码复用**：多个组件可共享相同的Mock数据函数
4. **易于维护**：数据结构变更只需修改一个文件
5. **开发友好**：开发环境自动使用Mock数据，生产环境使用真实API

## 后续工作

1. 当后端API就绪时，在各个数据获取函数的 `else` 分支中添加真实的API调用
2. 可以考虑将更多组件的硬编码数据迁移到 `mockSchools.ts`
3. 根据需要扩展 `mockSchoolCardStats` 数据结构

## 文件修改清单

- ✅ `src/data/mockSchools.ts` - 新增Mock数据和函数
- ✅ `src/api/talent/school.ts` - 更新API接口
- ✅ `src/components/talent/SchoolCard.vue` - 重构数据获取逻辑
- ✅ `docs/school-card-data-migration.md` - 新增此文档
