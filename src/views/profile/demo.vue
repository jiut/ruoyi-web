<script setup lang="ts">
import { useRouter } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const router = useRouter()

// 测试链接
const testLinks = [
  {
    title: '设计师档案',
    description: '完善设计师个人档案信息',
    route: '/profile/designer/basic',
    icon: 'ri-user-line',
    color: 'from-blue-500 to-purple-500',
  },
  {
    title: '企业档案',
    description: '完善企业基础信息和联系方式',
    route: '/profile/enterprise/basic',
    icon: 'ri-building-line',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: '欢迎页面',
    description: '查看注册成功后的欢迎页面',
    route: '/profile/welcome',
    icon: 'ri-home-line',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: '人才模块',
    description: '浏览人才模块主页面',
    route: '/talent',
    icon: 'ri-team-line',
    color: 'from-purple-500 to-pink-500',
  },
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30" />
      <div class="container mx-auto px-10 relative z-10">
        <div class="text-center">
          <div
            class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center glow-border">
            <i class="ri-test-tube-line text-3xl text-white" />
          </div>
          <h1 class="text-4xl font-bold mb-2 text-white">
            🧪 档案页面演示
          </h1>
          <p class="text-gray-300 max-w-2xl mx-auto">
            测试和体验不同类型的档案页面功能
          </p>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 功能卡片 -->
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div
              v-for="link in testLinks"
              :key="link.route"
              class="glass-card rounded-lg glow-border p-6 transition-all hover:scale-105 cursor-pointer group"
              @click="navigateTo(link.route)"
            >
              <!-- 图标 -->
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r transition-all group-hover:scale-110"
                  :class="link.color"
                >
                  <i :class="link.icon" class="text-xl text-white" />
                </div>
                <i class="ri-arrow-right-line text-gray-400 group-hover:text-white transition-colors" />
              </div>

              <!-- 内容 -->
              <div>
                <h3 class="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {{ link.title }}
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                  {{ link.description }}
                </p>
              </div>

              <!-- 路由信息 -->
              <div class="mt-4 pt-4 border-t border-gray-700">
                <code class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {{ link.route }}
                </code>
              </div>
            </div>
          </div>

          <!-- 使用说明 -->
          <div class="mt-12 glass-card rounded-lg glow-border p-6">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center">
              <i class="ri-information-line mr-2 text-blue-400" />
              使用说明
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 class="font-medium text-white mb-2">🎨 设计师档案</h3>
                <ul class="space-y-1 text-sm">
                  <li>• 包含多步骤表单：基础信息、教育背景、获奖记录、工作经历</li>
                  <li>• 支持技能标签选择和社交链接</li>
                  <li>• 实时表单验证和数据保存</li>
                  <li>• 档案完整度计算和引导</li>
                </ul>
              </div>
              <div>
                <h3 class="font-medium text-white mb-2">🏢 企业档案</h3>
                <ul class="space-y-1 text-sm">
                  <li>• 简化的单页表单设计</li>
                  <li>• 企业基础信息和联系方式</li>
                  <li>• 行业类型和企业规模选择</li>
                  <li>• LOGO上传和企业简介</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 class="font-medium text-blue-400 mb-2 flex items-center">
                <i class="ri-lightbulb-line mr-2" />
                设计特点
              </h3>
              <p class="text-sm text-gray-300">
                两个页面都采用了相同的设计语言：<code class="text-blue-400">glass-card</code> 玻璃卡片效果、
                <code class="text-blue-400">glow-border</code> 发光边框、渐变色彩搭配，以及响应式布局设计。
                企业档案页面简化了设计师档案的复杂流程，专注于企业信息的快速填写。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import '@/styles/talent.css';

.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 主色调 */
.bg-primary {
  background: linear-gradient(45deg, #007AFF, #AF52DE);
}

.text-primary {
  color: #0a84ff;
}

.text-secondary {
  color: #bf5af2;
}

/* 悬停效果 */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(10, 132, 255, 0.5);
}

/* 代码块样式 */
code {
  font-family: 'Fira Code', monospace;
}
</style>
