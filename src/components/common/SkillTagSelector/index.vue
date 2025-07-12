<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SkillTagUtils, { type SkillTagCategory, type SkillTagData } from '@/utils/skillTagUtils'

// 组件属性
interface Props {
  visible: boolean
  modelValue: string[] // 已选择的标签（英文简写）
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: string[]): void
  (e: 'confirm', value: string[]): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  modelValue: () => [],
})

const emit = defineEmits<Emits>()

// 响应式数据
const searchQuery = ref('')
const selectedTags = ref<string[]>([...props.modelValue])

// 所有可用标签
const allTags = computed(() => SkillTagUtils.getAllTags())

// 分类相关
const sortedCategories = computed(() => SkillTagUtils.getSortedCategories())
const categoryNames = computed(() => SkillTagUtils.categoryNames)
const categoryDescriptions = computed(() => SkillTagUtils.categoryDescriptions)

// 过滤后的标签（按分类分组）
const filteredTagsByCategory = computed(() => {
  const filtered: Record<SkillTagCategory, SkillTagData[]> = {
    tool: [],
    field: [],
    skill: [],
  }

  allTags.value.forEach((tag) => {
    const matchesSearch = !searchQuery.value
      || tag.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || tag.code.toLowerCase().includes(searchQuery.value.toLowerCase())

    if (matchesSearch)
      filtered[tag.category].push(tag)
  })

  return filtered
})

// 已选标签按分类分组
const selectedTagsByCategory = computed(() =>
  SkillTagUtils.groupTagsByCategory(selectedTags.value),
)

// 统计信息
const stats = computed(() => SkillTagUtils.getCategoryStats(selectedTags.value))

// 是否达到选择上限
const isMaxSelected = computed(() => selectedTags.value.length >= 15)

// 工具方法
const getTagClasses = (tag: string) => SkillTagUtils.getTagClasses(tag, 'sm')
const getTagDisplayName = (tag: string) => SkillTagUtils.getTagDisplayName(tag)
const isTagSelected = (tag: string) => selectedTags.value.includes(tag)
const isTagDisabled = (tag: string) => !isTagSelected(tag) && isMaxSelected.value

// 切换标签选择状态
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    // 取消选择
    selectedTags.value.splice(index, 1)
  } else {
    // 选择标签，检查是否超过限制
    if (selectedTags.value.length >= 15) {
      alert('最多只能选择15个技能标签')
      return
    }
    selectedTags.value.push(tag)
  }
}

// 处理确认
const handleConfirm = () => {
  emit('update:modelValue', [...selectedTags.value])
  emit('confirm', [...selectedTags.value])
  emit('update:visible', false)
}

// 处理取消
const handleCancel = () => {
  // 恢复到初始状态
  selectedTags.value = [...props.modelValue]
  emit('cancel')
  emit('update:visible', false)
}

// 监听外部传入的值变化
watch(() => props.modelValue, (newValue) => {
  selectedTags.value = [...newValue]
}, { deep: true })

// 监听弹窗显示状态
watch(() => props.visible, (visible) => {
  if (visible) {
    // 重置搜索
    searchQuery.value = ''
    // 同步选中状态
    selectedTags.value = [...props.modelValue]
  }
})
</script>

<template>
  <div
    v-show="visible"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="handleCancel"
  >
    <div class="glass-card rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div class="flex items-center">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-3">
            <i class="ri-price-tag-3-line" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">
              选择技能标签
              <span class="text-sm text-gray-400 font-normal">(最多15个)</span>
            </h3>
            <p class="text-sm text-gray-400 mt-1">
              已选择 {{ selectedTags.length }}/15 个标签
              <span v-if="isMaxSelected" class="text-yellow-400 ml-2">
                已达到选择上限
              </span>
              <span v-if="selectedTags.length > 0" class="ml-2">
                |
                <span class="text-blue-400">{{ stats.tool }}</span> 工具
                <span class="text-purple-400 ml-1">{{ stats.field }}</span> 领域
                <span class="text-pink-400 ml-1">{{ stats.skill }}</span> 技能
              </span>
            </p>
          </div>
        </div>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          @click="handleCancel"
        >
          <i class="ri-close-line" />
        </button>
      </div>

      <!-- 搜索栏 -->
      <div class="p-6 border-b border-gray-700">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="ri-search-line text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white pl-10 pr-4 py-3 glow-input focus:outline-none focus:border-primary"
            placeholder="搜索技能标签..."
          >
          <button
            v-if="searchQuery"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            @click="searchQuery = ''"
          >
            <i class="ri-close-line" />
          </button>
        </div>
      </div>

      <!-- 标签内容区 -->
      <div class="flex-1 overflow-hidden flex">
        <!-- 已选标签区域 -->
        <div class="w-80 border-r border-gray-700 flex flex-col">
          <div class="p-4 border-b border-gray-700">
            <h4 class="text-sm font-medium text-gray-300 flex items-center">
              <i class="ri-bookmark-line mr-2" />
              已选标签 ({{ selectedTags.length }}/15)
              <span v-if="isMaxSelected" class="ml-2 text-xs text-yellow-400">
                已满
              </span>
            </h4>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="selectedTags.length === 0" class="text-center text-gray-500 py-8">
              <i class="ri-price-tag-3-line ri-2x mb-2 block" />
              <p class="text-sm">
                暂未选择标签
              </p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="category in sortedCategories" :key="category">
                <div v-if="selectedTagsByCategory[category].length > 0">
                  <h5 class="text-xs font-medium text-gray-400 mb-2">
                    {{ categoryNames[category] }}
                  </h5>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in selectedTagsByCategory[category]"
                      :key="tag"
                      :class="getTagClasses(tag)"
                      class="inline-flex items-center cursor-pointer hover:opacity-80"
                      @click="toggleTag(tag)"
                    >
                      {{ getTagDisplayName(tag) }}
                      <i class="ri-close-line text-xs ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 可选标签区域 -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4">
            <div v-if="filteredTagsByCategory" class="space-y-6">
              <div
                v-for="category in sortedCategories"
                v-show="filteredTagsByCategory[category]?.length > 0"
                :key="category"
              >
                <div class="mb-3">
                  <h4 class="text-sm font-medium text-gray-300 flex items-center">
                    {{ categoryNames[category] }}
                    <span class="ml-2 text-xs text-gray-500">
                      ({{ filteredTagsByCategory[category]?.length || 0 }})
                    </span>
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ categoryDescriptions[category] }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in filteredTagsByCategory[category]"
                    :key="tag.code"
                    :class="[
                      getTagClasses(tag.code),
                      'transition-all duration-200',
                      {
                        'ring-2 ring-white/50': isTagSelected(tag.code),
                        'hover:ring-1 hover:ring-white/30': !isTagSelected(tag.code) && !isTagDisabled(tag.code),
                        'opacity-40 cursor-not-allowed': isTagDisabled(tag.code),
                        'cursor-pointer': !isTagDisabled(tag.code),
                      },
                    ]"
                    @click="!isTagDisabled(tag.code) && toggleTag(tag.code)"
                  >
                    {{ tag.name }}
                    <i
                      v-if="isTagSelected(tag.code)"
                      class="ri-check-line text-xs ml-1"
                    />
                    <i
                      v-else-if="isTagDisabled(tag.code)"
                      class="ri-lock-line text-xs ml-1 opacity-60"
                    />
                  </span>
                </div>
              </div>
            </div>

            <!-- 搜索无结果 -->
            <div v-if="searchQuery && Object.values(filteredTagsByCategory || {}).every(arr => arr.length === 0)" class="text-center text-gray-500 py-8">
              <i class="ri-search-line ri-2x mb-2 block" />
              <p class="text-sm">
                未找到匹配的标签
              </p>
              <p class="text-xs text-gray-600 mt-1">
                尝试使用其他关键词搜索
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between p-6 border-t border-gray-700">
        <div class="text-sm text-gray-400">
          <span>提示：点击标签进行选择，已选标签会显示在左侧，最多可选择15个标签</span>
          <span v-if="isMaxSelected" class="block text-yellow-400 text-xs mt-1">
            已达到选择上限，请取消部分标签后再选择其他标签
          </span>
        </div>
        <div class="flex space-x-3">
          <button
            class="px-4 py-2 bg-transparent border border-gray-600 rounded text-gray-300 hover:bg-gray-800 transition-colors rounded-button"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            class="px-6 py-2 gradient-bg rounded text-white font-medium rounded-button"
            @click="handleConfirm"
          >
            确认选择 ({{ selectedTags.length }}/15)
            <i v-if="isMaxSelected" class="ri-check-line ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础样式 */
.glass-card {
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(37deg, #007AFF, #AF52DE, #FF2D92);
}

/* 主色调 */
.text-primary {
  color: #0a84ff;
}

.bg-primary\/20 {
  background-color: rgba(10, 132, 255, 0.2);
}

/* 输入框聚焦效果 */
.glow-input:focus {
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5);
}

/* 按钮样式 */
.rounded-button {
  border-radius: 8px;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(28, 28, 30, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(99, 99, 102, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 99, 102, 0.5);
}
</style>
