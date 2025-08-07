<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton, NIcon, NInput, NSpin, NText,
  useMessage, useThemeVars,
} from 'naive-ui'
import {
  CallOutline,
  KeyOutline,
  LogInOutline,
} from '@vicons/ionicons5'

import { useI18n } from 'vue-i18n'
import { getSmsCode, smsLogin } from '@/api/user'
import { useUserStore } from '@/store/modules/user'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const themeVars = useThemeVars()

// 表单状态管理
const loginForm = reactive({
  phoneNumber: '',
  smsCode: '',
})

// 加载状态管理
const loginLoading = ref(false)
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
  if (!loginForm.phoneNumber) {
    formErrors.phoneNumber = t('smsLogin.phoneRequired')
    isValid = false
  }
  else if (!validatePhoneNumber(loginForm.phoneNumber)) {
    formErrors.phoneNumber = t('smsLogin.phoneInvalid')
    isValid = false
  }
  else {
    formErrors.phoneNumber = ''
  }

  // 验证码验证
  if (!loginForm.smsCode) {
    formErrors.smsCode = t('smsLogin.codeRequired')
    isValid = false
  }
  else if (loginForm.smsCode.length !== 4) {
    formErrors.smsCode = t('smsLogin.codeInvalid')
    isValid = false
  }
  else {
    formErrors.smsCode = ''
  }

  return isValid
}

// 短信登录
async function handleSmsLogin(e: MouseEvent) {
  e.preventDefault()
  if (!validateForm())
    return

  try {
    loginLoading.value = true
    const response = await smsLogin(loginForm.phoneNumber, loginForm.smsCode)

    // 如果后端返回的是登录信息，直接使用
    if (response.data && response.data.token) {
      // 存储token到localStorage
      localStorage.setItem('access_token', response.data.token)
      // 存储用户信息到localStorage
      if (response.data.userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
      }

      message.success(t('smsLogin.loginSuccess'))
      router.push('/')
    } else {
      // 如果是其他格式，尝试通过userStore处理
      const loginData = {
        username: loginForm.phoneNumber,
        password: loginForm.smsCode,
        type: 'sms'
      }
      await userStore.userLogin(loginData)
      message.success(t('smsLogin.loginSuccess'))
      router.push('/')
    }
  }
  catch (error: any) {
    message.error(error.message || t('smsLogin.loginFailed'))
  }
  finally {
    loginLoading.value = false
  }
}

// 验证码发送相关
const isSending = ref(false)
const countdown = ref(0)
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s` : t('smsLogin.sendCode')
})

const canSendCode = computed(() => {
  return validatePhoneNumber(loginForm.phoneNumber) && countdown.value === 0
})

async function sendSmsCode() {
  // 验证手机号
  if (!loginForm.phoneNumber) {
    formErrors.phoneNumber = t('smsLogin.phoneRequired')
    return
  }
  else if (!validatePhoneNumber(loginForm.phoneNumber)) {
    formErrors.phoneNumber = t('smsLogin.phoneInvalid')
    return
  }
  else {
    formErrors.phoneNumber = ''
  }

  if (isSending.value)
    return

  try {
    isSending.value = true
    await getSmsCode(loginForm.phoneNumber, 'login')
    message.success(t('smsLogin.codeSent'))

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
    message.error(error.message || t('smsLogin.sendCodeFailed'))
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

        <!-- 右侧短信登录表单 -->
        <div class="form-wrapper">
          <div class="login-methods">
            <div class="active-method">
              {{ $t("smsLogin.title") }}
            </div>
          </div>

          <div class="form-content">
            <!-- 手机号输入 -->
            <div class="input-group">
              <div class="input-label-row">
                <NText strong class="input-label">
                  {{ $t("smsLogin.phoneNumber") }}
                </NText>
                <div v-if="formErrors.phoneNumber" class="error-message">
                  {{ formErrors.phoneNumber }}
                </div>
              </div>
              <NInput
                v-model:value="loginForm.phoneNumber"
                :placeholder="$t('smsLogin.phonePlaceholder')"
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
                  {{ $t("smsLogin.verificationCode") }}
                </NText>
                <div v-if="formErrors.smsCode" class="error-message">
                  {{ formErrors.smsCode }}
                </div>
              </div>
              <div class="verification-code-row">
                <NInput
                  v-model:value="loginForm.smsCode"
                  :placeholder="$t('smsLogin.codePlaceholder')"
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

            <!-- 登录按钮 -->
            <div class="action-buttons">
              <NButton
                type="primary"
                block
                :loading="loginLoading"
                class="login-button"
                @click="handleSmsLogin"
              >
                <template #icon>
                  <NIcon :component="LogInOutline" />
                </template>
                {{ $t("smsLogin.login") }}
              </NButton>
            </div>

            <!-- 其他登录方式 -->
            <div class="alternative-login">
              <div class="login-prompt">
                {{ $t("smsLogin.usePassword") }}
                <NButton text type="primary" @click="router.push('/login')">
                  {{ $t("smsLogin.passwordLogin") }}
                </NButton>
              </div>

              <div class="login-prompt">
                {{ $t("smsLogin.noAccount") }}
                <NButton text type="primary" @click="router.push('/regist')">
                  {{ $t("smsLogin.register") }}
                </NButton>
              </div>
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

.login-button {
  height: 40px;
  font-size: 16px;
}

.alternative-login {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
}

.login-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--n-text-color-3);
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
