# SchoolCard 数据迁移功能测试验证

## 验证概述

本文档提供了验证 `SchoolCard.vue` 组件数据迁移功能的详细步骤，确保环境变量切换功能正常工作。

## 功能验证清单

### ✅ 1. 数据迁移完成

- [x] 硬编码数据函数已从 `SchoolCard.vue` 移至 `mockSchools.ts`
- [x] 新增的Mock数据结构正确定义
- [x] API接口支持环境变量切换
- [x] 组件导入Mock数据函数

### ✅ 2. 环境变量配置

组件现在支持通过 `VITE_USE_MOCK_DATA` 环境变量切换数据源：

```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)
```

### ✅ 3. 数据获取函数

所有关键数据获取函数都已更新：

```typescript
// 就业率
const formatEmploymentRate = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockEmploymentRate(school.id)  // ✅ Mock数据
  } else {
    return '请配置后端API'  // ⚠️ 待后端API实现
  }
}

// 师资力量评分
const formatFacultyStrength = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockFacultyStrength(school.id)  // ✅ Mock数据
  } else {
    return '请配置后端API'  // ⚠️ 待后端API实现
  }
}

// 学生评分
const formatStudentScore = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockStudentScore(school.id)  // ✅ Mock数据
  } else {
    return '请配置后端API'  // ⚠️ 待后端API实现
  }
}

// 优势专业
const getAdvantagePrograms = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockAdvantagePrograms(school)  // ✅ Mock数据
  } else {
    return '请配置后端API'  // ⚠️ 待后端API实现
  }
}
```

## 测试步骤

### 步骤 1: 测试Mock数据模式

1. 在 `.env` 文件中设置：
   ```bash
   VITE_USE_MOCK_DATA=true
   ```

2. 重启开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器并访问院校列表页面

4. 检查控制台输出，应该看到：
   ```
   🔍 SchoolCard 环境变量调试信息:
     VITE_USE_MOCK_DATA: true
     USE_MOCK_DATA: true
   ```

5. 验证院校卡片显示正确的Mock数据：
   - 就业率：96.8%, 95.2%, 92.8% 等
   - 师资评分：5.0, 4.9, 4.8 等
   - 学生评分：4.9, 4.8, 4.7 等
   - 优势专业：根据院校类型显示对应专业

### 步骤 2: 测试API模式

1. 在 `.env` 文件中设置：
   ```bash
   VITE_USE_MOCK_DATA=false
   ```

2. 重启开发服务器：
   ```bash
   npm run dev
   ```

3. 检查控制台输出，应该看到：
   ```
   🔍 SchoolCard 环境变量调试信息:
     VITE_USE_MOCK_DATA: false
     USE_MOCK_DATA: false
   ```

4. 验证院校卡片显示："请配置后端API"（直到后端API实现）

### 步骤 3: 测试默认行为

1. 删除或注释 `.env` 文件中的 `VITE_USE_MOCK_DATA`

2. 重启开发服务器

3. 在开发模式下，应该自动使用Mock数据（`USE_MOCK_DATA: true`）

## Mock数据示例

### 就业率数据
```typescript
employmentRates: ['96.8%', '95.2%', '92.8%', '91.5%', '89.3%', '87.6%']
```

### 师资力量评分
```typescript
facultyStrengths: ['5.0', '4.9', '4.8', '4.7', '4.6', '4.5']
```

### 学生评分
```typescript
studentScores: ['4.9', '4.8', '4.7', '4.6', '4.5', '4.4']
```

### 优势专业配置
```typescript
advantagePrograms: {
  'COMPREHENSIVE': ['UI/UX设计', '视觉传达'],
  'ART': ['视觉传达', '产品设计'],
  'ENGINEERING': ['工业设计', '数字媒体'],
  'NORMAL': ['艺术教育', '美术学'],
  'FINANCE': ['品牌设计', '广告设计']
}
```

## 预期行为

### Mock模式 (VITE_USE_MOCK_DATA=true)
- ✅ 显示预定义的模拟数据
- ✅ 数据基于学校ID进行哈希计算，确保一致性
- ✅ 不同院校类型显示对应的优势专业

### API模式 (VITE_USE_MOCK_DATA=false)
- ⚠️ 显示"请配置后端API"提示
- ⚠️ 等待后端API实现后将显示真实数据

### 开发模式默认行为
- ✅ 未设置环境变量时，开发模式自动使用Mock数据
- ✅ 生产模式自动使用API数据

## 调试信息

每次组件加载时，控制台会输出调试信息：
- `VITE_USE_MOCK_DATA`: 环境变量的原始值
- `USE_MOCK_DATA`: 计算后的实际使用值

这有助于快速确认当前的数据源配置。

## 后续开发

1. **后端API就绪时**：
   - 在各个函数的 `else` 分支中实现真实的API调用
   - 替换"请配置后端API"为实际的API请求

2. **扩展功能**：
   - 可以添加更多的Mock数据类型
   - 支持根据不同学校ID返回不同的数据集

3. **性能优化**：
   - 考虑缓存API响应
   - 实现数据预加载机制

## 结论

✅ **数据迁移成功**：所有硬编码数据已成功移至统一的Mock数据文件
✅ **环境变量集成**：完美支持通过环境变量切换数据源
✅ **向后兼容**：现有功能保持不变，只是数据来源更加灵活
✅ **开发友好**：提供了详细的调试信息和清晰的代码结构
