import type { AIToolCategory, AITool } from '@/types/talent/aitools'

// AI工具分类数据
export const mockAIToolCategories: AIToolCategory[] = [
  {
    id: 'chat',
    name: 'AI聊天助手',
    description: '智能对话、问答助手',
    icon: '💬',
    color: '#6366f1',
    count: 12
  },
  {
    id: 'writing',
    name: 'AI写作工具',
    description: '文案创作、论文写作',
    icon: '✍️',
    color: '#10b981',
    count: 15
  },
  {
    id: 'image',
    name: 'AI绘画设计',
    description: 'AI绘画、图像生成',
    icon: '🎨',
    color: '#f59e0b',
    count: 18
  },
  {
    id: 'video',
    name: 'AI视频工具',
    description: '视频生成、剪辑',
    icon: '🎬',
    color: '#ef4444',
    count: 10
  },
  {
    id: 'audio',
    name: 'AI音频工具',
    description: '语音合成、音乐创作',
    icon: '🎵',
    color: '#8b5cf6',
    count: 8
  },
  {
    id: 'programming',
    name: 'AI编程工具',
    description: '代码生成、编程助手',
    icon: '💻',
    color: '#06b6d4',
    count: 14
  },
  {
    id: 'office',
    name: 'AI办公工具',
    description: 'PPT生成、表格处理',
    icon: '📊',
    color: '#84cc16',
    count: 11
  },
  {
    id: 'search',
    name: 'AI搜索引擎',
    description: '智能搜索、信息检索',
    icon: '🔍',
    color: '#f97316',
    count: 6
  }
]

// AI工具数据
export const mockAITools: AITool[] = [
  // AI聊天助手
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI开发的强大对话AI，能够进行自然对话、回答问题、协助创作等',
    url: 'https://chat.openai.com',
    logo: 'https://chat.openai.com/favicon.ico',
    categoryId: 'chat',
    tags: ['对话', '问答', '创作'],
    featured: true,
    pricing: 'freemium',
    pricingText: '免费版 + Plus版$20/月',
    rating: 4.8,
    popularity: 95,
    addedDate: '2024-01-15',
    language: 'multi',
    verified: true
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长分析、写作和编程，注重安全性',
    url: 'https://claude.ai',
    logo: 'https://claude.ai/favicon.ico',
    categoryId: 'chat',
    tags: ['对话', '分析', '安全'],
    featured: true,
    pricing: 'freemium',
    rating: 4.7,
    popularity: 88,
    addedDate: '2024-01-20',
    language: 'multi',
    verified: true
  },
  {
    id: 'kimi',
    name: 'Kimi智能助手',
    description: '月之暗面开发的中文AI助手，支持超长文本处理',
    url: 'https://kimi.moonshot.cn',
    logo: 'https://kimi.moonshot.cn/favicon.ico',
    categoryId: 'chat',
    tags: ['中文', '长文本', '对话'],
    featured: true,
    pricing: 'free',
    rating: 4.6,
    popularity: 82,
    addedDate: '2024-02-01',
    language: 'zh',
    verified: true
  },
  {
    id: 'tongyi',
    name: '通义千问',
    description: '阿里云推出的大语言模型，支持多种任务',
    url: 'https://tongyi.aliyun.com',
    logo: 'https://img.alicdn.com/imgextra/i1/O1CN01BN6Jtc1lCfJNviV7H_!!6000000004783-2-tps-134-133.png',
    categoryId: 'chat',
    tags: ['阿里', '多任务', '中文'],
    featured: false,
    pricing: 'freemium',
    rating: 4.4,
    popularity: 76,
    addedDate: '2024-01-30',
    language: 'zh',
    verified: true
  },

  // AI写作工具
  {
    id: 'jasper',
    name: 'Jasper',
    description: '专业的AI内容创作平台，适合营销文案和博客写作',
    url: 'https://jasper.ai',
    logo: 'https://cdn.prod.website-files.com/6807ee8d73c233fb82842313/681e121f9445a06741087852_Webclip.png',
    categoryId: 'writing',
    tags: ['营销', '文案', '博客'],
    featured: true,
    pricing: 'paid',
    pricingText: '从$39/月起',
    rating: 4.5,
    popularity: 85,
    addedDate: '2024-01-18',
    language: 'en',
    verified: true
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    description: 'AI驱动的文案生成工具，快速创建营销内容',
    url: 'https://copy.ai',
    logo: 'https://cdn.prod.website-files.com/628288c5cd3e8411b90a36a4/6793eea6a090d6d2f4fa5570_favicon_256x256%20(2).png',
    categoryId: 'writing',
    tags: ['文案', '营销', '创作'],
    featured: true,
    pricing: 'freemium',
    rating: 4.3,
    popularity: 78,
    addedDate: '2024-01-25',
    language: 'en',
    verified: true
  },

  // AI绘画设计
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: '顶级AI图像生成工具，创造惊艳的艺术作品',
    url: 'https://midjourney.com',
    logo: 'https://www.midjourney.com/public/apple-touch-icon.png',
    categoryId: 'image',
    tags: ['艺术', '图像生成', '创意'],
    featured: true,
    pricing: 'paid',
    pricingText: '从$10/月起',
    rating: 4.9,
    popularity: 92,
    addedDate: '2024-01-10',
    language: 'en',
    verified: true
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'OpenAI的图像生成模型，高质量AI绘画',
    url: 'https://openai.com/dall-e-3',
    logo: 'https://openai.com/favicon.ico',
    categoryId: 'image',
    tags: ['OpenAI', '图像生成', '高质量'],
    featured: true,
    pricing: 'paid',
    rating: 4.7,
    popularity: 89,
    addedDate: '2024-01-12',
    language: 'multi',
    verified: true
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: '开源AI绘画模型，免费生成高质量图像',
    url: 'https://stability.ai',
    logo: 'https://stability.ai/favicon.ico',
    categoryId: 'image',
    tags: ['开源', '免费', '可本地部署'],
    featured: true,
    pricing: 'free',
    rating: 4.6,
    popularity: 86,
    addedDate: '2024-01-08',
    language: 'multi',
    verified: true
  },
  {
    id: 'wujie-ai',
    name: '无界AI',
    description: '中文AI绘画平台，支持多种绘画风格',
    url: 'https://www.wujieai.com',
    logo: 'https://www.wujieai.com/favicon.ico',
    categoryId: 'image',
    tags: ['中文', '多风格', '简单易用'],
    featured: false,
    pricing: 'freemium',
    rating: 4.3,
    popularity: 68,
    addedDate: '2024-02-10',
    language: 'zh',
    verified: true
  },

  // AI视频工具
  {
    id: 'runway',
    name: 'Runway',
    description: '专业的AI视频编辑和生成平台',
    url: 'https://runwayml.com',
    logo: 'https://runwayml.com/icon.png?354f8c2b5139d556',
    categoryId: 'video',
    tags: ['视频编辑', '视频生成', '专业'],
    featured: true,
    pricing: 'freemium',
    pricingText: '免费版 + Pro版$15/月',
    rating: 4.6,
    popularity: 81,
    addedDate: '2024-01-22',
    language: 'en',
    verified: true
  },
  {
    id: 'pika',
    name: 'Pika',
    description: 'AI视频生成工具，将想法转化为视频',
    url: 'https://pika.art',
    logo: 'https://pika.art/favicon.ico',
    categoryId: 'video',
    tags: ['文生视频', '创意', '简单'],
    featured: true,
    pricing: 'freemium',
    rating: 4.4,
    popularity: 75,
    addedDate: '2024-02-15',
    language: 'en',
    verified: true
  },

  // AI音频工具
  {
    id: 'suno',
    name: 'Suno',
    description: 'AI音乐创作平台，生成原创歌曲',
    url: 'https://suno.ai',
    logo: 'https://suno.ai/favicon.ico',
    categoryId: 'audio',
    tags: ['音乐创作', '原创', '歌曲生成'],
    featured: true,
    pricing: 'freemium',
    rating: 4.5,
    popularity: 79,
    addedDate: '2024-01-28',
    language: 'en',
    verified: true
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: '顶级AI语音合成平台，生成逼真人声',
    url: 'https://elevenlabs.io',
    logo: 'https://elevenlabs.io/favicon.ico',
    categoryId: 'audio',
    tags: ['语音合成', '人声', '多语言'],
    featured: true,
    pricing: 'freemium',
    rating: 4.7,
    popularity: 83,
    addedDate: '2024-01-14',
    language: 'multi',
    verified: true
  },

  // AI编程工具
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'GitHub推出的AI编程助手，智能代码补全',
    url: 'https://github.com/features/copilot',
    logo: 'https://github.com/favicon.ico',
    categoryId: 'programming',
    tags: ['代码补全', 'GitHub', '编程助手'],
    featured: true,
    pricing: 'paid',
    pricingText: '$10/月',
    rating: 4.8,
    popularity: 91,
    addedDate: '2024-01-05',
    language: 'multi',
    verified: true
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI代码编辑器，智能编程体验',
    url: 'https://cursor.sh',
    logo: 'https://cursor.sh/favicon.ico',
    categoryId: 'programming',
    tags: ['代码编辑器', 'AI助手', '智能编程'],
    featured: true,
    pricing: 'freemium',
    rating: 4.6,
    popularity: 84,
    addedDate: '2024-02-12',
    language: 'en',
    verified: true
  },
  {
    id: 'tongyi-lingma',
    name: '通义灵码',
    description: '阿里推出的智能编码助手',
    url: 'https://tongyi.aliyun.com/lingma',
    logo: 'https://img.alicdn.com/imgextra/i1/O1CN01BN6Jtc1lCfJNviV7H_!!6000000004783-2-tps-134-133.png',
    categoryId: 'programming',
    tags: ['阿里', '编码助手', '中文'],
    featured: false,
    pricing: 'free',
    rating: 4.3,
    popularity: 67,
    addedDate: '2024-02-08',
    language: 'zh',
    verified: true
  },

  // AI办公工具
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'Notion内置的AI写作和整理助手',
    url: 'https://notion.so/ai',
    logo: 'https://www.notion.com/front-static/logo-ios.png',
    categoryId: 'office',
    tags: ['笔记', '写作', '整理'],
    featured: true,
    pricing: 'paid',
    pricingText: '$10/月',
    rating: 4.5,
    popularity: 77,
    addedDate: '2024-01-16',
    language: 'multi',
    verified: true
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'AI驱动的演示文稿生成工具',
    url: 'https://gamma.app',
    logo: 'https://gamma.app/favicon.ico',
    categoryId: 'office',
    tags: ['PPT生成', '演示文稿', '设计'],
    featured: true,
    pricing: 'freemium',
    rating: 4.4,
    popularity: 74,
    addedDate: '2024-01-24',
    language: 'en',
    verified: true
  },

  // AI搜索引擎
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI驱动的搜索引擎，精准答案',
    url: 'https://perplexity.ai',
    logo: 'https://perplexity.ai/favicon.ico',
    categoryId: 'search',
    tags: ['AI搜索', '精准答案', '实时'],
    featured: true,
    pricing: 'freemium',
    rating: 4.6,
    popularity: 80,
    addedDate: '2024-01-11',
    language: 'multi',
    verified: true
  },
  {
    id: 'phind',
    name: 'Phind',
    description: '面向开发者的AI搜索引擎',
    url: 'https://phind.com',
    logo: 'https://phind.com/favicon.ico',
    categoryId: 'search',
    tags: ['开发者', '编程搜索', '技术'],
    featured: false,
    pricing: 'freemium',
    rating: 4.3,
    popularity: 71,
    addedDate: '2024-02-03',
    language: 'en',
    verified: true
  }
]

// 获取热门工具
export const getFeaturedTools = (): AITool[] => {
  return mockAITools.filter(tool => tool.featured).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
}

// 获取最新工具
export const getLatestTools = (): AITool[] => {
  return mockAITools.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()).slice(0, 12)
}

// 根据分类获取工具
export const getToolsByCategory = (categoryId: string): AITool[] => {
  return mockAITools.filter(tool => tool.categoryId === categoryId)
}
