/**
 * 院校相关组合式函数
 */

import { computed, reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSchoolStore } from '@/stores/talent/school'
import type {
  MajorCategory,
  School,
  SchoolLevel,
  SchoolQueryParams,
  SchoolSortBy,
  SchoolType,
} from '@/types/talent/school'
import {
  AwardLevelLabels,
  MajorCategoryLabels,
  SchoolLevelLabels,
  SchoolTypeLabels,
} from '@/types/talent/school'
import { achievementApi } from '@/api/talent/school'
import { getStatusClass, getStatusIcon, getStatusTagType, getStatusText } from '@/utils/statusUtils'
import { shouldUseMockData } from '@/utils/authUtils'
import { getMockSchoolById, getMockSchools } from '@/data/mockSchools'

console.log('🔍 院校Composable调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  是否使用Mock数据:', shouldUseMockData())

// 院校列表管理
export function useSchoolList(initialParams?: Partial<SchoolQueryParams>) {
  const schoolStore = useSchoolStore()
  const message = useMessage()

  const isInitialized = ref(false)
  const mockSchools = ref<School[]>([])
  const mockLoading = ref(false)
  const mockTotal = ref(0)

  // 初始化
  const initialize = async () => {
    if (!isInitialized.value) {
      if (shouldUseMockData()) {
        console.log('🔧 使用模拟数据 - 院校列表')
        mockLoading.value = true
        try {
          const result = getMockSchools(initialParams)
          mockSchools.value = result.rows
          mockTotal.value = result.total
        }
        catch (error) {
          console.error('获取院校列表失败:', error)
        }
        finally {
          mockLoading.value = false
        }
      }
      else {
        console.log('🚀 使用后端API - 院校列表')
        await schoolStore.fetchSchools(initialParams)
      }
      isInitialized.value = true
    }
    else {
      console.log('🔄 院校列表已初始化，跳过重复加载')
    }
  }

  // 刷新列表
  const refresh = () => {
    if (shouldUseMockData()) {
      const result = getMockSchools({ pageNum: 1 })
      mockSchools.value = result.rows
      mockTotal.value = result.total
      return Promise.resolve()
    }
    else {
      return schoolStore.fetchSchools({ pageNum: 1 })
    }
  }

  // 加载更多
  const loadMore = () => {
    if (!shouldUseMockData())
      schoolStore.loadMore()
  }

  // 重置筛选
  const resetFilters = () => {
    if (!shouldUseMockData())
      schoolStore.resetFilters()
  }

  return {
    // 状态 - 根据登录状态返回不同的数据源
    schools: computed(() => shouldUseMockData() ? mockSchools.value : schoolStore.schools),
    totalSchools: computed(() => shouldUseMockData() ? mockTotal.value : schoolStore.totalSchools),
    loading: computed(() => shouldUseMockData() ? mockLoading.value : schoolStore.loading),
    hasNextPage: computed(() => shouldUseMockData() ? false : schoolStore.hasNextPage),
    filters: computed(() => schoolStore.filters),

    // 方法
    initialize,
    refresh,
    loadMore,
    resetFilters,
    updateFilters: shouldUseMockData() ? () => Promise.resolve() : schoolStore.updateFilters,
  }
}

// 院校搜索
export function useSchoolSearch() {
  const schoolStore = useSchoolStore()
  const message = useMessage()
  const searchKeyword = ref('')
  const searchHistory = ref<string[]>([])

  // 搜索院校
  const search = async (keyword: string) => {
    if (!keyword.trim()) {
      schoolStore.fetchSchools({ pageNum: 1 })
      return
    }

    searchKeyword.value = keyword
    addToHistory(keyword)
    await schoolStore.searchSchools(keyword)
  }

  // 添加到搜索历史
  const addToHistory = (keyword: string) => {
    if (!keyword.trim())
      return

    const history = searchHistory.value.filter(item => item !== keyword)
    searchHistory.value = [keyword, ...history].slice(0, 10)
  }

  // 清空搜索历史
  const clearHistory = () => {
    searchHistory.value = []
  }

  // 清空搜索
  const clearSearch = () => {
    searchKeyword.value = ''
    schoolStore.clearSearch()
  }

  return {
    searchKeyword,
    searchHistory,
    search,
    addToHistory,
    clearHistory,
    clearSearch,
  }
}

// 院校筛选
export function useSchoolFilters() {
  const schoolStore = useSchoolStore()
  const message = useMessage()

  // 筛选状态
  const filters = reactive<SchoolQueryParams>({
    pageNum: 1,
    pageSize: 20,
    schoolName: '',
    schoolType: undefined,
    province: '',
    city: '',
    level: undefined,
    isKey: undefined,
    is985: undefined,
    is211: undefined,
    isDoubleFirst: undefined,
    sortBy: 'ranking',
    sortOrder: 'asc',
  })

  // 应用筛选
  const applyFilters = () => {
    schoolStore.updateFilters(filters)
  }

  // 重置筛选
  const resetFilters = () => {
    Object.assign(filters, {
      pageNum: 1,
      pageSize: 20,
      schoolName: '',
      schoolType: undefined,
      province: '',
      city: '',
      level: undefined,
      isKey: undefined,
      is985: undefined,
      is211: undefined,
      isDoubleFirst: undefined,
      sortBy: 'ranking',
      sortOrder: 'asc',
    })
    schoolStore.resetFilters()
  }

  // 切换筛选条件
  const toggleFilter = (key: keyof SchoolQueryParams, value: any) => {
    if (filters[key] === value)
      filters[key] = undefined
    else
      filters[key] = value

    applyFilters()
  }

  // 设置排序
  const setSorting = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    filters.sortBy = sortBy
    filters.sortOrder = sortOrder
    applyFilters()
  }

  // 是否有筛选条件
  const hasActiveFilters = computed(() => {
    return !!(
      filters.schoolName
      || filters.schoolType
      || filters.province
      || filters.city
      || filters.level
      || filters.isKey !== undefined
      || filters.is985 !== undefined
      || filters.is211 !== undefined
      || filters.isDoubleFirst !== undefined
    )
  })

  return {
    filters,
    applyFilters,
    resetFilters,
    toggleFilter,
    setSorting,
    hasActiveFilters,
  }
}

// 院校排序
export function useSchoolSorting() {
  const schoolStore = useSchoolStore()
  const message = useMessage()

  const queryParams = computed(() => schoolStore.queryParams)
  const loading = computed(() => schoolStore.loading)

  // 设置排序
  const setSorting = async (sortBy: SchoolSortBy, sortOrder: 'asc' | 'desc' = 'desc') => {
    try {
      await schoolStore.setSorting(sortBy, sortOrder)
    }
    catch (error) {
      message.error('设置排序失败')
      console.error('Set sorting error:', error)
    }
  }

  // 切换排序方向
  const toggleSortOrder = async () => {
    const currentOrder = queryParams.value.sortOrder
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
    const sortBy = queryParams.value.sortBy || 'COMPREHENSIVE'

    try {
      await schoolStore.setSorting(sortBy, newOrder)
    }
    catch (error) {
      message.error('切换排序失败')
      console.error('Toggle sort order error:', error)
    }
  }

  return {
    // 状态
    queryParams,
    loading,

    // 方法
    setSorting,
    toggleSortOrder,
  }
}

// 院校分页
export function useSchoolPagination() {
  const schoolStore = useSchoolStore()
  const message = useMessage()

  const currentPage = computed(() => schoolStore.currentPage)
  const pageSize = computed(() => schoolStore.pageSize)
  const total = computed(() => schoolStore.total)
  const loading = computed(() => schoolStore.loading)

  // 跳转到指定页面
  const goToPage = async (page: number) => {
    try {
      await schoolStore.setPage(page)
    }
    catch (error) {
      message.error('跳转页面失败')
      console.error('Go to page error:', error)
    }
  }

  // 改变页面大小
  const changePageSize = async (size: number) => {
    try {
      await schoolStore.setPage(1, size)
    }
    catch (error) {
      message.error('改变页面大小失败')
      console.error('Change page size error:', error)
    }
  }

  // 上一页
  const prevPage = async () => {
    if (currentPage.value > 1)
      await goToPage(currentPage.value - 1)
  }

  // 下一页
  const nextPage = async () => {
    const maxPage = Math.ceil(total.value / pageSize.value)
    if (currentPage.value < maxPage)
      await goToPage(currentPage.value + 1)
  }

  return {
    // 状态
    currentPage,
    pageSize,
    total,
    loading,

    // 方法
    goToPage,
    changePageSize,
    prevPage,
    nextPage,
  }
}

// 院校详情
export function useSchoolDetail(schoolId?: number) {
  const schoolStore = useSchoolStore()
  const message = useMessage()
  const currentTab = ref('overview') // overview, majors, faculty, employment, awards
  const mockSchool = ref<School | null>(null)
  const mockLoading = ref(false)

  // 加载院校详情
  const loadDetail = async (id: number) => {
    if (shouldUseMockData()) {
      console.log('🔧 使用模拟数据 - 院校详情')
      mockLoading.value = true
      try {
        const result = getMockSchoolById(id)
        mockSchool.value = result
      }
      catch (error) {
        console.error('获取院校详情失败:', error)
      }
      finally {
        mockLoading.value = false
      }
    }
    else {
      console.log('🚀 使用后端API - 院校详情')
      await schoolStore.fetchSchoolDetail(id)

      // 并行加载相关数据
      await Promise.all([
        schoolStore.fetchMajorsBySchool(id),
        schoolStore.fetchFacultiesBySchool(id),
        schoolStore.fetchEmploymentData(id),
        schoolStore.fetchAwards(id),
        schoolStore.fetchAwardStats(id),
      ])
    }
  }

  // 切换标签
  const switchTab = (tab: string) => {
    currentTab.value = tab
  }

  // 初始化
  if (schoolId)
    loadDetail(schoolId)

  return {
    // 状态 - 根据登录状态返回不同的数据源
    currentSchool: computed(() => shouldUseMockData() ? mockSchool.value : schoolStore.currentSchool),
    majors: computed(() => schoolStore.majors),
    faculties: computed(() => schoolStore.faculties),
    employmentData: computed(() => schoolStore.employmentData),
    awards: computed(() => schoolStore.awards),
    awardStats: computed(() => schoolStore.awardStats),
    loading: computed(() => shouldUseMockData() ? mockLoading.value : schoolStore.detailLoading),
    currentTab,

    // 方法
    loadDetail,
    switchTab,
    clearDetail: shouldUseMockData() ? () => {} : schoolStore.clearCurrentSchool,
  }
}

// 院校交互
export function useSchoolInteraction() {
  const schoolStore = useSchoolStore()
  const message = useMessage()

  // 切换收藏
  const toggleFavorite = async (schoolId: number) => {
    await schoolStore.toggleFavorite(schoolId)
    return schoolStore.isFavorited(schoolId)
  }

  // 检查收藏状态
  const checkFavoriteStatus = async (schoolId: number) => {
    return await schoolStore.checkFavoriteStatus(schoolId)
  }

  // 分享院校
  const shareSchool = async (schoolId: number, platform = 'copy') => {
    await schoolStore.shareSchool(schoolId, platform)
  }

  // 下载详情
  const downloadDetail = async (schoolId: number) => {
    await schoolStore.downloadSchoolDetail(schoolId)
  }

  return {
    // 状态
    favoriteSchools: computed(() => schoolStore.favoriteSchools),
    viewHistory: computed(() => schoolStore.viewHistory),

    // 方法
    toggleFavorite,
    checkFavoriteStatus,
    shareSchool,
    downloadDetail,
    isFavorited: schoolStore.isFavorited,
    isVisited: schoolStore.isVisited,
  }
}

// 数据格式化
export function useSchoolFormatter() {
  // 格式化院校类型
  const formatSchoolType = (type: SchoolType) => {
    return SchoolTypeLabels[type] || type
  }

  // 格式化院校层次
  const formatSchoolLevel = (level: SchoolLevel) => {
    return SchoolLevelLabels[level] || level
  }

  // 格式化专业分类
  const formatMajorCategory = (category: MajorCategory) => {
    return MajorCategoryLabels[category] || category
  }

  // 格式化奖项等级
  const formatAwardLevel = (level: string) => {
    return AwardLevelLabels[level as keyof typeof AwardLevelLabels] || level
  }

  // 格式化就业率
  const formatEmploymentRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`
  }

  // 格式化薪资
  const formatSalary = (salary: number) => {
    if (salary >= 10000)
      return `${(salary / 10000).toFixed(1)}万`

    return `${salary.toLocaleString()}元`
  }

  // 格式化排名
  const formatRanking = (ranking: number) => {
    if (ranking <= 0)
      return '未排名'
    return `第${ranking}名`
  }

  // 格式化学校标签
  const formatSchoolTags = (school: School) => {
    const tags: string[] = []

    if (school.is985)
      tags.push('985')
    if (school.is211)
      tags.push('211')
    if (school.isDoubleFirst)
      tags.push('双一流')
    if (school.isKey)
      tags.push('重点院校')

    return tags
  }

  // 状态相关格式化函数
  const formatSchoolStatus = (status: '0' | '1') => {
    return getStatusText(status)
  }

  const getSchoolStatusClass = (status: '0' | '1') => {
    return getStatusClass(status)
  }

  const getSchoolStatusTagType = (status: '0' | '1') => {
    return getStatusTagType(status)
  }

  const getSchoolStatusIcon = (status: '0' | '1') => {
    return getStatusIcon(status)
  }

  return {
    formatSchoolType,
    formatSchoolLevel,
    formatMajorCategory,
    formatAwardLevel,
    formatEmploymentRate,
    formatSalary,
    formatRanking,
    formatSchoolTags,
    formatSchoolStatus,
    getSchoolStatusClass,
    getSchoolStatusTagType,
    getSchoolStatusIcon,
  }
}

// 统计分析
export function useSchoolStats() {
  const schoolStore = useSchoolStore()

  // 加载统计数据
  const loadStatistics = async () => {
    await schoolStore.fetchStatistics()
  }

  // 计算筛选结果统计
  const getFilteredStats = computed(() => {
    const filteredSchools = schoolStore.filteredSchools

    if (!filteredSchools.length) {
      return {
        total: 0,
        avgRanking: 0,
        top100Count: 0,
        keySchoolCount: 0,
        employmentRateAvg: 0,
      }
    }

    const total = filteredSchools.length
    const avgRanking = filteredSchools.reduce((sum, school) => sum + school.ranking, 0) / total
    const top100Count = filteredSchools.filter(school => school.ranking <= 100).length
    const keySchoolCount = filteredSchools.filter(school => school.isKey).length

    return {
      total,
      avgRanking: Math.round(avgRanking),
      top100Count,
      keySchoolCount,
      employmentRateAvg: 0, // 需要根据实际数据计算
    }
  })

  // 按类型分组统计
  const getTypeDistribution = computed(() => {
    const schools = schoolStore.schools
    const distribution: Record<string, number> = {}

    schools.forEach((school) => {
      const type = school.schoolType
      distribution[type] = (distribution[type] || 0) + 1
    })

    return Object.entries(distribution).map(([type, count]) => ({
      type,
      typeName: SchoolTypeLabels[type as SchoolType] || type,
      count,
      percentage: schools.length > 0 ? (count / schools.length * 100).toFixed(1) : '0',
    }))
  })

  // 按地区分组统计
  const getRegionDistribution = computed(() => {
    const schools = schoolStore.schools
    const distribution: Record<string, number> = {}

    schools.forEach((school) => {
      const province = school.province
      distribution[province] = (distribution[province] || 0) + 1
    })

    return Object.entries(distribution)
      .map(([province, count]) => ({
        province,
        count,
        percentage: schools.length > 0 ? (count / schools.length * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.count - a.count)
  })

  return {
    // 状态
    statistics: computed(() => schoolStore.statistics),

    // 方法
    loadStatistics,

    // 计算属性
    getFilteredStats,
    getTypeDistribution,
    getRegionDistribution,
  }
}

// 院校对比
export function useSchoolComparison() {
  const compareList = ref<School[]>([])
  const maxCompareCount = 4

  // 添加到对比
  const addToCompare = (school: School) => {
    if (compareList.value.length >= maxCompareCount)
      throw new Error(`最多只能对比${maxCompareCount}所院校`)

    if (compareList.value.find(s => s.id === school.id))
      throw new Error('该院校已在对比列表中')

    compareList.value.push(school)
  }

  // 从对比中移除
  const removeFromCompare = (schoolId: number) => {
    compareList.value = compareList.value.filter(s => s.id !== schoolId)
  }

  // 清空对比列表
  const clearCompare = () => {
    compareList.value = []
  }

  // 是否在对比列表中
  const isInCompare = (schoolId: number) => {
    return compareList.value.some(s => s.id === schoolId)
  }

  // 是否可以添加更多
  const canAddMore = computed(() => {
    return compareList.value.length < maxCompareCount
  })

  return {
    compareList,
    maxCompareCount,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore,
  }
}

// 学生成果数据结构
interface AchievementStats {
  internationalAwards: number
  nationalAwards: number
  provincialAwards: number
  patents: number
  description: string
}

interface TrendData {
  years: string[]
  internationalData: number[]
  nationalData: number[]
  provincialData: number[]
}

interface AwardWork {
  id: number
  title: string
  award: string
  description: string
}

// 学生成果数据管理
export const useSchoolAchievements = (schoolId: number) => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const achievementStats = ref<AchievementStats>({
    internationalAwards: 0,
    nationalAwards: 0,
    provincialAwards: 0,
    patents: 0,
    description: '',
  })

  const trendData = ref<TrendData>({
    years: [],
    internationalData: [],
    nationalData: [],
    provincialData: [],
  })

  const awardWorks = ref<AwardWork[]>([])

  // 加载获奖统计数据
  const loadAchievementStats = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await achievementApi.getAwardStats(schoolId)
      if (response.data)
        achievementStats.value = response.data
    }
    catch (err) {
      error.value = '获取获奖统计数据失败'
      console.error('获取获奖统计数据失败:', err)
    }
    finally {
      loading.value = false
    }
  }

  // 加载趋势数据
  const loadTrendData = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await achievementApi.getTrendData(schoolId)
      if (response.data)
        trendData.value = response.data
    }
    catch (err) {
      error.value = '获取趋势数据失败'
      console.error('获取趋势数据失败:', err)
    }
    finally {
      loading.value = false
    }
  }

  // 加载获奖作品数据
  const loadAwardWorks = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await achievementApi.getAwardWorks(schoolId)
      if (response.data)
        awardWorks.value = response.data
    }
    catch (err) {
      error.value = '获取获奖作品数据失败'
      console.error('获取获奖作品数据失败:', err)
    }
    finally {
      loading.value = false
    }
  }

  // 初始化所有数据
  const initAchievements = async () => {
    await Promise.all([
      loadAchievementStats(),
      loadTrendData(),
      loadAwardWorks(),
    ])
  }

  return {
    loading,
    error,
    achievementStats,
    trendData,
    awardWorks,
    loadAchievementStats,
    loadTrendData,
    loadAwardWorks,
    initAchievements,
  }
}

// 主要的院校管理函数，组合各种功能
export function useSchool(options?: {
  autoLoad?: boolean
  initialParams?: Partial<SchoolQueryParams>
}) {
  const { autoLoad = true, initialParams } = options || {}

  // 组合各种功能
  const schoolList = useSchoolList(initialParams)
  const schoolSearch = useSchoolSearch()
  const schoolFilters = useSchoolFilters()
  const schoolSorting = useSchoolSorting()
  const schoolPagination = useSchoolPagination()
  const schoolInteraction = useSchoolInteraction()
  const schoolFormatter = useSchoolFormatter()
  const schoolStats = useSchoolStats()
  const schoolComparison = useSchoolComparison()

  // 自动加载
  if (autoLoad)
    schoolList.initialize()

  // 院校详情相关功能
  const schoolStore = useSchoolStore()

  // 获取院校详情
  const fetchSchoolDetail = async (schoolId: number) => {
    if (shouldUseMockData()) {
      return getMockSchoolById(schoolId)
    }
    else {
      // 调用后端API
      return await schoolStore.fetchSchoolDetail(schoolId)
    }
  }

  // 组合返回所有功能
  return {
    // 基础数据
    schools: schoolList.schools,
    totalSchools: schoolList.totalSchools,
    loading: schoolList.loading,
    hasNextPage: schoolList.hasNextPage,
    filters: schoolList.filters,

    // 搜索功能
    searchKeyword: schoolSearch.searchKeyword,
    searchHistory: schoolSearch.searchHistory,
    search: schoolSearch.search,
    clearSearch: schoolSearch.clearSearch,

    // 筛选功能
    applyFilters: schoolFilters.applyFilters,
    resetFilters: schoolFilters.resetFilters,
    toggleFilter: schoolFilters.toggleFilter,
    setSorting: schoolFilters.setSorting,
    hasActiveFilters: schoolFilters.hasActiveFilters,

    // 排序功能
    currentSort: schoolSorting.currentSort,
    currentOrder: schoolSorting.currentOrder,
    toggleSortOrder: schoolSorting.toggleSortOrder,

    // 分页功能
    currentPage: schoolPagination.currentPage,
    pageSize: schoolPagination.pageSize,
    totalPages: schoolPagination.totalPages,
    goToPage: schoolPagination.goToPage,
    changePageSize: schoolPagination.changePageSize,
    prevPage: schoolPagination.prevPage,
    nextPage: schoolPagination.nextPage,

    // 交互功能
    toggleFavorite: schoolInteraction.toggleFavorite,
    isFavorited: schoolInteraction.isFavorited,
    shareSchool: schoolInteraction.shareSchool,
    downloadDetail: schoolInteraction.downloadDetail,

    // 格式化功能
    formatSchoolType: schoolFormatter.formatSchoolType,
    formatSchoolLevel: schoolFormatter.formatSchoolLevel,
    formatSchoolTags: schoolFormatter.formatSchoolTags,

    // 统计功能
    getFilteredStats: schoolStats.getFilteredStats,
    getTypeDistribution: schoolStats.getTypeDistribution,

    // 对比功能
    compareList: schoolComparison.compareList,
    addToCompare: schoolComparison.addToCompare,
    removeFromCompare: schoolComparison.removeFromCompare,
    clearCompare: schoolComparison.clearCompare,
    isInCompare: schoolComparison.isInCompare,

    // 基础方法
    fetchSchools: schoolList.initialize,
    fetchSchoolDetail,
    refresh: schoolList.refresh,
    loadMore: schoolList.loadMore,
  }
}

// 默认导出主函数
export default useSchool
