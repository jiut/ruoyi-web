<template>
  <div class="school-student-works">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <p class="mt-2 text-gray-400 text-sm">加载学生作品中...</p>
    </div>

    <div v-else>
      <!-- 作品分类筛选 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-full text-sm transition-colors',
            selectedCategory === category
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- 作品统计 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="text-center p-4 bg-gray-800/30 rounded-lg">
          <div class="text-xl font-bold text-blue-400 mb-1">{{ worksStats.totalWorks }}</div>
          <div class="text-sm text-gray-400">作品总数</div>
        </div>
        <div class="text-center p-4 bg-gray-800/30 rounded-lg">
          <div class="text-xl font-bold text-green-400 mb-1">{{ worksStats.awardWorks }}</div>
          <div class="text-sm text-gray-400">获奖作品</div>
        </div>
        <div class="text-center p-4 bg-gray-800/30 rounded-lg">
          <div class="text-xl font-bold text-purple-400 mb-1">{{ worksStats.publishedWorks }}</div>
          <div class="text-sm text-gray-400">发表作品</div>
        </div>
        <div class="text-center p-4 bg-gray-800/30 rounded-lg">
          <div class="text-xl font-bold text-yellow-400 mb-1">{{ worksStats.exhibitionWorks }}</div>
          <div class="text-sm text-gray-400">展览作品</div>
        </div>
      </div>

      <!-- 作品展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="work in filteredWorks"
          :key="work.id"
          class="work-card rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
          @click="viewWork(work)"
        >
          <div class="relative">
            <img :src="work.imageUrl" :alt="work.title" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2">
              <span
                v-if="work.award"
                class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              >
                {{ work.award }}
              </span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h4 class="font-medium text-white mb-1">{{ work.title }}</h4>
              <p class="text-xs text-gray-300">{{ work.author }} · {{ work.major }}</p>
            </div>
          </div>
          <div class="p-4 bg-gray-900/80">
            <p class="text-sm text-gray-300 mb-3">{{ work.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-400">{{ work.year }}年作品</span>
              <div class="flex items-center text-xs text-gray-400">
                <i class="ri-eye-line mr-1"></i>
                {{ work.views }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-8" v-if="hasMore">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700/30 transition-colors"
        >
          <span v-if="loadingMore">加载中...</span>
          <span v-else>加载更多作品</span>
        </button>
      </div>

      <!-- 优秀毕业生 -->
      <div class="mt-12">
        <h3 class="text-lg font-bold mb-6">优秀毕业生作品</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="graduate in graduates"
            :key="graduate.id"
            class="flex items-start p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <div class="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
              <img :src="graduate.avatar" :alt="graduate.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h4 class="font-medium mb-1">{{ graduate.name }}</h4>
              <p class="text-xs text-gray-400 mb-2">{{ graduate.major }} · {{ graduate.graduateYear }}届</p>
              <p class="text-sm text-gray-300 mb-2">{{ graduate.currentJob }}</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="achievement in graduate.achievements"
                  :key="achievement"
                  class="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  {{ achievement }}
                </span>
              </div>
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
const loadingMore = ref(false)
const selectedCategory = ref('全部')
const hasMore = ref(true)

const categories = ['全部', 'UI设计', '视觉传达', '产品设计', '数字媒体', '工业设计', '动画设计']

const worksStats = ref({
  totalWorks: 1280,
  awardWorks: 156,
  publishedWorks: 89,
  exhibitionWorks: 234
})

const works = ref([
  {
    id: 1,
    title: '智能家居控制系统设计',
    author: '张小明',
    major: 'UI/UX设计',
    category: 'UI设计',
    description: '基于物联网技术的智能家居控制界面设计，注重用户体验和交互流畅性。',
    imageUrl: '/works/work1.jpg',
    year: 2024,
    views: 1250,
    award: '优秀设计奖'
  },
  {
    id: 2,
    title: '城市公共交通视觉系统',
    author: '李小红',
    major: '视觉传达设计',
    category: '视觉传达',
    description: '为城市公交系统设计的完整视觉识别系统，提升公共交通的用户体验。',
    imageUrl: '/works/work2.jpg',
    year: 2024,
    views: 980,
    award: ''
  },
  {
    id: 3,
    title: '可持续发展产品包装',
    author: '王小强',
    major: '产品设计',
    category: '产品设计',
    description: '环保材料制作的产品包装设计，体现可持续发展理念。',
    imageUrl: '/works/work3.jpg',
    year: 2023,
    views: 756,
    award: '环保设计奖'
  },
  {
    id: 4,
    title: '互动多媒体装置',
    author: '赵小美',
    major: '数字媒体艺术',
    category: '数字媒体',
    description: '结合传感器技术的互动多媒体艺术装置，探索人与数字媒体的关系。',
    imageUrl: '/works/work4.jpg',
    year: 2024,
    views: 1420,
    award: '创新奖'
  },
  {
    id: 5,
    title: '智能穿戴设备设计',
    author: '刘小华',
    major: '工业设计',
    category: '工业设计',
    description: '面向老年人的智能健康监测设备，注重易用性和人性化设计。',
    imageUrl: '/works/work5.jpg',
    year: 2023,
    views: 892,
    award: ''
  },
  {
    id: 6,
    title: '传统文化动画短片',
    author: '陈小龙',
    major: '动画设计',
    category: '动画设计',
    description: '以中国传统文化为主题的二维动画短片，传承传统文化精神。',
    imageUrl: '/works/work6.jpg',
    year: 2024,
    views: 2100,
    award: '最佳动画奖'
  }
])

const graduates = ref([
  {
    id: 1,
    name: '林小峰',
    major: 'UI/UX设计',
    graduateYear: 2022,
    currentJob: '腾讯高级UI设计师',
    avatar: '/avatars/graduate1.jpg',
    achievements: ['年度最佳新人', '产品设计奖']
  },
  {
    id: 2,
    name: '周小娟',
    major: '视觉传达设计',
    graduateYear: 2021,
    currentJob: '阿里巴巴视觉设计专家',
    avatar: '/avatars/graduate2.jpg',
    achievements: ['设计团队负责人', 'AIGA设计奖']
  },
  {
    id: 3,
    name: '吴小伟',
    major: '产品设计',
    graduateYear: 2020,
    currentJob: '小米产品设计总监',
    avatar: '/avatars/graduate3.jpg',
    achievements: ['红点设计奖', 'iF设计奖']
  },
  {
    id: 4,
    name: '郑小敏',
    major: '数字媒体艺术',
    graduateYear: 2023,
    currentJob: '字节跳动创意总监',
    avatar: '/avatars/graduate4.jpg',
    achievements: ['年度最佳创意', '广告设计金奖']
  }
])

const filteredWorks = computed(() => {
  if (selectedCategory.value === '全部') {
    return works.value
  }
  return works.value.filter(work => work.category === selectedCategory.value)
})

const viewWork = (work: any) => {
  console.log('查看作品详情:', work)
  // 这里可以打开作品详情模态框或跳转到作品详情页
}

const loadMore = async () => {
  loadingMore.value = true
  try {
    // 模拟加载更多作品
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 这里可以添加更多作品到列表
    console.log('加载更多作品')
    hasMore.value = false // 示例：设置为没有更多
  } catch (error) {
    console.error('加载更多作品失败:', error)
  } finally {
    loadingMore.value = false
  }
}

const fetchWorksData = async () => {
  loading.value = true
  try {
    // 这里可以调用真实的API获取作品数据
    // const data = await getStudentWorks(props.schoolId)

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    loading.value = false
  } catch (error) {
    console.error('获取学生作品数据失败:', error)
    loading.value = false
  }
}

onMounted(() => {
  fetchWorksData()
})
</script>

<style scoped>
.work-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.work-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}
</style>
