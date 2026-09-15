import React from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface TitleBarProps {
  fileName: string;
  isDirty: boolean;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  fileName,
  isDirty,
  isMaximized,
  onToggleMaximize,
}) => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
    onToggleMaximize();
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <div 
      id="app-titlebar"
      onDoubleClick={handleMaximize}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      className="h-8 bg-[#1f1f23] border-b border-[#2d2d34] flex items-center justify-between select-none text-xs text-[#a0a0aa] px-2.5 relative z-40 transition-colors shrink-0"
    >
      {/* Left section: App Icon & Brand Name */}
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 border border-[#3e3f4e] shadow-xs flex items-center justify-center bg-[#1c1d25]">
            <AppLogo className="w-full h-full object-cover" />
          </div>
          <span className="text-[#f1f1f5] font-semibold text-xs tracking-wide">CoreEditor</span>
        </div>
      </div>

      {/* Center: File Name & Dirty indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-normal text-xs text-[#cccccc] pointer-events-none truncate max-w-[45%]">
        <span className="font-medium text-[#e4e4e7] truncate">{fileName}</span>
        {isDirty && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse shrink-0" title="Unsaved changes" />
        )}
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1.5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="flex items-center -mr-2.5 h-8">
          <button
            id="win-minimize-btn"
            onClick={handleMinimize}
            className="w-11 h-8 flex items-center justify-center hover:bg-[#2e2e36] text-[#b0b0ba] hover:text-white transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            id="win-maximize-btn"
            onClick={handleMaximize}
            className="w-11 h-8 flex items-center justify-center hover:bg-[#2e2e36] text-[#b0b0ba] hover:text-white transition-colors cursor-pointer"
            title={isMaximized ? "Restore Down" : "Maximize"}
          >
            {isMaximized ? (
              <Copy className="w-3 h-3" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>
          <button
            id="win-close-btn"
            onClick={handleClose}
            className="w-11 h-8 flex items-center justify-center hover:bg-[#e81123] text-[#b0b0ba] hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
