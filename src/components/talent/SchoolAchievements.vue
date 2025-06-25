<template>
  <div class="school-achievements">
    <!-- 获奖概况 -->
    <div class="glass-card rounded-lg p-6 mb-6">
      <h4 class="text-lg font-bold mb-4">学生获奖情况</h4>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">国际奖项</p>
          <p class="text-2xl font-bold gradient-text">126</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">国家级奖项</p>
          <p class="text-2xl font-bold gradient-text">287</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">省部级奖项</p>
          <p class="text-2xl font-bold gradient-text">453</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">专利授权</p>
          <p class="text-2xl font-bold gradient-text">192</p>
        </div>
      </div>
      <p class="text-sm text-gray-300">
        清华大学设计系学生在国内外各类设计竞赛中表现突出，近五年来获得红点设计奖、IF设计奖、IDEA设计奖等国际知名设计奖项126项，国家级学科竞赛奖项287项。学生作品多次入选国内外重要设计展览，部分优秀设计成果已实现产业化转化。
      </p>
    </div>

    <!-- 获奖趋势图表 -->
    <div class="glass-card rounded-lg p-6 mb-6">
      <h4 class="text-lg font-bold mb-4">近年获奖趋势</h4>
      <div ref="trendChartRef" class="w-full h-80"></div>
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
            <p class="text-xs text-gray-400 mb-2">{{ work.award }} · {{ work.year }}</p>
            <p class="text-xs text-gray-300">{{ work.description }}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in work.tags"
                :key="tag"
                class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 竞赛类别统计 -->
    <div class="glass-card rounded-lg p-6">
      <h4 class="text-lg font-bold mb-4">竞赛类别分布</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="category in competitionCategories" :key="category.name" class="category-card">
          <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-lg mb-3" :class="category.colorClass">
            <i :class="category.icon" class="text-2xl text-white"></i>
          </div>
          <h5 class="text-sm font-bold mb-2">{{ category.name }}</h5>
          <div class="text-lg font-bold text-primary mb-1">{{ category.count }}</div>
          <p class="text-xs text-gray-400">{{ category.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  schoolId: number
}

const props = defineProps<Props>()

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

// 代表性获奖作品
const awardWorks = ref([
  {
    id: 1,
    title: '「循迹」智能导盲系统',
    award: '2024 红点设计奖 · 最佳设计奖',
    year: '2024',
    description: '基于计算机视觉和触觉反馈的创新型导盲设备，为视障人士提供更安全、便捷的出行体验。',
    tags: ['产品设计', '交互设计', '智能硬件']
  },
  {
    id: 2,
    title: '「山水间」文化品牌设计',
    award: '2023 IF设计奖 · 传达设计金奖',
    year: '2023',
    description: '将中国传统山水画元素与现代品牌设计相结合，为传统文化注入新的活力和表现形式。',
    tags: ['品牌设计', '视觉传达', '文化创意']
  },
  {
    id: 3,
    title: '「净流」家用水循环系统',
    award: '2023 IDEA设计奖 · 银奖',
    year: '2023',
    description: '创新型家用水资源循环利用系统，通过智能净化技术实现生活用水的多级循环使用。',
    tags: ['环境设计', '可持续设计', '智能系统']
  }
])

// 竞赛类别统计
const competitionCategories = ref([
  {
    name: '国际设计奖',
    icon: 'ri-global-line',
    count: 126,
    description: '红点、IF、IDEA等',
    colorClass: 'bg-yellow-500/20'
  },
  {
    name: '学科竞赛',
    icon: 'ri-trophy-line',
    count: 287,
    description: '全国大学生设计竞赛',
    colorClass: 'bg-blue-500/20'
  },
  {
    name: '创新创业',
    icon: 'ri-lightbulb-line',
    count: 94,
    description: '创青春、挑战杯等',
    colorClass: 'bg-green-500/20'
  },
  {
    name: '专业认证',
    icon: 'ri-award-line',
    count: 158,
    description: '行业认证和证书',
    colorClass: 'bg-purple-500/20'
  }
])

// 初始化趋势图表
const initTrendChart = async () => {
  await nextTick()

  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value, 'dark')
    const trendOption = {
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
        data: ['2019', '2020', '2021', '2022', '2023', '2024'],
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
          data: [15, 18, 22, 25, 23, 23]
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
          data: [42, 45, 48, 52, 49, 51]
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
          data: [68, 75, 82, 78, 74, 76]
        }
      ]
    }
    trendChart.setOption(trendOption)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  trendChart?.resize()
}

onMounted(() => {
  initTrendChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  trendChart?.dispose()
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

.category-card {
  text-align: center;
  padding: 20px 16px;
  background: rgba(28, 28, 30, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(99, 99, 102, 0.1);
  transition: all 0.2s ease;
}

.category-card:hover {
  background: rgba(28, 28, 30, 0.5);
  border-color: rgba(99, 99, 102, 0.2);
}
</style>
