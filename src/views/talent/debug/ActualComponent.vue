<script setup lang="ts">
import { ref } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import type { UserInfo } from '@/store/modules/user/helper'
import { defaultSetting } from '@/store/modules/user/helper'

defineProps<{
  state: string
}>()

// 用户信息
const userInfo = ref<UserInfo>({
  ...defaultSetting().userInfo,
  name: '测试用户',
  avatar: '',
  userBalance: '100.00',
})

// 用户菜单状态
const showUserMenu = ref(false)

// 计算属性
const getUserInitial = () => {
  return userInfo.value.name ? userInfo.value.name.charAt(0) : '用'
}

// 方法
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogin = () => {
  console.log('登录按钮点击')
}

const handleRegister = () => {
  console.log('注册按钮点击')
}

const handleReset = () => {
  console.log('退出登录')
}
</script>

<template>
  <div class="user-menu-container relative" @click.stop>
    <!-- 已登录状态 -->
    <template v-if="state === 'loggedIn'">
      <button
        class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
        @click.stop="toggleUserMenu"
      >
        <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
          {{ getUserInitial() }}
        </div>
        <span class="hidden lg:inline text-white text-sm">{{ userInfo.name ?? '用户' }}</span>
        <i class="ri-arrow-down-s-line text-gray-400 hidden lg:block" />
      </button>

      <!-- 用户下拉菜单 -->
      <div
        v-show="showUserMenu"
        class="talent-user-dropdown rounded-lg mt-2 right-0 w-48"
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
          <router-link to="/settings" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
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
          >
            <i class="ri-user-line text-base" />
          </button>
          <button
            class="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-green-700 hover:to-teal-600 transition-colors"
            title="注册"
          >
            <i class="ri-user-add-line text-base" />
          </button>
        </div>

        <!-- 平板端：显示紧凑按钮 -->
        <div class="hidden lg:flex xl:hidden space-x-1">
          <button
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-xs font-medium"
          >
            <i class="ri-user-line text-sm" />
            <span>登录</span>
          </button>
          <button
            class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-xs font-medium"
          >
            <i class="ri-user-add-line text-sm" />
            <span>注册</span>
          </button>
        </div>

        <!-- 桌面端：显示完整按钮 -->
        <div class="hidden xl:flex space-x-2">
          <button
            class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
          >
            <i class="ri-user-line" />
            <span>登录</span>
          </button>
          <button
            class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
          >
            <i class="ri-user-add-line" />
            <span>注册</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.talent-user-dropdown {
  position: absolute !important;
  background: rgba(28, 28, 30, 0.95) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 9999 !important;
}

/* 防止过渡期间的布局跳动 */
.user-menu-container {
  min-height: 44px;
  display: flex;
  align-items: center;
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

/* 响应式调整 */
@media (max-width: 1023px) {
  .user-menu-container {
    min-height: 40px;
  }
}

@media (max-width: 767px) {
  .user-menu-container {
    min-height: 36px;
  }
}
</style>
