<template>
  <div class="school-faculty">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-400 text-sm">加载师资信息中...</p>
    </div>

    <div v-else>
      <!-- 师资概况 -->
      <div class="mb-6">
        <h4 class="text-lg font-bold mb-4">师资概况</h4>
        <div class="glass-card rounded-lg p-3 sm:p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">专任教师</p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">{{ facultyStats?.totalFaculty || 0 }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">教授/副教授</p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">{{ facultyStats?.professors || 0 }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">博士学位教师</p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">{{ facultyStats?.doctorDegree || 0 }}</p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">海外背景教师</p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">{{ facultyStats?.overseasBackground || 0 }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-0">
            {{ facultyStats?.description || '暂无师资描述' }}
          </p>
        </div>
      </div>

      <!-- 代表性教师 -->
      <div>
        <h4 class="text-lg font-bold mb-4">代表性教师</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="teacher in facultyMembers" :key="teacher.id" class="glass-card rounded-lg p-3 sm:p-4">
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
                :class="teacher.avatarClass"
              >
                {{ teacher.initial }}
              </div>
              <h5 class="text-base font-bold mb-1">{{ teacher.name }}</h5>
              <p class="text-xs text-gray-400 mb-2">{{ teacher.title }}</p>
              <div class="flex flex-wrap justify-center gap-1 mb-3">
                <span
                  v-for="(expertise, index) in teacher.expertise"
                  :key="expertise"
                  :class="teacher.tagClasses[index]"
                  class="text-xs px-2 py-0.5 rounded-full border"
                >
                  {{ expertise }}
                </span>
              </div>
              <p class="text-xs text-gray-300 text-center mb-0">
                {{ teacher.description }}
              </p>
            </div>
          </div>
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
}

const props = defineProps<Props>()

const loading = ref(true)
const facultyStats = ref<any>(null)
const facultyMembers = ref<any[]>([])

// 环境配置：根据VITE_USE_MOCK_DATA切换数据源
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 师资模块环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

// 获取师资信息
const fetchFacultyData = async () => {
  loading.value = true
  try {
    const response = await schoolApi.getSchoolFaculty(props.schoolId)

    if (USE_MOCK_DATA) {
      // 使用模拟数据时的数据结构
      const mockResponse = response as { facultyStats: any; facultyMembers: any[] }
      facultyStats.value = mockResponse.facultyStats
      facultyMembers.value = mockResponse.facultyMembers
    } else {
      // 使用后端API时的数据结构
      const apiResponse = response as { data?: { facultyStats?: any; facultyMembers?: any[] } }
      facultyStats.value = apiResponse.data?.facultyStats || null
      facultyMembers.value = apiResponse.data?.facultyMembers || []
    }
  } catch (error) {
    console.error('获取师资数据失败:', error)
    // 发生错误时使用默认数据
    facultyStats.value = null
    facultyMembers.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFacultyData()
})
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
