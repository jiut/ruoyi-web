<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NButton, NInput, NTag, useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { FeedLumaTask, lumaFetch, mlog, upImg } from '@/api'
import { homeStore } from '@/store'
import { t } from '@/locales'

const luma = ref({ aspect_ratio: '16:9', expand_prompt: true, image_url: '', user_prompt: '' })
const st = ref({ isDo: false })
const ms = useMessage()
const fsRef = ref()
onMounted(() => {
  homeStore.setMyData({ ms })
})

const canPost = computed(() => {
  return luma.value.user_prompt != '' && !st.value.isDo
})
const generate = async () => {
  mlog('generate', luma.value)
  st.value.isDo = true
  if (!canPost.value) {
    ms.error(t('video.plsInput'))
    return
  }
  try {
    const d: any = await lumaFetch('/generations/', luma.value)
    mlog('d', d)
    if (d.id)
      FeedLumaTask(d.id)
    else FeedLumaTask(d[0].id)
    ms.success(t('video.submitSuccess'))
  }
  catch (e) {

  }
  st.value.isDo = false
  // FeedLumaTask('33ace512-9a46-40ab-9d08-a05eff989831')
}

function selectFile(input: any) {
  upImg(input.target.files[0]).then((d) => {
    luma.value.image_url = d
    fsRef.value = ''
  }).catch(e => ms.error(e))
}

const clearInput = () => {
  luma.value.user_prompt = ''
  luma.value.image_url = ''
}
</script>

<template>
  <div class="p-2">
    <div>
      <NInput
        v-model:value="luma.user_prompt"
        :placeholder="$t('video.descpls')" type="textarea" size="small"
        :autosize="{ minRows: 3, maxRows: 12 }"
      />
    </div>

    <div class="pt-1">
      <div class="flex justify-between  items-end">
        <div>
          <input ref="fsRef" type="file" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif" @change="selectFile">
          <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer upload-video" @click=" fsRef.click()">
            <img v-if="luma.image_url" :src="luma.image_url">
            <div v-else class="text-center">
              {{ $t('video.selectimg') }}
            </div>
          </div>
        </div>
        <div class="pb-1 text-right">
          <!-- v-if="luma.user_prompt!=''||luma.image_url!=''" -->
          <NTag type="info" size="small" round>
            <span class="cursor-pointer" @click="clearInput()">{{ $t('video.clear') }}</span>
          </NTag>
        </div>
      </div>
      <div>
        <div>
          <NButton :loading="st.isDo" style="border-radius: 10px" class="genner-button" :bordered="false" type="success" :disabled="!canPost" @click="generate()">
            <SvgIcon icon="ri:video-add-line" /> {{ $t('video.generate') }}
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>
