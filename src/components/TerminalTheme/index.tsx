import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.css';

// 安全地获取颜色模式的Hook
const useSafeColorMode = () => {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined') {
      // 尝试从HTML元素的data-theme属性获取主题
      const htmlElement = document.documentElement;
      const theme = htmlElement.getAttribute('data-theme');
      if (theme === 'light' || theme === 'dark') {
        setColorMode(theme);
      } else {
        // 如果没有设置主题，检查系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setColorMode(prefersDark ? 'dark' : 'light');
      }
      
      // 监听主题变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            const newTheme = htmlElement.getAttribute('data-theme');
            if (newTheme === 'light' || newTheme === 'dark') {
              setColorMode(newTheme);
            }
          }
        });
      });
      
      observer.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return { colorMode };
};

// 终端主题配置接口
interface TerminalThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  fontFamily: string;
}

// 深色模式终端主题
const darkTheme: TerminalThemeConfig = {
  primaryColor: '#58a6ff',
  backgroundColor: '#0d1117',
  textColor: '#c9d1d9',
  accentColor: '#f85149',
  borderColor: '#30363d',
  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace"
};

// 亮色模式终端主题
const lightTheme: TerminalThemeConfig = {
  primaryColor: '#0969da',
  backgroundColor: '#f6f8fa',
  textColor: '#24292f',
  accentColor: '#cf222e',
  borderColor: '#d0d7de',
  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace"
};

// 主题上下文
const TerminalThemeContext = createContext<TerminalThemeConfig>(darkTheme);

// 主题提供者组件
interface TerminalThemeProviderProps {
  children: ReactNode;
  theme?: Partial<TerminalThemeConfig>;
}

export const TerminalThemeProvider: React.FC<TerminalThemeProviderProps> = ({ 
  children, 
  theme = {} 
}) => {
  const { colorMode } = useSafeColorMode();
  const baseTheme = colorMode === 'dark' ? darkTheme : lightTheme;
  const mergedTheme = { ...baseTheme, ...theme };

  return (
    <TerminalThemeContext.Provider value={mergedTheme}>
      <div 
        className={styles.terminalThemeWrapper}
        style={{
          '--terminal-primary-color': mergedTheme.primaryColor,
          '--terminal-bg-color': mergedTheme.backgroundColor,
          '--terminal-text-color': mergedTheme.textColor,
          '--terminal-accent-color': mergedTheme.accentColor,
          '--terminal-border-color': mergedTheme.borderColor,
          '--terminal-font-family': mergedTheme.fontFamily,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </TerminalThemeContext.Provider>
  );
};

// 使用主题的Hook
export const useTerminalTheme = () => {
  const context = useContext(TerminalThemeContext);
  if (!context) {
    throw new Error('useTerminalTheme must be used within a TerminalThemeProvider');
  }
  return context;
};

// 终端容器组件
interface TerminalContainerProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({ 
  children, 
  className = '',
  fullHeight = false 
}) => {
  return (
    <div className={`${styles.terminalContainer} ${fullHeight ? styles.fullHeight : ''} ${className}`}>
      {children}
    </div>
  );
};

// 终端页面布局组件
interface TerminalPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const TerminalPageLayout: React.FC<TerminalPageLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <TerminalThemeProvider>
      <div className={`${styles.terminalPageLayout} ${className}`}>
        {children}
      </div>
    </TerminalThemeProvider>
  );
};

export default TerminalThemeProvider;