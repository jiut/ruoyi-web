<template>
  <div class="debug-page p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">设计师数据调试页面</h1>

    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">数据统计</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ mockDesigners.length }}</div>
          <div class="text-sm text-gray-600">设计师总数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ mockWorks.length }}</div>
          <div class="text-sm text-gray-600">作品总数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ uniqueSkills.length }}</div>
          <div class="text-sm text-gray-600">技能标签数</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 设计师列表 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">设计师列表</h2>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="designer in mockDesigners"
            :key="designer.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center mb-2">
              <img
                :src="designer.avatar"
                :alt="designer.designerName"
                class="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 class="font-medium">{{ designer.designerName }}</h3>
                <p class="text-sm text-gray-600">{{ designer.profession }}</p>
              </div>
            </div>

            <div class="text-sm text-gray-600 mb-2">
              <span class="flex items-center mr-4">
              <i class="ri-map-pin-line mr-1"></i>
              {{ designer.location || '未知' }}
            </span>
                              <span class="flex items-center mr-4">
                  <i class="ri-briefcase-line mr-1"></i>
                  {{ designer.workYears || designer.experience || 0 }}年经验
                </span>
                <span class="flex items-center">
                  <i class="ri-user-star-line mr-1"></i>
                  {{ designer.workStatus || 'EMPLOYED' }}
                </span>
            </div>

            <div class="mb-2">
              <span class="text-sm font-medium text-gray-700">技能标签: </span>
              <span class="text-sm text-gray-600">{{ designer.skillTags }}</span>
            </div>

            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in parseDesignerSkills(designer.skillTags)"
                :key="skill"
                class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能标签统计 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">技能标签统计</h2>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="[skill, count] in skillStats"
            :key="skill"
            class="flex justify-between items-center py-2 border-b border-gray-100"
          >
            <span class="text-sm">{{ skill }}</span>
            <span class="text-sm font-medium text-blue-600">{{ count }}次</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 原始数据查看器 -->
    <div class="mt-6 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">原始数据示例 (第一位设计师)</h2>
      <pre class="text-xs bg-gray-50 p-4 rounded overflow-auto">{{ JSON.stringify(mockDesigners[0], null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockDesigners, mockWorks } from '@/data/mockDesigners'

// 解析技能标签
const parseDesignerSkills = (skillTags: string) => {
  try {
    return JSON.parse(skillTags || '[]')
  } catch {
    return []
  }
}

// 获取所有技能标签
const allSkills = computed(() => {
  const skills: string[] = []
  mockDesigners.forEach(designer => {
    const designerSkills = parseDesignerSkills(designer.skillTags)
    skills.push(...designerSkills)
  })
  return skills
})

// 去重技能标签
const uniqueSkills = computed(() => {
  return [...new Set(allSkills.value)]
})

// 技能标签统计
const skillStats = computed(() => {
  const stats = new Map<string, number>()
  allSkills.value.forEach(skill => {
    stats.set(skill, (stats.get(skill) || 0) + 1)
  })
  return Array.from(stats.entries()).sort((a, b) => b[1] - a[1])
})
</script>

<style scoped>
.debug-page {
  font-family: 'Noto Sans SC', sans-serif;
}
</style>
