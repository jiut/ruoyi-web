<template>
  <div class="school-faculty">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-400 text-sm">加载师资信息中...</p>
    </div>

    <div v-else>
      <!-- 师资概况 -->
      <div class="glass-card rounded-lg p-6 mb-6">
        <h4 class="text-lg font-bold mb-4">师资概况</h4>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">专任教师</p>
            <p class="text-2xl font-bold gradient-text">68</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">教授/副教授</p>
            <p class="text-2xl font-bold gradient-text">42</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">博士学位教师</p>
            <p class="text-2xl font-bold gradient-text">53</p>
          </div>
          <div class="text-center p-3 bg-gray-800/30 rounded-lg">
            <p class="text-xs text-gray-400 mb-1">海外背景教师</p>
            <p class="text-2xl font-bold gradient-text">35</p>
          </div>
        </div>
        <p class="text-sm text-gray-300">
          清华大学美术学院设计系拥有一支高水平的师资队伍，包括长江学者特聘教授2名，国家杰出青年基金获得者3名，国家级教学名师2名。教师团队中有多位在国际设计领域具有重要影响力的专家学者，以及来自行业一线的兼职教师。学院注重教师的国际交流与合作，定期邀请国际知名设计师和学者来校讲学。
        </p>
      </div>

      <!-- 代表性教师 -->
      <div class="mb-6">
        <h4 class="text-lg font-bold mb-4">代表性教师</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="teacher in facultyMembers" :key="teacher.id" class="glass-card rounded-lg p-4">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                {{ teacher.initial }}
              </div>
              <h5 class="text-base font-bold mb-1">{{ teacher.name }}</h5>
              <p class="text-xs text-gray-400 mb-2">{{ teacher.title }}</p>
              <div class="flex flex-wrap justify-center gap-1 mb-3">
                <span
                  v-for="expertise in teacher.expertise"
                  :key="expertise"
                  class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {{ expertise }}
                </span>
              </div>
              <p class="text-xs text-gray-300 text-center">
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
import { ref, computed, onMounted } from 'vue'

interface Props {
  schoolId: number
}

const props = defineProps<Props>()

const loading = ref(true)

// 代表性教师数据
const facultyMembers = computed(() => [
  {
    id: 1,
    name: '张松鹤',
    initial: '张',
    title: '教授 / 博士生导师',
    expertise: ['视觉传达', '品牌设计'],
    description: '国际平面设计联盟(AGI)会员，曾获中国设计金奖，多次担任国际设计大赛评委。'
  },
  {
    id: 2,
    name: '李江华',
    initial: '李',
    title: '教授 / 博士生导师',
    expertise: ['交互设计', '用户体验'],
    description: '前谷歌用户体验设计总监，拥有多项设计专利，在人机交互领域具有重要影响力。'
  },
  {
    id: 3,
    name: '王明非',
    initial: '王',
    title: '副教授 / 硕士生导师',
    expertise: ['产品设计', '设计思维'],
    description: '国家杰出青年基金获得者，在可持续设计领域有深入研究，出版专著3部。'
  }
])



// 获取师资信息
const fetchFacultyData = async () => {
  loading.value = true
  try {
    // 这里可以调用真实的API获取师资数据
    // const data = await getFacultyData(props.schoolId)

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    loading.value = false
  } catch (error) {
    console.error('获取师资数据失败:', error)
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
