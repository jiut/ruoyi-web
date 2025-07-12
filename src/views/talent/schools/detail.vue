<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import TalentHeader from '@/components/talent/TalentHeader.vue'

import SchoolMajors from '@/components/talent/SchoolMajors.vue'
import SchoolFaculty from '@/components/talent/SchoolFaculty.vue'
import SchoolEmployment from '@/components/talent/SchoolEmployment.vue'
import SchoolAchievements from '@/components/talent/SchoolAchievements.vue'
import { useSchoolStore } from '@/stores/talent/school'
import { schoolApi } from '@/api/talent/school'
import {
  getMockEmploymentRate,
  getMockSchoolById,
} from '@/data/mockSchools'
import { SchoolTypeLabels } from '@/types/talent/school'
import type { School, SchoolFullInfo, SchoolType } from '@/types/talent/school'
import { useSchoolFormatter } from '@/composables/talent/useSchool'

// 根据登录状态和环境变量切换数据源
import { shouldUseMockData } from '@/utils/authUtils'

// 导入统一的工具方法
import { getNameInitial } from '@/utils/styleGenerator'

const route = useRoute()
const router = useRouter()
const schoolStore = useSchoolStore()
const message = useMessage()
const USE_MOCK_DATA = computed(() => shouldUseMockData())

const school = ref<School | null>(null)
const schoolFullInfo = ref<SchoolFullInfo | null>(null)
const activeTab = ref('majors')
const loading = ref(false)
const dataLoading = ref(false)
const tabNavigationRef = ref<HTMLElement | null>(null)
const tabContentRef = ref<HTMLElement | null>(null)
const isSticky = ref(false)
const navOriginalTop = ref(0)
const isCalculating = ref(false) // 防止重复计算的锁

// 标签页配置
const tabs = [
  { key: 'majors', label: '专业设置', icon: 'ri-book-line' },
  { key: 'faculty', label: '师资力量', icon: 'ri-user-star-line' },
  // { key: 'works', label: '学生作品', icon: 'ri-gallery-line' },
  { key: 'employment', label: '就业数据', icon: 'ri-line-chart-line' },
  { key: 'achievements', label: '获奖成果', icon: 'ri-award-line' },
]

// 获取院校ID
const schoolId = computed(() => {
  const id = route.params.id as string
  return parseInt(id)
})

// 监听路由参数变化
watch(schoolId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log('🔄 路由参数变化，重新初始化')
    await getSchoolInfo()

    // 重新计算导航栏位置
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))
    await initNavPosition()
    handleScroll()
  }
})

// 加载院校完整数据的函数
const loadSchoolData = async () => {
  if (!schoolId.value)
    return

  dataLoading.value = true
  try {
    console.log('🔧 开始加载院校完整信息:', schoolId.value)
    const response = await schoolApi.getFullInfo(schoolId.value)

    // 修复字段名不匹配问题：employmentCharts -> chartData
    const rawData = response.data as any
    if (rawData.employmentCharts && !rawData.chartData)
      rawData.chartData = rawData.employmentCharts

    // 同样处理 awardTrends -> trendData 的映射
    if (rawData.awardTrends && !rawData.trendData)
      rawData.trendData = rawData.awardTrends

    schoolFullInfo.value = rawData
    console.log('✅ 院校完整信息加载成功:', rawData)
  }
  catch (error) {
    console.error('❌ 加载院校完整信息失败:', error)
    message.error('加载院校详细信息失败，请稍后重试')
    schoolFullInfo.value = null
  }
  finally {
    dataLoading.value = false
  }
}

// 获取院校基本信息
const getSchoolInfo = async () => {
  try {
    loading.value = true
    const id = schoolId.value

    if (USE_MOCK_DATA.value) {
      // 使用模拟数据
      console.log('🔧 使用模拟数据 - 院校详情页面')
      school.value = getMockSchoolById(id) || null
    }
    else {
      // 使用后端API
      console.log('🚀 使用后端API - 院校详情页面')
      await schoolStore.fetchSchoolDetail(id)
      school.value = schoolStore.currentSchool
    }

    // 如果基本信息加载成功，则开始加载完整信息
    if (school.value)
      await loadSchoolData()
  }
  catch (error) {
    console.error('获取院校基本信息失败:', error)
    school.value = null
  }
  finally {
    loading.value = false
  }
}

const getSchoolTypeLabel = (type: SchoolType) => {
  return SchoolTypeLabels[type] || type
}

// 格式化院校类型 - 使用统一的格式化函数
const { formatSchoolType } = useSchoolFormatter()

// 获取院校类型标签样式 - 完整的颜色主题配置
const getSchoolTypeTagStyle = (schoolType: SchoolType) => {
  const styleMap: Record<string, string> = {
    // 综合类 - 蓝色主题（主色调）
    COMPREHENSIVE: 'school-tag school-tag-comprehensive bg-primary/10 text-primary border',

    // 艺术类 - 紫色主题
    ART: 'school-tag school-tag-art bg-purple-500/10 text-purple-400 border',
    ART_DESIGN: 'school-tag school-tag-art bg-purple-500/10 text-purple-400 border',

    // 理工类 - 深蓝色主题
    ENGINEERING: 'school-tag school-tag-engineering bg-blue-600/10 text-blue-400 border',
    SCIENCE: 'school-tag school-tag-science bg-cyan-500/10 text-cyan-400 border',
    SCIENCE_ENGINEERING: 'school-tag school-tag-engineering bg-blue-600/10 text-blue-400 border',

    // 师范类 - 绿色主题
    NORMAL: 'school-tag school-tag-normal bg-green-500/10 text-green-400 border',

    // 财经类 - 橙色主题
    FINANCE: 'school-tag school-tag-finance bg-orange-500/10 text-orange-400 border',

    // 医学类 - 红色主题
    MEDICAL: 'school-tag school-tag-medical bg-red-500/10 text-red-400 border',

    // 文科类 - 粉色主题
    LIBERAL_ARTS: 'school-tag school-tag-liberal bg-pink-500/10 text-pink-400 border',

    // 农林类 - 绿色主题
    AGRICULTURE: 'school-tag school-tag-agriculture bg-emerald-500/10 text-emerald-400 border',

    // 体育类 - 黄绿色主题
    SPORTS: 'school-tag school-tag-sports bg-lime-500/10 text-lime-400 border',

    // 政法类 - 深灰色主题
    POLITICS_LAW: 'school-tag school-tag-law bg-slate-500/10 text-slate-400 border',

    // 民族类 - 琥珀色主题
    ETHNIC: 'school-tag school-tag-ethnic bg-amber-500/10 text-amber-400 border',

    // 军事类 - 深绿色主题
    MILITARY: 'school-tag school-tag-military bg-green-800/10 text-green-300 border',

    // 职业院校 - 橙色主题
    VOCATIONAL: 'school-tag school-tag-vocational bg-orange-500/10 text-orange-400 border',

    // 独立学院 - 灰蓝色主题
    INDEPENDENT: 'school-tag school-tag-independent bg-gray-500/10 text-gray-400 border',
  }
  return styleMap[schoolType] || 'school-tag school-tag-default bg-gray-700/50 text-gray-300 border'
}

// 格式化地区信息
const formatLocation = (school: School) => {
  if (school.city && school.province)
    return school.city === school.province ? school.city : school.city

  return school.location || school.province || school.city || '未知'
}

// 获取就业率数据
const getEmploymentRate = computed(() => {
  if (!school.value)
    return null

  // 优先使用完整信息中的就业率数据
  if (schoolFullInfo.value?.employmentStats?.employmentRate)
    return schoolFullInfo.value.employmentStats.employmentRate

  // 兜底逻辑：如果完整信息还未加载，使用原有逻辑
  if (USE_MOCK_DATA.value)
    return getMockEmploymentRate(school.value.id)
  else
    return school.value.employmentData?.employmentRate || null
})

// 自动滚动到激活的标签
const scrollToActiveTab = async () => {
  await nextTick()
  if (tabNavigationRef.value) {
    const activeButton = tabNavigationRef.value.querySelector('.text-primary')
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }
}

// 滚动到内容区域顶部
const scrollToContent = async () => {
  // 等待DOM渲染完成
  await nextTick()

  if (tabContentRef.value) {
    const headerHeight = window.innerWidth <= 768 ? 64 : 80
    const navHeight = 78 // 导航栏高度
    const rect = tabContentRef.value.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // 检查页面滚动能力
    const pageHeight = document.documentElement.scrollHeight
    const viewportHeight = window.innerHeight
    const maxScrollTop = pageHeight - viewportHeight

    let targetScrollTop
    if (isSticky.value) {
      // 如果导航栏已经固定，滚动到内容顶部刚好在固定导航栏下方
      targetScrollTop = rect.top + scrollTop - headerHeight - navHeight - 10
    }
    else {
      // 如果导航栏未固定，滚动到导航栏位置
      targetScrollTop = navOriginalTop.value - headerHeight - 10
    }

    // 确保目标位置在可滚动范围内
    const finalTarget = Math.min(Math.max(0, targetScrollTop), maxScrollTop)
    const currentPos = window.pageYOffset

    if (maxScrollTop <= 0)
      return

    if (Math.abs(finalTarget - currentPos) < 10)
      return

    window.scrollTo({
      top: finalTarget,
      behavior: 'smooth',
    })
  }
}

// 滚动监听
const handleScroll = () => {
  if (tabNavigationRef.value && navOriginalTop.value > 0 && !isCalculating.value) {
    // 根据屏幕宽度动态设置header高度
    const headerHeight = window.innerWidth <= 768 ? 64 : 80
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // 检查是否应该固定导航栏
    // 当页面滚动超过导航栏原始位置减去header高度时，固定导航栏
    const shouldStick = scrollTop >= navOriginalTop.value - headerHeight

    isSticky.value = shouldStick
  }
}

// 初始化导航栏原始位置
const initNavPosition = async () => {
  // 防止重复计算
  if (isCalculating.value)
    return

  // 如果已经是粘性状态，不重新计算原始位置
  if (isSticky.value && navOriginalTop.value > 0)
    return

  isCalculating.value = true

  try {
    if (tabNavigationRef.value) {
      // 先等待一下，确保页面布局稳定
      await nextTick()

      // 确保元素可见且有高度
      const rect = tabNavigationRef.value.getBoundingClientRect()

      if (rect.height > 0) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const newPosition = rect.top + scrollTop

        // 只有当位置发生显著变化时才更新，并且不是在粘性状态下
        if ((Math.abs(newPosition - navOriginalTop.value) > 10 || navOriginalTop.value === 0) && !isSticky.value)
          navOriginalTop.value = newPosition
      }
    }
  }
  finally {
    isCalculating.value = false
  }
}

// 处理标签点击
const handleTabClick = async (tabKey: string) => {
  const isTabChanged = tabKey !== activeTab.value

  // 更新当前标签
  activeTab.value = tabKey

  // 如果是切换标签，需要等待内容渲染完成
  if (isTabChanged) {
    // 等待Vue的响应式更新完成
    await nextTick()
    // 额外等待DOM完全更新
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  // 如果导航栏位置还未初始化，先尝试初始化
  if (navOriginalTop.value <= 0) {
    await initNavPosition()
    handleScroll()
  }

  await scrollToContent()
}

// 监听标签切换
watch(activeTab, async (newTab, oldTab) => {
  // 如果是初始化时，只滚动导航栏标签
  if (!oldTab)
    await scrollToActiveTab()
})

// 监听学校数据变化，重新计算导航栏位置
watch(school, async (newSchool) => {
  if (newSchool) {
    // 等待DOM更新
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    await initNavPosition()
    handleScroll()
  }
})

// 窗口大小变化监听
const handleResize = () => {
  // 重新计算导航栏位置
  setTimeout(async () => {
    await initNavPosition()
    handleScroll()
  }, 100)
}

// 使用 MutationObserver 监听DOM变化，带防抖处理
const setupNavPositionObserver = () => {
  if (!tabNavigationRef.value)
    return

  let debounceTimer: NodeJS.Timeout | null = null

  const observer = new MutationObserver(() => {
    // 防抖处理，避免频繁触发
    if (debounceTimer)
      clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
      // 只在非粘性状态下重新计算
      if (!isSticky.value)
        await initNavPosition()
    }, 200)
  })

  // 只监听导航栏容器的变化，而不是整个页面
  observer.observe(tabNavigationRef.value.parentElement || tabNavigationRef.value, {
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style'],
  })

  // 2秒后停止监听，避免性能问题
  setTimeout(() => {
    observer.disconnect()
    if (debounceTimer)
      clearTimeout(debounceTimer)
  }, 2000)
}

onMounted(async () => {
  // 先添加滚动监听和resize监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })

  await getSchoolInfo()
  await scrollToActiveTab()

  // 等待DOM渲染完成后初始化导航栏位置
  await nextTick()

  // 多次尝试初始化
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    await initNavPosition()
    if (navOriginalTop.value > 0)
      break
  }

  handleScroll() // 初始检查

  // 设置DOM变化监听
  setupNavPositionObserver()
})

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-4 pb-8 mt-20 md:mt-16">
      <!-- 面包屑导航 -->
      <section class="py-2 mb-4">
        <div class="container mx-auto px-4">
          <nav class="flex items-center space-x-2 text-sm">
            <router-link to="/" class="text-gray-400 hover:text-primary transition-colors">
              首页
            </router-link>
            <span class="text-gray-500">/</span>
            <router-link to="/talent/schools" class="text-gray-400 hover:text-primary transition-colors">
              院校数据库
            </router-link>
            <span class="text-gray-500">/</span>
            <span class="text-white">{{ school?.schoolName || '院校详情' }}</span>
          </nav>
        </div>
      </section>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p class="mt-4 text-gray-400">
          加载中...
        </p>
      </div>

      <div v-else-if="!school" class="text-center py-12">
        <p class="text-gray-400">
          院校信息不存在
        </p>
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
                  {{ getNameInitial(school.schoolName) }}
                </div>
              </div>
            </div>

            <!-- 院校信息居中 -->
            <div class="text-center mb-4">
              <h1 class="text-xl font-bold mb-1">
                {{ school.schoolName }}
              </h1>
              <p class="text-gray-400 mb-3 text-sm">
                {{ getSchoolTypeLabel(school.schoolType) }}
              </p>

              <!-- 信息标签垂直排列 -->
              <div class="space-y-2 text-sm mb-4">
                <div class="flex items-center justify-center">
                  <i class="ri-map-pin-line mr-1 text-gray-400" />
                  <span>{{ school.location }}</span>
                </div>
                <div v-if="school.ranking" class="flex items-center justify-center mt-0">
                  <i class="ri-trophy-line mr-1 text-gray-400" />
                  <span>全国排名 {{ school.ranking }}</span>
                </div>
              </div>

              <!-- 院校类型标签 -->
              <div class="flex flex-wrap gap-2 justify-center mb-4">
                <!-- 院校类型标签 -->
                <span
                  class="text-xs px-2 py-1 rounded-full" :class="[
                    getSchoolTypeTagStyle(school.schoolType),
                  ]"
                >
                  {{ formatSchoolType(school.schoolType) }}
                </span>

                <!-- 特殊标识标签 (优先级: 985>211>双一流，只显示最高等级) -->
                <span
                  v-if="school.is985"
                  class="text-xs px-2 py-1 rounded-full school-tag school-tag-985 bg-yellow-500/10 text-yellow-400 border"
                >
                  985
                </span>
                <span
                  v-else-if="school.is211"
                  class="text-xs px-2 py-1 rounded-full school-tag school-tag-211 bg-purple-500/10 text-purple-400 border"
                >
                  211
                </span>
                <span
                  v-else-if="school.isDoubleFirst"
                  class="text-xs px-2 py-1 rounded-full school-tag school-tag-double-first bg-blue-500/10 text-blue-400 border"
                >
                  双一流
                </span>

                <!-- 地区标签 -->
                <span class="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
                  {{ formatLocation(school) }}
                </span>

                <!-- 就业率标签 -->
                <span
                  v-if="getEmploymentRate"
                  class="text-xs px-2 py-1 rounded-full school-tag school-tag-employment bg-green-500/10 text-green-400 border"
                >
                  就业率 {{ getEmploymentRate }}
                </span>
              </div>
            </div>
          </div>

          <!-- 桌面端水平布局 -->
          <div class="hidden sm:flex items-start">
            <div class="w-24 h-24 rounded-lg overflow-hidden mr-6 avatar-glow flex-shrink-0">
              <img v-if="school.logo" :src="school.logo" :alt="school.schoolName" class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {{ getNameInitial(school.schoolName) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-3xl font-bold mb-2">
                    {{ school.schoolName }}
                  </h1>
                  <p class="text-gray-400 mb-3">
                    {{ getSchoolTypeLabel(school.schoolType) }}
                  </p>
                  <div class="flex items-center text-sm mb-4 space-x-6">
                    <div class="flex items-center">
                      <i class="ri-map-pin-line mr-1 text-gray-400" />
                      <span>{{ school.location }}</span>
                    </div>
                    <div v-if="school.ranking" class="flex items-center">
                      <i class="ri-trophy-line mr-1 text-gray-400" />
                      <span>全国排名 {{ school.ranking }}</span>
                    </div>
                  </div>
                  <!-- 院校类型标签 -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <!-- 院校类型标签 -->
                    <span
                      class="text-xs px-2 py-1 rounded-full" :class="[
                        getSchoolTypeTagStyle(school.schoolType),
                      ]"
                    >
                      {{ formatSchoolType(school.schoolType) }}
                    </span>

                    <!-- 特殊标识标签 (优先级: 985>211>双一流，只显示最高等级) -->
                    <span
                      v-if="school.is985"
                      class="text-xs px-2 py-1 rounded-full school-tag school-tag-985 bg-yellow-500/10 text-yellow-400 border"
                    >
                      985
                    </span>
                    <span
                      v-else-if="school.is211"
                      class="text-xs px-2 py-1 rounded-full school-tag school-tag-211 bg-purple-500/10 text-purple-400 border"
                    >
                      211
                    </span>
                    <span
                      v-else-if="school.isDoubleFirst"
                      class="text-xs px-2 py-1 rounded-full school-tag school-tag-double-first bg-blue-500/10 text-blue-400 border"
                    >
                      双一流
                    </span>

                    <!-- 地区标签 -->
                    <span class="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
                      {{ formatLocation(school) }}
                    </span>

                    <!-- 就业率标签 -->
                    <span
                      v-if="getEmploymentRate"
                      class="text-xs px-2 py-1 rounded-full school-tag school-tag-employment bg-green-500/10 text-green-400 border"
                    >
                      就业率 {{ getEmploymentRate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详情内容标签页 -->
        <div class="mb-8">
          <!-- 导航栏占位空间 -->
          <div v-if="isSticky" class="nav-placeholder" />

          <!-- 标签页导航 -->
          <div
            ref="tabNavigationRef"
            class="sticky-nav glass-card rounded-lg mb-6" :class="[
              isSticky ? 'sticky-nav-fixed' : '',
            ]"
          >
            <div class="flex overflow-x-auto scrollbar-hide tab-navigation w-full">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.key"
                class="flex-1 px-2 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex items-center justify-center" :class="[
                  activeTab === tab.key
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-gray-300',
                ]"
                @click="handleTabClick(tab.key)"
              >
                <i :class="tab.icon" class="mr-1 sm:mr-2 text-sm sm:text-base" />
                <span class="hidden sm:inline">{{ tab.label }}</span>
                <span class="sm:hidden">{{ tab.label.slice(0, 2) }}</span>
              </button>
            </div>
          </div>

          <!-- 标签页内容 -->
          <div ref="tabContentRef" class="glass-card rounded-lg p-6">
            <!-- 内容加载状态 -->
            <div v-if="dataLoading" class="flex items-center justify-center h-64">
              <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                <p class="text-gray-400">
                  正在加载院校详细信息...
                </p>
              </div>
            </div>

            <!-- 内容区域 -->
            <div v-else-if="schoolFullInfo" class="tab-content">
              <!-- 专业设置 -->
              <div v-if="activeTab === 'majors'">
                <SchoolMajors
                  :school-id="school.id"
                  :major-categories="schoolFullInfo.majorCategories"
                  :course-system="schoolFullInfo.courseSystem"
                />
              </div>

              <!-- 师资力量 -->
              <div v-if="activeTab === 'faculty'">
                <SchoolFaculty
                  :school-id="school.id"
                  :faculty-stats="schoolFullInfo.facultyStats"
                  :faculty-members="schoolFullInfo.facultyMembers"
                />
              </div>

              <!-- 就业数据 -->
              <div v-if="activeTab === 'employment'">
                <SchoolEmployment
                  :school-id="school.id"
                  :employment-stats="schoolFullInfo.employmentStats"
                  :employers="schoolFullInfo.employers"
                  :chart-data="schoolFullInfo.chartData"
                />
              </div>

              <!-- 获奖成果 -->
              <div v-if="activeTab === 'achievements'">
                <SchoolAchievements
                  :school-id="school.id"
                  :achievement-stats="schoolFullInfo.achievementStats"
                  :trend-data="schoolFullInfo.trendData"
                  :award-works="schoolFullInfo.awardWorks"
                />
              </div>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="!dataLoading" class="flex items-center justify-center h-64">
              <div class="flex flex-col items-center">
                <i class="ri-error-warning-line text-4xl text-red-400 mb-4" />
                <p class="text-gray-400">
                  加载院校详细信息失败
                </p>
                <button
                  class="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  @click="loadSchoolData"
                >
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

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

/* 修复院校类型标签边框颜色被全局样式覆盖的问题 */
.school-tag {
  position: relative;
}

/* 院校类型标签边框颜色 */
.school-tag-comprehensive {
  border-color: rgba(10, 132, 255, 0.2) !important;
}

.school-tag-art {
  border-color: rgba(168, 85, 247, 0.2) !important;
}

.school-tag-engineering {
  border-color: rgba(37, 99, 235, 0.2) !important;
}

.school-tag-science {
  border-color: rgba(6, 182, 212, 0.2) !important;
}

.school-tag-normal {
  border-color: rgba(34, 197, 94, 0.2) !important;
}

.school-tag-finance {
  border-color: rgba(249, 115, 22, 0.2) !important;
}

.school-tag-medical {
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.school-tag-liberal {
  border-color: rgba(236, 72, 153, 0.2) !important;
}

.school-tag-agriculture {
  border-color: rgba(16, 185, 129, 0.2) !important;
}

.school-tag-sports {
  border-color: rgba(132, 204, 22, 0.2) !important;
}

.school-tag-law {
  border-color: rgba(100, 116, 139, 0.2) !important;
}

.school-tag-ethnic {
  border-color: rgba(245, 158, 11, 0.2) !important;
}

.school-tag-military {
  border-color: rgba(22, 101, 52, 0.2) !important;
}

.school-tag-vocational {
  border-color: rgba(249, 115, 22, 0.2) !important;
}

.school-tag-independent {
  border-color: rgba(107, 114, 128, 0.2) !important;
}

.school-tag-default {
  border-color: rgba(107, 114, 128, 0.6) !important;
}

/* 特殊标识标签边框颜色 */
.school-tag-985 {
  border-color: rgba(234, 179, 8, 0.2) !important;
}

.school-tag-211 {
  border-color: rgba(168, 85, 247, 0.2) !important;
}

.school-tag-double-first {
  border-color: rgba(59, 130, 246, 0.2) !important;
}

.school-tag-employment {
  border-color: rgba(34, 197, 94, 0.2) !important;
}

/* 粘性导航栏 */
.sticky-nav {
  transition: all 0.3s ease;
  z-index: 40;
  padding-bottom: 0 !important;
}

.sticky-nav-fixed {
  position: fixed;
  top: 80px; /* TalentHeader 的高度 */
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 1200px; /* 与容器宽度保持一致 */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 导航栏占位空间 */
.nav-placeholder {
  height: 78px; /* 与导航栏高度保持一致 */
  margin-bottom: 1.5rem;
}

/* 标签页导航优化 */
.tab-navigation {
  padding-bottom: 0;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  min-width: 100%;
}

.tab-navigation button {
  min-width: 0;
  text-align: center;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .glass-card.mb-8 {
    margin-bottom: 2rem !important;
  }

  .sticky-nav-fixed {
    top: 72px; /* 移动端 TalentHeader 基础高度64px + 预留移动端菜单空间 */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .tab-navigation {
    width: 100%;
  }

  .tab-navigation button {
    flex: 1;
    min-width: 0;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .tab-navigation button {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    padding-top: 0;
    padding-bottom: 1rem;
    font-size: 0.875rem;
  }

  .tab-navigation button i {
    margin-right: 0.25rem;
    font-size: 0.875rem;
      }
  }
</style>
