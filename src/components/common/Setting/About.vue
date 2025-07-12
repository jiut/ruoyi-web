<script setup lang='ts'>
import { NCard, NImage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import to from 'await-to-js'
import { getConfigKey } from '@/api/user'

// 响应式引用
const logo = ref('')

// 在组件挂载后执行异步操作
onMounted(async () => {
  try {
    const [err, res] = await to(getConfigKey('customImage'))
    if (err)
      console.error('获取客服信息失败', err.message)
    else
      logo.value = res.msg
  }
  catch (error) {
    console.error('获取配置失败', error)
  }
})
</script>

<template>
  <NCard embedded:bordered="false">
    <div style="text-align:center">
      <span>{{ $t('mjchat.customer') }} </span>
      <br>
      <NImage style="margin: 20px;" width="150" :src="logo" />
      <br>
    </div>

    <template #action>
      <!-- <div class="p-2 space-y-2 rounded-md">
        <p>
          项目开源于
          <a
            class="text-blue-600 dark:text-blue-500"
            href="https://github.com/ageerle/ruoyi-ai"
            target="_blank"
          >
          Github
          </a>
          ,如果你觉得此项目对你有帮助,请在Github帮我点个Star,谢谢！
        </p>
      </div> -->
    </template>
  </NCard>
</template>
