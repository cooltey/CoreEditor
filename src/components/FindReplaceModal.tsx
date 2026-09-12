import React, { useEffect, useRef } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  CaseSensitive, 
  WholeWord, 
  Regex, 
  RefreshCw 
} from 'lucide-react';
import { FindReplaceState } from '../types';

interface FindReplaceModalProps {
  state: FindReplaceState;
  onChangeState: (updater: (prev: FindReplaceState) => FindReplaceState) => void;
  onFindNext: () => void;
  onFindPrev: () => void;
  onReplaceCurrent: () => void;
  onReplaceAll: () => void;
  onClose: () => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  state,
  onChangeState,
  onFindNext,
  onFindPrev,
  onReplaceCurrent,
  onReplaceAll,
  onClose,
}) => {
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isOpen && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [state.isOpen, state.isReplaceOpen]);

  if (!state.isOpen) return null;

  return (
    <div
      id="find-replace-panel"
      className="absolute bottom-6 left-0 right-0 bg-[#22222a] border-t border-[#383846] p-2 z-40 text-xs shadow-2xl font-sans"
    >
      <div className="max-w-4xl mx-auto space-y-1.5">
        {/* Find Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              ref={findInputRef}
              type="text"
              placeholder="Find..."
              value={state.findText}
              onChange={(e) =>
                onChangeState((prev) => ({ ...prev, findText: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) onFindPrev();
                  else onFindNext();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              className="w-full bg-[#18181f] text-[#ededf0] placeholder-[#666675] border border-[#3c3c4a] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500 font-mono"
            />

            {/* In-input toggles: Case, Word, Regex */}
            <div className="absolute right-1 flex items-center gap-0.5">
              <button
                type="button"
                onClick={() =>
                  onChangeState((prev) => ({ ...prev, matchCase: !prev.matchCase }))
                }
                title="Match Case (Alt+C)"
                className={`p-1 rounded text-[10px] ${
                  state.matchCase
                    ? 'bg-sky-500/20 text-sky-400 font-bold'
                    : 'text-[#7d7d8c] hover:text-[#c0c0cc]'
                }`}
              >
                <CaseSensitive className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChangeState((prev) => ({ ...prev, wholeWord: !prev.wholeWord }))
                }
                title="Match Whole Word (Alt+W)"
                className={`p-1 rounded text-[10px] ${
                  state.wholeWord
                    ? 'bg-sky-500/20 text-sky-400 font-bold'
                    : 'text-[#7d7d8c] hover:text-[#c0c0cc]'
                }`}
              >
                <WholeWord className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChangeState((prev) => ({ ...prev, useRegex: !prev.useRegex }))
                }
                title="Use Regular Expression (Alt+R)"
                className={`p-1 rounded text-[10px] ${
                  state.useRegex
                    ? 'bg-sky-500/20 text-sky-400 font-bold'
                    : 'text-[#7d7d8c] hover:text-[#c0c0cc]'
                }`}
              >
                <Regex className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <span className="text-[11px] text-[#8e8e9c] min-w-[70px] text-right font-mono">
            {state.findText
              ? state.totalMatches > 0
                ? `${state.currentMatchIndex + 1} of ${state.totalMatches}`
                : 'No results'
              : ''}
          </span>

          {/* Next / Prev Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={onFindPrev}
              title="Previous Match (Shift+Enter)"
              className="p-1 rounded bg-[#2c2c36] hover:bg-[#383846] text-[#c0c0cc] hover:text-white transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onFindNext}
              title="Next Match (Enter)"
              className="p-1 rounded bg-[#2c2c36] hover:bg-[#383846] text-[#c0c0cc] hover:text-white transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Replace Mode */}
          <button
            onClick={() =>
              onChangeState((prev) => ({
                ...prev,
                isReplaceOpen: !prev.isReplaceOpen,
              }))
            }
            className={`px-2 py-1 rounded text-xs transition-colors ${
              state.isReplaceOpen
                ? 'bg-sky-600 text-white'
                : 'bg-[#2c2c36] text-[#b0b0bc] hover:bg-[#383846]'
            }`}
          >
            Replace
          </button>

          {/* Close Find bar */}
          <button
            onClick={onClose}
            title="Close (Escape)"
            className="p-1 text-[#8e8e9c] hover:text-white hover:bg-[#383846] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Replace Row */}
        {state.isReplaceOpen && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#2e2e3a]">
            <input
              type="text"
              placeholder="Replace with..."
              value={state.replaceText}
              onChange={(e) =>
                onChangeState((prev) => ({
                  ...prev,
                  replaceText: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onReplaceCurrent();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              className="flex-1 bg-[#18181f] text-[#ededf0] placeholder-[#666675] border border-[#3c3c4a] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              onClick={onReplaceCurrent}
              className="px-2.5 py-1 bg-[#2c2c36] hover:bg-[#383846] text-[#e0e0ea] rounded text-xs transition-colors"
            >
              Replace
            </button>
            <button
              onClick={onReplaceAll}
              className="px-2.5 py-1 bg-[#2c2c36] hover:bg-[#383846] text-[#e0e0ea] rounded text-xs transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-sky-400" />
              <span>Replace All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
