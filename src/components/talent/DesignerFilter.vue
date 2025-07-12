<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NSelect,
  NSlider,
  NSwitch,
  NTag,
} from 'naive-ui'
import type {
  DesignerQueryParams,
  Profession,
  SkillTag,
  WorkStatus,
} from '@/types/talent/designer'
import {
  ProfessionUtils,
  SkillTagLabels,
  WorkStatusLabels,
} from '@/types/talent/designer'

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  filter: [params: DesignerQueryParams]
  reset: []
}>()

// 筛选状态
const selectedProfessions = ref<Profession[]>([])
const selectedSkillTags = ref<SkillTag[]>([])
const selectedRegion = ref<string>()
const selectedWorkStatus = ref<WorkStatus>()
const experienceRange = ref(5)
const advancedFilter = ref(false)

// 职业选项
const availableProfessions = computed(() =>
  ProfessionUtils.getSelectOptions().map(option => ({
    value: option.value as Profession,
    label: option.label,
  })),
)

// 技能标签选项（展示常用的技能标签）
const availableSkillTags = computed(() => {
  const commonSkills: SkillTag[] = [
    'FIGMA' as SkillTag,
    'SKETCH' as SkillTag,
    'ADOBE_XD' as SkillTag,
    'PHOTOSHOP' as SkillTag,
    'ILLUSTRATOR' as SkillTag,
    'AFTER_EFFECTS' as SkillTag,
    'BLENDER' as SkillTag,
    'CINEMA_4D' as SkillTag,
  ]

  return commonSkills.map(skill => ({
    value: skill,
    label: SkillTagLabels[skill] || skill,
  }))
})

// 地区选项
const regionOptions = ref([
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '武汉', value: '武汉' },
  { label: '南京', value: '南京' },
])

// 工作状态选项
const workStatusOptions = computed(() => [
  { label: '全部', value: undefined },
  ...Object.entries(WorkStatusLabels).map(([value, label]) => ({
    value: value as WorkStatus,
    label,
  })),
])

// 切换技能标签选择
const toggleSkillTag = (skill: SkillTag) => {
  const index = selectedSkillTags.value.indexOf(skill)
  if (index > -1)
    selectedSkillTags.value.splice(index, 1)
  else
    selectedSkillTags.value.push(skill)
}

// 获取筛选参数
const getFilterParams = (): DesignerQueryParams => {
  const params: DesignerQueryParams = {
    pageNum: 1,
    pageSize: 20,
  }

  if (selectedProfessions.value.length > 0)
    params.profession = selectedProfessions.value[0] // 简化处理，只取第一个

  if (selectedSkillTags.value.length > 0)
    params.skillTags = selectedSkillTags.value.join(',')

  if (selectedRegion.value)
    params.location = selectedRegion.value

  if (selectedWorkStatus.value)
    params.workStatus = selectedWorkStatus.value

  if (advancedFilter.value) {
    params.minExperience = 0
    params.maxExperience = experienceRange.value
  }

  return params
}

// 应用筛选
const applyFilters = () => {
  const params = getFilterParams()
  emit('filter', params)
}

// 重置筛选
const resetFilters = () => {
  selectedProfessions.value = []
  selectedSkillTags.value = []
  selectedRegion.value = undefined
  selectedWorkStatus.value = undefined
  experienceRange.value = 5
  advancedFilter.value = false
  emit('reset')
}

// 监听筛选条件变化，自动应用（可选）
// watch(
//   [selectedProfessions, selectedSkillTags, selectedRegion, selectedWorkStatus, experienceRange],
//   () => {
//     applyFilters()
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="glass-card rounded-lg p-6 sticky top-8">
    <h2 class="text-xl font-bold mb-6">
      筛选条件
    </h2>

    <!-- 职业方向 -->
    <div class="mb-6">
      <label class="block text-sm text-gray-400 mb-2">职业方向</label>
      <NCheckboxGroup v-model:value="selectedProfessions">
        <div class="space-y-2">
          <NCheckbox
            v-for="profession in availableProfessions"
            :key="profession.value"
            :value="profession.value"
            class="w-full"
          >
            <span class="text-sm">{{ profession.label }}</span>
          </NCheckbox>
        </div>
      </NCheckboxGroup>
    </div>

    <!-- 技能标签 -->
    <div class="mb-6">
      <label class="block text-sm text-gray-400 mb-2">技能标签</label>
      <div class="flex flex-wrap gap-2">
        <NTag
          v-for="skill in availableSkillTags"
          :key="skill.value"
          :checked="selectedSkillTags.includes(skill.value)"
          checkable
          class="cursor-pointer"
          @update:checked="toggleSkillTag(skill.value)"
        >
          {{ skill.label }}
        </NTag>
      </div>
    </div>

    <!-- 工作年限 -->
    <div class="mb-6">
      <label class="block text-sm text-gray-400 mb-2">工作年限</label>
      <div class="px-1">
        <NSlider
          v-model:value="experienceRange"
          :min="0"
          :max="20"
          :step="1"
          :tooltip="false"
          class="mb-2"
        />
        <div class="flex justify-between text-xs text-gray-400">
          <span>0年</span>
          <span>{{ experienceRange }}年</span>
          <span>20年+</span>
        </div>
      </div>
    </div>

    <!-- 所在地区 -->
    <div class="mb-6">
      <label class="block text-sm text-gray-400 mb-2">所在地区</label>
      <NSelect
        v-model:value="selectedRegion"
        :options="regionOptions"
        placeholder="选择地区"
        clearable
        class="w-full"
      />
    </div>

    <!-- 当前状态 -->
    <div class="mb-6">
      <label class="block text-sm text-gray-400 mb-2">当前状态</label>
      <NRadioGroup v-model:value="selectedWorkStatus">
        <div class="space-y-2">
          <NRadio
            v-for="status in workStatusOptions"
            :key="status.value"
            :value="status.value"
            class="w-full"
          >
            <span class="text-sm">{{ status.label }}</span>
          </NRadio>
        </div>
      </NRadioGroup>
    </div>

    <!-- 高级筛选开关 -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <label class="text-sm text-gray-400">高级筛选</label>
        <NSwitch v-model:value="advancedFilter" />
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="flex space-x-3">
      <NButton
        type="primary"
        class="flex-1"
        :loading="loading"
        @click="applyFilters"
      >
        应用筛选
      </NButton>
      <NButton
        class="flex-1"
        @click="resetFilters"
      >
        重置
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

:deep(.n-checkbox) {
  --n-label-padding: 0 0 0 8px;
}

:deep(.n-radio) {
  --n-label-padding: 0 0 0 8px;
}

:deep(.n-tag) {
  transition: all 0.3s ease;
}

:deep(.n-tag--checkable) {
  cursor: pointer;
}

:deep(.n-tag--checked) {
  background-color: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  color: rgb(99, 102, 241);
}
</style>
