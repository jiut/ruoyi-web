<template>
  <div class="job-card glass-card rounded-lg p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg">
    <div class="flex items-start">
      <!-- 公司Logo -->
      <div class="w-12 h-12 company-logo rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
        <img v-if="job.enterprise?.logo" :src="job.enterprise.logo" :alt="job.enterprise?.enterpriseName" class="w-full h-full object-cover rounded-lg">
        <span v-else class="text-lg font-bold text-primary">
          {{ getCompanyInitial(job.enterprise?.enterpriseName || '企') }}
        </span>
      </div>

      <!-- 岗位信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-white truncate">{{ job.title }}</h3>
          <span class="text-green-400 font-medium whitespace-nowrap ml-2">
            {{ formatSalary(job.salaryMin, job.salaryMax) }}
          </span>
        </div>

        <p class="text-gray-400 text-sm mb-3">
          {{ job.enterprise?.enterpriseName }} · {{ job.workLocation }}
        </p>

        <!-- 基础标签信息 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">
            {{ job.experienceRequired }}
          </span>
          <span class="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">
            {{ job.educationRequired }}
          </span>
          <span class="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">
            {{ job.workType }}
          </span>
          <span v-if="isUrgent" class="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs">
            急聘
          </span>
        </div>

        <!-- 技能标签 - 使用新的SkillTagList组件 -->
        <div v-if="skillTags.length > 0" class="mb-4">
          <SkillTagList
            :tags="skillTags"
            size="sm"
            :max-display="4"
            gap="sm"
            :clickable="false"
            @tag-click="handleSkillTagClick"
          />
          <!-- 显示更多技能提示 -->
          <span v-if="skillTags.length > 4" class="text-xs text-gray-500 ml-2">
            +{{ skillTags.length - 4 }} 项技能
          </span>
        </div>

        <!-- 底部信息 -->
        <div class="flex justify-between items-center">
          <p class="text-gray-400 text-xs">
            发布于 {{ formatPublishDate(job.publishDate) }}
          </p>
          <n-button
            size="small"
            type="primary"
            ghost
            @click.stop="$emit('view-detail', job.id)"
            class="hover:bg-primary/20"
          >
            查看详情
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import type { JobPosting } from '@/types/talent/job'
import SkillTagList from '@/components/common/SkillTagList/index.vue'
import { useSkillTags } from '@/composables/useSkillTags'
import type { SkillTagCategory } from '@/utils/skillTagUtils'

interface Props {
  job: JobPosting
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'view-detail': [jobId: number]
}>()

const { parseSkillTags } = useSkillTags()

// 解析技能标签（从JSON字符串转换为英文简写数组）
const skillTags = computed(() => {
  return parseSkillTags(props.job.skillsRequired || '[]')
})

const isUrgent = computed(() => {
  // 可以根据实际业务逻辑判断是否为急聘岗位
  return props.job.deadline && new Date(props.job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
})

// 方法
const getCompanyInitial = (companyName: string) => {
  return companyName.charAt(0).toUpperCase()
}

const formatSalary = (salaryMin?: number, salaryMax?: number) => {
  if (!salaryMin && !salaryMax) return '面议'

  if (salaryMin && salaryMax) {
    return `${(salaryMin / 1000).toFixed(0)}K-${(salaryMax / 1000).toFixed(0)}K`
  }

  if (salaryMin) {
    return `${(salaryMin / 1000).toFixed(0)}K+`
  }

  return '面议'
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

// 处理技能标签点击（可选功能）
const handleSkillTagClick = (tag: string, category: SkillTagCategory, displayName: string) => {
  console.log('技能标签被点击:', { tag, category, displayName })
  // 可以在这里实现技能标签的搜索或过滤功能
}
</script>

<style scoped>
.job-card {
  background: rgba(28, 28, 30, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.job-card:hover {
  border-color: rgba(10, 132, 255, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}
</style>
