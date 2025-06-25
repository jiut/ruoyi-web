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
							<span class="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{{
								getSchoolTypeLabel(school.schoolType) }}</span>
							<span v-if="school.is985 || school.is211"
								class="text-sm px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
								{{ school.is985 ? '985' : '' }}{{ school.is985 && school.is211 ? '/' : '' }}{{ school.is211 ? '211' : ''
								}}
							</span>
							<span class="text-sm px-3 py-1 rounded-full bg-gray-700/50 text-gray-300">{{ school.location }}</span>
							<span v-if="school.employmentData?.employmentRate"
								class="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">就业率 {{
								school.employmentData.employmentRate }}%</span>
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
							<SchoolMajors :majors="majors" />
						</div>
						<div v-show="currentTab === 'faculty'" class="tab-pane" id="facultyContent">
							<SchoolFaculty :school-id="school.id" />
						</div>
						<div v-show="currentTab === 'employment'" class="tab-pane" id="employmentContent">
							<SchoolEmployment :employment-data="employmentData" />
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
import { useSchool } from '@/composables/talent/useSchool'
import SchoolMajors from './SchoolMajors.vue'
import SchoolFaculty from './SchoolFaculty.vue'
import SchoolEmployment from './SchoolEmployment.vue'
import SchoolAchievements from './SchoolAchievements.vue'
import type { School } from '@/types/talent/school'

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

const currentTab = ref('majors')
const favoriteLoading = ref(false)
const majors = ref([])
const employmentData = ref(null)

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
</style>
