<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NProgress } from 'naive-ui'
import { type ProfileCompletenessVo, getProfileCompleteness } from '@/api/talent/registration'
import { useRoleCheck } from '@/composables/useRoleCheck'

const router = useRouter()
const { isDesigner, isEnterprise, isSchool } = useRoleCheck()

const completeness = ref<ProfileCompletenessVo>({
  overall: 0,
  designer: undefined,
  enterprise: undefined,
  school: undefined,
})

// 根据用户角色生成完成项目列表
const completionItems = computed(() => {
  const items: any[] = []

  console.log('计算完成项目列表:', {
    isDesigner: isDesigner.value,
    hasDesignerData: !!completeness.value.designer,
    completeness: completeness.value,
  })

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
        icon: 'UserIcon',
      },
      {
        key: 'portfolio',
        title: '作品集',
        description: '上传您的设计作品',
        progress: designer.portfolio,
        completed: designer.portfolio === 100,
        route: '/profile/designer/portfolio',
        actionText: '上传',
        icon: 'PhotoIcon',
      },
      {
        key: 'experience',
        title: '工作经历',
        description: '添加您的工作经验',
        progress: designer.experience,
        completed: designer.experience === 100,
        route: '/profile/designer/experience',
        actionText: '添加',
        icon: 'BriefcaseIcon',
      },
      {
        key: 'education',
        title: '教育背景',
        description: '填写教育经历',
        progress: designer.education,
        completed: designer.education === 100,
        route: '/profile/designer/education',
        actionText: '填写',
        icon: 'AcademicCapIcon',
      },
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
        icon: 'BuildingOfficeIcon',
      },
      {
        key: 'contact',
        title: '联系信息',
        description: '地址、电话、邮箱、网站',
        progress: enterprise.contact,
        completed: enterprise.contact === 100,
        route: '/profile/enterprise/contact',
        actionText: '填写',
        icon: 'PhoneIcon',
      },
      {
        key: 'jobs',
        title: '招聘信息',
        description: '发布岗位需求',
        progress: enterprise.jobs,
        completed: enterprise.jobs === 100,
        route: '/profile/enterprise/jobs',
        actionText: '发布',
        icon: 'MegaphoneIcon',
      },
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
        icon: 'AcademicCapIcon',
      },
      {
        key: 'contact',
        title: '联系信息',
        description: '地址、电话、邮箱、网站',
        progress: school.contact,
        completed: school.contact === 100,
        route: '/profile/school/contact',
        actionText: '填写',
        icon: 'PhoneIcon',
      },
      {
        key: 'statistics',
        title: '院校数据',
        description: '就业率、师资力量、获奖情况',
        progress: school.statistics,
        completed: school.statistics === 100,
        route: '/profile/school/statistics',
        actionText: '录入',
        icon: 'ChartBarIcon',
      },
    )
  }

  console.log('生成的完成项目列表:', items)
  return items
})

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80)
    return '#52c41a'
  if (percentage >= 50)
    return '#faad14'
  return '#ff4d4f'
}

// 跳转到表单页面
const navigateToForm = (route: string) => {
  router.push(route)
}

// 获取完整度数据
const fetchCompleteness = async () => {
  try {
    const response = await getProfileCompleteness()
    const data = response.data

    console.log('获取到的完整度数据:', data)

    // 适配数据结构 - 将 overall 提取到顶层
    let overallCompleteness = 0
    if (data.designer) {
      overallCompleteness = data.designer.overall || 0
      // 从 designer 对象中移除 overall 字段，避免类型冲突
      const { overall, ...designerData } = data.designer
      completeness.value = {
        overall: overallCompleteness,
        designer: designerData,
        enterprise: data.enterprise,
        school: data.school,
      }
    }
    else if (data.enterprise) {
      overallCompleteness = data.enterprise.overall || 0
      const { overall, ...enterpriseData } = data.enterprise
      completeness.value = {
        overall: overallCompleteness,
        designer: data.designer,
        enterprise: enterpriseData,
        school: data.school,
      }
    }
    else if (data.school) {
      overallCompleteness = data.school.overall || 0
      const { overall, ...schoolData } = data.school
      completeness.value = {
        overall: overallCompleteness,
        designer: data.designer,
        enterprise: data.enterprise,
        school: schoolData,
      }
    }
    else {
      completeness.value = data
    }

    console.log('适配后的完整度数据:', completeness.value)
  }
  catch (error) {
    console.error('获取完整度失败:', error)
  }
}

onMounted(async () => {
  console.log('ProfileCompletenessGuide mounted')
  console.log('用户角色状态:', {
    isDesigner: isDesigner.value,
    isEnterprise: isEnterprise.value,
    isSchool: isSchool.value,
  })

  await fetchCompleteness()
})
</script>

<template>
  <div class="profile-completeness-guide glass-card rounded-lg glow-border p-6 mb-6">
    <!-- 标题和总体完整度 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-white">
          完善您的资料
        </h3>
        <p class="text-sm text-gray-300 mt-1">
          提高资料完整度，获得更多曝光机会
        </p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-gradient">
          {{ completeness.overall }}%
        </div>
        <div class="text-xs text-gray-400">
          整体完整度
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mb-6">
      <NProgress
        :percentage="completeness.overall"
        :show-indicator="false"
        :color="getProgressColor(completeness.overall)"
        rail-color="#f3f4f6"
        :height="8"
        class="mb-2"
      />
      <div class="flex justify-between text-xs text-gray-400">
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
        class="flex items-center p-4 glass-card rounded-lg transition-all duration-300 cursor-pointer card-hover"
        :class="{ 'border-green-500/30 bg-green-500/10': item.completed }"
        @click="navigateToForm(item.route)"
      >
        <!-- 图标 -->
        <div class="flex-shrink-0 mr-4">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="item.completed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <component :is="item.icon" v-else class="w-5 h-5" />
          </div>
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-white">
            {{ item.title }}
          </h4>
          <p class="text-xs text-gray-300 mt-1">
            {{ item.description }}
          </p>
          <div class="flex items-center mt-2">
            <div class="flex-1">
              <NProgress
                :percentage="item.progress"
                :show-indicator="false"
                :height="4"
                :color="getProgressColor(item.progress)"
              />
            </div>
            <span class="text-xs text-gray-400 ml-2">{{ item.progress }}%</span>
          </div>
        </div>

        <!-- 操作 -->
        <div class="flex-shrink-0 ml-4">
          <span v-if="item.completed" class="text-xs text-green-600 font-medium">已完成</span>
          <NButton v-else type="primary" text>
            {{ item.actionText }}
            <template #icon>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </template>
          </NButton>
        </div>
      </div>
    </div>

    <!-- 奖励提示 -->
    <div v-if="completeness.overall < 100" class="mt-6 p-4 glass-card bg-blue-500/10 rounded-lg border-blue-500/20">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-blue-300">
            完善资料获得更多机会
          </h4>
          <p class="text-xs text-blue-200 mt-1">
            完整的资料可以提高50%的被发现机会，获得更多合作邀请
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/styles/talent.css';

.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
</style>
