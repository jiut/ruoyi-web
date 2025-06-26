<template>
  <div class="school-majors space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-400">加载专业信息...</span>
    </div>

    <!-- 专业分类展示 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div v-for="category in majorCategories" :key="category.name" class="glass-card rounded-lg p-4">
        <h4 class="text-lg font-bold mb-3 flex items-center">
          <i :class="category.icon" class="mr-2 text-primary"></i>
          {{ category.name }}
        </h4>
        <p class="text-sm text-gray-300 mb-3">{{ category.description }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in category.skills"
            :key="skill"
            class="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-300"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <!-- 课程体系 -->
    <div v-if="!loading" class="glass-card rounded-lg p-4">
      <h4 class="text-lg font-bold mb-4">课程体系</h4>
      <div class="flex flex-wrap gap-4">
        <div v-for="courseGroup in courseSystem" :key="courseGroup.name" class="flex-auto min-w-0">
          <h5 class="text-sm font-bold mb-2 text-primary">{{ courseGroup.name }}</h5>
          <ul class="space-y-1 text-sm text-gray-300">
            <li v-for="course in courseGroup.courses" :key="course">
              • {{ course }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { schoolApi } from '@/api/talent/school'

interface Props {
  schoolId: number
  majors?: any[]
}

const props = defineProps<Props>()

const loading = ref(false)
const majorCategories = ref<any[]>([])
const courseSystem = ref<any[]>([])

// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 专业模块环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

// 加载专业数据
const loadMajorData = async () => {
  try {
    loading.value = true
    const response = await schoolApi.getSchoolMajors(props.schoolId)

    if (USE_MOCK_DATA) {
      // 使用模拟数据时的数据结构
      const mockResponse = response as { majorCategories: any[]; courseSystem: any[] }
      majorCategories.value = mockResponse.majorCategories || []
      courseSystem.value = mockResponse.courseSystem || []
    } else {
      // 使用后端API时的数据结构
      const apiResponse = response as { data?: { majorCategories?: any[]; courseSystem?: any[] } }
      majorCategories.value = apiResponse.data?.majorCategories || []
      courseSystem.value = apiResponse.data?.courseSystem || []
    }
  } catch (error) {
    console.error('加载专业数据失败:', error)
    // 发生错误时使用默认数据
    majorCategories.value = []
    courseSystem.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMajorData()
})
</script>

<style scoped>
.school-majors {
  max-width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .major-item .flex {
    flex-direction: column;
    gap: 0.75rem;
  }

  .major-item .flex .flex-1 {
    width: 100%;
  }
}

.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
