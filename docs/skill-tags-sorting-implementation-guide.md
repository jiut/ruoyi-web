# 🎯 技能标签分类排序实施指南

## 📋 概述

本指南详细说明如何在整个项目中统一实施技能标签的分类排序，按照 **工具 → 专业领域 → 技能方法** 的优先级顺序进行排列。

## 🏗️ 架构设计

### 分类排序规则

| 优先级 | 分类 | 代码 | 图标 | 颜色主题 | 说明 |
|-------|------|------|------|---------|------|
| 1 | 设计工具 | `tool` | 🔵 | 蓝色 | Figma、Sketch等设计工具/软件 |
| 2 | 专业领域 | `field` | 🟣 | 紫色 | 交互设计、UI设计等专业领域 |
| 3 | 技能方法 | `skill` | 🩷 | 粉色 | 用户体验、用户研究等技能方法 |

### 数据流向

```
后端英文简写 → 前端分类识别 → 排序处理 → 中文显示
    ↓              ↓           ↓         ↓
  figma    →    tool类别   →   优先级1  →  Figma
ui_design  →   field类别  →   优先级2  →  UI设计
user_experience → skill类别 → 优先级3 → 用户体验
```

## 🛠️ 核心实现

### 1. 工具类方法（已实现）

```typescript
// src/utils/skillTagUtils.ts

/**
 * 按分类排序技能标签
 * @param tags - 英文简写标签数组
 * @param sortOrder - 排序顺序 'asc' | 'desc'
 */
SkillTagUtils.sortTagsByCategory(tags, 'asc')

/**
 * 按分类分组并排序技能标签
 * @param tags - 英文简写标签数组
 * @param sortOrder - 排序顺序
 */
SkillTagUtils.groupAndSortTagsByCategory(tags, 'asc')

/**
 * 获取排序后的分类顺序
 * @param sortOrder - 排序顺序
 */
SkillTagUtils.getSortedCategories('asc')
```

### 2. 组合式函数（已实现）

```typescript
// src/composables/useSkillTags.ts

const {
  sortTagsByCategory,
  groupAndSortTagsByCategory,
  getSortedCategories,
  createSortedTags,
  createGroupedSortedTags
} = useSkillTags()
```

### 3. 通用组件（已实现）

```vue
<!-- src/components/common/SkillTagList/index.vue -->
<SkillTagList
  :tags="skillTags"
  :group-by-category="true"
  :sort-order="'asc'"
  :show-stats="true"
  :show-group-title="true"
/>
```

## 📋 实施步骤

### Phase 1: 核心组件更新 ✅

- [x] 更新 `SkillTagUtils` 工具类，添加排序功能
- [x] 更新 `useSkillTags` 组合式函数，添加排序方法
- [x] 更新 `SkillTagList` 组件，支持分类排序显示
- [x] 更新 `SkillTag` 单个标签组件

### Phase 2: 页面应用实施

#### 2.1 设计师页面 ✅

```vue
<!-- src/views/talent/designers/index.vue -->

<!-- 筛选区域 - 技能标签按分类排序显示 -->
<SkillTag
  v-for="tag in skillTags"
  :key="tag"
  :tag="tag"
  :class="getSkillTagClasses(tag)"
  @click="toggleSkillTag(tag)"
>
  {{ getSkillTagDisplayName(tag) }}
</SkillTag>

<!-- 设计师卡片 - 技能标签按分类排序显示 -->
<SkillTag
  v-for="skill in getSortedDesignerSkills(designer)"
  :key="skill"
  :tag="skill"
  size="sm"
/>
```

#### 2.2 职位页面（待实施）

```vue
<!-- src/views/talent/jobs/index.vue -->

<!-- 使用分类排序显示职位技能要求 -->
<SkillTagList
  :tags="job.requiredSkills"
  :group-by-category="true"
  :sort-order="'asc'"
  size="sm"
/>
```

#### 2.3 设计师详情页面（待实施）

```vue
<!-- src/views/talent/designers/detail.vue -->

<!-- 技能展示区域 -->
<SkillTagList
  :tags="designer.skillTags"
  :group-by-category="true"
  :sort-order="'asc'"
  :show-group-title="true"
  :show-stats="true"
/>
```

### Phase 3: 全局统一实施

#### 3.1 创建全局配置

```typescript
// src/config/skillTags.ts
export const SKILL_TAG_CONFIG = {
  defaultSortOrder: 'asc' as const,
  enableGrouping: true,
  showStats: false,
  showGroupTitle: true,
  enableAnimation: true
}
```

#### 3.2 创建全局混入（可选）

```typescript
// src/mixins/skillTagMixin.ts
export const skillTagMixin = {
  methods: {
    // 全局统一的技能标签排序方法
    sortSkillTags(tags: string[]) {
      return SkillTagUtils.sortTagsByCategory(tags, 'asc')
    }
  }
}
```

## 📊 使用示例

### 基础排序

```typescript
// 原有方式 - 简单字符串排序
const skills = ['user_experience', 'figma', 'ui_design']
const sorted = skills.sort()
// 结果: ['figma', 'ui_design', 'user_experience']

// 新方式 - 分类排序
const sorted = sortTagsByCategory(skills, 'asc')
// 结果: ['figma', 'ui_design', 'user_experience']
// 分类: [工具类, 领域类, 技能类]
```

### 分组排序

```typescript
const skills = ['user_experience', 'figma', 'ui_design', 'sketch', 'prototype_design']
const grouped = groupAndSortTagsByCategory(skills, 'asc')

// 结果:
// {
//   tool: ['figma', 'sketch'],           // 🔵 工具类
//   field: ['ui_design'],               // 🟣 领域类
//   skill: ['prototype_design', 'user_experience'] // 🩷 技能类
// }
```

### Vue组件中使用

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useSkillTags } from '@/composables/useSkillTags'

const { sortTagsByCategory } = useSkillTags()

const allSkills = ['figma', 'ui_design', 'user_experience', 'sketch']

// 自动按分类排序
const sortedSkills = computed(() =>
  sortTagsByCategory(allSkills, 'asc')
)
</script>

<template>
  <div class="skill-section">
    <!-- 简单排序模式 -->
    <div class="skill-tags">
      <SkillTag
        v-for="skill in sortedSkills"
        :key="skill"
        :tag="skill"
      />
    </div>

    <!-- 分组排序模式 -->
    <SkillTagList
      :tags="allSkills"
      group-by-category
      show-group-title
      sort-order="asc"
    />
  </div>
</template>
```

## 🎨 样式规范

### CSS类名约定

```css
/* 分类样式 */
.skill-tag-tool   { /* 🔵 工具类 - 蓝色主题 */ }
.skill-tag-field  { /* 🟣 领域类 - 紫色主题 */ }
.skill-tag-skill  { /* 🩷 技能类 - 粉色主题 */ }

/* 状态样式 */
.skill-tag.selected { /* 选中状态 */ }
.skill-tag.disabled { /* 禁用状态 */ }

/* 尺寸变体 */
.skill-tag-sm  { /* 小号标签 */ }
.skill-tag-md  { /* 中号标签 */ }
.skill-tag-lg  { /* 大号标签 */ }
```

### 布局约定

```css
/* 容器布局 */
.skill-tags-container {
  @apply flex flex-wrap gap-2;
}

/* 分组布局 */
.skill-tags-grouped {
  @apply space-y-4;
}

.skill-tag-group-title {
  @apply text-sm font-medium text-gray-600 mb-2;
}
```

## 📋 检查清单

### 开发检查

- [ ] **工具类方法** - 确保 `sortTagsByCategory()` 方法正常工作
- [ ] **组合式函数** - 确保 `useSkillTags()` 返回排序方法
- [ ] **组件更新** - 确保所有技能标签组件使用新排序
- [ ] **页面应用** - 确保关键页面应用分类排序
- [ ] **样式一致** - 确保分类颜色样式统一

### 测试检查

- [ ] **排序正确性** - 验证工具→领域→技能的排序顺序
- [ ] **中文显示** - 验证英文简写正确转换为中文
- [ ] **响应式适配** - 验证移动端显示效果
- [ ] **性能测试** - 验证大量标签的排序性能
- [ ] **边界情况** - 验证空数组、单个标签等边界情况

### 用户体验检查

- [ ] **视觉一致性** - 所有页面的技能标签样式统一
- [ ] **分类清晰** - 用户能够清楚识别不同分类的标签
- [ ] **排序逻辑** - 排序结果符合用户预期和使用习惯
- [ ] **交互反馈** - 标签点击、悬停等交互效果正常
- [ ] **加载性能** - 页面加载时技能标签渲染流畅

## 🚀 预期效果

实施完成后，整个项目中的技能标签将实现：

1. **统一排序** - 所有技能标签按照工具→领域→技能的分类优先级排序
2. **视觉统一** - 不同分类使用统一的颜色主题和样式
3. **中英文映射** - 后端英文简写自动转换为前端中文显示
4. **响应式适配** - 在不同设备上都有良好的显示效果
5. **开发效率** - 开发者使用统一的API，减少重复代码

## 📞 技术支持

如遇到实施问题，请参考：

- 📁 **演示页面**: `/test/skill-tag-sorting-demo`
- 📖 **API文档**: `src/utils/skillTagUtils.ts`
- 🧩 **组件文档**: `src/components/common/SkillTag*/`
- 📋 **实施报告**: `docs/技能标签重构实施完成报告.md`

---

*该实施指南确保整个项目技能标签显示的一致性和专业性。* 🎯
