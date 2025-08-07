<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import type { SimpleTask } from '@/data/mockTasks'
import SkillTagList from '@/components/common/SkillTagList/index.vue'
import TaskEditModal from './TaskEditModal.vue'
import { useSkillTags } from '@/composables/useSkillTags'
import { useRoleCheck } from '@/composables/useRoleCheck'
import { enterpriseTaskApi } from '@/api/talent/task'
import { mapTaskStatusToDisplay } from '@/utils/taskStatusUtils'

interface Props {
  visible: boolean
  task: SimpleTask | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'apply': [task: SimpleTask]
  'edit': [task: SimpleTask]
  'manageApplications': [task: SimpleTask]
  'viewStatistics': [task: SimpleTask]
}>()

// 角色检查
const { isEnterprise, isDesigner } = useRoleCheck()

// 响应式状态
const message = useMessage()
const showEditModal = ref(false)

// 计算属性
const skillTags = computed(() => {
  // 任务数据中的skillTags已经是字符串数组，直接使用即可
  return props.task?.skillTags || []
})

// 方法
const getCompanyInitial = (companyName: string) => {
  return companyName.charAt(0).toUpperCase()
}

const formatDescription = (description: string) => {
  if (!description)
    return ''
  return description.replace(/\n/g, '<br>')
}

const formatPriceRange = (task: SimpleTask) => {
  if (task.budgetMin === task.budgetMax) {
    return `¥${task.budgetMin.toLocaleString()}`
  }
  return `¥${task.budgetMin.toLocaleString()}-¥${task.budgetMax.toLocaleString()}`
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
    return `${diffDays}天内截止`
  } else {
    return `${deadlineDate.toLocaleDateString('zh-CN')} 截止`
  }
}

const formatPublishTime = (publishDate: string) => {
  const now = new Date()
  const published = new Date(publishDate)
  const diffTime = now.getTime() - published.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return `${diffMinutes}分钟前发布`
    }
    return `${diffHours}小时前发布`
  } else if (diffDays < 7) {
    return `${diffDays}天前发布`
  } else {
    return `发布于${published.toLocaleDateString('zh-CN')}`
  }
}

const getProjectDuration = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 3) {
    return '短期项目（1-3天）'
  } else if (diffDays <= 7) {
    return '短期项目（3-7天）'
  } else if (diffDays <= 15) {
    return '中期项目（1-2周）'
  } else if (diffDays <= 30) {
    return '中期项目（2-4周）'
  } else {
    return '长期项目（1个月以上）'
  }
}

const isUrgent = computed(() => {
  return props.task?.urgent || (props.task?.deadline && new Date(props.task.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
})

const handleBackdropClick = () => {
  closeModal()
}

const closeModal = () => {
  emit('update:visible', false)
}

const handleApply = () => {
  if (props.task)
    emit('apply', props.task)
}

const handleEdit = () => {
  if (props.task) {
    showEditModal.value = true
  }
}

// 处理任务编辑提交
const handleTaskSubmit = async (formData: any) => {
  try {
    if (formData.taskId) {
      // 更新任务
      await enterpriseTaskApi.update(formData.taskId, {
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        taskType: formData.taskType,
        skillTags: JSON.stringify(formData.skillTags),
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        deadline: formData.deadline,
        urgent: formData.urgent,
        deliverables: formData.deliverables,
        paymentTerms: formData.paymentTerms,
      } as any)
      message.success('任务更新成功')
      showEditModal.value = false

      // 通知父组件刷新任务数据
      if (props.task) {
        // 创建更新后的任务对象，包含最新的数据
        const updatedTask = {
          ...props.task,
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          taskType: formData.taskType,
          skillTags: formData.skillTags,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          deadline: formData.deadline,
          urgent: formData.urgent,
          deliverables: formData.deliverables,
          paymentTerms: formData.paymentTerms,
        }
        emit('edit', updatedTask)
      }
    }
  } catch (error) {
    console.error('任务更新失败:', error)
    message.error('任务更新失败，请稍后重试')
  }
}

const handleManageApplications = () => {
  if (props.task)
    emit('manageApplications', props.task)
}

const handleViewStatistics = () => {
  if (props.task)
    emit('viewStatistics', props.task)
}

const getTaskTypeDisplayName = (taskType: string) => {
  const typeMap: Record<string, string> = {
    'UI_UX_DESIGN': 'UI/UX设计',
    'BRAND_DESIGN': '品牌设计',
    'THREE_D_MODELING': '3D建模',
    'ANIMATION': '动效设计',
    'GRAPHIC_DESIGN': '平面设计',
    'WEB_DESIGN': '网页设计',
    'APP_DESIGN': '移动应用设计',
    'LOGO_DESIGN': 'Logo设计',
  }
  return typeMap[taskType] || taskType
}
</script>

<template>
  <!-- 模态框覆盖层 -->
  <Transition name="modal-overlay" appear>
    <div v-if="visible" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" @click="handleBackdropClick">
      <!-- 模态框主体 -->
      <Transition name="modal" appear>
        <div
          v-if="visible"
          class="modal glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-lg"
          @click.stop
        >
          <div class="p-6">
            <!-- 模态框头部 -->
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold">
                任务详情
              </h2>
              <button
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
                @click="closeModal"
              >
                <i class="ri-close-line ri-lg" />
              </button>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>

            <div v-else-if="task" class="space-y-8">
              <!-- 任务基本信息 -->
              <div class="rounded-lg p-6">
                <div class="flex items-start mb-8">
                  <div class="w-16 h-16 company-logo rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
                    <img v-if="task.enterprise?.logo" :src="task.enterprise.logo" :alt="task.enterpriseName" class="w-full h-full object-cover rounded-lg">
                    <span v-else class="text-2xl font-bold text-primary">
                      {{ getCompanyInitial(task.enterpriseName) }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="text-2xl font-bold mb-1">
                          {{ task.taskTitle }}
                        </h3>
                        <p class="text-gray-400 mb-2">
                          {{ task.enterpriseName }}
                        </p>
                        <div class="flex items-center text-sm mb-2 flex-wrap gap-4">
                          <div class="flex items-center">
                            <i class="ri-time-line mr-1 text-gray-400" />
                            <span>{{ formatDeadline(task.deadline) }}</span>
                          </div>
                          <div class="flex items-center">
                            <i class="ri-user-line mr-1 text-gray-400" />
                            <span>{{ task.applications }}人申请</span>
                          </div>
                          <div v-if="(task as any).views" class="flex items-center">
                            <i class="ri-eye-line mr-1 text-gray-400" />
                            <span>{{ (task as any).views }}人浏览</span>
                          </div>
                        </div>
                        <div class="text-sm text-gray-500 mb-3">
                          {{ formatPublishTime(task.publishDate) }} · {{ getProjectDuration(task.deadline) }}
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <!-- 设计师视角 - 申请相关按钮 -->
                        <template v-if="!isEnterprise">
                          <button
                            class="neon-button px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors !rounded-button whitespace-nowrap"
                            @click="handleApply"
                          >
                            立即申请
                          </button>
                          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                            <i class="ri-heart-line" />
                          </button>
                          <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                            <i class="ri-share-line" />
                          </button>
                        </template>

                        <!-- 企业管理员视角 - 任务管理按钮 -->
                        <template v-else>
                          <button
                            class="neon-button px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap"
                            @click="handleManageApplications"
                          >
                            管理申请
                          </button>
                          <button
                            class="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-lg text-sm hover:bg-purple-600/30 transition-colors whitespace-nowrap"
                            @click="handleEdit"
                          >
                            编辑任务
                          </button>
                          <button
                            class="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm hover:bg-green-600/30 transition-colors whitespace-nowrap"
                            @click="handleViewStatistics"
                          >
                            查看统计
                          </button>
                        </template>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <span class="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">
                        <i class="ri-money-dollar-circle-line mr-1" />
                        {{ formatPriceRange(task) }}
                      </span>
                      <span class="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <i class="ri-palette-line mr-1" />
                        {{ getTaskTypeDisplayName(task.taskType) }}
                      </span>
                      <span v-if="task.enterprise?.industry" class="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <i class="ri-building-line mr-1" />
                        {{ task.enterprise.industry }}
                      </span>
                      <span v-if="isUrgent" class="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                        <i class="ri-alarm-warning-line mr-1" />
                        紧急任务
                      </span>
                      <span class="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <i class="ri-shield-check-line mr-1" />
                        保障支付
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 任务描述 -->
              <div class="glass-card rounded-lg p-6 mb-8" style="margin-top: 0px;">
                <h3 class="text-lg font-bold mb-4 flex items-center">
                  <i class="ri-file-text-line mr-2 text-blue-400" />
                  任务描述
                </h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription(task.taskDescription)" />
              </div>

              <!-- 交付物要求 -->
              <div v-if="(task as any).deliverables" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4 flex items-center">
                  <i class="ri-package-line mr-2 text-green-400" />
                  交付物要求
                </h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription((task as any).deliverables)" />
              </div>

              <!-- 付款条款 -->
              <div v-if="(task as any).paymentTerms" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4 flex items-center">
                  <i class="ri-secure-payment-line mr-2 text-yellow-400" />
                  付款条款
                </h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription((task as any).paymentTerms)" />
              </div>

              <!-- 技能要求 -->
              <div v-if="skillTags.length > 0" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">
                  技能要求
                </h3>
                <SkillTagList
                  :tags="skillTags"
                  size="md"
                  gap="md"
                  :clickable="false"
                />
              </div>

              <!-- 项目信息 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4 flex items-center">
                  <i class="ri-information-line mr-2 text-cyan-400" />
                  项目信息
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                      <div class="flex items-center">
                        <i class="ri-palette-line text-blue-400 mr-2" />
                        <span class="text-gray-400">设计类型</span>
                      </div>
                      <span class="text-white font-medium">{{ getTaskTypeDisplayName(task.taskType) }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                      <div class="flex items-center">
                        <i class="ri-money-dollar-circle-line text-green-400 mr-2" />
                        <span class="text-gray-400">项目预算</span>
                      </div>
                      <span class="text-green-400 font-bold text-lg">{{ formatPriceRange(task) }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                      <div class="flex items-center">
                        <i class="ri-calendar-line text-red-400 mr-2" />
                        <span class="text-gray-400">截止时间</span>
                      </div>
                      <span class="text-white font-medium">{{ formatDeadline(task.deadline) }}</span>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                      <div class="flex items-center">
                        <i class="ri-time-line text-yellow-400 mr-2" />
                        <span class="text-gray-400">项目周期</span>
                      </div>
                      <span class="text-white font-medium">{{ getProjectDuration(task.deadline) }}</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                      <div class="flex items-center">
                        <i class="ri-pulse-line text-cyan-400 mr-2" />
                        <span class="text-gray-400">项目状态</span>
                      </div>
                      <span class="text-blue-400 font-medium">
                        {{ task.status === 'PUBLISHED' ? '🔥 热招中' : mapTaskStatusToDisplay(task.status) }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                      <div class="flex items-center">
                        <i class="ri-user-line text-orange-400 mr-2" />
                        <span class="text-gray-400">申请情况</span>
                      </div>
                      <span class="text-white font-medium">{{ task.applications }}人申请</span>
                    </div>
                  </div>
                </div>


              </div>

              <!-- 企业信息 -->
              <div v-if="task.enterprise" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4 flex items-center">
                  <i class="ri-building-4-line mr-2 text-indigo-400" />
                  发布企业
                </h3>
                <div class="flex items-start">
                  <div class="w-16 h-16 company-logo rounded-xl flex items-center justify-center mr-5 flex-shrink-0 ring-2 ring-indigo-500/20">
                    <img v-if="task.enterprise.logo" :src="task.enterprise.logo" :alt="task.enterprise.enterpriseName" class="w-full h-full object-cover rounded-xl">
                    <span v-else class="text-xl font-bold text-primary">
                      {{ getCompanyInitial(task.enterprise.enterpriseName) }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center mb-3">
                      <h4 class="text-xl font-bold">{{ task.enterprise.enterpriseName }}</h4>
                    </div>

                    <!-- 企业基本信息 -->
                    <div v-if="(task.enterprise as any).description" class="mb-4">
                      <p class="text-gray-300 text-sm leading-relaxed">{{ (task.enterprise as any).description }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div v-if="task.enterprise.industry" class="flex items-center p-2 bg-gray-800/20 rounded-lg">
                        <i class="ri-building-line text-purple-400 mr-2" />
                        <span class="text-gray-400 mr-2">行业：</span>
                        <span class="text-white font-medium">{{ task.enterprise.industry }}</span>
                      </div>
                      <div v-if="(task.enterprise as any).scale" class="flex items-center p-2 bg-gray-800/20 rounded-lg">
                        <i class="ri-team-line text-blue-400 mr-2" />
                        <span class="text-gray-400 mr-2">规模：</span>
                        <span class="text-white font-medium">{{ (task.enterprise as any).scale }}</span>
                      </div>
                      <div v-if="(task.enterprise as any).address" class="flex items-center p-2 bg-gray-800/20 rounded-lg">
                        <i class="ri-map-pin-line text-green-400 mr-2 flex-shrink-0" />
                        <span class="text-gray-400 mr-2 flex-shrink-0">地址：</span>
                        <span
                          class="text-white font-medium truncate min-w-0"
                          :title="(task.enterprise as any).address"
                        >
                          {{ (task.enterprise as any).address }}
                        </span>
                      </div>
                      <div v-if="(task.enterprise as any).website" class="flex items-center p-2 bg-gray-800/20 rounded-lg">
                        <i class="ri-global-line text-cyan-400 mr-2 flex-shrink-0" />
                        <span class="text-gray-400 mr-2 flex-shrink-0">网站：</span>
                        <a
                          :href="(task.enterprise as any).website"
                          target="_blank"
                          class="text-blue-400 font-medium hover:underline truncate min-w-0"
                          :title="(task.enterprise as any).website"
                        >
                          {{ (task.enterprise as any).website }}
                        </a>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <!-- 操作区域 -->
              <div class="mt-8">
                <!-- 设计师视角 - 申请相关内容 -->
                <template v-if="!isEnterprise">
                  <!-- 合作流程提示 -->
                  <div class="glass-card rounded-lg p-4 mb-6">
                    <h4 class="text-md font-medium mb-3 flex items-center">
                      <i class="ri-route-line mr-2 text-cyan-400" />
                      合作流程
                    </h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-send-plane-line text-blue-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">提交申请</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-user-settings-line text-green-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">企业筛选</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-tools-line text-purple-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">开始制作</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-money-dollar-circle-line text-yellow-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">交付结算</div>
                      </div>
                    </div>
                  </div>

                  <!-- 申请提示卡片 -->
                  <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                      <i class="ri-lightbulb-line text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <div class="font-medium text-yellow-400 mb-1">申请建议</div>
                        <div class="text-sm text-gray-300 leading-relaxed">
                          • 详细描述您的设计经验和相关作品<br>
                          • 提供与项目类型匹配的作品集链接<br>
                          • 说明您对项目的理解和设计思路<br>
                          • 合理报价，考虑项目复杂度和周期
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 申请按钮组 -->
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      class="flex-1 max-w-xs py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 neon-button flex items-center justify-center"
                      @click="handleApply"
                    >
                      <i class="ri-send-plane-2-line mr-2" />
                      立即申请项目
                    </button>
                    <button
                      class="flex-1 max-w-xs py-3 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-base font-medium hover:border-gray-500 hover:bg-gray-800/30 transition-colors flex items-center justify-center"
                      @click="closeModal"
                    >
                      <i class="ri-bookmark-line mr-2" />
                      先收藏项目
                    </button>
                  </div>

                  <!-- 底部保障信息 -->
                  <div class="mt-6 text-center">
                    <div class="flex items-center justify-center text-sm text-gray-400">
                      <i class="ri-shield-check-line text-green-400 mr-2" />
                      支付宝提供资金托管保障，确保项目安全完成
                    </div>
                  </div>
                </template>

                <!-- 企业管理员视角 - 任务管理内容 -->
                <template v-else>
                  <!-- 任务管理流程 -->
                  <div class="glass-card rounded-lg p-4 mb-6">
                    <h4 class="text-md font-medium mb-3 flex items-center">
                      <i class="ri-settings-3-line mr-2 text-purple-400" />
                      任务管理流程
                    </h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-file-text-line text-blue-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">发布任务</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-user-search-line text-green-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">筛选设计师</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-eye-line text-purple-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">监督进度</div>
                      </div>
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                          <i class="ri-checkbox-circle-line text-yellow-400 text-sm" />
                        </div>
                        <div class="text-xs text-gray-300">验收付款</div>
                      </div>
                    </div>
                  </div>

                  <!-- 任务管理建议 -->
                  <div class="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                      <i class="ri-lightbulb-line text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <div class="font-medium text-yellow-400 mb-1">管理建议</div>
                        <div class="text-sm text-gray-300 leading-relaxed">
                          • 及时查看和回复设计师的申请<br>
                          • 明确沟通设计需求和修改意见<br>
                          • 定期跟进项目进度和质量<br>
                          • 及时验收成果并完成结算
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 管理按钮组 -->
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      class="flex-1 max-w-xs py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 neon-button flex items-center justify-center"
                      @click="handleManageApplications"
                    >
                      <i class="ri-user-settings-line mr-2" />
                      管理申请者
                    </button>
                    <button
                      class="flex-1 max-w-xs py-3 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-base font-medium hover:border-gray-500 hover:bg-gray-800/30 transition-colors flex items-center justify-center"
                      @click="handleEdit"
                    >
                      <i class="ri-edit-line mr-2" />
                      编辑任务
                    </button>
                  </div>

                  <!-- 底部任务状态信息 -->
                  <div class="mt-6 text-center">
                    <div class="flex items-center justify-center text-sm text-gray-400">
                      <i class="ri-shield-check-line text-green-400 mr-2" />
                      智图工厂提供全流程任务管理和质量保障
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- 任务编辑弹窗 -->
  <TaskEditModal
    v-model:visible="showEditModal"
    :task="task"
    @submit="handleTaskSubmit"
  />
</template>

<style scoped>
@import '@/styles/talent.css';

/* 公司Logo */
.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}

/* 模态框覆盖层样式 */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 模态框覆盖层动画 */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

/* 模态框缩放动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>
