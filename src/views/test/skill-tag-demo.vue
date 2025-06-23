<template>
  <div class="p-8 bg-gray-900 min-h-screen">
    <h1 class="text-2xl font-bold text-white mb-8">技能标签颜色测试</h1>

    <!-- 测试各类标签 -->
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold text-blue-400 mb-4">🔵 设计工具类 (TOOL)</h2>
        <div class="flex flex-wrap gap-2">
          <SkillTag tag="figma" />
          <SkillTag tag="sketch" />
          <SkillTag tag="photoshop" />
          <SkillTag tag="illustrator" />
          <SkillTag tag="axure_rp" />
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-purple-400 mb-4">🟣 专业领域类 (FIELD)</h2>
        <div class="flex flex-wrap gap-2">
          <SkillTag tag="interaction_design" />
          <SkillTag tag="ui_design" />
          <SkillTag tag="brand_design" />
          <SkillTag tag="product_design" />
          <SkillTag tag="motion_design" />
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-pink-400 mb-4">🩷 技能方法类 (SKILL)</h2>
        <div class="flex flex-wrap gap-2">
          <SkillTag tag="user_experience" />
          <SkillTag tag="user_research" />
          <SkillTag tag="prototype_design" />
          <SkillTag tag="design_system" />
          <SkillTag tag="wireframing" />
        </div>
      </div>

      <!-- 测试渲染的 HTML 类名 -->
      <div>
        <h2 class="text-lg font-semibold text-gray-300 mb-4">生成的 CSS 类名测试</h2>
        <div class="bg-gray-800 p-4 rounded">
          <pre class="text-green-400 text-sm">{{ debugInfo }}</pre>
        </div>
      </div>

      <!-- 直接使用 CSS 类名测试 -->
      <div>
        <h2 class="text-lg font-semibold text-gray-300 mb-4">直接 CSS 类名测试</h2>
        <div class="flex flex-wrap gap-2">
          <span class="skill-tag skill-tag-tool">工具类样式</span>
          <span class="skill-tag skill-tag-field">领域类样式</span>
          <span class="skill-tag skill-tag-skill">技能类样式</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SkillTag } from '@/components/common'
import { useSkillTags } from '@/composables/useSkillTags'

const { getTagClasses, getTagDisplayName, getTagCategory } = useSkillTags()

const debugInfo = computed(() => {
  const testTags = ['figma', 'interaction_design', 'user_experience']
  return testTags.map(tag => {
    return `标签: ${tag}
显示名: ${getTagDisplayName(tag)}
分类: ${getTagCategory(tag)}
CSS类名: ${getTagClasses(tag)}
`
  }).join('\n')
})
</script>

<style scoped>
/* 样式通过全局 skill-tags.css 控制 */
</style>
