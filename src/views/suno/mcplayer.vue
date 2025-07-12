<script setup lang="ts">
import { ref, watch } from 'vue'
import { NEmpty, NImage } from 'naive-ui'
import type { SunoMedia } from '@/api/sunoStore'
import { homeStore } from '@/store'
import { SvgIcon } from '@/components/common'

const pObj = ref<SunoMedia>()
watch(() => homeStore.myData.act, (n) => {
  if (n == 'goPlay') {
    const data = homeStore.myData.actData
    pObj.value = data as SunoMedia
  }
})
</script>

<template>
  <div v-if="pObj">
    <div class="w-full  relative h-[300px]">
      <NImage :src="pObj.image_large_url" class="w-full h-full">
        <template #placeholder>
          <div class="w-full h-full justify-center items-center flex">
            <SvgIcon icon="line-md:downloading-loop" class="text-[60px] text-green-300" />
          </div>
        </template>
      </NImage>
      <div class="absolute bottom-0 right-0 p-2 text-white text-right">
        <h2 class=" text-xl">
          {{ pObj.title }}
        </h2>
        <div class="">
          {{ $t('suno.style') }}：{{ pObj.metadata.tags }}
        </div>
      </div>
    </div>

    <pre class=" text-wrap p-2">{{ pObj.metadata.prompt }}</pre>
  </div>
  <div v-else class=" flex w-full h-full justify-center items-center">
    <NEmpty :description="$t('suno.emputy')" />
  </div>
</template>
