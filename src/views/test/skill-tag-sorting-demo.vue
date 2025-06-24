<template>
  <div class="skill-tag-sorting-demo p-8 max-w-6xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">🎯 技能标签分类排序演示</h1>
      <p class="text-gray-600 mb-4">展示技能标签按工具、专业领域、技能方法分类排序的实现效果</p>

      <!-- 排序规则说明 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 class="font-semibold mb-2">📋 排序规则说明</h3>
        <ul class="text-sm space-y-1">
          <li><span class="font-medium">1. 分类优先级：</span>🔵 工具类 > 🟣 专业领域类 > 🩷 技能方法类</li>
          <li><span class="font-medium">2. 同类内排序：</span>按中文显示名称的拼音顺序排列</li>
          <li><span class="font-medium">3. 数据来源：</span>后端返回英文简写，前端自动转换中文显示</li>
        </ul>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">🎛️ 控制面板</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 排序方向 -->
        <div>
          <label class="block text-sm font-medium mb-2">排序方向</label>
          <select
            v-model="sortOrder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">正序 (工具 → 领域 → 技能)</option>
            <option value="desc">倒序 (技能 → 领域 → 工具)</option>
          </select>
        </div>

        <!-- 显示模式 -->
        <div>
          <label class="block text-sm font-medium mb-2">显示模式</label>
          <select
            v-model="displayMode"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="simple">简单排序</option>
            <option value="grouped">分组显示</option>
          </select>
        </div>

        <!-- 标签尺寸 -->
        <div>
          <label class="block text-sm font-medium mb-2">标签尺寸</label>
          <select
            v-model="tagSize"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sm">小号</option>
            <option value="md">中号</option>
            <option value="lg">大号</option>
          </select>
        </div>
      </div>

      <!-- 开关选项 -->
      <div class="mt-6 flex flex-wrap gap-4">
        <label class="flex items-center">
          <input v-model="showStats" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="ml-2 text-sm">显示统计信息</span>
        </label>
        <label class="flex items-center">
          <input v-model="showGroupTitle" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="ml-2 text-sm">显示分组标题</span>
        </label>
        <label class="flex items-center">
          <input v-model="showCategory" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="ml-2 text-sm">显示分类信息</span>
        </label>
      </div>

      <!-- 重置按钮 -->
      <div class="mt-4">
        <button
          @click="resetSettings"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          重置设置
        </button>
      </div>
    </div>

    <!-- 演示区域 -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-xl font-semibold mb-4">
        📊 排序效果演示
        <span class="text-sm font-normal text-gray-500">(共 {{ demoTags.length }} 个标签)</span>
      </h2>

      <!-- 使用SkillTagList组件 -->
      <SkillTagList
        :tags="demoTags"
        :group-by-category="displayMode === 'grouped'"
        :size="tagSize"
        :show-stats="showStats"
        :show-group-title="showGroupTitle"
        :show-category="showCategory"
        :sort-order="sortOrder"
        container-class="mb-4"
      />
    </div>

    <!-- 技术说明 -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">💻 技术实现说明</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium mb-2">核心方法</h3>
          <ul class="text-sm space-y-1 text-gray-600">
            <li><code>sortTagsByCategory()</code> - 分类排序</li>
            <li><code>groupAndSortTagsByCategory()</code> - 分组排序</li>
            <li><code>getTagCategory()</code> - 获取分类</li>
            <li><code>getTagDisplayName()</code> - 中文转换</li>
          </ul>
        </div>
        <div>
          <h3 class="font-medium mb-2">数据流向</h3>
          <div class="text-sm text-gray-600">
            <div class="flex items-center mb-1">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              后端返回英文简写 (figma, ui_design)
            </div>
            <div class="flex items-center mb-1">
              <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              前端自动分类排序
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              显示中文名称 (Figma, UI设计)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SkillTagList from '@/components/common/SkillTagList/index.vue'

// 演示用的技能标签数据（英文简写格式）
const demoTags = [
  // 工具类
  'figma', 'sketch', 'photoshop', 'illustrator', 'axure_rp', 'adobe_xd', 'invision', 'framer',
  // 专业领域类
  'ui_design', 'interaction_design', 'brand_design', 'product_design', 'web_design', 'mobile_design',
  // 技能方法类
  'user_experience', 'user_research', 'prototype_design', 'design_system', 'wireframing', 'user_testing'
]

// 控制参数
const sortOrder = ref<'asc' | 'desc'>('asc')
const displayMode = ref<'simple' | 'grouped'>('simple')
const tagSize = ref<'sm' | 'md' | 'lg'>('md')
const showStats = ref(false)
const showGroupTitle = ref(true)
const showCategory = ref(false)

// 重置设置
const resetSettings = () => {
  sortOrder.value = 'asc'
  displayMode.value = 'simple'
  tagSize.value = 'md'
  showStats.value = false
  showGroupTitle.value = true
  showCategory.value = false
}
</script>

<style scoped>
code {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono;
}
</style>
