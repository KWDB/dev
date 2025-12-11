import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

// 页面跳转函数
const navigateToPage = (url: string, delay: number = 1000) => {
  setTimeout(() => {
    window.location.href = url;
  }, delay);
};

interface TerminalProps {
  className?: string;
  height?: string;
  commands?: { [key: string]: () => string | Promise<string> };
}

const Terminal: React.FC<TerminalProps> = ({ 
  className = '', 
  height = '400px',
  commands = {} 
}) => {
  const asciiLogo = `
██╗  ██╗██╗    ██╗██████╗ ██████╗ 
██║ ██╔╝██║    ██║██╔══██╗██╔══██╗
█████╔╝ ██║ █╗ ██║██║  ██║██████╔╝
██╔═██╗ ██║███╗██║██║  ██║██╔══██╗
██║  ██╗╚███╔███╔╝██████╔╝██████╔╝
╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝ ╚═════╝ 
`;

  const welcomeText = '欢迎使用 KWDB 多模数据库开发者文档终端！';

  const [history, setHistory] = useState<string[]>([
    ...asciiLogo.trim().split('\n'),
    '',
    welcomeText
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 默认命令集
  const defaultCommands = {
    help: () => {
      return `可用命令:
  help     - 显示帮助信息
  clear    - 清空终端
  docs     - 查看文档
  tutorial - 查看教程
  download - KWDB 下载中心
  video    - KWDB 视频中心
  version  - 显示版本信息
  about    - 关于 KWDB`;
    },
    clear: () => {
      setHistory([
        '██╗  ██╗██╗    ██╗██████╗ ██████╗ ',
        '██║ ██╔╝██║    ██║██╔══██╗██╔══██╗',
        '█████╔╝ ██║ █╗ ██║██║  ██║██████╔╝',
        '██╔═██╗ ██║███╗██║██║  ██║██╔══██╗',
        '██║  ██╗╚███╔███╔╝██████╔╝██████╔╝',
        '╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝ ╚═════╝ ',
        '                                   ',
        'KWDB 开发者文档终端'
      ]);
      return '';
    },
    docs: () => {
      navigateToPage('/dev/docs/intro');
      return '正在跳转到文档页面...';
    },
    tutorial: () => {
      navigateToPage('/dev/tutorial');
      return '正在跳转到教程页面...';
    },
    download: () => {
      navigateToPage('/dev/download');
      return '正在跳转到下载页面...';
    },
    video: () => {
      navigateToPage('/dev/video');
      return '正在跳转到视频页面...';
    },
    version: () => 'KWDB v2.2.2 - 面向 AIoT 物联网场景的分布式多模开源数据库',
    about: () => 'KWDB 是一款面向 AIoT 物联网场景的分布式多模开源数据库\n支持海量数据存储和实时查询分析'
  };

  const allCommands = { ...defaultCommands, ...commands };

  // 处理命令执行
  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (!trimmedCommand) return;

    setIsProcessing(true);
    
    // 添加用户输入到历史记录
    setHistory(prev => [...prev, `$ ${command}`]);

    try {
      if (allCommands[trimmedCommand]) {
        const result = await allCommands[trimmedCommand]();
        if (result) {
          setHistory(prev => [...prev, result]);
        }
      } else {
        setHistory(prev => [...prev, `命令未找到: ${command}\n输入 'help' 查看可用命令`]);
      }
    } catch (error) {
      setHistory(prev => [...prev, `错误: ${error}`]);
    }

    setIsProcessing(false);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  return (
    <div 
      className={`${styles.terminal} ${className}`} 
      style={{ height }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.terminalHeader}>
        <div className={styles.terminalButtons}>
          <span className={styles.closeButton}></span>
          <span className={styles.minimizeButton}></span>
          <span className={styles.maximizeButton}></span>
        </div>
        <div className={styles.terminalTitle}>KWDB Terminal</div>
      </div>
      
      <div className={styles.terminalBody} ref={terminalRef}>
        {history.map((line, index) => {
            // 检查是否是ASCII logo行
            const isAsciiLogoLine = line.includes('██') || line.includes('╗') || line.includes('╚') || line.includes('═');
            // 检查是否是欢迎文本
            const isWelcomeText = line === welcomeText;
            
            return (
              <div 
                key={index} 
                className={`${styles.terminalLine} ${
                  isAsciiLogoLine ? styles.asciiLogo : 
                  isWelcomeText ? styles.welcomeText : ''
                }`}
              >
                {line.split('\n').map((subLine, subIndex) => (
                  <div key={subIndex}>{subLine}</div>
                ))}
              </div>
            );
          })}
        
        <div className={styles.inputLine}>
          <span className={styles.prompt}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.terminalInput}
            disabled={isProcessing}
            placeholder={isProcessing ? '处理中...' : '输入命令 (试试 help)'}
          />
          {isProcessing && <span className={styles.cursor}>|</span>}
        </div>
      </div>
    </div>
  );
};

export default Terminal;