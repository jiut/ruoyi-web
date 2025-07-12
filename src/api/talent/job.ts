import request from '@/utils/request'
import type {
  JobApplicationData,
  JobPosting,
  JobQueryParams,
  ProcessApplicationData,
  Profession,
  SkillTag,
} from '@/types/talent/job'

// 查询岗位列表
export function listJob(query: JobQueryParams) {
  return request({
    url: '/designer/job/list',
    method: 'get',
    params: query,
  })
}

// 获取岗位详情
export function getJob(id: number) {
  return request({
    url: `/designer/job/${id}`,
    method: 'get',
  })
}

// 发布岗位
export function addJob(data: Partial<JobPosting>) {
  return request({
    url: '/designer/job',
    method: 'post',
    data,
  })
}

// 修改岗位
export function updateJob(data: Partial<JobPosting>) {
  return request({
    url: '/designer/job',
    method: 'put',
    data,
  })
}

// 删除岗位
export function delJob(ids: number[]) {
  return request({
    url: `/designer/job/${ids.join(',')}`,
    method: 'delete',
  })
}

// 按职业查询岗位
export function getJobsByProfession(profession: Profession) {
  return request({
    url: `/designer/job/profession/${profession}`,
    method: 'get',
  })
}

// 按技能查询岗位（精确匹配）
export function getJobsBySkills(skillTags: SkillTag[]) {
  return request({
    url: '/designer/job/skills',
    method: 'get',
    params: { skillTags: skillTags.join(',') },
  })
}

// 按技能查询岗位（任意匹配）
export function getJobsBySkillsAny(skillTags: SkillTag[]) {
  return request({
    url: '/designer/job/skills-any',
    method: 'get',
    params: { skillTags: skillTags.join(',') },
  })
}

// 获取企业岗位
export function getJobsByEnterprise(enterpriseId: number) {
  return request({
    url: `/designer/job/enterprise/${enterpriseId}`,
    method: 'get',
  })
}

// 申请岗位
export function applyJob(data: JobApplicationData) {
  return request({
    url: '/designer/application/apply',
    method: 'post',
    data,
  })
}

// 处理申请
export function processApplication(data: ProcessApplicationData) {
  return request({
    url: '/designer/application/process',
    method: 'put',
    data,
  })
}

// 撤回申请
export function withdrawApplication(applicationId: number) {
  return request({
    url: '/designer/application/withdraw',
    method: 'put',
    data: { applicationId },
  })
}

// 获取岗位申请列表
export function getJobApplications(jobId: number) {
  return request({
    url: `/designer/application/job/${jobId}`,
    method: 'get',
  })
}

// 获取设计师申请列表
export function getDesignerApplications(designerId: number) {
  return request({
    url: `/designer/application/designer/${designerId}`,
    method: 'get',
  })
}

// 获取申请详情
export function getApplicationDetail(id: number) {
  return request({
    url: `/designer/application/${id}`,
    method: 'get',
  })
}

// 获取申请列表
export function listApplications(query?: any) {
  return request({
    url: '/designer/application/list',
    method: 'get',
    params: query,
  })
}
