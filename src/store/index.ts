import type { App } from 'vue'
import { store } from './helper'
import { useUserStore } from './modules/user'

export function setupStore(app: App) {
  app.use(store)

  // 初始化用户信息
  const userStore = useUserStore()
  userStore.initUserInfo()
}

export * from './modules'
export * from "./homeStore"
