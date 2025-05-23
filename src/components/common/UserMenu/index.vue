<script setup lang="ts">
import { h } from 'vue'
import { NMenu, NIcon } from 'naive-ui'
import {
  Settings as settings,
  Storefront as storefront,
  LogOut as out
} from '@vicons/ionicons5'

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '账号设置',
    key: 'accountSettings',
    icon: renderIcon(settings)
  },
  {
    label: '购买套餐',
    key: 'buy',
    icon: renderIcon(storefront)
  },
  {
    label: '退出账号',
    key: 'logout',
    icon: renderIcon(out)
  }
]

const emit = defineEmits(['select'])

function handleSelect(key: string) {
  emit('select', key)
}
</script>

<template>
  <NMenu :options="menuOptions" @select="handleSelect" />
</template>
