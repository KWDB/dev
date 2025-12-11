import React, { useState, useRef, useEffect } from 'react';
import { 
  Download as DownloadIcon, 
  ExternalLink, 
  ChevronDown, 
  FileArchive, 
  FileCode, 
  Terminal as TerminalIcon, 
  CheckCircle,
  Loader2,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EcosystemTool {
  id: string;
  title: string;
  version: string;
  description: string;
  icon: React.ReactNode;
  repoUrl?: string;
  applicationUrl?: string;
  platforms?: { name: string; url: string; type: string }[];
}

// File type icon mapping
const getFileIcon = (type: string) => {
  if (type.includes('tar') || type.includes('zip') || type.includes('gz')) {
    return <FileArchive className="w-4 h-4" />;
  }
  if (type.includes('bin') || type.includes('sh')) {
    return <TerminalIcon className="w-4 h-4" />;
  }
  if (type.includes('jar')) {
    return <FileCode className="w-4 h-4" />;
  }
  return <Box className="w-4 h-4" />;
};

export default function EcosystemCard({ tool }: { tool: EcosystemTool }) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, 'idle' | 'downloading' | 'completed'>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setIsOpen(false);
      // Return focus to the toggle button
      if (dropdownRef.current) {
        const toggle = dropdownRef.current.querySelector('.platform-toggle') as HTMLElement;
        toggle?.focus();
      }
    }
  }

  const handleDownload = (url: string, id: string) => {
    // Simulate download start feedback
    setDownloadStatus(prev => ({ ...prev, [id]: 'downloading' }));
    
    // Simulate a short delay before "completion" (since we can't track real progress of direct links)
    setTimeout(() => {
      setDownloadStatus(prev => ({ ...prev, [id]: 'completed' }));
      // Reset after a while
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [id]: 'idle' }));
      }, 3000);
    }, 1500);
    
    // Allow default behavior (navigation/download) to proceed
    // Note: For actual usage, we might want to preventDefault and use window.location.href 
    // if we wanted to strictly control the timing, but for UX feedback + direct link, 
    // letting the <a> tag work while showing UI feedback is usually best.
  };

  return (
    <div className="ecosystem-card">
      <div className="ecosystem-card-header">
        <div className="ecosystem-icon-wrapper">
          {tool.icon}
        </div>
        <div className="ecosystem-info">
          <h3 className="ecosystem-title">{tool.title}</h3>
          <div className="ecosystem-meta">
            <span className="version-badge">{tool.version}</span>
          </div>
        </div>
      </div>
      
      <p className="ecosystem-description">{tool.description}</p>
      
      <div className="ecosystem-action">
        {tool.platforms ? (
          <div className="platform-selector" ref={dropdownRef}>
            <button 
              className={`platform-toggle ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <DownloadIcon className="w-4 h-4" />
              选择下载版本
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  className="platform-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tool.platforms.map((p, i) => {
                    const status = downloadStatus[`${tool.id}-${i}`] || 'idle';
                    return (
                      <a 
                        key={i} 
                        href={p.url} 
                        className="platform-item" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => handleDownload(p.url, `${tool.id}-${i}`)}
                      >
                        <div className="flex items-center gap-2">
                          {getFileIcon(p.type)}
                          <span>{p.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          {status === 'idle' && <span className="file-type">{p.type}</span>}
                          {status === 'downloading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                          {status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : tool.applicationUrl ? (
          <a 
            href={tool.applicationUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="direct-download-btn"
          >
            <ExternalLink className="w-4 h-4" />
            申请试用
          </a>
        ) : (
          <a 
            href={tool.repoUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="direct-download-btn"
          >
            <TerminalIcon className="w-4 h-4" />
            进入项目
          </a>
        )}
      </div>
    </div>
  );
}
