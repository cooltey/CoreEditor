import React from 'react';
import { X, Sparkles, Keyboard, CheckCircle2, FileCode } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#24242c] border border-[#3c3c4a] rounded-lg shadow-2xl w-full max-w-lg overflow-hidden text-xs text-[#d0d0d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30303b] bg-[#1e1e24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-red-500/50 shadow-md bg-red-950/40 p-0.5">
              <img
                src="/doge-target-icon.svg"
                alt="CoreEditor Doge Target Icon"
                className="w-full h-full object-cover rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span>CoreEditor</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30">v2.1 Doge Target</span>
              </div>
              <div className="text-[11px] text-[#8e8e9c]">AI-Powered Markdown & Code Editor with Windows Executable Support</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888896] hover:text-white p-1 rounded hover:bg-[#30303b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Core Capabilities & Highlights
            </h4>
            <ul className="space-y-1.5 text-[#b4b4c0]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Core AI Agent Integration (Ctrl+J)</strong>: Connected writing assistant for continuation, proofreading, Markdown tables, translation, and custom agent endpoints (Ollama/OpenAI compatible).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Real-time Synchronized Preview</strong>: Instant split-view Markdown rendering with GFM syntax, checklists, and code formatting.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Auto Save & Persistence</strong>: Debounced auto-save with real-time status indicators and local session backup.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Windows Portable .exe Ready</strong>: 1-click build scripts (`build-windows-exe.bat`) and Electron packaging.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-sky-400" />
              Essential Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + J</span>
                <span className="text-sky-400">AI Agent</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + P</span>
                <span className="text-[#8e8e9c]">Command Palette</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + N</span>
                <span className="text-[#8e8e9c]">New Tab</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + S</span>
                <span className="text-[#8e8e9c]">Save File</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + F</span>
                <span className="text-[#8e8e9c]">Find</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + H</span>
                <span className="text-[#8e8e9c]">Replace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-3 bg-[#1e1e24] border-t border-[#30303b]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
