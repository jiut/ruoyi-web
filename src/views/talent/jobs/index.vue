<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import JobDetailModal from '@/components/talent/JobDetailModal.vue'
import JobApplicationModal from '@/components/talent/JobApplicationModal.vue'
import { SkillTag } from '@/components/common'
import { useJob } from '@/composables/talent/useJob'
import { useSkillTags } from '@/composables/useSkillTags'
import type { JobPosting } from '@/types/talent/job'
import ProfessionUtils from '@/utils/professionUtils'
import { getNameInitial } from '@/utils/styleGenerator'

const router = useRouter()
const { jobs, loading, fetchJobs } = useJob()
const { debugSkillTags, groupTagsByCategory } = useSkillTags()

// 设备检测和导航状态
const isMobile = ref(false)
const navigating = ref(false)

// 双端滑条状态
const isDragging = ref(false)
const dragTarget = ref<'min' | 'max' | null>(null)

const checkDevice = () => {
  // 检测屏幕宽度和用户代理
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // 综合判断移动设备
  isMobile.value = screenWidth < 1024
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    || (isTouchDevice && screenWidth < 1200)
}

// 监听窗口大小变化
const handleResize = () => {
  checkDevice()
}

// 添加触觉反馈（仅移动端）
const addHapticFeedback = () => {
  if (isMobile.value && 'vibrate' in navigator)
    navigator.vibrate(50) // 轻微震动 50ms
}

// 筛选条件
const selectedJobTypes = ref<string[]>([]) // 默认不筛选职位类型，显示所有职位
const selectedCities = ref<string[]>([]) // 默认不筛选城市
const selectedExperience = ref('') // 默认不筛选经验
const selectedWorkTypes = ref<string[]>([]) // 默认不筛选工作类型
const selectedScales = ref<string[]>([]) // 默认不筛选企业规模
const minSalary = ref(5) // 最小薪资范围
const maxSalary = ref(80) // 最大薪资范围
const urgentJobs = ref(false) // 默认不筛选急聘岗位
const freshGraduates = ref(false)
const weekends = ref(false) // 默认不筛选周末双休
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(8)

// 模态框状态
const showJobDetail = ref(false)
const showJobApplication = ref(false)
const selectedJob = ref<JobPosting | null>(null)

// 抽屉状态
const showFilterDrawer = ref(false)
const filterDrawerOpen = ref(false)

// 筛选选项
const jobTypes = ProfessionUtils.getSelectOptions()

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都']
const workTypes = ['全职', '兼职', '实习', '远程', '项目制']

const experiences = [
  { value: '应届', label: '应届毕业生' },
  { value: '1-3', label: '1-3 年' },
  { value: '3-5', label: '3-5 年' },
  { value: '5-10', label: '5-10 年' },
  { value: '10+', label: '10 年以上' },
]

const companyScales = [
  { value: '初创企业', label: '初创企业 (≤50人)' },
  { value: '中小企业', label: '中小企业 (50-500人)' },
  { value: '大型企业', label: '大型企业 (500-2000人)' },
  { value: '超大型企业', label: '超大型企业 (>2000人)' },
]

// 计算属性
const jobCount = computed(() => jobs.value.length || 1856)

const filteredJobs = computed(() => {
  let filtered = [...jobs.value]

  // 职位类型筛选
  if (selectedJobTypes.value.length > 0)
    filtered = filtered.filter(job => selectedJobTypes.value.includes(job.profession))

  // 城市筛选
  if (selectedCities.value.length > 0) {
    filtered = filtered.filter(job =>
      selectedCities.value.some(city => job.workLocation.includes(city)),
    )
  }

  // 工作经验筛选
  if (selectedExperience.value) {
    filtered = filtered.filter(job =>
      job.experienceRequired.includes(selectedExperience.value),
    )
  }

  // 工作类型筛选
  if (selectedWorkTypes.value.length > 0) {
    filtered = filtered.filter(job =>
      selectedWorkTypes.value.includes(job.workType),
    )
  }

  // 薪资范围筛选
  if (minSalary.value > 5 || maxSalary.value < 80) {
    filtered = filtered.filter((job) => {
      if (job.salaryMin && job.salaryMax) {
        const jobMinSalary = job.salaryMin / 1000
        const jobMaxSalary = job.salaryMax / 1000
        // 检查职位薪资范围是否与筛选条件有重叠
        return jobMaxSalary >= minSalary.value && jobMinSalary <= maxSalary.value
      }
      else {
        return true // 没有薪资信息的职位默认显示
      }
    })
  }

  return filtered
})

const sortedJobs = computed(() => {
  const sorted = [...filteredJobs.value]

  switch (sortBy.value) {
    case 'salary-high':
      sorted.sort((a, b) => extractSalaryNumber(b) - extractSalaryNumber(a))
      break
    case 'salary-low':
      sorted.sort((a, b) => extractSalaryNumber(a) - extractSalaryNumber(b))
      break
    case 'latest':
      sorted.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      break
    case 'hot':
    default:
      // 保持默认顺序或根据热度排序
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedJobs.value.length / itemsPerPage.value))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedJobs.value.slice(start, end)
})

const filteredJobCount = computed(() => filteredJobs.value.length)

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  for (let i = startPage; i <= endPage; i++)
    pages.push(i)

  return pages
})

// 活跃筛选条件数量
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedJobTypes.value.length > 0)
    count += selectedJobTypes.value.length
  if (selectedCities.value.length > 0)
    count += selectedCities.value.length
  if (selectedExperience.value)
    count += 1
  if (selectedWorkTypes.value.length > 0)
    count += selectedWorkTypes.value.length
  if (selectedScales.value.length > 0)
    count += selectedScales.value.length
  if (minSalary.value > 5 || maxSalary.value < 80)
    count += 1
  if (urgentJobs.value)
    count += 1
  if (freshGraduates.value)
    count += 1
  if (weekends.value)
    count += 1
  return count
})

// 方法
const toggleJobType = (type: string) => {
  const index = selectedJobTypes.value.indexOf(type)
  if (index > -1)
    selectedJobTypes.value.splice(index, 1)
  else
    selectedJobTypes.value.push(type)
}

const toggleCity = (city: string) => {
  const index = selectedCities.value.indexOf(city)
  if (index > -1)
    selectedCities.value.splice(index, 1)
  else
    selectedCities.value.push(city)
}

const toggleWorkType = (type: string) => {
  const index = selectedWorkTypes.value.indexOf(type)
  if (index > -1)
    selectedWorkTypes.value.splice(index, 1)
  else
    selectedWorkTypes.value.push(type)
}

const toggleScale = (scale: string) => {
  const index = selectedScales.value.indexOf(scale)
  if (index > -1)
    selectedScales.value.splice(index, 1)
  else
    selectedScales.value.push(scale)
}

const resetFilters = () => {
  selectedJobTypes.value = []
  selectedCities.value = []
  selectedExperience.value = ''
  selectedWorkTypes.value = []
  selectedScales.value = []
  minSalary.value = 5
  maxSalary.value = 80
  urgentJobs.value = false
  freshGraduates.value = false
  weekends.value = false
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

const handleViewDetail = async (jobId: number) => {
  const job = jobs.value.find(j => j.id === jobId)
  if (job) {
    selectedJob.value = job

    // 添加触觉反馈
    addHapticFeedback()

    // 根据设备类型选择导航方式
    if (isMobile.value) {
      // 移动端：跳转到独立页面
      navigating.value = true
      try {
        await router.push(`/talent/jobs/${jobId}`)
      }
      catch (error) {
        console.error('Navigation failed:', error)
        navigating.value = false
      }
    }
    else {
      // 桌面端：打开模态框
      showJobDetail.value = true
    }
  }
}

const handleApply = (job: JobPosting) => {
  selectedJob.value = job
  showJobDetail.value = false
  showJobApplication.value = true
}

const handleApplicationSubmit = (formData: any) => {
  console.log('Application submitted:', formData)
  showJobApplication.value = false
  // 这里可以添加提交申请的逻辑
}

const formatSalary = (job: JobPosting) => {
  if (job.salaryMin && job.salaryMax) {
    const minK = Math.round(job.salaryMin / 1000)
    const maxK = Math.round(job.salaryMax / 1000)
    return `${minK}K-${maxK}K`
  }
  return '面议'
}

const formatPublishDate = (publishDate: string) => {
  if (!publishDate)
    return ''

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
  }
  else if (diffDays < 7) {
    return `${diffDays} 天前`
  }
  else {
    return published.toLocaleDateString('zh-CN')
  }
}

const extractSalaryNumber = (job: JobPosting) => {
  if (job.salaryMin && job.salaryMax)
    return (job.salaryMin + job.salaryMax) / 2 / 1000 // 返回平均薪资的K值

  return 0
}

const isJobUrgent = (job: JobPosting) => {
  // 可以根据实际业务逻辑判断是否为急聘岗位
  return job.deadline && new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

// 获取岗位技能标签（用于页面显示，每种分类最多显示一个）
const getJobSkills = (job: JobPosting) => {
  try {
    const skills = JSON.parse(job.skillsRequired || '[]')
    if (!Array.isArray(skills))
      return []

    // 按分类分组标签
    const grouped = groupTagsByCategory(skills)

    // 每个分类最多取一个标签，优先级：tool > field > skill
    const result = []

    // 添加工具类标签（优先显示）
    if (grouped.tool && grouped.tool.length > 0)
      result.push(grouped.tool[0])

    // 添加领域类标签
    if (grouped.field && grouped.field.length > 0)
      result.push(grouped.field[0])

    // 添加技能类标签
    if (grouped.skill && grouped.skill.length > 0)
      result.push(grouped.skill[0])

    return result
  }
  catch {
    return []
  }
}

// 获取岗位所有技能标签（用于调试，显示全部）
const getAllJobSkills = (job: JobPosting) => {
  try {
    const skills = JSON.parse(job.skillsRequired || '[]')
    return Array.isArray(skills) ? skills : []
  }
  catch {
    return []
  }
}

// 已移除 getSkillTagClass 方法，现在使用全局 SkillTag 组件

// 双端滑条方法
let sliderContainer: HTMLElement | null = null

const startDragMin = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  dragTarget.value = 'min'
  addHapticFeedback()

  // 获取滑条容器元素
  sliderContainer = (e.currentTarget as HTMLElement).closest('.range-slider-container')

  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault()
    if (!isDragging.value || dragTarget.value !== 'min')
      return
    updateSliderValue(moveEvent, 'min')
  }

  const handleEnd = () => {
    isDragging.value = false
    dragTarget.value = null
    sliderContainer = null
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }

  document.addEventListener('mousemove', handleMove, { passive: false })
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)
}

const startDragMax = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  dragTarget.value = 'max'
  addHapticFeedback()

  // 获取滑条容器元素
  sliderContainer = (e.currentTarget as HTMLElement).closest('.range-slider-container')

  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault()
    if (!isDragging.value || dragTarget.value !== 'max')
      return
    updateSliderValue(moveEvent, 'max')
  }

  const handleEnd = () => {
    isDragging.value = false
    dragTarget.value = null
    sliderContainer = null
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }

  document.addEventListener('mousemove', handleMove, { passive: false })
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)
}

const handleMouseDown = (e: MouseEvent) => {
  if (e.target === e.currentTarget)
    updateSliderFromTrack(e)
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.target === e.currentTarget)
    updateSliderFromTrack(e)
}

const updateSliderFromTrack = (e: MouseEvent | TouchEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const value = Math.round(5 + percentage * (80 - 5))

  // 判断应该移动哪个滑块（距离哪个更近）
  const distanceToMin = Math.abs(value - minSalary.value)
  const distanceToMax = Math.abs(value - maxSalary.value)

  if (distanceToMin < distanceToMax)
    minSalary.value = Math.min(value, maxSalary.value - 1)
  else
    maxSalary.value = Math.max(value, minSalary.value + 1)

  addHapticFeedback()
}

const updateSliderValue = (e: MouseEvent | TouchEvent, target: 'min' | 'max') => {
  if (!sliderContainer)
    return

  const rect = sliderContainer.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const value = Math.round(5 + percentage * (80 - 5))

  if (target === 'min')
    minSalary.value = Math.min(value, maxSalary.value - 1)
  else
    maxSalary.value = Math.max(value, minSalary.value + 1)
}

// 抽屉相关方法
const toggleFilterDrawer = () => {
  if (showFilterDrawer.value)
    closeFilterDrawer()
  else
    openFilterDrawer()
}

const openFilterDrawer = () => {
  showFilterDrawer.value = true
  // 使用 nextTick 确保DOM更新后再添加动画类
  setTimeout(() => {
    filterDrawerOpen.value = true
  }, 10)

  // 阻止背景滚动
  document.body.style.overflow = 'hidden'
}

const closeFilterDrawer = () => {
  filterDrawerOpen.value = false
  // 等待动画完成后隐藏抽屉
  setTimeout(() => {
    showFilterDrawer.value = false
    document.body.style.overflow = ''
  }, 300)
}

onMounted(() => {
  console.log('🎯 页面挂载完成，开始获取岗位数据')
  fetchJobs()
  checkDevice()
  window.addEventListener('resize', handleResize)

  // 调试技能标签系统
  setTimeout(() => {
    if (jobs.value.length > 0) {
      const firstJob = jobs.value[0]
      const allSkills = getAllJobSkills(firstJob)
      console.log('🧪 技能标签系统调试 - 英文简写到中文转换测试:')
      console.log(`📊 职位: "${firstJob.title}"`)
      console.log(`📊 原始技能数据(英文简写): ${firstJob.skillsRequired}`)
      console.log('📊 解析后的英文简写数组:', allSkills)
      console.log('='.repeat(80))
      debugSkillTags(allSkills)
      console.log('='.repeat(80))
      console.log('✅ 标准架构验证完成：后端返回英文简写 -> 前端自动转换中文显示 + 分类着色')
    }
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // 确保页面卸载时恢复body滚动
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30" />
      <div class="container mx-auto px-10 relative z-10 title-section-container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-4xl font-bold mb-2 text-white">
              企业需求池
            </h1>
            <p class="text-gray-300 max-w-2xl">
              汇聚 {{ jobCount.toLocaleString() }} 家企业实时招聘需求，精准匹配设计人才，提供智能推荐服务
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧筛选栏 - 桌面端显示 -->
          <div class="lg:w-1/4 hidden lg:block">
            <div class="filter-card rounded-lg p-6 sticky top-24">
              <div class="space-y-6">
                <!-- 职位类型筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    职位类型
                  </h3>
                  <div class="space-y-2">
                    <label v-for="type in jobTypes" :key="type.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox" class="custom-checkbox" :checked="selectedJobTypes.includes(type.value)"
                        @change="toggleJobType(type.value)"
                      >
                      <span>{{ type.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 薪资范围筛选 -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-medium mb-0">
                      薪资范围
                    </h3>
                    <span class="text-sm text-gray-400">{{ minSalary }}K - {{ maxSalary }}K</span>
                  </div>
                  <div class="px-1 py-2">
                    <div class="range-slider-container" @mousedown="handleMouseDown" @touchstart="handleTouchStart">
                      <div class="range-slider-track" />
                      <div
                        class="range-slider-fill" :style="{
                          left: `${(minSalary - 5) / (80 - 5) * 100}%`,
                          width: `${(maxSalary - minSalary) / (80 - 5) * 100}%`,
                        }"
                      />
                      <div
                        class="range-slider-thumb range-slider-thumb-min"
                        :style="{ left: `${(minSalary - 5) / (80 - 5) * 100}%` }" @mousedown="startDragMin"
                        @touchstart="startDragMin"
                      >
                        <div class="range-slider-tooltip">
                          {{ minSalary }}K
                        </div>
                      </div>
                      <div
                        class="range-slider-thumb range-slider-thumb-max"
                        :style="{ left: `${(maxSalary - 5) / (80 - 5) * 100}%` }" @mousedown="startDragMax"
                        @touchstart="startDragMax"
                      >
                        <div class="range-slider-tooltip">
                          {{ maxSalary }}K
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 工作地点筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    工作地点
                  </h3>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox" class="custom-checkbox" :checked="selectedCities.includes(city)"
                        @change="toggleCity(city)"
                      >
                      <span>{{ city }}</span>
                    </label>
                  </div>
                  <button class="text-blue-400 text-sm mt-2">
                    更多城市
                  </button>
                </div>

                <!-- 工作经验筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    工作经验
                  </h3>
                  <div class="space-y-2">
                    <label v-for="exp in experiences" :key="exp.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedExperience" type="radio" name="experience" class="custom-radio"
                        :value="exp.value"
                      >
                      <span>{{ exp.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 工作类型筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    工作类型
                  </h3>
                  <div class="space-y-2">
                    <label v-for="type in workTypes" :key="type" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox" class="custom-checkbox" :checked="selectedWorkTypes.includes(type)"
                        @change="toggleWorkType(type)"
                      >
                      <span>{{ type }}</span>
                    </label>
                  </div>
                </div>

                <!-- 企业规模筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    企业规模
                  </h3>
                  <div class="space-y-2">
                    <label v-for="scale in companyScales" :key="scale.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox" class="custom-checkbox" :checked="selectedScales.includes(scale.value)"
                        @change="toggleScale(scale.value)"
                      >
                      <span>{{ scale.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 更多筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    更多筛选
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span>急聘岗位</span>
                      <label class="custom-switch">
                        <input v-model="urgentJobs" type="checkbox">
                        <span class="switch-slider" />
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>支持应届生</span>
                      <label class="custom-switch">
                        <input v-model="freshGraduates" type="checkbox">
                        <span class="switch-slider" />
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>周末双休</span>
                      <label class="custom-switch">
                        <input v-model="weekends" type="checkbox">
                        <span class="switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 筛选按钮 -->
                <div class="flex space-x-3 pt-2">
                  <button
                    class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
                    @click="resetFilters"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="lg:w-3/4 w-full">
            <!-- 排序和结果统计 -->
            <div
              class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">
                  找到 <span class="text-white font-medium">{{ filteredJobCount }}</span> 个符合条件的职位
                </p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                  >
                    <option value="latest">
                      最新发布
                    </option>
                    <option value="salary-high">
                      薪资从高到低
                    </option>
                    <option value="salary-low">
                      薪资从低到高
                    </option>
                    <option value="hot">
                      热门推荐
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 职位列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 mb-8">
              <!-- 使用完全匹配原HTML的卡片结构 -->
              <div
                v-for="job in paginatedJobs" :key="job.id" class="job-card rounded-lg glow-border card-hover cursor-pointer" :class="[
                  isMobile ? 'mobile-card' : 'desktop-card',
                  navigating && selectedJob?.id === job.id ? 'navigating' : '',
                ]" @click="handleViewDetail(job.id)"
              >
                <div class="p-6">
                  <div class="flex items-start">
                    <!-- 公司Logo -->
                    <div class="w-12 h-12 company-logo rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <img
                        v-if="job.enterprise?.logo" :src="job.enterprise.logo" :alt="job.enterprise?.enterpriseName"
                        class="w-full h-full object-cover rounded-lg"
                      >
                      <span v-else class="text-lg font-bold text-primary">
                        {{ getNameInitial(job.enterprise?.enterpriseName || '企') }}
                      </span>
                    </div>

                    <!-- 岗位信息 -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold mb-1 truncate">
                          {{ job.title }}
                        </h3>
                        <span class="text-green-400 font-medium whitespace-nowrap ml-2">
                          {{ formatSalary(job) }}
                        </span>
                      </div>

                      <p class="text-gray-400 text-sm mb-3">
                        {{ job.enterprise?.enterpriseName }} · {{ job.workLocation }}
                      </p>

                      <!-- 标签信息 -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ job.experienceRequired }}
                        </span>
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ job.educationRequired }}
                        </span>
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ job.workType }}
                        </span>
                        <span
                          v-if="isJobUrgent(job)"
                          class="skill-tag text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
                        >
                          急聘
                        </span>
                      </div>

                      <!-- 技能标签 -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <SkillTag v-for="skill in getJobSkills(job)" :key="skill" :tag="skill" :show-category="false" />
                      </div>

                      <!-- 底部信息 -->
                      <div class="flex justify-between items-center">
                        <p class="text-gray-400 text-xs">
                          发布于 {{ formatPublishDate(job.publishDate) }}
                        </p>
                        <button
                          class="view-job-btn px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-colors whitespace-nowrap flex items-center" :class="[
                            isMobile ? 'mobile-view-btn' : 'desktop-view-btn',
                          ]" @click.stop="handleViewDetail(job.id)"
                        >
                          <span>{{ isMobile ? '查看详情' : '查看详情' }}</span>
                          <i v-if="isMobile" class="ri-arrow-right-s-line ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="flex justify-center mt-10 mb-6">
              <div class="flex space-x-2">
                <button
                  :disabled="currentPage === 1" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="prevPage"
                >
                  <i class="ri-arrow-left-s-line" />
                </button>
                <button
                  v-for="page in visiblePages" :key="page" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg" :class="[
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-blue-600/20',
                  ]" @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="nextPage"
                >
                  <i class="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 岗位详情模态框 - 仅在桌面端显示 -->
    <JobDetailModal
      v-if="!isMobile" :visible="showJobDetail" :job="selectedJob"
      @update:visible="showJobDetail = $event" @apply="handleApply"
    />

    <!-- 岗位申请模态框 - 仅在桌面端显示 -->
    <JobApplicationModal
      v-if="!isMobile" :visible="showJobApplication" :job="selectedJob"
      @update:visible="showJobApplication = $event" @submit="handleApplicationSubmit"
    />

    <!-- 移动端悬浮筛选按钮 -->
    <button
      v-if="isMobile" class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-40 lg:hidden flex items-center justify-center floating-filter-btn"
      :class="{ 'scale-110': showFilterDrawer }"
      @click="toggleFilterDrawer"
    >
      <i class="ri-filter-3-line text-xl" />
      <!-- 活跃筛选条件徽章 -->
      <span
        v-if="activeFiltersCount > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium border-2 border-white"
      >
        {{ activeFiltersCount > 9 ? '9+' : activeFiltersCount }}
      </span>
    </button>

    <!-- 移动端筛选抽屉 -->
    <div
      v-if="showFilterDrawer" class="fixed inset-0 z-50 lg:hidden overflow-hidden filter-drawer-container"
      style="margin: 0; padding: 0; width: 100vw; height: 100vh;" @click="closeFilterDrawer"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <!-- 抽屉内容 -->
      <div
        class="absolute top-0 bottom-0 filter-card filter-drawer transform transition-transform duration-300 ease-out flex flex-col"
        :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'" style="right: 0px; width: min(320px, 85vw);"
        @click.stop
      >
        <!-- 抽屉头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <h3 class="text-lg font-medium">
            筛选条件
          </h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors"
            @click="closeFilterDrawer"
          >
            <i class="ri-close-line" />
          </button>
        </div>

        <!-- 抽屉内容区 -->
        <div class="flex-1 overflow-y-auto filter-drawer-content">
          <div class="p-6">
            <div class="space-y-6">
              <!-- 职位类型筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  职位类型
                </h3>
                <div class="space-y-2">
                  <label v-for="type in jobTypes" :key="type.value" class="flex items-center cursor-pointer">
                    <input
                      type="checkbox" class="custom-checkbox" :checked="selectedJobTypes.includes(type.value)"
                      @change="toggleJobType(type.value)"
                    >
                    <span>{{ type.label }}</span>
                  </label>
                </div>
              </div>

              <!-- 薪资范围筛选 -->
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-medium mb-0">
                    薪资范围
                  </h3>
                  <span class="text-sm text-gray-400">{{ minSalary }}K - {{ maxSalary }}K</span>
                </div>
                <div class="px-1 py-2">
                  <div class="range-slider-container" @mousedown="handleMouseDown" @touchstart="handleTouchStart">
                    <div class="range-slider-track" />
                    <div
                      class="range-slider-fill" :style="{
                        left: `${(minSalary - 5) / (80 - 5) * 100}%`,
                        width: `${(maxSalary - minSalary) / (80 - 5) * 100}%`,
                      }"
                    />
                    <div
                      class="range-slider-thumb range-slider-thumb-min"
                      :style="{ left: `${(minSalary - 5) / (80 - 5) * 100}%` }" @mousedown="startDragMin"
                      @touchstart="startDragMin"
                    >
                      <div class="range-slider-tooltip">
                        {{ minSalary }}K
                      </div>
                    </div>
                    <div
                      class="range-slider-thumb range-slider-thumb-max"
                      :style="{ left: `${(maxSalary - 5) / (80 - 5) * 100}%` }" @mousedown="startDragMax"
                      @touchstart="startDragMax"
                    >
                      <div class="range-slider-tooltip">
                        {{ maxSalary }}K
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 工作地点筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  工作地点
                </h3>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                    <input
                      type="checkbox" class="custom-checkbox" :checked="selectedCities.includes(city)"
                      @change="toggleCity(city)"
                    >
                    <span>{{ city }}</span>
                  </label>
                </div>
                <button class="text-blue-400 text-sm mt-2">
                  更多城市
                </button>
              </div>

              <!-- 工作经验筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  工作经验
                </h3>
                <div class="space-y-2">
                  <label v-for="exp in experiences" :key="exp.value" class="flex items-center cursor-pointer">
                    <input
                      v-model="selectedExperience" type="radio" name="experience-mobile" class="custom-radio"
                      :value="exp.value"
                    >
                    <span>{{ exp.label }}</span>
                  </label>
                </div>
              </div>

              <!-- 工作类型筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  工作类型
                </h3>
                <div class="space-y-2">
                  <label v-for="type in workTypes" :key="type" class="flex items-center cursor-pointer">
                    <input
                      type="checkbox" class="custom-checkbox" :checked="selectedWorkTypes.includes(type)"
                      @change="toggleWorkType(type)"
                    >
                    <span>{{ type }}</span>
                  </label>
                </div>
              </div>

              <!-- 企业规模筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  企业规模
                </h3>
                <div class="space-y-2">
                  <label v-for="scale in companyScales" :key="scale.value" class="flex items-center cursor-pointer">
                    <input
                      type="checkbox" class="custom-checkbox" :checked="selectedScales.includes(scale.value)"
                      @change="toggleScale(scale.value)"
                    >
                    <span>{{ scale.label }}</span>
                  </label>
                </div>
              </div>

              <!-- 更多筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  更多筛选
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span>急聘岗位</span>
                    <label class="custom-switch">
                      <input v-model="urgentJobs" type="checkbox">
                      <span class="switch-slider" />
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>支持应届生</span>
                    <label class="custom-switch">
                      <input v-model="freshGraduates" type="checkbox">
                      <span class="switch-slider" />
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>周末双休</span>
                    <label class="custom-switch">
                      <input v-model="weekends" type="checkbox">
                      <span class="switch-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 抽屉底部按钮 -->
        <div class="border-t border-gray-700/50 p-6 flex-shrink-0">
          <div class="flex space-x-3">
            <button
              class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
              @click="resetFilters"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="mt-16 py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">
              星海人才
            </h3>
            <p class="text-gray-400 text-sm">
              连接创意与科技，为设计师和企业搭建智能化人才对接平台
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">
              功能模块
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/talent/schools"
                  class="text-gray-400 text-sm hover:text-blue-400"
                >
                  院校数据库
                </router-link>
              </li>
              <li>
                <router-link to="/talent/works" class="text-gray-400 text-sm hover:text-blue-400">
                  学生作品库
                </router-link>
              </li>
              <li>
                <router-link to="/talent/jobs" class="text-gray-400 text-sm hover:text-blue-400">
                  企业需求池
                </router-link>
              </li>
              <li>
                <router-link
                  to="/talent/designers"
                  class="text-gray-400 text-sm hover:text-blue-400"
                >
                  设计师档案
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-white">
              关于我们
            </h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/"
                  class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">公司介绍</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">
              联系方式
            </h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-mail-line mr-2" /> 1151386302@qq.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2" /> 150-7240-0560
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2" /> 湖北省武汉市洪山区
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8" />
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 亿思（湖北省）科技有限公司. 保留所有权利
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-weibo-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-wechat-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-linkedin-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-github-line" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

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

/* 职位卡片中公司信息的样式 */
.job-card p.text-gray-400.text-sm {
  margin-bottom: 0.75rem;
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

/* 职位卡片 */
.job-card {
  background: rgba(28, 28, 30, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.job-card:hover {
  /* border-color: rgba(10, 132, 255, 0.3); */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 公司Logo */
.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}

/* 技能标签 */
.skill-tag {
  background: rgba(10, 132, 255, 0.2);
  border: 1px solid rgba(10, 132, 255, 0.3);
  color: #60a5fa;
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

/* 自定义开关 */
.custom-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-left: 8px;
}

.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(148, 163, 184, 0.2);
  transition: .4s;
  border-radius: 24px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .switch-slider {
  background-color: #0a84ff;
}

input:checked + .switch-slider:before {
  transform: translateX(20px);
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

/* 技能标签颜色变体已移至 skill-tags.css 文件，使用新的分类系统 */

/* 混合导航模式样式 */
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

/* 触摸反馈 */
@media (hover: none) and (pointer: coarse) {
  .mobile-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .mobile-view-btn:active {
    transform: translateX(2px) scale(0.95);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {

  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }

  /* 移动端卡片优化 */
  .job-card {
    border: 1px solid rgba(99, 99, 102, 0.3);
    margin: 0.5rem 0 !important;
  }

  .job-card:active {
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

/* 双端范围滑条样式 */
.range-slider-container {
  position: relative;
  height: 40px;
  margin: 10px 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.range-slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
  transform: translateY(-50%);
  pointer-events: auto;
}

.range-slider-fill {
  position: absolute;
  top: 50%;
  height: 6px;
  background: linear-gradient(90deg, #0a84ff, #bf5af2);
  border-radius: 3px;
  transform: translateY(-50%);
  transition: all 0.2s ease;
  pointer-events: none;
}

.range-slider-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: #0a84ff;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: grab;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: auto;
}

.range-slider-thumb:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.4);
}

.range-slider-thumb:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
}

.range-slider-thumb-max {
  background: #bf5af2;
}

.range-slider-thumb-max:hover {
  box-shadow: 0 4px 12px rgba(191, 90, 242, 0.4);
}

.range-slider-tooltip {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(28, 28, 30, 0.95);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  border: 1px solid rgba(99, 99, 102, 0.3);
  backdrop-filter: blur(8px);
}

.range-slider-thumb:hover .range-slider-tooltip {
  opacity: 1;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .range-slider-container {
    height: 50px;
  }

  .range-slider-thumb {
    width: 24px;
    height: 24px;
  }

  .range-slider-tooltip {
    bottom: 35px;
    padding: 6px 10px;
  }
}

/* 触摸反馈 */
@media (hover: none) and (pointer: coarse) {
  .range-slider-thumb:active {
    transform: translate(-50%, -50%) scale(1.3);
  }
}

/* 大屏幕优化 */
@media (min-width: 1024px) {
  .desktop-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .desktop-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .desktop-card.navigating:hover {
    transform: none;
  }
}

/* 悬浮筛选按钮样式 */
.floating-filter-btn {
  /* 添加更明显的阴影效果 */
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  /* 按钮脉冲动画 */
  animation: float 3s ease-in-out infinite;
}

.floating-filter-btn:hover {
  /* 悬停时的阴影效果 */
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

.floating-filter-btn:active {
  transform: translateY(-2px) scale(0.95);
}

/* 悬浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 徽章脉冲动画 */
.floating-filter-btn .bg-red-500 {
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 抽屉打开时按钮状态 */
.floating-filter-btn.scale-110 {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6) !important;
  transform: scale(1.1) rotate(180deg);
  animation: none;
}

.floating-filter-btn.scale-110:hover {
  transform: scale(1.15) rotate(180deg) translateY(-2px);
}

/* 防止悬浮按钮遮挡内容 */
@media (max-width: 1023px) {
  .pagination-button,
  .job-card:last-child {
    margin-bottom: 5rem;
  }
}

/* 抽屉进入和离开动画 */
.drawer-enter-active, .drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}

.drawer-enter-to, .drawer-leave-from {
  opacity: 1;
}

/* 抽屉内容滚动条样式 */
.filter-drawer-content {
  /* 确保滚动容器可以滚动 */
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  /* 在移动端启用平滑滚动 */
  scroll-behavior: smooth;
  /* 确保有明确的高度 */
  min-height: 0;
  flex: 1;
}

.filter-drawer-content::-webkit-scrollbar {
  width: 6px;
}

.filter-drawer-content::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
}

.filter-drawer-content::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.filter-drawer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* 确保抽屉使用正确的flexbox布局 */
.filter-drawer {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
}

/* 移动端优化 */
@media (max-width: 1023px) {
  .filter-toggle-btn {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .filter-card {
    box-shadow: none;
    border: 1px solid rgba(99, 99, 102, 0.3);
  }

  /* 移动端抽屉滚动优化 */
  .filter-drawer-content {
    /* 解决iOS Safari滚动问题 */
    -webkit-overflow-scrolling: touch !important;
    /* 确保触摸滚动生效 */
    touch-action: pan-y !important;
    /* 防止滚动时的弹性效果影响用户体验 */
    overscroll-behavior: contain;
  }

  /* 确保抽屉内容区域有正确的尺寸 */
  .filter-drawer {
    max-height: 100vh !important;
    min-height: 100vh !important;
  }

  /* 为滚动内容添加内边距，避免被底部按钮遮挡 */
  .filter-drawer-content .p-6 {
    padding-bottom: 2rem !important;
  }

  /* 移动端悬浮按钮位置优化 */
  .floating-filter-btn {
    /* 确保在小屏幕上位置合适 */
    bottom: 1.5rem !important;
    right: 1.5rem !important;
    /* 在移动端使用稍小的尺寸 */
    width: 3.5rem !important;
    height: 3.5rem !important;
  }

  /* 超小屏幕优化 */
  @media (max-width: 400px) {
    .floating-filter-btn {
      bottom: 1rem !important;
      right: 1rem !important;
      width: 3rem !important;
      height: 3rem !important;
    }

    .floating-filter-btn i {
      font-size: 1.125rem !important;
    }

    .floating-filter-btn .bg-red-500 {
      width: 1.25rem !important;
      height: 1.25rem !important;
      font-size: 0.625rem !important;
    }
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .floating-filter-btn {
    /* 移动端禁用悬浮动画，避免性能问题 */
    animation: none;
  }

  .floating-filter-btn:active {
    background: rgba(29, 78, 216, 0.9);
    transform: scale(0.9);
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);
  }

  /* 触摸反馈优化 */
  .floating-filter-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }

  .custom-checkbox:active,
  .custom-radio:active {
    transform: scale(1.1);
  }
}

/* 确保抽屉覆盖层完全覆盖页面 */
.talent-page {
  position: relative;
  overflow-x: hidden;
}

/* 移动端确保页面没有水平滚动条影响抽屉定位 */
@media (max-width: 1023px) {
  html, body {
    overflow-x: hidden;
  }

  .talent-page {
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* 彻底解决抽屉右边空隙问题 */
  .filter-drawer {
    position: absolute !important;
    right: 0 !important;
    transform-origin: 100% 50% !important;
  }

  /* 确保抽屉在translate时不会偏移 */
  .filter-drawer.translate-x-0 {
    transform: translateX(0) !important;
  }

  .filter-drawer.translate-x-full {
    transform: translateX(100%) !important;
  }
}

/* 修复可能的容器边距影响 */
@media (max-width: 1023px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* 页面标题区特定padding */
  .title-section-container {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  /* 抽屉容器额外样式 */
  .filter-drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
