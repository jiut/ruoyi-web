import request from '@/utils/request'
import type { Enterprise } from '@/types/talent/job'

export interface EnterpriseUpdateData {
  id?: number
  enterpriseName: string
  logo?: string
  industry?: string
  scale?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}

// 获取当前企业信息
export const getCurrentEnterprise = () => {
  return request({
    url: '/designer/enterprise/current',
    method: 'get',
  })
}

// 更新企业信息
export const updateEnterprise = (data: EnterpriseUpdateData) => {
  return request({
    url: '/designer/enterprise/update',
    method: 'put',
    data,
  })
}

// 获取企业完整信息（聚合接口）
export const getEnterpriseComplete = (enterpriseId: number) => {
  return request({
    url: `/designer/enterprise/${enterpriseId}/complete`,
    method: 'get',
  })
}

// 企业档案完整度
export interface EnterpriseCompletenessDetail {
  completeness: number
  missingFields: string[]
  suggestions: string[]
}

// 获取企业档案完整度
export const getEnterpriseCompleteness = () => {
  return request({
    url: '/designer/enterprise/completeness',
    method: 'get',
  })
}
