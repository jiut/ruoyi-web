<template>
  <div
    class="ai-tool-card group cursor-pointer rounded-xl bg-white border border-gray-200 p-6 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105"
    @click="openTool"
  >
    <!-- 头部：Logo和验证标识 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden border border-blue-200 relative group"
        >
          <img
            v-if="tool.logo"
            :src="tool.logo"
            :alt="`${tool.name} logo`"
            class="w-full h-full object-cover transition-transform group-hover:scale-110"
            @error="handleImageError"
            @load="handleImageLoad"
          >
          <span
            v-if="!tool.logo || showFallback"
            class="text-white font-bold text-lg"
          >
            {{ getInitial(tool.name) }}
          </span>
          <!-- 加载状态指示器 -->
          <div
            v-if="tool.logo && imageLoading"
            class="absolute inset-0 bg-blue-500 flex items-center justify-center"
          >
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span v-if="tool.verified" class="text-green-600 text-sm font-medium" title="已验证">✓</span>
          <span v-if="tool.featured" class="text-orange-500 text-sm" title="热门推荐">🔥</span>
        </div>
      </div>

      <!-- 收藏按钮 -->
      <button
        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-500 transition-all duration-200 p-1 rounded-full hover:bg-yellow-50"
        @click.stop="toggleFavorite"
        title="收藏"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    </div>

    <!-- 工具名称和分类 -->
    <div class="mb-3">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {{ tool.name }}
        </h3>
        <!-- 官网链接小图标 -->
        <button
          @click.stop="openTool"
          class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all duration-200 p-1"
          title="访问官网"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </button>
      </div>
      <p class="text-sm text-gray-600 font-medium">
        {{ getCategoryName(tool.categoryId) }}
      </p>
    </div>

    <!-- 描述 -->
    <p class="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
      {{ tool.description }}
    </p>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="tag in tool.tags.slice(0, 3)"
        :key="tag"
        class="px-3 py-1 bg-blue-50 text-xs text-blue-700 rounded-full border border-blue-200 font-medium"
      >
        {{ tag }}
      </span>
      <span
        v-if="tool.tags.length > 3"
        class="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full border border-gray-200"
      >
        +{{ tool.tags.length - 3 }}
      </span>
    </div>

    <!-- 底部信息 -->
    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
      <!-- 评分和语言 -->
      <div class="flex items-center space-x-4">
        <div v-if="tool.rating" class="flex items-center space-x-1">
          <div class="flex space-x-0.5">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-3 h-3"
              :class="i <= tool.rating ? 'text-yellow-500' : 'text-gray-300'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-xs text-gray-600 font-medium">{{ tool.rating.toFixed(1) }}</span>
        </div>

        <span class="text-xs text-gray-500 font-medium">
          {{ getLanguageText(tool.language) }}
        </span>
      </div>

      <!-- 价格标签 -->
      <div class="flex items-center">
        <span
          class="px-3 py-1 text-xs rounded-full border font-medium"
          :class="getPricingStyle(tool.pricing)"
        >
          {{ getPricingText(tool.pricing, tool.pricingText) }}
        </span>
      </div>
    </div>

    <!-- 悬停时显示的访问按钮 -->
    <div class="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
        @click.stop="openTool"
      >
        <i class="fas fa-external-link-alt mr-2"></i>
        立即使用
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AITool } from '@/types/talent/aitools'
import { mockAIToolCategories } from '@/data/mockAITools'

interface Props {
  tool: AITool
}

const props = defineProps<Props>()

// 图片加载状态
const imageLoading = ref(true)
const showFallback = ref(false)

// 获取工具名称首字母
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

// 处理图片加载错误
const handleImageError = () => {
  showFallback.value = true
  imageLoading.value = false
}

// 处理图片加载成功
const handleImageLoad = () => {
  imageLoading.value = false
}

// 获取分类名称
const getCategoryName = (categoryId: string): string => {
  const category = mockAIToolCategories.find(cat => cat.id === categoryId)
  return category?.name || '未分类'
}

// 获取语言文本
const getLanguageText = (language: string): string => {
  const languageMap = {
    'zh': '中文',
    'en': '英文',
    'multi': '多语言'
  }
  return languageMap[language as keyof typeof languageMap] || language
}

// 获取定价样式
const getPricingStyle = (pricing: string): string => {
  const styleMap = {
    'free': 'bg-green-100 text-green-700 border-green-300',
    'freemium': 'bg-blue-100 text-blue-700 border-blue-300',
    'paid': 'bg-purple-100 text-purple-700 border-purple-300',
    'trial': 'bg-orange-100 text-orange-700 border-orange-300'
  }
  return styleMap[pricing as keyof typeof styleMap] || 'bg-gray-100 text-gray-700 border-gray-300'
}

// 获取定价文本
const getPricingText = (pricing: string, pricingText?: string): string => {
  if (pricingText) return pricingText

  const textMap = {
    'free': '免费',
    'freemium': '免费试用',
    'paid': '付费',
    'trial': '试用'
  }
  return textMap[pricing as keyof typeof textMap] || pricing
}

// 打开工具
const openTool = () => {
  window.open(props.tool.url, '_blank')
}

// 切换收藏状态
const toggleFavorite = () => {
  // TODO: 实现收藏功能
  console.log('Toggle favorite for:', props.tool.name)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ai-tool-card {
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ai-tool-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
