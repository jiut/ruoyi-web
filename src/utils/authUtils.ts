import { getToken } from '@/store/modules/auth/helper'
import { useUserStore } from '@/store/modules/user'

/**
 * 检测用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn(): boolean {
  const token = getToken()
  const userStore = useUserStore()

  // 检查是否有有效的token
  if (!token) {
    console.log('🔍 登录检测: 无token')
    return false
  }

  // 检查用户信息是否完整（参考TalentUserMenu.vue的逻辑）
  const hasValidUser = !!(userStore.userInfo?.name && userStore.userInfo.name !== '熊猫助手')

  console.log('🔍 登录检测:', {
    token: !!token,
    userName: userStore.userInfo?.name,
    hasValidUser,
    isLoggedIn: !!token && hasValidUser
  })

  return !!token && hasValidUser
}

/**
 * 判断是否应该使用Mock数据
 * 优先级：环境变量 > 登录状态
 * @returns {boolean} 是否使用Mock数据
 */
export function shouldUseMockData(): boolean {
  // 如果环境变量明确设置为true，强制使用mock数据
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return true
  }

  // 如果环境变量明确设置为false，强制使用后端API
  if (import.meta.env.VITE_USE_MOCK_DATA === 'false') {
    return false
  }

  // 默认情况下，根据登录状态决定：未登录使用mock，登录后使用API
  return !isLoggedIn()
}

/**
 * 获取当前登录状态
 * @returns {object} 登录状态信息
 */
export function getLoginStatus() {
  const token = getToken()
  const userStore = useUserStore()

  return {
    hasToken: !!token,
    hasValidUser: !!(userStore.userInfo?.name && userStore.userInfo.name !== '熊猫助手'),
    isLoggedIn: isLoggedIn(),
    userInfo: userStore.userInfo
  }
}
