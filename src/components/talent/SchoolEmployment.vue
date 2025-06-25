<template>
  <div class="school-employment">
    <!-- 就业概况 -->
    <div class="glass-card rounded-lg p-6 mb-6">
      <h4 class="text-lg font-bold mb-4">就业概况</h4>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">就业率</p>
          <p class="text-2xl font-bold text-green-400">96.8%</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">平均起薪</p>
          <p class="text-2xl font-bold text-yellow-400">15.2K</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">深造率</p>
          <p class="text-2xl font-bold text-blue-400">32.5%</p>
        </div>
        <div class="text-center p-3 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">海外就业率</p>
          <p class="text-2xl font-bold text-purple-400">18.3%</p>
        </div>
      </div>
      <p class="text-sm text-gray-300">
        清华大学设计系毕业生就业情况良好，就业率常年保持在95%以上。毕业生主要就业方向包括互联网科技公司、设计咨询公司、广告传媒机构、高校及研究机构等。近年来，随着设计与科技的深度融合，越来越多的毕业生选择在科技企业从事用户体验设计、交互设计等工作，也有部分学生选择自主创业。
      </p>
    </div>

    <!-- 数据可视化 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="glass-card rounded-lg p-6">
        <h5 class="text-base font-bold mb-3">就业行业分布</h5>
        <div ref="industryChartRef" class="w-full h-60"></div>
      </div>
      <div class="glass-card rounded-lg p-6">
        <h5 class="text-base font-bold mb-3">薪资水平分布</h5>
        <div ref="salaryChartRef" class="w-full h-60"></div>
      </div>
    </div>

    <!-- 代表性雇主 -->
    <div class="glass-card rounded-lg p-6">
      <h4 class="text-lg font-bold mb-4">代表性雇主</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="employer in employers" :key="employer.id" class="employer-card">
          <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-lg text-white mb-2" :class="employer.colorClass">
            <span class="text-lg font-bold">{{ employer.initial }}</span>
          </div>
          <h5 class="text-sm font-bold">{{ employer.name }}</h5>
          <p class="text-xs text-gray-400">{{ employer.industry }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  employmentData: any
}

const props = defineProps<Props>()

const industryChartRef = ref<HTMLElement>()
const salaryChartRef = ref<HTMLElement>()
let industryChart: echarts.ECharts | null = null
let salaryChart: echarts.ECharts | null = null

// 代表性雇主数据
const employers = ref([
  { id: 1, name: '腾讯', initial: '腾', industry: '互联网科技', colorClass: 'bg-blue-500/20' },
  { id: 2, name: '阿里巴巴', initial: '阿', industry: '互联网科技', colorClass: 'bg-red-500/20' },
  { id: 3, name: '字节跳动', initial: '字', industry: '互联网科技', colorClass: 'bg-green-500/20' },
  { id: 4, name: '微软', initial: '微', industry: '国际科技', colorClass: 'bg-purple-500/20' },
  { id: 5, name: '苹果', initial: '苹', industry: '国际科技', colorClass: 'bg-yellow-500/20' },
  { id: 6, name: '奥美', initial: '奥', industry: '广告传媒', colorClass: 'bg-indigo-500/20' },
  { id: 7, name: '华为', initial: '华', industry: '通信科技', colorClass: 'bg-cyan-500/20' },
  { id: 8, name: '小米', initial: '小', industry: '消费电子', colorClass: 'bg-rose-500/20' }
])

// 初始化图表
const initCharts = async () => {
  await nextTick()

  if (industryChartRef.value) {
    industryChart = echarts.init(industryChartRef.value, 'dark')
    const industryOption = {
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
        data: [
          { value: 42, name: '互联网科技', itemStyle: { color: '#0a84ff' } },
          { value: 23, name: '设计咨询', itemStyle: { color: '#30d158' } },
          { value: 15, name: '广告传媒', itemStyle: { color: '#ff9f0a' } },
          { value: 12, name: '高校研究', itemStyle: { color: '#ff453a' } },
          { value: 8, name: '其他行业', itemStyle: { color: '#bf5af2' } }
        ]
      }]
    }
    industryChart.setOption(industryOption)
  }

  if (salaryChartRef.value) {
    salaryChart = echarts.init(salaryChartRef.value, 'dark')
    const salaryOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: { color: '#1f2937' }
      },
      xAxis: {
        type: 'category',
        data: ['8K-', '8-12K', '12-15K', '15-20K', '20-25K', '25K+'],
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
        data: [5, 12, 25, 30, 18, 10],
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
  }
}

// 处理窗口大小变化
const handleResize = () => {
  industryChart?.resize()
  salaryChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  industryChart?.dispose()
  salaryChart?.dispose()
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

.employer-card {
  text-align: center;
  padding: 16px;
  background: rgba(28, 28, 30, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(99, 99, 102, 0.1);
  transition: all 0.2s ease;
}

.employer-card:hover {
  background: rgba(28, 28, 30, 0.5);
  border-color: rgba(99, 99, 102, 0.2);
}
</style>
