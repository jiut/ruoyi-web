<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import { getNameInitial } from '@/utils/styleGenerator'

const router = useRouter()

// 设备检测
const isMobile = ref(false)
const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

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
    navigator.vibrate(50)
}

// 智图工厂状态
const activeTab = ref('marketplace')
const myTasksFilter = ref('all')

// 抽屉状态
const showFilterDrawer = ref(false)
const filterDrawerOpen = ref(false)

// 筛选条件
const selectedTaskTypes = ref<string[]>([])
const selectedCities = ref<string[]>([])
const selectedExperience = ref('')
const selectedPriceRange = ref('')
const selectedDeadline = ref('')
const urgentTasks = ref(false)
const minPrice = ref(1000)
const maxPrice = ref(50000)
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(8)

// 标签页
const tabs = [
  { id: 'marketplace', name: '任务广场', icon: 'ri-store-line' },
  { id: 'my-tasks', name: '我的任务', icon: 'ri-task-line' },
  { id: 'matching', name: '智能匹配', icon: 'ri-magic-line' },
  { id: 'payment', name: '支付中心', icon: 'ri-wallet-line' },
]

// 筛选选项
const taskTypes = [
  { value: 'ui-design', label: 'UI/UX设计' },
  { value: 'graphic-design', label: '平面设计' },
  { value: 'brand-design', label: '品牌设计' },
  { value: '3d-modeling', label: '3D建模' },
  { value: 'animation', label: '动效设计' },
  { value: 'web-design', label: '网页设计' },
  { value: 'app-design', label: '移动应用设计' },
  { value: 'poster-design', label: '海报设计' },
]

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京']

const experiences = [
  { value: '应届', label: '应届毕业生' },
  { value: '1-3', label: '1-3 年' },
  { value: '3-5', label: '3-5 年' },
  { value: '5-10', label: '5-10 年' },
  { value: '10+', label: '10 年以上' },
]

const priceRanges = [
  { value: '0-2000', label: '2000元以下' },
  { value: '2000-5000', label: '2000-5000元' },
  { value: '5000-10000', label: '5000-10000元' },
  { value: '10000-20000', label: '10000-20000元' },
  { value: '20000+', label: '20000元以上' },
]

const deadlines = [
  { value: '1-3', label: '1-3天' },
  { value: '3-7', label: '3-7天' },
  { value: '7-15', label: '7-15天' },
  { value: '15-30', label: '15-30天' },
  { value: '30+', label: '30天以上' },
]

// 任务数据
const marketplaceTasks = ref([
  {
    id: 1,
    title: '电商App界面设计',
    client: '科技公司A',
    price: 8000,
    deadline: '3天',
    urgent: true,
    description: '需要设计一套电商App的完整UI界面，包含首页、商品详情、购物车等页面',
    tags: ['UI设计', 'App界面', 'Figma'],
    publishDate: '2025-01-20',
    applications: 15,
    location: '北京',
    experience: '3-5年',
    type: 'ui-design',
  },
  {
    id: 2,
    title: '企业品牌VI设计',
    client: '广告机构B',
    price: 15000,
    deadline: '7天',
    urgent: false,
    description: '设计企业完整的品牌视觉识别系统，包括logo、名片、办公用品等',
    tags: ['品牌设计', 'Logo', '企业VI'],
    publishDate: '2025-01-19',
    applications: 8,
    location: '上海',
    experience: '5-10年',
    type: 'brand-design',
  },
  {
    id: 3,
    title: '游戏角色3D建模',
    client: '游戏工作室C',
    price: 20000,
    deadline: '30天',
    urgent: false,
    description: '为游戏创建3D角色模型，包含贴图和动画骨骼',
    tags: ['3D建模', '游戏角色', 'Blender'],
    publishDate: '2025-01-18',
    applications: 12,
    location: '广州',
    experience: '5-10年',
    type: '3d-modeling',
  },
  {
    id: 4,
    title: '教育平台UI设计',
    client: '教育机构D',
    price: 12000,
    deadline: '5天',
    urgent: true,
    description: '设计在线教育平台的用户界面，注重用户体验和学习效率',
    tags: ['UI设计', '教育平台', '用户体验'],
    publishDate: '2025-01-17',
    applications: 20,
    location: '深圳',
    experience: '3-5年',
    type: 'ui-design',
  },
  {
    id: 5,
    title: '产品宣传动画制作',
    client: '互联网企业E',
    price: 18000,
    deadline: '10天',
    urgent: false,
    description: '制作30秒产品宣传动画，展示产品特性和使用场景',
    tags: ['动画制作', '产品宣传', 'After Effects'],
    publishDate: '2025-01-16',
    applications: 6,
    location: '杭州',
    experience: '3-5年',
    type: 'animation',
  },
  {
    id: 6,
    title: '社交媒体海报设计',
    client: '媒体公司F',
    price: 5000,
    deadline: '7天',
    urgent: false,
    description: '设计10张社交媒体宣传海报，风格统一，突出品牌特色',
    tags: ['平面设计', '社交媒体', 'Photoshop'],
    publishDate: '2025-01-15',
    applications: 25,
    location: '成都',
    experience: '1-3年',
    type: 'graphic-design',
  },
])

// 我的任务数据
const myTasksData = ref([
  { id: 1, name: '电商App界面设计', client: '科技公司A', deadline: '2025-01-25', amount: '¥8,000', status: '进行中' },
  { id: 2, name: '企业品牌VI设计', client: '广告机构B', deadline: '2025-01-20', amount: '¥15,000', status: '已完成' },
  { id: 3, name: '产品宣传海报设计', client: '互联网企业C', deadline: '2025-01-15', amount: '¥5,000', status: '已完成' },
  { id: 4, name: '教育平台UI设计', client: '教育机构D', deadline: '2025-01-30', amount: '¥12,000', status: '进行中' },
  { id: 5, name: '社交媒体图标设计', client: '媒体公司E', deadline: '2025-01-18', amount: '¥3,000', status: '待确认' },
])

// 支付记录数据
const paymentRecords = ref([
  { id: 1, date: '2025-01-18', description: '电商App界面设计', amount: '¥8,000', type: '收入', status: '已完成' },
  { id: 2, date: '2025-01-15', description: '企业品牌VI设计', amount: '¥15,000', type: '收入', status: '已完成' },
  { id: 3, date: '2025-01-10', description: '产品宣传海报设计', amount: '¥5,000', type: '收入', status: '已完成' },
  { id: 4, date: '2025-01-05', description: '教育平台UI设计', amount: '¥12,000', type: '收入', status: '处理中' },
])

// 计算属性
const taskCount = computed(() => marketplaceTasks.value.length)

const filteredTasks = computed(() => {
  let filtered = [...marketplaceTasks.value]

  // 任务类型筛选
  if (selectedTaskTypes.value.length > 0) {
    filtered = filtered.filter(task => selectedTaskTypes.value.includes(task.type))
  }

  // 城市筛选
  if (selectedCities.value.length > 0) {
    filtered = filtered.filter(task => selectedCities.value.includes(task.location))
  }

  // 经验筛选
  if (selectedExperience.value) {
    filtered = filtered.filter(task => task.experience === selectedExperience.value)
  }

  // 价格范围筛选
  if (minPrice.value > 1000 || maxPrice.value < 50000) {
    filtered = filtered.filter(task => {
      return task.price >= minPrice.value && task.price <= maxPrice.value
    })
  }

  // 急聘筛选
  if (urgentTasks.value) {
    filtered = filtered.filter(task => task.urgent)
  }

  return filtered
})

const sortedTasks = computed(() => {
  const sorted = [...filteredTasks.value]

  switch (sortBy.value) {
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'latest':
      sorted.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      break
    case 'applications':
      sorted.sort((a, b) => b.applications - a.applications)
      break
    default:
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedTasks.value.length / itemsPerPage.value))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedTasks.value.slice(start, end)
})

const filteredTaskCount = computed(() => filteredTasks.value.length)

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

// 活跃筛选条件数量
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedTaskTypes.value.length > 0) count += selectedTaskTypes.value.length
  if (selectedCities.value.length > 0) count += selectedCities.value.length
  if (selectedExperience.value) count += 1
  if (selectedPriceRange.value) count += 1
  if (selectedDeadline.value) count += 1
  if (urgentTasks.value) count += 1
  if (minPrice.value > 1000 || maxPrice.value < 50000) count += 1
  return count
})

// 方法
const toggleTaskType = (type: string) => {
  const index = selectedTaskTypes.value.indexOf(type)
  if (index > -1) {
    selectedTaskTypes.value.splice(index, 1)
  } else {
    selectedTaskTypes.value.push(type)
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
  selectedTaskTypes.value = []
  selectedCities.value = []
  selectedExperience.value = ''
  selectedPriceRange.value = ''
  selectedDeadline.value = ''
  urgentTasks.value = false
  minPrice.value = 1000
  maxPrice.value = 50000
}

const formatPrice = (price: number) => {
  return `¥${price.toLocaleString()}`
}

const formatPublishDate = (publishDate: string) => {
  const now = new Date()
  const published = new Date(publishDate)
  const diffTime = now.getTime() - published.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return published.toLocaleDateString('zh-CN')
  }
}

const handleApplyTask = (taskId: number) => {
  console.log('Apply for task:', taskId)
  addHapticFeedback()
}

const handleViewTaskDetail = (taskId: number) => {
  console.log('View task detail:', taskId)
  addHapticFeedback()
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

// 抽屉相关方法
const toggleFilterDrawer = () => {
  if (showFilterDrawer.value) {
    closeFilterDrawer()
  } else {
    openFilterDrawer()
  }
}

const openFilterDrawer = () => {
  showFilterDrawer.value = true
  setTimeout(() => {
    filterDrawerOpen.value = true
  }, 10)
  document.body.style.overflow = 'hidden'
}

const closeFilterDrawer = () => {
  filterDrawerOpen.value = false
  setTimeout(() => {
    showFilterDrawer.value = false
    document.body.style.overflow = ''
  }, 300)
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
              智图工厂
            </h1>
            <p class="text-gray-300 max-w-2xl">
              智能匹配设计需求与人才，汇聚 {{ taskCount.toLocaleString() }} 个设计任务，提供全流程任务管理与支付保障
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 标签导航 -->
    <section class="py-4">
      <div class="container mx-auto px-4">
        <div class="glass-card rounded-lg p-4">
          <div class="flex space-x-6 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="px-4 py-2 whitespace-nowrap cursor-pointer rounded-lg transition-all"
              :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon" class="mr-2" />
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 任务广场 -->
        <div v-if="activeTab === 'marketplace'" class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧筛选栏 - 桌面端显示 -->
          <div class="lg:w-1/4 hidden lg:block">
            <div class="filter-card rounded-lg p-6 sticky top-24">
              <div class="space-y-6">
                <!-- 任务类型筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">任务类型</h3>
                  <div class="space-y-2">
                    <label v-for="type in taskTypes" :key="type.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedTaskTypes.includes(type.value)"
                        @change="toggleTaskType(type.value)"
                      >
                      <span>{{ type.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 工作地点筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">工作地点</h3>
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

                <!-- 经验要求筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">经验要求</h3>
                  <div class="space-y-2">
                    <label v-for="exp in experiences" :key="exp.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedExperience"
                        type="radio"
                        name="experience"
                        class="custom-radio"
                        :value="exp.value"
                      >
                      <span>{{ exp.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 价格范围筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">价格范围</h3>
                  <div class="space-y-2">
                    <label v-for="range in priceRanges" :key="range.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedPriceRange"
                        type="radio"
                        name="price-range"
                        class="custom-radio"
                        :value="range.value"
                      >
                      <span>{{ range.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 更多筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">更多筛选</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span>急聘任务</span>
                      <label class="custom-switch">
                        <input v-model="urgentTasks" type="checkbox">
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
            <div class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">
                  找到 <span class="text-white font-medium">{{ filteredTaskCount }}</span> 个符合条件的任务
                </p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                  >
                    <option value="latest">最新发布</option>
                    <option value="price-high">价格从高到低</option>
                    <option value="price-low">价格从低到高</option>
                    <option value="applications">申请人数</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 任务列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 mb-8">
              <div
                v-for="task in paginatedTasks"
                :key="task.id"
                class="job-card rounded-lg glow-border card-hover cursor-pointer"
                :class="[isMobile ? 'mobile-card' : 'desktop-card']"
                @click="handleViewTaskDetail(task.id)"
              >
                <div class="p-6">
                  <div class="flex items-start">
                    <!-- 客户Logo -->
                    <div class="w-12 h-12 company-logo rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span class="text-lg font-bold text-primary">
                        {{ getNameInitial(task.client) }}
                      </span>
                    </div>

                    <!-- 任务信息 -->
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                        <h3 class="text-lg font-bold mb-1 truncate">
                          {{ task.title }}
                        </h3>
                        <span class="text-green-400 font-medium whitespace-nowrap ml-2">
                          {{ formatPrice(task.price) }}
                        </span>
                      </div>

                      <p class="text-gray-400 text-sm mb-3">
                        {{ task.client }} · {{ task.location }}
                      </p>

                      <!-- 标签信息 -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ task.deadline }}
                        </span>
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ task.experience }}
                        </span>
                        <span class="skill-tag text-xs px-2 py-1 rounded-full" style="color: #e2e8f0;">
                          {{ task.applications }}人申请
                        </span>
                        <span
                          v-if="task.urgent"
                          class="skill-tag text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
                        >
                          急聘
                        </span>
                      </div>

                      <!-- 任务标签 -->
                      <div class="flex flex-wrap gap-2 mb-4">
                        <span
                          v-for="tag in task.tags"
                          :key="tag"
                          class="skill-tag text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        >
                          {{ tag }}
                        </span>
                      </div>

                      <!-- 任务描述 -->
                      <p class="text-gray-300 text-sm mb-4 line-clamp-2">
                        {{ task.description }}
                      </p>

                      <!-- 底部信息 -->
                      <div class="flex justify-between items-center">
                        <p class="text-gray-400 text-xs">
                          发布于 {{ formatPublishDate(task.publishDate) }}
                        </p>
                        <button
                          class="view-job-btn px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-colors whitespace-nowrap flex items-center"
                          :class="[isMobile ? 'mobile-view-btn' : 'desktop-view-btn']"
                          @click.stop="handleApplyTask(task.id)"
                        >
                          <span>立即申请</span>
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
                  :disabled="currentPage === 1"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="prevPage"
                >
                  <i class="ri-arrow-left-s-line" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg"
                  :class="[
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-blue-600/20',
                  ]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="nextPage"
                >
                  <i class="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的任务 -->
        <div v-else-if="activeTab === 'my-tasks'" class="glass-card rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">我的任务</h3>
            <div class="flex space-x-4">
              <button
                v-for="filter in [
                  { value: 'all', label: '全部' },
                  { value: 'in-progress', label: '进行中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'pending', label: '待确认' },
                ]"
                :key="filter.value"
                class="px-4 py-2 rounded-lg text-sm transition-colors"
                :class="myTasksFilter === filter.value ? 'bg-blue-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'"
                @click="myTasksFilter = filter.value"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700/50">
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">任务名称</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">客户</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">截止日期</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">金额</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">状态</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in myTasksData" :key="task.id" class="border-b border-gray-700/30 hover:bg-gray-800/30">
                  <td class="py-4 px-4 text-white">{{ task.name }}</td>
                  <td class="py-4 px-4 text-gray-300">{{ task.client }}</td>
                  <td class="py-4 px-4 text-gray-300">{{ task.deadline }}</td>
                  <td class="py-4 px-4 text-green-400">{{ task.amount }}</td>
                  <td class="py-4 px-4">
                    <span
                      class="px-2 py-1 rounded-full text-xs"
                      :class="{
                        'bg-blue-500/20 text-blue-400': task.status === '进行中',
                        'bg-green-500/20 text-green-400': task.status === '已完成',
                        'bg-orange-500/20 text-orange-400': task.status === '待确认',
                      }"
                    >
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button class="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-sm hover:bg-blue-600/30 transition-colors">
                        查看详情
                      </button>
                      <button
                        v-if="task.status === '进行中'"
                        class="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded text-sm hover:bg-green-600/30 transition-colors"
                      >
                        提交成果
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 智能匹配 -->
        <div v-else-if="activeTab === 'matching'" class="space-y-6">
          <!-- 个人技能档案 -->
          <div class="glass-card rounded-lg p-6">
            <h3 class="text-xl font-bold mb-6">个人技能档案</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-medium mb-4">技能评分</h4>
                <div class="space-y-4">
                  <div
                    v-for="skill in [
                      { name: 'UI/UX设计', score: 90 },
                      { name: '平面设计', score: 75 },
                      { name: '3D建模', score: 40 },
                      { name: '动效设计', score: 60 },
                    ]"
                    :key="skill.name"
                  >
                    <div class="flex justify-between mb-2">
                      <span class="text-sm text-gray-300">{{ skill.name }}</span>
                      <span class="text-sm text-blue-400">{{ skill.score }}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        :style="`width: ${skill.score}%`"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium mb-4">常用工具</h4>
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tool in ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects']"
                    :key="tool"
                    class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                  >
                    {{ tool }}
                  </span>
                </div>
                <h4 class="text-lg font-medium mb-4">偏好任务类型</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="type in ['移动应用UI', '网站设计', '品牌设计', '图标设计', '插画']"
                    :key="type"
                    class="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐任务 -->
          <div class="glass-card rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold">为您推荐的任务</h3>
              <button class="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                <i class="ri-refresh-line mr-2" />
                刷新推荐
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="task in paginatedTasks.slice(0, 4)"
                :key="task.id"
                class="job-card rounded-lg p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <h4 class="font-bold text-white mb-1">{{ task.title }}</h4>
                    <p class="text-sm text-gray-400">{{ task.client }}</p>
                  </div>
                  <div class="flex items-center ml-4">
                    <span class="text-sm font-medium text-green-400 mr-2">匹配度 {{ Math.floor(Math.random() * 20) + 80 }}%</span>
                    <div class="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                      <i class="ri-check-line text-green-400 text-sm" />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">{{ task.description }}</p>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-400">{{ task.deadline }}</span>
                    <span class="text-sm text-green-400">{{ formatPrice(task.price) }}</span>
                  </div>
                  <button
                    class="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-sm hover:bg-blue-600/30 transition-colors"
                    @click="handleApplyTask(task.id)"
                  >
                    立即申请
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 支付中心 -->
        <div v-else-if="activeTab === 'payment'" class="space-y-6">
          <!-- 账户概览 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-card rounded-lg p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <h4 class="text-sm text-gray-300 mb-2">账户余额</h4>
              <div class="text-3xl font-bold text-white mb-4">¥25,680.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">可提现金额</span>
                <span class="text-green-400">¥20,680.00</span>
              </div>
            </div>
            <div class="glass-card rounded-lg p-6">
              <h4 class="text-sm text-gray-300 mb-2">本月收入</h4>
              <div class="text-3xl font-bold text-green-400 mb-4">¥12,500.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">较上月</span>
                <span class="text-green-400">+15%</span>
              </div>
            </div>
            <div class="glass-card rounded-lg p-6">
              <h4 class="text-sm text-gray-300 mb-2">待结算</h4>
              <div class="text-3xl font-bold text-yellow-400 mb-4">¥5,000.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">预计到账时间</span>
                <span class="text-yellow-400">3天内</span>
              </div>
            </div>
          </div>

          <!-- 交易记录 -->
          <div class="glass-card rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold">交易记录</h3>
              <div class="flex space-x-3">
                <button class="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                  <i class="ri-wallet-line mr-2" />
                  充值
                </button>
                <button class="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm hover:bg-green-600/30 transition-colors">
                  <i class="ri-bank-card-line mr-2" />
                  提现
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700/50">
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">日期</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">描述</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">金额</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">类型</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in paymentRecords" :key="record.id" class="border-b border-gray-700/30 hover:bg-gray-800/30">
                    <td class="py-4 px-4 text-gray-300">{{ record.date }}</td>
                    <td class="py-4 px-4 text-white">{{ record.description }}</td>
                    <td class="py-4 px-4" :class="record.type === '收入' ? 'text-green-400' : 'text-red-400'">
                      {{ record.type === '收入' ? '+' : '-' }}{{ record.amount }}
                    </td>
                    <td class="py-4 px-4 text-gray-300">{{ record.type }}</td>
                    <td class="py-4 px-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs"
                        :class="{
                          'bg-green-500/20 text-green-400': record.status === '已完成',
                          'bg-blue-500/20 text-blue-400': record.status === '处理中',
                        }"
                      >
                        {{ record.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 移动端悬浮筛选按钮 -->
    <button
      v-if="isMobile && activeTab === 'marketplace'"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-40 lg:hidden flex items-center justify-center floating-filter-btn"
      :class="{ 'scale-110': showFilterDrawer }"
      @click="toggleFilterDrawer"
    >
      <i class="ri-filter-3-line text-xl" />
      <span
        v-if="activeFiltersCount > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium border-2 border-white"
      >
        {{ activeFiltersCount > 9 ? '9+' : activeFiltersCount }}
      </span>
    </button>

    <!-- 移动端筛选抽屉 -->
    <div
      v-if="showFilterDrawer"
      class="fixed inset-0 z-50 lg:hidden overflow-hidden filter-drawer-container"
      @click="closeFilterDrawer"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        class="absolute top-0 bottom-0 filter-card filter-drawer transform transition-transform duration-300 ease-out flex flex-col"
        :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        style="right: 0px; width: min(320px, 85vw);"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <h3 class="text-lg font-medium">筛选条件</h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors"
            @click="closeFilterDrawer"
          >
            <i class="ri-close-line" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <!-- 任务类型筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">任务类型</h3>
              <div class="space-y-2">
                <label v-for="type in taskTypes" :key="type.value" class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="selectedTaskTypes.includes(type.value)"
                    @change="toggleTaskType(type.value)"
                  >
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>
            <!-- 其他筛选项类似 -->
          </div>
        </div>
        <div class="border-t border-gray-700/50 p-6 flex-shrink-0">
          <button
            class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
            @click="resetFilters"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="mt-16 py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">智图工厂</h3>
            <p class="text-gray-400 text-sm">
              智能匹配设计需求与人才，提供全流程任务管理与支付保障
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">功能模块</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">任务广场</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">智能匹配</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">任务管理</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">支付中心</a></li>
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
                <i class="ri-mail-line mr-2" />
                contact@zhitugongchang.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2" />
                400-888-9999
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2" />
                北京市海淀区中关村大街 18 号
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8" />
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 智图工厂. 保留所有权利
          </p>
          <div class="flex space-x-4">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-weibo-line" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-wechat-line" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-linkedin-line" />
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* 任务卡片 */
.job-card {
  background: rgba(28, 28, 30, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.job-card:hover {
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

/* 悬浮筛选按钮样式 */
.floating-filter-btn {
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  animation: float 3s ease-in-out infinite;
}

.floating-filter-btn:hover {
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 抽屉样式 */
.filter-drawer {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }

  .job-card {
    border: 1px solid rgba(99, 99, 102, 0.3);
    margin: 0.5rem 0 !important;
  }

  .job-card:active {
    border-color: rgba(10, 132, 255, 0.5);
  }

  .floating-filter-btn {
    bottom: 1.5rem !important;
    right: 1.5rem !important;
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
}

@media (max-width: 1023px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .title-section-container {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

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
