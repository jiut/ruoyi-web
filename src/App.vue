<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { useRoute } from 'vue-router'
import AllianceHome from '@/views/home/AllianceHome.vue'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const route = useRoute()
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <AllianceHome v-if="route.path === '/'" />
      <RouterView v-else />
    </NaiveProvider>
  </NConfigProvider>
</template>
