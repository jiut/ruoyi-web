// 智图工厂任务相关类型定义
import {
  TaskStatus,
  ApplicationStatus,
  ReviewStatus,
  DeliverableStatus,
  PaymentStatus,
  ReviewMode,
  Designer
} from './taskFactory'

export interface Task {
  id: number
  title: string
  description: string
  requirements: string
  price: number
  deadline: string
  urgent: boolean
  client: string
  clientId: number
  location: string
  taskType: TaskType
  experience: ExperienceLevel
  skillsRequired: string // JSON格式的技能要求
  tags: string // JSON格式的标签数组
  attachments?: TaskAttachment[]
  status: TaskStatus
  publishDate: string
  startDate?: string
  endDate?: string
  applications: number // 申请人数
  maxApplicants?: number // 最大申请人数
  selectedDesignerId?: number // 选中的设计师ID
  deliverables: string // JSON格式的交付物要求
  paymentTerms: string // 付款条款
  createdAt: string
  updatedAt: string
  // 关联数据
  client?: Client
  selectedDesigner?: Designer
  taskApplications?: TaskApplication[]
  taskDeliverables?: TaskDeliverable[]
  payments?: Payment[]
}

export interface Client {
  id: number
  clientName: string
  avatar?: string
  companyName?: string
  industry?: string
  location?: string
  email: string
  phone: string
  rating?: number
  completedTasks?: number
  totalSpent?: number
  description?: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface TaskApplication {
  id: number
  taskId: number
  designerId: number
  proposal: string
  proposedPrice?: number
  estimatedDuration: string
  portfolio?: string // JSON格式的作品集链接
  status: ApplicationStatus
  appliedAt: string
  respondedAt?: string
  // 关联数据
  task?: Task
  designer?: Designer
}

export interface TaskDeliverable {
  id: number
  taskId: number
  designerId: number
  title: string
  description: string
  fileUrl: string
  fileType: string
  version: number
  status: DeliverableStatus
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  feedback?: string
  // 关联数据
  task?: Task
  designer?: Designer
}

export interface Payment {
  id: number
  taskId: number
  clientId: number
  designerId: number
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  createdAt: string
  processedAt?: string
  description?: string
  // 关联数据
  task?: Task
  client?: Client
  designer?: Designer
}

export interface TaskAttachment {
  id: number
  taskId: number
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

// 枚举类型定义
export enum TaskType {
  UI_DESIGN = 'ui-design',
  GRAPHIC_DESIGN = 'graphic-design',
  BRAND_DESIGN = 'brand-design',
  THREE_D_MODELING = '3d-modeling',
  ANIMATION = 'animation',
  WEB_DESIGN = 'web-design',
  APP_DESIGN = 'app-design',
  POSTER_DESIGN = 'poster-design',
  ILLUSTRATION = 'illustration',
  LOGO_DESIGN = 'logo-design',
  PACKAGING_DESIGN = 'packaging-design',
  PRINT_DESIGN = 'print-design'
}

export enum ExperienceLevel {
  ENTRY = '应届',
  JUNIOR = '1-3年',
  INTERMEDIATE = '3-5年',
  SENIOR = '5-10年',
  EXPERT = '10年以上'
}





export enum PaymentMethod {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  BANK_TRANSFER = 'bank-transfer',
  PLATFORM_BALANCE = 'platform-balance'
}

// 查询参数接口
export interface TaskQueryParams {
  pageNum?: number
  pageSize?: number
  title?: string
  taskType?: TaskType
  location?: string
  experience?: ExperienceLevel
  minPrice?: number
  maxPrice?: number
  urgent?: boolean
  status?: TaskStatus
  clientId?: number
  designerId?: number
  sortBy?: 'latest' | 'price-high' | 'price-low' | 'deadline' | 'applications'
}

export interface TaskApplicationQueryParams {
  pageNum?: number
  pageSize?: number
  taskId?: number
  designerId?: number
  status?: ApplicationStatus
  appliedAfter?: string
  appliedBefore?: string
}

export interface PaymentQueryParams {
  pageNum?: number
  pageSize?: number
  taskId?: number
  clientId?: number
  designerId?: number
  status?: PaymentStatus
  method?: PaymentMethod
  amountMin?: number
  amountMax?: number
  startDate?: string
  endDate?: string
}

// 表单数据接口
export interface TaskFormData {
  title: string
  description: string
  requirements: string
  price: number
  deadline: string
  urgent: boolean
  location: string
  taskType: TaskType
  experience: ExperienceLevel
  skillsRequired: string[]
  tags: string[]
  deliverables: string[]
  paymentTerms: string
  maxApplicants?: number
  attachments?: File[]
}

export interface TaskApplicationFormData {
  taskId: number
  proposal: string
  proposedPrice?: number
  estimatedDuration: string
  portfolio?: string[]
}

export interface TaskDeliverableFormData {
  taskId: number
  title: string
  description: string
  files: File[]
}

// 统计数据接口
export interface TaskStats {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  totalEarnings: number
  averageTaskPrice: number
  topTaskTypes: Array<{
    type: TaskType
    count: number
    percentage: number
  }>
  monthlyStats: Array<{
    month: string
    taskCount: number
    earnings: number
  }>
}

export interface DesignerTaskStats {
  appliedTasks: number
  activeTasks: number
  completedTasks: number
  totalEarnings: number
  averageRating: number
  completionRate: number
  onTimeRate: number
}

export interface ClientTaskStats {
  publishedTasks: number
  activeTasks: number
  completedTasks: number
  totalSpent: number
  averageTaskPrice: number
  averageRating: number
  repostRate: number
}

// 通知相关接口
export interface TaskNotification {
  id: number
  userId: number
  taskId: number
  type: NotificationType
  title: string
  content: string
  read: boolean
  createdAt: string
  // 关联数据
  task?: Task
}

export enum NotificationType {
  NEW_APPLICATION = 'new-application',
  APPLICATION_APPROVED = 'application-approved',
  APPLICATION_REJECTED = 'application-rejected',
  DELIVERABLE_SUBMITTED = 'deliverable-submitted',
  DELIVERABLE_APPROVED = 'deliverable-approved',
  DELIVERABLE_REJECTED = 'deliverable-rejected',
  PAYMENT_RECEIVED = 'payment-received',
  TASK_DEADLINE_REMINDER = 'task-deadline-reminder',
  TASK_COMPLETED = 'task-completed',
  TASK_CANCELLED = 'task-cancelled'
}

// 匹配算法相关接口
export interface TaskMatch {
  taskId: number
  designerId: number
  matchScore: number
  matchReasons: string[]
  task?: Task
  designer?: Designer
}

export interface MatchingCriteria {
  taskType?: TaskType[]
  experience?: ExperienceLevel[]
  location?: string[]
  priceRange?: [number, number]
  skills?: string[]
  availability?: boolean
  rating?: number
}
