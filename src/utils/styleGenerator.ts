// 样式生成工具
// 用于为教师头像和专业标签随机生成样式类

// 预定义的渐变色彩方案
const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-primary to-purple-500',
  'bg-gradient-to-br from-blue-500 to-cyan-400',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-red-500 to-pink-500',
  'bg-gradient-to-br from-purple-500 to-indigo-500',
  'bg-gradient-to-br from-yellow-500 to-orange-500',
  'bg-gradient-to-br from-blue-600 to-blue-400',
  'bg-gradient-to-br from-green-600 to-teal-500',
  'bg-gradient-to-br from-indigo-500 to-purple-400',
  'bg-gradient-to-br from-amber-600 to-amber-400',
  'bg-gradient-to-br from-rose-500 to-pink-400',
  'bg-gradient-to-br from-teal-500 to-cyan-500',
  'bg-gradient-to-br from-orange-500 to-red-400',
  'bg-gradient-to-br from-violet-500 to-purple-500'
]

// 预定义的标签颜色方案
const TAG_COLOR_SCHEMES = [
  { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' }
]

// 预定义的雇主背景颜色方案
const EMPLOYER_COLOR_SCHEMES = [
  'bg-gray-500/20',
  'bg-blue-500/20',
  'bg-green-500/20',
  'bg-red-500/20',
  'bg-purple-500/20',
  'bg-yellow-500/20',
  'bg-indigo-500/20',
  'bg-teal-500/20',
  'bg-orange-500/20',
  'bg-pink-500/20',
  'bg-cyan-500/20',
  'bg-amber-500/20',
  'bg-emerald-500/20',
  'bg-violet-500/20',
  'bg-rose-500/20',
  'bg-blue-600/20',
  'bg-green-600/20',
  'bg-red-600/20',
  'bg-purple-600/20',
  'bg-indigo-600/20',
  'bg-gray-600/20',
  'bg-gray-700/20',
  'bg-blue-700/20',
  'bg-blue-800/20'
]

/**
 * 根据字符串生成稳定的随机数
 * 确保相同的输入总是得到相同的输出
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return Math.abs(hash)
}

/**
 * 生成教师头像的渐变色类名
 * @param teacherId 教师ID
 * @param teacherName 教师姓名（用于增加随机性）
 * @returns 头像渐变色类名
 */
export function generateAvatarClass(teacherId: number, teacherName: string): string {
  const seed = hashString(`${teacherId}_${teacherName}`)
  const index = seed % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[index]
}

/**
 * 生成专业标签的样式类数组
 * @param teacherId 教师ID
 * @param expertise 专业领域数组
 * @returns 标签样式类数组
 */
export function generateTagClasses(teacherId: number, expertise: string[]): string[] {
  const seed = hashString(`${teacherId}_${expertise.join('_')}`)

  return expertise.map((_, index) => {
    // 为每个标签生成不同的颜色
    const colorIndex = (seed + index) % TAG_COLOR_SCHEMES.length
    const scheme = TAG_COLOR_SCHEMES[colorIndex]
    return `${scheme.bg} ${scheme.text} ${scheme.border}`
  })
}

/**
 * 为教师数据生成样式属性
 * @param teacher 教师基础数据
 * @returns 包含样式属性的完整教师数据
 */
export function generateTeacherStyles<T extends { id: number; name: string; expertise: string[] }>(
  teacher: T
): T & { avatarClass: string; tagClasses: string[] } {
  return {
    ...teacher,
    avatarClass: generateAvatarClass(teacher.id, teacher.name),
    tagClasses: generateTagClasses(teacher.id, teacher.expertise)
  }
}

// 工具函数：获取名称的首字母
export function getNameInitial(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?'
  }
  return name.trim().charAt(0).toUpperCase()
}

/**
 * 生成雇主的颜色类名
 * @param employerId 雇主ID
 * @param employerName 雇主名称（用于增加随机性）
 * @returns 雇主颜色类名
 */
export function generateEmployerColorClass(employerId: number, employerName: string): string {
  const seed = hashString(`${employerId}_${employerName}`)
  const index = seed % EMPLOYER_COLOR_SCHEMES.length
  return EMPLOYER_COLOR_SCHEMES[index]
}

/**
 * 为雇主数据生成样式属性
 * @param employer 雇主基础数据
 * @returns 包含样式属性的完整雇主数据
 */
export function generateEmployerStyles<T extends { id: number; name: string }>(
  employer: T
): T & { colorClass: string } {
  return {
    ...employer,
    colorClass: generateEmployerColorClass(employer.id, employer.name)
  }
}
