import { ref } from 'vue'
import { defineStore } from 'pinia'
import { to } from 'await-to-js'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'
import type { LoginFrom, UserData } from '@/typings/user'
import { doLogin, getUserInfo, loginOut } from '@/api/user'
import { getToken, removeToken, setToken } from '@/store/modules/auth/helper'
import { useAuthStore } from '@/store'

const token = ref(getToken())

// 创建用户仓库
export const useUserStore = defineStore('user-store', {
  // 仓库存储数据
  state: (): UserState => getLocalState(),
  // 异步|逻辑的地方
  actions: {
    // 初始化用户信息
    async initUserInfo() {
      const token = getToken()
      if (token && this.userInfo.name === '熊猫助手') {
        // 如果有token但用户信息是默认的，则获取用户信息
        await this.fetchUserInfo()
      }
    },
    // 用户登录的方法
    async userLogin(data: LoginFrom) {
      // 登录请求
      const [err, res] = await to(doLogin<UserData>(data))
      if (res) {
        const data = res.data
        // token本地存储
        setToken(data.token)
        token.value = data.token
        useAuthStore().setToken(data.token)

        // 登录成功后获取用户信息
        await this.fetchUserInfo()

        return Promise.resolve()
      }
      return Promise.reject(err)
    },
    // 二维码登录的方法
    async userQrLogin(token: string) {
      setToken(token)
      useAuthStore().setToken(token)
    },

    logout: async (): Promise<void> => {
      await loginOut()
      token.value = ''
      removeToken()
      // 退出登录时重置用户信息
      this.resetUserInfo()
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const [err, res] = await to(getUserInfo())
        if (err) {
          console.warn('获取用户信息失败:', err)
          return
        }
        if (res?.data?.user) {
          this.updateUserInfo({
            avatar: res.data.user.avatar || '',
            name: res.data.user.nickName || res.data.user.userName || '',
            userBalance: res.data.user.userBalance || 0,
            userGrade: res.data.user.userGrade || '0',
            userName: res.data.user.userName || '',
            userId: res.data.user.userId, // 保存userId
            phone: res.data.user.phonenumber || res.data.user.phone || '', // 获取手机号
            roles: res.data.user.roles || [],
          })
        }
      }
      catch (error) {
        console.warn('获取用户信息异常:', error)
      }
    },
  },
})
