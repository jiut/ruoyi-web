<template>
  <!-- 统一顶栏组件 -->
  <header class="glass-card fixed top-0 left-0 right-0 z-50 py-0">
    <div class="container mx-auto px-2 md:px-4">
      <div class="flex items-center justify-between h-16">
        <!-- 左侧：导航和面包屑 -->
        <div class="flex items-center space-x-4">
          <!-- 返回按钮 -->
          <button
            @click="goBack"
            class="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
          >
            <i class="ri-arrow-left-line ri-lg mr-2"></i>
            <span class="hidden sm:inline">返回</span>
          </button>

          <!-- 分隔线 -->
          <div class="h-4 w-px bg-gray-700 hidden sm:block"></div>

          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <h1 class="text-xl font-bold gradient-text font-['Pacifico'] hidden sm:block mb-0">星海人才</h1>
            <h1 class="text-lg font-bold gradient-text font-['Pacifico'] sm:hidden mb-0">星海</h1>
          </router-link>

          <!-- 面包屑导航 -->
          <nav class="hidden md:flex items-center space-x-2 text-sm">
            <router-link to="/" class="text-gray-400 hover:text-blue-400 transition-colors">首页</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="text-white">{{ currentPageTitle }}</span>
          </nav>
        </div>

        <!-- 中间：主导航菜单 -->
        <nav class="hidden lg:flex items-center space-x-6">
          <router-link
            to="/talent/schools"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            active-class="active"
          >
            院校数据库
          </router-link>
          <router-link
            to="/talent/works"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            active-class="active"
          >
            学生作品库
          </router-link>
          <router-link
            to="/talent/jobs"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            active-class="active"
          >
            企业需求池
          </router-link>
          <router-link
            to="/talent/designers"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            active-class="active"
          >
            设计师档案
          </router-link>
        </nav>

        <!-- 右侧：搜索和用户功能 -->
        <div class="flex items-center space-x-3">
          <!-- 搜索框 -->
          <div class="relative hidden md:block">
            <div class="search-input flex items-center rounded-lg overflow-hidden">
              <input
                type="text"
                v-model="searchQuery"
                @keypress.enter="handleSearch"
                placeholder="搜索职位、公司、技能..."
                class="w-64 py-2 px-4 bg-transparent text-white border-none focus:outline-none text-sm"
              >
              <button
                @click="handleSearch"
                class="w-10 h-10 flex items-center justify-center text-blue-400"
              >
                <i class="ri-search-line"></i>
              </button>
            </div>
          </div>

                    <!-- 移动端搜索按钮 -->
          <button
            @click="toggleMobileSearch"
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 md:hidden"
          >
            <i class="ri-search-line"></i>
          </button>

          <!-- 通知 -->
          <div class="relative" ref="notificationRef">
            <button
              @click="toggleNotifications"
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
                          >
                <i class="ri-notification-3-line"></i>
                <!-- 未读消息小红点 -->
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white"
                  style="font-size: 10px;"
                >
                  {{ unreadCount }}
                </span>
              </button>

            <!-- 通知下拉菜单 -->
            <div
              v-show="showNotifications"
              class="dropdown-menu rounded-lg mt-2 right-0 w-80"
            >
              <div class="p-4 border-b border-gray-700">
                <h3 class="text-lg font-medium">通知中心</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800"
                >
                  <div class="flex items-start">
                    <div
                      class="w-2 h-2 rounded-full mt-2 mr-3"
                      :class="notification.dotColor"
                    ></div>
                    <div>
                      <p class="text-sm">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-3 border-t border-gray-700 text-center">
                <router-link to="/notifications" class="text-sm text-blue-400 hover:text-blue-300">
                  查看所有通知
                </router-link>
              </div>
            </div>
          </div>

          <!-- 用户菜单 -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {{ userName.charAt(0) }}
              </div>
              <span class="hidden xl:inline text-white text-sm">{{ userName }}</span>
              <i class="ri-arrow-down-s-line text-gray-400 hidden xl:block"></i>
            </button>

            <!-- 用户下拉菜单 -->
            <div
              v-show="showUserMenu"
              class="dropdown-menu rounded-lg mt-2 right-0 w-48"
            >
              <div class="p-3 border-b border-gray-700">
                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                    {{ userName.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium">{{ userName }}</p>
                    <p class="text-xs text-gray-400">{{ userRole }}</p>
                  </div>
                </div>
              </div>
              <div class="py-2">
                <router-link to="/profile" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                  <i class="ri-user-line mr-3"></i>
                  个人资料
                </router-link>
                <router-link to="/settings" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                  <i class="ri-settings-3-line mr-3"></i>
                  账户设置
                </router-link>
                <router-link to="/favorites" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                  <i class="ri-bookmark-line mr-3"></i>
                  我的收藏
                </router-link>
                <div class="border-t border-gray-700 mt-2"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50 text-red-400 w-full text-left"
                >
                  <i class="ri-logout-box-line mr-3"></i>
                  退出登录
                </button>
              </div>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 lg:hidden"
          >
            <i class="ri-menu-line"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端搜索栏 -->
    <div
      v-show="showMobileSearch"
      class="border-t border-gray-800 p-4 md:hidden"
    >
      <div class="search-input flex items-center rounded-lg overflow-hidden">
        <input
          type="text"
          v-model="mobileSearchQuery"
          @keypress.enter="handleMobileSearch"
          placeholder="搜索职位、公司、技能..."
          class="w-full py-2 px-4 bg-transparent text-white border-none focus:outline-none text-sm"
        >
        <button
          @click="handleMobileSearch"
          class="w-10 h-10 flex items-center justify-center text-blue-400"
        >
          <i class="ri-search-line"></i>
        </button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <div
      v-show="showMobileMenu"
      class="border-t border-gray-800 p-4 lg:hidden"
    >
      <nav class="flex flex-col space-y-2">
        <router-link
          to="/talent/schools"
          class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
          active-class="active"
        >
          院校数据库
        </router-link>
        <router-link
          to="/talent/works"
          class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
          active-class="active"
        >
          学生作品库
        </router-link>
        <router-link
          to="/talent/jobs"
          class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
          active-class="active"
        >
          企业需求池
        </router-link>
        <router-link
          to="/talent/designers"
          class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
          active-class="active"
        >
          设计师档案
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 响应式数据
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showMobileSearch = ref(false)
const showMobileMenu = ref(false)

// 用户信息
const userName = ref('张小明')
const userRole = ref('求职者')
const unreadCount = ref(3)

// 引用
const notificationRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)

// 通知数据
const notifications = ref([
  {
    id: 1,
    message: '腾讯发布新的UI设计师职位',
    time: '2分钟前',
    dotColor: 'bg-blue-600'
  },
  {
    id: 2,
    message: '您的简历被字节跳动查看',
    time: '1小时前',
    dotColor: 'bg-green-500'
  },
  {
    id: 3,
    message: '有3个新的职位匹配您的技能',
    time: '3小时前',
    dotColor: 'bg-yellow-500'
  }
])

// 计算属性
const currentPageTitle = computed(() => {
  const routeMap: Record<string, string> = {
    '/talent/jobs': '企业需求池',
    '/talent/designers': '设计师档案',
    '/talent/works': '学生作品库',
    '/talent/schools': '院校数据库'
  }
  return routeMap[route.path] || '人才平台'
})

// 方法
const goBack = () => {
  router.go(-1)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 这里可以添加搜索逻辑
  }
}

const handleMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    console.log('移动端搜索:', mobileSearchQuery.value)
    // 这里可以添加搜索逻辑
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showMobileSearch.value = false
}

const handleLogout = () => {
  // 这里添加退出登录逻辑
  console.log('退出登录')
  router.push('/login')
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (notificationRef.value && !(notificationRef.value as HTMLElement).contains(target)) {
    showNotifications.value = false
  }
  if (userMenuRef.value && !(userMenuRef.value as HTMLElement).contains(target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 覆盖全局样式，确保header在手机端适当的padding，并且没有margin */
@media (max-width: 768px) {
  .glass-card {
    padding: 0.25rem 1rem !important;
    margin: 0 !important;
  }
}

.search-input {
  background: rgba(28, 28, 30, 0.8);
  border: 1px solid rgba(99, 99, 102, 0.2);
}

.search-input:focus-within {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-button {
  transition: all 0.2s ease;
  border-radius: 16px;
}

.nav-button:hover {
  background: rgba(10, 132, 255, 0.1);
  color: #0a84ff;
}

.nav-button.active {
  background: rgba(10, 132, 255, 0.2);
  color: #0a84ff;
}

.dropdown-menu {
  position: absolute;
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 50;
}

.breadcrumb-separator {
  color: rgba(148, 163, 184, 0.5);
}

/* 过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
