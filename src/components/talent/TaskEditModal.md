# TaskEditModal 任务编辑弹窗组件

## 功能概述

`TaskEditModal` 是仿照 `JobApplicationModal.vue` 创建的任务编辑弹窗组件，专为智图工厂任务系统设计。该组件支持创建和编辑任务，提供了完整的表单验证和用户友好的交互体验。

## 主要特性

### 📝 完整的表单功能
- **任务基本信息**：标题、描述、类型选择
- **预算管理**：快速预算范围选择 + 自定义预算输入
- **技能标签**：常用设计技能标签的快速选择
- **时间管理**：截止时间设置，自动验证不早于当前时间
- **交付条款**：交付物要求和付款条款设置
- **紧急标识**：紧急任务标记功能

### 🎨 优秀的用户体验
- **Glass Card 设计**：与整体系统保持一致的毛玻璃风格
- **响应式布局**：支持桌面端和移动端适配
- **实时表单验证**：输入时即时反馈，提交前完整验证
- **字符计数器**：描述和条款字段显示字符使用情况
- **智能预算选择**：预设常用预算范围，也支持自定义输入

### 🔧 技术实现
- **Vue 3 Composition API**：使用最新的 Vue 3 语法
- **TypeScript 支持**：完整的类型定义和类型安全
- **响应式数据管理**：使用 reactive 和 ref 进行状态管理
- **Props 监听**：自动同步外部传入的任务数据
- **事件发射**：通过 emit 与父组件通信

## 组件接口

### Props
```typescript
interface Props {
  visible: boolean        // 控制弹窗显示/隐藏
  task: SimpleTask | null // 要编辑的任务数据（null表示创建新任务）
  loading?: boolean       // 加载状态
}
```

### Events
```typescript
interface Emits {
  'update:visible': [value: boolean]  // 更新显示状态
  'submit': [formData: TaskFormData]  // 提交表单数据
}
```

### 数据类型
```typescript
interface TaskFormData {
  taskId?: number
  taskTitle: string
  taskDescription: string
  taskType: string
  skillTags: string[]
  budgetMin: number
  budgetMax: number
  deadline: string
  urgent: boolean
  deliverables: string
  paymentTerms: string
}
```

## 支持的任务类型

- `LOGO_DESIGN` - Logo设计
- `UI_UX_DESIGN` - UI/UX设计
- `GRAPHIC_DESIGN` - 平面设计
- `ILLUSTRATION` - 插画设计
- `BRAND_DESIGN` - 品牌设计

## 预设预算范围

- ¥500-1000 - 入门级项目
- ¥1000-3000 - 标准项目
- ¥3000-5000 - 中级项目
- ¥5000-10000 - 高级项目
- ¥10000+ - 专业级项目

## 常用技能标签

设计软件：`photoshop`, `illustrator`, `figma`, `sketch`, `indesign`, `after_effects`
设计技能：`creative_design`, `brand_design`, `ui_design`, `typography`, `color_theory`, `layout_design`

## 表单验证规则

### 必填字段
- ✅ 任务标题（最多50字符）
- ✅ 任务描述（最多2000字符）
- ✅ 任务类型
- ✅ 预算范围（最低预算 > 0，最高预算 >= 最低预算）
- ✅ 截止时间（不能早于当前时间）

### 可选字段
- 技能标签（多选）
- 交付物要求（最多500字符）
- 付款条款（最多300字符）
- 紧急任务标识

## 使用示例

```vue
<template>
  <div>
    <!-- 触发按钮 -->
    <button @click="showEditModal = true">
      {{ editingTask ? '编辑任务' : '创建任务' }}
    </button>

    <!-- 任务编辑弹窗 -->
    <TaskEditModal
      v-model:visible="showEditModal"
      :task="editingTask"
      @submit="handleTaskSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TaskEditModal } from '@/components/talent'
import { enterpriseTaskApi } from '@/api/talent/task'
import { useMessage } from 'naive-ui'

const message = useMessage()
const showEditModal = ref(false)
const editingTask = ref(null)

const handleTaskSubmit = async (formData) => {
  try {
    if (formData.taskId) {
      // 更新任务
      await enterpriseTaskApi.update(formData.taskId, {
        ...formData,
        skillTags: JSON.stringify(formData.skillTags)
      })
      message.success('任务更新成功')
    } else {
      // 创建任务
      await enterpriseTaskApi.create({
        ...formData,
        skillTags: JSON.stringify(formData.skillTags)
      })
      message.success('任务创建成功')
    }
    showEditModal.value = false
  } catch (error) {
    message.error('操作失败，请稍后重试')
  }
}
</script>
```

## API 集成

组件与以下 API 接口配合使用：

### 企业任务管理
- **创建任务**：`enterpriseTaskApi.create()` → `POST /designer/enterprise/tasks`
- **更新任务**：`enterpriseTaskApi.update()` → `PUT /designer/enterprise/tasks/{id}`

### 数据格式转换
- **技能标签**：前端数组 → JSON字符串存储
- **截止时间**：前端 datetime-local → ISO字符串
- **预算**：数字类型，支持小数

## 样式特性

- **主题色彩**：使用 `#0a84ff` 作为主色调
- **Glass Card 效果**：毛玻璃背景，与系统整体风格一致
- **响应式设计**：在不同屏幕尺寸下自适应布局
- **过渡动画**：平滑的显示/隐藏动画效果
- **焦点状态**：清晰的表单字段焦点反馈

## 依赖项

- Vue 3
- Naive UI (useMessage)
- @/styles/talent.css
- @/data/mockTasks (类型定义)

## 注意事项

1. **权限控制**：该组件主要面向企业管理员使用
2. **数据同步**：通过 watch 监听 props.task 变化，自动同步表单数据
3. **表单重置**：关闭弹窗时自动重置表单状态
4. **类型安全**：全程使用 TypeScript 保证类型安全
5. **错误处理**：内置基础表单验证和错误提示

## 扩展性

组件设计时考虑了扩展性：
- 可以轻松添加新的任务类型
- 可以扩展技能标签库
- 可以调整预算范围选项
- 可以添加更多表单字段
- 可以自定义验证规则
