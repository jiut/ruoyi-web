<script setup lang="ts">
import { h } from 'vue'
import { NIcon, NMenu } from 'naive-ui'
import {
  LogOut as out,
  Settings as settings,
  Storefront as storefront,
} from '@vicons/ionicons5'

const emit = defineEmits(['select'])

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '账号设置',
    key: 'accountSettings',
    icon: renderIcon(settings),
  },
  {
    label: '购买套餐',
    key: 'buy',
    icon: renderIcon(storefront),
  },
  {
    label: '退出账号',
    key: 'logout',
    icon: renderIcon(out),
  },
]

function handleSelect(key: string) {
  emit('select', key)
}
</script>

<template>
  <NMenu :options="menuOptions" @select="handleSelect" />
</template>
