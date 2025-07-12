/**
 * 职业类型统一管理工具类
 *
 * 功能：
 * 1. 统一职业类型枚举定义
 * 2. 中英文映射管理
 * 3. 验证和转换工具
 * 4. 下拉选项生成
 *
 * 使用方式：
 * import ProfessionUtils from '@/utils/professionUtils'
 *
 * // 获取职业显示名称
 * ProfessionUtils.getDisplayName('UI_DESIGNER') // => 'UI设计师'
 *
 * // 获取下拉选项
 * ProfessionUtils.getSelectOptions()
 *
 * // 验证职业类型
 * ProfessionUtils.isValid('UI_DESIGNER') // => true
 */

// 职业类型枚举 - 统一定义
export enum Profession {
  UI_DESIGNER = 'UI_DESIGNER',
  UX_DESIGNER = 'UX_DESIGNER',
  UI_UX_DESIGNER = 'UI_UX_DESIGNER',
  VISUAL_DESIGNER = 'VISUAL_DESIGNER',
  INTERACTION_DESIGNER = 'INTERACTION_DESIGNER',
  PRODUCT_DESIGNER = 'PRODUCT_DESIGNER',
  BRAND_DESIGNER = 'BRAND_DESIGNER',
  MOTION_DESIGNER = 'MOTION_DESIGNER',
  THREE_D_DESIGNER = 'THREE_D_DESIGNER',
  GRAPHIC_DESIGNER = 'GRAPHIC_DESIGNER',
  WEB_DESIGNER = 'WEB_DESIGNER',
  ILLUSTRATOR = 'ILLUSTRATOR',
  INTERIOR_DESIGNER = 'INTERIOR_DESIGNER',
  ARCHITECT = 'ARCHITECT',
  LANDSCAPE_DESIGNER = 'LANDSCAPE_DESIGNER',
}

// 职业类型显示名称映射
const ProfessionLabels: Record<Profession, string> = {
  [Profession.UI_DESIGNER]: 'UI设计师',
  [Profession.UX_DESIGNER]: 'UX设计师',
  [Profession.UI_UX_DESIGNER]: 'UI/UX设计师',
  [Profession.VISUAL_DESIGNER]: '视觉设计师',
  [Profession.INTERACTION_DESIGNER]: '交互设计师',
  [Profession.PRODUCT_DESIGNER]: '产品设计师',
  [Profession.BRAND_DESIGNER]: '品牌设计师',
  [Profession.MOTION_DESIGNER]: '动效设计师',
  [Profession.THREE_D_DESIGNER]: '3D设计师',
  [Profession.GRAPHIC_DESIGNER]: '平面设计师',
  [Profession.WEB_DESIGNER]: '网页设计师',
  [Profession.ILLUSTRATOR]: '插画师',
  [Profession.INTERIOR_DESIGNER]: '室内设计师',
  [Profession.ARCHITECT]: '建筑师',
  [Profession.LANDSCAPE_DESIGNER]: '景观设计师',
}

// 职业类型英文简短名称映射（用于显示简洁的英文名）
const ProfessionShortLabels: Record<Profession, string> = {
  [Profession.UI_DESIGNER]: 'UI Designer',
  [Profession.UX_DESIGNER]: 'UX Designer',
  [Profession.UI_UX_DESIGNER]: 'UI/UX Designer',
  [Profession.VISUAL_DESIGNER]: 'Visual Designer',
  [Profession.INTERACTION_DESIGNER]: 'Interaction Designer',
  [Profession.PRODUCT_DESIGNER]: 'Product Designer',
  [Profession.BRAND_DESIGNER]: 'Brand Designer',
  [Profession.MOTION_DESIGNER]: 'Motion Designer',
  [Profession.THREE_D_DESIGNER]: '3D Designer',
  [Profession.GRAPHIC_DESIGNER]: 'Graphic Designer',
  [Profession.WEB_DESIGNER]: 'Web Designer',
  [Profession.ILLUSTRATOR]: 'Illustrator',
  [Profession.INTERIOR_DESIGNER]: 'Interior Designer',
  [Profession.ARCHITECT]: 'Architect',
  [Profession.LANDSCAPE_DESIGNER]: 'Landscape Designer',
}

// 职业类型分组（可选，用于未来可能的分类展示）
const ProfessionGroups = {
  digital: [
    Profession.UI_DESIGNER,
    Profession.UX_DESIGNER,
    Profession.UI_UX_DESIGNER,
    Profession.INTERACTION_DESIGNER,
    Profession.PRODUCT_DESIGNER,
    Profession.WEB_DESIGNER,
  ],
  visual: [
    Profession.VISUAL_DESIGNER,
    Profession.BRAND_DESIGNER,
    Profession.GRAPHIC_DESIGNER,
    Profession.ILLUSTRATOR,
  ],
  multimedia: [
    Profession.MOTION_DESIGNER,
    Profession.THREE_D_DESIGNER,
  ],
  spatial: [
    Profession.INTERIOR_DESIGNER,
    Profession.ARCHITECT,
    Profession.LANDSCAPE_DESIGNER,
  ],
}

// 主要工具类
class ProfessionUtils {
  /**
   * 获取职业类型的中文显示名称
   * @param profession 职业类型枚举值
   * @returns 中文显示名称
   */
  static getDisplayName(profession: Profession | string): string {
    const professionKey = profession as Profession
    return ProfessionLabels[professionKey] || profession
  }

  /**
   * 获取职业类型的英文显示名称
   * @param profession 职业类型枚举值
   * @returns 英文显示名称
   */
  static getEnglishName(profession: Profession | string): string {
    const professionKey = profession as Profession
    return ProfessionShortLabels[professionKey] || profession
  }

  /**
   * 获取所有职业类型的下拉选项
   * @param includeAll 是否包含"全部"选项
   * @returns 下拉选项数组
   */
  static getSelectOptions(includeAll = false): Array<{ value: string; label: string }> {
    const options = Object.values(Profession).map(profession => ({
      value: profession,
      label: ProfessionLabels[profession],
    }))

    if (includeAll)
      return [{ value: '', label: '全部' }, ...options]

    return options
  }

  /**
   * 验证职业类型是否有效
   * @param profession 职业类型值
   * @returns 是否有效
   */
  static isValid(profession: string): profession is Profession {
    return Object.values(Profession).includes(profession as Profession)
  }

  /**
   * 根据中文名称查找职业类型枚举值
   * @param displayName 中文显示名称
   * @returns 职业类型枚举值或undefined
   */
  static findByDisplayName(displayName: string): Profession | undefined {
    for (const [key, label] of Object.entries(ProfessionLabels)) {
      if (label === displayName)
        return key as Profession
    }
    return undefined
  }

  /**
   * 获取所有职业类型枚举值
   * @returns 职业类型枚举值数组
   */
  static getAllProfessions(): Profession[] {
    return Object.values(Profession)
  }

  /**
   * 获取所有职业类型的映射对象
   * @returns 映射对象
   */
  static getLabelsMap(): Record<Profession, string> {
    return { ...ProfessionLabels }
  }

  /**
   * 根据分组获取职业类型
   * @param group 分组名称
   * @returns 该分组的职业类型数组
   */
  static getByGroup(group: keyof typeof ProfessionGroups): Profession[] {
    return ProfessionGroups[group] || []
  }

  /**
   * 获取职业类型的统计信息（从数组中）
   * @param professions 职业类型数组
   * @returns 统计信息
   */
  static getStatistics(professions: (Profession | string)[]): Record<string, number> {
    const stats: Record<string, number> = {}

    professions.forEach((profession) => {
      const displayName = this.getDisplayName(profession as Profession)
      stats[displayName] = (stats[displayName] || 0) + 1
    })

    return stats
  }

  /**
   * 筛选职业类型（支持模糊搜索）
   * @param keyword 搜索关键词
   * @returns 匹配的职业类型选项
   */
  static search(keyword: string): Array<{ value: string; label: string }> {
    if (!keyword.trim())
      return this.getSelectOptions()

    const lowerKeyword = keyword.toLowerCase()
    return this.getSelectOptions().filter(option =>
      option.label.toLowerCase().includes(lowerKeyword)
      || option.value.toLowerCase().includes(lowerKeyword)
      || this.getEnglishName(option.value as Profession).toLowerCase().includes(lowerKeyword),
    )
  }

  /**
   * 批量转换职业类型为显示名称
   * @param professions 职业类型数组
   * @returns 显示名称数组
   */
  static batchGetDisplayNames(professions: (Profession | string)[]): string[] {
    return professions.map(profession => this.getDisplayName(profession as Profession))
  }

  /**
   * 格式化职业类型用于API传输
   * @param profession 职业类型
   * @returns 格式化后的值
   */
  static formatForApi(profession: Profession | string): string {
    return profession.toString()
  }

  /**
   * 从API响应解析职业类型
   * @param apiValue API返回的值
   * @returns 职业类型枚举值
   */
  static parseFromApi(apiValue: string): Profession | null {
    return this.isValid(apiValue) ? apiValue as Profession : null
  }
}

// 导出枚举和工具类
export { ProfessionLabels, ProfessionShortLabels, ProfessionGroups }
export default ProfessionUtils
