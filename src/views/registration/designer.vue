<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type DesignerRegistration, registerDesigner } from '@/api/talent/registration'
import { WorkStatus } from '@/types/talent/designer'
import SkillTagSelector from '@/components/common/SkillTagSelector/index.vue'
import SkillTagUtils from '@/utils/skillTagUtils'
import ProfessionUtils from '@/utils/professionUtils'

const router = useRouter()

// 表单数据
const formData = reactive<DesignerRegistration & { portfolioUrl?: string }>({
  designerName: '',
  avatar: '',
  gender: undefined,
  birthDate: '',
  phone: '',
  email: '',
  profession: undefined,
  skillTags: '',
  workYears: 0,
  description: '',
  portfolioUrl: '',
  workStatus: undefined,
})

// 性别选项
const genderOptions = [
  { value: '0', label: '男' },
  { value: '1', label: '女' },
  { value: '2', label: '其他' },
]

// 职业类型选项 - 使用统一工具类
const jobTypeOptions = ProfessionUtils.getSelectOptions()

// 工作状态选项
const workStatusOptions = [
  { value: WorkStatus.EMPLOYED, label: '在职' },
  { value: WorkStatus.FREELANCER, label: '自由职业' },
  { value: WorkStatus.SEEKING, label: '求职中' },
  { value: WorkStatus.STUDENT, label: '学生' },
]

// 社交链接数据
const socialLinks = ref<Array<{ platform: string; url: string; id: string }>>([])

// 下拉菜单状态
const showGenderDropdown = ref(false)
const showJobTypeDropdown = ref(false)
const showWorkStatusDropdown = ref(false)

// 选中的值显示文本
const genderText = computed(() => {
  if (!formData.gender)
    return '请选择'
  const option = genderOptions.find(opt => opt.value === formData.gender)
  return option ? option.label : '请选择'
})

const jobTypeText = computed(() => {
  if (!formData.profession)
    return '请选择您的职业类型'
  const option = jobTypeOptions.find(opt => opt.value === formData.profession)
  return option ? option.label : '请选择您的职业类型'
})

const workStatusText = computed(() => {
  if (!formData.workStatus)
    return '请选择工作状态'
  const option = workStatusOptions.find(opt => opt.value === formData.workStatus)
  return option ? option.label : '请选择工作状态'
})

// 技能标签
const selectedSkillTags = ref<string[]>([])
const showSkillTagSelector = ref(false)

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
    formData.designerName?.trim() &&
    formData.gender &&
    formData.birthDate &&
    formData.phone?.trim() &&
    formData.email?.trim() &&
    formData.profession &&
    formData.workStatus &&
    selectedSkillTags.value.length > 0 &&
    formData.description?.trim() &&
    formData.avatar?.trim() &&
    formData.portfolioUrl?.trim() &&
    formData.workYears !== undefined &&
    (socialLinks.value.length === 0 || socialLinks.value.some(link => link.platform.trim() && link.url.trim()))
  )
})

// 判断哪些字段未填写
const incompleteFields = computed(() => {
  const fields = {
    designerName: !formData.designerName?.trim(),
    gender: !formData.gender,
    birthDate: !formData.birthDate,
    profession: !formData.profession,
    workStatus: !formData.workStatus,
    skillTags: selectedSkillTags.value.length === 0,
    description: !formData.description?.trim(),
    avatar: !formData.avatar?.trim(),
    phone: !formData.phone?.trim(),
    email: !formData.email?.trim(),
    portfolioUrl: !formData.portfolioUrl?.trim(),
    socialLinks: socialLinks.value.length === 0 || socialLinks.value.every(link => !link.platform.trim() || !link.url.trim()),
    workYears: formData.workYears === 0, // 工作年限为0时也算未完善
  }
  return fields
})

// 计算填写进度百分比
const completionProgress = computed(() => {
  const totalFields = Object.keys(incompleteFields.value).length
  const completedFields = Object.values(incompleteFields.value).filter(isIncomplete => !isIncomplete).length
  return Math.round((completedFields / totalFields) * 100)
})

// 头像样式
const avatarStyle = computed(() => {
  if (formData.avatar) {
    return {
      backgroundImage: `url(${formData.avatar})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

// 下拉菜单切换
const toggleGenderDropdown = () => {
  showGenderDropdown.value = !showGenderDropdown.value
  showJobTypeDropdown.value = false
  showWorkStatusDropdown.value = false
  clearHighlights()
}

const toggleJobTypeDropdown = () => {
  showJobTypeDropdown.value = !showJobTypeDropdown.value
  showGenderDropdown.value = false
  showWorkStatusDropdown.value = false
  clearHighlights()
}

const toggleWorkStatusDropdown = () => {
  showWorkStatusDropdown.value = !showWorkStatusDropdown.value
  showGenderDropdown.value = false
  showJobTypeDropdown.value = false
  clearHighlights()
}

// 选择性别
const selectGender = (option: { value: string; label: string }) => {
  formData.gender = option.value as '0' | '1' | '2'
  showGenderDropdown.value = false
}

// 选择职业类型
const selectJobType = (option: { value: string; label: string }) => {
  formData.profession = option.value as any
  showJobTypeDropdown.value = false
}

// 选择工作状态
const selectWorkStatus = (option: { value: WorkStatus; label: string }) => {
  formData.workStatus = option.value
  showWorkStatusDropdown.value = false
}

// 头像上传
const handleAvatarUpload = () => {
  // 模拟头像上传
  const avatarUrls = [
    'https://readdy.ai/api/search-image?query=professional%20asian%20young%20designer%20portrait%20with%20neutral%20expression%2C%20high%20quality%20professional%20headshot%2C%20simple%20dark%20background%2C%20modern%20minimal%20style%2C%20soft%20lighting&width=200&height=200&seq=avatar001&orientation=squarish',
    'https://readdy.ai/api/search-image?query=professional%20asian%20young%20male%20designer%20portrait%20with%20neutral%20expression%2C%20high%20quality%20professional%20headshot%2C%20simple%20dark%20background%2C%20modern%20minimal%20style%2C%20soft%20lighting&width=200&height=200&seq=avatar002&orientation=squarish',
  ]

  if (!formData.avatar)
    formData.avatar = avatarUrls[0]
  else
    formData.avatar = avatarUrls[1]
}

// 清空出生日期
const clearBirthDate = () => {
  formData.birthDate = ''
}

// 技能标签操作
const getSkillTagClasses = (tag: string) => SkillTagUtils.getTagClasses(tag, 'sm')
const getSkillTagDisplayName = (tag: string) => SkillTagUtils.getTagDisplayName(tag)

// 新增：按分类排序的已选标签
const sortedSelectedTags = computed(() => {
  return SkillTagUtils.sortTagsByCategory(selectedSkillTags.value)
})

// 新增：按分类分组统计的已选标签
const selectedTagsByCategory = computed(() => {
  return SkillTagUtils.groupAndSortTagsByCategory(selectedSkillTags.value)
})

const removeSkillTag = (tag: string) => {
  const index = selectedSkillTags.value.indexOf(tag)
  if (index > -1)
    selectedSkillTags.value.splice(index, 1)
}

const handleSkillTagConfirm = (tags: string[]) => {
  if (tags.length > 15) {
    alert('最多只能选择15个技能标签')
    return
  }
  selectedSkillTags.value = [...tags]
}

// 社交链接操作
const addSocialLink = () => {
  socialLinks.value.push({
    platform: '',
    url: '',
    id: Date.now().toString(),
  })
}

const removeSocialLink = (id: string) => {
  const index = socialLinks.value.findIndex(link => link.id === id)
  if (index > -1)
    socialLinks.value.splice(index, 1)
}

const addSampleSocialLinks = () => {
  const sampleLinks = [
    { platform: 'Github', url: 'https://github.com/your-profile' },
    { platform: '站酷', url: 'https://www.zcool.com.cn/u/your-profile' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/your-profile' },
  ]

  sampleLinks.forEach((sample, index) => {
    socialLinks.value.push({
      platform: sample.platform,
      url: sample.url,
      id: (Date.now() + index).toString(),
    })
  })
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
    showGenderDropdown.value = false
    showJobTypeDropdown.value = false
    showWorkStatusDropdown.value = false
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

    // 处理技能标签
    formData.skillTags = JSON.stringify(selectedSkillTags.value)

    // 处理社交链接
    const socialLinksData: Record<string, string> = {}
    socialLinks.value.forEach((link) => {
      if (link.platform && link.url.trim())
        socialLinksData[link.platform] = link.url.trim()
    })

    // 创建完整的表单数据
    const submitData = {
      ...formData,
      socialLinks: Object.keys(socialLinksData).length > 0 ? JSON.stringify(socialLinksData) : undefined,
    }

    await registerDesigner(submitData)
    alert('注册成功！')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  }
  catch (error: any) {
    // 解析后端返回的错误信息
    let errorMessage = '注册失败，请重试'

    if (error.response?.data?.msg) {
      // 后端返回的格式：{ code: 500, msg: "手机号格式不正确", data: null }
      errorMessage = error.response.data.msg
    }
    else if (error.response?.data?.message) {
      // 尝试其他可能的字段名
      errorMessage = error.response.data.message
    }
    else if (error.data?.msg) {
      // 直接在error.data中
      errorMessage = error.data.msg
    }
    else if (error.msg) {
      // 直接在error中
      errorMessage = error.msg
    }
    else if (error.message) {
      // 网络错误或其他类型错误
      errorMessage = error.message
    }

    alert(errorMessage)
  }
  finally {
    submitLoading.value = false
  }
}

// URL验证函数 - 支持带协议和不带协议的链接
const isValidUrl = (url: string): boolean => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl)
    return false

  try {
    // 首先尝试直接验证URL（适用于带协议的链接）
    new URL(trimmedUrl)
    return true
  }
  catch {
    try {
      // 如果直接验证失败，尝试加上https://前缀（适用于不带协议的链接）
      new URL(`https://${trimmedUrl}`)
      return true
    }
    catch {
      return false
    }
  }
}

// 自定义字段验证函数（用于完成注册时的额外验证）
const validateCustomFields = () => {
  // 检查技能标签数量
  if (selectedSkillTags.value.length > 15) {
    alert('技能标签最多只能选择15个，请重新选择')
    return false
  }

  // 检查社交链接格式（HTML5无法验证动态添加的字段）
  for (const link of socialLinks.value) {
    if (link.url && link.url.trim()) {
      if (!isValidUrl(link.url.trim())) {
        alert(`社交链接"${link.platform || '未命名'}"的网址格式不正确`)
        return false
      }
    }
  }

  return true
}

// 基础字段验证函数（用于稍后完善时的alert提示）
const validateBasicFields = () => {
  // 检查姓名
  if (!formData.designerName?.trim()) {
    alert('请至少填写姓名')
    return false
  }

  // 检查技能标签数量（如果已选择）
  if (selectedSkillTags.value.length > 15) {
    alert('技能标签最多只能选择15个，请重新选择')
    return false
  }

  // 检查手机号格式（如果已填写）
  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone.trim())) {
      alert('手机号格式不正确，请输入11位有效手机号')
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

  // 检查作品集链接格式（如果已填写）
  if (formData.portfolioUrl && formData.portfolioUrl.trim()) {
    if (!isValidUrl(formData.portfolioUrl.trim())) {
      alert('作品集链接格式不正确，请输入有效的网址')
      return false
    }
  }

  // 检查社交链接格式（如果已填写）
  for (const link of socialLinks.value) {
    if (link.url && link.url.trim()) {
      if (!isValidUrl(link.url.trim())) {
        alert(`社交链接"${link.platform || '未命名'}"的网址格式不正确`)
        return false
      }
    }
  }

  return true
}

// 确认跳过
const confirmSkip = async () => {
  // 先验证已填写的基础字段，验证失败时保持弹窗打开
  if (!validateBasicFields()) {
    // 验证失败，不关闭弹窗，让用户看到错误提示并修正
    return
  }

  // 验证通过后才关闭弹窗
  showSkipModal.value = false

  try {
    submitLoading.value = true

    // 构建只包含已填写且有效字段的数据
    const minimalData: DesignerRegistration = {
      designerName: formData.designerName.trim(),
    }

    // 添加已填写的可选字段
    if (formData.phone && formData.phone.trim())
      minimalData.phone = formData.phone.trim()

    if (formData.email && formData.email.trim())
      minimalData.email = formData.email.trim()

    if (formData.gender)
      minimalData.gender = formData.gender

    if (formData.birthDate)
      minimalData.birthDate = formData.birthDate

    // 添加作品集链接（如果已填写）
    if (formData.portfolioUrl && formData.portfolioUrl.trim())
      minimalData.portfolioUrl = formData.portfolioUrl.trim()

    // 添加个人简介（如果已填写）
    if (formData.description && formData.description.trim())
      minimalData.description = formData.description.trim()

    // 添加头像（如果已选择）
    if (formData.avatar && formData.avatar.trim())
      minimalData.avatar = formData.avatar.trim()

    // 添加工作年限
    if (formData.workYears !== undefined)
      minimalData.workYears = formData.workYears

    // 添加职业类型（如果已选择）
    if (formData.profession)
      minimalData.profession = formData.profession

    // 添加工作状态（如果已选择）
    if (formData.workStatus)
      minimalData.workStatus = formData.workStatus

    // 添加技能标签（如果已选择）
    if (selectedSkillTags.value.length > 0)
      minimalData.skillTags = JSON.stringify(selectedSkillTags.value)

    // 处理社交链接（如果已填写）
    if (socialLinks.value.length > 0) {
      const socialLinksData: Record<string, string> = {}
      socialLinks.value.forEach((link) => {
        if (link.platform && link.url.trim())
          socialLinksData[link.platform] = link.url.trim()
      })

      if (Object.keys(socialLinksData).length > 0)
        minimalData.socialLinks = JSON.stringify(socialLinksData)
    }

    await registerDesigner(minimalData)
    alert('注册成功！您可以稍后完善详细信息')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  }
  catch (error: any) {
    // 解析后端返回的错误信息
    let errorMessage = '注册失败，请重试'

    if (error.response?.data?.msg) {
      // 后端返回的格式：{ code: 500, msg: "手机号格式不正确", data: null }
      errorMessage = error.response.data.msg
    }
    else if (error.response?.data?.message) {
      // 尝试其他可能的字段名
      errorMessage = error.response.data.message
    }
    else if (error.data?.msg) {
      // 直接在error.data中
      errorMessage = error.data.msg
    }
    else if (error.msg) {
      // 直接在error中
      errorMessage = error.msg
    }
    else if (error.message) {
      // 网络错误或其他类型错误
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
  const mockDataStr = localStorage.getItem('mockDesignerData')
  if (mockDataStr) {
    try {
      const mockData = JSON.parse(mockDataStr)
      Object.assign(formData, mockData)

      if (mockData.skillTags && Array.isArray(mockData.skillTags))
        selectedSkillTags.value = mockData.skillTags

      // 加载社交链接数据
      if (mockData.socialLinks) {
        try {
          const socialLinksData = typeof mockData.socialLinks === 'string'
            ? JSON.parse(mockData.socialLinks)
            : mockData.socialLinks

          socialLinks.value = Object.entries(socialLinksData).map(([platform, url], index) => ({
            platform,
            url: url as string,
            id: (Date.now() + index).toString(),
          }))
        }
        catch (error) {
          console.error('加载社交链接数据失败:', error)
        }
      }
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
          🎨 设计师身份注册
        </h1>
        <p class="text-gray-200 mb-1 header-text">
          完善您的设计师档案，开启专业设计之旅
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
                    <i class="ri-user-line" />
                  </div>
                  基础信息
                </h2>

                <!-- 姓名 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">
                    姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.designerName" type="text"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.designerName },
                    ]"
                    placeholder="请输入您的姓名"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 头像上传与工作状态 -->
                <div class="mb-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- 头像上传 -->
                    <div>
                      <label class="block text-gray-300 mb-2">头像</label>
                      <div class="flex items-center">
                        <div
                          class="w-16 h-16 rounded-full overflow-hidden bg-gray-800 avatar-upload flex items-center justify-center mr-4" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.avatar },
                          ]"
                          :style="avatarStyle"
                        />
                        <button
                          type="button" class="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors rounded-button whitespace-nowrap" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.avatar },
                          ]"
                          @click="() => { handleAvatarUpload(); clearHighlights() }"
                        >
                          {{ formData.avatar ? '更换图片' : '选择图片' }}
                        </button>
                      </div>
                    </div>

                    <!-- 工作状态 -->
                    <div>
                      <label class="block text-gray-300 mb-2">工作状态</label>
                      <div class="relative">
                        <div
                          class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer" :class="[
                            { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.workStatus },
                          ]"
                          @click="toggleWorkStatusDropdown"
                        >
                          <span>{{ workStatusText }}</span>
                          <i class="ri-arrow-down-s-line" />
                        </div>
                        <div
                          v-show="showWorkStatusDropdown"
                          class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg"
                        >
                          <div
                            v-for="option in workStatusOptions" :key="option.value" class="py-2 px-4 hover:bg-gray-800 cursor-pointer"
                            @click="selectWorkStatus(option)"
                          >
                            {{ option.label }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 性别和出生日期 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-gray-300 mb-2">性别</label>
                    <div class="relative">
                      <div
                        class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer" :class="[
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.gender },
                        ]"
                        @click="toggleGenderDropdown"
                      >
                        <span>{{ genderText }}</span>
                        <i class="ri-arrow-down-s-line" />
                      </div>
                      <div
                        v-show="showGenderDropdown"
                        class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg"
                      >
                        <div
                          v-for="option in genderOptions" :key="option.value" class="py-2 px-4 hover:bg-gray-800 cursor-pointer"
                          @click="selectGender(option)"
                        >
                          {{ option.label }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-300 mb-2">出生日期</label>
                    <div class="relative">
                      <input
                        v-model="formData.birthDate" type="date" class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary date-input" :class="[
                          { 'has-clear-button': formData.birthDate },
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.birthDate },
                        ]" @focus="clearHighlights"
                      >
                      <button
                        v-if="formData.birthDate" type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white transition-colors"
                        title="清空日期"
                        @click="clearBirthDate"
                      >
                        <i class="ri-close-line text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 手机号和邮箱 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">手机号</label>
                  <input
                    v-model="formData.phone" type="tel"
                    pattern="^1[3-9]\d{9}$"
                    title="请输入11位手机号码"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.phone },
                    ]"
                    placeholder="请输入您的手机号码"
                    @focus="clearHighlights"
                  >
                </div>
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">邮箱</label>
                  <input
                    v-model="formData.email" type="email"
                    title="请输入有效的邮箱地址"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.email },
                    ]"
                    placeholder="请输入您的邮箱地址"
                    @focus="clearHighlights"
                  >
                </div>
              </div>
            </div>

            <!-- 右栏：专业信息 -->
            <div>
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                  <div
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mr-2"
                  >
                    <i class="ri-briefcase-line" />
                  </div>
                  专业信息
                </h2>

                <!-- 职业类型 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">职业类型</label>
                  <div class="relative">
                    <div
                      class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 flex justify-between items-center cursor-pointer" :class="[
                        { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.profession },
                      ]"
                      @click="toggleJobTypeDropdown"
                    >
                      <span>{{ jobTypeText }}</span>
                      <i class="ri-arrow-down-s-line" />
                    </div>
                    <div
                      v-show="showJobTypeDropdown"
                      class="absolute z-10 w-full mt-1 bg-[rgb(28,28,30)] border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="option in jobTypeOptions" :key="option.value" class="py-2 px-4 hover:bg-gray-800 cursor-pointer"
                        @click="selectJobType(option)"
                      >
                        {{ option.label }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 工作年限 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">工作年限</label>
                  <div
                    class="flex items-center p-2 rounded" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.workYears },
                    ]"
                  >
                    <input
                      v-model="formData.workYears" type="range" min="0" max="20"
                      class="flex-1 mr-4 custom-range" :class="[
                        { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.workYears },
                      ]"
                      @focus="clearHighlights" @input="clearHighlights"
                    >
                    <span class="text-white font-medium w-8">{{ formData.workYears }}</span>
                    <span class="text-gray-400 ml-1">年</span>
                  </div>
                </div>

                <!-- 技能标签 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">
                    技能标签
                    <span class="text-sm text-gray-400 ml-2">(最多选择15个)</span>
                  </label>
                  <div class="relative mb-2">
                    <div
                      class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 cursor-pointer hover:border-primary transition-colors flex items-center justify-between" :class="[
                        { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.skillTags },
                      ]"
                      @click="() => { showSkillTagSelector = true; clearHighlights() }"
                    >
                      <span v-if="selectedSkillTags.length === 0" class="text-gray-400">
                        点击选择技能标签
                      </span>
                      <span v-else class="text-white">
                        已选择 {{ selectedSkillTags.length }} 个标签
                        <span class="text-sm text-gray-400 ml-2">
                          |
                          <span class="text-blue-400">{{ selectedTagsByCategory.tool.length }}</span> 工具
                          <span class="text-purple-400 ml-1">{{ selectedTagsByCategory.field.length }}</span> 领域
                          <span class="text-pink-400 ml-1">{{ selectedTagsByCategory.skill.length }}</span> 技能
                        </span>
                      </span>
                      <i class="ri-arrow-down-s-line text-gray-400" />
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2" :class="[selectedSkillTags.length > 0 ? 'min-h-8' : 'h-0']">
                    <span
                      v-for="tag in sortedSelectedTags" :key="tag"
                      class="inline-flex items-center" :class="[getSkillTagClasses(tag)]"
                    >
                      {{ getSkillTagDisplayName(tag) }}
                      <button
                        type="button" class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20"
                        @click="removeSkillTag(tag)"
                      >
                        <i class="ri-close-line text-xs" />
                      </button>
                    </span>
                  </div>
                </div>

                <!-- 个人简介 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">个人简介</label>
                  <textarea
                    v-model="formData.description"
                    class="w-full h-24 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.description },
                    ]"
                    placeholder="请简要介绍您的设计经历、专长和风格特点"
                    @focus="clearHighlights"
                  />
                </div>

                <!-- 作品集链接 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">作品集链接</label>
                  <input
                    v-model="formData.portfolioUrl" type="url"
                    title="请输入完整的网址，如 https://example.com"
                    class="w-full bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 glow-input focus:outline-none focus:border-primary" :class="[
                      { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.portfolioUrl },
                    ]"
                    placeholder="请输入您的作品集网址（如 Behance、Dribbble 等）"
                    @focus="clearHighlights"
                  >
                </div>

                <!-- 个人链接 -->
                <div class="mb-4">
                  <label class="block text-gray-300 mb-2">个人链接</label>
                  <p class="text-gray-500 text-sm mb-3">
                    添加您的个人网站或在线作品展示平台
                  </p>
                  <div
                    class="space-y-3 rounded border" :class="[
                      highlightIncompleteFields && incompleteFields.socialLinks
                        ? 'border-blue-500 bg-blue-500/5 highlight-incomplete'
                        : 'border-transparent',
                    ]"
                  >
                    <div v-for="(link, index) in socialLinks" :key="link.id" class="flex items-center gap-3">
                      <!-- 网站名称输入框 -->
                      <input
                        v-model="link.platform" type="text" placeholder="网站名称"
                        class="w-32 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-3 py-3 social-link-input focus:outline-none focus:border-primary" :class="[
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.socialLinks },
                        ]"
                        @focus="clearHighlights"
                      >

                      <!-- URL输入框 -->
                      <input
                        v-model="link.url" type="url" placeholder="请输入网站链接地址"
                        class="flex-1 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-3 social-link-input focus:outline-none focus:border-primary" :class="[
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.socialLinks },
                        ]"
                        @focus="clearHighlights"
                      >

                      <!-- 删除按钮 -->
                      <button
                        type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 social-remove-btn"
                        title="删除链接"
                        @click="removeSocialLink(link.id)"
                      >
                        <i class="ri-close-line text-sm" />
                      </button>
                    </div>

                    <!-- 添加链接按钮 -->
                    <div class="flex gap-2">
                      <button
                        type="button" class="flex-1 bg-[rgba(28,28,30,0.8)] border border-gray-700 rounded text-white px-4 py-2 flex items-center justify-center hover:bg-gray-700 transition-colors text-sm" :class="[
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.socialLinks },
                        ]"
                        @click="() => { addSocialLink(); clearHighlights() }"
                      >
                        <i class="ri-add-line mr-2" />
                        添加链接
                      </button>
                      <button
                        v-if="socialLinks.length === 0" type="button" class="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded text-blue-400 hover:bg-blue-500/30 transition-colors text-sm whitespace-nowrap" :class="[
                          { 'highlight-incomplete': highlightIncompleteFields && incompleteFields.socialLinks },
                        ]"
                        title="添加示例数据"
                        @click="() => { addSampleSocialLinks(); clearHighlights() }"
                      >
                        <i class="ri-lightbulb-line mr-1" />
                        示例
                      </button>
                    </div>
                  </div>
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
                  我们将严格保护您的个人信息安全，未经您的许可不会向第三方透露
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
            您选择暂不完善选填信息。完善的个人资料有助于：<br>
            • 获得更多工作机会推荐<br>
            • 提升档案在搜索中的排名<br>
            • 展示专业能力和经验
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

    <!-- 技能标签选择器 -->
    <SkillTagSelector
      v-model:visible="showSkillTagSelector" v-model="selectedSkillTags"
      @confirm="handleSkillTagConfirm"
    />
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

/* 头像上传区域高亮效果 */
.avatar-upload.highlight-incomplete {
  border: 2px solid rgba(10, 132, 255, 0.8) !important;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.5) !important;
}

/* 自定义滑块高亮效果 */
.custom-range.highlight-incomplete {
  background: rgba(10, 132, 255, 0.3) !important;
}

.custom-range.highlight-incomplete::-webkit-slider-thumb {
  background: linear-gradient(90deg, #007AFF, #AF52DE) !important;
}

.custom-range.highlight-incomplete::-moz-range-thumb {
  background: linear-gradient(90deg, #007AFF, #AF52DE) !important;
}

/* 头像上传 */
.avatar-upload {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 4v16m8-8H4'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
}

/* 自定义滑块 */
.custom-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(99, 99, 102, 0.3);
  border-radius: 3px;
  outline: none;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(90deg, #007AFF, #AF52DE);
  cursor: pointer;
}

.custom-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(90deg, #007AFF, #AF52DE);
  cursor: pointer;
  border: none;
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

/* 技能标签样式已移至全局CSS文件 skill-tags.css */

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

/* 日期选择器自定义白色图标 */
.date-input {
  color-scheme: dark;
  /* height: 48px; 明确设置高度，与其他输入框保持一致 */
  line-height: 1.5; /* 确保文本垂直居中 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 12px) center;
  background-size: 16px;
}

/* 当有清空按钮时，调整日历图标位置 */
.date-input.has-clear-button {
  background-position: calc(100% - 40px) center;
  padding-right: 36px;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 当有清空按钮时，调整日历选择器位置 */
.date-input.has-clear-button::-webkit-calendar-picker-indicator {
  right: 40px;
}

/* 社交链接样式 */
.social-link-input {
  transition: all 0.2s ease;
}

.social-link-input:focus {
  border-color: #0a84ff;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2);
}

.social-remove-btn {
  transition: all 0.2s ease;
}

.social-remove-btn:hover {
  transform: scale(1.1);
}
</style>
