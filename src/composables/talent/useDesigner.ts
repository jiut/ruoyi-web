import { computed, reactive, ref } from 'vue'
import { useDesignerStore } from '@/stores/talent/designer'
import type { DesignerQueryParams, Profession, WorkStatus } from '@/types/talent/designer'
// 添加mock数据导入，用于支持环境变量切换
import { mockDesigners, mockWorks } from '@/data/mockDesigners'
import ProfessionUtils from '@/utils/professionUtils'
import SkillTagUtils from '@/utils/skillTagUtils'
import { shouldUseMockData } from '@/utils/authUtils'
import { useUserStore } from '@/store/modules/user'
import { isStatusActive } from '@/utils/statusUtils'

console.log('🔍 设计师Composable调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  是否使用Mock数据:', shouldUseMockData())
console.log('  用户信息:', useUserStore().userInfo)

export function useDesigner() {
  const store = useDesignerStore()

  // 筛选参数
  const queryParams = reactive<DesignerQueryParams>({
    pageNum: 1,
    pageSize: 20,
  })

  // 搜索关键词
  const searchKeyword = ref('')

  // Mock数据状态
  const mockDesignerList = ref(mockDesigners.filter(d => isStatusActive(d.status || '0')))
  const mockLoading = ref(false)
  const mockTotal = computed(() => mockDesignerList.value.length)

  // 获取设计师列表
  const fetchDesigners = async (reset = false) => {
    if (shouldUseMockData()) {
      mockLoading.value = true
      try {
        console.log('🔧 使用模拟数据 - 设计师列表')

        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        // 应用筛选逻辑
        let filtered = [...mockDesigners]

        // 首先过滤掉停用状态的设计师
        filtered = filtered.filter(d => isStatusActive(d.status || '0'))

        // 按职业筛选
        if (queryParams.profession)
          filtered = filtered.filter(d => d.profession === queryParams.profession)

        // 按地区筛选
        if (queryParams.location)
          filtered = filtered.filter(d => d.location?.includes(queryParams.location || ''))

        // 按工作状态筛选
        if (queryParams.workStatus)
          filtered = filtered.filter(d => d.workStatus === queryParams.workStatus)

        // 按工作年限筛选
        if (queryParams.minExperience !== undefined)
          filtered = filtered.filter(d => (d.workYears || d.experience || 0) >= queryParams.minExperience!)

        if (queryParams.maxExperience !== undefined)
          filtered = filtered.filter(d => (d.workYears || d.experience || 0) <= queryParams.maxExperience!)

        // 按姓名搜索
        if (queryParams.designerName)
          filtered = filtered.filter(d => d.designerName.includes(queryParams.designerName!))

        mockDesignerList.value = filtered
      }
      catch (error) {
        console.error('获取设计师列表失败:', error)
      }
      finally {
        mockLoading.value = false
      }
    }
    else {
      console.log('🚀 使用后端API - 设计师列表')
      await store.fetchDesigners(queryParams, reset)
    }
  }

  // 搜索设计师
  const searchDesigners = async () => {
    if (shouldUseMockData()) {
      if (searchKeyword.value.trim())
        queryParams.designerName = searchKeyword.value.trim()
      else
        delete queryParams.designerName

      await fetchDesigners(true)
    }
    else {
      if (searchKeyword.value.trim())
        await store.searchDesigner(searchKeyword.value.trim())
      else
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
      maxExperience: undefined,
    })
    searchKeyword.value = ''

    if (shouldUseMockData()) {
      mockDesignerList.value = mockDesigners.filter(d => isStatusActive(d.status || '0'))
    }
    else {
      store.resetDesigners()
      await fetchDesigners(true)
    }
  }

  // 应用筛选
  const applyFilters = async () => {
    if (shouldUseMockData()) {
      await fetchDesigners(true)
    }
    else {
      store.resetDesigners()
      await fetchDesigners(true)
    }
  }

  // 加载更多
  const loadMoreDesigners = async () => {
    if (shouldUseMockData()) {
      // Mock数据一次性加载完毕，无需分页

    }
    else {
      await store.loadMore(queryParams)
    }
  }

  // 从mock数据动态获取筛选选项
  const getProfessions = () => {
    const activeDesigners = mockDesigners.filter(d => isStatusActive(d.status || '0'))
    const uniqueProfessions = [...new Set(activeDesigners.map(d => d.profession))]
    return uniqueProfessions.map(profession => ({
      value: profession,
      label: ProfessionUtils.getDisplayName(profession),
    }))
  }

  const getSkillTags = () => {
    const allSkills = new Set<string>()
    const activeDesigners = mockDesigners.filter(d => isStatusActive(d.status || '0'))
    activeDesigners.forEach((designer) => {
      try {
        const skills = SkillTagUtils.parseSkillTags(designer.skillTags)
        skills.forEach(skill => allSkills.add(skill))
      }
      catch (error) {
        console.error('解析技能标签失败:', error)
      }
    })
    return SkillTagUtils.sortTagsByCategory(Array.from(allSkills), 'asc')
  }

  const getRegions = () => {
    const activeDesigners = mockDesigners.filter(d => isStatusActive(d.status || '0'))
    const uniqueCities = [...new Set(activeDesigners
      .map(d => d.location)
      .filter((location): location is string => !!location)
      .map(location => `${location.split('市')[0]}市`),
    )]
    return uniqueCities.sort()
  }

  const getWorkStatuses = () => {
    return [
      { value: '', label: '全部' },
      { value: 'EMPLOYED', label: '在职' },
      { value: 'FREELANCER', label: '自由职业' },
      { value: 'SEEKING', label: '求职中' },
      { value: 'STUDENT', label: '学生' },
    ]
  }

  // 从API数据动态获取筛选选项
  const getApiProfessions = () => {
    const activeDesigners = store.designers.filter(d => isStatusActive(d.status || '0'))
    const uniqueProfessions = [...new Set(activeDesigners.map(d => d.profession))]
    return uniqueProfessions.map(profession => ({
      value: profession,
      label: ProfessionUtils.getDisplayName(profession),
    }))
  }

  const getApiSkillTags = () => {
    const allSkills = new Set<string>()
    const activeDesigners = store.designers.filter(d => isStatusActive(d.status || '0'))
    activeDesigners.forEach((designer) => {
      try {
        const skills = SkillTagUtils.parseSkillTags(designer.skillTags)
        skills.forEach(skill => allSkills.add(skill))
      }
      catch (error) {
        console.error('解析技能标签失败:', error)
      }
    })
    return SkillTagUtils.sortTagsByCategory(Array.from(allSkills), 'asc')
  }

  const getApiRegions = () => {
    const activeDesigners = store.designers.filter(d => isStatusActive(d.status || '0'))
    const uniqueCities = [...new Set(activeDesigners
      .map(d => d.location)
      .filter((location): location is string => !!location)
      .map(location => `${location.split('市')[0]}市`),
    )]
    return uniqueCities.sort()
  }

  // 获取设计师作品数量
  const getDesignerWorksCount = (designerId: number) => {
    return mockWorks.filter(work => work.designerId === designerId).length
  }

  return {
    // 状态 - 根据登录状态返回不同数据源
    designers: computed(() => shouldUseMockData() ? mockDesignerList.value : store.designers),
    loading: computed(() => shouldUseMockData() ? mockLoading.value : store.loading),
    total: computed(() => shouldUseMockData() ? mockTotal.value : store.total),
    hasMore: computed(() => shouldUseMockData() ? false : store.hasMore),

    // 筛选选项 - 根据登录状态和数据源动态生成
    professions: computed(() => shouldUseMockData() ? getProfessions() : getApiProfessions()),
    skillTags: computed(() => shouldUseMockData() ? getSkillTags() : getApiSkillTags()),
    regions: computed(() => shouldUseMockData() ? getRegions() : getApiRegions()),
    workStatuses: computed(() => getWorkStatuses()),

    // 参数
    queryParams,
    searchKeyword,

    // 方法
    fetchDesigners,
    searchDesigners,
    resetSearch,
    applyFilters,
    loadMoreDesigners,
    getDesignerWorksCount,
    fetchFilterOptions: shouldUseMockData() ? () => Promise.resolve() : store.fetchFilterOptions,
  }
}

export function useDesignerDetail() {
  const store = useDesignerStore()

  // 获取设计师详情
  const fetchDesignerDetail = async (id: number) => {
    if (shouldUseMockData()) {
      console.log('🔧 使用模拟数据 - 设计师详情')
      // Mock模式下不需要获取详情，因为列表中已包含所有信息
    }
    else {
      console.log('🚀 使用后端API - 设计师详情')
      await store.fetchDesignerDetail(id)
    }
  }

  // 重置设计师详情
  const resetDesignerDetail = () => {
    if (!shouldUseMockData())
      store.resetCurrentDesigner()
  }

  return {
    // 状态
    currentDesigner: computed(() => store.currentDesigner),
    currentDesignerWorks: computed(() => store.currentDesignerWorks),
    currentDesignerWorkExperience: computed(() => store.currentDesignerWorkExperience),
    currentDesignerEducation: computed(() => store.currentDesignerEducation),
    currentDesignerAwards: computed(() => store.currentDesignerAwards),
    loading: computed(() => shouldUseMockData() ? false : store.loading),

    // 方法
    fetchDesignerDetail,
    resetDesignerDetail,
  }
}

// 设计师筛选器组合式函数
export function useDesignerFilter() {
  const selectedProfessions = ref<string[]>([])
  const selectedSkillTags = ref<string[]>([])
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

    if (selectedProfessions.value.length > 0)
      params.profession = selectedProfessions.value[0] as Profession // 简化处理，只取第一个

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
    getFilterParams,
  }
}

// 设计师排序组合式函数
export function useDesignerSort() {
  const sortOptions = [
    { label: '最近活跃', value: 'recent_active' },
    { label: '工作年限', value: 'experience' },
    { label: '作品数量', value: 'works_count' },
    { label: '注册时间', value: 'created_at' },
  ]

  const currentSort = ref('recent_active')

  const getSortParams = () => {
    return {
      orderBy: currentSort.value,
      orderDirection: 'desc',
    }
  }

  return {
    sortOptions,
    currentSort,
    getSortParams,
  }
}
