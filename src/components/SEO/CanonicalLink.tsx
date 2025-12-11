import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Canonical链接组件 - 为每个页面添加canonical链接
 * 避免重复内容问题，提升SEO效果
 */
const CanonicalLink: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  
  // 构建完整的canonical URL
  const baseUrl = siteConfig.url || '';
  const sitePath = siteConfig.baseUrl || '/';
  const pathname = location.pathname || '';
  const canonicalUrl = `${baseUrl}${sitePath}${pathname}`.replace(/\/+/g, '/').replace(/\/$/, '') || `${baseUrl}${sitePath}`;
  
  return (
    <Head children={
      <>
        <link rel="canonical" href={canonicalUrl} />
        {/* 添加hreflang标签支持多语言SEO */}
        <link rel="alternate" hrefLang="zh-CN" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl.replace('/dev/', '/dev/en/')} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      </>
    } />
  );
};

export default CanonicalLink;