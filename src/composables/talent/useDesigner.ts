import { ref, reactive, computed } from 'vue'
import { useDesignerStore } from '@/stores/talent/designer'
import type { DesignerQueryParams, Profession, SkillTag, WorkStatus } from '@/types/talent/designer'

export function useDesigner() {
  const store = useDesignerStore()

  // 筛选参数
  const queryParams = reactive<DesignerQueryParams>({
    pageNum: 1,
    pageSize: 20
  })

  // 搜索关键词
  const searchKeyword = ref('')

  // 获取设计师列表
  const fetchDesigners = async (reset = false) => {
    await store.fetchDesigners(queryParams, reset)
  }

  // 搜索设计师
  const searchDesigners = async () => {
    if (searchKeyword.value.trim()) {
      await store.searchDesigner(searchKeyword.value.trim())
    } else {
      await fetchDesigners(true)
    }
  }

  // 重置搜索和筛选
  const resetSearch = async () => {
    Object.assign(queryParams, {
      pageNum: 1,
      pageSize: 20,
      designerName: undefined,
      profession: undefined,
      skillTags: undefined,
      location: undefined,
      workStatus: undefined,
      minExperience: undefined,
      maxExperience: undefined
    })
    searchKeyword.value = ''
    store.resetDesigners()
    await fetchDesigners(true)
  }

  // 应用筛选
  const applyFilters = async () => {
    store.resetDesigners()
    await fetchDesigners(true)
  }

  // 加载更多
  const loadMoreDesigners = async () => {
    await store.loadMore(queryParams)
  }

  return {
    // 状态
    designers: computed(() => store.designers),
    loading: computed(() => store.loading),
    total: computed(() => store.total),
    hasMore: computed(() => store.hasMore),

    // 筛选选项
    professions: computed(() => store.professions),
    skillTags: computed(() => store.skillTags),
    regions: computed(() => store.regions),

    // 参数
    queryParams,
    searchKeyword,

    // 方法
    fetchDesigners,
    searchDesigners,
    resetSearch,
    applyFilters,
    loadMoreDesigners,
    fetchFilterOptions: store.fetchFilterOptions
  }
}

export function useDesignerDetail() {
  const store = useDesignerStore()

  // 获取设计师详情
  const fetchDesignerDetail = async (id: number) => {
    await store.fetchDesignerDetail(id)
  }

  // 重置设计师详情
  const resetDesignerDetail = () => {
    store.resetCurrentDesigner()
  }

  return {
    // 状态
    currentDesigner: computed(() => store.currentDesigner),
    currentDesignerWorks: computed(() => store.currentDesignerWorks),
    currentDesignerWorkExperience: computed(() => store.currentDesignerWorkExperience),
    currentDesignerEducation: computed(() => store.currentDesignerEducation),
    currentDesignerAwards: computed(() => store.currentDesignerAwards),
    loading: computed(() => store.loading),

    // 方法
    fetchDesignerDetail,
    resetDesignerDetail
  }
}

// 设计师筛选器组合式函数
export function useDesignerFilter() {
  const selectedProfessions = ref<Profession[]>([])
  const selectedSkillTags = ref<SkillTag[]>([])
  const selectedRegion = ref<string>('')
  const selectedWorkStatus = ref<WorkStatus | undefined>()
  const experienceRange = ref(5)
  const advancedFilter = ref(false)

  // 重置筛选器
  const resetFilters = () => {
    selectedProfessions.value = []
    selectedSkillTags.value = []
    selectedRegion.value = ''
    selectedWorkStatus.value = undefined
    experienceRange.value = 5
    advancedFilter.value = false
  }

  // 获取筛选参数
  const getFilterParams = (): DesignerQueryParams => {
    const params: DesignerQueryParams = {}

    if (selectedProfessions.value.length > 0) {
      params.profession = selectedProfessions.value[0] // 简化处理，只取第一个
    }

    if (selectedSkillTags.value.length > 0) {
      params.skillTags = selectedSkillTags.value.join(',')
    }

    if (selectedRegion.value) {
      params.location = selectedRegion.value
    }

    if (selectedWorkStatus.value) {
      params.workStatus = selectedWorkStatus.value
    }

    if (advancedFilter.value) {
      params.minExperience = 0
      params.maxExperience = experienceRange.value
    }

    return params
  }

  return {
    // 筛选状态
    selectedProfessions,
    selectedSkillTags,
    selectedRegion,
    selectedWorkStatus,
    experienceRange,
    advancedFilter,

    // 方法
    resetFilters,
    getFilterParams
  }
}

// 设计师排序组合式函数
export function useDesignerSort() {
  const sortOptions = [
    { label: '最近活跃', value: 'recent_active' },
    { label: '工作年限', value: 'experience' },
    { label: '作品数量', value: 'works_count' },
    { label: '注册时间', value: 'created_at' }
  ]

  const currentSort = ref('recent_active')

  const getSortParams = () => {
    return {
      orderBy: currentSort.value,
      orderDirection: 'desc'
    }
  }

  return {
    sortOptions,
    currentSort,
    getSortParams
  }
}
