<template>
  <div class="job-detail-page">
    <TalentHeader />

    <div class="container mx-auto px-4 py-4">
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="text-gray-400 mt-4">加载中...</p>
        </div>
      </div>

      <div v-else-if="job" class="max-w-4xl mx-auto">
        <!-- 面包屑导航 -->
        <section class="py-2 mb-4">
          <div class="container mx-auto px-4">
            <nav class="flex items-center space-x-2 text-sm">
              <router-link to="/" class="text-gray-400 hover:text-primary transition-colors">首页</router-link>
              <span class="text-gray-500">/</span>
              <router-link to="/talent/jobs" class="text-gray-400 hover:text-primary transition-colors">企业需求池</router-link>
              <span class="text-gray-500">/</span>
              <span class="text-white">{{ job?.title || '岗位详情' }}</span>
            </nav>
          </div>
        </section>

        <div class="space-y-8">
          <!-- 岗位基本信息 -->
          <div class="glass-card rounded-lg p-4 sm:p-6 mb-8">
            <!-- 手机端垂直布局 -->
            <div class="block sm:hidden">
              <!-- 公司头像居中 -->
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 company-logo rounded-lg flex items-center justify-center">
                  <img v-if="job.enterprise?.logo" :src="job.enterprise.logo" :alt="job.enterprise?.enterpriseName" class="w-full h-full object-cover rounded-lg">
                  <span v-else class="text-2xl font-bold text-primary">
                    {{ getCompanyInitial(job.enterprise?.enterpriseName || '企') }}
                  </span>
                </div>
              </div>

              <!-- 岗位信息居中 -->
              <div class="text-center mb-4">
                <h3 class="text-xl font-bold mb-1">{{ job.title }}</h3>
                <p class="text-gray-400 mb-3">{{ job.enterprise?.enterpriseName }}</p>

                <!-- 信息标签垂直排列 -->
                <div class="space-y-2 text-sm mb-4">
                  <div class="flex items-center justify-center">
                    <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                    <span>{{ job.workLocation }}</span>
                  </div>
                  <div class="flex items-center justify-center">
                    <i class="ri-briefcase-line mr-1 text-gray-400"></i>
                    <span>{{ job.experienceRequired }}</span>
                  </div>
                  <div class="flex items-center justify-center">
                    <i class="ri-graduation-cap-line mr-1 text-gray-400"></i>
                    <span>{{ job.educationRequired }}</span>
                  </div>
                </div>
              </div>

              <!-- 按钮组 -->
              <div class="flex justify-center space-x-2 mb-4">
                <button
                  @click="handleApply"
                  class="neon-button px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors flex-1 max-w-xs"
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

              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 justify-center">
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

            <!-- 桌面端水平布局 -->
            <div class="hidden sm:flex items-start mb-8">
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

      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold mb-2">岗位不存在</h2>
        <p class="text-gray-400 mb-6">抱歉，您查找的岗位可能已被删除或不存在</p>
        <button
          @click="$router.push('/talent/jobs')"
          class="neon-button px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回岗位列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import SkillTagList from '@/components/common/SkillTagList/index.vue'
import { getMockJobById } from '@/data/mockJobs'
import type { JobPosting } from '@/types/talent/job'
import { useSkillTags } from '@/composables/useSkillTags'

const route = useRoute()
const job = ref<JobPosting | null>(null)
const loading = ref(false)

const { parseSkillTags } = useSkillTags()

// 计算属性
const skillTags = computed(() => {
  return parseSkillTags(job.value?.skillsRequired || '[]')
})

const fetchJobDetail = async () => {
  loading.value = true
  try {
    const jobId = parseInt(route.params.id as string)
    // 这里使用模拟数据，实际项目中应该调用API
    job.value = getMockJobById(jobId)
  } catch (error) {
    console.error('获取岗位详情失败:', error)
  } finally {
    loading.value = false
  }
}

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

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleApply = () => {
  // 处理申请逻辑
  console.log('申请岗位:', job.value?.title)
}

onMounted(() => {
  fetchJobDetail()
})
</script>

<style scoped>
@import '@/styles/talent.css';

.job-detail-page {
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
}

.glass-card {
  background: rgba(28, 28, 30, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}

.neon-button {
  transition: all 0.3s ease;
}

.neon-button:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}
</style>
