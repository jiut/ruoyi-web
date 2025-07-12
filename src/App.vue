<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { RouterView } from 'vue-router'
import { NaiveProvider, RoleSelectionPrompt } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
      <RoleSelectionPrompt />
    </NaiveProvider>
  </NConfigProvider>
</template>
