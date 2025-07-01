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

      <!-- 有就业统计数据时显示 -->
      <template v-if="employmentStats">
        <div class="glass-card rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">就业率</p>
              <p class="text-2xl font-bold text-green-400 mb-0">{{ employmentStats.employmentRate || '暂无' }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">平均起薪</p>
              <p class="text-2xl font-bold text-yellow-400 mb-0">{{ employmentStats.averageSalary || '暂无' }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">深造率</p>
              <p class="text-2xl font-bold text-blue-400 mb-0">{{ employmentStats.furtherStudyRate || '暂无' }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">海外就业率</p>
              <p class="text-2xl font-bold text-purple-400 mb-0">{{ employmentStats.overseasEmploymentRate || '暂无' }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-0 leading-relaxed">
            {{ employmentStats.description || '暂无就业描述' }}
          </p>
        </div>
      </template>

      <!-- 无就业统计数据时显示 -->
      <div v-else class="glass-card rounded-lg p-8 text-center mb-4 sm:mb-6">
        <i class="ri-bar-chart-line text-4xl text-gray-500 mb-3"></i>
        <p class="text-gray-400 mb-2">暂无就业概况数据</p>
        <p class="text-sm text-gray-500">请等待数据加载或联系管理员</p>
      </div>

      <!-- 数据可视化 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- 就业行业分布 -->
        <div class="w-full">
          <h5 class="text-base font-bold mb-2 sm:mb-3">就业行业分布</h5>

          <!-- 手机端列表显示 -->
          <div class="lg:hidden">
            <div v-if="industryListData.length > 0" class="space-y-2">
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
            <div v-else class="glass-card rounded-lg p-4 text-center">
              <p class="text-gray-400 text-sm">暂无行业分布数据</p>
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
            <div v-if="salaryListData.length > 0" class="space-y-2">
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
            <div v-else class="glass-card rounded-lg p-4 text-center">
              <p class="text-gray-400 text-sm">暂无薪资分布数据</p>
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

      <!-- 有雇主数据时显示 -->
      <template v-if="employers.length > 0">
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
                :class="generateEmployerColorClass(employer.id, employer.name)"
              >
                <span class="text-sm font-bold">{{ getNameInitial(employer.name) }}</span>
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
              :class="generateEmployerColorClass(employer.id, employer.name)"
            >
              <span class="text-lg font-bold">{{ getNameInitial(employer.name) }}</span>
            </div>
            <h5 class="text-sm font-bold leading-tight">{{ employer.name }}</h5>
            <p class="text-xs text-gray-400 mb-0 mt-1">{{ employer.industry }}</p>
          </div>
        </div>
      </template>

      <!-- 无雇主数据时显示 -->
      <div v-else class="glass-card rounded-lg p-8 text-center">
        <i class="ri-building-line text-4xl text-gray-500 mb-3"></i>
        <p class="text-gray-400">暂无代表性雇主数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { getNameInitial, generateEmployerColorClass, generateIndustryChartData } from '@/utils/styleGenerator'
import type { EmploymentStatsData, EmployerData, ChartData } from '@/types/talent/school'

interface Props {
  schoolId: number
  employmentStats?: EmploymentStatsData
  employers?: EmployerData[]
  chartData?: ChartData
}

const props = defineProps<Props>()

// 直接使用从父组件传递的数据
const employmentStats = computed(() => props.employmentStats)
const employers = computed(() => props.employers || [])
const chartData = computed(() => props.chartData)
const loading = computed(() => {
  // 更严格的加载状态判断
  // 如果所有数据都是 undefined 或 null，则认为正在加载
  return props.employmentStats === undefined &&
         props.employers === undefined &&
         props.chartData === undefined
})

const industryChartRef = ref<HTMLElement>()
const salaryChartRef = ref<HTMLElement>()
let industryChart: echarts.ECharts | null = null
let salaryChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// 手机端列表数据
const industryListData = ref<{ name: string; value: number; color: string }[]>([])
const salaryListData = ref<{ label: string; value: number }[]>([])

// 设置手机端列表数据
const setupMobileListData = () => {
  // 设置行业分布列表数据
  const rawIndustryData = chartData.value?.industryData || []

  if (rawIndustryData.length > 0) {
    const industryDataWithColors = generateIndustryChartData(rawIndustryData)
    industryListData.value = industryDataWithColors.map((item: any) => ({
      name: item.name,
      value: item.value,
      color: item.itemStyle.color
    }))
  } else {
    industryListData.value = []
  }

  // 设置薪资分布列表数据
  const salaryLabels = chartData.value?.salaryLabels || []
  const salaryData = chartData.value?.salaryData || []

  if (salaryLabels.length > 0 && salaryData.length > 0) {
    salaryListData.value = salaryLabels.map((label: string, index: number) => ({
      label,
      value: salaryData[index] || 0
    }))
  } else {
    salaryListData.value = []
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

    // 获取行业数据
    const rawData = chartData.value?.industryData || []

    if (rawData.length > 0) {
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
          data: generateIndustryChartData(rawData)
        }]
      }
      industryChart.setOption(industryOption)
    } else {
      // 显示无数据提示
      const noDataOption = {
        backgroundColor: 'transparent',
        title: {
          text: '暂无行业分布数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#6b7280',
            fontSize: 14
          }
        }
      }
      industryChart.setOption(noDataOption)
    }

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

    // 获取薪资数据
    const salaryLabels = chartData.value?.salaryLabels || []
    const salaryData = chartData.value?.salaryData || []

    if (salaryLabels.length > 0 && salaryData.length > 0) {
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
          data: salaryLabels,
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
          data: salaryData,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }
      salaryChart.setOption(salaryOption)
    } else {
      // 显示无数据提示
      const noDataOption = {
        backgroundColor: 'transparent',
        title: {
          text: '暂无薪资分布数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#6b7280',
            fontSize: 14
          }
        }
      }
      salaryChart.setOption(noDataOption)
    }

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

// 当数据加载完成后初始化图表
watch(() => [props.chartData, props.employmentStats, props.employers], async () => {
  if (props.chartData || props.employmentStats || props.employers) {
    // 设置手机端列表数据
    setupMobileListData()

    // 数据加载完成后初始化图表
    await initCharts()
    if (!resizeObserver) {
      initResizeObserver()
      window.addEventListener('resize', handleResize)
    }

    // 额外的检查，确保图表正确初始化
    setTimeout(() => {
      handleResize()
    }, 500)
  }
}, { immediate: true })

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
