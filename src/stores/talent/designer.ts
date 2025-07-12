import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getDesigner,
  getDesignerAwards,
  getDesignerEducation,
  getDesignerWorkExperience,
  getDesignerWorks,
  getProfessions,
  getRegions,
  getSkillTags,
  listDesigner,
  searchDesigners,
} from '@/api/talent/designer'
import type {
  Award,
  Designer,
  DesignerQueryParams,
  Education,
  Profession,
  SkillTag,
  Work,
  WorkExperience,
} from '@/types/talent/designer'

export const useDesignerStore = defineStore('talent-designer', () => {
  // 状态
  const designers = ref<Designer[]>([])
  const currentDesigner = ref<Designer | null>(null)
  const currentDesignerWorks = ref<Work[]>([])
  const currentDesignerWorkExperience = ref<WorkExperience[]>([])
  const currentDesignerEducation = ref<Education[]>([])
  const currentDesignerAwards = ref<Award[]>([])

  const loading = ref(false)
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(20)

  // 筛选选项
  const professions = ref<Profession[]>([])
  const skillTags = ref<SkillTag[]>([])
  const regions = ref<string[]>([])

  // 计算属性
  const hasMore = computed(() => designers.value.length < total.value)
  const currentPage = computed(() => Math.ceil(designers.value.length / pageSize.value))

  // 获取设计师列表
  const fetchDesigners = async (params?: DesignerQueryParams, reset = false) => {
    if (loading.value && !reset)
      return

    loading.value = true
    try {
      const queryParams = {
        pageNum: reset ? 1 : pageNum.value,
        pageSize: pageSize.value,
        ...params,
      }

      const response = await listDesigner(queryParams)

      if (reset) {
        designers.value = response.rows
        pageNum.value = 1
      }
      else {
        designers.value.push(...response.rows)
      }

      total.value = response.total
      pageNum.value++
    }
    catch (error) {
      console.error('获取设计师列表失败:', error)
      window.$message?.error('获取设计师列表失败')
    }
    finally {
      loading.value = false
    }
  }

  // 获取设计师详情及相关信息
  const fetchDesignerDetail = async (id: number) => {
    loading.value = true
    try {
      // 并行获取设计师基本信息和相关数据
      const [
        designerResponse,
        worksResponse,
        workExperienceResponse,
        educationResponse,
        awardsResponse,
      ] = await Promise.all([
        getDesigner(id),
        getDesignerWorks(id),
        getDesignerWorkExperience(id),
        getDesignerEducation(id),
        getDesignerAwards(id),
      ])

      currentDesigner.value = designerResponse.data
      currentDesignerWorks.value = worksResponse.data || []
      currentDesignerWorkExperience.value = workExperienceResponse.data || []
      currentDesignerEducation.value = educationResponse.data || []
      currentDesignerAwards.value = awardsResponse.data || []
    }
    catch (error) {
      console.error('获取设计师详情失败:', error)
      window.$message?.error('获取设计师详情失败')
    }
    finally {
      loading.value = false
    }
  }

  // 搜索设计师
  const searchDesigner = async (keyword: string) => {
    if (!keyword.trim()) {
      await fetchDesigners({}, true)
      return
    }

    loading.value = true
    try {
      const response = await searchDesigners(keyword)
      designers.value = response.data || []
      total.value = response.data?.length || 0
      pageNum.value = 1
    }
    catch (error) {
      console.error('搜索设计师失败:', error)
      window.$message?.error('搜索设计师失败')
    }
    finally {
      loading.value = false
    }
  }

  // 获取筛选选项
  const fetchFilterOptions = async () => {
    try {
      const [professionsResponse, skillTagsResponse, regionsResponse] = await Promise.all([
        getProfessions(),
        getSkillTags(),
        getRegions(),
      ])

      professions.value = professionsResponse.data || []
      skillTags.value = skillTagsResponse.data || []
      regions.value = regionsResponse.data || []
    }
    catch (error) {
      console.error('获取筛选选项失败:', error)
    }
  }

  // 重置状态
  const resetDesigners = () => {
    designers.value = []
    total.value = 0
    pageNum.value = 1
  }

  // 重置当前设计师
  const resetCurrentDesigner = () => {
    currentDesigner.value = null
    currentDesignerWorks.value = []
    currentDesignerWorkExperience.value = []
    currentDesignerEducation.value = []
    currentDesignerAwards.value = []
  }

  // 加载更多
  const loadMore = async (params?: DesignerQueryParams) => {
    if (!hasMore.value || loading.value)
      return
    await fetchDesigners(params, false)
  }

  return {
    // 状态
    designers,
    currentDesigner,
    currentDesignerWorks,
    currentDesignerWorkExperience,
    currentDesignerEducation,
    currentDesignerAwards,
    loading,
    total,
    pageNum,
    pageSize,
    professions,
    skillTags,
    regions,

    // 计算属性
    hasMore,
    currentPage,

    // 方法
    fetchDesigners,
    fetchDesignerDetail,
    searchDesigner,
    fetchFilterOptions,
    resetDesigners,
    resetCurrentDesigner,
    loadMore,
  }
})
