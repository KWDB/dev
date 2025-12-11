// B站视频信息获取服务
// 由于B站API的跨域限制，这里使用模拟数据结合真实bvid

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  bvid: string;
  thumbnail: string;
  publishDate: string;
  views: number;
  tags: string[];
  author: string;
  authorAvatar: string;
}

// 移除了视频信息缓存机制，直接获取数据

// 模拟的视频数据映射（基于真实bvid）
const videoDataMap: Record<string, Partial<VideoInfo>> = {
  // video.json 中实际使用的 bvid 值
  'BV1pTdgY5Ezn': {
    title: 'KWDB 快速入门 - 5分钟上手时序数据库',
    description: '从零开始学习 KWDB，了解基本概念和核心功能，快速搭建第一个时序数据库应用。',
    duration: '05:32',
    publishDate: '2024-01-15',
    views: 1250,
    tags: ['入门', '基础', '安装'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1DhYhzMEfK': {
    title: 'KWDB 大赛获奖作品展示',
    description: '展示 KWDB 开发者大赛中的优秀作品，学习最佳实践和创新应用案例。',
    duration: '15:20',
    publishDate: '2024-01-12',
    views: 1850,
    tags: ['大赛', '作品展示', '最佳实践'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  // 保留原有的 bvid 值以备后用
  'BV1xx411c7mD': {
    title: 'KWDB 快速入门 - 5分钟上手时序数据库',
    description: '从零开始学习 KWDB，了解基本概念和核心功能，快速搭建第一个时序数据库应用。',
    duration: '05:32',
    publishDate: '2024-01-15',
    views: 1250,
    tags: ['入门', '基础', '安装'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1yy411b7nQ': {
    title: 'KWDB 安装与配置详解',
    description: '详细介绍 KWDB 在不同操作系统上的安装方法，包括 Docker 部署和源码编译。',
    duration: '12:45',
    publishDate: '2024-01-10',
    views: 890,
    tags: ['安装', '配置', 'Docker'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1zz411a7mK': {
    title: '时序数据处理实战教程',
    description: '深入学习 KWDB 的时序数据处理能力，包括数据写入、查询优化和聚合分析。',
    duration: '18:20',
    publishDate: '2024-01-08',
    views: 2100,
    tags: ['时序数据', '查询', '分析'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1aa411d7pL': {
    title: 'KWDB SQL 查询语法完全指南',
    description: '全面掌握 KWDB 的 SQL 查询语法，包括时序函数、窗口查询和复杂聚合操作。',
    duration: '25:15',
    publishDate: '2024-01-05',
    views: 1680,
    tags: ['SQL', '查询', '语法'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1bb411e7qM': {
    title: 'KWDB API 开发实战',
    description: '使用 KWDB API 构建实际应用，包括 REST API 调用、SDK 集成和错误处理。',
    duration: '22:30',
    publishDate: '2024-01-03',
    views: 1420,
    tags: ['API', '开发', 'SDK'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  },
  'BV1cc411f7rN': {
    title: 'KWDB 集群部署与高可用配置',
    description: '学习如何部署 KWDB 集群，实现高可用性和负载均衡，确保生产环境稳定运行。',
    duration: '30:45',
    publishDate: '2024-01-01',
    views: 980,
    tags: ['集群', '部署', '高可用'],
    author: 'KaiwuDB',
    authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
  }
};

/**
 * 生成视频缩略图URL
 */
function generateThumbnail(bvid: string, category: string): string {
  // 支持中英文分类映射
  const prompts: Record<string, string> = {
    // 英文分类
    quickstart: 'KWDB%20database%20tutorial%20video%20thumbnail%20with%20terminal%20interface%20and%20data%20visualization',
    tutorial: 'KWDB%20advanced%20tutorial%20with%20code%20examples%20and%20database%20schema',
    development: 'API%20development%20tutorial%20with%20code%20editor%20and%20REST%20endpoints',
    advanced: 'Database%20cluster%20deployment%20with%20server%20nodes%20and%20network%20topology',
    // 中文分类映射
    '快速入门': 'KWDB%20database%20tutorial%20video%20thumbnail%20with%20terminal%20interface%20and%20data%20visualization',
    '竞赛': 'KWDB%20competition%20showcase%20with%20awards%20and%20innovative%20projects',
    '教程': 'KWDB%20advanced%20tutorial%20with%20code%20examples%20and%20database%20schema',
    '开发': 'API%20development%20tutorial%20with%20code%20editor%20and%20REST%20endpoints',
    '高级': 'Database%20cluster%20deployment%20with%20server%20nodes%20and%20network%20topology',
    '安装': 'KWDB%20installation%20guide%20with%20setup%20steps%20and%20configuration',
    '配置': 'KWDB%20configuration%20tutorial%20with%20settings%20and%20parameters'
  };
  
  const prompt = prompts[category] || prompts.tutorial || prompts['教程'];
  return `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_16_9`;
}



/**
 * 根据bvid获取视频信息
 * @param bvid 视频的bvid
 * @param category 视频分类
 * @param id 视频ID
 * @param configTitle 来自配置文件的标题（可选）
 * @param configDescription 来自配置文件的描述（可选）
 */
export async function getVideoInfo(
  bvid: string, 
  category: string, 
  id: string, 
  configTitle?: string, 
  configDescription?: string
): Promise<VideoInfo> {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    // 获取预定义的视频数据
    const videoData = videoDataMap[bvid];
    
    // 构建完整的视频信息，优先使用配置文件中的title和description
    const videoInfo: VideoInfo = {
      id,
      category,
      bvid,
      thumbnail: generateThumbnail(bvid, category),
      // 优先使用配置文件中的title和description，其次使用videoDataMap中的数据，最后使用默认值
      title: configTitle || videoData?.title || `KWDB 视频教程 ${id}`,
      description: configDescription || videoData?.description || 'KWDB 数据库相关教程视频',
      duration: videoData?.duration || '10:00',
      publishDate: videoData?.publishDate || '2024-01-01',
      views: videoData?.views || 100,
      tags: videoData?.tags || ['KWDB', '数据库'],
      author: videoData?.author || 'KaiwuDB',
      authorAvatar: videoData?.authorAvatar || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
    };

    return videoInfo;
  } catch (error) {
    console.error(`Failed to fetch video info for ${bvid}:`, error);
    
    // 返回默认视频信息，优先使用配置文件中的数据
    const fallbackInfo: VideoInfo = {
      id,
      category,
      bvid,
      title: configTitle || `KWDB 视频教程 ${id}`,
      description: configDescription || 'KWDB 数据库相关教程视频',
      duration: '10:00',
      thumbnail: generateThumbnail(bvid, category),
      publishDate: '2024-01-01',
      views: 100,
      tags: ['KWDB', '数据库'],
      author: 'KaiwuDB',
      authorAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=KaiwuDB%20logo%20avatar&image_size=square'
    };

    return fallbackInfo;
  }
}

/**
 * 批量获取视频信息
 * @param videos 视频配置数组，包含id、category、bvid以及可选的title和description
 */
export async function getVideosInfo(videos: Array<{
  id: string; 
  category: string; 
  bvid: string;
  title?: string;
  description?: string;
}>): Promise<VideoInfo[]> {
  const promises = videos.map(video => 
    getVideoInfo(video.bvid, video.category, video.id, video.title, video.description)
  );
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error('Failed to fetch videos info:', error);
    // 返回部分成功的结果
    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<VideoInfo> => result.status === 'fulfilled')
      .map(result => result.value);
  }
}



/**
 * 预加载视频信息
 */
export async function preloadVideos(videos: Array<{
  id: string; 
  category: string; 
  bvid: string;
  title?: string;
  description?: string;
}>): Promise<void> {
  // 分批预加载，避免同时发起太多请求
  const batchSize = 3;
  for (let i = 0; i < videos.length; i += batchSize) {
    const batch = videos.slice(i, i + batchSize);
    await getVideosInfo(batch);
    
    // 批次间稍作延迟
    if (i + batchSize < videos.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}