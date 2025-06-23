<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-12 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-4xl font-bold mb-2 text-white">设计师档案</h1>
            <p class="text-gray-300 max-w-2xl">
              汇聚 {{ designerCount.toLocaleString() }} 位优秀设计师，提供全方位设计人才展示与匹配服务
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧筛选栏 -->
          <div class="lg:w-1/4">
            <div class="filter-card rounded-lg p-6 sticky top-24">
              <div class="space-y-6">
                <!-- 职业方向筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">职业方向</h3>
                  <div class="space-y-2">
                    <label v-for="profession in professions" :key="profession.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedProfessions.includes(profession.value)"
                        @change="toggleProfession(profession.value)"
                      >
                      <span>{{ profession.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 技能标签筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">技能标签</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in skillTags"
                      :key="tag"
                      class="skill-tag text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-primary/30"
                      :class="{ 'bg-primary/30': selectedSkillTags.includes(tag) }"
                      @click="toggleSkillTag(tag)"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 工作年限筛选 -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-medium mb-0">工作年限</h3>
                    <span class="text-sm text-gray-400">{{ experienceRange }}年</span>
                  </div>
                  <div class="px-1 py-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      v-model="experienceRange"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    >
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0年</span>
                      <span>20年+</span>
                    </div>
                  </div>
                </div>

                <!-- 所在地区筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">所在地区</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedCities.includes(city)"
                        @change="toggleCity(city)"
                      >
                      <span>{{ city }}</span>
                    </label>
                  </div>
                </div>

                <!-- 工作状态筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">工作状态</h3>
                  <div class="space-y-2">
                    <label v-for="status in workStatuses" :key="status.value" class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="workStatus"
                        class="custom-radio"
                        :value="status.value"
                        v-model="selectedWorkStatus"
                      >
                      <span>{{ status.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 筛选按钮 -->
                <div class="flex space-x-3 pt-2">
                  <button
                    @click="resetFilters"
                    class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="lg:w-3/4">
            <!-- 排序和结果统计 -->
            <div class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">找到 <span class="text-white font-medium">{{ filteredDesignerCount }}</span> 位符合条件的设计师</p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                  >
                    <option value="latest">最近活跃</option>
                    <option value="experience">工作年限</option>
                    <option value="works">作品数量</option>
                    <option value="popularity">人气推荐</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 设计师列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <div
                v-for="designer in paginatedDesigners"
                :key="designer.id"
                :class="[
                  'designer-card rounded-lg glow-border card-hover cursor-pointer',
                  isMobile ? 'mobile-card' : 'desktop-card',
                  navigating && selectedDesigner?.id === designer.id ? 'navigating' : ''
                ]"
                @click="handleViewDetail(designer.id)"
              >
                <div class="p-6">
                  <div class="flex flex-col items-center">
                    <!-- 设计师头像 -->
                    <div class="w-20 h-20 rounded-full overflow-hidden mb-4 avatar-glow">
                      <img v-if="designer.avatar" :src="designer.avatar" :alt="designer.designerName" class="w-full h-full object-cover">
                      <div
                        v-else
                        :class="[
                          'w-full h-full flex items-center justify-center text-white text-2xl font-bold',
                          getAvatarGradient(designer.designerName)
                        ]"
                      >
                        {{ getDesignerInitial(designer.designerName) }}
                      </div>
                    </div>

                    <!-- 设计师信息 -->
                    <h3 class="text-lg font-bold mb-1 text-center">{{ designer.designerName }}</h3>
                    <p class="text-gray-400 text-sm mb-3 text-center">{{ getProfessionLabel(designer.profession) }}</p>

                    <!-- 技能标签 -->
                    <div class="flex flex-wrap justify-center gap-2 mb-4">
                      <span
                        v-for="skill in getDesignerSkills(designer)"
                        :key="skill"
                        :class="[
                          'text-xs px-2 py-1 rounded-full border transition-colors',
                          getSkillTagStyle(skill)
                        ]"
                      >
                        {{ skill }}
                      </span>
                    </div>

                    <!-- 统计信息 -->
                    <div class="w-full flex justify-between items-center text-xs text-gray-400 mb-4">
                      <span>作品: {{ getDesignerWorksCount(designer.id) }}</span>
                      <span>经验: {{ designer.experience || 0 }}年</span>
                      <span class="flex items-center">
                        <div
                          :class="[
                            'w-2 h-2 rounded-full mr-1',
                            getStatusColor(designer.workStatus)
                          ]"
                        />
                        {{ getWorkStatusLabel(designer.workStatus || 'EMPLOYED') }}
                      </span>
                    </div>

                    <!-- 查看档案按钮 -->
                    <button
                      @click.stop="handleViewDetail(designer.id)"
                      class="w-full py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-colors neon-button"
                    >
                      查看档案
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="flex justify-center mt-10 mb-6">
              <div class="flex space-x-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                >
                  <i class="ri-arrow-left-s-line"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'pagination-button w-10 h-10 flex items-center justify-center rounded-lg',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-blue-600/20'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                >
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计师详情抽屉 - 仅在桌面端显示 -->
    <DesignerDetailDrawer
      v-if="!isMobile"
      :visible="showDesignerDetail"
      :designer="selectedDesigner"
      @update:visible="showDesignerDetail = $event"
    />

    <!-- 页脚 -->
    <footer class="mt-16 py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">星海人才</h3>
            <p class="text-gray-400 text-sm">连接创意与科技，为设计师和企业搭建智能化人才对接平台</p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">功能模块</h3>
            <ul class="space-y-2">
              <li><router-link to="/talent/schools" class="text-gray-400 text-sm hover:text-blue-400">院校数据库</router-link></li>
              <li><router-link to="/talent/works" class="text-gray-400 text-sm hover:text-blue-400">学生作品库</router-link></li>
              <li><router-link to="/talent/jobs" class="text-gray-400 text-sm hover:text-blue-400">企业需求池</router-link></li>
              <li><router-link to="/talent/designers" class="text-gray-400 text-sm hover:text-blue-400">设计师档案</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">关于我们</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">公司介绍</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">加入我们</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">合作伙伴</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">联系方式</h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-mail-line mr-2"></i> contact@xinghairencai.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2"></i> 400-888-9999
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2"></i> 北京市海淀区中关村大街 18 号
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8"></div>
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">© 2025 星海人才. 保留所有权利</p>
          <div class="flex space-x-4">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-weibo-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-wechat-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-linkedin-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-github-line"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import DesignerDetailDrawer from '@/components/talent/DesignerDetailDrawer.vue'
import { SkillTag } from '@/components/common'
import { useDesigner } from '@/composables/talent/useDesigner'
import type { Designer, Profession, WorkStatus } from '@/types/talent/designer'
import { mockDesigners, mockWorks } from '@/data/mockDesigners'

const router = useRouter()
const { designers, loading, fetchDesigners } = useDesigner()

// 设备检测和导航状态
const isMobile = ref(false)
const navigating = ref(false)

const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  isMobile.value = screenWidth < 1024 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    (isTouchDevice && screenWidth < 1200)
}

const handleResize = () => {
  checkDevice()
}

// 筛选条件
const selectedProfessions = ref<string[]>([])
const selectedSkillTags = ref<string[]>([])
const selectedCities = ref<string[]>([])
const selectedWorkStatus = ref('')
const experienceRange = ref(10)
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(12)

// 模态框状态
const showDesignerDetail = ref(false)
const selectedDesigner = ref<Designer | null>(null)

// 筛选选项
const professions = [
  { value: 'UI_UX_DESIGNER', label: 'UI/UX 设计师' },
  { value: 'VISUAL_DESIGNER', label: '视觉设计师' },
  { value: 'INTERACTION_DESIGNER', label: '交互设计师' },
  { value: 'PRODUCT_DESIGNER', label: '产品设计师' },
  { value: 'THREE_D_DESIGNER', label: '3D 设计师' },
  { value: 'BRAND_DESIGNER', label: '品牌设计师' }
]

const skillTags = ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Blender', 'Cinema 4D']
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京']

const workStatuses = [
  { value: '', label: '全部' },
  { value: 'EMPLOYED', label: '在职' },
  { value: 'FREELANCER', label: '自由职业' },
  { value: 'SEEKING', label: '求职中' },
  { value: 'STUDENT', label: '学生' }
]

// 计算属性
const designerCount = computed(() => mockDesigners.length || 1248)

const filteredDesigners = computed(() => {
  let filtered = [...mockDesigners]

  // 职业筛选
  if (selectedProfessions.value.length > 0) {
    filtered = filtered.filter(designer => selectedProfessions.value.includes(designer.profession))
  }

  // 城市筛选
  if (selectedCities.value.length > 0) {
    filtered = filtered.filter(designer => selectedCities.value.includes(designer.location))
  }

  // 工作状态筛选
  if (selectedWorkStatus.value) {
    filtered = filtered.filter(designer => designer.workStatus === selectedWorkStatus.value)
  }

  // 工作年限筛选
  if (experienceRange.value < 20) {
    filtered = filtered.filter(designer => designer.experience <= experienceRange.value)
  }

  return filtered
})

const sortedDesigners = computed(() => {
  let sorted = [...filteredDesigners.value]

  switch (sortBy.value) {
    case 'experience':
      sorted.sort((a, b) => b.experience - a.experience)
      break
    case 'works':
      sorted.sort((a, b) => getDesignerWorksCount(b.id) - getDesignerWorksCount(a.id))
      break
    case 'latest':
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'popularity':
    default:
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedDesigners.value.length / itemsPerPage.value))

const paginatedDesigners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedDesigners.value.slice(start, end)
})

const filteredDesignerCount = computed(() => filteredDesigners.value.length)

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// 方法
const toggleProfession = (profession: string) => {
  const index = selectedProfessions.value.indexOf(profession)
  if (index > -1) {
    selectedProfessions.value.splice(index, 1)
  } else {
    selectedProfessions.value.push(profession)
  }
}

const toggleSkillTag = (tag: string) => {
  const index = selectedSkillTags.value.indexOf(tag)
  if (index > -1) {
    selectedSkillTags.value.splice(index, 1)
  } else {
    selectedSkillTags.value.push(tag)
  }
}

const toggleCity = (city: string) => {
  const index = selectedCities.value.indexOf(city)
  if (index > -1) {
    selectedCities.value.splice(index, 1)
  } else {
    selectedCities.value.push(city)
  }
}

const resetFilters = () => {
  selectedProfessions.value = []
  selectedSkillTags.value = []
  selectedCities.value = []
  selectedWorkStatus.value = ''
  experienceRange.value = 10
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const handleViewDetail = async (designerId: number) => {
  const designer = mockDesigners.find(d => d.id === designerId)
  if (designer) {
    selectedDesigner.value = designer

    if (isMobile.value) {
      navigating.value = true
      try {
        await router.push(`/talent/designers/${designerId}`)
      } catch (error) {
        console.error('Navigation failed:', error)
        navigating.value = false
      }
    } else {
      showDesignerDetail.value = true
    }
  }
}

// 工具方法
const getDesignerInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const getProfessionLabel = (profession: Profession) => {
  const prof = professions.find(p => p.value === profession)
  return prof ? prof.label : profession
}

const getWorkStatusLabel = (status: WorkStatus) => {
  const statusObj = workStatuses.find(s => s.value === status)
  return statusObj ? statusObj.label : '未知'
}

const getDesignerWorksCount = (designerId: number) => {
  return mockWorks.filter(work => work.designerId === designerId).length
}

const getDesignerSkills = (designer: Designer) => {
  try {
    const skills = JSON.parse(designer.skillTags || '[]')
    return Array.isArray(skills) ? skills.slice(0, 3) : []
  } catch {
    return []
  }
}

// 获取头像渐变样式
const getAvatarGradient = (name: string) => {
  const gradients = [
    'bg-gradient-to-br from-primary to-purple-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-pink-500 to-red-500',
    'bg-gradient-to-br from-blue-500 to-primary',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-orange-500',
    'bg-gradient-to-br from-cyan-500 to-blue-500'
  ]

  // 根据姓名生成一致的渐变
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// 获取技能标签样式
const getSkillTagStyle = (skill: string) => {
  const skillStyles: Record<string, string> = {
    'Figma': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Sketch': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Adobe XD': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Photoshop': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Illustrator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'After Effects': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Blender': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Cinema 4D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '交互设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '用户研究': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '品牌设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '插画': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '动效': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '原型设计': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '用户体验': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '界面设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '设计系统': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '品牌标识': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '视觉识别': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Lottie': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '动画': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }

  return skillStyles[skill] || 'bg-blue-500/20 text-blue-400 border-blue-500/30'
}

// 获取工作状态颜色
const getStatusColor = (status: WorkStatus | undefined) => {
  const statusColors: Record<string, string> = {
    'EMPLOYED': 'bg-green-500',
    'FREELANCER': 'bg-blue-500',
    'SEEKING': 'bg-yellow-500',
    'STUDENT': 'bg-purple-500'
  }

  return statusColors[status || ''] || 'bg-gray-500'
}

onMounted(() => {
  console.log('🎯 设计师档案页面挂载完成')
  checkDevice()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
@import '@/styles/talent.css';
@import '@/styles/skill-tags.css';

.talent-page {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
	font-size: 16px !important;
}

.talent-page p {
  margin-bottom: 0;
}

/* 玻璃效果卡片 */
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 筛选卡片 */
.filter-card {
  background: rgba(28, 28, 30, 0.8);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 设计师卡片 */
.designer-card {
  background: rgba(28, 28, 30, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.designer-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 头像发光效果 */
.avatar-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

/* 自定义复选框 */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 4px;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-checkbox:checked {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 自定义单选按钮 */
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-radio:checked {
  border-color: #0a84ff;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0a84ff;
}

/* 自定义选择框 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.custom-select:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
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

/* 霓虹按钮效果 */
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

/* 分页按钮 */
.pagination-button {
  transition: all 0.2s ease;
}

.pagination-button:hover:not(.active):not(:disabled) {
  background-color: rgba(10, 132, 255, 0.2);
}

.pagination-button:disabled {
  cursor: not-allowed;
}

/* 分割线 */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.2), transparent);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }

  .designer-card {
    border: 1px solid rgba(99, 99, 102, 0.3);
  }

  .designer-card:active {
    border-color: rgba(10, 132, 255, 0.5);
  }
}

/* 导航加载状态 */
.navigating {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
}

.navigating::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border: 2px solid rgba(10, 132, 255, 0.3);
  border-top: 2px solid #0a84ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
