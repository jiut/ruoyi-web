/**
 * 状态工具函数 - 直接处理后端 '0'/'1' 格式
 */

/**
 * 获取状态显示文本
 * @param status 状态值 ('0' = 启用, '1' = 停用)
 * @returns 显示文本
 */
export function getStatusText(status: string): string {
  return status === '0' ? '启用' : '停用'
}

/**
 * 获取状态显示样式类名
 * @param status 状态值 ('0' = 启用, '1' = 停用)
 * @returns CSS类名
 */
export function getStatusClass(status: string): string {
  return status === '0' ? 'status-active' : 'status-inactive'
}

/**
 * 获取状态颜色（适用于标签组件）
 * @param status 状态值 ('0' = 启用, '1' = 停用)
 * @returns 颜色类型
 */
export function getStatusTagType(status: string): 'success' | 'error' {
  return status === '0' ? 'success' : 'error'
}

/**
 * 获取状态图标
 * @param status 状态值 ('0' = 启用, '1' = 停用)
 * @returns 图标类名
 */
export function getStatusIcon(status: string): string {
  return status === '0' ? 'ri-check-circle-line' : 'ri-close-circle-line'
}

/**
 * 检查状态是否为启用
 * @param status 状态值
 * @returns 是否启用
 */
export function isStatusActive(status: string): boolean {
  return status === '0'
}

/**
 * 切换状态值
 * @param status 当前状态值
 * @returns 切换后的状态值
 */
export function toggleStatus(status: string): string {
  return status === '0' ? '1' : '0'
}

/**
 * 状态值的类型定义
 */
export type StatusValue = '0' | '1'

/**
 * 验证状态值是否有效
 * @param status 状态值
 * @returns 是否有效
 */
export function isValidStatus(status: string): status is StatusValue {
  return status === '0' || status === '1'
}
