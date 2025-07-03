<template>
  <div v-if="showGuide" class="profile-completeness-guide bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <!-- 标题和总体完整度 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">完善您的资料</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">提高资料完整度，获得更多曝光机会</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ completeness.overall }}%</div>
        <div class="text-xs text-gray-500">整体完整度</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mb-6">
      <n-progress
        :percentage="completeness.overall"
        :show-indicator="false"
        :color="getProgressColor(completeness.overall)"
        :rail-color="'#f3f4f6'"
        :height="8"
        class="mb-2"
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>新手</span>
        <span>进阶</span>
        <span>专业</span>
      </div>
    </div>

    <!-- 完成项目列表 -->
    <div class="space-y-4">
      <div
        v-for="item in completionItems"
        :key="item.key"
        class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        :class="{ 'border-green-200 bg-green-50 dark:bg-green-900/20': item.completed }"
        @click="navigateToForm(item.route)"
      >
        <!-- 图标 -->
        <div class="flex-shrink-0 mr-4">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="item.completed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <component v-else :is="item.icon" class="w-5 h-5" />
          </div>
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ item.description }}</p>
          <div class="flex items-center mt-2">
            <div class="flex-1">
              <n-progress
                :percentage="item.progress"
                :show-indicator="false"
                :height="4"
                :color="getProgressColor(item.progress)"
              />
            </div>
            <span class="text-xs text-gray-500 ml-2">{{ item.progress }}%</span>
          </div>
        </div>

        <!-- 操作 -->
        <div class="flex-shrink-0 ml-4">
          <span v-if="item.completed" class="text-xs text-green-600 font-medium">已完成</span>
          <n-button v-else type="primary" text>
            {{ item.actionText }}
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <!-- 奖励提示 -->
    <div v-if="completeness.overall < 100" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">完善资料获得更多机会</h4>
          <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
            完整的资料可以提高50%的被发现机会，获得更多合作邀请
          </p>
        </div>
      </div>
    </div>

    <!-- 关闭按钮 -->
    <div class="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <n-button @click="dismissGuide" size="small" quaternary>
        暂时不显示
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NProgress, NButton } from 'naive-ui'
import { getProfileCompleteness, type ProfileCompletenessVo } from '@/api/talent/registration'
import { useRoleCheck } from '@/composables/useRoleCheck'

const router = useRouter()
const { isDesigner, isEnterprise, isSchool } = useRoleCheck()

const completeness = ref<ProfileCompletenessVo>({
  overall: 0,
  designer: undefined,
  enterprise: undefined,
  school: undefined
})

const showGuide = ref(true)

// 根据用户角色生成完成项目列表
const completionItems = computed(() => {
  const items: any[] = []

  if (isDesigner.value && completeness.value.designer) {
    const designer = completeness.value.designer
    items.push(
      {
        key: 'basic',
        title: '基础信息',
        description: '姓名、联系方式、职业信息',
        progress: designer.basicInfo,
        completed: designer.basicInfo === 100,
        route: '/profile/designer/basic',
        actionText: '完善',
        icon: 'UserIcon'
      },
      {
        key: 'portfolio',
        title: '作品集',
        description: '上传您的设计作品',
        progress: designer.portfolio,
        completed: designer.portfolio === 100,
        route: '/profile/designer/portfolio',
        actionText: '上传',
        icon: 'PhotoIcon'
      },
      {
        key: 'experience',
        title: '工作经历',
        description: '添加您的工作经验',
        progress: designer.experience,
        completed: designer.experience === 100,
        route: '/profile/designer/experience',
        actionText: '添加',
        icon: 'BriefcaseIcon'
      },
      {
        key: 'education',
        title: '教育背景',
        description: '填写教育经历',
        progress: designer.education,
        completed: designer.education === 100,
        route: '/profile/designer/education',
        actionText: '填写',
        icon: 'AcademicCapIcon'
      }
    )
  }

  if (isEnterprise.value && completeness.value.enterprise) {
    const enterprise = completeness.value.enterprise
    items.push(
      {
        key: 'basic',
        title: '企业信息',
        description: '企业名称、行业、规模等基本信息',
        progress: enterprise.basicInfo,
        completed: enterprise.basicInfo === 100,
        route: '/profile/enterprise/basic',
        actionText: '完善',
        icon: 'BuildingOfficeIcon'
      },
      {
        key: 'contact',
        title: '联系信息',
        description: '地址、电话、邮箱、网站',
        progress: enterprise.contact,
        completed: enterprise.contact === 100,
        route: '/profile/enterprise/contact',
        actionText: '填写',
        icon: 'PhoneIcon'
      },
      {
        key: 'jobs',
        title: '招聘信息',
        description: '发布岗位需求',
        progress: enterprise.jobs,
        completed: enterprise.jobs === 100,
        route: '/profile/enterprise/jobs',
        actionText: '发布',
        icon: 'MegaphoneIcon'
      }
    )
  }

  if (isSchool.value && completeness.value.school) {
    const school = completeness.value.school
    items.push(
      {
        key: 'basic',
        title: '院校信息',
        description: '院校名称、类型、层次等基本信息',
        progress: school.basicInfo,
        completed: school.basicInfo === 100,
        route: '/profile/school/basic',
        actionText: '完善',
        icon: 'AcademicCapIcon'
      },
      {
        key: 'contact',
        title: '联系信息',
        description: '地址、电话、邮箱、网站',
        progress: school.contact,
        completed: school.contact === 100,
        route: '/profile/school/contact',
        actionText: '填写',
        icon: 'PhoneIcon'
      },
      {
        key: 'statistics',
        title: '院校数据',
        description: '就业率、师资力量、获奖情况',
        progress: school.statistics,
        completed: school.statistics === 100,
        route: '/profile/school/statistics',
        actionText: '录入',
        icon: 'ChartBarIcon'
      }
    )
  }

  return items
})

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#52c41a'
  if (percentage >= 50) return '#faad14'
  return '#ff4d4f'
}

// 跳转到表单页面
const navigateToForm = (route: string) => {
  router.push(route)
}

// 关闭引导
const dismissGuide = () => {
  showGuide.value = false
  localStorage.setItem('profile-guide-dismissed', Date.now().toString())
}

// 获取完整度数据
const fetchCompleteness = async () => {
  try {
    const response = await getProfileCompleteness()
    completeness.value = response.data
  } catch (error) {
    console.error('获取完整度失败:', error)
  }
}

// 检查是否需要显示引导
const checkShouldShow = () => {
  const dismissed = localStorage.getItem('profile-guide-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const now = Date.now()
    // 7天后重新显示
    if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      showGuide.value = false
      return
    }
  }

  // 如果完整度已经很高，不显示引导
  if (completeness.value.overall >= 90) {
    showGuide.value = false
  }
}

onMounted(async () => {
  await fetchCompleteness()
  checkShouldShow()
})
</script>

<style scoped>
.profile-completeness-guide {
  border: 1px solid #e5e7eb;
}

.dark .profile-completeness-guide {
  border-color: #374151;
}
</style>
