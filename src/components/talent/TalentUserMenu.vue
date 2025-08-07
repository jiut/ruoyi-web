<script setup lang='ts'>
import { computed, defineAsyncComponent, h, onMounted, onUnmounted, ref, watch } from 'vue'
import { NAvatar, NIcon, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import to from 'await-to-js'
import {
  LogOut as out,
  Settings as settings,
  Storefront as storefront,
} from '@vicons/ionicons5'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { getToken, removeToken } from '@/store/modules/auth/helper'
import { getUserInfo, loginOut } from '@/api/user'
import type { UserInfo } from '@/store/modules/user/helper'
import { defaultSetting } from '@/store/modules/user/helper'
import { useAuthStore } from '@/store'
import PromptStore from '@/components/common/PromptStore/index.vue'
import { useRoleCheck } from '@/composables/useRoleCheck'

const router = useRouter()
const userInfo = ref<UserInfo>(defaultSetting().userInfo)
const message = useMessage()
const authStore = useAuthStore()
const { isDesigner, isEnterprise, isSchool } = useRoleCheck()

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const settingVisible = ref(false)
const promptStoreVisible = ref(false)
const showUserMenu = ref(false)

// 添加初始化状态，避免闪烁
const isInitializing = ref(true)

// 计算是否已登录
const isLoggedIn = computed(() => {
  const token = getToken()
  const hasValidUser = userInfo.value.name && userInfo.value.name !== '熊猫助手'
  return !!token && hasValidUser
})

// 计算账户设置跳转路径
const accountSettingsPath = computed(() => {
  if (isDesigner.value) {
    return '/profile/designer/basic'
  } else if (isEnterprise.value) {
    return '/profile/enterprise/basic'
  } else if (isSchool.value) {
    return '/profile/school/basic'
  } else {
    // 默认跳转到设计师页面
    return '/profile/designer/basic'
  }
})

onMounted(async () => {
  // 如果有token，尝试获取用户信息
  if (getToken())
    await getLoginUserInfo()

  // 无论是否有token或加载是否成功，都要完成初始化
  isInitializing.value = false
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听token变化，自动刷新用户信息
watch(
  () => authStore.token,
  async (newToken, oldToken) => {
    if (newToken)
      await getLoginUserInfo()
    else
      userInfo.value = defaultSetting().userInfo
  },
)

/**
 * 获取当前登录用户信息
 */
async function getLoginUserInfo() {
  const token = getToken()
  if (!token)
    return

  try {
    const [err, newUserInfo] = await to(getUserInfo())
    if (err) {
      console.warn('获取用户信息失败:', err)
      // 如果获取用户信息失败，可能是token过期，清除token
      removeToken()
      return
    }
    if (newUserInfo?.data?.user) {
      userInfo.value.avatar = newUserInfo.data.user.avatar
      userInfo.value.name = newUserInfo.data.user.nickName
      userInfo.value.userBalance = newUserInfo.data.user.userBalance
    }
  }
  catch (error) {
    console.warn('获取用户信息异常:', error)
    // 如果发生异常，也清除token
    removeToken()
  }
}

/**
 * 退出登录
 */
async function handleReset() {
  await loginOut()
  // 删除用户token
  removeToken()
  // 跳转到登录页面
  router.push('/login')
}

/**
 * 跳转到登录页面
 */
function handleLogin() {
  router.push('/login')
}

/**
 * 跳转到注册页面
 */
function handleRegister() {
  router.push('/regist')
}

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '账户设置',
    key: 'accountSettings',
    icon: renderIcon(settings),
  },
  {
    label: '购买套餐',
    key: 'buy',
    icon: renderIcon(storefront),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(out),
  },
]

function handleMenuSelect(key: string) {
  if (key === 'logout')
    handleReset()
  else if (key === 'accountSettings')
    settingVisible.value = true
  else if (key === 'buy')
    promptStoreVisible.value = true
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  console.log('toggleUserMenu called, showUserMenu:', showUserMenu.value)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu-container'))
    showUserMenu.value = false
}

// 获取用户名的第一个字符
const getUserInitial = () => {
  return userInfo.value.name ? userInfo.value.name.charAt(0) : '用'
}
</script>

<template>
  <div class="user-menu-container relative" @click.stop>
    <!-- 初始化中，显示与最终状态相同尺寸的占位符 -->
    <template v-if="isInitializing">
      <!-- 如果有token，显示用户头像占位符 -->
      <template v-if="getToken()">
        <button class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors cursor-default">
          <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
            <div class="w-6 h-6 bg-gray-400 rounded-full" />
          </div>
          <div class="hidden lg:inline h-5 w-16 bg-gray-500 rounded" />
          <div class="hidden lg:block w-4 h-4 bg-gray-500 rounded opacity-60" />
        </button>
      </template>

      <!-- 如果没有token，显示登录注册按钮占位符 -->
      <template v-else>
        <div class="flex items-center space-x-2">
          <!-- 移动端占位符 -->
          <div class="flex lg:hidden space-x-1">
            <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
              <div class="w-4 h-4 bg-gray-400 rounded" />
            </div>
            <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
              <div class="w-4 h-4 bg-gray-400 rounded" />
            </div>
          </div>

          <!-- 平板端占位符 -->
          <div class="hidden lg:flex xl:hidden space-x-1">
            <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
              <div class="w-3 h-3 bg-gray-400 rounded" />
              <div class="w-8 h-3 bg-gray-400 rounded" />
            </div>
            <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
              <div class="w-3 h-3 bg-gray-400 rounded" />
              <div class="w-8 h-3 bg-gray-400 rounded" />
            </div>
          </div>

          <!-- 桌面端占位符 -->
          <div class="hidden xl:flex space-x-2">
            <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
              <div class="w-4 h-4 bg-gray-400 rounded" />
              <div class="w-12 h-4 bg-gray-400 rounded" />
            </div>
            <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
              <div class="w-4 h-4 bg-gray-400 rounded" />
              <div class="w-12 h-4 bg-gray-400 rounded" />
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- 已登录状态 -->
    <template v-else-if="isLoggedIn">
      <button
        class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
        @click.stop="toggleUserMenu"
      >
        <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
          <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
            <NAvatar size="small" round :src="userInfo.avatar" :fallback-src="defaultAvatar" />
          </template>
          <template v-else>
            {{ getUserInitial() }}
          </template>
        </div>
        <span class="hidden lg:inline text-white text-sm">{{ userInfo.name ?? '用户' }}</span>
        <i class="ri-arrow-down-s-line text-gray-400 hidden lg:block" />
      </button>

      <!-- 用户下拉菜单 -->
      <div
        v-show="showUserMenu"
        class="talent-user-dropdown absolute top-full right-0 mt-2 w-48 rounded-lg"
        @click.stop
      >
        <div class="p-3 border-b border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
              <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
                <NAvatar size="small" round :src="userInfo.avatar" :fallback-src="defaultAvatar" />
              </template>
              <template v-else>
                {{ getUserInitial() }}
              </template>
            </div>
            <div>
              <p class="text-sm font-medium">
                {{ userInfo.name ?? '用户' }}
              </p>
              <p class="text-xs text-gray-400">
                余额: {{ userInfo.userBalance }}
              </p>
            </div>
          </div>
        </div>
        <div class="py-2">
          <router-link :to="accountSettingsPath" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
            <i class="ri-settings-3-line mr-3" />
            账户设置
          </router-link>
          <router-link to="/favorites" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
            <i class="ri-bookmark-line mr-3" />
            我的收藏
          </router-link>
          <div class="border-t border-gray-700 mt-2" />
          <button
            class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50 text-red-400 w-full text-left"
            @click="handleReset"
          >
            <i class="ri-logout-box-line mr-3" />
            退出登录
          </button>
        </div>
      </div>
    </template>

    <!-- 未登录状态 -->
    <template v-else>
      <div class="flex items-center space-x-2">
        <!-- 移动端：只显示图标按钮 -->
        <div class="flex lg:hidden space-x-1">
          <button
            class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-600 transition-colors"
            title="登录"
            @click="handleLogin"
          >
            <i class="ri-user-line text-base" />
          </button>
          <button
            class="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-green-700 hover:to-teal-600 transition-colors"
            title="注册"
            @click="handleRegister"
          >
            <i class="ri-user-add-line text-base" />
          </button>
        </div>

        <!-- 平板端：显示紧凑按钮 -->
        <div class="hidden lg:flex xl:hidden space-x-1">
          <button
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-xs font-medium"
            @click="handleLogin"
          >
            <i class="ri-user-line text-sm" />
            <span>登录</span>
          </button>
          <button
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-xs font-medium"
            @click="handleRegister"
          >
            <i class="ri-user-add-line text-sm" />
            <span>注册</span>
          </button>
        </div>

        <!-- 桌面端：显示完整按钮 -->
        <div class="hidden xl:flex space-x-2">
          <button
            class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
            @click="handleLogin"
          >
            <i class="ri-user-line" />
            <span>登录</span>
          </button>
          <button
            class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
            @click="handleRegister"
          >
            <i class="ri-user-add-line" />
            <span>注册</span>
          </button>
        </div>
      </div>
    </template>

    <Setting v-if="settingVisible" v-model:visible="settingVisible" />
    <PromptStore v-if="promptStoreVisible" v-model:visible="promptStoreVisible" title="购买套餐" />
  </div>
</template>

<style scoped>
.talent-user-dropdown {
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  /* 不要设置 display，让 v-show 控制 */
}

/* 防止过渡期间的布局跳动 */
.user-menu-container {
  position: relative; /* 确保下拉菜单相对于此容器定位 */
  min-height: 44px; /* 确保容器有最小高度 */
  display: flex;
  align-items: center;
}

/* 占位符动画 */
.user-menu-container .bg-gray-500 {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

/* 过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 移动端优化 */
@media (max-width: 1023px) {
  .user-menu-container {
    margin-right: 0.25rem;
    min-height: 40px;
  }
}

@media (max-width: 767px) {
  .user-menu-container {
    margin-right: 0;
    min-height: 36px;
  }
}

/* 确保按钮元素的一致性 */
.user-menu-container button {
  border: none;
  background: transparent;
  outline: none;
}

/* 防止文字选择导致的视觉问题 */
.user-menu-container * {
  user-select: none;
}
</style>
