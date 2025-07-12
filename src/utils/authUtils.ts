import { getToken } from '@/store/modules/auth/helper'
import { useUserStore } from '@/store'

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken()
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
    userInfo: userStore.userInfo,
  }
}

/**
 * 检查用户是否为普通角色（角色ID为2）
 * @returns {boolean} 是否为普通角色
 */
export function isNormalRole(): boolean {
  const userStore = useUserStore()
  const roles = userStore.userInfo?.roles || []

  // 检查是否只有普通角色（角色ID为2）
  // 兼容数字和字符串类型的roleId
  return roles.length === 1 && String(roles[0]?.roleId) === '2'
}

/**
 * 检查用户是否已选择专业角色
 * @returns {boolean} 是否已选择专业角色
 */
export function hasProfessionalRole(): boolean {
  const userStore = useUserStore()
  const roles = userStore.userInfo?.roles || []

  // 检查是否有设计师、企业管理员或院校管理员角色
  const professionalRoleIds = [
    '1932319128081666050', // 设计师
    '1932319128081666051', // 企业管理员
    '1932319128081666052', // 院校管理员
  ]

  return roles.some(role => professionalRoleIds.includes(String(role.roleId)))
}

/**
 * 获取用户当前角色
 * @returns {object|null} 用户角色信息
 */
export function getCurrentRole() {
  const userStore = useUserStore()
  const roles = userStore.userInfo?.roles || []

  if (roles.length === 0)
    return null

  // 优先返回专业角色
  const professionalRoleIds = [
    '1932319128081666050', // 设计师
    '1932319128081666051', // 企业管理员
    '1932319128081666052', // 院校管理员
  ]

  const professionalRole = roles.find(role => professionalRoleIds.includes(String(role.roleId)))
  if (professionalRole)
    return professionalRole

  // 如果没有专业角色，返回第一个角色
  return roles[0]
}

/**
 * 检查用户是否需要选择角色
 * @returns {boolean} 是否需要选择角色
 */
export function needsRoleSelection(): boolean {
  return isLoggedIn() && isNormalRole() && !hasProfessionalRole()
}

/**
 * 判断是否应该使用Mock数据
 * 优先级：环境变量 > 登录状态
 * @returns {boolean} 是否使用Mock数据
 */
export function shouldUseMockData(): boolean {
  // 如果环境变量明确设置为true，强制使用mock数据
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true')
    return true

  // 如果环境变量明确设置为false，强制使用后端API
  if (import.meta.env.VITE_USE_MOCK_DATA === 'false')
    return false

  // 默认情况下，根据登录状态决定：未登录使用mock，登录后使用API
  return !isLoggedIn()
}
