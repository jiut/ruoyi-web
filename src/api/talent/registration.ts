import request from '@/utils/request'

// 枚举类型定义
export type Gender = '0' | '1' | '2' // 0-男, 1-女, 2-未知
export type DesignerProfession = 'ILLUSTRATOR' | 'INTERACTION_DESIGNER' | 'BRAND_DESIGNER' |
  'UI_DESIGNER' | 'UX_DESIGNER' | 'UI_UX_DESIGNER' | 'VISUAL_DESIGNER' |
  'THREE_D_DESIGNER' | 'GRAPHIC_DESIGNER' | 'PRODUCT_DESIGNER' | 'MOTION_DESIGNER'
export type EnterpriseScale = '1-50人' | '50-100人' | '100-500人' | '500-1000人' |
  '1000-5000人' | '5000-10000人' | '10000+人'
export type Industry = '互联网' | '软件开发' | '游戏' | '电子商务' | '智能硬件' |
  '金融' | '教育' | '医疗' | '制造业' | '其他'
export type SchoolType = 'COMPREHENSIVE' | 'ART' | 'ENGINEERING' | 'NORMAL' | 'FINANCE'
export type SchoolLevel = 'UNDERGRADUATE' | 'GRADUATE' | 'VOCATIONAL'

// 设计师注册接口
export interface DesignerRegistration {
  designerName: string
  avatar?: string
  gender?: Gender
  birthDate?: string
  phone?: string
  email?: string
  profession?: DesignerProfession
  skillTags?: string
  workYears?: number
  description?: string
  portfolioUrl?: string
  socialLinks?: string
}

// 企业注册接口
export interface EnterpriseRegistration {
  enterpriseName: string
  logo?: string
  industry?: Industry
  scale?: EnterpriseScale
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

// 院校注册接口
export interface SchoolRegistration {
  schoolName: string
  logo?: string
  schoolType?: SchoolType
  level?: SchoolLevel
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

// 信息完整度响应
export interface ProfileCompletenessVo {
  overall: number
  designer?: DesignerCompletenessVo
  enterprise?: EnterpriseCompletenessVo
  school?: SchoolCompletenessVo
}

export interface DesignerCompletenessVo {
  basicInfo: number
  portfolio: number
  experience: number
  education: number
  suggestions: string[]
}

export interface EnterpriseCompletenessVo {
  basicInfo: number
  contact: number
  jobs: number
  suggestions: string[]
}

export interface SchoolCompletenessVo {
  basicInfo: number
  contact: number
  statistics: number
  suggestions: string[]
}

// API 接口实现
export const registerDesigner = (data: DesignerRegistration) => {
  return request({
    url: '/designer/user/register/designer',
    method: 'post',
    data
  })
}

export const registerEnterprise = (data: EnterpriseRegistration) => {
  return request({
    url: '/designer/user/register/enterprise',
    method: 'post',
    data
  })
}

export const registerSchool = (data: SchoolRegistration) => {
  return request({
    url: '/designer/user/register/school',
    method: 'post',
    data
  })
}

// 获取用户档案完整度
export const getProfileCompleteness = () => {
  return request({
    url: '/designer/user/profile/completeness',
    method: 'get'
  })
}

// 检查名称唯一性
export const checkNameUniqueness = (type: 'designer' | 'enterprise' | 'school', name: string) => {
  return request({
    url: `/designer/user/check-name/${type}`,
    method: 'get',
    params: { name }
  })
}
