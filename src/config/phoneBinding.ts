/**
 * 手机号绑定配置
 */
export const phoneBindingConfig = {
  // 是否启用强制绑定手机号功能
  enabled: false,

  // 白名单页面（不需要检查手机号绑定的页面）
  whiteList: [
    '/login',
    '/regist',
    '/resetpassword',
    '/role-selection',
    '/bind-phone',
    '/test-phone-binding',
    '/demo-user-info'
  ],

  // 绑定页面路径
  bindingPath: '/bind-phone',

  // 是否在控制台输出调试信息
  debug: true
}

/**
 * 启用强制绑定手机号功能
 */
export function enablePhoneBinding() {
  phoneBindingConfig.enabled = true
  if (phoneBindingConfig.debug) {
    console.log('✅ 强制绑定手机号功能已启用')
  }
}

/**
 * 禁用强制绑定手机号功能
 */
export function disablePhoneBinding() {
  phoneBindingConfig.enabled = false
  if (phoneBindingConfig.debug) {
    console.log('🚫 强制绑定手机号功能已禁用')
  }
}

/**
 * 检查是否启用了强制绑定功能
 */
export function isPhoneBindingEnabled(): boolean {
  return phoneBindingConfig.enabled
}
