# 智图工厂设计指南

## 📋 概述

本文档详细对比了企业需求池与智图工厂页面的差异，并提供了完整的页面设计、接口设计、数据结构建议。

## 🎯 功能对比分析

### 核心差异总结

| 维度 | 企业需求池 | 智图工厂 |
|------|-----------|----------|
| **业务模式** | 长期雇佣关系 | 短期项目合作 |
| **主要用户** | 企业 + 求职者 | 客户 + 设计师 |
| **内容类型** | 职位招聘信息 | 项目任务需求 |
| **时间周期** | 长期（月/年） | 短期（天/周） |
| **价格模式** | 月薪/年薪 | 项目价格 |
| **工作流程** | 投递→面试→入职 | 申请→执行→交付→结算 |
| **关键指标** | 薪资、经验、学历 | 价格、技能、截止时间 |
| **交付物** | 无明确交付物 | 明确的设计成果 |

### 用户流程对比

#### 企业需求池流程
```
企业发布职位 → 设计师浏览职位 → 投递简历 → 企业筛选 →
面试沟通 → 录用决定 → 入职手续 → 长期合作
```

#### 智图工厂流程
```
客户发布任务 → 设计师浏览任务 → 申请任务 → 客户选择 →
签约确认 → 执行任务 → 提交成果 → 验收确认 → 支付结算
```

## 📊 数据结构设计

### 核心实体对比

#### 企业需求池：JobPosting
- 关注薪资范围、工作地点、经验要求
- 长期有效，重复招聘
- 关联企业信息

#### 智图工厂：Task
- 关注项目价格、截止时间、技能要求
- 短期项目，一次性完成
- 关联客户信息

### 新增数据结构

#### 1. 任务管理 (Task)
```typescript
interface Task {
  id: number
  title: string
  description: string
  price: number
  deadline: string
  urgent: boolean
  client: string
  taskType: TaskType
  status: TaskStatus
  deliverables: string // 交付物要求
  paymentTerms: string // 付款条款
  // ... 其他字段
}
```

#### 2. 客户管理 (Client)
```typescript
interface Client {
  id: number
  clientName: string
  companyName?: string
  rating?: number
  completedTasks?: number
  totalSpent?: number
  // ... 其他字段
}
```

#### 3. 任务申请 (TaskApplication)
```typescript
interface TaskApplication {
  id: number
  taskId: number
  designerId: number
  proposal: string
  proposedPrice?: number
  status: ApplicationStatus
  // ... 其他字段
}
```

#### 4. 任务交付 (TaskDeliverable)
```typescript
interface TaskDeliverable {
  id: number
  taskId: number
  designerId: number
  fileUrl: string
  version: number
  status: DeliverableStatus
  // ... 其他字段
}
```

#### 5. 支付管理 (Payment)
```typescript
interface Payment {
  id: number
  taskId: number
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  // ... 其他字段
}
```

## 🚀 API接口设计

### 接口架构对比

#### 企业需求池 API
- `/designer/job/*` - 职位管理
- `/designer/enterprise/*` - 企业管理
- 重点关注招聘流程

#### 智图工厂 API
- `/task/task/*` - 任务管理
- `/task/client/*` - 客户管理
- `/task/application/*` - 申请管理
- `/task/deliverable/*` - 交付管理
- `/task/payment/*` - 支付管理
- `/task/matching/*` - 智能匹配
- `/task/stats/*` - 统计分析

### 核心API接口

#### 1. 任务管理接口
```typescript
// 任务列表
GET /task/task/list
// 任务详情
GET /task/task/{id}
// 创建任务
POST /task/task
// 更新任务
PUT /task/task
// 删除任务
DELETE /task/task/{ids}
// 发布任务
POST /task/task/{id}/publish
// 取消任务
POST /task/task/{id}/cancel
// 完成任务
POST /task/task/{id}/complete
```

#### 2. 申请管理接口
```typescript
// 申请列表
GET /task/application/list
// 提交申请
POST /task/application
// 审核申请
POST /task/application/{id}/review
// 撤回申请
POST /task/application/{id}/withdraw
```

#### 3. 交付管理接口
```typescript
// 交付列表
GET /task/deliverable/list
// 提交交付物
POST /task/deliverable
// 审核交付物
POST /task/deliverable/{id}/review
// 请求修改
POST /task/deliverable/{id}/request-revision
```

#### 4. 支付管理接口
```typescript
// 支付记录
GET /task/payment/list
// 创建支付订单
POST /task/payment/create-order
// 确认支付
POST /task/payment/{id}/confirm
// 申请退款
POST /task/payment/{id}/refund
```

#### 5. 智能匹配接口
```typescript
// 获取任务匹配推荐
POST /task/matching/tasks
// 获取设计师匹配推荐
GET /task/matching/designers
// 更新匹配偏好
POST /task/matching/preferences
```

## 🎨 页面设计建议

### 1. 页面布局优化

#### 标签导航重构
```typescript
const tabs = [
  { id: 'marketplace', name: '任务广场', icon: 'ri-store-line' },
  { id: 'my-tasks', name: '我的任务', icon: 'ri-task-line' },
  { id: 'matching', name: '智能匹配', icon: 'ri-magic-line' },
  { id: 'payment', name: '支付中心', icon: 'ri-wallet-line' },
  { id: 'analytics', name: '数据分析', icon: 'ri-bar-chart-line' }, // 新增
]
```

#### 筛选条件优化
- **任务类型**: 更细分的设计类型
- **价格范围**: 双端滑块，更精确的价格筛选
- **截止时间**: 按紧急程度筛选
- **客户评级**: 按客户信誉筛选
- **技能匹配**: 智能技能匹配

### 2. 任务卡片设计

#### 关键信息展示
```typescript
interface TaskCard {
  // 基础信息
  title: string
  client: string
  price: number
  deadline: string

  // 任务特性
  taskType: string
  urgent: boolean
  applications: number

  // 技能要求
  skills: string[]

  // 状态信息
  status: TaskStatus
  publishDate: string
}
```

#### 视觉设计要点
- 突出价格和截止时间
- 清晰的任务状态标识
- 客户信誉评级显示
- 技能标签分类着色

### 3. 功能模块设计

#### 任务广场
- 任务列表展示
- 高级筛选功能
- 智能推荐算法
- 快速申请流程

#### 我的任务
- 任务状态管理
- 进度跟踪
- 交付物管理
- 沟通记录

#### 智能匹配
- 个人技能档案
- 匹配度评分
- 推荐任务列表
- 偏好设置

#### 支付中心
- 账户余额管理
- 交易记录查询
- 收入统计分析
- 提现功能

#### 数据分析（新增）
- 任务完成统计
- 收入趋势分析
- 技能评分报告
- 市场行情分析

## 🔧 技术实现建议

### 1. 组件化设计

#### 任务相关组件
- `TaskCard.vue` - 任务卡片
- `TaskDetailModal.vue` - 任务详情弹窗
- `TaskApplicationModal.vue` - 申请任务弹窗
- `TaskDeliverableModal.vue` - 交付物管理弹窗
- `TaskProgressTracker.vue` - 进度跟踪组件

#### 支付相关组件
- `PaymentModal.vue` - 支付弹窗
- `PaymentRecordTable.vue` - 支付记录表格
- `BalanceCard.vue` - 余额卡片
- `WithdrawModal.vue` - 提现弹窗

### 2. 状态管理

#### Composables
- `useTask.ts` - 任务管理
- `useTaskApplication.ts` - 申请管理
- `usePayment.ts` - 支付管理
- `useTaskStats.ts` - 统计分析

#### Store
- `taskStore.ts` - 任务状态管理
- `paymentStore.ts` - 支付状态管理
- `notificationStore.ts` - 通知管理

### 3. 性能优化

#### 列表虚拟化
- 大量任务列表的虚拟滚动
- 图片懒加载
- 搜索防抖

#### 缓存策略
- 任务列表缓存
- 用户信息缓存
- 静态资源缓存

## 📱 移动端适配

### 1. 响应式设计
- 断点设计：`sm: 640px`, `md: 768px`, `lg: 1024px`
- 移动端优先的设计理念
- 触摸友好的交互设计

### 2. 手势交互
- 滑动切换标签
- 下拉刷新
- 上拉加载更多
- 长按操作菜单

### 3. 性能优化
- 图片压缩和适配
- 组件懒加载
- 路由懒加载
- 代码分割

## 🔐 安全性考虑

### 1. 数据安全
- 文件上传安全检查
- 支付信息加密
- 个人隐私保护

### 2. 权限控制
- 任务访问权限
- 文件下载权限
- 支付操作权限

### 3. 风控措施
- 异常操作监控
- 防刷机制
- 账户安全验证

## 📈 数据分析

### 1. 业务指标
- 任务发布数量
- 任务完成率
- 平均任务价格
- 用户活跃度

### 2. 用户行为分析
- 任务浏览路径
- 申请转化率
- 交付及时率
- 用户满意度

### 3. 平台运营
- 收入统计
- 佣金分析
- 用户增长
- 市场趋势

### 3. 用户绑定系统扩展

基于现有的 `des_user_binding` 表，新增客户角色支持：

```sql
-- 扩展用户绑定表以支持客户角色
-- 在现有 entity_type 枚举中新增 'client' 类型

-- 新增客户角色
INSERT INTO `sys_role` (`role_id`, `role_name`, `role_key`, `role_sort`, `data_scope`, `menu_check_strictly`, `dept_check_strictly`, `status`, `del_flag`, `create_by`, `create_time`, `remark`) VALUES
(1932319128081666053, '客户', 'client', 4, '5', b'1', b'1', '0', '0', 1, now(), '智图工厂客户角色');

-- 客户注册和绑定的支持
```

### 4. 数据字典扩展

```sql
-- 任务类型字典
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `remark`) VALUES
(LAST_INSERT_ID(), '任务类型', 'task_type', '0', 1, now(), '智图工厂任务类型');

-- 任务类型数据
INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `remark`) VALUES
(LAST_INSERT_ID(), 1, 'LOGO设计', 'LOGO_DESIGN', 'task_type', '', 'primary', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+1, 2, 'UI/UX设计', 'UI_UX_DESIGN', 'task_type', '', 'success', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+2, 3, '平面设计', 'GRAPHIC_DESIGN', 'task_type', '', 'info', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+3, 4, '插画设计', 'ILLUSTRATION', 'task_type', '', 'warning', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+4, 5, '品牌设计', 'BRAND_DESIGN', 'task_type', '', 'danger', 'N', '0', 1, now(), '');

-- 任务状态字典
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `remark`) VALUES
(LAST_INSERT_ID(), '任务状态', 'task_status', '0', 1, now(), '智图工厂任务状态');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `remark`) VALUES
(LAST_INSERT_ID(), 1, '草稿', 'DRAFT', 'task_status', '', 'info', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+1, 2, '已发布', 'PUBLISHED', 'task_status', '', 'primary', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+2, 3, '进行中', 'IN_PROGRESS', 'task_status', '', 'warning', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+3, 4, '已完成', 'COMPLETED', 'task_status', '', 'success', 'N', '0', 1, now(), ''),
(LAST_INSERT_ID()+4, 5, '已取消', 'CANCELLED', 'task_status', '', 'danger', 'N', '0', 1, now(), '');
```

## 🚀 实施建议

### 1. 开发优先级
1. **核心功能**: 任务发布、申请、交付
2. **支付系统**: 订单创建、支付确认、资金结算
3. **智能匹配**: 推荐算法、偏好设置
4. **数据分析**: 统计报表、趋势分析

### 2. 技术迁移
1. 复用现有的用户管理、权限系统
2. 扩展现有的文件上传功能
3. 集成支付网关
4. 优化搜索和筛选性能

### 3. 测试策略
1. 单元测试覆盖率 > 80%
2. 端到端测试关键流程
3. 性能测试和压力测试
4. 安全性测试

## 📚 总结

智图工厂相比企业需求池，具有更复杂的业务流程和更丰富的功能模块。通过合理的架构设计、完善的接口规范和优秀的用户体验，可以打造出一个高效、安全、易用的设计任务平台。

关键成功要素：
1. **清晰的业务流程**：从任务发布到最终结算的完整闭环
2. **智能匹配算法**：提高任务和设计师的匹配效率
3. **安全的支付系统**：保障资金安全和交易可靠
4. **丰富的数据分析**：为用户和平台提供决策支持
5. **优秀的用户体验**：简洁直观的界面和流畅的操作体验

通过以上设计和实施建议，智图工厂将能够为设计师和客户提供一个专业、高效的任务协作平台。

## 🎨 前端组件架构设计

### 1. 组件复用策略

基于现有的组件体系，智图工厂将最大程度复用已有组件：

#### 复用现有通用组件
```typescript
// 复用 src/components/common/ 下的组件
import { HoverButton } from '@/components/common/HoverButton'
import { IconSvg } from '@/components/common/IconSvg'
import { SkillTag } from '@/components/common/SkillTag'
import { SkillTagList } from '@/components/common/SkillTagList'
import { SkillTagSelector } from '@/components/common/SkillTagSelector'
import { UserAvatar } from '@/components/common/UserAvatar'
import { UserMenu } from '@/components/common/UserMenu'

// 复用现有的表单验证和布局组件
import { NaiveProvider } from '@/components/common/NaiveProvider'
```

#### 扩展现有组件
```typescript
// 扩展 SkillTag 组件以支持任务类型标签
interface TaskTypeTagProps {
  taskType: string
  size?: 'small' | 'medium' | 'large'
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger'
}

// 扩展 UserAvatar 组件以支持客户头像
interface ClientAvatarProps extends UserAvatarProps {
  verificationStatus?: 'verified' | 'unverified'
  showBadge?: boolean
}
```

### 2. 智图工厂专用组件设计

```vue
<!-- 新增任务相关组件 -->
<!-- src/components/task/ -->

<!-- TaskCard.vue - 任务卡片组件 -->
<template>
  <div class="task-card" :class="{ urgent: task.urgent }">
    <div class="task-header">
      <h3 class="task-title">{{ task.taskTitle }}</h3>
      <div class="task-meta">
        <SkillTag v-for="tag in task.skillTags" :key="tag" :tag="tag" />
        <span v-if="task.urgent" class="urgent-badge">紧急</span>
      </div>
    </div>

    <div class="task-content">
      <p class="task-description">{{ task.taskDescription }}</p>
      <div class="task-details">
        <div class="budget">
          <IconSvg name="ri-money-dollar-circle-line" />
          <span>¥{{ task.budgetMin }} - ¥{{ task.budgetMax }}</span>
        </div>
        <div class="deadline">
          <IconSvg name="ri-time-line" />
          <span>{{ formatDeadline(task.deadline) }}</span>
        </div>
      </div>
    </div>

    <div class="task-footer">
      <div class="client-info">
        <ClientAvatar :client="task.client" size="small" />
        <span class="client-name">{{ task.clientName }}</span>
        <div class="client-rating">
          <IconSvg name="ri-star-fill" />
          <span>{{ task.clientRating }}</span>
        </div>
      </div>
      <div class="task-actions">
        <HoverButton @click="viewDetails">查看详情</HoverButton>
        <HoverButton v-if="canApply" type="primary" @click="applyTask">
          立即申请
        </HoverButton>
      </div>
    </div>
  </div>
</template>

<!-- TaskDetailModal.vue - 任务详情弹窗 -->
<template>
  <NModal v-model:show="visible" :mask-closable="false" preset="card"
          style="width: 900px; max-height: 80vh">
    <template #header>
      <div class="task-detail-header">
        <h2>{{ task.taskTitle }}</h2>
        <div class="task-status-badge" :class="task.status">
          {{ getStatusText(task.status) }}
        </div>
      </div>
    </template>

    <div class="task-detail-content">
      <!-- 任务基本信息 -->
      <div class="task-basic-info">
        <div class="info-row">
          <label>任务类型：</label>
          <SkillTag :tag="task.taskType" />
        </div>
        <div class="info-row">
          <label>预算范围：</label>
          <span class="budget">¥{{ task.budgetMin }} - ¥{{ task.budgetMax }}</span>
        </div>
        <div class="info-row">
          <label>截止时间：</label>
          <span>{{ formatDeadline(task.deadline) }}</span>
        </div>
        <div class="info-row">
          <label>技能要求：</label>
          <SkillTagList :tags="task.skillTags" />
        </div>
      </div>

      <!-- 任务描述 -->
      <div class="task-description">
        <h3>任务描述</h3>
        <div v-html="task.taskDescription"></div>
      </div>

      <!-- 交付要求 -->
      <div class="task-deliverables">
        <h3>交付要求</h3>
        <div v-html="task.deliverables"></div>
      </div>

      <!-- 客户信息 -->
      <div class="client-section">
        <h3>客户信息</h3>
        <ClientCard :client="task.client" />
      </div>

      <!-- 申请列表（仅客户可见） -->
      <div v-if="isClient" class="applications-section">
        <h3>申请列表 ({{ task.applications }})</h3>
        <TaskApplicationList :applications="task.applicationList"
                           @process="handleProcessApplication" />
      </div>

      <!-- 交付物列表 -->
      <div v-if="task.deliverableList?.length" class="deliverables-section">
        <h3>交付物</h3>
        <TaskDeliverableList :deliverables="task.deliverableList"
                           @review="handleReviewDeliverable" />
      </div>
    </div>

    <template #action>
      <div class="task-detail-actions">
        <NButton v-if="canFavorite" @click="toggleFavorite">
          <IconSvg :name="isFavorited ? 'ri-heart-fill' : 'ri-heart-line'" />
          {{ isFavorited ? '取消收藏' : '收藏任务' }}
        </NButton>
        <NButton v-if="canApply" type="primary" @click="openApplyModal">
          申请任务
        </NButton>
        <NButton v-if="canEdit" @click="editTask">编辑任务</NButton>
      </div>
    </template>
  </NModal>

  <!-- 申请任务弹窗 -->
  <TaskApplicationModal v-model:show="showApplyModal"
                       :task="task"
                       @success="handleApplySuccess" />
</template>

<!-- TaskApplicationModal.vue - 申请任务弹窗 -->
<template>
  <NModal v-model:show="visible" preset="card" style="width: 600px">
    <template #header>申请任务</template>

    <NForm ref="formRef" :model="form" :rules="rules">
      <NFormItem label="申请提案" path="proposal">
        <NInput v-model:value="form.proposal"
                type="textarea"
                :rows="4"
                placeholder="请详细说明您的设计思路和执行方案..." />
      </NFormItem>

      <NFormItem label="报价金额" path="proposedPrice">
        <NInputNumber v-model:value="form.proposedPrice"
                     :min="0"
                     :precision="2"
                     placeholder="请输入您的报价"
                     style="width: 100%" />
      </NFormItem>

      <NFormItem label="预计完成时间" path="estimatedDays">
        <NInputNumber v-model:value="form.estimatedDays"
                     :min="1"
                     placeholder="预计完成天数"
                     style="width: 100%" />
      </NFormItem>

      <NFormItem label="相关作品链接">
        <div class="portfolio-links">
          <NInput v-for="(link, index) in form.portfolioLinks"
                  :key="index"
                  v-model:value="form.portfolioLinks[index]"
                  placeholder="请输入相关作品链接"
                  style="margin-bottom: 8px" />
          <NButton @click="addPortfolioLink" dashed block>
            <IconSvg name="ri-add-line" />
            添加作品链接
          </NButton>
        </div>
      </NFormItem>
    </NForm>

    <template #action>
      <NSpace>
        <NButton @click="visible = false">取消</NButton>
        <NButton type="primary" @click="submitApplication">提交申请</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<!-- ClientCard.vue - 客户信息卡片 -->
<template>
  <div class="client-card">
    <div class="client-header">
      <ClientAvatar :client="client" :show-badge="true" />
      <div class="client-info">
        <h4 class="client-name">{{ client.clientName }}</h4>
        <p v-if="client.companyName" class="company-name">{{ client.companyName }}</p>
        <div class="client-meta">
          <span class="rating">
            <IconSvg name="ri-star-fill" />
            {{ client.rating }}
          </span>
          <span class="tasks-count">已完成 {{ client.completedTasks }} 个任务</span>
        </div>
      </div>
    </div>

    <div v-if="client.description" class="client-description">
      {{ client.description }}
    </div>

    <div class="client-stats">
      <div class="stat-item">
        <label>发布任务：</label>
        <span>{{ client.totalTasks }}</span>
      </div>
      <div class="stat-item">
        <label>总消费：</label>
        <span>¥{{ client.totalSpent }}</span>
      </div>
      <div class="stat-item">
        <label>认证状态：</label>
        <span :class="client.verificationStatus">
          {{ getVerificationText(client.verificationStatus) }}
        </span>
      </div>
    </div>
  </div>
</template>

<!-- TaskFilter.vue - 任务筛选组件 -->
<template>
  <div class="task-filter">
    <div class="filter-section">
      <label>任务类型：</label>
      <NSelect v-model:value="filters.taskType"
               :options="taskTypeOptions"
               placeholder="选择任务类型"
               clearable />
    </div>

    <div class="filter-section">
      <label>预算范围：</label>
      <div class="budget-range">
        <NInputNumber v-model:value="filters.budgetMin"
                     placeholder="最低预算"
                     :min="0" />
        <span class="range-separator">-</span>
        <NInputNumber v-model:value="filters.budgetMax"
                     placeholder="最高预算"
                     :min="0" />
      </div>
    </div>

    <div class="filter-section">
      <label>技能要求：</label>
      <SkillTagSelector v-model:selected="filters.skillTags"
                       :options="skillOptions"
                       multiple />
    </div>

    <div class="filter-section">
      <label>截止时间：</label>
      <NSelect v-model:value="filters.deadlineFilter"
               :options="deadlineOptions"
               placeholder="选择时间范围" />
    </div>

    <div class="filter-section">
      <label>其他：</label>
      <NSpace>
        <NCheckbox v-model:checked="filters.urgentOnly">仅显示紧急任务</NCheckbox>
        <NCheckbox v-model:checked="filters.verifiedClientsOnly">仅显示认证客户</NCheckbox>
      </NSpace>
    </div>

    <div class="filter-actions">
      <NButton @click="resetFilters">重置</NButton>
      <NButton type="primary" @click="applyFilters">应用筛选</NButton>
    </div>
  </div>
</template>
```

### 3. 页面结构设计

```typescript
// 智图工厂页面结构（复用现有路由和布局模式）

// src/views/task/
export const taskRoutes = [
  {
    path: '/task',
    name: 'Task',
    component: () => import('@/views/task/layout.vue'),
    meta: { title: '智图工厂' },
    children: [
      {
        path: '',
        redirect: '/task/marketplace'
      },
      {
        path: 'marketplace',
        name: 'TaskMarketplace',
        component: () => import('@/views/task/marketplace/index.vue'),
        meta: { title: '任务广场', requiresAuth: true }
      },
      {
        path: 'my-tasks',
        name: 'MyTasks',
        component: () => import('@/views/task/my-tasks/index.vue'),
        meta: { title: '我的任务', requiresAuth: true }
      },
      {
        path: 'applications',
        name: 'TaskApplications',
        component: () => import('@/views/task/applications/index.vue'),
        meta: { title: '任务申请', requiresAuth: true }
      },
      {
        path: 'deliverables',
        name: 'TaskDeliverables',
        component: () => import('@/views/task/deliverables/index.vue'),
        meta: { title: '交付管理', requiresAuth: true }
      },
      {
        path: 'payments',
        name: 'TaskPayments',
        component: () => import('@/views/task/payments/index.vue'),
        meta: { title: '支付中心', requiresAuth: true }
      },
      {
        path: 'matching',
        name: 'TaskMatching',
        component: () => import('@/views/task/matching/index.vue'),
        meta: { title: '智能匹配', requiresAuth: true }
      },
      {
        path: 'analytics',
        name: 'TaskAnalytics',
        component: () => import('@/views/task/analytics/index.vue'),
        meta: { title: '数据分析', requiresAuth: true }
      },
      {
        path: 'client-center',
        name: 'ClientCenter',
        component: () => import('@/views/task/client-center/index.vue'),
        meta: { title: '客户中心', requiresAuth: true, roles: ['client'] }
      }
    ]
  }
]

// 主布局页面 - src/views/task/layout.vue
<template>
  <div class="task-layout">
    <div class="task-header">
      <h1 class="module-title">智图工厂</h1>
      <div class="header-actions">
        <UserMenu />
      </div>
    </div>

    <div class="task-nav">
      <NTabs v-model:value="activeTab" type="segment" @update:value="handleTabChange">
        <NTab name="marketplace" tab="任务广场">
          <template #suffix>
            <IconSvg name="ri-store-line" />
          </template>
        </NTab>
        <NTab name="my-tasks" tab="我的任务">
          <template #suffix>
            <IconSvg name="ri-task-line" />
          </template>
        </NTab>
        <NTab name="applications" tab="申请管理">
          <template #suffix>
            <IconSvg name="ri-file-list-line" />
          </template>
        </NTab>
        <NTab name="deliverables" tab="交付管理">
          <template #suffix>
            <IconSvg name="ri-upload-cloud-line" />
          </template>
        </NTab>
        <NTab name="payments" tab="支付中心">
          <template #suffix>
            <IconSvg name="ri-wallet-line" />
          </template>
        </NTab>
        <NTab name="matching" tab="智能匹配">
          <template #suffix>
            <IconSvg name="ri-magic-line" />
          </template>
        </NTab>
        <NTab v-if="isAdmin" name="analytics" tab="数据分析">
          <template #suffix>
            <IconSvg name="ri-bar-chart-line" />
          </template>
        </NTab>
      </NTabs>
    </div>

    <div class="task-content">
      <RouterView />
    </div>
  </div>
</template>
```

### 4. 状态管理设计

```typescript
// src/composables/task/ - 复用现有Composables模式

// useTask.ts - 任务管理组合式函数
export function useTask() {
  const taskList = ref<TaskVo[]>([])
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    pageSize: 20,
    total: 0
  })

  // 查询任务列表
  const fetchTaskList = async (params?: TaskQueryParams) => {
    loading.value = true
    try {
      const response = await api.task.getTaskList({
        pageNum: pagination.value.current,
        pageSize: pagination.value.pageSize,
        ...params
      })
      taskList.value = response.data.rows
      pagination.value.total = response.data.total
    } catch (error) {
      console.error('查询任务列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 申请任务
  const applyTask = async (applicationData: TaskApplicationForm) => {
    try {
      await api.task.applyTask(applicationData)
      message.success('申请提交成功')
      return true
    } catch (error) {
      message.error('申请提交失败')
      return false
    }
  }

  // 收藏任务
  const toggleFavorite = async (taskId: number, isFavorited: boolean) => {
    try {
      if (isFavorited) {
        await api.task.unfavoriteTask(taskId)
        message.success('取消收藏成功')
      } else {
        await api.task.favoriteTask(taskId)
        message.success('收藏成功')
      }
      return !isFavorited
    } catch (error) {
      message.error('操作失败')
      return isFavorited
    }
  }

  return {
    taskList: readonly(taskList),
    loading: readonly(loading),
    pagination,
    fetchTaskList,
    applyTask,
    toggleFavorite
  }
}

// useTaskApplication.ts - 申请管理组合式函数
export function useTaskApplication() {
  const applicationList = ref<TaskApplicationVo[]>([])
  const loading = ref(false)

  // 查询申请列表
  const fetchApplicationList = async (params?: ApplicationQueryParams) => {
    loading.value = true
    try {
      const response = await api.task.getApplicationList(params)
      applicationList.value = response.data.rows
    } catch (error) {
      console.error('查询申请列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 处理申请
  const processApplication = async (applicationId: number, action: 'accept' | 'reject', feedback?: string) => {
    try {
      await api.task.processApplication({
        applicationId,
        action,
        feedback
      })
      message.success(action === 'accept' ? '申请已接受' : '申请已拒绝')
      return true
    } catch (error) {
      message.error('处理申请失败')
      return false
    }
  }

  // 撤回申请
  const withdrawApplication = async (applicationId: number) => {
    try {
      await api.task.withdrawApplication(applicationId)
      message.success('申请已撤回')
      return true
    } catch (error) {
      message.error('撤回申请失败')
      return false
    }
  }

  return {
    applicationList: readonly(applicationList),
    loading: readonly(loading),
    fetchApplicationList,
    processApplication,
    withdrawApplication
  }
}

// useTaskPayment.ts - 支付管理组合式函数
export function useTaskPayment() {
  const paymentList = ref<TaskPaymentVo[]>([])
  const balance = ref(0)
  const earnings = ref({
    total: 0,
    thisMonth: 0,
    pending: 0
  })

  // 查询支付记录
  const fetchPaymentList = async (params?: PaymentQueryParams) => {
    try {
      const response = await api.task.getPaymentList(params)
      paymentList.value = response.data.rows
    } catch (error) {
      console.error('查询支付记录失败:', error)
    }
  }

  // 创建支付订单
  const createPaymentOrder = async (taskId: number, amount: number) => {
    try {
      const response = await api.task.createPaymentOrder({
        taskId,
        amount
      })
      return response.data
    } catch (error) {
      message.error('创建支付订单失败')
      throw error
    }
  }

  // 确认支付
  const confirmPayment = async (paymentId: number) => {
    try {
      await api.task.confirmPayment(paymentId)
      message.success('支付确认成功')
      return true
    } catch (error) {
      message.error('支付确认失败')
      return false
    }
  }

  // 申请提现
  const requestWithdraw = async (amount: number) => {
    try {
      await api.task.requestWithdraw({ amount })
      message.success('提现申请已提交')
      return true
    } catch (error) {
      message.error('提现申请失败')
      return false
    }
  }

  return {
    paymentList: readonly(paymentList),
    balance: readonly(balance),
    earnings: readonly(earnings),
    fetchPaymentList,
    createPaymentOrder,
    confirmPayment,
    requestWithdraw
  }
}

// src/stores/task/ - 复用现有Store模式

// taskStore.ts - 任务状态管理
export const useTaskStore = defineStore('task', () => {
  const currentTask = ref<TaskDetailVo | null>(null)
  const favoriteTaskIds = ref<Set<number>>(new Set())
  const filters = ref<TaskFilterParams>({
    taskType: '',
    budgetMin: 0,
    budgetMax: 0,
    skillTags: [],
    deadlineFilter: '',
    urgentOnly: false,
    verifiedClientsOnly: false
  })

  // 设置当前任务
  const setCurrentTask = (task: TaskDetailVo) => {
    currentTask.value = task
  }

  // 更新筛选条件
  const updateFilters = (newFilters: Partial<TaskFilterParams>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      taskType: '',
      budgetMin: 0,
      budgetMax: 0,
      skillTags: [],
      deadlineFilter: '',
      urgentOnly: false,
      verifiedClientsOnly: false
    }
  }

  // 加载收藏任务
  const loadFavoriteTaskIds = async () => {
    try {
      const response = await api.task.getFavoriteTasks()
      favoriteTaskIds.value = new Set(response.data.map(task => task.taskId))
    } catch (error) {
      console.error('加载收藏任务失败:', error)
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (taskId: number) => {
    const isFavorited = favoriteTaskIds.value.has(taskId)
    try {
      if (isFavorited) {
        await api.task.unfavoriteTask(taskId)
        favoriteTaskIds.value.delete(taskId)
      } else {
        await api.task.favoriteTask(taskId)
        favoriteTaskIds.value.add(taskId)
      }
      return !isFavorited
    } catch (error) {
      throw error
    }
  }

  return {
    currentTask: readonly(currentTask),
    favoriteTaskIds: readonly(favoriteTaskIds),
    filters: readonly(filters),
    setCurrentTask,
    updateFilters,
    resetFilters,
    loadFavoriteTaskIds,
    toggleFavorite
  }
})
```

### 5. 工具函数复用

```typescript
// src/utils/taskUtils.ts - 任务相关工具函数

// 复用现有的statusUtils模式
export const taskStatusUtils = {
  getStatusText(status: string): string {
    const statusMap = {
      'DRAFT': '草稿',
      'PUBLISHED': '已发布',
      'IN_PROGRESS': '进行中',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消'
    }
    return statusMap[status] || status
  },

  getStatusColor(status: string): string {
    const colorMap = {
      'DRAFT': 'info',
      'PUBLISHED': 'primary',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'success',
      'CANCELLED': 'danger'
    }
    return colorMap[status] || 'default'
  }
}

// 复用现有的skillTagUtils
export const taskTypeUtils = {
  getTaskTypeText(taskType: string): string {
    const typeMap = {
      'LOGO_DESIGN': 'LOGO设计',
      'UI_UX_DESIGN': 'UI/UX设计',
      'GRAPHIC_DESIGN': '平面设计',
      'ILLUSTRATION': '插画设计',
      'BRAND_DESIGN': '品牌设计'
    }
    return typeMap[taskType] || taskType
  },

  getTaskTypeColor(taskType: string): string {
    const colorMap = {
      'LOGO_DESIGN': 'primary',
      'UI_UX_DESIGN': 'success',
      'GRAPHIC_DESIGN': 'info',
      'ILLUSTRATION': 'warning',
      'BRAND_DESIGN': 'danger'
    }
    return colorMap[taskType] || 'default'
  }
}

// 价格格式化工具
export const priceUtils = {
  formatPrice(price: number): string {
    return `¥${price.toLocaleString()}`
  },

  formatPriceRange(min: number, max: number): string {
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`
  }
}

// 时间格式化工具（复用现有的日期工具）
export const deadlineUtils = {
  formatDeadline(deadline: string): string {
    const date = new Date(deadline)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return '已过期'
    } else if (diffDays === 0) {
      return '今天截止'
    } else if (diffDays === 1) {
      return '明天截止'
    } else if (diffDays <= 7) {
      return `${diffDays}天后截止`
    } else {
      return date.toLocaleDateString()
    }
  },

  isUrgent(deadline: string): boolean {
    const date = new Date(deadline)
    const now = new Date()
    const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 3 && diffDays > 0
  }
}
```

## 🔄 系统集成与数据迁移方案

### 1. 模块集成策略

#### 1.1 后端模块集成

```java
// 智图工厂模块结构（基于现有 ruoyi-designer 模式）
// ruoyi-task/ 新增模块

├── src/main/java/com/ruoyi/task/
│   ├── controller/          // 控制器层
│   │   ├── TaskController.java
│   │   ├── TaskApplicationController.java
│   │   ├── TaskPaymentController.java
│   │   ├── ClientController.java
│   │   └── TaskRegistrationController.java
│   ├── domain/             // 实体类
│   │   ├── Task.java
│   │   ├── TaskApplication.java
│   │   ├── TaskPayment.java
│   │   ├── Client.java
│   │   └── TaskDeliverable.java
│   ├── mapper/             // 数据访问层
│   │   ├── TaskMapper.java
│   │   ├── ClientMapper.java
│   │   └── TaskApplicationMapper.java
│   ├── service/            // 业务逻辑层
│   │   ├── ITaskService.java
│   │   ├── TaskServiceImpl.java
│   │   ├── IClientService.java
│   │   ├── ClientServiceImpl.java
│   │   └── TaskPermissionUtils.java
│   └── vo/                 // 视图对象
│       ├── TaskVo.java
│       ├── ClientVo.java
│       └── TaskStatisticsVo.java

// Maven 依赖配置（ruoyi-task/pom.xml）
<dependencies>
    <!-- 复用现有模块依赖 -->
    <dependency>
        <groupId>com.ruoyi</groupId>
        <artifactId>ruoyi-common</artifactId>
    </dependency>
    <dependency>
        <groupId>com.ruoyi</groupId>
        <artifactId>ruoyi-designer</artifactId>
        <version>${project.version}</version>
    </dependency>
    <!-- 支付相关依赖 -->
    <dependency>
        <groupId>com.alipay.sdk</groupId>
        <artifactId>alipay-sdk-java</artifactId>
    </dependency>
    <dependency>
        <groupId>com.github.wxpay</groupId>
        <artifactId>wxpay-sdk</artifactId>
    </dependency>
</dependencies>

// 主应用模块引入（ruoyi-admin/pom.xml）
<dependency>
    <groupId>com.ruoyi</groupId>
    <artifactId>ruoyi-task</artifactId>
    <version>${project.version}</version>
</dependency>
```

#### 1.2 前端模块集成

```typescript
// 前端模块集成结构
src/
├── api/task/               // API接口层
│   ├── task.ts
│   ├── client.ts
│   ├── application.ts
│   ├── payment.ts
│   └── index.ts
├── components/task/        // 任务专用组件
│   ├── TaskCard.vue
│   ├── TaskDetailModal.vue
│   ├── ClientCard.vue
│   └── index.ts
├── composables/task/       // 组合式函数
│   ├── useTask.ts
│   ├── useTaskApplication.ts
│   ├── useTaskPayment.ts
│   └── index.ts
├── stores/task/            // 状态管理
│   ├── taskStore.ts
│   ├── clientStore.ts
│   └── index.ts
├── types/task/             // 类型定义
│   ├── task.ts
│   ├── client.ts
│   ├── application.ts
│   └── index.ts
├── views/task/             // 页面组件
│   ├── layout.vue
│   ├── marketplace/
│   ├── my-tasks/
│   ├── applications/
│   ├── payments/
│   └── analytics/
└── utils/taskUtils.ts      // 工具函数

// 路由集成（src/router/index.ts）
import { taskRoutes } from '@/views/task/routes'

const routes = [
  // ... 现有路由
  ...taskRoutes
]
```

### 2. 数据迁移方案

#### 2.1 数据库初始化脚本

```sql
-- 智图工厂模块初始化脚本
-- script/sql/task_module_init.sql

-- ============== 创建表结构 ==============
-- 1. 任务基础信息表
CREATE TABLE `des_task` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 2. 客户信息表
CREATE TABLE `des_client` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 3. 任务申请表
CREATE TABLE `des_task_application` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 4. 任务交付表
CREATE TABLE `des_task_deliverable` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 5. 支付订单表
CREATE TABLE `des_task_payment` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 6. 任务收藏表
CREATE TABLE `des_task_favorite` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- 7. 任务评价表
CREATE TABLE `des_task_review` (
  -- 基础字段设计（前面已定义）
  -- ...
);

-- ============== 用户绑定扩展 ==============
-- 新增客户角色
INSERT INTO `sys_role` (`role_id`, `role_name`, `role_key`, `role_sort`, `data_scope`, `menu_check_strictly`, `dept_check_strictly`, `status`, `del_flag`, `create_by`, `create_time`, `remark`) VALUES
(1932319128081666053, '客户', 'client', 4, '5', b'1', b'1', '0', '0', 1, now(), '智图工厂客户角色');

-- ============== 菜单权限配置 ==============
-- 智图工厂主菜单
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `remark`) VALUES
(2001, '智图工厂', 0, 5, 'task', null, '', 1, 0, 'M', '0', '0', '', 'build', 1, now(), '智图工厂任务管理系统');

-- 子菜单
INSERT INTO `sys_menu` (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`, `remark`) VALUES
(2011, '任务广场', 2001, 1, 'marketplace', 'task/marketplace/index', '', 1, 0, 'C', '0', '0', 'task:task:query', 'store', 1, now(), ''),
(2012, '我的任务', 2001, 2, 'my-tasks', 'task/my-tasks/index', '', 1, 0, 'C', '0', '0', 'task:task:list', 'task', 1, now(), ''),
(2013, '申请管理', 2001, 3, 'applications', 'task/applications/index', '', 1, 0, 'C', '0', '0', 'task:application:list', 'file-list', 1, now(), ''),
(2014, '交付管理', 2001, 4, 'deliverables', 'task/deliverables/index', '', 1, 0, 'C', '0', '0', 'task:deliverable:list', 'upload', 1, now(), ''),
(2015, '支付中心', 2001, 5, 'payments', 'task/payments/index', '', 1, 0, 'C', '0', '0', 'task:payment:list', 'wallet', 1, now(), ''),
(2016, '智能匹配', 2001, 6, 'matching', 'task/matching/index', '', 1, 0, 'C', '0', '0', 'task:matching:query', 'magic', 1, now(), ''),
(2017, '数据分析', 2001, 7, 'analytics', 'task/analytics/index', '', 1, 0, 'C', '0', '0', 'task:statistics:query', 'bar-chart', 1, now(), ''),
(2018, '客户中心', 2001, 8, 'client-center', 'task/client-center/index', '', 1, 0, 'C', '0', '0', 'task:client:manage', 'user', 1, now(), '');

-- ============== 角色菜单关联 ==============
-- 为客户角色分配菜单权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(1932319128081666053, 2001), -- 智图工厂主菜单
(1932319128081666053, 2011), -- 任务广场
(1932319128081666053, 2012), -- 我的任务
(1932319128081666053, 2013), -- 申请管理
(1932319128081666053, 2014), -- 交付管理
(1932319128081666053, 2015), -- 支付中心
(1932319128081666053, 2018); -- 客户中心

-- 为设计师角色分配菜单权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES
(1932319128081666050, 2001), -- 智图工厂主菜单
(1932319128081666050, 2011), -- 任务广场
(1932319128081666050, 2013), -- 申请管理
(1932319128081666050, 2014), -- 交付管理
(1932319128081666050, 2015), -- 支付中心
(1932319128081666050, 2016); -- 智能匹配

-- ============== 数据字典配置 ==============
-- 任务类型字典
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `remark`) VALUES
(101, '任务类型', 'task_type', '0', 1, now(), '智图工厂任务类型');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `remark`) VALUES
(1001, 1, 'LOGO设计', 'LOGO_DESIGN', 'task_type', '', 'primary', 'N', '0', 1, now(), ''),
(1002, 2, 'UI/UX设计', 'UI_UX_DESIGN', 'task_type', '', 'success', 'N', '0', 1, now(), ''),
(1003, 3, '平面设计', 'GRAPHIC_DESIGN', 'task_type', '', 'info', 'N', '0', 1, now(), ''),
(1004, 4, '插画设计', 'ILLUSTRATION', 'task_type', '', 'warning', 'N', '0', 1, now(), ''),
(1005, 5, '品牌设计', 'BRAND_DESIGN', 'task_type', '', 'danger', 'N', '0', 1, now(), '');

-- 任务状态字典
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `remark`) VALUES
(102, '任务状态', 'task_status', '0', 1, now(), '智图工厂任务状态');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `remark`) VALUES
(1011, 1, '草稿', 'DRAFT', 'task_status', '', 'info', 'N', '0', 1, now(), ''),
(1012, 2, '已发布', 'PUBLISHED', 'task_status', '', 'primary', 'N', '0', 1, now(), ''),
(1013, 3, '进行中', 'IN_PROGRESS', 'task_status', '', 'warning', 'N', '0', 1, now(), ''),
(1014, 4, '已完成', 'COMPLETED', 'task_status', '', 'success', 'N', '0', 1, now(), ''),
(1015, 5, '已取消', 'CANCELLED', 'task_status', '', 'danger', 'N', '0', 1, now(), '');

-- 支付状态字典
INSERT INTO `sys_dict_type` (`dict_id`, `dict_name`, `dict_type`, `status`, `create_by`, `create_time`, `remark`) VALUES
(103, '支付状态', 'payment_status', '0', 1, now(), '支付状态类型');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_sort`, `dict_label`, `dict_value`, `dict_type`, `css_class`, `list_class`, `is_default`, `status`, `create_by`, `create_time`, `remark`) VALUES
(1021, 1, '待支付', 'PENDING', 'payment_status', '', 'warning', 'N', '0', 1, now(), ''),
(1022, 2, '已支付', 'PAID', 'payment_status', '', 'success', 'N', '0', 1, now(), ''),
(1023, 3, '支付失败', 'FAILED', 'payment_status', '', 'danger', 'N', '0', 1, now(), ''),
(1024, 4, '已退款', 'REFUNDED', 'payment_status', '', 'info', 'N', '0', 1, now(), '');

-- ============== 初始化测试数据 ==============
-- 测试客户数据
INSERT INTO `des_client` (`client_id`, `client_name`, `company_name`, `client_type`, `industry`, `phone`, `email`, `description`, `rating`, `total_tasks`, `completed_tasks`, `total_spent`, `verification_status`, `status`, `create_by`, `create_time`) VALUES
(1, '张三', '科技有限公司', 'COMPANY', '互联网', '13800138000', 'zhangsan@example.com', '专业的互联网公司，专注产品设计', 4.8, 10, 8, 50000.00, 'VERIFIED', '0', 1, now()),
(2, '李四', null, 'INDIVIDUAL', '电商', '13900139000', 'lisi@example.com', '个人创业者，需要品牌设计服务', 4.5, 5, 4, 20000.00, 'UNVERIFIED', '0', 1, now());

-- 测试任务数据
INSERT INTO `des_task` (`task_id`, `task_title`, `task_description`, `task_type`, `skill_tags`, `budget_min`, `budget_max`, `deadline`, `urgent`, `client_id`, `status`, `deliverables`, `payment_terms`, `views`, `applications`, `create_by`, `create_time`) VALUES
(1, '企业LOGO设计', '需要设计一个现代简约风格的企业LOGO，要求突出科技感和专业性', 'LOGO_DESIGN', '["LOGO_DESIGN", "BRAND_DESIGN"]', 2000.00, 5000.00, DATE_ADD(now(), INTERVAL 15 DAY), 0, 1, 'PUBLISHED', '提供AI、PNG、JPG格式的LOGO文件，包含横版、竖版、简化版', '项目完成后一次性支付', 120, 5, 1, now()),
(2, '移动APP界面设计', '设计一款社交类移动APP的完整界面，包含主要功能页面', 'UI_UX_DESIGN', '["UI_DESIGN", "UX_DESIGN", "MOBILE_DESIGN"]', 8000.00, 15000.00, DATE_ADD(now(), INTERVAL 30 DAY), 1, 2, 'PUBLISHED', '提供完整的UI设计稿，包含原型图、视觉稿、标注文档', '分两期支付：设计稿确认后支付50%，项目完成后支付余款', 80, 3, 1, now());
```

#### 2.2 数据迁移工具

```java
// 数据迁移工具类
@Component
@Slf4j
public class TaskModuleMigrationTool {

    @Autowired
    private SysMenuMapper menuMapper;

    @Autowired
    private SysRoleMapper roleMapper;

    @Autowired
    private SysDictTypeMapper dictTypeMapper;

    @Autowired
    private SysDictDataMapper dictDataMapper;

    /**
     * 执行智图工厂模块初始化
     */
    @PostConstruct
    public void initTaskModule() {
        try {
            log.info("开始初始化智图工厂模块...");

            // 1. 检查并创建客户角色
            createClientRole();

            // 2. 创建菜单结构
            createTaskMenus();

            // 3. 配置数据字典
            createTaskDictionaries();

            // 4. 初始化权限关联
            initRoleMenuRelations();

            log.info("智图工厂模块初始化完成");

        } catch (Exception e) {
            log.error("智图工厂模块初始化失败", e);
            throw new RuntimeException("模块初始化失败", e);
        }
    }

    /**
     * 创建客户角色
     */
    private void createClientRole() {
        SysRole clientRole = new SysRole();
        clientRole.setRoleId(1932319128081666053L);
        clientRole.setRoleName("客户");
        clientRole.setRoleKey("client");
        clientRole.setRoleSort(4);
        clientRole.setDataScope("5");
        clientRole.setMenuCheckStrictly(true);
        clientRole.setDeptCheckStrictly(true);
        clientRole.setStatus("0");
        clientRole.setDelFlag("0");
        clientRole.setCreateBy(1L);
        clientRole.setCreateTime(new Date());
        clientRole.setRemark("智图工厂客户角色");

        // 检查角色是否已存在
        SysRole existingRole = roleMapper.selectRoleByKey("client");
        if (existingRole == null) {
            roleMapper.insertRole(clientRole);
            log.info("创建客户角色成功");
        } else {
            log.info("客户角色已存在，跳过创建");
        }
    }

    /**
     * 创建任务菜单
     */
    private void createTaskMenus() {
        // 主菜单
        SysMenu mainMenu = new SysMenu();
        mainMenu.setMenuId(2001L);
        mainMenu.setMenuName("智图工厂");
        mainMenu.setParentId(0L);
        mainMenu.setOrderNum(5);
        mainMenu.setPath("task");
        mainMenu.setMenuType("M");
        mainMenu.setVisible("0");
        mainMenu.setStatus("0");
        mainMenu.setIcon("build");
        mainMenu.setCreateBy(1L);
        mainMenu.setCreateTime(new Date());
        mainMenu.setRemark("智图工厂任务管理系统");

        SysMenu existingMenu = menuMapper.selectMenuById(2001L);
        if (existingMenu == null) {
            menuMapper.insertMenu(mainMenu);
            log.info("创建智图工厂主菜单成功");
        }

        // 子菜单列表
        List<SysMenu> subMenus = Arrays.asList(
            createSubMenu(2011L, "任务广场", 2001L, 1, "marketplace", "task/marketplace/index", "task:task:query", "store"),
            createSubMenu(2012L, "我的任务", 2001L, 2, "my-tasks", "task/my-tasks/index", "task:task:list", "task"),
            createSubMenu(2013L, "申请管理", 2001L, 3, "applications", "task/applications/index", "task:application:list", "file-list"),
            createSubMenu(2014L, "交付管理", 2001L, 4, "deliverables", "task/deliverables/index", "task:deliverable:list", "upload"),
            createSubMenu(2015L, "支付中心", 2001L, 5, "payments", "task/payments/index", "task:payment:list", "wallet"),
            createSubMenu(2016L, "智能匹配", 2001L, 6, "matching", "task/matching/index", "task:matching:query", "magic"),
            createSubMenu(2017L, "数据分析", 2001L, 7, "analytics", "task/analytics/index", "task:statistics:query", "bar-chart"),
            createSubMenu(2018L, "客户中心", 2001L, 8, "client-center", "task/client-center/index", "task:client:manage", "user")
        );

        subMenus.forEach(menu -> {
            SysMenu existing = menuMapper.selectMenuById(menu.getMenuId());
            if (existing == null) {
                menuMapper.insertMenu(menu);
                log.info("创建子菜单: {} 成功", menu.getMenuName());
            }
        });
    }

    private SysMenu createSubMenu(Long menuId, String menuName, Long parentId, Integer orderNum,
                                 String path, String component, String perms, String icon) {
        SysMenu menu = new SysMenu();
        menu.setMenuId(menuId);
        menu.setMenuName(menuName);
        menu.setParentId(parentId);
        menu.setOrderNum(orderNum);
        menu.setPath(path);
        menu.setComponent(component);
        menu.setIsFrame(1);
        menu.setIsCache(0);
        menu.setMenuType("C");
        menu.setVisible("0");
        menu.setStatus("0");
        menu.setPerms(perms);
        menu.setIcon(icon);
        menu.setCreateBy(1L);
        menu.setCreateTime(new Date());
        return menu;
    }

    /**
     * 创建数据字典
     */
    private void createTaskDictionaries() {
        // 创建任务类型字典
        createDictType(101L, "任务类型", "task_type", "智图工厂任务类型");
        createDictData(1001L, 1, "LOGO设计", "LOGO_DESIGN", "task_type", "primary");
        createDictData(1002L, 2, "UI/UX设计", "UI_UX_DESIGN", "task_type", "success");
        createDictData(1003L, 3, "平面设计", "GRAPHIC_DESIGN", "task_type", "info");
        createDictData(1004L, 4, "插画设计", "ILLUSTRATION", "task_type", "warning");
        createDictData(1005L, 5, "品牌设计", "BRAND_DESIGN", "task_type", "danger");

        // 创建任务状态字典
        createDictType(102L, "任务状态", "task_status", "智图工厂任务状态");
        createDictData(1011L, 1, "草稿", "DRAFT", "task_status", "info");
        createDictData(1012L, 2, "已发布", "PUBLISHED", "task_status", "primary");
        createDictData(1013L, 3, "进行中", "IN_PROGRESS", "task_status", "warning");
        createDictData(1014L, 4, "已完成", "COMPLETED", "task_status", "success");
        createDictData(1015L, 5, "已取消", "CANCELLED", "task_status", "danger");

        // 创建支付状态字典
        createDictType(103L, "支付状态", "payment_status", "支付状态类型");
        createDictData(1021L, 1, "待支付", "PENDING", "payment_status", "warning");
        createDictData(1022L, 2, "已支付", "PAID", "payment_status", "success");
        createDictData(1023L, 3, "支付失败", "FAILED", "payment_status", "danger");
        createDictData(1024L, 4, "已退款", "REFUNDED", "payment_status", "info");
    }

    private void createDictType(Long dictId, String dictName, String dictType, String remark) {
        SysDictType existing = dictTypeMapper.selectDictTypeByType(dictType);
        if (existing == null) {
            SysDictType type = new SysDictType();
            type.setDictId(dictId);
            type.setDictName(dictName);
            type.setDictType(dictType);
            type.setStatus("0");
            type.setCreateBy(1L);
            type.setCreateTime(new Date());
            type.setRemark(remark);
            dictTypeMapper.insertDictType(type);
            log.info("创建数据字典类型: {} 成功", dictName);
        }
    }

    private void createDictData(Long dictCode, Integer dictSort, String dictLabel,
                               String dictValue, String dictType, String listClass) {
        SysDictData existing = dictDataMapper.selectDictDataByType(dictType, dictValue);
        if (existing == null) {
            SysDictData data = new SysDictData();
            data.setDictCode(dictCode);
            data.setDictSort(dictSort);
            data.setDictLabel(dictLabel);
            data.setDictValue(dictValue);
            data.setDictType(dictType);
            data.setListClass(listClass);
            data.setIsDefault("N");
            data.setStatus("0");
            data.setCreateBy(1L);
            data.setCreateTime(new Date());
            dictDataMapper.insertDictData(data);
            log.info("创建数据字典项: {} = {} 成功", dictLabel, dictValue);
        }
    }
}
```

### 3. 性能优化策略

#### 3.1 数据库优化

```sql
-- 智图工厂性能优化索引
-- 任务表索引优化
CREATE INDEX idx_task_client_status ON des_task(client_id, status);
CREATE INDEX idx_task_type_status ON des_task(task_type, status);
CREATE INDEX idx_task_deadline ON des_task(deadline);
CREATE INDEX idx_task_budget ON des_task(budget_min, budget_max);
CREATE INDEX idx_task_create_time ON des_task(create_time);

-- 申请表索引优化
CREATE INDEX idx_application_task_designer ON des_task_application(task_id, designer_id);
CREATE INDEX idx_application_designer_status ON des_task_application(designer_id, status);
CREATE INDEX idx_application_apply_time ON des_task_application(apply_time);

-- 支付表索引优化
CREATE INDEX idx_payment_task_status ON des_task_payment(task_id, status);
CREATE INDEX idx_payment_designer_status ON des_task_payment(designer_id, status);
CREATE INDEX idx_payment_create_time ON des_task_payment(create_time);

-- 客户表索引优化
CREATE INDEX idx_client_type_status ON des_client(client_type, status);
CREATE INDEX idx_client_rating ON des_client(rating);
CREATE INDEX idx_client_verification ON des_client(verification_status);

-- 分区策略（按月分区）
-- 任务表按创建时间分区
ALTER TABLE des_task PARTITION BY RANGE (YEAR(create_time)*100 + MONTH(create_time)) (
    PARTITION p202501 VALUES LESS THAN (202502),
    PARTITION p202502 VALUES LESS THAN (202503),
    PARTITION p202503 VALUES LESS THAN (202504),
    -- ... 更多分区
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- 支付表按支付时间分区
ALTER TABLE des_task_payment PARTITION BY RANGE (YEAR(create_time)*100 + MONTH(create_time)) (
    PARTITION p202501 VALUES LESS THAN (202502),
    PARTITION p202502 VALUES LESS THAN (202503),
    -- ... 更多分区
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

#### 3.2 缓存策略

```java
// 智图工厂缓存配置
@Configuration
@EnableCaching
public class TaskCacheConfig {

    @Bean
    public CacheManager taskCacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
            .RedisCacheManagerBuilder
            .fromConnectionFactory(redisConnectionFactory)
            .cacheDefaults(getCacheConfigurationWithTtl(Duration.ofMinutes(30)));

        // 不同类型数据使用不同的缓存策略
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // 任务列表缓存 - 5分钟
        cacheConfigurations.put("taskList", getCacheConfigurationWithTtl(Duration.ofMinutes(5)));

        // 任务详情缓存 - 10分钟
        cacheConfigurations.put("taskDetail", getCacheConfigurationWithTtl(Duration.ofMinutes(10)));

        // 客户信息缓存 - 30分钟
        cacheConfigurations.put("clientInfo", getCacheConfigurationWithTtl(Duration.ofMinutes(30)));

        // 统计数据缓存 - 15分钟
        cacheConfigurations.put("taskStats", getCacheConfigurationWithTtl(Duration.ofMinutes(15)));

        // 热门任务缓存 - 1小时
        cacheConfigurations.put("hotTasks", getCacheConfigurationWithTtl(Duration.ofHours(1)));

        return builder.withInitialCacheConfigurations(cacheConfigurations).build();
    }

    private RedisCacheConfiguration getCacheConfigurationWithTtl(Duration duration) {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(duration)
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}

// 缓存使用示例
@Service
@Slf4j
public class TaskServiceImpl implements ITaskService {

    @Cacheable(value = "taskList", key = "#params.toString()")
    @Override
    public TableDataInfo<TaskVo> selectTaskList(TaskQueryParams params) {
        // 任务列表查询逻辑
        // ...
    }

    @Cacheable(value = "taskDetail", key = "#taskId")
    @Override
    public TaskDetailVo getTaskDetail(Long taskId) {
        // 任务详情查询逻辑
        // ...
    }

    @CacheEvict(value = {"taskList", "taskDetail"}, key = "#task.taskId")
    @Override
    public Boolean updateTask(Task task) {
        // 更新任务时清除相关缓存
        // ...
    }

    @Cacheable(value = "hotTasks", key = "'hot_tasks_' + #limit")
    @Override
    public List<TaskVo> getHotTasks(Integer limit) {
        // 热门任务查询逻辑
        // ...
    }
}
```

#### 3.3 异步处理优化

```java
// 异步任务处理配置
@Configuration
@EnableAsync
public class TaskAsyncConfig {

    @Bean("taskExecutor")
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("task-async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();
        return executor;
    }
}

// 异步任务处理服务
@Service
@Async("taskExecutor")
@Slf4j
public class TaskAsyncService {

    @Autowired
    private ITaskService taskService;

    @Autowired
    private TaskNotificationService notificationService;

    /**
     * 异步处理任务申请
     */
    @Async
    public void processTaskApplicationAsync(TaskApplication application) {
        try {
            // 发送申请通知
            notificationService.sendApplicationNotification(application);

            // 更新任务申请数量
            taskService.updateTaskApplicationCount(application.getTaskId());

            // 触发智能匹配推荐
            triggerMatchingRecommendation(application.getTaskId());

            log.info("异步处理任务申请成功: {}", application.getApplicationId());
        } catch (Exception e) {
            log.error("异步处理任务申请失败", e);
        }
    }

    /**
     * 异步处理支付结算
     */
    @Async
    public void processPaymentAsync(TaskPayment payment) {
        try {
            // 更新任务状态
            taskService.updateTaskStatusAfterPayment(payment.getTaskId());

            // 发送支付成功通知
            notificationService.sendPaymentNotification(payment);

            // 更新设计师收入统计
            updateDesignerEarnings(payment);

            // 更新客户消费统计
            updateClientSpending(payment);

            log.info("异步处理支付结算成功: {}", payment.getPaymentId());
        } catch (Exception e) {
            log.error("异步处理支付结算失败", e);
        }
    }

    /**
     * 异步生成统计报告
     */
    @Async
    public void generateStatisticsReportAsync(String reportType, Map<String, Object> params) {
        try {
            // 生成统计报告逻辑
            // ...

            log.info("异步生成统计报告成功: {}", reportType);
        } catch (Exception e) {
            log.error("异步生成统计报告失败", e);
        }
    }
}
```

### 4. 部署和运维指导

#### 4.1 部署清单

```bash
# 智图工厂模块部署清单

# 1. 数据库部署
# 执行初始化脚本
mysql -u root -p < script/sql/task_module_init.sql

# 2. 后端部署
# 确保ruoyi-task模块已正确编译打包
mvn clean package -DskipTests

# 3. 前端部署
# 确保任务模块前端资源已正确构建
npm run build

# 4. 配置文件检查
# application.yml 中的任务模块配置
task:
  # 支付配置
  payment:
    alipay:
      app-id: ${ALIPAY_APP_ID}
      private-key: ${ALIPAY_PRIVATE_KEY}
      public-key: ${ALIPAY_PUBLIC_KEY}
    wechat:
      app-id: ${WECHAT_APP_ID}
      mch-id: ${WECHAT_MCH_ID}
      key: ${WECHAT_KEY}

  # 文件上传配置
  upload:
    path: /data/task/upload
    max-file-size: 50MB
    allowed-types: jpg,jpeg,png,gif,pdf,ai,psd,sketch

  # 智能匹配配置
  matching:
    enabled: true
    algorithm: collaborative-filtering
    threshold: 0.6

# 5. 环境变量配置
export ALIPAY_APP_ID=your_alipay_app_id
export ALIPAY_PRIVATE_KEY=your_alipay_private_key
export ALIPAY_PUBLIC_KEY=your_alipay_public_key
export WECHAT_APP_ID=your_wechat_app_id
export WECHAT_MCH_ID=your_wechat_mch_id
export WECHAT_KEY=your_wechat_key
```

#### 4.2 监控和告警

```yaml
# 智图工厂模块监控配置
# prometheus/task-metrics.yml

groups:
  - name: task-module-alerts
    rules:
      # 任务申请处理时间监控
      - alert: TaskApplicationProcessingTooSlow
        expr: avg_over_time(task_application_processing_duration_seconds[5m]) > 30
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "任务申请处理时间过长"
          description: "任务申请平均处理时间超过30秒"

      # 支付失败率监控
      - alert: HighPaymentFailureRate
        expr: rate(task_payment_failures_total[5m]) > 0.1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "支付失败率过高"
          description: "支付失败率超过10%"

      # 任务数据库连接监控
      - alert: TaskDatabaseConnectionsHigh
        expr: mysql_global_status_threads_connected > 100
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "任务模块数据库连接数过高"
          description: "MySQL连接数超过100"

      # 缓存命中率监控
      - alert: LowCacheHitRate
        expr: task_cache_hit_rate < 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "任务模块缓存命中率过低"
          description: "缓存命中率低于80%"
```

#### 4.3 备份和恢复策略

```bash
# 智图工厂模块备份策略

# 1. 数据库备份脚本
#!/bin/bash
# backup-task-module.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/data/backup/task-module"
MYSQL_USER="backup_user"
MYSQL_PASSWORD="backup_password"
DATABASE="ruoyi_db"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份任务相关表
mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD $DATABASE \
  des_task \
  des_client \
  des_task_application \
  des_task_deliverable \
  des_task_payment \
  des_task_favorite \
  des_task_review \
  > $BACKUP_DIR/task_module_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/task_module_$DATE.sql

# 清理7天前的备份
find $BACKUP_DIR -name "task_module_*.sql.gz" -mtime +7 -delete

echo "任务模块备份完成: task_module_$DATE.sql.gz"

# 2. 文件备份脚本
#!/bin/bash
# backup-task-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/data/backup/task-files"
SOURCE_DIR="/data/task/upload"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 增量备份文件
rsync -av --link-dest=$BACKUP_DIR/latest $SOURCE_DIR/ $BACKUP_DIR/$DATE/
rm -f $BACKUP_DIR/latest
ln -s $DATE $BACKUP_DIR/latest

echo "任务文件备份完成: $DATE"

# 3. 恢复脚本
#!/bin/bash
# restore-task-module.sh

if [ $# -ne 1 ]; then
    echo "用法: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE=$1
MYSQL_USER="root"
MYSQL_PASSWORD="password"
DATABASE="ruoyi_db"

# 恢复数据库
gunzip -c $BACKUP_FILE | mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $DATABASE

echo "任务模块恢复完成"
```

### 5. 集成测试方案

```java
// 智图工厂集成测试
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
@Rollback
class TaskModuleIntegrationTest {

    @Autowired
    private ITaskService taskService;

    @Autowired
    private IClientService clientService;

    @Autowired
    private ITaskApplicationService applicationService;

    @Test
    @DisplayName("完整任务流程测试")
    void testCompleteTaskFlow() {
        // 1. 创建客户
        Client client = createTestClient();
        Long clientId = clientService.insertClient(client);
        assertThat(clientId).isGreaterThan(0);

        // 2. 发布任务
        Task task = createTestTask(clientId);
        Long taskId = taskService.insertTask(task);
        assertThat(taskId).isGreaterThan(0);

        // 3. 申请任务
        TaskApplication application = createTestApplication(taskId);
        Long applicationId = applicationService.insertTaskApplication(application);
        assertThat(applicationId).isGreaterThan(0);

        // 4. 处理申请
        Boolean result = applicationService.processApplication(applicationId, "accept", "申请通过");
        assertThat(result).isTrue();

        // 5. 验证任务状态更新
        Task updatedTask = taskService.selectTaskById(taskId);
        assertThat(updatedTask.getStatus()).isEqualTo("IN_PROGRESS");

        // 6. 提交交付物
        TaskDeliverable deliverable = createTestDeliverable(taskId);
        Boolean deliverableResult = deliverableService.insertTaskDeliverable(deliverable);
        assertThat(deliverableResult).isTrue();

        // 7. 创建支付订单
        TaskPayment payment = createTestPayment(taskId);
        Boolean paymentResult = paymentService.insertTaskPayment(payment);
        assertThat(paymentResult).isTrue();

        // 8. 确认支付
        Boolean confirmResult = paymentService.confirmPayment(payment.getPaymentId());
        assertThat(confirmResult).isTrue();

        // 9. 验证最终状态
        Task finalTask = taskService.selectTaskById(taskId);
        assertThat(finalTask.getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("权限控制测试")
    void testPermissionControl() {
        // 测试不同角色的权限控制
        // ...
    }

    @Test
    @DisplayName("性能压力测试")
    void testPerformance() {
        // 并发创建100个任务
        // 验证系统性能表现
        // ...
    }
}
```

## 📋 总结

通过以上完整的设计方案，智图工厂模块将能够：

1. **无缝集成现有系统**：复用若依框架的用户管理、权限控制、数据结构等核心功能
2. **保持架构一致性**：遵循现有的API设计模式、组件架构、数据库设计规范
3. **提供完整业务闭环**：从任务发布到最终结算的完整业务流程
4. **确保系统性能**：通过缓存策略、异步处理、数据库优化保证高性能
5. **支持平滑部署**：提供完整的迁移工具、监控告警、备份恢复方案

**实施优先级建议**：
1. **Phase 1**：核心任务管理功能（任务发布、申请、基础交付）
2. **Phase 2**：支付系统和高级功能（智能匹配、数据分析）
3. **Phase 3**：性能优化和运维工具（监控告警、自动化运维）

这样的设计既保证了功能的完整性，又确保了与现有系统的完美兼容，为智图工厂的成功实施提供了坚实的技术基础。
