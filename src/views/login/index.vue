<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton, NIcon, NInput, NSpin, NText,
  useMessage, useThemeVars,
} from 'naive-ui'
import {
  LockClosedOutline,
  LogInOutline,
  PersonOutline,
  CallOutline,
  KeyOutline,
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import type { LoginFrom } from '@/typings/user'

import { useUserStore } from '@/store/modules/user'
import { getSmsCode, smsLogin } from '@/api/user'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const themeVars = useThemeVars()

// 表单状态管理
const loginForm = reactive<LoginFrom>({
  username: '',
  password: '',
  type: '',
})

// 短信登录表单
const smsForm = reactive({
  phoneNumber: '',
  smsCode: '',
})

// 登录方式切换
const loginType = ref<'password' | 'sms'>('password')

// 加载状态管理
const loginLoading = ref(false)
const pageLoading = ref(false)

// 短信验证码相关
const isSendingSms = ref(false)
const smsCountdown = ref(0)
const smsCodeButtonText = computed(() => {
  return smsCountdown.value > 0 ? `${smsCountdown.value}s` : '发送验证码'
})

// 表单验证
const formErrors = reactive({
  username: '',
  password: '',
  phoneNumber: '',
  smsCode: '',
})

// 验证表单
function validateForm() {
  let isValid = true

  // 用户名验证
  if (!loginForm.username) {
    formErrors.username = t('login.usernameRequired')
    isValid = false
  }
  else {
    formErrors.username = ''
  }

  // 密码验证
  if (!loginForm.password) {
    formErrors.password = t('login.passwordRequired')
    isValid = false
  }
  else {
    formErrors.password = ''
  }

  return isValid
}



// 跳转到注册页面
const navigateToRegister = () => {
  router.push('/regist')
}

// 验证手机号格式
function validatePhoneNumber(phone: string) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 发送短信验证码
async function sendSmsCode() {
  // 验证手机号
  if (!smsForm.phoneNumber) {
    formErrors.phoneNumber = '手机号码不能为空'
    return
  }
  else if (!validatePhoneNumber(smsForm.phoneNumber)) {
    formErrors.phoneNumber = '请输入正确的手机号码'
    return
  }
  else {
    formErrors.phoneNumber = ''
  }

  if (isSendingSms.value)
    return

  try {
    isSendingSms.value = true
    await getSmsCode(smsForm.phoneNumber, 'login')
    message.success('验证码已发送')

    // 开始倒计时
    smsCountdown.value = 60
    const timer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) {
        clearInterval(timer)
        isSendingSms.value = false
      }
    }, 1000)
  }
  catch (error: any) {
    message.error(error.message || '发送验证码失败')
    isSendingSms.value = false
  }
}

// 短信登录
async function handleSmsLogin(e: MouseEvent) {
  e.preventDefault()

  // 验证手机号
  if (!smsForm.phoneNumber) {
    formErrors.phoneNumber = '手机号码不能为空'
    return
  }
  else if (!validatePhoneNumber(smsForm.phoneNumber)) {
    formErrors.phoneNumber = '请输入正确的手机号码'
    return
  }
  else {
    formErrors.phoneNumber = ''
  }

  // 验证验证码
  if (!smsForm.smsCode) {
    formErrors.smsCode = '验证码不能为空'
    return
  }
  else if (smsForm.smsCode.length !== 4) {
    formErrors.smsCode = '请输入4位数字验证码'
    return
  }
  else {
    formErrors.smsCode = ''
  }

  try {
    loginLoading.value = true
    const response = await smsLogin(smsForm.phoneNumber, smsForm.smsCode)

    if (response.data && response.data.token) {
      // 存储token到localStorage
      localStorage.setItem('access_token', response.data.token)
      // 存储用户信息到localStorage
      if (response.data.userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
      }
      message.success('登录成功')
      router.push('/')
    } else {
      const loginData = {
        username: smsForm.phoneNumber,
        password: smsForm.smsCode,
        type: 'sms'
      }
      await userStore.userLogin(loginData)
      message.success('登录成功')
      router.push('/')
    }
  }
  catch (error: any) {
    message.error(error.message || '登录失败')
  }
  finally {
    loginLoading.value = false
  }
}

// 处理登录（根据登录方式）
function handleLogin(e: MouseEvent) {
  if (loginType.value === 'sms') {
    handleSmsLogin(e)
  } else {
    handlePasswordLogin(e)
  }
}

// 账号密码登录
async function handlePasswordLogin(e: MouseEvent) {
  if (!validateForm())
    return

  try {
    loginLoading.value = true
    await userStore.userLogin(loginForm)
    message.success(t('login.loginSuccess'))
    router.push('/')
  }
  catch (error: any) {
    message.error(error.message || t('login.loginFailed'))
  }
  finally {
    loginLoading.value = false
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

        <!-- 右侧登录表单 -->
        <div class="form-wrapper">
          <div class="login-methods">
            <div
              class="method-tab"
              :class="{ active: loginType === 'password' }"
              @click="loginType = 'password'"
            >
              账号密码登录
            </div>
            <div
              class="method-tab"
              :class="{ active: loginType === 'sms' }"
              @click="loginType = 'sms'"
            >
              短信登录
            </div>
          </div>

          <div class="form-content">
            <!-- 账号密码登录表单 -->
            <template v-if="loginType === 'password'">
              <!-- 用户名输入 -->
              <div class="input-group">
                <div class="input-label-row">
                  <NText strong class="input-label">
                    {{ $t("login.username") }}
                  </NText>
                  <div v-if="formErrors.username" class="error-message">
                    {{ formErrors.username }}
                  </div>
                </div>
                <NInput
                  v-model:value="loginForm.username" :placeholder="$t('login.enterEmailOrPhone')" round clearable
                  class="custom-input" :status="formErrors.username ? 'error' : undefined"
                >
                  <template #prefix>
                    <NIcon :component="PersonOutline" />
                  </template>
                </NInput>
              </div>

              <!-- 密码输入 -->
              <div class="input-group">
                <div class="input-label-row">
                  <NText strong class="input-label">
                    {{ $t("login.password") }}
                  </NText>
                  <div v-if="formErrors.password" class="error-message">
                    {{ formErrors.password }}
                  </div>
                </div>
                <NInput
                  v-model:value="loginForm.password" type="password" :placeholder="$t('login.enterPassword')" round
                  show-password-on="click" class="custom-input" :status="formErrors.password ? 'error' : undefined"
                >
                  <template #prefix>
                    <NIcon :component="LockClosedOutline" />
                  </template>
                </NInput>
              </div>
            </template>

            <!-- 短信登录表单 -->
            <template v-else-if="loginType === 'sms'">
              <!-- 手机号输入 -->
              <div class="input-group">
                <div class="input-label-row">
                  <NText strong class="input-label">
                    手机号码
                  </NText>
                  <div v-if="formErrors.phoneNumber" class="error-message">
                    {{ formErrors.phoneNumber }}
                  </div>
                </div>
                <NInput
                  v-model:value="smsForm.phoneNumber"
                  placeholder="请输入11位手机号码"
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
                    验证码
                  </NText>
                  <div v-if="formErrors.smsCode" class="error-message">
                    {{ formErrors.smsCode }}
                  </div>
                </div>
                <div class="verification-code-row">
                  <NInput
                    v-model:value="smsForm.smsCode"
                    placeholder="请输入4位验证码"
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
                    :disabled="!validatePhoneNumber(smsForm.phoneNumber) || isSendingSms || smsCountdown > 0"
                    class="send-code-button"
                    @click="sendSmsCode"
                  >
                    {{ smsCodeButtonText }}
                  </NButton>
                </div>
              </div>
            </template>

            <!-- 额外链接 -->
            <div class="additional-links" v-if="loginType === 'password'">
              <NButton text tag="a" href="#/resetpassword" class="forgot-password">
                {{ $t("login.forgotPassword") }}
              </NButton>
              <span class="link-separator">|</span>
              <NButton text tag="a" href="#/bind-phone" class="bind-phone-link">
                绑定手机号
              </NButton>
            </div>

            <!-- 登录按钮 -->
            <div class="action-buttons">
              <NButton type="primary" block :loading="loginLoading" class="login-button" @click="handleLogin">
                <template #icon>
                  <NIcon :component="LogInOutline" />
                </template>
                {{ loginType === 'sms' ? '短信登录' : $t("login.login") }}
              </NButton>
            </div>

            <!-- 注册提示 -->
            <div class="register-prompt">
              还没有账号？
              <NButton text type="primary" @click="navigateToRegister">
                立即注册
              </NButton>
              并免费体验问答助手
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
  background-color: #FFF;
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
  border: #07c160;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-methods {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 2rem;
}

.method-tab {
  font-size: 16px;
  font-weight: 500;
  color: var(--n-text-color-3);
  padding-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.method-tab.active {
  color: var(--n-text-color);
  border-bottom-color: var(--n-primary-color);
}

.method-tab:hover {
  color: var(--n-text-color);
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

.additional-links {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.forgot-password,
.bind-phone-link {
  font-size: 14px;
}

.link-separator {
  font-size: 14px;
  color: var(--n-text-color-3);
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

.alternative-logins {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.wx-login-button {
  color: #07c160;
  border-color: #07c160;
  transition: all 0.3s;
}

.wx-login-button:hover {
  background-color: rgba(7, 193, 96, 0.1);
}

.register-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--n-text-color-3);
  margin-top: auto;
  padding-top: 1rem;
}

/* 微信登录弹窗 */
.wx-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wx-modal-title {
  font-size: 18px;
  font-weight: 500;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  min-height: 280px;
  justify-content: center;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--n-color-modal-overlay);
  border-radius: 8px;
  border: 1px dashed var(--n-border-color);
}

.qrcode-tip {
  margin-top: 16px;
  font-size: 14px;
  color: var(--n-text-color-3);
}

/* 错误状态 */
.qrcode-error {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--n-color-modal-overlay);
  border-radius: 8px;
  border: 1px dashed var(--n-border-color);
  padding: 20px;
}

.error-icon {
  color: var(--n-warning-color);
  margin-bottom: 12px;
}

.error-msg {
  text-align: center;
  color: var(--n-text-color);
  margin-bottom: 16px;
  font-size: 14px;
}

.retry-button {
  min-width: 100px;
}

.wx-modal-footer {
  display: flex;
  justify-content: space-between;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    width: 100%;
    border-radius: 8px;
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

  .login-methods {
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .method-tab {
    font-size: 14px;
    padding-bottom: 6px;
  }

  .verification-code-row {
    flex-direction: column;
    gap: 10px;
  }

  .send-code-button {
    width: 100%;
    min-width: unset;
  }

  .additional-links {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .link-separator {
    display: none;
  }
}
</style>
