<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30"></div>
      <div class="container mx-auto px-10 relative z-10 title-section-container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-4xl font-bold mb-2 text-white">院校数据库</h1>
            <p class="text-gray-300 max-w-2xl">
              汇聚 {{ schoolCount.toLocaleString() }} 所优质院校，涵盖设计教育全链路信息
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
                <!-- 院校类型筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">院校类型</h3>
                  <div class="space-y-2">
                    <label v-for="type in schoolTypes" :key="type.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedSchoolTypes.includes(type.value)"
                        @change="toggleSchoolType(type.value)"
                      >
                      <span>{{ type.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 地区筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">所在地区</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="region in regions" :key="region" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedRegions.includes(region)"
                        @change="toggleRegion(region)"
                      >
                      <span>{{ region }}</span>
                    </label>
                  </div>
                  <button class="text-blue-400 text-sm mt-2">更多地区</button>
                </div>

                <!-- 院校层次筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">院校层次</h3>
                  <div class="space-y-2">
                    <label v-for="level in schoolLevels" :key="level.value" class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        class="custom-radio"
                        :value="level.value"
                        v-model="selectedLevel"
                      >
                      <span>{{ level.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 办学性质筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">办学性质</h3>
                  <div class="space-y-2">
                    <label v-for="nature in schoolNatures" :key="nature" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedNatures.includes(nature)"
                        @change="toggleNature(nature)"
                      >
                      <span>{{ nature }}</span>
                    </label>
                  </div>
                </div>

                <!-- 特殊标识筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">特殊标识</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span>985院校</span>
                      <label class="custom-switch">
                        <input type="checkbox" v-model="is985">
                        <span class="switch-slider"></span>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>211院校</span>
                      <label class="custom-switch">
                        <input type="checkbox" v-model="is211">
                        <span class="switch-slider"></span>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>双一流</span>
                      <label class="custom-switch">
                        <input type="checkbox" v-model="isDoubleFirst">
                        <span class="switch-slider"></span>
                      </label>
                    </div>
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
          <div class="lg:w-3/4 w-full">


            <!-- 排序和结果统计 -->
            <div class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">找到 <span class="text-white font-medium">{{ filteredSchoolCount }}</span> 所符合条件的院校</p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                  >
                    <option value="ranking">综合排名</option>
                    <option value="established-year">建校时间</option>
                    <option value="student-count">学生数量</option>
                    <option value="name">院校名称</option>
                    <option value="latest">最新更新</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 院校列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 mb-8">
              <SchoolCard
                v-for="school in paginatedSchools"
                :key="school.id"
                :school="school"
                @click="handleViewDetail"
                @detail="handleViewDetail"
              />
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

    <!-- 院校详情模态框 - 仅在桌面端显示 -->
    <SchoolDetailModal
      v-if="!isMobile && selectedSchool"
      :visible="showSchoolDetail"
      :school="selectedSchool"
      @update:visible="showSchoolDetail = $event"
    />

    <!-- 移动端悬浮筛选按钮 -->
    <button
      v-if="isMobile"
      @click="toggleFilterDrawer"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-40 lg:hidden flex items-center justify-center floating-filter-btn"
      :class="{ 'scale-110': showFilterDrawer }"
    >
      <i class="ri-filter-3-line text-xl"></i>
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
      v-if="showFilterDrawer"
      class="fixed inset-0 z-50 lg:hidden overflow-hidden filter-drawer-container"
      style="margin: 0; padding: 0; width: 100vw; height: 100vh;"
      @click="closeFilterDrawer"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <!-- 抽屉内容 -->
      <div
        class="absolute top-0 bottom-0 filter-card filter-drawer transform transition-transform duration-300 ease-out flex flex-col"
        :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        style="right: 0px; width: min(320px, 85vw);"
        @click.stop
      >
        <!-- 抽屉头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <h3 class="text-lg font-medium">筛选条件</h3>
          <button
            @click="closeFilterDrawer"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- 抽屉内容区 -->
        <div class="flex-1 overflow-y-auto filter-drawer-content">
          <div class="p-6">
            <div class="space-y-6">
            <!-- 院校类型筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">院校类型</h3>
              <div class="space-y-2">
                <label v-for="type in schoolTypes" :key="type.value" class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="selectedSchoolTypes.includes(type.value)"
                    @change="toggleSchoolType(type.value)"
                  >
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- 地区筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">所在地区</h3>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="region in regions" :key="region" class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="selectedRegions.includes(region)"
                    @change="toggleRegion(region)"
                  >
                  <span>{{ region }}</span>
                </label>
              </div>
              <button class="text-blue-400 text-sm mt-2">更多地区</button>
            </div>

            <!-- 院校层次筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">院校层次</h3>
              <div class="space-y-2">
                <label v-for="level in schoolLevels" :key="level.value" class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="level-mobile"
                    class="custom-radio"
                    :value="level.value"
                    v-model="selectedLevel"
                  >
                  <span>{{ level.label }}</span>
                </label>
              </div>
            </div>

            <!-- 办学性质筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">办学性质</h3>
              <div class="space-y-2">
                <label v-for="nature in schoolNatures" :key="nature" class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="selectedNatures.includes(nature)"
                    @change="toggleNature(nature)"
                  >
                  <span>{{ nature }}</span>
                </label>
              </div>
            </div>

            <!-- 特殊标识筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">特殊标识</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span>985院校</span>
                  <label class="custom-switch">
                    <input type="checkbox" v-model="is985">
                    <span class="switch-slider"></span>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span>211院校</span>
                  <label class="custom-switch">
                    <input type="checkbox" v-model="is211">
                    <span class="switch-slider"></span>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span>双一流</span>
                  <label class="custom-switch">
                    <input type="checkbox" v-model="isDoubleFirst">
                    <span class="switch-slider"></span>
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
              @click="resetFilters"
              class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import SchoolDetailModal from '@/components/talent/SchoolDetailModal.vue'
import SchoolCard from '@/components/talent/SchoolCard.vue'
import { useSchool } from '@/composables/talent/useSchool'
import type { School } from '@/types/talent/school'
import { mockSchools } from '@/data/mockSchools'
import { shouldUseMockData } from '@/utils/authUtils'

const router = useRouter()

// 根据登录状态和环境变量切换数据源
const USE_MOCK_DATA = computed(() => shouldUseMockData())

console.log('🔍 院校页面环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA.value)

const { schools, loading, fetchSchools } = useSchool({
  autoLoad: false, // 禁用自动加载，手动控制数据加载
  initialParams: undefined
})

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

  console.log('📱 设备检测结果:', {
    screenWidth,
    isTouchDevice,
    userAgent: userAgent.substring(0, 50) + '...',
    isMobile: isMobile.value
  })
}

const handleResize = () => {
  checkDevice()
}

// 筛选条件
const selectedSchoolTypes = ref<string[]>([])
const selectedRegions = ref<string[]>([])
const selectedLevel = ref('')
const selectedNatures = ref<string[]>([])
const is985 = ref(false)
const is211 = ref(false)
const isDoubleFirst = ref(false)
const sortBy = ref('ranking')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(8)

// 模态框状态
const showSchoolDetail = ref(false)
const selectedSchool = ref<School | null>(null)

// 抽屉状态
const showFilterDrawer = ref(false)
const filterDrawerOpen = ref(false)

// 筛选选项
const schoolTypes = [
  { value: 'COMPREHENSIVE', label: '综合类' },
  { value: 'SCIENCE_ENGINEERING', label: '理工类' },
  { value: 'ART_DESIGN', label: '艺术设计类' },
  { value: 'NORMAL', label: '师范类' },
  { value: 'FINANCE', label: '财经类' },
  { value: 'MEDICAL', label: '医学类' }
]

const regions = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '西安']

const schoolLevels = [
  { value: 'UNDERGRADUATE', label: '本科院校' },
  { value: 'JUNIOR_COLLEGE', label: '专科院校' },
  { value: 'GRADUATE', label: '研究生院' }
]

const schoolNatures = ['公办', '民办', '中外合作']

// 计算属性
const schoolCount = computed(() => {
  if (USE_MOCK_DATA.value) {
    return mockSchools.length || 1256
  }
  return schools.value.length || 1256
})

const filteredSchools = computed(() => {
  // 根据登录状态和环境变量选择数据源
  // 在Mock模式下，直接使用全局mockSchools数据，避免重复
  const sourceData = USE_MOCK_DATA.value ? mockSchools : schools.value
  let filtered = [...sourceData]

  // 调试信息
  console.log('🔍 filteredSchools 计算属性执行:')
  console.log('  数据源类型:', USE_MOCK_DATA.value ? 'Mock数据' : '后端API')
  console.log('  原始数据长度:', sourceData.length)
  console.log('  原始数据ID列表:', sourceData.map(s => s.id))

  // 院校类型筛选
  if (selectedSchoolTypes.value.length > 0) {
    filtered = filtered.filter(school => selectedSchoolTypes.value.includes(school.schoolType))
  }

  // 地区筛选
  if (selectedRegions.value.length > 0) {
    filtered = filtered.filter(school =>
      selectedRegions.value.some(region => school.location.includes(region))
    )
  }

  // 院校层次筛选
  if (selectedLevel.value) {
    filtered = filtered.filter(school => school.level === selectedLevel.value)
  }

  // 办学性质筛选
  if (selectedNatures.value.length > 0) {
    filtered = filtered.filter(school => {
      // 这里需要根据实际的办学性质字段进行筛选
      // 暂时跳过这个筛选，因为mock数据中没有这个字段
      return true
    })
  }

  // 特殊标识筛选
  if (is985.value) {
    filtered = filtered.filter(school => school.is985)
  }
  if (is211.value) {
    filtered = filtered.filter(school => school.is211)
  }
  if (isDoubleFirst.value) {
    filtered = filtered.filter(school => school.isDoubleFirst)
  }

  console.log('  筛选后数据长度:', filtered.length)
  console.log('  筛选后数据ID列表:', filtered.map(s => s.id))

  return filtered
})

const sortedSchools = computed(() => {
  let sorted = [...filteredSchools.value]

  switch (sortBy.value) {
    case 'ranking':
      sorted.sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
      break
    case 'established-year':
      // 建校年份排序已移除
      break
    case 'student-count':
      sorted.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0))
      break
    case 'name':
      sorted.sort((a, b) => a.schoolName.localeCompare(b.schoolName))
      break
    case 'latest':
    default:
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedSchools.value.length / itemsPerPage.value))

const paginatedSchools = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  const result = sortedSchools.value.slice(start, end)

  // 调试信息
  console.log('🔍 paginatedSchools 计算属性执行:')
  console.log('  当前页:', currentPage.value)
  console.log('  每页数量:', itemsPerPage.value)
  console.log('  开始索引:', start)
  console.log('  结束索引:', end)
  console.log('  分页后数据长度:', result.length)
  console.log('  分页后数据ID列表:', result.map(s => s.id))

  return result
})

const filteredSchoolCount = computed(() => filteredSchools.value.length)

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
  if (selectedSchoolTypes.value.length > 0) count += selectedSchoolTypes.value.length
  if (selectedRegions.value.length > 0) count += selectedRegions.value.length
  if (selectedLevel.value) count += 1
  if (selectedNatures.value.length > 0) count += selectedNatures.value.length
  if (is985.value) count += 1
  if (is211.value) count += 1
  if (isDoubleFirst.value) count += 1
  return count
})

// 方法
const toggleSchoolType = (type: string) => {
  const index = selectedSchoolTypes.value.indexOf(type)
  if (index > -1) {
    selectedSchoolTypes.value.splice(index, 1)
  } else {
    selectedSchoolTypes.value.push(type)
  }
}

const toggleRegion = (region: string) => {
  const index = selectedRegions.value.indexOf(region)
  if (index > -1) {
    selectedRegions.value.splice(index, 1)
  } else {
    selectedRegions.value.push(region)
  }
}

const toggleNature = (nature: string) => {
  const index = selectedNatures.value.indexOf(nature)
  if (index > -1) {
    selectedNatures.value.splice(index, 1)
  } else {
    selectedNatures.value.push(nature)
  }
}

const resetFilters = () => {
  selectedSchoolTypes.value = []
  selectedRegions.value = []
  selectedLevel.value = ''
  selectedNatures.value = []
  is985.value = false
  is211.value = false
  isDoubleFirst.value = false
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

const handleViewDetail = async (school: School) => {
  console.log('🎯 点击院校卡片:', school.schoolName, school.id)
  console.log('📱 当前设备类型:', isMobile.value ? '移动端' : '桌面端')

  if (school) {
    selectedSchool.value = school
    console.log('✅ 设置选中院校:', selectedSchool.value?.schoolName)

    if (isMobile.value) {
      // 移动端：跳转到独立页面
      console.log('📱 移动端跳转到详情页面')
      navigating.value = true
      try {
        await router.push(`/talent/schools/${school.id}`)
      } catch (error) {
        console.error('Navigation failed:', error)
        navigating.value = false
      }
    } else {
      // 桌面端：打开模态框
      console.log('💻 桌面端打开模态框')
      showSchoolDetail.value = true
      console.log('📋 模态框状态:', showSchoolDetail.value)
    }
  } else {
    console.error('❌ 院校数据为空')
  }
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

const applyFiltersAndClose = () => {
  // 这里可以添加应用筛选的逻辑
  closeFilterDrawer()
}

// 工具方法

onMounted(() => {
  console.log('🎯 院校页面挂载完成，开始获取院校数据')
  console.log('📊 数据源:', USE_MOCK_DATA.value ? 'Mock数据' : '后端API')

  // 只有在非Mock模式下才调用API
  if (!USE_MOCK_DATA.value) {
    console.log('🚀 非Mock模式，调用API获取数据')
    fetchSchools()
  } else {
    console.log('🔧 使用Mock数据，跳过API调用，直接使用全局mockSchools数据')
  }

  checkDevice()
  window.addEventListener('resize', handleResize)
})

// 观察模态框状态变化
watch(showSchoolDetail, (newVal) => {
  console.log('🔄 模态框状态变化:', newVal)
})

watch(selectedSchool, (newVal) => {
  console.log('🔄 选中院校变化:', newVal?.schoolName)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // 确保页面卸载时恢复body滚动
  document.body.style.overflow = ''
})
</script>

<style>
@import '@/styles/talent.css';

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

/* 移动端抽屉中的筛选卡片 */
@media (max-width: 1023px) {
  .filter-card {
    background: rgba(28, 28, 30, 0.6);
    border-left: 1px solid rgba(99, 99, 102, 0.3);
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  /* 确保抽屉完全贴合右边缘 */
  .filter-drawer {
    right: 0 !important;
    margin-right: 0 !important;
    padding-right: 0 !important;
    transform-origin: right center;
  }

  /* 确保没有额外的外边距或内边距 */
  .filter-drawer-container {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 强制抽屉贴合右边缘 */
  .filter-drawer-container .filter-drawer {
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border-right: none !important;
    transform-origin: right center !important;
  }

  /* 确保抽屉完全占满右侧空间 */
  .filter-drawer {
    box-sizing: border-box !important;
    min-width: 320px;
    max-width: 85vw;
  }

  /* 移除可能的容器限制 */
  .filter-drawer-container {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
  }
}

/* 院校卡片 */
.school-card {
  background: rgba(28, 28, 30, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.school-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 院校Logo */
.school-logo {
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

/* 确保模态框不被其他元素覆盖 */
.talent-page {
  position: relative;
  z-index: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }

  .school-card {
    border: 1px solid rgba(99, 99, 102, 0.3);
  }

  .school-card:active {
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
  .school-card:last-child {
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
