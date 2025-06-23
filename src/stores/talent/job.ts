import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { JobPosting, JobQueryParams, JobCardData, FilterOptions, SalaryRange } from '@/types/talent/job'
import { listJob, getJob } from '@/api/talent/job'

export const useJobStore = defineStore('talent-job', () => {
  // 状态
  const jobs = ref<JobPosting[]>([])
  const currentJob = ref<JobPosting | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const queryParams = ref<JobQueryParams>({
    pageNum: 1,
    pageSize: 20
  })

  // 筛选状态
  const filters = ref({
    professions: [] as string[],
    locations: [] as string[],
    experiences: [] as string[],
    workTypes: [] as string[],
    companyScales: [] as string[],
    skills: [] as string[],
    salaryRange: { min: 10, max: 50 } as SalaryRange,
    isUrgent: false,
    supportFreshGraduate: false,
    weekendOff: false
  })

  // 排序选项
  const sortBy = ref('latest')

  // 计算属性
  const filteredJobs = computed(() => {
    let result = jobs.value

    // 应用筛选逻辑
    if (filters.value.professions.length > 0) {
      result = result.filter(job =>
        filters.value.professions.includes(job.profession)
      )
    }

    if (filters.value.locations.length > 0) {
      result = result.filter(job =>
        filters.value.locations.some(location =>
          job.workLocation.includes(location)
        )
      )
    }

    if (filters.value.experiences.length > 0) {
      result = result.filter(job =>
        filters.value.experiences.includes(job.experienceRequired)
      )
    }

    if (filters.value.workTypes.length > 0) {
      result = result.filter(job =>
        filters.value.workTypes.includes(job.workType)
      )
    }

        // 薪资范围筛选
    const { min, max } = filters.value.salaryRange
    result = result.filter(job => {
      if (job.salaryMin && job.salaryMax) {
        const jobMinK = job.salaryMin / 1000
        const jobMaxK = job.salaryMax / 1000
        return jobMaxK >= min && jobMinK <= max
      }
      return true // 没有薪资信息的职位默认显示
    })

    // 排序
    switch (sortBy.value) {
      case 'salary-high':
        result.sort((a, b) => {
          const getSalaryMax = (job: JobPosting) => {
            if (job.salaryMax) {
              return job.salaryMax / 1000
            }
            return 0
          }
          return getSalaryMax(b) - getSalaryMax(a)
        })
        break
      case 'salary-low':
        result.sort((a, b) => {
          const getSalaryMin = (job: JobPosting) => {
            if (job.salaryMin) {
              return job.salaryMin / 1000
            }
            return 0
          }
          return getSalaryMin(a) - getSalaryMin(b)
        })
        break
      case 'latest':
      default:
        result.sort((a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
        break
    }

    return result
  })

  const jobCount = computed(() => filteredJobs.value.length)

  // 方法
    // 数据映射函数：将后端数据格式转换为前端期望的格式
  const mapJobData = (backendJob: any, index: number): JobPosting => {
    // 处理薪资信息
    let salaryMin: number | undefined
    let salaryMax: number | undefined

    if (backendJob.salaryMin && backendJob.salaryMax) {
      salaryMin = parseFloat(backendJob.salaryMin)
      salaryMax = parseFloat(backendJob.salaryMax)
    }

    return {
      id: backendJob.id || (Date.now() + index), // 如果没有id，使用时间戳+索引确保唯一性
      title: backendJob.jobTitle || backendJob.title || '未知职位',
      description: backendJob.description || '',
      requirements: backendJob.requirements || '',
      salaryMin,
      salaryMax,
      workLocation: backendJob.workLocation || backendJob.location || '未知地点',
      workType: backendJob.workType || '全职',
      experienceRequired: backendJob.experienceRequired || backendJob.experience || '经验不限',
      educationRequired: backendJob.educationRequired || backendJob.education || '学历不限',
      profession: backendJob.requiredProfession || backendJob.profession || 'OTHER',
      skillsRequired: backendJob.requiredSkills || backendJob.skillsRequired || '[]',
      enterpriseId: backendJob.enterpriseId || 0,
      status: backendJob.status || 'PUBLISHED',
      publishDate: backendJob.publishDate || backendJob.createdAt || new Date().toISOString(),
      deadline: backendJob.deadline || '',
      createdAt: backendJob.createdAt || new Date().toISOString(),
      updatedAt: backendJob.updatedAt || new Date().toISOString(),
      enterprise: backendJob.enterprise || null
    } as JobPosting
  }

  const fetchJobs = async (params?: JobQueryParams) => {
    loading.value = true
    console.log('📡 Store fetchJobs 开始调用后端API')
    console.log('  查询参数:', params)
    try {
      const query = { ...queryParams.value, ...params }
      console.log('  最终查询参数:', query)
      const response = await listJob(query)
      console.log('  后端响应:', response)

      // 映射后端数据到前端格式
      const rawJobs = (response as any).rows || response.data || []
      jobs.value = rawJobs.map((job: any, index: number) => mapJobData(job, index))
      total.value = (response as any).total || jobs.value.length

      console.log('  映射后的岗位数据:', jobs.value)
      console.log('  获取到的岗位数量:', jobs.value.length)
    } catch (error) {
      console.error('❌ 获取岗位列表失败:', error)
      jobs.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  const fetchJobDetail = async (id: number) => {
    loading.value = true
    try {
      const response = await getJob(id)
      currentJob.value = response.data
    } catch (error) {
      console.error('获取岗位详情失败:', error)
      currentJob.value = null
    } finally {
      loading.value = false
    }
  }

  const updateQueryParams = (params: Partial<JobQueryParams>) => {
    queryParams.value = { ...queryParams.value, ...params }
  }

  const updateFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      professions: [],
      locations: [],
      experiences: [],
      workTypes: [],
      companyScales: [],
      skills: [],
      salaryRange: { min: 10, max: 50 },
      isUrgent: false,
      supportFreshGraduate: false,
      weekendOff: false
    }
  }

  const updateSortBy = (sort: string) => {
    sortBy.value = sort
  }

  const search = async (searchQuery?: string) => {
    if (searchQuery) {
      updateQueryParams({ title: searchQuery })
    }
    await fetchJobs()
  }

  const resetSearch = () => {
    queryParams.value = {
      pageNum: 1,
      pageSize: 20
    }
    resetFilters()
    fetchJobs()
  }

  // 分页
  const changePage = (page: number) => {
    updateQueryParams({ pageNum: page })
    fetchJobs()
  }

  const changePageSize = (size: number) => {
    updateQueryParams({ pageSize: size, pageNum: 1 })
    fetchJobs()
  }

  return {
    // 状态
    jobs: filteredJobs,
    currentJob,
    loading,
    total,
    jobCount,
    queryParams,
    filters,
    sortBy,

    // 方法
    fetchJobs,
    fetchJobDetail,
    updateQueryParams,
    updateFilters,
    resetFilters,
    updateSortBy,
    search,
    resetSearch,
    changePage,
    changePageSize
  }
})
