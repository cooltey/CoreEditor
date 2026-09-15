import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CaseUpper, 
  CaseLower, 
  ArrowUpDown, 
  Scissors, 
  AlignLeft, 
  ListOrdered, 
  FileText,
  Space,
  Check,
  WrapText
} from 'lucide-react';

interface TypesettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAction: (actionType: string) => void;
}

export const TypesettingModal: React.FC<TypesettingModalProps> = ({
  isOpen,
  onClose,
  onApplyAction,
}) => {
  const [activeTab, setActiveTab] = useState<'transform' | 'cleaning' | 'organize'>('transform');
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = (action: string, label: string) => {
    onApplyAction(action);
    setLastAction(label);
    setTimeout(() => {
      setLastAction(null);
    }, 2000);
  };

  return (
    <div
      id="typesetting-modal-overlay"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        id="typesetting-modal-dialog"
        className="bg-[#24242c] border border-[#3e3e4c] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30303b] bg-[#1d1d23]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f0f0f4]">Typesetting & Text Tools</h3>
              <p className="text-[11px] text-[#8e8e9c]">Format casing, clean whitespace, and restructure lines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-[#8e8e9c] hover:text-white hover:bg-[#343440] transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#30303b] bg-[#1b1b22] px-5 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('transform')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'transform'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-[#8e8e9c] hover:text-white'
            }`}
          >
            <CaseUpper className="w-3.5 h-3.5" />
            <span>Case Transformation</span>
          </button>
          <button
            onClick={() => setActiveTab('cleaning')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'cleaning'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-[#8e8e9c] hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Spacing & Lines</span>
          </button>
          <button
            onClick={() => setActiveTab('organize')}
            className={`py-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'organize'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-[#8e8e9c] hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sorting & Lists</span>
          </button>
        </div>

        {/* Action Body */}
        <div className="p-5 space-y-3 max-h-[380px] overflow-y-auto">
          {activeTab === 'transform' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8e8e9c] mb-2">
                Converts highlighted text, or current paragraph if nothing is selected:
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleAction('uppercase', 'Converted to UPPERCASE')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
                      AA
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300">UPPERCASE</div>
                      <div className="text-[11px] text-[#888898]">TRANSFORMS ALL LETTERS TO CAPITAL LETTERS</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded">Apply</span>
                </button>

                <button
                  onClick={() => handleAction('lowercase', 'Converted to lowercase')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-sky-400 font-mono font-bold text-xs">
                      aa
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300">lowercase</div>
                      <div className="text-[11px] text-[#888898]">transforms all letters to small letters</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded">Apply</span>
                </button>

                <button
                  onClick={() => handleAction('titlecase', 'Converted to Title Case')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                      Aa
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-amber-300">Title Case</div>
                      <div className="text-[11px] text-[#888898]">Capitalizes The First Letter Of Each Word</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">Apply</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cleaning' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8e8e9c] mb-2">
                Clean and normalize blank lines, tabs, and spaces in your document:
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleAction('cleanWhitespace', 'Trimmed trailing spaces')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-emerald-400">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-emerald-300">Trim Trailing Whitespace</div>
                      <div className="text-[11px] text-[#888898]">Removes invisible end-of-line spaces across the document</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">Clean</span>
                </button>

                <button
                  onClick={() => handleAction('cleanEmptyLines', 'Removed excessive blank lines')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-emerald-400">
                      <WrapText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-emerald-300">Remove Excessive Blank Lines</div>
                      <div className="text-[11px] text-[#888898]">Condenses multiple empty lines into a single blank line</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">Clean</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'organize' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8e8e9c] mb-2">
                Restructure and organize your text lists:
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleAction('sortLines', 'Sorted lines alphabetically (A-Z)')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-sky-400">
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300">Sort Lines (A-Z)</div>
                      <div className="text-[11px] text-[#888898]">Alphabetizes selected lines or document items</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded">Sort</span>
                </button>

                <button
                  onClick={() => handleAction('bulletList', 'Formatted as bullet list')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-sky-400">
                      <AlignLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300">Convert to Bullet List</div>
                      <div className="text-[11px] text-[#888898]">Adds hyphen markers to each line</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded">List</span>
                </button>

                <button
                  onClick={() => handleAction('numberedList', 'Formatted as numbered list')}
                  className="w-full text-left p-3 rounded-lg bg-[#1b1b22] hover:bg-[#2e2e3a] border border-[#30303e] hover:border-sky-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#282834] flex items-center justify-center text-sky-400">
                      <ListOrdered className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-sky-300">Convert to Numbered List</div>
                      <div className="text-[11px] text-[#888898]">Sequentially numbers each line (1. 2. 3.)</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded">List</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Bar / Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#30303b] bg-[#1d1d23] text-xs">
          <div className="flex items-center gap-2 text-[#8e8e9c]">
            {lastAction ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>{lastAction}</span>
              </span>
            ) : (
              <span>Actions apply directly to the active editor tab</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#33333e] hover:bg-[#40404c] text-white transition-colors font-medium text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
