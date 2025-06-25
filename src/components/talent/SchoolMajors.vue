<template>
  <div class="school-majors space-y-6">
    <!-- 专业分类展示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
    <div class="glass-card rounded-lg p-4">
      <h4 class="text-lg font-bold mb-4">课程体系</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="courseGroup in courseSystem" :key="courseGroup.name">
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
import { ref, computed, onMounted } from 'vue'

interface Props {
  schoolId: number
  majors?: any[]
}

const props = defineProps<Props>()

const loading = ref(false)

// 专业分类数据
const majorCategories = computed(() => [
  {
    name: '视觉传达设计',
    icon: 'ri-palette-line',
    description: '培养具备视觉传达设计基本理论、知识和技能，能在设计机构、企事业单位从事视觉传达设计及研究的专业人才。',
    skills: ['平面设计', '品牌设计', '信息设计', '广告设计']
  },
  {
    name: '数字媒体艺术',
    icon: 'ri-computer-line',
    description: '培养具备数字媒体艺术设计理论知识与实践技能，能在数字媒体相关行业从事设计、制作、研究和管理的专业人才。',
    skills: ['交互设计', 'UI/UX设计', '数字影像', '新媒体艺术']
  },
  {
    name: '产品设计',
    icon: 'ri-lightbulb-line',
    description: '培养具备产品设计基本理论、知识和技能，能在企事业单位、专业设计机构从事产品设计及研究的专业人才。',
    skills: ['工业设计', '家具设计', '交通工具设计', '智能产品设计']
  },
  {
    name: '环境设计',
    icon: 'ri-building-line',
    description: '培养具备环境设计基本理论、知识和技能，能在设计机构、企事业单位从事环境设计及研究的专业人才。',
    skills: ['室内设计', '展示设计', '景观设计', '公共空间设计']
  }
])

// 课程体系
const courseSystem = computed(() => [
  {
    name: '基础课程',
    courses: [
      '设计素描',
      '色彩构成',
      '平面构成',
      '立体构成',
      '设计史论',
      '设计方法学'
    ]
  },
  {
    name: '专业核心课程',
    courses: [
      '设计思维与创新',
      '用户研究方法',
      '品牌设计策略',
      '交互设计原理',
      '数字媒体技术',
      '服务设计'
    ]
  },
  {
    name: '实践课程',
    courses: [
      '设计工作坊',
      '企业项目实践',
      '毕业设计',
      '专业实习',
      '国际交流项目',
      '创新创业实践'
    ]
  }
])

onMounted(async () => {
  // 这里可以调用API加载专业数据
  // const data = await loadSchoolMajors(props.schoolId)
  // majors.value = data
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
