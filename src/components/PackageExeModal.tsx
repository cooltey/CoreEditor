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
              <div className="font-semibold text-white text-sm">打包 CoreEditor 為 Windows 可執行檔 (.exe)</div>
              <div className="text-[11px] text-[#8e8e9c]">Build CoreEditor Desktop Executable Guide</div>
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
              <span>匯出或下載專案原始碼</span>
            </div>
            <p className="text-[#a4a4b2] text-[11px] leading-relaxed pl-7">
              點選右上角齒輪選單，選擇 <strong className="text-white">「Download as ZIP」</strong>，並將壓縮檔解壓縮至您 Windows 電腦上的任意資料夾。
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1b1b22] border border-[#2d2d38] rounded-md p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-[13px]">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>執行打包（兩種方式）</span>
            </div>

            {/* Option A: 1-Click Bat */}
            <div className="pl-7 space-y-1.5">
              <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                方式 A：一鍵批次檔（最簡單）
              </div>
              <p className="text-[#9898a8] text-[11px]">
                直接雙擊專案資料夾內的批次檔：
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
                * 該腳本會自動安裝相依套件並編譯生成獨立免安裝版 .exe，完成後自動開啟 release 目錄。
              </p>
            </div>

            <div className="h-px bg-[#2a2a34] mx-7" />

            {/* Option B: Terminal Command */}
            <div className="pl-7 space-y-1.5">
              <div className="text-purple-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                方式 B：使用終端機指令
              </div>
              <p className="text-[#9898a8] text-[11px]">
                在專案資料夾開啟 PowerShell 或 CMD 終端機：
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
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1b1b22] border border-[#2d2d38] rounded-md p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium text-[13px]">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>取得 Windows 執行檔</span>
            </div>
            <div className="pl-7 space-y-2">
              <p className="text-[#a4a4b2] text-[11px]">
                打包完成後，將在 <code className="text-sky-300 bg-sky-950/40 px-1 py-0.5 rounded border border-sky-800/30">release\</code> 資料夾產生獨立執行檔：
              </p>
              <div className="flex items-center gap-2 p-2.5 bg-[#14141a] rounded border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">release\CoreEditor-Windows-Portable.exe</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8e8e9c]">
                <ArrowRight className="w-3 h-3 text-sky-400" />
                <span>此檔案為<strong>綠色免安裝可執行檔</strong>，可複製到任何 Windows 電腦或隨身碟，點開即用且 100% 離線執行！</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3.5 bg-[#1e1e24] border-t border-[#30303b]">
          <span className="text-[11px] text-[#747482]">已預先配置 Electron 44 & Electron-Builder</span>
          <button
            id="close-package-modal-confirm-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow"
          >
            瞭解並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
