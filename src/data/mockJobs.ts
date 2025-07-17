import type { JobPosting, JobStatus, JobBenefit } from '@/types/talent/job'
import { BenefitCategory } from '@/types/talent/job'
import type { Profession } from '@/types/talent/designer'

// 合并企业福利和职位额外福利的帮助函数
function mergeJobBenefits(job: JobPosting): JobBenefit[] {
  const mergedBenefits: JobBenefit[] = []

  // 如果使用企业福利，添加企业福利
  if (job.useEnterpriseBenefits && job.enterprise?.benefits) {
    mergedBenefits.push(...job.enterprise.benefits)
  }

  // 添加职位额外福利（可能会覆盖企业福利）
  if (job.additionalBenefits) {
    job.additionalBenefits.forEach(additionalBenefit => {
      const existingIndex = mergedBenefits.findIndex(b =>
        b.id === additionalBenefit.id || b.id === additionalBenefit.id.replace('_extra', '')
      )
      if (existingIndex !== -1) {
        // 替换现有福利
        mergedBenefits[existingIndex] = additionalBenefit
      } else {
        // 添加新福利
        mergedBenefits.push(additionalBenefit)
      }
    })
  }

  return mergedBenefits
}

// 模拟岗位数据
export const mockJobs: JobPosting[] = [
  {
    id: 1,
    title: '高级交互设计师',
    description: `负责腾讯游戏产品的交互设计工作，打造极致的用户体验。
主导设计项目，参与产品需求分析、用户研究、交互设计方案制定与落地。
与产品、开发、视觉等团队紧密合作，推动设计方案的实施与优化。
持续关注用户反馈，不断迭代优化产品体验。
参与建设和完善团队的设计规范与组件库。`,
    requirements: `本科及以上学历，设计相关专业，5年以上互联网产品交互设计经验。
精通用户体验设计方法论，能够独立完成用户研究、交互设计、原型设计等工作。
熟练使用 Figma、Sketch、Axure 等设计工具，具备良好的设计表达能力。
对数据敏感，能够基于数据分析进行设计决策。
具备良好的沟通协作能力，能够与多角色团队高效合作。
有游戏行业设计经验者优先。`,
    salaryMin: 25000,
    salaryMax: 35000,
    workLocation: '深圳·南山区',
    workType: '全职',
    experienceRequired: '5年经验',
    educationRequired: '本科及以上',
    profession: 'INTERACTION_DESIGNER' as Profession,
    skillsRequired: '["figma", "sketch", "axure_rp", "interaction_design", "prototype_design", "user_experience", "user_research", "information_architecture"]',
    useEnterpriseBenefits: true,
    additionalBenefits: [
      {
        id: 'annual_leave_extra',
        name: '年假20天',
        icon: 'ri-calendar-check-line',
        description: '高级设计师享受额外年假（覆盖企业标准15天）',
        category: BenefitCategory.LEAVE,
        color: 'purple',
      },
      {
        id: 'design_conference',
        name: '设计会议报销',
        icon: 'ri-slideshow-line',
        description: '年度设计会议参会费用报销',
        category: BenefitCategory.TRAINING,
        color: 'orange',
      },
    ],
    enterpriseId: 1,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-24',
    deadline: '2025-02-24',
    createdAt: '2025-01-24T10:00:00Z',
    updatedAt: '2025-01-24T10:00:00Z',
    enterprise: {
      id: 1,
      enterpriseName: '腾讯互娱',
      description: `腾讯互动娱乐是腾讯集团旗下的游戏业务部门，是全球领先的游戏开发和发行商。
我们致力于通过创新科技和优质内容，为全球玩家创造愉悦的互动娱乐体验。
公司拥有多款知名游戏产品，包括《王者荣耀》、《和平精英》、《英雄联盟》等。
我们提供具有市场竞争力的薪酬福利，完善的培训体系，以及广阔的职业发展空间。`,
      industry: '互联网',
      scale: '10000+人',
      address: '深圳市南山区科技园',
      email: 'hr@tencent.com',
      phone: '0755-86013388',
      userId: 101,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'annual_leave',
          name: '年假15天',
          icon: 'ri-calendar-check-line',
          description: '带薪年假15天',
          category: BenefitCategory.LEAVE,
          color: 'purple',
        },
        {
          id: 'year_end_bonus',
          name: '年终奖金',
          icon: 'ri-award-line',
          description: '丰厚的年终奖金',
          category: BenefitCategory.BONUS,
          color: 'pink',
        },
        {
          id: 'stock_options',
          name: '股票期权',
          icon: 'ri-stock-line',
          description: '公司股票期权激励',
          category: BenefitCategory.STOCK,
          color: 'green',
        },
        {
          id: 'free_meals',
          name: '免费三餐',
          icon: 'ri-restaurant-line',
          description: '免费提供三餐',
          category: BenefitCategory.MEAL,
          color: 'red',
        },
        {
          id: 'gym_membership',
          name: '健身房会员',
          icon: 'ri-run-line',
          description: '健身房会员卡',
          category: BenefitCategory.HEALTH,
          color: 'cyan',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-24T10:00:00Z',
    },
  },
  {
    id: 2,
    title: '资深视觉设计师',
    description: `负责阿里巴巴集团品牌视觉设计工作，提升品牌形象和用户体验。
参与重要产品和营销活动的视觉设计，包括品牌形象、网站设计、移动应用界面等。
与产品、运营、技术团队协作，确保设计方案的有效落地。
建立和维护品牌视觉规范，保证设计的一致性和专业性。
关注行业趋势，持续提升设计水平和创新能力。`,
    requirements: `本科及以上学历，设计相关专业，3-5年视觉设计经验。
精通 Photoshop、Illustrator、Sketch 等设计软件。
具备扎实的美术功底和良好的审美能力。
熟悉品牌设计、网页设计、移动端设计等多个设计领域。
有电商或互联网行业经验者优先。
具备良好的沟通能力和团队协作精神。`,
    salaryMin: 30000,
    salaryMax: 45000,
    workLocation: '杭州·滨江区',
    workType: '全职',
    experienceRequired: '3-5年经验',
    educationRequired: '本科及以上',
    profession: 'GRAPHIC_DESIGNER' as Profession,
    skillsRequired: '["photoshop", "illustrator", "sketch", "brand_design", "visual_system", "web_design", "mobile_design"]',
    useEnterpriseBenefits: true,
    enterpriseId: 2,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-26',
    deadline: '2025-02-26',
    createdAt: '2025-01-26T09:00:00Z',
    updatedAt: '2025-01-26T09:00:00Z',
    enterprise: {
      id: 2,
      enterpriseName: '阿里巴巴',
      description: `阿里巴巴集团是以电子商务为核心的数字经济体，业务涵盖电商、云计算、数字媒体等多个领域。
我们致力于让天下没有难做的生意，通过技术创新为全球商业发展提供基础设施。
公司拥有淘宝、天猫、支付宝、阿里云等知名品牌和产品。
我们提供有竞争力的薪酬、完善的福利体系和广阔的发展平台。`,
      industry: '电子商务',
      scale: '10000+人',
      address: '杭州市滨江区网商路699号',
      email: 'hr@alibaba.com',
      phone: '0571-85022088',
      userId: 102,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'annual_leave',
          name: '年假12天',
          icon: 'ri-calendar-check-line',
          description: '带薪年假12天',
          category: BenefitCategory.LEAVE,
          color: 'purple',
        },
        {
          id: 'year_end_bonus',
          name: '年终奖金',
          icon: 'ri-award-line',
          description: '丰厚的年终奖金',
          category: BenefitCategory.BONUS,
          color: 'pink',
        },
        {
          id: 'flexible_hours',
          name: '弹性工作时间',
          icon: 'ri-time-line',
          description: '灵活的工作时间安排',
          category: BenefitCategory.WELFARE,
          color: 'indigo',
        },
        {
          id: 'training_budget',
          name: '培训预算',
          icon: 'ri-book-open-line',
          description: '年度培训预算支持',
          category: BenefitCategory.TRAINING,
          color: 'orange',
        },
        {
          id: 'free_meals',
          name: '免费三餐',
          icon: 'ri-restaurant-line',
          description: '免费提供三餐',
          category: BenefitCategory.MEAL,
          color: 'red',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-26T09:00:00Z',
    },
  },
  {
    id: 3,
    title: 'UI设计师',
    description: `负责字节跳动旗下产品的用户界面设计工作。
参与产品需求分析，设计符合用户习惯的界面和交互流程。
与产品经理、开发工程师紧密合作，推进设计方案的实现。
维护和优化设计规范，提升产品的一致性和用户体验。
关注用户反馈，持续改进产品设计。`,
    requirements: `本科及以上学历，设计相关专业，2-3年UI设计经验。
熟练使用 Sketch、Figma、Adobe Creative Suite 等设计工具。
具备良好的视觉设计能力和用户体验意识。
了解前端开发基础知识，能够与开发团队有效沟通。
有移动端产品设计经验者优先。
具备创新思维和学习能力。`,
    salaryMin: 18000,
    salaryMax: 25000,
    workLocation: '北京·朝阳区',
    workType: '全职',
    experienceRequired: '2-3年经验',
    educationRequired: '本科及以上',
    profession: 'UI_DESIGNER' as Profession,
    skillsRequired: '["sketch", "figma", "ui_design", "design_system", "mobile_design", "visual_design"]',
    useEnterpriseBenefits: true,
    enterpriseId: 3,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-25',
    deadline: '2025-02-25',
    createdAt: '2025-01-25T14:00:00Z',
    updatedAt: '2025-01-25T14:00:00Z',
    enterprise: {
      id: 3,
      enterpriseName: '字节跳动',
      description: `字节跳动是一家全球化的互联网技术公司，致力于用技术丰富人们的生活。
公司旗下拥有抖音、今日头条、西瓜视频等多款知名产品。
我们秉承"始终创业"的理念，为用户创造价值，为社会带来美好。
公司提供有竞争力的薪酬福利和良好的工作环境。`,
      industry: '互联网',
      scale: '10000+人',
      address: '北京市朝阳区北三环东路6号',
      email: 'hr@bytedance.com',
      phone: '010-82600000',
      userId: 103,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'sick_leave',
          name: '带薪病假',
          icon: 'ri-user-heart-line',
          description: '带薪病假保障',
          category: BenefitCategory.HEALTH,
          color: 'yellow',
        },
        {
          id: 'flexible_hours',
          name: '弹性工作时间',
          icon: 'ri-time-line',
          description: '灵活的工作时间安排',
          category: BenefitCategory.WELFARE,
          color: 'indigo',
        },
        {
          id: 'remote_work',
          name: '远程办公',
          icon: 'ri-home-office-line',
          description: '支持远程办公',
          category: BenefitCategory.WELFARE,
          color: 'teal',
        },
        {
          id: 'training_budget',
          name: '培训预算',
          icon: 'ri-book-open-line',
          description: '年度培训预算支持',
          category: BenefitCategory.TRAINING,
          color: 'orange',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-25T14:00:00Z',
    },
  },
  {
    id: 4,
    title: '游戏美术设计师',
    description: `负责网易游戏产品的美术设计工作，包括角色设计、场景设计、UI设计等。
参与游戏项目的美术风格制定和视觉表现设计。
与策划、程序团队协作，确保美术资源的高质量产出。
跟进游戏开发流程，优化美术制作效率。
关注游戏行业趋势，提升个人专业技能。`,
    requirements: `本科及以上学历，美术或设计相关专业，3年以上游戏美术经验。
精通 3D Max、Maya、Photoshop 等美术制作软件。
具备扎实的美术基础和良好的审美能力。
熟悉游戏美术制作流程和技术要求。
有手游或端游项目经验者优先。
具备团队协作精神和责任心。`,
    salaryMin: 20000,
    salaryMax: 30000,
    workLocation: '广州·天河区',
    workType: '全职',
    experienceRequired: '3年经验',
    educationRequired: '本科及以上',
    profession: 'GRAPHIC_DESIGNER' as Profession,
    skillsRequired: '["3d_max", "maya", "photoshop", "game_art", "character_design", "scene_design", "ui_design"]',
    useEnterpriseBenefits: true,
    enterpriseId: 4,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-22',
    deadline: '2025-02-22',
    createdAt: '2025-01-22T11:00:00Z',
    updatedAt: '2025-01-22T11:00:00Z',
    enterprise: {
      id: 4,
      enterpriseName: '网易游戏',
      description: `网易游戏是网易公司旗下的游戏业务部门，是中国领先的游戏开发和运营商。
公司拥有《梦幻西游》、《大话西游》、《阴阳师》等多款知名游戏产品。
我们致力于为全球玩家提供优质的游戏体验和服务。
公司提供完善的福利待遇和良好的职业发展机会。`,
      industry: '游戏',
      scale: '5000-10000人',
      address: '广州市天河区科韵路16号',
      email: 'hr@netease.com',
      phone: '020-85105163',
      userId: 104,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'annual_leave',
          name: '年假10天',
          icon: 'ri-calendar-check-line',
          description: '带薪年假10天',
          category: BenefitCategory.LEAVE,
          color: 'purple',
        },
        {
          id: 'year_end_bonus',
          name: '年终奖金',
          icon: 'ri-award-line',
          description: '丰厚的年终奖金',
          category: BenefitCategory.BONUS,
          color: 'pink',
        },
        {
          id: 'free_meals',
          name: '免费三餐',
          icon: 'ri-restaurant-line',
          description: '免费提供三餐',
          category: BenefitCategory.MEAL,
          color: 'red',
        },
        {
          id: 'gym_membership',
          name: '健身房会员',
          icon: 'ri-run-line',
          description: '健身房会员卡',
          category: BenefitCategory.HEALTH,
          color: 'cyan',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-22T11:00:00Z',
    },
  },
  {
    id: 5,
    title: '产品设计师',
    description: `负责百度产品的用户体验设计工作，提升产品的易用性和用户满意度。
参与产品需求分析和用户研究，制定设计策略和方案。
设计产品原型和交互流程，优化用户体验。
与产品、技术团队协作，推动设计方案的实现。
持续关注用户反馈，迭代优化产品设计。`,
    requirements: `本科及以上学历，设计或相关专业，3-5年产品设计经验。
熟练使用 Figma、Sketch、Axure 等设计和原型工具。
具备用户体验设计思维和方法论。
有用户研究经验，能够基于数据进行设计决策。
有AI或搜索产品设计经验者优先。
具备良好的沟通能力和创新思维。`,
    salaryMin: 22000,
    salaryMax: 35000,
    workLocation: '北京·海淀区',
    workType: '全职',
    experienceRequired: '3-5年经验',
    educationRequired: '本科及以上',
    profession: 'PRODUCT_DESIGNER' as Profession,
    skillsRequired: '["figma", "sketch", "axure_rp", "product_design", "user_research", "prototype_design", "user_experience"]',
    useEnterpriseBenefits: true,
    additionalBenefits: [
      {
        id: 'annual_leave_extra',
        name: '年假18天',
        icon: 'ri-calendar-check-line',
        description: '产品设计师享受额外年假（覆盖企业标准14天）',
        category: BenefitCategory.LEAVE,
        color: 'purple',
      },
    ],
    enterpriseId: 5,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-25',
    deadline: '2025-02-25',
    createdAt: '2025-01-25T16:00:00Z',
    updatedAt: '2025-01-25T16:00:00Z',
    enterprise: {
      id: 5,
      enterpriseName: '百度',
      description: `百度是全球最大的中文搜索引擎，致力于用科技让复杂的世界更简单。
公司在人工智能、云计算、自动驾驶等领域都有重要布局。
我们拥有强大的技术实力和创新能力，为用户提供优质的产品和服务。
公司提供有竞争力的薪酬和广阔的发展平台。`,
      industry: '互联网',
      scale: '10000+人',
      address: '北京市海淀区上地十街10号',
      email: 'hr@baidu.com',
      phone: '010-59928888',
      userId: 105,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'annual_leave',
          name: '年假14天',
          icon: 'ri-calendar-check-line',
          description: '带薪年假14天',
          category: BenefitCategory.LEAVE,
          color: 'purple',
        },
        {
          id: 'stock_options',
          name: '股票期权',
          icon: 'ri-stock-line',
          description: '公司股票期权激励',
          category: BenefitCategory.STOCK,
          color: 'green',
        },
        {
          id: 'training_budget',
          name: '培训预算',
          icon: 'ri-book-open-line',
          description: '年度培训预算支持',
          category: BenefitCategory.TRAINING,
          color: 'orange',
        },
        {
          id: 'flexible_hours',
          name: '弹性工作时间',
          icon: 'ri-time-line',
          description: '灵活的工作时间安排',
          category: BenefitCategory.WELFARE,
          color: 'indigo',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-25T16:00:00Z',
    },
  },
  {
    id: 6,
    title: '动效设计师',
    description: `负责小米产品的动效设计工作，提升产品的视觉表现和用户体验。
设计产品界面动效、品牌动画和营销视频等。
与UI设计师、开发工程师协作，确保动效的高质量实现。
建立动效设计规范，保证产品动效的一致性。
关注动效设计趋势，不断提升专业技能。`,
    requirements: `本科及以上学历，动画或设计相关专业，2-4年动效设计经验。
精通 After Effects、Cinema 4D、Lottie 等动效制作工具。
具备扎实的动画基础和良好的节奏感。
了解前端动效实现原理，能与开发团队有效沟通。
有移动端产品动效设计经验者优先。
具备创意思维和执行能力。`,
    salaryMin: 18000,
    salaryMax: 28000,
    workLocation: '北京·海淀区',
    workType: '全职',
    experienceRequired: '2-4年经验',
    educationRequired: '本科及以上',
    profession: 'MOTION_DESIGNER' as Profession,
    skillsRequired: '["after_effects", "cinema_4d", "lottie", "motion_design", "animation_design", "effects"]',
    useEnterpriseBenefits: true,
    additionalBenefits: [
      {
        id: 'annual_leave_extra',
        name: '年假10天',
        icon: 'ri-calendar-check-line',
        description: '动效设计师享受额外年假（覆盖企业标准8天）',
        category: BenefitCategory.LEAVE,
        color: 'purple',
      },
    ],
    enterpriseId: 6,
    status: 'PUBLISHED' as JobStatus,
    publishDate: '2025-01-23',
    deadline: '2025-02-23',
    createdAt: '2025-01-23T13:00:00Z',
    updatedAt: '2025-01-23T13:00:00Z',
    enterprise: {
      id: 6,
      enterpriseName: '小米',
      description: `小米是一家以手机、智能硬件和IoT平台为核心的互联网公司。
公司致力于让全球每个人都能享受科技带来的美好生活。
我们拥有完整的智能生态链产品，为用户提供优质的科技体验。
公司提供有竞争力的薪酬福利和良好的工作环境。`,
      industry: '智能硬件',
      scale: '5000-10000人',
      address: '北京市海淀区清河中街68号',
      email: 'hr@xiaomi.com',
      phone: '010-60606666',
      userId: 106,
      benefits: [
        {
          id: 'insurance',
          name: '五险一金',
          icon: 'ri-health-book-line',
          description: '完善的社会保险和住房公积金',
          category: BenefitCategory.INSURANCE,
          color: 'blue',
        },
        {
          id: 'annual_leave',
          name: '年假8天',
          icon: 'ri-calendar-check-line',
          description: '带薪年假8天',
          category: BenefitCategory.LEAVE,
          color: 'purple',
        },
        {
          id: 'sick_leave',
          name: '带薪病假',
          icon: 'ri-user-heart-line',
          description: '带薪病假保障',
          category: BenefitCategory.HEALTH,
          color: 'yellow',
        },
        {
          id: 'remote_work',
          name: '远程办公',
          icon: 'ri-home-office-line',
          description: '支持远程办公',
          category: BenefitCategory.WELFARE,
          color: 'teal',
        },
        {
          id: 'training_budget',
          name: '培训预算',
          icon: 'ri-book-open-line',
          description: '年度培训预算支持',
          category: BenefitCategory.TRAINING,
          color: 'orange',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2025-01-23T13:00:00Z',
    },
  },
]

// 获取模拟数据的函数
export function getMockJobs(params?: {
  pageNum?: number
  pageSize?: number
  profession?: string
  workLocation?: string
  experienceRequired?: string
}) {
  let filteredJobs = [...mockJobs]

  // 应用筛选条件
  if (params?.profession)
    filteredJobs = filteredJobs.filter(job => job.profession === params.profession)

  if (params?.workLocation) {
    filteredJobs = filteredJobs.filter(job =>
      job.workLocation.includes(params.workLocation!),
    )
  }

  if (params?.experienceRequired) {
    filteredJobs = filteredJobs.filter(job =>
      job.experienceRequired.includes(params.experienceRequired!),
    )
  }

  // 分页
  const pageNum = params?.pageNum || 1
  const pageSize = params?.pageSize || 20
  const startIndex = (pageNum - 1) * pageSize
  const endIndex = startIndex + pageSize

    // 为每个job合并福利
  const jobsWithMergedBenefits = filteredJobs.slice(startIndex, endIndex).map(job => ({
    ...job,
    benefits: mergeJobBenefits(job),
  }))

  return {
    rows: jobsWithMergedBenefits,
    total: filteredJobs.length,
    pageNum,
    pageSize,
  }
}

// 根据ID获取岗位详情
export function getMockJobById(id: number) {
  const job = mockJobs.find(job => job.id === id)
  if (!job) return null

  return {
    ...job,
    benefits: mergeJobBenefits(job),
  }
}
