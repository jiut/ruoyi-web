/**
 * 技能标签Vue组合式函数
 * 用于在Vue组件中便捷使用技能标签功能
 *
 * 核心原则：
 * 1. 后端返回英文简写格式（如 'figma', 'interaction_design'）
 * 2. 前端自动转换为中文显示（如 'Figma', '交互设计'）
 * 3. 按照分类显示不同颜色（tool/field/skill）
 */

import { computed } from 'vue'
import SkillTagUtils, { type SkillTagCategory, type SkillTagData, type CategoryStats } from '@/utils/skillTagUtils'

export interface UseSkillTagsOptions {
  defaultCategory?: SkillTagCategory
}

export function useSkillTags(options: UseSkillTagsOptions = {}) {
  const { defaultCategory = 'skill' } = options

  /**
   * 获取标签分类（输入英文简写）
   */
  const getTagCategory = (tag: string): SkillTagCategory => {
    return SkillTagUtils.getTagCategory(tag)
  }

  /**
   * 获取标签中文显示名称（输入英文简写，输出中文）
   */
  const getTagDisplayName = (tag: string): string => {
    return SkillTagUtils.getTagDisplayName(tag)
  }

  /**
   * 获取标签样式类名（输入英文简写）
   */
  const getTagClasses = (tag: string, size: 'sm' | 'md' | 'lg' = 'md'): string => {
    return SkillTagUtils.getTagClasses(tag, size)
  }

  /**
   * 获取完整的标签样式类名（输入英文简写）
   */
  const getFullTagClasses = (tag: string, options: {
    size?: 'sm' | 'md' | 'lg'
    selected?: boolean
    disabled?: boolean
  } = {}): string => {
    const { size, selected, disabled } = options
    const baseClass = 'text-xs px-2 py-1 rounded-full border font-medium transition-all duration-200 ease-in-out'
    const categoryClass = getTagClasses(tag)

    let classes = `${baseClass} ${categoryClass}`

    if (size && size !== 'md') {
      classes += ` skill-tag-${size}`
    }

    if (selected) {
      classes += ' selected'
    }

    if (disabled) {
      classes += ' disabled'
    }

    return classes
  }

  /**
   * 获取多个标签的样式类名映射（输入英文简写数组）
   */
  const getTagsClasses = computed(() => {
    return (tags: string[]) => {
      return tags.reduce((acc, tag) => {
        acc[tag] = getTagClasses(tag)
        return acc
      }, {} as Record<string, string>)
    }
  })

  /**
   * 获取多个标签的中文显示名称映射（输入英文简写数组）
   */
  const getTagsDisplayNames = computed(() => {
    return (tags: string[]) => {
      return tags.reduce((acc, tag) => {
        acc[tag] = getTagDisplayName(tag)
        return acc
      }, {} as Record<string, string>)
    }
  })

  /**
   * 按分类分组标签（输入英文简写数组）
   */
  const groupTagsByCategory = (tags: string[]): Record<SkillTagCategory, string[]> => {
    return SkillTagUtils.groupTagsByCategory(tags)
  }

  /**
   * 获取分类统计（输入英文简写数组）
   */
  const getCategoryStats = (tags: string[]): CategoryStats => {
    return SkillTagUtils.getCategoryStats(tags)
  }

  /**
   * 将字符串数组转换为SkillTagData数组
   * @param tags - 英文简写标签数组
   * @returns SkillTagData数组
   */
  const convertToTagData = (tags: string[]): SkillTagData[] => {
    return SkillTagUtils.convertToTagData(tags)
  }

  /**
   * 解析技能标签字符串（支持JSON格式）
   * @param skillsStr - 技能标签字符串
   * @returns 英文简写标签数组
   */
  const parseSkillTags = (skillsStr: string): string[] => {
    return SkillTagUtils.parseSkillTags(skillsStr)
  }

  /**
   * 获取所有可用的标签
   * @returns 所有标签的SkillTagData数组
   */
  const getAllTags = (): SkillTagData[] => {
    return SkillTagUtils.getAllTags()
  }

  /**
   * 根据分类获取标签
   * @param category - 分类
   * @returns 该分类下的SkillTagData数组
   */
  const getTagsByCategory = (category: SkillTagCategory): SkillTagData[] => {
    return SkillTagUtils.getTagsByCategory(category)
  }

  /**
   * 分类名称映射
   */
  const categoryNames = computed(() => SkillTagUtils.categoryNames)

  /**
   * 分类描述映射
   */
  const categoryDescriptions = computed(() => SkillTagUtils.categoryDescriptions)

  /**
   * 分类颜色映射
   */
  const categoryColors = {
    tool: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      ring: 'ring-blue-400'
    },
    field: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      ring: 'ring-purple-400'
    },
    skill: {
      bg: 'bg-pink-500/20',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      ring: 'ring-pink-400'
    }
  }

  /**
   * 预定义的技能标签数据
   */
  const predefinedTags = {
    tools: [
      'Figma', 'Sketch', 'Photoshop', 'Illustrator', 'After Effects',
      'Adobe XD', 'InVision', 'Framer', 'Principle', 'Axure RP', 'Lottie'
    ],
    fields: [
      '交互设计', 'UI设计', '品牌设计', '产品设计', '动效设计', '游戏美术',
      '网页设计', '移动端设计', '平面设计', 'LOGO设计'
    ],
    skills: [
      '用户体验', '用户研究', '原型设计', '设计系统', '信息架构', '视觉系统',
      '用户测试', '用户画像', '用户旅程', '可用性测试'
    ]
  }

  /**
   * 检查标签是否为某个分类（输入英文简写）
   */
  const isToolTag = (tag: string) => getTagCategory(tag) === 'tool'
  const isFieldTag = (tag: string) => getTagCategory(tag) === 'field'
  const isSkillTag = (tag: string) => getTagCategory(tag) === 'skill'

  /**
   * 筛选特定分类的标签（输入英文简写数组）
   */
  const filterTagsByCategory = (tags: string[], category: SkillTagCategory) => {
    return tags.filter(tag => getTagCategory(tag) === category)
  }

  /**
   * 调试函数：测试技能标签分类和样式生成（输入英文简写数组）
   */
  const debugSkillTags = (tags: string[]) => {
    console.log('🔍 技能标签调试信息:')
    console.log(`📊 总标签数量: ${tags.length}`)

    tags.forEach((tag, index) => {
      const category = getTagCategory(tag)
      const displayName = getTagDisplayName(tag)
      const classes = getTagClasses(tag)
      const categoryIcon = categoryNames[category]
      console.log(`📍 [${index + 1}] 英文简写: "${tag}" -> 中文显示: "${displayName}" | 分类: ${categoryIcon} (${category}) | CSS类: "${classes}"`)
    })

    const stats = getCategoryStats(tags)
    console.log('📊 分类统计:', stats)

    const grouped = groupTagsByCategory(tags)
    console.log('📋 分组结果:', grouped)

    // 测试样式生成
    console.log('🎨 样式测试:')
    Object.entries(grouped).forEach(([category, categoryTags]) => {
      if (categoryTags.length > 0) {
        const displayNames = categoryTags.map(tag => getTagDisplayName(tag))
        console.log(`  ${categoryNames[category as SkillTagCategory]}:`, categoryTags, '-> 中文显示:', displayNames)
      }
    })
  }

  return {
    // 核心方法
    getTagCategory,
    getTagDisplayName,
    getTagClasses,
    getFullTagClasses,
    getTagsClasses,
    getTagsDisplayNames,
    groupTagsByCategory,
    getCategoryStats,
    convertToTagData,
    parseSkillTags,
    getAllTags,
    getTagsByCategory,

    // 工具方法
    isToolTag,
    isFieldTag,
    isSkillTag,
    filterTagsByCategory,

    // 调试方法
    debugSkillTags,

    // 数据
    categoryNames,
    categoryDescriptions,
    categoryColors,
    predefinedTags
  }
}

/**
 * 全局技能标签状态管理
 * 仅使用默认主题
 */
export const globalSkillTagState = {
  theme: 'default' as const
}
