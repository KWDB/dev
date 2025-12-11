import React, { ReactNode, useState, useEffect, Suspense } from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Download as DownloadIcon, Package, Code, Server, ExternalLink, Search, Database, Bot, Terminal, Monitor, RefreshCw, Loader2, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import '../css/download.css';
import type { EcosystemTool } from '../components/EcosystemCard';
import { getReleases, Release, ReleaseData } from '../services/releaseService';

const EcosystemCard = React.lazy(() => import('../components/EcosystemCard'));

// Loading Skeleton for Ecosystem Cards
const CardSkeleton = () => (
  <div className="ecosystem-card skeleton-card">
    <div className="ecosystem-card-header">
      <div className="skeleton-icon"></div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-badge"></div>
      </div>
    </div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-button"></div>
  </div>
);

// General Tools Data
const generalTools: EcosystemTool[] = [
  {
    id: 'kcd',
    title: 'KCD (KaiwuDB Developer Center)',
    version: 'v3.0.0',
    description: '可视化的数据库开发与管理工具，提供便捷的图形化操作界面。适用于数据库日常管理、SQL 开发调试及性能监控等通用场景。',
    icon: <Monitor className="w-8 h-8" />,
    platforms: [
      { name: 'Linux x86_64', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/KaiwuDB_Developer_Center-3.0.0-linux-x86_64.tar.gz', type: 'tar.gz' },
      { name: 'Mac ARM64', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/KaiwuDB_Developer_Center-3.0.0-mac-aarch64.tar.gz', type: 'tar.gz' },
      { name: 'Windows x86_64', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/KaiwuDB_Developer_Center-3.0.0-win-x86_64.zip', type: 'zip' },
    ]
  },
  {
    id: 'lite',
    title: 'KaiwuDB Lite',
    version: '3.1.0',
    description: '专为边端设备设计的轻量级数据库版本，最小可在 1 核 CPU 环境下运行。适用于物联网网关、嵌入式设备等边缘计算场景。',
    icon: <Database className="w-8 h-8" />,
    applicationUrl: 'https://www.kaiwudb.com/support/'
  },
  {
    id: 'KAT',
    title: 'KAT (KaiwuDB Agent Tools)',
    version: 'stable',
    description: '基于 MCP 协议的智能数据库助手，支持自然语言交互。适用于降低数据库使用门槛，通过对话完成查询与运维任务。',
    icon: <Bot className="w-8 h-8" />,
    applicationUrl: 'https://www.kaiwudb.com/support/'
  },
  {
    id: 'JDBC',
    title: 'KWDB JDBC Driver',
    version: 'v2.2.0',
    description: 'KWDB 提供 KWDB JDBC 驱动程序，支持 Java 应用程序与 KWDB 数据库交互，执行查询、插入、更新和删除等操作。',
    icon: <Database className="w-8 h-8" />,
    platforms: [
      { name: '从 GitHub 下载', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/kaiwudb-jdbc-2.2.0.jar', type: 'jar' },
      { name: '从 Gitee 下载', url: 'https://gitee.com/kwdb/kwdb/releases/download/V3.0.0/kaiwudb-jdbc-2.2.0.jar', type: 'jar' },
    ]
  },
  {
    id: 'Kafka',
    title: 'KWDB Kafka Connect',
    version: 'v3.0.0',
    description: 'KWDB Kafka Connector 是 KWDB 基于 Kafka Connect API 和 Confluent 平台开发的功能模块，用于实现 Kafka 与 KWDB 之间的双向数据同步。',
    icon: <Package className="w-8 h-8" />,
    platforms: [
      { name: '从 GitHub 下载', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/KaiwuDB-Kafka-Connect-3.0.0.zip', type: 'zip' },
      { name: '从 Gitee 下载', url: 'https://gitee.com/kwdb/kwdb/releases/download/V3.0.0/KaiwuDB-Kafka-Connect-3.0.0.zip', type: 'zip' },
    ]
  },
  {
    id: 'datax',
    title: 'KWDB DataX',
    version: 'v2.2.0',
    description: 'DataX 是一款广泛使用的离线数据同步工具，能够实现 MySQL、SQL Server、Oracle、PostgreSQL、Hadoop HDFS、Apache Hive、Apache HBase、OTS 等各种异构数据源之间的数据同步。',
    icon: <Package className="w-8 h-8" />,
    platforms: [
      { name: '从 GitHub 下载', url: 'https://github.com/KWDB/KWDB/releases/download/V3.0.0/KaiwuDB_datax-2.2.0.zip', type: 'zip' },
      { name: '从 Gitee 下载', url: 'https://gitee.com/kwdb/kwdb/releases/download/V3.0.0/KaiwuDB_datax-2.2.0.zip', type: 'zip' },
    ]
  },
];

// Developer Ecosystem Tools Data
const developerTools: EcosystemTool[] = [
  {
    id: 'tsbs',
    title: 'KWDB TSBS',
    version: 'stable',
    description: '基于 Timescale/tsbs 改造的高性能时序基准测试工具。支持复杂场景的数据生成与压测，助力开发者进行性能调优与基准对比。',
    icon: <Terminal className="w-8 h-8" />,
    repoUrl: 'https://github.com/KWDB/kwdb-tsbs'
  },
  {
    id: 'playground',
    title: 'KWDB Playground',
    version: 'v0.4.0',
    description: '交互式 KWDB 在线演练场，提供开箱即用的体验环境。帮助开发者快速验证 SQL 语法与核心功能，加速学习曲线。',
    icon: <Terminal className="w-8 h-8" />,
    platforms: [
      { name: 'Linux x86_64', url: 'https://github.com/KWDB/playground/releases/download/v0.4.0/kwdb-playground-linux-amd64', type: 'bin' },
      { name: 'Linux ARM64', url: 'https://github.com/KWDB/playground/releases/download/v0.4.0/kwdb-playground-linux-amd64.tar.gz', type: 'tar.gz' },
      { name: 'Mac ARM64', url: 'https://github.com/KWDB/playground/releases/download/v0.4.0/kwdb-playground-darwin-arm64.tar.gz', type: 'tar.gz' },
      { name: 'Windows x86_64', url: 'https://github.com/KWDB/playground/releases/download/v0.4.0/kwdb-playground-windows-amd64.zip', type: 'zip' },
    ]
  },
  {
    id: 'mcp',
    title: 'kwdb-mcp-server',
    version: 'v3.0.0',
    description: 'KWDB 的 Model Context Protocol 服务端实现。支持与 AI 助手无缝对接，赋能开发者构建基于大模型的智能数据库应用。',
    icon: <Server className="w-8 h-8" />,
    platforms: [
      { name: 'Linux x86_64', url: 'https://github.com/KWDB/kwdb-mcp-server/releases/download/v3.0.0/kwdb-mcp-server-v3.0.0-linux-amd64.tar.gz', type: 'tar.gz' },
      { name: 'Linux ARM64', url: 'https://github.com/KWDB/kwdb-mcp-server/releases/download/v3.0.0/kwdb-mcp-server-v3.0.0-linux-arm64.tar.gz', type: 'tar.gz' },
      { name: 'Mac x86_64', url: 'https://github.com/KWDB/kwdb-mcp-server/releases/download/v3.0.0/kwdb-mcp-server-v3.0.0-darwin-amd64.tar.gz', type: 'tar.gz' },
      { name: 'Mac ARM64', url: 'https://github.com/KWDB/kwdb-mcp-server/releases/download/v3.0.0/kwdb-mcp-server-v3.0.0-darwin-arm64.tar.gz', type: 'tar.gz' },
      { name: 'Windows x86_64', url: 'https://github.com/KWDB/kwdb-mcp-server/releases/download/v3.0.0/kwdb-mcp-server-v3.0.0-windows-amd64.zip', type: 'zip' },
    ]
  }
];


// Docker 和源码选项
const alternativeOptions = [
  {
    title: 'Docker 镜像',
    description: '使用 Docker 快速部署 KWDB 数据库',
    icon: <Package className="w-6 h-6" />,
    command: `docker run -d --privileged --name kwdb \\
  -p 26257:26257 \\
  -p 8080:8080 \\
  -v /var/lib/kaiwudb:/kaiwudb/deploy/kaiwudb-container \\
  --ipc shareable \\
  -w /kaiwudb/bin \\
  kwdb/kwdb \\
  ./kwbase start-single-node \\
    --insecure \\
    --listen-addr=0.0.0.0:26257 \\
    --http-addr=0.0.0.0:8080 \\
    --store=/kaiwudb/deploy/kaiwudb-container`,
    link: '/docs/compilation/container'
  },
  {
    title: '源码编译',
    description: '从源码编译安装，获得最新功能',
    icon: <Code className="w-6 h-6" />,
    command: `git clone https://gitee.com/kwdb/kwdb.git /home/go/src/gitee.com/kwbasedb 
# 请勿修改目录路径中的 src/gitee.com/kwbasedb
cd /home/go/src/gitee.com/kwbasedb
git submodule update --init  #适用于首次拉取代码
git submodule update --remote
# 在项目目录下创建并切换到构建目录
mkdir build && cd build
# 运行 CMake 配置
cmake .. -DCMAKE_BUILD_TYPE= [Release | Debug]
# 编译和安装项目
make
make install`,
    link: '/docs/compilation/source-code'
  }
];


// Github Icon Component
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Gitee Icon Component
const GiteeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1024 1024" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.267-25.267z"/>
  </svg>
);

function AlternativeOption({ option }: { option: any; key?: string }) {
  return (
    <div className={`alternative-card ${option.isEnterprise ? 'enterprise' : ''}`}>
      <div className="alternative-header">
        <div className="alternative-icon">
          {option.icon}
        </div>
        <div>
          <h3 className="alternative-title">
            {option.title}
            {option.isEnterprise && <span className="enterprise-badge">企业版</span>}
          </h3>
          <p className="alternative-description">{option.description}</p>
        </div>
      </div>
      
      <div className="command-block">
        <CodeBlock children={option.command}
          language={option.title.includes('Docker') ? 'bash' : 'bash'}
          showLineNumbers={false}
        >
          {option.command}
        </CodeBlock>
      </div>
      
      <a 
        href={option.link} 
        className="alternative-link"
        target={option.isEnterprise ? "_blank" : "_self"}
        rel={option.isEnterprise ? "noopener noreferrer" : ""}
      >
        {option.isEnterprise ? '申请企业版' : '查看详细指南'}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

function MergedReleaseCard({ 
  releaseData, 
  loading, 
  onRefresh 
}: { 
  releaseData: ReleaseData | null, 
  loading: boolean, 
  onRefresh: () => void 
}) {
  const [activeSource, setActiveSource] = useState<'github' | 'gitee'>('github');
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentReleases: Release[] = releaseData ? releaseData[activeSource] : [];

  useEffect(() => {
    if (currentReleases.length > 0) {
      // If activeVersion is not in current list, reset to first
      const exists = currentReleases.find(r => r.version === activeVersion);
      if (!exists) {
        setActiveVersion(currentReleases[0].version);
        setIsExpanded(false); // Reset expansion on version change
      }
    } else {
      setActiveVersion('');
    }
  }, [currentReleases, activeVersion, activeSource]); // activeSource dependency ensures reset on switch

  const activeRelease = currentReleases.find(r => r.version === activeVersion) || currentReleases[0];
  
  // Filter assets: only start with "KWDB"
  const filteredAssets = activeRelease?.assets.filter(asset => asset.name.startsWith('KWDB')) || [];

  if (loading && (!releaseData || (releaseData.github.length === 0 && releaseData.gitee.length === 0))) {
    return (
      <div className="merged-release-card loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="loading-content" style={{ textAlign: 'center', color: 'var(--terminal-text-secondary)' }}>
           <Loader2 className="w-8 h-8 animate-spin" style={{ marginBottom: '1rem' }} />
           <p>正在获取最新版本信息...</p>
        </div>
      </div>
    );
  }

  if (!activeRelease && !loading) {
     return (
      <div className="merged-release-card empty" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="empty-content" style={{ textAlign: 'center' }}>
           <p style={{ marginBottom: '1rem' }}>暂无版本信息</p>
           <button onClick={onRefresh} className="terminal-button primary">
             <RefreshCw className="w-4 h-4" style={{ marginRight: '0.5rem' }} /> 重试
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="merged-release-card">
      <div className="release-sidebar">
        <div className="sidebar-header-group">
          <div className="sidebar-header">
             <h3 className="sidebar-title">版本列表</h3>
             <button onClick={onRefresh} className="refresh-icon-btn" title="刷新列表" disabled={loading}>
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
          
          <div className="source-selector">
            <label>仓库源：</label>
            <div className={`source-tabs ${activeSource === 'gitee' ? 'active-gitee' : ''}`}>
              <button 
                className={`source-tab ${activeSource === 'github' ? 'active' : ''}`}
                onClick={() => setActiveSource('github')}
              >
                <GithubIcon className="w-4 h-4" />
                Github
              </button>
              <button 
                className={`source-tab ${activeSource === 'gitee' ? 'active' : ''}`}
                onClick={() => setActiveSource('gitee')}
              >
                <GiteeIcon className="w-4 h-4" />
                Gitee
              </button>
            </div>
          </div>
        </div>

        <div className={`version-list ${loading ? 'fade-exit-active' : 'fade-enter-active'}`} style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
          {currentReleases.length > 0 ? (
            currentReleases.map(release => (
              <button
                key={release.version}
                className={`version-item ${activeVersion === release.version ? 'active' : ''}`}
                onClick={() => {
                  setActiveVersion(release.version);
                  setIsExpanded(false);
                }}
              >
                <span className="version-number">{release.version}</span>
                <span className={`version-dot ${release.type}`}></span>
              </button>
            ))
          ) : (
            <div className="no-versions">该源暂无版本</div>
          )}
          <a 
            href={activeSource === 'github' ? 'https://github.com/KWDB/KWDB/releases' : 'https://gitee.com/kwdb/kwdb/releases/'}
            target="_blank"
            rel="noopener noreferrer"
            className="more-releases-btn"
          >
            查看更多历史版本 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      
      <div className="release-detail">
        {activeRelease ? (
          <>
            <div className="detail-header">
              <div className="detail-title-group">
                <h2 className="detail-version">{activeRelease.version}</h2>
                <span className={`release-type ${activeRelease.type}`}>
                  {activeRelease.type === 'stable' ? '稳定版' : '测试版'}
                </span>
              </div>
              <span className="detail-date">发布日期：{activeRelease.date}</span>
            </div>
            
            <div className={`detail-content-wrapper ${isExpanded ? 'expanded' : ''}`}>
              <div className="detail-content markdown-body">
                <Markdown>{activeRelease.body}</Markdown>
              </div>
              <div className="detail-expand-overlay">
                 <button 
                   className="expand-btn"
                   onClick={() => setIsExpanded(!isExpanded)}
                 >
                   {isExpanded ? (
                     <>收起 <ChevronUp className="w-4 h-4" /></>
                   ) : (
                     <>查看更多 <ChevronDown className="w-4 h-4" /></>
                   )}
                 </button>
              </div>
            </div>

            <div className="detail-actions">
               <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--terminal-text-secondary)' }}>
                 安装包下载 ({filteredAssets.length})
               </h4>
               {filteredAssets.length > 0 ? (
                 <div className="assets-grid">
                   {filteredAssets.map((asset, idx) => {
                     const extension = asset.name.endsWith('.tar.gz') ? 'tar.gz' : asset.name.split('.').pop();
                     return (
                     <a 
                       key={idx}
                       href={asset.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="asset-download-btn"
                       data-tooltip={asset.name}
                     >
                       <FileDown className="w-4 h-4 flex-shrink-0" />
                       <div className="asset-info">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span className="asset-name" style={{ flex: 1, marginRight: '8px' }}>{asset.name}</span>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              background: 'rgba(255,255,255,0.1)', 
                              color: 'var(--terminal-text-secondary)',
                              whiteSpace: 'nowrap'
                            }}>{extension}</span>
                          </div>
                          {asset.size && <span className="asset-size">{(asset.size / 1024 / 1024).toFixed(1)} MB</span>}
                       </div>
                     </a>
                   )})}
                 </div>
               ) : (
                 <div className="no-assets">
                   <p>未找到安装包下载链接</p>
                   <a 
                     href={activeRelease.downloadUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="release-download-btn large"
                   >
                     <ExternalLink className="w-4 h-4" />
                     前往仓库查看
                   </a>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="detail-empty">请选择一个版本查看详情</div>
        )}
      </div>
    </div>
  );
}

export default function Download(): ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'general' | 'developer'>('all');
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReleases = async (force = false) => {
    setLoading(true);
    try {
      const data = await getReleases(force);
      setReleaseData(data);
    } catch (error) {
      console.error("Failed to load releases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const filteredGeneralTools = generalTools.filter(tool => 
    (activeFilter === 'all' || activeFilter === 'general') &&
    (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDeveloperTools = developerTools.filter(tool => 
    (activeFilter === 'all' || activeFilter === 'developer') &&
    (tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <Layout
      title="KWDB数据库下载 - 开源多模数据库 | 多平台安装包 | Docker镜像"
      description="免费下载KWDB开源多模数据库，支持Linux、Windows、macOS多平台安装包，提供Docker镜像和源码编译方式。KWDB是面向AIoT物联网场景的分布式多模数据库，具备高性能时序数据处理能力，支持千万级设备接入和亿级数据查询。"
    >
      <main className="download-page">
        {/* 页面标题区域 */}
        <motion.section 
          className="download-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="download-hero-content">
            <h1 className="download-hero-title">
              <DownloadIcon className="hero-icon" />
              KWDB 下载中心
            </h1>
            <p className="download-hero-subtitle">
              KWDB 软件下载中心，为用户提供 KWDB 数据库各版本，以及周边生态项目的下载。
            </p>
          </div>
        </motion.section>

        {/* 版本发布说明 */}
        <motion.section 
          className="download-releases"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="container">
            <h2 className="section-title">版本与下载信息</h2>
            <div className="releases-container">
              <MergedReleaseCard 
                releaseData={releaseData} 
                loading={loading} 
                onRefresh={() => fetchReleases(true)} 
              />
            </div>
            
            <div className="install-methods-container">
              <div className="alternatives-grid">
                {alternativeOptions.map((option, index) => (
                  <AlternativeOption key={`alternative-${index}`} option={option} />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 周边生态工具 */}
        <section className="download-ecosystem">
          <div className="container">
            <h2 className="section-title">周边生态工具</h2>
            
            {/* 搜索和筛选栏 */}
            <div className="search-filter-container">
              <div className="search-input-wrapper">
                <Search className="search-icon w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="搜索工具名称或描述..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  全部工具
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('general')}
                >
                  通用工具
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'developer' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('developer')}
                >
                  开发者工具
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* 通用工具板块 */}
              {filteredGeneralTools.length > 0 && (
                <motion.div 
                  className="ecosystem-section"
                  key="general-tools"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <h3 className="ecosystem-subtitle">
                    通用工具
                  </h3>
                  <div className="ecosystem-grid">
                    <Suspense fallback={[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}>
                      {filteredGeneralTools.map((tool) => (
                        <motion.div key={tool.id} variants={itemVariants} className="ecosystem-card-wrapper">
                          <EcosystemCard tool={tool} />
                        </motion.div>
                      ))}
                    </Suspense>
                  </div>
                </motion.div>
              )}

              {/* 开发者生态工具板块 */}
              {filteredDeveloperTools.length > 0 && (
                <motion.div 
                  className="ecosystem-section"
                  key="developer-tools"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <h3 className="ecosystem-subtitle">
                    开发者生态工具
                  </h3>
                  <div className="ecosystem-grid">
                    <Suspense fallback={[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}>
                      {filteredDeveloperTools.map((tool) => (
                        <motion.div key={tool.id} variants={itemVariants} className="ecosystem-card-wrapper">
                          <EcosystemCard tool={tool} />
                        </motion.div>
                      ))}
                    </Suspense>
                  </div>
                </motion.div>
              )}
              
              {filteredGeneralTools.length === 0 && filteredDeveloperTools.length === 0 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="text-center py-12 text-gray-500"
                 >
                   <p style={{ fontSize: '1.1rem', color: 'var(--terminal-text-secondary)' }}>
                     未找到匹配的工具，请尝试其他关键词。
                   </p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 帮助和支持 */}
        <motion.section 
          className="download-support"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <div className="support-content">
              <h2 className="section-title">需要帮助？</h2>
              <p className="support-description">
                如果您在安装过程中遇到问题，我们提供了详细的文档和社区支持
              </p>
              <div className="support-links">
                <a href="/docs/compilation/container" className="support-link">
                  <Package className="w-5 h-5" />
                  安装文档
                </a>
                <a href="/docs/quickstart/5M-quick-start" className="support-link">
                  <Code className="w-5 h-5" />
                  快速教程
                </a>
                <a href="https://kwdb.openatom.tech/" target="_blank" className="support-link">
                  <Server className="w-5 h-5" />
                  社区支持
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </Layout>
  );
}