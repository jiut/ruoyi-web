<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NButton } from 'naive-ui'

const dismissed = ref(false)

// 计算是否显示提示
const showPrompt = computed(() => {
  return !dismissed.value
})

// 关闭提示
const dismissPrompt = () => {
  dismissed.value = true
  // 设置本地存储，记住用户已经看过测试版本提示
  localStorage.setItem('test-version-prompt-dismissed', 'true')
}

// 检查是否已经看过提示
onMounted(() => {
  const dismissedBefore = localStorage.getItem('test-version-prompt-dismissed')
  if (dismissedBefore === 'true') {
    dismissed.value = true
  }
})
</script>

<template>
  <div v-if="showPrompt" class="test-version-prompt fixed inset-0 z-50 flex items-center justify-center">
    <!-- 遮罩层 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="dismissPrompt"></div>

    <!-- 弹窗内容 -->
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-orange-200 dark:border-orange-700 p-6 max-w-md mx-4">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            测试版本提醒
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            欢迎访问我们的平台！目前您使用的是测试版本，网站仍在开发中。
            <br><br>
            在使用过程中如遇到任何问题或有改进建议，欢迎随时反馈给我们。
            <br><br>
            感谢您的理解与支持！
          </p>
          <div class="flex justify-end space-x-3">
            <NButton
              size="medium"
              type="primary"
              class="text-sm"
              @click="dismissPrompt"
            >
              我知道了
            </NButton>
          </div>
        </div>
        <div class="flex-shrink-0">
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="dismissPrompt"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-version-prompt {
  animation: fadeIn 0.3s ease-out;
}

.test-version-prompt > .relative {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
