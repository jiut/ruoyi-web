<template>
  <div
    class="glass-card rounded-lg p-6 glow-border card-hover cursor-pointer"
    @click="$emit('click', designer)"
  >
    <div class="flex flex-col items-center">
      <!-- 头像 -->
      <div class="w-20 h-20 rounded-full overflow-hidden mb-4 avatar-glow">
        <img
          v-if="designer.avatar"
          :src="designer.avatar"
          :alt="designer.designerName"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold"
        >
          {{ getInitial(designer.designerName) }}
        </div>
      </div>

      <!-- 基本信息 -->
      <h3 class="text-lg font-bold mb-1">{{ designer.designerName }}</h3>
      <p class="text-gray-400 text-sm mb-3">{{ getProfessionLabel(designer.profession) }}</p>

      <!-- 技能标签 -->
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <n-tag
          v-for="skill in getDisplaySkills(designer.skillTags)"
          :key="skill"
          size="small"
          :color="getSkillTagColor(skill)"
          class="text-xs"
        >
          {{ getSkillTagLabel(skill) }}
        </n-tag>
      </div>

      <!-- 统计信息 -->
      <div class="w-full flex justify-between items-center text-xs text-gray-400 mb-4">
        <span>作品: {{ designer.works?.length || 0 }}</span>
        <span>经验: {{ designer.workYears || designer.experience || 0 }}年</span>
        <span class="flex items-center">
          <div
            :class="[
              'w-2 h-2 rounded-full mr-1',
              getStatusColor(designer.status)
            ]"
          />
          {{ getStatusText(designer.status) }}
        </span>
      </div>

      <!-- 操作按钮 -->
      <n-button
        class="w-full"
        type="primary"
        ghost
        size="small"
        @click.stop="$emit('detail', designer)"
      >
        查看档案
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NTag } from 'naive-ui'
import type { Designer, Profession, SkillTag } from '@/types/talent/designer'
import { ProfessionLabels, SkillTagLabels } from '@/types/talent/designer'

interface Props {
  designer: Designer
}

defineProps<Props>()

defineEmits<{
  click: [designer: Designer]
  detail: [designer: Designer]
}>()

// 获取姓名首字母
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

// 获取职业标签
const getProfessionLabel = (profession: Profession): string => {
  return ProfessionLabels[profession] || profession
}

// 获取技能标签显示（最多显示3个）
const getDisplaySkills = (skillTagsJson: string): SkillTag[] => {
  try {
    const skills = JSON.parse(skillTagsJson) as SkillTag[]
    return skills.slice(0, 3)
  } catch {
    return []
  }
}

// 获取技能标签显示名称
const getSkillTagLabel = (skill: SkillTag): string => {
  return SkillTagLabels[skill] || skill
}

// 获取技能标签颜色
const getSkillTagColor = (skill: SkillTag) => {
  const colorMap: Record<string, any> = {
    FIGMA: { color: '#0066CC', borderColor: '#0066CC' },
    SKETCH: { color: '#FDB300', borderColor: '#FDB300' },
    ADOBE_XD: { color: '#FF61F6', borderColor: '#FF61F6' },
    PHOTOSHOP: { color: '#31A8FF', borderColor: '#31A8FF' },
    ILLUSTRATOR: { color: '#FF9A00', borderColor: '#FF9A00' },
    default: { color: 'rgba(99, 102, 241, 0.8)', borderColor: 'rgba(99, 102, 241, 0.3)' }
  }

  return colorMap[skill] || colorMap.default
}

// 获取状态颜色
const getStatusColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    busy: 'bg-yellow-500',
    offline: 'bg-red-500'
  }

  return statusColorMap[status] || 'bg-gray-500'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusTextMap: Record<string, string> = {
    active: '活跃',
    inactive: '离线',
    busy: '忙碌',
    offline: '离线'
  }

  return statusTextMap[status] || '未知'
}
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

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

.avatar-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}
</style>
