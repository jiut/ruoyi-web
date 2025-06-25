<template>
  <div
    class="glass-card rounded-lg glow-border card-hover cursor-pointer"
    @click="handleCardClick"
  >
    <div class="p-6">
      <!-- 顶部：Logo、名称和收藏按钮 -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center">
          <!-- 院校Logo -->
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3',
              getSchoolTheme(school.schoolName)
            ]"
          >
            <img
              v-if="school.logo"
              :src="school.logo"
              :alt="school.schoolName"
              class="w-full h-full object-cover rounded-lg"
            />
            <span v-else>{{ getSchoolInitial(school.schoolName) }}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold">{{ school.schoolName }}</h3>
            <p class="text-gray-400 text-sm">{{ getSchoolSubtitle(school) }}</p>
          </div>
        </div>
        <!-- 收藏按钮 -->
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
          @click.stop="toggleFavorite"
        >
          <i :class="[
            isFavorited(school.id) ? 'ri-bookmark-fill text-primary' : 'ri-bookmark-line'
          ]"></i>
        </button>
      </div>

      <!-- 标签区域 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <!-- 院校类型标签 -->
        <span
          :class="[
            'text-xs px-2 py-1 rounded-full',
            getSchoolTypeTagStyle(school.schoolType)
          ]"
        >
          {{ formatSchoolType(school.schoolType) }}
        </span>

        <!-- 特殊标识标签 -->
        <span
          v-if="school.is985"
          class="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        >
          985
        </span>
        <span
          v-if="school.is211"
          class="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
          211
        </span>
        <span
          v-if="school.isDoubleFirst"
          class="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
        >
          双一流
        </span>

        <!-- 地区标签 -->
        <span class="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
          {{ formatLocation(school) }}
        </span>
      </div>

      <!-- 统计指标网格 -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <!-- 就业率 -->
        <div class="text-center p-2 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">就业率</p>
          <p class="text-lg font-bold text-green-400">{{ formatEmploymentRate(school) }}</p>
        </div>
        <!-- 师资力量 -->
        <div class="text-center p-2 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">师资力量</p>
          <p class="text-lg font-bold gradient-text">{{ formatFacultyStrength(school) }}</p>
        </div>
        <!-- 学生评分 -->
        <div class="text-center p-2 bg-gray-800/30 rounded-lg">
          <p class="text-xs text-gray-400 mb-1">学生评分</p>
          <p class="text-lg font-bold text-yellow-400">{{ formatStudentScore(school) }}</p>
        </div>
      </div>

      <!-- 底部：优势专业和查看详情按钮 -->
      <div class="flex justify-between items-center">
        <div>
          <p class="text-xs text-gray-400">
            优势专业：{{ getAdvantagePrograms(school) }}
          </p>
        </div>
        <button
          @click.stop="$emit('detail', school)"
          class="px-4 py-2 bg-primary/10 text-primary border border-primary/30 !rounded-[8px] text-sm hover:bg-primary/20 transition-colors whitespace-nowrap"
        >
          查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { School, SchoolType } from '@/types/talent/school'
import { useSchoolFormatter, useSchoolInteraction } from '@/composables/talent/useSchool'

interface Props {
  school: School
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [school: School]
  detail: [school: School]
}>()

// 使用组合式函数
const { formatSchoolType } = useSchoolFormatter()
const { isFavorited, toggleFavorite: toggleFav } = useSchoolInteraction()

// 处理卡片点击
const handleCardClick = () => {
  console.log('🔍 SchoolCard 点击事件:', props.school.schoolName, props.school.id)
  emit('click', props.school)
  emit('detail', props.school)
  console.log('📤 已发送 click 和 detail 事件')
}

// 切换收藏状态
const toggleFavorite = async () => {
  try {
    await toggleFav(props.school.id)
  } catch (error) {
    console.error('Toggle favorite error:', error)
  }
}

// 获取院校Logo首字母
const getSchoolInitial = (schoolName: string) => {
  return schoolName.charAt(0).toUpperCase()
}

// 获取院校主题色
const getSchoolTheme = (schoolName: string) => {
  const themes = [
    'bg-gradient-to-br from-primary to-purple-500',
    'bg-gradient-to-br from-blue-500 to-cyan-400',
    'bg-gradient-to-br from-pink-500 to-red-500',
    'bg-gradient-to-br from-purple-500 to-indigo-500',
    'bg-gradient-to-br from-green-500 to-emerald-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500'
  ]

  // 根据学校名称生成稳定的主题色
  const hash = schoolName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  return themes[Math.abs(hash) % themes.length]
}

// 获取院校副标题
const getSchoolSubtitle = (school: School) => {
  // 可以显示学院信息或者其他相关信息
  if (school.schoolType === 'ART') {
    return '设计学院'
  } else if (school.schoolType === 'COMPREHENSIVE') {
    return '设计创意学院'
  } else {
    return formatSchoolType(school.schoolType)
  }
}

// 获取院校类型标签样式
const getSchoolTypeTagStyle = (schoolType: SchoolType) => {
  const styleMap: Record<string, string> = {
    'COMPREHENSIVE': 'bg-primary/10 text-primary border border-primary/20',
    'ART': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    'ENGINEERING': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'NORMAL': 'bg-green-500/10 text-green-400 border border-green-500/20',
    'FINANCE': 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
  }
  return styleMap[schoolType] || 'bg-gray-700/50 text-gray-300'
}

// 格式化地区信息
const formatLocation = (school: School) => {
  if (school.city && school.province) {
    return school.city === school.province ? school.city : school.city
  }
  return school.location || school.province || school.city || '未知'
}

// 格式化就业率
const formatEmploymentRate = (school: School) => {
  // 模拟就业率数据，实际应该从API获取
  const rates = ['96.8%', '95.2%', '92.8%', '91.5%', '89.3%', '87.6%']
  const hash = school.id % rates.length
  return rates[hash]
}

// 格式化师资力量评分
const formatFacultyStrength = (school: School) => {
  // 模拟师资力量评分，实际应该从API获取
  const scores = ['5.0', '4.9', '4.8', '4.7', '4.6', '4.5']
  const hash = (school.id + 1) % scores.length
  return scores[hash]
}

// 格式化学生评分
const formatStudentScore = (school: School) => {
  // 模拟学生评分，实际应该从API获取
  const scores = ['4.9', '4.8', '4.7', '4.6', '4.5', '4.4']
  const hash = (school.id + 2) % scores.length
  return scores[hash]
}

// 获取优势专业
const getAdvantagePrograms = (school: School) => {
  // 根据院校类型和特点生成优势专业
  const programsByType: Record<string, string[]> = {
    'COMPREHENSIVE': ['UI/UX设计', '视觉传达'],
    'ART': ['视觉传达', '产品设计'],
    'ENGINEERING': ['工业设计', '数字媒体'],
    'NORMAL': ['艺术教育', '美术学'],
    'FINANCE': ['品牌设计', '广告设计']
  }

  const programs = programsByType[school.schoolType] || ['设计学', '艺术学']
  return programs.join('、')
}
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

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
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.gradient-text {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
