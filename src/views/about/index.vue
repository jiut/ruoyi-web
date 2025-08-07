<!-- 亿思AI介绍页面 -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { UserAvatar } from '@/components/common'

const router = useRouter()
const mobileMenuOpen = ref(false)

// 联系方式悬浮按钮控制
const contactVisible = ref(false)
const contactExpanded = ref(false)

// 视频控制
const videoRef = ref<HTMLVideoElement>()
const aboutSectionRef = ref<HTMLElement>()
const observer = ref<IntersectionObserver>()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 切换联系方式悬浮按钮
const toggleContact = () => {
  contactExpanded.value = !contactExpanded.value
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

// 视频播放控制函数
const setupVideoObserver = () => {
  if (!aboutSectionRef.value || !videoRef.value) return

  // 监听视频播放结束事件
  videoRef.value.addEventListener('ended', () => {
    // 视频播放结束后暂停
    videoRef.value?.pause()
  })

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 元素进入视图
        if (videoRef.value) {
          // 如果视频已经播放结束，重置到开始位置
          if (videoRef.value.ended) {
            videoRef.value.currentTime = 0
          }
          // 播放视频（从当前位置继续或从头开始）
          videoRef.value.play()
        }
      } else {
        // 元素离开视图，暂停视频但保持当前位置
        videoRef.value?.pause()
      }
    })
  }, {
    threshold: 0.3 // 当30%的元素可见时触发
  })

  observer.value.observe(aboutSectionRef.value)
}

onMounted(() => {
  // 显示联系方式悬浮按钮
  contactVisible.value = true

  // 设置视频观察器
  setTimeout(() => {
    setupVideoObserver()
  }, 100)
})

onUnmounted(() => {
  // 清理观察器
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
	<div class="min-h-screen bg-white text-gray-900">
		<!-- 导航栏 -->
		<header class="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md shadow-sm">
			<div class="container mx-auto px-6 py-2 flex justify-between items-center">
				<div class="flex items-center cursor-pointer" @click="navigateToHome">
					<img src="/亿思logo.png" alt="亿思AI" class="h-10">
				</div>
				<div class="flex items-center space-x-8">
					<nav class="hidden md:flex space-x-8">
						<router-link to="/talent/schools"
							class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="探索全球设计人才资源，寻找合适的设计师或工作机会">
							星海人才
						</router-link>
						<router-link to="/ai-education"
							class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="探索AI设计教育课程与认证体系">
							AI教育
						</router-link>
						<router-link to="/aitools"
							class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="返回AI工具库首页，体验全球领先的AI设计工具">AI工具库</router-link>
						<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="获取行业资讯与教学案例" @click="scrollToSection('services')">公共资讯</a>
						<router-link to="/tasks"
							class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="发布或接取设计任务，智能匹配需求">智图工厂</router-link>
						<router-link to="/chat"
							class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap font-medium"
							title="智能对话">
							AIGC驾驶舱
						</router-link>
					</nav>
					<div class="flex items-center space-x-4">
						<template v-if="!isLogin">
							<a-button
								class="!rounded-button text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								title="登录您的账户，访问个性化服务" @click="navigateToLogin">
								登录
							</a-button>
							<a-button type="primary"
								class="!rounded-button bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								title="创建新账户，开启AI设计之旅" @click="navigateToRegist">
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
			<div v-if="mobileMenuOpen" class="md:hidden bg-white py-3 px-6 shadow-lg border-t border-gray-100">
				<div class="flex flex-col space-y-4">
					<router-link to="/talent/schools"
						class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="mobileMenuOpen = false">
						星海人才
					</router-link>
					<router-link to="/ai-education"
						class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="mobileMenuOpen = false">AI教育</router-link>
					<router-link to="/aitools"
						class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="mobileMenuOpen = false">AI工具库</router-link>
					<a class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="scrollToSection('services'); mobileMenuOpen = false">公共资讯</a>
					<router-link to="/tasks"
						class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="mobileMenuOpen = false">智图工厂</router-link>
					<router-link to="/chat"
						class="text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
						@click="mobileMenuOpen = false">AIGC驾驶舱</router-link>
				</div>
			</div>
		</header>

		<!-- Hero Section -->
		<section class="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"
			style="background-image: url('/339873464fbea6e51b5d24e482aca18d.jpg'); background-size: cover; background-position: center;">
			<div class="absolute inset-0 bg-white/60"></div>
			<div class="w-full max-w-7xl mx-auto px-6 relative z-10 -mt-8">
				<div class="grid lg:grid-cols-2 gap-8 items-center">
					<div class="space-y-2">
						<div class="space-y-2">
							<h1 class="text-5xl lg:text-7xl font-bold leading-tight mb-4 tracking-wider">
								亿思 <span class="text-primary">AI</span>
							</h1>
							<p class="text-3xl text-gray-600 leading-relaxed pb-6">
								AI 赋能·创新未来
							</p>
							<p class="text-lg text-gray-600 leading-8 max-w-3xl mt-4 mb-8">
								我们是连接设计与 AI 的生态桥梁，致力于构建设计师、AI 技术与企业需求之间的协作生态系统。
							</p>
						</div>
						<router-link to="/introduction" class="inline-block pt-1">
							<a-button type="primary" size="large"
								class="!rounded-button bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors duration-300 cursor-pointer whitespace-nowrap"
								:style="{ fontSize: '1.3rem', padding: '1.2rem 2.5rem', height: 'auto' }">
								探索平台
							</a-button>
						</router-link>
					</div>
				</div>
			</div>
		</section>

		<!-- 视频展示区域 -->
		<section class="relative py-20 bg-gray-900">
			<div class="max-w-7xl mx-auto px-6">
				<div class="text-center mb-12">
					<h2 class="text-4xl font-bold text-white mb-6">案例视频</h2>
					<p class="text-xl text-gray-300 max-w-3xl mx-auto">
						感受亿思AI如何赋能设计创作
					</p>
				</div>

				<div class="relative max-w-6xl mx-auto">
					<!-- 装饰性元素 - 移到视频容器外层 -->
					<div
						class="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl pointer-events-none">
					</div>
					<div
						class="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl pointer-events-none">
					</div>

					<!-- 视频容器 -->
					<div class="relative bg-black rounded-2xl shadow-2xl" style="overflow: visible;">
						<video class="w-full h-auto rounded-2xl" controls playsinline preload="metadata" allowfullscreen
							controlslist="nodownload" poster="">
							<source src="https://ensiai.oss-cn-wuhan-lr.aliyuncs.com/web/7%E6%9C%8831%E6%97%A5.mp4" type="video/mp4">
							您的浏览器不支持视频播放。
						</video>
					</div>
				</div>
			</div>
		</section>

		<!-- 关于我们 -->
		<section id="about" ref="aboutSectionRef" class="relative py-12 overflow-hidden">
			<!-- 视频背景 -->
			<video ref="videoRef" class="absolute inset-0 w-full h-full object-cover" muted playsinline preload="auto">
				<source
					src="https://ensiai.oss-cn-wuhan-lr.aliyuncs.com/web/%E9%AB%98%E5%93%81%E8%B4%A8_%E9%95%9C%E5%A4%B4%E6%B2%BF%E5%B7%A6%E5%89%8D%E6%96%B9%E7%9F%B3%E6%9D%BF%E8%B7%AF%E7%BC%93%E6%85%A2_%E7%8E%AF%E7%BB%95%E6%8E%A8%E8%BF%9B_%E5%B9%B6%E4%B8%8A%E5%8D%87_%E5%B1%95%E7%8E%B0%E5%9F%8E%E5%B8%82%E5%85%AC%E5%9B%AD%E7%9A%84%E8%9C%BF%E8%9C%92%E6%BA%AA%E6%B5%81.mp4"
					type="video/mp4">
			</video>

			<!-- 覆盖层确保文本可读性 -->
			<div class="absolute inset-0 bg-black/40"></div>

			<div class="max-w-7xl mx-auto px-6 relative z-10">
				<div class="py-8">
					<div class="space-y-12 w-full">
						<h2 class="text-4xl font-bold text-white text-center mb-8">关于我们</h2>
						<div class="space-y-8 text-center">
							<p class="text-xl text-gray-100 leading-relaxed max-w-6xl mx-auto">
								亿思 AI秉持"AI 赋能，创新未来"的理念，致力于构建全球领先的设计与人工智能融合生态系统。我们汇聚全球优质资源，整合前沿技术与创意人才，打造涵盖人才匹配、AI
								教育、智能工具应用、行业信息共享和创新任务交易的全链条数字化服务体系。
							</p>
							<p class="text-xl text-gray-100 leading-relaxed max-w-6xl mx-auto">
								我们的使命是成为设计领域与 AI 技术深度融合的领先连接者和推动者，为全球设计师、创新企业、教育机构和技术开发者提供协同创新的专业服务平台，共同开创设计行业的智能化未来。
							</p>
							<!-- <div class="flex justify-center items-center space-x-8 pt-4">
								<div class="flex items-center space-x-2">
									<div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
									<span class="text-gray-600 font-medium">AI 驱动创新</span>
								</div>
								<div class="w-px h-6 bg-gray-300"></div>
								<div class="flex items-center space-x-2">
									<div class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
									<span class="text-gray-600 font-medium">全球资源连接</span>
								</div>
								<div class="w-px h-6 bg-gray-300"></div>
								<div class="flex items-center space-x-2">
									<div class="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
									<span class="text-gray-600 font-medium">协作生态构建</span>
								</div>
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 我们的工作 -->
		<section class="py-20 relative overflow-hidden">
			<!-- 高级背景层 -->
			<div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30"></div>
			<div class="absolute inset-0">
				<div
					class="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl">
				</div>
				<div
					class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl">
				</div>
			</div>

			<div class="max-w-7xl mx-auto px-6 relative">
				<!-- 标题区域 -->
				<div class="text-center mb-16">
					<div class="relative inline-block mb-8">
						<h2
							class="text-4xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
							我们的工作
						</h2>
						<div
							class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full">
						</div>
					</div>
					<p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						我们专注于三个核心领域，<span
							class="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">架起设计与人工智能之间的桥梁</span>
					</p>
				</div>

				<!-- 核心内容区 -->
				<div class="relative">
					<!-- 内容网格 -->
					<div class="grid lg:grid-cols-3 gap-12 lg:gap-16">
						<!-- AI 赋能卡片 -->
						<div class="group relative">
							<!-- 卡片背景光晕 -->
							<div
								class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700">
							</div>
							<div
								class="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-70 transition-all duration-700">
							</div>

							<!-- 卡片主体 -->
							<div
								class="relative bg-white/80 backdrop-blur-lg rounded-2xl p-10 shadow-xl border border-white/50 transition-all duration-700 group-hover:translate-y-[-8px] group-hover:scale-[1.02] group-hover:shadow-2xl">
								<!-- 图标容器 -->
								<div class="relative mb-8">
									<div
										class="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
										<i class="fas fa-brain text-4xl text-white"></i>
									</div>
									<!-- 图标装饰 -->
									<div
										class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
									</div>
									<div
										class="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
									</div>
								</div>

								<h3
									class="text-2xl font-bold mb-6 text-gray-900 group-hover:text-blue-700 transition-colors duration-500">
									AI 赋能</h3>
								<p
									class="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
									利用前沿 AI 技术提升创意工作流程和设计能力，<span class="font-semibold text-blue-600">释放无限创意潜能</span>
								</p>

								<!-- 底部装饰线 -->
								<div
									class="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700 group-hover:w-full">
								</div>
							</div>
						</div>

						<!-- 生态协同卡片 -->
						<div class="group relative">
							<!-- 卡片背景光晕 -->
							<div
								class="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700">
							</div>
							<div
								class="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-70 transition-all duration-700">
							</div>

							<!-- 卡片主体 -->
							<div
								class="relative bg-white/80 backdrop-blur-lg rounded-2xl p-10 shadow-xl border border-white/50 transition-all duration-700 group-hover:translate-y-[-8px] group-hover:scale-[1.02] group-hover:shadow-2xl">
								<!-- 图标容器 -->
								<div class="relative mb-8">
									<div
										class="w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
										<i class="fas fa-link text-4xl text-white"></i>
									</div>
									<!-- 图标装饰 -->
									<div
										class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
									</div>
									<div
										class="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
									</div>
								</div>

								<h3
									class="text-2xl font-bold mb-6 text-gray-900 group-hover:text-purple-700 transition-colors duration-500">
									生态协同</h3>
								<p
									class="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
									在统一平台上连接全球设计人才、AI 工具和企业需求，<span class="font-semibold text-purple-600">构建协作生态</span>
								</p>

								<!-- 底部装饰线 -->
								<div
									class="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 group-hover:w-full">
								</div>
							</div>
						</div>

						<!-- 创新促进卡片 -->
						<div class="group relative">
							<!-- 卡片背景光晕 -->
							<div
								class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700">
							</div>
							<div
								class="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-70 transition-all duration-700">
							</div>

							<!-- 卡片主体 -->
							<div
								class="relative bg-white/80 backdrop-blur-lg rounded-2xl p-10 shadow-xl border border-white/50 transition-all duration-700 group-hover:translate-y-[-8px] group-hover:scale-[1.02] group-hover:shadow-2xl">
								<!-- 图标容器 -->
								<div class="relative mb-8">
									<div
										class="w-24 h-24 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
										<i class="fas fa-lightbulb text-4xl text-white"></i>
									</div>
									<!-- 图标装饰 -->
									<div
										class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
									</div>
									<div
										class="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
									</div>
								</div>

								<h3
									class="text-2xl font-bold mb-6 text-gray-900 group-hover:text-emerald-700 transition-colors duration-500">
									创新促进</h3>
								<p
									class="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
									通过教育、工具和社区建设促进协作与创新，<span class="font-semibold text-emerald-600">推动行业进步</span>
								</p>

								<!-- 底部装饰线 -->
								<div
									class="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 group-hover:w-full">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 核心服务 -->
		<section id="services" class="py-20 bg-white">
			<div class="max-w-7xl mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-4xl font-bold mb-4 text-gray-900">核心服务</h2>
					<p class="text-xl text-gray-600 max-w-3xl mx-auto">
						五大协同模块，服务您的设计与 AI 全程旅程
					</p>
				</div>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
					<router-link to="/talent/schools"
						class="bg-gray-50 p-6 rounded-xl text-center card-hover transition-all duration-300 transform hover:-translate-y-1">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<i class="fas fa-users text-xl text-blue-600"></i>
						</div>
						<h3 class="font-semibold mb-2">星海人才</h3>
						<p class="text-sm text-gray-600">人才匹配</p>
					</router-link>
					<router-link to="/ai-education"
						class="bg-gray-50 p-6 rounded-xl text-center card-hover transition-all duration-300 transform hover:-translate-y-1">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<i class="fas fa-graduation-cap text-xl text-purple-600"></i>
						</div>
						<h3 class="font-semibold mb-2">AI 教育</h3>
						<p class="text-sm text-gray-600">学习平台</p>
					</router-link>
					<router-link to="/aitools"
						class="bg-gray-50 p-6 rounded-xl text-center card-hover transition-all duration-300 transform hover:-translate-y-1">
						<div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<i class="fas fa-tools text-xl text-emerald-600"></i>
						</div>
						<h3 class="font-semibold mb-2">AI 工具库</h3>
						<p class="text-sm text-gray-600">设计工具</p>
					</router-link>
					<a @click="scrollToSection('contact')"
						class="bg-gray-50 p-6 rounded-xl text-center card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
						<div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<i class="fas fa-newspaper text-xl text-amber-600"></i>
						</div>
						<h3 class="font-semibold mb-2">公共信息</h3>
						<p class="text-sm text-gray-600">行业洞察</p>
					</a>
					<router-link to="/tasks"
						class="bg-gray-50 p-6 rounded-xl text-center card-hover transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
						<div class="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4">
							<i class="fas fa-exchange-alt text-xl text-rose-600"></i>
						</div>
						<h3 class="font-semibold mb-2">智图工厂</h3>
						<p class="text-sm text-gray-600">任务交易</p>
					</router-link>
				</div>
			</div>
		</section>

		<!-- 合作伙伴 -->
		<section class="py-20 bg-gray-50">
			<div class="container mx-auto px-6">
				<div class="text-center mb-16">
					<h2 class="text-4xl font-bold mb-4 text-gray-900">
						合作伙伴
					</h2>
					<p class="text-xl text-gray-600 max-w-2xl mx-auto">
						与全球顶尖设计院校、企业与AI技术提供商深度合作
					</p>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					<div v-for="i in 6" :key="`partner-${i}`"
						class="bg-white rounded-xl p-6 flex items-center justify-center hover:bg-blue-50 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 shadow-md">
						<div class="text-center">
							<div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
								<i
									:class="`fas fa-${['university', 'building', 'home', 'paint-brush', 'graduation-cap', 'robot'][i - 1]} text-3xl text-blue-600`" />
							</div>
							<span class="text-sm font-medium text-gray-900">{{ ['顶尖院校', '科技企业', '建筑公司', '设计公司', '教育机构', 'AI研究所'][i -
								1] }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 联系我们 -->
		<section id="contact" class="py-12 bg-gradient-to-r from-purple-600 to-blue-600">
			<div class="container mx-auto px-6">
				<div class="p-6 md:p-8">
					<div class="text-center">
						<h2 class="text-4xl font-bold mb-6 text-white">联系我们</h2>
						<p class="text-xl text-white/90">
							准备好探索 AI 与设计的无限可能了吗？
						</p>
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
							亿思AI
						</h3>
						<p class="text-gray-400 mb-4">
							连接设计师、AI与企业，打造全球领先的设计生态系统
						</p>
						<div class="flex space-x-4">
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weixin text-xl" />
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-weibo text-xl" />
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-linkedin text-xl" />
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
								<i class="fab fa-instagram text-xl" />
							</a>
						</div>
					</div>
					<div>
						<h4 class="font-bold mb-4 text-white">
							快速链接
						</h4>
						<ul class="space-y-2">
							<li>
								<router-link to="/talent/schools"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
									星海人才
								</router-link>
							</li>
							<li>
								<router-link to="/ai-education"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">AI教育</router-link>
							</li>
							<li>
								<router-link to="/aitools"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
									AI工具库
								</router-link>
							</li>
							<li>
								<a class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
									@click="scrollToSection('services')">公共资讯</a>
							</li>
							<li>
								<router-link to="/tasks"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
									智图工厂
								</router-link>
							</li>
							<li>
								<router-link to="/chat"
									class="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">AIGC驾驶舱</router-link>
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
						&copy; 2025 亿思（湖北省）科技有限公司. 保留所有权利
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
			<button @click="toggleContact"
				class="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
				:class="{ 'rotate-45': contactExpanded }">
				<i class="fab fa-weixin text-2xl" />
			</button>
		</div>
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

/* 卡片悬停效果 */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
}

/* 主色定义 */
.text-primary {
  color: #3B82F6;
}

.bg-primary {
  background-color: #3B82F6;
}

/* 联系方式悬浮按钮动画 */
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

/* 确保卡片点击区域完整 */
.card-hover {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card-hover:hover {
  text-decoration: none;
  color: inherit;
}
</style>
