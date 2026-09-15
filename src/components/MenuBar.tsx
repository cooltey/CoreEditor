import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, EditorTheme, SyntaxMode } from '../types';
import { AppLogo } from './AppLogo';

interface MenuBarProps {
  onNewTab: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onPrint: () => void;
  onCloseTab: () => void;
  onOpenCommandPalette: () => void;
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onFormatAction: (type: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  showLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  formattingBarVisible: boolean;
  onToggleFormattingBar: () => void;
  theme: EditorTheme;
  onChangeTheme: (theme: EditorTheme) => void;
  syntax: SyntaxMode;
  onChangeSyntax: (syntax: SyntaxMode) => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
  uiFontSize: number;
  onChangeUiFontSize: (delta: number) => void;
  previewFontSize: number;
  onChangePreviewFontSize: (delta: number) => void;
  onOpenFontSettings: () => void;
  autoSave: boolean;
  onToggleAutoSave: () => void;
  onOpenAbout: () => void;
  onOpenPackageModal: () => void;
  onOpenGrammarModal?: () => void;
  spellCheck?: boolean;
  onToggleSpellCheck?: () => void;
  grammarCheck?: boolean;
  onToggleGrammarCheck?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewTab,
  onOpenFile,
  onSaveFile,
  onExportMarkdown,
  onExportHtml,
  onPrint,
  onCloseTab,
  onOpenCommandPalette,
  onOpenFind,
  onOpenReplace,
  onFormatAction,
  viewMode,
  onChangeViewMode,
  showLineNumbers,
  onToggleLineNumbers,
  showMinimap,
  onToggleMinimap,
  wordWrap,
  onToggleWordWrap,
  formattingBarVisible,
  onToggleFormattingBar,
  theme,
  onChangeTheme,
  syntax,
  onChangeSyntax,
  fontSize,
  onChangeFontSize,
  uiFontSize,
  onChangeUiFontSize,
  previewFontSize,
  onChangePreviewFontSize,
  onOpenFontSettings,
  autoSave,
  onToggleAutoSave,
  onOpenAbout,
  onOpenPackageModal,
  onOpenGrammarModal,
  spellCheck = true,
  onToggleSpellCheck,
  grammarCheck = true,
  onToggleGrammarCheck,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuHover = (menuName: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  const triggerAction = (fn: () => void) => {
    fn();
    setActiveMenu(null);
  };

  return (
    <div 
      id="app-menubar"
      ref={menuBarRef} 
      className="h-6 bg-[#1f1f23] border-b border-[#2d2d34] flex items-center px-1 text-xs text-[#b8b8c2] select-none relative z-30 font-sans shrink-0"
    >
      {/* File Menu */}
      <div className="relative">
        <button
          id="menu-file-btn"
          onClick={() => handleMenuClick('File')}
          onMouseEnter={() => handleMenuHover('File')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'File' ? 'bg-[#33333d] text-white' : ''}`}
        >
          File
        </button>
        {activeMenu === 'File' && (
          <div className="absolute top-6 left-0 min-w-[220px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <button onClick={() => triggerAction(onNewTab)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>New File Tab</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+N</span>
            </button>
            <button onClick={() => triggerAction(onOpenFile)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Open File...</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+O</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(onSaveFile)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Save</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+S</span>
            </button>
            <button onClick={() => triggerAction(onToggleAutoSave)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Auto Save (500ms pause)</span>
              {autoSave && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(onExportMarkdown)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Export as Markdown (.md)</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+Shift+S</span>
            </button>
            <button onClick={() => triggerAction(onExportHtml)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Export as HTML (.html)</span>
            </button>
            <button onClick={() => triggerAction(onPrint)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Print / Save to PDF...</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+P</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(onOpenPackageModal)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center text-sky-400 font-medium">
              <span>Package as Windows (.exe)...</span>
              <span className="text-[10px] bg-sky-500/20 px-1 rounded text-sky-300">.exe</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(onCloseTab)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Close Current Tab</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+W</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <button
          id="menu-edit-btn"
          onClick={() => handleMenuClick('Edit')}
          onMouseEnter={() => handleMenuHover('Edit')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Edit' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Edit
        </button>
        {activeMenu === 'Edit' && (
          <div className="absolute top-6 left-0 min-w-[200px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <button onClick={() => triggerAction(() => onFormatAction('undo'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Undo</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+Z</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('redo'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Redo</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+Y</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(() => onFormatAction('duplicateLine'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Duplicate Current Line</span>
              <span className="text-[10px] text-[#8e8e99]">Shift+Down</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('moveLineUp'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Move Line Up</span>
              <span className="text-[10px] text-[#8e8e99]">Alt+Up</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('moveLineDown'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Move Line Down</span>
              <span className="text-[10px] text-[#8e8e99]">Alt+Down</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(() => onFormatAction('cleanWhitespace'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Trim Trailing Whitespace</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('sortLines'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Sort Selected Lines (A-Z)</span>
            </button>
          </div>
        )}
      </div>

      {/* Find Menu */}
      <div className="relative">
        <button
          id="menu-find-btn"
          onClick={() => handleMenuClick('Find')}
          onMouseEnter={() => handleMenuHover('Find')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Find' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Find
        </button>
        {activeMenu === 'Find' && (
          <div className="absolute top-6 left-0 min-w-[200px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <button onClick={() => triggerAction(onOpenFind)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Find...</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+F</span>
            </button>
            <button onClick={() => triggerAction(onOpenReplace)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Replace...</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+H</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(onOpenCommandPalette)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Command Palette...</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <button
          id="menu-view-btn"
          onClick={() => handleMenuClick('View')}
          onMouseEnter={() => handleMenuHover('View')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'View' ? 'bg-[#33333d] text-white' : ''}`}
        >
          View
        </button>
        {activeMenu === 'View' && (
          <div className="absolute top-6 left-0 min-w-[250px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Layout Modes</div>
            <button 
              onClick={() => triggerAction(() => onChangeViewMode('split'))} 
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
            >
              <span>Split View (Editor + Live Preview)</span>
              {viewMode === 'split' && <span className="text-sky-400">✓</span>}
            </button>
            <button 
              onClick={() => triggerAction(() => onChangeViewMode('editor'))} 
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
            >
              <span>Editor Only</span>
              {viewMode === 'editor' && <span className="text-sky-400">✓</span>}
            </button>
            <button 
              onClick={() => triggerAction(() => onChangeViewMode('preview'))} 
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
            >
              <span>Markdown Preview Only</span>
              {viewMode === 'preview' && <span className="text-sky-400">✓</span>}
            </button>
            
            <div className="h-px bg-[#383842] my-1" />
            
            <button onClick={() => triggerAction(onToggleFormattingBar)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Show Formatting Toolbar</span>
              {formattingBarVisible && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(onToggleMinimap)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Show Code Minimap</span>
              {showMinimap && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(onToggleLineNumbers)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Show Line Numbers</span>
              {showLineNumbers && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(onToggleWordWrap)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Toggle Word Wrap</span>
              {wordWrap && <span className="text-sky-400">✓</span>}
            </button>
            
            <div className="h-px bg-[#383842] my-1" />
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Font Sizes</div>
            
            <button 
              onClick={() => triggerAction(onOpenFontSettings)}
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center text-sky-400 font-medium"
            >
              <span>Font Size Settings...</span>
              <span className="text-[10px] bg-sky-500/20 px-1 rounded text-sky-300">Aa</span>
            </button>

            {/* Quick adjustments in View menu */}
            <div className="flex justify-between items-center px-3 py-1 text-xs">
              <span>Editor Font ({fontSize}px)</span>
              <div className="flex gap-1">
                <button onClick={() => onChangeFontSize(-1)} className="px-1.5 py-0.5 bg-[#33333d] hover:bg-[#40404c] rounded text-white">-</button>
                <button onClick={() => onChangeFontSize(1)} className="px-1.5 py-0.5 bg-[#33333d] hover:bg-[#40404c] rounded text-white">+</button>
              </div>
            </div>

            <div className="flex justify-between items-center px-3 py-1 text-xs">
              <span>UI Font ({uiFontSize}px)</span>
              <div className="flex gap-1">
                <button onClick={() => onChangeUiFontSize(-1)} className="px-1.5 py-0.5 bg-[#33333d] hover:bg-[#40404c] rounded text-white">-</button>
                <button onClick={() => onChangeUiFontSize(1)} className="px-1.5 py-0.5 bg-[#33333d] hover:bg-[#40404c] rounded text-white">+</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Format Menu */}
      <div className="relative">
        <button
          id="menu-format-btn"
          onClick={() => handleMenuClick('Format')}
          onMouseEnter={() => handleMenuHover('Format')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Format' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Format
        </button>
        {activeMenu === 'Format' && (
          <div className="absolute top-6 left-0 min-w-[220px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <button onClick={() => triggerAction(() => onFormatAction('bold'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Bold</span>
              <span className="text-[10px] text-[#8e8e99]">**text**</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('italic'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Italic</span>
              <span className="text-[10px] text-[#8e8e99]">*text*</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('strike'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Strikethrough</span>
              <span className="text-[10px] text-[#8e8e99]">~~text~~</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('code'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Inline Code</span>
              <span className="text-[10px] text-[#8e8e99]">`code`</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(() => onFormatAction('bulletList'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Bullet List</span>
              <span className="text-[10px] text-[#8e8e99]">-</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('numberedList'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Numbered List</span>
              <span className="text-[10px] text-[#8e8e99]">1.</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('checklist'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Task Checklist</span>
              <span className="text-[10px] text-[#8e8e99]">- [ ]</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('tableModal'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Insert Markdown Table...</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(() => onFormatAction('uppercase'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Transform: UPPERCASE</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('lowercase'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Transform: lowercase</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('titlecase'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Transform: Title Case</span>
            </button>
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <button
          id="menu-tools-btn"
          onClick={() => handleMenuClick('Tools')}
          onMouseEnter={() => handleMenuHover('Tools')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Tools' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Tools
        </button>
        {activeMenu === 'Tools' && (
          <div className="absolute top-6 left-0 min-w-[240px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Grammar & Spelling</div>
            {onOpenGrammarModal && (
              <button
                onClick={() => triggerAction(onOpenGrammarModal)}
                className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center text-sky-400 font-medium"
              >
                <span>English Grammar & Spell Check...</span>
                <span className="text-[10px] bg-sky-500/20 px-1.5 py-0.5 rounded text-sky-300">Offline</span>
              </button>
            )}
            {onToggleSpellCheck && (
              <button
                onClick={() => triggerAction(onToggleSpellCheck)}
                className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
              >
                <span>Browser Native Spell Check</span>
                {spellCheck && <span className="text-sky-400">✓</span>}
              </button>
            )}
            {onToggleGrammarCheck && (
              <button
                onClick={() => triggerAction(onToggleGrammarCheck)}
                className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
              >
                <span>Grammar & Style Hints</span>
                {grammarCheck && <span className="text-sky-400">✓</span>}
              </button>
            )}
            <div className="h-px bg-[#383842] my-1" />
            <button
              onClick={() => triggerAction(onOpenFontSettings)}
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
            >
              <span>Font Size Settings...</span>
            </button>
          </div>
        )}
      </div>

      {/* Preferences Menu */}
      <div className="relative">
        <button
          id="menu-preferences-btn"
          onClick={() => handleMenuClick('Preferences')}
          onMouseEnter={() => handleMenuHover('Preferences')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Preferences' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Preferences
        </button>
        {activeMenu === 'Preferences' && (
          <div className="absolute top-6 left-0 min-w-[240px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Typography</div>
            <button 
              onClick={() => triggerAction(onOpenFontSettings)}
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center text-amber-400 font-medium"
            >
              <span>Font Size Settings...</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
                {fontSize} / {uiFontSize}px
              </span>
            </button>

            <div className="h-px bg-[#383842] my-1" />
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Color Scheme</div>
            <button onClick={() => triggerAction(() => onChangeTheme('sublime-dark'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Sublime Monokai Dark</span>
              {theme === 'sublime-dark' && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(() => onChangeTheme('one-dark'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>One Dark Pro</span>
              {theme === 'one-dark' && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(() => onChangeTheme('windows-dark'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Windows 11 Dark</span>
              {theme === 'windows-dark' && <span className="text-sky-400">✓</span>}
            </button>
            <button onClick={() => triggerAction(() => onChangeTheme('fluent-light'))} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Windows Fluent Light</span>
              {theme === 'fluent-light' && <span className="text-sky-400">✓</span>}
            </button>
            
            <div className="h-px bg-[#383842] my-1" />
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Syntax Mode</div>
            {(['Markdown', 'Plain Text', 'JavaScript', 'HTML', 'CSS', 'JSON', 'Python'] as SyntaxMode[]).map((s) => (
              <button
                key={s}
                onClick={() => triggerAction(() => onChangeSyntax(s))}
                className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
              >
                <span>{s}</span>
                {syntax === s && <span className="text-sky-400">✓</span>}
              </button>
            ))}
            
            <div className="h-px bg-[#383842] my-1" />
            <div className="px-3 py-1 text-[10px] font-semibold text-[#888894] uppercase tracking-wider">Save Options</div>
            <button
              onClick={() => triggerAction(onToggleAutoSave)}
              className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center"
            >
              <span>Auto Save on Pause (500ms)</span>
              {autoSave && <span className="text-sky-400">✓</span>}
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <button
          id="menu-help-btn"
          onClick={() => handleMenuClick('Help')}
          onMouseEnter={() => handleMenuHover('Help')}
          className={`px-2 py-0.5 rounded hover:bg-[#33333d] hover:text-white transition-colors ${activeMenu === 'Help' ? 'bg-[#33333d] text-white' : ''}`}
        >
          Help
        </button>
        {activeMenu === 'Help' && (
          <div className="absolute top-6 left-0 min-w-[210px] bg-[#25252b] border border-[#3b3b44] rounded shadow-2xl py-1 z-50 text-[#d4d4dc]">
            <button onClick={() => triggerAction(onOpenCommandPalette)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center">
              <span>Command Palette</span>
              <span className="text-[10px] text-[#8e8e99]">Ctrl+P</span>
            </button>
            <button onClick={() => triggerAction(onOpenFontSettings)} className="w-full text-left px-3 py-1 hover:bg-[#383842]">
              <span>Font Size Settings...</span>
            </button>
            <button onClick={() => triggerAction(() => onFormatAction('insertMarkdownCheatsheet'))} className="w-full text-left px-3 py-1 hover:bg-[#383842]">
              <span>Insert Markdown Cheat Sheet</span>
            </button>
            <button onClick={() => triggerAction(onOpenPackageModal)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex justify-between items-center text-sky-400">
              <span>Windows .exe Packaging Guide...</span>
              <span className="text-[10px] bg-sky-500/20 px-1 rounded text-sky-300">.exe</span>
            </button>
            <div className="h-px bg-[#383842] my-1" />
            <button onClick={() => triggerAction(onOpenAbout)} className="w-full text-left px-3 py-1 hover:bg-[#383842] flex items-center justify-between">
              <span>About CoreEditor...</span>
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                <AppLogo className="w-full h-full" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
