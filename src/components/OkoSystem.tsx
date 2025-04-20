import React, { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { Perpetual } from './Perpetual';
import BootScreen from './BootScreen';
import '../styles/OkoSystem.css';

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

const OkoSystem: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showFiles, setShowFiles] = useState(false);
  const [showPerpetual, setShowPerpetual] = useState(false);
  const [showSecure, setShowSecure] = useState(false);
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({});
  const [windowSizes, setWindowSizes] = useState<Record<string, WindowSize>>({
    terminal: { width: 600, height: 400 },
    files: { width: 400, height: 300 },
    perpetual: { width: 500, height: 400 },
    secure: { width: 400, height: 300 }
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [systemMenuPosition, setSystemMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !showTerminal) {
        setShowTerminal(true);
        setActiveWindow('terminal');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showTerminal]);

  const handleIconClick = (windowKey: string) => {
    switch (windowKey) {
      case 'terminal':
        setShowTerminal(true);
        break;
      case 'files':
        setShowFiles(true);
        break;
      case 'perpetual':
        setShowPerpetual(true);
        break;
      case 'secure':
        setShowSecure(true);
        break;
    }
    setActiveWindow(windowKey);
  };

  const closeWindow = (windowKey: string) => {
    switch (windowKey) {
      case 'terminal':
        setShowTerminal(false);
        break;
      case 'files':
        setShowFiles(false);
        break;
      case 'perpetual':
        setShowPerpetual(false);
        break;
      case 'secure':
        setShowSecure(false);
        break;
    }
    if (activeWindow === windowKey) {
      setActiveWindow(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, windowKey: string) => {
    const windowElement = e.currentTarget as HTMLElement;
    const rect = windowElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setIsDragging(windowKey);
    setDragOffset({ x: offsetX, y: offsetY });
    setActiveWindow(windowKey);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setWindowPositions(prev => ({
      ...prev,
      [isDragging]: { x: newX, y: newY }
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleResizeMouseDown = (e: React.MouseEvent, windowKey: string) => {
    e.stopPropagation();
    const windowElement = e.currentTarget.parentElement as HTMLElement;
    const rect = windowElement.getBoundingClientRect();
    
    setIsResizing(windowKey);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    });
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    setWindowSizes(prev => ({
      ...prev,
      [isResizing]: {
        width: Math.max(300, resizeStart.width + deltaX),
        height: Math.max(200, resizeStart.height + deltaY)
      }
    }));
  };

  const handleResizeMouseUp = () => {
    setIsResizing(null);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMouseMove as any);
      window.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleResizeMouseMove as any);
        window.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, resizeStart]);

  const handleSystemMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setSystemMenuPosition({
      x: rect.left,
      y: rect.top + rect.height
    });
    setShowSystemMenu(true);
  };

  const handleSystemMenuClose = () => {
    setShowSystemMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSystemMenu(false);
    };

    if (showSystemMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [showSystemMenu]);

  const renderWindow = (windowKey: string, title: string, content: React.ReactNode) => {
    const isVisible = {
      terminal: showTerminal,
      files: showFiles,
      perpetual: showPerpetual,
      secure: showSecure
    }[windowKey];

    if (!isVisible) return null;

    const position = windowPositions[windowKey] || { x: 100, y: 100 };
    const size = windowSizes[windowKey];

    return (
      <div 
        className={`window ${activeWindow === windowKey ? 'active' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: 'absolute',
          width: `${size.width}px`,
          height: `${size.height}px`
        }}
        onMouseDown={(e) => handleMouseDown(e, windowKey)}
      >
        <div className="window-header">
          <span>{title}</span>
          <div className="window-controls">
            <button className="control-button" onClick={() => closeWindow(windowKey)}>×</button>
          </div>
        </div>
        <div className="window-content">
          {content}
        </div>
        <div 
          className="window-resizer"
          onMouseDown={(e) => handleResizeMouseDown(e, windowKey)}
        />
      </div>
    );
  };

  const renderSystemMenu = () => {
    if (!showSystemMenu) return null;

    return (
      <div 
        className="system-menu"
        style={{
          left: `${systemMenuPosition.x}px`,
          top: `${systemMenuPosition.y}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="system-menu-header">
          <span>0KO.DEV</span>
          <button className="control-button" onClick={handleSystemMenuClose}>×</button>
        </div>
        <div className="system-menu-content">
          <div className="system-info">
            <div className="info-line">
              <span className="info-label">VERSÃO</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-line">
              <span className="info-label">STATUS</span>
              <span className="info-value">OPERACIONAL</span>
            </div>
            <div className="info-line">
              <span className="info-label">ÚLTIMA ATUALIZAÇÃO</span>
              <span className="info-value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="system-options">
            <button className="menu-button">REINICIAR</button>
            <button className="menu-button">DESLIGAR</button>
          </div>
        </div>
      </div>
    );
  };

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="old-system">
      <div className="desktop">
        <div className="menu-bar">
          <div className="menu-item" onClick={handleSystemMenuClick}>0Ko.dev</div>
          <div className="time">{new Date().toLocaleTimeString()}</div>
        </div>

        {renderSystemMenu()}

        <div className="desktop-icons">
          <div className="icon" onClick={() => handleIconClick('terminal')}>
            <div className="icon-image">⌨️</div>
            <div className="icon-label">Terminal</div>
          </div>
          <div className="icon" onClick={() => handleIconClick('files')}>
            <div className="icon-image">📁</div>
            <div className="icon-label">Arquivos</div>
          </div>
          <div className="icon" onClick={() => handleIconClick('perpetual')}>
            <div className="icon-image">∞</div>
            <div className="icon-label">Perpétuo</div>
          </div>
          <div className="icon" onClick={() => handleIconClick('secure')}>
            <div className="icon-image">🔒</div>
            <div className="icon-label">Seguro</div>
          </div>
        </div>

        {renderWindow('terminal', 'Terminal', <Terminal />)}
        {renderWindow('files', 'Arquivos', (
          <div className="file-list">
            <div className="file-item">📄 documento.txt</div>
            <div className="file-item">📁 pasta</div>
            <div className="file-item">📄 relatório.pdf</div>
          </div>
        ))}
        {renderWindow('perpetual', 'Sistema Perpétuo', <Perpetual />)}
        {renderWindow('secure', 'Seguro', (
          <div className="secure-content">
            <div className="secure-text">Área segura</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OkoSystem; 