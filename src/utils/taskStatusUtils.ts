import { TaskStatus } from '@/types/talent/taskFactory'

/**
 * 映射任务状态到显示文本
 */
export function mapTaskStatusToDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    [TaskStatus.DRAFT]: '草稿',
    [TaskStatus.PUBLISHED]: '已发布',
    [TaskStatus.IN_PROGRESS]: '进行中',
    [TaskStatus.COMPLETED]: '已完成',
    [TaskStatus.CANCELLED]: '已取消',
  }
  return statusMap[status] || '未知状态'
}

/**
 * 获取任务状态样式类
 */
export function getTaskStatusClass(displayStatus: string): string {
  const classMap: Record<string, string> = {
    '进行中': 'bg-blue-500/20 text-blue-400',
    '已完成': 'bg-green-500/20 text-green-400',
    '已发布': 'bg-orange-500/20 text-orange-400',
    '草稿': 'bg-gray-500/20 text-gray-400',
    '已取消': 'bg-red-500/20 text-red-400',
  }

  return classMap[displayStatus] || 'bg-yellow-500/20 text-yellow-400'
}

/**
 * 检查任务是否可以管理申请（基于原始状态）
 */
export function canManageTask(status: string): boolean {
  return [TaskStatus.DRAFT, TaskStatus.PUBLISHED].includes(status as TaskStatus)
}

/**
 * 检查任务是否可以编辑（基于原始状态）
 */
export function canEditTask(status: string): boolean {
  return ![TaskStatus.COMPLETED, TaskStatus.CANCELLED].includes(status as TaskStatus)
}

/**
 * 基于显示状态检查是否可以管理申请
 */
export function canManageTaskByDisplayStatus(displayStatus: string): boolean {
  return ['草稿', '已发布'].includes(displayStatus)
}

/**
 * 基于显示状态检查是否可以编辑任务
 */
export function canEditTaskByDisplayStatus(displayStatus: string): boolean {
  return !['已完成', '已取消'].includes(displayStatus)
}
