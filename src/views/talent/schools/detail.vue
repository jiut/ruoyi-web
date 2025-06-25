<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-4 pb-8">
      <!-- 面包屑导航 -->
      <section class="py-2 mb-4">
        <div class="container mx-auto px-4">
          <nav class="flex items-center space-x-2 text-sm">
            <router-link to="/" class="text-gray-400 hover:text-primary transition-colors">首页</router-link>
            <span class="text-gray-500">/</span>
            <router-link to="/talent/schools" class="text-gray-400 hover:text-primary transition-colors">院校数据库</router-link>
            <span class="text-gray-500">/</span>
            <span class="text-white">{{ school?.schoolName || '院校详情' }}</span>
          </nav>
        </div>
      </section>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-400">加载中...</p>
      </div>

      <div v-else-if="!school" class="text-center py-12">
        <p class="text-gray-400">院校信息不存在</p>
        <router-link to="/talent/schools" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          返回院校列表
        </router-link>
      </div>

      <div v-else>
        <!-- 基本信息区 -->
        <div class="glass-card rounded-lg p-4 sm:p-8 mb-8">
          <!-- 手机端垂直布局 -->
          <div class="block sm:hidden">
            <!-- 院校Logo居中 -->
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 rounded-lg overflow-hidden avatar-glow">
                <img v-if="school.logo" :src="school.logo" :alt="school.schoolName" class="w-full h-full object-cover">
                <div v-else class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {{ getSchoolInitial(school.schoolName) }}
                </div>
              </div>
            </div>

            <!-- 院校信息居中 -->
            <div class="text-center mb-4">
              <h1 class="text-xl font-bold mb-1">{{ school.schoolName }}</h1>
              <p class="text-gray-400 mb-3 text-sm">{{ getSchoolTypeLabel(school.schoolType) }}</p>

              <!-- 信息标签垂直排列 -->
              <div class="space-y-2 text-sm mb-4">
                <div class="flex items-center justify-center">
                  <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                  <span>{{ school.location }}</span>
                </div>
                <div v-if="school.ranking" class="flex items-center justify-center">
                  <i class="ri-trophy-line mr-1 text-gray-400"></i>
                  <span>全国排名 {{ school.ranking }}</span>
                </div>
              </div>

              <!-- 特殊标识 -->
              <div class="flex gap-2 justify-center mb-4">
                <span v-if="school.is985" class="skill-tag text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">985</span>
                <span v-if="school.is211" class="skill-tag text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">211</span>
                <span v-if="school.isDoubleFirst" class="skill-tag text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">双一流</span>
              </div>
            </div>

            <!-- 按钮组 -->
            <div class="flex justify-center space-x-2 mb-4">
              <button class="neon-button px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors flex-1 max-w-xs">
                联系院校
              </button>
              <button @click="toggleFavorite" class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <i :class="isFavorited ? 'ri-heart-fill text-red-500' : 'ri-heart-line'"></i>
              </button>
              <button @click="shareSchool" class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                <i class="ri-share-line"></i>
              </button>
            </div>
          </div>

          <!-- 桌面端水平布局 -->
          <div class="hidden sm:flex items-start">
            <div class="w-24 h-24 rounded-lg overflow-hidden mr-6 avatar-glow flex-shrink-0">
              <img v-if="school.logo" :src="school.logo" :alt="school.schoolName" class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {{ getSchoolInitial(school.schoolName) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-3xl font-bold mb-2">{{ school.schoolName }}</h1>
                  <p class="text-gray-400 mb-3">{{ getSchoolTypeLabel(school.schoolType) }}</p>
                  <div class="flex items-center text-sm mb-4 space-x-6">
                    <div class="flex items-center">
                      <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                      <span>{{ school.location }}</span>
                    </div>
                    <div v-if="school.ranking" class="flex items-center">
                      <i class="ri-trophy-line mr-1 text-gray-400"></i>
                      <span>全国排名 {{ school.ranking }}</span>
                    </div>
                  </div>
                  <!-- 特殊标识 -->
                  <div class="flex gap-2 mb-4">
                    <span v-if="school.is985" class="skill-tag text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">985</span>
                    <span v-if="school.is211" class="skill-tag text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">211</span>
                    <span v-if="school.isDoubleFirst" class="skill-tag text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">双一流</span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="neon-button px-6 py-3 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                    联系院校
                  </button>
                  <button @click="toggleFavorite" class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                    <i :class="isFavorited ? 'ri-heart-fill text-red-500' : 'ri-heart-line'"></i>
                  </button>
                  <button @click="shareSchool" class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50">
                    <i class="ri-share-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详情内容标签页 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <!-- 标签页导航 -->
          <div class="flex border-b border-gray-700 mb-6 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap mr-6',
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              ]"
            >
              <i :class="tab.icon" class="mr-2"></i>
              {{ tab.label }}
            </button>
          </div>

          <!-- 标签页内容 -->
          <div class="tab-content">
            <!-- 院校概览 -->
            <div v-if="activeTab === 'overview'">
              <SchoolOverview :school="school" />
            </div>

            <!-- 专业设置 -->
            <div v-if="activeTab === 'majors'">
              <SchoolMajors :school-id="school.id" />
            </div>

            <!-- 师资力量 -->
            <div v-if="activeTab === 'faculty'">
              <SchoolFaculty :school-id="school.id" />
            </div>

            <!-- 学生信息 -->
            <div v-if="activeTab === 'students'">
              <SchoolStudents :school-id="school.id" />
            </div>

            <!-- 学生作品 -->
            <div v-if="activeTab === 'works'">
              <SchoolStudentWorks :school-id="school.id" />
            </div>

            <!-- 就业数据 -->
            <div v-if="activeTab === 'employment'">
              <SchoolEmployment :school-id="school.id" />
            </div>

            <!-- 获奖成果 -->
            <div v-if="activeTab === 'achievements'">
              <SchoolAchievements :school-id="school.id" />
            </div>
          </div>
        </div>

        <!-- 相关推荐 -->
        <div class="glass-card rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">相关院校推荐</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="relatedSchool in relatedSchools"
              :key="relatedSchool.id"
              class="related-school-card rounded-lg p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
              @click="goToSchool(relatedSchool.id)"
            >
              <div class="flex items-center mb-2">
                <div class="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img v-if="relatedSchool.logo" :src="relatedSchool.logo" :alt="relatedSchool.schoolName" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {{ getSchoolInitial(relatedSchool.schoolName) }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium truncate">{{ relatedSchool.schoolName }}</h3>
                  <p class="text-xs text-gray-400">{{ relatedSchool.location }}</p>
                </div>
              </div>
              <div class="flex gap-1">
                <span v-if="relatedSchool.is985" class="text-xs px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-400">985</span>
                <span v-if="relatedSchool.is211" class="text-xs px-1 py-0.5 rounded bg-blue-500/20 text-blue-400">211</span>
                <span v-if="relatedSchool.isDoubleFirst" class="text-xs px-1 py-0.5 rounded bg-purple-500/20 text-purple-400">双一流</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import SchoolOverview from '@/components/talent/SchoolOverview.vue'
import SchoolMajors from '@/components/talent/SchoolMajors.vue'
import SchoolFaculty from '@/components/talent/SchoolFaculty.vue'
import SchoolStudents from '@/components/talent/SchoolStudents.vue'
import SchoolStudentWorks from '@/components/talent/SchoolStudentWorks.vue'
import SchoolEmployment from '@/components/talent/SchoolEmployment.vue'
import SchoolAchievements from '@/components/talent/SchoolAchievements.vue'
import { useSchool } from '@/composables/talent/useSchool'
import type { School } from '@/types/talent/school'

const route = useRoute()
const router = useRouter()
const { schools, loading, fetchSchoolDetail, toggleFavorite: toggleSchoolFavorite, isFavorited: checkFavorited } = useSchool()

// 环境配置
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

const school = ref<School | null>(null)
const activeTab = ref('overview')
const isFavorited = ref(false)
const relatedSchools = ref<School[]>([])

// 标签页配置
const tabs = [
  { key: 'overview', label: '院校概览', icon: 'ri-building-line' },
  { key: 'majors', label: '专业设置', icon: 'ri-book-line' },
  { key: 'faculty', label: '师资力量', icon: 'ri-user-star-line' },
  { key: 'students', label: '学生信息', icon: 'ri-team-line' },
  { key: 'works', label: '学生作品', icon: 'ri-gallery-line' },
  { key: 'employment', label: '就业数据', icon: 'ri-line-chart-line' },
  { key: 'achievements', label: '获奖成果', icon: 'ri-award-line' }
]

// 获取院校ID
const schoolId = computed(() => {
  const id = route.params.id as string
  return parseInt(id)
})

// 获取院校信息
const getSchoolInfo = async () => {
  try {
    loading.value = true
    const id = schoolId.value

    if (USE_MOCK_DATA) {
      // 使用模拟数据
      console.log('🔧 使用模拟数据 - 院校详情页面')

      // 模拟院校数据
      school.value = {
        id,
        schoolName: '清华大学美术学院',
        schoolType: 'ART_DESIGN',
        location: '北京市海淀区',
        ranking: 1,
        description: '清华大学美术学院是中国最著名的设计艺术院校之一，前身为中央工艺美术学院。学院致力于培养具有国际视野和创新精神的设计人才。',
        logo: 'https://via.placeholder.com/150x150?text=清华美院',
        totalStudents: 3200,
        totalTeachers: 280,
        majorCount: 24,
        is985: true,
        is211: true,
        isDoubleFirst: true
      }

      // 模拟相关院校
      relatedSchools.value = [
        {
          id: 2,
          schoolName: '中央美术学院',
          location: '北京市朝阳区',
          logo: '',
          is985: false,
          is211: true,
          isDoubleFirst: true
        },
        {
          id: 3,
          schoolName: '中国美术学院',
          location: '浙江省杭州市',
          logo: '',
          is985: false,
          is211: false,
          isDoubleFirst: true
        },
        {
          id: 4,
          schoolName: '广州美术学院',
          location: '广东省广州市',
          logo: '',
          is985: false,
          is211: false,
          isDoubleFirst: false
        }
      ]

      isFavorited.value = checkFavorited(id)
    } else {
      // 使用后端API
      console.log('🚀 使用后端API - 院校详情页面')
      const result = await fetchSchoolDetail(id)
      school.value = result
      isFavorited.value = checkFavorited(id)

      // 获取相关院校（同类型或同地区）
      const allSchools = schools.value
      relatedSchools.value = allSchools
        .filter(s => s.id !== id && (s.schoolType === school.value?.schoolType || s.location === school.value?.location))
        .slice(0, 6)
    }
  } catch (error) {
    console.error('获取院校信息失败:', error)
    school.value = null
  } finally {
    loading.value = false
  }
}

// 工具方法
const getSchoolInitial = (schoolName: string) => {
  return schoolName.charAt(0).toUpperCase()
}

const getSchoolTypeLabel = (type: string) => {
  const labels = {
    'COMPREHENSIVE': '综合类',
    'SCIENCE_ENGINEERING': '理工类',
    'ART_DESIGN': '艺术设计类',
    'NORMAL': '师范类',
    'FINANCE': '财经类',
    'MEDICAL': '医学类'
  }
  return labels[type] || type
}

const toggleFavorite = async () => {
  if (!school.value) return

  try {
    await toggleSchoolFavorite(school.value.id)
    isFavorited.value = !isFavorited.value
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

const shareSchool = () => {
  if (!school.value) return

  const url = `${window.location.origin}/talent/schools/${school.value.id}`
  if (navigator.share) {
    navigator.share({
      title: `${school.value.schoolName} - 院校详情`,
      text: school.value.description,
      url
    })
  } else {
    navigator.clipboard.writeText(url)
    // 这里可以添加提示信息
  }
}

const goToSchool = (schoolId: number) => {
  router.push(`/talent/schools/${schoolId}`)
}

onMounted(async () => {
  await getSchoolInfo()
})
</script>

<style scoped>
@import '@/styles/talent.css';

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

.skill-tag {
  background: rgba(10, 132, 255, 0.2);
  border: 1px solid rgba(10, 132, 255, 0.3);
  color: #60a5fa;
}

.related-school-card {
  border: 1px solid rgba(99, 99, 102, 0.2);
  background: rgba(28, 28, 30, 0.3);
}

.related-school-card:hover {
  border-color: rgba(10, 132, 255, 0.3);
}

/* 标签页切换动画 */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .glass-card.mb-8 {
    margin-bottom: 2rem !important;
  }

  .flex.border-b.border-gray-700.mb-6.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .flex.border-b.border-gray-700.mb-6.overflow-x-auto::-webkit-scrollbar {
    height: 4px;
  }

  .flex.border-b.border-gray-700.mb-6.overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }
}
</style>
