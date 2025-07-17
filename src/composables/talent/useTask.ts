import { ref, computed, onMounted } from 'vue'
import { taskApi, taskApplicationApi, paymentApi, statsApi } from '@/api/talent/task'
import type { Task, TaskQueryParams, TaskApplication, DesignerTaskStats, ClientTaskStats } from '@/types/talent/task'

export function useTask() {
  // 状态
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // 分页
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 筛选条件
  const filters = ref<TaskQueryParams>({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  })

  // 计算属性
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasMore = computed(() => currentPage.value < totalPages.value)
  const isEmpty = computed(() => tasks.value.length === 0)

  // 获取任务列表
  const fetchTasks = async (params?: Partial<TaskQueryParams>) => {
    try {
      loading.value = true
      error.value = null

      const queryParams = {
        ...filters.value,
        ...params,
        pageNum: params?.pageNum || currentPage.value,
        pageSize: params?.pageSize || pageSize.value,
      }

      const response = await taskApi.list(queryParams)

      if (response.code === 200) {
        tasks.value = response.rows || []
        total.value = response.total || 0
      } else {
        error.value = response.msg || '获取任务列表失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取任务详情
  const fetchTask = async (id: number): Promise<Task | null> => {
    try {
      const response = await taskApi.get(id)
      if (response.code === 200) {
        return response.data
      } else {
        error.value = response.msg || '获取任务详情失败'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取任务详情失败'
      return null
    }
  }

  // 创建任务
  const createTask = async (taskData: any) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.create(taskData)

      if (response.code === 200) {
        // 刷新列表
        await fetchTasks()
        return response.data
      } else {
        error.value = response.msg || '创建任务失败'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建任务失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新任务
  const updateTask = async (taskData: Partial<Task>) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.update(taskData)

      if (response.code === 200) {
        // 更新本地数据
        const index = tasks.value.findIndex(t => t.id === taskData.id)
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...taskData }
        }
        return response.data
      } else {
        error.value = response.msg || '更新任务失败'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新任务失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 删除任务
  const deleteTask = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.delete([id])

      if (response.code === 200) {
        // 从本地数据中移除
        tasks.value = tasks.value.filter(t => t.id !== id)
        total.value--
        return true
      } else {
        error.value = response.msg || '删除任务失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除任务失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 申请任务
  const applyTask = async (taskId: number, applicationData: any) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApplicationApi.apply({
        taskId,
        ...applicationData,
      })

      if (response.code === 200) {
        // 更新任务的申请人数
        const taskIndex = tasks.value.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          tasks.value[taskIndex].applications++
        }
        return response.data
      } else {
        error.value = response.msg || '申请任务失败'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '申请任务失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 取消任务
  const cancelTask = async (id: number, reason: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.cancel(id, reason)

      if (response.code === 200) {
        // 更新本地数据
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index].status = 'cancelled' as any
        }
        return true
      } else {
        error.value = response.msg || '取消任务失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '取消任务失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 完成任务
  const completeTask = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.complete(id)

      if (response.code === 200) {
        // 更新本地数据
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index].status = 'completed' as any
        }
        return true
      } else {
        error.value = response.msg || '完成任务失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '完成任务失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取推荐任务
  const fetchRecommendedTasks = async (designerId: number, limit: number = 10) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.getRecommended(designerId, limit)

      if (response.code === 200) {
        return response.data || []
      } else {
        error.value = response.msg || '获取推荐任务失败'
        return []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取推荐任务失败'
      return []
    } finally {
      loading.value = false
    }
  }

  // 获取热门任务
  const fetchHotTasks = async (limit: number = 10) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApi.getHot(limit)

      if (response.code === 200) {
        return response.data || []
      } else {
        error.value = response.msg || '获取热门任务失败'
        return []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取热门任务失败'
      return []
    } finally {
      loading.value = false
    }
  }

  // 设置筛选条件
  const setFilters = (newFilters: Partial<TaskQueryParams>) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1 // 重置页码
  }

  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      pageNum: 1,
      pageSize: pageSize.value,
    }
    currentPage.value = 1
  }

  // 分页控制
  const changePage = (page: number) => {
    currentPage.value = page
    fetchTasks({ pageNum: page })
  }

  const nextPage = () => {
    if (hasMore.value) {
      changePage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      changePage(currentPage.value - 1)
    }
  }

  // 搜索任务
  const searchTasks = async (query: string) => {
    setFilters({ title: query })
    await fetchTasks()
  }

  // 按类型筛选
  const filterByType = async (taskType: string) => {
    setFilters({ taskType: taskType as any })
    await fetchTasks()
  }

  // 按地区筛选
  const filterByLocation = async (location: string) => {
    setFilters({ location })
    await fetchTasks()
  }

  // 按价格筛选
  const filterByPrice = async (minPrice: number, maxPrice: number) => {
    setFilters({ minPrice, maxPrice })
    await fetchTasks()
  }

  // 按状态筛选
  const filterByStatus = async (status: string) => {
    setFilters({ status: status as any })
    await fetchTasks()
  }

  // 排序
  const sortTasks = async (sortBy: string) => {
    setFilters({ sortBy: sortBy as any })
    await fetchTasks()
  }

  // 刷新数据
  const refresh = async () => {
    await fetchTasks()
  }

  // 加载更多
  const loadMore = async () => {
    if (hasMore.value && !loading.value) {
      await fetchTasks({ pageNum: currentPage.value + 1 })
      currentPage.value++
    }
  }

  return {
    // 状态
    tasks,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filters,

    // 计算属性
    totalPages,
    hasMore,
    isEmpty,

    // 方法
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    applyTask,
    cancelTask,
    completeTask,
    fetchRecommendedTasks,
    fetchHotTasks,
    setFilters,
    resetFilters,
    changePage,
    nextPage,
    prevPage,
    searchTasks,
    filterByType,
    filterByLocation,
    filterByPrice,
    filterByStatus,
    sortTasks,
    refresh,
    loadMore,
  }
}

export function useTaskApplication() {
  // 状态
  const applications = ref<TaskApplication[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // 获取申请列表
  const fetchApplications = async (params?: any) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApplicationApi.list(params)

      if (response.code === 200) {
        applications.value = response.rows || []
        total.value = response.total || 0
      } else {
        error.value = response.msg || '获取申请列表失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取申请列表失败'
    } finally {
      loading.value = false
    }
  }

  // 审核申请
  const reviewApplication = async (id: number, approved: boolean, reason?: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApplicationApi.review(id, approved, reason)

      if (response.code === 200) {
        // 更新本地数据
        const index = applications.value.findIndex(app => app.id === id)
        if (index !== -1) {
          applications.value[index].status = approved ? 'approved' : 'rejected'
        }
        return true
      } else {
        error.value = response.msg || '审核申请失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '审核申请失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 撤回申请
  const withdrawApplication = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await taskApplicationApi.withdraw(id)

      if (response.code === 200) {
        // 更新本地数据
        const index = applications.value.findIndex(app => app.id === id)
        if (index !== -1) {
          applications.value[index].status = 'withdrawn'
        }
        return true
      } else {
        error.value = response.msg || '撤回申请失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '撤回申请失败'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    applications,
    loading,
    error,
    total,
    fetchApplications,
    reviewApplication,
    withdrawApplication,
  }
}

export function useTaskStats() {
  // 状态
  const stats = ref<any>({})
  const designerStats = ref<DesignerTaskStats | null>(null)
  const clientStats = ref<ClientTaskStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取设计师统计
  const fetchDesignerStats = async (designerId: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await statsApi.getDesignerStats(designerId)

      if (response.code === 200) {
        designerStats.value = response.data
      } else {
        error.value = response.msg || '获取设计师统计失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取设计师统计失败'
    } finally {
      loading.value = false
    }
  }

  // 获取客户统计
  const fetchClientStats = async (clientId: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await statsApi.getClientStats(clientId)

      if (response.code === 200) {
        clientStats.value = response.data
      } else {
        error.value = response.msg || '获取客户统计失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取客户统计失败'
    } finally {
      loading.value = false
    }
  }

  // 获取总体统计
  const fetchOverallStats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await statsApi.getOverallStats()

      if (response.code === 200) {
        stats.value = response.data
      } else {
        error.value = response.msg || '获取总体统计失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取总体统计失败'
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    designerStats,
    clientStats,
    loading,
    error,
    fetchDesignerStats,
    fetchClientStats,
    fetchOverallStats,
  }
}

export function usePayment() {
  // 状态
  const payments = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // 获取支付记录
  const fetchPayments = async (params?: any) => {
    try {
      loading.value = true
      error.value = null

      const response = await paymentApi.list(params)

      if (response.code === 200) {
        payments.value = response.rows || []
        total.value = response.total || 0
      } else {
        error.value = response.msg || '获取支付记录失败'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取支付记录失败'
    } finally {
      loading.value = false
    }
  }

  // 创建支付订单
  const createPayment = async (taskId: number, amount: number, paymentMethod: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await paymentApi.createOrder(taskId, amount, paymentMethod)

      if (response.code === 200) {
        return response.data
      } else {
        error.value = response.msg || '创建支付订单失败'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建支付订单失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 确认支付
  const confirmPayment = async (paymentId: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await paymentApi.confirm(paymentId)

      if (response.code === 200) {
        // 更新本地数据
        const index = payments.value.findIndex(p => p.id === paymentId)
        if (index !== -1) {
          payments.value[index].status = 'completed'
        }
        return true
      } else {
        error.value = response.msg || '确认支付失败'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '确认支付失败'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    payments,
    loading,
    error,
    total,
    fetchPayments,
    createPayment,
    confirmPayment,
  }
}
