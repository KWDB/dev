import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface CommandLineProps {
  command: string;
  delay?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
}

const CommandLine: React.FC<CommandLineProps> = ({
  command,
  delay = 100,
  onComplete,
  showCursor = true,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < command.length) {
        setDisplayedText(command.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, delay);
      } else {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // 重置状态
    setDisplayedText('');
    setIsComplete(false);
    currentIndex = 0;

    // 开始打字效果
    timeoutId = setTimeout(typeText, delay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [command, delay, onComplete]);

  // 控制光标闪烁
  useEffect(() => {
    if (!showCursor) return;

    const cursorInterval = setInterval(() => {
      setShowBlinkingCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  return (
    <div className={`${styles.commandLine} ${className}`}>
      <span className={styles.prompt}>$</span>
      <span className={styles.command}>{displayedText}</span>
      {showCursor && (
        <span 
          className={`${styles.cursor} ${showBlinkingCursor ? styles.visible : styles.hidden}`}
        >
          ||
        </span>
      )}
    </div>
  );
};

export default CommandLine;