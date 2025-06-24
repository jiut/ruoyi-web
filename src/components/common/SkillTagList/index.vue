<template>
  <div class="skill-tag-list">
    <!-- 简单排序模式 -->
    <div v-if="!groupByCategory" class="skill-tags-container" :class="containerClass">
      <SkillTag
        v-for="tag in sortedTags"
        :key="tag"
        :tag="tag"
        :size="size"
        :clickable="clickable"
        :selected="selectedTags.includes(tag)"
        :disabled="disabled"
        :show-category="showCategory"
        @click="handleTagClick"
      />
    </div>

    <!-- 分组排序模式 -->
    <div v-else class="skill-tags-grouped" :class="containerClass">
      <div
        v-for="category in sortedCategories"
        :key="category"
        class="skill-tag-group"
      >
        <h4
          v-if="showGroupTitle && groupedSortedTags[category]?.length > 0"
          class="skill-tag-group-title"
        >
          {{ categoryNames[category] }}
          <span class="count">({{ groupedSortedTags[category].length }})</span>
        </h4>
        <div class="skill-tag-group-content">
          <SkillTag
            v-for="tag in groupedSortedTags[category]"
            :key="tag"
            :tag="tag"
            :size="size"
            :clickable="clickable"
            :selected="selectedTags.includes(tag)"
            :disabled="disabled"
            :show-category="showCategory"
            @click="handleTagClick"
          />
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div v-if="showStats" class="skill-tag-stats">
      <span class="text-sm text-gray-500">
        共 {{ tags.length }} 个标签
        <span v-if="groupByCategory">
          - 🔵 工具: {{ stats.tool }} 个
          - 🟣 领域: {{ stats.field }} 个
          - 🩷 技能: {{ stats.skill }} 个
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SkillTag from '@/components/common/SkillTag/index.vue'
import { useSkillTags } from '@/composables/useSkillTags'
import type { SkillTagCategory } from '@/utils/skillTagUtils'

interface Props {
  /** 英文简写标签数组 */
  tags: string[]
  /** 是否按分类分组显示 */
  groupByCategory?: boolean
  /** 标签尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否可点击 */
  clickable?: boolean
  /** 选中的标签 */
  selectedTags?: string[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示分类信息 */
  showCategory?: boolean
  /** 是否显示分组标题 */
  showGroupTitle?: boolean
  /** 是否显示统计信息 */
  showStats?: boolean
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
  /** 容器样式类 */
  containerClass?: string
}

interface Emits {
  (e: 'tagClick', tag: string, category: SkillTagCategory, displayName: string): void
}

const props = withDefaults(defineProps<Props>(), {
  groupByCategory: false,
  size: 'md',
  clickable: false,
  selectedTags: () => [],
  disabled: false,
  showCategory: false,
  showGroupTitle: true,
  showStats: false,
  sortOrder: 'asc',
  containerClass: ''
})

const emit = defineEmits<Emits>()

const {
  sortTagsByCategory,
  groupAndSortTagsByCategory,
  getSortedCategories,
  getCategoryStats,
  categoryNames
} = useSkillTags()

// 计算排序后的标签
const sortedTags = computed(() => {
  return sortTagsByCategory(props.tags, props.sortOrder)
})

// 计算分组排序后的标签
const groupedSortedTags = computed(() => {
  return groupAndSortTagsByCategory(props.tags, props.sortOrder)
})

// 计算排序后的分类
const sortedCategories = computed(() => {
  return getSortedCategories(props.sortOrder)
})

// 计算统计信息
const stats = computed(() => {
  return getCategoryStats(props.tags)
})

// 处理标签点击
const handleTagClick = (tag: string, category: SkillTagCategory, displayName: string) => {
  if (props.clickable && !props.disabled) {
    emit('tagClick', tag, category, displayName)
  }
}
</script>

<style scoped>
/* 样式通过全局CSS文件 skill-tags.css 控制 */
.skill-tag-stats {
  @apply mt-3 pt-2 border-t border-gray-200 dark:border-gray-700;
}

.count {
  @apply text-xs opacity-70 ml-1;
}
</style>
