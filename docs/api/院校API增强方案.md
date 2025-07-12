# 院校API增强方案

## 方案概述

本文档描述了如何改进现有的院校管理模块API，以支持院校数据库页面的完整功能需求。方案基于现有的设计师管理模块架构，充分利用已有API结构，通过扩展和优化来满足前端院校详情页面的数据需求。

### 目标
- 从模拟数据切换到真实后端数据
- 最大化利用现有API结构
- 提供完整的院校信息展示功能
- 支持专业分类、师资信息、就业统计、获奖成果等功能

### 数据来源切换策略
- 保持现有mock数据作为开发备选方案
- 通过环境变量控制数据源切换
- 逐步替换模拟数据为真实API调用

## API改进详情

### 1. 院校详情API增强

#### 当前API
```
GET /designer/school/{id}
```

#### 增强后响应结构
```typescript
interface SchoolDetailResponse {
  // 基础信息（已有）
  id: number
  schoolName: string
  schoolType: string  // COMPREHENSIVE, ART, ENGINEERING, NORMAL, FINANCE
  location: string
  province: string
  city: string
  level: string      // UNDERGRADUATE, GRADUATE, VOCATIONAL
  ranking: number
  description: string
  logo: string
  website: string
  address: string
  phone: string
  email: string
  totalStudents: number
  totalTeachers: number
  facultyCount: number
  majorCount: number
  status: string
  isKey: boolean
  is985: boolean
  is211: boolean
  isDoubleFirst: boolean
  createdAt: string
  updatedAt: string

  // 新增统计信息
  statistics?: {
    employmentRate: string        // 就业率 "96.8%"
    averageSalary: string        // 平均薪资 "18.5K"
    furtherStudyRate: string     // 深造率 "38.2%"
    overseasRate: string         // 海外就业率 "22.1%"
  }
}
```

### 2. 专业相关API

#### 2.1 专业分类API（新增）
```
GET /designer/school/{id}/categories
```

**用途：** 获取院校的专业分类信息，用于专业介绍页面展示

**响应结构：**
```typescript
interface MajorCategoryResponse {
  code: number
  msg: string
  data: {
    categories: Array<{
      name: string          // 专业分类名称
      icon: string          // 图标类名
      description: string   // 专业描述
      skills: string[]      // 相关技能标签
      studentCount?: number // 在读学生数
      employmentRate?: string // 就业率
    }>
  }
}
```

**示例响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "categories": [
      {
        "name": "信息艺术设计",
        "icon": "ri-computer-line",
        "description": "结合清华理工科优势，培养具备信息可视化、人机交互等前沿设计能力的复合型人才。",
        "skills": ["信息可视化", "交互设计", "数据艺术", "智能界面设计"],
        "studentCount": 120,
        "employmentRate": "98.5%"
      }
    ]
  }
}
```

#### 2.2 课程体系API（新增）
```
GET /designer/school/{id}/courses
```

**用途：** 获取院校的课程体系信息

**响应结构：**
```typescript
interface CourseSystemResponse {
  code: number
  msg: string
  data: {
    courseGroups: Array<{
      name: string        // 课程组名称
      courses: string[]   // 课程列表
      description?: string // 课程组描述
      credits?: number    // 学分
    }>
  }
}
```

### 3. 师资信息API

#### 3.1 师资统计API（新增）
```
GET /designer/school/{id}/faculty/statistics
```

**用途：** 获取师资队伍统计信息

**响应结构：**
```typescript
interface FacultyStatisticsResponse {
  code: number
  msg: string
  data: {
    totalFaculty: number      // 师资总数
    professors: number        // 教授人数
    doctorDegree: number     // 博士学位人数
    overseasBackground: number // 海外背景人数
    description: string       // 师资队伍描述
  }
}
```

#### 3.2 代表性教师API（新增）
```
GET /designer/school/{id}/faculty/featured
```

**用途：** 获取代表性教师信息

**响应结构：**
```typescript
interface FeaturedFacultyResponse {
  code: number
  msg: string
  data: {
    faculties: Array<{
      id: number
      name: string          // 教师姓名
      title: string         // 职务职称
      expertise: string[]   // 专业领域
      description: string   // 个人简介
      avatar?: string       // 头像URL
    }>
  }
}
```

### 4. 就业信息API增强

#### 4.1 就业统计API增强（现有API改进）
```
GET /designer/school/{id}/employment/statistics
```

**当前响应结构优化：**
```typescript
interface EmploymentStatisticsResponse {
  code: number
  msg: string
  data: {
    // 基础统计
    employmentRate: string
    averageSalary: string
    furtherStudyRate: string
    overseasEmploymentRate: string
    description: string

    // 新增图表数据
    industryDistribution: Array<{
      name: string      // 行业名称
      value: number     // 就业人数
      percentage: string // 占比
    }>

    salaryDistribution: Array<{
      range: string     // 薪资区间 "8-12K"
      count: number     // 人数
      percentage: string // 占比
    }>
  }
}
```

#### 4.2 代表性雇主API（新增）
```
GET /designer/school/{id}/employment/employers
```

**用途：** 获取毕业生主要就业企业信息

**响应结构：**
```typescript
interface RepresentativeEmployersResponse {
  code: number
  msg: string
  data: {
    employers: Array<{
      id: number
      name: string        // 企业名称
      industry: string    // 所属行业
      hireCount: number   // 录用人数
      description?: string // 企业描述
    }>
  }
}
```

### 5. 获奖成果API增强

#### 5.1 成果统计API（基于现有API优化）
```
GET /designer/school/{id}/achievements/statistics
```

**响应结构增强：**
```typescript
interface AchievementStatisticsResponse {
  code: number
  msg: string
  data: {
    // 基础统计
    internationalAwards: number
    nationalAwards: number
    provincialAwards: number
    patents: number
    description: string

    // 趋势数据
    trendData: {
      years: string[]           // 年份
      internationalData: number[] // 国际奖项数据
      nationalData: number[]     // 国家级奖项数据
      provincialData: number[]   // 省级奖项数据
    }
  }
}
```

#### 5.2 代表性获奖作品API（新增）
```
GET /designer/school/{id}/achievements/featured-works
```

**用途：** 获取代表性获奖作品信息

**响应结构：**
```typescript
interface FeaturedWorksResponse {
  code: number
  msg: string
  data: {
    works: Array<{
      id: number
      title: string       // 作品标题
      award: string       // 获奖信息
      description: string // 作品描述
      year: string        // 获奖年份
      category: string    // 作品类别
      student?: string    // 获奖学生
    }>
  }
}
```



## 数据库设计

### 新增表结构

#### 1. 专业分类表
```sql
CREATE TABLE des_school_major_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL COMMENT '院校ID',
    name VARCHAR(100) NOT NULL COMMENT '专业分类名称',
    icon VARCHAR(100) COMMENT '图标类名',
    description TEXT COMMENT '专业描述',
    skills JSON COMMENT '相关技能标签',
    student_count INT DEFAULT 0 COMMENT '在读学生数',
    employment_rate VARCHAR(10) COMMENT '就业率',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status CHAR(1) DEFAULT '1' COMMENT '状态(1:正常,0:停用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校专业分类表';
```

#### 2. 课程体系表
```sql
CREATE TABLE des_school_course_group (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL COMMENT '院校ID',
    group_name VARCHAR(100) NOT NULL COMMENT '课程组名称',
    courses JSON NOT NULL COMMENT '课程列表',
    description TEXT COMMENT '课程组描述',
    credits INT COMMENT '学分',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status CHAR(1) DEFAULT '1' COMMENT '状态(1:正常,0:停用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校课程体系表';
```

#### 3. 师资统计表
```sql
CREATE TABLE des_school_faculty_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL UNIQUE COMMENT '院校ID',
    total_faculty INT DEFAULT 0 COMMENT '师资总数',
    professors INT DEFAULT 0 COMMENT '教授人数',
    doctor_degree INT DEFAULT 0 COMMENT '博士学位人数',
    overseas_background INT DEFAULT 0 COMMENT '海外背景人数',
    description TEXT COMMENT '师资队伍描述',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校师资统计表';
```

#### 4. 代表性教师表
```sql
CREATE TABLE des_school_featured_faculty (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL COMMENT '院校ID',
    name VARCHAR(50) NOT NULL COMMENT '教师姓名',
    title VARCHAR(100) COMMENT '职务职称',
    expertise JSON COMMENT '专业领域',
    description TEXT COMMENT '个人简介',
    avatar VARCHAR(255) COMMENT '头像URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status CHAR(1) DEFAULT '1' COMMENT '状态(1:正常,0:停用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校代表性教师表';
```

#### 5. 代表性雇主表
```sql
CREATE TABLE des_school_representative_employer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL COMMENT '院校ID',
    employer_name VARCHAR(100) NOT NULL COMMENT '企业名称',
    industry VARCHAR(50) COMMENT '所属行业',
    hire_count INT DEFAULT 0 COMMENT '录用人数',
    description TEXT COMMENT '企业描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status CHAR(1) DEFAULT '1' COMMENT '状态(1:正常,0:停用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校代表性雇主表';
```

#### 6. 代表性获奖作品表
```sql
CREATE TABLE des_school_featured_work (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    school_id BIGINT NOT NULL COMMENT '院校ID',
    title VARCHAR(200) NOT NULL COMMENT '作品标题',
    award VARCHAR(200) NOT NULL COMMENT '获奖信息',
    description TEXT COMMENT '作品描述',
    year VARCHAR(4) COMMENT '获奖年份',
    category VARCHAR(50) COMMENT '作品类别',
    student_name VARCHAR(50) COMMENT '获奖学生',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status CHAR(1) DEFAULT '1' COMMENT '状态(1:正常,0:停用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (school_id) REFERENCES des_school(school_id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id),
    INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院校代表性获奖作品表';
```

### 现有表结构增强

#### 院校表字段建议新增
```sql
-- 为院校表添加统计信息字段
ALTER TABLE des_school ADD COLUMN employment_rate VARCHAR(10) COMMENT '就业率' AFTER major_count;
ALTER TABLE des_school ADD COLUMN average_salary VARCHAR(20) COMMENT '平均薪资' AFTER employment_rate;
ALTER TABLE des_school ADD COLUMN further_study_rate VARCHAR(10) COMMENT '深造率' AFTER average_salary;
ALTER TABLE des_school ADD COLUMN overseas_rate VARCHAR(10) COMMENT '海外就业率' AFTER further_study_rate;
```

#### 就业统计表增强
```sql
-- 增强现有就业统计表
ALTER TABLE des_school_employment_statistics
ADD COLUMN industry_distribution JSON COMMENT '行业分布数据' AFTER overseas_employment_rate,
ADD COLUMN salary_distribution JSON COMMENT '薪资分布数据' AFTER industry_distribution;
```

## 实施计划

### 第一阶段：核心功能（优先级：高）

**目标：** 实现基础院校信息展示功能

**任务清单：**
1. [ ] 完善院校详情API响应结构
2. [ ] 创建专业分类表和API
3. [ ] 创建师资统计表和API
4. [ ] 增强就业统计API响应结构
5. [ ] 前端调用接口适配

**预计工期：** 1-2周

### 第二阶段：增强功能（优先级：中）

**目标：** 增加详细的院校信息展示

**任务清单：**
1. [ ] 创建课程体系表和API
2. [ ] 创建代表性教师表和API
3. [ ] 创建代表性雇主表和API
4. [ ] 创建获奖作品表和API
5. [ ] 完善前端数据展示组件

**预计工期：** 2-3周

### 第三阶段：智能推荐（优先级：低）

**目标：** 实现智能推荐和数据分析功能

**任务清单：**
1. [ ] 添加数据分析功能
2. [ ] 优化搜索和筛选功能
3. [ ] 性能优化和缓存机制

**预计工期：** 2-3周

## 前端调用示例

### 1. Store中的API调用

```typescript
// src/stores/talent/school.ts

// 获取完整院校数据
const fetchCompleteSchoolData = async (schoolId: number) => {
  try {
    detailLoading.value = true

    // 并行加载所有数据
    const [
      schoolDetail,
      categories,
      courses,
      facultyStats,
      featuredFaculty,
      employmentStats,
      employers,
      achievementStats,
      featuredWorks
    ] = await Promise.all([
      schoolApi.getSchoolDetail(schoolId),
      schoolApi.getMajorCategories(schoolId),
      schoolApi.getCourseSystem(schoolId),
      schoolApi.getFacultyStats(schoolId),
      schoolApi.getFeaturedFaculty(schoolId),
      schoolApi.getEmploymentStats(schoolId),
      schoolApi.getRepresentativeEmployers(schoolId),
      schoolApi.getAchievementStats(schoolId),
      schoolApi.getFeaturedWorks(schoolId)
    ])

    // 更新状态
    currentSchool.value = schoolDetail.data
    majorCategories.value = categories.data.categories
    courseSystem.value = courses.data.courseGroups
    facultyStatistics.value = facultyStats.data
    featuredFaculties.value = featuredFaculty.data.faculties
    employmentData.value = employmentStats.data
    representativeEmployers.value = employers.data.employers
    achievementStatistics.value = achievementStats.data
    featuredWorks.value = featuredWorks.data.works

  } catch (error) {
    console.error('加载院校完整数据失败:', error)
    throw error
  } finally {
    detailLoading.value = false
  }
}
```

### 2. API服务层

```typescript
// src/api/talent/school.ts

export const schoolApi = {
  // 现有API...

  // 新增API
  getMajorCategories: (schoolId: number) =>
    request.get<MajorCategoryResponse>(`/designer/school/${schoolId}/categories`),

  getCourseSystem: (schoolId: number) =>
    request.get<CourseSystemResponse>(`/designer/school/${schoolId}/courses`),

  getFacultyStats: (schoolId: number) =>
    request.get<FacultyStatisticsResponse>(`/designer/school/${schoolId}/faculty/statistics`),

  getFeaturedFaculty: (schoolId: number) =>
    request.get<FeaturedFacultyResponse>(`/designer/school/${schoolId}/faculty/featured`),

  getRepresentativeEmployers: (schoolId: number) =>
    request.get<RepresentativeEmployersResponse>(`/designer/school/${schoolId}/employment/employers`),

  getFeaturedWorks: (schoolId: number) =>
    request.get<FeaturedWorksResponse>(`/designer/school/${schoolId}/achievements/featured-works`)
}
```

### 3. 组件中的使用

```vue
<!-- src/components/talent/SchoolDetailModal.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useSchoolStore } from '@/stores/talent/school'

const schoolStore = useSchoolStore()

// 计算属性
const majorCategories = computed(() => schoolStore.majorCategories)
const facultyStats = computed(() => schoolStore.facultyStatistics)
</script>

<template>
  <div class="school-detail">
    <!-- 专业分类展示 -->
    <div v-if="majorCategories.length" class="major-categories">
      <div v-for="category in majorCategories" :key="category.name" class="category-card">
        <i :class="category.icon" />
        <h3>{{ category.name }}</h3>
        <p>{{ category.description }}</p>
        <div class="skills">
          <span v-for="skill in category.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <!-- 师资统计展示 -->
    <div v-if="facultyStats" class="faculty-stats">
      <div class="stat-item">
        <span class="label">师资总数</span>
        <span class="value">{{ facultyStats.totalFaculty }}</span>
      </div>
      <!-- 其他统计... -->
    </div>
  </div>
</template>
```

## 环境配置

### 数据源切换配置

```typescript
// .env.development
VITE_USE_MOCK_DATA=true

// .env.production
VITE_USE_MOCK_DATA=false
```

### Store中的环境判断

```typescript
// src/stores/talent/school.ts
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

const fetchSchools = async (params?: Partial<SchoolQueryParams>) => {
  if (USE_MOCK_DATA) {
    // 使用模拟数据
    const mockData = getMockSchools(params)
    schools.value = mockData.rows
    totalSchools.value = mockData.total
    return mockData
  } else {
    // 使用真实API
    const response = await schoolApi.getSchoolList(params)
    schools.value = response.data.rows
    totalSchools.value = response.data.total
    return response.data
  }
}
```

## 测试建议

### 1. 单元测试

```typescript
// tests/api/school.test.ts
describe('School API', () => {
  test('获取专业分类', async () => {
    const response = await schoolApi.getMajorCategories(1)
    expect(response.code).toBe(200)
    expect(response.data.categories).toBeInstanceOf(Array)
  })

  test('获取师资统计', async () => {
    const response = await schoolApi.getFacultyStats(1)
    expect(response.code).toBe(200)
    expect(response.data.totalFaculty).toBeGreaterThan(0)
  })
})
```

### 2. 集成测试

```typescript
// tests/integration/school-detail.test.ts
describe('School Detail Integration', () => {
  test('完整院校数据加载', async () => {
    const schoolStore = useSchoolStore()
    await schoolStore.fetchCompleteSchoolData(1)

    expect(schoolStore.currentSchool).toBeTruthy()
    expect(schoolStore.majorCategories.length).toBeGreaterThan(0)
    expect(schoolStore.facultyStatistics).toBeTruthy()
  })
})
```

## 性能优化建议

### 1. 缓存策略
- 院校基础信息缓存1小时
- 统计数据缓存30分钟
- 使用Redis缓存热门院校数据

### 2. 数据库优化
- 为查询字段添加索引
- 使用分页查询避免大数据量加载
- 考虑读写分离

### 3. 接口优化
- 支持字段选择，避免返回不需要的数据
- 实现数据预加载和懒加载
- 使用CDN加速静态资源

## 维护说明

### 1. 数据一致性
- 定期同步统计数据
- 建立数据变更监控
- 实现数据备份机制

### 2. 监控告警
- API响应时间监控
- 错误率监控
- 数据质量监控

### 3. 版本兼容
- 保持API向后兼容
- 提供版本迁移指南
- 维护API文档更新

---

本方案提供了完整的院校API增强实施路径，可以根据实际需求和开发资源进行调整和优化。建议按照实施计划分阶段进行开发，确保系统稳定性和功能完整性。
