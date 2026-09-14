import React from 'react';
import { X, Type, Monitor, Eye, RotateCcw, Check } from 'lucide-react';
import { EditorSettings } from '../types';

interface FontSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
}

export const FontSettingsModal: React.FC<FontSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const editorPresets = [12, 13, 14, 15, 16, 18, 20, 24];
  const uiPresets = [11, 12, 13, 14, 15, 16];
  const previewPresets = [13, 14, 15, 16, 18, 20];

  const handleResetDefaults = () => {
    onUpdateSettings({
      fontSize: 14,
      uiFontSize: 13,
      previewFontSize: 15,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="font-settings-dialog"
        className="w-full max-w-md bg-[#202026] border border-[#383844] rounded-lg shadow-2xl overflow-hidden flex flex-col text-[#d8d8e2] select-none animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d38] bg-[#1a1a20]">
          <div className="flex items-center gap-2 font-medium text-sm text-white">
            <Type className="w-4 h-4 text-sky-400" />
            <span>Font Size Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#30303c] text-[#90909c] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 text-xs">
          {/* 1. Editor Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Editor Font Size</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                {settings.fontSize} px
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.max(10, settings.fontSize - 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
                title="Decrease"
              >
                -
              </button>
              <input
                type="range"
                min="10"
                max="32"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="flex-1 accent-amber-400 h-1.5 bg-[#32323e] rounded-lg cursor-pointer"
              />
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.min(32, settings.fontSize + 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
                title="Increase"
              >
                +
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[10px] text-[#787886] mr-1">Presets:</span>
              {editorPresets.map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    settings.fontSize === size
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-[#292934] text-[#a0a0ae] hover:bg-[#343442] hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Live Editor Preview */}
            <div 
              className="p-2.5 rounded bg-[#16161a] border border-[#2c2c36] font-mono text-[#e0e0e8] overflow-hidden whitespace-nowrap leading-[1.55]"
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              const editor = new CoreEditor({'{'} fontSize: {settings.fontSize} {'}'});
            </div>
          </div>

          <div className="h-px bg-[#2d2d38]" />

          {/* 2. System UI Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>System UI Font Size</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-semibold">
                {settings.uiFontSize || 13} px
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ uiFontSize: Math.max(10, (settings.uiFontSize || 13) - 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
                title="Decrease"
              >
                -
              </button>
              <input
                type="range"
                min="11"
                max="18"
                step="1"
                value={settings.uiFontSize || 13}
                onChange={(e) => onUpdateSettings({ uiFontSize: Number(e.target.value) })}
                className="flex-1 accent-sky-400 h-1.5 bg-[#32323e] rounded-lg cursor-pointer"
              />
              <button
                onClick={() => onUpdateSettings({ uiFontSize: Math.min(18, (settings.uiFontSize || 13) + 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
                title="Increase"
              >
                +
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[10px] text-[#787886] mr-1">Presets:</span>
              {uiPresets.map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ uiFontSize: size })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    (settings.uiFontSize || 13) === size
                      ? 'bg-sky-500 text-black font-semibold'
                      : 'bg-[#292934] text-[#a0a0ae] hover:bg-[#343442] hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Live UI Preview */}
            <div 
              className="p-2.5 rounded bg-[#16161a] border border-[#2c2c36] text-[#b4b4c2] overflow-hidden leading-normal flex items-center gap-2"
              style={{ fontSize: `${settings.uiFontSize || 13}px` }}
            >
              <span className="font-semibold text-white">Menu Bar</span>
              <span>•</span>
              <span>Tabs</span>
              <span>•</span>
              <span>Status Bar</span>
            </div>
          </div>

          <div className="h-px bg-[#2d2d38]" />

          {/* 3. Markdown Preview Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Markdown Preview Font Size</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
                {settings.previewFontSize || 15} px
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateSettings({ previewFontSize: Math.max(12, (settings.previewFontSize || 15) - 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
              >
                -
              </button>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={settings.previewFontSize || 15}
                onChange={(e) => onUpdateSettings({ previewFontSize: Number(e.target.value) })}
                className="flex-1 accent-emerald-400 h-1.5 bg-[#32323e] rounded-lg cursor-pointer"
              />
              <button
                onClick={() => onUpdateSettings({ previewFontSize: Math.min(24, (settings.previewFontSize || 15) + 1) })}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#2b2b36] hover:bg-[#363644] text-white font-bold"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              <span className="text-[10px] text-[#787886] mr-1">Presets:</span>
              {previewPresets.map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ previewFontSize: size })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    (settings.previewFontSize || 15) === size
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-[#292934] text-[#a0a0ae] hover:bg-[#343442] hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#1a1a20] border-t border-[#2d2d38] flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-[#8e8e9c] hover:text-white hover:underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium text-xs transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
