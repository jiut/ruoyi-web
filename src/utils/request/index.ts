import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'
import { useAuthStore } from '@/store'

export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  params?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Response<T = any> {
  data: T
  msg: string | undefined
  code: number,
  rows: []
}

function http<T = any>(
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    const authStore = useAuthStore()
    if (res.data.code === 200) {
      return res.data
    } else if (res.data.code === 401) {
      // 只有认证失败时才清除token和重定向
      authStore.removeToken()
      // 如果当前不在登录页面，才进行跳转
      // if (!window.location.hash.includes('/login')) {
      //   window.location.href = '#/login'
      // }
    } else {
      // 其他错误直接抛出，不刷新页面
      return Promise.reject(res.data)
          }
  }

  const failHandler = (error: any) => {
    console.error('请求失败:', error)
    afterRequest?.()

    // 检查是否是网络错误或服务器错误
    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response
      if (status === 401) {
        const authStore = useAuthStore()
        authStore.removeToken()
        // 如果当前不在登录页面，才进行跳转
        // if (!window.location.hash.includes('/login')) {
        //   window.location.href = '#/login'
        // }
      }
      return Promise.reject(data || error)
    } else if (error.request) {
      // 请求发出了但没有收到响应
      return Promise.reject({ error: true, message: '网络请求失败，请检查网络连接' })
    } else {
      // 其他错误
      return Promise.reject({ error: true, message: error.message || '请求失败' })
    }
  }

  beforeRequest?.()

  method = (method || 'GET').toUpperCase()

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  if (method === 'GET') {
    return request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else if (method === 'POST') {
    return request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else if (method === 'PUT') {
    return request.put(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else if (method === 'DELETE') {
    return request.delete(url, { params, headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  } else {
    // 默认使用POST
    return request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
  }
}

export function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T> | undefined> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T> | undefined> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post
