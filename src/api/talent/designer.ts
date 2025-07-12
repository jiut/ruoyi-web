import request from '@/utils/request'
import type {
  Award,
  Designer,
  DesignerQueryParams,
  Education,
  Profession,
  SkillTag,
  Work,
  WorkExperience,
} from '@/types/talent/designer'
import {
  mockAwards,
  mockDesigners,
  mockEducation,
  mockWorkExperience,
  mockWorks,
} from '@/data/mockDesigners'

// 环境配置：可以通过环境变量控制是否使用模拟数据
// 默认在开发环境使用mock数据，生产环境使用API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
  || (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 设计师API环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

// 查询设计师列表
export function listDesigner(query: DesignerQueryParams) {
  if (USE_MOCK_DATA) {
    // 使用模拟数据
    console.log('🔧 使用模拟数据 - 设计师列表')

    // 模拟筛选逻辑
    let filtered = [...mockDesigners]

    // 按职业筛选
    if (query.profession)
      filtered = filtered.filter(d => d.profession === query.profession)

    // 按技能标签筛选
    if (query.skillTags) {
      const skillTagsArray = query.skillTags.split(',')
      filtered = filtered.filter((d) => {
        const designerSkills = JSON.parse(d.skillTags || '[]')
        return skillTagsArray.some(tag => designerSkills.includes(tag))
      })
    }

    // 按地区筛选
    if (query.location)
      filtered = filtered.filter(d => d.location?.includes(query.location || ''))

    // 按工作状态筛选
    if (query.workStatus)
      filtered = filtered.filter(d => d.workStatus === query.workStatus)

    // 按工作年限筛选
    if (query.minExperience !== undefined)
      filtered = filtered.filter(d => (d.workYears || d.experience || 0) >= query.minExperience!)

    if (query.maxExperience !== undefined)
      filtered = filtered.filter(d => (d.workYears || d.experience || 0) <= query.maxExperience!)

    // 按姓名搜索
    if (query.designerName)
      filtered = filtered.filter(d => d.designerName.includes(query.designerName!))

    // 分页处理
    const pageNum = query.pageNum || 1
    const pageSize = query.pageSize || 20
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filtered.slice(start, end)

    return Promise.resolve({
      rows: paginatedData,
      total: filtered.length,
    })
  }
  else {
    // 使用真实API
    console.log('🚀 使用后端API - 设计师列表')
    return request({
      url: '/designer/designer/list',
      method: 'get',
      params: query,
    })
  }
}

// 获取设计师详细信息
export function getDesigner(id: number) {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师详情')
    const designer = mockDesigners.find(d => d.id === id)
    return Promise.resolve({
      data: designer || null,
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师详情')
    return request({
      url: `/designer/designer/${id}`,
      method: 'get',
    })
  }
}

// 获取当前登录用户的设计师信息
export function getCurrentDesigner() {
  console.log('🚀 获取当前用户设计师信息')
  return request({
    url: '/designer/designer/profile',
    method: 'get',
  })
}

// 新增设计师
export function addDesigner(data: Partial<Designer>) {
  return request({
    url: '/designer/designer',
    method: 'post',
    data,
  })
}

// 修改设计师档案（设计师自我编辑）
export function updateDesigner(data: Partial<Designer>) {
  return request({
    url: '/designer/designer/profile',
    method: 'put',
    data,
  })
}

// 删除设计师
export function delDesigner(ids: number[]) {
  return request({
    url: `/designer/designer/${ids.join(',')}`,
    method: 'delete',
  })
}

// 按职业查询设计师
export function getDesignersByProfession(profession: Profession) {
  if (USE_MOCK_DATA) {
    const filtered = mockDesigners.filter(d => d.profession === profession)
    return Promise.resolve({
      data: filtered,
    })
  }
  else {
    return request({
      url: `/designer/designer/profession/${profession}`,
      method: 'get',
    })
  }
}

// 按技能查询设计师
export function getDesignersBySkills(skillTags: SkillTag[]) {
  if (USE_MOCK_DATA) {
    const filtered = mockDesigners.filter((d) => {
      const designerSkills = JSON.parse(d.skillTags || '[]')
      return skillTags.some(tag => designerSkills.includes(tag))
    })
    return Promise.resolve({
      data: filtered,
    })
  }
  else {
    return request({
      url: '/designer/designer/skills',
      method: 'get',
      params: { skillTags: skillTags.join(',') },
    })
  }
}

// 获取设计师作品集
export function getDesignerWorks(designerId: number) {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师作品集')
    const works = mockWorks.filter(w => w.designerId === designerId)
    return Promise.resolve({
      data: works,
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师作品集')
    return request({
      url: `/designer/work/designer/${designerId}`,
      method: 'get',
    })
  }
}

// 获取设计师工作经历
export function getDesignerWorkExperience(designerId: number) {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师工作经历')
    const workExp = mockWorkExperience.filter(w => w.designerId === designerId)
    return Promise.resolve({
      data: workExp,
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师工作经历')
    return request({
      url: `/designer/work-experience/designer/${designerId}`,
      method: 'get',
    })
  }
}

// 获取设计师教育背景
export function getDesignerEducation(designerId: number) {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师教育背景')
    const education = mockEducation.filter(e => e.designerId === designerId)
    return Promise.resolve({
      data: education,
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师教育背景')
    return request({
      url: `/designer/education/designer/${designerId}`,
      method: 'get',
    })
  }
}

// 获取设计师获奖情况
export function getDesignerAwards(designerId: number) {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师获奖情况')
    const awards = mockAwards.filter(a => a.designerId === designerId)
    return Promise.resolve({
      data: awards,
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师获奖情况')
    return request({
      url: `/designer/award/designer/${designerId}`,
      method: 'get',
    })
  }
}

// 获取职业选项
export function getProfessions() {
  if (USE_MOCK_DATA) {
    const professions = [...new Set(mockDesigners.map(d => d.profession))]
    return Promise.resolve({
      data: professions,
    })
  }
  else {
    return request({
      url: '/designer/professions',
      method: 'get',
    })
  }
}

// 获取技能标签选项
export function getSkillTags() {
  if (USE_MOCK_DATA) {
    const allTags = new Set<string>()
    mockDesigners.forEach((designer) => {
      try {
        const skills = JSON.parse(designer.skillTags || '[]')
        skills.forEach((skill: string) => allTags.add(skill))
      }
      catch (error) {
        console.error('解析技能标签失败:', error)
      }
    })
    return Promise.resolve({
      data: Array.from(allTags),
    })
  }
  else {
    return request({
      url: '/designer/skill-tags',
      method: 'get',
    })
  }
}

// 获取地区选项
export function getRegions() {
  if (USE_MOCK_DATA) {
    const regions = [...new Set(mockDesigners
      .map(d => d.location)
      .filter((location): location is string => !!location)
      .map(location => `${location.split('市')[0]}市`),
    )].sort()
    return Promise.resolve({
      data: regions,
    })
  }
  else {
    return request({
      url: '/designer/regions',
      method: 'get',
    })
  }
}

// 搜索设计师
export function searchDesigners(keyword: string) {
  if (USE_MOCK_DATA) {
    const filteredDesigners = mockDesigners.filter(designer =>
      designer.designerName.includes(keyword)
      || designer.description?.includes(keyword),
    )
    return Promise.resolve({
      data: filteredDesigners,
    })
  }
  else {
    return request({
      url: '/designer/designer/search',
      method: 'get',
      params: { keyword },
    })
  }
}

// 收藏设计师
export function favoriteDesigner(designerId: number) {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      success: true,
      message: '收藏成功',
    })
  }
  else {
    return request({
      url: `/designer/designer/${designerId}/favorite`,
      method: 'post',
    })
  }
}

// 取消收藏设计师
export function unfavoriteDesigner(designerId: number) {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      success: true,
      message: '取消收藏成功',
    })
  }
  else {
    return request({
      url: `/designer/designer/${designerId}/favorite`,
      method: 'delete',
    })
  }
}

// 联系设计师
export function contactDesigner(designerId: number, message: string) {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      success: true,
      message: '消息发送成功',
    })
  }
  else {
    return request({
      url: `/designer/designer/${designerId}/contact`,
      method: 'post',
      data: { message },
    })
  }
}

// ================================
// 教育背景相关接口
// ================================

// 新增教育背景
export function addEducation(data: Partial<Education>) {
  return request({
    url: '/designer/education',
    method: 'post',
    data,
  })
}

// 修改教育背景
export function updateEducation(data: Partial<Education>) {
  return request({
    url: `/designer/education/${data.id}`,
    method: 'put',
    data,
  })
}

// 删除教育背景
export function deleteEducation(id: string | number) {
  return request({
    url: `/designer/education/${id}`,
    method: 'delete',
  })
}

// ================================
// 工作经历相关接口
// ================================

// 新增工作经历
export function addWorkExperience(data: Partial<WorkExperience>) {
  return request({
    url: '/designer/work-experience',
    method: 'post',
    data,
  })
}

// 修改工作经历
export function updateWorkExperience(data: Partial<WorkExperience>) {
  return request({
    url: `/designer/work-experience/${data.id}`,
    method: 'put',
    data,
  })
}

// 删除工作经历
export function deleteWorkExperience(id: string | number) {
  return request({
    url: `/designer/work-experience/${id}`,
    method: 'delete',
  })
}

// ================================
// 作品相关接口
// ================================

// 新增作品
export function addWork(data: Partial<Work>) {
  return request({
    url: '/designer/work',
    method: 'post',
    data,
  })
}

// 修改作品
export function updateWork(data: Partial<Work>) {
  return request({
    url: `/designer/work/${data.id}`,
    method: 'put',
    data,
  })
}

// 删除作品
export function deleteWork(id: string | number) {
  return request({
    url: `/designer/work/${id}`,
    method: 'delete',
  })
}

// ================================
// 获奖记录相关接口
// ================================

// 新增获奖记录
export function addAward(data: Partial<Award>) {
  return request({
    url: '/designer/award',
    method: 'post',
    data,
  })
}

// 更新获奖记录
export function updateAward(data: Partial<Award>) {
  return request({
    url: `/designer/award/${data.id}`,
    method: 'put',
    data,
  })
}

// 删除获奖记录
export function deleteAward(id: string | number) {
  return request({
    url: `/designer/award/${id}`,
    method: 'delete',
  })
}

// 设计师完整详情数据类型
export interface DesignerCompleteDetail {
  designer: Designer | null
  works: Work[]
  workExperiences: WorkExperience[]
  educations: Education[]
  awards: Award[]
}

// 获取设计师完整详情（聚合API）
export function getDesignerComplete(designerId: number | string): Promise<{ data: DesignerCompleteDetail }> {
  if (USE_MOCK_DATA) {
    console.log('🔧 使用模拟数据 - 设计师完整详情')

    // 确保ID比较时类型一致
    const numericId = typeof designerId === 'string' ? Number(designerId) : designerId
    const designer = mockDesigners.find(d => d.id === numericId)
    const works = mockWorks.filter(w => w.designerId === numericId)
    const workExp = mockWorkExperience.filter(w => w.designerId === numericId)
      .sort((a: WorkExperience, b: WorkExperience) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
    const education = mockEducation.filter(e => e.designerId === numericId)
      .sort((a: Education, b: Education) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
    const awards = mockAwards.filter(a => a.designerId === numericId)
      .sort((a: Award, b: Award) => (b.year || 0) - (a.year || 0))

    return Promise.resolve({
      data: {
        designer: designer || null,
        works,
        workExperiences: workExp,
        educations: education,
        awards,
      },
    })
  }
  else {
    console.log('🚀 使用后端API - 设计师完整详情')
    return request({
      url: `/designer/designer/${designerId}/complete`,
      method: 'get',
    }) as Promise<{ data: DesignerCompleteDetail }>
  }
}
