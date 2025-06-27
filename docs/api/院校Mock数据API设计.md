# 基于Mock数据的院校API设计

## 冲突分析

### 现有API冲突检测

经过对比分析，发现以下**API路径冲突**：

1. **冲突1：专业查询接口**
   - 现有API: `GET /designer/school/{id}/majors` - 查询院校专业列表
   - 新需求API: `GET /designer/school/{id}/categories` - 获取专业分类
   - **解决方案**: 保留现有majors接口，新增categories接口

2. **冲突2：获奖成果接口**
   - 现有API: `GET /designer/school/{id}/achievements` - 查询院校获奖成果
   - 新需求API: `GET /designer/school/{id}/achievements/statistics` - 获奖统计
   - 新需求API: `GET /designer/school/{id}/achievements/featured-works` - 代表性作品
   - **解决方案**: 现有接口保持不变，新增子路径接口

3. **冲突3：就业统计接口**
   - 现有API: `GET /designer/school/{id}/employment/statistics` - 就业统计
   - 新需求: 需要增强响应结构，包含图表数据
   - **解决方案**: 保持路径不变，扩展响应结构

## 严格按Mock数据设计的API接口

### 1. 院校基础信息API

#### 1.1 院校详情API（增强现有）
```
GET /designer/school/{id}
```

**Mock数据结构对应：** `mockSchools`

**响应结构：**
```typescript
interface SchoolDetailResponse {
  code: number
  msg: string
  data: {
    id: number
    schoolName: string
    schoolType: 'COMPREHENSIVE' | 'ART' | 'ENGINEERING' | 'NORMAL' | 'FINANCE'
    location: string
    province: string
    city: string
    level: 'UNDERGRADUATE' | 'GRADUATE' | 'VOCATIONAL'
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
    status: 'ACTIVE' | 'INACTIVE'
    isKey: boolean
    is985: boolean
    is211: boolean
    isDoubleFirst: boolean
    createdAt: string
    updatedAt: string
  }
}
```

### 2. 专业相关API

#### 2.1 专业分类API（新增）
```
GET /designer/school/{id}/categories
```

**Mock数据结构对应：** `mockMajorCategoriesBySchool`

**响应结构：**
```typescript
interface MajorCategoryResponse {
  code: number
  msg: string
  data: {
    categories: Array<{
      name: string          // 专业分类名称
      icon: string          // 图标类名，如 'ri-computer-line'
      description: string   // 专业描述
      skills: string[]      // 技能标签数组
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
        "skills": ["信息可视化", "交互设计", "数据艺术", "智能界面设计"]
      }
    ]
  }
}
```

#### 2.2 课程体系API（新增）
```
GET /designer/school/{id}/courses
```

**Mock数据结构对应：** `mockCourseSystemBySchool`

**响应结构：**
```typescript
interface CourseSystemResponse {
  code: number
  msg: string
  data: {
    courseGroups: Array<{
      name: string        // 课程组名称
      courses: string[]   // 课程列表
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
    "courseGroups": [
      {
        "name": "通识基础课程",
        "courses": ["设计素描", "色彩构成", "立体构成", "设计史论", "计算机辅助设计", "工程制图基础"]
      },
      {
        "name": "专业核心课程",
        "courses": ["人机交互设计", "信息可视化", "用户体验设计", "产品系统设计", "设计研究方法", "数字化设计"]
      }
    ]
  }
}
```

### 3. 师资信息API

#### 3.1 师资统计API（新增）
```
GET /designer/school/{id}/faculty/statistics
```

**Mock数据结构对应：** `mockFacultyStatsBySchool`

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

**示例响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "totalFaculty": 68,
    "professors": 42,
    "doctorDegree": 53,
    "overseasBackground": 35,
    "description": "清华大学美术学院设计系拥有一支高水平的师资队伍..."
  }
}
```

#### 3.2 代表性教师API（新增）
```
GET /designer/school/{id}/faculty/featured
```

**Mock数据结构对应：** `mockFacultyMembersBySchool`

**响应结构：**
```typescript
interface FeaturedFacultyResponse {
  code: number
  msg: string
  data: {
    faculties: Array<{
      id: number
      name: string          // 教师姓名
      initial: string       // 姓名首字母
      title: string         // 职务职称
      expertise: string[]   // 专业领域
      avatarClass: string   // 头像样式类名
      tagClasses: string[]  // 技能标签样式类名数组
      description: string   // 个人简介
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
    "faculties": [
      {
        "id": 1,
        "name": "张松鹤",
        "initial": "张",
        "title": "教授 / 博士生导师",
        "expertise": ["信息设计", "交互设计"],
        "avatarClass": "bg-gradient-to-br from-primary to-purple-500",
        "tagClasses": ["bg-primary/10 text-primary border-primary/20", "bg-primary/10 text-primary border-primary/20"],
        "description": "前苹果公司首席设计师，在人机交互和信息可视化领域具有重要贡献..."
      }
    ]
  }
}
```

### 4. 就业信息API

#### 4.1 就业统计API（增强现有）
```
GET /designer/school/{id}/employment/statistics
```

**Mock数据结构对应：** `mockEmploymentStatsBySchool` + `mockChartDataBySchool`

**响应结构增强：**
```typescript
interface EmploymentStatisticsResponse {
  code: number
  msg: string
  data: {
    // 基础统计（对应mockEmploymentStatsBySchool）
    employmentRate: string        // 就业率 "96.8%"
    averageSalary: string        // 平均薪资 "18.5K"
    furtherStudyRate: string     // 深造率 "38.2%"
    overseasEmploymentRate: string // 海外就业率 "22.1%"
    description: string           // 描述信息

    // 图表数据（对应mockChartDataBySchool）
    chartData: {
      industryData: Array<{
        value: number           // 人数
        name: string           // 行业名称
        itemStyle: {
          color: string        // 颜色值
        }
      }>
      salaryData: number[]     // 薪资分布数据
      salaryLabels: string[]   // 薪资区间标签
    }
  }
}
```

**示例响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "employmentRate": "96.8%",
    "averageSalary": "18.5K",
    "furtherStudyRate": "38.2%",
    "overseasEmploymentRate": "22.1%",
    "description": "清华大学设计系毕业生就业情况良好...",
    "chartData": {
      "industryData": [
        {
          "value": 45,
          "name": "互联网科技",
          "itemStyle": { "color": "#0a84ff" }
        }
      ],
      "salaryData": [2, 8, 15, 35, 25, 15],
      "salaryLabels": ["8K-", "8-12K", "12-15K", "15-20K", "20-25K", "25K+"]
    }
  }
}
```

#### 4.2 代表性雇主API（新增）
```
GET /designer/school/{id}/employment/employers
```

**Mock数据结构对应：** `mockEmployersBySchool`

**响应结构：**
```typescript
interface RepresentativeEmployersResponse {
  code: number
  msg: string
  data: {
    employers: Array<{
      id: number
      name: string          // 企业名称
      initial: string       // 企业名称首字母
      industry: string      // 所属行业
      colorClass: string    // 颜色样式类名
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
    "employers": [
      {
        "id": 1,
        "name": "苹果",
        "initial": "苹",
        "industry": "国际科技",
        "colorClass": "bg-gray-500/20"
      }
    ]
  }
}
```

### 5. 获奖成果API

#### 5.1 成果统计API（新增）
```
GET /designer/school/{id}/achievements/statistics
```

**Mock数据结构对应：** `mockAchievementStatsBySchool` + `mockTrendDataBySchool`

**响应结构：**
```typescript
interface AchievementStatisticsResponse {
  code: number
  msg: string
  data: {
    // 基础统计
    internationalAwards: number  // 国际奖项数
    nationalAwards: number       // 国家级奖项数
    provincialAwards: number     // 省级奖项数
    patents: number              // 专利数
    description: string          // 描述信息

    // 趋势数据
    trendData: {
      years: string[]                // 年份数组
      internationalData: number[]    // 国际奖项趋势数据
      nationalData: number[]         // 国家级奖项趋势数据
      provincialData: number[]       // 省级奖项趋势数据
    }
  }
}
```

**示例响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "internationalAwards": 126,
    "nationalAwards": 287,
    "provincialAwards": 453,
    "patents": 192,
    "description": "清华大学设计系学生在国内外各类设计竞赛中表现突出...",
    "trendData": {
      "years": ["2019", "2020", "2021", "2022", "2023", "2024"],
      "internationalData": [15, 18, 22, 25, 23, 23],
      "nationalData": [42, 45, 48, 52, 49, 51],
      "provincialData": [68, 75, 82, 78, 74, 76]
    }
  }
}
```

#### 5.2 代表性获奖作品API（新增）
```
GET /designer/school/{id}/achievements/featured-works
```

**Mock数据结构对应：** `mockAwardWorksBySchool`

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
    "works": [
      {
        "id": 1,
        "title": "「循迹」智能导盲系统",
        "award": "2024 红点设计奖 · 最佳设计奖",
        "description": "基于计算机视觉和触觉反馈的创新型导盲设备..."
      }
    ]
  }
}
```

### 6. 相关推荐API

#### 6.1 相关院校推荐API（新增）
```
GET /designer/school/{id}/related
```

**Mock数据结构对应：** `mockRelatedSchoolsBySchool`

**参数：**
- `limit`: 返回数量，默认5

**响应结构：**
```typescript
interface RelatedSchoolsResponse {
  code: number
  msg: string
  data: {
    schools: Array<{
      id: number
      schoolName: string
      schoolType: string
      location: string
      province: string
      city: string
      level: string
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
    }>
  }
}
```

### 7. 院校卡片统计API

#### 7.1 院校卡片数据API（新增）
```
GET /designer/school/{id}/card-stats
```

**Mock数据结构对应：** `mockSchoolCardStatsBySchool`

**响应结构：**
```typescript
interface SchoolCardStatsResponse {
  code: number
  msg: string
  data: {
    employmentRate: string      // 就业率
    facultyStrength: string     // 师资力量评分
    studentScore: string        // 学生评分
    advantagePrograms: string   // 优势专业（逗号分隔）
  }
}
```

**示例响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "employmentRate": "96.8%",
    "facultyStrength": "5.0",
    "studentScore": "4.9",
    "advantagePrograms": "信息艺术设计、智能产品设计、交互设计"
  }
}
```

## 数据库设计

### 1. 专业分类表
```sql
CREATE TABLE des_school_major_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '专业分类名称',
    icon VARCHAR(100) COMMENT '图标类名',
    description TEXT COMMENT '专业描述',
    skills JSON COMMENT '技能标签数组',
    sort_order INT DEFAULT 0,
    status CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id),
    INDEX idx_school_id (school_id)
);
```

### 2. 课程体系表
```sql
CREATE TABLE des_school_course_group (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    group_name VARCHAR(100) NOT NULL COMMENT '课程组名称',
    courses JSON NOT NULL COMMENT '课程列表',
    sort_order INT DEFAULT 0,
    status CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id),
    INDEX idx_school_id (school_id)
);
```

### 3. 师资统计表
```sql
CREATE TABLE des_school_faculty_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL UNIQUE,
    total_faculty INT DEFAULT 0,
    professors INT DEFAULT 0,
    doctor_degree INT DEFAULT 0,
    overseas_background INT DEFAULT 0,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id)
);
```

### 4. 代表性教师表
```sql
CREATE TABLE des_school_featured_faculty (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    initial VARCHAR(10) COMMENT '姓名首字母',
    title VARCHAR(100),
    expertise JSON COMMENT '专业领域数组',
    avatar_class VARCHAR(200) COMMENT '头像样式类名',
    tag_classes JSON COMMENT '技能标签样式类名数组',
    description TEXT,
    sort_order INT DEFAULT 0,
    status CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id),
    INDEX idx_school_id (school_id)
);
```

### 5. 代表性雇主表
```sql
CREATE TABLE des_school_representative_employer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    employer_name VARCHAR(100) NOT NULL,
    initial VARCHAR(10) COMMENT '企业名称首字母',
    industry VARCHAR(50),
    color_class VARCHAR(100) COMMENT '颜色样式类名',
    sort_order INT DEFAULT 0,
    status CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id),
    INDEX idx_school_id (school_id)
);
```

### 6. 代表性获奖作品表
```sql
CREATE TABLE des_school_featured_work (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    award VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    status CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id),
    INDEX idx_school_id (school_id)
);
```

### 7. 院校卡片统计表
```sql
CREATE TABLE des_school_card_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL UNIQUE,
    employment_rate VARCHAR(10),
    faculty_strength VARCHAR(10),
    student_score VARCHAR(10),
    advantage_programs TEXT COMMENT '优势专业，逗号分隔',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id)
);
```

### 8. 现有表字段增强

#### 8.1 就业统计表增强
```sql
-- 增强现有就业统计表以支持图表数据
ALTER TABLE des_school_employment_statistics
ADD COLUMN chart_industry_data JSON COMMENT '行业分布图表数据' AFTER description,
ADD COLUMN chart_salary_data JSON COMMENT '薪资分布数据' AFTER chart_industry_data,
ADD COLUMN chart_salary_labels JSON COMMENT '薪资区间标签' AFTER chart_salary_data;
```

#### 8.2 成果统计表增强
```sql
-- 如果成果统计表不存在，创建新表
CREATE TABLE des_school_achievement_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    school_id BIGINT NOT NULL UNIQUE,
    international_awards INT DEFAULT 0,
    national_awards INT DEFAULT 0,
    provincial_awards INT DEFAULT 0,
    patents INT DEFAULT 0,
    description TEXT,
    trend_years JSON COMMENT '年份数组',
    trend_international JSON COMMENT '国际奖项趋势数据',
    trend_national JSON COMMENT '国家级奖项趋势数据',
    trend_provincial JSON COMMENT '省级奖项趋势数据',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES des_school(school_id)
);
```

## 实施优先级

### 第一阶段（核心数据）
1. [ ] 专业分类API和数据表
2. [ ] 师资统计API和数据表
3. [ ] 增强就业统计API响应结构
4. [ ] 院校卡片统计API

### 第二阶段（详细信息）
1. [ ] 课程体系API和数据表
2. [ ] 代表性教师API和数据表
3. [ ] 代表性雇主API和数据表
4. [ ] 获奖成果相关API和数据表

### 第三阶段（扩展功能）
1. [ ] 相关院校推荐API
2. [ ] 数据初始化和维护工具
3. [ ] 缓存和性能优化

## 注意事项

1. **严格按Mock数据结构**：API响应必须与Mock数据完全一致
2. **保持现有API兼容**：不修改现有API路径，只扩展响应结构
3. **样式类名处理**：Mock数据中的CSS类名需要在前端处理，后端只存储类名字符串
4. **JSON字段**：充分利用MySQL的JSON字段类型存储数组和对象数据
5. **数据一致性**：确保新增数据与现有院校数据保持一致性约束
