<template>
  <div class="min-h-screen bg-black text-gray-200">
    <TalentHeader :current-page-title="currentPageTitle" />
    <main>
      <RouterView />
    </main>
    <footer class="py-12 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold mb-4">星海人才</h3>
            <p class="text-gray-400 text-sm">连接创意与科技，为设计师和企业搭建智能化人才对接平台</p>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">功能模块</h3>
            <ul class="space-y-2">
              <li><router-link to="/talent/schools" class="text-gray-400 text-sm hover:text-primary">院校数据库</router-link></li>
              <li><router-link to="/talent/works" class="text-gray-400 text-sm hover:text-primary">学生作品库</router-link></li>
              <li><router-link to="/talent/jobs" class="text-gray-400 text-sm hover:text-primary">企业需求池</router-link></li>
              <li><router-link to="/talent/designers" class="text-gray-400 text-sm hover:text-primary">设计师档案</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">关于我们</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 text-sm hover:text-primary">公司介绍</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-primary">加入我们</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-primary">合作伙伴</a></li>
              <li><a href="#" class="text-gray-400 text-sm hover:text-primary">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-bold mb-4">联系方式</h3>
            <ul class="space-y-2">
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-mail-line mr-2"></i> contact@xinghairencai.com
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-phone-line mr-2"></i> 400-888-9999
              </li>
              <li class="flex items-center text-gray-400 text-sm">
                <i class="ri-map-pin-line mr-2"></i> 北京市海淀区中关村大街 18 号
              </li>
            </ul>
          </div>
        </div>
        <div class="section-divider mb-8"></div>
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">© 2025 星海人才. 保留所有权利</p>
          <div class="flex space-x-4">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors">
              <i class="ri-weibo-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors">
              <i class="ri-wechat-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors">
              <i class="ri-linkedin-line"></i>
            </a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors">
              <i class="ri-github-line"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const route = useRoute()

const currentPageTitle = computed(() => {
  if (route.path.includes('/talent/works')) return '学生作品库'
  if (route.path.includes('/talent/schools')) return '院校数据库'
  if (route.path.includes('/talent/jobs')) return '企业需求池'
  if (route.path.includes('/talent/designers')) return '设计师档案'
  return '星海人才'
})
</script>

<style>
/* 全局样式，从原HTML迁移 */
:where([class^="ri-"])::before {
  content: "\f3c2";
}

body {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
}

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

.search-input:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.skill-tag {
  background: rgba(10, 132, 255, 0.2);
  border: 1px solid rgba(10, 132, 255, 0.3);
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 122, 255, 0), rgba(0, 122, 255, 0.5), rgba(175, 82, 222, 0.5), rgba(0, 122, 255, 0));
}

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px;
  grid-auto-flow: dense;
}

.work-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.work-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.work-card:hover .work-info {
  opacity: 1;
}

.work-info {
  background: rgba(28, 28, 30, 0.85);
  backdrop-filter: blur(5px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-nav::-webkit-scrollbar {
  height: 5px;
}

.category-nav::-webkit-scrollbar-track {
  background: rgba(28, 28, 30, 0.3);
  border-radius: 10px;
}

.category-nav::-webkit-scrollbar-thumb {
  background: rgba(10, 132, 255, 0.5);
  border-radius: 10px;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-checkbox {
  position: relative;
  cursor: pointer;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: rgba(28, 28, 30, 0.8);
  border: 1px solid rgba(99, 99, 102, 0.3);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: rgba(28, 28, 30, 1);
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #0a84ff;
  border-color: #0a84ff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 7px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
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

.breadcrumb-separator {
  color: rgba(148, 163, 184, 0.5);
}

/* 针对Tailwind的CSS变量定义 */
:root {
  --color-primary: #0a84ff;
  --color-secondary: #bf5af2;
}
</style>
