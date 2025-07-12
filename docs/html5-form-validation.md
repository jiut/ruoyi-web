# HTML5 原生表单验证文档

## 目录
1. [概述](#概述)
2. [验证属性](#验证属性)
3. [输入类型](#输入类型)
4. [验证状态与伪类](#验证状态与伪类)
5. [自定义验证消息](#自定义验证消息)
6. [JavaScript API](#javascript-api)
7. [实际应用示例](#实际应用示例)
8. [最佳实践](#最佳实践)
9. [浏览器兼容性](#浏览器兼容性)

## 概述

HTML5 原生表单验证是浏览器内置的表单验证机制，无需编写JavaScript代码即可实现基本的表单验证功能。它通过HTML属性和输入类型来定义验证规则，浏览器会自动进行验证并提供用户反馈。

### 主要优势
- **零JavaScript成本**：无需编写验证代码
- **统一的用户体验**：跨浏览器一致的验证行为
- **可访问性友好**：内置的屏幕阅读器支持
- **性能优化**：浏览器原生实现，性能更好

### 触发时机
- 用户提交表单时（`submit` 事件）
- 失去焦点时（`blur` 事件）
- 实时输入时（部分浏览器）

---

## 验证属性

### 1. `required` - 必填字段

```html
<input type="text" name="username" required>
<textarea name="message" required></textarea>
<select name="country" required>
  <option value="">请选择</option>
  <option value="cn">中国</option>
</select>
```

### 2. `minlength` / `maxlength` - 字符长度限制

```html
<!-- 用户名：3-20字符 -->
<input type="text" name="username" minlength="3" maxlength="20" required>

<!-- 简介：最多500字符 -->
<textarea name="bio" maxlength="500"></textarea>
```

### 3. `min` / `max` - 数值范围限制

```html
<!-- 年龄：18-100 -->
<input type="number" name="age" min="18" max="100" required>

<!-- 评分：1-5星 -->
<input type="range" name="rating" min="1" max="5" value="3">

<!-- 生日：1900年后 -->
<input type="date" name="birthday" min="1900-01-01" max="2024-12-31">
```

### 4. `step` - 数值步长

```html
<!-- 价格：精确到分 -->
<input type="number" name="price" step="0.01" min="0">

<!-- 时间：15分钟间隔 -->
<input type="time" name="appointment" step="900">
```

### 5. `pattern` - 正则表达式验证

```html
<!-- 手机号：中国大陆格式 -->
<input type="tel" name="phone" pattern="^1[3-9]\d{9}$"
       title="请输入正确的手机号码">

<!-- 邮政编码：6位数字 -->
<input type="text" name="zipcode" pattern="[0-9]{6}"
       title="请输入6位邮政编码">

<!-- 用户名：字母数字下划线，3-20位 -->
<input type="text" name="username" pattern="^[a-zA-Z0-9_]{3,20}$"
       title="用户名只能包含字母、数字、下划线，长度3-20位">
```

---

## 输入类型

### 1. `email` - 邮箱验证

```html
<input type="email" name="email" required>
<!-- 自动验证邮箱格式，必须包含 @ 符号 -->
```

### 2. `url` - URL验证

```html
<input type="url" name="website" placeholder="https://example.com">
<!-- 自动验证URL格式，必须包含协议 -->
```

### 3. `tel` - 电话号码

```html
<input type="tel" name="phone" pattern="^1[3-9]\d{9}$">
<!-- 移动端会显示数字键盘 -->
```

### 4. `number` - 数字输入

```html
<input type="number" name="quantity" min="1" max="99" step="1">
<!-- 只接受数字输入，支持 min/max/step 属性 -->
```

### 5. `date` / `time` / `datetime-local` - 日期时间

```html
<input type="date" name="birthday" min="1900-01-01" max="2024-12-31">
<input type="time" name="appointment" min="09:00" max="18:00">
<input type="datetime-local" name="event-time">
```

### 6. `range` - 滑块范围

```html
<input type="range" name="volume" min="0" max="100" value="50">
<!-- 显示为滑块控件 -->
```

### 7. `color` - 颜色选择

```html
<input type="color" name="theme-color" value="#007AFF">
<!-- 显示颜色选择器 -->
```

---

## 验证状态与伪类

### CSS 伪类选择器

```css
/* 必填字段样式 */
input:required {
  border-left: 3px solid #ff6b6b;
}

/* 有效字段样式 */
input:valid {
  border-color: #51cf66;
  background-color: #f8fff8;
}

/* 无效字段样式 */
input:invalid {
  border-color: #ff6b6b;
  background-color: #fff5f5;
}

/* 可选字段样式 */
input:optional {
  border-left: 3px solid #74c0fc;
}

/* 范围内的数值 */
input:in-range {
  border-color: #51cf66;
}

/* 超出范围的数值 */
input:out-of-range {
  border-color: #ff6b6b;
}
```

### 完整的表单样式示例

```css
.form-field {
  position: relative;
  margin-bottom: 1rem;
}

.form-field input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-field input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field input:valid {
  border-color: #10b981;
}

.form-field input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

.form-field input:invalid:not(:placeholder-shown) + .error-message {
  display: block;
}

.error-message {
  display: none;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

---

## 自定义验证消息

### 1. 使用 `title` 属性

```html
<input type="email" name="email" title="请输入有效的邮箱地址" required>
<input type="tel" name="phone" pattern="^1[3-9]\d{9}$"
       title="请输入11位手机号码，如：13812345678">
```

### 2. 使用 JavaScript 自定义消息

```javascript
// 获取表单元素
const emailInput = document.querySelector('input[type="email"]');
const phoneInput = document.querySelector('input[type="tel"]');

// 自定义验证消息
emailInput.addEventListener('invalid', function(e) {
  if (this.validity.valueMissing) {
    this.setCustomValidity('请输入邮箱地址');
  } else if (this.validity.typeMismatch) {
    this.setCustomValidity('请输入正确的邮箱格式');
  }
});

phoneInput.addEventListener('invalid', function(e) {
  if (this.validity.valueMissing) {
    this.setCustomValidity('请输入手机号码');
  } else if (this.validity.patternMismatch) {
    this.setCustomValidity('请输入正确的手机号码格式');
  }
});

// 清除自定义消息（重要！）
emailInput.addEventListener('input', function() {
  this.setCustomValidity('');
});

phoneInput.addEventListener('input', function() {
  this.setCustomValidity('');
});
```

### 3. 多语言支持

```javascript
const messages = {
  'zh-CN': {
    email: {
      valueMissing: '请输入邮箱地址',
      typeMismatch: '请输入正确的邮箱格式'
    },
    phone: {
      valueMissing: '请输入手机号码',
      patternMismatch: '请输入正确的手机号码格式'
    }
  },
  'en-US': {
    email: {
      valueMissing: 'Please enter an email address',
      typeMismatch: 'Please enter a valid email format'
    },
    phone: {
      valueMissing: 'Please enter a phone number',
      patternMismatch: 'Please enter a valid phone number format'
    }
  }
};

function setCustomValidationMessage(input, fieldName, validityState) {
  const lang = navigator.language || 'zh-CN';
  const fieldMessages = messages[lang][fieldName];

  if (validityState.valueMissing) {
    input.setCustomValidity(fieldMessages.valueMissing);
  } else if (validityState.typeMismatch) {
    input.setCustomValidity(fieldMessages.typeMismatch);
  } else if (validityState.patternMismatch) {
    input.setCustomValidity(fieldMessages.patternMismatch);
  }
}
```

---

## JavaScript API

### 1. ValidityState 对象

```javascript
const input = document.querySelector('input[type="email"]');

// 检查验证状态
console.log(input.validity);

// ValidityState 属性
console.log(input.validity.valid);           // 是否有效
console.log(input.validity.valueMissing);    // 是否为空（required）
console.log(input.validity.typeMismatch);    // 类型不匹配
console.log(input.validity.patternMismatch); // 正则不匹配
console.log(input.validity.tooLong);         // 超过maxlength
console.log(input.validity.tooShort);        // 少于minlength
console.log(input.validity.rangeUnderflow);  // 小于min
console.log(input.validity.rangeOverflow);   // 大于max
console.log(input.validity.stepMismatch);    // 不符合step
console.log(input.validity.customError);     // 自定义错误
```

### 2. 表单验证方法

```javascript
const form = document.querySelector('form');
const input = document.querySelector('input[type="email"]');

// 检查单个字段
if (input.checkValidity()) {
  console.log('字段有效');
} else {
  console.log('字段无效：', input.validationMessage);
}

// 检查整个表单
if (form.checkValidity()) {
  console.log('表单有效');
} else {
  console.log('表单无效');
}

// 手动触发验证并显示错误
if (!form.checkValidity()) {
  form.reportValidity(); // 显示验证错误
}
```

### 3. 自定义验证逻辑

```javascript
const passwordInput = document.querySelector('input[name="password"]');
const confirmPasswordInput = document.querySelector('input[name="confirm-password"]');

// 自定义验证：确认密码
confirmPasswordInput.addEventListener('input', function() {
  if (this.value !== passwordInput.value) {
    this.setCustomValidity('两次输入的密码不一致');
  } else {
    this.setCustomValidity('');
  }
});

// 自定义验证：密码强度
passwordInput.addEventListener('input', function() {
  const password = this.value;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < 8) {
    this.setCustomValidity('密码长度至少8位');
  } else if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    this.setCustomValidity('密码必须包含大小写字母和数字');
  } else {
    this.setCustomValidity('');
  }
});
```

### 4. 阻止默认验证行为

```javascript
const form = document.querySelector('form');

// 阻止默认验证
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 手动验证
  if (this.checkValidity()) {
    // 表单有效，提交数据
    console.log('表单验证通过，提交数据');
    // 实际的提交逻辑
  } else {
    // 表单无效，显示错误
    console.log('表单验证失败');
    this.reportValidity();
  }
});

// 或者使用 novalidate 属性禁用验证
// <form novalidate>
```

---

## 实际应用示例

### 1. 用户注册表单

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户注册</title>
    <style>
        .form-container {
            max-width: 400px;
            margin: 2rem auto;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
        }

        .form-field {
            margin-bottom: 1rem;
        }

        .form-field label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .form-field input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .form-field input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-field input:valid {
            border-color: #10b981;
        }

        .form-field input:invalid:not(:placeholder-shown) {
            border-color: #ef4444;
        }

        .submit-btn {
            width: 100%;
            padding: 0.75rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .submit-btn:hover {
            background-color: #2563eb;
        }

        .submit-btn:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <form id="registrationForm">
            <h2>用户注册</h2>

            <div class="form-field">
                <label for="username">用户名 *</label>
                <input type="text" id="username" name="username"
                       pattern="^[a-zA-Z0-9_]{3,20}$"
                       title="用户名只能包含字母、数字、下划线，长度3-20位"
                       placeholder="请输入用户名" required>
            </div>

            <div class="form-field">
                <label for="email">邮箱地址 *</label>
                <input type="email" id="email" name="email"
                       title="请输入有效的邮箱地址"
                       placeholder="请输入邮箱地址" required>
            </div>

            <div class="form-field">
                <label for="phone">手机号码 *</label>
                <input type="tel" id="phone" name="phone"
                       pattern="^1[3-9]\d{9}$"
                       title="请输入11位手机号码"
                       placeholder="请输入手机号码" required>
            </div>

            <div class="form-field">
                <label for="password">密码 *</label>
                <input type="password" id="password" name="password"
                       minlength="8" maxlength="20"
                       title="密码长度8-20位"
                       placeholder="请输入密码" required>
            </div>

            <div class="form-field">
                <label for="confirmPassword">确认密码 *</label>
                <input type="password" id="confirmPassword" name="confirmPassword"
                       title="请再次输入密码"
                       placeholder="请确认密码" required>
            </div>

            <div class="form-field">
                <label for="age">年龄</label>
                <input type="number" id="age" name="age"
                       min="16" max="120"
                       title="年龄必须在16-120之间"
                       placeholder="请输入年龄">
            </div>

            <div class="form-field">
                <label for="website">个人网站</label>
                <input type="url" id="website" name="website"
                       title="请输入完整的网址"
                       placeholder="https://example.com">
            </div>

            <button type="submit" class="submit-btn">注册</button>
        </form>
    </div>

    <script>
        // 自定义验证消息
        const form = document.getElementById('registrationForm');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // 确认密码验证
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.setCustomValidity('两次输入的密码不一致');
            } else {
                this.setCustomValidity('');
            }
        });

        // 表单提交处理
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (this.checkValidity()) {
                alert('注册成功！');
                // 实际的注册逻辑
            } else {
                this.reportValidity();
            }
        });
    </script>
</body>
</html>
```

### 2. 设计师注册表单（基于项目中的实际需求）

```html
<template>
  <div class="designer-registration">
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- 基础信息 -->
      <div class="form-section">
        <h3>基础信息</h3>

        <!-- 姓名 -->
        <div class="form-field">
          <label for="designerName">
            姓名 <span class="required">*</span>
          </label>
          <input
            type="text"
            id="designerName"
            v-model="formData.designerName"
            required
            minlength="2"
            maxlength="20"
            :class="getFieldClass('designerName')"
            @blur="validateField('designerName')"
            @input="clearFieldError('designerName')"
          >
          <div v-if="errors.designerName" class="error-message">
            {{ errors.designerName }}
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-field">
          <label for="email">邮箱地址</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="getFieldClass('email')"
            @blur="validateField('email')"
            @input="clearFieldError('email')"
          >
          <div v-if="errors.email" class="error-message">
            {{ errors.email }}
          </div>
        </div>

        <!-- 手机号 -->
        <div class="form-field">
          <label for="phone">手机号码</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            pattern="^1[3-9]\d{9}$"
            :class="getFieldClass('phone')"
            @blur="validateField('phone')"
            @input="clearFieldError('phone')"
          >
          <div v-if="errors.phone" class="error-message">
            {{ errors.phone }}
          </div>
        </div>

        <!-- 作品集链接 -->
        <div class="form-field">
          <label for="portfolioUrl">作品集链接</label>
          <input
            type="url"
            id="portfolioUrl"
            v-model="formData.portfolioUrl"
            :class="getFieldClass('portfolioUrl')"
            @blur="validateField('portfolioUrl')"
            @input="clearFieldError('portfolioUrl')"
          >
          <div v-if="errors.portfolioUrl" class="error-message">
            {{ errors.portfolioUrl }}
          </div>
        </div>
      </div>

      <button type="submit" :disabled="!isFormValid">
        完成注册
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const formData = reactive({
  designerName: '',
  email: '',
  phone: '',
  portfolioUrl: ''
})

const errors = reactive({})

// 验证单个字段
const validateField = (fieldName) => {
  const input = document.getElementById(fieldName)
  if (!input) return

  // 清除之前的错误
  errors[fieldName] = ''

  // HTML5 验证
  if (!input.checkValidity()) {
    const validity = input.validity

    if (validity.valueMissing) {
      errors[fieldName] = getRequiredMessage(fieldName)
    } else if (validity.typeMismatch) {
      errors[fieldName] = getTypeMismatchMessage(fieldName)
    } else if (validity.patternMismatch) {
      errors[fieldName] = getPatternMismatchMessage(fieldName)
    } else if (validity.tooShort) {
      errors[fieldName] = `${getFieldLabel(fieldName)}长度不能少于${input.minLength}位`
    } else if (validity.tooLong) {
      errors[fieldName] = `${getFieldLabel(fieldName)}长度不能超过${input.maxLength}位`
    } else {
      errors[fieldName] = input.validationMessage
    }
  }

  // 自定义验证
  if (!errors[fieldName]) {
    const customError = getCustomValidationError(fieldName, formData[fieldName])
    if (customError) {
      errors[fieldName] = customError
    }
  }
}

// 获取字段显示名称
const getFieldLabel = (fieldName) => {
  const labels = {
    designerName: '姓名',
    email: '邮箱地址',
    phone: '手机号码',
    portfolioUrl: '作品集链接'
  }
  return labels[fieldName] || fieldName
}

// 获取必填错误消息
const getRequiredMessage = (fieldName) => {
  return `请输入${getFieldLabel(fieldName)}`
}

// 获取类型不匹配错误消息
const getTypeMismatchMessage = (fieldName) => {
  const messages = {
    email: '请输入正确的邮箱格式',
    url: '请输入正确的网址格式'
  }
  return messages[fieldName] || '格式不正确'
}

// 获取正则不匹配错误消息
const getPatternMismatchMessage = (fieldName) => {
  const messages = {
    phone: '请输入正确的手机号码格式'
  }
  return messages[fieldName] || '格式不正确'
}

// 自定义验证规则
const getCustomValidationError = (fieldName, value) => {
  if (!value) return null

  switch (fieldName) {
    case 'designerName':
      if (!/^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/.test(value)) {
        return '姓名只能包含中文、英文和空格，长度2-20位'
      }
      break
    case 'phone':
      if (value && !/^1[3-9]\d{9}$/.test(value)) {
        return '请输入正确的手机号码'
      }
      break
  }

  return null
}

// 清除字段错误
const clearFieldError = (fieldName) => {
  errors[fieldName] = ''
}

// 获取字段样式类
const getFieldClass = (fieldName) => {
  return {
    'form-input': true,
    'error': errors[fieldName],
    'valid': formData[fieldName] && !errors[fieldName]
  }
}

// 验证整个表单
const isFormValid = computed(() => {
  // 必填字段检查
  if (!formData.designerName) return false

  // 错误检查
  const hasErrors = Object.values(errors).some(error => error)
  return !hasErrors
})

// 表单提交
const handleSubmit = () => {
  // 验证所有字段
  Object.keys(formData).forEach(validateField)

  // 检查是否有错误
  const hasErrors = Object.values(errors).some(error => error)

  if (hasErrors) {
    // 聚焦到第一个错误字段
    const firstErrorField = Object.keys(errors).find(key => errors[key])
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus()
    }
    return
  }

  // 提交表单
  console.log('表单提交：', formData)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.valid {
  border-color: #10b981;
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.required {
  color: #ef4444;
}
</style>
```

---

## 最佳实践

### 1. 用户体验优化

```javascript
// 实时验证 vs 失去焦点验证
input.addEventListener('blur', validateField);  // 推荐：失去焦点时验证
input.addEventListener('input', clearErrors);   // 推荐：输入时清除错误

// 避免过于频繁的验证
let validationTimeout;
input.addEventListener('input', function() {
  clearTimeout(validationTimeout);
  validationTimeout = setTimeout(() => {
    validateField(this);
  }, 500); // 500ms 后验证
});
```

### 2. 错误消息设计

```javascript
// ❌ 不好的错误消息
"Invalid input"
"Error"
"This field is required"

// ✅ 好的错误消息
"请输入邮箱地址"
"邮箱格式不正确，请检查是否包含@符号"
"手机号码格式不正确，请输入11位数字"
```

### 3. 渐进式增强

```html
<!-- 基础 HTML 表单 -->
<form>
  <input type="email" required>
  <button type="submit">提交</button>
</form>

<!-- JavaScript 增强 -->
<script>
  // 检查浏览器支持
  if ('validity' in document.createElement('input')) {
    // 支持 HTML5 验证
    enhanceFormValidation();
  } else {
    // 降级到 JavaScript 验证
    fallbackValidation();
  }
</script>
```

### 4. 可访问性考虑

```html
<!-- 使用 aria-describedby 关联错误消息 -->
<div class="form-field">
  <label for="email">邮箱地址</label>
  <input type="email" id="email" aria-describedby="email-error">
  <div id="email-error" class="error-message" role="alert">
    请输入有效的邮箱地址
  </div>
</div>

<!-- 使用 aria-invalid 标记无效字段 -->
<input type="email" aria-invalid="true">
```

### 5. 移动端优化

```html
<!-- 使用合适的 inputmode -->
<input type="text" inputmode="numeric" pattern="[0-9]*">  <!-- 数字键盘 -->
<input type="text" inputmode="email">                      <!-- 邮箱键盘 -->
<input type="text" inputmode="tel">                        <!-- 电话键盘 -->
<input type="text" inputmode="url">                        <!-- URL键盘 -->

<!-- 使用 autocomplete 属性 -->
<input type="email" autocomplete="email">
<input type="tel" autocomplete="tel">
<input type="text" autocomplete="given-name">
```

---

## 浏览器兼容性

### 支持情况

| 功能 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|----|
| 基础验证 | ✅ | ✅ | ✅ | ✅ | 10+ |
| 输入类型 | ✅ | ✅ | ✅ | ✅ | 部分 |
| 验证API | ✅ | ✅ | ✅ | ✅ | 10+ |
| 自定义消息 | ✅ | ✅ | ✅ | ✅ | 10+ |

### 兼容性处理

```javascript
// 检查支持情况
function checkFormValidationSupport() {
  const input = document.createElement('input');
  return 'validity' in input && 'checkValidity' in input;
}

// Polyfill 示例
if (!checkFormValidationSupport()) {
  // 加载 polyfill
  loadScript('https://cdn.jsdelivr.net/npm/formvalidation@1.8.1/dist/js/FormValidation.min.js');
}

// 功能检测
function supportsInputType(type) {
  const input = document.createElement('input');
  input.type = type;
  return input.type === type;
}

// 使用检测结果
if (!supportsInputType('email')) {
  // 使用自定义验证
  addCustomEmailValidation();
}
```

---

## 总结

HTML5 原生表单验证是一个强大且易用的功能，它可以：

1. **减少 JavaScript 代码量**：基本验证无需编写代码
2. **提供一致的用户体验**：跨浏览器统一的验证行为
3. **支持自定义扩展**：可以通过 JavaScript 增强功能
4. **具有良好的可访问性**：内置的屏幕阅读器支持

### 使用建议

1. **优先使用 HTML5 属性**：`required`、`type`、`pattern` 等
2. **合理使用 JavaScript**：用于复杂验证逻辑和用户体验增强
3. **提供清晰的错误消息**：帮助用户理解和修正错误
4. **考虑移动端体验**：使用合适的输入类型和键盘
5. **做好兼容性处理**：为不支持的浏览器提供降级方案

通过合理运用 HTML5 原生表单验证，可以构建出既高效又用户友好的表单应用。
