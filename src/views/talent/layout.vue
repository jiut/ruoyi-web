<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// 页面级布局，在这里可以添加全局的人才模块逻辑

onMounted(() => {
  // 添加talent-mode类以覆盖全局高度限制
  document.documentElement.classList.add('talent-mode')
})

onUnmounted(() => {
  // 移除talent-mode类
  document.documentElement.classList.remove('talent-mode')
})
</script>

<template>
  <div class="talent-page">
    <RouterView />
  </div>
</template>

<style scoped>
@import '@/styles/talent.css';
</style>

<style>
/* 全局样式覆盖 - 解决高度限制问题 */
html.talent-mode,
html.talent-mode body,
html.talent-mode #app {
  height: auto !important;
  min-height: 100vh;
  overflow-y: auto !important;
}

/* 确保主内容区域可以正常滚动 */
html.talent-mode body {
  overflow-x: hidden;
  overflow-y: auto !important;
}
</style>
