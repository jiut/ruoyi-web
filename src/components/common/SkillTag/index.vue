<script setup lang="ts">
import { computed } from 'vue'
import { useSkillTags } from '@/composables/useSkillTags'
import type { SkillTagCategory } from '@/utils/skillTagUtils'

interface Props {
  /** 英文简写标签名称（如 'figma', 'interaction_design'） */
  tag: string
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  disabled?: boolean
  clickable?: boolean
  showCategory?: boolean
}

interface Emits {
  (e: 'click', tag: string, category: SkillTagCategory, displayName: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  disabled: false,
  clickable: false,
  showCategory: false,
})

const emit = defineEmits<Emits>()

const {
  getTagCategory,
  getTagDisplayName,
  getTagClasses,
  categoryNames,
  categoryDescriptions,
} = useSkillTags()

// 计算标签分类（从英文简写获取）
const tagCategory = computed(() => getTagCategory(props.tag))

// 计算中文显示名称（从英文简写转换）
const displayName = computed(() => getTagDisplayName(props.tag))

// 计算标签样式类名
const tagClasses = computed(() => {
  let classes = getTagClasses(props.tag, props.size)

  // 调试：输出生成的类名
  if (import.meta.env.DEV)
    console.log(`🏷️ SkillTag: "${props.tag}" -> 类名: "${classes}"`)

  // 添加状态类
  if (props.selected)
    classes += ' selected'

  if (props.disabled)
    classes += ' disabled'

  // 添加交互类
  if (props.clickable && !props.disabled)
    classes += ' cursor-pointer hover:scale-105 transition-transform duration-200'

  return classes
})

// 计算标签提示文本
const tagTitle = computed(() => {
  const category = tagCategory.value
  const categoryName = categoryNames.value[category]
  const categoryDesc = categoryDescriptions.value[category]

  let title = `${displayName.value}`

  if (props.showCategory)
    title += ` (${categoryName})`

  title += `\n分类: ${categoryDesc}`
  title += `\n英文代码: ${props.tag}`

  return title
})

// 处理点击事件
const handleClick = () => {
  if (props.clickable && !props.disabled)
    emit('click', props.tag, tagCategory.value, displayName.value)
}
</script>

<template>
  <span
    :class="tagClasses"
    :title="tagTitle"
    @click="handleClick"
  >
    <slot>{{ displayName }}</slot>
  </span>
</template>

<style scoped>
/* 样式通过全局CSS文件 skill-tags.css 控制 */
</style>
