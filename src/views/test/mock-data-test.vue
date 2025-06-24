<template>
  <div class="mock-data-test p-6">
    <h1 class="text-2xl font-bold mb-6">Mock数据测试页面</h1>

    <!-- 设计师数据测试 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">设计师数据测试 (共{{ designers.length }}条)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="designer in designers.slice(0, 6)"
          :key="designer.id"
          class="border rounded-lg p-4 bg-gray-50"
        >
          <div class="flex items-center mb-3">
            <img
              v-if="designer.avatar"
              :src="designer.avatar"
              :alt="designer.designerName"
              class="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h3 class="font-medium">{{ designer.designerName }}</h3>
              <p class="text-sm text-gray-600">{{ getProfessionLabel(designer.profession) }}</p>
            </div>
          </div>

          <div class="mb-3">
            <p class="text-sm"><span class="font-medium">位置:</span> {{ designer.location || '未知' }}</p>
            <p class="text-sm"><span class="font-medium">经验:</span> {{ designer.workYears || designer.experience || 0 }}年</p>
            <p class="text-sm"><span class="font-medium">状态:</span> {{ getWorkStatusLabel(designer.workStatus as WorkStatus || 'EMPLOYED' as WorkStatus) }}</p>
          </div>

          <div class="mb-3">
            <p class="text-sm font-medium mb-2">技能标签:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in getDesignerSkills(designer)"
                :key="skill"
                :class="[
                  'text-xs px-2 py-1 rounded-full border',
                  getSkillTagClasses(skill)
                ]"
              >
                {{ getSkillTagDisplayName(skill) }}
              </span>
            </div>
          </div>

          <p class="text-xs text-gray-500 truncate">{{ designer.description }}</p>
        </div>
      </div>
    </section>

    <!-- 作品数据测试 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">作品数据测试 (共{{ works.length }}条)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="work in works.slice(0, 6)"
          :key="work.id"
          class="border rounded-lg overflow-hidden bg-gray-50"
        >
          <img
            :src="work.imageUrl"
            :alt="work.title"
            class="w-full h-32 object-cover"
          />
          <div class="p-4">
            <h3 class="font-medium mb-2">{{ work.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ work.category }}</p>
            <p class="text-xs text-gray-500 line-clamp-2">{{ work.description }}</p>
            <div class="mt-2 flex justify-between text-xs text-gray-500">
              <span>设计师ID: {{ work.designerId }}</span>
              <span>{{ work.likeCount || 0 }} 赞</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 调试信息 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">调试信息</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-medium mb-2">第一位设计师完整数据:</h3>
          <pre class="text-xs overflow-auto">{{ JSON.stringify(designers[0], null, 2) }}</pre>
        </div>
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-medium mb-2">技能标签解析测试:</h3>
          <div v-if="designers[0]">
            <p class="text-sm mb-2">原始数据: {{ designers[0].skillTags }}</p>
            <p class="text-sm mb-2">解析结果: {{ getDesignerSkills(designers[0]) }}</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="skill in getDesignerSkills(designers[0])"
                :key="skill"
                :class="[
                  'text-xs px-2 py-1 rounded-full border',
                  getSkillTagClasses(skill)
                ]"
              >
                {{ getSkillTagDisplayName(skill) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSkillTags } from '@/composables/useSkillTags'
import { mockDesigners, mockWorks } from '@/data/mockDesigners'
import type { Profession, WorkStatus } from '@/types/talent/designer'
import { ProfessionLabels, WorkStatusLabels } from '@/types/talent/designer'

// 技能标签组合式函数
const {
  getTagDisplayName: getSkillTagDisplayName,
  getTagClasses: getSkillTagClasses,
  parseSkillTags
} = useSkillTags()

// 数据
const designers = computed(() => mockDesigners)
const works = computed(() => mockWorks)

// 工具函数
const getProfessionLabel = (profession: Profession) => {
  return ProfessionLabels[profession] || profession
}

const getWorkStatusLabel = (status: WorkStatus) => {
  return WorkStatusLabels[status] || '未知'
}

const getDesignerSkills = (designer: any) => {
  try {
    const skills = parseSkillTags(designer.skillTags || '[]')
    return Array.isArray(skills) ? skills : []
  } catch (error) {
    console.error('解析技能标签失败:', error)
    return []
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
