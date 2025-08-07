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

// 基础任务管理API（根据智图工厂文档设计）
export const taskApi = {
  // 查询任务列表
  list: (query: TaskQueryParams) => {
    return request({
      url: '/designer/task/list',
      method: 'get',
      params: query,
    })
  },

  // 获取任务详情
  get: (id: string | number) => {
    return request({
      url: `/designer/task/${id}`,
      method: 'get',
    })
  },

  // 创建任务（仅企业管理员）
  create: (data: TaskFormData) => {
    return request({
      url: '/designer/task',
      method: 'post',
      data,
    })
  },

  // 更新任务（仅企业管理员）
  update: (data: Partial<Task>) => {
    return request({
      url: '/designer/task',
      method: 'put',
      data,
    })
  },

  // 删除任务（仅企业管理员）
  delete: (ids: number[]) => {
    return request({
      url: `/designer/task/${ids.join(',')}`,
      method: 'delete',
    })
  },

  // 获取推荐任务
  getRecommended: (designerId?: number, limit: number = 10) => {
    return request({
      url: '/designer/task/recommended',
      method: 'get',
      params: { designerId, limit },
    })
  },

  // 获取热门任务
  getHot: (limit: number = 10) => {
    return request({
      url: '/designer/task/hot',
      method: 'get',
      params: { limit },
    })
  },

  // 获取任务统计
  getStats: (enterpriseId?: number) => {
    return request({
      url: '/designer/task/stats',
      method: 'get',
      params: enterpriseId ? { enterpriseId } : undefined,
    })
  },
}

// 企业专用任务管理API
export const enterpriseTaskApi = {
  // 获取当前企业的任务列表
  list: (query?: TaskQueryParams) => {
    return request({
      url: '/designer/enterprise/tasks/list',
      method: 'get',
      params: query,
    })
  },

  // 企业发布任务
  create: (data: TaskFormData) => {
    return request({
      url: '/designer/enterprise/tasks',
      method: 'post',
      data,
    })
  },

  // 企业修改任务
  update: (id: string | number, data: Partial<Task>) => {
    return request({
      url: `/designer/enterprise/tasks/${id}`,
      method: 'put',
      data,
    })
  },

  // 企业删除任务
  delete: (id: string | number) => {
    return request({
      url: `/designer/enterprise/tasks/${id}`,
      method: 'delete',
    })
  },

  // 发布任务
  publish: (id: string | number) => {
    return request({
      url: `/designer/enterprise/tasks/${id}/publish`,
      method: 'post',
    })
  },

  // 取消任务
  cancel: (id: string | number, reason?: string) => {
    return request({
      url: `/designer/enterprise/tasks/${id}/cancel`,
      method: 'post',
      data: { reason },
    })
  },
}

// 任务申请API（支持双重审核机制）
export const taskApplicationApi = {
  // 查询申请列表
  list: (query: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/task-application/list',
      method: 'get',
      params: query,
    })
  },

  // 获取申请详情
  get: (id: number) => {
    return request({
      url: `/designer/task-application/${id}`,
      method: 'get',
    })
  },

  // 申请任务
  apply: (data: TaskApplicationFormData) => {
    return request({
      url: '/designer/task-application/apply',
      method: 'post',
      data,
    })
  },

  // 撤回申请（设计师）
  withdraw: (id: number) => {
    return request({
      url: '/designer/task-application/withdraw',
      method: 'put',
      data: { applicationId: id },
    })
  },

  // 系统管理员审核
  adminReview: (id: number, status: 'APPROVED' | 'REJECTED', feedback?: string) => {
    return request({
      url: `/designer/task-application/${id}/admin-review`,
      method: 'post',
      data: { status, feedback },
    })
  },

  // 企业管理员审核
  enterpriseReview: (id: number, status: 'APPROVED' | 'REJECTED', feedback?: string) => {
    return request({
      url: `/designer/task-application/${id}/enterprise-review`,
      method: 'post',
      data: { status, feedback },
    })
  },

  // 获取系统管理员待审核列表
  getAdminPendingList: (query?: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/task-application/admin/pending',
      method: 'get',
      params: query,
    })
  },

  // 获取企业管理员待审核列表
  getEnterprisePendingList: (query?: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/task-application/enterprise/pending',
      method: 'get',
      params: query,
    })
  },

  // 获取设计师申请统计
  getDesignerStats: (designerId: number) => {
    return request({
      url: `/designer/task-application/designer/${designerId}/stats`,
      method: 'get',
    })
  },

  // 获取任务申请统计
  getTaskStats: (taskId: number) => {
    return request({
      url: `/designer/task-application/task/${taskId}/stats`,
      method: 'get',
    })
  },
}

// 任务交付API（文本交付创新模式）
export const taskDeliverableApi = {
  // 查询交付物列表
  list: (taskId?: number, designerId?: number) => {
    return request({
      url: '/designer/task-deliverable/list',
      method: 'get',
      params: { taskId, designerId },
    })
  },

  // 获取交付详情
  get: (id: number) => {
    return request({
      url: `/designer/task-deliverable/${id}`,
      method: 'get',
    })
  },

  // 提交交付物链接（设计师）
  submit: (data: TaskDeliverableFormData) => {
    return request({
      url: '/designer/task-deliverable',
      method: 'post',
      data,
    })
  },

  // 更新交付物链接
  update: (id: number, data: Partial<TaskDeliverable>) => {
    return request({
      url: `/designer/task-deliverable/${id}`,
      method: 'put',
      data,
    })
  },

  // 删除交付物
  delete: (id: number) => {
    return request({
      url: `/designer/task-deliverable/${id}`,
      method: 'delete',
    })
  },

  // 审核交付物（企业管理员）
  review: (id: number, status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED', feedback?: string) => {
    return request({
      url: `/designer/task-deliverable/${id}/review`,
      method: 'post',
      data: { status, feedback },
    })
  },
}

// 任务配置管理API（动态审核模式控制）
export const taskConfigApi = {
  // 获取当前任务配置信息
  getInfo: () => {
    return request({
      url: '/designer/task-config/info',
      method: 'get',
    })
  },

  // 动态切换审核模式
  updateReviewMode: (mode: 'DUAL' | 'ENTERPRISE') => {
    return request({
      url: `/designer/task-config/review-mode/${mode}`,
      method: 'post',
    })
  },

  // 重置配置为默认值
  reset: () => {
    return request({
      url: '/designer/task-config/reset',
      method: 'post',
    })
  },

  // 获取支持的审核模式列表
  getReviewModes: () => {
    return request({
      url: '/designer/task-config/review-modes',
      method: 'get',
    })
  },
}

// 支付API
export const paymentApi = {
  // 查询支付记录
  list: (query: PaymentQueryParams) => {
    return request({
      url: '/designer/task-payment/list',
      method: 'get',
      params: query,
    })
  },

  // 获取支付详情
  get: (id: number) => {
    return request({
      url: `/designer/task-payment/${id}`,
      method: 'get',
    })
  },

  // 创建支付订单
  createOrder: (taskId: number, amount: number, paymentMethod: string) => {
    return request({
      url: '/designer/task-payment/create-order',
      method: 'post',
      data: { taskId, amount, paymentMethod },
    })
  },

  // 确认支付
  confirm: (paymentId: number) => {
    return request({
      url: `/designer/task-payment/${paymentId}/confirm`,
      method: 'post',
    })
  },

  // 申请退款
  refund: (paymentId: number, reason: string) => {
    return request({
      url: `/designer/task-payment/${paymentId}/refund`,
      method: 'post',
      data: { reason },
    })
  },

  // 获取收入统计
  getIncomeStats: (designerId: number, startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/task-payment/income/stats',
      method: 'get',
      params: { designerId, startDate, endDate },
    })
  },

  // 获取支出统计
  getExpenseStats: (enterpriseId: number, startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/task-payment/expense/stats',
      method: 'get',
      params: { enterpriseId, startDate, endDate },
    })
  },

  // 获取平台交易统计
  getPlatformStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/task-payment/platform/stats',
      method: 'get',
      params: { startDate, endDate },
    })
  },
}

// 设计师专用API（用于获取自己的申请记录）
export const designerApi = {
  // 获取我的申请记录
  getMyApplications: (query?: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/my-applications/list',
      method: 'get',
      params: query,
    })
  },

  // 获取我的任务记录
  getMyTasks: (query?: TaskQueryParams) => {
    return request({
      url: '/designer/my-tasks/list',
      method: 'get',
      params: query,
    })
  },

  // 获取我的收入统计
  getMyEarnings: (startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/my-earnings/stats',
      method: 'get',
      params: { startDate, endDate },
    })
  },
}

// 企业专用申请管理API
export const enterpriseApplicationApi = {
  // 获取企业的申请列表（完全隐藏系统管理员信息）
  getApplications: (query?: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/enterprise/applications/list',
      method: 'get',
      params: query,
    })
  },

  // 企业管理员审核申请
  reviewApplication: (applicationId: number, data: { decision: 'APPROVED' | 'REJECTED'; feedback?: string }) => {
    return request({
      url: `/designer/enterprise/applications/${applicationId}/review`,
      method: 'post',
      data,
    })
  },

  // 获取企业申请统计
  getApplicationStats: () => {
    return request({
      url: '/designer/enterprise/applications/stats',
      method: 'get',
    })
  },
}

// 系统管理员专用审核API
export const adminReviewApi = {
  // 获取系统管理员待审核申请列表
  getPendingApplications: (query?: TaskApplicationQueryParams) => {
    return request({
      url: '/designer/admin/applications/pending',
      method: 'get',
      params: query,
    })
  },

  // 系统管理员审核申请
  reviewApplication: (applicationId: number, data: { status: 'APPROVED' | 'REJECTED'; feedback?: string }) => {
    return request({
      url: `/designer/admin/applications/${applicationId}/review`,
      method: 'post',
      data,
    })
  },

  // 获取系统管理员审核统计
  getReviewStats: () => {
    return request({
      url: '/designer/admin/review/stats',
      method: 'get',
    })
  },

  // 批量审核申请
  batchReview: (applicationIds: number[], status: 'APPROVED' | 'REJECTED', feedback?: string) => {
    return request({
      url: '/designer/admin/applications/batch-review',
      method: 'post',
      data: { applicationIds, status, feedback },
    })
  },
}

// 任务统计API
export const statsApi = {
  // 获取总体统计
  getOverallStats: () => {
    return request({
      url: '/designer/task-stats/overall',
      method: 'get',
    })
  },

  // 获取设计师统计
  getDesignerStats: (designerId: number): Promise<{ data: DesignerTaskStats }> => {
    return request({
      url: `/designer/task-stats/designer/${designerId}`,
      method: 'get',
    })
  },

  // 获取企业统计
  getEnterpriseStats: (enterpriseId: number): Promise<{ data: ClientTaskStats }> => {
    return request({
      url: `/designer/task-stats/enterprise/${enterpriseId}`,
      method: 'get',
    })
  },

  // 获取任务类型统计
  getTaskTypeStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/task-stats/task-types',
      method: 'get',
      params: { startDate, endDate },
    })
  },

  // 获取地区统计
  getLocationStats: (startDate?: string, endDate?: string) => {
    return request({
      url: '/designer/task-stats/locations',
      method: 'get',
      params: { startDate, endDate },
    })
  },

  // 获取月度统计
  getMonthlyStats: (year: number) => {
    return request({
      url: '/designer/task-stats/monthly',
      method: 'get',
      params: { year },
    })
  },
}
