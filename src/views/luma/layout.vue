<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Permission from '../chat/layout/Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { homeStore, useAppStore, useAuthStore, useChatStore } from '@/store'
import { aiFooter, aiSider } from '@/views/mj'
import aiMobileMenu from '@/views/mj/aiMobileMenu.vue'
import { SvgIcon } from '@/components/common'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

router.replace({ name: 'video', params: { uuid: chatStore.active } })
homeStore.setMyData({ local: 'video' })
const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['shadow-md', 'dark:border-neutral-800'] // 'border', 'rounded-md',
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { abc: !isMobile.value && !collapsed.value },
  ]
})

// 返回首页函数
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="dark:bg-[#24272e] transition-all p-0" :class="[isMobile ? 'h55' : 'h-full']">
    <!-- 手机端左上角返回首页按钮 -->
    <div
      v-if="isMobile"
      class="fixed top-4 left-4 z-50 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      @click="goHome"
    >
      <SvgIcon icon="ri:home-4-line" class="text-xl text-gray-700 dark:text-gray-300" />
    </div>

    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider :sider-placement="isMobile ? 'left' : 'right'">
        <aiSider v-if="!isMobile" />

        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
        <!-- <Sider /> -->
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
  </div>
  <aiMobileMenu v-if="isMobile" />
  <aiFooter />
</template>

<style>
.h55{
  height: calc(100% - 55px);
}
</style>
