<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSkillTags } from '@/composables/useSkillTags'
import SkillTag from '@/components/common/SkillTag/index.vue'
import type { Award, Designer, Education, Profession, Work, WorkExperience, WorkStatus } from '@/types/talent/designer'
import ProfessionUtils from '@/utils/professionUtils'
import {
  getDesignerComplete,
} from '@/api/talent/designer'
import { mockAwards, mockDesigners, mockEducation, mockWorkExperience, mockWorks } from '@/data/mockDesigners'

// 根据登录状态和环境变量切换数据源
import { shouldUseMockData } from '@/utils/authUtils'
const props = withDefaults(defineProps<Props>(), {
  designerId: null,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  contact: [designer: Designer]
  favorite: [designer: Designer]
  share: [designer: Designer]
}>()

const USE_MOCK_DATA = computed(() => shouldUseMockData())

console.log('🔍 设计师详情弹窗环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA.value)

interface Props {
  visible: boolean
  designerId?: number | null
}

// 技能标签组合式函数
const {
  getTagDisplayName: getSkillTagDisplayName,
  getTagClasses: getSkillTagClasses,
  parseSkillTags,
  sortTagsByCategory,
} = useSkillTags()

// 响应式状态
const isMobile = ref(false)
const currentTab = ref('all')
const loading = ref(false)
const designer = ref<Designer | null>(null)
const portfolioWorks = ref<Work[]>([])
const workExperience = ref<WorkExperience[]>([])
const educationBackground = ref<Education[]>([])
const awardsAndCertifications = ref<Award[]>([])

// 监听designerId和visible变化，获取数据
watch([() => props.designerId, () => props.visible], async ([newDesignerId, newVisible]) => {
  if (newVisible && newDesignerId)
    await loadDesignerData(newDesignerId)
}, { immediate: true })

// 加载设计师数据
const loadDesignerData = async (designerId: number) => {
  loading.value = true
  try {
    if (USE_MOCK_DATA.value) {
      // 使用模拟数据（组件层面的直接处理，更快速的开发体验）
      console.log('🔧 使用模拟数据 - 设计师详情弹窗')

      const designerData = mockDesigners.find(d => d.id === designerId)
      const worksData = mockWorks.filter(w => w.designerId === designerId)
      const workExpData = mockWorkExperience.filter(w => w.designerId === designerId)
        .sort((a: WorkExperience, b: WorkExperience) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )
      const educationData = mockEducation.filter(e => e.designerId === designerId)
        .sort((a: Education, b: Education) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )
      const awardsData = mockAwards.filter(a => a.designerId === designerId)
        .sort((a: Award, b: Award) => (b.year || 0) - (a.year || 0))

      designer.value = designerData || null
      portfolioWorks.value = worksData
      workExperience.value = workExpData
      educationBackground.value = educationData
      awardsAndCertifications.value = awardsData
    }
    else {
      // 使用聚合API调用后端接口
      console.log('🚀 使用聚合API - 设计师完整详情')

      const response = await getDesignerComplete(designerId)
      const data = response.data

      if (data && data.designer) {
        designer.value = data.designer
        portfolioWorks.value = data.works || []
        workExperience.value = data.workExperiences || []
        educationBackground.value = data.educations || []
        awardsAndCertifications.value = data.awards || []
      }
      else {
        designer.value = null
        portfolioWorks.value = []
        workExperience.value = []
        educationBackground.value = []
        awardsAndCertifications.value = []
      }
    }
  }
  catch (error) {
    console.error('加载设计师数据失败:', error)
    designer.value = null
    portfolioWorks.value = []
    workExperience.value = []
    educationBackground.value = []
    awardsAndCertifications.value = []
  }
  finally {
    loading.value = false
  }
}

// 设备检测
const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  isMobile.value = screenWidth < 1024
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    || (isTouchDevice && screenWidth < 1200)
}

// 方法
const handleBackdropClick = () => {
  closeDrawer()
}

const closeDrawer = () => {
  emit('update:visible', false)
}

const getDesignerInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const getProfessionLabel = (profession: Profession) => {
  return ProfessionUtils.getDisplayName(profession)
}

const getWorkStatusLabel = (status: WorkStatus) => {
  const statuses = {
    EMPLOYED: '在职',
    FREELANCER: '自由职业',
    SEEKING: '求职中',
    STUDENT: '学生',
  }
  return statuses[status] || '未知'
}

const getDesignerSkills = (designer: Designer) => {
  try {
    const skills = parseSkillTags(designer.skillTags || '[]')
    if (!Array.isArray(skills))
      return []

    // 使用分类排序：工具 → 专业领域 → 技能方法
    const sortedSkills = sortTagsByCategory(skills, 'asc')
    return sortedSkills.slice(0, 5) // 取前5个排序后的标签
  }
  catch {
    return []
  }
}

const getDesignerBio = (designer: Designer) => {
  return designer.description || `拥有 ${designer.workYears || designer.experience || 5} 年 ${getProfessionLabel(designer.profession)} 经验，专注于移动应用和 Web 产品的用户体验设计。擅长用户研究、交互设计和视觉设计，能够从用户需求出发，打造直观易用的产品界面。曾主导多个核心产品的设计工作，包括社交、游戏和企业应用等领域。热衷于设计系统构建，善于协调设计与开发团队的协作，确保设计方案的高效落地。`
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
    'bg-gradient-to-br from-cyan-500 to-blue-500',
  ]

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// 获取工作状态颜色
const getStatusColor = (status: WorkStatus | undefined) => {
  const statusColors: Record<string, string> = {
    EMPLOYED: 'bg-green-500',
    FREELANCER: 'bg-blue-500',
    SEEKING: 'bg-yellow-500',
    STUDENT: 'bg-purple-500',
  }

  return statusColors[status || ''] || 'bg-gray-500'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

const getAwardColorClass = (category: string) => {
  const colorMap: Record<string, string> = {
    DESIGN_AWARD: 'bg-yellow-500/20 text-yellow-500',
    CERTIFICATION: 'bg-blue-500/20 text-blue-500',
    COMPETITION: 'bg-green-500/20 text-green-500',
    RECOGNITION: 'bg-purple-500/20 text-purple-500',
  }
  return colorMap[category] || 'bg-gray-500/20 text-gray-500'
}

const getAwardIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    DESIGN_AWARD: 'ri-award-line ri-lg',
    CERTIFICATION: 'ri-verified-badge-line ri-lg',
    COMPETITION: 'ri-trophy-line ri-lg',
    RECOGNITION: 'ri-star-line ri-lg',
  }
  return iconMap[category] || 'ri-award-line ri-lg'
}

const getAwardLevelLabel = (level: string) => {
  const levelMap: Record<string, string> = {
    GOLD: '金奖',
    SILVER: '银奖',
    BRONZE: '铜奖',
    FINALIST: '入围奖',
    HONORABLE_MENTION: '荣誉提名',
  }
  return levelMap[level] || level
}

// 操作方法
const contactDesigner = () => {
  if (designer.value)
    emit('contact', designer.value)
}

const toggleFavorite = () => {
  if (designer.value)
    emit('favorite', designer.value)
}

const shareDesigner = () => {
  if (designer.value)
    emit('share', designer.value)
}

const viewWork = (work: Work) => {
  console.log('查看作品:', work)
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 窗口大小变化时重新检查设备
const handleResize = () => {
  checkDevice()
}
</script>

<template>
  <!-- 模态框覆盖层 -->
  <Transition name="modal-overlay" appear>
    <div v-if="visible" class="fixed inset-0 modal-overlay z-50" @click="handleBackdropClick">
      <!-- 设计师详情模态框/抽屉 -->
      <Transition name="modal" appear>
        <div
          v-if="visible"
          class="modal glass-card overflow-y-auto custom-scrollbar" :class="[
            isMobile
              ? 'fixed inset-0 w-full h-full rounded-none'
              : 'fixed w-full max-w-4xl max-h-[90vh] rounded-lg modal-centered',
          ]"
          @click.stop
        >
          <div class="p-6">
            <!-- 抽屉头部 -->
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-2xl font-bold">
                设计师档案
              </h2>
              <button
                class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                @click="closeDrawer"
              >
                <i class="ri-close-line" />
              </button>
            </div>

            <div v-if="designer">
              <!-- 基本信息区 -->
              <div class="flex items-start mb-8">
                <div class="w-24 h-24 rounded-full overflow-hidden mr-6 avatar-glow">
                  <img
                    v-if="designer.avatar"
                    :src="designer.avatar"
                    :alt="designer.designerName"
                    class="w-full h-full object-cover"
                  >
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-white text-3xl font-bold" :class="[
                      getAvatarGradient(designer.designerName),
                    ]"
                  >
                    {{ getDesignerInitial(designer.designerName) }}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-2xl font-bold mb-1">
                        {{ designer.designerName }}
                      </h3>
                      <p class="text-gray-400 mb-2">
                        {{ getProfessionLabel(designer.profession) }} @ {{ designer.company || designer.enterprise?.name || '自由职业' }}
                      </p>
                      <div class="flex items-center text-sm mb-2">
                        <div v-if="designer.location" class="flex items-center mr-4">
                          <i class="ri-map-pin-line mr-1 text-gray-400" />
                          <span>{{ designer.location }}</span>
                        </div>
                        <div v-if="designer.workYears || designer.experience" class="flex items-center mr-4">
                          <i class="ri-time-line mr-1 text-gray-400" />
                          <span>{{ designer.workYears || designer.experience }} 年经验</span>
                        </div>
                        <div class="flex items-center">
                          <div
                            class="w-2 h-2 rounded-full mr-1" :class="[
                              getStatusColor(designer.workStatus),
                            ]"
                          />
                          <span>{{ getWorkStatusLabel(designer.workStatus || 'EMPLOYED' as WorkStatus) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        class="neon-button px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                        @click="contactDesigner"
                      >
                        联系我
                      </button>
                      <button
                        class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                        @click="toggleFavorite"
                      >
                        <i class="ri-heart-line" />
                      </button>
                      <button
                        class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                        @click="shareDesigner"
                      >
                        <i class="ri-share-line" />
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 ">
                    <SkillTag
                      v-for="skill in getDesignerSkills(designer)"
                      :key="skill"
                      :tag="skill"
                      size="sm"
                      :show-category="false"
                    />
                  </div>
                </div>
              </div>

              <!-- 个人简介 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">
                  个人简介
                </h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  {{ getDesignerBio(designer) }}
                </p>
              </div>

              <!-- 作品集 -->
              <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-bold">
                    作品集
                  </h3>
                  <div class="flex space-x-1 bg-gray-800/50 rounded-full p-1">
                    <button
                      class="px-4 py-1 rounded-full text-xs" :class="[
                        currentTab === 'all' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30',
                      ]"
                      @click="currentTab = 'all'"
                    >
                      全部
                    </button>
                    <button
                      class="px-4 py-1 rounded-full text-xs" :class="[
                        currentTab === 'ui' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30',
                      ]"
                      @click="currentTab = 'ui'"
                    >
                      UI 设计
                    </button>
                    <button
                      class="px-4 py-1 rounded-full text-xs" :class="[
                        currentTab === 'interaction' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30',
                      ]"
                      @click="currentTab = 'interaction'"
                    >
                      交互设计
                    </button>
                    <button
                      class="px-4 py-1 rounded-full text-xs" :class="[
                        currentTab === 'product' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30',
                      ]"
                      @click="currentTab = 'product'"
                    >
                      产品设计
                    </button>
                  </div>
                </div>
                <div v-if="portfolioWorks.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="work in portfolioWorks"
                    :key="work.id"
                    class="portfolio-item rounded-lg overflow-hidden cursor-pointer"
                    @click="viewWork(work)"
                  >
                    <img
                      :src="work.imageUrl || work.thumbnailUrl"
                      :alt="work.title"
                      class="w-full h-40 object-cover object-top"
                    >
                    <div class="p-3 bg-gray-900/80">
                      <h4 class="text-sm font-medium mb-1">
                        {{ work.title }}
                      </h4>
                      <p class="text-xs text-gray-400">
                        {{ work.category }}
                      </p>
                      <div v-if="work.likeCount || work.viewCount" class="flex gap-2 mt-1 text-xs text-gray-500">
                        <span v-if="work.likeCount" class="flex items-center gap-1">
                          <i class="ri-heart-line text-red-400" />
                          {{ work.likeCount }}
                        </span>
                        <span v-if="work.viewCount" class="flex items-center gap-1">
                          <i class="ri-eye-line text-gray-400" />
                          {{ work.viewCount }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-400">
                  暂无作品展示
                </div>
                <div class="flex justify-center mt-4">
                  <button class="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700/30 transition-colors">
                    查看全部作品 ({{ portfolioWorks.length }})
                  </button>
                </div>
              </div>

              <!-- 工作经历 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">
                  工作经历
                </h3>
                <div v-if="workExperience.length > 0" class="relative pl-6 border-l border-gray-700">
                  <div
                    v-for="(exp, index) in workExperience"
                    :key="exp.id"
                    class="relative" :class="[index < workExperience.length - 1 ? 'mb-6' : '']"
                  >
                    <div
                      class="absolute -left-[25px] w-5 h-5 rounded-full" :class="[
                        exp.isCurrent ? 'bg-primary' : 'bg-gray-600',
                      ]"
                    />
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="text-base font-medium">
                          {{ exp.company }}
                        </h4>
                        <p class="text-sm text-gray-400">
                          {{ exp.position }}
                        </p>
                      </div>
                      <span class="text-xs text-gray-400">
                        {{ formatDate(exp.startDate) }} - {{ exp.endDate ? formatDate(exp.endDate) : '至今' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-300">
                      {{ exp.description }}
                    </p>
                    <div v-if="exp.location || exp.industry" class="flex gap-4 mt-2 text-xs text-gray-400">
                      <span v-if="exp.location" class="flex items-center gap-1">
                        <i class="ri-map-pin-line" />
                        {{ exp.location }}
                      </span>
                      <span v-if="exp.industry" class="flex items-center gap-1">
                        <i class="ri-building-line" />
                        {{ exp.industry }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-400">
                  暂无工作经历信息
                </div>
              </div>

              <!-- 教育背景 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">
                  教育背景
                </h3>
                <div v-if="educationBackground.length > 0" class="relative pl-6 border-l border-gray-700">
                  <div
                    v-for="(edu, index) in educationBackground"
                    :key="edu.id"
                    class="relative" :class="[index < educationBackground.length - 1 ? 'mb-6' : '']"
                  >
                    <div
                      class="absolute -left-[25px] w-5 h-5 rounded-full" :class="[
                        edu.isCurrent ? 'bg-blue-500' : 'bg-gray-600',
                      ]"
                    />
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h4 class="text-base font-medium">
                          {{ edu.school }}
                        </h4>
                        <p class="text-sm text-gray-400">
                          {{ edu.major }} · {{ edu.degree }}
                        </p>
                      </div>
                      <span class="text-xs text-gray-400">
                        {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : '至今' }}
                      </span>
                    </div>
                    <p v-if="edu.description" class="text-sm text-gray-300">
                      {{ edu.description }}
                    </p>
                    <div v-if="edu.gpa || edu.ranking" class="flex gap-4 mt-2 text-xs text-gray-400">
                      <span v-if="edu.gpa" class="flex items-center gap-1">
                        <i class="ri-graduation-cap-line" />
                        GPA: {{ edu.gpa }}
                      </span>
                      <span v-if="edu.ranking && edu.totalStudents" class="flex items-center gap-1">
                        <i class="ri-bar-chart-line" />
                        排名: {{ edu.ranking }}/{{ edu.totalStudents }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-400">
                  暂无教育背景信息
                </div>
              </div>

              <!-- 获奖情况 -->
              <div class="glass-card rounded-lg p-6 mb-8">
                <h3 class="text-lg font-bold mb-4">
                  获奖与认证
                </h3>
                <div v-if="awardsAndCertifications.length > 0" class="space-y-4">
                  <div v-for="award in awardsAndCertifications" :key="award.id" class="flex items-start">
                    <div
                      class="w-10 h-10 flex items-center justify-center rounded-lg mr-4" :class="[
                        getAwardColorClass(award.category || 'DESIGN_AWARD'),
                      ]"
                    >
                      <i :class="getAwardIcon(award.category || 'DESIGN_AWARD')" />
                    </div>
                    <div>
                      <h4 class="text-base font-medium">
                        {{ award.title }}
                      </h4>
                      <p class="text-sm text-gray-400">
                        {{ award.description }}
                        <span v-if="award.level && award.level !== 'OTHER'"> · {{ getAwardLevelLabel(award.level) }}</span>
                      </p>
                      <div v-if="award.year || award.workTitle" class="flex gap-4 mt-1 text-xs text-gray-500">
                        <span v-if="award.year" class="flex items-center gap-1">
                          <i class="ri-calendar-line" />
                          {{ award.year }}
                        </span>
                        <span v-if="award.workTitle" class="flex items-center gap-1">
                          <i class="ri-brush-line" />
                          {{ award.workTitle }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-400">
                  暂无获奖与认证信息
                </div>
              </div>

              <!-- 联系方式 -->
              <div class="glass-card rounded-lg p-6">
                <h3 class="text-lg font-bold mb-4">
                  联系方式
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                      <i class="ri-mail-line ri-lg" />
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">
                        邮箱
                      </p>
                      <p class="text-sm">
                        {{ designer.email || 'chenyu@example.com' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                      <i class="ri-global-line ri-lg" />
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">
                        个人网站
                      </p>
                      <p class="text-sm">
                        {{ designer.portfolio || `www.${designer.designerName.toLowerCase()}design.com` }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-else-if="loading" class="flex justify-center items-center h-64">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>

            <!-- 空状态 -->
            <div v-else class="flex justify-center items-center h-64 text-gray-400">
              暂无数据
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
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

/* 电脑端模态框居中定位 */
.modal-centered {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 1rem;
}

/* 模态框缩放动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 电脑端动画 */
.modal-centered.modal-enter-from,
.modal-centered.modal-leave-to {
  transform: translate(-50%, -50%) scale(0.9) translateY(-20px);
}

.modal-centered.modal-enter-to,
.modal-centered.modal-leave-from {
  transform: translate(-50%, -50%) scale(1) translateY(0);
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

.portfolio-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.portfolio-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
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

.tab-active {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(28, 28, 30, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 99, 102, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 99, 102, 0.5);
}
</style>
