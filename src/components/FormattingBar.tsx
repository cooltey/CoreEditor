import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Table, 
  Link2, 
  Image, 
  Minus, 
  CaseUpper, 
  CaseLower, 
  Columns2, 
  FileCode2, 
  Eye, 
  Sparkles,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { ViewMode } from '../types';

interface FormattingBarProps {
  onAction: (actionType: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenTableModal: () => void;
  onOpenTypesettingModal?: () => void;
}

export const FormattingBar: React.FC<FormattingBarProps> = ({
  onAction,
  viewMode,
  onChangeViewMode,
  onOpenTableModal,
  onOpenTypesettingModal,
}) => {
  const [isCaseMenuOpen, setIsCaseMenuOpen] = useState(false);
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const caseMenuRef = useRef<HTMLDivElement>(null);
  const headingMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (caseMenuRef.current && !caseMenuRef.current.contains(e.target as Node)) {
        setIsCaseMenuOpen(false);
      }
      if (headingMenuRef.current && !headingMenuRef.current.contains(e.target as Node)) {
        setIsHeadingMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div 
      id="app-formatting-bar"
      className="h-8 bg-[#202026] border-b border-[#2d2d36] flex items-center justify-between px-2 text-xs select-none relative z-10 overflow-visible"
    >
      {/* Left section: Formatting actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Headings dropdown */}
        <div className="relative" ref={headingMenuRef}>
          <button
            id="format-heading-btn"
            onClick={() => setIsHeadingMenuOpen(!isHeadingMenuOpen)}
            title="Headings (H1, H2, H3)"
            className="flex items-center gap-1 h-6 px-1.5 rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
          >
            <span className="font-semibold text-[11px]">H</span>
            <span className="text-[9px] text-[#888899]">▼</span>
          </button>
          {isHeadingMenuOpen && (
            <div className="absolute top-7 left-0 bg-[#262630] border border-[#3c3c4a] rounded shadow-xl py-1 z-50 min-w-[130px]">
              <button
                onClick={() => {
                  onAction('h1');
                  setIsHeadingMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2"
              >
                <Heading1 className="w-3.5 h-3.5 text-sky-400" />
                <span>Heading 1</span>
              </button>
              <button
                onClick={() => {
                  onAction('h2');
                  setIsHeadingMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2"
              >
                <Heading2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Heading 2</span>
              </button>
              <button
                onClick={() => {
                  onAction('h3');
                  setIsHeadingMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2"
              >
                <Heading3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Heading 3</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-3.5 bg-[#32323e] mx-1" />

        {/* Inline styles: Bold, Italic, Strikethrough, Code */}
        <button
          id="format-bold-btn"
          onClick={() => onAction('bold')}
          title="Bold (Ctrl+B)"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-italic-btn"
          onClick={() => onAction('italic')}
          title="Italic (Ctrl+I)"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-strike-btn"
          onClick={() => onAction('strike')}
          title="Strikethrough"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-code-btn"
          onClick={() => onAction('code')}
          title="Inline Code"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors font-mono text-[11px]"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-[#32323e] mx-1" />

        {/* Lists & structural formatting */}
        <button
          id="format-bullet-list-btn"
          onClick={() => onAction('bulletList')}
          title="Bullet List"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-numbered-list-btn"
          onClick={() => onAction('numberedList')}
          title="Numbered List"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-checklist-btn"
          onClick={() => onAction('checklist')}
          title="Task Checklist (- [ ])"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-quote-btn"
          onClick={() => onAction('quote')}
          title="Blockquote"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-codeblock-btn"
          onClick={() => onAction('codeBlock')}
          title="Fenced Code Block"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors font-mono text-[11px]"
        >
          <FileCode2 className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-table-btn"
          onClick={onOpenTableModal}
          title="Insert Markdown Table"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Table className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-hr-btn"
          onClick={() => onAction('hr')}
          title="Horizontal Rule (---)"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-link-btn"
          onClick={() => onAction('link')}
          title="Insert Link"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          id="format-image-btn"
          onClick={() => onAction('image')}
          title="Insert Image"
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#32323e] text-[#c0c0cc] hover:text-white transition-colors"
        >
          <Image className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-[#32323e] mx-1" />

        {/* Text Transformation / Typesetting Tools */}
        <div className="flex items-center relative" ref={caseMenuRef}>
          <button
            id="format-typesetting-btn"
            onClick={() => {
              if (onOpenTypesettingModal) {
                onOpenTypesettingModal();
              } else {
                setIsCaseMenuOpen(!isCaseMenuOpen);
              }
            }}
            title="Open Typesetting & Text Tools Window"
            className="flex items-center gap-1 h-6 px-1.5 rounded-l hover:bg-[#343444] text-[#dcdce8] hover:text-white transition-colors bg-[#262632] border border-[#3c3c4c]"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-medium">Typesetting</span>
          </button>
          <button
            id="format-casing-arrow-btn"
            onClick={() => setIsCaseMenuOpen(!isCaseMenuOpen)}
            title="Quick Formatting & Casing Menu"
            className="h-6 px-1 rounded-r hover:bg-[#343444] text-[#a0a0b0] hover:text-white transition-colors bg-[#262632] border-y border-r border-[#3c3c4c]"
          >
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
          {isCaseMenuOpen && (
            <div 
              className="absolute top-7 left-0 bg-[#24242e] border border-[#444458] rounded-md shadow-2xl py-1 z-[70] min-w-[190px] text-xs animate-in fade-in zoom-in-95 duration-100"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)' }}
            >
              <div className="px-3 py-1 text-[10px] text-[#8e8e9c] font-semibold uppercase tracking-wider border-b border-[#30303c] bg-[#1d1d24] flex items-center justify-between">
                <span>Quick Casing</span>
                {onOpenTypesettingModal && (
                  <button 
                    onClick={() => {
                      setIsCaseMenuOpen(false);
                      onOpenTypesettingModal();
                    }}
                    className="text-sky-400 hover:underline capitalize text-[10px]"
                  >
                    All Tools ↗
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  onAction('uppercase');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2 text-[#d4d4e0]"
              >
                <CaseUpper className="w-3.5 h-3.5 text-sky-400" />
                <span>UPPERCASE</span>
              </button>
              <button
                onClick={() => {
                  onAction('lowercase');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2 text-[#d4d4e0]"
              >
                <CaseLower className="w-3.5 h-3.5 text-sky-400" />
                <span>lowercase</span>
              </button>
              <button
                onClick={() => {
                  onAction('titlecase');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-2 text-[#d4d4e0]"
              >
                <span className="font-semibold text-xs text-sky-400">Aa</span>
                <span>Title Case</span>
              </button>
              <div className="h-px bg-[#363644] my-1" />
              <button
                onClick={() => {
                  onAction('cleanWhitespace');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] text-[#c8c8d4]"
              >
                Trim Trailing Spaces
              </button>
              <button
                onClick={() => {
                  onAction('cleanEmptyLines');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] text-[#c8c8d4]"
              >
                Remove Double Blanks
              </button>
              <button
                onClick={() => {
                  onAction('sortLines');
                  setIsCaseMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#383846] flex items-center gap-1.5 text-[#c8c8d4]"
              >
                <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                <span>Sort Lines (A-Z)</span>
              </button>
              {onOpenTypesettingModal && (
                <>
                  <div className="h-px bg-[#363644] my-1" />
                  <button
                    onClick={() => {
                      setIsCaseMenuOpen(false);
                      onOpenTypesettingModal();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#383846] flex items-center justify-between text-amber-400 font-medium bg-[#1d1d24]"
                  >
                    <span>Open Typesetting Window...</span>
                    <span className="text-[10px] bg-amber-500/20 px-1 rounded text-amber-300">Open</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: View Mode Toggles */}
      <div className="flex items-center gap-1 shrink-0 bg-[#191920] p-0.5 rounded border border-[#2d2d38]">
        <button
          id="viewmode-split-btn"
          onClick={() => onChangeViewMode('split')}
          title="Split View (Editor + Live Preview)"
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
            viewMode === 'split' 
              ? 'bg-[#353544] text-white shadow-sm' 
              : 'text-[#8e8e99] hover:text-[#d0d0da]'
          }`}
        >
          <Columns2 className="w-3 h-3" />
          <span className="hidden sm:inline">Split</span>
        </button>
        <button
          id="viewmode-editor-btn"
          onClick={() => onChangeViewMode('editor')}
          title="Editor Only"
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
            viewMode === 'editor' 
              ? 'bg-[#353544] text-white shadow-sm' 
              : 'text-[#8e8e99] hover:text-[#d0d0da]'
          }`}
        >
          <FileCode2 className="w-3 h-3" />
          <span className="hidden sm:inline">Code</span>
        </button>
        <button
          id="viewmode-preview-btn"
          onClick={() => onChangeViewMode('preview')}
          title="Markdown Preview Only"
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
            viewMode === 'preview' 
              ? 'bg-[#353544] text-white shadow-sm' 
              : 'text-[#8e8e99] hover:text-[#d0d0da]'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </div>
    </div>
  );
};
