# 技能标签全局上色方案实施指南

## 📋 概述

根据《技能标签重构实施完成报告.md》的规范，本指南提供了在整个网站实现全局生效的技能标签上色方案。

## 🎨 颜色分类方案

### 三大分类体系

| 分类            | 代码      | 名称        | 颜色主题 | 示例标签                                |
| --------------- | --------- | ----------- | -------- | --------------------------------------- |
| **TOOL**  | `tool`  | 🔵 设计工具 | 蓝色系   | Figma, Sketch, Photoshop, After Effects |
| **FIELD** | `field` | 🟣 专业领域 | 紫色系   | 交互设计, UI设计, 品牌设计, 产品设计    |
| **SKILL** | `skill` | 🩷 技能方法 | 粉色系   | 用户体验, 用户研究, 原型设计, 设计系统  |

### 颜色规范

#### 默认主题

```css
/* 🔵 设计工具类 */
.skill-tag-tool {
  @apply bg-blue-500/20 text-blue-400 border-blue-500/30;
}

/* 🟣 专业领域类 */
.skill-tag-field {
  @apply bg-purple-500/20 text-purple-400 border-purple-500/30;
}

/* 🩷 技能方法类 */
.skill-tag-skill {
  @apply bg-pink-500/20 text-pink-400 border-pink-500/30;
}
```

#### 暗黑主题
暗黑主题已移除，仅保留默认主题。

## 🛠️ 技术实现

### 1. 文件结构

```
src/
├── utils/
│   └── skillTagUtils.ts          # 核心工具类
├── composables/
│   └── useSkillTags.ts           # Vue组合式函数
├── components/
│   └── common/
│       ├── SkillTag/
│       │   └── index.vue         # 单个标签组件
│       └── SkillTagList/
│           └── index.vue         # 标签列表组件
└── styles/
    ├── global.less               # 全局样式入口
    └── skill-tags.css            # 技能标签专用样式
```

### 2. 核心API

#### SkillTagUtils 工具类

```typescript
import { SkillTagUtils } from '@/utils/skillTagUtils'

// 获取标签分类
const category = SkillTagUtils.getTagCategory('Figma') // 'tool'

// 获取样式类名
const classes = SkillTagUtils.getTagClasses('Figma', 'default')

// 分组标签
const grouped = SkillTagUtils.groupTagsByCategory(tags)

// 获取统计信息
const stats = SkillTagUtils.getCategoryStats(tags)
```

#### useSkillTags 组合式函数

```typescript
import { useSkillTags } from '@/composables/useSkillTags'

const {
  getTagCategory,
  getTagClasses,
  groupTagsByCategory,
  categoryNames,
  categoryColors
} = useSkillTags()
```

## 🧩 组件使用

### 1. 单个标签组件

```vue
<script setup>
import { SkillTag } from '@/components/common'

const handleTagClick = (tag, category) => {
  console.log(`点击了${tag}，属于${category}分类`)
}
</script>

<template>
  <!-- 基础使用 -->
  <SkillTag tag="Figma" />

  <!-- 自定义尺寸 -->
  <SkillTag
    tag="交互设计"
    size="lg"
    :clickable="true"
    :show-category="true"
    @click="handleTagClick"
  />
</template>
```

### 2. 标签列表组件

```vue
<script setup>
import { SkillTagList } from '@/components/common'

const skills = [
  'Figma', 'Sketch', '交互设计', 'UI设计',
  '用户体验', '用户研究', '原型设计'
]
</script>

<template>
  <!-- 普通列表 -->
  <SkillTagList
    :tags="skills"
    :clickable="true"
    :animation-enabled="true"
  />

  <!-- 分组显示 -->
  <SkillTagList
    :tags="skills"
    :grouped="true"
    :show-group-titles="true"
    :show-stats="true"
  />
</template>
```

## 📊 标签分类详细列表

### 🔵 设计工具类 (TOOL)

- **设计软件**: Figma, Sketch, Adobe XD, InVision, Framer
- **图形工具**: Photoshop, Illustrator, After Effects, Cinema 4D
- **原型工具**: Axure RP, Principle, Framer
- **协作工具**: Zeplin, Abstract
- **动效工具**: Lottie, After Effects
- **3D工具**: Blender, 3D Max, Maya

### 🟣 专业领域类 (FIELD)

- **交互设计**: 交互设计, 界面设计, 产品设计
- **视觉设计**: UI设计, 视觉设计, 品牌设计, 平面设计
- **专业领域**: 游戏美术, 动效设计, 网页设计, 移动端设计
- **品牌相关**: 品牌标识, LOGO设计, 品牌设计
- **内容创作**: 动画制作

### 🩷 技能方法类 (SKILL)

- **用户研究**: 用户体验, 用户研究, 用户测试, 可用性测试
- **设计方法**: 原型设计, 信息架构, 用户画像, 用户旅程
- **系统设计**: 设计系统, 视觉系统, 视觉识别
- **基础技能**: 线框设计, 字体设计, 色彩理论
- **创意技能**: 插画, 角色设计, 场景设计, 摄影
- **技术技能**: 3D建模, 动画, 动效, 视频剪辑

## 🚀 快速开始

### 1. 引入样式

确保在 `src/styles/global.less` 中已引入技能标签样式：

```less
@import './skill-tags.css';
```

### 2. 注册组件

在需要的页面中引入组件：

```typescript
import { SkillTag, SkillTagList } from '@/components/common'
```

### 3. 使用示例

```vue
<script setup>
import { SkillTag, SkillTagList } from '@/components/common'

const allSkills = [
  // 工具类
  'Figma', 'Sketch', 'Photoshop', 'Illustrator',
  // 领域类
  '交互设计', 'UI设计', '品牌设计', '产品设计',
  // 技能类
  '用户体验', '用户研究', '原型设计', '设计系统'
]
</script>

<template>
  <div class="skill-showcase">
    <!-- 单个标签示例 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">
        设计工具
      </h3>
      <div class="flex flex-wrap gap-2">
        <SkillTag tag="Figma" />
        <SkillTag tag="Sketch" />
        <SkillTag tag="Photoshop" />
      </div>
    </div>

    <!-- 分组标签示例 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">
        技能概览
      </h3>
      <SkillTagList
        :tags="allSkills"
        :grouped="true"
        :show-stats="true"
        :animation-enabled="true"
      />
    </div>
  </div>
</template>
```

## 🎯 最佳实践

### 1. 语义化使用

- 始终根据实际含义选择正确的分类
- 工具类用于软件和工具名称
- 领域类用于设计专业方向
- 技能类用于方法和能力

### 2. 样式一致性

- 在同一页面内保持样式一致
- 使用统一的默认主题配色方案

### 3. 交互体验

- 重要场景使用 `clickable` 增强交互
- 复杂列表使用 `animationEnabled` 提升体验
- 详情页面使用 `showCategory` 提供更多信息

### 4. 性能优化

- 大量标签时考虑虚拟滚动
- 合理使用分组减少DOM节点
- 按需引入避免包体积过大

## 📋 迁移指南

### 从旧版本迁移

1. **替换旧的样式类**:

   ```vue
   <!-- 旧版本 -->
   <span class="bg-blue-500/20 text-blue-400 border border-blue-500/30">
     Figma
   </span>

   <!-- 新版本 -->
   <SkillTag tag="Figma" />
   ```
2. **移除硬编码的颜色映射**:

   ```typescript
   // 删除旧的颜色映射代码
   const getSkillTagClass = (skill: string) => { ... }

   // 使用新的工具类
   import { useSkillTags } from '@/composables/useSkillTags'
   const { getTagClasses } = useSkillTags()
   ```
3. **更新导入路径**:

   ```typescript
   // 统一使用新的组件
   import { SkillTag, SkillTagList } from '@/components/common'
   ```

## 🔧 扩展配置

### 自定义主题
自定义主题功能已简化，仅保留默认主题。如需自定义样式，请直接修改CSS变量或样式类。

### 新增标签分类

```typescript
// 在 skillTagUtils.ts 中的 categoryMap 添加新映射
['new_tool', 'tool'],
['新设计工具', 'tool']
```

## 📈 效果展示

实施后的效果：

- ✅ **统一性**: 全站技能标签颜色完全统一
- ✅ **语义化**: 颜色与标签类型语义对应
- ✅ **可维护**: 集中管理，易于扩展和修改
- ✅ **响应式**: 支持移动端和桌面端适配
- ✅ **性能**: 优化的CSS和组件实现
- ✅ **体验**: 流畅的动画和交互效果

## 🤝 协作规范

### 开发者规范

1. 新增技能标签时，先在 `skillTagUtils.ts` 中添加映射
2. 统一使用 `SkillTag` 组件，避免硬编码样式
3. 复杂场景优先使用 `SkillTagList` 组件
4. 提交前检查颜色分类是否正确

### 设计师规范

1. 新设计稿中的技能标签颜色需符合三分类体系
2. 设计评审时确认标签分类的准确性
3. 特殊需求请先与开发团队沟通

通过这套全局技能标签上色方案，我们实现了真正的前后端分离、高度一致的用户体验和良好的可维护性。
