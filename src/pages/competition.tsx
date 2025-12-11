import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Play, X, ExternalLink, Copy } from 'lucide-react';
import styles from '../css/competition.module.css';

// 大赛视频信息接口
interface CompetitionVideo {
  id: number;
  bvid: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

// 大赛培训视频数据
const competitionVideos: CompetitionVideo[] = [
  {
    id: 1,
    bvid: 'BV1DhYhzMEfK',
    title: '【KWDB 核心贡献挑战赛】赛前培训 第1期',
    description: '本期直播将带你从0到1了解赛事，并深入解析赛题，展示初赛示例文档及评分维度，助力大家高效开启初赛准备！',
    category: '大赛培训',
    duration: '45:58'
  },
  {
    id: 2,
    bvid: 'BV18Ha8zaEk2',
    title: '【KWDB 核心贡献挑战赛】赛前培训 第2期',
    description: '深入讲解【开发调试环境】,带你全面搞懂环境准备与各注意事项。',
    category: '大赛培训',
    duration: '45:37'
  }
];

export default function Competition(): React.ReactElement {
  const [selectedVideo, setSelectedVideo] = useState<CompetitionVideo | null>(null);

  // 关闭视频模态框
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // 处理视频卡片点击事件（优化触摸体验）
  const handleVideoCardClick = (video: CompetitionVideo, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedVideo(video);
  };

  // 处理模态框背景点击关闭
  const handleModalBackgroundClick = (event: React.MouseEvent | React.TouchEvent) => {
    if (event.target === event.currentTarget) {
      closeVideoModal();
    }
  };

  // 视频模态框组件
  const VideoModal = ({ video, onClose }: { video: CompetitionVideo; onClose: () => void }) => {
    return (
      <div 
        className={styles.videoModal} 
        onClick={handleModalBackgroundClick}
        onTouchEnd={handleModalBackgroundClick}
      >
        <div 
          className={styles.videoModalContent} 
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <div className={styles.videoModalHeader}>
            <h3>{video.title}</h3>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              onTouchEnd={onClose}
              aria-label="关闭视频"
            >
              <X size={24} />
            </button>
          </div>
          <div className={styles.videoModalBody}>
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${video.bvid}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=1&t=0`}
              scrolling="no"
              frameBorder="no"
              allowFullScreen
              title={video.title}
              className={styles.modalVideoIframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="eager"
              preload="auto"
            />
          </div>
          <div className={styles.videoModalFooter}>
            <p>{video.description}</p>
            <div className={styles.videoModalMeta}>
              <span>分类: {video.category}</span>
              <span>时长: {video.duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Layout
      title="KWDB核心贡献挑战赛 - 30万奖金池等你来瓜分 | 开放原子大赛 | 数据库开发竞赛"
      description="KWDB核心贡献挑战赛是面向数据库开发者的专业技术竞赛，总奖金池30万元。赛题涵盖SDK开发、数据导入优化、异构数据库迁移等核心技术方向。提供免费云资源支持，精美周边礼品，专业技术指导。欢迎数据库从业人员组队参与，共同推动KWDB开源数据库技术发展。"
    >
      <div className={styles.competitionContainer}>
        {/* 页面标题 */}
        <section className={styles.heroSection}>
          <div className="container">
            <h1 className={styles.heroTitle}>KWDB 核心贡献挑战赛</h1>
            <div className={styles.heroSubtitle}>30万奖金池等你来瓜分！</div>
            <div className={styles.heroActions}>
              <a
                href="https://competition.atomgit.com/competitionInfo?id=15a1cbf384173a304349de363511d037"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                立即报名
              </a>
              <a
                href="https://atomgit.com/kwdb-competition/kwdb-competition"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                大赛仓库
              </a>
            </div>
          </div>
        </section>

        {/* 大赛培训视频 */}
        <section className={styles.trainingSection}>
          <div className={styles.sectionHeader}>
            <h2>大赛培训视频</h2>
          </div>
          <div className={styles.videoContainer}>
            {competitionVideos.map((video) => (
              <div 
                key={video.id} 
                className={styles.videoCard} 
                onClick={(e) => handleVideoCardClick(video, e)}
                onTouchEnd={(e) => handleVideoCardClick(video, e)}
                role="button"
                tabIndex={0}
                aria-label={`播放视频: ${video.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedVideo(video);
                  }
                }}
              >
                <div className={styles.videoThumbnail}>
                  {/* 视频缩略图iframe */}
                  <iframe
                    src={`//player.bilibili.com/player.html?isOutside=true&bvid=${video.bvid}&cid=1&p=1&autoplay=0&danmaku=0`}
                    scrolling="no"
                    style={{ border: 0 }}
                    frameBorder="no"
                    allowFullScreen={true}
                    title={video.title}
                    className={styles.videoIframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                    preload="metadata"
                  />
                  
                  {/* 播放按钮覆盖层 */}
                  <div className={styles.videoOverlay}>
                    <Play className={styles.playIcon} size={48} />
                  </div>
                  
                  {/* 视频时长 */}
                  <div className={styles.videoDuration}>
                    {video.duration}
                  </div>
                </div>
                
                {/* 视频信息 */}
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoDescription}>{video.description}</p>
                  <div className={styles.videoMeta}>
                    <span className={styles.videoCategory}>{video.category}</span>
                    <span className={styles.videoViews}>观看培训视频</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 决赛公示板块：包含获奖名单、评审专家与公示说明 */}
        <section className={styles.backgroundSection}>
          <div className="container">
            <h2>🏁 决赛成绩公示</h2>
            {/* 公示开场描述 */}
            <p>
              2025年11月20日，第三届开放原子大赛-KWDB核心贡献挑战赛决赛路演在北京市经开区北人亦创国际会展中心成功举办，现公布获奖名单如下：
            </p>

            {/* 获奖名单表格：四列（序号、团队名称、仓库链接、奖项） */}
            <div className={styles.resultTable}>
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>团队名称</th>
                    <th>决赛作品仓库（AtomGit）</th>
                    <th>奖项</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>比特炼金术</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/3a1c0cd9ddcf8e32104e3f56b6df2743"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/3a1c0cd9ddcf8e32104e3f56b6df2743')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.firstAward}`}>一等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Epoch</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/4356904b573fa8dda0cbf7a23bf795c2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/4356904b573fa8dda0cbf7a23bf795c2')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.secondAward}`}>二等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>OceanSoft2025</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/1d9ff7d14ae9b8003e587c96d283287d"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/1d9ff7d14ae9b8003e587c96d283287d')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.secondAward}`}>二等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>白菜狗说得对</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/422a67685e23f903e048434351289787"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/422a67685e23f903e048434351289787')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.thirdAward}`}>三等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Data新思维</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/b851d69111e94129ddabb2ee6dd7e31a"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/b851d69111e94129ddabb2ee6dd7e31a')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.thirdAward}`}>三等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Take your time</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/c03c4e6897dee948b5b528ad23421605"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/c03c4e6897dee948b5b528ad23421605')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.thirdAward}`}>三等奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>山东舜云plus</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/25936a673418eafcea3dc942fda433aa"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/25936a673418eafcea3dc942fda433aa')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>上海华立</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/3043048e09a749d548739822e21a3e28"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/3043048e09a749d548739822e21a3e28')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>竞界智能</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/5e7afa45b78032fc267592bc1e086e9e"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/5e7afa45b78032fc267592bc1e086e9e')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>cvhope</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/447ee546416d3576eaf69e24586a2170"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/447ee546416d3576eaf69e24586a2170')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>shunwah</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/4762534c1f124f15c47729711ec78a89"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/4762534c1f124f15c47729711ec78a89')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>东东鼎鼎</td>
                    <td>
                      <div className={styles.repoCell}>
                        <a
                          href="https://openatom.tech/kwdb-competition/bc333b9ddcbeb4991386595d2a575d52"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLinkBtn}
                          aria-label="查看决赛作品仓库"
                        >
                          <ExternalLink size={16} /> 查看仓库
                        </a>
                        <button
                          className={styles.copyBtn}
                          aria-label="复制仓库链接"
                          onClick={() => copyToClipboard('https://openatom.tech/kwdb-competition/bc333b9ddcbeb4991386595d2a575d52')}
                        >
                          <Copy size={14} /> 复制
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.awardTag} ${styles.excellentAward}`}>优秀奖</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 评审专家列表 */}
            <h3>决赛评审专家：</h3>
            <ul>
              <li>西安电子科技大学教授 李辉</li>
              <li>华东师范大学教授 王伟</li>
              <li>中国人民大学副教授 卞昊穹</li>
              <li>浪潮 KaiwuDB 副总经理 陈磊</li>
              <li>浪潮 KaiwuDB 资深技术专家 窦志彤</li>
              <li>浪潮 KaiwuDB 资深技术专家 孙路明</li>
            </ul>

            {/* 公示期与申诉说明 */}
            <p>
              公示期自2025年11月21日至2025年11月26日。公示期间，如对比赛成绩有异议，可发邮件至
              <a href="mailto:guoxudong@inspur.com" className={styles.repoLink}>guoxudong@inspur.com</a>
              ，逾期不予受理。
            </p>
          </div>
        </section>

        {/* 赛程安排 */}
        <section className={styles.scheduleSection}>
          <div className="container">
            <h2>📅 赛程安排</h2>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-07-23</div>
                <div className={styles.timelineContent}>
                  <h3>🎯 报名开始</h3>
                  <p>大赛正式启动，欢迎各路英雄豪杰踊跃报名参与</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-10-15</div>
                <div className={styles.timelineContent}>
                  <h3>报名截止 📝</h3>
                  <p>报名通道关闭，参赛队伍名单确定</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-10-20</div>
                <div className={styles.timelineContent}>
                  <h3>💻 初赛作品提交截止</h3>
                  <p>初赛阶段结束，所有参赛作品需在此日期前完成提交</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-10-31</div>
                <div className={styles.timelineContent}>
                  <h3>公布晋级决赛名单 🎉</h3>
                  <p>初赛评审完成，决赛入围队伍名单正式公布</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-11-15</div>
                <div className={styles.timelineContent}>
                  <h3>🚀 决赛作品提交截止</h3>
                  <p>决赛作品最终提交截止，准备迎接最终挑战</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2025-11-29</div>
                <div className={styles.timelineContent}>
                  <h3>线下决赛路演及颁奖仪式（拟）🏆</h3>
                  <p>决赛队伍现场路演，专家评审，冠军诞生时刻</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 奖项设置 */}
        <section className={styles.awardsSection}>
          <div className="container">
            <h2>🏆 奖项设置</h2>
            <div className={styles.awardsGrid}>
              {/* 一等奖卡片 */}
              <div className={`${styles.awardCard} ${styles.firstPrize}`}>
                <div className={styles.awardHeader}>
                  <div className={styles.awardIcon}>🏆</div>
                  <div className={styles.awardRank}>一等奖</div>
                </div>
                <div className={styles.awardContent}>
                  <div className={styles.awardMoney}>8万元</div>
                  <div className={styles.awardDetails}>
                    <div className={styles.awardQuota}>名额：1名</div>
                    <div className={styles.awardRequirement}>分数不低于80分</div>
                  </div>
                </div>
                <div className={styles.awardBadge}>冠军</div>
              </div>

              {/* 二等奖卡片 */}
              <div className={`${styles.awardCard} ${styles.secondPrize}`}>
                <div className={styles.awardHeader}>
                  <div className={styles.awardIcon}>🥈</div>
                  <div className={styles.awardRank}>二等奖</div>
                </div>
                <div className={styles.awardContent}>
                  <div className={styles.awardMoney}>5万元</div>
                  <div className={styles.awardDetails}>
                    <div className={styles.awardQuota}>名额：2名</div>
                    <div className={styles.awardRequirement}>分数不低于60分</div>
                  </div>
                </div>
              </div>

              {/* 三等奖卡片 */}
              <div className={`${styles.awardCard} ${styles.thirdPrize}`}>
                <div className={styles.awardHeader}>
                  <div className={styles.awardIcon}>🥉</div>
                  <div className={styles.awardRank}>三等奖</div>
                </div>
                <div className={styles.awardContent}>
                  <div className={styles.awardMoney}>3万元</div>
                  <div className={styles.awardDetails}>
                    <div className={styles.awardQuota}>名额：3名</div>
                    <div className={styles.awardRequirement}>分数不低于60分</div>
                  </div>
                </div>
              </div>

              {/* 优秀奖卡片 */}
              <div className={`${styles.awardCard} ${styles.excellentPrize}`}>
                <div className={styles.awardHeader}>
                  <div className={styles.awardIcon}>⭐</div>
                  <div className={styles.awardRank}>优秀奖</div>
                </div>
                <div className={styles.awardContent}>
                  <div className={styles.awardMoney}>0.5万元</div>
                  <div className={styles.awardDetails}>
                    <div className={styles.awardQuota}>名额：6名</div>
                    <div className={styles.awardRequirement}>参与即有机会</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 赛项背景 */}
        <section className={styles.backgroundSection}>
          <div className="container">
            <h2>🎯 赛项背景</h2>
            <div className={styles.backgroundContent}>
              <p>
                KWDB 是面向物联网AIoT场景的专业分布式多模数据库项目，支持在同一实例同时建立时序库和关系库并融合处理多模数据，具备千万级设备接入、百万级数据秒级写入、亿级数据秒级读取等时序数据高效处理能力，具有稳定安全、高可用、易运维等特点。
              </p>
              <p>
                物联网场景中数据具有两大特性：一是数据类型呈现多模型状态，如：结构化数据、非结构化数据、半结构化数据；其中主要又以时序数据和关系数据为核心；二是物联网场景下，特别是物联设备产生的时序数据量级巨大。以上两大特性使得许多用户都在面临着数据库系统写入性能瓶颈的重重挑战。数据的写入/导入的能力，成为了掣肘企业数字化智能化升级与降本增效的关键。
              </p>
            </div>
          </div>
        </section>

        {/* 赛题详情 */}
        <section className={styles.topicsSection}>
          <div className="container">
            <h2>🏆 赛题详情</h2>
            <p className={styles.topicsIntro}>
              本赛项鼓励有经验的数据库从业人员组队参与，可以从以下三个赛题方向中选择一个。
            </p>
            
            {/* 赛题一 */}
            <div className={styles.topicCard}>
              <div>
                <h3>🔧 赛题一：实现KWDB的SDK从而支持更灵活的请求形式和更高的写入性能</h3>
              </div>
              <div className={styles.topicContent}>
                <p>
                  物联网场景下，企业用户在IoT设备的数据采集和汇总环节需要应对大量多源异构数据，因而往往在这一领域拥有自己的技术资产实现数据接入、汇总和整理。对于企业用户来说，IoT数据从不同系统进入数据库时，更理想的方式是：通过整合已有数据资产，在数据融合系统中实现对数据库的高通量低延时数据写入。而传统的数据库面对这些场景时，由于其协议复杂性、数据封装逻辑等原因，调用接口并不理想。通过提供更加标准和规范的 SDK，能够更好地降低开发复杂度、提升效率，同时保障性能和安全性，为用户提供更便捷高效的体验。
                </p>
                <h4>要求：</h4>
                <ul>
                  <li>定义并实现一套 KWDB 应用 SDK，支持 Java 和 C++ 编程语言。针对这2种编程语言定义并实现支持 API 的列表，支持 telegraf line protocol 格式的数据写入，以及使用 SQL 语言或自定义 API 的数据查询</li>
                  <li>提供使用该 SDK 编程的用户手册和样例程序</li>
                  <li>在 KWDB 的 Server 端实现与 SDK 客户端交互的逻辑，以及支持相关 API 的内部实现逻辑</li>
                  <li>多并发情况下通过 SDK 的数据写入性能不低于同等情况下使用 JDBC/ODBC 接口性能的 1.5 倍</li>
                </ul>
              </div>
            </div>

            {/* 赛题二 */}
            <div className={styles.topicCard}>
              <div>
                <h3>⚡ 赛题二：支持通过SQL语句或命令行方式在线导入(数据不落地)异构数据库中的数据</h3>
              </div>
              <div className={styles.topicContent}>
                <p>
                  数据批量加载或数据集中是多模数据库项目实施中的常见场景。从原有异构数据库进行批量导入，比较普遍的做法是：将数据导出为文件，再导入到数据库（如KWDB）中。如能使用"数据不落地"的方式，则可大幅简化操作步骤，减少中间存储占用，同时有效提升用户的使用友好性。
                </p>
                <h4>要求：</h4>
                <ul>
                  <li>支持使用 SQL 语句或命令行的方式驱动，SQL 语法或命令行形式符合当前规范</li>
                  <li>支持 2 种异构数据库(KWDB 以外的数据库)的数据导入到 KVWDB 中；不以任何形式依赖第三方商业软件，不静态依赖任何强传染性开源软件</li>
                  <li>支持选择源端要导出的数据列,支持源端数据过滤;支持选择目标端要导入的列</li>
                  <li>支持常用数据类型</li>
                  <li>数据完整性保障能力、容错行为、错误处理能力给出明确的支持边界</li>
                </ul>
              </div>
            </div>

            {/* 赛题三 */}
            <div className={styles.topicCard}>
              <div>
                <h3>🛠️ 赛题三：异构数据库快速迁移导入</h3>
              </div>
              <div className={styles.topicContent}>
                <p>
                  物联网场景通常既包含时序数据，又包含关系数据(设备信息、业务元数据)；且关系数据的库表数量往往较多。在数据库迁移场景中，用户希望能够快速、便捷地将原有数据库中的数据迁移到KWDB中，同时保证数据的完整性和一致性。
                </p>
                <h4>要求：</h4>
                <ul>
                  <li>支持从主流关系型数据库（如MySQL、PostgreSQL等）快速迁移数据到KWDB</li>
                  <li>提供图形化或命令行工具，简化迁移操作流程</li>
                  <li>支持表结构自动转换和数据类型映射</li>
                  <li>提供迁移进度监控和错误处理机制</li>
                  <li>确保迁移过程中的数据完整性和一致性</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 问题反馈 */}
        <section className={styles.feedbackSection}>
          <div className="container">
            <h2>💬 问题反馈与交流</h2>
            <p>
              如果您在参赛过程中遇到任何问题，欢迎创建 Issue 进行反馈或扫描下方二维码添加小助手微信（KaiwuDB_Assistant），小助手会拉您进大赛交流群。
            </p>
            <div className={styles.feedbackActions}>
              <a
                href="https://atomgit.com/kwdb-competition/kwdb-competition/issues/create"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.issueButton}
              >
                创建 Issue
              </a>
            </div>
            <div className={styles.contactInfo}>
              <img 
                src={require('/static/img/wechat.jpeg').default} 
                alt="KWDB大赛微信小助手二维码 - 扫码添加KaiwuDB_Assistant获取技术支持和加入交流群" 
                title="扫描二维码添加KWDB大赛微信小助手"
                className={styles.wechatQrCode}
              />
            </div>
          </div>
        </section>
      </div>
      
      {/* 视频模态框 */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={closeVideoModal} />
      )}
    </Layout>
  );
}
