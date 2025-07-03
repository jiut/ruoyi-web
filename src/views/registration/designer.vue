<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-30"></div>
      <div class="container mx-auto px-10 relative z-10">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2 text-white">🎨 设计师身份注册</h1>
          <p class="text-gray-300 max-w-2xl mx-auto">完善您的设计师档案，开启专业设计之旅</p>
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
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">1</div>
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
            <!-- 基础信息区块 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- 左侧：基本信息 -->
              <div class="space-y-6">
                <div class="flex items-center mb-4">
                  <i class="ri-user-line ri-lg text-gradient mr-2"></i>
                  <h3 class="text-lg font-medium text-white">基础信息</h3>
                </div>

                <!-- 姓名 - 必填 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    姓名 <span class="text-red-400">*</span>
                  </label>
                  <n-form-item path="designerName">
                    <n-input
                      v-model:value="formData.designerName"
                      class="custom-input w-full"
                      placeholder="请输入您的姓名"
                      clearable
                    />
                  </n-form-item>
                </div>

                <!-- 头像上传 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">头像上传</label>
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img v-if="formData.avatar" :src="formData.avatar" class="w-full h-full object-cover">
                      <i v-else class="ri-user-line text-2xl text-gray-400"></i>
                    </div>
                    <n-upload
                      :max="1"
                      list-type="image"
                      :on-finish="handleAvatarUpload"
                    >
                      <n-button secondary>选择图片</n-button>
                    </n-upload>
                  </div>
                </div>

                <!-- 性别和出生日期 -->
                <div v-if="registrationMode === 'complete'" class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">性别</label>
                    <n-radio-group v-model:value="formData.gender" name="gender">
                      <n-space>
                        <n-radio value="0">男</n-radio>
                        <n-radio value="1">女</n-radio>
                        <n-radio value="2">其他</n-radio>
                      </n-space>
                    </n-radio-group>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">出生日期</label>
                    <n-date-picker
                      v-model:value="formData.birthDate"
                      type="date"
                      placeholder="请选择出生日期"
                      class="w-full custom-input"
                    />
                  </div>
                </div>

                <!-- 联系方式 -->
                <div v-if="registrationMode === 'complete'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">手机号</label>
                    <n-form-item path="phone">
                      <n-input
                        v-model:value="formData.phone"
                        class="custom-input w-full"
                        placeholder="请输入手机号"
                        clearable
                      />
                    </n-form-item>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
                    <n-form-item path="email">
                      <n-input
                        v-model:value="formData.email"
                        class="custom-input w-full"
                        placeholder="请输入邮箱地址"
                        clearable
                      />
                    </n-form-item>
                  </div>
                </div>
              </div>

              <!-- 右侧：专业信息 -->
              <div class="space-y-6">
                <div class="flex items-center mb-4">
                  <i class="ri-briefcase-line ri-lg text-gradient mr-2"></i>
                  <h3 class="text-lg font-medium text-white">专业信息</h3>
                </div>

                <!-- 职业类型 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    职业类型 <span v-if="registrationMode === 'complete'" class="text-red-400">*</span>
                  </label>
                  <n-select
                    v-model:value="formData.profession"
                    class="custom-select w-full"
                    placeholder="请选择职业类型"
                    :options="professionOptions"
                    clearable
                  />
                </div>

                <!-- 工作年限 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">工作年限</label>
                  <div class="flex items-center space-x-4">
                    <n-slider
                      v-model:value="formData.workYears"
                      :min="0"
                      :max="20"
                      class="flex-1"
                      :format-tooltip="(value) => `${value}年`"
                    />
                    <span class="text-sm text-gray-400 min-w-[60px]">{{ formData.workYears || 0 }}年</span>
                  </div>
                </div>

                <!-- 技能标签 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">技能标签</label>
                  <div class="space-y-3">
                    <n-input
                      v-model:value="newSkillTag"
                      @keypress.enter="addSkillTag"
                      class="custom-input w-full"
                      placeholder="输入技能标签，按回车添加"
                    />
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(skill, index) in skillTags"
                        :key="index"
                        class="skill-tag ui-ux selected flex items-center"
                      >
                        {{ skill }}
                        <button @click="removeSkillTag(index)" class="ml-2 text-xs">✕</button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 个人简介 -->
                <div v-if="registrationMode === 'complete'">
                  <label class="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
                  <n-input
                    v-model:value="formData.description"
                    type="textarea"
                    class="custom-input w-full"
                    :rows="4"
                    placeholder="简单介绍一下您的设计经验和专业特长..."
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
  NRadioGroup,
  NRadio,
  NSpace,
  NDatePicker,
  NUpload,
  NSlider
} from 'naive-ui'
import { registerDesigner, type DesignerRegistration, type DesignerProfession } from '@/api/talent/registration'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const router = useRouter()
const message = useMessage()

// 注册模式
const registrationMode = ref<'simple' | 'complete'>('simple')

// 表单数据
const formData = reactive<DesignerRegistration>({
  designerName: '',
  avatar: '',
  gender: undefined,
  birthDate: undefined,
  phone: '',
  email: '',
  profession: undefined,
  skillTags: '',
  workYears: 0,
  description: ''
})

// 技能标签
const skillTags = ref<string[]>([])
const newSkillTag = ref('')

// 提交状态
const submitLoading = ref(false)

// 职业选项
const professionOptions = [
  { label: '插画师', value: 'ILLUSTRATOR' },
  { label: '交互设计师', value: 'INTERACTION_DESIGNER' },
  { label: '品牌设计师', value: 'BRAND_DESIGNER' },
  { label: 'UI设计师', value: 'UI_DESIGNER' },
  { label: 'UX设计师', value: 'UX_DESIGNER' },
  { label: 'UI/UX设计师', value: 'UI_UX_DESIGNER' },
  { label: '视觉设计师', value: 'VISUAL_DESIGNER' },
  { label: '3D设计师', value: 'THREE_D_DESIGNER' },
  { label: '平面设计师', value: 'GRAPHIC_DESIGNER' },
  { label: '产品设计师', value: 'PRODUCT_DESIGNER' },
  { label: '动效设计师', value: 'MOTION_DESIGNER' }
]

// 表单验证规则
const rules = {
  designerName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 处理头像上传
const handleAvatarUpload = ({ file, event }: any) => {
  console.log('头像上传:', file)
  // 这里应该实现真实的文件上传逻辑
  // formData.avatar = '上传后的URL'
}

// 添加技能标签
const addSkillTag = () => {
  if (newSkillTag.value.trim() && !skillTags.value.includes(newSkillTag.value.trim())) {
    skillTags.value.push(newSkillTag.value.trim())
    newSkillTag.value = ''
  }
}

// 删除技能标签
const removeSkillTag = (index: number) => {
  skillTags.value.splice(index, 1)
}

// 返回角色选择
const goBack = () => {
  router.push('/role-selection')
}

// 稍后完善（极简注册）
const skipForNow = async () => {
  if (!formData.designerName) {
    message.error('请至少填写姓名')
    return
  }

  try {
    submitLoading.value = true

    // 只提交姓名，其他字段为空
    const minimalData: DesignerRegistration = {
      designerName: formData.designerName
    }

    await registerDesigner(minimalData)
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
  if (!formData.designerName) {
    message.error('请填写姓名')
    return
  }

  try {
    submitLoading.value = true

    // 处理技能标签
    formData.skillTags = JSON.stringify(skillTags.value)

    await registerDesigner(formData)
    message.success('注册成功！')

    // 清除测试数据
    localStorage.removeItem('mockDesignerData')

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
  const mockDataStr = localStorage.getItem('mockDesignerData')
  if (mockDataStr) {
    try {
      const mockData = JSON.parse(mockDataStr)

      // 填充表单数据
      Object.assign(formData, mockData)

      // 处理技能标签
      if (mockData.skillTags && Array.isArray(mockData.skillTags)) {
        skillTags.value = [...mockData.skillTags]
      }

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
</style>
