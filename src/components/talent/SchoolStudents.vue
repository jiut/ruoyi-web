<template>
  <div class="school-students space-y-6">
    <!-- 学生概览 -->
    <div class="students-card rounded-lg p-6 bg-white/5 backdrop-blur-md border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
        <i class="ri-group-line mr-2 text-blue-400"></i>
        学生概览
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat-card bg-blue-500/20 rounded-lg p-4 text-center border border-blue-500/30">
          <div class="text-2xl font-bold text-blue-400 mb-1">{{ totalStudents }}</div>
          <div class="text-gray-300 text-sm">在校学生总数</div>
        </div>
        <div class="stat-card bg-green-500/20 rounded-lg p-4 text-center border border-green-500/30">
          <div class="text-2xl font-bold text-green-400 mb-1">{{ currentStudents }}</div>
          <div class="text-gray-300 text-sm">在校生</div>
        </div>
        <div class="stat-card bg-purple-500/20 rounded-lg p-4 text-center border border-purple-500/30">
          <div class="text-2xl font-bold text-purple-400 mb-1">{{ graduatedStudents }}</div>
          <div class="text-gray-300 text-sm">毕业生</div>
        </div>
        <div class="stat-card bg-yellow-500/20 rounded-lg p-4 text-center border border-yellow-500/30">
          <div class="text-2xl font-bold text-yellow-400 mb-1">{{ employedStudents }}</div>
          <div class="text-gray-300 text-sm">已就业</div>
        </div>
      </div>
    </div>

    <!-- 学生列表 -->
    <div class="students-card rounded-lg p-6 bg-white/5 backdrop-blur-md border border-white/10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-white flex items-center">
          <i class="ri-user-line mr-2 text-green-400"></i>
          学生信息
        </h3>
        <div class="flex gap-3">
          <n-select
            v-model:value="selectedStatus"
            :options="statusOptions"
            placeholder="筛选状态"
            class="w-32"
            clearable
          />
          <n-select
            v-model:value="selectedMajor"
            :options="majorOptions"
            placeholder="筛选专业"
            class="w-40"
            clearable
          />
        </div>
      </div>

      <div v-if="filteredStudents.length > 0" class="space-y-3">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="student-item bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                :src="student.avatar || '/default-avatar.png'"
                :alt="student.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 class="text-white font-medium">{{ student.name }}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-300">
                  <span>{{ student.major }}</span>
                  <span>{{ student.grade }}级</span>
                  <span v-if="student.employmentStatus">{{ student.employmentStatus }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <n-tag :type="getStatusType(student.status)" size="small">
                {{ getStatusLabel(student.status) }}
              </n-tag>
              <n-button size="small" secondary>
                <template #icon>
                  <i class="ri-eye-line"></i>
                </template>
                查看
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-4xl mb-2">👨‍🎓</div>
        <p class="text-gray-400">暂无学生数据</p>
      </div>
    </div>

    <!-- 学生分布图表 -->
    <div class="students-card rounded-lg p-6 bg-white/5 backdrop-blur-md border border-white/10">
      <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
        <i class="ri-pie-chart-line mr-2 text-purple-400"></i>
        学生分布
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="chart-placeholder h-48 flex items-center justify-center text-gray-400 bg-white/5 rounded-lg">
          <div class="text-center">
            <i class="ri-pie-chart-line text-3xl mb-2"></i>
            <p>专业分布图</p>
          </div>
        </div>
        <div class="chart-placeholder h-48 flex items-center justify-center text-gray-400 bg-white/5 rounded-lg">
          <div class="text-center">
            <i class="ri-bar-chart-line text-3xl mb-2"></i>
            <p>年级分布图</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  schoolId: number
}

const props = defineProps<Props>()

const selectedStatus = ref<string>('')
const selectedMajor = ref<string>('')

// 模拟学生数据
const students = ref([
  {
    id: 1,
    name: '张三',
    avatar: '',
    major: '视觉传达设计',
    grade: '2021',
    status: 'current',
    employmentStatus: ''
  },
  {
    id: 2,
    name: '李四',
    avatar: '',
    major: '环境设计',
    grade: '2020',
    status: 'graduated',
    employmentStatus: '已就业'
  },
  {
    id: 3,
    name: '王五',
    avatar: '',
    major: '产品设计',
    grade: '2022',
    status: 'current',
    employmentStatus: ''
  }
])

const statusOptions = [
  { label: '在校', value: 'current' },
  { label: '毕业', value: 'graduated' }
]

const majorOptions = [
  { label: '视觉传达设计', value: '视觉传达设计' },
  { label: '环境设计', value: '环境设计' },
  { label: '产品设计', value: '产品设计' }
]

// 筛选后的学生
const filteredStudents = computed(() => {
  let filtered = students.value

  if (selectedStatus.value) {
    filtered = filtered.filter(student => student.status === selectedStatus.value)
  }

  if (selectedMajor.value) {
    filtered = filtered.filter(student => student.major === selectedMajor.value)
  }

  return filtered
})

// 统计数据
const totalStudents = computed(() => students.value.length)
const currentStudents = computed(() => students.value.filter(s => s.status === 'current').length)
const graduatedStudents = computed(() => students.value.filter(s => s.status === 'graduated').length)
const employedStudents = computed(() => students.value.filter(s => s.employmentStatus === '已就业').length)

const getStatusType = (status: string) => {
  return status === 'current' ? 'info' : 'success'
}

const getStatusLabel = (status: string) => {
  return status === 'current' ? '在校' : '毕业'
}

onMounted(async () => {
  // 加载学生数据
  // const data = await loadSchoolStudents(props.schoolId)
  // students.value = data
})
</script>

<style scoped>
.school-students {
  max-width: 100%;
}

.students-card {
  transition: all 0.3s ease;
}

.students-card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.stat-card {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.student-item {
  transition: all 0.3s ease;
}

.student-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chart-placeholder {
  border: 1px dashed rgba(255, 255, 255, 0.2);
}
</style>
