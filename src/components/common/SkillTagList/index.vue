<template>
  <div :class="containerClasses">
    <!-- 普通列表模式 -->
    <template v-if="!grouped">
      <SkillTag
        v-for="(tag, index) in tags"
        :key="tag"
        :tag="tag"
        :size="size"
        :clickable="clickable"
        :show-category="showCategory"
        :selected="selectedTags.includes(tag)"
        :class="animationEnabled ? { 'animate-fade-in': true } : {}"
        :style="animationEnabled ? { 'animation-delay': `${index * 50}ms` } : {}"
        @click="handleTagClick"
      />
    </template>

    <!-- 分组模式 -->
    <template v-else>
      <div class="skill-tags-grouped">
        <div
          v-for="[category, categoryTags] in Object.entries(groupedTags)"
          :key="category"
          class="skill-tag-group"
        >
          <h4 v-if="showGroupTitles" class="skill-tag-group-title">
            {{ categoryNames[category as SkillTagCategory] }}
          </h4>
          <div class="skill-tag-group-content">
            <SkillTag
              v-for="tag in categoryTags"
              :key="tag"
              :tag="tag"
              :size="size"
              :clickable="clickable"
              :show-category="showCategory"
              :selected="selectedTags.includes(tag)"
              @click="handleTagClick"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 统计信息 -->
    <div v-if="showStats" class="skill-tags-stats mt-4">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="[category, count] in Object.entries(stats)"
          :key="category"
          class="text-center p-2 rounded-lg"
          :class="getCategoryStatsClasses(category as SkillTagCategory)"
        >
          <div class="font-bold text-lg">
            {{ count }}
          </div>
          <div class="text-xs">
            {{ categoryNames[category as SkillTagCategory] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SkillTag from '@/components/common/SkillTag/index.vue'
import { useSkillTags } from '@/composables/useSkillTags'
import type { SkillTagCategory } from '@/utils/skillTagUtils'

interface Props {
  /** 英文简写标签数组（如 ['figma', 'interaction_design']） */
  tags: string[]
  size?: 'sm' | 'md' | 'lg'
  grouped?: boolean
  showGroupTitles?: boolean
  showStats?: boolean
  clickable?: boolean
  showCategory?: boolean
  animationEnabled?: boolean
  selectedTags?: string[]
  maxDisplay?: number
  gap?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'tag-click', tag: string, category: SkillTagCategory, displayName: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  grouped: false,
  showGroupTitles: true,
  showStats: false,
  clickable: false,
  showCategory: false,
  animationEnabled: false,
  selectedTags: () => [],
  maxDisplay: 0,
  gap: 'md'
})

const emit = defineEmits<Emits>()

const {
  categoryNames,
  groupTagsByCategory,
  getCategoryStats
} = useSkillTags()

// 处理显示的标签数量限制
const displayTags = computed(() => {
  if (props.maxDisplay > 0) {
    return props.tags.slice(0, props.maxDisplay)
  }
  return props.tags
})

// 分组标签（从英文简写自动分类）
const groupedTags = computed(() => {
  if (!props.grouped) return {}
  return groupTagsByCategory(displayTags.value)
})

// 统计信息（从英文简写自动统计）
const stats = computed(() => {
  return getCategoryStats(displayTags.value)
})

// 容器样式类
const containerClasses = computed(() => {
  const gapMap = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  }

  let classes = 'skill-tags-container'

  if (!props.grouped) {
    classes += ` flex flex-wrap ${gapMap[props.gap]}`
  }

  if (props.animationEnabled) {
    classes += ' animate-stagger'
  }

  return classes
})

// 获取分类统计的样式类
const getCategoryStatsClasses = (category: SkillTagCategory): string => {
  const categoryColorMap = {
    tool: 'bg-blue-500/10 text-blue-400',
    field: 'bg-purple-500/10 text-purple-400',
    skill: 'bg-pink-500/10 text-pink-400'
  }
  return categoryColorMap[category] || categoryColorMap.skill
}

// 处理标签点击事件
const handleTagClick = (tag: string, category: SkillTagCategory, displayName: string) => {
  emit('tag-click', tag, category, displayName)
}
</script>

<style scoped>
/* 样式通过全局CSS文件 skill-tags.css 控制 */
</style>
