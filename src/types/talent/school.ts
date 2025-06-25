/**
 * 院校数据库相关类型定义
 */

// 院校基础信息接口
export interface School {
  id: number
  schoolName: string
  schoolType: SchoolType
  location: string
  province: string
  city: string
  level: SchoolLevel
  ranking: number
  description: string
  logo: string
  website: string
  address: string
  phone: string
  email: string
  // 统计数据
  totalStudents: number
  totalTeachers: number
  facultyCount: number
  majorCount: number
  // 状态
  status: string
  isKey: boolean // 是否重点院校
  is985: boolean
  is211: boolean
  isDoubleFirst: boolean // 是否双一流
  // 时间戳
  createdAt: string
  updatedAt: string
  // 关联数据
  majors?: Major[]
  faculties?: Faculty[]
  employmentData?: Employment
  awards?: Award[]
  achievements?: Achievement[]
}

// 院校类型枚举
export enum SchoolType {
  COMPREHENSIVE = 'COMPREHENSIVE', // 综合类
  ENGINEERING = 'ENGINEERING', // 工科类
  SCIENCE = 'SCIENCE', // 理科类
  LIBERAL_ARTS = 'LIBERAL_ARTS', // 文科类
  MEDICAL = 'MEDICAL', // 医科类
  AGRICULTURE = 'AGRICULTURE', // 农林类
  NORMAL = 'NORMAL', // 师范类
  ART = 'ART', // 艺术类
  FINANCE = 'FINANCE', // 财经类
  SPORTS = 'SPORTS', // 体育类
  POLITICS_LAW = 'POLITICS_LAW', // 政法类
  ETHNIC = 'ETHNIC', // 民族类
  MILITARY = 'MILITARY' // 军事类
}

// 院校级别枚举
export enum SchoolLevel {
  UNDERGRADUATE = 'UNDERGRADUATE', // 本科
  JUNIOR_COLLEGE = 'JUNIOR_COLLEGE', // 专科
  GRADUATE = 'GRADUATE', // 研究生
  VOCATIONAL = 'VOCATIONAL' // 职业学校
}

// 院校类型标签映射
export const SchoolTypeLabels: Record<SchoolType, string> = {
  [SchoolType.COMPREHENSIVE]: '综合类',
  [SchoolType.ENGINEERING]: '工科类',
  [SchoolType.SCIENCE]: '理科类',
  [SchoolType.LIBERAL_ARTS]: '文科类',
  [SchoolType.MEDICAL]: '医科类',
  [SchoolType.AGRICULTURE]: '农林类',
  [SchoolType.NORMAL]: '师范类',
  [SchoolType.ART]: '艺术类',
  [SchoolType.FINANCE]: '财经类',
  [SchoolType.SPORTS]: '体育类',
  [SchoolType.POLITICS_LAW]: '政法类',
  [SchoolType.ETHNIC]: '民族类',
  [SchoolType.MILITARY]: '军事类'
}

// 专业设置接口
export interface Major {
  id: number
  majorName: string
  majorCode: string
  category: MajorCategory
  level: string // 学士/硕士/博士
  duration: number // 学制年限
  description: string
  schoolId: number
  facultyId: number
  // 统计数据
  studentCount: number
  employmentRate: number
  averageSalary: number
  // 课程信息
  coreSubjects: string // JSON格式
  skillRequirements: string // JSON格式
  // 时间戳
  createdAt: string
  updatedAt: string
  // 关联数据
  faculty?: Faculty
  employment?: Employment
}

// 专业类别枚举
export enum MajorCategory {
  DESIGN = 'DESIGN', // 设计学
  ART = 'ART', // 艺术学
  ENGINEERING = 'ENGINEERING', // 工学
  SCIENCE = 'SCIENCE', // 理学
  LIBERAL_ARTS = 'LIBERAL_ARTS', // 文学
  MANAGEMENT = 'MANAGEMENT', // 管理学
  ECONOMICS = 'ECONOMICS', // 经济学
  LAW = 'LAW', // 法学
  EDUCATION = 'EDUCATION', // 教育学
  MEDICINE = 'MEDICINE', // 医学
  AGRICULTURE = 'AGRICULTURE', // 农学
  PHILOSOPHY = 'PHILOSOPHY', // 哲学
  HISTORY = 'HISTORY' // 历史学
}

// 专业类别标签映射
export const MajorCategoryLabels: Record<MajorCategory, string> = {
  [MajorCategory.DESIGN]: '设计学',
  [MajorCategory.ART]: '艺术学',
  [MajorCategory.ENGINEERING]: '工学',
  [MajorCategory.SCIENCE]: '理学',
  [MajorCategory.LIBERAL_ARTS]: '文学',
  [MajorCategory.MANAGEMENT]: '管理学',
  [MajorCategory.ECONOMICS]: '经济学',
  [MajorCategory.LAW]: '法学',
  [MajorCategory.EDUCATION]: '教育学',
  [MajorCategory.MEDICINE]: '医学',
  [MajorCategory.AGRICULTURE]: '农学',
  [MajorCategory.PHILOSOPHY]: '哲学',
  [MajorCategory.HISTORY]: '历史学'
}

// 师资信息接口
export interface Faculty {
  id: number
  facultyName: string
  description: string
  schoolId: number
  dean: string
  contactEmail: string
  contactPhone: string
  website: string
  // 统计数据
  teacherCount: number
  professorCount: number
  associateProfessorCount: number
  lecturerCount: number
  // 时间戳
  createdAt: string
  updatedAt: string
  // 关联数据
  majors?: Major[]
  teachers?: Teacher[]
}

// 师资统计接口
export interface FacultyStats {
  totalFaculty: number // 专任教师总数
  professors: number // 教授/副教授数量
  doctorDegree: number // 博士学位教师数量
  overseasBackground: number // 海外背景教师数量
}

// 就业信息接口
export interface Employment {
  id: number
  schoolId: number
  majorId?: number
  year: number
  // 就业数据
  totalGraduates: number
  employedCount: number
  employmentRate: number
  furtherStudyCount: number
  furtherStudyRate: number
  // 薪资数据
  averageSalary: number
  medianSalary: number
  salaryDistribution: string // JSON格式
  // 行业分布
  industryDistribution: string // JSON格式
  // 地区分布
  regionDistribution: string // JSON格式
  // 时间戳
  createdAt: string
  updatedAt: string
}

// 获奖成果接口
export interface Award {
  id: number
  awardName: string
  awardLevel: AwardLevel
  year: number
  category: string
  description: string
  studentName?: string
  teacherName?: string
  workTitle?: string
  schoolId: number
  majorId?: number
  // 时间戳
  createdAt: string
  updatedAt: string
}

// 成果级别枚举
export enum AwardLevel {
  INTERNATIONAL = 'INTERNATIONAL', // 国际级
  NATIONAL = 'NATIONAL', // 国家级
  PROVINCIAL = 'PROVINCIAL', // 省部级
  MUNICIPAL = 'MUNICIPAL', // 市级
  SCHOOL = 'SCHOOL' // 校级
}

// 获奖级别标签映射
export const AwardLevelLabels: Record<AwardLevel, string> = {
  [AwardLevel.INTERNATIONAL]: '国际级',
  [AwardLevel.NATIONAL]: '国家级',
  [AwardLevel.PROVINCIAL]: '省部级',
  [AwardLevel.MUNICIPAL]: '市级',
  [AwardLevel.SCHOOL]: '校级'
}

// 年度获奖统计接口
export interface AchievementStats {
  year: number
  international: number
  national: number
  provincial: number
  total: number
}

// 院校查询参数接口
// 原有查询参数（保持向后兼容）
export interface SchoolQueryParams {
  pageNum?: number
  pageSize?: number
  schoolName?: string
  schoolType?: SchoolType
  province?: string
  city?: string
  level?: SchoolLevel
  isKey?: boolean
  is985?: boolean
  is211?: boolean
  isDoubleFirst?: boolean
  minRanking?: number
  maxRanking?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 适配若依API的查询参数
export interface SchoolListParams {
  pageNum?: number
  pageSize?: number
  schoolName?: string        // 院校名称搜索
  schoolType?: string        // 院校类型筛选
  location?: string          // 地区筛选
  level?: string            // 层次筛选（本科/专科）
  orderBy?: string          // 排序字段
  orderDirection?: 'asc' | 'desc'  // 排序方向
}

// 院校学生查询参数
export interface SchoolStudentsParams {
  pageNum?: number
  pageSize?: number
  status?: 'current' | 'graduate'    // 在校/毕业
  profession?: string                 // 专业筛选
  graduationYear?: number            // 毕业年份
}

// 院校学生响应
export interface SchoolStudentsResponse {
  total: number
  rows: DesignerProfile[]
}

// 院校专业响应
export interface SchoolMajorsResponse {
  majors: Major[]
}

// 院校成果响应
export interface SchoolAchievementsResponse {
  achievements: Achievement[]
}

// 就业统计数据（适配若依API）
export interface EmploymentStatistics {
  year: number
  totalGraduates: number
  employedCount: number
  employmentRate: number
  averageSalary: number
  salaryRanges: Array<{
    range: string
    count: number
    percentage: number
  }>
}

// 就业分布数据（适配若依API）
export interface EmploymentDistribution {
  // 行业分布
  industryDistribution: Array<{
    industry: string
    count: number
    percentage: number
  }>

  // 地区分布
  regionDistribution: Array<{
    region: string
    count: number
    percentage: number
  }>

  // 企业规模分布
  companySizeDistribution: Array<{
    size: string
    count: number
    percentage: number
  }>
}

// 院校对比请求
export interface SchoolCompareRequest {
  schoolIds: number[]      // 要对比的院校ID列表
  compareFields: string[]  // 对比字段
}

// 院校对比响应
export interface SchoolCompareResponse {
  schools: Array<{
    id: number
    schoolName: string
    compareData: Record<string, any>
  }>
}

// 收藏操作响应
export interface FavoriteResponse {
  success: boolean
  message: string
}

// 分享响应
export interface ShareResponse {
  shareUrl: string
  qrCode: string
}

// 设计师档案（简化版，用于院校学生列表）
export interface DesignerProfile {
  id: number
  designerName: string
  profession: string
  avatar?: string
  email?: string
  phone?: string
  status?: string
  graduationYear?: number
  currentCompany?: string
}

// 院校排序方式枚举
export enum SchoolSortBy {
  COMPREHENSIVE = 'COMPREHENSIVE', // 综合排序
  EMPLOYMENT_RATE = 'EMPLOYMENT_RATE', // 就业率优先
  FACULTY_STRENGTH = 'FACULTY_STRENGTH', // 师资力量优先
  STUDENT_SCORE = 'STUDENT_SCORE' // 学生评分优先
}

// 院校排序标签映射
export const SchoolSortLabels: Record<SchoolSortBy, string> = {
  [SchoolSortBy.COMPREHENSIVE]: '综合排序',
  [SchoolSortBy.EMPLOYMENT_RATE]: '就业率优先',
  [SchoolSortBy.FACULTY_STRENGTH]: '师资力量优先',
  [SchoolSortBy.STUDENT_SCORE]: '学生评分优先',
  [SchoolSortBy.ESTABLISHED_YEAR]: '建校时间'
}

// API响应接口
export interface SchoolListResponse {
  code: number
  msg: string
  total: number
  rows: School[]
}

export interface SchoolDetailResponse {
  code: number
  msg: string
  data: School & {
    majors?: Major[]
    faculty?: Faculty[]
    facultyStats?: FacultyStats
    employment?: Employment
    awards?: Award[]
    achievements?: Achievement[]
  }
}

// 常用常量
export const EMPLOYMENT_RATE_OPTIONS = [
  { label: '不限', value: undefined },
  { label: '90% 以上', value: 90 },
  { label: '80% - 90%', value: 80 },
  { label: '70% - 80%', value: 70 }
]

export const PROVINCE_OPTIONS = [
  { label: '全部省份', value: '' },
  { label: '北京市', value: '北京' },
  { label: '上海市', value: '上海' },
  { label: '广东省', value: '广东' },
  { label: '江苏省', value: '江苏' },
  { label: '浙江省', value: '浙江' },
  { label: '四川省', value: '四川' },
  { label: '湖北省', value: '湖北' },
  { label: '陕西省', value: '陕西' },
  { label: '天津市', value: '天津' },
  { label: '重庆市', value: '重庆' }
]

export const SchoolLevelLabels: Record<SchoolLevel, string> = {
  [SchoolLevel.UNDERGRADUATE]: '本科',
  [SchoolLevel.JUNIOR_COLLEGE]: '专科',
  [SchoolLevel.GRADUATE]: '研究生',
  [SchoolLevel.VOCATIONAL]: '职业学校'
}

export interface Teacher {
  id: number
  teacherName: string
  position: string // 职称
  degree: string // 学位
  specialization: string // 专业方向
  researchFields: string // JSON格式
  publications: string // JSON格式
  awards: string // JSON格式
  avatar: string
  email: string
  phone: string
  facultyId: number
  schoolId: number
  // 时间戳
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: number
  title: string
  type: string // 成果类型
  level: AwardLevel
  year: number
  description: string
  participants: string // JSON格式
  schoolId: number
  facultyId?: number
  // 时间戳
  createdAt: string
  updatedAt: string
}
