// 设计师相关类型定义
export interface Designer {
  id: number
  designerName: string
  profession: Profession
  email: string
  phone: string
  skillTags: string // JSON格式的技能标签数组
  socialLinks: string // JSON格式的社交链接
  portfolio: string
  description: string
  avatar: string
  schoolId?: number
  enterpriseId?: number
  userId: number
  status: string
  location?: string
  experience?: number
  workStatus?: WorkStatus
  createdAt: string
  updatedAt: string
  // 关联数据
  school?: School
  enterprise?: Enterprise
  works?: Work[]
  workExperience?: WorkExperience[]
  education?: Education[]
  awards?: Award[]
}

export enum Profession {
  UI_UX_DESIGNER = 'UI_UX_DESIGNER',
  VISUAL_DESIGNER = 'VISUAL_DESIGNER',
  INTERACTION_DESIGNER = 'INTERACTION_DESIGNER',
  PRODUCT_DESIGNER = 'PRODUCT_DESIGNER',
  BRAND_DESIGNER = 'BRAND_DESIGNER',
  MOTION_DESIGNER = 'MOTION_DESIGNER',
  THREE_D_DESIGNER = 'THREE_D_DESIGNER',
  GRAPHIC_DESIGNER = 'GRAPHIC_DESIGNER',
  WEB_DESIGNER = 'WEB_DESIGNER',
  ILLUSTRATOR = 'ILLUSTRATOR'
}

export enum SkillTag {
  FIGMA = 'FIGMA',
  SKETCH = 'SKETCH',
  ADOBE_XD = 'ADOBE_XD',
  PHOTOSHOP = 'PHOTOSHOP',
  ILLUSTRATOR = 'ILLUSTRATOR',
  AFTER_EFFECTS = 'AFTER_EFFECTS',
  BLENDER = 'BLENDER',
  CINEMA_4D = 'CINEMA_4D',
  USER_RESEARCH = 'USER_RESEARCH',
  INTERACTION_DESIGN = 'INTERACTION_DESIGN',
  PROTOTYPE_DESIGN = 'PROTOTYPE_DESIGN',
  VISUAL_DESIGN = 'VISUAL_DESIGN',
  BRAND_DESIGN = 'BRAND_DESIGN',
  ANIMATION_DESIGN = 'ANIMATION_DESIGN',
  UI_DESIGN = 'UI_DESIGN',
  UX_DESIGN = 'UX_DESIGN',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM',
  USER_INTERFACE_DESIGN = 'USER_INTERFACE_DESIGN',
  USER_EXPERIENCE_DESIGN = 'USER_EXPERIENCE_DESIGN',
  BRANDING_DESIGN = 'BRANDING_DESIGN',
  CHARACTER_DESIGN = 'CHARACTER_DESIGN',
  WEB_DESIGN = 'WEB_DESIGN',
  MOBILE_DESIGN = 'MOBILE_DESIGN',
  PRINT_DESIGN = 'PRINT_DESIGN'
}

export enum WorkStatus {
  EMPLOYED = 'EMPLOYED',
  JOB_SEEKING = 'JOB_SEEKING',
  STUDENT = 'STUDENT',
  FREELANCER = 'FREELANCER'
}

export interface Work {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  designerId: number
  createdAt: string
  updatedAt: string
}

export interface WorkExperience {
  id: number
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  isCurrent: boolean
  designerId: number
}

export interface Education {
  id: number
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  description?: string
  designerId: number
}

export interface Award {
  id: number
  title: string
  organization: string
  year: string
  description?: string
  designerId: number
}

export interface School {
  id: number
  name: string
  location: string
  type: string
}

export interface Enterprise {
  id: number
  name: string
  industry: string
  location: string
  scale: string
}

export interface DesignerQueryParams {
  pageNum?: number
  pageSize?: number
  designerName?: string
  profession?: Profession
  skillTags?: string
  location?: string
  workStatus?: WorkStatus
  minExperience?: number
  maxExperience?: number
}

// 职业显示名称映射
export const ProfessionLabels: Record<Profession, string> = {
  [Profession.UI_UX_DESIGNER]: 'UI/UX 设计师',
  [Profession.VISUAL_DESIGNER]: '视觉设计师',
  [Profession.INTERACTION_DESIGNER]: '交互设计师',
  [Profession.PRODUCT_DESIGNER]: '产品设计师',
  [Profession.BRAND_DESIGNER]: '品牌设计师',
  [Profession.MOTION_DESIGNER]: '动效设计师',
  [Profession.THREE_D_DESIGNER]: '3D 设计师',
  [Profession.GRAPHIC_DESIGNER]: '平面设计师',
  [Profession.WEB_DESIGNER]: '网页设计师',
  [Profession.ILLUSTRATOR]: '插画师'
}

// 技能标签显示名称映射
export const SkillTagLabels: Record<SkillTag, string> = {
  [SkillTag.FIGMA]: 'Figma',
  [SkillTag.SKETCH]: 'Sketch',
  [SkillTag.ADOBE_XD]: 'Adobe XD',
  [SkillTag.PHOTOSHOP]: 'Photoshop',
  [SkillTag.ILLUSTRATOR]: 'Illustrator',
  [SkillTag.AFTER_EFFECTS]: 'After Effects',
  [SkillTag.BLENDER]: 'Blender',
  [SkillTag.CINEMA_4D]: 'Cinema 4D',
  [SkillTag.USER_RESEARCH]: '用户研究',
  [SkillTag.INTERACTION_DESIGN]: '交互设计',
  [SkillTag.PROTOTYPE_DESIGN]: '原型设计',
  [SkillTag.VISUAL_DESIGN]: '视觉设计',
  [SkillTag.BRAND_DESIGN]: '品牌设计',
  [SkillTag.ANIMATION_DESIGN]: '动画设计',
  [SkillTag.UI_DESIGN]: 'UI设计',
  [SkillTag.UX_DESIGN]: 'UX设计',
  [SkillTag.DESIGN_SYSTEM]: '设计系统',
  [SkillTag.USER_INTERFACE_DESIGN]: '界面设计',
  [SkillTag.USER_EXPERIENCE_DESIGN]: '用户体验设计',
  [SkillTag.BRANDING_DESIGN]: '品牌设计',
  [SkillTag.CHARACTER_DESIGN]: '角色设计',
  [SkillTag.WEB_DESIGN]: '网页设计',
  [SkillTag.MOBILE_DESIGN]: '移动端设计',
  [SkillTag.PRINT_DESIGN]: '印刷设计'
}

// 工作状态显示名称映射
export const WorkStatusLabels: Record<WorkStatus, string> = {
  [WorkStatus.EMPLOYED]: '在职',
  [WorkStatus.JOB_SEEKING]: '求职中',
  [WorkStatus.STUDENT]: '学生',
  [WorkStatus.FREELANCER]: '自由职业'
}
