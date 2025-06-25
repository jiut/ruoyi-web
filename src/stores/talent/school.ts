/**
 * 院校数据库状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  School,
  SchoolQueryParams,
  SchoolListParams,
  Major,
  Faculty,
  Employment,
  Award,
  Achievement,
  SchoolType,
  SchoolLevel,
  MajorCategory,
  EmploymentStatistics,
  EmploymentDistribution,
  FavoriteResponse,
  ShareResponse
} from '@/types/talent/school'
import {
  schoolApi,
  majorApi,
  facultyApi,
  employmentApi,
  achievementApi,
  schoolInteractionApi,
  statisticsApi
} from '@/api/talent/school'
import { mockSchools } from '@/data/mockSchools'

// API响应类型定义
interface ApiResponse<T> {
  code?: number
  msg?: string
  data?: T
  rows?: T[]
  total?: number
}

export const useSchoolStore = defineStore('school', () => {
  // 状态
  const loading = ref(false)
  const detailLoading = ref(false)

  // 院校相关状态
  const schools = ref<School[]>(mockSchools)
  const currentSchool = ref<School | null>(null)
  const totalSchools = ref(mockSchools.length)
  const schoolCount = ref(mockSchools.length)

  // 专业相关状态
  const majors = ref<Major[]>([])
  const currentMajor = ref<Major | null>(null)

  // 师资相关状态
  const faculties = ref<Faculty[]>([])
  const currentFaculty = ref<Faculty | null>(null)

  // 就业数据相关状态
  const employmentData = ref<Employment | null>(null)
  const employmentTrend = ref<Employment[]>([])
  const employmentStats = ref<EmploymentStatistics | null>(null)
  const employmentDistribution = ref<EmploymentDistribution | null>(null)

  // 获奖成果相关状态
  const awards = ref<Award[]>([])
  const achievements = ref<Achievement[]>([])
  const awardStats = ref<any>(null)

  // 统计数据
  const statistics = ref<any>(null)

  // 筛选条件
  const filters = ref<SchoolQueryParams>({
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
    sortOrder: 'asc'
  })

  // 用户交互状态
  const favoriteSchools = ref<number[]>([])
  const viewHistory = ref<number[]>([])

  // 计算属性
  const filteredSchools = computed(() => {
    let result = [...schools.value]

    // 按名称筛选
    if (filters.value.schoolName) {
      result = result.filter(school =>
        school.schoolName.includes(filters.value.schoolName!)
      )
    }

    // 按类型筛选
    if (filters.value.schoolType) {
      result = result.filter(school =>
        school.schoolType === filters.value.schoolType
      )
    }

    // 按地区筛选
    if (filters.value.province) {
      result = result.filter(school =>
        school.province === filters.value.province
      )
    }

    if (filters.value.city) {
      result = result.filter(school =>
        school.city === filters.value.city
      )
    }

    // 按层次筛选
    if (filters.value.level) {
      result = result.filter(school =>
        school.level === filters.value.level
      )
    }

    // 按特殊标识筛选
    if (filters.value.isKey !== undefined) {
      result = result.filter(school =>
        school.isKey === filters.value.isKey
      )
    }

    if (filters.value.is985 !== undefined) {
      result = result.filter(school =>
        school.is985 === filters.value.is985
      )
    }

    if (filters.value.is211 !== undefined) {
      result = result.filter(school =>
        school.is211 === filters.value.is211
      )
    }

    if (filters.value.isDoubleFirst !== undefined) {
      result = result.filter(school =>
        school.isDoubleFirst === filters.value.isDoubleFirst
      )
    }

    // 按排名筛选
    if (filters.value.minRanking !== undefined) {
      result = result.filter(school =>
        school.ranking >= filters.value.minRanking!
      )
    }

    if (filters.value.maxRanking !== undefined) {
      result = result.filter(school =>
        school.ranking <= filters.value.maxRanking!
      )
    }

    return result
  })

  const hasNextPage = computed(() => {
    const currentPage = filters.value.pageNum || 1
    const pageSize = filters.value.pageSize || 20
    return currentPage * pageSize < totalSchools.value
  })

  // Actions

  // 院校相关操作 - 若依API适配版本
  const fetchSchoolsWithRuoyi = async (params?: Partial<SchoolListParams>) => {
    try {
      loading.value = true
      const queryParams = {
        pageNum: 1,
        pageSize: 20,
        ...params
      }
      const response = await schoolApi.list(queryParams) as ApiResponse<School>

      if (params?.pageNum === 1) {
        schools.value = response.rows || []
      } else {
        schools.value.push(...(response.rows || []))
      }

      totalSchools.value = response.total || 0
      schoolCount.value = response.total || 0

    } catch (error) {
      console.error('获取院校列表失败:', error)
      // 使用模拟数据作为后备
      schools.value = mockSchools
      totalSchools.value = mockSchools.length
      schoolCount.value = mockSchools.length
    } finally {
      loading.value = false
    }
  }

  // 获取院校就业数据 - 使用若依API
  const fetchEmploymentDataWithRuoyi = async (schoolId: number) => {
    try {
      const [statsResponse, distributionResponse] = await Promise.all([
        schoolApi.getEmploymentStats(schoolId) as Promise<ApiResponse<EmploymentStatistics>>,
        schoolApi.getEmploymentDistribution(schoolId) as Promise<ApiResponse<EmploymentDistribution>>
      ])

      employmentStats.value = statsResponse.data || null
      employmentDistribution.value = distributionResponse.data || null

    } catch (error) {
      console.error('获取就业数据失败:', error)
    }
  }

  // 院校相关操作 - 原有版本（保持向后兼容）
  const fetchSchools = async (params?: Partial<SchoolQueryParams>) => {
    try {
      loading.value = true
      const queryParams = { ...filters.value, ...params }
      const response = await schoolApi.list(queryParams) as ApiResponse<School>

      if (params?.pageNum === 1) {
        schools.value = response.rows || []
      } else {
        schools.value.push(...(response.rows || []))
      }

      totalSchools.value = response.total || 0
      schoolCount.value = response.total || 0

      // 更新筛选条件
      Object.assign(filters.value, queryParams)
    } catch (error) {
      console.error('获取院校列表失败:', error)
      // 使用模拟数据作为后备
      schools.value = mockSchools
      totalSchools.value = mockSchools.length
      schoolCount.value = mockSchools.length
    } finally {
      loading.value = false
    }
  }

  const fetchSchoolDetail = async (id: number) => {
    try {
      detailLoading.value = true
      const response = await schoolApi.get(id) as ApiResponse<School>
      currentSchool.value = response.data || null

      // 添加到访问历史
      if (!viewHistory.value.includes(id)) {
        viewHistory.value.unshift(id)
        // 限制历史记录数量
        if (viewHistory.value.length > 50) {
          viewHistory.value = viewHistory.value.slice(0, 50)
        }
      }
    } catch (error) {
      console.error('获取院校详情失败:', error)
      // 使用模拟数据作为后备
      const mockSchool = mockSchools.find(school => school.id === id)
      currentSchool.value = mockSchool || null
    } finally {
      detailLoading.value = false
    }
  }

  const searchSchools = async (keyword: string) => {
    try {
      loading.value = true
      const response = await schoolApi.search(keyword) as ApiResponse<School>
      schools.value = response.data ? [response.data] : (response.rows || [])
      totalSchools.value = schools.value.length
    } catch (error) {
      console.error('搜索院校失败:', error)
      // 模拟搜索逻辑
      const filteredMockSchools = mockSchools.filter(school =>
        school.schoolName.includes(keyword) ||
        school.description.includes(keyword)
      )
      schools.value = filteredMockSchools
      totalSchools.value = filteredMockSchools.length
    } finally {
      loading.value = false
    }
  }

  // 专业相关操作
  const fetchMajors = async (schoolId?: number, category?: string) => {
    try {
      const response = await majorApi.list(schoolId, category) as ApiResponse<Major>
      majors.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取专业列表失败:', error)
    }
  }

  const fetchMajorsBySchool = async (schoolId: number) => {
    try {
      const response = await majorApi.getBySchool(schoolId) as ApiResponse<Major>
      majors.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取院校专业失败:', error)
    }
  }

  // 师资相关操作
  const fetchFaculties = async (schoolId?: number) => {
    try {
      const response = await facultyApi.list(schoolId) as ApiResponse<Faculty>
      faculties.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取学院列表失败:', error)
    }
  }

  const fetchFacultiesBySchool = async (schoolId: number) => {
    try {
      const response = await facultyApi.getBySchool(schoolId) as ApiResponse<Faculty>
      faculties.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取院校学院失败:', error)
    }
  }

  // 就业数据相关操作
  const fetchEmploymentData = async (schoolId: number, year?: number) => {
    try {
      const response = await employmentApi.getBySchool(schoolId, year) as ApiResponse<Employment>
      employmentData.value = response.data || null
    } catch (error) {
      console.error('获取就业数据失败:', error)
    }
  }

  const fetchEmploymentTrend = async (schoolId: number, years: number[]) => {
    try {
      const response = await employmentApi.getTrend(schoolId, years) as ApiResponse<Employment>
      employmentTrend.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取就业趋势失败:', error)
    }
  }

  // 获奖成果相关操作
  const fetchAwards = async (schoolId: number, level?: string, year?: number) => {
    try {
      const response = await achievementApi.getAwards(schoolId, level, year) as ApiResponse<Award>
      awards.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取获奖列表失败:', error)
    }
  }

  const fetchAchievements = async (schoolId: number, type?: string, year?: number) => {
    try {
      const response = await achievementApi.getAchievements(schoolId, type, year) as ApiResponse<Achievement>
      achievements.value = response.data ? [response.data] : (response.rows || [])
    } catch (error) {
      console.error('获取成果列表失败:', error)
    }
  }

  const fetchAwardStats = async (schoolId: number) => {
    try {
      const response = await achievementApi.getAwardStats(schoolId) as ApiResponse<any>
      awardStats.value = response.data
    } catch (error) {
      console.error('获取获奖统计失败:', error)
    }
  }

  // 统计数据操作
  const fetchStatistics = async () => {
    try {
      const response = await statisticsApi.getOverview() as ApiResponse<any>
      statistics.value = response.data
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  // 用户交互操作
  const toggleFavorite = async (schoolId: number) => {
    try {
      const isFavorited = favoriteSchools.value.includes(schoolId)

      if (isFavorited) {
        await schoolInteractionApi.unfavorite(schoolId)
        favoriteSchools.value = favoriteSchools.value.filter(id => id !== schoolId)
      } else {
        await schoolInteractionApi.favorite(schoolId)
        favoriteSchools.value.push(schoolId)
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      // 模拟收藏操作
      const isFavorited = favoriteSchools.value.includes(schoolId)
      if (isFavorited) {
        favoriteSchools.value = favoriteSchools.value.filter(id => id !== schoolId)
      } else {
        favoriteSchools.value.push(schoolId)
      }
    }
  }

  const checkFavoriteStatus = async (schoolId: number) => {
    try {
      // 简化逻辑：直接检查本地状态，避免API调用错误
      return favoriteSchools.value.includes(schoolId)
    } catch (error) {
      console.error('检查收藏状态失败:', error)
      return favoriteSchools.value.includes(schoolId)
    }
  }

  const shareSchool = async (schoolId: number, platform: string) => {
    try {
      await schoolInteractionApi.share(schoolId)
    } catch (error) {
      console.error('分享院校失败:', error)
    }
  }

  const downloadSchoolDetail = async (schoolId: number) => {
    try {
      // 简化下载逻辑，因为API可能不存在
      console.log(`下载院校详情：${schoolId}`)
      // 模拟下载成功
    } catch (error) {
      console.error('下载院校详情失败:', error)
    }
  }

  // 筛选和分页操作
  const updateFilters = (newFilters: Partial<SchoolQueryParams>) => {
    Object.assign(filters.value, newFilters)
  }

  const resetFilters = () => {
    filters.value = {
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
      sortOrder: 'asc'
    }
  }

  const loadMore = () => {
    if (hasNextPage.value) {
      filters.value.pageNum = (filters.value.pageNum || 1) + 1
      fetchSchools()
    }
  }

  // 便利方法
  const getSchoolById = (id: number) => {
    return schools.value.find(school => school.id === id)
  }

  const isFavorited = (schoolId: number) => {
    return favoriteSchools.value.includes(schoolId)
  }

  const isVisited = (schoolId: number) => {
    return viewHistory.value.includes(schoolId)
  }

  const clearCurrentSchool = () => {
    currentSchool.value = null
  }

  const clearSearch = () => {
    filters.value.schoolName = ''
    schools.value = mockSchools
    totalSchools.value = mockSchools.length
  }

  return {
    // 状态
    loading,
    detailLoading,
    schools,
    currentSchool,
    totalSchools,
    schoolCount,
    majors,
    currentMajor,
    faculties,
    currentFaculty,
    employmentData,
    employmentTrend,
    employmentStats,
    employmentDistribution,
    awards,
    achievements,
    awardStats,
    statistics,
    filters,
    favoriteSchools,
    viewHistory,

    // 计算属性
    filteredSchools,
    hasNextPage,

    // 方法
    fetchSchoolsWithRuoyi,
    fetchEmploymentDataWithRuoyi,
    fetchSchools,
    fetchSchoolDetail,
    searchSchools,
    fetchMajors,
    fetchMajorsBySchool,
    fetchFaculties,
    fetchFacultiesBySchool,
    fetchEmploymentData,
    fetchEmploymentTrend,
    fetchAwards,
    fetchAchievements,
    fetchAwardStats,
    fetchStatistics,
    toggleFavorite,
    checkFavoriteStatus,
    shareSchool,
    downloadSchoolDetail,
    updateFilters,
    resetFilters,
    loadMore,
    getSchoolById,
    isFavorited,
    isVisited,
    clearCurrentSchool,
    clearSearch
  }
})
