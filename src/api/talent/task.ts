import request from '@/utils/request'
import type {
  Task,
  TaskApplication,
  TaskApplicationFormData,
  TaskApplicationQueryParams,
  TaskDeliverable,
  TaskDeliverableFormData,
  TaskFormData,
  TaskQueryParams,
  TaskStats,
  DesignerTaskStats,
  ClientTaskStats,
  Payment,
  PaymentQueryParams,
  TaskNotification,
  TaskMatch,
  MatchingCriteria,
  Client,
} from '@/types/talent/task'

// 任务管理API
export const taskApi = {
  // 查询任务列表
  list: (query: TaskQueryParams) => {
    return request({
      url: '/task/task/list',
      method: 'get',
      params: query,
    })
  },

  // 获取任务详情
  get: (id: number) => {
    return request({
      url: `/task/task/${id}`,
      method: 'get',
    })
  },

  // 创建任务
  create: (data: TaskFormData) => {
    return request({
      url: '/task/task',
      method: 'post',
      data,
    })
  },

  // 更新任务
  update: (data: Partial<Task>) => {
    return request({
      url: '/task/task',
      method: 'put',
      data,
    })
  },

  // 删除任务
  delete: (ids: number[]) => {
    return request({
      url: `/task/task/${ids.join(',')}`,
      method: 'delete',
    })
  },

  // 获取推荐任务
  getRecommended: (designerId: number, limit: number = 10) => {
    return request({
      url: `/task/task/recommended/${designerId}`,
      method: 'get',
      params: { limit },
    })
  },

  // 获取热门任务
  getHot: (limit: number = 10) => {
    return request({
      url: '/task/task/hot',
      method: 'get',
      params: { limit },
    })
  },

  // 获取任务统计
  getStats: (clientId?: number) => {
    return request({
      url: '/task/task/stats',
      method: 'get',
      params: clientId ? { clientId } : undefined,
    })
  },

  // 发布任务
  publish: (taskId: number) => {
    return request({
      url: `/task/task/${taskId}/publish`,
      method: 'post',
    })
  },

  // 暂停任务
  pause: (taskId: number) => {
    return request({
      url: `/task/task/${taskId}/pause`,
      method: 'post',
    })
  },

  // 恢复任务
  resume: (taskId: number) => {
    return request({
      url: `/task/task/${taskId}/resume`,
      method: 'post',
    })
  },

  // 取消任务
  cancel: (taskId: number, reason: string) => {
    return request({
      url: `/task/task/${taskId}/cancel`,
      method: 'post',
      data: { reason },
    })
  },

  // 完成任务
  complete: (taskId: number) => {
    return request({
      url: `/task/task/${taskId}/complete`,
      method: 'post',
    })
  },
}

// 任务申请API
export const taskApplicationApi = {
  // 查询申请列表
  list: (query: TaskApplicationQueryParams) => {
    return request({
      url: '/task/application/list',
      method: 'get',
      params: query,
    })
  },

  // 获取申请详情
  get: (id: number) => {
    return request({
      url: `/task/application/${id}`,
      method: 'get',
    })
  },

  // 提交申请
  apply: (data: TaskApplicationFormData) => {
    return request({
      url: '/task/application',
      method: 'post',
      data,
    })
  },

  // 撤回申请
  withdraw: (id: number) => {
    return request({
      url: `/task/application/${id}/withdraw`,
      method: 'post',
    })
  },

  // 审核申请
  review: (id: number, approved: boolean, reason?: string) => {
    return request({
      url: `/task/application/${id}/review`,
      method: 'post',
      data: { approved, reason },
    })
  },

  // 获取设计师申请统计
  getDesignerStats: (designerId: number) => {
    return request({
      url: `/task/application/designer/${designerId}/stats`,
      method: 'get',
    })
  },

  // 获取任务申请统计
  getTaskStats: (taskId: number) => {
    return request({
      url: `/task/application/task/${taskId}/stats`,
      method: 'get',
    })
  },
}

// 任务交付API
export const taskDeliverableApi = {
  // 查询交付列表
  list: (taskId: number) => {
    return request({
      url: `/task/deliverable/list`,
      method: 'get',
      params: { taskId },
    })
  },

  // 获取交付详情
  get: (id: number) => {
    return request({
      url: `/task/deliverable/${id}`,
      method: 'get',
    })
  },

  // 提交交付物
  submit: (data: TaskDeliverableFormData) => {
    return request({
      url: '/task/deliverable',
      method: 'post',
      data,
    })
  },

  // 审核交付物
  review: (id: number, approved: boolean, feedback?: string) => {
    return request({
      url: `/task/deliverable/${id}/review`,
      method: 'post',
      data: { approved, feedback },
    })
  },

  // 请求修改
  requestRevision: (id: number, feedback: string) => {
    return request({
      url: `/task/deliverable/${id}/request-revision`,
      method: 'post',
      data: { feedback },
    })
  },

  // 更新交付物
  update: (id: number, data: Partial<TaskDeliverable>) => {
    return request({
      url: `/task/deliverable/${id}`,
      method: 'put',
      data,
    })
  },

  // 删除交付物
  delete: (id: number) => {
    return request({
      url: `/task/deliverable/${id}`,
      method: 'delete',
    })
  },

  // 下载交付物
  download: (id: number) => {
    return request({
      url: `/task/deliverable/${id}/download`,
      method: 'get',
      responseType: 'blob',
    })
  },
}

// 支付API
export const paymentApi = {
  // 查询支付记录
  list: (query: PaymentQueryParams) => {
    return request({
      url: '/task/payment/list',
      method: 'get',
      params: query,
    })
  },

  // 获取支付详情
  get: (id: number) => {
    return request({
      url: `/task/payment/${id}`,
      method: 'get',
    })
  },

  // 创建支付订单
  createOrder: (taskId: number, amount: number, paymentMethod: string) => {
    return request({
      url: '/task/payment/create-order',
      method: 'post',
      data: { taskId, amount, paymentMethod },
    })
  },

  // 确认支付
  confirm: (paymentId: number) => {
    return request({
      url: `/task/payment/${paymentId}/confirm`,
      method: 'post',
    })
  },

  // 申请退款
  refund: (paymentId: number, reason: string) => {
    return request({
      url: `/task/payment/${paymentId}/refund`,
      method: 'post',
      data: { reason },
    })
  },

  // 获取收入统计
  getIncomeStats: (designerId: number, startDate?: string, endDate?: string) => {
    return request({
      url: `/task/payment/income/stats`,
      method: 'get',
      params: { designerId, startDate, endDate },
    })
  },

  // 获取支出统计
  getExpenseStats: (clientId: number, startDate?: string, endDate?: string) => {
    return request({
      url: `/task/payment/expense/stats`,
      method: 'get',
      params: { clientId, startDate, endDate },
    })
  },

  // 获取平台交易统计
  getPlatformStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/task/payment/platform/stats',
      method: 'get',
      params: { startDate, endDate },
    })
  },
}

// 客户API
export const clientApi = {
  // 查询客户列表
  list: (query: { pageNum?: number; pageSize?: number; clientName?: string }) => {
    return request({
      url: '/task/client/list',
      method: 'get',
      params: query,
    })
  },

  // 获取客户详情
  get: (id: number) => {
    return request({
      url: `/task/client/${id}`,
      method: 'get',
    })
  },

  // 更新客户信息
  update: (data: Partial<Client>) => {
    return request({
      url: '/task/client',
      method: 'put',
      data,
    })
  },

  // 获取客户统计
  getStats: (clientId: number) => {
    return request({
      url: `/task/client/${clientId}/stats`,
      method: 'get',
    })
  },

  // 获取客户评价
  getRating: (clientId: number) => {
    return request({
      url: `/task/client/${clientId}/rating`,
      method: 'get',
    })
  },
}

// 通知API
export const notificationApi = {
  // 查询通知列表
  list: (userId: number, pageNum?: number, pageSize?: number) => {
    return request({
      url: '/task/notification/list',
      method: 'get',
      params: { userId, pageNum, pageSize },
    })
  },

  // 标记已读
  markAsRead: (id: number) => {
    return request({
      url: `/task/notification/${id}/read`,
      method: 'post',
    })
  },

  // 批量标记已读
  markAllAsRead: (userId: number) => {
    return request({
      url: `/task/notification/read-all`,
      method: 'post',
      data: { userId },
    })
  },

  // 获取未读数量
  getUnreadCount: (userId: number) => {
    return request({
      url: `/task/notification/unread-count`,
      method: 'get',
      params: { userId },
    })
  },

  // 删除通知
  delete: (id: number) => {
    return request({
      url: `/task/notification/${id}`,
      method: 'delete',
    })
  },
}

// 智能匹配API
export const matchingApi = {
  // 获取任务匹配推荐
  getTaskMatches: (designerId: number, criteria?: MatchingCriteria) => {
    return request({
      url: `/task/matching/tasks`,
      method: 'post',
      data: { designerId, ...criteria },
    })
  },

  // 获取设计师匹配推荐
  getDesignerMatches: (taskId: number, limit: number = 10) => {
    return request({
      url: `/task/matching/designers`,
      method: 'get',
      params: { taskId, limit },
    })
  },

  // 更新匹配偏好
  updatePreferences: (designerId: number, preferences: MatchingCriteria) => {
    return request({
      url: `/task/matching/preferences`,
      method: 'post',
      data: { designerId, preferences },
    })
  },

  // 获取匹配偏好
  getPreferences: (designerId: number) => {
    return request({
      url: `/task/matching/preferences/${designerId}`,
      method: 'get',
    })
  },

  // 反馈匹配质量
  feedback: (designerId: number, taskId: number, rating: number, feedback: string) => {
    return request({
      url: `/task/matching/feedback`,
      method: 'post',
      data: { designerId, taskId, rating, feedback },
    })
  },
}

// 文件上传API
export const uploadApi = {
  // 上传任务附件
  uploadTaskAttachment: (file: File, taskId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('taskId', taskId.toString())

    return request({
      url: '/task/upload/attachment',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 上传交付物文件
  uploadDeliverable: (file: File, taskId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('taskId', taskId.toString())

    return request({
      url: '/task/upload/deliverable',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 上传客户头像
  uploadClientAvatar: (file: File, clientId: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('clientId', clientId.toString())

    return request({
      url: '/task/upload/client-avatar',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// 任务统计API
export const statsApi = {
  // 获取总体统计
  getOverallStats: () => {
    return request({
      url: '/task/stats/overall',
      method: 'get',
    })
  },

  // 获取设计师统计
  getDesignerStats: (designerId: number): Promise<{ data: DesignerTaskStats }> => {
    return request({
      url: `/task/stats/designer/${designerId}`,
      method: 'get',
    })
  },

  // 获取客户统计
  getClientStats: (clientId: number): Promise<{ data: ClientTaskStats }> => {
    return request({
      url: `/task/stats/client/${clientId}`,
      method: 'get',
    })
  },

  // 获取任务类型统计
  getTaskTypeStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/task/stats/task-types',
      method: 'get',
      params: { startDate, endDate },
    })
  },

  // 获取地区统计
  getLocationStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/task/stats/locations',
      method: 'get',
      params: { startDate, endDate },
    })
  },

  // 获取月度统计
  getMonthlyStats: (year: number) => {
    return request({
      url: '/task/stats/monthly',
      method: 'get',
      params: { year },
    })
  },
}
