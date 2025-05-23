<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white">
		<!-- 导航栏 -->
		<header class="fixed top-0 left-0 right-0 z-50 bg-opacity-90 bg-gray-900 backdrop-blur-md shadow-lg">
			<div class="container mx-auto px-6 py-4 flex justify-between items-center">
				<div class="flex items-center">
					<div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
						亿思AI设计联盟平台
					</div>
				</div>
				<nav class="hidden md:flex space-x-8">
					<a @click="scrollToSection('talent-pool')"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						title="探索全球设计人才资源，寻找合适的设计师或工作机会">未来设计师联盟</a>
					<a @click="scrollToSection('ai-resources')"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						title="体验前沿AI设计工具，提升创作效率">AI资源池</a>
					<a @click="scrollToSection('task-system')"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						title="发布或接取设计任务，智能匹配需求">创意速配中心</a>
					<!-- <a @click="scrollToSection('data-dashboard')"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						title="实时监控行业数据，把握市场动向">AIGC驾驶舱</a> -->
					<router-link to="/chat"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
						title="智能对话">AIGC驾驶舱</router-link>
				</nav>
				<div class="flex items-center space-x-4">
					<template v-if="!isLogin">
						<a-button type="primary"
							class="!rounded-button bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
							title="登录您的账户，访问个性化服务" @click="navigateToLogin">
							登录
						</a-button>
						<a-button
							class="!rounded-button bg-transparent border border-purple-500 hover:bg-purple-900 transition-colors duration-300 text-white cursor-pointer whitespace-nowrap"
							title="创建新账户，开启AI设计之旅" @click="navigateToRegist">
							注册
						</a-button>
					</template>
					<template v-else>
						<UserAvatar />
					</template>
					<button class="md:hidden text-white focus:outline-none cursor-pointer whitespace-nowrap"
						@click="toggleMobileMenu">
						<i class="fas fa-bars text-xl"></i>
					</button>
				</div>
			</div>
			<!-- 移动端菜单 -->
			<div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 py-4 px-6 shadow-lg">
				<div class="flex flex-col space-y-4">
					<a @click="scrollToSection('talent-pool'); mobileMenuOpen = false"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer">未来设计师联盟</a>
					<a @click="scrollToSection('ai-resources'); mobileMenuOpen = false"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer">AI资源池</a>
					<a @click="scrollToSection('task-system'); mobileMenuOpen = false"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer">创意速配中心</a>
					<a @click="scrollToSection('data-dashboard'); mobileMenuOpen = false"
						class="hover:text-purple-400 transition-colors duration-300 cursor-pointer">数据驾驶舱</a>
				</div>
			</div>
		</header>
		<!-- Hero Section -->
		<section class="relative min-h-screen flex items-center overflow-hidden">
			<div class="absolute inset-0 z-0">
				<img
					src="https://readdy.ai/api/search-image?query=Futuristic%20digital%20landscape%20with%20flowing%20data%20streams%20and%20AI%20visualization%2C%20showing%20a%20blend%20of%20purple%20and%20blue%20gradients%20with%20abstract%20geometric%20patterns%20representing%20design%20and%20technology%20fusion%2C%20modern%20minimalist%20style%20with%20clean%20lines%20and%20glowing%20elements&width=1440&height=900&seq=hero-bg-1&orientation=landscape"
					alt="AI设计背景" class="w-full h-full object-cover object-top opacity-60" />
			</div>
			<div class="container mx-auto px-6 z-10 flex flex-col md:flex-row items-center">
				<div class="md:w-3/4 text-center md:text-left mb-12 md:mb-0">
					<h1 class="text-6xl md:text-8xl font-bold leading-[1.25] md:leading-[1.15] mb-10">
						<span
							class="text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI
							驱动</span>
						<br />设计未来
					</h1>
					<p class="text-2xl md:text-3xl text-gray-300 mb-14 leading-[2]">
						连接设计师、AI 工具与企业需求，打造全球领先的设计生态系统。
						让创意与技术完美融合，重新定义设计行业标准。
					</p>
					<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
						<a-button type="primary" size="large"
							class="!rounded-button bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
							:style="{ fontSize: '2rem', padding: '1.25rem 2.5rem', height: 'auto', lineHeight: '1.2' }">
							立即加入
						</a-button>
						<a-button size="large"
							class="!rounded-button text-white bg-transparent border border-purple-500 hover:bg-purple-900 transition-colors duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center"
							:style="{ fontSize: '2rem', padding: '1.25rem 2.5rem', height: 'auto', lineHeight: '1.2' }">
							了解更多
						</a-button>
					</div>
				</div>
			</div>
			<div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
				<a @click="scrollToSection('features')"
					class="text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
					<i class="fas fa-chevron-down text-2xl"></i>
				</a>
			</div>
		</section>
		<!-- 核心功能模块 -->
		<section id="features" class="py-20 bg-gray-900">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">四大核心功能模块</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						亿思AI设计联盟平台围绕人才、AI、任务与数据四大核心模块，构建完整设计生态系统
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<!-- 未来设计师联盟 -->
					<div
						class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
						<div class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mb-6">
							<i class="fas fa-users text-xl"></i>
						</div>
						<h3 class="text-xl font-bold mb-3">未来设计师联盟</h3>
						<p class="text-gray-400 mb-4">
							汇聚全球设计师资源，连接院校、学生、企业，打造人才生态闭环
						</p>
						<a @click="scrollToSection('talent-pool')"
							class="text-blue-400 hover:text-blue-300 flex items-center cursor-pointer">
							<span>了解更多</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</a>
					</div>
					<!-- AI资源池 -->
					<div
						class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
						<div class="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mb-6">
							<i class="fas fa-robot text-xl"></i>
						</div>
						<h3 class="text-xl font-bold mb-3">AI资源池</h3>
						<p class="text-gray-400 mb-4">
							整合前沿AI设计工具，提供行业资讯与教学案例，赋能设计创作
						</p>
						<a @click="scrollToSection('ai-resources')"
							class="text-purple-400 hover:text-purple-300 flex items-center cursor-pointer">
							<span>了解更多</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</a>
					</div>
					<!-- 创意速配中心 -->
					<div
						class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
						<div class="h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center mb-6">
							<i class="fas fa-exchange-alt text-xl"></i>
						</div>
						<h3 class="text-xl font-bold mb-3">创意速配中心</h3>
						<p class="text-gray-400 mb-4">
							智能匹配设计需求与人才，提供全流程任务管理与支付保障
						</p>
						<a @click="scrollToSection('task-system')"
							class="text-cyan-400 hover:text-cyan-300 flex items-center cursor-pointer">
							<span>进入系统</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</a>
					</div>
					<!-- 数据驾驶舱 -->
					<div
						class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
						<div class="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center mb-6">
							<i class="fas fa-chart-line text-xl"></i>
						</div>
						<h3 class="text-xl font-bold mb-3">AIGC驾驶舱</h3>
						<p class="text-gray-400 mb-4">
							可视化AI工具使用数据，展示AIGC设计趋势与效率提升
						</p>
						<a @click="scrollToSection('data-dashboard')"
							class="text-green-400 hover:text-green-300 flex items-center cursor-pointer">
							<span>了解更多</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</a>
					</div>
				</div>
			</div>
		</section>
		<!-- 未来设计师联盟 -->
		<section id="talent-pool" class="py-20 bg-gradient-to-b from-gray-900 to-indigo-950">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">未来设计师联盟</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						打造设计师与企业的桥梁，连接全球设计资源与市场需求
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					<!-- 院校数据库 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg overflow-hidden">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
								<i class="fas fa-university"></i>
							</div>
							<h3 class="text-xl font-bold">院校数据库</h3>
						</div>
						<p class="text-gray-400 mb-6">
							收录全球500+设计院校资源，提供专业排名、师资力量与毕业生就业数据
						</p>
						<div class="grid grid-cols-4 gap-4">
							<div v-for="i in 8" :key="`school-${i}`"
								class="bg-gray-700 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
								<div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mb-2">
									<i class="fas fa-graduation-cap text-blue-400"></i>
								</div>
								<span class="text-xs text-center">院校 {{ i }}</span>
							</div>
						</div>
					</div>
					<!-- 学生作品库 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg overflow-hidden">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
								<i class="fas fa-palette"></i>
							</div>
							<h3 class="text-xl font-bold">学生作品库</h3>
						</div>
						<p class="text-gray-400 mb-6">
							展示新锐设计师作品，为企业提供新鲜创意与人才发掘渠道
						</p>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
							<div v-for="i in 6" :key="`work-${i}`" class="aspect-square rounded-lg overflow-hidden cursor-pointer">
								<img
									:src="`https://readdy.ai/api/search-image?query=Modern%20minimalist%20design%20portfolio%20piece%20with%20clean%20lines%20and%20bold%20colors%2C%20showcasing%20creative%20talent%20with%20professional%20finish%2C%20abstract%20design%20elements%20with%20geometric%20shapes%20on%20dark%20background&width=200&height=200&seq=work-${i}&orientation=squarish`"
									:alt="`学生作品${i}`"
									class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
							</div>
						</div>
					</div>
					<!-- 企业需求池 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg overflow-hidden">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center mr-4">
								<i class="fas fa-briefcase"></i>
							</div>
							<h3 class="text-xl font-bold">企业需求池</h3>
						</div>
						<p class="text-gray-400 mb-6">
							汇集各行业设计需求，智能分类与匹配，提供精准人才推荐
						</p>
						<div class="relative">
							<swiper :modules="swiperModules" :slides-per-view="1" :space-between="20"
								:pagination="{ clickable: true }" :autoplay="{ delay: 3000, disableOnInteraction: false }"
								class="w-full">
								<swiper-slide v-for="i in 5" :key="`demand-${i}`">
									<div
										class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
										<div class="flex justify-between items-start mb-3">
											<div>
												<h4 class="font-bold">{{ ['UI设计师', '平面设计师', '3D建模师', '动效设计师', '产品设计师'][i - 1] }}</h4>
												<p class="text-sm text-gray-400">{{ ['科技公司', '广告机构', '游戏工作室', '设计工作室', '互联网企业'][i - 1] }}</p>
											</div>
											<span class="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">{{ ['全职', '兼职', '项目制', '全职',
												'兼职'][i-1] }}</span>
										</div>
										<p class="text-sm text-gray-300 mb-3">
											{{ ['需要熟练掌握Figma、Sketch等工具，有3年以上经验', '精通Adobe系列软件，有品牌设计经验', '熟悉Maya、Blender等3D软件，有游戏角色设计经验',
											'熟悉After Effects，有交互动效设计经验', '有SaaS产品设计经验，熟悉设计系统'][i-1] }}
										</p>
										<div class="flex justify-between items-center">
											<div class="flex space-x-2">
												<span class="text-xs bg-gray-600 px-2 py-1 rounded">{{ ['北京', '上海', '广州', '深圳', '杭州'][i - 1]
													}}</span>
												<span class="text-xs bg-gray-600 px-2 py-1 rounded">{{ ['15-30k', '12-20k', '20-35k', '18-25k',
													'15-25k'][i-1] }}</span>
											</div>
											<button
												class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
												申请
											</button>
										</div>
									</div>
								</swiper-slide>
							</swiper>
						</div>
					</div>
					<!-- 设计师档案 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg overflow-hidden">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center mr-4">
								<i class="fas fa-id-card"></i>
							</div>
							<h3 class="text-xl font-bold">设计师档案</h3>
						</div>
						<p class="text-gray-400 mb-6">
							专业设计师能力评估与成长记录，展示项目经历与技能认证
						</p>
						<div class="grid grid-cols-2 gap-4">
							<div v-for="i in 4" :key="`designer-${i}`"
								class="bg-gray-700 rounded-lg p-4 flex hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
								<div class="w-16 h-16 rounded-full overflow-hidden mr-4">
									<img
										:src="`https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20creative%20designer%20with%20modern%20style%20against%20a%20simple%20dark%20background%2C%20looking%20confident%20and%20approachable%2C%20high%20quality%20studio%20lighting%20with%20soft%20shadows&width=100&height=100&seq=designer-${i}&orientation=squarish`"
										:alt="`设计师${i}`" class="w-full h-full object-cover" />
								</div>
								<div class="flex-1">
									<h4 class="font-bold text-sm">{{ ['张设计', '李创意', '王艺术', '刘视觉'][i - 1] }}</h4>
									<p class="text-xs text-gray-400 mb-2">{{ ['UI/UX设计师', '品牌设计师', '插画师', '交互设计师'][i - 1] }}</p>
									<div class="flex flex-wrap gap-1">
										<span v-for="(tag, index) in [
											['Figma', 'UI设计', '用户研究'],
											['品牌策略', 'Adobe', '排版'],
											['角色设计', '概念艺术', 'Procreate'],
											['动效设计', '原型设计', 'Principle']
										][i - 1]" :key="`tag-${i}-${index}`" class="text-xs bg-gray-600 px-2 py-0.5 rounded">
											{{ tag }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- AI资源池 -->
		<section id="ai-resources" class="py-20 bg-gradient-to-b from-indigo-950 to-gray-900">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">AI资源池</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						整合前沿AI设计工具与资源，赋能设计师创作
					</p>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- AI工具库 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
								<i class="fas fa-tools"></i>
							</div>
							<h3 class="text-xl font-bold">AI工具库</h3>
						</div>
						<p class="text-gray-400 mb-6">
							精选全球领先的AI设计工具，提供专业评测与使用指南
						</p>
						<div class="space-y-4">
							<div v-for="(tool, index) in [
								{ name: 'DeepSeek', icon: 'magic', desc: '基于大语言模型的设计助手，支持创意生成与设计优化' },
								{ name: 'GPT', icon: 'brain', desc: '智能文本生成工具，支持多风格设计文案创作' },
								{ name: 'Midjourney', icon: 'image', desc: '智能图像生成工具，支持多风格设计素材创作' },
								{ name: '即梦', icon: 'palette', desc: 'AI色彩方案生成工具，提供和谐配色建议' },
								{ name: 'MotionX', icon: 'film', desc: '智能动效生成工具，一键创建专业动画效果' }
							]" :key="`tool-${index}`"
								class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-300 cursor-pointer transform hover:scale-102 transition-transform">
								<div class="flex items-center">
									<div class="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
										<i :class="`fas fa-${tool.icon} text-purple-400`"></i>
									</div>
									<div class="flex-1">
										<h4 class="font-bold">{{ tool.name }}</h4>
										<p class="text-sm text-gray-400">{{ tool.desc }}</p>
									</div>
									<button class="text-purple-400 hover:text-purple-300 cursor-pointer whitespace-nowrap"
										@click="showAIToolMembership">
										<i class="fas fa-external-link-alt"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
					<!-- 行业资讯墙 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
								<i class="fas fa-newspaper"></i>
							</div>
							<h3 class="text-xl font-bold">行业资讯墙</h3>
						</div>
						<p class="text-gray-400 mb-6">
							实时更新AI设计领域前沿动态，分享行业趋势与创新案例
						</p>
						<div class="space-y-4">
							<div v-for="(news, index) in [
								{ title: 'Adobe发布新一代AI设计助手，提升创作效率', date: '2025-05-18', tag: '新品发布' },
								{ title: '全球AI设计大赛结果揭晓，中国团队获最佳创新奖', date: '2025-05-15', tag: '赛事' },
								{ title: '研究表明：AI辅助设计将在2026年覆盖80%设计工作', date: '2025-05-10', tag: '研究' },
								{ title: '顶尖设计工作室分享AI与人类设计师协作新模式', date: '2025-05-05', tag: '案例' },
								{ title: '设计教育革新：院校纷纷更新课程融入AI设计技能', date: '2025-05-01', tag: '教育' }
							]" :key="`news-${index}`"
								class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-300 cursor-pointer transform hover:translate-x-1 transition-transform">
								<div class="flex justify-between items-start mb-2">
									<span class="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">{{ news.tag }}</span>
									<span class="text-xs text-gray-400">{{ news.date }}</span>
								</div>
								<h4 class="font-bold text-sm mb-2">{{ news.title }}</h4>
								<div class="flex justify-end">
									<button class="text-xs text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap">
										阅读全文 <i class="fas fa-chevron-right ml-1"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
					<!-- 教学案例库 -->
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center mr-4">
								<i class="fas fa-book-open"></i>
							</div>
							<h3 class="text-xl font-bold">教学案例库</h3>
						</div>
						<p class="text-gray-400 mb-6">
							精选AI设计教程与实战案例，助力设计师掌握前沿技能
						</p>
						<div class="grid grid-cols-2 gap-4">
							<div v-for="i in 6" :key="`tutorial-${i}`"
								class="bg-gray-700 rounded-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform">
								<div class="aspect-video relative">
									<img
										:src="`https://readdy.ai/api/search-image?query=AI%20design%20tutorial%20screenshot%20showing%20professional%20interface%20with%20design%20tools%20and%20creative%20process%2C%20educational%20content%20with%20clean%20layout%20on%20dark%20theme%20interface&width=300&height=200&seq=tutorial-${i}&orientation=landscape`"
										:alt="`教程${i}`" class="w-full h-full object-cover" />
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
										<span class="text-xs text-white">{{ ['Midjourney进阶教程', 'AI辅助UI设计', '智能Logo生成', 'AI排版技巧', '设计提示词工程',
											'3D模型AI生成'][i-1] }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="mt-6 text-center">
							<a href="https://readdy.ai/home/7c294eae-594f-4864-9365-0de76452847b/8d0ded21-1cfb-421b-bee7-28a058a68c81"
								data-readdy="true" class="inline-block">
								<button
									class="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded-lg text-sm !rounded-button cursor-pointer whitespace-nowrap">
									查看更多教程 <i class="fas fa-arrow-right ml-1"></i>
								</button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 创意速配中心入口 -->
		<section id="task-system" class="py-20 bg-gradient-to-b from-gray-900 to-indigo-950">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">创意速配中心</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						智能匹配设计需求与人才，提供全流程任务管理与支付保障
					</p>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div class="order-2 lg:order-1">
						<div class="bg-gray-800 bg-opacity-50 rounded-xl p-8 shadow-xl">
							<h3
								class="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
								设计任务交易平台
							</h3>
							<p class="text-gray-300 mb-8">
								亿思AI设计联盟平台提供业内领先的创意速配中心，连接企业需求与设计人才，实现高效精准匹配。
								通过AI智能推荐、标准化流程与安全支付，为双方创造无忧的合作体验。
							</p>
							<div class="grid grid-cols-2 gap-6 mb-8">
								<div class="bg-gray-700 rounded-lg p-4 text-center">
									<div class="text-3xl font-bold text-blue-400 mb-2">5000+</div>
									<div class="text-sm text-gray-300">月活跃任务</div>
								</div>
								<div class="bg-gray-700 rounded-lg p-4 text-center">
									<div class="text-3xl font-bold text-purple-400 mb-2">98%</div>
									<div class="text-sm text-gray-300">满意度评分</div>
								</div>
								<div class="bg-gray-700 rounded-lg p-4 text-center">
									<div class="text-3xl font-bold text-cyan-400 mb-2">2小时</div>
									<div class="text-sm text-gray-300">平均响应时间</div>
								</div>
								<div class="bg-gray-700 rounded-lg p-4 text-center">
									<div class="text-3xl font-bold text-green-400 mb-2">100%</div>
									<div class="text-sm text-gray-300">资金安全保障</div>
								</div>
							</div>
							<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
								<a-button type="primary" size="large"
									class="!rounded-button bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
									@click="showTaskSystem">
									进入任务系统
								</a-button>
								<a-button size="large"
									class="!rounded-button bg-transparent border text-white border-purple-500 hover:bg-purple-900 transition-colors duration-300 cursor-pointer whitespace-nowrap">
									查看使用指南
								</a-button>
							</div>
						</div>
					</div>
					<div class="order-1 lg:order-2 flex justify-center">
						<img
							src="https://readdy.ai/api/search-image?query=Modern%20digital%20workspace%20showing%20professional%20design%20collaboration%20between%20AI%20and%20human%20designers%2C%20with%20flowing%20data%20visualization%2C%20project%20management%20interface%2C%20and%20payment%20system%20on%20dark%20themed%20UI%20with%20blue%20and%20purple%20accents%2C%20clean%20minimalist%20style&width=600&height=500&seq=task-system-img&orientation=landscape"
							alt="创意速配中心" class="w-full max-w-lg rounded-xl shadow-2xl" />
					</div>
				</div>
			</div>
		</section>
		<!-- AIGC驾驶舱 -->
		<section id="data-dashboard" class="py-20 bg-gradient-to-b from-indigo-950 to-gray-900">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">AIGC驾驶舱</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						可视化AI工具使用数据，洞察AIGC设计趋势与效率提升
					</p>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- AI工具使用分布图 -->
					<div
						class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg transform hover:scale-102 transition-transform">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-4">
								<i class="fas fa-robot"></i>
							</div>
							<h3 class="text-xl font-bold">AI工具使用分布图</h3>
						</div>
						<p class="text-gray-400 mb-6">
							展示各类AI工具的使用分布与应用场景分析，助力设计师选择合适工具
						</p>
						<div class="bg-gray-700 rounded-lg p-4 h-80">
							<div ref="talentMapChart" class="w-full h-full"></div>
						</div>
					</div>
					<!-- 工具使用排行榜 -->
					<div
						class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg transform hover:scale-102 transition-transform">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
								<i class="fas fa-chart-bar"></i>
							</div>
							<h3 class="text-xl font-bold">工具使用排行榜</h3>
						</div>
						<p class="text-gray-400 mb-6">
							追踪设计工具流行趋势，展示AI工具在设计领域的应用情况
						</p>
						<div class="bg-gray-700 rounded-lg p-4 h-80">
							<div ref="toolsRankingChart" class="w-full h-full"></div>
						</div>
					</div>
					<!-- 需求响应效率看板 -->
					<div
						class="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg transform hover:scale-102 transition-transform">
						<div class="flex items-center mb-6">
							<div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center mr-4">
								<i class="fas fa-tachometer-alt"></i>
							</div>
							<h3 class="text-xl font-bold">需求响应效率看板</h3>
						</div>
						<p class="text-gray-400 mb-6">
							监控平台任务响应速度与完成质量，优化匹配算法
						</p>
						<div class="bg-gray-700 rounded-lg p-4 h-80">
							<div ref="responseEfficiencyChart" class="w-full h-full"></div>
						</div>
					</div>
				</div>
				<div class="mt-12 text-center">
					<a-button type="primary" size="large"
						class="!rounded-button bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap"
						@click="showAIToolMembership">
						查看完整数据报告
					</a-button>
				</div>
			</div>
		</section>
		<!-- 合作伙伴 -->
		<section class="py-20 bg-gray-900">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold mb-4">合作伙伴</h2>
					<p class="text-gray-400 max-w-2xl mx-auto">
						与全球顶尖设计院校、企业与AI技术提供商深度合作
					</p>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					<div v-for="i in 6" :key="`partner-${i}`"
						class="bg-gray-800 bg-opacity-50 rounded-xl p-6 flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 cursor-pointer transform hover:scale-105 transition-transform">
						<div class="text-center">
							<div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
								<i
									:class="`fas fa-${['university', 'building', 'laptop-code', 'paint-brush', 'graduation-cap', 'robot'][i - 1]} text-3xl text-blue-400`"></i>
							</div>
							<span class="text-sm font-medium">{{ ['顶尖院校', '科技企业', '软件公司', '设计工作室', '教育机构', 'AI研究所'][i - 1] }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 加入我们 -->
		<section class="py-20 bg-gradient-to-b from-gray-900 to-indigo-950">
			<div class="container mx-auto px-6">
				<div class="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 shadow-2xl">
					<div class="flex flex-col md:flex-row items-center">
						<div class="md:w-1/2 mb-8 md:mb-0">
							<h2 class="text-3xl md:text-4xl font-bold mb-4">加入亿思AI设计联盟</h2>
							<p class="text-gray-300 mb-6">
								无论您是设计师、企业还是院校，加入我们的生态系统，共同探索AI与设计的无限可能
							</p>
							<div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
								<a-button type="primary" size="large"
									class="!rounded-button bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:opacity-90 transition-opacity duration-300 cursor-pointer whitespace-nowrap">
									立即注册
								</a-button>
								<a-button size="large"
									class="!rounded-button bg-transparent border text-white border-purple-500 hover:bg-purple-900 transition-colors duration-300 cursor-pointer whitespace-nowrap">
									了解更多
								</a-button>
							</div>
						</div>
						<div class="md:w-1/2 md:pl-8">
							<div class="grid grid-cols-2 gap-4">
								<div
									class="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
									<div class="text-3xl font-bold text-blue-400 mb-2">500+</div>
									<div class="text-sm text-gray-300">合作院校</div>
								</div>
								<div
									class="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
									<div class="text-3xl font-bold text-purple-400 mb-2">10,000+</div>
									<div class="text-sm text-gray-300">注册设计师</div>
								</div>
								<div
									class="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
									<div class="text-3xl font-bold text-cyan-400 mb-2">2,000+</div>
									<div class="text-sm text-gray-300">企业客户</div>
								</div>
								<div
									class="bg-gray-800 bg-opacity-50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
									<div class="text-3xl font-bold text-green-400 mb-2">50+</div>
									<div class="text-sm text-gray-300">AI工具集成</div>
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
						<h3 class="text-xl font-bold mb-4">亿思AI设计联盟平台</h3>
						<p class="text-gray-400 mb-4">
							连接设计师、AI与企业，打造全球领先的设计生态系统
						</p>
						<div class="flex space-x-4">
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weixin text-xl"></i>
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weibo text-xl"></i>
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-linkedin text-xl"></i>
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-instagram text-xl"></i>
							</a>
						</div>
					</div>
					<div>
						<h4 class="font-bold mb-4">快速链接</h4>
						<ul class="space-y-2">
							<li><a @click="scrollToSection('talent-pool')"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">未来设计师联盟</a></li>
							<li><a @click="scrollToSection('ai-resources')"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">AI资源池</a></li>
							<li><a @click="scrollToSection('task-system')"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">创意速配中心</a></li>
							<li><a @click="scrollToSection('data-dashboard')"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">AIGC驾驶舱</a></li>
						</ul>
					</div>
					<div>
						<h4 class="font-bold mb-4">关于我们</h4>
						<ul class="space-y-2">
							<li><a href="#"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">公司介绍</a></li>
							<li><a href="#"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">团队成员</a></li>
							<li><a href="#"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">加入我们</a></li>
							<li><a href="#"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">联系方式</a></li>
						</ul>
					</div>
					<div>
						<h4 class="font-bold mb-4">联系我们</h4>
						<ul class="space-y-2">
							<li class="flex items-center text-gray-400">
								<i class="fas fa-map-marker-alt mr-2"></i>
								<span>湖北省武汉市汉阳区绿地国博财富中心</span>
							</li>
							<li class="flex items-center text-gray-400">
								<i class="fas fa-phone mr-2"></i>
								<span>150-7240-0560</span>
							</li>
							<li class="flex items-center text-gray-400">
								<i class="fas fa-envelope mr-2"></i>
								<span>1151386302@qq.com</span>
							</li>
						</ul>
					</div>
				</div>
				<div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
					<div class="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; 2025 亿思AI设计联盟平台. 保留所有权利.
					</div>
					<div class="flex space-x-4">
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">隐私政策</a>
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">服务条款</a>
						<a href="#"
							class="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">Cookie 政策</a>
					</div>
				</div>
			</div>
		</footer>
		<!-- 创意速配中心弹窗 -->
		<a-modal v-model:visible="taskSystemVisible" :footer="null" width="90%" :bodyStyle="{ padding: '0' }"
			:maskClosable="false">
			<div class="bg-gray-900 text-white rounded-lg overflow-hidden">
				<!-- 任务系统头部 -->
				<div
					class="bg-gradient-to-r from-blue-900 to-purple-900 p-6 flex justify-between items-center relative overflow-hidden">
					<div class="absolute top-0 left-0 w-full h-full opacity-20">
						<div
							class="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/30 to-transparent transform -skew-x-12">
						</div>
						<div
							class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/30 to-transparent transform skew-x-12">
						</div>
					</div>
					<div class="flex items-center relative z-10">
						<i class="fas fa-exchange-alt text-2xl mr-4 text-blue-400"></i>
						<div>
							<div class="text-2xl font-bold">创意速配中心</div>
							<div class="text-sm text-gray-300 mt-1">智能匹配设计需求与人才</div>
						</div>
					</div>
					<button @click="taskSystemVisible = false"
						class="relative z-10 hover:bg-white/10 p-2 rounded-full transition-colors duration-300">
						<i class="fas fa-times text-xl"></i>
					</button>
				</div>
				<!-- 任务系统内容 -->
				<div class="p-6">
					<!-- 任务系统导航 -->
					<div class="mb-8 border-b border-gray-700 pb-4">
						<div class="flex space-x-6 overflow-x-auto">
							<button v-for="(tab, index) in taskSystemTabs" :key="`tab-${index}`"
								class="px-4 py-2 whitespace-nowrap cursor-pointer !rounded-button"
								:class="activeTaskTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
								@click="activeTaskTab = tab.id">
								<i :class="`fas fa-${tab.icon} mr-2`"></i>
								{{ tab.name }}
							</button>
						</div>
					</div>
					<!-- 任务系统内容区域 -->
					<div class="min-h-[600px]">
						<!-- 任务广场 -->
						<div v-if="activeTaskTab === 'marketplace'" class="animate-fadeIn">
							<div class="flex justify-between items-center mb-6">
								<h3 class="text-xl font-bold">任务广场</h3>
								<div class="flex space-x-4">
									<a-input-search placeholder="搜索任务" style="width: 250px" />
									<a-select style="width: 150px" placeholder="任务类型" :options="[
										{ value: 'all', label: '全部类型' },
										{ value: 'ui', label: 'UI/UX设计' },
										{ value: 'graphic', label: '平面设计' },
										{ value: '3d', label: '3D建模' }
									]" />
								</div>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div v-for="i in 6" :key="`task-${i}`"
									class="bg-gray-800 rounded-lg p-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
									<div class="flex justify-between items-start mb-3">
										<div>
											<h4 class="font-bold text-lg">{{ ['电商App界面设计', '企业品牌VI设计', '游戏角色3D建模', '教育平台UI设计', '产品宣传动画制作',
												'社交媒体海报设计'][i-1] }}</h4>
											<p class="text-sm text-gray-400">{{ ['科技公司', '广告机构', '游戏工作室', '教育机构', '互联网企业', '媒体公司'][i - 1] }}
											</p>
										</div>
										<span class="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">{{ ['紧急', '标准', '长期', '紧急', '标准',
											'长期'][i-1] }}</span>
									</div>
									<p class="text-sm text-gray-300 mb-4">
										{{ ['需要设计一套电商App的完整UI界面，包含首页、商品详情、购物车等页面', '设计企业完整的品牌视觉识别系统，包括logo、名片、办公用品等',
										'为游戏创建3D角色模型，包含贴图和动画骨骼', '设计在线教育平台的用户界面，注重用户体验和学习效率', '制作30秒产品宣传动画，展示产品特性和使用场景',
										'设计10张社交媒体宣传海报，风格统一，突出品牌特色'][i-1] }}
									</p>
									<div class="flex flex-wrap gap-2 mb-4">
										<span v-for="(tag, tagIndex) in [
											['UI设计', 'App界面', 'Figma'],
											['品牌设计', 'Logo', '企业VI'],
											['3D建模', '游戏角色', 'Blender'],
											['UI设计', '教育平台', '用户体验'],
											['动画制作', '产品宣传', 'After Effects'],
											['平面设计', '社交媒体', 'Photoshop']
										][i - 1]" :key="`task-tag-${i}-${tagIndex}`" class="text-xs bg-gray-700 px-2 py-1 rounded">
											{{ tag }}
										</span>
									</div>
									<div class="flex justify-between items-center">
										<div class="flex items-center">
											<i class="fas fa-clock text-gray-400 mr-1"></i>
											<span class="text-sm text-gray-400">{{ ['3天', '7天', '30天', '5天', '10天', '7天'][i - 1] }}</span>
											<span class="mx-2 text-gray-600">|</span>
											<i class="fas fa-yen-sign text-gray-400 mr-1"></i>
											<span class="text-sm text-gray-400">{{ ['¥8,000', '¥15,000', '¥20,000', '¥12,000', '¥18,000',
												'¥5,000'][i-1] }}</span>
										</div>
										<a-button type="primary" size="small" class="!rounded-button cursor-pointer whitespace-nowrap">
											申请接单
										</a-button>
									</div>
								</div>
							</div>
							<div class="mt-8 flex justify-center">
								<a-pagination :total="50" show-size-changer />
							</div>
						</div>
						<!-- 我的任务 -->
						<div v-else-if="activeTaskTab === 'my-tasks'" class="animate-fadeIn">
							<div class="flex justify-between items-center mb-6">
								<h3 class="text-xl font-bold">我的任务</h3>
								<a-radio-group v-model:value="myTasksFilter">
									<a-radio-button value="all">全部</a-radio-button>
									<a-radio-button value="in-progress">进行中</a-radio-button>
									<a-radio-button value="completed">已完成</a-radio-button>
								</a-radio-group>
							</div>
							<a-table :dataSource="myTasksData" :columns="myTasksColumns" :pagination="{ pageSize: 5 }"
								:rowKey="record => record.id">
								<template #bodyCell="{ column, record }">
									<template v-if="column.key === 'status'">
										<a-tag :color="record.status === '进行中' ? 'blue' : record.status === '已完成' ? 'green' : 'orange'">
											{{ record.status }}
										</a-tag>
									</template>
									<template v-if="column.key === 'action'">
										<div class="space-x-2">
											<a-button type="primary" size="small" class="!rounded-button cursor-pointer whitespace-nowrap">
												查看详情
											</a-button>
											<a-button v-if="record.status === '进行中'" size="small"
												class="!rounded-button cursor-pointer whitespace-nowrap">
												提交成果
											</a-button>
										</div>
									</template>
								</template>
							</a-table>
						</div>
						<!-- 智能匹配 -->
						<div v-else-if="activeTaskTab === 'matching'" class="animate-fadeIn">
							<div class="flex justify-between items-center mb-6">
								<h3 class="text-xl font-bold">智能匹配</h3>
								<a-button type="primary" class="!rounded-button cursor-pointer whitespace-nowrap">
									<i class="fas fa-sync-alt mr-2"></i>
									刷新推荐
								</a-button>
							</div>
							<div class="bg-gray-800 rounded-lg p-6 mb-8">
								<h4 class="font-bold mb-4">个人技能档案</h4>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h5 class="text-sm font-medium mb-2">技能评分</h5>
										<div class="space-y-3">
											<div v-for="(skill, index) in [
												{ name: 'UI/UX设计', score: 90 },
												{ name: '平面设计', score: 75 },
												{ name: '3D建模', score: 40 },
												{ name: '动效设计', score: 60 }
											]" :key="`skill-${index}`">
												<div class="flex justify-between mb-1">
													<span class="text-sm">{{ skill.name }}</span>
													<span class="text-sm">{{ skill.score }}%</span>
												</div>
												<div class="w-full bg-gray-700 rounded-full h-2">
													<div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
														:style="`width: ${skill.score}%`"></div>
												</div>
											</div>
										</div>
									</div>
									<div>
										<h5 class="text-sm font-medium mb-2">常用工具</h5>
										<div class="flex flex-wrap gap-2">
											<a-tag
												v-for="(tool, index) in ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Blender', 'Cinema 4D']"
												:key="`tool-${index}`" color="blue">
												{{ tool }}
											</a-tag>
										</div>
										<h5 class="text-sm font-medium mt-4 mb-2">偏好任务类型</h5>
										<div class="flex flex-wrap gap-2">
											<a-tag v-for="(type, index) in ['移动应用UI', '网站设计', '品牌设计', '图标设计', '插画']" :key="`type-${index}`"
												color="purple">
												{{ type }}
											</a-tag>
										</div>
									</div>
								</div>
							</div>
							<h4 class="font-bold mb-4">为您推荐的任务</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div v-for="i in 4" :key="`match-task-${i}`"
									class="bg-gray-800 rounded-lg p-5 hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
									<div class="flex justify-between items-start mb-3">
										<div>
											<h4 class="font-bold">{{ ['移动应用UI设计', '企业官网重设计', '产品图标设计', 'SaaS平台界面设计'][i - 1] }}</h4>
											<p class="text-sm text-gray-400">{{ ['科技初创公司', '制造业企业', '软件公司', '云服务提供商'][i - 1] }}</p>
										</div>
										<div class="flex items-center">
											<span class="text-sm font-medium text-green-400 mr-2">匹配度 {{ [95, 92, 88, 85][i - 1] }}%</span>
											<div class="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
												<i class="fas fa-check text-green-400"></i>
											</div>
										</div>
									</div>
									<p class="text-sm text-gray-300 mb-3">
										{{ ['设计一款健康追踪应用的用户界面，注重简洁易用', '重新设计企业官网，提升品牌形象和用户体验', '设计一套产品功能图标，风格统一且富有辨识度',
										'设计企业级SaaS平台的管理界面，注重数据可视化'][i-1]
										}}
									</p>
									<div class="flex justify-between items-center">
										<div class="flex items-center">
											<i class="fas fa-clock text-gray-400 mr-1"></i>
											<span class="text-sm text-gray-400">{{ ['5天', '10天', '7天', '15天'][i - 1] }}</span>
											<span class="mx-2 text-gray-600">|</span>
											<i class="fas fa-yen-sign text-gray-400 mr-1"></i>
											<span class="text-sm text-gray-400">{{ ['¥10,000', '¥15,000', '¥8,000', '¥20,000'][i - 1]
												}}</span>
										</div>
										<a-button type="primary" size="small" class="!rounded-button cursor-pointer whitespace-nowrap">
											立即申请
										</a-button>
									</div>
								</div>
							</div>
						</div>
						<!-- 支付中心 -->
						<div v-else-if="activeTaskTab === 'payment'" class="animate-fadeIn">
							<div class="flex justify-between items-center mb-6">
								<h3 class="text-xl font-bold">支付中心</h3>
								<div>
									<a-button class="mr-3 !rounded-button cursor-pointer whitespace-nowrap">
										<i class="fas fa-wallet mr-2"></i>
										充值
									</a-button>
									<a-button type="primary" class="!rounded-button cursor-pointer whitespace-nowrap">
										<i class="fas fa-credit-card mr-2"></i>
										提现
									</a-button>
								</div>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<div class="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
									<h4 class="text-sm mb-2">账户余额</h4>
									<div class="text-3xl font-bold mb-4">¥25,680.00</div>
									<div class="flex justify-between text-sm">
										<span>可提现金额</span>
										<span>¥20,680.00</span>
									</div>
								</div>
								<div class="bg-gray-800 rounded-lg p-6">
									<h4 class="text-sm mb-2">本月收入</h4>
									<div class="text-3xl font-bold text-green-400 mb-4">¥12,500.00</div>
									<div class="flex justify-between text-sm">
										<span>较上月</span>
										<span class="text-green-400">+15%</span>
									</div>
								</div>
								<div class="bg-gray-800 rounded-lg p-6">
									<h4 class="text-sm mb-2">待结算</h4>
									<div class="text-3xl font-bold text-yellow-400 mb-4">¥5,000.00</div>
									<div class="flex justify-between text-sm">
										<span>预计到账时间</span>
										<span>3天内</span>
									</div>
								</div>
							</div>
							<h4 class="font-bold mb-4">交易记录</h4>
							<a-table :dataSource="paymentRecords" :columns="paymentColumns" :pagination="{ pageSize: 5 }"
								:rowKey="record => record.id">
								<template #bodyCell="{ column, record }">
									<template v-if="column.key === 'amount'">
										<span :class="record.type === '收入' ? 'text-green-400' : 'text-red-400'">
											{{ record.type === '收入' ? '+' : '-' }}{{ record.amount }}
										</span>
									</template>
									<template v-if="column.key === 'status'">
										<a-tag :color="record.status === '已完成' ? 'green' : record.status === '处理中' ? 'blue' : 'orange'">
											{{ record.status }}
										</a-tag>
									</template>
								</template>
							</a-table>
						</div>
					</div>
				</div>
			</div>
		</a-modal>
		<!-- AI工具会员弹窗 -->
		<a-modal v-model:visible="aiToolMembershipVisible" :footer="null" width="800px" :bodyStyle="{ padding: '0' }"
			:maskClosable="false">
			<div class="bg-gray-900 text-white rounded-lg overflow-hidden">
				<!-- 会员头部 -->
				<div
					class="bg-gradient-to-r from-blue-900 to-purple-900 p-6 flex justify-between items-center relative overflow-hidden">
					<div class="absolute top-0 left-0 w-full h-full opacity-20">
						<div
							class="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/30 to-transparent transform rotate-12">
						</div>
						<div
							class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/30 to-transparent transform -rotate-12">
						</div>
					</div>
					<div class="flex items-center relative z-10">
						<i class="fas fa-crown text-2xl mr-4 text-yellow-400"></i>
						<div>
							<div class="text-2xl font-bold">AI工具会员服务</div>
							<div class="text-sm text-gray-300 mt-1">解锁全部高级功能与特权</div>
						</div>
					</div>
					<button @click="aiToolMembershipVisible = false"
						class="relative z-10 hover:bg-white/10 p-2 rounded-full transition-colors duration-300">
						<i class="fas fa-times text-xl"></i>
					</button>
				</div>
				<!-- 会员内容 -->
				<div class="p-6">
					<div class="text-center mb-12 mt-4">
						<h3
							class="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							解锁高级AI工具与数据分析</h3>
						<p class="text-gray-400 max-w-2xl mx-auto">
							成为会员，畅享DeepSeek、GPT、Midjourney、即梦等顶级AI工具，获取完整数据报告
						</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div
							class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-transparent hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/20">
							<div class="text-center mb-4">
								<h4 class="text-xl font-bold">基础会员</h4>
								<div class="text-3xl font-bold mt-2 mb-1">¥99<span class="text-sm text-gray-400">/月</span></div>
								<p class="text-sm text-gray-400">适合个人设计师</p>
							</div>
							<div class="space-y-3 mb-6">
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>DeepSeek基础版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>GPT基础版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>每月100次AI生成额度</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>基础数据报告</span>
								</div>
								<div class="flex items-center text-gray-500">
									<i class="fas fa-times mr-2"></i>
									<span>高级AI工具</span>
								</div>
							</div>
							<div class="text-center">
								<a-button type="primary" class="w-full !rounded-button cursor-pointer whitespace-nowrap">
									立即开通
								</a-button>
							</div>
						</div>
						<div
							class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500 transform scale-105 relative shadow-xl shadow-purple-500/20">
							<div
								class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
								最受欢迎
							</div>
							<div class="text-center mb-4">
								<h4 class="text-xl font-bold">专业会员</h4>
								<div class="text-3xl font-bold mt-2 mb-1">¥299<span class="text-sm text-gray-400">/月</span></div>
								<p class="text-sm text-gray-400">适合专业设计师</p>
							</div>
							<div class="space-y-3 mb-6">
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>DeepSeek专业版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>GPT专业版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>Midjourney基础版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>每月500次AI生成额度</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>完整数据报告</span>
								</div>
							</div>
							<div class="text-center">
								<a-button type="primary"
									class="w-full bg-gradient-to-r from-blue-500 to-purple-600 border-none !rounded-button cursor-pointer whitespace-nowrap">
									立即开通
								</a-button>
							</div>
						</div>
						<div
							class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-transparent hover:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/20">
							<div class="text-center mb-4">
								<h4 class="text-xl font-bold">企业会员</h4>
								<div class="text-3xl font-bold mt-2 mb-1">¥999<span class="text-sm text-gray-400">/月</span></div>
								<p class="text-sm text-gray-400">适合设计团队</p>
							</div>
							<div class="space-y-3 mb-6">
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>所有AI工具高级版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>即梦专业版</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>无限AI生成额度</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>定制数据分析</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-check text-green-400 mr-2"></i>
									<span>5个团队账号</span>
								</div>
							</div>
							<div class="text-center">
								<a-button type="primary" class="w-full !rounded-button cursor-pointer whitespace-nowrap">
									立即开通
								</a-button>
							</div>
						</div>
					</div>
					<div class="bg-gray-800 bg-opacity-50 rounded-xl p-6">
						<h4 class="font-bold mb-4">会员特权</h4>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="flex items-start">
								<div class="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mr-3 mt-1">
									<i class="fas fa-bolt text-blue-400"></i>
								</div>
								<div>
									<h5 class="font-medium mb-1">优先访问最新AI工具</h5>
									<p class="text-sm text-gray-400">第一时间体验最新发布的AI设计工具和功能</p>
								</div>
							</div>
							<div class="flex items-start">
								<div class="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3 mt-1">
									<i class="fas fa-chart-pie text-purple-400"></i>
								</div>
								<div>
									<h5 class="font-medium mb-1">高级数据分析</h5>
									<p class="text-sm text-gray-400">获取详细的行业趋势和人才流动分析报告</p>
								</div>
							</div>
							<div class="flex items-start">
								<div class="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center mr-3 mt-1">
									<i class="fas fa-graduation-cap text-green-400"></i>
								</div>
								<div>
									<h5 class="font-medium mb-1">专属培训资源</h5>
									<p class="text-sm text-gray-400">独家AI设计教程和专家指导课程</p>
								</div>
							</div>
							<div class="flex items-start">
								<div class="w-10 h-10 rounded-full bg-cyan-900 flex items-center justify-center mr-3 mt-1">
									<i class="fas fa-headset text-cyan-400"></i>
								</div>
								<div>
									<h5 class="font-medium mb-1">优先客户支持</h5>
									<p class="text-sm text-gray-400">专属客服团队，快速响应技术问题</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import { UserAvatar } from '@/components/common';

const router = useRouter();
const swiperModules = [Pagination, Autoplay];
const mobileMenuOpen = ref(false);
const talentMapChart = ref<HTMLElement | null>(null);
const toolsRankingChart = ref<HTMLElement | null>(null);
const responseEfficiencyChart = ref<HTMLElement | null>(null);
// 创意速配中心
const taskSystemVisible = ref(false);
const activeTaskTab = ref('marketplace');
const myTasksFilter = ref('all');
// AI工具会员弹窗
const aiToolMembershipVisible = ref(false);
const taskSystemTabs = [
	{ id: 'marketplace', name: '任务广场', icon: 'store' },
	{ id: 'my-tasks', name: '我的任务', icon: 'tasks' },
	{ id: 'matching', name: '智能匹配', icon: 'magic' },
	{ id: 'payment', name: '支付中心', icon: 'wallet' }
];
const myTasksData = [
	{ id: 1, name: '电商App界面设计', client: '科技公司A', deadline: '2025-05-25', amount: '¥8,000', status: '进行中' },
	{ id: 2, name: '企业品牌VI设计', client: '广告机构B', deadline: '2025-05-20', amount: '¥15,000', status: '已完成' },
	{ id: 3, name: '产品宣传海报设计', client: '互联网企业C', deadline: '2025-05-15', amount: '¥5,000', status: '已完成' },
	{ id: 4, name: '教育平台UI设计', client: '教育机构D', deadline: '2025-05-30', amount: '¥12,000', status: '进行中' },
	{ id: 5, name: '社交媒体图标设计', client: '媒体公司E', deadline: '2025-05-18', amount: '¥3,000', status: '待确认' }
];
const myTasksColumns = [
	{ title: '任务名称', dataIndex: 'name', key: 'name' },
	{ title: '客户', dataIndex: 'client', key: 'client' },
	{ title: '截止日期', dataIndex: 'deadline', key: 'deadline' },
	{ title: '金额', dataIndex: 'amount', key: 'amount' },
	{ title: '状态', dataIndex: 'status', key: 'status' },
	{ title: '操作', key: 'action' }
];
const paymentRecords = [
	{ id: 1, date: '2025-05-18', description: 'DeepSeek高级版订阅', amount: '¥299', type: '支出', status: '已完成' },
	{ id: 2, date: '2025-05-15', description: 'Midjourney图像生成', amount: '¥100', type: '支出', status: '已完成' },
	{ id: 3, date: '2025-05-10', description: 'GPT专业版续费', amount: '¥199', type: '支出', status: '已完成' },
	{ id: 4, date: '2025-05-05', description: '即梦AI工具包', amount: '¥399', type: '支出', status: '已完成' },
	{ id: 5, date: '2025-05-01', description: 'AI资源包充值', amount: '¥500', type: '支出', status: '处理中' }
];
const paymentColumns = [
	{ title: '日期', dataIndex: 'date', key: 'date' },
	{ title: '描述', dataIndex: 'description', key: 'description' },
	{ title: '金额', dataIndex: 'amount', key: 'amount' },
	{ title: '类型', dataIndex: 'type', key: 'type' },
	{ title: '状态', dataIndex: 'status', key: 'status' }
];
const toggleMobileMenu = () => {
	mobileMenuOpen.value = !mobileMenuOpen.value;
};
const showTaskSystem = () => {
	taskSystemVisible.value = true;
};
const showAIToolMembership = () => {
	aiToolMembershipVisible.value = true;
};
const navigateToLogin = () => {
	router.push('/login');
};
const navigateToRegist = () => {
	router.push('/regist');
};
// 登录状态
const authStore = useAuthStore();
const isLogin = computed(() => Boolean(authStore.token));
const scrollToSection = (id: string) => {
	const el = document.getElementById(id);
	if (el) {
		el.scrollIntoView({ behavior: 'smooth' });
	}
};
onMounted(() => {
	// AI工具使用分布图
	if (talentMapChart.value) {
		const chart = echarts.init(talentMapChart.value);
		const option = {
			animation: false,
			tooltip: {
				trigger: 'item',
				formatter: '{b}: {c}%'
			},
			series: [{
				name: 'AI工具使用分布',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: {
					show: true,
					color: '#fff',
					formatter: '{b}\n{c}%'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '16',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: true
				},
				data: [
					{ value: 35, name: '图像生成' },
					{ value: 25, name: '文本生成' },
					{ value: 20, name: '3D建模' },
					{ value: 15, name: '动效设计' },
					{ value: 5, name: '其他' }
				]
			}]
		};
		chart.setOption(option);
		window.addEventListener('resize', () => {
			chart.resize();
		});
	}
	// 工具使用排行榜
	if (toolsRankingChart.value) {
		const chart = echarts.init(toolsRankingChart.value);
		const option = {
			animation: false,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				axisLine: {
					lineStyle: {
						color: '#ccc'
					}
				},
				axisLabel: {
					color: '#ccc'
				}
			},
			yAxis: {
				type: 'category',
				data: ['Figma', 'Midjourney', 'Adobe Photoshop', 'DeepSeek', 'Sketch', 'GPT', 'Blender'],
				axisLine: {
					lineStyle: {
						color: '#ccc'
					}
				},
				axisLabel: {
					color: '#ccc'
				}
			},
			series: [
				{
					name: '使用人数',
					type: 'bar',
					data: [8500, 7200, 6800, 5900, 4500, 3800, 3200],
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
							{ offset: 0, color: '#7c4dff' },
							{ offset: 1, color: '#00bcd4' }
						])
					}
				}
			]
		};
		chart.setOption(option);
		window.addEventListener('resize', () => {
			chart.resize();
		});
	}
	// 需求响应效率看板
	if (responseEfficiencyChart.value) {
		const chart = echarts.init(responseEfficiencyChart.value);
		const option = {
			animation: false,
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['生成速度', '准确率', '用户满意度'],
				textStyle: {
					color: '#ccc'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['1月', '2月', '3月', '4月', '5月'],
				axisLine: {
					lineStyle: {
						color: '#ccc'
					}
				},
				axisLabel: {
					color: '#ccc'
				}
			},
			yAxis: {
				type: 'value',
				axisLine: {
					lineStyle: {
						color: '#ccc'
					}
				},
				axisLabel: {
					color: '#ccc'
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(255, 255, 255, 0.1)'
					}
				}
			},
			series: [
				{
					name: '生成速度',
					type: 'line',
					data: [2.5, 2.0, 1.8, 1.5, 1.2],
					itemStyle: {
						color: '#00bcd4'
					}
				},
				{
					name: '准确率',
					type: 'line',
					data: [85, 88, 90, 92, 95],
					itemStyle: {
						color: '#7c4dff'
					}
				},
				{
					name: '用户满意度',
					type: 'line',
					data: [88, 90, 92, 94, 96],
					itemStyle: {
						color: '#4caf50'
					}
				}
			]
		};
		chart.setOption(option);
		window.addEventListener('resize', () => {
			chart.resize();
		});
	}
});
</script>
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

/* 去除number输入框的箭头 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* 平滑滚动 */
html {
	scroll-behavior: smooth;
}

/* 确保页面最小高度 */
body {
	min-height: 1024px;
}

/* 确保图表容器正确显示 */
.echarts-container {
	width: 100%;
	height: 100%;
}

/* 动画效果 */
.animate-fadeIn {
	animation: fadeIn 0.5s ease-in-out;
}

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

/* 悬停缩放效果 */
.transform.hover\:scale-102:hover {
	transform: scale(1.02);
}

/* 悬停平移效果 */
.transform.hover\:translate-x-1:hover {
	transform: translateX(4px);
}

/* 覆盖全局段落样式 */
/* :deep(p) {
  margin-bottom: 0 !important;
} */
</style>
