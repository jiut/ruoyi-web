// 设计师相关类型定义
// 导入统一的Profession管理
import { Profession } from '@/utils/professionUtils'

// 导入统一的职业显示名称映射
import { ProfessionLabels } from '@/utils/professionUtils'

export interface Designer {
  id: number
  designerName: string
  profession: Profession
  email: string
  phone: string
  skillTags: string // JSON格式的技能标签数组
  socialLinks: string // JSON格式的社交链接
  portfolioUrl: string
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
  gender?: string // 性别字段
  birthDate?: string // 出生日期
  workYears?: number // 工作年限
  graduationDate?: string // 毕业日期
  joinDate?: string // 入职日期
  company?: string // 公司名称
  wechat?: string // 微信号
  // 关联数据
  school?: School
  enterprise?: Enterprise
  works?: Work[]
  workExperience?: WorkExperience[]
  education?: Education[]
  awards?: Award[]
}
export { Profession }

// 更新为英文简写格式，匹配mock数据
export enum SkillTag {
  // 设计工具类
  figma = 'figma',
  sketch = 'sketch',
  adobe_xd = 'adobe_xd',
  photoshop = 'photoshop',
  illustrator = 'illustrator',
  after_effects = 'after_effects',
  blender = 'blender',
  cinema_4d = 'cinema_4d',
  axure_rp = 'axure_rp',
  invision = 'invision',
  framer = 'framer',
  principle = 'principle',
  zeplin = 'zeplin',
  abstract = 'abstract',
  lottie = 'lottie',
  maya = 'maya',
  '3d_max' = '3d_max',

  // 专业领域类
  interaction_design = 'interaction_design',
  ui_design = 'ui_design',
  brand_design = 'brand_design',
  product_design = 'product_design',
  motion_design = 'motion_design',
  game_art = 'game_art',
  web_design = 'web_design',
  mobile_design = 'mobile_design',
  graphic_design = 'graphic_design',
  logo_design = 'logo_design',
  interface_design = 'interface_design',
  brand_identity = 'brand_identity',
  animation_design = 'animation_design',
  branding = 'branding',

  // 技能方法类
  user_experience = 'user_experience',
  user_research = 'user_research',
  prototype_design = 'prototype_design',
  design_system = 'design_system',
  information_architecture = 'information_architecture',
  visual_system = 'visual_system',
  wireframing = 'wireframing',
  user_testing = 'user_testing',
  persona_design = 'persona_design',
  journey_mapping = 'journey_mapping',
  usability_testing = 'usability_testing',
  visual_design = 'visual_design',
  typography = 'typography',
  color_theory = 'color_theory',
  illustration = 'illustration',
  character_design = 'character_design',
  scene_design = 'scene_design',
  visual_identity = 'visual_identity',
  animation = 'animation',
  effects = 'effects',
  '3d_modeling' = '3d_modeling',
  photography = 'photography',
  video_editing = 'video_editing',
}

export enum WorkStatus {
  EMPLOYED = 'EMPLOYED',
  FREELANCER = 'FREELANCER',
  SEEKING = 'SEEKING',
  STUDENT = 'STUDENT',
}

export interface Work {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  designerId: number
  workType?: string // 作品类型
  fileUrl?: string // 文件URL
  thumbnailUrl?: string // 缩略图URL
  tags?: string // JSON格式的标签数组
  likeCount?: number // 点赞数
  viewCount?: number // 查看数
  isFeatured?: string // 是否推荐
  status?: string // 状态
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
  location?: string // 工作地点
  industry?: string // 行业
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
  gpa?: number // 绩点
  ranking?: number // 排名
  totalStudents?: number // 总学生数
  isCurrent?: boolean // 是否在读
}

export interface Award {
  id: number
  title: string
  organization: string
  year: string
  description?: string
  designerId: number
  level?: string // 奖项等级
  category?: string // 奖项分类
  workTitle?: string // 获奖作品
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
export { ProfessionLabels }

// 工作状态显示名称映射
export const WorkStatusLabels: Record<WorkStatus, string> = {
  [WorkStatus.EMPLOYED]: '在职',
  [WorkStatus.FREELANCER]: '自由职业',
  [WorkStatus.SEEKING]: '求职中',
  [WorkStatus.STUDENT]: '学生',
}
