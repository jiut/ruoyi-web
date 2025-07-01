<template>
  <div class="school-achievements">
    <!-- 获奖概况 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold mb-4">学生获奖情况</h4>
      <div class="glass-card rounded-lg p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">国际奖项</p>
            <p class="text-2xl font-bold mb-0 gradient-text">{{ achievementStats.internationalAwards || 0 }}</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">国家级奖项</p>
            <p class="text-2xl font-bold mb-0 gradient-text">{{ achievementStats.nationalAwards || 0 }}</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">省部级奖项</p>
            <p class="text-2xl font-bold mb-0 gradient-text">{{ achievementStats.provincialAwards || 0 }}</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">专利授权</p>
            <p class="text-2xl font-bold mb-0 gradient-text">{{ achievementStats.patents || 0 }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-300 mb-0">
          {{ achievementStats.description }}
        </p>
      </div>
    </div>

    <!-- 获奖趋势图表 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold mb-4">近年获奖趋势</h4>
      <div class="glass-card rounded-lg p-6 flex items-center justify-center">
        <div ref="trendChartRef" class="w-full h-80" style="width: 100%; height: 320px;"></div>
      </div>
    </div>

    <!-- 代表性获奖作品 -->
    <div class="mb-6">
      <h4 class="text-lg font-bold mb-4">代表性获奖作品</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="work in awardWorks" :key="work.id" class="glass-card rounded-lg overflow-hidden">
          <div class="h-40 bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
            <i class="ri-image-line text-4xl text-gray-400"></i>
          </div>
          <div class="p-4">
            <h5 class="text-base font-bold mb-1">{{ work.title }}</h5>
            <p class="text-xs text-gray-400 mb-2">{{ work.award }}</p>
            <p class="text-xs text-gray-300 mb-0">{{ work.description }}</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { AchievementStatsData, TrendData, AwardWorkData } from '@/types/talent/school'

interface Props {
  schoolId: number
  achievementStats?: AchievementStatsData
  trendData?: TrendData
  awardWorks?: AwardWorkData[]
}

const props = defineProps<Props>()

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// 直接使用从父组件传递的数据
const achievementStats = computed(() => props.achievementStats || {
  internationalAwards: 0,
  nationalAwards: 0,
  provincialAwards: 0,
  patents: 0,
  description: '暂无成果描述'
})
const trendData = computed(() => props.trendData || {
  years: [],
  internationalData: [],
  nationalData: [],
  provincialData: []
})
const awardWorks = computed(() => props.awardWorks || [])

// 初始化趋势图表
const initTrendChart = async () => {
  await nextTick()
  // 等待DOM完全渲染
  await new Promise(resolve => setTimeout(resolve, 50))

  if (trendChartRef.value && trendData.value.years.length > 0) {
    // 强制设置容器尺寸
    const container = trendChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 800
    container.style.width = `${parentWidth}px`
    container.style.height = '320px'

    trendChart = echarts.init(container, 'dark', {
      width: parentWidth,
      height: 320
    })
    const trendOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: { color: '#1f2937' }
      },
      legend: {
        data: ['国际奖项', '国家级奖项', '省部级奖项'],
        textStyle: { color: '#e2e8f0' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendData.value.years,
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#e2e8f0' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#e2e8f0' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      series: [
        {
          name: '国际奖项',
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: { width: 3, color: '#0a84ff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(10, 132, 255, 0.2)' },
                { offset: 1, color: 'rgba(10, 132, 255, 0.01)' }
              ]
            }
          },
          emphasis: { focus: 'series' },
          symbol: 'none',
          data: trendData.value.internationalData
        },
        {
          name: '国家级奖项',
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: { width: 3, color: '#30d158' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(48, 209, 88, 0.2)' },
                { offset: 1, color: 'rgba(48, 209, 88, 0.01)' }
              ]
            }
          },
          emphasis: { focus: 'series' },
          symbol: 'none',
          data: trendData.value.nationalData
        },
        {
          name: '省部级奖项',
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: { width: 3, color: '#ff9f0a' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 159, 10, 0.2)' },
                { offset: 1, color: 'rgba(255, 159, 10, 0.01)' }
              ]
            }
          },
          emphasis: { focus: 'series' },
          symbol: 'none',
          data: trendData.value.provincialData
        }
      ]
    }
    trendChart.setOption(trendOption)
    // 强制调整大小以确保图表撑满容器
    setTimeout(() => {
      trendChart?.resize()
    }, 200)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (trendChart && trendChartRef.value) {
    const container = trendChartRef.value
    const parentWidth = container.parentElement?.clientWidth || 800
    container.style.width = `${parentWidth}px`
    trendChart.resize({
      width: parentWidth,
      height: 320
    })
  }
}

// 初始化ResizeObserver
const initResizeObserver = () => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    if (trendChartRef.value?.parentElement) {
      resizeObserver.observe(trendChartRef.value.parentElement)
    }
  }
}

// 当数据加载完成后初始化图表
watch(() => [props.achievementStats, props.trendData, props.awardWorks], async () => {
  if (props.trendData && props.trendData.years.length > 0) {
    // 数据加载完成后初始化图表
    await initTrendChart()
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
  trendChart?.dispose()
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

.gradient-text {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 确保图表容器有明确的尺寸 */
.school-achievements [ref="trendChartRef"] {
  min-width: 200px;
  min-height: 320px;
}
</style>
