// 岗位相关类型定义
import type { Designer, Profession } from './designer'

export interface JobPosting {
  id: number
  title: string
  description: string
  requirements: string
  salaryMin?: number
  salaryMax?: number
  workLocation: string
  workType: string
  experienceRequired: string
  educationRequired: string
  profession: Profession
  skillsRequired: string // JSON格式的技能要求
  benefits?: JobBenefit[] // 职位福利（继承企业福利 + 额外福利）
  additionalBenefits?: JobBenefit[] // 职位特有的额外福利
  useEnterpriseBenefits?: boolean // 是否使用企业标准福利
  enterpriseId: number
  status: JobStatus
  publishDate: string
  deadline: string
  createdAt: string
  updatedAt: string
  enterprise?: Enterprise
  applications?: JobApplication[]
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
}

export interface JobApplication {
  id: number
  jobId: number
  designerId: number
  coverLetter: string
  resumeUrl?: string
  portfolioUrl?: string
  status: ApplicationStatus
  feedback?: string
  appliedAt: string
  processedAt?: string
  createdAt: string
  updatedAt: string
  job?: JobPosting
  designer?: Designer
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum SkillTag {
  ANIMATION_DESIGN = 'ANIMATION_DESIGN',
  PROTOTYPE_DESIGN = 'PROTOTYPE_DESIGN',
  CHARACTER_DESIGN = 'CHARACTER_DESIGN',
  VISUAL_DESIGN = 'VISUAL_DESIGN',
  USER_INTERFACE_DESIGN = 'USER_INTERFACE_DESIGN',
  USER_EXPERIENCE_DESIGN = 'USER_EXPERIENCE_DESIGN',
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  BRANDING_DESIGN = 'BRANDING_DESIGN',
  ILLUSTRATION = 'ILLUSTRATION',
  WEB_DESIGN = 'WEB_DESIGN',
  MOBILE_DESIGN = 'MOBILE_DESIGN',
  PRINT_DESIGN = 'PRINT_DESIGN',
}

export interface Enterprise {
  id: number
  enterpriseName: string
  description: string
  industry: string
  scale: string
  address: string
  logo?: string
  website?: string
  email: string
  phone: string
  userId: number
  benefits?: JobBenefit[] // 企业标准福利
  createdAt: string
  updatedAt: string
}

// 查询参数接口
export interface JobQueryParams {
  pageNum?: number
  pageSize?: number
  title?: string
  profession?: Profession | string
  skillTags?: string
  enterpriseId?: number
  workLocation?: string
  salaryMin?: number
  salaryMax?: number
  experienceRequired?: string
  workType?: string
}

// 岗位申请数据
export interface JobApplicationData {
  jobId: number
  coverLetter: string
  resumeUrl?: string
  portfolioUrl?: string
  name: string
  phone: string
  email: string
  experience: string
  currentStatus: string
  expectedSalary: string
}

// 处理申请数据
export interface ProcessApplicationData {
  applicationId: number
  status: ApplicationStatus
  feedback?: string
}

// 筛选选项
export interface FilterOptions {
  professions: { value: Profession; label: string; count?: number }[]
  locations: { value: string; label: string; count?: number }[]
  experiences: { value: string; label: string; count?: number }[]
  workTypes: { value: string; label: string; count?: number }[]
  companyScales: { value: string; label: string; count?: number }[]
  skills: { value: SkillTag; label: string; count?: number }[]
}

// 薪资范围
export interface SalaryRange {
  min: number
  max: number
}

// 岗位卡片显示数据
export interface JobCardData {
  id: number
  title: string
  company: string
  location: string
  salary: string
  experience: string
  education: string
  workType: string
  skills: string[]
  publishedAt: string
  isUrgent?: boolean
  companyLogo?: string
}

// 福利待遇相关类型
export interface JobBenefit {
  id: string
  name: string
  icon: string
  description?: string
  category?: BenefitCategory
  color?: string
}

export enum BenefitCategory {
  INSURANCE = 'INSURANCE', // 保险类
  LEAVE = 'LEAVE', // 假期类
  BONUS = 'BONUS', // 奖金类
  STOCK = 'STOCK', // 股权类
  HEALTH = 'HEALTH', // 健康类
  MEAL = 'MEAL', // 餐饮类
  TRANSPORT = 'TRANSPORT', // 交通类
  TRAINING = 'TRAINING', // 培训类
  WELFARE = 'WELFARE', // 福利类
  OTHER = 'OTHER', // 其他
}

// 预定义的福利待遇选项
export const BENEFIT_OPTIONS: JobBenefit[] = [
  {
    id: 'insurance',
    name: '五险一金',
    icon: 'ri-health-book-line',
    description: '完善的社会保险和住房公积金',
    category: BenefitCategory.INSURANCE,
    color: 'blue',
  },
  {
    id: 'annual_leave',
    name: '年假15天',
    icon: 'ri-calendar-check-line',
    description: '带薪年假15天',
    category: BenefitCategory.LEAVE,
    color: 'purple',
  },
  {
    id: 'year_end_bonus',
    name: '年终奖金',
    icon: 'ri-award-line',
    description: '丰厚的年终奖金',
    category: BenefitCategory.BONUS,
    color: 'pink',
  },
  {
    id: 'stock_options',
    name: '股票期权',
    icon: 'ri-stock-line',
    description: '公司股票期权激励',
    category: BenefitCategory.STOCK,
    color: 'green',
  },
  {
    id: 'sick_leave',
    name: '带薪病假',
    icon: 'ri-user-heart-line',
    description: '带薪病假保障',
    category: BenefitCategory.HEALTH,
    color: 'yellow',
  },
  {
    id: 'free_meals',
    name: '免费三餐',
    icon: 'ri-restaurant-line',
    description: '免费提供三餐',
    category: BenefitCategory.MEAL,
    color: 'red',
  },
  {
    id: 'flexible_hours',
    name: '弹性工作时间',
    icon: 'ri-time-line',
    description: '灵活的工作时间安排',
    category: BenefitCategory.WELFARE,
    color: 'indigo',
  },
  {
    id: 'remote_work',
    name: '远程办公',
    icon: 'ri-home-office-line',
    description: '支持远程办公',
    category: BenefitCategory.WELFARE,
    color: 'teal',
  },
  {
    id: 'training_budget',
    name: '培训预算',
    icon: 'ri-book-open-line',
    description: '年度培训预算支持',
    category: BenefitCategory.TRAINING,
    color: 'orange',
  },
  {
    id: 'gym_membership',
    name: '健身房会员',
    icon: 'ri-run-line',
    description: '健身房会员卡',
    category: BenefitCategory.HEALTH,
    color: 'cyan',
  },
]
