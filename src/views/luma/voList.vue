<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NEmpty, NPopover } from 'naive-ui'
import type { LumaMedia } from '@/api/lumaStore'
import { lumaStore } from '@/api/lumaStore'
import { FeedLumaTask } from '@/api'
import { homeStore } from '@/store'
import { SvgIcon } from '@/components/common'

const st = ref({ pIndex: -1 })
const list = ref<LumaMedia[]>([])
const csuno = new lumaStore()
const initLoad = () => {
  const arr = csuno.getObjs()
  list.value = arr.reverse()
}
const nowTime = computed(() => {
  return new Date().getTime()
})
watch(() => homeStore.myData.act, (n) => {
  if (n == 'FeedLumaTask')
    initLoad()
})

initLoad()
</script>

<template>
  <div v-if="list.length > 0" class="p-4">
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex = index" @mouseout="st.pIndex = -1">
        <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
          <video v-if="item.video?.url || item.video?.download_url" :src="item.video?.download_url ? item.video?.download_url : item.video?.url" loop playsinline :controls="st.pIndex == index" class="w-full h-full object-cover" />
          <div v-else class=" text-center">
            <NButton v-if="!item.last_feed || ((new Date().getTime()) - item.last_feed) > 20 * 1000" size="small" type="primary" @click="FeedLumaTask(item.id)">
              {{ $t('video.repeat') }}
            </NButton>
            <div v-else class="pt-2">
              {{ $t('video.process') }}{{ new Date(item.last_feed).toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div>
            <NPopover trigger="hover">
              <template #trigger>
                <div class="line-clamp-1">
                  {{ item.prompt }}
                </div>
              </template>
              <div class=" max-w-[300px]">
                {{ item.prompt }}
              </div>
            </NPopover>
          </div>
          <div>
            <a v-if="item.video?.url || item.video?.download_url" :href="item.video?.download_url ? item.video?.download_url : item.video?.url" download target="_blank"><SvgIcon icon="mdi:download" class="cursor-pointer" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full flex justify-center items-center">
    <NEmpty :description="$t('video.nodata')" />
  </div>
</template>
