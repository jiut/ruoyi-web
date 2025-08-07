import { useUserStore } from '@/store'
import { getToken } from '@/store/modules/auth/helper'
import { needsRoleSelection, isLoggedIn } from '@/utils/authUtils'
import { phoneBindingConfig } from '@/config/phoneBinding'

// 直接使用 any 避免多版本 vue-router 类型冲突

const whiteList = ['/login', '/regist', '/resetpassword', '/role-selection', '/bind-phone', '/test-phone-binding', '/demo-user-info'] // 不重定向白名单
const authRequiredRoutes = ['/chat', '/m', '/draw', '/ppt', '/video', '/music', '/knowledge', '/annex', '/fragment', '/profile', '/registration', '/test-phone-binding'] // 需要登录的路由前缀

export function setupPageGuard(router: any) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    // 获取用户store和token检查
    const userStore = useUserStore()
    const token = getToken()

    // 检查是否在白名单中
    const isWhiteListed = whiteList.some(route => to.path.startsWith(route))

    // 检查是否访问需要登录的路由
    const isAuthRequired = authRequiredRoutes.some(route => to.path.startsWith(route))

    // 如果访问需要登录的路由但用户未登录，跳转到登录页
    if (isAuthRequired && !isLoggedIn()) {
      console.log(`用户未登录，尝试访问受保护的路由: ${to.path}，重定向到登录页`)
      next('/login')
      return
    }

    // 如果有token但用户信息为空或为默认值，则初始化用户信息
    if (token && (!userStore.userInfo?.userId || userStore.userInfo.name === '熊猫助手')) {
      console.log('检测到token但用户信息未加载，正在初始化...')
      try {
        await userStore.fetchUserInfo()
        console.log('用户信息初始化完成:', userStore.userInfo)
      }
      catch (error) {
        console.error('初始化用户信息失败:', error)
        // 如果获取用户信息失败，直接继续导航，避免阻塞页面
        next()
        return
      }
    }

    // 只有在用户信息成功加载后才检查角色选择
    // 如果用户需要选择角色且不在角色选择页面，则跳转到角色选择页面
    if (needsRoleSelection() && to.path !== '/role-selection') {
      next('/role-selection')
      return
    }

    // 如果用户在角色选择页面但不需要选择角色，则跳转到首页
    if (to.path === '/role-selection' && !needsRoleSelection()) {
      next('/')
      return
    }

        // 检查手机号绑定状态 - 根据配置决定是否启用
    if (phoneBindingConfig.enabled && token && userStore.userInfo?.userId && !isWhiteListed) {
      const hasPhone = userStore.userInfo.phone && userStore.userInfo.phone.trim() !== ''

      // 如果用户没有绑定手机号且不在绑定手机号页面，强制跳转到绑定页面
      if (!hasPhone && to.path !== '/bind-phone') {
        console.log('用户未绑定手机号，强制跳转到绑定页面')
        // 保存用户原本要访问的页面，绑定成功后跳转回去
        const redirectPath = to.fullPath === '/' ? '/' : to.fullPath
        next(`/bind-phone?redirect=${encodeURIComponent(redirectPath)}`)
        return
      }

      // 如果用户已绑定手机号但在绑定页面，跳转到目标页面或首页
      if (hasPhone && to.path === '/bind-phone') {
        const redirectPath = to.query.redirect as string
        next(redirectPath ? decodeURIComponent(redirectPath) : '/')
        return
      }
    }

    next()
  })
}
