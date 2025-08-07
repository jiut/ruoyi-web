import { TaskStatus, TaskType, PaymentStatus, PaymentMethod } from '@/types/talent/taskFactory'
import type { TaskFactory, TaskPaymentFactory, Enterprise, Designer } from '@/types/talent/taskFactory'

// 任务数据接口（完全按照智图工厂数据表设计）
export interface SimpleTask {
  taskId: string // 使用字符串避免长整数精度丢失
  enterpriseId: number
  taskTitle: string
  taskDescription: string
  taskType: string
  skillTags: string[]
  budgetMin: number
  budgetMax: number
  deadline: string
  urgent: boolean
  status: TaskStatus
  deliverables: string     // 交付物要求
  paymentTerms: string     // 付款条款
  views: number            // 浏览次数
  applications: number     // 申请数量
  publishDate: string
  enterpriseName: string   // 冗余字段，便于显示

  // 前端需要的额外字段
  location?: string        // 工作地点，筛选用
  experience?: string      // 经验要求，筛选用
  company?: string         // 企业名称（用于显示）

  // 关联企业数据（按照 des_enterprise 表结构）
  enterprise?: {
    enterpriseId: number
    enterpriseName: string
    description: string
    industry: string
    scale: string
    address: string
    phone: string
    email: string
    website: string
    logo: string
    status: string
  }
}

// 我的任务数据接口
export interface MyTask {
  id: number
  name: string
  client: string
  deadline: string
  amount: string
  status: string
  applications?: number  // 申请人数（企业管理员视角）
}

// 支付记录数据接口
export interface PaymentRecord {
  id: number
  date: string
  description: string
  amount: string
  type: string
  status: string
}

// 筛选选项数据
export const taskTypeOptions = [
  { value: 'ui-design', label: 'UI/UX设计' },
  { value: 'graphic-design', label: '平面设计' },
  { value: 'brand-design', label: '品牌设计' },
  { value: '3d-modeling', label: '3D建模' },
  { value: 'animation', label: '动效设计' },
  { value: 'web-design', label: '网页设计' },
  { value: 'app-design', label: '移动应用设计' },
  { value: 'poster-design', label: '海报设计' },
]

export const cityOptions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京']

export const experienceOptions = [
  { value: '应届', label: '应届毕业生' },
  { value: '1-3', label: '1-3 年' },
  { value: '3-5', label: '3-5 年' },
  { value: '5-10', label: '5-10 年' },
  { value: '10+', label: '10 年以上' },
]

export const priceRangeOptions = [
  { value: '0-2000', label: '2000元以下' },
  { value: '2000-5000', label: '2000-5000元' },
  { value: '5000-10000', label: '5000-10000元' },
  { value: '10000-20000', label: '10000-20000元' },
  { value: '20000+', label: '20000元以上' },
]

export const deadlineOptions = [
  { value: '1-3', label: '1-3天' },
  { value: '3-7', label: '3-7天' },
  { value: '7-15', label: '7-15天' },
  { value: '15-30', label: '15-30天' },
  { value: '30+', label: '30天以上' },
]

// 任务广场数据（严格按照数据表结构）
export const mockMarketplaceTasks: SimpleTask[] = [
  {
    taskId: '1001',
    enterpriseId: 1001,
    taskTitle: '电商App界面设计',
    taskDescription: '需要设计一套电商App的完整UI界面，包含首页、商品详情、购物车、支付流程等页面。要求遵循Material Design设计规范，注重用户体验和视觉一致性。支持多端适配，确保在不同设备上的一致性体验。',
    taskType: 'UI_UX_DESIGN',
    skillTags: ['ui_design', 'app_design', 'figma', 'material_design', 'user_experience'],
    budgetMin: 6000,
    budgetMax: 10000,
    deadline: '2025-01-30T23:59:59',
    urgent: true,
    status: TaskStatus.PUBLISHED,
    deliverables: '1. 完整的UI设计稿（Figma源文件）\n2. 适配不同屏幕尺寸的响应式设计\n3. 交互原型和用户流程图\n4. 设计规范文档（颜色、字体、间距等）\n5. 切图资源包（PNG、SVG格式）\n6. 图标库和组件库\n7. 设计说明和使用指南',
    paymentTerms: '项目总价：¥6,000-¥10,000\n\n付款方式：\n• 签约时支付50%预付款\n• 初稿完成并通过审核后支付30%\n• 项目最终验收合格后支付20%尾款\n\n平台保障：\n• 智图工厂提供资金托管服务\n• 支持7天无理由退款（未开始制作）\n• 提供项目进度跟踪和质量保障',
    views: 284,
    applications: 15,
    publishDate: '2025-01-20T10:00:00',
    enterpriseName: '阿里巴巴科技',
    enterprise: {
      enterpriseId: 1001,
      enterpriseName: '阿里巴巴科技',
      description: '阿里巴巴集团是全球领先的数字经济体，致力于通过技术创新推动商业和社会的数字化转型。我们专注于电商、云计算、数字媒体和娱乐等领域，为全球消费者和企业提供优质服务。',
      industry: '互联网科技',
      scale: '10000人以上',
      address: '浙江省杭州市余杭区文一西路969号',
      phone: '400-800-1688',
      email: 'contact@alibaba.com',
      website: 'https://www.alibaba.com',
      logo: '',
      status: '0'
    }
  },
  {
    taskId: '1002',
    enterpriseId: 1002,
    taskTitle: '企业品牌VI设计',
    taskDescription: '设计企业完整的品牌视觉识别系统，包括logo重设计、名片、信纸、办公用品等全套VI系统。要求体现科技感和专业性，突出华为品牌的创新精神和技术实力。',
    taskType: 'BRAND_DESIGN',
    skillTags: ['brand_design', 'logo_design', 'corporate_identity', 'print_design', 'illustrator'],
    budgetMin: 12000,
    budgetMax: 18000,
    deadline: '2025-02-05T23:59:59',
    urgent: false,
    status: TaskStatus.PUBLISHED,
    deliverables: '1. 品牌Logo设计（AI/EPS源文件）\n2. 标准色彩系统和应用规范\n3. 字体设计和排版规范\n4. 名片、信纸、文件夹等办公用品设计\n5. 企业宣传册和海报模板\n6. 品牌应用手册（PDF格式）\n7. 不同场景下的Logo应用示例',
    paymentTerms: '项目总价：¥12,000-¥18,000\n\n付款方式：\n• 项目启动时支付40%预付款\n• Logo和基础VI通过确认后支付40%\n• 全部交付物验收合格后支付20%尾款\n\n服务保障：\n• 提供3次免费修改机会\n• 30天内免费微调服务\n• 品牌应用指导咨询',
    views: 156,
    applications: 8,
    publishDate: '2025-01-19T14:30:00',
    enterpriseName: '华为技术有限公司',
    enterprise: {
      enterpriseId: 1002,
      enterpriseName: '华为技术有限公司',
      description: '华为是全球领先的ICT（信息与通信）基础设施和智能终端提供商，致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界。',
      industry: '通信技术',
      scale: '10000人以上',
      address: '广东省深圳市龙岗区坂田华为基地',
      phone: '400-822-9999',
      email: 'contact@huawei.com',
      website: 'https://www.huawei.com',
      logo: '',
      status: '0'
    }
  },
  {
    taskId: '1003',
    enterpriseId: 1003,
    taskTitle: '游戏角色3D建模',
    taskDescription: '为手游《王者荣耀》创建新英雄3D角色模型，包含高精度建模、贴图绘制、骨骼绑定等。要求符合游戏风格且具有鲜明特色，能够在移动端流畅运行。',
    taskType: 'THREE_D_MODELING',
    skillTags: ['three_d_modeling', 'character_design', 'blender', 'zbrush', 'texture_painting', 'rigging'],
    budgetMin: 15000,
    budgetMax: 25000,
    deadline: '2025-02-20T23:59:59',
    urgent: false,
    status: TaskStatus.PUBLISHED,
    deliverables: '1. 高精度3D角色模型（MAX/Maya源文件）\n2. 低面数游戏模型（符合移动端性能要求）\n3. 完整贴图包（漫反射、法线、高光等）\n4. 骨骼绑定和动画控制器\n5. 角色设定图和三视图\n6. 技术文档和制作说明\n7. Unity/UE4导入包',
    paymentTerms: '项目总价：¥15,000-¥25,000\n\n付款方式：\n• 概念设计确认后支付30%\n• 模型制作完成支付40%\n• 最终交付验收后支付30%\n\n制作周期：20-30个工作日\n版权说明：客户享有完全商业使用权',
    views: 198,
    applications: 12,
    publishDate: '2025-01-18T09:15:00',
    enterpriseName: '腾讯游戏',
    enterprise: {
      enterpriseId: 1003,
      enterpriseName: '腾讯游戏',
      description: '腾讯游戏是全球领先的游戏开发和发行平台，拥有丰富的游戏产品线和技术积累，致力于为全球玩家提供优质的游戏体验。',
      industry: '游戏娱乐',
      scale: '1000-5000人',
      address: '广东省深圳市南山区腾讯大厦',
      phone: '400-670-0700',
      email: 'games@tencent.com',
      website: 'https://games.qq.com',
      logo: '',
      status: '0'
    }
  },
]

// 我的任务数据
export const mockMyTasks: MyTask[] = [
  { id: 1, name: '电商App界面设计', client: '科技公司A', deadline: '2025-01-25', amount: '¥6,000 - ¥8,000', status: '进行中' },
  { id: 2, name: '企业品牌VI设计', client: '广告机构B', deadline: '2025-01-20', amount: '¥12,000 - ¥15,000', status: '已完成' },
  { id: 3, name: '产品宣传海报设计', client: '互联网企业C', deadline: '2025-01-15', amount: '¥3,000 - ¥5,000', status: '已完成' },
  { id: 4, name: '教育平台UI设计', client: '教育机构D', deadline: '2025-01-30', amount: '¥10,000 - ¥12,000', status: '进行中' },
  { id: 5, name: '社交媒体图标设计', client: '媒体公司E', deadline: '2025-01-18', amount: '¥2,000 - ¥3,000', status: '待确认' },
  { id: 6, name: '企业官网设计', client: '制造企业F', deadline: '2025-02-05', amount: '¥15,000 - ¥18,000', status: '进行中' },
  { id: 7, name: '产品包装设计', client: '食品公司G', deadline: '2025-01-28', amount: '¥7,000 - ¥9,000', status: '待确认' },
  { id: 8, name: '品牌手册设计', client: '咨询公司H', deadline: '2025-02-10', amount: '¥20,000 - ¥25,000', status: '进行中' },
]

// 支付记录数据
export const mockPaymentRecords: PaymentRecord[] = [
  { id: 1, date: '2025-01-18', description: '电商App界面设计', amount: '¥8,000', type: '收入', status: '已完成' },
  { id: 2, date: '2025-01-15', description: '企业品牌VI设计', amount: '¥15,000', type: '收入', status: '已完成' },
  { id: 3, date: '2025-01-10', description: '产品宣传海报设计', amount: '¥5,000', type: '收入', status: '已完成' },
  { id: 4, date: '2025-01-05', description: '教育平台UI设计', amount: '¥12,000', type: '收入', status: '处理中' },
  { id: 5, date: '2025-01-03', description: '社交媒体设计', amount: '¥7,500', type: '收入', status: '已完成' },
  { id: 6, date: '2024-12-28', description: '企业宣传册设计', amount: '¥10,000', type: '收入', status: '已完成' },
  { id: 7, date: '2024-12-20', description: '网站界面设计', amount: '¥20,000', type: '收入', status: '已完成' },
  { id: 8, date: '2024-12-15', description: '品牌Logo设计', amount: '¥6,000', type: '收入', status: '已完成' },
  { id: 9, date: '2024-12-10', description: '产品包装设计', amount: '¥8,500', type: '收入', status: '已完成' },
  { id: 10, date: '2024-12-05', description: '移动应用UI设计', amount: '¥14,000', type: '收入', status: '已完成' },
]

// 账户统计数据
export const mockAccountStats = {
  balance: 25680.00,
  withdrawableAmount: 20680.00,
  monthlyIncome: 12500.00,
  monthlyGrowth: 15,
  pendingAmount: 5000.00,
  pendingDays: 3,
}

// 导出所有mock数据
export {
  mockMarketplaceTasks as marketplaceTasks,
  mockMyTasks as myTasks,
  mockPaymentRecords as paymentRecords,
  mockAccountStats as accountStats,
}
