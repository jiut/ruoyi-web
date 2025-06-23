<template>
  <div class="filter-card glass-card rounded-lg p-6 sticky top-24">
    <div class="space-y-6">
      <!-- 职位类型筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">职位类型</h3>
        <div class="space-y-2">
          <n-checkbox-group v-model:value="selectedProfessions">
            <div class="space-y-2">
              <n-checkbox
                v-for="option in professionOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                class="text-gray-300"
              />
            </div>
          </n-checkbox-group>
        </div>
      </div>

      <!-- 薪资范围筛选 -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium text-white">薪资范围</h3>
          <span class="text-sm text-gray-400">
            {{ salaryRange.min }}K - {{ salaryRange.max }}K
          </span>
        </div>
        <div class="px-1 space-y-4">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">最低薪资: {{ salaryRange.min }}K</label>
            <n-slider
              v-model:value="salaryRange.min"
              :min="5"
              :max="80"
              :step="5"
              class="mb-2"
            />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">最高薪资: {{ salaryRange.max }}K</label>
            <n-slider
              v-model:value="salaryRange.max"
              :min="5"
              :max="80"
              :step="5"
            />
          </div>
        </div>
      </div>

      <!-- 工作地点筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">工作地点</h3>
        <div class="grid grid-cols-2 gap-2">
          <n-checkbox-group v-model:value="selectedLocations">
            <n-checkbox
              v-for="option in locationOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              class="text-gray-300 text-sm"
            />
          </n-checkbox-group>
        </div>
      </div>

      <!-- 工作经验筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">工作经验</h3>
        <div class="space-y-2">
          <n-radio-group v-model:value="selectedExperience">
            <div class="space-y-2">
              <n-radio
                v-for="option in experienceOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                class="text-gray-300"
              />
            </div>
          </n-radio-group>
        </div>
      </div>

      <!-- 工作类型筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">工作类型</h3>
        <div class="space-y-2">
          <n-checkbox-group v-model:value="selectedWorkTypes">
            <div class="space-y-2">
              <n-checkbox
                v-for="option in workTypeOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                class="text-gray-300"
              />
            </div>
          </n-checkbox-group>
        </div>
      </div>

      <!-- 企业规模筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">企业规模</h3>
        <div class="space-y-2">
          <n-checkbox-group v-model:value="selectedCompanyScales">
            <div class="space-y-2">
              <n-checkbox
                v-for="option in companyScaleOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                class="text-gray-300"
              />
            </div>
          </n-checkbox-group>
        </div>
      </div>

      <!-- 更多筛选 -->
      <div>
        <h3 class="text-lg font-medium mb-3 text-white">更多筛选</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-300">急聘岗位</span>
            <n-switch v-model:value="isUrgent" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-300">支持应届生</span>
            <n-switch v-model:value="supportFreshGraduate" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-300">周末双休</span>
            <n-switch v-model:value="weekendOff" />
          </div>
        </div>
      </div>

      <!-- 筛选按钮 -->
      <div class="flex space-x-3 pt-2">
        <n-button
          @click="handleResetFilters"
          class="flex-1"
          ghost
        >
          重置筛选
        </n-button>
        <n-button
          @click="handleApplyFilters"
          type="primary"
          class="flex-1"
        >
          应用筛选
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NSlider,
  NSwitch,
  NButton
} from 'naive-ui'
import { useJobFilter } from '@/composables/talent/useJob'

const {
  salaryRange,
  selectedProfessions,
  selectedLocations,
  selectedExperiences,
  selectedWorkTypes,
  selectedCompanyScales,
  isUrgent,
  supportFreshGraduate,
  weekendOff,
  professionOptions,
  locationOptions,
  experienceOptions,
  workTypeOptions,
  companyScaleOptions,
  applyFilters,
  resetFilters
} = useJobFilter()

// 单选的工作经验
const selectedExperience = ref('')

// 监听经验选择变化
watch(selectedExperience, (newValue) => {
  selectedExperiences.value = newValue ? [newValue] : []
})

// 确保薪资范围合理
watch(() => salaryRange.value.min, (newMin) => {
  if (newMin > salaryRange.value.max) {
    salaryRange.value.max = newMin
  }
})

watch(() => salaryRange.value.max, (newMax) => {
  if (newMax < salaryRange.value.min) {
    salaryRange.value.min = newMax
  }
})

const handleApplyFilters = () => {
  applyFilters()
}

const handleResetFilters = () => {
  selectedExperience.value = ''
  resetFilters()
}
</script>

<style scoped>
.filter-card {
  background: rgba(28, 28, 30, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

:deep(.n-checkbox .n-checkbox__label) {
  color: rgb(209 213 219);
}

:deep(.n-radio .n-radio__label) {
  color: rgb(209 213 219);
}

:deep(.n-slider .n-slider-handle) {
  border-color: rgba(10, 132, 255, 0.8);
  background-color: #0a84ff;
}

:deep(.n-slider .n-slider-rail) {
  background-color: rgba(148, 163, 184, 0.2);
}

:deep(.n-slider .n-slider-fill) {
  background-color: #0a84ff;
}

:deep(.n-switch.n-switch--active) {
  background-color: #0a84ff;
}
</style>
