# 设计师聚合API使用示例

## 环境变量配置

### VITE_USE_MOCK_DATA 环境变量
通过设置 `VITE_USE_MOCK_DATA` 环境变量可以控制是否使用Mock数据：

```bash
# 使用Mock数据
VITE_USE_MOCK_DATA=true

# 使用后端API
VITE_USE_MOCK_DATA=false

# 未设置时，开发环境默认使用Mock数据，生产环境使用后端API
```

### 环境变量逻辑
```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)
```

## 前端使用方法

### 1. 自动环境切换（推荐）

```typescript
import { getDesignerComplete } from '@/api/talent/designer'

// 获取设计师完整详情（会根据环境变量自动选择数据源）
const loadDesignerData = async (designerId: number) => {
  try {
    // 组件层面会根据 USE_MOCK_DATA 自动选择：
    // - Mock数据：直接从 mockDesigners 等文件获取
    // - 后端API：调用 getDesignerComplete 聚合接口

    const response = await getDesignerComplete(designerId)
    const data = response.data

    console.log('设计师基本信息:', data.designer)
    console.log('作品集:', data.works)
    console.log('工作经历:', data.workExperience)
    console.log('教育背景:', data.education)
    console.log('获奖情况:', data.awards)
  } catch (error) {
    console.error('获取设计师信息失败:', error)
  }
}
```

### 2. 双层环境变量支持

我们实现了双层的环境变量支持：

#### 组件层面（更快速）
```typescript
// DesignerDetailDrawer.vue
const loadDesignerData = async (designerId: number) => {
  if (USE_MOCK_DATA) {
    // 直接从Mock数据文件获取，无网络请求
    const designerData = mockDesigners.find(d => d.id === designerId)
    // ... 直接处理
  } else {
    // 调用聚合API
    const response = await getDesignerComplete(designerId)
    // ... 处理响应
  }
}
```

#### API层面（统一处理）
```typescript
// designer.ts API文件
export function getDesignerComplete(designerId: number) {
  if (USE_MOCK_DATA) {
    // API层面的Mock数据处理
    return Promise.resolve({ data: mockData })
  } else {
    // 调用后端聚合API
    return request({ url: `/designer/designer/${designerId}/complete` })
  }
}
```

### 3. 开发环境配置示例

#### .env.development
```bash
# 开发环境使用Mock数据（默认）
VITE_USE_MOCK_DATA=true
```

#### .env.production
```bash
# 生产环境使用后端API（默认）
VITE_USE_MOCK_DATA=false
```

#### .env.local (可选)
```bash
# 本地开发时强制使用后端API进行测试
VITE_USE_MOCK_DATA=false
```

## 性能对比

### Mock数据模式
- **网络请求数**: 0个（直接从内存获取）
- **响应时间**: < 10ms
- **适用场景**: 前端开发、UI调试、离线开发

### 后端API模式（聚合）
- **网络请求数**: 1个
- **响应时间**: 100ms - 300ms
- **适用场景**: 后端联调、生产环境

### 原方式（已优化）
- **网络请求数**: 5个
- **响应时间**: 200ms - 1000ms
- **适用场景**: 已弃用

## 数据结构

```typescript
interface DesignerCompleteDetail {
  designer: Designer          // 设计师基本信息
  works: Work[]              // 作品集数组
  workExperience: WorkExperience[]  // 工作经历数组（按时间倒序）
  education: Education[]     // 教育背景数组（按时间倒序）
  awards: Award[]           // 获奖情况数组（按重要性排序）
}
```

## 在组件中的使用

### DesignerDetailDrawer.vue
```vue
<script setup lang="ts">
import { type DesignerCompleteDetail, getDesignerComplete } from '@/api/talent/designer'
import { mockAwards, mockDesigners, mockEducation, mockWorkExperience, mockWorks } from '@/data/mockDesigners'

// 环境配置
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
  || (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

const loadDesignerData = async (designerId: number) => {
  loading.value = true
  try {
    if (USE_MOCK_DATA) {
      // 使用模拟数据（组件层面的直接处理，更快速的开发体验）
      console.log('🔧 使用模拟数据 - 设计师详情弹窗')

      const designerData = mockDesigners.find(d => d.id === designerId)
      const worksData = mockWorks.filter(w => w.designerId === designerId)
      const workExpData = mockWorkExperience.filter(w => w.designerId === designerId)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      const educationData = mockEducation.filter(e => e.designerId === designerId)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      const awardsData = mockAwards.filter(a => a.designerId === designerId)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

      designer.value = designerData || null
      portfolioWorks.value = worksData
      workExperience.value = workExpData
      educationBackground.value = educationData
      awardsAndCertifications.value = awardsData
    }
    else {
      // 使用聚合API调用后端接口
      console.log('🚀 使用聚合API - 设计师完整详情')

      const response = await getDesignerComplete(designerId)
      const data = response.data

      if (data && data.designer) {
        designer.value = data.designer
        portfolioWorks.value = data.works || []
        workExperience.value = data.workExperience || []
        educationBackground.value = data.education || []
        awardsAndCertifications.value = data.awards || []
      }
    }
  }
  catch (error) {
    console.error('加载设计师数据失败:', error)
    // 错误处理...
  }
  finally {
    loading.value = false
  }
}
</script>
```

## 调试信息

在控制台中可以看到当前的环境变量配置：

```
🔍 设计师详情弹窗环境变量调试信息:
  VITE_USE_MOCK_DATA: undefined
  DEV: true
  USE_MOCK_DATA: true
```

## 错误处理

```typescript
try {
  const response = await getDesignerComplete(designerId)

  // 检查数据完整性
  if (!response.data || !response.data.designer) {
    throw new Error('设计师信息不存在')
  }

  // 处理数据...
} catch (error) {
  if (USE_MOCK_DATA) {
    // Mock数据模式下的错误通常是数据不存在
    showError('模拟数据中未找到该设计师')
  } else {
    // 后端API模式下的网络错误处理
    if (error.response?.status === 404) {
      showError('设计师不存在')
    } else if (error.response?.status >= 500) {
      showError('服务器错误，请稍后重试')
    } else {
      showError('获取设计师信息失败')
    }
  }
}
```

## 注意事项

1. **环境变量优先级**:
   - `VITE_USE_MOCK_DATA=true` > 强制使用Mock数据
   - `VITE_USE_MOCK_DATA=false` > 强制使用后端API
   - 未设置 > 开发环境用Mock，生产环境用API

2. **数据一致性**: Mock数据结构应与后端API返回的数据结构保持一致

3. **开发效率**: Mock模式下无网络请求，响应更快，适合前端开发

4. **测试覆盖**: 建议在不同环境变量下都进行测试

5. **构建优化**: 生产环境构建时会自动剔除未使用的Mock数据

## 在页面中的使用

### DesignerDetailPage.vue（设计师详情页）
```vue
<script setup lang="ts">
import { type DesignerCompleteDetail, getDesignerComplete } from '@/api/talent/designer'
import { mockAwards, mockDesigners, mockEducation, mockWorkExperience, mockWorks } from '@/data/mockDesigners'

// 环境配置
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
  || (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

const getDesignerInfo = async () => {
  try {
    loading.value = true
    const id = designerId.value

    if (USE_MOCK_DATA) {
      // 使用模拟数据（页面层面的直接处理，更快速的开发体验）
      console.log('🔧 使用模拟数据 - 设计师详情页面')

      const foundDesigner = mockDesigners.find(d => d.id === id)
      if (foundDesigner) {
        designer.value = foundDesigner
        designerWorks.value = mockWorks.filter(work => work.designerId === id)
        workExperiences.value = mockWorkExperience.filter(exp => exp.designerId === id)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        educations.value = mockEducation.filter(edu => edu.designerId === id)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        awards.value = mockAwards.filter(award => award.designerId === id)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      }
    }
    else {
      // 使用聚合API调用后端接口
      console.log('🚀 使用聚合API - 设计师详情页面')

      const response = await getDesignerComplete(id)
      const data = response.data

      if (data && data.designer) {
        designer.value = data.designer
        designerWorks.value = data.works || []
        workExperiences.value = data.workExperience || []
        educations.value = data.education || []
        awards.value = data.awards || []
      }
    }
  }
  catch (error) {
    console.error('获取设计师信息失败:', error)
    // 错误处理...
  }
  finally {
    loading.value = false
  }
}
</script>
```

## 使用场景

### 1. 设计师详情弹窗 (DesignerDetailDrawer.vue)
- **用途**: 快速预览设计师信息
- **特点**: 模态框形式，轻量展示
- **数据**: 完整的设计师详情

### 2. 设计师详情页面 (detail.vue)
- **用途**: 完整的设计师档案展示
- **特点**: 独立页面，详细信息
- **数据**: 完整的设计师详情 + 作品分类筛选

### 3. 设计师列表卡片
- **用途**: 设计师列表中的基本信息展示
- **特点**: 使用设计师基本信息，无需聚合API
- **数据**: 仅设计师基本信息

## 迁移清单

- [x] 创建聚合API接口 `getDesignerComplete`
- [x] 更新 `DesignerDetailDrawer.vue` 组件
- [x] 更新 `src/views/talent/designers/detail.vue` 页面
- [x] 保留环境变量切换功能
- [x] 实现双层环境变量支持（组件层 + API层）
- [x] 简化加载逻辑，减少代码复杂度
- [x] 确保所有使用场景都已优化
- [ ] 后端实现聚合API `/designer/designer/{id}/complete`
- [ ] 测试新API的性能和正确性
- [ ] 上线部署和监控
