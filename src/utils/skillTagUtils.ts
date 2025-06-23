/**
 * 技能标签工具类
 * 用于处理技能标签的分类、颜色和渲染
 *
 * @author ruoyi
 * @version 1.0.0
 */

// 技能标签分类类型
export type SkillTagCategory = 'tool' | 'field' | 'skill'

// 技能标签数据接口
export interface SkillTagData {
  code: string
  name: string
  category: SkillTagCategory
}

// 主题类型
export type ThemeName = 'default'

// 颜色配置接口
interface ColorConfig {
  bg: string
  text: string
  border: string
}

// 主题配置接口
interface ThemeConfig {
  tool: ColorConfig
  field: ColorConfig
  skill: ColorConfig
}

// 自定义选项接口
interface RenderOptions {
  baseClasses?: string
  gap?: string
  wrapper?: string
  wrapperClasses?: string
  spacing?: string
  showGroupTitle?: boolean
  groupGap?: string
  itemGap?: string
}

// 分类统计接口
export interface CategoryStats {
  tool: number
  field: number
  skill: number
}

class SkillTagUtils {
  // 技能标签分类映射表（英文简写 -> 分类）
  private static categoryMap = new Map<string, SkillTagCategory>([
    // ========== 设计工具/软件类 (TOOL) ==========
    ['figma', 'tool'],
    ['sketch', 'tool'],
    ['axure_rp', 'tool'],
    ['photoshop', 'tool'],
    ['illustrator', 'tool'],
    ['after_effects', 'tool'],
    ['cinema_4d', 'tool'],
    ['blender', 'tool'],
    ['3d_max', 'tool'],
    ['maya', 'tool'],
    ['adobe_xd', 'tool'],
    ['invision', 'tool'],
    ['framer', 'tool'],
    ['principle', 'tool'],
    ['zeplin', 'tool'],
    ['abstract', 'tool'],
    ['lottie', 'tool'],

    // ========== 设计专业领域类 (FIELD) ==========
    ['interaction_design', 'field'],
    ['ui_design', 'field'],
    ['brand_design', 'field'],
    ['product_design', 'field'],
    ['motion_design', 'field'],
    ['game_art', 'field'],
    ['web_design', 'field'],
    ['mobile_design', 'field'],
    ['graphic_design', 'field'],
    ['logo_design', 'field'],
    ['interface_design', 'field'],
    ['brand_identity', 'field'],
    ['animation_design', 'field'],
    ['branding', 'field'],

    // ========== 设计技能/方法类 (SKILL) ==========
    ['user_experience', 'skill'],
    ['user_research', 'skill'],
    ['prototype_design', 'skill'],
    ['design_system', 'skill'],
    ['information_architecture', 'skill'],
    ['visual_system', 'skill'],
    ['wireframing', 'skill'],
    ['user_testing', 'skill'],
    ['persona_design', 'skill'],
    ['journey_mapping', 'skill'],
    ['usability_testing', 'skill'],
    ['visual_design', 'skill'],
    ['typography', 'skill'],
    ['color_theory', 'skill'],
    ['illustration', 'skill'],
    ['character_design', 'skill'],
    ['scene_design', 'skill'],
    ['visual_identity', 'skill'],
    ['animation', 'skill'],
    ['effects', 'skill'],
    ['3d_modeling', 'skill'],
    ['photography', 'skill'],
    ['video_editing', 'skill']
  ])

  // 英文简写到中文显示名称的映射表
  private static nameMap = new Map<string, string>([
    // ========== 设计工具/软件类 (TOOL) ==========
    ['figma', 'Figma'],
    ['sketch', 'Sketch'],
    ['axure_rp', 'Axure RP'],
    ['photoshop', 'Photoshop'],
    ['illustrator', 'Illustrator'],
    ['after_effects', 'After Effects'],
    ['cinema_4d', 'Cinema 4D'],
    ['blender', 'Blender'],
    ['3d_max', '3D Max'],
    ['maya', 'Maya'],
    ['adobe_xd', 'Adobe XD'],
    ['invision', 'InVision'],
    ['framer', 'Framer'],
    ['principle', 'Principle'],
    ['zeplin', 'Zeplin'],
    ['abstract', 'Abstract'],
    ['lottie', 'Lottie'],

    // ========== 设计专业领域类 (FIELD) ==========
    ['interaction_design', '交互设计'],
    ['ui_design', 'UI设计'],
    ['brand_design', '品牌设计'],
    ['product_design', '产品设计'],
    ['motion_design', '动效设计'],
    ['game_art', '游戏美术'],
    ['web_design', '网页设计'],
    ['mobile_design', '移动端设计'],
    ['graphic_design', '平面设计'],
    ['logo_design', 'LOGO设计'],
    ['interface_design', '界面设计'],
    ['brand_identity', '品牌标识'],
    ['animation_design', '动画制作'],
    ['branding', '品牌设计'],

    // ========== 设计技能/方法类 (SKILL) ==========
    ['user_experience', '用户体验'],
    ['user_research', '用户研究'],
    ['prototype_design', '原型设计'],
    ['design_system', '设计系统'],
    ['information_architecture', '信息架构'],
    ['visual_system', '视觉系统'],
    ['wireframing', '线框设计'],
    ['user_testing', '用户测试'],
    ['persona_design', '用户画像'],
    ['journey_mapping', '用户旅程'],
    ['usability_testing', '可用性测试'],
    ['visual_design', '视觉设计'],
    ['typography', '字体设计'],
    ['color_theory', '色彩理论'],
    ['illustration', '插画'],
    ['character_design', '角色设计'],
    ['scene_design', '场景设计'],
    ['visual_identity', '视觉识别'],
    ['animation', '动画'],
    ['effects', '动效'],
    ['3d_modeling', '3D建模'],
    ['photography', '摄影'],
    ['video_editing', '视频剪辑']
  ])

  // 分类名称映射
  static categoryNames: Record<SkillTagCategory, string> = {
    tool: '🔵 设计工具',
    field: '🟣 专业领域',
    skill: '🩷 技能方法'
  }

  // 分类描述映射
  static categoryDescriptions: Record<SkillTagCategory, string> = {
    tool: '设计工具/软件类',
    field: '设计专业领域类',
    skill: '设计技能/方法类'
  }

  // 主题配置（仅保留默认主题）
  private static themes: Record<ThemeName, ThemeConfig> = {
    default: {
      tool: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      },
      field: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      },
      skill: {
        bg: 'bg-pink-500/20',
        text: 'text-pink-400',
        border: 'border-pink-500/30'
      }
    }
  }

  /**
   * 获取标签分类
   * @param tag - 英文简写标签名称
   * @returns 分类代码：'tool', 'field', 'skill'
   */
  static getTagCategory(tag: string): SkillTagCategory {
    return this.categoryMap.get(tag) || 'skill'
  }

  /**
   * 获取标签中文显示名称
   * @param tag - 英文简写标签名称
   * @returns 中文显示名称
   */
  static getTagDisplayName(tag: string): string {
    return this.nameMap.get(tag) || tag
  }

  /**
   * 获取标签样式类名
   * @param tag - 英文简写标签名称
   * @param size - 尺寸：'sm', 'md', 'lg'
   * @returns CSS类名字符串
   */
  static getTagClasses(tag: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
    const category = this.getTagCategory(tag)
    let classes = `skill-tag skill-tag-${category}`

    if (size !== 'md') {
      classes += ` skill-tag-${size}`
    }

    return classes
  }

  /**
   * 生成单个标签HTML
   * @param tag - 英文简写标签名称
   * @param theme - 主题名称
   * @param options - 自定义配置
   * @returns HTML字符串
   */
  static generateTagHTML(tag: string, theme: ThemeName = 'default', options: RenderOptions = {}): string {
    const classes = this.getTagClasses(tag)
    const displayName = this.getTagDisplayName(tag)
    return `<span class="${classes}">${displayName}</span>`
  }

  /**
   * 生成多个标签HTML
   * @param tags - 英文简写标签数组
   * @param theme - 主题名称
   * @param options - 自定义配置
   * @returns HTML字符串
   */
  static generateTagsHTML(tags: string[], theme: ThemeName = 'default', options: RenderOptions = {}): string {
    const defaultOptions = {
      gap: 'gap-2',
      wrapper: 'div',
      wrapperClasses: 'flex flex-wrap'
    }

    const config = { ...defaultOptions, ...options }

    const tagsHTML = tags.map(tag => this.generateTagHTML(tag, theme, config)).join(' ')

    if (config.wrapper) {
      return `<${config.wrapper} class="${config.wrapperClasses} ${config.gap}">${tagsHTML}</${config.wrapper}>`
    }

    return tagsHTML
  }

  /**
   * 直接渲染标签到DOM元素
   * @param container - 容器选择器或DOM元素
   * @param tags - 英文简写标签数组
   * @param theme - 主题名称
   * @param options - 自定义配置
   */
  static renderTags(container: string | Element, tags: string[], theme: ThemeName = 'default', options: RenderOptions = {}): void {
    const element = typeof container === 'string' ? document.querySelector(container) : container
    if (!element) {
      console.warn('SkillTagUtils: 容器元素未找到')
      return
    }

    element.innerHTML = this.generateTagsHTML(tags, theme, options)
  }

  /**
   * 按分类分组标签
   * @param tags - 英文简写标签数组
   * @returns 分组后的标签对象
   */
  static groupTagsByCategory(tags: string[]): Record<SkillTagCategory, string[]> {
    const grouped: Record<SkillTagCategory, string[]> = {
      tool: [],
      field: [],
      skill: []
    }

    tags.forEach(tag => {
      const category = this.getTagCategory(tag)
      grouped[category].push(tag)
    })

    return grouped
  }

  /**
   * 渲染分组标签
   * @param container - 容器选择器或DOM元素
   * @param tags - 英文简写标签数组
   * @param theme - 主题名称
   * @param options - 自定义配置
   */
  static renderGroupedTags(container: string | Element, tags: string[], theme: ThemeName = 'default', options: RenderOptions = {}): void {
    const element = typeof container === 'string' ? document.querySelector(container) : container
    if (!element) {
      console.warn('SkillTagUtils: 容器元素未找到')
      return
    }

    const grouped = this.groupTagsByCategory(tags)
    const categoryNames = {
      tool: '🔵 设计工具',
      field: '🟣 专业领域',
      skill: '🩷 技能方法'
    }

    const defaultOptions = {
      showGroupTitle: true,
      groupGap: 'gap-4',
      itemGap: 'gap-2'
    }

    const config = { ...defaultOptions, ...options }

    let html = `<div class="space-y-${config.groupGap}">`

    Object.entries(grouped).forEach(([category, categoryTags]) => {
      if (categoryTags.length > 0) {
        html += `<div class="skill-group">`

        if (config.showGroupTitle) {
          html += `<h4 class="text-sm font-medium text-gray-600 mb-2">${categoryNames[category as SkillTagCategory]}</h4>`
        }

        html += `<div class="flex flex-wrap ${config.itemGap}">`
        categoryTags.forEach(tag => {
          html += this.generateTagHTML(tag, theme, config)
        })
        html += `</div></div>`
      }
    })

    html += `</div>`
    element.innerHTML = html
  }

  /**
   * 获取所有可用的主题
   * @returns 主题名称数组
   */
  static getAvailableThemes(): ThemeName[] {
    return ['default']
  }

  /**
   * 添加自定义主题
   * @param name - 主题名称
   * @param config - 主题配置
   */
  static addTheme(name: string, config: ThemeConfig): void {
    this.themes[name as ThemeName] = config
  }

  /**
   * 获取分类统计信息
   * @param tags - 英文简写标签数组
   * @returns 统计信息
   */
  static getCategoryStats(tags: string[]): CategoryStats {
    const stats: CategoryStats = { tool: 0, field: 0, skill: 0 }

    tags.forEach(tag => {
      const category = this.getTagCategory(tag)
      stats[category]++
    })

    return stats
  }

  /**
   * 将字符串数组转换为SkillTagData数组
   * @param tags - 英文简写标签数组
   * @returns SkillTagData数组
   */
  static convertToTagData(tags: string[]): SkillTagData[] {
    return tags.map(tag => ({
      code: tag,
      name: this.getTagDisplayName(tag),
      category: this.getTagCategory(tag)
    }))
  }

  /**
   * 解析技能标签字符串（支持JSON格式）
   * @param skillsStr - 技能标签字符串
   * @returns 英文简写标签数组
   */
  static parseSkillTags(skillsStr: string): string[] {
    if (!skillsStr) return []

    try {
      const parsed = JSON.parse(skillsStr)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      // 如果不是JSON格式，尝试按逗号分割
      return skillsStr.split(',').map(s => s.trim()).filter(Boolean)
    }
  }

  /**
   * 获取所有可用的标签
   * @returns 所有标签的SkillTagData数组
   */
  static getAllTags(): SkillTagData[] {
    const tags: string[] = Array.from(this.categoryMap.keys())
    return this.convertToTagData(tags)
  }

  /**
   * 根据分类获取标签
   * @param category - 分类
   * @returns 该分类下的SkillTagData数组
   */
  static getTagsByCategory(category: SkillTagCategory): SkillTagData[] {
    const tags = Array.from(this.categoryMap.entries())
      .filter(([, cat]) => cat === category)
      .map(([tag]) => tag)
    return this.convertToTagData(tags)
  }
}

export default SkillTagUtils
