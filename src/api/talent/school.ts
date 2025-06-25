/**
 * 院校数据库API服务接口
 * 基于若依设计师管理模块API的适配版本
 */

import request from '@/utils/request'
import type {
  School,
  SchoolQueryParams,
  Major,
  Faculty,
  Employment,
  Award,
  Achievement,
  Teacher,
  SchoolListParams,
  SchoolListResponse,
  SchoolDetailResponse,
  EmploymentStatistics,
  EmploymentDistribution,
  SchoolStudentsParams,
  SchoolStudentsResponse,
  SchoolMajorsResponse,
  SchoolAchievementsResponse
} from '@/types/talent/school'

// 环境配置：可以通过环境变量控制是否使用模拟数据
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  (import.meta.env.VITE_USE_MOCK_DATA === undefined && import.meta.env.DEV)

console.log('🔍 院校API环境变量调试信息:')
console.log('  VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('  DEV:', import.meta.env.DEV)
console.log('  USE_MOCK_DATA:', USE_MOCK_DATA)

// 院校基础管理 - 复用现有若依API
export const schoolApi = {
  // 查询院校列表 - 使用若依现有API
  list: (query: SchoolListParams) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校列表')
      // TODO: 实现模拟数据逻辑
      return Promise.resolve({
        rows: [],
        total: 0
      })
    } else {
      console.log('🚀 使用若依后端API - 院校列表')
      return request({
        url: '/designer/school/list',
        method: 'get',
        params: query
      })
    }
  },

  // 获取院校详情 - 使用若依现有API
  get: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校详情')
      // TODO: 实现模拟数据逻辑
      return Promise.resolve({
        data: null
      })
    } else {
      console.log('🚀 使用若依后端API - 院校详情')
      return request({
        url: `/designer/school/${id}`,
        method: 'get'
      })
    }
  },

  // 就业统计数据 - 使用若依现有API
  getEmploymentStats: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 就业统计')
      return Promise.resolve({
        data: {
          year: 2023,
          totalGraduates: 0,
          employedCount: 0,
          employmentRate: 0,
          averageSalary: 0,
          salaryRanges: []
        }
      })
    } else {
      console.log('🚀 使用若依后端API - 就业统计')
      return request({
        url: `/designer/school/${id}/employment/statistics`,
        method: 'get'
      })
    }
  },

  // 就业分布数据 - 使用若依现有API
  getEmploymentDistribution: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 就业分布')
      return Promise.resolve({
        data: {
          industryDistribution: [],
          regionDistribution: [],
          companySizeDistribution: []
        }
      })
    } else {
      console.log('🚀 使用若依后端API - 就业分布')
      return request({
        url: `/designer/school/${id}/employment/distribution`,
        method: 'get'
      })
    }
  },

  // 新增院校 - 使用若依现有API
  add: (data: Partial<School>) => {
    return request({
      url: '/designer/school',
      method: 'post',
      data: data
    })
  },

  // 修改院校 - 使用若依现有API
  update: (data: Partial<School>) => {
    return request({
      url: '/designer/school',
      method: 'put',
      data: data
    })
  },

  // 删除院校 - 使用若依现有API
  delete: (ids: number[]) => {
    return request({
      url: `/designer/school/${ids.join(',')}`,
      method: 'delete'
    })
  },

  // 按类型查询院校 - 通过list接口实现
  getByType: (schoolType: string) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 按类型查询院校')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/designer/school/list',
        method: 'get',
        params: { schoolType }
      })
    }
  },

  // 按地区查询院校 - 通过list接口实现
  getByLocation: (province: string, city?: string) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 按地区查询院校')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/designer/school/list',
        method: 'get',
        params: { location: city ? `${province}-${city}` : province }
      })
    }
  },

  // 搜索院校 - 通过list接口实现
  search: (keyword: string) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 搜索院校')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/designer/school/list',
        method: 'get',
        params: { schoolName: keyword }
      })
    }
  },

  // 扩展API（需要后端新增）
  getSchoolStudents: (id: number, params: SchoolStudentsParams) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校学生列表')
      return Promise.resolve({
        total: 0,
        rows: []
      })
    } else {
      return request({
        url: `/designer/school/${id}/students`,
        method: 'get',
        params
      })
    }
  },

  getSchoolMajors: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校专业列表')
      return Promise.resolve({
        majors: []
      })
    } else {
      return request({
        url: `/designer/school/${id}/majors`,
        method: 'get'
      })
    }
  },

  getSchoolAchievements: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校成果列表')
      return Promise.resolve({
        achievements: []
      })
    } else {
      return request({
        url: `/designer/school/${id}/achievements`,
        method: 'get'
      })
    }
  }
}

// 专业相关API
export const majorApi = {
  // 查询专业列表
  list: (schoolId?: number, category?: string) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 专业列表')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/school/major/list',
        method: 'get',
        params: { schoolId, category }
      })
    }
  },

  // 获取专业详情
  get: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 专业详情')
      return Promise.resolve({
        data: null
      })
    } else {
      return request({
        url: `/school/major/${id}`,
        method: 'get'
      })
    }
  },

  // 按院校查询专业
  getBySchool: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 按院校查询专业')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/major/school/${schoolId}`,
        method: 'get'
      })
    }
  },

  // 按分类查询专业
  getByCategory: (category: string) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 按分类查询专业')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/major/category/${category}`,
        method: 'get'
      })
    }
  }
}

// 师资相关API
export const facultyApi = {
  // 查询学院列表
  list: (schoolId?: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 学院列表')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/school/faculty/list',
        method: 'get',
        params: { schoolId }
      })
    }
  },

  // 获取学院详情
  get: (id: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 学院详情')
      return Promise.resolve({
        data: null
      })
    } else {
      return request({
        url: `/school/faculty/${id}`,
        method: 'get'
      })
    }
  },

  // 按院校查询学院
  getBySchool: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 按院校查询学院')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/faculty/school/${schoolId}`,
        method: 'get'
      })
    }
  },

  // 查询教师列表
  getTeachers: (facultyId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 教师列表')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/teacher/faculty/${facultyId}`,
        method: 'get'
      })
    }
  }
}

// 就业数据API
export const employmentApi = {
  // 获取院校就业数据
  getBySchool: (schoolId: number, year?: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校就业数据')
      return Promise.resolve({
        data: null
      })
    } else {
      return request({
        url: `/school/employment/school/${schoolId}`,
        method: 'get',
        params: { year }
      })
    }
  },

  // 获取专业就业数据
  getByMajor: (majorId: number, year?: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 专业就业数据')
      return Promise.resolve({
        data: null
      })
    } else {
      return request({
        url: `/school/employment/major/${majorId}`,
        method: 'get',
        params: { year }
      })
    }
  },

  // 获取就业趋势数据
  getTrend: (schoolId: number, years: number[]) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 就业趋势数据')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/employment/trend/${schoolId}`,
        method: 'get',
        params: { years: years.join(',') }
      })
    }
  }
}

// 获奖成果API
export const achievementApi = {
  // 获取院校获奖列表
  getAwards: (schoolId: number, level?: string, year?: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校获奖列表')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/award/school/${schoolId}`,
        method: 'get',
        params: { level, year }
      })
    }
  },

  // 获取院校成果列表
  getAchievements: (schoolId: number, type?: string, year?: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校成果列表')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: `/school/achievement/school/${schoolId}`,
        method: 'get',
        params: { type, year }
      })
    }
  },

  // 获取获奖统计数据
  getAwardStats: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 获奖统计数据')
      return Promise.resolve({
        data: {
          international: 0,
          national: 0,
          provincial: 0,
          municipal: 0
        }
      })
    } else {
      return request({
        url: `/school/award/stats/${schoolId}`,
        method: 'get'
      })
    }
  }
}

// 用户交互API - 扩展接口（需要后端新增）
export const schoolInteractionApi = {
  // 收藏院校 - 扩展功能
  favorite: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 收藏院校')
      return Promise.resolve({
        success: true,
        message: '收藏成功'
      })
    } else {
      return request({
        url: `/designer/school/${schoolId}/favorite`,
        method: 'post'
      })
    }
  },

  // 取消收藏院校 - 扩展功能
  unfavorite: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 取消收藏院校')
      return Promise.resolve({
        success: true,
        message: '取消收藏成功'
      })
    } else {
      return request({
        url: `/designer/school/${schoolId}/favorite`,
        method: 'delete'
      })
    }
  },

  // 获取我的收藏院校列表 - 扩展功能
  getFavoriteSchools: () => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 收藏院校列表')
      return Promise.resolve({
        total: 0,
        rows: []
      })
    } else {
      return request({
        url: '/designer/school/favorites',
        method: 'get'
      })
    }
  },

  // 分享院校 - 扩展功能
  share: (schoolId: number) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 分享院校')
      return Promise.resolve({
        shareUrl: `http://example.com/school/${schoolId}`,
        qrCode: 'data:image/png;base64,xxx'
      })
    } else {
      return request({
        url: `/designer/school/${schoolId}/share`,
        method: 'post'
      })
    }
  },

  // 院校对比 - 扩展功能
  compareSchools: (schoolIds: number[], compareFields: string[]) => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校对比')
      return Promise.resolve({
        schools: []
      })
    } else {
      return request({
        url: '/designer/school/compare',
        method: 'post',
        data: { schoolIds, compareFields }
      })
    }
  }
}

// 统计信息API
export const statisticsApi = {
  // 获取院校概览统计
  getOverview: () => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 院校概览统计')
      return Promise.resolve({
        data: {
          totalSchools: 156,
          totalMajors: 1250,
          totalStudents: 3450000,
          averageEmploymentRate: 95.2
        }
      })
    } else {
      return request({
        url: '/school/statistics/overview',
        method: 'get'
      })
    }
  },

  // 获取地区分布统计
  getRegionDistribution: () => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 地区分布统计')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/school/statistics/region',
        method: 'get'
      })
    }
  },

  // 获取类型分布统计
  getTypeDistribution: () => {
    if (USE_MOCK_DATA) {
      console.log('🔧 使用模拟数据 - 类型分布统计')
      return Promise.resolve({
        data: []
      })
    } else {
      return request({
        url: '/school/statistics/type',
        method: 'get'
      })
    }
  }
}
