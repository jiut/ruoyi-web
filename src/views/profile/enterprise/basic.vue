<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ProfileCompletenessGuide } from '@/components/common'
import TalentHeader from '@/components/talent/TalentHeader.vue'
import {
  getCurrentEnterprise,
  updateEnterprise,
  getEnterpriseCompleteness,
  type EnterpriseUpdateData,
  type EnterpriseCompletenessDetail
} from '@/api/talent/enterprise'
import type { Enterprise } from '@/types/talent/job'

const router = useRouter()

// 加载状态
const loading = ref(true)
const saving = ref(false)
const dataLoaded = ref(false)

// 基础信息表单
const basicForm = reactive<EnterpriseUpdateData>({
  id: undefined,
  enterpriseName: '',
  logo: '',
  industry: '',
  scale: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
})

// 下拉菜单状态
const showIndustryDropdown = ref(false)
const showScaleDropdown = ref(false)

// 选项数据
const industryOptions = [
  { value: '互联网', label: '互联网' },
  { value: '软件开发', label: '软件开发' },
  { value: '游戏', label: '游戏' },
  { value: '电子商务', label: '电子商务' },
  { value: '智能硬件', label: '智能硬件' },
  { value: '金融', label: '金融' },
  { value: '教育', label: '教育' },
  { value: '医疗', label: '医疗' },
  { value: '制造业', label: '制造业' },
  { value: '其他', label: '其他' },
]

const scaleOptions = [
  { value: '1-50人', label: '微型企业 (1-50人)' },
  { value: '50-100人', label: '小型企业 (50-100人)' },
  { value: '100-500人', label: '中小型企业 (100-500人)' },
  { value: '500-1000人', label: '中型企业 (500-1000人)' },
  { value: '1000-5000人', label: '大型企业 (1000-5000人)' },
  { value: '5000-10000人', label: '超大型企业 (5000-10000人)' },
  { value: '10000+人', label: '特大型企业 (10000+人)' },
]

// 计算属性
const industryText = computed(() => {
  if (!basicForm.industry)
    return '请选择行业类型'
  const option = industryOptions.find(opt => opt.value === basicForm.industry)
  return option ? option.label : '请选择行业类型'
})

const scaleText = computed(() => {
  if (!basicForm.scale)
    return '请选择企业规模'
  const option = scaleOptions.find(opt => opt.value === basicForm.scale)
  return option ? option.label : '请选择企业规模'
})

const logoStyle = computed(() => {
  if (basicForm.logo) {
    return {
      backgroundImage: `url(${basicForm.logo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

const profileCompleteness = ref<EnterpriseCompletenessDetail | null>(null)

const fetchProfileCompleteness = async () => {
  try {
    const res = await getEnterpriseCompleteness()
    if (res && res.data) {
      profileCompleteness.value = res.data
    }
  } catch (e) {
    console.error('获取档案完整度失败', e)
  }
}

// 保存企业信息
const saveEnterpriseInfo = async () => {
  if (!basicForm.id) {
    console.warn('没有企业ID，无法保存')
    return false
  }

  // 判断是否有变更
  const prev = basicForm as any
  let changed = false
  const keys = ['enterpriseName', 'logo', 'industry', 'scale', 'address', 'phone', 'email', 'website', 'description']
  for (const key of keys) {
    if (prev[key] !== prev._original?.[key]) {
      changed = true
      break
    }
  }

  if (!changed) {
    console.log('企业信息无变更，跳过保存')
    return false
  }

  // 准备保存的数据
  const updateData: EnterpriseUpdateData = {
    id: basicForm.id,
    enterpriseName: basicForm.enterpriseName,
    logo: basicForm.logo,
    industry: basicForm.industry,
    scale: basicForm.scale,
    address: basicForm.address,
    phone: basicForm.phone,
    email: basicForm.email,
    website: basicForm.website,
    description: basicForm.description,
  }

  try {
    // 调用API更新企业信息
    await updateEnterprise(updateData)

    // 更新 _original 快照
    prev._original = JSON.parse(JSON.stringify(prev))

    console.log('企业信息保存成功')
    return true
  } catch (error) {
    console.error('保存企业信息时出错:', error)
    throw error
  }
}

// 表单提交
const handleSubmit = async () => {
  // 使用HTML5原生验证
  const form = document.querySelector('form[novalidate]') as HTMLFormElement
  if (form && !form.checkValidity()) {
    form.reportValidity()
    return
  }

  // 验证网站链接格式（如果已填写）
  if (basicForm.website && basicForm.website.trim()) {
    if (!isValidUrl(basicForm.website.trim())) {
      alert('企业网站链接格式不正确，请输入有效的网址')
      return
    }
  }

  try {
    saving.value = true
    const changed = await saveEnterpriseInfo()

    if (changed) {
      await fetchProfileCompleteness()
      alert('企业信息保存成功！')
    } else {
      alert('没有信息变更')
    }
  } catch (error) {
    console.error('保存失败:', error)

    // 根据错误类型显示不同的提示信息
    let errorMessage = '保存数据失败，请检查网络连接后重试'
    if (error && typeof error === 'object') {
      const errorObj = error as any
      if (errorObj.message) {
        errorMessage = `保存失败: ${errorObj.message}`
      } else if (errorObj.data && errorObj.data.message) {
        errorMessage = `保存失败: ${errorObj.data.message}`
      }
    }

    alert(errorMessage)
  } finally {
    saving.value = false
  }
}

// 加载当前企业信息
const loadEnterpriseData = async () => {
  try {
    loading.value = true

    // 获取当前企业信息
    const currentResponse = await getCurrentEnterprise()

    if (currentResponse && currentResponse.data) {
      const enterpriseData = currentResponse.data
      console.log('获取到企业数据:', enterpriseData)

      // 填充基础表单数据
      fillBasicForm(enterpriseData)

      // 标记数据加载完成
      dataLoaded.value = true
    } else {
      console.warn('无法获取当前企业信息')
    }
  } catch (error) {
    console.error('加载企业信息失败:', error)
    // 如果加载失败，不阻止用户继续使用页面
  } finally {
    loading.value = false
  }
}

// 填充基础表单数据
const fillBasicForm = (enterprise: Enterprise) => {
  if (!enterprise) {
    console.warn('fillBasicForm: enterprise 数据为空')
    return
  }

  try {
    basicForm.id = enterprise.id
    basicForm.enterpriseName = enterprise.enterpriseName || ''
    basicForm.logo = enterprise.logo || ''
    basicForm.industry = enterprise.industry || ''
    basicForm.scale = enterprise.scale || ''
    basicForm.address = enterprise.address || ''
    basicForm.phone = enterprise.phone || ''
    basicForm.email = enterprise.email || ''
    basicForm.website = enterprise.website || ''
    basicForm.description = enterprise.description || ''

    // 保存快照
    ;(basicForm as any)._original = JSON.parse(JSON.stringify(basicForm))
  } catch (error) {
    console.error('fillBasicForm: 填充企业表单数据时出错:', error)
    throw error
  }
}

// 保存并退出
const saveAndExit = async () => {
  try {
    await saveEnterpriseInfo()
    console.log('数据保存成功')
    router.push('/talent')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 下拉菜单切换
const toggleIndustryDropdown = () => {
  showIndustryDropdown.value = !showIndustryDropdown.value
  showScaleDropdown.value = false
}

const toggleScaleDropdown = () => {
  showScaleDropdown.value = !showScaleDropdown.value
  showIndustryDropdown.value = false
}

// 选择行业类型
const selectIndustry = (option: { value: string; label: string }) => {
  basicForm.industry = option.value
  showIndustryDropdown.value = false
}

// 选择企业规模
const selectScale = (option: { value: string; label: string }) => {
  basicForm.scale = option.value
  showScaleDropdown.value = false
}

// LOGO上传
const handleLogoUpload = () => {
  const logoUrls = [
    'https://readdy.ai/api/search-image?query=modern%20company%20logo%20design%20professional%20clean%20minimal%20business%20brand&width=200&height=200&seq=logo001&orientation=squarish',
    'https://readdy.ai/api/search-image?query=corporate%20logo%20design%20creative%20professional%20business%20brand%20identity&width=200&height=200&seq=logo002&orientation=squarish',
  ]

  if (!basicForm.logo)
    basicForm.logo = logoUrls[0]
  else
    basicForm.logo = logoUrls[1]
}

// URL验证函数
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl)
    return false

  try {
    new URL(trimmedUrl)
    return true
  } catch {
    try {
      new URL(`https://${trimmedUrl}`)
      return true
    } catch {
      return false
    }
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showIndustryDropdown.value = false
    showScaleDropdown.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadEnterpriseData()
  fetchProfileCompleteness()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
            <i class="ri-building-line text-3xl text-white" />
          </div>
          <h1 class="text-4xl font-bold mb-2 text-white">
            🏢 完善企业档案
          </h1>
          <p class="text-gray-300 max-w-2xl mx-auto">
            补充您的企业详细信息，提升档案完整度，吸引更多优秀设计师
          </p>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 信息完整度引导 -->
        <div class="max-w-6xl mx-auto mb-8">
          <ProfileCompletenessGuide :completeness="profileCompleteness" />
        </div>

        <!-- 表单内容 -->
        <div class="max-w-6xl mx-auto">
          <div class="glass-card rounded-lg glow-border p-6 md:p-8">
            <!-- 加载状态 -->
            <div v-if="loading" class="text-center py-12">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <i class="ri-loader-4-line text-2xl text-white animate-spin" />
              </div>
              <p class="text-gray-300 text-lg font-medium mb-2">
                正在获取您的企业档案...
              </p>
              <p class="text-gray-400 text-sm">
                包括基础信息、联系方式和企业简介
              </p>
            </div>

            <!-- 企业信息表单 -->
            <div v-else-if="basicForm" class="space-y-8">
              <form ref="formElement" novalidate @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- 左栏：基础信息 -->
                  <div>
                    <div class="mb-6">
                      <h2 class="text-xl font-bold mb-4 flex items-center">
                        <div
                          class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
                          <i class="ri-building-line" />
                        </div>
                        基础信息
                      </h2>

                      <!-- 企业名称 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">
                          企业名称 <span class="text-red-500">*</span>
                        </label>
                        <input v-model="basicForm.enterpriseName" type="text"
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
                          placeholder="请输入企业名称" required minlength="2" maxlength="100" title="请输入企业名称，长度2-100个字符">
                      </div>

                      <!-- LOGO上传与行业类型 -->
                      <div class="mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <!-- LOGO上传 -->
                          <div>
                            <label class="block text-gray-300 mb-2">企业LOGO</label>
                            <div class="flex items-center">
                              <div
                                class="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 logo-upload flex items-center justify-center mr-4"
                                :style="logoStyle" />
                              <button type="button"
                                class="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap"
                                @click="handleLogoUpload">
                                {{ basicForm.logo ? '更换LOGO' : '上传LOGO' }}
                              </button>
                            </div>
                          </div>

                          <!-- 行业类型 -->
                          <div>
                            <label class="block text-gray-300 mb-2">行业类型</label>
                            <div class="relative">
                              <div
                                class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                                @click="toggleIndustryDropdown">
                                <span>{{ industryText }}</span>
                                <i class="ri-arrow-down-s-line" />
                              </div>
                              <div v-show="showIndustryDropdown"
                                class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
                                <div v-for="option in industryOptions" :key="option.value"
                                  class="py-2 px-4 hover:bg-gray-800 cursor-pointer" @click="selectIndustry(option)">
                                  {{ option.label }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 企业规模 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">企业规模</label>
                        <div class="relative">
                          <div
                            class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                            @click="toggleScaleDropdown">
                            <span>{{ scaleText }}</span>
                            <i class="ri-arrow-down-s-line" />
                          </div>
                          <div v-show="showScaleDropdown"
                            class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
                            <div v-for="option in scaleOptions" :key="option.value"
                              class="py-2 px-4 hover:bg-gray-800 cursor-pointer" @click="selectScale(option)">
                              {{ option.label }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- 企业地址 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">企业地址</label>
                        <input v-model="basicForm.address" type="text"
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
                          placeholder="请输入企业地址" maxlength="255">
                      </div>
                    </div>
                  </div>

                  <!-- 右栏：联系信息 -->
                  <div>
                    <div class="mb-6">
                      <h2 class="text-xl font-bold mb-4 flex items-center">
                        <div
                          class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2">
                          <i class="ri-contacts-line" />
                        </div>
                        联系信息
                      </h2>

                      <!-- 联系电话 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">联系电话</label>
                        <input v-model="basicForm.phone" type="tel" pattern="^(0\d{2,3}-?\d{7,8}|1[3-9]\d{9})$"
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
                          placeholder="请输入联系电话" title="请输入有效的联系电话" maxlength="20">
                      </div>

                      <!-- 联系邮箱 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">联系邮箱</label>
                        <input v-model="basicForm.email" type="email"
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
                          placeholder="请输入联系邮箱" title="请输入有效的邮箱地址">
                      </div>

                      <!-- 企业网站 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">企业网站</label>
                        <input v-model="basicForm.website" type="url"
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary"
                          placeholder="请输入企业网站地址" title="请输入完整的网址，如 https://example.com">
                      </div>

                      <!-- 企业简介 -->
                      <div class="mb-4">
                        <label class="block text-gray-300 mb-2">企业简介</label>
                        <textarea v-model="basicForm.description"
                          class="w-full h-32 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary resize-none"
                          placeholder="请简要介绍您的企业背景、业务范围、发展历程和企业文化" maxlength="500" />
                        <div class="text-xs text-gray-500 mt-1 text-right">
                          {{ (basicForm.description || '').length }}/500
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 底部按钮 -->
                <div class="flex items-center justify-between pt-6 mt-6 border-t border-gray-700">
                  <!-- 左侧提示 -->
                  <div class="flex-1">
                    <p class="text-sm text-gray-400">
                      <span class="text-red-400">*</span> 为必填项，其他为选填项
                    </p>
                  </div>

                  <!-- 右侧按钮 -->
                  <div class="flex gap-4">
                    <button type="button" class="secondary-button px-6 py-3" @click="saveAndExit">
                      <i class="ri-save-line mr-2" />
                      保存并退出
                    </button>
                    <button type="submit" :disabled="saving" class="neon-button px-6 py-3">
                      <i v-if="saving" class="ri-loader-4-line animate-spin mr-2" />
                      {{ saving ? '保存中...' : '保存信息' }}
                      <i v-if="!saving" class="ri-check-line ml-2" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- 数据加载失败状态 -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <i class="ri-alert-line text-2xl text-gray-400" />
              </div>
              <p class="text-gray-300 text-lg font-medium">
                数据加载失败
              </p>
              <p class="text-gray-400 text-sm mt-2">
                请刷新页面重试
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

/* 输入框聚焦效果 */
.glow-input:focus {
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5);
}

/* LOGO上传 */
.logo-upload {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 4v16m8-8H4'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
}

/* 按钮样式 */
.rounded-button {
  border-radius: 8px;
}

.secondary-button {
  @apply px-4 py-2 bg-transparent border border-gray-600 rounded text-gray-300;
  @apply hover:bg-gray-800 transition-colors;
}

.neon-button {
  @apply px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white font-medium;
  @apply hover:from-blue-500 hover:to-purple-500 transition-all;
}
</style>
