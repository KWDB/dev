import React from 'react';
import StructuredData from '../components/SEO/StructuredData';
import CanonicalLink from '../components/SEO/CanonicalLink';

/**
 * 根组件 - 包装所有页面的通用组件
 * 用于添加全局的SEO优化组件
 */
export default function Root({children}: {children: React.ReactNode}): React.ReactElement {
  return (
    <>
      {/* 添加结构化数据到所有页面 */}
      <StructuredData />
      {/* 添加canonical链接到所有页面 */}
      <CanonicalLink />
      {children}
    </>
  );
}