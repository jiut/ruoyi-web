<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" @click="handleBackdropClick">
    <div class="absolute inset-0 bg-black/70"></div>
    <div
      class="job-detail-modal relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8 m-4"
      @click.stop
    >
      <button
        @click="closeModal"
        class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors"
      >
        <i class="ri-close-line ri-lg"></i>
      </button>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2 text-white">申请职位：{{ job?.title }}</h2>
        <p class="text-gray-300">{{ job?.enterprise?.enterpriseName }} · {{ job?.workLocation }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3"></div>
            基本信息
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">姓名</label>
                <input
                  type="text"
                  v-model="formData.name"
                  class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="请输入姓名"
                  required
                >
              </div>
              <div>
                <label class="block text-gray-300 mb-2">手机号码</label>
                <input
                  type="tel"
                  v-model="formData.phone"
                  class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="请输入手机号码"
                  required
                >
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">电子邮箱</label>
              <input
                type="email"
                v-model="formData.email"
                class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="请输入电子邮箱"
                required
              >
            </div>
          </div>
        </div>

        <!-- 工作经验 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3"></div>
            工作经验
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 mb-2">工作年限</label>
                <select
                  v-model="formData.experience"
                  class="custom-select w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-8"
                  required
                >
                  <option value="">请选择工作年限</option>
                  <option value="0-1">应届/1年以内</option>
                  <option value="1-3">1-3年</option>
                  <option value="3-5">3-5年</option>
                  <option value="5-10">5-10年</option>
                  <option value="10+">10年以上</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-300 mb-2">当前状态</label>
                <select
                  v-model="formData.currentStatus"
                  class="custom-select w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-8"
                  required
                >
                  <option value="">请选择当前状态</option>
                  <option value="在职">在职，看看机会</option>
                  <option value="离职">离职，正在找工作</option>
                  <option value="应届">应届毕业生</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-gray-300 mb-2">期望薪资</label>
              <select
                v-model="formData.expectedSalary"
                class="custom-select w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary pr-8"
                required
              >
                <option value="">请选择期望薪资</option>
                <option value="10k-">10k以下</option>
                <option value="10k-15k">10k-15k</option>
                <option value="15k-20k">15k-20k</option>
                <option value="20k-30k">20k-30k</option>
                <option value="30k-50k">30k-50k</option>
                <option value="50k+">50k以上</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 简历上传 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3"></div>
            简历上传
          </h3>
          <div class="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
            <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/20 text-primary">
              <i class="ri-upload-cloud-line ri-2x"></i>
            </div>
            <p class="text-gray-300 mb-2">点击或拖拽文件到此处上传</p>
            <p class="text-gray-500 text-sm">支持 PDF、Word 格式，文件大小不超过 10MB</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              @change="handleFileUpload"
              class="hidden"
              ref="fileInput"
            >
            <button
              type="button"
              @click="triggerFileUpload"
              class="mt-4 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              选择文件
            </button>
            <p v-if="formData.resumeFileName" class="mt-2 text-sm text-green-400">
              已选择：{{ formData.resumeFileName }}
            </p>
          </div>
        </div>

        <!-- 作品集链接 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3"></div>
            作品集链接（可选）
          </h3>
          <div>
            <label class="block text-gray-300 mb-2">作品集URL</label>
            <input
              type="url"
              v-model="formData.portfolioUrl"
              class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              placeholder="请输入作品集链接（如：Behance、Dribbble等）"
            >
          </div>
        </div>

        <!-- 自我介绍 -->
        <div>
          <h3 class="text-xl font-bold mb-4 flex items-center text-white">
            <div class="w-1 h-6 bg-primary rounded-full mr-3"></div>
            自我介绍
          </h3>
          <div>
            <label class="block text-gray-300 mb-2">求职信</label>
            <textarea
              v-model="formData.coverLetter"
              class="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-32"
              placeholder="请简要介绍自己的技能、经验和优势，以及为什么适合这个职位（选填）"
              maxlength="1000"
            ></textarea>
            <div class="text-right text-xs text-gray-500 mt-1">
              {{ formData.coverLetter.length }}/1000
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center space-x-4">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-base hover:border-gray-500 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {{ loading ? '提交中...' : '提交申请' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { JobPosting } from '@/types/talent/job'

interface Props {
  visible: boolean
  job: JobPosting | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [formData: ApplicationFormData]
}>()

interface ApplicationFormData {
  name: string
  phone: string
  email: string
  experience: string
  currentStatus: string
  expectedSalary: string
  resumeFile: File | null
  resumeFileName: string
  portfolioUrl: string
  coverLetter: string
}

// 响应式数据
const loading = ref(false)
const fileInput = ref<HTMLInputElement>()

const formData = reactive<ApplicationFormData>({
  name: '',
  phone: '',
  email: '',
  experience: '',
  currentStatus: '',
  expectedSalary: '',
  resumeFile: null,
  resumeFileName: '',
  portfolioUrl: '',
  coverLetter: ''
})

// 方法
const handleBackdropClick = () => {
  closeModal()
}

const closeModal = () => {
  emit('update:visible', false)
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    phone: '',
    email: '',
    experience: '',
    currentStatus: '',
    expectedSalary: '',
    resumeFile: null,
    resumeFileName: '',
    portfolioUrl: '',
    coverLetter: ''
  })
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 检查文件类型
    const allowedTypes = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!allowedTypes.includes(fileExtension)) {
      alert('请上传 PDF 或 Word 格式的文件')
      return
    }

    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      return
    }

    formData.resumeFile = file
    formData.resumeFileName = file.name
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    // 基础验证
    if (!formData.name || !formData.phone || !formData.email || !formData.experience || !formData.currentStatus || !formData.expectedSalary) {
      alert('请填写所有必填项')
      return
    }

    // 手机号验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('请输入正确的手机号码')
      return
    }

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('请输入正确的邮箱地址')
      return
    }

    // 提交表单数据
    emit('submit', { ...formData })

  } catch (error) {
    console.error('提交申请失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '@/styles/talent.css';

.job-detail-modal {
  background: rgba(28, 28, 30, 0.95);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 99, 102, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.bg-primary {
  background-color: #0a84ff;
}

.text-primary {
  color: #0a84ff;
}

.focus\:border-primary:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

.hover\:bg-primary\/80:hover {
  background-color: rgba(10, 132, 255, 0.8);
}

/* 自定义选择框样式 */
.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.custom-select:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 文件上传区域 */
.border-dashed:hover {
  border-color: rgba(10, 132, 255, 0.3);
}

/* 表单输入框样式 */
input[type="text"],
input[type="tel"],
input[type="email"],
input[type="url"],
textarea {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="email"]:focus,
input[type="url"]:focus,
textarea:focus {
  border-color: #0a84ff !important;
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
}

/* 按钮样式 */
button[type="submit"] {
  background-color: #0a84ff;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: rgba(10, 132, 255, 0.8);
}

button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 文件名显示 */
.text-green-400 {
  color: #4ade80;
}
</style>
