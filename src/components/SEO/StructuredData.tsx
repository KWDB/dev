import React from 'react';
import Head from '@docusaurus/Head';

/**
 * 结构化数据组件 - 为网站添加 JSON-LD 格式的结构化数据
 * 提升搜索引擎对网站内容的理解
 */
const StructuredData: React.FC = () => {
  // 网站基础信息的结构化数据
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KWDB 开发者文档',
    description: 'KWDB是面向AIoT物联网场景的分布式多模开源数据库，提供时序数据、关系数据、地理空间数据的统一存储和查询能力。',
    url: 'https://kwdb.atomgit.net/dev/',
    inLanguage: 'zh-CN',
    publisher: {
      '@type': 'Organization',
      name: 'KWDB Team',
      url: 'https://kwdb.atomgit.com/',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kwdb.atomgit.net/dev/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // 软件产品的结构化数据
  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KWDB',
    description: '面向AIoT物联网场景的分布式多模开源数据库',
    applicationCategory: 'Database Software',
    operatingSystem: 'Linux, Windows, macOS',
    programmingLanguage: ['Go', 'C++', 'SQL'],
    license: 'https://github.com/kwdb/kwdb/blob/main/LICENSE',
    downloadUrl: 'https://kwdb.atomgit.net/dev/download',
    author: {
      '@type': 'Organization',
      name: 'KWDB Team',
      url: 'https://kwdb.atomgit.com/',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    keywords: [
      'KWDB',
      '多模数据库',
      '时序数据库',
      '物联网数据库',
      'AIoT',
      '分布式数据库',
      '开源数据库',
      '时间序列',
      '边缘计算',
      '实时数据'
    ],
  };

  // 技术文档的结构化数据
  const documentationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'KWDB 开发者文档',
    description: 'KWDB数据库的完整开发者文档，包括快速开始、API参考、教程和最佳实践。',
    author: {
      '@type': 'Organization',
      name: 'KWDB Team',
      url: 'https://kwdb.atomgit.com/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KWDB Team',
      url: 'https://kwdb.atomgit.com/',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'zh-CN',
    about: {
      '@type': 'SoftwareApplication',
      name: 'KWDB',
    },
  };

  return (
    <Head children={
      <>
        {/* 网站结构化数据 */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData, null, 2)
          }}
        />
        
        {/* 软件产品结构化数据 */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareStructuredData, null, 2)
          }}
        />
        
        {/* 技术文档结构化数据 */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(documentationStructuredData, null, 2)
          }}
        />
      </>
    } />
  );
};

export default StructuredData;