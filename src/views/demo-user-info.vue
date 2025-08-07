<template>
  <div class="demo-container">
    <h2>🔍 用户信息实时监控</h2>

    <div class="info-section">
      <h3>当前用户信息</h3>
      <pre class="info-display">{{ JSON.stringify(userInfo, null, 2) }}</pre>
    </div>

    <div class="info-section">
      <h3>手机号绑定状态</h3>
      <pre class="info-display">{{ JSON.stringify(phoneStatus, null, 2) }}</pre>
    </div>

    <div class="info-section">
      <h3>认证状态</h3>
      <pre class="info-display">{{ JSON.stringify(authStatus, null, 2) }}</pre>
    </div>

    <div class="button-group">
      <button @click="refreshInfo" class="btn btn-primary">刷新信息</button>
      <button @click="clearUserInfo" class="btn btn-warning">清空用户信息</button>
      <button @click="simulatePhone" class="btn btn-success">模拟绑定手机号</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getPhoneBindingStatus } from '@/utils/phoneBindingUtils'
import { getToken } from '@/store/modules/auth/helper'

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 手机号状态
const phoneStatus = computed(() => getPhoneBindingStatus())

// 认证状态
const authStatus = computed(() => ({
  hasToken: !!getToken(),
  isLoggedIn: !!userInfo.value.userId,
  defaultUser: userInfo.value.name === '熊猫助手'
}))

// 刷新信息
async function refreshInfo() {
  console.log('开始刷新用户信息...')
  try {
    await userStore.fetchUserInfo()
    console.log('用户信息刷新完成:', userInfo.value)
  } catch (error) {
    console.error('刷新失败:', error)
  }
}

// 清空用户信息
function clearUserInfo() {
  userStore.resetUserInfo()
  console.log('用户信息已清空')
}

// 模拟绑定手机号
function simulatePhone() {
  userStore.updateUserInfo({ phone: '13800138000' })
  console.log('已模拟绑定手机号')
}

// 监听用户信息变化
watch(userInfo, (newVal) => {
  console.log('用户信息变化:', newVal)
}, { deep: true })

// 页面加载时自动刷新
onMounted(async () => {
  console.log('页面加载，检查用户信息状态...')
  console.log('初始用户信息:', userInfo.value)
  console.log('初始认证状态:', authStatus.value)

  // 如果有token但用户信息不完整，则刷新
  if (authStatus.value.hasToken && (!userInfo.value.userId || authStatus.value.defaultUser)) {
    console.log('检测到需要刷新用户信息')
    await refreshInfo()
  }
})
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.info-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.info-section h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-display {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  margin: 0;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}
</style>
