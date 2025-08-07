<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import DesignerDetailDrawer from '@/components/talent/DesignerDetailDrawer.vue'
import SkillTag from '@/components/common/SkillTag/index.vue'
import { useSkillTags } from '@/composables/useSkillTags'
import { useDesigner } from '@/composables/talent/useDesigner'
import type { Designer, Profession, WorkStatus } from '@/types/talent/designer'
import ProfessionUtils from '@/utils/professionUtils'
import { getNameInitial } from '@/utils/styleGenerator'
import { useUserStore } from '@/store/modules/user'
import { getCurrentDesigner } from '@/api/talent/designer'
import { useRoleCheck } from '@/composables/useRoleCheck'
import { isStatusActive } from '@/utils/statusUtils'
import { isLoggedIn } from '@/utils/authUtils'

const router = useRouter()

// 使用设计师组合式函数
const {
  designers,
  loading,
  total,
  professions,
  skillTags,
  regions,
  workStatuses,
  queryParams,
  fetchDesigners,
  resetSearch,
  getDesignerWorksCount,
} = useDesigner()

// 技能标签组合式函数
const {
  getTagDisplayName: getSkillTagDisplayName,
  getTagClasses: getSkillTagClasses,
  getTagCategory,
  parseSkillTags,
  getAllTags,
  sortTagsByCategory,
} = useSkillTags()

// 设备检测和导航状态
const isMobile = ref(false)
const navigating = ref(false)

const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  isMobile.value = screenWidth < 1024
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    || (isTouchDevice && screenWidth < 1200)
}

const handleResize = () => {
  checkDevice()
}

// 筛选条件
const selectedProfessions = ref<string[]>([])
const selectedSkillTags = ref<string[]>([])
const selectedCities = ref<string[]>([])
const selectedWorkStatus = ref('')
const experienceRange = ref(10)
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(12)

// 模态框状态
const showDesignerDetail = ref(false)
const selectedDesignerId = ref<number | null>(null)

// 抽屉状态
const showFilterDrawer = ref(false)
const filterDrawerOpen = ref(false)

// 计算属性
const designerCount = computed(() => total.value)

const cities = computed(() => {
  return regions.value || []
})

const filteredDesigners = computed(() => {
  let filtered = [...designers.value]

  // 首先过滤掉停用状态的设计师
  filtered = filtered.filter(designer => isStatusActive(designer.status || '0'))

  // 职业筛选
  if (selectedProfessions.value.length > 0)
    filtered = filtered.filter(designer => selectedProfessions.value.includes(designer.profession))

  // 技能标签筛选
  if (selectedSkillTags.value.length > 0) {
    filtered = filtered.filter((designer) => {
      try {
        const designerSkills = parseSkillTags(designer.skillTags)
        return selectedSkillTags.value.some(tag => designerSkills.includes(tag))
      }
      catch (error) {
        console.error('解析技能标签失败:', error)
        return false
      }
    })
  }

  // 城市筛选
  if (selectedCities.value.length > 0) {
    filtered = filtered.filter((designer) => {
      if (!designer.location)
        return false
      const cityName = `${designer.location.split('市')[0]}市`
      return selectedCities.value.includes(cityName)
    })
  }

  // 工作状态筛选
  if (selectedWorkStatus.value)
    filtered = filtered.filter(designer => designer.workStatus === selectedWorkStatus.value)

  // 工作年限筛选
  if (experienceRange.value < 20)
    filtered = filtered.filter(designer => (designer.workYears || designer.experience || 0) <= experienceRange.value)

  return filtered
})

const sortedDesigners = computed(() => {
  const sorted = [...filteredDesigners.value]

  switch (sortBy.value) {
    case 'experience':
      sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0))
      break
    case 'works':
      sorted.sort((a, b) => getDesignerWorksCount(b.id) - getDesignerWorksCount(a.id))
      break
    case 'latest':
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'popularity':
    default:
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedDesigners.value.length / itemsPerPage.value))

const paginatedDesigners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedDesigners.value.slice(start, end)
})

const filteredDesignerCount = computed(() => filteredDesigners.value.length)

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  for (let i = startPage; i <= endPage; i++)
    pages.push(i)

  return pages
})

// 活跃筛选条件数量
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedProfessions.value.length > 0)
    count += selectedProfessions.value.length
  if (selectedSkillTags.value.length > 0)
    count += selectedSkillTags.value.length
  if (selectedCities.value.length > 0)
    count += selectedCities.value.length
  if (selectedWorkStatus.value)
    count += 1
  if (experienceRange.value < 20)
    count += 1
  return count
})

// 方法
const toggleProfession = (profession: string) => {
  const index = selectedProfessions.value.indexOf(profession)
  if (index > -1)
    selectedProfessions.value.splice(index, 1)
  else
    selectedProfessions.value.push(profession)
}

const toggleSkillTag = (tag: string) => {
  const index = selectedSkillTags.value.indexOf(tag)
  if (index > -1)
    selectedSkillTags.value.splice(index, 1)
  else
    selectedSkillTags.value.push(tag)
}

const toggleCity = (city: string) => {
  const index = selectedCities.value.indexOf(city)
  if (index > -1)
    selectedCities.value.splice(index, 1)
  else
    selectedCities.value.push(city)
}

const resetFilters = () => {
  selectedProfessions.value = []
  selectedSkillTags.value = []
  selectedCities.value = []
  selectedWorkStatus.value = ''
  experienceRange.value = 10
  resetSearch()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const handleViewDetail = async (designerId: number) => {
  const designer = designers.value.find(d => d.id === designerId)
  if (designer) {
    selectedDesignerId.value = designerId

    if (isMobile.value) {
      navigating.value = true
      try {
        await router.push(`/talent/designers/${designerId}`)
      }
      catch (error) {
        console.error('Navigation failed:', error)
        navigating.value = false
      }
    }
    else {
      showDesignerDetail.value = true
    }
  }
}

const getProfessionLabel = (profession: Profession) => {
  return ProfessionUtils.getDisplayName(profession)
}

// 处理职业方向的工具方法，兼容对象和枚举两种格式
const getProfessionKey = (profession: any) => {
  return profession.value || profession
}

const getProfessionValue = (profession: any) => {
  return profession.value || profession
}

const getProfessionDisplayLabel = (profession: any) => {
  if (profession.label)
    return profession.label

  const professionKey = profession as Profession
  return ProfessionUtils.getDisplayName(professionKey)
}

const getWorkStatusLabel = (status: WorkStatus) => {
  const statusObj = workStatuses.value.find(s => s.value === status)
  return statusObj ? statusObj.label : '未知'
}

// 使用工具类解析技能标签 - 每个分类显示一个
const getDesignerSkills = (designer: Designer) => {
  try {
    const skills = parseSkillTags(designer.skillTags || '[]')

    // 开发环境下输出调试信息
    if (import.meta.env.DEV) {
      console.log(`🏷️ 设计师 ${designer.designerName} 解析技能标签:`, {
        原始数据: designer.skillTags,
        解析结果: skills,
        是否数组: Array.isArray(skills),
      })
    }

    if (!Array.isArray(skills) || skills.length === 0)
      return []

    // 按分类分组标签
    const categoryGroups: Record<string, string[]> = {
      tool: [],
      field: [],
      skill: [],
    }

    skills.forEach((skill) => {
      const category = getTagCategory(skill)
      if (category && categoryGroups[category])
        categoryGroups[category].push(skill)
      else if (import.meta.env.DEV)
        console.warn(`未知分类的技能标签: ${skill} -> ${category}`)
    })

    // 从每个分类中选择一个最短的标签
    const selectedSkills: string[] = []
    Object.keys(categoryGroups).forEach((category) => {
      const categorySkills = categoryGroups[category]
      if (categorySkills.length > 0) {
        // 按长度排序，选择最短的（按中文显示名称长度）
        const shortest = categorySkills.sort((a, b) => {
          const nameA = getSkillTagDisplayName(a)
          const nameB = getSkillTagDisplayName(b)
          return nameA.length - nameB.length
        })[0]
        selectedSkills.push(shortest)
      }
    })

    // 开发环境下输出调试信息
    if (import.meta.env.DEV) {
      console.log(`🏷️ 设计师 ${designer.designerName} 的最终技能标签:`, {
        分组结果: categoryGroups,
        选中标签: selectedSkills,
        显示名称: selectedSkills.map(tag => getSkillTagDisplayName(tag)),
      })
    }

    return selectedSkills // 最多3个标签，每个分类一个
  }
  catch (error) {
    console.error(`解析设计师 ${designer.designerName} 技能标签失败:`, error)
    return []
  }
}

// 获取头像渐变样式
const getAvatarGradient = (name: string) => {
  const gradients = [
    'bg-gradient-to-br from-primary to-purple-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-pink-500 to-red-500',
    'bg-gradient-to-br from-blue-500 to-primary',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-orange-500',
    'bg-gradient-to-br from-cyan-500 to-blue-500',
  ]

  // 根据姓名生成一致的渐变
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// 获取工作状态颜色
const getStatusColor = (status: WorkStatus | undefined) => {
  const statusColors: Record<string, string> = {
    EMPLOYED: 'bg-green-500',
    FREELANCER: 'bg-blue-500',
    SEEKING: 'bg-yellow-500',
    STUDENT: 'bg-purple-500',
  }

  return statusColors[status || ''] || 'bg-gray-500'
}

const getSortedDesignerSkills = (designer: Designer) => {
  const skills = getDesignerSkills(designer)
  // 按固定顺序排列：工具 -> 领域 -> 技能
  return sortTagsByCategory(skills, 'asc')
}

// 抽屉相关方法
const toggleFilterDrawer = () => {
  if (showFilterDrawer.value)
    closeFilterDrawer()
  else
    openFilterDrawer()
}

const openFilterDrawer = () => {
  showFilterDrawer.value = true
  // 使用 nextTick 确保DOM更新后再添加动画类
  setTimeout(() => {
    filterDrawerOpen.value = true
  }, 10)

  // 阻止背景滚动
  document.body.style.overflow = 'hidden'
}

const closeFilterDrawer = () => {
  filterDrawerOpen.value = false
  // 等待动画完成后隐藏抽屉
  setTimeout(() => {
    showFilterDrawer.value = false
    document.body.style.overflow = ''
  }, 300)
}

// 监听筛选条件变化，自动应用筛选
watch([selectedProfessions, selectedSkillTags, selectedCities, selectedWorkStatus, experienceRange], () => {
  // 重置到第一页
  currentPage.value = 1

  // 更新查询参数
  queryParams.profession = selectedProfessions.value[0] as Profession || undefined
  queryParams.skillTags = selectedSkillTags.value.join(',') || undefined
  queryParams.location = selectedCities.value[0] || undefined
  queryParams.workStatus = selectedWorkStatus.value as WorkStatus || undefined
  queryParams.maxExperience = experienceRange.value < 20 ? experienceRange.value : undefined
}, { deep: true })

onMounted(async () => {
  console.log('🎯 设计师档案页面挂载完成')
  console.log('🔍 环境变量调试信息:', {
    VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
    实际使用Mock模式: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    auto模式下使用Mock: import.meta.env.VITE_USE_MOCK_DATA === 'auto' && !isLoggedIn(),
  })

  checkDevice()
  window.addEventListener('resize', handleResize)

  // 路由自动跳转到当前设计师详情页（仅设计师角色）
  if (router.currentRoute.value.path === '/talent/designers') {
    const { isDesigner } = useRoleCheck()
    // 等待角色信息加载完成
    await new Promise(resolve => setTimeout(resolve, 100))

    if (isDesigner.value) {
      try {
        // 优先用接口获取当前设计师id
        const res = await getCurrentDesigner()
        const designerId = res?.data?.id
        if (designerId) {
          await router.replace(`/talent/designers/${designerId}`)
          return
        }
      } catch (e) {
        // 忽略异常，降级处理
      }
      // 降级用userStore
      const userStore = useUserStore()
      const userId = userStore.userInfo?.userId
      if (userId) {
        await router.replace(`/talent/designers/${userId}`)
        return
      }
    }
  }

  // 初始化数据
  await fetchDesigners(true)

  // 等待一下确保数据已经加载完成
  await new Promise(resolve => setTimeout(resolve, 100))

  // 调试筛选选项数据
  console.log('🔍 筛选选项调试信息:', {
    设计师数据数量: designers.value?.length || 0,
    职业方向数量: professions.value?.length || 0,
    职业方向数据: professions.value,
    技能标签数量: skillTags.value?.length || 0,
    技能标签前10个: skillTags.value?.slice(0, 10),
    地区数量: regions.value?.length || 0,
    地区数据: regions.value,
    工作状态数量: workStatuses.value?.length || 0,
    工作状态数据: workStatuses.value,
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // 确保页面卸载时恢复body滚动
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30" />
      <div class="container mx-auto px-10 relative z-10 title-section-container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-2 text-white">
              设计师档案
            </h1>
            <p class="text-gray-300 max-w-2xl mb-4">
              汇聚 {{ designerCount.toLocaleString() }} 位优秀设计师，提供全方位设计人才展示与匹配服务
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧筛选栏 - 桌面端显示 -->
          <div class="lg:w-1/4 hidden lg:block">
            <div class="filter-card rounded-lg p-6 sticky top-24">
              <div class="space-y-6">
                <!-- 职业方向筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    职业方向
                  </h3>
                  <div class="space-y-2">
                    <label
                      v-for="profession in professions" :key="getProfessionKey(profession)"
                      class="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox" class="custom-checkbox"
                        :checked="selectedProfessions.includes(getProfessionValue(profession))"
                        @change="toggleProfession(getProfessionValue(profession))"
                      >
                      <span>{{ getProfessionDisplayLabel(profession) }}</span>
                    </label>
                  </div>
                </div>

                <!-- 技能标签筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    技能标签
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in skillTags" :key="tag" class="skill-tag text-xs px-3 py-1 rounded-full cursor-pointer transition-colors border" :class="[
                        getSkillTagClasses(tag),
                        selectedSkillTags.includes(tag) ? 'selected' : '',
                      ]" @click="toggleSkillTag(tag)"
                    >
                      {{ getSkillTagDisplayName(tag) }}
                    </span>
                  </div>
                </div>

                <!-- 工作年限筛选 -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-medium mb-0">
                      工作年限
                    </h3>
                    <span class="text-sm text-gray-400">{{ experienceRange }}年</span>
                  </div>
                  <div class="px-1 py-2">
                    <input
                      v-model="experienceRange" type="range" min="0" max="20"
                      class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    >
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0年</span>
                      <span>20年+</span>
                    </div>
                  </div>
                </div>

                <!-- 所在地区筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    所在地区
                  </h3>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox" class="custom-checkbox" :checked="selectedCities.includes(city)"
                        @change="toggleCity(city)"
                      >
                      <span>{{ city }}</span>
                    </label>
                  </div>
                </div>

                <!-- 工作状态筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">
                    工作状态
                  </h3>
                  <div class="space-y-2">
                    <label v-for="status in workStatuses" :key="status.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedWorkStatus" type="radio" name="workStatus" class="custom-radio"
                        :value="status.value"
                      >
                      <span>{{ status.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 筛选按钮 -->
                <div class="flex space-x-3 pt-2">
                  <button
                    class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
                    @click="resetFilters"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="lg:w-3/4 w-full">
            <!-- 排序和结果统计 -->
            <div
              class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">
                  找到 <span class="text-white font-medium">{{ filteredDesignerCount }}</span> 位符合条件的设计师
                </p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                  >
                    <option value="latest">
                      最近活跃
                    </option>
                    <option value="experience">
                      工作年限
                    </option>
                    <option value="works">
                      作品数量
                    </option>
                    <option value="popularity">
                      人气推荐
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="flex justify-center items-center py-12">
              <div
                class="loading-spinner w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
              />
              <span class="ml-2 text-gray-400">加载中...</span>
            </div>

            <!-- 设计师列表 -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <div
                v-for="designer in paginatedDesigners" :key="designer.id" class="designer-card rounded-lg glow-border card-hover cursor-pointer" :class="[
                  isMobile ? 'mobile-card' : 'desktop-card',
                  navigating && selectedDesignerId === designer.id ? 'navigating' : '',
                ]" @click="handleViewDetail(designer.id)"
              >
                <div class="p-6">
                  <div class="flex flex-col items-center">
                    <!-- 设计师头像 -->
                    <div class="w-20 h-20 rounded-full overflow-hidden mb-4 avatar-glow">
                      <img
                        v-if="designer.avatar" :src="designer.avatar" :alt="designer.designerName"
                        class="w-full h-full object-cover"
                      >
                      <div
                        v-else class="w-full h-full flex items-center justify-center text-white text-2xl font-bold" :class="[
                          getAvatarGradient(designer.designerName),
                        ]"
                      >
                        {{ getNameInitial(designer.designerName) }}
                      </div>
                    </div>

                    <!-- 设计师信息 -->
                    <h3 class="text-lg font-bold mb-1 text-center">
                      {{ designer.designerName }}
                    </h3>
                    <p class="text-gray-400 text-sm mb-3 text-center">
                      {{ getProfessionLabel(designer.profession) }}
                    </p>

                    <!-- 技能标签 -->
                    <div class="skill-tags-container flex justify-center gap-2 my-2">
                      <SkillTag
                        v-for="skill in getSortedDesignerSkills(designer)" :key="skill" :tag="skill" size="sm"
                        :show-category="false"
                      />
                    </div>

                    <!-- 统计信息 -->
                    <div class="w-full flex justify-between items-center text-xs text-gray-400 mb-4">
                      <span>作品: {{ getDesignerWorksCount(designer.id) }}</span>
                      <span>经验: {{ designer.workYears || designer.experience || 0 }}年</span>
                      <span class="flex items-center">
                        <div
                          class="w-2 h-2 rounded-full mr-1" :class="[
                            getStatusColor(designer.workStatus),
                          ]"
                        />
                        {{ getWorkStatusLabel(designer.workStatus || 'EMPLOYED' as WorkStatus) }}
                      </span>
                    </div>

                    <!-- 查看档案按钮 -->
                    <button
                      class="w-full py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/20 transition-colors neon-button"
                      @click.stop="handleViewDetail(designer.id)"
                    >
                      查看档案
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="flex justify-center mt-10 mb-6">
              <div class="flex space-x-2">
                <button
                  :disabled="currentPage === 1" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="prevPage"
                >
                  <i class="ri-arrow-left-s-line" />
                </button>
                <button
                  v-for="page in visiblePages" :key="page" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg" :class="[
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-blue-600/20',
                  ]" @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages" class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="nextPage"
                >
                  <i class="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计师详情抽屉 - 仅在桌面端显示 -->
    <DesignerDetailDrawer
      v-if="!isMobile" :visible="showDesignerDetail" :designer-id="selectedDesignerId"
      @update:visible="showDesignerDetail = $event"
    />

    <!-- 移动端悬浮筛选按钮 -->
    <button
      v-if="isMobile" class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-40 lg:hidden flex items-center justify-center floating-filter-btn"
      :class="{ 'scale-110': showFilterDrawer }"
      @click="toggleFilterDrawer"
    >
      <i class="ri-filter-3-line text-xl" />
      <!-- 活跃筛选条件徽章 -->
      <span
        v-if="activeFiltersCount > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium border-2 border-white"
      >
        {{ activeFiltersCount > 9 ? '9+' : activeFiltersCount }}
      </span>
    </button>

    <!-- 移动端筛选抽屉 -->
    <div
      v-if="showFilterDrawer" class="fixed inset-0 z-50 lg:hidden overflow-hidden filter-drawer-container"
      style="margin: 0; padding: 0; width: 100vw; height: 100vh;" @click="closeFilterDrawer"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <!-- 抽屉内容 -->
      <div
        class="absolute top-0 bottom-0 filter-card filter-drawer transform transition-transform duration-300 ease-out flex flex-col"
        :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'" style="right: 0px; width: min(320px, 85vw);"
        @click.stop
      >
        <!-- 抽屉头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <h3 class="text-lg font-medium">
            筛选条件
          </h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors"
            @click="closeFilterDrawer"
          >
            <i class="ri-close-line" />
          </button>
        </div>

        <!-- 抽屉内容区 -->
        <div class="flex-1 overflow-y-auto filter-drawer-content">
          <div class="p-6">
            <div class="space-y-6">
              <!-- 职业方向筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  职业方向
                </h3>
                <div class="space-y-2">
                  <label
                    v-for="profession in professions" :key="getProfessionKey(profession)"
                    class="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox" class="custom-checkbox"
                      :checked="selectedProfessions.includes(getProfessionValue(profession))"
                      @change="toggleProfession(getProfessionValue(profession))"
                    >
                    <span>{{ getProfessionDisplayLabel(profession) }}</span>
                  </label>
                </div>
              </div>

              <!-- 技能标签筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  技能标签
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in skillTags" :key="tag" class="skill-tag text-xs px-3 py-1 rounded-full cursor-pointer transition-colors border" :class="[
                      getSkillTagClasses(tag),
                      selectedSkillTags.includes(tag) ? 'selected' : '',
                    ]" @click="toggleSkillTag(tag)"
                  >
                    {{ getSkillTagDisplayName(tag) }}
                  </span>
                </div>
              </div>

              <!-- 工作年限筛选 -->
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-medium mb-0">
                    工作年限
                  </h3>
                  <span class="text-sm text-gray-400">{{ experienceRange }}年</span>
                </div>
                <div class="px-1 py-2">
                  <input
                    v-model="experienceRange" type="range" min="0" max="20"
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  >
                  <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0年</span>
                    <span>20年+</span>
                  </div>
                </div>
              </div>

              <!-- 所在地区筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  所在地区
                </h3>
                <div class="grid grid-cols-2 gap-2">
                  <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                    <input
                      type="checkbox" class="custom-checkbox" :checked="selectedCities.includes(city)"
                      @change="toggleCity(city)"
                    >
                    <span>{{ city }}</span>
                  </label>
                </div>
              </div>

              <!-- 工作状态筛选 -->
              <div>
                <h3 class="text-lg font-medium mb-3">
                  工作状态
                </h3>
                <div class="space-y-2">
                  <label v-for="status in workStatuses" :key="status.value" class="flex items-center cursor-pointer">
                    <input
                      v-model="selectedWorkStatus" type="radio" name="workStatus-mobile" class="custom-radio"
                      :value="status.value"
                    >
                    <span>{{ status.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 抽屉底部按钮 -->
        <div class="border-t border-gray-700/50 p-6 flex-shrink-0">
          <div class="flex space-x-3">
            <button
              class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
              @click="resetFilters"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="mt-16 py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">
              星海人才
            </h3>
            <p class="text-gray-400 text-sm">
              连接创意与科技，为设计师和企业搭建智能化人才对接平台
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">
              功能模块
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/talent/schools"
                  class="text-gray-400 text-sm hover:text-blue-400"
                >
                  院校数据库
                </router-link>
              </li>
              <li>
                <router-link to="/talent/works" class="text-gray-400 text-sm hover:text-blue-400">
                  学生作品库
                </router-link>
              </li>
              <li>
                <router-link to="/talent/jobs" class="text-gray-400 text-sm hover:text-blue-400">
                  企业需求池
                </router-link>
              </li>
              <li>
                <router-link
                  to="/talent/designers"
                  class="text-gray-400 text-sm hover:text-blue-400"
                >
                  设计师档案
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-white">
              关于我们
            </h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/"
                  class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">公司介绍</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">
              联系方式
            </h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-mail-line mr-2" /> 1151386302@qq.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2" /> 150-7240-0560
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2" /> 湖北省武汉市洪山区
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8" />
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 亿思（湖北省）科技有限公司. 保留所有权利
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-weibo-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-wechat-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-linkedin-line" />
            </a>
            <a
              href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <i class="ri-github-line" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import '@/styles/talent.css';
@import '@/styles/skill-tags.css';

.talent-page {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
	font-size: 16px !important;
}

.talent-page p {
  margin-bottom: 0;
}

/* 玻璃效果卡片 */
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 筛选卡片 */
.filter-card {
  background: rgba(28, 28, 30, 0.8);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 设计师卡片 */
.designer-card {
  background: rgba(28, 28, 30, 0.7);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.designer-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 头像发光效果 */
.avatar-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

/* 技能标签容器固定高度 - 单行显示 */
.skill-tags-container {
  min-height: 32px; /* 单行标签的高度 */
  max-height: 32px; /* 限制最大高度 */
  overflow: hidden; /* 隐藏超出部分 */
  align-items: center; /* 垂直居中 */
  flex-wrap: nowrap; /* 禁止换行，强制单行显示 */
  line-height: 1.2; /* 优化行高 */
}

/* 技能标签文本截断 */
.skill-tags-container .skill-tag {
  max-width: 100px; /* 限制单个标签最大宽度 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏超出文本 */
  text-overflow: ellipsis; /* 显示省略号 */
  display: inline-block; /* 确保 text-overflow 生效 */
}

/* 技能标签选中状态 */
.skill-tag.selected {
  opacity: 1;
  box-shadow: 0 0 8px rgba(var(--color-primary), 0.5);
  transform: scale(1.05);
}

/* 自定义复选框 */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 4px;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-checkbox:checked {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 自定义单选按钮 */
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-radio:checked {
  border-color: #0a84ff;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0a84ff;
}

/* 自定义选择框 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.custom-select:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 悬浮效果 */
.glow-border {
  position: relative;
}

.glow-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glow-border:hover::after {
  opacity: 1;
}

.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 霓虹按钮效果 */
.neon-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0a84ff, #bf5af2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.neon-button:hover::before {
  opacity: 0.2;
}

.neon-button:active {
  transform: scale(0.98);
}

/* 分页按钮 */
.pagination-button {
  transition: all 0.2s ease;
}

.pagination-button:hover:not(.active):not(:disabled) {
  background-color: rgba(10, 132, 255, 0.2);
}

.pagination-button:disabled {
  cursor: not-allowed;
}

/* 分割线 */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.2), transparent);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }

  .designer-card {
    border: 1px solid rgba(99, 99, 102, 0.3);
  }

  .designer-card:active {
    border-color: rgba(10, 132, 255, 0.5);
  }

  .skill-tags-container {
    min-height: 28px; /* 移动端单行高度 */
    max-height: 28px;
  }

  .skill-tags-container .skill-tag {
    max-width: 80px; /* 移动端减少标签最大宽度 */
  }
}

/* 导航加载状态 */
.navigating {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
}

.navigating::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border: 2px solid rgba(10, 132, 255, 0.3);
  border-top: 2px solid #0a84ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 悬浮筛选按钮样式 */
.floating-filter-btn {
  /* 添加更明显的阴影效果 */
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  /* 按钮脉冲动画 */
  animation: float 3s ease-in-out infinite;
}

.floating-filter-btn:hover {
  /* 悬停时的阴影效果 */
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

.floating-filter-btn:active {
  transform: translateY(-2px) scale(0.95);
}

/* 悬浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 徽章脉冲动画 */
.floating-filter-btn .bg-red-500 {
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 抽屉打开时按钮状态 */
.floating-filter-btn.scale-110 {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6) !important;
  transform: scale(1.1) rotate(180deg);
  animation: none;
}

.floating-filter-btn.scale-110:hover {
  transform: scale(1.15) rotate(180deg) translateY(-2px);
}

/* 防止悬浮按钮遮挡内容 */
@media (max-width: 1023px) {
  .pagination-button,
  .designer-card:last-child {
    margin-bottom: 5rem;
  }
}

/* 抽屉内容滚动条样式 */
.filter-drawer-content {
  /* 确保滚动容器可以滚动 */
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  /* 在移动端启用平滑滚动 */
  scroll-behavior: smooth;
  /* 确保有明确的高度 */
  min-height: 0;
  flex: 1;
}

.filter-drawer-content::-webkit-scrollbar {
  width: 6px;
}

.filter-drawer-content::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
}

.filter-drawer-content::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.filter-drawer-content::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* 确保抽屉使用正确的flexbox布局 */
.filter-drawer {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
}

/* 移动端优化 */
@media (max-width: 1023px) {
  .filter-toggle-btn {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .filter-card {
    box-shadow: none;
    border: 1px solid rgba(99, 99, 102, 0.3);
  }

  /* 移动端抽屉滚动优化 */
  .filter-drawer-content {
    /* 解决iOS Safari滚动问题 */
    -webkit-overflow-scrolling: touch !important;
    /* 确保触摸滚动生效 */
    touch-action: pan-y !important;
    /* 防止滚动时的弹性效果影响用户体验 */
    overscroll-behavior: contain;
  }

  /* 确保抽屉内容区域有正确的尺寸 */
  .filter-drawer {
    max-height: 100vh !important;
    min-height: 100vh !important;
  }

  /* 为滚动内容添加内边距，避免被底部按钮遮挡 */
  .filter-drawer-content .p-6 {
    padding-bottom: 2rem !important;
  }

  /* 移动端悬浮按钮位置优化 */
  .floating-filter-btn {
    /* 确保在小屏幕上位置合适 */
    bottom: 1.5rem !important;
    right: 1.5rem !important;
    /* 在移动端使用稍小的尺寸 */
    width: 3.5rem !important;
    height: 3.5rem !important;
  }

  /* 超小屏幕优化 */
  @media (max-width: 400px) {
    .floating-filter-btn {
      bottom: 1rem !important;
      right: 1rem !important;
      width: 3rem !important;
      height: 3rem !important;
    }

    .floating-filter-btn i {
      font-size: 1.125rem !important;
    }

    .floating-filter-btn .bg-red-500 {
      width: 1.25rem !important;
      height: 1.25rem !important;
      font-size: 0.625rem !important;
    }
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .floating-filter-btn {
    /* 移动端禁用悬浮动画，避免性能问题 */
    animation: none;
  }

  .floating-filter-btn:active {
    background: rgba(29, 78, 216, 0.9);
    transform: scale(0.9);
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);
  }

  /* 触摸反馈优化 */
  .floating-filter-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }

  .custom-checkbox:active,
  .custom-radio:active {
    transform: scale(1.1);
  }
}

/* 确保抽屉覆盖层完全覆盖页面 */
.talent-page {
  position: relative;
  overflow-x: hidden;
}

/* 移动端确保页面没有水平滚动条影响抽屉定位 */
@media (max-width: 1023px) {
  html, body {
    overflow-x: hidden;
  }

  .talent-page {
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* 彻底解决抽屉右边空隙问题 */
  .filter-drawer {
    position: absolute !important;
    right: 0 !important;
    transform-origin: 100% 50% !important;
  }

  /* 确保抽屉在translate时不会偏移 */
  .filter-drawer.translate-x-0 {
    transform: translateX(0) !important;
  }

  .filter-drawer.translate-x-full {
    transform: translateX(100%) !important;
  }
}

/* 修复可能的容器边距影响 */
@media (max-width: 1023px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* 页面标题区特定padding */
  .title-section-container {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  /* 抽屉容器额外样式 */
  .filter-drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
