import { useUserStore } from '@/store/modules/user'

/**
 * 检查用户是否已绑定手机号
 * @returns {boolean} 是否已绑定手机号
 */
export function isPhoneBound(): boolean {
  const userStore = useUserStore()
  return !!(userStore.userInfo?.phone && userStore.userInfo.phone.trim() !== '')
}

/**
 * 检查用户是否需要强制绑定手机号
 * @returns {boolean} 是否需要强制绑定
 */
export function needsPhoneBinding(): boolean {
  const userStore = useUserStore()
  // 只有已登录且有用户ID的用户才需要检查手机号绑定
  return !!(userStore.userInfo?.userId && !isPhoneBound())
}

/**
 * 获取手机号绑定状态的详细信息
 * @returns {object} 绑定状态信息
 */
export function getPhoneBindingStatus() {
  const userStore = useUserStore()
  const hasUserId = !!(userStore.userInfo?.userId)
  const phone = userStore.userInfo?.phone || ''
  const isPhoneBound = phone && phone.trim() !== ''

  return {
    hasUserId,
    phone,
    isPhoneBound,
    needsBinding: hasUserId && !isPhoneBound
  }
}
