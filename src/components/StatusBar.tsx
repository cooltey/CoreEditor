import React, { useState, useRef, useEffect } from 'react';
import { 
  CursorPosition, 
  SyntaxMode, 
  ViewMode 
} from '../types';
import { Columns2, FileCode2, Eye, ChevronUp } from 'lucide-react';

interface StatusBarProps {
  cursor: CursorPosition;
  content: string;
  syntax: SyntaxMode;
  onChangeSyntax: (syntax: SyntaxMode) => void;
  lineEndings: 'LF' | 'CRLF';
  onToggleLineEndings: () => void;
  tabSize: number;
  insertSpaces: boolean;
  onToggleTabSize: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isDirty: boolean;
  autoSave: boolean;
  onToggleAutoSave: () => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  fontSize?: number;
  onOpenFontSettings?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  cursor,
  content,
  syntax,
  onChangeSyntax,
  lineEndings,
  onToggleLineEndings,
  tabSize,
  insertSpaces,
  onToggleTabSize,
  viewMode,
  onChangeViewMode,
  isDirty,
  autoSave,
  onToggleAutoSave,
  saveStatus,
  fontSize = 14,
  onOpenFontSettings,
}) => {
  const [isSyntaxMenuOpen, setIsSyntaxMenuOpen] = useState(false);
  const syntaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (syntaxRef.current && !syntaxRef.current.contains(e.target as Node)) {
        setIsSyntaxMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  // Calculate words and characters
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = content.length;

  const syntaxOptions: SyntaxMode[] = [
    'Markdown',
    'Plain Text',
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'JSON',
    'Python',
    'SQL',
  ];

  return (
    <div
      id="app-statusbar"
      className="h-6 bg-[#18181c] border-t border-[#292934] flex items-center justify-between px-3 text-[11px] text-[#9393a0] select-none relative z-30 font-sans"
    >
      {/* Left items: Line / Col, Selection, Word count */}
      <div className="flex items-center gap-4">
        <span id="status-line-col" className="hover:text-white transition-colors cursor-default">
          Line {cursor.line}, Column {cursor.col}
        </span>

        {cursor.selectionLength > 0 && (
          <span id="status-selection" className="text-sky-400 font-medium">
            ({cursor.selectionLength} selected)
          </span>
        )}

        <span className="hidden sm:inline text-[#6f6f7d]">|</span>

        <span id="status-word-count" className="hidden sm:inline hover:text-white transition-colors cursor-default">
          {words} words, {chars} characters
        </span>

        <span className="hidden sm:inline text-[#6f6f7d]">|</span>

        {/* Auto Save Status & Indicator */}
        <div className="flex items-center gap-2">
          {autoSave ? (
            saveStatus === 'saving' ? (
              <span 
                id="status-save-state" 
                className="flex items-center gap-1 text-sky-400 text-[10px] bg-sky-400/10 px-1.5 py-0.5 rounded border border-sky-400/25 transition-all"
                title="Typing detected... will auto-save to localStorage after 500ms pause"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Saving...
              </span>
            ) : (
              <span 
                id="status-save-state" 
                className="flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 transition-all"
                title="All changes auto-saved to localStorage (500ms debounce)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Auto-saved
              </span>
            )
          ) : isDirty ? (
            <span 
              id="status-save-state" 
              className="flex items-center gap-1 text-amber-400 text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20"
              title="Unsaved changes. Auto Save is OFF. Press Ctrl+S to save."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Unsaved
            </span>
          ) : (
            <span 
              id="status-save-state" 
              className="text-[#727282] text-[10px] px-1 py-0.5"
              title="All changes saved"
            >
              Saved
            </span>
          )}

          {/* Quick Auto-Save toggle */}
          <button
            id="status-autosave-toggle-btn"
            onClick={onToggleAutoSave}
            title={`Auto Save is ${autoSave ? 'ON (500ms pause)' : 'OFF'}. Click to toggle.`}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors border ${
              autoSave 
                ? 'border-sky-500/30 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10' 
                : 'border-[#3a3a46] text-[#787888] hover:text-[#b4b4c0] hover:bg-[#282832]'
            }`}
          >
            AutoSave: {autoSave ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Right items: Tab Size, CRLF, Encoding, Syntax, Layout Mode */}
      <div className="flex items-center gap-3">
        {/* Indentation info */}
        <button
          id="status-tabsize-btn"
          onClick={onToggleTabSize}
          title="Click to toggle spaces/tabs or size"
          className="hover:text-white hover:bg-[#282832] px-1.5 py-0.5 rounded transition-colors"
        >
          {insertSpaces ? `Spaces: ${tabSize}` : `Tab Size: ${tabSize}`}
        </button>

        {/* Line endings */}
        <button
          id="status-lineendings-btn"
          onClick={onToggleLineEndings}
          title="Click to toggle LF / CRLF"
          className="hover:text-white hover:bg-[#282832] px-1.5 py-0.5 rounded transition-colors uppercase"
        >
          {lineEndings}
        </button>

        {/* Encoding */}
        <span className="hidden md:inline text-[#7a7a88] cursor-default">
          UTF-8
        </span>

        {/* Font size button */}
        {onOpenFontSettings && (
          <button
            id="status-fontsize-btn"
            onClick={onOpenFontSettings}
            title={`Editor font: ${fontSize}px. Click to adjust editor and system UI font sizes.`}
            className="hover:text-white hover:bg-[#282832] px-1.5 py-0.5 rounded transition-colors text-amber-400/90 font-mono text-[10px]"
          >
            {fontSize}px
          </button>
        )}

        {/* Syntax Mode selector dropdown */}
        <div className="relative" ref={syntaxRef}>
          <button
            id="status-syntax-btn"
            onClick={() => setIsSyntaxMenuOpen(!isSyntaxMenuOpen)}
            className="flex items-center gap-1 hover:text-white hover:bg-[#282832] px-1.5 py-0.5 rounded transition-colors text-sky-400 font-medium"
          >
            <span>{syntax}</span>
            <ChevronUp className="w-2.5 h-2.5" />
          </button>

          {isSyntaxMenuOpen && (
            <div className="absolute bottom-6 right-0 bg-[#25252d] border border-[#3b3b48] rounded shadow-2xl py-1 z-50 min-w-[130px] text-xs text-[#d0d0d8]">
              <div className="px-3 py-1 text-[10px] text-[#7d7d8c] uppercase font-semibold">Select Syntax</div>
              {syntaxOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChangeSyntax(opt);
                    setIsSyntaxMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1 hover:bg-[#343442] flex justify-between ${
                    opt === syntax ? 'text-sky-400 font-medium bg-[#2e2e38]' : ''
                  }`}
                >
                  <span>{opt}</span>
                  {opt === syntax && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick layout toggle */}
        <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-[#2e2e3a]">
          <button
            onClick={() => onChangeViewMode('editor')}
            title="Editor View"
            className={`p-1 rounded hover:bg-[#2e2e3a] ${viewMode === 'editor' ? 'text-white bg-[#2e2e3a]' : 'text-[#7a7a88]'}`}
          >
            <FileCode2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onChangeViewMode('split')}
            title="Split View"
            className={`p-1 rounded hover:bg-[#2e2e3a] ${viewMode === 'split' ? 'text-white bg-[#2e2e3a]' : 'text-[#7a7a88]'}`}
          >
            <Columns2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onChangeViewMode('preview')}
            title="Preview View"
            className={`p-1 rounded hover:bg-[#2e2e3a] ${viewMode === 'preview' ? 'text-white bg-[#2e2e3a]' : 'text-[#7a7a88]'}`}
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
