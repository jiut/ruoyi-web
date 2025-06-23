<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 面包屑导航 -->
    <section class="py-4 border-b border-gray-800">
      <div class="container mx-auto px-4">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-400 hover:text-primary transition-colors">首页</router-link>
          <span class="text-gray-500">/</span>
          <router-link to="/talent/designers" class="text-gray-400 hover:text-primary transition-colors">设计师档案</router-link>
          <span class="text-gray-500">/</span>
          <span class="text-white">{{ designer?.designerName || '设计师详情' }}</span>
        </nav>
      </div>
    </section>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-400">加载中...</p>
      </div>

      <div v-else-if="!designer" class="text-center py-12">
        <p class="text-gray-400">设计师信息不存在</p>
        <router-link to="/talent/designers" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          返回设计师列表
        </router-link>
      </div>

      <div v-else>
        <!-- 基本信息区 -->
        <div class="glass-card rounded-lg p-8 mb-8">
          <div class="flex items-start">
            <div class="w-24 h-24 rounded-full overflow-hidden mr-6 avatar-glow flex-shrink-0">
              <img v-if="designer.avatar" :src="designer.avatar" :alt="designer.designerName" class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {{ getDesignerInitial(designer.designerName) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-3xl font-bold mb-2">{{ designer.designerName }}</h1>
                  <p class="text-gray-400 mb-3">{{ getProfessionLabel(designer.profession) }}</p>
                  <div class="flex items-center text-sm mb-4 space-x-6">
                    <div class="flex items-center">
                      <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                      <span>{{ designer.location }}</span>
                    </div>
                    <div class="flex items-center">
                      <i class="ri-time-line mr-1 text-gray-400"></i>
                      <span>{{ designer.experience }} 年经验</span>
                    </div>
                    <div class="flex items-center">
                      <i class="ri-user-line mr-1 text-gray-400"></i>
                      <span>{{ getWorkStatusLabel(designer.workStatus) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="neon-button px-6 py-3 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    联系我
                  </button>
                  <button class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                    <i class="ri-heart-line"></i>
                  </button>
                  <button class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                    <i class="ri-share-line"></i>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mt-4">
                <SkillTag
                  v-for="skill in getDesignerSkills(designer)"
                  :key="skill"
                  :tag="skill"
                  :show-category="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 个人简介 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-4">个人简介</h2>
          <p class="text-gray-300 text-sm leading-relaxed">
            {{ designer.description }}
          </p>
        </div>

        <!-- 作品集 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">作品集</h2>
            <div class="flex space-x-1 bg-gray-800/50 rounded-full p-1">
              <button
                v-for="category in workCategories"
                :key="category"
                @click="selectedWorkCategory = category"
                :class="[
                  'px-4 py-1 rounded-full text-xs transition-colors',
                  selectedWorkCategory === category
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-gray-300 hover:bg-gray-700/30'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="work in filteredWorks"
              :key="work.id"
              class="portfolio-item rounded-lg overflow-hidden cursor-pointer"
              @click="viewWork(work)"
            >
              <img :src="work.imageUrl" :alt="work.title" class="w-full h-48 object-cover">
              <div class="p-4 bg-gray-900/80">
                <h3 class="text-base font-medium mb-1">{{ work.title }}</h3>
                <p class="text-xs text-gray-400">{{ work.description }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <button class="px-6 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700/30 transition-colors">
              查看全部作品 ({{ designerWorks.length }})
            </button>
          </div>
        </div>

        <!-- 工作经历 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">工作经历</h2>
          <div class="relative pl-6 border-l border-gray-700">
            <div
              v-for="(experience, index) in workExperiences"
              :key="experience.id"
              class="mb-6 relative"
            >
              <div
                class="absolute -left-[25px] w-5 h-5 rounded-full"
                :class="experience.isCurrent ? 'bg-primary' : 'bg-gray-600'"
              ></div>
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-base font-medium">{{ experience.company }}</h3>
                  <p class="text-sm text-gray-400">{{ experience.position }}</p>
                </div>
                <span class="text-xs text-gray-400">
                  {{ formatDate(experience.startDate) }} - {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
                </span>
              </div>
              <p class="text-sm text-gray-300">{{ experience.description }}</p>
            </div>
          </div>
        </div>

        <!-- 教育背景 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">教育背景</h2>
          <div class="relative pl-6 border-l border-gray-700">
            <div
              v-for="edu in educations"
              :key="edu.id"
              class="mb-6 relative"
            >
              <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-blue-500"></div>
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="text-base font-medium">{{ edu.school }}</h3>
                  <p class="text-sm text-gray-400">{{ edu.major }} · {{ edu.degree }}</p>
                </div>
                <span class="text-xs text-gray-400">
                  {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
                </span>
              </div>
              <p class="text-sm text-gray-300">{{ edu.description }}</p>
            </div>
          </div>
        </div>

        <!-- 获奖情况 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">获奖与认证</h2>
          <div class="space-y-4">
            <div
              v-for="award in awards"
              :key="award.id"
              class="flex items-start"
            >
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500 mr-4">
                <i class="ri-award-line text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-medium">{{ award.title }}</h3>
                <p class="text-sm text-gray-400">{{ award.organization }} · {{ award.year }}</p>
                <p v-if="award.description" class="text-sm text-gray-300 mt-1">{{ award.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="glass-card rounded-lg p-6">
          <h2 class="text-xl font-bold mb-6">联系方式</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-4">
                <i class="ri-mail-line text-xl"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">邮箱</p>
                <p class="text-sm">{{ designer.email }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-4">
                <i class="ri-phone-line text-xl"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">电话</p>
                <p class="text-sm">{{ formatPhone(designer.phone) }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-4">
                <i class="ri-global-line text-xl"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">个人网站</p>
                <p class="text-sm">{{ designer.portfolio }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-4">
                <i class="ri-wechat-line text-xl"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">微信</p>
                <p class="text-sm">{{ getSocialLink('wechat') || '未设置' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import { SkillTag } from '@/components/common'
import { useSkillTags } from '@/composables/useSkillTags'
import type { Designer, Work, WorkExperience, Education, Award, Profession, WorkStatus } from '@/types/talent/designer'
import { mockDesigners, mockWorks, mockWorkExperience, mockEducation, mockAwards } from '@/data/mockDesigners'

const route = useRoute()
const { debugSkillTags } = useSkillTags()

const loading = ref(true)
const designer = ref<Designer | null>(null)
const selectedWorkCategory = ref('全部')

// 获取设计师ID
const designerId = computed(() => {
  const id = route.params.id as string
  return parseInt(id)
})

// 获取设计师信息
const getDesignerInfo = async () => {
  try {
    loading.value = true
    const id = designerId.value
    const foundDesigner = mockDesigners.find(d => d.id === id)
    if (foundDesigner) {
      designer.value = foundDesigner
    }
  } catch (error) {
    console.error('获取设计师信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取设计师作品
const designerWorks = computed(() => {
  if (!designer.value) return []
  return mockWorks.filter(work => work.designerId === designer.value!.id)
})

// 获取工作经历
const workExperiences = computed(() => {
  if (!designer.value) return []
  return mockWorkExperience.filter(exp => exp.designerId === designer.value!.id)
})

// 获取教育背景
const educations = computed(() => {
  if (!designer.value) return []
  return mockEducation.filter(edu => edu.designerId === designer.value!.id)
})

// 获取获奖信息
const awards = computed(() => {
  if (!designer.value) return []
  return mockAwards.filter(award => award.designerId === designer.value!.id)
})

// 作品分类
const workCategories = ['全部', 'UI设计', 'Web设计', '产品设计', '交互设计']

// 筛选后的作品
const filteredWorks = computed(() => {
  if (selectedWorkCategory.value === '全部') {
    return designerWorks.value
  }
  return designerWorks.value.filter(work => work.category === selectedWorkCategory.value)
})

// 工具方法
const getDesignerInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const getProfessionLabel = (profession: Profession) => {
  const professions = {
    'UI_UX_DESIGNER': 'UI/UX 设计师',
    'VISUAL_DESIGNER': '视觉设计师',
    'INTERACTION_DESIGNER': '交互设计师',
    'PRODUCT_DESIGNER': '产品设计师',
    'THREE_D_DESIGNER': '3D 设计师',
    'BRAND_DESIGNER': '品牌设计师'
  }
  return professions[profession] || profession
}

const getWorkStatusLabel = (status: WorkStatus) => {
  const statuses = {
    'EMPLOYED': '在职',
    'FREELANCER': '自由职业',
    'SEEKING': '求职中',
    'STUDENT': '学生'
  }
  return statuses[status] || status
}

const getDesignerSkills = (designer: Designer) => {
  try {
    const skills = JSON.parse(designer.skillTags || '[]')
    return Array.isArray(skills) ? skills : []
  } catch {
    return []
  }
}

const getSocialLink = (platform: string) => {
  if (!designer.value) return ''
  try {
    const links = JSON.parse(designer.value.socialLinks || '{}')
    return links[platform] || ''
  } catch {
    return ''
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

const formatPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}

const viewWork = (work: Work) => {
  console.log('查看作品:', work)
  // 这里可以打开作品详情模态框或跳转到作品详情页
}

onMounted(async () => {
  await getDesignerInfo()
})
</script>

<style scoped>
@import '@/styles/talent.css';
@import '@/styles/skill-tags.css';

.talent-page {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
}

.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.avatar-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

.neon-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0a84ff, #bf5af2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.neon-button:hover::before {
  opacity: 0.2;
}

.neon-button:active {
  transform: scale(0.98);
}

.portfolio-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
}

.portfolio-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}
</style>
