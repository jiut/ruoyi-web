import type {
  School,
  SchoolType,
  SchoolLevel,
  Major,
  Faculty,
  Employment,
  Award,
  Achievement
} from '@/types/talent/school'

// 模拟院校数据
export const mockSchools: School[] = [
  {
    id: 1,
    schoolName: '清华大学',
    schoolType: 'COMPREHENSIVE' as SchoolType,
    location: '北京市海淀区',
    province: '北京市',
    city: '北京市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 1,
    description: '清华大学美术学院设计系成立于1984年，是中国最早开设设计专业的院系之一。',
    logo: '',
    website: 'https://www.tsinghua.edu.cn',
    address: '北京市海淀区清华园1号',
    phone: '010-62782051',
    email: 'info@tsinghua.edu.cn',
    totalStudents: 48000,
    totalTeachers: 3485,
    facultyCount: 15,
    majorCount: 82,
    status: 'ACTIVE',
    isKey: true,
    is985: true,
    is211: true,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 2,
    schoolName: '中央美术学院',
    schoolType: 'ART' as SchoolType,
    location: '北京市朝阳区',
    province: '北京市',
    city: '北京市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 1,
    description: '中央美术学院是中华人民共和国教育部直属的唯一一所高等美术学校。',
    logo: '',
    website: 'https://www.cafa.edu.cn',
    address: '北京市朝阳区花家地南街8号',
    phone: '010-64771056',
    email: 'info@cafa.edu.cn',
    totalStudents: 4500,
    totalTeachers: 572,
    facultyCount: 8,
    majorCount: 15,
    status: 'ACTIVE',
    isKey: true,
    is985: false,
    is211: false,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 3,
    schoolName: '同济大学',
    schoolType: 'COMPREHENSIVE' as SchoolType,
    location: '上海市杨浦区',
    province: '上海市',
    city: '上海市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 20,
    description: '同济大学设计创意学院是国内最具影响力的设计学院之一。',
    logo: '',
    website: 'https://www.tongji.edu.cn',
    address: '上海市杨浦区四平路1239号',
    phone: '021-65982200',
    email: 'info@tongji.edu.cn',
    totalStudents: 35000,
    totalTeachers: 2804,
    facultyCount: 12,
    majorCount: 96,
    status: 'ACTIVE',
    isKey: true,
    is985: true,
    is211: true,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 4,
    schoolName: '中国美术学院',
    schoolType: 'ART' as SchoolType,
    location: '浙江省杭州市',
    province: '浙江省',
    city: '杭州市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 2,
    description: '中国美术学院是中国第一所综合性的国立高等艺术学府。',
    logo: '',
    website: 'https://www.caa.edu.cn',
    address: '浙江省杭州市上城区南山路218号',
    phone: '0571-87164630',
    email: 'info@caa.edu.cn',
    totalStudents: 9000,
    totalTeachers: 900,
    facultyCount: 18,
    majorCount: 26,
    status: 'ACTIVE',
    isKey: true,
    is985: false,
    is211: false,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 5,
    schoolName: '广州美术学院',
    schoolType: 'ART' as SchoolType,
    location: '广东省广州市',
    province: '广东省',
    city: '广州市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 3,
    description: '广州美术学院是华南地区唯一一所高等美术学府。',
    logo: '',
    website: 'https://www.gzarts.edu.cn',
    address: '广东省广州市海珠区昌岗东路257号',
    phone: '020-84017740',
    email: 'info@gzarts.edu.cn',
    totalStudents: 8000,
    totalTeachers: 700,
    facultyCount: 12,
    majorCount: 31,
    status: 'ACTIVE',
    isKey: true,
    is985: false,
    is211: false,
    isDoubleFirst: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 6,
    schoolName: '江南大学',
    schoolType: 'COMPREHENSIVE' as SchoolType,
    location: '江苏省无锡市',
    province: '江苏省',
    city: '无锡市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 41,
    description: '江南大学设计学院是国内工业设计教育的重要基地。',
    logo: '',
    website: 'https://www.jiangnan.edu.cn',
    address: '江苏省无锡市蠡湖大道1800号',
    phone: '0510-85913669',
    email: 'info@jiangnan.edu.cn',
    totalStudents: 20000,
    totalTeachers: 1500,
    facultyCount: 8,
    majorCount: 55,
    status: 'ACTIVE',
    isKey: true,
    is985: false,
    is211: true,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 7,
    schoolName: '北京理工大学',
    schoolType: 'ENGINEERING' as SchoolType,
    location: '北京市海淀区',
    province: '北京市',
    city: '北京市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 25,
    description: '北京理工大学设计与艺术学院致力于培养具有创新精神的设计人才。',
    logo: '',
    website: 'https://www.bit.edu.cn',
    address: '北京市海淀区中关村南大街5号',
    phone: '010-68912114',
    email: 'info@bit.edu.cn',
    totalStudents: 28000,
    totalTeachers: 2200,
    facultyCount: 10,
    majorCount: 70,
    status: 'ACTIVE',
    isKey: true,
    is985: true,
    is211: true,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  },
  {
    id: 8,
    schoolName: '湖南大学',
    schoolType: 'COMPREHENSIVE' as SchoolType,
    location: '湖南省长沙市',
    province: '湖南省',
    city: '长沙市',
    level: 'UNDERGRADUATE' as SchoolLevel,
    ranking: 27,
    description: '湖南大学设计艺术学院是国内最早设立工业设计专业的院校之一。',
    logo: '',
    website: 'https://www.hnu.edu.cn',
    address: '湖南省长沙市岳麓区麓山南路2号',
    phone: '0731-88822818',
    email: 'info@hnu.edu.cn',
    totalStudents: 35000,
    totalTeachers: 2500,
    facultyCount: 11,
    majorCount: 75,
    status: 'ACTIVE',
    isKey: true,
    is985: true,
    is211: true,
    isDoubleFirst: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-27T00:00:00.000Z'
  }
]

// 模拟专业数据
export const mockMajors: Major[] = []

// 模拟学院数据
export const mockFaculties: Faculty[] = []

// 模拟就业数据
export const mockEmployment: Employment[] = []

// 模拟获奖数据
export const mockAwards: Award[] = []

// 模拟成果数据
export const mockAchievements: Achievement[] = []

// 获取模拟院校数据的函数
export function getMockSchools(params?: {
  pageNum?: number
  pageSize?: number
  schoolName?: string
  schoolType?: string
  province?: string
  city?: string
  level?: string
  isKey?: boolean
  is985?: boolean
  is211?: boolean
  isDoubleFirst?: boolean
}) {
  let filteredSchools = [...mockSchools]

  // 应用筛选条件
  if (params?.schoolName) {
    filteredSchools = filteredSchools.filter(school =>
      school.schoolName.includes(params.schoolName!)
    )
  }

  if (params?.schoolType) {
    filteredSchools = filteredSchools.filter(school =>
      school.schoolType === params.schoolType
    )
  }

  if (params?.province) {
    filteredSchools = filteredSchools.filter(school =>
      school.province === params.province
    )
  }

  if (params?.city) {
    filteredSchools = filteredSchools.filter(school =>
      school.city === params.city
    )
  }

  if (params?.level) {
    filteredSchools = filteredSchools.filter(school =>
      school.level === params.level
    )
  }

  if (params?.isKey !== undefined) {
    filteredSchools = filteredSchools.filter(school =>
      school.isKey === params.isKey
    )
  }

  if (params?.is985 !== undefined) {
    filteredSchools = filteredSchools.filter(school =>
      school.is985 === params.is985
    )
  }

  if (params?.is211 !== undefined) {
    filteredSchools = filteredSchools.filter(school =>
      school.is211 === params.is211
    )
  }

  if (params?.isDoubleFirst !== undefined) {
    filteredSchools = filteredSchools.filter(school =>
      school.isDoubleFirst === params.isDoubleFirst
    )
  }

  // 分页
  const pageNum = params?.pageNum || 1
  const pageSize = params?.pageSize || 20
  const startIndex = (pageNum - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    rows: filteredSchools.slice(startIndex, endIndex),
    total: filteredSchools.length,
    pageNum,
    pageSize
  }
}

// 根据ID获取院校详情
export function getMockSchoolById(id: number) {
  return mockSchools.find(school => school.id === id) || null
}
