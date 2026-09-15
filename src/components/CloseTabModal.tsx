import React from 'react';
import { AlertTriangle, X, FileText, Trash2, Save, Undo2 } from 'lucide-react';
import { TabItem } from '../types';

interface CloseTabModalProps {
  isOpen: boolean;
  tab: TabItem | null;
  hasOtherTabs: boolean;
  onConfirmClose: (saveFirst: boolean) => void;
  onCancel: () => void;
  confirmOnCloseAll: boolean;
  onToggleConfirmSetting: () => void;
}

export const CloseTabModal: React.FC<CloseTabModalProps> = ({
  isOpen,
  tab,
  hasOtherTabs,
  onConfirmClose,
  onCancel,
  confirmOnCloseAll,
  onToggleConfirmSetting,
}) => {
  if (!isOpen || !tab) return null;

  const charCount = tab.content.length;
  const lineCount = tab.content.split('\n').length;
  const previewSnippet = tab.content.trim().slice(0, 140);

  return (
    <div
      id="close-tab-modal-overlay"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onCancel}
    >
      <div
        id="close-tab-modal-dialog"
        className="bg-[#24242c] border border-[#3e3e4c] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#30303b] bg-[#1d1d23]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f0f0f4]">Close Tab Confirmation</h3>
              <p className="text-[11px] text-[#8e8e9c]">
                {tab.isDirty ? 'This note has unsaved changes' : 'Confirm closing this note tab'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-6 h-6 rounded flex items-center justify-center text-[#8e8e9c] hover:text-white hover:bg-[#343440] transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs text-[#c8c8d4]">
          {/* Note Info Card */}
          <div className="bg-[#1b1b22] border border-[#2e2e3a] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-white truncate pr-2">
                <FileText className={`w-4 h-4 shrink-0 ${tab.title.endsWith('.md') ? 'text-sky-400' : 'text-amber-400'}`} />
                <span className="truncate text-sm">{tab.title}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#272733] text-[#a0a0b2] shrink-0">
                {lineCount} lines · {charCount} chars
              </span>
            </div>

            {previewSnippet ? (
              <div className="text-[11px] text-[#8e8e9c] line-clamp-2 italic bg-[#15151a] p-2 rounded border border-[#24242e] font-mono">
                "{previewSnippet}..."
              </div>
            ) : (
              <div className="text-[11px] text-[#6e6e7c] italic bg-[#15151a] p-2 rounded border border-[#24242e]">
                (Empty document)
              </div>
            )}
          </div>

          {/* Prompt Message */}
          <p className="text-[12px] leading-relaxed text-[#a8a8b8]">
            {tab.isDirty ? (
              <span>
                Do you want to save the changes before closing <strong className="text-white">"{tab.title}"</strong>? If you close without saving, your recent edits will be lost.
              </span>
            ) : (
              <span>
                Are you sure you want to close <strong className="text-white">"{tab.title}"</strong>?
                {!hasOtherTabs && ' (This is your only open tab; closing it will create a fresh blank note)'}
              </span>
            )}
          </p>

          {/* Persistent Setting Checkbox */}
          <div className="pt-1 border-t border-[#2d2d38] flex items-center justify-between text-[11px] text-[#8e8e9c]">
            <label className="flex items-center gap-2 cursor-pointer hover:text-[#d0d0dc] select-none">
              <input
                type="checkbox"
                checked={confirmOnCloseAll}
                onChange={onToggleConfirmSetting}
                className="rounded border-[#404050] bg-[#1b1b22] text-sky-500 focus:ring-0 w-3.5 h-3.5"
              />
              <span>Always ask before closing tabs</span>
            </label>
            <span className="text-[10px] text-[#6b6b7a]">(Can be changed anytime)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#30303b] bg-[#1d1d23]">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#32323e] text-[#c0c0d0] hover:text-white transition-colors text-xs"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onConfirmClose(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#343442] hover:bg-rose-900/60 hover:text-rose-200 text-[#d4d4e0] transition-colors text-xs font-medium border border-[#444456]"
              title={tab.isDirty ? 'Discard unsaved changes and close' : 'Close tab'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{tab.isDirty ? 'Discard & Close' : 'Close Tab'}</span>
            </button>

            {tab.isDirty && (
              <button
                onClick={() => onConfirmClose(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white transition-colors text-xs font-medium shadow-sm"
                title="Save changes and close"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Close</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
