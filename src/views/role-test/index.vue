<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">角色检测调试页面</h1>

      <!-- 基本信息 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">基本信息</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <strong>当前路径:</strong> {{ currentRoute }}
          </div>
          <div>
            <strong>登录状态:</strong>
            <span :class="loginStatus.isLoggedIn ? 'text-green-600' : 'text-red-600'">
              {{ loginStatus.isLoggedIn ? '已登录' : '未登录' }}
            </span>
          </div>
          <div>
            <strong>Token:</strong>
            <span class="font-mono text-sm">{{ loginStatus.hasToken ? '有' : '无' }}</span>
          </div>
          <div>
            <strong>用户名:</strong> {{ userInfo?.name || '未知' }}
          </div>
        </div>
      </div>

      <!-- 角色信息 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">角色信息</h2>
        <div class="space-y-3">
          <div>
            <strong>用户角色:</strong>
            <pre class="bg-gray-100 p-2 rounded mt-2">{{ JSON.stringify(userInfo?.roles || [], null, 2) }}</pre>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div>
              <strong>是否普通角色:</strong>
              <span :class="roleChecks.isNormalUser ? 'text-blue-600' : 'text-gray-500'">
                {{ roleChecks.isNormalUser ? '是' : '否' }}
              </span>
            </div>
            <div>
              <strong>是否有专业角色:</strong>
              <span :class="roleChecks.hasProfessional ? 'text-green-600' : 'text-gray-500'">
                {{ roleChecks.hasProfessional ? '是' : '否' }}
              </span>
            </div>
            <div>
              <strong>需要选择角色:</strong>
              <span :class="roleChecks.shouldSelectRole ? 'text-orange-600' : 'text-gray-500'">
                {{ roleChecks.shouldSelectRole ? '是' : '否' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">操作</h2>
        <div class="space-x-4 space-y-2">
          <n-button type="primary" @click="refreshUserInfo">刷新用户信息</n-button>
          <n-button type="info" @click="goToRoleSelection">跳转到角色选择</n-button>
          <n-button @click="goToHome">跳转到首页</n-button>
          <n-button @click="goToTalent">跳转到人才模块</n-button>
          <n-button type="warning" @click="testRoleRedirect">测试角色重定向逻辑</n-button>
        </div>
      </div>

      <!-- 调试日志 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">调试日志</h2>
        <div class="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
          <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
            {{ log }}
          </div>
        </div>
        <n-button size="small" @click="clearLogs" class="mt-2">清除日志</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton } from 'naive-ui'
import { useUserStore } from '@/store'
import { getLoginStatus, isNormalRole, hasProfessionalRole, needsRoleSelection } from '@/utils/authUtils'
import { useRoleCheck } from '@/composables/useRoleCheck'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const debugLogs = ref<string[]>([])
const currentRoute = computed(() => route.path)
const loginStatus = computed(() => getLoginStatus())
const userInfo = computed(() => userStore.userInfo)

// 使用角色检查组合式函数
const roleChecks = useRoleCheck()

// 添加调试日志
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.push(`[${timestamp}] ${message}`)
}

// 刷新用户信息
const refreshUserInfo = async () => {
  addLog('开始刷新用户信息...')
  try {
    await userStore.fetchUserInfo()
    addLog('用户信息刷新成功')
    addLog(`当前用户: ${userStore.userInfo?.name}`)
    addLog(`用户角色: ${JSON.stringify(userStore.userInfo?.roles)}`)

    // 详细角色检测
    const roles = userStore.userInfo?.roles || []
    addLog(`角色数量: ${roles.length}`)
    if (roles.length > 0) {
      addLog(`第一个角色ID: ${roles[0]?.roleId} (类型: ${typeof roles[0]?.roleId})`)
      addLog(`第一个角色ID转字符串: "${String(roles[0]?.roleId)}"`)
      addLog(`是否等于'2': ${String(roles[0]?.roleId) === '2'}`)
    }

    // 角色检测结果 (组合式函数)
    addLog(`isNormalUser (组合式): ${roleChecks.isNormalUser}`)
    addLog(`hasProfessional (组合式): ${roleChecks.hasProfessional}`)
    addLog(`shouldSelectRole (组合式): ${roleChecks.shouldSelectRole}`)

    // 角色检测结果 (工具函数)
    addLog(`isNormalRole (工具函数): ${isNormalRole()}`)
    addLog(`hasProfessionalRole (工具函数): ${hasProfessionalRole()}`)
    addLog(`needsRoleSelection (工具函数): ${needsRoleSelection()}`)

  } catch (error) {
    addLog(`用户信息刷新失败: ${error}`)
  }
}

// 跳转方法
const goToRoleSelection = () => {
  addLog('尝试跳转到角色选择页面...')
  router.push('/role-selection')
}

const goToHome = () => {
  addLog('尝试跳转到首页...')
  router.push('/')
}

const goToTalent = () => {
  addLog('尝试跳转到人才模块...')
  router.push('/talent')
}

// 清除日志
const clearLogs = () => {
  debugLogs.value = []
}

// 测试角色重定向逻辑
const testRoleRedirect = () => {
  addLog('开始测试角色重定向逻辑...')

  const logged = loginStatus.value.isLoggedIn
  const normal = isNormalRole()
  const professional = hasProfessionalRole()
  const needs = needsRoleSelection()

  addLog(`登录状态: ${logged}`)
  addLog(`是否普通角色: ${normal}`)
  addLog(`是否有专业角色: ${professional}`)
  addLog(`需要选择角色: ${needs}`)

  if (needs) {
    addLog('✅ 应该跳转到角色选择页面')
    router.push('/role-selection')
  } else {
    addLog('❌ 不需要跳转，保持当前页面')
  }
}

onMounted(() => {
  addLog('调试页面加载完成')
  addLog(`当前路径: ${route.path}`)
  addLog(`登录状态: ${loginStatus.value.isLoggedIn}`)
  refreshUserInfo()
})
</script>
