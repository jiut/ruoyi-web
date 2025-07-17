<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">

    <!-- 页面标题区 -->
    <section class="py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-gradient-to-r from-blue-600/10 to-blue-500/5"></div>
      </div>
      <div class="container mx-auto px-6 relative z-10 mt-16">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <div class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-2">AI工具库</div>
            <div class="text-gray-900">发现优质AI工具</div>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            发现 {{ totalTools.toLocaleString() }} 个优质AI工具，涵盖聊天、写作、绘画、编程等各个领域，助力您的工作和创作
          </p>

          <!-- 统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div class="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div class="text-2xl font-bold text-green-600 mb-1">{{ freeToolsCount }}</div>
              <div class="text-sm text-gray-600">免费工具</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div class="text-2xl font-bold text-yellow-600 mb-1">{{ featuredToolsCount }}</div>
              <div class="text-sm text-gray-600">热门工具</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div class="text-2xl font-bold text-blue-600 mb-1">{{ categories.length }}</div>
              <div class="text-sm text-gray-600">工具分类</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <main class="container mx-auto px-6 pb-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧筛选器 -->
        <aside class="lg:w-80">
          <div class="sticky top-24">
            <AIToolFilter
              :categories="categories"
              :query-params="queryParams"
              @update:query-params="updateQueryParams"
            />
          </div>
        </aside>

        <!-- 右侧工具列表 -->
        <div class="flex-1">
          <!-- 顶部工具栏 -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div class="flex items-center space-x-4">
                <span class="text-gray-700">
                  找到 <span class="text-gray-900 font-semibold">{{ filteredTools.length }}</span> 个工具
                </span>
                <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
                  <span
                    v-if="queryParams.search"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-200"
                  >
                    搜索: {{ queryParams.search }}
                    <button @click="clearSearch" class="ml-2 hover:text-blue-900 font-medium">×</button>
                  </span>
                  <span
                    v-if="queryParams.categoryId"
                    class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200"
                  >
                    {{ getCategoryName(queryParams.categoryId) }}
                    <button @click="clearCategory" class="ml-2 hover:text-purple-900 font-medium">×</button>
                  </span>
                  <span
                    v-if="queryParams.featured"
                    class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full border border-yellow-200"
                  >
                    热门推荐
                    <button @click="clearFeatured" class="ml-2 hover:text-yellow-900 font-medium">×</button>
                  </span>
                </div>
              </div>

              <!-- 视图切换 -->
              <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  class="p-2 rounded-lg transition-colors"
                  :class="viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  @click="viewMode = 'grid'"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  class="p-2 rounded-lg transition-colors"
                  :class="viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  @click="viewMode = 'list'"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p class="mt-6 text-gray-600 text-lg">加载中...</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredTools.length === 0" class="text-center py-20">
            <div class="bg-white rounded-xl p-12 shadow-lg border border-gray-200">
              <div class="text-8xl mb-6">🔍</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">没有找到相关工具</h3>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">试试调整筛选条件或搜索关键词，或许能找到您需要的工具</p>
              <a-button
                type="primary"
                size="large"
                class="!rounded-button bg-blue-600 border-blue-600 hover:bg-blue-700"
                @click="clearAllFilters"
              >
                <i class="fas fa-refresh mr-2"></i>
                清除所有筛选
              </a-button>
            </div>
          </div>

          <!-- 工具网格 -->
          <div
            v-else
            class="transition-all duration-300"
            :class="viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-6'"
          >
            <AIToolCard
              v-for="tool in paginatedTools"
              :key="tool.id"
              :tool="tool"
              :class="viewMode === 'list' ? 'max-w-none' : ''"
            />
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="mt-12">
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <nav class="flex items-center justify-center space-x-2">
                <a-button
                  :disabled="currentPage === 1"
                  class="!rounded-button"
                  @click="goToPage(currentPage - 1)"
                >
                  <i class="fas fa-chevron-left mr-1"></i>
                  上一页
                </a-button>

                <template v-for="page in visiblePages" :key="page">
                  <a-button
                    v-if="page !== '...'"
                    :type="page === currentPage ? 'primary' : 'default'"
                    class="!rounded-button"
                    :class="page === currentPage ? 'bg-blue-600 border-blue-600' : ''"
                    @click="goToPage(page as number)"
                  >
                    {{ page }}
                  </a-button>
                  <span v-else class="px-3 py-2 text-gray-400">...</span>
                </template>

                <a-button
                  :disabled="currentPage === totalPages"
                  class="!rounded-button"
                  @click="goToPage(currentPage + 1)"
                >
                  下一页
                  <i class="fas fa-chevron-right ml-1"></i>
                </a-button>
              </nav>

              <div class="text-center mt-4 text-sm text-gray-500">
                第 {{ currentPage }} 页，共 {{ totalPages }} 页，总计 {{ filteredTools.length }} 个工具
              </div>
            </div>
          </div>

          <!-- 加载更多按钮 (移动端) -->
          <div v-if="totalPages > 1 && currentPage < totalPages" class="mt-8 text-center lg:hidden">
            <a-button
              size="large"
              class="!rounded-button bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
              @click="loadMore"
            >
              <i class="fas fa-plus mr-2"></i>
              加载更多 ({{ currentPage }}/{{ totalPages }})
            </a-button>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部推荐区域 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            发现更多可能
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            探索更多功能和服务，让AI成为您创作路上的最佳伙伴
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <!-- 人才库 -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <i class="fas fa-users text-xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">星海人才</h3>
            <p class="text-gray-600 mb-6">发现优秀设计师，寻找理想的合作伙伴</p>
            <router-link
              to="/talent/designers"
              class="text-blue-600 hover:text-blue-700 flex items-center font-medium"
            >
              <span>探索人才库</span>
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
          </div>

          <!-- 任务中心 -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
            <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <i class="fas fa-tasks text-xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">智图工厂</h3>
            <p class="text-gray-600 mb-6">发布需求，智能匹配，高效完成项目</p>
            <router-link
              to="/task"
              class="text-purple-600 hover:text-purple-700 flex items-center font-medium"
            >
              <span>发布任务</span>
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
          </div>

          <!-- 回到首页 -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <i class="fas fa-home text-xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">平台首页</h3>
            <p class="text-gray-600 mb-6">返回主页，探索更多功能和服务</p>
            <router-link
              to="/"
              class="text-green-600 hover:text-green-700 flex items-center font-medium"
            >
              <span>返回首页</span>
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import AIToolFilter from '@/components/talent/AIToolFilter.vue'
import AIToolCard from '@/components/talent/AIToolCard.vue'
import { mockAITools, mockAIToolCategories, getFeaturedTools } from '@/data/mockAITools'
import type { AITool, AIToolCategory, AIToolQueryParams } from '@/types/talent/aitools'

// 响应式数据
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const pageSize = ref(12)

// 查询参数
const queryParams = ref<AIToolQueryParams>({
  sortBy: 'popularity',
  sortOrder: 'desc',
  page: 1,
  pageSize: 12
})

// 基础数据
const tools = ref<AITool[]>(mockAITools)
const categories = ref<AIToolCategory[]>(mockAIToolCategories)

// 计算属性
const totalTools = computed(() => tools.value.length)
const freeToolsCount = computed(() => tools.value.filter(tool => tool.pricing === 'free').length)
const featuredToolsCount = computed(() => tools.value.filter(tool => tool.featured).length)

// 筛选后的工具
const filteredTools = computed(() => {
  let result = [...tools.value]

  // 搜索筛选
  if (queryParams.value.search) {
    const searchTerm = queryParams.value.search.toLowerCase()
    result = result.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // 分类筛选
  if (queryParams.value.categoryId) {
    result = result.filter(tool => tool.categoryId === queryParams.value.categoryId)
  }

  // 价格筛选
  if (queryParams.value.pricing) {
    result = result.filter(tool => tool.pricing === queryParams.value.pricing)
  }

  // 语言筛选
  if (queryParams.value.language) {
    result = result.filter(tool =>
      tool.language === queryParams.value.language || tool.language === 'multi'
    )
  }

  // 热门筛选
  if (queryParams.value.featured) {
    result = result.filter(tool => tool.featured)
  }

  // 排序
  const sortBy = queryParams.value.sortBy || 'popularity'
  const sortOrder = queryParams.value.sortOrder || 'desc'

  result.sort((a, b) => {
    let valueA: any
    let valueB: any

    switch (sortBy) {
      case 'popularity':
        valueA = a.popularity || 0
        valueB = b.popularity || 0
        break
      case 'rating':
        valueA = a.rating || 0
        valueB = b.rating || 0
        break
      case 'addedDate':
        valueA = new Date(a.addedDate).getTime()
        valueB = new Date(b.addedDate).getTime()
        break
      case 'name':
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
        break
      default:
        valueA = a.popularity || 0
        valueB = b.popularity || 0
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
    }
  })

  return result
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredTools.value.length / pageSize.value))

// 当前页工具
const paginatedTools = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTools.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 3) {
      pages.push('...')
    }

    pages.push(total)
  }

  return pages
})

// 是否有活跃筛选
const hasActiveFilters = computed(() => {
  return !!(queryParams.value.search ||
           queryParams.value.categoryId ||
           queryParams.value.pricing ||
           queryParams.value.featured ||
           queryParams.value.language)
})

// 方法
const updateQueryParams = (params: AIToolQueryParams) => {
  queryParams.value = { ...params }
  currentPage.value = 1
}

const getCategoryName = (categoryId: string): string => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category?.name || '未知分类'
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const loadMore = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 清除筛选
const clearSearch = () => {
  queryParams.value = { ...queryParams.value, search: undefined }
}

const clearCategory = () => {
  queryParams.value = { ...queryParams.value, categoryId: undefined }
}

const clearFeatured = () => {
  queryParams.value = { ...queryParams.value, featured: undefined }
}

const clearAllFilters = () => {
  queryParams.value = {
    sortBy: 'popularity',
    sortOrder: 'desc',
    page: 1,
    pageSize: 12
  }
  currentPage.value = 1
}

// 生命周期
onMounted(() => {
  // 添加talent-mode类以覆盖全局高度限制
  document.documentElement.classList.add('talent-mode')
})

onUnmounted(() => {
  // 移除talent-mode类
  document.documentElement.classList.remove('talent-mode')
})

// 监听筛选变化重置页码
watch(() => queryParams.value, () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
@import '@/styles/talent.css';

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 卡片悬停效果 */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
}

/* 动画效果 */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
