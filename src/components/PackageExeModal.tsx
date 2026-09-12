import React, { useState } from 'react';
import { X, Check, Copy, Monitor, Package, Terminal, FolderOpen, ArrowRight } from 'lucide-react';

interface PackageExeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackageExeModal: React.FC<PackageExeModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#24242c] border border-[#3c3c4a] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden text-xs text-[#d0d0d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30303b] bg-[#1e1e24]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-red-500/50 shadow flex items-center justify-center bg-red-950/40">
              <img src="/doge-target-icon.svg" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Package CoreEditor as Windows Executable (.exe)</div>
              <div className="text-[11px] text-[#8e8e9c]">Build Standalone Windows Desktop Executable</div>
            </div>
          </div>
          <button
            id="close-package-modal-btn"
            onClick={onClose}
            className="text-[#888896] hover:text-white p-1 rounded hover:bg-[#30303b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="bg-[#1b1b22] border border-[#2d2d38] rounded-md p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium text-[13px]">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>Export or Download Project Source</span>
            </div>
            <p className="text-[#a4a4b2] text-[11px] leading-relaxed pl-7">
              Click the gear icon in the top-right menu and choose <strong className="text-white">"Download as ZIP"</strong> (or clone via Git), then extract the archive into any folder on your Windows PC.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1b1b22] border border-[#2d2d38] rounded-md p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-[13px]">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>Build Executable (Two Methods)</span>
            </div>

            {/* Option A: 1-Click Bat */}
            <div className="pl-7 space-y-1.5">
              <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Option A: One-Click Batch Script (Easiest)
              </div>
              <p className="text-[#9898a8] text-[11px]">
                Simply double-click the batch file in the project folder:
              </p>
              <div className="flex items-center justify-between bg-[#131318] px-3 py-2 rounded border border-[#2e2e38] font-mono text-[11px] text-emerald-400">
                <span>build-windows-exe.bat</span>
                <button
                  onClick={() => copyToClipboard('build-windows-exe.bat', 1)}
                  className="text-[#787888] hover:text-white transition-colors"
                  title="Copy filename"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-[#767684]">
                * Automatically installs dependencies, compiles Vite bundles, and opens the release folder.
              </p>
            </div>

            <div className="h-px bg-[#2a2a34] mx-7" />

            {/* Option B: Terminal Command */}
            <div className="pl-7 space-y-1.5">
              <div className="text-purple-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Option B: Command Line (PowerShell / CMD)
              </div>
              <p className="text-[#9898a8] text-[11px]">
                Run these commands in your project root:
              </p>
              <div className="bg-[#131318] p-2.5 rounded border border-[#2e2e38] font-mono text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-[#c0c0d0]">
                  <span>npm install</span>
                  <button
                    onClick={() => copyToClipboard('npm install', 2)}
                    className="text-[#787888] hover:text-white transition-colors"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>npm run build:win</span>
                  <button
                    onClick={() => copyToClipboard('npm run build:win', 3)}
                    className="text-[#787888] hover:text-white transition-colors"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-[#767684]">
                * If npm reports missing rollup-win32 module, run: <code className="text-sky-300">npm i @rollup/rollup-win32-x64-msvc</code>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1b1b22] border border-[#2d2d38] rounded-md p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium text-[13px]">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>Get Your Windows Executable</span>
            </div>
            <div className="pl-7 space-y-2">
              <p className="text-[#a4a4b2] text-[11px]">
                Upon completion, your standalone portable executable will be ready in <code className="text-sky-300 bg-sky-950/40 px-1 py-0.5 rounded border border-sky-800/30">release\</code>:
              </p>
              <div className="flex items-center gap-2 p-2.5 bg-[#14141a] rounded border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">release\CoreEditor-Windows-Portable.exe</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8e8e9c]">
                <ArrowRight className="w-3 h-3 text-sky-400" />
                <span>This is a <strong>standalone portable executable</strong>. Copy it to any Windows PC or USB drive and run 100% offline!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3.5 bg-[#1e1e24] border-t border-[#30303b]">
          <span className="text-[11px] text-[#747482]">Pre-configured with Electron 44 & Electron-Builder</span>
          <button
            id="close-package-modal-confirm-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
