import type { LoginFrom } from '@/typings/user'
import request from '@/utils/request/req'
/**
 * 用户登录
 */
export function doLogin<T>(params: LoginFrom) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: params,
	  })
}

/**
 * 用户注册
 */
export function doRegist<T>(username: string, password: string, code: string) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: { username, password, code },
  })
}

/**
 * 重置密码
 */
export function reset<T>(username: string, password: string, code: string) {
  return request({
    url: '/auth/reset/password',
    method: 'post',
    data: { username, password, code },
  })
}

/**
 * 获取邮箱验证码
 */
export function getVerificationCode(username: string) {
  return request({
    url: '/resource/email/code',
    method: 'post',
    data: { username },
  })
}

/**
 * 获取短信验证码
 */
export function getSmsCode(phonenumber: string, scene?: string) {
  return request({
    url: '/resource/sms/code',
    method: 'get',
    params: { phonenumber, scene },
  })
}

/**
 * 短信验证码登录
 */
export function smsLogin(phonenumber: string, smsCode: string, tenantId: string = '000000') {
  return request({
    url: '/auth/smsLogin',
    method: 'post',
    data: { phonenumber, smsCode, tenantId },
  })
}

/**
 * 绑定手机号
 */
export function bindPhone(phonenumber: string, smsCode: string) {
  return request({
    url: '/system/user/bind/phone',
    method: 'post',
    data: { phonenumber, smsCode },
  })
}

/**
 * 获取用户登录信息
 */
export function getUserInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get',
  })
}

/**
 * 修改用户名称
 */
export function editUserNmae(nickName: string) {
  return request({
    url: '/system/user/editName',
    method: 'post',
    data: { nickName },
  })
}

/**
 * 专用角色选择接口（绕过权限和数据限制）
 */
export function selectUserRole(roleId: string) {
  return request({
    url: '/system/user/selectRole',
    method: 'post',
    data: {
      roleId, // 保持字符串格式
    },
  })
}

/**
 * 退出登录
 */
export function loginOut() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey: string) {
  return request({
	  url: `/chat/config/configKey/${configKey}`,
	  method: 'get',
  })
}

// 根据授权编码激活系统
export function authSystem(code: string) {
  return request({
	  url: `/chat/config/authSystem/${code}`,
	  method: 'post',
  })
}

// 获取登录二维码
export function getMpQrCode() {
  return request({
	  url: '/user/qrcode',
	  method: 'get',
  })
}

// 查询登陆状态
export function getLoginType(ticket: string) {
  const encodedTicket = encodeURIComponent(ticket)
  return request({
    url: `/user/login/qrcode?ticket=${encodedTicket}`,
    method: 'get',
  })
}
