<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type EnterpriseRegistration, type EnterpriseScale, type Industry, registerEnterprise } from '@/api/talent/registration'

const router = useRouter()

// 表单数据
const formData = reactive<EnterpriseRegistration>({
  enterpriseName: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  scale: undefined,
  industry: undefined,
  logo: '',
})

// 企业规模选项
const scaleOptions = [
  { value: '1-50人', label: '微型企业 (1-50人)' },
  { value: '50-100人', label: '小型企业 (50-100人)' },
  { value: '100-500人', label: '中小型企业 (100-500人)' },
  { value: '500-1000人', label: '中型企业 (500-1000人)' },
  { value: '1000-5000人', label: '大型企业 (1000-5000人)' },
  { value: '5000-10000人', label: '超大型企业 (5000-10000人)' },
  { value: '10000+人', label: '特大型企业 (10000+人)' },
]

// 行业类型选项
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

// 下拉菜单状态
const showScaleDropdown = ref(false)
const showIndustryDropdown = ref(false)

// 选中的值显示文本
const scaleText = computed(() => {
  if (!formData.scale)
    return '请选择企业规模'
  const option = scaleOptions.find(opt => opt.value === formData.scale)
  return option ? option.label : '请选择企业规模'
})

const industryText = computed(() => {
  if (!formData.industry)
    return '请选择行业类型'
  const option = industryOptions.find(opt => opt.value === formData.industry)
  return option ? option.label : '请选择行业类型'
})

// 隐私协议
const privacyAgreed = ref(false)

// 跳过模态框
const showSkipModal = ref(false)

// 高亮未填写字段
const highlightIncompleteFields = ref(false)

// 提交状态
const submitLoading = ref(false)

// 判断表单是否填写完整
const isFormComplete = computed(() => {
  return !!(
    formData.enterpriseName?.trim() &&
    formData.description?.trim() &&
    formData.address?.trim() &&
    formData.phone?.trim() &&
    formData.email?.trim() &&
    formData.website?.trim() &&
    formData.scale &&
    formData.industry &&
    formData.logo?.trim()
  )
})

// 判断哪些字段未填写
const incompleteFields = computed(() => {
  const fields = {
    enterpriseName: !formData.enterpriseName?.trim(),
    description: !formData.description?.trim(),
    address: !formData.address?.trim(),
    phone: !formData.phone?.trim(),
    email: !formData.email?.trim(),
    website: !formData.website?.trim(),
    scale: !formData.scale,
    industry: !formData.industry,
    logo: !formData.logo?.trim(),
  }
  return fields
})

// 计算填写进度百分比
const completionProgress = computed(() => {
  const totalFields = Object.keys(incompleteFields.value).length
  const completedFields = Object.values(incompleteFields.value).filter(isIncomplete => !isIncomplete).length
  return Math.round((completedFields / totalFields) * 100)
})

// LOGO样式
const logoStyle = computed(() => {
  if (formData.logo) {
    return {
      backgroundImage: `url(${formData.logo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

// 下拉菜单切换
const toggleScaleDropdown = () => {
  showScaleDropdown.value = !showScaleDropdown.value
  showIndustryDropdown.value = false
  clearHighlights()
}

const toggleIndustryDropdown = () => {
  showIndustryDropdown.value = !showIndustryDropdown.value
  showScaleDropdown.value = false
  clearHighlights()
}

// 选择企业规模
const selectScale = (option: { value: string; label: string }) => {
  formData.scale = option.value as EnterpriseScale
  showScaleDropdown.value = false
}

// 选择行业类型
const selectIndustry = (option: { value: string; label: string }) => {
  formData.industry = option.value as Industry
  showIndustryDropdown.value = false
}

// LOGO上传
const handleLogoUpload = () => {
  // 模拟LOGO上传
  const logoUrls = [
    'https://readdy.ai/api/search-image?query=modern%20company%20logo%20design%20business%20corporate%20minimalist%20professional%20clean%20brand%20identity&width=200&height=200&seq=logo001&orientation=squarish',
    'https://readdy.ai/api/search-image?query=tech%20company%20logo%20design%20startup%20modern%20digital%20corporate%20brand%20professional%20minimalist&width=200&height=200&seq=logo002&orientation=squarish',
  ]

  if (!formData.logo)
    formData.logo = logoUrls[0]
  else
    formData.logo = logoUrls[1]
}

// 隐私协议切换
const togglePrivacyAgreement = () => {
  privacyAgreed.value = !privacyAgreed.value
}

// 继续完善按钮点击
const continueCompleting = () => {
  showSkipModal.value = false
  highlightIncompleteFields.value = true
}

// 清除高亮效果
const clearHighlights = () => {
  highlightIncompleteFields.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showScaleDropdown.value = false
    showIndustryDropdown.value = false
  }
}

// 表单提交
const handleSubmit = async () => {
  if (!privacyAgreed.value) {
    alert('请阅读并同意用户协议和隐私政策')
    return
  }

  // 首先进行HTML5验证
  const form = document.querySelector('form')
  if (!form || !form.checkValidity()) {
    form?.reportValidity() // 显示浏览器错误气泡
    return
  }

  // HTML5验证通过后，进行其他必要的验证
  if (!validateCustomFields())
    return

  try {
    submitLoading.value = true

    await registerEnterprise(formData)
    alert('注册成功！')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  }
  catch (error: any) {
    // 解析后端返回的错误信息
    let errorMessage = '注册失败，请重试'

    if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    }
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    else if (error.data?.msg) {
      errorMessage = error.data.msg
    }
    else if (error.msg) {
      errorMessage = error.msg
    }
    else if (error.message) {
      errorMessage = error.message
    }

    alert(errorMessage)
  }
  finally {
    submitLoading.value = false
  }
}

// URL验证函数
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl)
    return false

  try {
    new URL(trimmedUrl)
    return true
  }
  catch {
    try {
      new URL(`https://${trimmedUrl}`)
      return true
    }
    catch {
      return false
    }
  }
}

// 自定义字段验证函数
const validateCustomFields = () => {
  // 检查网站链接格式
  if (formData.website && formData.website.trim()) {
    if (!isValidUrl(formData.website.trim())) {
      alert('企业网站链接格式不正确，请输入有效的网址')
      return false
    }
  }

  return true
}

// 基础字段验证函数
const validateBasicFields = () => {
  // 检查企业名称
  if (!formData.enterpriseName?.trim()) {
    alert('请至少填写企业名称')
    return false
  }

  // 检查手机号格式（如果已填写）
  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^(0\d{2,3}-?\d{7,8}|1[3-9]\d{9})$/
    if (!phoneRegex.test(formData.phone.trim())) {
      alert('联系电话格式不正确，请输入有效的电话号码')
      return false
    }
  }

  // 检查邮箱格式（如果已填写）
  if (formData.email && formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      alert('邮箱格式不正确，请输入有效邮箱地址')
      return false
    }
  }

  // 检查网站链接格式（如果已填写）
  if (formData.website && formData.website.trim()) {
    if (!isValidUrl(formData.website.trim())) {
      alert('企业网站链接格式不正确，请输入有效的网址')
      return false
    }
  }

  return true
}

// 确认跳过
const confirmSkip = async () => {
  // 先验证已填写的基础字段
  if (!validateBasicFields()) {
    return
  }

  showSkipModal.value = false

  try {
    submitLoading.value = true

    // 构建只包含已填写且有效字段的数据
    const minimalData: EnterpriseRegistration = {
      enterpriseName: formData.enterpriseName.trim(),
    }

    // 添加已填写的可选字段
    if (formData.phone && formData.phone.trim())
      minimalData.phone = formData.phone.trim()

    if (formData.email && formData.email.trim())
      minimalData.email = formData.email.trim()

    if (formData.website && formData.website.trim())
      minimalData.website = formData.website.trim()

    if (formData.description && formData.description.trim())
      minimalData.description = formData.description.trim()

    if (formData.address && formData.address.trim())
      minimalData.address = formData.address.trim()

    if (formData.logo && formData.logo.trim())
      minimalData.logo = formData.logo.trim()

    if (formData.scale)
      minimalData.scale = formData.scale

    if (formData.industry)
      minimalData.industry = formData.industry

    await registerEnterprise(minimalData)
    alert('注册成功！您可以稍后完善详细信息')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  }
  catch (error: any) {
    // 解析后端返回的错误信息
    let errorMessage = '注册失败，请重试'

    if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg
    }
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    else if (error.data?.msg) {
      errorMessage = error.data.msg
    }
    else if (error.msg) {
      errorMessage = error.msg
    }
    else if (error.message) {
      errorMessage = error.message
    }

    alert(errorMessage)
  }
  finally {
    submitLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 加载Mock测试数据
  const mockDataStr = localStorage.getItem('mockEnterpriseData')
  if (mockDataStr) {
    try {
      const mockData = JSON.parse(mockDataStr)
      Object.assign(formData, mockData)
    }
    catch (error) {
      console.error('加载Mock数据失败:', error)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="min-h-screen flex flex-col text-main">
    <!-- 标题区 -->
    <header class="w-full py-8 relative overflow-hidden bg-gray-900">
      <!-- 进度条背景 -->
      <div
        class="absolute inset-0 gradient-bg transition-all duration-500 ease-out"
        :style="{ width: `${completionProgress}%` }"
      />
      <!-- 标题内容 -->
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 header-text">
          🏢 企业身份注册
        </h1>
        <p class="text-gray-200 mb-1 header-text">
          完善您的企业信息，发现优秀设计人才
        </p>
        <div class="text-sm text-gray-300 mt-2 header-text">
          完成进度：{{ completionProgress }}%
        </div>
      </div>
    </header>

    <!-- 主表单卡片 -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="glass-card max-w-6xl mx-auto rounded-lg overflow-hidden">
        <!-- 进度指示器 -->
        <div class="flex justify-center py-6 px-4 border-b border-gray-700">
          <div class="flex items-center">
            <div
              class="progress-step active w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
            >
              1
            </div>
            <div class="w-16 h-1 bg-gray-700" />
            <div
              class="progress-step w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white font-medium"
            >
              2
            </div>
            <div class="w-16 h-1 bg-gray-700" />
            <div
              class="progress-step w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white font-medium"
            >
              3
            </div>
          </div>
        </div>

        <!-- 必填说明 -->
        <div class="px-6 py-4 text-sm text-gray-400">
          <span class="text-red-500">*</span> 为必填项，其他为选填项。必填项完成后即可注册，选填项可稍后补充完善。
          <div v-if="highlightIncompleteFields" class="mt-2 flex items-center gap-4 text-xs">
            <span class="flex items-center gap-1">
              <div class="w-3 h-3 rounded border border-blue-500 bg-blue-500/20" />
              <span class="text-blue-400">蓝色高亮：需要完善的字段</span>
            </span>
          </div>
        </div>

        <!-- 表单内容 -->
        <form class="px-6 pb-8" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 左栏：基础信息 -->
            <div>
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                  <div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
                    <i class="ri-building-line" />
                  </div>
                  基础信息
                </h2>

                <!-- 企业名称 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">
                    企业名称 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.enterpriseName" type="text" required
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.enterpriseName },
                    ]"
                    placeholder="请输入企业名称"
                    minlength="2"
                    maxlength="100"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 企业LOGO与行业类型 -->
                <div class="mb-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- 企业LOGO -->
                    <div>
                      <label class="block text-gray-300 mb-2">企业LOGO</label>
                      <div class="flex items-center">
                        <div
                          class="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 logo-upload flex items-center justify-center mr-4" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.logo },
                          ]"
                          :style="logoStyle"
                        />
                        <button
                          type="button" class="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.logo },
                          ]"
                          @click="() => { handleLogoUpload(); clearHighlights() }"
                        >
                          {{ formData.logo ? '更换LOGO' : '上传LOGO' }}
                        </button>
                      </div>
                    </div>

                    <!-- 行业类型 -->
                    <div>
                      <label class="block text-gray-300 mb-2">行业类型</label>
                      <div class="relative">
                        <div
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.industry },
                          ]"
                          @click="toggleIndustryDropdown"
                        >
                          <span>{{ industryText }}</span>
                          <i class="ri-arrow-down-s-line" />
                        </div>
                        <div
                          v-show="showIndustryDropdown"
                          class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto"
                        >
                          <div
                            v-for="option in industryOptions" :key="option.value" class="py-2 px-4 hover:bg-gray-800 cursor-pointer"
                            @click="selectIndustry(option)"
                          >
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
                      class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer" :class="[
                        { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.scale },
                      ]"
                      @click="toggleScaleDropdown"
                    >
                      <span>{{ scaleText }}</span>
                      <i class="ri-arrow-down-s-line" />
                    </div>
                    <div
                      v-show="showScaleDropdown"
                      class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="option in scaleOptions" :key="option.value" class="py-2 px-4 hover:bg-gray-800 cursor-pointer"
                        @click="selectScale(option)"
                      >
                        {{ option.label }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 企业简介 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">企业简介</label>
                  <textarea
                    v-model="formData.description"
                    class="w-full h-32 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.description },
                    ]"
                    placeholder="请简要介绍您的企业业务、文化和发展方向..."
                    @focus="clearHighlights"
                  />
                </div>
              </div>
            </div>

            <!-- 右栏：联系信息 -->
            <div>
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                  <div
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2"
                  >
                    <i class="ri-contacts-line" />
                  </div>
                  联系信息
                </h2>

                <!-- 企业地址 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">企业地址</label>
                  <input
                    v-model="formData.address" type="text"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.address },
                    ]"
                    placeholder="请输入企业地址"
                    maxlength="255"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 联系电话 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">联系电话</label>
                  <input
                    v-model="formData.phone" type="tel"
                    pattern="^(0\d{2,3}-?\d{7,8}|1[3-9]\d{9})$"
                    title="请输入有效的联系电话"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.phone },
                    ]"
                    placeholder="请输入联系电话"
                    maxlength="20"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 联系邮箱 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">联系邮箱</label>
                  <input
                    v-model="formData.email" type="email"
                    title="请输入有效的邮箱地址"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.email },
                    ]"
                    placeholder="请输入联系邮箱"
                    maxlength="100"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 企业网站 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">企业网站</label>
                  <input
                    v-model="formData.website" type="url"
                    title="请输入完整的网址，如 https://example.com"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.website },
                    ]"
                    placeholder="请输入企业官网地址"
                    maxlength="255"
                    @focus="clearHighlights"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 隐私协议 -->
          <div class="border-t border-gray-700 pt-6 mt-6">
            <div class="flex items-start justify-center mb-6">
              <div class="custom-checkbox mt-1 mr-3" :class="[{ checked: privacyAgreed }]" @click="togglePrivacyAgreement" />
              <div>
                <p class="text-gray-300 text-sm mb-0">
                  我已阅读并同意 <a href="#" class="text-primary">《用户协议》</a>和<a
                    href="#"
                    class="text-primary"
                  >《隐私政策》</a>
                </p>
                <p class="text-gray-500 text-xs mt-1 mb-0">
                  我们将严格保护您的企业信息安全，未经您的许可不会向第三方透露
                </p>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-center space-x-4 border-t border-gray-700 pt-6">
            <!-- 表单不完整时：只显示稍后完善 -->
            <template v-if="!isFormComplete">
              <button
                type="button" class="px-6 py-3 relative overflow-hidden bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap progress-button"
                @click="showSkipModal = true"
              >
                <!-- 进度条背景 -->
                <div
                  class="absolute inset-0 gradient-bg transition-all duration-300 ease-out"
                  :style="{ width: `${completionProgress}%` }"
                />
                <!-- 按钮文本 -->
                <span class="relative z-10">提交注册 ({{ completionProgress }}%)</span>
              </button>
            </template>
            <!-- 表单完整时：显示完成注册 -->
            <template v-else>
              <button
                type="submit" :disabled="submitLoading"
                class="px-6 py-3 relative overflow-hidden gradient-bg rounded text-white font-medium shimmer-button rounded-button whitespace-nowrap progress-button"
              >
                <!-- 完整时显示完整的渐变背景 -->
                <div class="absolute inset-0 gradient-bg" />
                <!-- 按钮文本 -->
                <span class="relative z-10">{{ submitLoading ? '注册中...' : '完成注册' }}</span>
              </button>
            </template>
          </div>
        </form>
      </div>
    </main>

    <!-- 跳过确认弹窗 -->
    <div
      v-show="showSkipModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="glass-card rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-4">
            <i class="ri-question-line ri-2x" />
          </div>
          <h3 class="text-xl font-bold mb-2">
            确认跳过信息完善？
          </h3>
          <p class="text-gray-400 text-center mb-6">
            您选择暂不完善选填信息。完善的企业资料有助于：<br>
            • 获得更多优秀设计师关注<br>
            • 提升企业在搜索中的排名<br>
            • 展示企业实力和发展前景
          </p>
          <div class="flex space-x-4 w-full">
            <button
              class="flex-1 py-3 bg-transparent border border-gray-600 rounded text-gray-300 hover:bg-gray-800 transition-colors rounded-button whitespace-nowrap"
              @click="confirmSkip"
            >
              稍后完善
            </button>
            <button
              class="flex-1 py-3 gradient-bg rounded text-white font-medium rounded-button whitespace-nowrap"
              @click="continueCompleting"
            >
              继续完善
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础样式 */
.text-main {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #E2E8F0;
	font-size: 16px;
}

.active{
  color: #FFF;
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(37deg, #007AFF, #AF52DE, #FF2D92);
}

/* 玻璃效果卡片 */
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 进度步骤 */
.progress-step {
  transition: all 0.3s ease;
}

.progress-step.active {
  background: linear-gradient(90deg, #007AFF, #AF52DE);
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

/* 未完成字段高亮效果 */
.highlight-incomplete {
  border-color: rgba(10, 132, 255, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5) !important;
}

/* LOGO上传区域高亮效果 */
.logo-upload.highlight-incomplete {
  border: 2px solid rgba(10, 132, 255, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5) !important;
}

/* LOGO上传 */
.logo-upload {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 4v16m8-8H4'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
}

/* 自定义复选框 */
.custom-checkbox {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
  background: rgba(28, 28, 30, 0.8);
  border: 1px solid rgba(99, 99, 102, 0.5);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-checkbox.checked {
  background: linear-gradient(90deg, #007AFF, #AF52DE);
  border-color: transparent;
}

.custom-checkbox.checked::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 7px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 按钮样式 */
.rounded-button {
  border-radius: 8px;
}

.shimmer-button {
  position: relative;
  overflow: hidden;
}

.shimmer-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    left: 150%;
  }
}

/* 按钮悬停效果 */
.shimmer-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

/* 进度按钮样式 */
.progress-button {
  transition: all 0.3s ease;
}

.progress-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
}

/* 进度条过渡效果 */
.progress-button .absolute {
  border-radius: inherit;
}

/* 确保按钮文本在进度条上方清晰可见 */
.progress-button span {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-weight: 500;
}

/* 标题区文本样式 */
.header-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* 标题区进度条样式 */
header .gradient-bg {
  border-radius: 0;
}
</style>
