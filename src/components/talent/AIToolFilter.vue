<template>
  <div class="ai-tool-filter space-y-6">
    <!-- 搜索框 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">🔍</span>
        搜索工具
      </h3>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索AI工具..."
          class="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          @input="onSearchChange"
        >
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">🏷️</span>
        工具分类
      </h3>
      <div class="grid grid-cols-1 gap-3">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-button p-4 rounded-lg border text-left transition-all duration-200 hover:shadow-md"
          :class="selectedCategory === category.id
            ? 'bg-blue-50 border-blue-300 shadow-sm'
            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'"
          @click="selectCategory(category.id)"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">{{ category.icon }}</span>
            <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">{{ category.count }}</span>
          </div>
          <div class="text-sm font-semibold text-gray-900">{{ category.name }}</div>
          <div class="text-xs text-gray-600 mt-1">{{ category.description }}</div>
        </button>
      </div>
    </div>

    <!-- 快速筛选 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">⚡</span>
        快速筛选
      </h3>
      <div class="flex flex-wrap gap-3">
        <button
          class="quick-filter-btn px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium"
          :class="showFeatured
            ? 'bg-yellow-100 border-yellow-300 text-yellow-700 shadow-sm'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200'"
          @click="toggleFeatured"
        >
          🔥 热门推荐
        </button>
        <button
          class="quick-filter-btn px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium"
          :class="showFreeOnly
            ? 'bg-green-100 border-green-300 text-green-700 shadow-sm'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200'"
          @click="toggleFreeOnly"
        >
          💰 免费工具
        </button>
        <button
          class="quick-filter-btn px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium"
          :class="showChineseOnly
            ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-sm'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200'"
          @click="toggleChineseOnly"
        >
          🇨🇳 中文支持
        </button>
      </div>
    </div>

    <!-- 价格筛选 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">💰</span>
        价格类型
      </h3>
      <div class="space-y-3">
        <label
          v-for="option in pricingOptions"
          :key="option.value"
          class="flex items-center cursor-pointer group"
        >
          <input
            v-model="selectedPricing"
            type="radio"
            :value="option.value"
            class="sr-only"
            @change="onPricingChange"
          >
          <div
            class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200"
            :class="selectedPricing === option.value
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 group-hover:border-blue-400'"
          >
            <div
              v-if="selectedPricing === option.value"
              class="w-2 h-2 rounded-full bg-white"
            />
          </div>
          <span class="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
            {{ option.label }}
          </span>
        </label>
      </div>
    </div>

    <!-- 排序方式 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">📊</span>
        排序方式
      </h3>
      <select
        v-model="selectedSort"
        class="w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        @change="onSortChange"
      >
        <option value="popularity">热度排序</option>
        <option value="rating">评分排序</option>
        <option value="addedDate">最新添加</option>
        <option value="name">名称排序</option>
      </select>
    </div>

    <!-- 重置按钮 -->
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <button
        class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 font-medium border border-gray-200"
        @click="resetFilters"
      >
        <i class="fas fa-refresh mr-2"></i>
        重置筛选
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AIToolCategory, AIToolQueryParams } from '@/types/talent/aitools'

interface Props {
  categories: AIToolCategory[]
  queryParams: AIToolQueryParams
}

interface Emits {
  (e: 'update:queryParams', params: AIToolQueryParams): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const searchQuery = ref(props.queryParams.search || '')
const selectedCategory = ref(props.queryParams.categoryId || '')
const selectedPricing = ref(props.queryParams.pricing || '')
const selectedSort = ref(props.queryParams.sortBy || 'popularity')
const showFeatured = ref(props.queryParams.featured || false)
const showFreeOnly = ref(false)
const showChineseOnly = ref(false)

// 价格选项
const pricingOptions = [
  { value: '', label: '全部价格' },
  { value: 'free', label: '完全免费' },
  { value: 'freemium', label: '免费试用' },
  { value: 'paid', label: '付费工具' },
  { value: 'trial', label: '试用版本' }
]

// 搜索变化处理
const onSearchChange = () => {
  updateQueryParams()
}

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = selectedCategory.value === categoryId ? '' : categoryId
  updateQueryParams()
}

// 切换热门推荐
const toggleFeatured = () => {
  showFeatured.value = !showFeatured.value
  updateQueryParams()
}

// 切换免费工具
const toggleFreeOnly = () => {
  showFreeOnly.value = !showFreeOnly.value
  if (showFreeOnly.value) {
    selectedPricing.value = 'free'
  } else {
    selectedPricing.value = ''
  }
  updateQueryParams()
}

// 切换中文支持
const toggleChineseOnly = () => {
  showChineseOnly.value = !showChineseOnly.value
  updateQueryParams()
}

// 价格筛选变化
const onPricingChange = () => {
  if (selectedPricing.value !== 'free') {
    showFreeOnly.value = false
  }
  updateQueryParams()
}

// 排序方式变化
const onSortChange = () => {
  updateQueryParams()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedPricing.value = ''
  selectedSort.value = 'popularity'
  showFeatured.value = false
  showFreeOnly.value = false
  showChineseOnly.value = false
  updateQueryParams()
}

// 更新查询参数
const updateQueryParams = () => {
  const params: AIToolQueryParams = {
    search: searchQuery.value || undefined,
    categoryId: selectedCategory.value || undefined,
    pricing: selectedPricing.value || undefined,
    sortBy: selectedSort.value as any,
    featured: showFeatured.value || undefined,
    language: showChineseOnly.value ? 'zh' : undefined,
    page: 1 // 重置到第一页
  }

  emit('update:queryParams', params)
}

// 监听外部查询参数变化
watch(() => props.queryParams, (newParams) => {
  searchQuery.value = newParams.search || ''
  selectedCategory.value = newParams.categoryId || ''
  selectedPricing.value = newParams.pricing || ''
  selectedSort.value = newParams.sortBy || 'popularity'
  showFeatured.value = newParams.featured || false
  showChineseOnly.value = newParams.language === 'zh'
  showFreeOnly.value = newParams.pricing === 'free'
}, { deep: true })
</script>

<style scoped>
.category-button {
  min-height: 80px;
}

.quick-filter-btn {
  white-space: nowrap;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* 卡片悬停效果 */
.ai-tool-filter > div {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ai-tool-filter > div:hover {
  transform: translateY(-1px);
}
</style>
