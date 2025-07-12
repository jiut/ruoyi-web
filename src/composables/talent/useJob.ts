import { computed, reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useJobStore } from '@/stores/talent/job'
import { applyJob } from '@/api/talent/job'
import type { JobApplicationData, JobPosting, SalaryRange } from '@/types/talent/job'
// 保持模拟数据导入以支持开发模式
import { getMockJobs } from '@/data/mockJobs'
import ProfessionUtils from '@/utils/professionUtils'
import { shouldUseMockData } from '@/utils/authUtils'

// 调试信息
console.log('🔍 岗位Composable调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  PROD:', import.meta.env.PROD)
console.log('  是否使用Mock数据:', shouldUseMockData())
console.log('  VITE_GLOB_API_URL:', import.meta.env.VITE_GLOB_API_URL)

export function useJob() {
  const store = useJobStore()
  const message = useMessage()

  // 使用Store中的状态替代本地状态
  const loading = ref(false)
  const mockJobs = ref<JobPosting[]>([])
  const mockTotal = ref(0)

  const fetchJobs = async (params?: any) => {
    try {
      loading.value = true

      if (shouldUseMockData()) {
        // 未登录模式：使用模拟数据
        console.log('🔧 未登录模式：使用模拟数据')
        const result = getMockJobs(params)
        mockJobs.value = result.rows
        mockTotal.value = result.total
      }
      else {
        // 已登录模式：使用真实的后端API
        console.log('🚀 已登录模式：使用后端API')
        await store.fetchJobs(params)
      }
    }
    catch (error) {
      console.error('获取岗位列表失败:', error)
      message.error('获取岗位列表失败，请稍后重试')
    }
    finally {
      loading.value = false
    }
  }

  return {
    // 状态 - 根据登录状态返回不同的数据源
    jobs: computed(() => shouldUseMockData() ? mockJobs.value : store.jobs),
    currentJob: computed(() => store.currentJob),
    loading: computed(() => loading.value || store.loading),
    total: computed(() => shouldUseMockData() ? mockTotal.value : store.total),
    jobCount: computed(() => shouldUseMockData() ? mockTotal.value : store.jobCount),
    filters: computed(() => store.filters),
    sortBy: computed(() => store.sortBy),

    // 方法
    fetchJobs,
    fetchJobDetail: store.fetchJobDetail,
    updateFilters: store.updateFilters,
    resetFilters: store.resetFilters,
    updateSortBy: store.updateSortBy,
    resetSearch: store.resetSearch,
    changePage: store.changePage,
    changePageSize: store.changePageSize,
    search: store.search,
  }
}

export function useJobFilter() {
  const store = useJobStore()

  const salaryRange = ref<SalaryRange>({ min: 10, max: 50 })
  const selectedProfessions = ref<string[]>([])
  const selectedLocations = ref<string[]>([])
  const selectedExperiences = ref<string[]>([])
  const selectedWorkTypes = ref<string[]>([])
  const selectedCompanyScales = ref<string[]>([])
  const isUrgent = ref(false)
  const supportFreshGraduate = ref(false)
  const weekendOff = ref(false)

  const professionOptions = ProfessionUtils.getSelectOptions()

  const locationOptions = [
    { value: '北京', label: '北京' },
    { value: '上海', label: '上海' },
    { value: '广州', label: '广州' },
    { value: '深圳', label: '深圳' },
    { value: '杭州', label: '杭州' },
    { value: '成都', label: '成都' },
  ]

  const experienceOptions = [
    { value: '应届毕业生', label: '应届毕业生' },
    { value: '1-3年', label: '1-3 年' },
    { value: '3-5年', label: '3-5 年' },
    { value: '5-10年', label: '5-10 年' },
    { value: '10年以上', label: '10 年以上' },
  ]

  const workTypeOptions = [
    { value: '全职', label: '全职' },
    { value: '兼职', label: '兼职' },
    { value: '实习', label: '实习' },
    { value: '远程', label: '远程' },
    { value: '项目制', label: '项目制' },
  ]

  const companyScaleOptions = [
    { value: '初创企业', label: '初创企业 (≤50人)' },
    { value: '中小企业', label: '中小企业 (50-500人)' },
    { value: '大型企业', label: '大型企业 (500-2000人)' },
    { value: '超大型企业', label: '超大型企业 (>2000人)' },
  ]

  const applyFilters = () => {
    store.updateFilters({
      professions: selectedProfessions.value,
      locations: selectedLocations.value,
      experiences: selectedExperiences.value,
      workTypes: selectedWorkTypes.value,
      companyScales: selectedCompanyScales.value,
      salaryRange: salaryRange.value,
      isUrgent: isUrgent.value,
      supportFreshGraduate: supportFreshGraduate.value,
      weekendOff: weekendOff.value,
    })
  }

  const resetFilters = () => {
    salaryRange.value = { min: 10, max: 50 }
    selectedProfessions.value = []
    selectedLocations.value = []
    selectedExperiences.value = []
    selectedWorkTypes.value = []
    selectedCompanyScales.value = []
    isUrgent.value = false
    supportFreshGraduate.value = false
    weekendOff.value = false
    store.resetFilters()
  }

  return {
    // 筛选状态
    salaryRange,
    selectedProfessions,
    selectedLocations,
    selectedExperiences,
    selectedWorkTypes,
    selectedCompanyScales,
    isUrgent,
    supportFreshGraduate,
    weekendOff,

    // 选项数据
    professionOptions,
    locationOptions,
    experienceOptions,
    workTypeOptions,
    companyScaleOptions,

    // 方法
    applyFilters,
    resetFilters,
  }
}

export function useJobApplication() {
  const message = useMessage()
  const loading = ref(false)
  const showApplicationModal = ref(false)
  const currentJobId = ref<number | null>(null)

  const applicationForm = reactive<JobApplicationData>({
    jobId: 0,
    name: '',
    phone: '',
    email: '',
    experience: '',
    currentStatus: '',
    expectedSalary: '',
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: '',
  })

  const openApplicationModal = (jobId: number) => {
    currentJobId.value = jobId
    applicationForm.jobId = jobId
    showApplicationModal.value = true
  }

  const closeApplicationModal = () => {
    showApplicationModal.value = false
    currentJobId.value = null
    resetForm()
  }

  const resetForm = () => {
    Object.assign(applicationForm, {
      jobId: 0,
      name: '',
      phone: '',
      email: '',
      experience: '',
      currentStatus: '',
      expectedSalary: '',
      coverLetter: '',
      resumeUrl: '',
      portfolioUrl: '',
    })
  }

  const submitApplication = async () => {
    loading.value = true
    try {
      await applyJob(applicationForm)
      message.success('申请已提交，我们会尽快联系您！')
      closeApplicationModal()
    }
    catch (error) {
      console.error('提交申请失败:', error)
      message.error('提交申请失败，请稍后重试')
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    showApplicationModal,
    currentJobId,
    applicationForm,
    openApplicationModal,
    closeApplicationModal,
    submitApplication,
    resetForm,
  }
}

export function useJobDetail() {
  const store = useJobStore()
  const showDetailModal = ref(false)
  const currentJobId = ref<number | null>(null)

  const openDetailModal = async (jobId: number) => {
    currentJobId.value = jobId
    showDetailModal.value = true
    await store.fetchJobDetail(jobId)
  }

  const closeDetailModal = () => {
    showDetailModal.value = false
    currentJobId.value = null
  }

  return {
    showDetailModal,
    currentJobId,
    currentJob: computed(() => store.currentJob),
    loading: computed(() => store.loading),
    openDetailModal,
    closeDetailModal,
  }
}
