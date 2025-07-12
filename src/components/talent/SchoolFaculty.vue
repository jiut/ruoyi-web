<script setup lang="ts">
import { computed } from 'vue'
import { generateTeacherStyles, getNameInitial } from '@/utils/styleGenerator'
import type { FacultyStatsData, TeacherData } from '@/types/talent/school'

interface Props {
  schoolId: number
  facultyStats?: FacultyStatsData
  facultyMembers?: TeacherData[]
}

const props = defineProps<Props>()

// 直接使用从父组件传递的数据
const facultyStats = computed(() => props.facultyStats)
const facultyMembers = computed(() => props.facultyMembers || [])
const loading = computed(() => !props.facultyStats && !props.facultyMembers)

// 为教师数据添加样式属性
const styledFacultyMembers = computed(() => {
  return facultyMembers.value.map(teacher => generateTeacherStyles(teacher))
})
</script>

<template>
  <div class="school-faculty">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      <p class="mt-2 text-gray-400 text-sm">
        加载师资信息中...
      </p>
    </div>

    <div v-else>
      <!-- 师资概况 -->
      <div class="mb-6">
        <h4 class="text-lg font-bold mb-4">
          师资概况
        </h4>
        <div class="glass-card rounded-lg p-3 sm:p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">
                专任教师
              </p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">
                {{ facultyStats?.totalFaculty || 0 }}
              </p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">
                教授/副教授
              </p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">
                {{ facultyStats?.professors || 0 }}
              </p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">
                博士学位教师
              </p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">
                {{ facultyStats?.doctorDegree || 0 }}
              </p>
            </div>
            <div class="text-center p-2 sm:p-3 bg-gray-800/30 rounded-lg">
              <p class="text-xs text-gray-400 mb-1">
                海外背景教师
              </p>
              <p class="text-lg sm:text-2xl font-bold gradient-text mb-0">
                {{ facultyStats?.overseasBackground || 0 }}
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-0">
            {{ facultyStats?.description || '暂无师资描述' }}
          </p>
        </div>
      </div>

      <!-- 代表性教师 -->
      <div>
        <h4 class="text-lg font-bold mb-4">
          代表性教师
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="teacher in styledFacultyMembers" :key="teacher.id" class="glass-card rounded-lg p-3 sm:p-4">
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
                :class="teacher.avatarClass"
              >
                {{ getNameInitial(teacher.name) }}
              </div>
              <h5 class="text-base font-bold mb-1">
                {{ teacher.name }}
              </h5>
              <p class="text-xs text-gray-400 mb-2">
                {{ teacher.title }}
              </p>
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

/* 修复教师专业标签边框颜色被全局样式覆盖的问题 */
:deep(.border-primary\/20) {
  border-color: rgba(10, 132, 255, 0.2) !important;
}

:deep(.border-blue-500\/20) {
  border-color: rgba(59, 130, 246, 0.2) !important;
}

:deep(.border-green-500\/20) {
  border-color: rgba(34, 197, 94, 0.2) !important;
}

:deep(.border-red-500\/20) {
  border-color: rgba(239, 68, 68, 0.2) !important;
}

:deep(.border-purple-500\/20) {
  border-color: rgba(168, 85, 247, 0.2) !important;
}

:deep(.border-yellow-500\/20) {
  border-color: rgba(234, 179, 8, 0.2) !important;
}

:deep(.border-indigo-500\/20) {
  border-color: rgba(99, 102, 241, 0.2) !important;
}

:deep(.border-teal-500\/20) {
  border-color: rgba(20, 184, 166, 0.2) !important;
}

:deep(.border-orange-500\/20) {
  border-color: rgba(249, 115, 22, 0.2) !important;
}

:deep(.border-pink-500\/20) {
  border-color: rgba(236, 72, 153, 0.2) !important;
}

:deep(.border-cyan-500\/20) {
  border-color: rgba(6, 182, 212, 0.2) !important;
}

:deep(.border-amber-500\/20) {
  border-color: rgba(245, 158, 11, 0.2) !important;
}

:deep(.border-emerald-500\/20) {
  border-color: rgba(16, 185, 129, 0.2) !important;
}

:deep(.border-violet-500\/20) {
  border-color: rgba(139, 92, 246, 0.2) !important;
}

:deep(.border-rose-500\/20) {
  border-color: rgba(244, 63, 94, 0.2) !important;
}
</style>
