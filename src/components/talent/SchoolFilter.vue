<template>
  <div class="filter-card rounded-lg p-6 bg-white/10 backdrop-blur-md">
    <!-- 院校类型筛选 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3 text-white">院校类型</h3>
      <div class="grid grid-cols-1 gap-2">
        <n-checkbox-group v-model:value="selectedTypes">
          <n-space vertical>
            <n-checkbox
              v-for="type in schoolTypes"
              :key="type.value"
              :value="type.value"
              :label="type.label"
            />
          </n-space>
        </n-checkbox-group>
      </div>
    </div>

    <!-- 地区筛选 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3 text-white">所在地区</h3>
      <n-cascader
        v-model:value="selectedRegion"
        :options="regionOptions"
        placeholder="请选择省市"
        clearable
        class="w-full"
      />
    </div>

    <!-- 特殊标识筛选 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3 text-white">特殊标识</h3>
      <n-space vertical>
        <n-checkbox v-model:checked="filters.is985">985院校</n-checkbox>
        <n-checkbox v-model:checked="filters.is211">211院校</n-checkbox>
        <n-checkbox v-model:checked="filters.isDoubleFirst">双一流</n-checkbox>
      </n-space>
    </div>

    <!-- 办学层次筛选 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3 text-white">办学层次</h3>
      <n-checkbox-group v-model:value="selectedLevels">
        <n-space vertical>
          <n-checkbox
            v-for="level in schoolLevels"
            :key="level.value"
            :value="level.value"
            :label="level.label"
          />
        </n-space>
      </n-checkbox-group>
    </div>

    <!-- 学校规模筛选 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3 text-white">学校规模</h3>
      <n-radio-group v-model:value="selectedScale" name="scale">
        <n-space vertical>
          <n-radio
            v-for="scale in schoolScales"
            :key="scale.value"
            :value="scale.value"
            :label="scale.label"
          />
        </n-space>
      </n-radio-group>
    </div>

    <!-- 筛选按钮 -->
    <div class="flex gap-3">
      <n-button @click="resetFilters" secondary class="flex-1">
        <template #icon>
          <i class="ri-refresh-line"></i>
        </template>
        重置
      </n-button>
              <n-button @click="handleApplyFilters" type="primary" class="flex-1">
        <template #icon>
          <i class="ri-search-line"></i>
        </template>
        应用筛选
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSchoolFilters, useSchoolList } from '@/composables/talent/useSchool'

const { applyFilters, resetFilters: reset } = useSchoolFilters()

// 筛选状态
const selectedTypes = ref<string[]>([])
const selectedRegion = ref<string>('')
const selectedLevels = ref<string[]>([])
const selectedScale = ref<string>('')
const filters = ref({
  is985: false,
  is211: false,
  isDoubleFirst: false
})

// 院校类型选项
const schoolTypes = [
  { value: 'COMPREHENSIVE', label: '综合类' },
  { value: 'SCIENCE_ENGINEERING', label: '理工类' },
  { value: 'ART_DESIGN', label: '艺术设计类' },
  { value: 'NORMAL', label: '师范类' },
  { value: 'MEDICAL', label: '医药类' },
  { value: 'FINANCE', label: '财经类' },
  { value: 'LANGUAGE', label: '语言类' },
  { value: 'SPORTS', label: '体育类' }
]

// 办学层次选项
const schoolLevels = [
  { value: 'UNDERGRADUATE', label: '本科' },
  { value: 'POSTGRADUATE', label: '研究生' },
  { value: 'DOCTORAL', label: '博士' },
  { value: 'VOCATIONAL', label: '专科' }
]

// 学校规模选项
const schoolScales = [
  { value: '', label: '不限' },
  { value: 'SMALL', label: '小型（<5000人）' },
  { value: 'MEDIUM', label: '中型（5000-15000人）' },
  { value: 'LARGE', label: '大型（15000-30000人）' },
  { value: 'EXTRA_LARGE', label: '超大型（>30000人）' }
]

// 地区选项（简化版，实际可以更完整）
const regionOptions = [
  {
    label: '北京市',
    value: 'beijing',
    children: [{ label: '北京市', value: 'beijing-city' }]
  },
  {
    label: '上海市',
    value: 'shanghai',
    children: [{ label: '上海市', value: 'shanghai-city' }]
  },
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      { label: '广州市', value: 'guangzhou' },
      { label: '深圳市', value: 'shenzhen' },
      { label: '珠海市', value: 'zhuhai' }
    ]
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      { label: '南京市', value: 'nanjing' },
      { label: '苏州市', value: 'suzhou' },
      { label: '无锡市', value: 'wuxi' }
    ]
  },
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      { label: '杭州市', value: 'hangzhou' },
      { label: '宁波市', value: 'ningbo' },
      { label: '温州市', value: 'wenzhou' }
    ]
  }
]

const handleApplyFilters = () => {
  const filterData = {
    schoolTypes: selectedTypes.value,
    region: selectedRegion.value,
    levels: selectedLevels.value,
    scale: selectedScale.value,
    ...filters.value
  }

  applyFilters()
}

const resetFilters = () => {
  selectedTypes.value = []
  selectedRegion.value = ''
  selectedLevels.value = []
  selectedScale.value = ''
  filters.value = {
    is985: false,
    is211: false,
    isDoubleFirst: false
  }
  reset()
}

// 监听筛选条件变化，自动应用筛选
watch([selectedTypes, selectedRegion, selectedLevels, selectedScale, filters], () => {
  // 可以选择是否自动应用筛选，或者只在点击按钮时应用
  // applyFilters()
}, { deep: true })
</script>

<style scoped>
.filter-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.filter-card :deep(.n-checkbox .n-checkbox__label) {
  color: rgba(255, 255, 255, 0.9);
}

.filter-card :deep(.n-radio .n-radio__label) {
  color: rgba(255, 255, 255, 0.9);
}

.filter-card :deep(.n-cascader) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
