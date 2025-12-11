import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TerminalTheme from '@site/src/components/TerminalTheme';
import { Play, Video, Search, Filter, Clock, Users, BookOpen, Code, Database, Zap, Settings, Brain, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVideosInfo, preloadVideos, type VideoInfo } from '@site/src/services/bilibili';
import videoConfig from '@site/data/video.json';
import '@site/src/css/terminal.css';
import '@site/src/css/video.css';

// 分类到图标的映射配置
const categoryIconMap: Record<string, ReactNode> = {
  'quickstart': <Play />,
  '快速入门': <Play />,
  'tutorial': <BookOpen />,
  '教程指南': <BookOpen />,
  'development': <Code />,
  '开发实战': <Code />,
  'advanced': <Settings />,
  '高级特性': <Settings />,
  'ai': <Brain />,
  'AI 集成': <Brain />,
  '竞赛': <Zap />,
  '开放原子大赛': <Zap />,
  // 默认图标
  'default': <Database />
};

// 分类显示名称映射（用于统一显示名称）
const categoryDisplayNameMap: Record<string, string> = {
  'quickstart': '快速入门',
  '快速入门': '快速入门',
  'tutorial': '教程指南',
  '教程指南': '教程指南',
  'development': '开发实战',
  '开发实战': '开发实战',
  'advanced': '高级特性',
  '高级特性': '高级特性',
  'ai': 'AI 集成',
  'AI 集成': 'AI 集成',
  '竞赛': '竞赛',
  '开放原子大赛': '开放原子大赛'
};

// 从video.json动态生成分类配置的函数
function generateVideoCategories(videoConfigs: VideoConfig[]) {
  // 提取所有唯一的分类
  const uniqueCategories = Array.from(
    new Set(videoConfigs.map(config => config.category))
  );

  // 生成分类配置数组
  const dynamicCategories = uniqueCategories.map(category => ({
    id: category,
    name: categoryDisplayNameMap[category] || category, // 使用映射的显示名称，如果没有则使用原名称
    icon: categoryIconMap[category] || categoryIconMap['default'] // 使用映射的图标，如果没有则使用默认图标
  }));

  // 始终将"全部视频"作为第一个选项
  return [
    { id: 'all', name: '全部视频', icon: <Video /> },
    ...dynamicCategories
  ];
}

// 视频配置接口
interface VideoConfig {
  id: number;  // 修改为number类型以匹配JSON数据
  category: string;
  bvid: string;
  title?: string;  // 可选的标题配置
  description?: string;  // 可选的描述配置
}

// 加载状态类型
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 错误信息接口
interface ErrorInfo {
  message: string;
  details?: string;
}

// B站视频播放器组件
function BilibiliPlayer({ bvid, title }: { bvid: string; title: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 优化的播放器URL参数
  const playerUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=0&t=0`;

  return (
    <div className="bilibili-player">
      {isLoading && (
        <div className="player-loading">
          <div className="loading-spinner"></div>
          <span>正在加载播放器...</span>
        </div>
      )}

      {hasError && (
        <div className="player-error">
          <AlertCircle size={24} />
          <span>播放器加载失败</span>
          <button
            className="retry-player-btn"
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
          >
            重试
          </button>
        </div>
      )}

      <iframe
        src={playerUrl}
        scrolling="no"
        frameBorder="no"
        allowFullScreen
        title={title}
        className={`bilibili-iframe ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}

// 视频卡片组件
function VideoCard({ video, onPlay }: { video: VideoInfo; onPlay: (video: VideoInfo) => void }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // 生成bilibili iframe URL
  const generateIframeUrl = (bvid: string) => {
    return `//player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&cid=1&p=1&autoplay=0&danmaku=0`;
  };

  // 处理iframe加载成功
  const handleIframeLoad = () => {
    setIframeLoading(false);
    setIframeError(false);
  };

  // 处理iframe加载失败
  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  return (
    <div className="video-card" onClick={() => onPlay(video)}>
      <div className="video-thumbnail">
        {/* iframe加载中的占位符 */}
        {iframeLoading && (
          <div className="iframe-placeholder loading">
            <div className="loading-spinner"></div>
            <span>加载中...</span>
          </div>
        )}
        
        {/* iframe错误状态 */}
        {iframeError && (
          <div className="iframe-error">
            <AlertCircle size={24} />
            <span>视频加载失败</span>
          </div>
        )}
        
        {/* bilibili iframe视频播放器 */}
        <iframe
          src={generateIframeUrl(video.bvid)}
          scrolling="no"
          style={{ border: 0 }}
          frameBorder="no"
          allowFullScreen={true}
          title={video.title}
          className={`video-iframe ${iframeLoading ? 'loading' : 'loaded'} ${iframeError ? 'error' : ''}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
        
        {/* 播放按钮覆盖层 */}
        <div className="video-overlay">
          <Play className="play-icon" />
        </div>
        
        {/* 视频时长 */}
        <div className="video-duration">{video.duration}</div>
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>

        <div className="video-meta">
          <div className="video-tags">
            <span className="tag">{video.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 分页组件（包含统计信息）
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevPage, 
  onNextPage,
  totalVideos,
  filteredVideos,
  showStats = true
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  totalVideos: number;
  filteredVideos: number;
  showStats?: boolean;
}) {
  if (totalPages <= 1) return null;

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂分页逻辑
      if (currentPage <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      {/* 视频统计信息 */}
      {showStats && (
        <div className="video-stats">
          <span className="video-count">
            共 {totalVideos} 个视频
            {filteredVideos !== totalVideos && ` (筛选后 ${filteredVideos} 个)`}
            {totalPages > 1 && (
              <span className="page-info">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
            )}
          </span>
        </div>
      )}
      
      {/* 分页控件 */}
      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-prev"
          onClick={onPrevPage}
          disabled={currentPage === 1}
          aria-label="上一页"
        >
          <ChevronLeft size={16} />
          <span>上一页</span>
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                <MoreHorizontal size={16} />
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''
                  }`}
                onClick={() => onPageChange(page as number)}
                aria-label={`第 ${page} 页`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className="pagination-btn pagination-next"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          aria-label="下一页"
        >
          <span>下一页</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// 视频播放器模态框组件 - 仅保留iframe播放器
function VideoModal({ video, isOpen, onClose }: {
  video: VideoInfo | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !video) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <BilibiliPlayer bvid={video.bvid} title={video.title} />
    </div>
  );
}

export default function VideoPage(): ReactNode {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoList, setVideoList] = useState<VideoInfo[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ErrorInfo | null>(null);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(9); // 每页显示9个视频

  // 动态生成视频分类配置
  const videoCategories = generateVideoCategories(videoConfig as VideoConfig[]);

  // 动态计算分类统计
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return videoList.length;
    }
    return videoList.filter(video => video.category === categoryId).length;
  };


  // 加载视频数据
  const loadVideos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoadingState('loading');
      }
      setError(null);

      // 将配置数据转换为包含title和description的格式
      const configWithTitleDesc = (videoConfig as VideoConfig[]).map(config => ({
        id: config.id.toString(),  // 转换为string类型
        category: config.category,
        bvid: config.bvid,
        title: config.title,  // 传递配置的标题
        description: config.description  // 传递配置的描述
      }));

      const videos = await getVideosInfo(configWithTitleDesc);
      setVideoList(videos);
      setLoadingState('success');

    } catch (err) {
      console.error('Failed to load videos:', err);
      setError({
        message: '加载视频数据失败',
        details: err instanceof Error ? err.message : '未知错误'
      });
      setLoadingState('error');
    }
  };



  // 组件挂载时加载数据
  useEffect(() => {
    loadVideos();

    // 预加载视频（后台进行）
    const configWithTitleDesc = (videoConfig as VideoConfig[]).map(config => ({
      id: config.id.toString(),  // 转换为string类型
      category: config.category,
      bvid: config.bvid,
      title: config.title,
      description: config.description
    }));
    preloadVideos(configWithTitleDesc).catch(console.error);

    // 设置定时刷新（每10分钟）
    const refreshInterval = setInterval(() => {
      loadVideos(false); // 后台刷新，不显示加载状态
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // 过滤视频
  const filteredVideos = videoList.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  // 重置分页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // 分页控制函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到视频列表顶部
    document.querySelector('.video-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 播放视频
  const handlePlayVideo = (video: VideoInfo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // 渲染加载状态
  const renderLoadingState = () => {
    if (loadingState === 'loading') {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>正在加载视频...</p>
        </div>
      );
    }

    if (loadingState === 'error') {
      return (
        <div className="error-container">
          <AlertCircle className="error-icon" size={32} />
          <p>加载失败，请稍后重试</p>
        </div>
      );
    }

    return null;
  };

  return (
    <TerminalTheme>
      <Layout
        title="视频教程 - KWDB 学习中心"
        description="KWDB 数据库视频教程，包含入门指南、开发实战和高级特性的完整视频课程">
        <div className="terminal-page">
          <main className="container margin-vert--lg">
            {/* 页面标题区域 */}
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  <Play className="hero-icon" />
                  KWDB 视频教程
                </h1>
                <p className="hero-description">
                  通过视频教程快速学习 KWDB 的核心功能和最佳实践
                </p>
              </div>
            </div>

            {/* 搜索和筛选区域 */}
            <section className="video-controls">
              <div className="search-bar">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="搜索视频教程..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="category-filters">
                {videoCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''
                      }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="count">({getCategoryCount(category.id)})</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 视频列表区域 */}
            <section className="video-section">
              {renderLoadingState()}

              {loadingState === 'success' && (
                <>
                  {filteredVideos.length > 0 ? (
                    <>
                      {/* 视频网格 - 只包含视频卡片 */}
                      <div className="video-grid">
                        {currentVideos.map((video) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            onPlay={handlePlayVideo}
                          />
                        ))}
                      </div>
                      
                      {/* 分页控件（包含统计信息） */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                        totalVideos={videoList.length}
                        filteredVideos={filteredVideos.length}
                        showStats={true}
                      />
                    </>
                  ) : (
                    <div className="no-videos">
                      <Video className="no-videos-icon" />
                      <h3>未找到相关视频</h3>
                      <p>请尝试调整搜索条件或选择其他分类</p>
                    </div>
                  )}
                </>
              )}
            </section>


          </main>
        </div>

        {/* 视频播放模态框 */}
        <VideoModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </Layout>
    </TerminalTheme>
  );
}
