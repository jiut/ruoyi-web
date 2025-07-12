<script setup lang="ts">
defineProps<{
  state: string
}>()
</script>

<template>
  <div class="user-menu-container relative" @click.stop>
    <!-- 初始化中，显示与最终状态相同尺寸的占位符 -->
    <template v-if="state === 'initializing'">
      <!-- 如果有token，显示用户头像占位符 -->
      <template v-if="state === 'loggedIn'">
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
  </div>
</template>

<style scoped>
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
