<template>
  <div class="school-employment">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-400">加载就业信息...</span>
    </div>

    <!-- 就业概况 -->
    <div v-else class="mb-4 sm:mb-6">
      <h4 class="text-lg font-bold mb-3 sm:mb-4">就业概况</h4>
      <div class="glass-card rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">就业率</p>
            <p class="text-2xl font-bold text-green-400 mb-0">{{ employmentStats?.employmentRate || '--' }}</p>
          </div>
          <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">平均起薪</p>
            <p class="text-2xl font-bold text-yellow-400 mb-0">{{ employmentStats?.averageSalary || '--' }}</p>
          </div>
          <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">深造率</p>
            <p class="text-2xl font-bold text-blue-400 mb-0">{{ employmentStats?.furtherStudyRate || '--' }}</p>
          </div>
          <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">海外就业率</p>
            <p class="text-2xl font-bold text-purple-400 mb-0">{{ employmentStats?.overseasEmploymentRate || '--' }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-300 mb-0 leading-relaxed">
          {{ employmentStats?.description || '暂无就业描述' }}
        </p>
      </div>

      <!-- 数据可视化 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- 就业行业分布 -->
        <div class="w-full">
          <h5 class="text-base font-bold mb-2 sm:mb-3">就业行业分布</h5>

          <!-- 手机端列表显示 -->
          <div class="lg:hidden">
            <div class="space-y-2">
              <div
                v-for="item in industryListData"
                :key="item.name"
                class="glass-card rounded-lg p-3 flex items-center justify-between"
              >
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    :style="{ backgroundColor: item.color }"
                  ></div>
                  <span class="text-sm text-gray-300">{{ item.name }}</span>
                </div>
                <span class="text-sm font-bold text-white">{{ item.value }}%</span>
              </div>
            </div>
          </div>

          <!-- 桌面端图表显示 -->
          <div ref="industryChartRef" class="hidden lg:block w-full h-60" style="width: 100%;"></div>
        </div>

        <!-- 薪资水平分布 -->
        <div class="w-full">
          <h5 class="text-base font-bold mb-2 sm:mb-3">薪资水平分布</h5>

          <!-- 手机端列表显示 -->
          <div class="lg:hidden">
            <div class="space-y-2">
              <div
                v-for="(item, index) in salaryListData"
                :key="index"
                class="glass-card rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-300">{{ item.label }}</span>
                  <span class="text-sm font-bold text-white">{{ item.value }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(item.value / Math.max(...salaryListData.map(d => d.value))) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 桌面端图表显示 -->
          <div ref="salaryChartRef" class="hidden lg:block w-full h-60" style="width: 100%;"></div>
        </div>
      </div>
    </div>

    <!-- 代表性雇主 -->
    <div>
      <h4 class="text-lg font-bold mb-3 sm:mb-4">代表性雇主</h4>

      <!-- 手机端紧凑布局 -->
      <div class="sm:hidden">
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="employer in employers"
            :key="employer.id"
            class="glass-card rounded-lg p-2 text-center"
          >
            <div
              class="w-8 h-8 mx-auto flex items-center justify-center rounded-md text-white mb-1.5"
              :class="employer.colorClass"
            >
              <span class="text-sm font-bold">{{ employer.initial }}</span>
            </div>
            <h5 class="text-xs font-bold leading-tight mb-0.5 truncate">{{ employer.name }}</h5>
            <p class="text-xs text-gray-400 mb-0 leading-tight truncate">{{ employer.industry }}</p>
          </div>
        </div>
      </div>

      <!-- 平板和桌面端布局 -->
      <div class="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="employer in employers"
          :key="employer.id"
          class="glass-card rounded-lg p-3 sm:p-4 text-center"
        >
          <div
            class="w-10 h-10 sm:w-12 sm:h-12 mx-auto flex items-center justify-center rounded-lg text-white mb-2"
            :class="employer.colorClass"
          >
            <span class="text-lg font-bold">{{ employer.initial }}</span>
          </div>
          <h5 class="text-sm font-bold leading-tight">{{ employer.name }}</h5>
          <p class="text-xs text-gray-400 mb-0 mt-1">{{ employer.industry }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { schoolApi } from '@/api/talent/school'

interface Props {
  schoolId: number
}

const props = defineProps<Props>()

const loading = ref(true)
const employmentStats = ref<any>(null)
const employers = ref<any[]>([])
const chartData = ref<any>(null)

const industryChartRef = ref<HTMLElement>()
const salaryChartRef = ref<HTMLElement>()
let industryChart: echarts.ECharts | null = null
let salaryChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// 手机端列表数据
const industryListData = ref<{ name: string; value: number; color: string }[]>([])
const salaryListData = ref<{ label: string; value: number }[]>([])

// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 就业模块环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

// 设置手机端列表数据
const setupMobileListData = () => {
  // 设置行业分布列表数据
  const industryData = chartData.value?.industryData || [
    { value: 42, name: '互联网科技', itemStyle: { color: '#0a84ff' } },
    { value: 23, name: '设计咨询', itemStyle: { color: '#30d158' } },
    { value: 15, name: '广告传媒', itemStyle: { color: '#ff9f0a' } },
    { value: 12, name: '高校研究', itemStyle: { color: '#ff453a' } },
    { value: 8, name: '其他行业', itemStyle: { color: '#bf5af2' } }
  ]

  industryListData.value = industryData.map((item: any) => ({
    name: item.name,
    value: item.value,
    color: item.itemStyle?.color || '#666'
  }))

  // 设置薪资分布列表数据
  const salaryLabels = chartData.value?.salaryLabels || ['8K以下', '8-12K', '12-15K', '15-20K', '20-25K', '25K以上']
  const salaryData = chartData.value?.salaryData || [5, 12, 25, 30, 18, 10]

  salaryListData.value = salaryLabels.map((label: string, index: number) => ({
    label,
    value: salaryData[index] || 0
  }))
}

// 获取就业数据
const fetchEmploymentData = async () => {
  loading.value = true
  try {
    const response = await schoolApi.getSchoolEmployment(props.schoolId)

    if (USE_MOCK_DATA) {
      // 使用模拟数据时的数据结构
      const mockResponse = response as { employmentStats: any; employers: any[]; chartData: any }
      employmentStats.value = mockResponse.employmentStats
      employers.value = mockResponse.employers
      chartData.value = mockResponse.chartData
    } else {
      // 使用后端API时的数据结构
      const apiResponse = response as { data?: { employmentStats?: any; employers?: any[]; chartData?: any } }
      employmentStats.value = apiResponse.data?.employmentStats || null
      employers.value = apiResponse.data?.employers || []
      chartData.value = apiResponse.data?.chartData || null
    }

    // 设置手机端列表数据
    setupMobileListData()
  } catch (error) {
    console.error('获取就业数据失败:', error)
    // 发生错误时使用默认数据
    employmentStats.value = null
    employers.value = []
    chartData.value = null
  } finally {
    loading.value = false
  }
}

// 初始化图表
const initCharts = async () => {
  await nextTick()
  // 等待DOM完全渲染
  await new Promise(resolve => setTimeout(resolve, 50))

  // 只在桌面端初始化图表
  if (window.innerWidth < 1024) return

  if (industryChartRef.value) {
    // 强制设置容器尺寸
    const container = industryChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 400
    const chartHeight = 240  // 桌面端固定240px
    container.style.width = `${parentWidth}px`
    container.style.height = `${chartHeight}px`

    industryChart = echarts.init(container, 'dark', {
      width: parentWidth,
      height: chartHeight
    })
    const industryOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: { color: '#1f2937' }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: '#e2e8f0' }
      },
      series: [{
        name: '就业行业',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(15, 23, 42, 0.6)',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            color: '#e2e8f0'
          }
        },
        labelLine: { show: false },
        data: chartData.value?.industryData || [
          { value: 42, name: '互联网科技', itemStyle: { color: '#0a84ff' } },
          { value: 23, name: '设计咨询', itemStyle: { color: '#30d158' } },
          { value: 15, name: '广告传媒', itemStyle: { color: '#ff9f0a' } },
          { value: 12, name: '高校研究', itemStyle: { color: '#ff453a' } },
          { value: 8, name: '其他行业', itemStyle: { color: '#bf5af2' } }
        ]
      }]
    }
    industryChart.setOption(industryOption)
    // 强制调整大小以确保图表撑满容器
    setTimeout(() => {
      industryChart?.resize()
    }, 200)
  }

  if (salaryChartRef.value) {
    // 强制设置容器尺寸
    const container = salaryChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 400
    const chartHeight = 240  // 桌面端固定240px
    container.style.width = `${parentWidth}px`
    container.style.height = `${chartHeight}px`

    salaryChart = echarts.init(container, 'dark', {
      width: parentWidth,
      height: chartHeight
    })
    const salaryOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: { color: '#1f2937' }
      },
      xAxis: {
        type: 'category',
        data: chartData.value?.salaryLabels || ['8K-', '8-12K', '12-15K', '15-20K', '20-25K', '25K+'],
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#e2e8f0' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#e2e8f0' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [{
        data: chartData.value?.salaryData || [5, 12, 25, 30, 18, 10],
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#0a84ff' },
              { offset: 1, color: 'rgba(10, 132, 255, 0.5)' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        }
      }]
    }
    salaryChart.setOption(salaryOption)
    // 强制调整大小以确保图表撑满容器
    setTimeout(() => {
      salaryChart?.resize()
    }, 200)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  // 只在桌面端处理图表缩放
  if (window.innerWidth < 1024) return

  if (industryChart && industryChartRef.value) {
    const container = industryChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 400
    const chartHeight = 240  // 桌面端固定240px
    container.style.width = `${parentWidth}px`
    container.style.height = `${chartHeight}px`
    industryChart.resize({
      width: parentWidth,
      height: chartHeight
    })
  }

  if (salaryChart && salaryChartRef.value) {
    const container = salaryChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 400
    const chartHeight = 240  // 桌面端固定240px
    container.style.width = `${parentWidth}px`
    container.style.height = `${chartHeight}px`
    salaryChart.resize({
      width: parentWidth,
      height: chartHeight
    })
  }
}

// 初始化ResizeObserver
const initResizeObserver = () => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    if (industryChartRef.value?.parentElement) {
      resizeObserver.observe(industryChartRef.value.parentElement)
    }
    if (salaryChartRef.value?.parentElement) {
      resizeObserver.observe(salaryChartRef.value.parentElement)
    }
  }
}

onMounted(async () => {
  // 先加载数据
  await fetchEmploymentData()

  // 数据加载完成后初始化图表
  await initCharts()
  initResizeObserver()
  window.addEventListener('resize', handleResize)

  // 额外的检查，确保图表正确初始化
  setTimeout(() => {
    handleResize()
  }, 500)
})

onUnmounted(() => {
  industryChart?.dispose()
  salaryChart?.dispose()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 确保图表容器有明确的尺寸 */
.school-employment [ref="industryChartRef"],
.school-employment [ref="salaryChartRef"] {
  min-width: 200px;
  min-height: 240px;
}
</style>
