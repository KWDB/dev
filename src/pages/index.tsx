import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Terminal from '@site/src/components/Terminal';
import CommandLine from '@site/src/components/CommandLine';
import TerminalTheme from '@site/src/components/TerminalTheme';

import styles from '../css/index.module.css';
import '@site/src/css/terminal.css';
import '@site/src/css/animations.css';



export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <TerminalTheme>
      <Layout
        title={`${siteConfig.title} - 面向AIoT物联网场景的分布式多模开源数据库  | 多模数据库 | 时序数据库`}
        description="KWDB是面向AIoT物联网场景的专业分布式多模开源数据库，支持时序数据、关系数据、地理空间数据的统一存储和查询，具备千万级设备接入、百万级数据秒级写入、亿级数据秒级读取等强大性能，为物联网、边缘计算、工业互联网等场景提供一站式数据管理解决方案。">
        <div className={styles.terminalPage}>
          {/* 交互式终端区域 */}
          <main className={styles.mainContent}>
            <header className={styles.terminalSection}>
              <div className="container">
                <div className={styles.terminalWrapper}>
                  <h2 className={styles.sectionTitle}>
                    <CommandLine
                      prompt="kwdb@docs:~$"
                      command="bash kwdb-docs.sh"
                      showTyping={true}
                      typingSpeed={80}
                    />
                  </h2>
                  <Terminal />

                  {/* 移动过来的标题和按钮 */}
                  <div className={styles.subtitle}>
                    <span className="animate-fade-in animate-delay-500">
                      {siteConfig.tagline}
                    </span>
                  </div>

                  <div className={styles.buttons}>
                    <Link
                      className="terminal-button primary"
                      to="/docs/quickstart/5M-quick-start">
                      <span>$ ./quick-start.sh</span>
                    </Link>
                    <Link
                      className="terminal-button"
                      to="/download">
                      <span>$ kwdb --download</span>
                    </Link>
                  </div>
                </div>
              </div>
            </header>

            {/* 特性展示区域 */}
            <section className={styles.featuresSection}>
              <div className="container">
                <div className={styles.featuresGrid}>
                  <div className="terminal-card">
                    <h3>🚀 多模融合</h3>
                    <p>内置一套通用的数据模型，将时序与关系数据模型融于一体，提供统一的数据接入，支持不同数据模型的融合处理</p>
                  </div>
                  <div className="terminal-card">
                    <h3>🔧 工具完备</h3>
                    <p>数据库可视化管理工具、时序数据库基准测试工具、监控指标模板等多种生态工具</p>
                  </div>
                  <div className="terminal-card">
                    <h3>🤖 AI 赋能</h3>
                    <p>MCP Server、AI 智能助手和 AI 智能体等多种 AI 赋能工具，帮助用户更高效、更智能的开发和维护 KWDB</p>
                  </div>
                </div>
              </div>
            </section>

            {/* OpenAtom Foundation Section */}
            <section className={styles.foundationSection}>
              <div className={styles.foundationContent}>
                <img 
                  src="img/openatom.svg"
                  alt="开放原子开源基金会" 
                  className={styles.foundationLogo}
                />
                <p className={styles.foundationText}>
                  KWDB 是由<a href="https://www.openatom.org/" target="_blank">开放原子开源基金会（OpenAtom Foundation）</a>孵化的开源项目
                </p>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </TerminalTheme>
  );
}
