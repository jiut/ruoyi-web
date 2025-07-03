<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-30"></div>
      <div class="container mx-auto px-10 relative z-10">
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center glow-border">
            <i class="ri-check-line text-3xl text-white"></i>
          </div>
          <h1 class="text-4xl font-bold mb-2 text-white">🎉 注册成功！</h1>
          <p class="text-gray-300 max-w-2xl mx-auto">欢迎加入星海人才联盟！现在让我们一起完善您的资料，获得更多机会和曝光</p>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 信息完整度引导 -->
        <div class="max-w-4xl mx-auto mb-8">
          <ProfileCompletenessGuide />
        </div>

        <!-- 快速入口卡片 -->
        <div class="max-w-4xl mx-auto">
          <div class="glass-card rounded-lg glow-border p-6 md:p-8">
            <div class="flex items-center mb-6">
              <i class="ri-rocket-line ri-lg text-gradient mr-2"></i>
              <h3 class="text-lg font-medium text-white">快速开始</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 进入人才模块 -->
              <div
                @click="goToTalent"
                class="glass-card p-6 cursor-pointer card-hover transition-all duration-300 group"
              >
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="ri-team-line text-xl text-white"></i>
                  </div>
                  <h4 class="font-medium text-white mb-2">进入人才模块</h4>
                  <p class="text-sm text-gray-400">立即开始浏览和使用平台功能</p>
                </div>
              </div>

              <!-- 完善个人资料 -->
              <div
                @click="goToProfile"
                class="glass-card p-6 cursor-pointer card-hover transition-all duration-300 group bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20"
              >
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="ri-user-settings-line text-xl text-white"></i>
                  </div>
                  <h4 class="font-medium text-white mb-2">完善个人资料</h4>
                  <p class="text-sm text-gray-400">提升资料完整度，获得更多机会</p>
                  <div class="mt-2">
                    <span class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">推荐</span>
                  </div>
                </div>
              </div>

              <!-- 查看使用指南 -->
              <div
                @click="goToHelp"
                class="glass-card p-6 cursor-pointer card-hover transition-all duration-300 group"
              >
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="ri-question-line text-xl text-white"></i>
                  </div>
                  <h4 class="font-medium text-white mb-2">查看使用指南</h4>
                  <p class="text-sm text-gray-400">了解平台功能和使用技巧</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能特色介绍 -->
        <div class="max-w-4xl mx-auto mt-8">
          <div class="glass-card rounded-lg glow-border p-6 md:p-8">
            <div class="flex items-center mb-6">
              <i class="ri-star-line ri-lg text-gradient mr-2"></i>
              <h3 class="text-lg font-medium text-white">平台特色功能</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="text-center p-4">
                <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <i class="ri-search-line text-xl text-white"></i>
                </div>
                <h5 class="font-medium text-white mb-1">智能匹配</h5>
                <p class="text-xs text-gray-400">精准匹配设计需求</p>
              </div>

              <div class="text-center p-4">
                <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <i class="ri-gallery-line text-xl text-white"></i>
                </div>
                <h5 class="font-medium text-white mb-1">作品展示</h5>
                <p class="text-xs text-gray-400">专业作品集管理</p>
              </div>

              <div class="text-center p-4">
                <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <i class="ri-medal-line text-xl text-white"></i>
                </div>
                <h5 class="font-medium text-white mb-1">能力认证</h5>
                <p class="text-xs text-gray-400">权威技能认证体系</p>
              </div>

              <div class="text-center p-4">
                <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <i class="ri-community-line text-xl text-white"></i>
                </div>
                <h5 class="font-medium text-white mb-1">社区交流</h5>
                <p class="text-xs text-gray-400">设计师社区互动</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-400">
            您可以随时在个人设置中完善和修改您的资料信息
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ProfileCompletenessGuide } from '@/components/common'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const router = useRouter()

// 跳转到人才模块
const goToTalent = () => {
  router.push('/talent')
}

// 跳转到资料完善页面
const goToProfile = () => {
  // 根据用户角色跳转到对应的资料完善页面
  // 这里可以根据用户的角色信息动态决定跳转路径
  router.push('/profile/designer/basic')
}

// 跳转到帮助页面
const goToHelp = () => {
  // 可以跳转到帮助文档或使用指南
  // 暂时跳转到人才模块的调试页面
  router.push('/talent/debug')
}
</script>

<style scoped>
@import '@/styles/talent.css';

.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
</style>
