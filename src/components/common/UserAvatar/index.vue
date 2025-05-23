<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { NAvatar,NButton,useMessage,NEllipsis, NDropdown, NIcon } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { removeToken } from '@/store/modules/auth/helper'
import { useRouter } from 'vue-router'
import { loginOut,getUserInfo} from '@/api/user'
import { UserData } from "@/typings/user"
import { defaultSetting,UserInfo } from '@/store/modules/user/helper'
import { getToken } from "@/store/modules/auth/helper";
import to from "await-to-js";
import { useAuthStore } from '@/store'
import { h } from 'vue'
import {
  Settings as settings,
  Storefront as storefront,
  LogOut as out
} from '@vicons/ionicons5'
import { defineAsyncComponent } from 'vue'

const router = useRouter()
const userInfo = ref<UserInfo>(defaultSetting().userInfo)
const message = useMessage()
const authStore = useAuthStore()

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const PromptStore = defineAsyncComponent(() => import('@/components/common/PromptStore/index.vue'))
const settingVisible = ref(false)
const promptStoreVisible = ref(false)

onMounted(() => { getLoginUserInfo() });

// 监听token变化，自动刷新用户信息
watch(
  () => authStore.token,
  (newToken, oldToken) => {
    if (newToken) {
      getLoginUserInfo()
    } else {
      userInfo.value = defaultSetting().userInfo
    }
  }
)

/**
 * 获取当前登录用户信息
 */

async function getLoginUserInfo() {
  if(!getToken()){
      return
  }

  const [err, newUserInfo] = await to(getUserInfo());
      if (err) {
        message.error(err.toString())
      }
  if(newUserInfo){
    userInfo.value.avatar = newUserInfo.data.user.avatar;
    userInfo.value.name = newUserInfo.data.user.nickName;
    userInfo.value.userBalance = newUserInfo.data.user.userBalance;
  }
}

/**
 * 退出登录
 */
 async function handleReset() {
    await loginOut()
    // 删除用户token
    removeToken();
    // 跳转到登录页面
    router.push('/login')
}

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

function handleMenuSelect(key: string) {
  if (key === 'logout') {
    handleReset()
  } else if (key === 'accountSettings') {
    settingVisible.value = true
  } else if (key === 'buy') {
    promptStoreVisible.value = true
  }
}
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <n-dropdown :options="menuOptions" trigger="click" @select="handleMenuSelect" placement="bottom-end">
      <div class="w-10 h-10 rounded-full shrink-0 cursor-pointer">
        <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
          <NAvatar size="large" round :src="userInfo.avatar" :fallback-src="defaultAvatar" />
        </template>
        <template v-else>
          <NAvatar size="large" round :src="defaultAvatar" />
        </template>
      </div>
    </n-dropdown>
    <div class="flex-1 min-w-0 ml-2">
      <n-ellipsis style="max-width: 80px">{{ userInfo.name ?? '熊猫助手' }}</n-ellipsis>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span style="font-size: 10rpx;">{{$t('mjset.balance')}}:{{ userInfo.userBalance }}</span>
      </p>
    </div>
    <Setting v-if="settingVisible" v-model:visible="settingVisible" />
    <PromptStore v-if="promptStoreVisible" v-model:visible="promptStoreVisible" title="购买套餐" />
  </div>
</template>
