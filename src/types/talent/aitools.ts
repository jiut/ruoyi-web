// AI工具分类
export interface AIToolCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  count?: number;
}

// AI工具信息
export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  categoryId: string;
  tags: string[];
  featured: boolean; // 是否推荐
  pricing: 'free' | 'freemium' | 'paid' | 'trial';
  pricingText?: string; // 自定义价格描述
  rating?: number; // 评分 1-5
  popularity?: number; // 热度值
  addedDate: string; // 添加日期
  language: 'zh' | 'en' | 'multi'; // 支持语言
  verified: boolean; // 是否验证
}

// 搜索查询参数
export interface AIToolQueryParams {
  search?: string;
  categoryId?: string;
  pricing?: string;
  language?: string;
  featured?: boolean;
  sortBy?: 'popularity' | 'rating' | 'addedDate' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// API响应类型
export interface AIToolsResponse {
  tools: AITool[];
  total: number;
  categories: AIToolCategory[];
}
