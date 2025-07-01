<template>
  <div class="debug-page min-h-screen bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">用户菜单调试页面</h1>
        <p class="text-gray-400">用于调试加载框和用户信息框的对齐问题</p>
      </div>

      <!-- 控制面板 -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">控制面板</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">登录状态</label>
            <select v-model="debugState" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="initializing">初始化中</option>
              <option value="loggedIn">已登录</option>
              <option value="notLoggedIn">未登录</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">屏幕尺寸</label>
            <select v-model="screenSize" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option value="mobile">移动端 (≤768px)</option>
              <option value="tablet">平板端 (768px-1024px)</option>
              <option value="desktop">桌面端 (≥1024px)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">显示模式</label>
            <div class="flex space-x-2">
              <button
                @click="showMode = 'side'"
                :class="showMode === 'side' ? 'bg-blue-600' : 'bg-gray-700'"
                class="px-3 py-2 rounded-lg text-white text-sm"
              >
                并排显示
              </button>
              <button
                @click="showMode = 'stack'"
                :class="showMode === 'stack' ? 'bg-blue-600' : 'bg-gray-700'"
                class="px-3 py-2 rounded-lg text-white text-sm"
              >
                上下显示
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 调试区域 -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">调试区域</h2>

        <!-- 并排显示模式 -->
        <div v-if="showMode === 'side'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：占位符 -->
          <div class="debug-section">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center">
              <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              占位符状态
            </h3>
            <div class="bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-600">
              <div class="flex justify-center">
                <div class="user-menu-container relative" @click.stop>
                  <template v-if="debugState === 'initializing'">
                    <template v-if="debugState === 'loggedIn'">
                      <button class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors cursor-default">
                        <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
                          <div class="w-6 h-6 bg-gray-400 rounded-full"></div>
                        </div>
                        <div class="hidden lg:inline h-5 w-16 bg-gray-500 rounded"></div>
                        <div class="hidden lg:block w-4 h-4 bg-gray-500 rounded opacity-60"></div>
                      </button>
                    </template>
                    <template v-else>
                      <div class="flex items-center space-x-2">
                        <div class="flex lg:hidden space-x-1">
                          <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                          </div>
                          <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                        <div class="hidden lg:flex xl:hidden space-x-1">
                          <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
                            <div class="w-3 h-3 bg-gray-400 rounded"></div>
                            <div class="w-8 h-3 bg-gray-400 rounded"></div>
                          </div>
                          <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
                            <div class="w-3 h-3 bg-gray-400 rounded"></div>
                            <div class="w-8 h-3 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                        <div class="hidden xl:flex space-x-2">
                          <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                            <div class="w-12 h-4 bg-gray-400 rounded"></div>
                          </div>
                          <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                            <div class="w-12 h-4 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：实际内容 -->
          <div class="debug-section">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              实际内容
            </h3>
            <div class="bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-600">
              <div class="flex justify-center">
                <div class="user-menu-container relative" @click.stop>
                  <template v-if="debugState === 'loggedIn'">
                    <button
                      @click.stop="toggleUserMenu"
                      class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
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
                      <i class="ri-arrow-down-s-line text-gray-400 hidden lg:block"></i>
                    </button>
                  </template>
                  <template v-else>
                    <div class="flex items-center space-x-2">
                      <div class="flex lg:hidden space-x-1">
                        <button
                          class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-600 transition-colors"
                          title="登录"
                        >
                          <i class="ri-user-line text-base"></i>
                        </button>
                        <button
                          class="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-green-700 hover:to-teal-600 transition-colors"
                          title="注册"
                        >
                          <i class="ri-user-add-line text-base"></i>
                        </button>
                      </div>
                      <div class="hidden lg:flex xl:hidden space-x-1">
                        <button
                          class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-xs font-medium"
                        >
                          <i class="ri-user-line text-sm"></i>
                          <span>登录</span>
                        </button>
                        <button
                          class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-xs font-medium"
                        >
                          <i class="ri-user-add-line text-sm"></i>
                          <span>注册</span>
                        </button>
                      </div>
                      <div class="hidden xl:flex space-x-2">
                        <button
                          class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
                        >
                          <i class="ri-user-line"></i>
                          <span>登录</span>
                        </button>
                        <button
                          class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
                        >
                          <i class="ri-user-add-line"></i>
                          <span>注册</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 上下显示模式 -->
        <div v-else class="space-y-8">
          <!-- 上方：占位符 -->
          <div class="debug-section">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center">
              <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              占位符状态
            </h3>
            <div class="bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-600">
              <div class="flex justify-center">
                <div class="user-menu-container relative" @click.stop>
                  <template v-if="debugState === 'initializing'">
                    <template v-if="debugState === 'loggedIn'">
                      <button class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors cursor-default">
                        <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
                          <div class="w-6 h-6 bg-gray-400 rounded-full"></div>
                        </div>
                        <div class="hidden lg:inline h-5 w-16 bg-gray-500 rounded"></div>
                        <div class="hidden lg:block w-4 h-4 bg-gray-500 rounded opacity-60"></div>
                      </button>
                    </template>
                    <template v-else>
                      <div class="flex items-center space-x-2">
                        <div class="flex lg:hidden space-x-1">
                          <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                          </div>
                          <div class="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                        <div class="hidden lg:flex xl:hidden space-x-1">
                          <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
                            <div class="w-3 h-3 bg-gray-400 rounded"></div>
                            <div class="w-8 h-3 bg-gray-400 rounded"></div>
                          </div>
                          <div class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-500">
                            <div class="w-3 h-3 bg-gray-400 rounded"></div>
                            <div class="w-8 h-3 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                        <div class="hidden xl:flex space-x-2">
                          <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                            <div class="w-12 h-4 bg-gray-400 rounded"></div>
                          </div>
                          <div class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-500">
                            <div class="w-4 h-4 bg-gray-400 rounded"></div>
                            <div class="w-12 h-4 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 下方：实际内容 -->
          <div class="debug-section">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              实际内容
            </h3>
            <div class="bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-600">
              <div class="flex justify-center">
                <div class="user-menu-container relative" @click.stop>
                  <template v-if="debugState === 'loggedIn'">
                    <button
                      @click.stop="toggleUserMenu"
                      class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
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
                      <i class="ri-arrow-down-s-line text-gray-400 hidden lg:block"></i>
                    </button>
                  </template>
                  <template v-else>
                    <div class="flex items-center space-x-2">
                      <div class="flex lg:hidden space-x-1">
                        <button
                          class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-600 transition-colors"
                          title="登录"
                        >
                          <i class="ri-user-line text-base"></i>
                        </button>
                        <button
                          class="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-green-700 hover:to-teal-600 transition-colors"
                          title="注册"
                        >
                          <i class="ri-user-add-line text-base"></i>
                        </button>
                      </div>
                      <div class="hidden lg:flex xl:hidden space-x-1">
                        <button
                          class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-xs font-medium"
                        >
                          <i class="ri-user-line text-sm"></i>
                          <span>登录</span>
                        </button>
                        <button
                          class="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-xs font-medium"
                        >
                          <i class="ri-user-add-line text-sm"></i>
                          <span>注册</span>
                        </button>
                      </div>
                      <div class="hidden xl:flex space-x-2">
                        <button
                          class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:from-blue-700 hover:to-purple-600 transition-all duration-200 text-sm font-medium"
                        >
                          <i class="ri-user-line"></i>
                          <span>登录</span>
                        </button>
                        <button
                          class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
                        >
                          <i class="ri-user-add-line"></i>
                          <span>注册</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 调试信息 -->
      <div class="bg-gray-800 rounded-lg p-6 mt-8">
        <h2 class="text-xl font-semibold text-white mb-4">调试信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 class="text-white font-medium mb-2">当前状态</h3>
            <div class="space-y-1 text-gray-300">
              <div>调试状态: <span class="text-blue-400">{{ debugState }}</span></div>
              <div>显示模式: <span class="text-blue-400">{{ showMode }}</span></div>
              <div>屏幕尺寸: <span class="text-blue-400">{{ screenSize }}</span></div>
            </div>
          </div>
          <div>
            <h3 class="text-white font-medium mb-2">用户信息</h3>
            <div class="space-y-1 text-gray-300">
              <div>用户名: <span class="text-blue-400">{{ userInfo.name || '未设置' }}</span></div>
              <div>头像: <span class="text-blue-400">{{ userInfo.avatar ? '已设置' : '未设置' }}</span></div>
              <div>余额: <span class="text-blue-400">{{ userInfo.userBalance || '0' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { defaultSetting, UserInfo } from '@/store/modules/user/helper'

// 调试状态
const debugState = ref('initializing')
const showMode = ref('stack') // 'stack' | 'side'
const screenSize = ref('desktop')

// 用户信息
const userInfo = ref<UserInfo>({
  ...defaultSetting().userInfo,
  name: '测试用户',
  avatar: '',
  userBalance: '100.00'
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
</script>

<style scoped>
.debug-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.debug-section {
  position: relative;
}

/* 防止过渡期间的布局跳动 */
.user-menu-container {
  min-height: 44px;
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
