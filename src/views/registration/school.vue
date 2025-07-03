<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-30"></div>
      <div class="container mx-auto px-10 relative z-10">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2 text-white">🎓 院校身份注册</h1>
          <p class="text-gray-300 max-w-2xl mx-auto">完善您的院校信息，展示教育成果</p>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 注册表单卡片 -->
        <div class="glass-card rounded-lg glow-border p-6 md:p-8 max-w-4xl mx-auto">

          <!-- 进度指示器 -->
          <div class="flex items-center justify-center mb-8">
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">1</div>
              <div class="w-12 h-0.5 bg-gray-700"></div>
              <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">2</div>
              <div class="w-12 h-0.5 bg-gray-700"></div>
              <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">3</div>
            </div>
          </div>

          <!-- 注册模式选择 -->
          <div class="flex justify-center mb-8">
            <div class="flex bg-gray-800/50 rounded-lg p-1">
              <button
                @click="registrationMode = 'simple'"
                :class="['px-4 py-2 rounded-md text-sm font-medium transition-all',
                        registrationMode === 'simple' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white']">
                极简注册
              </button>
              <button
                @click="registrationMode = 'complete'"
                :class="['px-4 py-2 rounded-md text-sm font-medium transition-all',
                        registrationMode === 'complete' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white']">
                完整注册
              </button>
            </div>
          </div>

          <!-- 表单内容 -->
          <n-form ref="formRef" :model="formData" :rules="rules" :show-label="false">
            <!-- 院校信息区块 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- 左侧：基本信息 -->
              <div class="space-y-6">
                <div class="flex items-center mb-4">
                  <i class="ri-school-line ri-lg text-gradient mr-2"></i>
                  <h3 class="text-lg font-medium text-white">基本信息</h3>
                </div>

                <!-- 院校名称 - 必填 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    院校名称 <span class="text-red-400">*</span>
                  </label>
                  <n-form-item path="schoolName">
                    <n-input
                      v-model:value="formData.schoolName"
                      class="custom-input w-full"
                      placeholder="请输入院校名称"
                      clearable
                    />
                  </n-form-item>
                </div>

                <!-- 院校LOGO -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">院校LOGO</label>
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden company-logo">
                      <img v-if="formData.logo" :src="formData.logo" class="w-full h-full object-cover">
                      <i v-else class="ri-school-line text-2xl text-gray-400"></i>
                    </div>
                    <n-upload
                      :max="1"
                      list-type="image"
                      :on-finish="handleLogoUpload"
                    >
                      <n-button secondary>选择LOGO</n-button>
                    </n-upload>
                  </div>
                </div>

                <!-- 院校类型和办学层次 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      院校类型 <span v-if="registrationMode === 'complete'" class="text-red-400">*</span>
                    </label>
                    <n-select
                      v-model:value="formData.schoolType"
                      class="custom-select w-full"
                      placeholder="请选择类型"
                      :options="schoolTypeOptions"
                      clearable
                    />
                  </div>
                  <div v-if="registrationMode === 'complete'">
                    <label class="block text-sm font-medium text-gray-300 mb-2">办学层次</label>
                    <n-select
                      v-model:value="formData.level"
                      class="custom-select w-full"
                      placeholder="请选择层次"
                      :options="levelOptions"
                      clearable
                    />
                  </div>
                </div>

                <!-- 特殊标识 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-3">特殊标识</label>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-300">985院校</span>
                      <n-switch v-model:value="formData.is985" />
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-300">211院校</span>
                      <n-switch v-model:value="formData.is211" />
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-300">双一流院校</span>
                      <n-switch v-model:value="formData.isDoubleFirst" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧：联系信息 -->
              <div class="space-y-6">
                <div class="flex items-center mb-4">
                  <i class="ri-contacts-line ri-lg text-gradient mr-2"></i>
                  <h3 class="text-lg font-medium text-white">联系信息</h3>
                </div>

                <!-- 院校地址 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">院校地址</label>
                  <n-input
                    v-model:value="formData.address"
                    class="custom-input w-full"
                    placeholder="请输入院校地址"
                    clearable
                  />
                </div>

                <!-- 联系方式 -->
                <div v-if="registrationMode === 'complete'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">联系电话</label>
                    <n-form-item path="phone">
                      <n-input
                        v-model:value="formData.phone"
                        class="custom-input w-full"
                        placeholder="请输入联系电话"
                        clearable
                      />
                    </n-form-item>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">院校邮箱</label>
                    <n-form-item path="email">
                      <n-input
                        v-model:value="formData.email"
                        class="custom-input w-full"
                        placeholder="请输入院校邮箱"
                        clearable
                      />
                    </n-form-item>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">官方网站</label>
                    <n-input
                      v-model:value="formData.website"
                      class="custom-input w-full"
                      placeholder="请输入官方网站"
                      clearable
                    />
                  </div>
                </div>

                <!-- 院校简介 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">院校简介</label>
                  <n-input
                    v-model:value="formData.description"
                    type="textarea"
                    class="custom-input w-full"
                    :rows="5"
                    placeholder="简单介绍一下院校的办学特色、专业优势和教学理念..."
                  />
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-center space-x-4 pt-6 border-t border-gray-700">
              <n-button @click="goBack" class="secondary-button px-8 py-3">
                返回角色选择
              </n-button>
              <n-button @click="skipForNow" class="secondary-button px-8 py-3">
                稍后完善
              </n-button>
              <n-button
                type="primary"
                @click="submitRegistration"
                :loading="submitLoading"
                class="neon-button px-8 py-3"
              >
                {{ registrationMode === 'simple' ? '快速注册' : '完成注册' }}
              </n-button>
            </div>
          </n-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  NUpload,
  NSwitch
} from 'naive-ui'
import { registerSchool, type SchoolRegistration, type SchoolType, type SchoolLevel } from '@/api/talent/registration'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const router = useRouter()
const message = useMessage()

// 注册模式
const registrationMode = ref<'simple' | 'complete'>('simple')

// 表单数据
const formData = reactive<SchoolRegistration & { is985?: boolean; is211?: boolean; isDoubleFirst?: boolean }>({
  schoolName: '',
  logo: '',
  schoolType: undefined,
  level: undefined,
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  is985: false,
  is211: false,
  isDoubleFirst: false
})

// 提交状态
const submitLoading = ref(false)

// 院校类型选项
const schoolTypeOptions = [
  { label: '综合性院校', value: 'COMPREHENSIVE' },
  { label: '艺术类院校', value: 'ART' },
  { label: '工程类院校', value: 'ENGINEERING' },
  { label: '师范类院校', value: 'NORMAL' },
  { label: '财经类院校', value: 'FINANCE' }
]

// 办学层次选项
const levelOptions = [
  { label: '本科教育', value: 'UNDERGRADUATE' },
  { label: '研究生教育', value: 'GRADUATE' },
  { label: '职业教育', value: 'VOCATIONAL' }
]

// 表单验证规则
const rules = {
  schoolName: [
    { required: true, message: '请输入院校名称', trigger: 'blur' },
    { min: 2, max: 100, message: '院校名称长度应为2-100个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^(0\d{2,3}-?\d{7,8}|1[3-9]\d{9})$/, message: '请输入正确的联系电话', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 处理LOGO上传
const handleLogoUpload = ({ file, event }: any) => {
  console.log('LOGO上传:', file)
  // 这里应该实现真实的文件上传逻辑
  // formData.logo = '上传后的URL'
}

// 返回角色选择
const goBack = () => {
  router.push('/role-selection')
}

// 稍后完善（极简注册）
const skipForNow = async () => {
  if (!formData.schoolName) {
    message.error('请至少填写院校名称')
    return
  }

  try {
    submitLoading.value = true

    // 只提交院校名称，其他字段为空
    const minimalData: SchoolRegistration = {
      schoolName: formData.schoolName
    }

    await registerSchool(minimalData)
    message.success('注册成功！您可以稍后完善详细信息')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  } catch (error: any) {
    message.error(error.message || '注册失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 完整注册
const submitRegistration = async () => {
  if (!formData.schoolName) {
    message.error('请填写院校名称')
    return
  }

  try {
    submitLoading.value = true

    // 提取标准字段提交
    const submitData: SchoolRegistration = {
      schoolName: formData.schoolName,
      logo: formData.logo,
      schoolType: formData.schoolType,
      level: formData.level,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      description: formData.description
    }

    await registerSchool(submitData)
    message.success('注册成功！')

    // 清除测试数据
    localStorage.removeItem('mockSchoolData')

    // 跳转到欢迎页面
    router.push('/profile/welcome')
  } catch (error: any) {
    message.error(error.message || '注册失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 加载Mock测试数据
const loadMockData = () => {
  const mockDataStr = localStorage.getItem('mockSchoolData')
  if (mockDataStr) {
    try {
      const mockData = JSON.parse(mockDataStr)

      // 填充表单数据
      Object.assign(formData, mockData)

      // 自动切换到完整注册模式
      registrationMode.value = 'complete'

      message.info('已加载测试数据，可直接测试注册功能')
    } catch (error) {
      console.error('加载Mock数据失败:', error)
    }
  }
}

// 初始化
loadMockData()
</script>

<style scoped>
@import '@/styles/talent.css';

.bg-primary {
  background: linear-gradient(45deg, #007AFF, #AF52DE);
}

.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-logo {
  border: 1px solid rgba(99, 99, 102, 0.2);
}
</style>
