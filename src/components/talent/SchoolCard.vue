<template>
  <div
    class="glass-card rounded-lg glow-border card-hover cursor-pointer"
    @click="handleCardClick"
  >
    <div class="p-2 md:p-6">
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
            <h3 class="text-lg font-bold mb-0">{{ school.schoolName }}</h3>
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

        <!-- 特殊标识标签 (优先级: 985>211>双一流，只显示最高等级) -->
        <span
          v-if="school.is985"
          class="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        >
          985
        </span>
        <span
          v-else-if="school.is211"
          class="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
        >
          211
        </span>
        <span
          v-else-if="school.isDoubleFirst"
          class="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
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
import {
  getMockEmploymentRate,
  getMockFacultyStrength,
  getMockStudentScore,
  getMockAdvantagePrograms
} from '@/data/mockSchools'

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

// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 SchoolCard 环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

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

// 获取院校类型标签样式 - 完整的颜色主题配置
const getSchoolTypeTagStyle = (schoolType: SchoolType) => {
  const styleMap: Record<string, string> = {
    // 综合类 - 蓝色主题（主色调）
    'COMPREHENSIVE': 'school-tag school-tag-comprehensive bg-primary/10 text-primary border',

    // 艺术类 - 紫色主题
    'ART': 'school-tag school-tag-art bg-purple-500/10 text-purple-400 border',
    'ART_DESIGN': 'school-tag school-tag-art bg-purple-500/10 text-purple-400 border',

    // 理工类 - 深蓝色主题
    'ENGINEERING': 'school-tag school-tag-engineering bg-blue-600/10 text-blue-400 border',
    'SCIENCE': 'school-tag school-tag-science bg-cyan-500/10 text-cyan-400 border',
    'SCIENCE_ENGINEERING': 'school-tag school-tag-engineering bg-blue-600/10 text-blue-400 border',

    // 师范类 - 绿色主题
    'NORMAL': 'school-tag school-tag-normal bg-green-500/10 text-green-400 border',

    // 财经类 - 橙色主题
    'FINANCE': 'school-tag school-tag-finance bg-orange-500/10 text-orange-400 border',

    // 医学类 - 红色主题
    'MEDICAL': 'school-tag school-tag-medical bg-red-500/10 text-red-400 border',

    // 文科类 - 粉色主题
    'LIBERAL_ARTS': 'school-tag school-tag-liberal bg-pink-500/10 text-pink-400 border',

    // 农林类 - 绿色主题
    'AGRICULTURE': 'school-tag school-tag-agriculture bg-emerald-500/10 text-emerald-400 border',

    // 体育类 - 黄绿色主题
    'SPORTS': 'school-tag school-tag-sports bg-lime-500/10 text-lime-400 border',

    // 政法类 - 深灰色主题
    'POLITICS_LAW': 'school-tag school-tag-law bg-slate-500/10 text-slate-400 border',

    // 民族类 - 琥珀色主题
    'ETHNIC': 'school-tag school-tag-ethnic bg-amber-500/10 text-amber-400 border',

    // 军事类 - 深绿色主题
    'MILITARY': 'school-tag school-tag-military bg-green-800/10 text-green-300 border',

    // 职业院校 - 橙色主题
    'VOCATIONAL': 'school-tag school-tag-vocational bg-orange-500/10 text-orange-400 border',

    // 独立学院 - 灰蓝色主题
    'INDEPENDENT': 'school-tag school-tag-independent bg-gray-500/10 text-gray-400 border'
  }
  return styleMap[schoolType] || 'school-tag school-tag-default bg-gray-700/50 text-gray-300 border'
}

// 格式化地区信息
const formatLocation = (school: School) => {
  if (school.city && school.province) {
    return school.city === school.province ? school.city : school.city
  }
  return school.location || school.province || school.city || '未知'
}

// 格式化就业率 - 根据环境变量切换数据源
const formatEmploymentRate = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockEmploymentRate(school.id)
  } else {
    // TODO: 调用后端API获取真实数据
    return '请配置后端API'
  }
}

// 格式化师资力量评分 - 根据环境变量切换数据源
const formatFacultyStrength = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockFacultyStrength(school.id)
  } else {
    // TODO: 调用后端API获取真实数据
    return '请配置后端API'
  }
}

// 格式化学生评分 - 根据环境变量切换数据源
const formatStudentScore = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockStudentScore(school.id)
  } else {
    // TODO: 调用后端API获取真实数据
    return '请配置后端API'
  }
}

// 获取优势专业 - 根据环境变量切换数据源
const getAdvantagePrograms = (school: School) => {
  if (USE_MOCK_DATA) {
    return getMockAdvantagePrograms(school)
  } else {
    // TODO: 调用后端API获取真实数据
    return '请配置后端API'
  }
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
</style>
