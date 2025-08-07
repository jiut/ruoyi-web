<template>
  <div class="test-container">
    <div class="test-card">
      <h2>🧪 手机号强制绑定功能测试</h2>

      <div class="status-section">
        <h3>当前状态</h3>
        <div class="status-item">
          <span class="label">用户ID:</span>
          <span class="value">{{ userInfo.userId || '未登录' }}</span>
        </div>
        <div class="status-item">
          <span class="label">用户名:</span>
          <span class="value">{{ userInfo.userName || '未登录' }}</span>
        </div>
        <div class="status-item">
          <span class="label">手机号:</span>
          <span class="value" :class="phoneStatus.class">
            {{ userInfo.phone || '未绑定' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">绑定状态:</span>
          <span class="value" :class="phoneStatus.class">
            {{ phoneStatus.text }}
          </span>
        </div>
      </div>

      <div class="test-section">
        <h3>测试操作</h3>

        <div class="button-group">
          <NButton type="primary" @click="testChatAccess">
            测试访问聊天页面 (/chat)
          </NButton>

          <NButton type="info" @click="testProfileAccess">
            测试访问档案页面 (/profile)
          </NButton>

          <NButton type="warning" @click="testBindingPage">
            直接访问绑定页面
          </NButton>
        </div>

                <div class="button-group">
          <NButton type="error" @click="simulateUnbound">
            🔧 模拟未绑定状态
          </NButton>

          <NButton type="success" @click="simulateBound">
            🔧 模拟已绑定状态
          </NButton>

          <NButton @click="resetToOriginal">
            🔄 恢复原始状态
          </NButton>
        </div>

                <div class="button-group">
          <NButton type="primary" @click="refreshUserInfo">
            🔄 刷新用户信息
          </NButton>

          <NButton @click="checkLoginStatus">
            🔍 检查登录状态
          </NButton>

          <NButton
            :type="bindingEnabled ? 'error' : 'success'"
            @click="togglePhoneBinding"
          >
            {{ bindingEnabled ? '🚫 禁用强制绑定' : '✅ 启用强制绑定' }}
          </NButton>
        </div>
      </div>

      <div class="log-section">
        <h3>测试日志</h3>
        <div class="log-container">
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
        <NButton size="small" @click="clearLogs">清空日志</NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useUserStore } from '@/store/modules/user'
import { needsPhoneBinding, getPhoneBindingStatus } from '@/utils/phoneBindingUtils'
import { getToken } from '@/store/modules/auth/helper'
import { phoneBindingConfig, enablePhoneBinding, disablePhoneBinding } from '@/config/phoneBinding'

const router = useRouter()
const userStore = useUserStore()

// 日志记录
const logs = ref<Array<{time: string, message: string}>>([])

// 原始用户信息备份
const originalUserInfo = ref<any>(null)

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 强制绑定开关状态
const bindingEnabled = ref(phoneBindingConfig.enabled)

// 手机号状态
const phoneStatus = computed(() => {
  const status = getPhoneBindingStatus()

  if (!status.hasUserId) {
    return { text: '未登录', class: 'status-error' }
  }

  if (status.isPhoneBound) {
    return { text: '已绑定 ✅', class: 'status-success' }
  }

  const bindingStatus = bindingEnabled.value ? '未绑定 ❌ (强制绑定已启用)' : '未绑定 ⚠️ (强制绑定已禁用)'
  return { text: bindingStatus, class: bindingEnabled.value ? 'status-error' : 'status-warning' }
})

// 添加日志
function addLog(message: string) {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, message })
  console.log(`[测试] ${message}`)
}

// 清空日志
function clearLogs() {
  logs.value = []
}

// 测试访问聊天页面
function testChatAccess() {
  addLog('尝试访问聊天页面 (/chat)')
  router.push('/chat')
}

// 测试访问档案页面
function testProfileAccess() {
  addLog('尝试访问档案页面 (/profile)')
  router.push('/profile')
}

// 测试绑定页面
function testBindingPage() {
  addLog('直接访问绑定页面 (/bind-phone)')
  router.push('/bind-phone')
}

// 模拟未绑定状态
function simulateUnbound() {
  addLog('模拟未绑定状态：清除手机号信息')
  userStore.updateUserInfo({ phone: '' })
}

// 模拟已绑定状态
function simulateBound() {
  addLog('模拟已绑定状态：设置手机号为 13800138000')
  userStore.updateUserInfo({ phone: '13800138000' })
}

// 恢复原始状态
function resetToOriginal() {
  if (originalUserInfo.value) {
    addLog('恢复到原始用户状态')
    userStore.updateUserInfo(originalUserInfo.value)
  } else {
    addLog('没有原始状态可恢复')
  }
}

// 切换强制绑定开关
function togglePhoneBinding() {
  if (bindingEnabled.value) {
    disablePhoneBinding()
    bindingEnabled.value = false
    addLog('强制绑定手机号功能已禁用 - 用户现在可以自由浏览所有页面')
  } else {
    enablePhoneBinding()
    bindingEnabled.value = true
    addLog('强制绑定手机号功能已启用 - 未绑定用户将被强制跳转到绑定页面')
  }
}

// 刷新用户信息
async function refreshUserInfo() {
  addLog('开始刷新用户信息...')
  try {
    await userStore.fetchUserInfo()
    addLog(`用户信息刷新成功: ${JSON.stringify(userInfo.value)}`)

    // 重新检查绑定状态
    const status = getPhoneBindingStatus()
    addLog(`绑定状态检查结果：${JSON.stringify(status)}`)
  } catch (error: any) {
    addLog(`用户信息刷新失败: ${error.message || error}`)
  }
}

// 检查登录状态
function checkLoginStatus() {
  const token = getToken()
  addLog(`Token检查: ${token ? '存在' : '不存在'}`)
  addLog(`UserStore状态: ${JSON.stringify({
    userId: userInfo.value.userId,
    userName: userInfo.value.userName,
    phone: userInfo.value.phone,
    name: userInfo.value.name
  })}`)

  // 详细的绑定状态检查
  const status = getPhoneBindingStatus()
  addLog(`详细绑定状态: ${JSON.stringify(status)}`)

  // 检查是否需要强制绑定
  const needsBinding = needsPhoneBinding()
  addLog(`是否需要强制绑定: ${needsBinding}`)
}

// 组件挂载时的初始化
onMounted(async () => {
  addLog('=== 测试页面已加载 ===')

  // 检查登录状态
  checkLoginStatus()

  // 备份原始状态
  originalUserInfo.value = { ...userInfo.value }
  addLog('原始状态已备份')

  // 如果用户信息为空或为默认值，主动获取
  if (!userInfo.value.userId || userInfo.value.name === '熊猫助手') {
    addLog('检测到用户信息未加载，开始获取...')
    await refreshUserInfo()
  } else {
    addLog('用户信息已存在，无需重新获取')
    const status = getPhoneBindingStatus()
    addLog(`当前绑定状态：${JSON.stringify(status)}`)
  }
})
</script>

<style scoped>
.test-container {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.test-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.test-card h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.test-card h3 {
  color: #555;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 5px;
}

.status-section, .test-section, .log-section {
  margin-bottom: 30px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 600;
}

.status-success {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

.status-warning {
  color: #fd7e14;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.log-time {
  color: #6c757d;
  font-size: 12px;
  min-width: 80px;
}

.log-message {
  color: #495057;
  font-size: 14px;
}

@media (max-width: 768px) {
  .test-container {
    padding: 10px;
  }

  .test-card {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
