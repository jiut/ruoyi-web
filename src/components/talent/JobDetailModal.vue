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
              <h2 class="text-2xl font-bold">岗位详情</h2>
              <button
                @click="closeModal"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                <i class="ri-close-line ri-lg"></i>
              </button>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>

            <div v-else-if="job" class="space-y-8">
              <!-- 岗位基本信息 -->
              <div class="rounded-lg p-6 mb-8">
                <div class="flex items-start mb-8">
                  <div class="w-16 h-16 company-logo rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
                    <img v-if="job.enterprise?.logo" :src="job.enterprise.logo" :alt="job.enterprise?.enterpriseName" class="w-full h-full object-cover rounded-lg">
                    <span v-else class="text-2xl font-bold text-primary">
                      {{ getCompanyInitial(job.enterprise?.enterpriseName || '企') }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="text-2xl font-bold mb-1">{{ job.title }}</h3>
                        <p class="text-gray-400 mb-2">{{ job.enterprise?.enterpriseName }}</p>
                        <div class="flex items-center text-sm mb-2">
                          <div class="flex items-center mr-4">
                            <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                            <span>{{ job.workLocation }}</span>
                          </div>
                          <div class="flex items-center mr-4">
                            <i class="ri-briefcase-line mr-1 text-gray-400"></i>
                            <span>{{ job.experienceRequired }}</span>
                          </div>
                          <div class="flex items-center">
                            <i class="ri-graduation-cap-line mr-1 text-gray-400"></i>
                            <span>{{ job.educationRequired }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button
                          @click="handleApply"
                          class="neon-button px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors !rounded-button whitespace-nowrap"
                        >
                          立即申请
                        </button>
                        <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                          <i class="ri-heart-line"></i>
                        </button>
                        <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                          <i class="ri-share-line"></i>
                        </button>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <span class="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {{ formatSalary(job) }}
                      </span>
                      <span class="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {{ job.workType }}
                      </span>
                      <span v-if="job.enterprise?.industry" class="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {{ job.enterprise.industry }}
                      </span>
                      <span v-if="job.enterprise?.scale" class="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                        {{ job.enterprise.scale }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 职位描述 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">职位描述</h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription(job.description)"></div>
              </div>

              <!-- 任职要求 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">任职要求</h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription(job.requirements)"></div>
              </div>

              <!-- 技能要求 -->
              <div v-if="skillTags.length > 0" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">技能要求</h3>
                <SkillTagList
                  :tags="skillTags"
                  size="md"
                  :grouped="true"
                  :show-group-titles="true"
                  gap="md"
                  :clickable="false"
                />
              </div>

              <!-- 公司介绍 -->
              <div v-if="job.enterprise?.description" class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">公司介绍</h3>
                <div class="text-gray-300 text-sm leading-relaxed" v-html="formatDescription(job.enterprise.description)"></div>
              </div>

              <!-- 福利待遇 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">福利待遇</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3">
                      <i class="ri-health-book-line"></i>
                    </div>
                    <span class="text-gray-300">五险一金</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3">
                      <i class="ri-calendar-check-line"></i>
                    </div>
                    <span class="text-gray-300">年假15天</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500/20 text-pink-400 mr-3">
                      <i class="ri-award-line"></i>
                    </div>
                    <span class="text-gray-300">年终奖金</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-400 mr-3">
                      <i class="ri-stock-line"></i>
                    </div>
                    <span class="text-gray-300">股票期权</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 mr-3">
                      <i class="ri-user-heart-line"></i>
                    </div>
                    <span class="text-gray-300">带薪病假</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 mr-3">
                      <i class="ri-restaurant-line"></i>
                    </div>
                    <span class="text-gray-300">免费三餐</span>
                  </div>
                                </div>
              </div>

              <!-- 申请按钮 -->
              <div class="mt-8 flex justify-center">
                <button
                  @click="handleApply"
                  class="w-full max-w-sm py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/80 transition-colors neon-button"
                >
                  立即申请
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JobPosting } from '@/types/talent/job'
import SkillTagList from '@/components/common/SkillTagList/index.vue'
import { useSkillTags } from '@/composables/useSkillTags'

interface Props {
  visible: boolean
  job: JobPosting | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'apply': [job: JobPosting]
}>()

const { parseSkillTags } = useSkillTags()

// 计算属性
const skillTags = computed(() => {
  return parseSkillTags(props.job?.skillsRequired || '[]')
})

// 方法
const getCompanyInitial = (companyName: string) => {
  return companyName.charAt(0).toUpperCase()
}

const formatDescription = (description: string) => {
  if (!description) return ''
  return description.replace(/\n/g, '<br>')
}

const formatSalary = (job: JobPosting) => {
  if (job.salaryMin && job.salaryMax) {
    const minK = Math.round(job.salaryMin / 1000)
    const maxK = Math.round(job.salaryMax / 1000)
    return `${minK}K-${maxK}K`
  }
  return '面议'
}

const handleBackdropClick = () => {
  closeModal()
}

const closeModal = () => {
  emit('update:visible', false)
}

const handleApply = () => {
  if (props.job) {
    emit('apply', props.job)
  }
}
</script>

<style scoped>
@import '@/styles/talent.css';

/* 头像发光效果 */
.avatar-glow {
  position: relative;
}

.avatar-glow::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(45deg, #4f46e5, #7c3aed, #ec4899, #ef4444, #f59e0b, #10b981, #3b82f6);
  border-radius: 50%;
  z-index: -1;
  animation: rotate 4s linear infinite;
  filter: blur(8px);
  opacity: 0.7;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
