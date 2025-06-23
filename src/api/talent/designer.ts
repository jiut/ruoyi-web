import request from '@/utils/request'
import type {
  Designer,
  DesignerQueryParams,
  Profession,
  SkillTag,
  Work,
  WorkExperience,
  Education,
  Award
} from '@/types/talent/designer'
import {
  mockDesigners,
  mockWorks,
  mockWorkExperience,
  mockEducation,
  mockAwards
} from '@/data/mockDesigners'

// 查询设计师列表
export function listDesigner(query: DesignerQueryParams) {
  // 返回模拟数据，用于开发
  return Promise.resolve({
    rows: mockDesigners,
    total: mockDesigners.length
  })

  // 真实API调用（开发时注释掉）
  // return request({
  //   url: '/designer/designer/list',
  //   method: 'get',
  //   params: query
  // })
}

// 获取设计师详细信息
export function getDesigner(id: number) {
  const designer = mockDesigners.find(d => d.id === id)
  return Promise.resolve({
    data: designer || null
  })
}

// 新增设计师
export function addDesigner(data: Partial<Designer>) {
  return request({
    url: '/designer/designer',
    method: 'post',
    data: data
  })
}

// 修改设计师
export function updateDesigner(data: Partial<Designer>) {
  return request({
    url: '/designer/designer',
    method: 'put',
    data: data
  })
}

// 删除设计师
export function delDesigner(ids: number[]) {
  return request({
    url: `/designer/designer/${ids.join(',')}`,
    method: 'delete'
  })
}

// 按职业查询设计师
export function getDesignersByProfession(profession: Profession) {
  return request({
    url: `/designer/designer/profession/${profession}`,
    method: 'get'
  })
}

// 按技能查询设计师
export function getDesignersBySkills(skillTags: SkillTag[]) {
  return request({
    url: '/designer/designer/skills',
    method: 'get',
    params: { skillTags: skillTags.join(',') }
  })
}

// 获取设计师作品集
export function getDesignerWorks(designerId: number) {
  const works = mockWorks.filter(w => w.designerId === designerId)
  return Promise.resolve({
    data: works
  })
}

// 获取设计师工作经历
export function getDesignerWorkExperience(designerId: number) {
  const workExp = mockWorkExperience.filter(w => w.designerId === designerId)
  return Promise.resolve({
    data: workExp
  })
}

// 获取设计师教育背景
export function getDesignerEducation(designerId: number) {
  const education = mockEducation.filter(e => e.designerId === designerId)
  return Promise.resolve({
    data: education
  })
}

// 获取设计师获奖情况
export function getDesignerAwards(designerId: number) {
  const awards = mockAwards.filter(a => a.designerId === designerId)
  return Promise.resolve({
    data: awards
  })
}

// 获取职业选项
export function getProfessions() {
  return Promise.resolve({
    data: Object.keys(mockDesigners.map(d => d.profession))
  })
}

// 获取技能标签选项
export function getSkillTags() {
  return Promise.resolve({
    data: ['FIGMA', 'SKETCH', 'ADOBE_XD', 'PHOTOSHOP', 'ILLUSTRATOR']
  })
}

// 获取地区选项
export function getRegions() {
  return Promise.resolve({
    data: ['北京', '上海', '广州', '深圳', '杭州', '成都']
  })
}

// 搜索设计师
export function searchDesigners(keyword: string) {
  const filteredDesigners = mockDesigners.filter(designer =>
    designer.designerName.includes(keyword) ||
    designer.description?.includes(keyword)
  )
  return Promise.resolve({
    data: filteredDesigners
  })
}

// 收藏设计师
export function favoriteDesigner(designerId: number) {
  return request({
    url: `/designer/designer/${designerId}/favorite`,
    method: 'post'
  })
}

// 取消收藏设计师
export function unfavoriteDesigner(designerId: number) {
  return request({
    url: `/designer/designer/${designerId}/favorite`,
    method: 'delete'
  })
}

// 联系设计师
export function contactDesigner(designerId: number, message: string) {
  // 模拟成功响应
  return Promise.resolve({
    success: true,
    message: '消息发送成功'
  })
}
