<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, useMessage } from 'naive-ui'
import { getUserInfo, selectUserRole } from '@/api/user'
import { useUserStore } from '@/store'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

// 响应式数据
const selectedRole = ref<string>('')
const loading = ref(false)

// 角色配置
const roleConfig = {
  designer: {
    id: '1932319128081666050',
    name: '设计师',
    key: 'designer',
  },
  enterprise: {
    id: '1932319128081666051',
    name: '企业管理员',
    key: 'enterprise',
  },
  school: {
    id: '1932319128081666052',
    name: '院校管理员',
    key: 'school',
  },
}

// 选择角色
const selectRole = (role: string) => {
  selectedRole.value = role
}

// 确认角色选择
const confirmRoleSelection = async () => {
  if (!selectedRole.value) {
    message.warning('请先选择一个角色')
    return
  }

  try {
    loading.value = true

    // 获取选中角色的ID
    const selectedRoleConfig = roleConfig[selectedRole.value as keyof typeof roleConfig]
    if (!selectedRoleConfig) {
      message.error('未知的角色类型')
      return
    }

    // 调用API保存用户选择的角色
    console.log('正在保存用户角色选择:', selectedRoleConfig.id)
    const roleResponse = await selectUserRole(selectedRoleConfig.id) as any

    console.log('API响应:', roleResponse)

    // 经过响应拦截器处理后，roleResponse 直接就是后端返回的数据对象
    if (roleResponse.code === 200) {
      message.success(`已选择 ${selectedRoleConfig.name} 角色`)

      // 更新用户store中的信息
      await userStore.fetchUserInfo()

      // 跳转到对应的角色注册页面
      const roleRoutes = {
        designer: '/registration/designer',
        enterprise: '/registration/enterprise',
        school: '/registration/school',
      }

      const targetRoute = roleRoutes[selectedRole.value as keyof typeof roleRoutes]
      if (targetRoute)
        router.push(targetRoute)
      else
        message.error('未知的角色类型')
    }
    else {
      message.error(roleResponse.msg || '角色选择失败，请重试')
    }
  }
  catch (error: any) {
    console.error('角色选择失败:', error)
    message.error('角色选择失败，请重试')
  }
  finally {
    loading.value = false
  }
}

// 页面加载时检查用户是否已有角色
onMounted(async () => {
  try {
    // 先确保用户store中有用户信息
    if (!userStore.userInfo?.userId) {
      console.log('用户信息为空，正在获取...')
      await userStore.fetchUserInfo()
    }

    console.log('当前用户信息:', userStore.userInfo)

    // 获取用户信息，检查是否已有角色
    const userInfo = await getUserInfo()
    if (userInfo?.data?.user?.roles && userInfo.data.user.roles.length > 0) {
      // 如果用户已有角色，直接跳转到首页
      router.push('/')
    }
  }
  catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<template>
  <div class="role-selection-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          选择您的身份
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          请选择您在设计师生态平台中的主要身份，这将决定您可以使用的功能和权限
        </p>
      </div>

      <!-- 角色选择卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- 设计师角色 -->
        <div
          class="role-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
          :class="selectedRole === 'designer' ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900' : 'border-gray-200 dark:border-gray-700'"
          @click="selectRole('designer')"
        >
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                设计师
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                个人设计师用户
              </p>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                管理个人作品集
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                申请企业岗位
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                展示专业技能
              </div>
            </div>

            <div class="text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                角色ID: 1932319128081666050
              </div>
            </div>
          </div>
        </div>

        <!-- 企业管理员角色 -->
        <div
          class="role-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
          :class="selectedRole === 'enterprise' ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900' : 'border-gray-200 dark:border-gray-700'"
          @click="selectRole('enterprise')"
        >
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                企业管理员
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                企业管理用户
              </p>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                发布招聘岗位
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                管理申请流程
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                浏览设计师档案
              </div>
            </div>

            <div class="text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                角色ID: 1932319128081666051
              </div>
            </div>
          </div>
        </div>

        <!-- 院校管理员角色 -->
        <div
          class="role-card bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2"
          :class="selectedRole === 'school' ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900' : 'border-gray-200 dark:border-gray-700'"
          @click="selectRole('school')"
        >
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                院校管理员
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                院校管理用户
              </p>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                管理学生信息
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                查看就业统计
              </div>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                展示院校成果
              </div>
            </div>

            <div class="text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                角色ID: 1932319128081666052
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 确认按钮 -->
      <div class="text-center mt-12">
        <NButton
          type="primary"
          size="large"
          :disabled="!selectedRole || loading"
          :loading="loading"
          class="px-8 py-3 text-lg"
          @click="confirmRoleSelection"
        >
          {{ loading ? '正在跳转...' : '开始注册' }}
        </NButton>
      </div>

      <!-- 提示信息 -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          选择角色后，您可以在个人设置中随时切换或添加其他身份
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-card {
  transform: translateY(0);
  transition: all 0.3s ease;
}

.role-card:hover {
  transform: translateY(-4px);
}

.role-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04);
}
</style>
