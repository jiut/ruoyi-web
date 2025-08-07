<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import type { SimpleTask } from '@/data/mockTasks'
import SkillTagSelector from '@/components/common/SkillTagSelector/index.vue'
import SkillTagUtils from '@/utils/skillTagUtils'

interface Props {
  visible: boolean
  task: SimpleTask | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [formData: TaskFormData]
}>()

interface TaskFormData {
  taskId?: number
  taskTitle: string
  taskDescription: string
  taskType: string
  skillTags: string[]
  budgetMin: number
  budgetMax: number
  deadline: string
  urgent: boolean
  deliverables: string
  paymentTerms: string
  isDraft: boolean
}

// 响应式数据
const loading = ref(false)
const message = useMessage()

const formData = reactive<TaskFormData>({
  taskTitle: '',
  taskDescription: '',
  taskType: '',
  skillTags: [],
  budgetMin: 0,
  budgetMax: 0,
  deadline: '',
  urgent: false,
  deliverables: '',
  paymentTerms: '',
  isDraft: false,
})

// 任务类型选项
const taskTypeOptions = [
  { label: 'Logo设计', value: 'LOGO_DESIGN' },
  { label: 'UI/UX设计', value: 'UI_UX_DESIGN' },
  { label: '平面设计', value: 'GRAPHIC_DESIGN' },
  { label: '插画设计', value: 'ILLUSTRATION' },
  { label: '品牌设计', value: 'BRAND_DESIGN' },
]



// 技能标签相关
const selectedSkillTags = ref<string[]>([])
const showSkillTagSelector = ref(false)

// 技能标签工具方法
const getSkillTagClasses = (tag: string) => SkillTagUtils.getTagClasses(tag, 'sm')
const getSkillTagDisplayName = (tag: string) => SkillTagUtils.getTagDisplayName(tag)

// 按分类排序的已选标签
const sortedSelectedTags = computed(() => {
  return SkillTagUtils.sortTagsByCategory(selectedSkillTags.value)
})

// 按分类分组统计的已选标签
const selectedTagsByCategory = computed(() => {
  return SkillTagUtils.groupAndSortTagsByCategory(selectedSkillTags.value)
})

// 技能标签操作方法
const removeSkillTag = (tag: string) => {
  const index = selectedSkillTags.value.indexOf(tag)
  if (index > -1) {
    selectedSkillTags.value.splice(index, 1)
    // 同步更新 formData
    formData.skillTags = [...selectedSkillTags.value]
  }
}

const handleSkillTagConfirm = (tags: string[]) => {
  if (tags.length > 15) {
    message.error('最多只能选择15个技能标签')
    return
  }
  selectedSkillTags.value = [...tags]
  // 同步更新 formData
  formData.skillTags = [...tags]
}

// 表单重置方法
const resetForm = () => {
  Object.assign(formData, {
    taskTitle: '',
    taskDescription: '',
    taskType: '',
    skillTags: [],
    budgetMin: 0,
    budgetMax: 0,
    deadline: '',
    urgent: false,
    deliverables: '',
    paymentTerms: '',
    isDraft: false,
  })
  // 重置技能标签选择
  selectedSkillTags.value = []
}

// 统一的草稿状态判断函数
const isTaskDraft = (task: any) => {
  return task.isDraft === true ||
         task.isDraft === 'true' ||
         task.isDraft === 1 ||
         task.status === 'DRAFT' ||
         task.status === 'draft' ||
         task.status === 'UNPUBLISHED' ||
         task.status === 0 ||  // 可能用数字0表示草稿
         task.published === false ||
         task.published === 'false' ||
         task.published === 0 ||
         task.isPublished === false ||
         task.isPublished === 'false' ||
         task.isPublished === 0 ||
         task.draftStatus === true ||
         task.draftStatus === 'true' ||
         task.draftStatus === 1
}

// 监听props变化，更新表单数据
watch(() => props.task, (newTask) => {
  if (newTask) {
    const task = newTask as any
    // 使用统一的草稿状态判断函数
    const isDraftStatus = isTaskDraft(task)

    Object.assign(formData, {
      taskId: newTask.taskId,
      taskTitle: newTask.taskTitle || '',
      taskDescription: newTask.taskDescription || '',
      taskType: newTask.taskType || '',
      skillTags: Array.isArray(newTask.skillTags) ? newTask.skillTags : [],
      budgetMin: newTask.budgetMin || 0,
      budgetMax: newTask.budgetMax || 0,
      deadline: formatDateTimeForFrontend(newTask.deadline || ''),
      urgent: newTask.urgent || false,
      deliverables: newTask.deliverables || '',
      paymentTerms: newTask.paymentTerms || '',
      isDraft: isDraftStatus, // 使用统一的草稿状态判断
    })
    // 同步更新技能标签选择
    selectedSkillTags.value = Array.isArray(newTask.skillTags) ? [...newTask.skillTags] : []
  } else {
    // 如果没有任务数据，重置表单
    resetForm()
  }
}, { immediate: true })

// 监听弹窗可见性变化，确保每次打开时都重新加载数据
watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.task) {
      const task = props.task as any
      // 使用统一的草稿状态判断函数
      const isDraftStatus = isTaskDraft(task)

      // 弹窗打开时重新填充数据，确保数据是最新的
      Object.assign(formData, {
        taskId: props.task.taskId,
        taskTitle: props.task.taskTitle || '',
        taskDescription: props.task.taskDescription || '',
        taskType: props.task.taskType || '',
        skillTags: Array.isArray(props.task.skillTags) ? props.task.skillTags : [],
        budgetMin: props.task.budgetMin || 0,
        budgetMax: props.task.budgetMax || 0,
        deadline: formatDateTimeForFrontend(props.task.deadline || ''),
        urgent: props.task.urgent || false,
        deliverables: props.task.deliverables || '',
        paymentTerms: props.task.paymentTerms || '',
        isDraft: isDraftStatus, // 使用统一的草稿状态判断
      })
      // 同步更新技能标签选择
      selectedSkillTags.value = Array.isArray(props.task.skillTags) ? [...props.task.skillTags] : []
    } else {
      // 创建新任务时，确保表单完全重置
      resetForm()
    }
  }
})

// 计算属性
const isFormValid = computed(() => {
  // 检查截止时间是否有效且不早于当前时间
  const isDeadlineValid = formData.deadline && new Date(formData.deadline) > new Date()

  return formData.taskTitle.trim() &&
         formData.taskDescription.trim() &&
         formData.taskType &&
         formData.budgetMin > 0 &&
         formData.budgetMax > 0 &&
         isDeadlineValid
})

// 预算验证错误信息
const budgetError = computed(() => {
  if (formData.budgetMin > 0 && formData.budgetMax > 0 && formData.budgetMax < formData.budgetMin) {
    return '最高预算不能低于最低预算'
  }
  return ''
})

// 截止时间验证错误信息
const deadlineError = computed(() => {
  if (formData.deadline && new Date(formData.deadline) <= new Date()) {
    return '截止时间不能早于当前时间'
  }
  return ''
})

// 检查未完成的必填项
const missingRequiredFields = computed(() => {
  const missing = []

  if (!formData.taskTitle.trim()) {
    missing.push('任务标题')
  }

  if (!formData.taskDescription.trim()) {
    missing.push('任务描述')
  }

  if (!formData.taskType) {
    missing.push('任务类型')
  }

  if (formData.budgetMin <= 0) {
    missing.push('最低预算')
  }

  if (formData.budgetMax <= 0) {
    missing.push('最高预算')
  }

  if (!formData.deadline) {
    missing.push('截止时间')
  } else if (new Date(formData.deadline) <= new Date()) {
    missing.push('有效的截止时间')
  }

  return missing
})

// 必填项提示信息
const requiredFieldsHint = computed(() => {
  if (missingRequiredFields.value.length === 0) {
    return ''
  }

  if (missingRequiredFields.value.length === 1) {
    return `请填写${missingRequiredFields.value[0]}`
  }

  if (missingRequiredFields.value.length <= 3) {
    return `请填写${missingRequiredFields.value.join('、')}`
  }

  return `还有 ${missingRequiredFields.value.length} 个必填项未完成`
})

// 方法
const closeModal = () => {
  emit('update:visible', false)
  // 注意：不需要在这里调用resetForm，因为我们通过监听visible变化来重新填充数据
}



const handleSubmit = async () => {
  try {
    loading.value = true

    // 格式化截止时间为后端期望的格式
    const formattedDeadline = formatDateTimeForBackend(formData.deadline)

    // 提交表单数据
    emit('submit', {
      ...formData,
      deadline: formattedDeadline
    })
  }
  catch (error) {
    console.error('提交任务失败:', error)
    message.error('提交失败，请稍后重试')
  }
  finally {
    loading.value = false
  }
}

const formatBudgetDisplay = (min: number, max: number) => {
  if (min === max) {
    return `¥${min.toLocaleString()}`
  }
  return `¥${min.toLocaleString()}-¥${max.toLocaleString()}`
}

// 获取提交按钮文字
const getSubmitButtonText = () => {
  if (props.task) {
    // 编辑模式
    return formData.isDraft ? '保存为草稿' : '保存修改'
  } else {
    // 创建模式
    return formData.isDraft ? '保存为草稿' : '发布任务'
  }
}

// 检查是否可以设置为草稿
const canSetDraft = computed(() => {
  // 创建新任务时总是可以选择草稿
  if (!props.task) return true

  // 编辑现有任务时，检查任务状态
  const task = props.task as any

  // 使用统一的草稿状态判断函数
  const isDraft = isTaskDraft(task)

  return isDraft
})

// 获取最小日期（明天）
const getMinDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

// 格式化日期时间为后端期望的格式 (yyyy-MM-dd HH:mm:ss)
const formatDateTimeForBackend = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return ''

  // datetime-local格式: "2025-08-08T18:00"
  // 后端期望格式: "2025-08-08 18:00:00"

  const date = new Date(dateTimeLocal)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = '00' // 固定为00秒

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 格式化后端日期时间为前端datetime-local格式
const formatDateTimeForFrontend = (backendDateTime: string): string => {
  if (!backendDateTime) return ''

  // 后端格式: "2025-08-08 18:00:00" 或 "2025-08-08T18:00:00"
  // datetime-local期望格式: "2025-08-08T18:00"

  const date = new Date(backendDateTime)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// TaskEditModal 组件
// 详细使用文档请查看: src/components/talent/TaskEditModal.md
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70" />
    <div
      class="modal glass-card relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-8 m-4"
      @click.stop
    >
      <button
        class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors"
        @click="closeModal"
      >
        <i class="ri-close-line ri-lg" />
      </button>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2 text-white">
          {{ task ? '编辑任务' : '创建任务' }}
        </h2>
        <p class="text-gray-300">
          填写详细的任务信息，吸引优秀的设计师申请
        </p>
        <p class="text-sm text-gray-400 mt-2">
          <span class="text-red-400">*</span> 为必填项，其他为选填项
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- 基本信息 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3" />
            基本信息
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">任务标题 <span class="text-red-400">*</span></label>
              <input
                v-model="formData.taskTitle"
                type="text"
                class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="请输入简洁明确的任务标题"
                maxlength="50"
                required
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">任务类型 <span class="text-red-400">*</span></label>
                <select
                  v-model="formData.taskType"
                  class="custom-select w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-8"
                  required
                >
                  <option value="">
                    请选择任务类型
                  </option>
                  <option v-for="option in taskTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-300 mb-2">截止时间 <span class="text-red-400">*</span></label>
                <input
                  v-model="formData.deadline"
                  type="datetime-local"
                  class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  :class="{ 'border-red-500': deadlineError }"
                  :min="getMinDate()"
                  required
                >
                <!-- 截止时间错误提示 -->
                <div v-if="deadlineError" class="text-sm text-red-400 mt-1 flex items-center">
                  <i class="ri-error-warning-line mr-1"></i>
                  {{ deadlineError }}
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">任务描述 <span class="text-red-400">*</span></label>
              <textarea
                v-model="formData.taskDescription"
                class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-32"
                placeholder="详细描述任务需求、期望效果、设计风格等"
                maxlength="2000"
                required
              />
              <div class="text-right text-xs text-gray-500 mt-1">
                {{ formData.taskDescription.length }}/2000
              </div>
            </div>
          </div>
        </div>

        <!-- 预算和技能 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3" />
            预算与技能要求
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">预算范围 <span class="text-red-400">*</span></label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-400 text-sm mb-1">最低预算</label>
                  <input
                    v-model.number="formData.budgetMin"
                    type="number"
                    class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    :class="{ 'border-red-500': budgetError }"
                    placeholder="最低价格"
                    min="100"
                    step="1"
                    required
                  >
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-1">最高预算</label>
                  <input
                    v-model.number="formData.budgetMax"
                    type="number"
                    class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    :class="{ 'border-red-500': budgetError }"
                    placeholder="最高价格"
                    :min="formData.budgetMin || 100"
                    step="1"
                    required
                  >
                </div>
              </div>
              <!-- 预算错误提示 -->
              <div v-if="budgetError" class="text-sm text-red-400 mt-2 flex items-center">
                <i class="ri-error-warning-line mr-1"></i>
                {{ budgetError }}
              </div>
              <!-- 预算范围显示 -->
              <div v-else-if="formData.budgetMin && formData.budgetMax" class="text-sm text-gray-400 mt-2">
                预算范围：{{ formatBudgetDisplay(formData.budgetMin, formData.budgetMax) }}
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">
                技能标签
                <span class="text-sm text-gray-400 ml-2">(最多选择15个)</span>
              </label>
              <div class="relative mb-2">
                <div
                  class="w-full bg-gray-800/80 border border-gray-700 rounded-lg text-white px-4 py-3 cursor-pointer hover:border-primary transition-colors flex items-center justify-between"
                  @click="showSkillTagSelector = true"
                >
                  <span v-if="selectedSkillTags.length === 0" class="text-gray-400">
                    点击选择技能标签
                  </span>
                  <span v-else class="text-white">
                    已选择 {{ selectedSkillTags.length }} 个标签
                    <span class="text-sm text-gray-400 ml-2">
                      |
                      <span class="text-blue-400">{{ selectedTagsByCategory.tool.length }}</span> 工具
                      <span class="text-purple-400 ml-1">{{ selectedTagsByCategory.field.length }}</span> 领域
                      <span class="text-pink-400 ml-1">{{ selectedTagsByCategory.skill.length }}</span> 技能
                    </span>
                  </span>
                  <i class="ri-arrow-down-s-line text-gray-400" />
                </div>
              </div>
              <div class="flex flex-wrap gap-2" :class="[selectedSkillTags.length > 0 ? 'min-h-8' : 'h-0']">
                <span
                  v-for="tag in sortedSelectedTags" :key="tag"
                  class="inline-flex items-center" :class="[getSkillTagClasses(tag)]"
                >
                  {{ getSkillTagDisplayName(tag) }}
                  <button
                    type="button" class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20"
                    @click="removeSkillTag(tag)"
                  >
                    <i class="ri-close-line text-xs" />
                  </button>
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                选择相关技能标签，帮助设计师更好地了解技能要求
              </p>
            </div>
          </div>
        </div>

        <!-- 交付和付款 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3" />
            交付与付款
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 mb-2">交付物要求</label>
              <textarea
                v-model="formData.deliverables"
                class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-24"
                placeholder="例如：AI源文件 + PNG高清导出 + 使用规范文档"
                maxlength="500"
              />
              <div class="text-right text-xs text-gray-500 mt-1">
                {{ formData.deliverables.length }}/500
              </div>
            </div>

            <div>
              <label class="block text-gray-300 mb-2">付款条款</label>
              <textarea
                v-model="formData.paymentTerms"
                class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-24"
                placeholder="例如：设计完成并通过验收后3个工作日内付款"
                maxlength="300"
              />
              <div class="text-right text-xs text-gray-500 mt-1">
                {{ formData.paymentTerms.length }}/300
              </div>
            </div>
          </div>
        </div>

        <!-- 其他设置 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3" />
            其他设置
          </h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="urgent"
                v-model="formData.urgent"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
              >
              <label for="urgent" class="ml-2 text-gray-300">
                紧急任务
                <span class="text-gray-500 text-sm ml-1">（会有特殊标记）</span>
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="isDraft"
                v-model="formData.isDraft"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
                :class="{ 'opacity-50 cursor-not-allowed': !canSetDraft }"
                :disabled="!canSetDraft"
              >
              <label for="isDraft" class="ml-2 text-gray-300" :class="{ 'opacity-50': !canSetDraft }">
                保存为草稿
                <span v-if="canSetDraft" class="text-gray-500 text-sm ml-1">（草稿状态的任务不会在任务广场显示）</span>
                <span v-else class="text-gray-500 text-sm ml-1">（已发布的任务无法转为草稿状态）</span>
              </label>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center space-y-3">
          <!-- 必填项提示信息 -->
          <div v-if="requiredFieldsHint && !loading" class="text-sm text-orange-400 flex items-center">
            <i class="ri-information-line mr-1"></i>
            {{ requiredFieldsHint }}
          </div>

          <!-- 预算错误提示 -->
          <div v-if="budgetError && !loading" class="text-sm text-red-400 flex items-center">
            <i class="ri-error-warning-line mr-1"></i>
            {{ budgetError }}
          </div>

          <!-- 截止时间错误提示 -->
          <div v-if="deadlineError && !loading" class="text-sm text-red-400 flex items-center">
            <i class="ri-error-warning-line mr-1"></i>
            {{ deadlineError }}
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-center space-x-4">
            <button
              type="button"
              class="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-base hover:border-gray-500 transition-colors"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="px-8 py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {{ loading ? '提交中...' : getSubmitButtonText() }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- 技能标签选择器 -->
  <SkillTagSelector
    v-model:visible="showSkillTagSelector"
    v-model="selectedSkillTags"
    @confirm="handleSkillTagConfirm"
  />
</template>

<style scoped>
@import '@/styles/talent.css';

.bg-primary {
  background-color: #0a84ff;
}

.text-primary {
  color: #0a84ff;
}

.border-primary {
  border-color: #0a84ff;
}

.focus\:border-primary:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

.hover\:bg-primary\/80:hover {
  background-color: rgba(10, 132, 255, 0.8);
}

/* 自定义选择框样式 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.custom-select:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 表单输入框样式 */
input[type="text"],
input[type="number"],
input[type="datetime-local"],
textarea {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="datetime-local"]:focus,
textarea:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 按钮样式 */
button[type="submit"] {
  background-color: #0a84ff;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: rgba(10, 132, 255, 0.8);
}

button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 技能标签样式 */
.bg-primary\/20 {
  background-color: rgba(10, 132, 255, 0.2);
}

/* 复选框样式 */
input[type="checkbox"]:checked {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

input[type="checkbox"]:focus {
  ring-color: #0a84ff;
}

/* 日期时间输入框的日历按钮样式 */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

/* 错误状态样式 */
.border-red-500 {
  border-color: #ef4444 !important;
}

.border-red-500:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}
</style>
