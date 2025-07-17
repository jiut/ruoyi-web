<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full bg-white">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h1 class="text-4xl text-slate-800">
        正在开发中
      </h1>
      <p class="text-base text-slate-500">
        该功能正在紧锣密鼓地开发中，敬请期待！我们将尽快为您提供更好的服务体验。
      </p>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <img src="../../../icons/404.svg" alt="404">
        </div>
      </div>
      <NButton type="primary" @click="goHome">
        返回首页
      </NButton>
    </div>
  </div>
</template>
