<template>
  <div v-if="showPrompt" class="role-selection-prompt fixed top-4 right-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 p-4 max-w-sm">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
            选择您的身份
          </h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
            为了更好地为您提供服务，请选择您在设计师生态平台中的主要身份
          </p>
          <div class="flex space-x-2">
            <n-button
              size="small"
              type="primary"
              @click="goToRoleSelection"
              class="text-xs"
            >
              立即选择
            </n-button>
            <n-button
              size="small"
              @click="dismissPrompt"
              class="text-xs"
            >
              稍后再说
            </n-button>
          </div>
        </div>
        <div class="flex-shrink-0">
          <button
            @click="dismissPrompt"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { needsRoleSelection } from '@/utils/authUtils'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const dismissed = ref(false)

// 计算是否显示提示
const showPrompt = computed(() => {
  return needsRoleSelection() && !dismissed.value
})

// 跳转到角色选择页面
const goToRoleSelection = () => {
  router.push('/role-selection')
}

// 关闭提示
const dismissPrompt = () => {
  dismissed.value = true
  // 可以在这里设置本地存储，记住用户的选择
  localStorage.setItem('role-selection-dismissed', 'true')
}

// 检查是否已经关闭过提示
onMounted(() => {
  const dismissedBefore = localStorage.getItem('role-selection-dismissed')
  if (dismissedBefore === 'true') {
    dismissed.value = true
  }
})
</script>

<style scoped>
.role-selection-prompt {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
