<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import type { SimpleTask } from '@/data/mockTasks'
import SkillTagList from '@/components/common/SkillTagList/index.vue'
import { getNameInitial } from '@/utils/styleGenerator'
import { useSkillTags } from '@/composables/useSkillTags'

interface Props {
  task: SimpleTask
  isMobile?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'view-detail': [taskId: string]
  'apply-task': [taskId: string]
}>()

const { groupTagsByCategory } = useSkillTags()

// 计算属性
const isUrgent = computed(() => {
  return props.task.urgent || (props.task.deadline && new Date(props.task.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
})

// 处理技能标签 - 每个分类最多显示一个
const filteredSkillTags = computed(() => {
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return []
  }

  // 按分类分组
  const grouped = groupTagsByCategory(props.task.skillTags)

  // 每个分类取第一个标签
  const filtered: string[] = []
  if (grouped.tool && grouped.tool.length > 0) {
    filtered.push(grouped.tool[0])
  }
  if (grouped.field && grouped.field.length > 0) {
    filtered.push(grouped.field[0])
  }
  if (grouped.skill && grouped.skill.length > 0) {
    filtered.push(grouped.skill[0])
  }

  return filtered
})

// 方法
const formatPriceRange = (minPrice: number, maxPrice: number) => {
  if (minPrice === maxPrice) {
    return `¥${minPrice.toLocaleString()}`
  }
  return `¥${minPrice.toLocaleString()}-¥${maxPrice.toLocaleString()}`
}

const formatDeadline = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return '已过期'
  } else if (diffDays === 0) {
    return '今天截止'
  } else if (diffDays === 1) {
    return '明天截止'
  } else if (diffDays <= 7) {
    return `${diffDays}天内`
  } else {
    return deadlineDate.toLocaleDateString('zh-CN')
  }
}

const formatPublishDate = (publishDate: string) => {
  if (!publishDate) return ''

  const now = new Date()
  const published = new Date(publishDate)
  const diffTime = now.getTime() - published.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return `${diffMinutes} 分钟前`
    }
    return `${diffHours} 小时前`
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else {
    return published.toLocaleDateString('zh-CN')
  }
}

// 处理点击事件
const handleApplyTask = () => {
  emit('apply-task', props.task.taskId || '')
}

const handleViewDetail = () => {
  emit('view-detail', props.task.taskId || '')
}
</script>

<template>
  <div
    class="task-card glass-card rounded-lg glow-border card-hover cursor-pointer"
    :class="[isMobile ? 'mobile-card' : 'desktop-card']"
    @click="handleViewDetail"
  >
    <div class="p-6">
      <div class="flex items-start">
        <!-- 企业Logo -->
        <div class="w-12 h-12 company-logo rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          <img
            v-if="task.enterprise?.logo"
            :src="task.enterprise.logo"
            :alt="task.enterpriseName"
            class="w-full h-full object-cover rounded-lg"
          >
          <span v-else class="text-lg font-bold text-primary">
            {{ getNameInitial(task.company || task.enterpriseName || '企业') }}
          </span>
        </div>

        <!-- 任务信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-bold mb-1 truncate text-white">
              {{ task.taskTitle }}
            </h3>
            <span class="text-green-400 font-medium whitespace-nowrap ml-2">
              {{ formatPriceRange(task.budgetMin, task.budgetMax) }}
            </span>
          </div>

          <p class="text-gray-400 text-sm mb-3">
            {{ task.company || task.enterpriseName || '未知企业' }}
          </p>

          <!-- 标签信息 -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
              {{ formatDeadline(task.deadline) }}
            </span>
            <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
              {{ task.applications }}人申请
            </span>
            <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
              {{ task.taskType }}
            </span>
            <span
              v-if="isUrgent"
              class="skill-tag text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
            >
              急聘
            </span>
          </div>

          <!-- 技能标签 -->
          <div v-if="filteredSkillTags.length > 0" class="mb-4">
            <SkillTagList
              :tags="filteredSkillTags"
              size="sm"
              gap="sm"
              :clickable="false"
            />
          </div>

          <!-- 任务描述 -->
          <p class="text-gray-300 text-sm mb-4 line-clamp-2">
            {{ task.taskDescription }}
          </p>

          <!-- 底部信息 -->
          <div class="flex justify-between items-center">
            <p class="text-gray-400 text-xs">
              发布于 {{ formatPublishDate(task.publishDate) }}
            </p>
            <button
              class="view-job-btn px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-colors whitespace-nowrap flex items-center"
              :class="[isMobile ? 'mobile-view-btn' : 'desktop-view-btn']"
              @click.stop="handleApplyTask"
            >
              <span>立即申请</span>
              <i v-if="isMobile" class="ri-arrow-right-s-line ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: rgba(28, 28, 30, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.task-card:hover {
  border-color: rgba(10, 132, 255, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}

.skill-tag {
  background: rgba(10, 132, 255, 0.2);
  border: 1px solid rgba(10, 132, 255, 0.3);
  color: #60a5fa;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 悬浮效果 */
.glow-border {
  position: relative;
}

.glow-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glow-border:hover::after {
  opacity: 1;
}

.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 移动端样式 */
.mobile-card {
  position: relative;
}

.mobile-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 16px;
  width: 6px;
  height: 6px;
  border-top: 2px solid rgba(148, 163, 184, 0.4);
  border-right: 2px solid rgba(148, 163, 184, 0.4);
  transform: translateY(-50%) rotate(45deg);
  transition: all 0.3s ease;
}

.mobile-card:hover::after {
  border-color: rgba(10, 132, 255, 0.6);
  transform: translateY(-50%) rotate(45deg) scale(1.1);
}

.desktop-card {
  position: relative;
}

.desktop-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(10, 132, 255, 0.05), rgba(191, 90, 242, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
  pointer-events: none;
}

.desktop-card:hover::before {
  opacity: 1;
}

.mobile-view-btn {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(191, 90, 242, 0.15));
  border: 1px solid rgba(10, 132, 255, 0.3);
}

.mobile-view-btn:hover {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.25), rgba(191, 90, 242, 0.25));
  transform: translateX(2px);
}

.desktop-view-btn:hover {
  background: rgba(10, 132, 255, 0.2);
  border-color: rgba(10, 132, 255, 0.5);
}
</style>
