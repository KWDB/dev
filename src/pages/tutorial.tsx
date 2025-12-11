import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TerminalTheme from '@site/src/components/TerminalTheme';
import { ChevronRight, Database, BookOpen, Users, Brain, Rocket } from 'lucide-react';

import '@site/src/css/terminal.css';

// 统一的教程模块配置
const tutorialSections = [
  {
    id: 'quickstart',
    title: '快速开始',
    description: '了解 KWDB 基本概念，快速上手使用',
    icon: <Rocket />,
    links: [
      // { title: '什么是 KWDB', href: 'https://kwdb.atomgit.com/explore/journalism/detail/446140968815693824' },
      { title: '安装指南', href: 'https://www.kaiwudb.com/kaiwudb_docs/#/oss_dev/quickstart/install-kaiwudb/quickstart-bare-metal.html' },
      { title: '5分钟快速体验', href: '/docs/quickstart/5M-quick-start' },
      { title: '第一个查询', href: '/docs/quickstart/sample-query' }
    ]
  },
  {
    id: 'sample-db',
    title: '示例场景',
    description: '提供示例数据与场景，方便测试与学习',
    icon: <Database />,
    links: [
      { title: '智能电表示例', href: 'https://github.com/KWDB/SampleDB/tree/master/smart-meter' },
      { title: '智能电表可视化演示', href: 'https://github.com/KWDB/SampleDB/tree/master/smart-meter-web' },
      { title: '跨模查询示例', href: 'https://github.com/KWDB/SampleDB/tree/master/multi-mode' }
    ]
  },
  {
    id: 'ai-integration',
    title: 'AI 赋能',
    description: 'MCP Server、智能体和智能问答助手',
    icon: <Brain />,
    links: [
      { title: 'MCP Server', href: 'https://github.com/KWDB/kwdb-mcp-server' },
      { title: 'KAT 智能体', href: 'https://www.kaiwudb.com/kaiwudb_docs/#/kat/kat-overview.html' },
      { title: 'KaiwuDB_AI 智能问答助手', href: 'https://mp.weixin.qq.com/s/gTfpkw54yiORDDa7lOt1lQ' },
      // { title: '异常检测', href: '#' }
    ]
  },
  {
    id: 'community',
    title: '社区资源',
    description: '社区支持、学习资源和贡献指南',
    icon: <Users />,
    links: [
      // { title: 'GitHub 仓库', href: 'https://github.com/kwdb/kwdb' },
      { title: '开源运营中心', href: 'https://kwdb.atomgit.com/' },
      { title: '贡献指南', href: 'https://gitee.com/kwdb/community/blob/master/Contribution_process.md' },
      { title: '用户案例', href: 'https://www.kaiwudb.com/case/' }
    ]
  }
];





export default function Tutorial(): ReactNode {
  // const {siteConfig} = useDocusaurusContext();
  
  return (
    <TerminalTheme>
      <Layout
        title="教程 - KWDB 学习指南"
        description="KWDB 数据库完整学习教程，从入门到精通，包含安装、配置、开发和部署的全面指南">
        <div className="terminal-page">
          <main className="container margin-vert--lg">
            {/* 页面标题区域 */}
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  <BookOpen className="hero-icon" />
                  KWDB 教程中心
                </h1>
                <p className="hero-description">
                  从基础概念到高级应用，全面掌握 KWDB 时序数据库的使用技巧
                </p>
              </div>
            </div>



            {/* 教程模块 */}
            <section className="tutorial-sections">
              <div className="tutorial-grid">
                {tutorialSections.map((section, index) => (
                  <div key={section.id} className="tutorial-card">
                    <div className="card-header">
                      <div className="card-icon">
                        {section.icon}
                      </div>
                      <h3>{section.title}</h3>
                    </div>
                    <p className="card-description">{section.description}</p>
                    <div className="card-links">
                      {section.links.map((link, linkIndex) => (
                        <Link key={linkIndex} to={link.href} className="tutorial-link">
                          <span>{link.title}</span>
                          <ChevronRight className="link-icon" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>


          </main>
        </div>
      </Layout>
    </TerminalTheme>
  );
}