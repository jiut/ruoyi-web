<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NButton, NIcon, NInput, NSpin, NText,
  useMessage, useThemeVars,
} from 'naive-ui'
import {
  CallOutline,
  KeyOutline,
  LinkOutline,
} from '@vicons/ionicons5'

import { useI18n } from 'vue-i18n'
import { getSmsCode, bindPhone } from '@/api/user'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const message = useMessage()
const themeVars = useThemeVars()

// 获取重定向路径
const redirectPath = ref<string>('/')

// 表单状态管理
const bindForm = reactive({
  phoneNumber: '',
  smsCode: '',
})

// 加载状态管理
const bindLoading = ref(false)
const pageLoading = ref(false)

// 表单验证
const formErrors = reactive({
  phoneNumber: '',
  smsCode: '',
})

// 验证手机号格式
function validatePhoneNumber(phone: string) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 验证表单
function validateForm() {
  let isValid = true

  // 手机号验证
  if (!bindForm.phoneNumber) {
    formErrors.phoneNumber = t('bindPhone.phoneRequired')
    isValid = false
  }
  else if (!validatePhoneNumber(bindForm.phoneNumber)) {
    formErrors.phoneNumber = t('bindPhone.phoneInvalid')
    isValid = false
  }
  else {
    formErrors.phoneNumber = ''
  }

  // 验证码验证
  if (!bindForm.smsCode) {
    formErrors.smsCode = t('bindPhone.codeRequired')
    isValid = false
  }
  else if (bindForm.smsCode.length !== 4) {
    formErrors.smsCode = t('bindPhone.codeInvalid')
    isValid = false
  }
  else {
    formErrors.smsCode = ''
  }

  return isValid
}

// 绑定手机号
async function handleBindPhone(e: MouseEvent) {
  e.preventDefault()
  if (!validateForm())
    return

  try {
    bindLoading.value = true
    await bindPhone(bindForm.phoneNumber, bindForm.smsCode)

    // 更新用户信息中的手机号
    const userStore = useUserStore()
    userStore.updateUserInfo({ phone: bindForm.phoneNumber })

    message.success(t('bindPhone.bindSuccess'))

    // 清空表单
    bindForm.phoneNumber = ''
    bindForm.smsCode = ''

    // 跳转回原来要访问的页面
    setTimeout(() => {
      router.push(redirectPath.value)
    }, 1500)
  }
  catch (error: any) {
    message.error(error.message || t('bindPhone.bindFailed'))
  }
  finally {
    bindLoading.value = false
  }
}

// 组件挂载时获取重定向路径
onMounted(() => {
  const redirect = route.query.redirect as string
  if (redirect) {
    redirectPath.value = decodeURIComponent(redirect)
  }
})

// 验证码发送相关
const isSending = ref(false)
const countdown = ref(0)
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s` : t('bindPhone.sendCode')
})

const canSendCode = computed(() => {
  return validatePhoneNumber(bindForm.phoneNumber) && countdown.value === 0
})

async function sendSmsCode() {
  // 验证手机号
  if (!bindForm.phoneNumber) {
    formErrors.phoneNumber = t('bindPhone.phoneRequired')
    return
  }
  else if (!validatePhoneNumber(bindForm.phoneNumber)) {
    formErrors.phoneNumber = t('bindPhone.phoneInvalid')
    return
  }
  else {
    formErrors.phoneNumber = ''
  }

  if (isSending.value)
    return

  try {
    isSending.value = true
    await getSmsCode(bindForm.phoneNumber, 'bind')
    message.success(t('bindPhone.codeSent'))

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        isSending.value = false
      }
    }, 1000)
  }
  catch (error: any) {
    message.error(error.message || t('bindPhone.sendCodeFailed'))
    isSending.value = false
  }
}

// 计算背景样式，适配暗黑模式
const brandSectionStyle = computed(() => {
  const isDark = themeVars.value.bodyColor.startsWith('#1')
    || themeVars.value.bodyColor.startsWith('#2')
    || themeVars.value.bodyColor.startsWith('#3')

  return {
    background: isDark
      ? 'linear-gradient(135deg, #003b8e, #0058d9)'
      : 'linear-gradient(135deg, #1867c0, #5cbbf6)',
  }
})
</script>

<template>
  <div class="login-container">
    <NSpin :show="pageLoading">
      <div class="login-content">
        <!-- 左侧品牌区域 -->
        <div class="brand-section" :style="brandSectionStyle">
          <div class="brand-content">
            <h1 class="brand-title">
              亿思AI
            </h1>
            <p class="brand-description">
              AI 赋能·创新未来
            </p>
          </div>
        </div>

        <!-- 右侧绑定手机号表单 -->
        <div class="form-wrapper">
          <div class="login-methods">
            <div class="active-method">
              {{ $t("bindPhone.title") }}
            </div>
          </div>

          <div class="form-content">
            <!-- 手机号输入 -->
            <div class="input-group">
              <div class="input-label-row">
                <NText strong class="input-label">
                  {{ $t("bindPhone.phoneNumber") }}
                </NText>
                <div v-if="formErrors.phoneNumber" class="error-message">
                  {{ formErrors.phoneNumber }}
                </div>
              </div>
              <NInput
                v-model:value="bindForm.phoneNumber"
                :placeholder="$t('bindPhone.phonePlaceholder')"
                round
                clearable
                maxlength="11"
                class="custom-input"
                :status="formErrors.phoneNumber ? 'error' : undefined"
              >
                <template #prefix>
                  <NIcon :component="CallOutline" />
                </template>
              </NInput>
            </div>

            <!-- 验证码输入 -->
            <div class="input-group">
              <div class="input-label-row">
                <NText strong class="input-label">
                  {{ $t("bindPhone.verificationCode") }}
                </NText>
                <div v-if="formErrors.smsCode" class="error-message">
                  {{ formErrors.smsCode }}
                </div>
              </div>
              <div class="verification-code-row">
                <NInput
                  v-model:value="bindForm.smsCode"
                  :placeholder="$t('bindPhone.codePlaceholder')"
                  round
                  maxlength="4"
                  class="verification-input"
                  :status="formErrors.smsCode ? 'error' : undefined"
                >
                  <template #prefix>
                    <NIcon :component="KeyOutline" />
                  </template>
                </NInput>
                <NButton
                  :disabled="!canSendCode || isSending"
                  class="send-code-button"
                  @click="sendSmsCode"
                >
                  {{ codeButtonText }}
                </NButton>
              </div>
            </div>

            <!-- 绑定按钮 -->
            <div class="action-buttons">
              <NButton
                type="primary"
                block
                :loading="bindLoading"
                class="bind-button"
                @click="handleBindPhone"
              >
                <template #icon>
                  <NIcon :component="LinkOutline" />
                </template>
                {{ $t("bindPhone.bind") }}
              </NButton>
            </div>

            <!-- 返回提示 -->
            <div class="login-prompt">
              <span style="color: #f56c6c; font-size: 14px;">
                ⚠️ 请先绑定手机号才能继续使用
              </span>
            </div>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 20px;
}

.login-content {
  display: flex;
  width: 900px;
  max-width: 100%;
  min-height: 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

html.dark .login-content {
  outline: 2px solid rgb(17, 19, 17) !important;
}

/* 左侧品牌区域 */
.brand-section {
  flex: 1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.brand-description {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 300px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧表单区域 */
.form-wrapper {
  flex: 1;
  background: var(--n-color-modal);
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-methods {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.active-method {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--n-primary-color);
}

.form-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.input-label {
  font-size: 14px;
}

.error-message {
  font-size: 12px;
  color: var(--n-error-color);
}

.custom-input {
  transition: all 0.3s ease;
}

.verification-code-row {
  display: flex;
  gap: 10px;
}

.verification-input {
  flex: 1;
}

.send-code-button {
  min-width: 100px;
}

.action-buttons {
  margin-bottom: 1.5rem;
}

.bind-button {
  height: 40px;
  font-size: 16px;
}

.login-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--n-text-color-3);
  margin-top: auto;
  padding-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    width: 100%;
  }

  .brand-section {
    padding: 30px;
    min-height: 150px;
  }

  .form-wrapper {
    padding: 30px 20px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .verification-code-row {
    flex-direction: column;
    gap: 10px;
  }

  .send-code-button {
    width: 100%;
  }
}
</style>
