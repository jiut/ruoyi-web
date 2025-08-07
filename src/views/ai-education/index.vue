<!-- AI教育板块页面 -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { UserAvatar } from '@/components/common'
import { needsRoleSelection } from '@/utils/authUtils'

const router = useRouter()
const mobileMenuOpen = ref(false)

// 二维码弹窗控制
const qrCodeModalVisible = ref(false)

// 价格显示控制
const hidePrices = ref(true)

// 联系方式悬浮按钮控制
const contactVisible = ref(false)
const contactExpanded = ref(false)

// 学习统计图表引用
const learningProgressChart = ref<HTMLElement | null>(null)
const skillDistributionChart = ref<HTMLElement | null>(null)
const certificationTrendChart = ref<HTMLElement | null>(null)

// 课程分类
const activeCourseTab = ref<'basic' | 'advanced' | 'professional'>('basic')

// 学习路径数据
const learningPaths = ref([
  {
    id: 1,
    name: 'AI产品设计师',
    level: '中高级',
    duration: '3个月',
    courses: 8,
    students: 1200,
    completion: 85,
    description: '学习AI辅助产品设计的完整流程，掌握从用户研究到原型设计的核心技能',
    skills: ['用户研究', 'AI工具应用', '原型设计', '用户体验'],
    icon: 'fa-laptop'
  },
  {
    id: 2,
    name: 'AI插画师',
    level: '中级',
    duration: '2个月',
    courses: 6,
    students: 800,
    completion: 92,
    description: '掌握AI绘画工具的专业技能，创作高质量的商业插画作品',
    skills: ['AI绘画', '商业插画', '风格设计', '创意表达'],
    icon: 'fa-paint-brush'
  },
  {
    id: 3,
    name: 'AI品牌设计师',
    level: '高级',
    duration: '4个月',
    courses: 10,
    students: 500,
    completion: 78,
    description: '运用AI工具进行品牌视觉设计，构建完整的品牌识别系统',
    skills: ['品牌策略', 'VI设计', 'AI工具', '视觉识别'],
    icon: 'fa-flag'
  },
  {
    id: 4,
    name: 'AI动效设计师',
    level: '中高级',
    duration: '2.5个月',
    courses: 7,
    students: 600,
    completion: 88,
    description: '结合AI技术创作动态效果，提升用户界面的交互体验',
    skills: ['动效设计', 'AI动画', '交互设计', '用户体验'],
    icon: 'fa-play-circle'
  }
])

// 认证体系数据
const certifications = ref([
  {
    id: 1,
    name: 'AI设计师初级认证',
    level: 'L1',
    duration: '1个月',
    price: '¥699',
    color: 'green',
    icon: 'fa-medal',
    requirements: ['完成基础课程', '通过在线考试', '提交作品集'],
    benefits: ['获得官方认证证书', '加入设计师社群', '优先推荐工作机会']
  },
  {
    id: 2,
    name: 'AI设计师中级认证',
    level: 'L2',
    duration: '2个月',
    price: '¥1299',
    color: 'blue',
    icon: 'fa-award',
    requirements: ['拥有L1认证', '完成进阶课程', '通过实战项目'],
    benefits: ['中级认证证书', '专属导师指导', '企业合作优先权']
  },
  {
    id: 3,
    name: 'AI设计师高级认证',
    level: 'L3',
    duration: '3个月',
    price: '¥2599',
    color: 'purple',
    icon: 'fa-trophy',
    requirements: ['拥有L2认证', '完成高级课程', '导师推荐信'],
    benefits: ['高级认证证书', '行业专家认可', '讲师资格认定']
  },
  {
    id: 4,
    name: 'AI设计专家认证',
    level: 'Expert',
    duration: '6个月',
    price: '¥4999',
    color: 'yellow',
    icon: 'fa-crown',
    requirements: ['拥有L3认证', '独立项目作品', '行业贡献证明'],
    benefits: ['专家认证证书', '平台合伙人资格', '课程开发权限']
  }
])

// 实训项目数据
const practicalProjects = ref([
  {
    id: 1,
    title: 'AI品牌设计实战',
    company: '知名科技公司',
    difficulty: '中级',
    duration: '4周',
    participants: 50,
    mentor: '李设计总监',
    description: '为真实企业设计完整的品牌视觉识别系统，包括Logo、VI手册、应用规范等',
    skills: ['品牌策略', 'Logo设计', 'VI系统', 'AI工具应用'],
    status: '进行中'
  },
  {
    id: 2,
    title: 'AI产品界面设计',
    company: '互联网独角兽',
    difficulty: '高级',
    duration: '6周',
    participants: 30,
    mentor: '王首席设计师',
    description: '设计新一代SaaS产品的完整用户界面，注重用户体验和AI辅助功能',
    skills: ['UI设计', '用户体验', '原型设计', 'AI工具集成'],
    status: '即将开始'
  },
  {
    id: 3,
    title: 'AI插画创作项目',
    company: '文化传媒集团',
    difficulty: '中级',
    duration: '3周',
    participants: 80,
    mentor: '张插画大师',
    description: '创作系列商业插画作品，掌握AI绘画工具的高级技巧',
    skills: ['AI绘画', '商业插画', '创意表达', '风格统一'],
    status: '已完成'
  },
  {
    id: 4,
    title: 'AI动画制作实训',
    company: '游戏开发工作室',
    difficulty: '高级',
    duration: '8周',
    participants: 25,
    mentor: '陈动画总监',
    description: '制作游戏角色和场景动画，结合AI技术提升制作效率',
    skills: ['角色动画', '场景设计', 'AI动画', '游戏制作'],
    status: '报名中'
  }
])

// 课程数据
const courses = ref({
  basic: [
    {
      id: 1,
      title: 'AI设计入门基础',
      instructor: '张教授',
      duration: '8小时',
      students: 1200,
      rating: 4.8,
      price: '¥199',
      description: '从零开始学习AI设计，了解基础概念和常用工具'
    },
    {
      id: 2,
      title: 'Midjourney快速上手',
      instructor: '李讲师',
      duration: '6小时',
      students: 950,
      rating: 4.9,
      price: '¥299',
      description: '掌握Midjourney的基础操作和提示词技巧'
    },
    {
      id: 3,
      title: '设计思维与AI工具',
      instructor: '王专家',
      duration: '10小时',
      students: 800,
      rating: 4.7,
      price: '¥399',
      description: '结合设计思维方法，合理运用AI工具提升创作效率'
    },
    {
      id: 4,
      title: 'AI色彩搭配原理',
      instructor: '陈大师',
      duration: '5小时',
      students: 650,
      rating: 4.6,
      price: '¥159',
      description: '学习色彩理论，掌握AI辅助的色彩搭配技巧'
    }
  ],
  advanced: [
    {
      id: 5,
      title: 'Stable Diffusion进阶实战',
      instructor: '赵专家',
      duration: '16小时',
      students: 500,
      rating: 4.9,
      price: '¥799',
      description: '深入学习Stable Diffusion的高级技巧和模型训练'
    },
    {
      id: 6,
      title: 'AI辅助UI设计流程',
      instructor: '孙总监',
      duration: '12小时',
      students: 750,
      rating: 4.8,
      price: '¥699',
      description: '将AI工具整合到UI设计工作流程中，提升设计效率'
    },
    {
      id: 7,
      title: 'ComfyUI工作流优化',
      instructor: '周技术官',
      duration: '14小时',
      students: 320,
      rating: 4.7,
      price: '¥899',
      description: '构建高效的ComfyUI工作流，实现复杂的AI生成任务'
    },
    {
      id: 8,
      title: 'AI动画制作技术',
      instructor: '吴动画师',
      duration: '18小时',
      students: 280,
      rating: 4.6,
      price: '¥1299',
      description: '掌握AI动画制作的核心技术和实战应用'
    }
  ],
  professional: [
    {
      id: 9,
      title: 'AI设计项目管理',
      instructor: '郑经理',
      duration: '20小时',
      students: 150,
      rating: 4.9,
      price: '¥1599',
      description: '学习如何管理大型AI设计项目，提升团队协作效率'
    },
    {
      id: 10,
      title: '企业级AI设计解决方案',
      instructor: '何首席',
      duration: '24小时',
      students: 120,
      rating: 4.8,
      price: '¥2199',
      description: '为企业客户提供定制化AI设计解决方案的完整流程'
    },
    {
      id: 11,
      title: 'AI设计创业指导',
      instructor: '林创始人',
      duration: '15小时',
      students: 200,
      rating: 4.7,
      price: '¥1899',
      description: '从技术到商业，全方位指导AI设计领域的创业实践'
    },
    {
      id: 12,
      title: 'AI设计伦理与法律',
      instructor: '冯律师',
      duration: '8小时',
      students: 300,
      rating: 4.5,
      price: '¥599',
      description: '了解AI设计领域的伦理规范和法律风险'
    }
  ]
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegist = () => {
  router.push('/regist')
}

const navigateToHome = () => {
  router.push('/')
}

// 登录状态
const authStore = useAuthStore()
const isLogin = computed(() => Boolean(authStore.token))

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el)
    el.scrollIntoView({ behavior: 'smooth' })
}

// 显示二维码弹窗
const showQrCodeModal = () => {
  qrCodeModalVisible.value = true
}

// 关闭二维码弹窗
const hideQrCodeModal = () => {
  qrCodeModalVisible.value = false
}

// 切换联系方式悬浮按钮
const toggleContact = () => {
  contactExpanded.value = !contactExpanded.value
}

onMounted(async () => {
  // 显示联系方式悬浮按钮
  contactVisible.value = true

  // 动态导入 ECharts
  const echarts = await import('echarts')

  // 学习进度分布图
  if (learningProgressChart.value) {
    const chart = echarts.init(learningProgressChart.value)
    const option = {
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}人 ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#fff',
        },
      },
      series: [{
        name: '学习进度分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#fff',
          formatter: '{b}\n{c}人',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        data: [
          { value: 800, name: '入门阶段' },
          { value: 1200, name: '进阶学习' },
          { value: 600, name: '专业认证' },
          { value: 400, name: '实战项目' },
        ],
      }],
    }
    chart.setOption(option)
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }

  // 技能掌握分布图
  if (skillDistributionChart.value) {
    const chart = echarts.init(skillDistributionChart.value)
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#ccc',
        },
      },
      yAxis: {
        type: 'category',
        data: ['AI绘画', 'UI设计', '品牌设计', '动效设计', '3D建模', '插画设计'],
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#ccc',
        },
      },
      series: [
        {
          name: '掌握人数',
          type: 'bar',
          data: [2100, 1800, 1400, 1100, 800, 1600],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#7c4dff' },
              { offset: 1, color: '#00bcd4' },
            ]),
          },
        },
      ],
    }
    chart.setOption(option)
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }

  // 认证获取趋势图
  if (certificationTrendChart.value) {
    const chart = echarts.init(certificationTrendChart.value)
    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['初级认证', '中级认证', '高级认证', '专家认证'],
        textStyle: {
          color: '#ccc',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#ccc',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#ccc',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      series: [
        {
          name: '初级认证',
          type: 'line',
          data: [120, 150, 180, 220, 280, 320],
          itemStyle: {
            color: '#4caf50',
          },
        },
        {
          name: '中级认证',
          type: 'line',
          data: [80, 95, 110, 140, 170, 200],
          itemStyle: {
            color: '#2196f3',
          },
        },
        {
          name: '高级认证',
          type: 'line',
          data: [20, 30, 45, 60, 80, 95],
          itemStyle: {
            color: '#9c27b0',
          },
        },
        {
          name: '专家认证',
          type: 'line',
          data: [5, 8, 12, 18, 25, 30],
          itemStyle: {
            color: '#ff9800',
          },
        },
      ],
    }
    chart.setOption(option)
    window.addEventListener('resize', () => {
      chart.resize()
    })
  }
})
</script>

<template>
	<div class="min-h-screen bg-gray-50 text-gray-900">
		<!-- 导航栏 -->
		<header class="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md shadow-sm">
			<div class="container mx-auto px-6 py-2 flex justify-between items-center">
				<div class="flex items-center cursor-pointer" @click="navigateToHome">
					<img src="/亿思logo.png" alt="亿思AI" class="h-10">
				</div>
				<div class="flex items-center space-x-8">
					<nav class="hidden md:flex space-x-8">
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							@click="scrollToSection('courses')">
							在线课程
						</a>
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							@click="scrollToSection('learning-paths')">
							学习路径
						</a>
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							@click="scrollToSection('certifications')">
							专业认证
						</a>
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							@click="scrollToSection('practical-projects')">
							实训项目
						</a>
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							@click="scrollToSection('statistics')">
							数据统计
						</a>
					</nav>
					<div class="flex items-center space-x-4">
						<template v-if="!isLogin">
							<a-button
								class="!rounded-button text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								@click="navigateToLogin">
								登录
							</a-button>
							<a-button type="primary"
								class="!rounded-button bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								@click="navigateToRegist">
								免费注册
							</a-button>
						</template>
						<template v-else>
							<UserAvatar />
						</template>
						<button class="md:hidden text-gray-700 focus:outline-none cursor-pointer whitespace-nowrap"
							@click="toggleMobileMenu">
							<i class="fas fa-bars text-xl" />
						</button>
					</div>
				</div>
			</div>
			<!-- 移动端菜单 -->
			<div v-if="mobileMenuOpen" class="md:hidden bg-white py-3 px-6 shadow-lg">
				<div class="flex flex-col space-y-4">
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('courses'); mobileMenuOpen = false">在线课程</a>
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('learning-paths'); mobileMenuOpen = false">学习路径</a>
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('certifications'); mobileMenuOpen = false">专业认证</a>
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('practical-projects'); mobileMenuOpen = false">实训项目</a>
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('statistics'); mobileMenuOpen = false">数据统计</a>
				</div>
			</div>
		</header>

		<!-- Hero Section -->
		<section class="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-purple-50 to-white">
			<div class="absolute inset-0 z-0">
				<div class="w-full h-full bg-gradient-to-r from-purple-600/10 to-blue-500/5"></div>
			</div>
			<div class="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-12">
				<!-- 左侧：主要内容 -->
				<div class="lg:w-1/2 text-center lg:text-left px-4 lg:px-0">
					<div class="flex items-center justify-center lg:justify-start mb-4">
						<div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
							<i class="fas fa-graduation-cap text-purple-600 text-xl" />
						</div>
						<span class="text-xl text-purple-600 font-semibold">AI设计教育</span>
					</div>
					<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10">
						<div class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">未来设计教育</div>
						<div class="text-gray-900">从这里开始</div>
					</h1>
					<p class="text-xl text-gray-600 mb-8 leading-relaxed">
						构建完整的AI设计教育体系，提供专业课程与认证，培养未来设计人才
					</p>

					<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
						<a-button type="primary" size="large"
							class="!rounded-button bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
							:style="{ fontSize: '1.2rem', padding: '1rem 2rem', height: 'auto' }" @click="showQrCodeModal">
							开始学习
						</a-button>
						<a-button size="large"
							class="!rounded-button text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 transition-colors duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
							:style="{ fontSize: '1.2rem', padding: '1rem 2rem', height: 'auto' }"
							@click="showQrCodeModal">
							查看路径
						</a-button>
					</div>
				</div>

				<!-- 右侧：统计数据展示 -->
				<div class="lg:w-1/2 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto lg:mx-0">
					<div class="bg-white rounded-2xl p-6 lg:p-7 xl:p-8 shadow-lg">
						<div class="text-center mb-6 lg:mb-8">
							<h3 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">教育成果展示</h3>
							<p class="text-gray-600 text-sm lg:text-base xl:text-lg">累计培养数千名AI设计人才，就业率与薪资水平显著提升</p>
						</div>

						<div class="grid grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
							<div
								class="bg-purple-50 rounded-xl p-4 lg:p-6 text-center border border-purple-200 hover:shadow-md transition-shadow duration-300">
								<div class="text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-600 mb-2">5,000+</div>
								<div class="text-gray-700 text-sm lg:text-base">累计学员</div>
							</div>
							<div
								class="bg-blue-50 rounded-xl p-4 lg:p-6 text-center border border-blue-200 hover:shadow-md transition-shadow duration-300">
								<div class="text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 mb-2">95%</div>
								<div class="text-gray-700 text-sm lg:text-base">就业率</div>
							</div>
							<div
								class="bg-green-50 rounded-xl p-4 lg:p-6 text-center border border-green-200 hover:shadow-md transition-shadow duration-300">
								<div class="text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600 mb-2">40%</div>
								<div class="text-gray-700 text-sm lg:text-base">平均薪资提升</div>
							</div>
							<div
								class="bg-orange-50 rounded-xl p-4 lg:p-6 text-center border border-orange-200 hover:shadow-md transition-shadow duration-300">
								<div class="text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-600 mb-2">200+</div>
								<div class="text-gray-700 text-sm lg:text-base">合作企业</div>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
							<div class="bg-gray-50 rounded-lg p-4 lg:p-5 border border-gray-200">
								<h4 class="font-bold text-gray-900 mb-3">热门课程</h4>
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span>AI设计入门</span>
										<span class="text-purple-600">1200+学员</span>
									</div>
									<div class="flex justify-between text-sm">
										<span>Midjourney进阶</span>
										<span class="text-blue-600">950+学员</span>
									</div>
									<div class="flex justify-between text-sm">
										<span>UI设计实战</span>
										<span class="text-green-600">750+学员</span>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 rounded-lg p-4 lg:p-5 border border-gray-200">
								<h4 class="font-bold text-gray-900 mb-3">认证获取</h4>
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span>初级认证</span>
										<span class="text-green-600">考级获取</span>
									</div>
									<div class="flex justify-between text-sm">
										<span>中级认证</span>
										<span class="text-blue-600">考级获取</span>
									</div>
									<div class="flex justify-between text-sm">
										<span>高级认证</span>
										<span class="text-purple-600">考级获取</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
				<a class="text-gray-600 opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
					@click="scrollToSection('courses')">
					<i class="fas fa-chevron-down text-2xl" />
				</a>
			</div>
		</section>

		    <!-- 核心课程体系 -->
    <section id="core-courses" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            AI+设计训练营
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            五大核心课程模块，从AI工具入门到实战应用，系统构建AI设计知识体系
          </p>
        </div>

                        <div class="max-w-7xl mx-auto">
          <!-- 课程时间线 -->
          <div class="relative pb-12">
            <!-- 课程卡片 - 水平排列 -->
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 mb-8">
              <!-- Lesson 1 -->
              <div class="relative">
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200 card-hover">
                  <div class="text-center mb-4">
                    <div class="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                      01
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">AI与设计初探</h3>
                    <p class="text-sm text-purple-600">Foundation · 基础认知</p>
                  </div>
                  <p class="text-gray-700 mb-4 leading-relaxed text-sm">
                    探索AI在设计领域的核心价值，掌握8大主流AI工具的基础功能与应用场景。
                  </p>
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-900 text-sm">核心内容</h4>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        精准关键词抽取实践
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        AI驱动关键词合成
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        AI创意生成对决挑战
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        AI创意结构深度讨论
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="tool in ['DeepSeek', 'Midjourney']" :key="tool"
                      class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {{ tool }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Lesson 2 -->
              <div class="relative">
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200 card-hover">
                  <div class="text-center mb-4">
                    <div class="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                      02
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Midjourney基础入门</h3>
                    <p class="text-sm text-blue-600">Practical · 实用技能</p>
                  </div>
                  <p class="text-gray-700 mb-4 leading-relaxed text-sm">
                    深入掌握Midjourney的完整操作流程，从会员订阅到高级参数调试。
                  </p>
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-900 text-sm">核心内容</h4>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        MJ会员与双界面使用
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        基础出图整体流程
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        模型效果与应用场景
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        关键词优化策略
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="skill in ['Discord操作', '参数设置']" :key="skill"
                      class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Lesson 3 -->
              <div class="relative">
                <div class="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-cyan-200 card-hover">
                  <div class="text-center mb-4">
                    <div class="w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                      03
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">ComfyUI初探与基础操作</h3>
                    <p class="text-sm text-cyan-600">Advanced · 进阶工具</p>
                  </div>
                  <p class="text-gray-700 mb-4 leading-relaxed text-sm">
                    掌握ComfyUI可视化工作流工具，构建从文生图到图像优化的完整创作流程。
                  </p>
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-900 text-sm">核心内容</h4>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        ComfyUI定位与场景认知
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        文生图标准流程
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        图生图操作实训
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        FLUX放大与毛胚优化
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="workflow in ['文生图流程', 'FLUX模型']" :key="workflow"
                      class="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                      {{ workflow }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Lesson 4 -->
              <div class="relative">
                <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200 card-hover">
                  <div class="text-center mb-4">
                    <div class="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                      04
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Krita-AI基础应用</h3>
                    <p class="text-sm text-green-600">Integration · 工具整合</p>
                  </div>
                  <p class="text-gray-700 mb-4 leading-relaxed text-sm">
                    学习Krita与ComfyUI的深度联动，掌握从理论认知到技术实操的完整学习框架。
                  </p>
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-900 text-sm">核心内容</h4>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        Krita软件基础认知
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        本地/云端部署实操
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        文本生图深度实践
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        图像创意拼接技巧
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="feature in ['AI功能模块', '联动调试']" :key="feature"
                      class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {{ feature }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Lesson 5 -->
              <div class="relative">
                <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200 card-hover">
                  <div class="text-center mb-4">
                    <div class="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                      05
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">AI模拟演练</h3>
                    <p class="text-sm text-orange-600">Practice · 综合实践</p>
                  </div>
                  <p class="text-gray-700 mb-4 leading-relaxed text-sm">
                    综合运用前四课所学，通过真实案例模拟实践，构建完整的AI+设计知识体系。
                  </p>
                  <div class="mb-4">
                    <h4 class="font-medium mb-2 text-gray-900 text-sm">核心内容</h4>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        知识体系串联复盘
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        设计案例模拟实操
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        工具协同逻辑训练
                      </div>
                      <div class="flex items-center text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-1" />
                        生态平台共建思维
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="practice in ['案例模拟', '生态建设']" :key="practice"
                      class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {{ practice }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

                        <!-- 水平时间线和节点 -->
            <div class="hidden lg:block relative">
              <!-- 水平时间线背景线 -->
              <div class="absolute top-3 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-blue-300 via-cyan-300 via-green-300 to-orange-300 rounded-full z-10"></div>

              <!-- 时间线节点 - 使用与课程卡片相同的grid布局确保对齐 -->
              <div class="relative z-20 grid grid-cols-5 gap-8 lg:gap-4">
                <div class="flex justify-center">
                  <div class="w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                </div>
                <div class="flex justify-center">
                  <div class="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                </div>
                <div class="flex justify-center">
                  <div class="w-6 h-6 bg-cyan-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                </div>
                <div class="flex justify-center">
                  <div class="w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                </div>
                <div class="flex justify-center">
                  <div class="w-6 h-6 bg-orange-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                </div>
              </div>
            </div>

            <!-- 训练营特色亮点 -->
            <div class="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold mb-4">AI+设计训练营特色</h3>
                <p class="text-purple-100 max-w-2xl mx-auto">
                  引领创意未来，打造智能时代的设计思维体系
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-brain text-2xl" />
                  </div>
                  <h4 class="font-bold mb-2">课程本体</h4>
                  <p class="text-sm text-purple-100">主流文本类大模型应用<br/>AI创意工具深度实践</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-cube text-2xl" />
                  </div>
                  <h4 class="font-bold mb-2">主流大模型</h4>
                  <p class="text-sm text-purple-100">FLUX高精度大模型<br/>SDXL专业类大模型</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-rocket text-2xl" />
                  </div>
                  <h4 class="font-bold mb-2">MJ账号</h4>
                  <p class="text-sm text-purple-100">赠会员账号，解锁体验<br/>资源丰富，适配多元场景</p>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user-tie text-2xl" />
                  </div>
                  <h4 class="font-bold mb-2">专业服务</h4>
                  <p class="text-sm text-purple-100">全程答疑答疑服务<br/>进阶课程衔接福利</p>
                </div>
              </div>
              <div class="mt-8 text-center">
                <div class="flex flex-wrap justify-center gap-4 mb-6">
                  <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2" />
                    <span>掌握前沿工具链条</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2" />
                    <span>解锁AI生成艺术的底层逻辑</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2" />
                    <span>打造AI+设计全案作品</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2" />
                    <span>构建智能时代的设计思维体系</span>
                  </div>
                </div>
                <a-button type="primary" size="large"
                  class="!rounded-button bg-white text-purple-600 border-none hover:bg-gray-100 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                  :style="{ fontSize: '1.2rem', padding: '1rem 2rem', height: 'auto' }"
                  @click="showQrCodeModal">
                  <i class="fas fa-play mr-2" />
                  立即体验课程
                </a-button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>

    <!-- 在线课程 -->
    <section id="courses" class="py-20 bg-white">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						在线课程
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						精品AI设计课程，从基础入门到高级应用，系统性学习AI设计技能
					</p>
				</div>

				<!-- 课程分类标签 -->
				<div class="mb-12 border-b border-gray-200">
					<div class="flex justify-center space-x-8">
						<button
							class="pb-3 px-4 border-b-2 font-medium text-lg cursor-pointer whitespace-nowrap transition-colors duration-300"
							:class="activeCourseTab === 'basic' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
							@click="activeCourseTab = 'basic'">
							<i class="fas fa-seedling mr-2" />
							基础课程
						</button>
						<button
							class="pb-3 px-4 border-b-2 font-medium text-lg cursor-pointer whitespace-nowrap transition-colors duration-300"
							:class="activeCourseTab === 'advanced' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
							@click="activeCourseTab = 'advanced'">
							<i class="fas fa-rocket mr-2" />
							进阶课程
						</button>
						<button
							class="pb-3 px-4 border-b-2 font-medium text-lg cursor-pointer whitespace-nowrap transition-colors duration-300"
							:class="activeCourseTab === 'professional' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
							@click="activeCourseTab = 'professional'">
							<i class="fas fa-crown mr-2" />
							专业课程
						</button>
					</div>
				</div>

				<!-- 课程内容 -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					<div v-for="course in courses[activeCourseTab]" :key="course.id"
						class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 card-hover">
						<div class="flex justify-between items-start mb-4">
							<div class="flex items-center">
								<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
									<i class="fas fa-play-circle text-purple-600" />
								</div>
								<div>
									<div class="flex items-center mb-1">
										<i class="fas fa-star text-yellow-500 mr-1" />
										<span class="text-sm font-medium text-gray-900">{{ course.rating }}</span>
									</div>
									<div class="text-xs text-gray-600">{{ course.students }}+ 学员</div>
								</div>
							</div>
							<span class="text-lg font-bold text-purple-600" :class="{ 'opacity-0': hidePrices }">{{ course.price }}</span>
						</div>

						<h3 class="text-lg font-bold text-gray-900 mb-2">{{ course.title }}</h3>
						<p class="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{{ course.description }}</p>

						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center text-sm text-gray-600">
								<i class="fas fa-user mr-1" />
								<span>{{ course.instructor }}</span>
							</div>
							<div class="flex items-center text-sm text-gray-600">
								<i class="fas fa-clock mr-1" />
								<span>{{ course.duration }}</span>
							</div>
						</div>

						<a-button type="primary" size="large"
							class="!rounded-button w-full bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
							@click="showQrCodeModal">
							立即学习
						</a-button>
					</div>
				</div>

				<div class="text-center mt-12">
					<a-button size="large"
						class="!rounded-button text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						:style="{ fontSize: '1.2rem', padding: '1rem 2rem', height: 'auto' }"
						@click="showQrCodeModal">
						查看全部课程
					</a-button>
				</div>
			</div>
		</section>

		<!-- 学习路径 -->
		<section id="learning-paths" class="py-20 bg-gray-50">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						学习路径
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						根据不同职业方向，设计完整的学习成长路径，系统化提升专业技能
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div v-for="path in learningPaths" :key="path.id"
						class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 card-hover">
						<div class="flex items-start justify-between mb-6">
							<div class="flex items-center">
								<div
									class="w-14 h-14 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mr-4">
									<i :class="`fas ${path.icon} text-2xl text-purple-600`" />
								</div>
								<div>
									<h3 class="text-xl font-bold text-gray-900 mb-1">{{ path.name }}</h3>
									<span class="text-sm px-3 py-1 rounded-full font-medium" :class="{
                      'bg-green-100 text-green-700': path.level === '中级',
                      'bg-blue-100 text-blue-700': path.level === '中高级',
                      'bg-purple-100 text-purple-700': path.level === '高级'
                    }">
										{{ path.level }}
									</span>
								</div>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-purple-600">{{ path.completion }}%</div>
								<div class="text-xs text-gray-600">完成率</div>
							</div>
						</div>

						<p class="text-gray-600 mb-6 leading-relaxed">{{ path.description }}</p>

						<div class="grid grid-cols-3 gap-4 mb-6">
							<div class="text-center">
								<div class="text-lg font-bold text-gray-900">{{ path.courses }}</div>
								<div class="text-xs text-gray-600">门课程</div>
							</div>
							<div class="text-center">
								<div class="text-lg font-bold text-gray-900">{{ path.duration }}</div>
								<div class="text-xs text-gray-600">学习周期</div>
							</div>
							<div class="text-center">
								<div class="text-lg font-bold text-gray-900">{{ path.students }}+</div>
								<div class="text-xs text-gray-600">在读学员</div>
							</div>
						</div>

						<div class="mb-6">
							<h4 class="font-medium mb-3 text-gray-900">核心技能</h4>
							<div class="flex flex-wrap gap-2">
								<span v-for="skill in path.skills" :key="skill"
									class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
									{{ skill }}
								</span>
							</div>
						</div>

						<div class="flex space-x-3">
							<a-button type="primary" size="large"
								class="!rounded-button flex-1 bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
								@click="showQrCodeModal">
								开始学习
							</a-button>
							<a-button size="large"
								class="!rounded-button text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								@click="showQrCodeModal">
								了解详情
							</a-button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 专业认证 -->
		<section id="certifications" class="py-20 bg-white">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						专业认证
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						获得行业认可的AI设计专业认证，提升职场竞争力与专业权威性
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div v-for="cert in certifications" :key="cert.id"
						class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 card-hover">
						<div class="flex items-start justify-between mb-6">
							<div class="flex items-center">
								<div :class="`w-16 h-16 rounded-full bg-${cert.color}-100 flex items-center justify-center mr-4`">
									<i :class="`fas ${cert.icon} text-2xl text-${cert.color}-600`" />
								</div>
								<div>
									<h3 class="text-xl font-bold text-gray-900 mb-1">{{ cert.name }}</h3>
									<div class="flex items-center space-x-2">
										<span
											:class="`text-sm px-3 py-1 rounded-full font-medium bg-${cert.color}-100 text-${cert.color}-700`">
											{{ cert.level }}
										</span>
										<span class="text-sm text-gray-600">{{ cert.duration }}</span>
									</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-purple-600" :class="{ 'opacity-0': hidePrices }">{{ cert.price }}</div>
								<div class="text-xs text-gray-600">认证费用</div>
							</div>
						</div>

						<div class="mb-6">
							<h4 class="font-medium mb-3 text-gray-900">认证要求</h4>
							<ul class="space-y-2">
								<li v-for="requirement in cert.requirements" :key="requirement"
									class="flex items-center text-sm text-gray-600">
									<i class="fas fa-check-circle text-green-500 mr-2" />
									{{ requirement }}
								</li>
							</ul>
						</div>

						<div class="mb-6">
							<h4 class="font-medium mb-3 text-gray-900">认证权益</h4>
							<ul class="space-y-2">
								<li v-for="benefit in cert.benefits" :key="benefit" class="flex items-center text-sm text-gray-600">
									<i class="fas fa-star text-yellow-500 mr-2" />
									{{ benefit }}
								</li>
							</ul>
						</div>

						<div class="flex space-x-3">
							<a-button type="primary" size="large"
								:class="`!rounded-button flex-1 bg-gradient-to-r from-${cert.color}-600 to-${cert.color}-700 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap`"
								@click="showQrCodeModal">
								立即申请
							</a-button>
							<a-button size="large"
								:class="`!rounded-button text-${cert.color}-600 bg-white border border-${cert.color}-600 hover:bg-${cert.color}-50 transition-colors duration-300 cursor-pointer whitespace-nowrap`"
								@click="showQrCodeModal">
								查看样本
							</a-button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 实训项目 -->
		<section id="practical-projects" class="py-20 bg-gray-50">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						实训项目
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						真实企业项目实战训练，在实践中掌握AI设计技能，积累项目经验
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div v-for="project in practicalProjects" :key="project.id"
						class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 card-hover">
						<div class="flex items-start justify-between mb-6">
							<div>
								<h3 class="text-xl font-bold text-gray-900 mb-2">{{ project.title }}</h3>
								<p class="text-gray-600 mb-3">合作企业：{{ project.company }}</p>
								<div class="flex items-center space-x-3">
									<span :class="{
                    'bg-blue-100 text-blue-700': project.difficulty === '中级',
                    'bg-red-100 text-red-700': project.difficulty === '高级'
                  }" class="text-xs px-2 py-1 rounded font-medium">
										{{ project.difficulty }}
									</span>
									<span class="text-xs text-gray-600">{{ project.duration }}</span>
									<span class="text-xs text-gray-600">{{ project.participants }}人参与</span>
								</div>
							</div>
							<div class="text-right">
								<span :class="{
                  'bg-green-100 text-green-700': project.status === '进行中',
                  'bg-blue-100 text-blue-700': project.status === '即将开始',
                  'bg-gray-100 text-gray-700': project.status === '已完成',
                  'bg-yellow-100 text-yellow-700': project.status === '报名中'
                }" class="text-xs px-3 py-1 rounded-full font-medium">
									{{ project.status }}
								</span>
							</div>
						</div>

						<p class="text-gray-600 mb-6 leading-relaxed">{{ project.description }}</p>

						<div class="mb-6">
							<h4 class="font-medium mb-3 text-gray-900">涉及技能</h4>
							<div class="flex flex-wrap gap-2">
								<span v-for="skill in project.skills" :key="skill"
									class="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
									{{ skill }}
								</span>
							</div>
						</div>

						<div class="flex items-center justify-between mb-6">
							<div class="flex items-center">
								<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
									<i class="fas fa-user text-gray-600" />
								</div>
								<div>
									<div class="font-medium text-gray-900">{{ project.mentor }}</div>
									<div class="text-xs text-gray-600">项目导师</div>
								</div>
							</div>
						</div>

						<a-button :disabled="project.status === '已完成'" type="primary" size="large"
							class="!rounded-button w-full bg-gradient-to-r from-cyan-600 to-blue-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50"
							@click="project.status !== '已完成' ? showQrCodeModal() : undefined">
							{{ project.status === '进行中' ? '查看详情' : project.status === '即将开始' ? '预约报名' : project.status === '已完成' ?
							'项目已结束' : '立即报名' }}
						</a-button>
					</div>
				</div>
			</div>
		</section>

		<!-- 数据统计 -->
		<section id="statistics" class="py-20 bg-white">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						学习数据统计
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						可视化学习进度与技能分布，洞察AI设计教育趋势
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- 学习进度分布 -->
					<div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200 card-hover">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
								<i class="fas fa-chart-pie text-purple-600" />
							</div>
							<h3 class="text-xl font-bold text-gray-900">
								学习进度分布
							</h3>
						</div>
						<p class="text-gray-600 mb-6">
							展示学员在不同学习阶段的分布情况
						</p>
						<div class="bg-gray-900 rounded-lg p-4 h-80">
							<div ref="learningProgressChart" class="w-full h-full" />
						</div>
					</div>

					<!-- 技能掌握分布 -->
					<div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200 card-hover">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
								<i class="fas fa-chart-bar text-blue-600" />
							</div>
							<h3 class="text-xl font-bold text-gray-900">
								技能掌握分布
							</h3>
						</div>
						<p class="text-gray-600 mb-6">
							统计各类AI设计技能的学习人数分布
						</p>
						<div class="bg-gray-900 rounded-lg p-4 h-80">
							<div ref="skillDistributionChart" class="w-full h-full" />
						</div>
					</div>

					<!-- 认证获取趋势 -->
					<div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200 card-hover">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
								<i class="fas fa-chart-line text-green-600" />
							</div>
							<h3 class="text-xl font-bold text-gray-900">
								认证获取趋势
							</h3>
						</div>
						<p class="text-gray-600 mb-6">
							追踪各级别认证的获取趋势变化
						</p>
						<div class="bg-gray-900 rounded-lg p-4 h-80">
							<div ref="certificationTrendChart" class="w-full h-full" />
						</div>
					</div>
				</div>

				<!-- 综合统计数据 -->
				<div class="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
					<div class="text-center mb-8">
						<h3 class="text-2xl font-bold mb-4">AI教育平台综合数据</h3>
						<p class="text-purple-100 max-w-2xl mx-auto">
							持续更新的教育数据，展示AI设计教育的蓬勃发展
						</p>
					</div>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div class="text-center">
							<div class="text-4xl font-bold mb-2">50+</div>
							<div class="text-purple-100">专业课程</div>
						</div>
						<div class="text-center">
							<div class="text-4xl font-bold mb-2">12</div>
							<div class="text-purple-100">学习路径</div>
						</div>
						<div class="text-center">
							<div class="text-4xl font-bold mb-2">20+</div>
							<div class="text-purple-100">实训项目</div>
						</div>
						<div class="text-center">
							<div class="text-4xl font-bold mb-2">100+</div>
							<div class="text-purple-100">行业导师</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 合作企业 -->
		<section class="py-20 bg-gray-50">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						合作企业
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						与知名企业深度合作，提供真实项目实训机会
					</p>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					<div v-for="i in 12" :key="`company-${i}`"
						class="bg-white rounded-xl p-6 flex items-center justify-center hover:bg-purple-50 transition-colors duration-300 cursor-pointer transform hover:scale-105 transition-transform border border-gray-200 shadow-md">
						<div class="text-center">
							<div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
								<i
									:class="`fas fa-${['building', 'laptop', 'mobile-alt', 'gamepad', 'palette', 'tv', 'camera', 'music', 'film', 'shopping-cart', 'car', 'plane'][i - 1]} text-3xl text-purple-600`" />
							</div>
							<span class="text-sm font-medium text-gray-900">{{ ['科技巨头', '软件公司', '移动应用', '游戏工作室', '设计机构', '媒体公司',
								'摄影工作室', '音乐平台', '影视制作', '电商平台', '汽车制造', '航空公司'][i - 1] }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 学员反馈 -->
		<section class="py-20 bg-white">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						学员反馈
					</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						听听我们学员的真实反馈和成长故事
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div v-for="i in 6" :key="`feedback-${i}`"
						class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 card-hover">
						<div class="flex items-center mb-4">
							<div class="w-12 h-12 rounded-full overflow-hidden mr-4">
								<img
									:src="`https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20young%20designer%20student%20with%20confident%20smile%2C%20modern%20style%20against%20simple%20background%2C%20high%20quality%20studio%20lighting&width=100&height=100&seq=student-${i}&orientation=squarish`"
									:alt="`学员${i}`" class="w-full h-full object-cover">
							</div>
							<div>
								<h4 class="font-bold text-gray-900">{{ ['张同学', '李同学', '王同学', '陈同学', '刘同学', '赵同学'][i - 1] }}</h4>
								<p class="text-sm text-gray-600">{{ ['UI设计师', '品牌设计师', '插画师', '产品设计师', '动效设计师', '视觉设计师'][i - 1] }}</p>
							</div>
						</div>
						<div class="flex items-center mb-3">
							<div class="flex">
								<i v-for="j in 5" :key="j" class="fas fa-star text-yellow-500" />
							</div>
							<span class="ml-2 text-sm text-gray-600">5.0</span>
						</div>
						<p class="text-gray-700 leading-relaxed">
							{{ [
							'通过亿思AI的课程学习，我掌握了Midjourney和Stable Diffusion等AI工具，现在的工作效率提升了300%，薪资也翻了一倍。',
							'实训项目让我有机会参与真实的商业项目，在导师的指导下完成了品牌VI设计，现在已经成功入职心仪的设计公司。',
							'从零基础到获得中级认证，整个学习过程非常系统。AI插画技能让我在自由职业路上如鱼得水，月收入超过2万。',
							'产品设计课程结合了AI工具的实际应用，让我在用户体验设计方面有了质的飞跃，现在担任产品设计团队负责人。',
							'动效设计课程非常实用，学会了AI辅助动画制作后，我的作品在业内获得了广泛认可，还受邀参加了国际设计大会。',
							'认证体系很完善，获得高级认证后在求职市场非常有竞争力，现在在一线互联网公司担任首席视觉设计师。'
							][i - 1] }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 加入学习 -->
		<section class="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
			<div class="container mx-auto px-6">
				<div class="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
					<div class="flex flex-col md:flex-row items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
								开启AI设计学习之旅
							</h2>
							<p class="text-gray-600 mb-6">
								无论您是设计新手还是行业专家，我们都有适合您的学习路径。
								加入亿思AI教育，掌握未来设计技能，实现职业突破。
							</p>
							<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
								<a-button type="primary" size="large"
									class="!rounded-button bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
									@click="showQrCodeModal">
									免费试学
								</a-button>
								<a-button size="large"
									class="!rounded-button bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors duration-300 cursor-pointer whitespace-nowrap"
									@click="showQrCodeModal">
									咨询顾问
								</a-button>
							</div>
						</div>
						<div class="md:w-1/2 md:pl-8">
							<div class="grid grid-cols-2 gap-4">
								<div
									class="bg-purple-50 rounded-xl p-4 text-center border border-purple-200 hover:shadow-md transition-shadow duration-300">
									<div class="text-3xl font-bold text-purple-600 mb-2">
										7天
									</div>
									<div class="text-sm text-gray-700">
										免费试学期
									</div>
								</div>
								<div
									class="bg-blue-50 rounded-xl p-4 text-center border border-blue-200 hover:shadow-md transition-shadow duration-300">
									<div class="text-3xl font-bold text-blue-600 mb-2">
										1对1
									</div>
									<div class="text-sm text-gray-700">
										专属导师指导
									</div>
								</div>
								<div
									class="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200 hover:shadow-md transition-shadow duration-300">
									<div class="text-3xl font-bold text-cyan-600 mb-2">
										100%
									</div>
									<div class="text-sm text-gray-700">
										就业保障
									</div>
								</div>
								<div
									class="bg-green-50 rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-shadow duration-300">
									<div class="text-3xl font-bold text-green-600 mb-2">
										终身
									</div>
									<div class="text-sm text-gray-700">
										课程更新
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 页脚 -->
		<footer class="bg-gray-900 py-12">
			<div class="container mx-auto px-6">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 class="text-xl font-bold mb-4 text-white">
							亿思AI · AI教育
						</h3>
						<p class="text-gray-400 mb-4">
							构建完整的AI设计教育体系，培养未来设计人才
						</p>
						<div class="flex space-x-4">
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weixin text-xl" />
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weibo text-xl" />
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-qq text-xl" />
							</a>
						</div>
					</div>
					<div>
						<h4 class="font-bold mb-4 text-white">
							学习资源
						</h4>
						<ul class="space-y-2">
							<li>
								<a class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
									@click="scrollToSection('courses')">
									在线课程
								</a>
							</li>
							<li>
								<a class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
									@click="scrollToSection('learning-paths')">学习路径</a>
							</li>
							<li>
								<a class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
									@click="scrollToSection('certifications')">专业认证</a>
							</li>
							<li>
								<a class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
									@click="scrollToSection('practical-projects')">实训项目</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="font-bold mb-4 text-white">
							关于我们
						</h4>
						<ul class="space-y-2">
							<li>
								<router-link to="/"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">公司介绍</router-link>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="font-bold mb-4 text-white">
							联系我们
						</h4>
						<ul class="space-y-2">
							<li class="flex items-center text-gray-400">
								<i class="fas fa-phone mr-2" />
								<span>150-7240-0560</span>
							</li>
							<li class="flex items-center text-gray-400">
								<i class="fas fa-envelope mr-2" />
								<span>1151386302@qq.com</span>
							</li>
							<li class="flex items-center text-gray-400">
								<i class="fas fa-clock mr-2" />
								<span>周一至周六 9:00-18:00</span>
							</li>
						</ul>
					</div>
				</div>
				<div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
					<div class="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; 2025 亿思（湖北省）科技有限公司. 保留所有权利.
					</div>
					<div class="flex space-x-4">
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">隐私政策</a>
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">服务条款</a>
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">学员协议</a>
					</div>
				</div>
			</div>
		</footer>

				<!-- 联系方式悬浮按钮 -->
		<div v-if="contactVisible" class="fixed bottom-6 right-6 z-50">
			<!-- 展开的联系方式 -->
			<div v-if="contactExpanded" class="absolute bottom-16 right-0 space-y-3">
				<div class="bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 animate-slideUp w-40">
					<div class="text-center">
						<img src="@/assets/二维码.png" alt="客服微信" class="w-28 h-28 mx-auto mb-2 rounded-lg object-contain" />
						<p class="text-sm text-gray-700 font-medium mb-0">客服微信</p>
					</div>
				</div>
				<div class="bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 animate-slideUp w-40">
					<div class="text-center">
						<img src="@/assets/公众号.jpg" alt="公众号" class="w-28 h-28 mx-auto mb-2 rounded-lg object-contain" />
						<p class="text-sm text-gray-700 font-medium mb-0">公众号</p>
					</div>
				</div>
			</div>

			<!-- 主按钮 -->
			<button
				@click="toggleContact"
				class="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
				:class="{ 'rotate-45': contactExpanded }">
				<i class="fab fa-weixin text-2xl" />
			</button>
		</div>

		<!-- 二维码弹窗 -->
		<a-modal
			v-model:open="qrCodeModalVisible"
			title="扫码了解课程"
			:footer="null"
			centered
			width="400px"
			@cancel="hideQrCodeModal">
			<div class="text-center p-6">
				<div class="mb-4">
					<img src="@/assets/二维码.png" alt="课程二维码" class="mx-auto w-64 h-64 object-contain" />
				</div>
				<p class="text-lg text-gray-700 font-medium">扫码了解课程</p>
				<p class="text-sm text-gray-500 mt-2">请使用微信扫描二维码</p>
			</div>
		</a-modal>
	</div>
</template>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 卡片悬停效果 */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
