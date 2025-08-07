// 智图工厂专用类型定义（根据设计文档）

// 任务基础信息接口（对应 des_task 表）
export interface TaskFactory {
  taskId: number
  enterpriseId: number
  taskTitle: string
  taskDescription: string
  taskType: TaskType
  skillTags: string[] // JSON格式的技能标签
  budgetMin: number
  budgetMax: number
  deadline: string
  urgent: boolean
  status: TaskStatus
  deliverables: string // 交付物要求
  paymentTerms: string // 付款条款
  views: number
  applications: number
  createBy: number
  createTime: string
  updateBy: number
  updateTime: string
  delFlag: string

  // 关联数据
  enterprise?: Enterprise
  taskApplications?: TaskApplicationFactory[]
  selectedApplication?: TaskApplicationFactory
}

// 任务申请接口（对应 des_task_application 表，支持双重审核）
export interface TaskApplicationFactory {
  applicationId: number
  taskId: number
  designerId: number
  proposal: string
  proposedPrice: number
  estimatedDays: number
  portfolioLinks: string[] // JSON格式的作品链接

  // 最终申请状态（对用户可见）
  status: ApplicationStatus
  feedback: string // 统一的审核反馈

  // 双重审核扩展字段（对企业管理员和设计师完全隐藏）
  adminReviewStatus?: ReviewStatus
  adminReviewFeedback?: string
  adminReviewTime?: string
  adminReviewBy?: number

  // 企业管理员审核字段
  enterpriseReviewStatus?: ReviewStatus
  enterpriseReviewFeedback?: string
  enterpriseReviewTime?: string

  reviewMode?: ReviewMode

  createBy: number
  createTime: string
  updateBy: number
  updateTime: string
  delFlag: string

  // 关联数据
  task?: TaskFactory
  designer?: Designer
  enterprise?: Enterprise
}

// 任务交付接口（对应 des_task_deliverable 表）
export interface TaskDeliverableFactory {
  deliverableId: number
  taskId: number
  designerId: number
  deliverableContent: string // 交付内容（可包含链接、提取码、说明等）
  version: number
  status: DeliverableStatus
  reviewFeedback: string
  createBy: number
  createTime: string
  updateBy: number
  updateTime: string
  delFlag: string

  // 关联数据
  task?: TaskFactory
  designer?: Designer
}

// 任务支付接口（对应 des_task_payment 表）
export interface TaskPaymentFactory {
  paymentId: number
  taskId: number
  designerId: number
  enterpriseId: number
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  orderNo: string
  transactionId: string
  createBy: number
  createTime: string
  delFlag: string

  // 关联数据
  task?: TaskFactory
  designer?: Designer
  enterprise?: Enterprise
}

// 企业信息接口（复用现有设计）
export interface Enterprise {
  enterpriseId: number
  userId: number
  enterpriseName: string
  description: string
  industry: string
  scale: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  status: string
}

// 设计师信息接口（复用现有设计）
export interface Designer {
  designerId: number
  userId: number
  name: string
  avatar: string
  title: string
  experience: string
  skills: string[]
  location: string
  status: string
}

// 枚举类型定义（根据文档设计）
export enum TaskType {
  LOGO_DESIGN = 'LOGO_DESIGN',
  UI_UX_DESIGN = 'UI_UX_DESIGN',
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  ILLUSTRATION = 'ILLUSTRATION',
  BRAND_DESIGN = 'BRAND_DESIGN',
  THREE_D_MODELING = '3D_MODELING',
  ANIMATION = 'ANIMATION',
  WEB_DESIGN = 'WEB_DESIGN',
  APP_DESIGN = 'APP_DESIGN',
  POSTER_DESIGN = 'POSTER_DESIGN'
}

export enum TaskStatus {
  DRAFT = 'DRAFT',           // 草稿
  PUBLISHED = 'PUBLISHED',   // 已发布
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  COMPLETED = 'COMPLETED',   // 已完成
  CANCELLED = 'CANCELLED'    // 已取消
}

export enum ApplicationStatus {
  PENDING = '0',           // 待审核（初始状态）
  ADMIN_APPROVED = '1',    // 系统管理员审核通过
  ADMIN_REJECTED = '2',    // 系统管理员审核拒绝
  ENTERPRISE_APPROVED = '3', // 企业管理员审核通过（最终通过）
  ENTERPRISE_REJECTED = '4', // 企业管理员审核拒绝
  WITHDRAWN = '5'          // 已撤回
}

export enum ReviewStatus {
  PENDING = 'PENDING',     // 待审核
  APPROVED = 'APPROVED',   // 审核通过
  REJECTED = 'REJECTED'    // 审核拒绝
}

export enum ReviewMode {
  DUAL = 'DUAL',           // 双重审核模式（系统管理员→企业管理员）
  ENTERPRISE = 'ENTERPRISE' // 企业自主审核模式
}

export enum DeliverableStatus {
  SUBMITTED = 'SUBMITTED',     // 已提交
  APPROVED = 'APPROVED',       // 已通过
  REVISION_REQUIRED = 'REVISION_REQUIRED', // 需要修改
  REJECTED = 'REJECTED'        // 已拒绝
}

export enum PaymentMethod {
  ALIPAY = 'ALIPAY',
  WECHAT = 'WECHAT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PLATFORM_BALANCE = 'PLATFORM_BALANCE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',     // 待支付
  PAID = 'PAID',          // 已支付
  FAILED = 'FAILED',      // 支付失败
  REFUNDED = 'REFUNDED'   // 已退款
}

// 前端展示专用接口（对应企业管理员视角，严格隐藏系统管理员信息）
export interface EnterpriseApplicationView {
  applicationId: number
  taskTitle: string
  designerName: string
  designerAvatar: string
  proposal: string
  proposedPrice: number
  estimatedDays: number
  portfolioLinks: string[]

  // 企业管理员视角的字段
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
  feedback: string              // 企业管理员自己的反馈
  createTime: string           // 申请时间
  reviewTime: string | null    // 企业管理员审核时间

  // 严格保证：以下字段完全不存在
  // adminReviewStatus?: never
  // adminReviewFeedback?: never
  // adminReviewTime?: never
  // adminReviewBy?: never
  // reviewMode?: never
}

// 设计师视角的申请数据（完全统一的反馈）
export interface DesignerApplicationView {
  applicationId: number
  taskId: number
  taskTitle: string
  enterpriseName: string
  enterpriseAvatar: string

  // 设计师视角的字段
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN'
  feedback: string                     // 统一的反馈信息
  createTime: string                   // 申请提交时间
  reviewTime: string | null            // 最终审核时间

  // 申请内容
  proposal: string
  proposedPrice: number
  estimatedDays: number
  portfolioLinks: string[]

  // 严格保证：以下字段完全不存在
  // adminReviewStatus?: never
  // adminReviewFeedback?: never
  // adminReviewTime?: never
  // adminReviewBy?: never
  // enterpriseReviewStatus?: never
  // enterpriseReviewFeedback?: never
  // enterpriseReviewTime?: never
  // reviewMode?: never
}

// 系统管理员审核视图（包含完整的双重审核信息）
export interface AdminApplicationView {
  applicationId: number
  taskId: number
  taskTitle: string
  enterpriseName: string
  designerName: string
  designerAvatar: string
  proposal: string
  proposedPrice: number
  estimatedDays: number
  portfolioLinks: string[]

  // 完整的审核状态信息
  status: ApplicationStatus
  adminReviewStatus: ReviewStatus
  adminReviewFeedback: string
  adminReviewTime: string | null
  enterpriseReviewStatus: ReviewStatus
  enterpriseReviewFeedback: string
  enterpriseReviewTime: string | null
  reviewMode: ReviewMode

  createTime: string
  updateTime: string
}

// 查询参数接口
export interface TaskFactoryQueryParams {
  pageNum?: number
  pageSize?: number
  taskTitle?: string
  taskType?: TaskType
  location?: string
  budgetMin?: number
  budgetMax?: number
  urgent?: boolean
  status?: TaskStatus
  enterpriseId?: number
  designerId?: number
  sortBy?: 'latest' | 'price-high' | 'price-low' | 'deadline' | 'applications'
}

// 任务表单数据接口
export interface TaskFactoryFormData {
  taskTitle: string
  taskDescription: string
  taskType: TaskType
  skillTags: string[]
  budgetMin: number
  budgetMax: number
  deadline: string
  urgent: boolean
  deliverables: string
  paymentTerms: string
}

// 申请表单数据接口
export interface TaskApplicationFormData {
  taskId: number
  proposal: string
  proposedPrice: number
  estimatedDays: number
  portfolioLinks: string[]
}

// 交付物表单数据接口
export interface TaskDeliverableFormData {
  taskId: number
  deliverableContent: string
  version: number
}

// 审核表单数据接口
export interface ReviewFormData {
  status: 'APPROVED' | 'REJECTED'
  feedback: string
}

// 配置信息接口
export interface TaskConfigInfo {
  reviewMode: ReviewMode
  reviewModeName: string
  reviewModeDescription: string
  isDualReviewMode: boolean
  isEnterpriseReviewMode: boolean
  configSummary: string
}

// 统计数据接口
export interface TaskFactoryStats {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  totalApplications: number
  successRate: number
}

export interface DesignerTaskFactoryStats {
  appliedTasks: number
  activeTasks: number
  completedTasks: number
  totalEarnings: number
  averageTaskPrice: number
  completionRate: number
}

export interface EnterpriseTaskFactoryStats {
  publishedTasks: number
  activeTasks: number
  completedTasks: number
  totalSpent: number
  averageTaskPrice: number
  averageCompletionTime: number
}

export interface AdminReviewStats {
  pendingCount: number
  reviewedToday: number
  approvalRate: number
  avgProcessTime: number
  backlogAlert: boolean
}
