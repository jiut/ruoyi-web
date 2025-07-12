<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import TalentHeader from '@/components/talent/TalentHeader.vue'

const router = useRouter()
const message = useMessage()

// 响应式数据
const apiTesting = ref(false)
const apiTestResult = ref<any>(null)

// Mock数据
const mockData = reactive({
  designer: {
    designerName: '张三',
    gender: '0',
    birthDate: '1995-05-15',
    phone: '13812345678',
    email: 'zhangsan@example.com',
    profession: 'UI_DESIGNER',
    workYears: 3,
    skillTags: ['UI设计', 'Figma', 'Sketch', 'Photoshop'],
    description: '具有3年UI设计经验，擅长移动端界面设计和用户体验优化。',
  },
  enterprise: {
    enterpriseName: '创新科技有限公司',
    industry: '互联网',
    scale: '100-500人',
    address: '北京市朝阳区科技园区',
    phone: '010-12345678',
    email: 'hr@innovation-tech.com',
    website: 'https://www.innovation-tech.com',
    description: '专注于移动互联网产品开发，为用户提供优质的数字化解决方案。',
  },
  school: {
    schoolName: '北京设计学院',
    schoolType: 'ART',
    level: 'UNDERGRADUATE',
    address: '北京市海淀区学院路',
    phone: '010-87654321',
    email: 'info@bda.edu.cn',
    website: 'https://www.bda.edu.cn',
    description: '国内知名艺术设计院校，培养高水平设计人才。',
  },
})

// 导航方法
const goToDesignerRegistration = () => {
  router.push('/registration/designer')
}

const goToEnterpriseRegistration = () => {
  router.push('/registration/enterprise')
}

const goToSchoolRegistration = () => {
  router.push('/registration/school')
}

// Mock数据生成方法
const generateAllMockData = () => {
  generateDesignerMockData()
  generateEnterpriseMockData()
  generateSchoolMockData()
  message.success('已生成所有Mock数据')
}

const clearAllMockData = () => {
  Object.keys(mockData.designer).forEach((key) => {
    if (key === 'skillTags')
      mockData.designer[key] = []
    else
      mockData.designer[key] = ''
  })
  Object.keys(mockData.enterprise).forEach((key) => {
    mockData.enterprise[key] = ''
  })
  Object.keys(mockData.school).forEach((key) => {
    mockData.school[key] = ''
  })
  message.success('已清空所有Mock数据')
}

const generateDesignerMockData = () => {
  const names = ['李设计', '王创意', '张美工', '刘视觉', '陈UI']
  const professions = ['UI_DESIGNER', 'UX_DESIGNER', 'VISUAL_DESIGNER', 'PRODUCT_DESIGNER']
  const skills = [
    ['UI设计', 'Figma', 'Sketch'],
    ['用户研究', 'Axure', 'Principle'],
    ['品牌设计', 'AI', 'PS'],
    ['交互设计', 'Framer', 'XD'],
  ]

  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomProfession = professions[Math.floor(Math.random() * professions.length)]
  const randomSkills = skills[Math.floor(Math.random() * skills.length)]

  mockData.designer.designerName = randomName
  mockData.designer.profession = randomProfession
  mockData.designer.skillTags = randomSkills
  mockData.designer.workYears = Math.floor(Math.random() * 10) + 1
  mockData.designer.email = `${randomName.toLowerCase()}@example.com`
  mockData.designer.phone = `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
}

const generateEnterpriseMockData = () => {
  const companies = ['创新科技', '数字未来', '智慧设计', '云端创意', '星河科技']
  const industries = ['互联网', '软件开发', '游戏', '电子商务', '智能硬件']
  const scales = ['50-100人', '100-500人', '500-1000人', '1000-5000人']

  const randomCompany = companies[Math.floor(Math.random() * companies.length)]
  const randomIndustry = industries[Math.floor(Math.random() * industries.length)]
  const randomScale = scales[Math.floor(Math.random() * scales.length)]

  mockData.enterprise.enterpriseName = `${randomCompany}有限公司`
  mockData.enterprise.industry = randomIndustry
  mockData.enterprise.scale = randomScale
  mockData.enterprise.email = `hr@${randomCompany.toLowerCase()}.com`
}

const generateSchoolMockData = () => {
  const schools = ['北京设计学院', '上海艺术大学', '广州美术学院', '深圳创意学院', '杭州设计学院']
  const types = ['ART', 'COMPREHENSIVE', 'ENGINEERING']
  const levels = ['UNDERGRADUATE', 'GRADUATE']

  const randomSchool = schools[Math.floor(Math.random() * schools.length)]
  const randomType = types[Math.floor(Math.random() * types.length)]
  const randomLevel = levels[Math.floor(Math.random() * levels.length)]

  mockData.school.schoolName = randomSchool
  mockData.school.schoolType = randomType
  mockData.school.level = randomLevel
  mockData.school.email = `info@${randomSchool.slice(0, 3).toLowerCase()}.edu.cn`
}

// 填充Mock数据到对应页面
const fillDesignerMockData = () => {
  generateDesignerMockData()
  // 这里可以与注册页面通信，填充数据
  localStorage.setItem('mockDesignerData', JSON.stringify(mockData.designer))
  message.success('设计师Mock数据已生成并保存到localStorage')
}

const fillEnterpriseMockData = () => {
  generateEnterpriseMockData()
  localStorage.setItem('mockEnterpriseData', JSON.stringify(mockData.enterprise))
  message.success('企业Mock数据已生成并保存到localStorage')
}

const fillSchoolMockData = () => {
  generateSchoolMockData()
  localStorage.setItem('mockSchoolData', JSON.stringify(mockData.school))
  message.success('院校Mock数据已生成并保存到localStorage')
}

// 复制数据
const copyMockData = async (type: string) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(mockData[type], null, 2))
    message.success('数据已复制到剪贴板')
  }
  catch (err) {
    message.error('复制失败，请手动复制')
  }
}

// API测试方法
const testRegistrationAPI = async (type: 'designer' | 'enterprise' | 'school') => {
  apiTesting.value = true
  try {
    const data = mockData[type]

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 这里应该调用实际的API
    // const response = await registerAPI[type](data)

    // 模拟成功响应
    apiTestResult.value = {
      success: true,
      type,
      data: {
        code: 200,
        message: '注册成功',
        data: { id: Math.floor(Math.random() * 1000) },
      },
    }

    message.success(`${type}注册测试成功`)
  }
  catch (error) {
    apiTestResult.value = {
      success: false,
      type,
      data: error,
    }
    message.error(`${type}注册测试失败`)
  }
  finally {
    apiTesting.value = false
  }
}

// 测试场景方法
const runMinimalRegistrationTest = () => {
  message.info('运行极简注册测试...')
  // 实现极简注册测试逻辑
}

const runCompleteRegistrationTest = () => {
  message.info('运行完整注册测试...')
  // 实现完整注册测试逻辑
}

const runValidationTest = () => {
  message.info('运行字段验证测试...')
  // 实现验证测试逻辑
}

const runDuplicateNameTest = () => {
  message.info('运行重复名称测试...')
  // 实现重复名称测试逻辑
}

const runFullFlowTest = () => {
  message.info('运行流程完整性测试...')
  // 实现完整流程测试逻辑
}

const cleanTestData = () => {
  localStorage.removeItem('mockDesignerData')
  localStorage.removeItem('mockEnterpriseData')
  localStorage.removeItem('mockSchoolData')
  apiTestResult.value = null
  message.success('测试数据已清理')
}

// 快捷测试方法
const testDesignerRegistration = () => testRegistrationAPI('designer')
const testEnterpriseRegistration = () => testRegistrationAPI('enterprise')
const testSchoolRegistration = () => testRegistrationAPI('school')

// 初始化
generateAllMockData()
</script>

<template>
  <div class="talent-page">
    <!-- 统一顶栏 -->
    <TalentHeader />

    <!-- 页面标题区 -->
    <section class="py-6 md:py-12 relative mt-20 md:mt-16">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-30" />
      <div class="container mx-auto px-10 relative z-10">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2 text-white">
            🧪 注册功能测试页面
          </h1>
          <p class="text-gray-300 max-w-2xl mx-auto">
            测试设计师、企业、院校注册功能的开发工具
          </p>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <section class="flex-grow pb-8">
      <div class="container mx-auto px-4">
        <!-- 快速导航区 -->
        <div class="glass-card rounded-lg glow-border p-6 mb-8">
          <div class="flex items-center mb-6">
            <i class="ri-navigation-line ri-lg text-gradient mr-2" />
            <h2 class="text-xl font-bold text-white">
              快速导航
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 设计师注册 -->
            <div class="bg-gray-800/50 rounded-lg p-6 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="ri-palette-line text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-white">
                    设计师注册
                  </h3>
                  <p class="text-sm text-gray-400">
                    测试设计师身份注册
                  </p>
                </div>
              </div>
              <div class="space-y-2">
                <button class="w-full neon-button py-2 px-4 text-sm" @click="goToDesignerRegistration">
                  打开注册页面
                </button>
                <button class="w-full secondary-button py-2 px-4 text-sm" @click="fillDesignerMockData">
                  生成Mock数据
                </button>
              </div>
            </div>

            <!-- 企业注册 -->
            <div class="bg-gray-800/50 rounded-lg p-6 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="ri-building-line text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-white">
                    企业注册
                  </h3>
                  <p class="text-sm text-gray-400">
                    测试企业身份注册
                  </p>
                </div>
              </div>
              <div class="space-y-2">
                <button class="w-full neon-button py-2 px-4 text-sm" @click="goToEnterpriseRegistration">
                  打开注册页面
                </button>
                <button class="w-full secondary-button py-2 px-4 text-sm" @click="fillEnterpriseMockData">
                  生成Mock数据
                </button>
              </div>
            </div>

            <!-- 院校注册 -->
            <div class="bg-gray-800/50 rounded-lg p-6 card-hover">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="ri-school-line text-xl text-white" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-white">
                    院校注册
                  </h3>
                  <p class="text-sm text-gray-400">
                    测试院校身份注册
                  </p>
                </div>
              </div>
              <div class="space-y-2">
                <button class="w-full neon-button py-2 px-4 text-sm" @click="goToSchoolRegistration">
                  打开注册页面
                </button>
                <button class="w-full secondary-button py-2 px-4 text-sm" @click="fillSchoolMockData">
                  生成Mock数据
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mock数据生成器 -->
        <div class="glass-card rounded-lg glow-border p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <i class="ri-code-line ri-lg text-gradient mr-2" />
              <h2 class="text-xl font-bold text-white">
                Mock数据生成器
              </h2>
            </div>
            <div class="flex space-x-2">
              <button class="secondary-button px-4 py-2 text-sm" @click="generateAllMockData">
                生成全部
              </button>
              <button class="secondary-button px-4 py-2 text-sm" @click="clearAllMockData">
                清空全部
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 设计师Mock数据 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-white flex items-center">
                <i class="ri-palette-line mr-2" />
                设计师数据
              </h3>
              <div class="bg-gray-900/50 rounded-lg p-4">
                <pre class="text-xs text-green-400 overflow-auto max-h-40">{{ JSON.stringify(mockData.designer, null, 2) }}</pre>
              </div>
              <div class="flex space-x-2">
                <button class="flex-1 secondary-button py-2 text-xs" @click="copyMockData('designer')">
                  <i class="ri-file-copy-line mr-1" />复制
                </button>
                <button class="flex-1 neon-button py-2 text-xs" @click="testDesignerRegistration">
                  <i class="ri-send-plane-line mr-1" />测试API
                </button>
              </div>
            </div>

            <!-- 企业Mock数据 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-white flex items-center">
                <i class="ri-building-line mr-2" />
                企业数据
              </h3>
              <div class="bg-gray-900/50 rounded-lg p-4">
                <pre class="text-xs text-green-400 overflow-auto max-h-40">{{ JSON.stringify(mockData.enterprise, null, 2) }}</pre>
              </div>
              <div class="flex space-x-2">
                <button class="flex-1 secondary-button py-2 text-xs" @click="copyMockData('enterprise')">
                  <i class="ri-file-copy-line mr-1" />复制
                </button>
                <button class="flex-1 neon-button py-2 text-xs" @click="testEnterpriseRegistration">
                  <i class="ri-send-plane-line mr-1" />测试API
                </button>
              </div>
            </div>

            <!-- 院校Mock数据 -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-white flex items-center">
                <i class="ri-school-line mr-2" />
                院校数据
              </h3>
              <div class="bg-gray-900/50 rounded-lg p-4">
                <pre class="text-xs text-green-400 overflow-auto max-h-40">{{ JSON.stringify(mockData.school, null, 2) }}</pre>
              </div>
              <div class="flex space-x-2">
                <button class="flex-1 secondary-button py-2 text-xs" @click="copyMockData('school')">
                  <i class="ri-file-copy-line mr-1" />复制
                </button>
                <button class="flex-1 neon-button py-2 text-xs" @click="testSchoolRegistration">
                  <i class="ri-send-plane-line mr-1" />测试API
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- API测试工具 -->
        <div class="glass-card rounded-lg glow-border p-6 mb-8">
          <div class="flex items-center mb-6">
            <i class="ri-api-line ri-lg text-gradient mr-2" />
            <h2 class="text-xl font-bold text-white">
              API测试工具
            </h2>
          </div>

          <div class="space-y-4">
            <!-- API测试结果 -->
            <div v-if="apiTestResult" class="bg-gray-900/50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-white">
                  最后测试结果
                </h4>
                <span
                  class="px-2 py-1 rounded text-xs" :class="[
                    apiTestResult.success ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400',
                  ]"
                >
                  {{ apiTestResult.success ? '成功' : '失败' }}
                </span>
              </div>
              <pre class="text-xs text-gray-300 overflow-auto max-h-32">{{ JSON.stringify(apiTestResult.data, null, 2) }}</pre>
            </div>

            <!-- 测试按钮 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                :disabled="apiTesting"
                class="neon-button py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="testRegistrationAPI('designer')"
              >
                <i class="ri-palette-line mr-2" />
                {{ apiTesting ? '测试中...' : '测试设计师注册' }}
              </button>

              <button
                :disabled="apiTesting"
                class="neon-button py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="testRegistrationAPI('enterprise')"
              >
                <i class="ri-building-line mr-2" />
                {{ apiTesting ? '测试中...' : '测试企业注册' }}
              </button>

              <button
                :disabled="apiTesting"
                class="neon-button py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="testRegistrationAPI('school')"
              >
                <i class="ri-school-line mr-2" />
                {{ apiTesting ? '测试中...' : '测试院校注册' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 测试场景 -->
        <div class="glass-card rounded-lg glow-border p-6">
          <div class="flex items-center mb-6">
            <i class="ri-test-tube-line ri-lg text-gradient mr-2" />
            <h2 class="text-xl font-bold text-white">
              测试场景
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                极简注册测试
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                只填写必填字段进行注册
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="runMinimalRegistrationTest">
                运行测试
              </button>
            </div>

            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                完整注册测试
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                填写所有字段进行注册
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="runCompleteRegistrationTest">
                运行测试
              </button>
            </div>

            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                字段验证测试
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                测试表单验证规则
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="runValidationTest">
                运行测试
              </button>
            </div>

            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                重复名称测试
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                测试名称唯一性验证
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="runDuplicateNameTest">
                运行测试
              </button>
            </div>

            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                流程完整性测试
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                测试完整注册流程
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="runFullFlowTest">
                运行测试
              </button>
            </div>

            <div class="bg-gray-800/50 rounded-lg p-4 card-hover">
              <h4 class="text-sm font-medium text-white mb-2">
                清理测试数据
              </h4>
              <p class="text-xs text-gray-400 mb-3">
                清理所有测试产生的数据
              </p>
              <button class="w-full secondary-button py-2 text-xs" @click="cleanTestData">
                清理数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 深色主题样式定义 */
.talent-page {
  font-family: 'Noto Sans SC', sans-serif;
  background: #000000;
  color: #e2e8f0;
  min-height: 100vh;
}

/* 玻璃效果卡片 */
.glass-card {
  background: rgba(28, 28, 30, 0.6);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 发光边框效果 */
.glow-border {
  position: relative;
  border: 1px solid rgba(99, 99, 102, 0.2);
}

.glow-border::after {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: inherit;
  background: linear-gradient(45deg, transparent, rgba(10, 132, 255, 0.3), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glow-border:hover::after {
  opacity: 1;
}

/* 主要按钮 - 霓虹效果 */
.neon-button {
  background: linear-gradient(45deg, #007AFF, #AF52DE);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.neon-button:hover::before {
  left: 100%;
}

.neon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 次要按钮 */
.secondary-button {
  background: transparent;
  border: 1px solid rgba(99, 99, 102, 0.3);
  border-radius: 8px;
  padding: 12px 24px;
  color: #e2e8f0;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.secondary-button:hover {
  border-color: rgba(10, 132, 255, 0.5);
  background: rgba(10, 132, 255, 0.1);
}

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 自定义输入框 */
.custom-input {
  background: rgba(28, 28, 30, 0.8);
  border: 1px solid rgba(99, 99, 102, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
  outline: none;
}

.custom-input::placeholder {
  color: #64748b;
}

/* 自定义选择器 */
.custom-select {
  background: rgba(28, 28, 30, 0.8);
  border: 1px solid rgba(99, 99, 102, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.custom-select:focus {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
  outline: none;
}

/* 渐变文字 */
.text-gradient {
  background: linear-gradient(45deg, #007AFF, #AF52DE, #FF2D92);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 状态徽章 */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* 代码展示区域 */
.code-display {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(99, 99, 102, 0.2);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* 加载状态 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(10, 132, 255, 0.3);
  border-top: 2px solid #0a84ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-card {
    margin: 16px;
    padding: 20px;
  }

  .neon-button,
  .secondary-button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 文字颜色修正 */
.text-white {
  color: #ffffff;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-green-400 {
  color: #4ade80;
}

.text-red-400 {
  color: #f87171;
}

/* 背景颜色修正 */
.bg-gray-800\/50 {
  background-color: rgba(31, 41, 55, 0.5);
}

.bg-gray-900\/50 {
  background-color: rgba(17, 24, 39, 0.5);
}

.bg-green-600\/20 {
  background-color: rgba(22, 163, 74, 0.2);
}

.bg-red-600\/20 {
  background-color: rgba(220, 38, 38, 0.2);
}

/* 图标样式 */
.ri-lg {
  font-size: 1.5rem;
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 间距工具类 */
.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

/* 布局工具类 */
.flex-1 {
  flex: 1 1 0%;
}

.w-full {
  width: 100%;
}

.max-h-32 {
  max-height: 8rem;
}

.max-h-40 {
  max-height: 10rem;
}

.overflow-auto {
  overflow: auto;
}

/* 边框圆角 */
.rounded-lg {
  border-radius: 0.5rem;
}

/* 阴影效果 */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 渐变背景类 */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Tailwind CSS 渐变色彩工具类 */
.from-indigo-600\/10 {
  --tw-gradient-from: rgba(79, 70, 229, 0.1);
  --tw-gradient-to: rgb(79 70 229 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-purple-600\/10 {
  --tw-gradient-to: rgba(147, 51, 234, 0.1);
}

.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-to: rgb(37 99 235 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-purple-600 {
  --tw-gradient-to: #9333ea;
}

.from-orange-600 {
  --tw-gradient-from: #ea580c;
  --tw-gradient-to: rgb(234 88 12 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-red-600 {
  --tw-gradient-to: #dc2626;
}

.from-green-600 {
  --tw-gradient-from: #16a34a;
  --tw-gradient-to: rgb(22 163 74 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-emerald-600 {
  --tw-gradient-to: #059669;
}

/* 位置工具类 */
.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

/* 透明度工具类 */
.opacity-30 {
  opacity: 0.3;
}

/* 网格布局 */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* 间距工具类 */
.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

/* Flexbox 工具类 */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

/* 尺寸工具类 */
.w-12 {
  width: 3rem;
}

.h-12 {
  height: 3rem;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

/* 内边距工具类 */
.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.px-10 {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.pb-8 {
  padding-bottom: 2rem;
}

/* 外边距工具类 */
.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-4 {
  margin-right: 1rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mt-20 {
  margin-top: 5rem;
}

/* 响应式外边距 */
@media (min-width: 768px) {
  .md\:mt-16 {
    margin-top: 4rem;
  }

  .md\:py-12 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

/* Z-index 工具类 */
.z-10 {
  z-index: 10;
}

/* 文字对齐 */
.text-center {
  text-align: center;
}

/* 文字大小 */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

/* 字体粗细 */
.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

/* 最大宽度 */
.max-w-2xl {
  max-width: 42rem;
}

.max-w-4xl {
  max-width: 56rem;
}

/* 自动外边距 */
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Flex 增长 */
.flex-grow {
  flex-grow: 1;
}

/* 显示属性 */
.block {
  display: block;
}

.inline-block {
  display: inline-block;
}

/* 光标样式 */
.cursor-pointer {
  cursor: pointer;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

/* 用户选择 */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
</style>
