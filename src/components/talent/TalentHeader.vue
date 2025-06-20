<template>
  <header class="glass-card sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- 左侧：导航和面包屑 -->
        <div class="flex items-center space-x-4">
          <!-- 返回按钮 -->
          <router-link
            to="/"
            class="flex items-center text-gray-300 hover:text-primary transition-colors"
          >
            <i class="ri-arrow-left-line ri-lg mr-2"></i>
            <span class="hidden sm:inline">返回</span>
          </router-link>

          <!-- 分隔线 -->
          <div class="h-4 w-px bg-gray-700 hidden sm:block"></div>

          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <h1 class="text-xl font-bold gradient-text font-['Pacifico'] hidden sm:block">星海人才</h1>
            <h1 class="text-lg font-bold gradient-text font-['Pacifico'] sm:hidden">星海</h1>
          </router-link>

          <!-- 面包屑导航 -->
          <nav class="hidden md:flex items-center space-x-2 text-sm">
            <router-link to="/" class="text-gray-400 hover:text-primary transition-colors">首页</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="text-white">{{ currentPageTitle }}</span>
          </nav>
        </div>

        <!-- 中间：主导航菜单 -->
        <nav class="hidden lg:flex items-center space-x-6">
          <router-link
            to="/talent/schools"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            :class="{ active: $route.path.includes('/talent/schools') }"
          >
            院校数据库
          </router-link>
          <router-link
            to="/talent/works"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            :class="{ active: $route.path.includes('/talent/works') }"
          >
            学生作品库
          </router-link>
          <router-link
            to="/talent/jobs"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            :class="{ active: $route.path.includes('/talent/jobs') }"
          >
            企业需求池
          </router-link>
          <router-link
            to="/talent/designers"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            :class="{ active: $route.path.includes('/talent/designers') }"
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
                :placeholder="searchPlaceholder"
                class="w-64 py-2 px-4 bg-transparent text-white border-none focus:outline-none text-sm"
                v-model="searchQuery"
                @keypress.enter="handleSearch"
              >
              <button
                class="w-10 h-10 flex items-center justify-center text-primary"
                @click="handleSearch"
              >
                <i class="ri-search-line"></i>
              </button>
            </div>
          </div>

          <!-- 移动端搜索按钮 -->
          <button
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 md:hidden"
            @click="toggleMobileSearch"
          >
            <i class="ri-search-line"></i>
          </button>

          <!-- 通知 -->
          <div class="relative">
            <button
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
              @click="toggleNotification"
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
            <transition name="dropdown">
              <div
                v-if="showNotification"
                class="dropdown-menu rounded-lg mt-2 right-0 w-80"
                @click.stop
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
                        :class="notification.read ? 'bg-gray-500' : 'bg-primary'"
                      ></div>
                      <div>
                        <p class="text-sm">{{ notification.content }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-3 border-t border-gray-700 text-center">
                  <a href="/notifications" class="text-sm text-primary hover:text-primary/80">查看所有通知</a>
                </div>
              </div>
            </transition>
          </div>

          <!-- 用户菜单 -->
          <div class="relative">
            <button
              class="flex items-center space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
              @click="toggleUserMenu"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {{ userInitial }}
              </div>
              <span class="hidden xl:inline text-white text-sm">{{ userName }}</span>
              <i class="ri-arrow-down-s-line text-gray-400 hidden xl:block"></i>
            </button>

            <!-- 用户下拉菜单 -->
            <transition name="dropdown">
              <div
                v-if="showUserMenu"
                class="dropdown-menu rounded-lg mt-2 right-0 w-48"
                @click.stop
              >
                <div class="p-3 border-b border-gray-700">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                      {{ userInitial }}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ userName }}</p>
                      <p class="text-xs text-gray-400">{{ userRole }}</p>
                    </div>
                  </div>
                </div>
                <div class="py-2">
                  <a href="/profile" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                    <i class="ri-user-line mr-3"></i>
                    个人资料
                  </a>
                  <a href="/settings" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                    <i class="ri-settings-3-line mr-3"></i>
                    账户设置
                  </a>
                  <a href="/favorites" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50">
                    <i class="ri-bookmark-line mr-3"></i>
                    我的收藏
                  </a>
                  <div class="border-t border-gray-700 mt-2"></div>
                  <a href="/logout" class="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50 text-red-400">
                    <i class="ri-logout-box-line mr-3"></i>
                    退出登录
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 lg:hidden"
            @click="toggleMobileMenu"
          >
            <i class="ri-menu-line"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端搜索栏 -->
    <transition name="slide-down">
      <div v-if="showMobileSearch" class="border-t border-gray-800 p-4 md:hidden">
        <div class="search-input flex items-center rounded-lg overflow-hidden">
          <input
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full py-2 px-4 bg-transparent text-white border-none focus:outline-none text-sm"
            v-model="searchQuery"
            @keypress.enter="handleSearch"
          >
          <button
            class="w-10 h-10 flex items-center justify-center text-primary"
            @click="handleSearch"
          >
            <i class="ri-search-line"></i>
          </button>
        </div>
      </div>
    </transition>

    <!-- 移动端导航菜单 -->
    <transition name="slide-down">
      <div v-if="showMobileMenu" class="border-t border-gray-800 p-4 lg:hidden">
        <nav class="flex flex-col space-y-2">
          <router-link
            to="/talent/schools"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            @click="showMobileMenu = false"
          >
            院校数据库
          </router-link>
          <router-link
            to="/talent/works"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            @click="showMobileMenu = false"
          >
            学生作品库
          </router-link>
          <router-link
            to="/talent/jobs"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            @click="showMobileMenu = false"
          >
            企业需求池
          </router-link>
          <router-link
            to="/talent/designers"
            class="nav-button px-3 py-2 rounded-lg text-sm font-medium"
            @click="showMobileMenu = false"
          >
            设计师档案
          </router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Notification {
  id: number
  content: string
  time: string
  read: boolean
}

// Props
interface Props {
  currentPageTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPageTitle: '星海人才'
})

// Router
const route = useRoute()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const showNotification = ref(false)
const showUserMenu = ref(false)
const showMobileSearch = ref(false)
const showMobileMenu = ref(false)

// 用户信息
const userName = ref('张小明')
const userRole = ref('学生')
const userInitial = computed(() => userName.value.charAt(0))

// 通知数据
const notifications = ref<Notification[]>([
  { id: 1, content: '王梦琪的新作品获得热门推荐', time: '1小时前', read: false },
  { id: 2, content: '您关注的清华大学发布了新作品', time: '3小时前', read: false }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// 搜索占位符
const searchPlaceholder = computed(() => {
  if (route.path.includes('/works')) return '搜索作品、设计师、院校...'
  if (route.path.includes('/schools')) return '搜索院校、专业...'
  if (route.path.includes('/jobs')) return '搜索职位、公司...'
  if (route.path.includes('/designers')) return '搜索设计师...'
  return '搜索...'
})

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 根据当前页面执行搜索
    console.log('搜索:', searchQuery.value)
    // 可以在这里添加具体的搜索逻辑
  }
}

const toggleNotification = () => {
  showNotification.value = !showNotification.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotification.value = false
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showMobileSearch.value = false
}

const closeDropdowns = () => {
  showNotification.value = false
  showUserMenu.value = false
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
