<template>
	<!-- 院校详情弹窗 - 添加动画效果 -->
	<Teleport to="body">
		<!-- 模态框覆盖层 -->
		<Transition name="modal-overlay" appear>
			<div v-if="visible" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4" @click="handleModalClick">
				<!-- 模态框主体 -->
				<Transition name="modal" appear>
					<div
						v-if="visible"
						class="modal glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-lg"
						@click.stop
					>
						<div class="p-6">
					<div class="flex justify-between items-center mb-6">
						<div class="flex items-center">
							<div
								class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white text-2xl font-bold mr-4 border border-purple-400/30">
								{{ getSchoolInitial(school.schoolName) }}
							</div>
							<div>
								<h2 class="text-2xl font-bold text-white mb-0" id="schoolName">{{ school.schoolName }}</h2>
								<p class="text-gray-400 mb-0" id="schoolDepartment">{{ getSchoolTypeLabel(school.schoolType) }}</p>
							</div>
						</div>
						<div class="flex items-center space-x-3">
							<button @click="toggleFavorite" :disabled="favoriteLoading"
								class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
								:title="isFavorited ? '已收藏' : '收藏院校'">
								<i :class="isFavorited ? 'ri-bookmark-fill' : 'ri-bookmark-line'"></i>
							</button>
							<button
								class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
								@click="visible = false">
								<i class="ri-close-line"></i>
							</button>
						</div>
					</div>

					<!-- 基本信息 -->
					<div class="mb-8">
						<div class="flex flex-wrap gap-3 mb-4">
							<!-- 院校类型标签 -->
							<span
								:class="[
									'text-sm px-3 py-1 rounded-full',
									getSchoolTypeTagStyle(school.schoolType)
								]"
							>
								{{ formatSchoolType(school.schoolType) }}
							</span>

							<!-- 特殊标识标签 (优先级: 985>211>双一流，只显示最高等级) -->
							<span
								v-if="school.is985"
								class="text-sm px-3 py-1 rounded-full school-tag school-tag-985 bg-yellow-500/10 text-yellow-400 border"
							>
								985
							</span>
							<span
								v-else-if="school.is211"
								class="text-sm px-3 py-1 rounded-full school-tag school-tag-211 bg-purple-500/10 text-purple-400 border"
							>
								211
							</span>
							<span
								v-else-if="school.isDoubleFirst"
								class="text-sm px-3 py-1 rounded-full school-tag school-tag-double-first bg-blue-500/10 text-blue-400 border"
							>
								双一流
							</span>

							<!-- 地区标签 -->
							<span class="text-sm px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
								{{ formatLocation(school) }}
							</span>

							<!-- 就业率标签 -->
							<span v-if="getEmploymentRate"
								class="text-sm px-3 py-1 rounded-full school-tag school-tag-employment bg-green-500/10 text-green-400 border">
								就业率 {{ getEmploymentRate }}
							</span>
						</div>
						<p class="text-gray-300 text-sm leading-relaxed">
							{{ school.description || '这是一所优秀的院校，致力于培养高质量的设计人才，具有深厚的教学底蕴和先进的教学理念。' }}
						</p>
					</div>

					<!-- 标签切换 -->
					<div class="border-b border-gray-700 mb-6">
						<div class="flex space-x-2">
							<button v-for="tab in tabs" :key="tab.key" @click="currentTab = tab.key" :class="[
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  currentTab === tab.key
                    ? 'border-primary text-primary tab-active'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                ]" :data-tab="tab.key">
								{{ tab.label }}
							</button>
						</div>
					</div>

					<!-- 标签内容 -->
					<div class="tab-content">
						<div v-show="currentTab === 'majors'" class="tab-pane" id="majorsContent">
							<SchoolMajors :school-id="school.id" />
						</div>
						<div v-show="currentTab === 'faculty'" class="tab-pane" id="facultyContent">
							<SchoolFaculty :school-id="school.id" />
						</div>
						<div v-show="currentTab === 'employment'" class="tab-pane" id="employmentContent">
							<SchoolEmployment :school-id="school.id" />
						</div>
						<div v-show="currentTab === 'achievements'" class="tab-pane" id="achievementsContent">
							<SchoolAchievements :school-id="school.id" />
						</div>
					</div>

						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, Teleport } from 'vue'
import { useMessage } from 'naive-ui'
import { useSchool, useSchoolFormatter } from '@/composables/talent/useSchool'
import SchoolMajors from './SchoolMajors.vue'
import SchoolFaculty from './SchoolFaculty.vue'
import SchoolEmployment from './SchoolEmployment.vue'
import SchoolAchievements from './SchoolAchievements.vue'
import { getMockEmploymentRate } from '@/data/mockSchools'
import type { School, SchoolType } from '@/types/talent/school'

interface Props {
  school: School
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const message = useMessage()
const { toggleFavorite: toggleFav } = useSchool()
const { formatSchoolType } = useSchoolFormatter()

const currentTab = ref('majors')
const favoriteLoading = ref(false)
const majors = ref([])
const employmentData = ref(null)

// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

// 获取就业率数据
const getEmploymentRate = computed(() => {
  if (USE_MOCK_DATA) {
    return getMockEmploymentRate(props.school.id)
  } else {
    // TODO: 调用后端API获取真实数据
    return props.school.employmentData?.employmentRate || null
  }
})

// 标签页配置
const tabs = [
	{ key: 'majors', label: '专业设置' },
  { key: 'faculty', label: '师资力量' },
  { key: 'employment', label: '就业情况' },
  { key: 'achievements', label: '获奖成果' }
]

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 收藏状态
const isFavorited = ref(false)

// 模态框点击处理
const handleModalClick = () => {
  visible.value = false
}

// 获取院校名称首字符
const getSchoolInitial = (name: string) => {
  return name ? name.charAt(0) : ''
}

// 获取院校类型标签
const getSchoolTypeLabel = (type: string) => {
  const labels = {
    'COMPREHENSIVE': '综合大学',
    'SCIENCE_ENGINEERING': '理工类',
    'ART_DESIGN': '艺术设计类',
    'NORMAL': '师范类',
    'VOCATIONAL': '职业院校',
    'INDEPENDENT': '独立学院'
  }
  return labels[type as keyof typeof labels] || type
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

// 收藏功能
const toggleFavorite = async () => {
  favoriteLoading.value = true
  try {
    await toggleFav(props.school.id)
    isFavorited.value = !isFavorited.value
    message.success(isFavorited.value ? '已收藏院校' : '已取消收藏')
  } catch (error) {
    message.error('操作失败，请稍后重试')
  } finally {
    favoriteLoading.value = false
  }
}

// 监听学校变化，加载相关数据
watch(() => props.school.id, async (schoolId) => {
  if (schoolId) {
    try {
      // TODO: 加载专业数据
      // majors.value = await loadSchoolMajors(schoolId)
      // TODO: 加载就业数据
      // employmentData.value = await loadEmploymentData(schoolId)

      // 暂时使用模拟数据
      majors.value = []
      employmentData.value = null
    } catch (error) {
      console.error('加载院校数据失败:', error)
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* 全局基础样式 - 从HTML移植 */
:where([class^="ri-"])::before { content: "\f3c2"; }

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

/* 模态框覆盖层样式 */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 模态框覆盖层动画 */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

/* 模态框缩放动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* 标签激活状态 */
.tab-active {
  background: rgba(10, 132, 255, 0.2);
  color: #0a84ff;
  border-color: #0a84ff;
}

/* 自定义滚动条 - 与JobDetailModal保持一致 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(28, 28, 30, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 99, 102, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 99, 102, 0.5);
}

/* 面包屑分隔符 */
.breadcrumb-separator {
  color: rgba(148, 163, 184, 0.5);
}

/* 按钮圆角 */
.rounded-button {
  border-radius: 8px;
}

/* 数字输入框处理 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 标签页内容样式 */
.tab-content {
  min-height: 300px;
}

.tab-pane {
  color: #e2e8f0;
  line-height: 1.6;
}

/* 滚动平滑性 */
.modal-content {
  scroll-behavior: smooth;
}

/* 确保模态框内容适当的间距 */
.modal-content > * {
  flex-shrink: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .school-detail-modal .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .flex.space-x-2 {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .px-4.py-2 {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .school-detail-modal .container {
    padding: 0.5rem;
  }

  .modal-content {
    padding: 0.75rem;
    margin: 0.5rem;
  }

  .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }

  .flex.space-x-3 {
    flex-direction: column;
    gap: 0.5rem;
  }

  .flex.space-x-3 button {
    width: 100%;
    justify-content: center;
  }
}

/* 兼容性样式 */
.school-detail-modal * {
  font-family: 'Noto Sans SC', sans-serif;
}

/* 过渡动画 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Tailwind辅助类补充 */
.border-primary\/20 {
  border-color: rgba(10, 132, 255, 0.2);
}

.bg-primary\/10 {
  background-color: rgba(10, 132, 255, 0.1);
}

.text-primary {
  color: #0a84ff;
}

.bg-gray-800\/50 {
  background-color: rgba(31, 41, 55, 0.5);
}

.border-gray-700\/50 {
  border-color: rgba(55, 65, 81, 0.5);
}

.hover\:bg-gray-700\/50:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(10, 132, 255, 0.9);
}

.hover\:text-primary:hover {
  color: #0a84ff;
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
</style>
