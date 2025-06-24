// 岗位相关类型定义
import type { Profession, Designer } from './designer'

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
  CLOSED = 'CLOSED'
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
  WITHDRAWN = 'WITHDRAWN'
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
  PRINT_DESIGN = 'PRINT_DESIGN'
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
