<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import TaskCard from '@/components/talent/TaskCard.vue'
import TaskDetailModal from '@/components/talent/TaskDetailModal.vue'
import TaskEditModal from '@/components/talent/TaskEditModal.vue'
import { SkillTagList } from '@/components/common'
import { shouldUseMockData } from '@/utils/authUtils'
import { useRoleCheck } from '@/composables/useRoleCheck'
import {
  marketplaceTasks as mockMarketplaceTasks,
  myTasks as mockMyTasks,
  paymentRecords as mockPaymentRecords,
  accountStats as mockAccountStats,
  taskTypeOptions,
  cityOptions,
  experienceOptions,
  priceRangeOptions,
  deadlineOptions,
  type SimpleTask,
  type MyTask,
  type PaymentRecord
} from '@/data/mockTasks'
import { TaskStatus, ApplicationStatus, ReviewStatus, DeliverableStatus, PaymentStatus, ReviewMode } from '@/types/talent/taskFactory'
import { taskApi, designerApi, paymentApi, statsApi, taskConfigApi, enterpriseTaskApi } from '@/api/talent/task'
import { mapTaskStatusToDisplay, getTaskStatusClass, canManageTaskByDisplayStatus, canEditTaskByDisplayStatus } from '@/utils/taskStatusUtils'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 角色检查
const { isEnterprise, isDesigner } = useRoleCheck()

// 环境变量 - 在script中定义，避免模板中直接使用import.meta
const isDevelopment = import.meta.env.DEV
const mockDataConfig = import.meta.env.VITE_USE_MOCK_DATA

// 设备检测
const isMobile = ref(false)
const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  isMobile.value = screenWidth < 1024
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    || (isTouchDevice && screenWidth < 1200)
}

// 监听窗口大小变化
const handleResize = () => {
  checkDevice()
}

// 添加触觉反馈（仅移动端）
const addHapticFeedback = () => {
  if (isMobile.value && 'vibrate' in navigator)
    navigator.vibrate(50)
}

// 智图工厂状态
const activeTab = ref('marketplace')
const myTasksFilter = ref('all')

// 抽屉状态
const showFilterDrawer = ref(false)
const filterDrawerOpen = ref(false)

// 筛选条件
const selectedTaskTypes = ref<string[]>([])
const selectedCities = ref<string[]>([])
const selectedExperience = ref('')
const selectedPriceRange = ref('')
const selectedDeadline = ref('')
const urgentTasks = ref(false)
const minPrice = ref(1000)
const maxPrice = ref(50000)
const sortBy = ref('latest')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(8)

// 标签页
const tabs = [
  { id: 'marketplace', name: '任务广场', icon: 'ri-store-line' },
  { id: 'my-tasks', name: '我的任务', icon: 'ri-task-line' },
  { id: 'matching', name: '智能匹配', icon: 'ri-magic-line' },
  { id: 'payment', name: '支付中心', icon: 'ri-wallet-line' },
]

// 使用mock数据的筛选选项
const taskTypes = taskTypeOptions
const cities = cityOptions
const experiences = experienceOptions
const priceRanges = priceRangeOptions
const deadlines = deadlineOptions

// 数据状态
const marketplaceTasks = ref<SimpleTask[]>([])
const myTasksData = ref<MyTask[]>([])
const paymentRecords = ref<PaymentRecord[]>([])
const accountStats = ref({
  balance: 0,
  withdrawableAmount: 0,
  monthlyIncome: 0,
  monthlyGrowth: 0,
  pendingAmount: 0,
  pendingDays: 0,
})

// 加载状态
const loading = ref(false)

// 任务详情弹窗状态
const selectedTask = ref<SimpleTask | null>(null)
const showTaskDetailModal = ref(false)
const taskDetailLoading = ref(false)

// 任务编辑弹窗状态
const showEditModal = ref(false)
const editingTask = ref<SimpleTask | null>(null)

// 数据加载函数
const loadMarketplaceTasks = async () => {
  if (shouldUseMockData()) {
    marketplaceTasks.value = mockMarketplaceTasks
  } else {
    try {
      loading.value = true
      const response = await taskApi.list({
         pageNum: currentPage.value,
         pageSize: itemsPerPage.value,
         sortBy: sortBy.value as 'latest' | 'price-high' | 'price-low' | 'deadline' | 'applications',
         ...(selectedTaskTypes.value.length > 0 && { taskType: selectedTaskTypes.value[0] as any }),
         ...(selectedCities.value.length > 0 && { location: selectedCities.value[0] }),
         ...(selectedExperience.value && { experience: selectedExperience.value as any }),
         ...(minPrice.value > 1000 && { minPrice: minPrice.value }),
         ...(maxPrice.value < 50000 && { maxPrice: maxPrice.value }),
         ...(urgentTasks.value && { urgent: true }),
       })

       // 转换后端数据格式为前端期望的格式
       // 后端直接返回数据，不是嵌套在data字段下
       const rawTasks = response?.rows || []
       console.log('加载任务数据:', rawTasks.length, '个任务')

       // 先转换后端数据格式为前端期望的格式
       const mappedTasks = rawTasks.map((task: any) => ({
         taskId: task.taskId.toString(), // 统一转换为字符串，避免长整数精度丢失
         enterpriseId: task.enterpriseId,
         taskTitle: task.taskTitle,
         taskDescription: task.taskDescription,
         taskType: task.taskType,
         skillTags: typeof task.skillTags === 'string' ? JSON.parse(task.skillTags) : task.skillTags,
         budgetMin: typeof task.budgetMin === 'string' ? parseFloat(task.budgetMin) : task.budgetMin,
         budgetMax: typeof task.budgetMax === 'string' ? parseFloat(task.budgetMax) : task.budgetMax,
         deadline: task.deadline,
         urgent: task.urgent,
         status: task.status,
         deliverables: task.deliverables,
         paymentTerms: task.paymentTerms,
         views: task.views,
         applications: task.applications,
         // 添加前端需要的字段，使用默认值
         location: '全国', // 后端没有地点字段，使用默认值
         experience: 'intermediate', // 后端没有经验字段，使用默认值
         publishDate: task.createTime || new Date().toISOString(), // 使用创建时间或当前时间
         company: task.enterprise?.enterpriseName || '未知企业',
         enterpriseName: task.enterprise?.enterpriseName || '未知企业', // 兼容现有代码
         enterprise: task.enterprise,
         // 保留原始任务数据用于草稿判断
         isDraft: task.isDraft,
         published: task.published,
         isPublished: task.isPublished,
         draftStatus: task.draftStatus
       }))

       // 过滤掉草稿任务，任务广场只显示已发布的任务
       marketplaceTasks.value = mappedTasks.filter(task => !isTaskDraft(task))

       console.log('过滤后的任务数据:', marketplaceTasks.value.length, '个已发布任务')
    } catch (error) {
      console.error('Failed to load marketplace tasks:', error)
      // 出错时使用mock数据
      marketplaceTasks.value = mockMarketplaceTasks
    } finally {
      loading.value = false
    }
  }
}

const loadMyTasks = async () => {
  if (shouldUseMockData()) {
    myTasksData.value = mockMyTasks
  } else {
    try {
      loading.value = true

      let response
      if (isEnterprise.value) {
        // 企业管理员：调用企业任务列表接口
        console.log('企业管理员访问我的任务，使用 /designer/enterprise/tasks/list 接口')
        response = await enterpriseTaskApi.list({
          pageNum: 1,
          pageSize: 50,
          ...(myTasksFilter.value !== 'all' && { status: myTasksFilter.value as any })
        })
      } else {
        // 设计师：调用设计师任务列表接口
        console.log('设计师访问我的任务，使用 /designer/task/list 接口')
        response = await designerApi.getMyTasks({
          pageNum: 1,
          pageSize: 50,
          ...(myTasksFilter.value !== 'all' && { status: myTasksFilter.value as any })
        })
      }

      // 根据智图工厂API响应格式调整数据结构
      const taskRows = response?.rows || response?.data?.rows || []

      if (isEnterprise.value) {
        // 企业管理员的任务数据格式
        myTasksData.value = taskRows.map((task: any) => ({
          id: task.taskId || task.id,
          name: task.taskTitle || task.title,
          client: task.enterprise?.enterpriseName || '我的企业',
          deadline: task.deadline,
          amount: task.budgetMin && task.budgetMax
            ? `¥${task.budgetMin.toLocaleString()} - ¥${task.budgetMax.toLocaleString()}`
            : `¥${(task.budgetMax || task.budgetMin || 0).toLocaleString()}`,
          status: mapTaskStatusToDisplay(task.status),
          applications: task.applications || 0,  // 添加申请人数字段
          // 保留原始状态信息，用于草稿判断
          originalStatus: task.status,
          isDraft: task.isDraft,
          published: task.published,
          isPublished: task.isPublished,
          draftStatus: task.draftStatus
        })) || []
      } else {
        // 设计师的任务数据格式
        myTasksData.value = taskRows.map((task: any) => ({
          id: task.taskId || task.id,
          name: task.taskTitle || task.title,
          client: task.enterprise?.enterpriseName || task.enterpriseName || '未知企业',
          deadline: task.deadline,
          amount: task.budgetMin && task.budgetMax
            ? `¥${task.budgetMin.toLocaleString()} - ¥${task.budgetMax.toLocaleString()}`
            : `¥${(task.budgetMax || task.proposedPrice || 0).toLocaleString()}`,
          status: mapTaskStatusToDisplay(task.status)
        })) || []
      }
    } catch (error) {
      console.error('Failed to load my tasks:', error)
      myTasksData.value = mockMyTasks
    } finally {
      loading.value = false
    }
  }
}

// 状态管理函数已迁移到 @/utils/taskStatusUtils

const loadPaymentRecords = async () => {
  if (shouldUseMockData()) {
    paymentRecords.value = mockPaymentRecords
    accountStats.value = mockAccountStats
  } else {
    try {
      loading.value = true

      // 使用设计师专用API获取收入记录
      const earningsResponse = await designerApi.getMyEarnings()
      const earningsRecords = (earningsResponse as any)?.records || earningsResponse?.data?.records || []
      paymentRecords.value = earningsRecords.map((payment: any) => ({
        id: payment.paymentId || payment.id,
        date: payment.paymentTime || payment.createTime,
        description: payment.taskTitle || payment.description || '任务收入',
        amount: `¥${(payment.amount || 0).toLocaleString()}`,
        type: '收入',
        status: mapPaymentStatusToDisplay(payment.status)
      })) || []

      // 加载设计师统计数据
      const statsResponse = await statsApi.getDesignerStats(1) // 需要获取当前设计师ID
      const stats = (statsResponse as any)?.data || statsResponse

      // 同时获取收入统计
      const earningsStats = (earningsResponse as any)?.stats || earningsResponse?.data?.stats

      accountStats.value = {
        balance: earningsStats?.totalEarnings || stats?.totalEarnings || 0,
        withdrawableAmount: earningsStats?.availableAmount || (stats?.totalEarnings || 0) * 0.8,
        monthlyIncome: earningsStats?.monthlyEarnings || 12500,
        monthlyGrowth: earningsStats?.monthlyGrowthRate || 15,
        pendingAmount: earningsStats?.pendingAmount || (stats?.totalEarnings || 0) * 0.2,
        pendingDays: earningsStats?.pendingDays || 3,
      }
    } catch (error) {
      console.error('Failed to load payment data:', error)
      paymentRecords.value = mockPaymentRecords
      accountStats.value = mockAccountStats
    } finally {
      loading.value = false
    }
  }
}

// 映射支付状态到显示文本
const mapPaymentStatusToDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': '处理中',
    'PAID': '已完成',
    'COMPLETED': '已完成',
    'FAILED': '失败',
    'REFUNDED': '已退款'
  }
  return statusMap[status] || '处理中'
}

// 计算属性
const taskCount = computed(() => marketplaceTasks.value.length)

const filteredTasks = computed(() => {
  let filtered = [...marketplaceTasks.value]

  // 任务类型筛选
  if (selectedTaskTypes.value.length > 0) {
    filtered = filtered.filter(task => selectedTaskTypes.value.includes(task.taskType))
  }

  // 城市筛选
  if (selectedCities.value.length > 0) {
    filtered = filtered.filter(task => task.location && selectedCities.value.includes(task.location))
  }

  // 经验筛选
  if (selectedExperience.value) {
    filtered = filtered.filter(task => task.experience && task.experience === selectedExperience.value)
  }

  // 价格范围筛选
  if (minPrice.value > 1000 || maxPrice.value < 50000) {
    filtered = filtered.filter(task => {
      return task.budgetMax >= minPrice.value && task.budgetMin <= maxPrice.value
    })
  }

  // 急聘筛选
  if (urgentTasks.value) {
    filtered = filtered.filter(task => task.urgent)
  }

  return filtered
})

const sortedTasks = computed(() => {
  const sorted = [...filteredTasks.value]

  switch (sortBy.value) {
    case 'price-high':
      sorted.sort((a, b) => b.budgetMax - a.budgetMax)
      break
    case 'price-low':
      sorted.sort((a, b) => a.budgetMin - b.budgetMin)
      break
    case 'latest':
      sorted.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      break
    case 'applications':
      sorted.sort((a, b) => b.applications - a.applications)
      break
    default:
      break
  }

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedTasks.value.length / itemsPerPage.value))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedTasks.value.slice(start, end)
})

const filteredTaskCount = computed(() => filteredTasks.value.length)

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// 活跃筛选条件数量
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedTaskTypes.value.length > 0) count += selectedTaskTypes.value.length
  if (selectedCities.value.length > 0) count += selectedCities.value.length
  if (selectedExperience.value) count += 1
  if (selectedPriceRange.value) count += 1
  if (selectedDeadline.value) count += 1
  if (urgentTasks.value) count += 1
  if (minPrice.value > 1000 || maxPrice.value < 50000) count += 1
  return count
})

// 方法
const toggleTaskType = (type: string) => {
  const index = selectedTaskTypes.value.indexOf(type)
  if (index > -1) {
    selectedTaskTypes.value.splice(index, 1)
  } else {
    selectedTaskTypes.value.push(type)
  }
  // 筛选条件变化后重新加载数据
  if (activeTab.value === 'marketplace') {
    loadMarketplaceTasks()
  }
}

const toggleCity = (city: string) => {
  const index = selectedCities.value.indexOf(city)
  if (index > -1) {
    selectedCities.value.splice(index, 1)
  } else {
    selectedCities.value.push(city)
  }
  // 筛选条件变化后重新加载数据
  if (activeTab.value === 'marketplace') {
    loadMarketplaceTasks()
  }
}

const resetFilters = () => {
  selectedTaskTypes.value = []
  selectedCities.value = []
  selectedExperience.value = ''
  selectedPriceRange.value = ''
  selectedDeadline.value = ''
  urgentTasks.value = false
  minPrice.value = 1000
  maxPrice.value = 50000
  // 重置筛选后重新加载数据
  if (activeTab.value === 'marketplace') {
    loadMarketplaceTasks()
  }
}

const formatPrice = (price: number) => {
  return `¥${price.toLocaleString()}`
}



const handleApplyTask = (taskId: string) => {
  console.log('Apply for task:', taskId)
  addHapticFeedback()
  // 这里可以添加申请任务的逻辑
}

const handleViewTaskDetail = (taskId: string) => {
  console.log('View task detail:', taskId)
  addHapticFeedback()

  // 找到对应的任务
  const task = marketplaceTasks.value.find(t => t.taskId === taskId)
  if (task) {
    selectedTask.value = task
    showTaskDetailModal.value = true
  }
}

// 处理从任务列表查看详情
const handleViewTaskDetailFromList = (taskId: number | string) => {
  console.log('View task detail from list:', taskId)
  addHapticFeedback()

  // 需要根据任务ID获取完整的任务信息
  // 这里暂时使用简单的查找方法，实际情况下可能需要调用API获取详细信息
  const task = marketplaceTasks.value.find(t => t.taskId === taskId.toString())
  if (task) {
    selectedTask.value = task
    showTaskDetailModal.value = true
  } else {
    // 如果在marketplace任务中找不到，可能需要调用API获取任务详情
    console.log('Task not found in marketplace, may need to fetch from API')
    // TODO: 实际实现时这里应该调用API获取任务详情
  }
}

// 处理弹窗中的申请任务
const handleTaskApply = (task: SimpleTask) => {
  console.log('Apply for task from modal:', task.taskId)
  // 这里可以添加申请任务的逻辑
  showTaskDetailModal.value = false
  addHapticFeedback()
}

// 处理企业管理员编辑任务
const handleTaskEdit = (task: SimpleTask) => {
  console.log('Edit task:', task.taskId)
  // 关闭弹窗
  showTaskDetailModal.value = false
  addHapticFeedback()

  // 更新本地的selectedTask为最新数据
  selectedTask.value = task

  // 如果当前正在编辑同一个任务，也更新editingTask
  if (editingTask.value && editingTask.value.taskId === task.taskId) {
    editingTask.value = task
  }

  // 重新获取任务列表数据
  if (activeTab.value === 'my-tasks') {
    loadMyTasks()
  } else if (activeTab.value === 'marketplace') {
    loadMarketplaceTasks()
  }
}

// 处理企业管理员管理申请
const handleManageApplications = (task: SimpleTask) => {
  console.log('Manage applications for task:', task.taskId)
  // 这里可以添加管理申请的逻辑
  showTaskDetailModal.value = false
  addHapticFeedback()
}

// 处理查看任务统计
const handleViewStatistics = (task: SimpleTask) => {
  console.log('View statistics for task:', task.taskId)
  // 这里可以添加查看统计的逻辑
  showTaskDetailModal.value = false
  addHapticFeedback()
}

// 处理从任务列表编辑任务
const handleEditTaskFromList = async (taskId: number | string) => {
  console.log('Edit task from list:', taskId)
  addHapticFeedback()

  try {
    const taskIdStr = taskId.toString()
    let task: SimpleTask | null = null

    // 首先尝试从当前任务列表中查找（优先使用本地数据，避免空白）
    task = marketplaceTasks.value.find(t => t.taskId === taskIdStr) || null

    if (task) {
      console.log('从本地marketplace任务列表中获取任务详情:', task)
    } else {
      // 如果在marketplace中找不到，尝试从我的任务数据中构造SimpleTask对象
      const myTask = myTasksData.value.find(t => t.id.toString() === taskIdStr)
      if (myTask) {
        try {
          // 调用API获取完整的任务详情
          console.log('从API获取任务详情，taskId:', taskId)
          // 注意：避免使用Number()转换，防止长整数精度丢失
          const response = await taskApi.get(taskId.toString())
          const taskDetail = response as any

          if (taskDetail) {
            // 构造SimpleTask对象
            task = {
              taskId: taskDetail?.taskId?.toString() || taskIdStr,
              enterpriseId: taskDetail?.enterpriseId || '',
              taskTitle: taskDetail?.taskTitle || myTask.name,
              taskDescription: taskDetail?.taskDescription || '',
              taskType: taskDetail?.taskType || 'UI_UX_DESIGN',
              skillTags: typeof taskDetail?.skillTags === 'string' ? JSON.parse(taskDetail.skillTags) : (taskDetail?.skillTags || []),
              budgetMin: taskDetail?.budgetMin || 0,
              budgetMax: taskDetail?.budgetMax || 0,
              deadline: taskDetail?.deadline || '',
              urgent: taskDetail?.urgent || false,
              status: taskDetail?.status || TaskStatus.PUBLISHED,
              deliverables: taskDetail?.deliverables || '',
              paymentTerms: taskDetail?.paymentTerms || '',
              views: taskDetail?.views || 0,
              applications: taskDetail?.applications || 0,
              location: '全国',
              experience: 'intermediate',
              publishDate: taskDetail?.createTime || new Date().toISOString(),
              company: taskDetail?.enterprise?.enterpriseName || '我的企业',
              enterpriseName: taskDetail?.enterprise?.enterpriseName || '我的企业',
              enterprise: taskDetail?.enterprise
            } as SimpleTask
            console.log('从API获取到的任务详情:', task)
          } else {
            console.warn('API返回空数据，使用基础任务信息')
            // 如果API返回空数据，使用基础信息构造任务对象
            task = {
              taskId: taskIdStr,
              enterpriseId: 0,
              taskTitle: myTask.name,
              taskDescription: '',
              taskType: 'UI_UX_DESIGN',
              skillTags: [],
              budgetMin: 0,
              budgetMax: 0,
              deadline: myTask.deadline || '',
              urgent: false,
              status: TaskStatus.PUBLISHED,
              deliverables: '',
              paymentTerms: '',
              views: 0,
              applications: 0,
              location: '全国',
              experience: 'intermediate',
              publishDate: new Date().toISOString(),
              company: myTask.client || '我的企业',
              enterpriseName: myTask.client || '我的企业',
              enterprise: { enterpriseName: myTask.client || '我的企业' }
            } as unknown as SimpleTask
          }
        } catch (apiError) {
          console.error('API调用失败，使用基础任务信息:', apiError)
          // API调用失败时，使用基础信息构造任务对象
          task = {
            taskId: taskIdStr,
            enterpriseId: 0,
            taskTitle: myTask.name,
            taskDescription: '',
            taskType: 'UI_UX_DESIGN',
            skillTags: [],
            budgetMin: 0,
            budgetMax: 0,
            deadline: myTask.deadline || '',
            urgent: false,
            status: TaskStatus.PUBLISHED,
            deliverables: '',
            paymentTerms: '',
            views: 0,
            applications: 0,
            location: '全国',
            experience: 'intermediate',
            publishDate: new Date().toISOString(),
            company: myTask.client || '我的企业',
            enterpriseName: myTask.client || '我的企业',
            enterprise: { enterpriseName: myTask.client || '我的企业' }
          } as unknown as SimpleTask
        }
      }
    }

    if (task) {
      console.log('设置编辑任务数据:', task)
      editingTask.value = task
      showEditModal.value = true
    } else {
      message.error('无法获取任务详情')
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    message.error('获取任务详情失败，请稍后重试')
  }
}

// 统一的草稿状态判断函数（与TaskEditModal保持一致）
const isTaskDraft = (task: any) => {
  // 首先检查显示状态（中文）
  if (task.status === '草稿') {
    return true
  }

  // 检查原始状态（如果有保留）
  const statusToCheck = task.originalStatus || task.status

  return task.isDraft === true ||
         task.isDraft === 'true' ||
         task.isDraft === 1 ||
         statusToCheck === 'DRAFT' ||
         statusToCheck === 'draft' ||
         statusToCheck === 'UNPUBLISHED' ||
         statusToCheck === 0 ||
         task.published === false ||
         task.published === 'false' ||
         task.published === 0 ||
         task.isPublished === false ||
         task.isPublished === 'false' ||
         task.isPublished === 0 ||
         task.draftStatus === true ||
         task.draftStatus === 'true' ||
         task.draftStatus === 1
}

// 处理任务编辑提交
const handleTaskSubmit = async (formData: any) => {
  // 重要提示：处理长整数ID时避免精度丢失
  // JavaScript的Number.MAX_SAFE_INTEGER为9007199254740991（16位）
  // 超过此范围的整数如1947843296806076419会被转换为1947843296806076400
  // 解决方案：始终使用字符串格式处理ID，避免Number()转换

  try {
    if (formData.taskId) {
      // 更新现有任务
      const originalTask = editingTask.value
      const wasOriginallyDraft = originalTask && isTaskDraft(originalTask as any)

      await enterpriseTaskApi.update(formData.taskId, {
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        taskType: formData.taskType,
        skillTags: JSON.stringify(formData.skillTags),
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        deadline: formData.deadline,
        urgent: formData.urgent,
        deliverables: formData.deliverables,
        paymentTerms: formData.paymentTerms,
      } as any)

      // 如果原来是草稿，现在不勾选草稿，则发布任务
      if (wasOriginallyDraft && !formData.isDraft) {
        await enterpriseTaskApi.publish(formData.taskId.toString())
        message.success('任务发布成功')
      } else {
        message.success('任务更新成功')
      }

      // 更新本地的编辑任务数据为最新值
      if (editingTask.value) {
        const updatedTask = {
          ...editingTask.value,
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          taskType: formData.taskType,
          skillTags: formData.skillTags,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          deadline: formData.deadline,
          urgent: formData.urgent,
          deliverables: formData.deliverables,
          paymentTerms: formData.paymentTerms,
          isDraft: wasOriginallyDraft && formData.isDraft, // 只有原来是草稿且用户勾选草稿时才保持草稿状态
        }
        editingTask.value = updatedTask

        // 同时更新本地任务列表中的对应任务数据
        const taskIdStr = formData.taskId?.toString()
        if (taskIdStr) {
          // 更新marketplace任务列表
          const marketplaceIndex = marketplaceTasks.value.findIndex(t => t.taskId === taskIdStr)
          if (marketplaceIndex !== -1) {
            marketplaceTasks.value[marketplaceIndex] = updatedTask
            console.log('已更新marketplace任务列表中的任务数据')
          }

          // 更新selectedTask（如果是同一个任务）
          if (selectedTask.value && selectedTask.value.taskId === taskIdStr) {
            selectedTask.value = updatedTask
            console.log('已更新selectedTask数据')
          }
        }
      }

      showEditModal.value = false

      // 重新获取任务列表数据
      if (activeTab.value === 'my-tasks') {
        loadMyTasks()
      } else if (activeTab.value === 'marketplace') {
        loadMarketplaceTasks()
      }
    } else {
      // 创建新任务
      // 第一步：创建任务（后端强制为草稿状态）
      const createResponse = await enterpriseTaskApi.create({
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        taskType: formData.taskType,
        skillTags: JSON.stringify(formData.skillTags),
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        deadline: formData.deadline,
        urgent: formData.urgent,
        deliverables: formData.deliverables,
        paymentTerms: formData.paymentTerms,
      } as any)

      // 从响应中获取新创建的任务ID（保持字符串格式）
      // 重要：JavaScript中超过16位的整数会失去精度，必须使用字符串格式处理ID
      const newTaskId = (createResponse as any)?.data?.taskId?.toString() ||
                        (createResponse as any)?.taskId?.toString() ||
                        (createResponse as any)?.id?.toString() ||
                        (createResponse as any)?.data?.id?.toString()

      if (!newTaskId) {
        console.error('无法获取新创建的任务ID:', createResponse)
        message.error('创建任务失败：无法获取任务ID')
        return
      }

      // 第二步：如果用户没有勾选"保存为草稿"，立即发布任务
      if (!formData.isDraft) {
        try {
          // 注意：直接使用字符串ID，避免Number()转换导致的精度丢失
          await enterpriseTaskApi.publish(newTaskId)
          message.success('任务发布成功')
        } catch (publishError) {
          console.error('发布任务失败:', publishError)
          message.error('任务创建成功，但发布失败，请稍后在任务列表中手动发布')
        }
      } else {
        message.success('草稿保存成功')
      }

      // 关闭弹窗并重置编辑状态
      showEditModal.value = false
      editingTask.value = null

      // 重新获取任务列表数据
      if (activeTab.value === 'my-tasks') {
        loadMyTasks()
      } else if (activeTab.value === 'marketplace') {
        loadMarketplaceTasks()
      }
    }
  } catch (error) {
    console.error('任务操作失败:', error)
    if (formData.taskId) {
      message.error('任务更新失败，请稍后重试')
    } else {
      message.error('任务创建失败，请稍后重试')
    }
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadMarketplaceTasks()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadMarketplaceTasks()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadMarketplaceTasks()
}

// 抽屉相关方法
const toggleFilterDrawer = () => {
  if (showFilterDrawer.value) {
    closeFilterDrawer()
  } else {
    openFilterDrawer()
  }
}

const openFilterDrawer = () => {
  showFilterDrawer.value = true
  setTimeout(() => {
    filterDrawerOpen.value = true
  }, 10)
  document.body.style.overflow = 'hidden'
}

const closeFilterDrawer = () => {
  filterDrawerOpen.value = false
  setTimeout(() => {
    showFilterDrawer.value = false
    document.body.style.overflow = ''
  }, 300)
}

// 监听筛选条件变化
const reloadData = () => {
  if (activeTab.value === 'marketplace') {
    loadMarketplaceTasks()
  } else if (activeTab.value === 'my-tasks') {
    loadMyTasks()
  } else if (activeTab.value === 'payment') {
    loadPaymentRecords()
  }
}

// 监听标签页变化
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  reloadData()
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', handleResize)
  // 初始加载数据
  loadMarketplaceTasks()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})

// 处理创建新任务
const handleCreateNewTask = () => {
  console.log('Create new task')
  addHapticFeedback()

  // 完全重置编辑状态
  editingTask.value = null
  selectedTask.value = null

  // 确保弹窗先关闭再打开，强制重新初始化
  showEditModal.value = false

  // 下一个tick中打开弹窗，确保状态完全重置
  nextTick(() => {
    showEditModal.value = true
  })
}

// 处理发布任务
const handlePublishTask = async (taskId: number | string) => {
  console.log('Publish task:', taskId)
  addHapticFeedback()

  try {
    // 调用发布任务API
    await enterpriseTaskApi.publish(taskId.toString())
    message.success('任务发布成功')

    // 重新加载任务列表数据
    if (activeTab.value === 'my-tasks') {
      loadMyTasks()
    } else if (activeTab.value === 'marketplace') {
      loadMarketplaceTasks()
    }
  } catch (error) {
    console.error('发布任务失败:', error)
    message.error('任务发布失败，请稍后重试')
  }
}

// 处理管理申请（从任务列表）
const handleManageApplicationsFromList = (taskId: number | string) => {
  console.log('Manage applications for task from list:', taskId)
  addHapticFeedback()
  // 这里可以添加管理申请的逻辑，比如跳转到申请管理页面
  // TODO: 实现管理申请的具体逻辑
}
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30" />
      <div class="container mx-auto px-10 relative z-10 title-section-container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 class="text-4xl font-bold mb-2 text-white">
              智图工厂
            </h1>
            <p class="text-gray-300 max-w-2xl">
              智能匹配设计需求与人才，汇聚 {{ taskCount.toLocaleString() }} 个设计任务，提供全流程任务管理与支付保障
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              v-if="isEnterprise"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              @click="handleCreateNewTask"
            >
              <i class="ri-add-line mr-2 text-lg" />
              发布任务
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 标签导航 -->
    <section class="py-4">
      <div class="container mx-auto px-4">
        <div class="glass-card rounded-lg p-4">
          <div class="flex space-x-6 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="px-4 py-2 whitespace-nowrap cursor-pointer rounded-lg transition-all"
              :class="activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'"
              @click="handleTabChange(tab.id)"
            >
              <i :class="tab.icon" class="mr-2" />
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 任务广场 -->
        <div v-if="activeTab === 'marketplace'" class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧筛选栏 - 桌面端显示 -->
          <div class="lg:w-1/4 hidden lg:block">
            <div class="filter-card rounded-lg p-6 sticky top-24">
              <div class="space-y-6">
                <!-- 任务类型筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">任务类型</h3>
                  <div class="space-y-2">
                    <label v-for="type in taskTypes" :key="type.value" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedTaskTypes.includes(type.value)"
                        @change="toggleTaskType(type.value)"
                      >
                      <span>{{ type.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 工作地点筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">工作地点</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="city in cities" :key="city" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        :checked="selectedCities.includes(city)"
                        @change="toggleCity(city)"
                      >
                      <span>{{ city }}</span>
                    </label>
                  </div>
                </div>

                <!-- 经验要求筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">经验要求</h3>
                  <div class="space-y-2">
                    <label v-for="exp in experiences" :key="exp.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedExperience"
                        type="radio"
                        name="experience"
                        class="custom-radio"
                        :value="exp.value"
                      >
                      <span>{{ exp.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 价格范围筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">价格范围</h3>
                  <div class="space-y-2">
                    <label v-for="range in priceRanges" :key="range.value" class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedPriceRange"
                        type="radio"
                        name="price-range"
                        class="custom-radio"
                        :value="range.value"
                      >
                      <span>{{ range.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 更多筛选 -->
                <div>
                  <h3 class="text-lg font-medium mb-3">更多筛选</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span>急聘任务</span>
                      <label class="custom-switch">
                        <input v-model="urgentTasks" type="checkbox" @change="loadMarketplaceTasks">
                        <span class="switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 筛选按钮 -->
                <div class="flex space-x-3 pt-2">
                  <button
                    class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
                    @click="resetFilters"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="lg:w-3/4 w-full">
            <!-- 排序和结果统计 -->
            <div class="glass-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="mb-4 sm:mb-0">
                <p class="text-gray-300">
                  找到 <span class="text-white font-medium">{{ filteredTaskCount }}</span> 个符合条件的任务
                </p>
              </div>
              <div class="flex items-center space-x-4 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                  <select
                    v-model="sortBy"
                    class="custom-select w-full sm:w-48 py-2 px-3 rounded-lg text-white focus:outline-none text-sm pr-8 bg-gray-800/80 border border-gray-700"
                    @change="loadMarketplaceTasks"
                  >
                    <option value="latest">最新发布</option>
                    <option value="price-high">价格从高到低</option>
                    <option value="price-low">价格从低到高</option>
                    <option value="applications">申请人数</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 任务列表 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 mb-8">
              <TaskCard
                v-for="task in paginatedTasks"
                :key="task.taskId"
                :task="task"
                :is-mobile="isMobile"
                @view-detail="handleViewTaskDetail"
                @apply-task="handleApplyTask"
              />
            </div>

            <!-- 分页 -->
            <div class="flex justify-center mt-10 mb-6">
              <div class="flex space-x-2">
                <button
                  :disabled="currentPage === 1"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="prevPage"
                >
                  <i class="ri-arrow-left-s-line" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg"
                  :class="[
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-blue-600/20',
                  ]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  class="pagination-button w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 disabled:opacity-50"
                  @click="nextPage"
                >
                  <i class="ri-arrow-right-s-line" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的任务 -->
        <div v-else-if="activeTab === 'my-tasks'" class="glass-card rounded-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-xl font-bold">我的任务</h3>
              <p v-if="isEnterprise" class="text-sm text-gray-400 mt-1">企业管理员视角 - 查看您发布的任务</p>
              <p v-else class="text-sm text-gray-400 mt-1">设计师视角 - 查看您参与的任务</p>
            </div>
            <div class="flex space-x-4">
              <!-- 企业管理员发布任务按钮 -->
              <button
                v-if="isEnterprise"
                class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center"
                @click="handleCreateNewTask"
              >
                <i class="ri-add-line mr-2" />
                发布新任务
              </button>

              <!-- 任务状态筛选按钮 -->
              <button
                v-for="filter in [
                  { value: 'all', label: '全部' },
                  { value: 'in-progress', label: '进行中' },
                  { value: 'completed', label: '已完成' },
                  { value: 'pending', label: '待确认' },
                ]"
                :key="filter.value"
                class="px-4 py-2 rounded-lg text-sm transition-colors"
                :class="myTasksFilter === filter.value ? 'bg-blue-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'"
                @click="myTasksFilter = filter.value; loadMyTasks()"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700/50">
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">任务名称</th>
                  <th v-if="isEnterprise" class="text-left py-3 px-4 text-gray-300 font-medium">申请人数</th>
                  <th v-else class="text-left py-3 px-4 text-gray-300 font-medium">客户</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">截止日期</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">金额</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">状态</th>
                  <th class="text-left py-3 px-4 text-gray-300 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in myTasksData" :key="task.id" class="border-b border-gray-700/30 hover:bg-gray-800/30">
                  <td class="py-4 px-4 text-white">{{ task.name }}</td>
                  <td v-if="isEnterprise" class="py-4 px-4 text-gray-300">
                    {{ task.applications || 0 }} 人申请
                  </td>
                  <td v-else class="py-4 px-4 text-gray-300">{{ task.client }}</td>
                  <td class="py-4 px-4 text-gray-300">{{ task.deadline }}</td>
                  <td class="py-4 px-4 text-green-400">{{ task.amount }}</td>
                  <td class="py-4 px-4">
                    <span
                      class="px-2 py-1 rounded-full text-xs"
                      :class="getTaskStatusClass(task.status)"
                    >
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button
                        class="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-sm hover:bg-blue-600/30 transition-colors"
                        @click="handleViewTaskDetailFromList(task.id)"
                      >
                        查看详情
                      </button>
                                            <!-- 草稿状态显示发布任务按钮 -->
                      <button
                        v-if="isEnterprise && isTaskDraft(task)"
                        class="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded text-sm hover:bg-green-600/30 transition-colors"
                        @click="handlePublishTask(task.id)"
                      >
                        发布任务
                      </button>
                      <!-- 非草稿状态显示管理申请按钮 -->
                      <button
                        v-else-if="isEnterprise && !isTaskDraft(task) && canManageTaskByDisplayStatus(task.status)"
                        class="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded text-sm hover:bg-purple-600/30 transition-colors"
                        @click="handleManageApplicationsFromList(task.id)"
                      >
                        管理申请
                      </button>
                      <button
                        v-if="isEnterprise && canEditTaskByDisplayStatus(task.status)"
                        class="px-3 py-1 bg-orange-600/20 text-orange-400 border border-orange-600/30 rounded text-sm hover:bg-orange-600/30 transition-colors"
                        @click="handleEditTaskFromList(task.id)"
                      >
                        编辑任务
                      </button>
                      <button
                        v-if="!isEnterprise && task.status === '进行中'"
                        class="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded text-sm hover:bg-green-600/30 transition-colors"
                      >
                        提交成果
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 智能匹配 -->
        <div v-else-if="activeTab === 'matching'" class="space-y-6">
          <!-- 个人技能档案 -->
          <div class="glass-card rounded-lg p-6">
            <h3 class="text-xl font-bold mb-6">个人技能档案</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-medium mb-4">技能评分</h4>
                <div class="space-y-4">
                  <div
                    v-for="skill in [
                      { name: 'UI/UX设计', score: 90 },
                      { name: '平面设计', score: 75 },
                      { name: '3D建模', score: 40 },
                      { name: '动效设计', score: 60 },
                    ]"
                    :key="skill.name"
                  >
                    <div class="flex justify-between mb-2">
                      <span class="text-sm text-gray-300">{{ skill.name }}</span>
                      <span class="text-sm text-blue-400">{{ skill.score }}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        :style="`width: ${skill.score}%`"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium mb-4">常用工具</h4>
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tool in ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects']"
                    :key="tool"
                    class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                  >
                    {{ tool }}
                  </span>
                </div>
                <h4 class="text-lg font-medium mb-4">偏好任务类型</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="type in ['移动应用UI', '网站设计', '品牌设计', '图标设计', '插画']"
                    :key="type"
                    class="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐任务 -->
          <div class="glass-card rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold">为您推荐的任务</h3>
              <button class="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                <i class="ri-refresh-line mr-2" />
                刷新推荐
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="task in paginatedTasks.slice(0, 4)"
                :key="task.taskId"
                class="relative"
              >
                <!-- 匹配度显示 -->
                <div class="absolute top-4 right-4 z-10 flex items-center">
                  <span class="text-sm font-medium text-green-400 mr-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                    匹配度 {{ Math.floor(Math.random() * 20) + 80 }}%
                  </span>
                  <div class="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                    <i class="ri-check-line text-green-400 text-sm" />
                  </div>
                </div>
                <!-- 任务卡片 -->
                <TaskCard
                  :task="task"
                  :is-mobile="isMobile"
                  @view-detail="handleViewTaskDetail"
                  @apply-task="handleApplyTask"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 支付中心 -->
        <div v-else-if="activeTab === 'payment'" class="space-y-6">
          <!-- 账户概览 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-card rounded-lg p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <h4 class="text-sm text-gray-300 mb-2">账户余额</h4>
              <div class="text-3xl font-bold text-white mb-4">¥{{ accountStats.balance.toLocaleString() }}.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">可提现金额</span>
                <span class="text-green-400">¥{{ accountStats.withdrawableAmount.toLocaleString() }}.00</span>
              </div>
            </div>
            <div class="glass-card rounded-lg p-6">
              <h4 class="text-sm text-gray-300 mb-2">本月收入</h4>
              <div class="text-3xl font-bold text-green-400 mb-4">¥{{ accountStats.monthlyIncome.toLocaleString() }}.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">较上月</span>
                <span class="text-green-400">+{{ accountStats.monthlyGrowth }}%</span>
              </div>
            </div>
            <div class="glass-card rounded-lg p-6">
              <h4 class="text-sm text-gray-300 mb-2">待结算</h4>
              <div class="text-3xl font-bold text-yellow-400 mb-4">¥{{ accountStats.pendingAmount.toLocaleString() }}.00</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-300">预计到账时间</span>
                <span class="text-yellow-400">{{ accountStats.pendingDays }}天内</span>
              </div>
            </div>
          </div>

          <!-- 交易记录 -->
          <div class="glass-card rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold">交易记录</h3>
              <div class="flex space-x-3">
                <button class="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                  <i class="ri-wallet-line mr-2" />
                  充值
                </button>
                <button class="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm hover:bg-green-600/30 transition-colors">
                  <i class="ri-bank-card-line mr-2" />
                  提现
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-700/50">
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">日期</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">描述</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">金额</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">类型</th>
                    <th class="text-left py-3 px-4 text-gray-300 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="record in paymentRecords" :key="record.id" class="border-b border-gray-700/30 hover:bg-gray-800/30">
                    <td class="py-4 px-4 text-gray-300">{{ record.date }}</td>
                    <td class="py-4 px-4 text-white">{{ record.description }}</td>
                    <td class="py-4 px-4" :class="record.type === '收入' ? 'text-green-400' : 'text-red-400'">
                      {{ record.type === '收入' ? '+' : '-' }}{{ record.amount }}
                    </td>
                    <td class="py-4 px-4 text-gray-300">{{ record.type }}</td>
                    <td class="py-4 px-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs"
                        :class="{
                          'bg-green-500/20 text-green-400': record.status === '已完成',
                          'bg-blue-500/20 text-blue-400': record.status === '处理中',
                          'bg-red-500/20 text-red-400': record.status === '失败',
                          'bg-yellow-500/20 text-yellow-400': record.status === '已退款',
                        }"
                      >
                        {{ record.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 移动端悬浮筛选按钮 -->
    <button
      v-if="isMobile && activeTab === 'marketplace'"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out z-40 lg:hidden flex items-center justify-center floating-filter-btn"
      :class="{ 'scale-110': showFilterDrawer }"
      @click="toggleFilterDrawer"
    >
      <i class="ri-filter-3-line text-xl" />
      <span
        v-if="activeFiltersCount > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium border-2 border-white"
      >
        {{ activeFiltersCount > 9 ? '9+' : activeFiltersCount }}
      </span>
    </button>

    <!-- 移动端筛选抽屉 -->
    <div
      v-if="showFilterDrawer"
      class="fixed inset-0 z-50 lg:hidden overflow-hidden filter-drawer-container"
      @click="closeFilterDrawer"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        class="absolute top-0 bottom-0 filter-card filter-drawer transform transition-transform duration-300 ease-out flex flex-col"
        :class="filterDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
        style="right: 0px; width: min(320px, 85vw);"
        @click.stop
      >
        <div class="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <h3 class="text-lg font-medium">筛选条件</h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors"
            @click="closeFilterDrawer"
          >
            <i class="ri-close-line" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <!-- 任务类型筛选 -->
            <div>
              <h3 class="text-lg font-medium mb-3">任务类型</h3>
              <div class="space-y-2">
                <label v-for="type in taskTypes" :key="type.value" class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="custom-checkbox"
                    :checked="selectedTaskTypes.includes(type.value)"
                    @change="toggleTaskType(type.value)"
                  >
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>
            <!-- 其他筛选项类似 -->
          </div>
        </div>
        <div class="border-t border-gray-700/50 p-6 flex-shrink-0">
          <button
            class="w-full py-2.5 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 transition-colors"
            @click="resetFilters"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="mt-16 py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">智图工厂</h3>
            <p class="text-gray-400 text-sm">
              智能匹配设计需求与人才，提供全流程任务管理与支付保障
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">功能模块</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">任务广场</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">智能匹配</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">任务管理</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-blue-400">支付中心</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-white">
              关于我们
            </h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/"
                  class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">公司介绍</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">联系方式</h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-mail-line mr-2" />
                1151386302@qq.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2" />
                150-7240-0560
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2" />
                湖北省武汉市洪山区
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8" />
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 亿思（湖北省）科技有限公司. 保留所有权利
          </p>
          <div class="flex space-x-4">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-weibo-line" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-wechat-line" />
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="ri-linkedin-line" />
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- 任务详情弹窗 -->
    <TaskDetailModal
      v-model:visible="showTaskDetailModal"
      :task="selectedTask"
      :loading="taskDetailLoading"
      @apply="handleTaskApply"
      @edit="handleTaskEdit"
      @manage-applications="handleManageApplications"
      @view-statistics="handleViewStatistics"
    />

    <!-- 任务编辑弹窗 -->
    <TaskEditModal
      v-model:visible="showEditModal"
      :task="editingTask"
      @submit="handleTaskSubmit"
    />
  </div>
</template>

<style>
@import '@/styles/talent.css';
@import '@/styles/skill-tags.css';

.talent-page {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
  font-size: 16px !important;
}

.talent-page p:not([class*="mb-"]):not([class*="my-"]):not([class*="m-"]) {
  margin-bottom: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 玻璃效果卡片 */
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 筛选卡片 */
.filter-card {
  background: rgba(28, 28, 30, 0.8);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}



/* 公司Logo */
.company-logo {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(99, 99, 102, 0.1);
}

/* 技能标签 */
.skill-tag {
  background: rgba(10, 132, 255, 0.2);
  border: 1px solid rgba(10, 132, 255, 0.3);
  color: #60a5fa;
}

/* 自定义复选框 */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 4px;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-checkbox:checked {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 自定义单选按钮 */
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
  background-color: transparent;
  display: inline-block;
  position: relative;
  margin-right: 8px;
  vertical-align: middle;
  cursor: pointer;
}

.custom-radio:checked {
  border-color: #0a84ff;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0a84ff;
}

/* 自定义开关 */
.custom-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-left: 8px;
}

.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(148, 163, 184, 0.2);
  transition: .4s;
  border-radius: 24px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .switch-slider {
  background-color: #0a84ff;
}

input:checked + .switch-slider:before {
  transform: translateX(20px);
}

/* 自定义选择框 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.custom-select:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 悬浮效果 */
.glow-border {
  position: relative;
}

.glow-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glow-border:hover::after {
  opacity: 1;
}

.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* 分页按钮 */
.pagination-button {
  transition: all 0.2s ease;
}

.pagination-button:hover:not(.active):not(:disabled) {
  background-color: rgba(10, 132, 255, 0.2);
}

.pagination-button:disabled {
  cursor: not-allowed;
}

/* 分割线 */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.2), transparent);
}

/* 混合导航模式样式 */
.mobile-card {
  position: relative;
}

.mobile-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 16px;
  width: 6px;
  height: 6px;
  border-top: 2px solid rgba(148, 163, 184, 0.4);
  border-right: 2px solid rgba(148, 163, 184, 0.4);
  transform: translateY(-50%) rotate(45deg);
  transition: all 0.3s ease;
}

.mobile-card:hover::after {
  border-color: rgba(10, 132, 255, 0.6);
  transform: translateY(-50%) rotate(45deg) scale(1.1);
}

.desktop-card {
  position: relative;
}

.desktop-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(10, 132, 255, 0.05), rgba(191, 90, 242, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: inherit;
  pointer-events: none;
}

.desktop-card:hover::before {
  opacity: 1;
}

.mobile-view-btn {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.15), rgba(191, 90, 242, 0.15));
  border: 1px solid rgba(10, 132, 255, 0.3);
}

.mobile-view-btn:hover {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.25), rgba(191, 90, 242, 0.25));
  transform: translateX(2px);
}

.desktop-view-btn:hover {
  background: rgba(10, 132, 255, 0.2);
  border-color: rgba(10, 132, 255, 0.5);
}

/* 悬浮筛选按钮样式 */
.floating-filter-btn {
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  animation: float 3s ease-in-out infinite;
}

.floating-filter-btn:hover {
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 抽屉样式 */
.filter-drawer {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-card {
    position: static !important;
  }

  .glass-card {
    margin: 0.5rem 0;
  }



  .floating-filter-btn {
    bottom: 1.5rem !important;
    right: 1.5rem !important;
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
}

@media (max-width: 1023px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .title-section-container {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  .filter-drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
