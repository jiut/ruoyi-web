<template>
  <!-- 设计师详情抽屉 -->
  <div v-if="visible" class="fixed inset-0 drawer-overlay z-50" @click="closeDrawer">
    <div
      :class="[
        'drawer fixed top-0 right-0 h-full glass-card overflow-y-auto custom-scrollbar',
        visible ? 'drawer-open' : 'drawer-closed',
        isMobile ? 'w-full' : 'w-2/3 md:w-1/2'
      ]"
      @click.stop
    >
      <div class="p-6">
        <!-- 抽屉头部 -->
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold">设计师档案</h2>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
            @click="closeDrawer"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div v-if="designer">
          <!-- 基本信息区 -->
          <div class="flex items-start mb-8">
            <div class="w-24 h-24 rounded-full overflow-hidden mr-6 avatar-glow">
              <img
                v-if="designer.avatar"
                :src="designer.avatar"
                :alt="designer.designerName"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                :class="[
                  'w-full h-full flex items-center justify-center text-white text-3xl font-bold',
                  getAvatarGradient(designer.designerName)
                ]"
              >
                {{ getDesignerInitial(designer.designerName) }}
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-2xl font-bold mb-1">{{ designer.designerName }}</h3>
                  <p class="text-gray-400 mb-2">{{ getProfessionLabel(designer.profession) }} @ {{ designer.company || '自由职业' }}</p>
                  <div class="flex items-center text-sm mb-2">
                    <div v-if="designer.location" class="flex items-center mr-4">
                      <i class="ri-map-pin-line mr-1 text-gray-400"></i>
                      <span>{{ designer.location }}</span>
                    </div>
                    <div v-if="designer.experience" class="flex items-center mr-4">
                      <i class="ri-time-line mr-1 text-gray-400"></i>
                      <span>{{ designer.experience }} 年经验</span>
                    </div>
                    <div class="flex items-center">
                      <div
                        :class="[
                          'w-2 h-2 rounded-full mr-1',
                          getStatusColor(designer.workStatus)
                        ]"
                      />
                      <span>{{ getWorkStatusLabel(designer.workStatus) }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    class="neon-button px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    @click="contactDesigner"
                  >
                    联系我
                  </button>
                  <button
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                    @click="toggleFavorite"
                  >
                    <i class="ri-heart-line"></i>
                  </button>
                  <button
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                    @click="shareDesigner"
                  >
                    <i class="ri-share-line"></i>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="skill in getDesignerSkills(designer)"
                  :key="skill"
                  :class="[
                    'text-xs px-3 py-1 rounded-full border',
                    getSkillTagStyle(skill)
                  ]"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="glass-card rounded-lg p-6 mb-8">
            <h3 class="text-lg font-bold mb-4">个人简介</h3>
            <p class="text-gray-300 text-sm leading-relaxed">
              {{ getDesignerBio(designer) }}
            </p>
          </div>

          <!-- 作品集 -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold">作品集</h3>
              <div class="flex space-x-1 bg-gray-800/50 rounded-full p-1">
                <button
                  :class="[
                    'px-4 py-1 rounded-full text-xs',
                    currentTab === 'all' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30'
                  ]"
                  @click="currentTab = 'all'"
                >
                  全部
                </button>
                <button
                  :class="[
                    'px-4 py-1 rounded-full text-xs',
                    currentTab === 'ui' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30'
                  ]"
                  @click="currentTab = 'ui'"
                >
                  UI 设计
                </button>
                <button
                  :class="[
                    'px-4 py-1 rounded-full text-xs',
                    currentTab === 'interaction' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30'
                  ]"
                  @click="currentTab = 'interaction'"
                >
                  交互设计
                </button>
                <button
                  :class="[
                    'px-4 py-1 rounded-full text-xs',
                    currentTab === 'product' ? 'tab-active' : 'text-gray-300 hover:bg-gray-700/30'
                  ]"
                  @click="currentTab = 'product'"
                >
                  产品设计
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="work in portfolioWorks"
                :key="work.id"
                class="portfolio-item rounded-lg overflow-hidden cursor-pointer"
                @click="viewWork(work)"
              >
                <img
                  :src="work.imageUrl"
                  :alt="work.title"
                  class="w-full h-40 object-cover object-top"
                />
                <div class="p-3 bg-gray-900/80">
                  <h4 class="text-sm font-medium mb-1">{{ work.title }}</h4>
                  <p class="text-xs text-gray-400">{{ work.category }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-4">
              <button class="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700/30 transition-colors">
                查看全部作品 ({{ getDesignerWorksCount(designer.id) }})
              </button>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="glass-card rounded-lg p-6 mb-8">
            <h3 class="text-lg font-bold mb-4">工作经历</h3>
            <div class="relative pl-6 border-l border-gray-700">
              <!-- 工作经历项 1 -->
              <div class="mb-6 relative">
                <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-primary"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-base font-medium">{{ designer.company || '腾讯' }}</h4>
                    <p class="text-sm text-gray-400">高级 {{ getProfessionLabel(designer.profession) }}</p>
                  </div>
                  <span class="text-xs text-gray-400">2022年3月 - 至今</span>
                </div>
                <p class="text-sm text-gray-300">
                  负责腾讯社交产品的用户体验设计，主导产品界面改版与优化，建立设计规范与组件库。参与用户研究与需求分析，提出基于数据的设计解决方案。
                </p>
              </div>
              <!-- 工作经历项 2 -->
              <div class="mb-6 relative">
                <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-gray-600"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-base font-medium">字节跳动</h4>
                    <p class="text-sm text-gray-400">{{ getProfessionLabel(designer.profession) }}</p>
                  </div>
                  <span class="text-xs text-gray-400">2020年6月 - 2022年2月</span>
                </div>
                <p class="text-sm text-gray-300">
                  参与短视频应用的界面设计工作，负责功能迭代与视觉优化，协助建立设计规范。与产品和开发团队紧密合作，确保设计方案的顺利实现。
                </p>
              </div>
              <!-- 工作经历项 3 -->
              <div class="relative">
                <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-gray-600"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-base font-medium">网易</h4>
                    <p class="text-sm text-gray-400">初级 {{ getProfessionLabel(designer.profession) }}</p>
                  </div>
                  <span class="text-xs text-gray-400">2018年7月 - 2020年5月</span>
                </div>
                <p class="text-sm text-gray-300">
                  参与网易音乐产品的界面设计，负责日常界面优化与活动页面设计。学习并实践设计规范，提升用户界面的一致性与易用性。
                </p>
              </div>
            </div>
          </div>

          <!-- 教育背景 -->
          <div class="glass-card rounded-lg p-6 mb-8">
            <h3 class="text-lg font-bold mb-4">教育背景</h3>
            <div class="relative pl-6 border-l border-gray-700">
              <!-- 教育经历项 1 -->
              <div class="mb-6 relative">
                <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-blue-500"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-base font-medium">中国美术学院</h4>
                    <p class="text-sm text-gray-400">设计学 · 硕士</p>
                  </div>
                  <span class="text-xs text-gray-400">2015年9月 - 2018年6月</span>
                </div>
                <p class="text-sm text-gray-300">
                  专业方向：数字媒体艺术，研究方向：交互设计与用户体验
                </p>
              </div>
              <!-- 教育经历项 2 -->
              <div class="relative">
                <div class="absolute -left-[25px] w-5 h-5 rounded-full bg-gray-600"></div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-base font-medium">浙江大学</h4>
                    <p class="text-sm text-gray-400">工业设计 · 学士</p>
                  </div>
                  <span class="text-xs text-gray-400">2011年9月 - 2015年6月</span>
                </div>
                <p class="text-sm text-gray-300">
                  主修课程：设计基础、人机交互、产品设计、计算机辅助设计
                </p>
              </div>
            </div>
          </div>

          <!-- 获奖情况 -->
          <div class="glass-card rounded-lg p-6 mb-8">
            <h3 class="text-lg font-bold mb-4">获奖与认证</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500 mr-4">
                  <i class="ri-award-line ri-lg"></i>
                </div>
                <div>
                  <h4 class="text-base font-medium">2023 IF 设计奖</h4>
                  <p class="text-sm text-gray-400">腾讯社交产品界面设计</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 mr-4">
                  <i class="ri-verified-badge-line ri-lg"></i>
                </div>
                <div>
                  <h4 class="text-base font-medium">Google UX 设计专业认证</h4>
                  <p class="text-sm text-gray-400">2021年获得</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/20 text-green-500 mr-4">
                  <i class="ri-award-line ri-lg"></i>
                </div>
                <div>
                  <h4 class="text-base font-medium">2020 中国设计智造大奖 · 铜奖</h4>
                  <p class="text-sm text-gray-400">字节跳动短视频应用界面设计</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="glass-card rounded-lg p-6">
            <h3 class="text-lg font-bold mb-4">联系方式</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                  <i class="ri-mail-line ri-lg"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-400">邮箱</p>
                  <p class="text-sm">{{ designer.email || 'chenyu@example.com' }}</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                  <i class="ri-phone-line ri-lg"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-400">电话</p>
                  <p class="text-sm">{{ formatPhone(designer.phone || '13888888888') }}</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                  <i class="ri-wechat-line ri-lg"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-400">微信</p>
                  <p class="text-sm">{{ designer.wechat || designer.designerName.toLowerCase() + '_design' }}</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-300 mr-3">
                  <i class="ri-global-line ri-lg"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-400">个人网站</p>
                  <p class="text-sm">{{ designer.portfolio || 'www.' + designer.designerName.toLowerCase() + 'design.com' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex justify-center items-center h-64 text-gray-400">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Designer, Profession, WorkStatus } from '@/types/talent/designer'
interface Props {
  visible: boolean
  designer?: Designer | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  designer: null,
  loading: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  contact: [designer: Designer]
  favorite: [designer: Designer]
  share: [designer: Designer]
}>()

// 响应式状态
const isMobile = ref(false)
const currentTab = ref('all')

// 模拟作品数据
const portfolioWorks = [
  {
    id: 1,
    title: '社交媒体应用 UI 设计',
    category: '移动应用界面设计',
    imageUrl: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: '数据分析仪表盘',
    category: 'Web 应用界面设计',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: '电商应用产品页',
    category: '电子商务 UI 设计',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: '用户流程与线框图',
    category: 'UX 设计流程',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    title: '设计系统组件库',
    category: 'UI 组件设计',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    title: '应用引导流程设计',
    category: '用户体验设计',
    imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=300&fit=crop'
  }
]

// 设备检测
const checkDevice = () => {
  const screenWidth = window.innerWidth
  const userAgent = navigator.userAgent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  isMobile.value = screenWidth < 1024 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    (isTouchDevice && screenWidth < 1200)
}

// 方法
const closeDrawer = () => {
  emit('update:visible', false)
}

const getDesignerInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const getProfessionLabel = (profession: Profession) => {
  const professions = {
    'UI_UX_DESIGNER': 'UI/UX 设计师',
    'VISUAL_DESIGNER': '视觉设计师',
    'INTERACTION_DESIGNER': '交互设计师',
    'PRODUCT_DESIGNER': '产品设计师',
    'THREE_D_DESIGNER': '3D 设计师',
    'BRAND_DESIGNER': '品牌设计师'
  }
  return professions[profession] || profession
}

const getWorkStatusLabel = (status: WorkStatus) => {
  const statuses = {
    'EMPLOYED': '在职',
    'FREELANCER': '自由职业',
    'SEEKING': '求职中',
    'STUDENT': '学生'
  }
  return statuses[status] || '未知'
}

const getDesignerSkills = (designer: Designer) => {
  try {
    const skills = JSON.parse(designer.skillTags || '[]')
    return Array.isArray(skills) ? skills.slice(0, 5) : []
  } catch {
    return []
  }
}

const getDesignerBio = (designer: Designer) => {
  return designer.description || `拥有 ${designer.experience || 5} 年 ${getProfessionLabel(designer.profession)} 经验，专注于移动应用和 Web 产品的用户体验设计。擅长用户研究、交互设计和视觉设计，能够从用户需求出发，打造直观易用的产品界面。曾主导多个核心产品的设计工作，包括社交、游戏和企业应用等领域。热衷于设计系统构建，善于协调设计与开发团队的协作，确保设计方案的高效落地。`
}

const getDesignerWorksCount = (designerId: number) => {
  return portfolioWorks.length || 42
}

// 获取头像渐变样式
const getAvatarGradient = (name: string) => {
  const gradients = [
    'bg-gradient-to-br from-primary to-purple-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-pink-500 to-red-500',
    'bg-gradient-to-br from-blue-500 to-primary',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-orange-500',
    'bg-gradient-to-br from-cyan-500 to-blue-500'
  ]

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

// 获取技能标签样式
const getSkillTagStyle = (skill: string) => {
  const skillStyles: Record<string, string> = {
    'Figma': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Sketch': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Adobe XD': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Photoshop': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Illustrator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'After Effects': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Blender': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Cinema 4D': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '交互设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '用户研究': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '品牌设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '插画': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '动效': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '原型设计': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '用户体验': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '界面设计': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '设计系统': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '品牌标识': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '视觉识别': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Lottie': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '动画': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }

  return skillStyles[skill] || 'bg-blue-500/20 text-blue-400 border-blue-500/30'
}

// 获取工作状态颜色
const getStatusColor = (status: WorkStatus | undefined) => {
  const statusColors: Record<string, string> = {
    'EMPLOYED': 'bg-green-500',
    'FREELANCER': 'bg-blue-500',
    'SEEKING': 'bg-yellow-500',
    'STUDENT': 'bg-purple-500'
  }

  return statusColors[status || ''] || 'bg-gray-500'
}

const formatPhone = (phone: string) => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}

// 操作方法
const contactDesigner = () => {
  if (props.designer) {
    emit('contact', props.designer)
  }
}

const toggleFavorite = () => {
  if (props.designer) {
    emit('favorite', props.designer)
  }
}

const shareDesigner = () => {
  if (props.designer) {
    emit('share', props.designer)
  }
}

const viewWork = (work: any) => {
  console.log('查看作品:', work)
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 窗口大小变化时重新检查设备
const handleResize = () => {
  checkDevice()
}
</script>

<style scoped>
.drawer-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.drawer {
  transition: transform 0.3s ease-in-out;
}

.drawer-open {
  transform: translateX(0);
}

.drawer-closed {
  transform: translateX(100%);
}

.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.avatar-glow {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

.portfolio-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.portfolio-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.neon-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0a84ff, #bf5af2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.neon-button:hover::before {
  opacity: 0.2;
}

.neon-button:active {
  transform: scale(0.98);
}

.tab-active {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(28, 28, 30, 0.6);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(10, 132, 255, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(10, 132, 255, 0.7);
}
</style>
