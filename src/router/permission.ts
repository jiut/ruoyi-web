// 直接使用 any 避免多版本 vue-router 类型冲突

const whiteList = ['/login', '/regist', '/resetpassword', '/role-selection'] // 不重定向白名单

export function setupPageGuard(router: any) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    // 获取用户store和token检查
    const { useUserStore } = await import('@/store')
    const { getToken } = await import('@/store/modules/auth/helper')

    const userStore = useUserStore()
    const token = getToken()

    // 如果有token但用户信息为空或为默认值，则初始化用户信息
    if (token && (!userStore.userInfo?.userId || userStore.userInfo.name === '熊猫助手')) {
      console.log('检测到token但用户信息未加载，正在初始化...')
      try {
        await userStore.fetchUserInfo()
        console.log('用户信息初始化完成:', userStore.userInfo)
      }
      catch (error) {
        console.error('初始化用户信息失败:', error)
      }
    }

    // 检查用户是否需要选择角色
    const { needsRoleSelection } = await import('@/utils/authUtils')

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

    next()
  })
}
