import React, { useRef, useEffect, useState, useMemo } from 'react';
import { EditorSettings, CursorPosition, GrammarIssue } from '../types';
import { Minimap } from './Minimap';
import { Check, Sparkles, Code, Bold, Copy, Scissors, Clipboard, SpellCheck, ListFilter } from 'lucide-react';

interface EditorProps {
  content: string;
  onChangeContent: (value: string) => void;
  settings: EditorSettings;
  onCursorChange: (pos: CursorPosition) => void;
  scrollRef?: React.RefObject<HTMLTextAreaElement | null>;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  grammarIssues?: GrammarIssue[];
  onApplyGrammarFix?: (issue: GrammarIssue, replacement: string) => void;
  onOpenGrammarModal?: () => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetIssue: GrammarIssue | null;
  nearbyIssues: GrammarIssue[];
  selectedText: string;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChangeContent,
  settings,
  onCursorChange,
  scrollRef,
  onScroll,
  textareaRef,
  grammarIssues = [],
  onApplyGrammarFix,
  onOpenGrammarModal,
}) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  const [activeLine, setActiveLine] = useState(1);

  // Split lines for line numbers
  const lines = useMemo(() => {
    return content.split('\n');
  }, [content]);

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
      }
    };
    if (contextMenu?.visible) {
      window.addEventListener('mousedown', handleGlobalMouseDown);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu?.visible]);

  // Update cursor position and active line
  const handleSelectOrKeyUp = () => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    
    // Calculate line and col
    const textBeforeCursor = value.slice(0, selectionStart);
    const lineCount = textBeforeCursor.split('\n').length;
    const lastLineStart = textBeforeCursor.lastIndexOf('\n');
    const colCount = selectionStart - lastLineStart;
    const selectionLength = selectionEnd - selectionStart;

    setActiveLine(lineCount);
    onCursorChange({
      line: lineCount,
      col: colCount,
      selectionLength,
    });
  };

  // Helper to wrap selected text in symbols
  const wrapSelectedText = (openChar: string, closeChar: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.substring(selectionStart, selectionEnd);
    const nextVal = value.substring(0, selectionStart) + openChar + selected + closeChar + value.substring(selectionEnd);
    onChangeContent(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = selectionStart + openChar.length;
      textarea.selectionEnd = selectionEnd + openChar.length;
    }, 0);
  };

  // Handle Tab key, Auto-surround selected text, and Auto-closing quotes/brackets
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;

    // Handle Tab key (indent or outdent)
    if (e.key === 'Tab') {
      e.preventDefault();
      const indentStr = settings.insertSpaces ? ' '.repeat(settings.tabSize) : '\t';

      if (selectionStart === selectionEnd) {
        // Simple insert
        const nextVal = value.substring(0, selectionStart) + indentStr + value.substring(selectionEnd);
        onChangeContent(nextVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + indentStr.length;
        }, 0);
      } else {
        // Multi-line indent/outdent
        const startLine = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const endLine = value.indexOf('\n', selectionEnd);
        const actualEndLine = endLine === -1 ? value.length : endLine;
        const selectedBlock = value.substring(startLine, actualEndLine);
        const blockLines = selectedBlock.split('\n');

        let modifiedBlock = '';
        if (e.shiftKey) {
          // Outdent
          modifiedBlock = blockLines
            .map((line) => {
              if (line.startsWith(indentStr)) return line.substring(indentStr.length);
              if (line.startsWith(' ')) return line.replace(/^ +/, '');
              return line;
            })
            .join('\n');
        } else {
          // Indent
          modifiedBlock = blockLines.map((line) => indentStr + line).join('\n');
        }

        const nextVal = value.substring(0, startLine) + modifiedBlock + value.substring(actualEndLine);
        onChangeContent(nextVal);
        setTimeout(() => {
          textarea.selectionStart = startLine;
          textarea.selectionEnd = startLine + modifiedBlock.length;
        }, 0);
      }
      return;
    }

    // 1. AUTO-SURROUND / WRAP SELECTED TEXT WITH SYMBOLS:
    // When text IS selected, typing `, *, ", ', (, [, {, ~, _, <, $ wraps the selected text
    const wrapPairs: Record<string, [string, string]> = {
      '`': ['`', '`'],
      '"': ['"', '"'],
      "'": ["'", "'"],
      '(': ['(', ')'],
      '[': ['[', ']'],
      '{': ['{', '}'],
      '*': ['*', '*'],
      '_': ['_', '_'],
      '~': ['~', '~'],
      '<': ['<', '>'],
      '$': ['$', '$'],
    };

    if (selectionStart !== selectionEnd && wrapPairs[e.key]) {
      e.preventDefault();
      const [openChar, closeChar] = wrapPairs[e.key];
      const selectedText = value.substring(selectionStart, selectionEnd);
      const nextVal = value.substring(0, selectionStart) + openChar + selectedText + closeChar + value.substring(selectionEnd);
      onChangeContent(nextVal);
      setTimeout(() => {
        // Keep the inner text selected so user can see it or chain formatting
        textarea.selectionStart = selectionStart + openChar.length;
        textarea.selectionEnd = selectionEnd + openChar.length;
      }, 0);
      return;
    }

    // 2. AUTO-CLOSING BRACKETS WHEN NO TEXT IS SELECTED:
    // Notice: ` is deliberately excluded here so typing ` inserts a single ` smoothly without forcing ``
    const autoCloseEmpty: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
    };

    if (autoCloseEmpty[e.key] && selectionStart === selectionEnd) {
      e.preventDefault();
      const closeChar = autoCloseEmpty[e.key];
      const nextVal = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      onChangeContent(nextVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }
  };

  // Right-click context menu with grammar & spelling suggestions
  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);

    // Locate target grammar issue at click / cursor position
    let targetIssue: GrammarIssue | null = null;
    const nearby: GrammarIssue[] = [];

    if (grammarIssues.length > 0) {
      // Check for direct overlap with cursor or selection
      for (const issue of grammarIssues) {
        const issueEnd = issue.index + issue.length;
        if (selectionStart !== selectionEnd) {
          if (selectionStart < issueEnd && selectionEnd > issue.index) {
            if (!targetIssue) targetIssue = issue;
            else nearby.push(issue);
          }
        } else {
          if (selectionStart >= issue.index && selectionStart <= issueEnd) {
            targetIssue = issue;
            break;
          } else if (Math.abs(selectionStart - issue.index) <= 3 || Math.abs(selectionStart - issueEnd) <= 3) {
            if (!targetIssue) targetIssue = issue;
            else nearby.push(issue);
          }
        }
      }

      // If no direct hit, check if an issue is on the current line
      if (!targetIssue) {
        const textBefore = value.substring(0, selectionStart);
        const currentLine = textBefore.split('\n').length;
        const lineIssues = grammarIssues.filter((iss) => iss.line === currentLine);
        if (lineIssues.length > 0) {
          targetIssue = lineIssues[0];
          nearby.push(...lineIssues.slice(1));
        }
      }
    }

    // Keep context menu within viewport
    const menuWidth = 260;
    const menuHeight = 320;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

    setContextMenu({
      visible: true,
      x: Math.max(10, x),
      y: Math.max(10, y),
      targetIssue,
      nearbyIssues: nearby,
      selectedText,
    });
  };

  // Scroll sync between textarea, line numbers, and minimap
  const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = target.scrollTop;
    }
    setScrollInfo({
      scrollTop: target.scrollTop,
      scrollHeight: target.scrollHeight,
      clientHeight: target.clientHeight,
    });
    if (contextMenu?.visible) {
      setContextMenu(null);
    }
    if (onScroll) {
      onScroll(e);
    }
  };

  // Minimap click to jump
  const handleMinimapScroll = (targetRatio: number) => {
    if (!textareaRef.current) return;
    const targetScroll = targetRatio * textareaRef.current.scrollHeight;
    textareaRef.current.scrollTop = targetScroll;
  };

  const isLight = settings.theme === 'fluent-light';

  return (
    <div 
      id="sublime-editor-panel"
      className={`h-full w-full flex overflow-hidden relative ${
        isLight ? 'bg-[#ffffff] text-[#1e1e1e]' : 'bg-[#1e1e24] text-[#d4d4dc]'
      }`}
    >
      {/* Line Numbers Gutter */}
      {settings.showLineNumbers && (
        <div
          ref={lineNumbersRef}
          id="editor-line-numbers"
          className={`shrink-0 select-none text-right font-mono py-4 px-2 overflow-hidden border-r transition-colors ${
            isLight
              ? 'bg-[#f3f3f5] border-[#e1e4e8] text-[#8c959f]'
              : 'bg-[#18181e] border-[#292934] text-[#5c5c6b]'
          }`}
          style={{ 
            width: `${Math.max(42, String(lines.length).length * 10 + 20)}px`,
            fontSize: `${Math.max(11, Math.round(settings.fontSize * 0.85))}px`,
          }}
        >
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isCurrent = lineNum === activeLine;
            return (
              <div
                key={idx}
                style={{ height: `${settings.fontSize * 1.55}px`, lineHeight: `${settings.fontSize * 1.55}px` }}
                className={`transition-colors ${
                  isCurrent 
                    ? isLight ? 'text-blue-600 font-bold' : 'text-amber-400 font-semibold' 
                    : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Textarea Editor */}
      <div className="flex-1 relative h-full overflow-hidden">
        <textarea
          ref={(el) => {
            (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            if (scrollRef) {
              (scrollRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            }
          }}
          id="editor-main-textarea"
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleSelectOrKeyUp}
          onClick={handleSelectOrKeyUp}
          onContextMenu={handleContextMenu}
          onScroll={handleTextareaScroll}
          spellCheck={settings.spellCheck ?? true}
          lang="en-US"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Start typing your text or Markdown here..."
          className={`editor-textarea w-full h-full p-4 bg-transparent outline-none resize-none border-none ${
            settings.wordWrap ? 'wrap-text' : ''
          }`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: `${settings.fontSize * 1.55}px`,
            tabSize: settings.tabSize,
          }}
        />
      </div>

      {/* Sublime Text Style Minimap */}
      {settings.showMinimap && (
        <Minimap
          content={content}
          scrollTop={scrollInfo.scrollTop}
          scrollHeight={scrollInfo.scrollHeight}
          clientHeight={scrollInfo.clientHeight}
          onMinimapScroll={handleMinimapScroll}
          theme={settings.theme}
        />
      )}

      {/* Custom Right-Click Context Menu for Grammar & Formatting */}
      {contextMenu?.visible && (
        <div
          ref={contextMenuRef}
          id="editor-grammar-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 min-w-[240px] max-w-[320px] bg-[#22222a] border border-[#3c3c4a] rounded-lg shadow-2xl overflow-hidden text-xs text-[#d0d0dc] animate-in fade-in zoom-in-95 duration-100 font-sans select-none"
        >
          {/* 1. If right-clicked on an issue: Show Grammar Suggestions */}
          {contextMenu.targetIssue ? (
            <div>
              <div className="px-3 py-2 bg-amber-500/10 border-b border-[#3c3c4a]">
                <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{contextMenu.targetIssue.category === 'spelling' ? 'Spelling Suggestion' : 'Grammar Hint'}</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 border border-amber-500/30 truncate max-w-[100px]">
                    "{contextMenu.targetIssue.matchedText}"
                  </span>
                </div>
                <div className="text-[10.5px] text-[#a8a8b8] mt-1 leading-snug">
                  {contextMenu.targetIssue.message}
                </div>
              </div>

              {/* Replacements */}
              <div className="py-1">
                {contextMenu.targetIssue.replacements.map((rep) => (
                  <button
                    key={rep}
                    onClick={() => {
                      if (onApplyGrammarFix && contextMenu.targetIssue) {
                        onApplyGrammarFix(contextMenu.targetIssue, rep);
                      }
                      setContextMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-emerald-600/20 text-emerald-300 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white">"{rep}"</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 group-hover:text-emerald-300">Apply</span>
                  </button>
                ))}
              </div>

              {/* Additional nearby issues on the same line */}
              {contextMenu.nearbyIssues.length > 0 && (
                <div className="border-t border-[#33333d] py-1 bg-[#1c1c24]">
                  <div className="px-3 py-0.5 text-[10px] font-semibold text-[#808090] uppercase tracking-wider">
                    Also on this line
                  </div>
                  {contextMenu.nearbyIssues.slice(0, 2).map((other) => (
                    <button
                      key={other.id}
                      onClick={() => {
                        if (onApplyGrammarFix && other.replacements.length > 0) {
                          onApplyGrammarFix(other, other.replacements[0]);
                        }
                        setContextMenu(null);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-[#282834] flex items-center justify-between text-[11px]"
                    >
                      <span className="text-amber-300 truncate max-w-[140px]">
                        "{other.matchedText}" &rarr; "{other.replacements[0]}"
                      </span>
                      <span className="text-emerald-400 text-[10px]">Fix</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="h-px bg-[#33333d]" />
            </div>
          ) : (
            /* When no grammar issue under cursor, show status summary */
            <div className="p-1 border-b border-[#33333d]">
              {grammarIssues.length > 0 ? (
                <button
                  onClick={() => {
                    if (onOpenGrammarModal) onOpenGrammarModal();
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#33333d] text-sky-400 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <SpellCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Grammar: {grammarIssues.length} hint(s) in document</span>
                  </div>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 rounded">Review</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (onOpenGrammarModal) onOpenGrammarModal();
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#282834] text-[#a0a0b0] flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Grammar & Spelling: Clean</span>
                  </div>
                  <span className="text-[10px] text-[#707080]">Check</span>
                </button>
              )}
            </div>
          )}

          {/* 2. Format Selected Text Options */}
          {contextMenu.selectedText && (
            <div className="py-1 border-b border-[#33333d]">
              <div className="px-3 py-0.5 text-[10px] font-semibold text-[#808090] uppercase tracking-wider">
                Wrap Selection
              </div>
              <button
                onClick={() => {
                  wrapSelectedText('`', '`');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center gap-2"
              >
                <Code className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Wrap in Code (<code className="text-amber-300 bg-[#16161c] px-1 rounded">`{contextMenu.selectedText.length > 10 ? contextMenu.selectedText.slice(0, 8) + '...' : contextMenu.selectedText}`</code>)</span>
              </button>
              <button
                onClick={() => {
                  wrapSelectedText('**', '**');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center gap-2"
              >
                <Bold className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Wrap in Bold (<strong>**...**</strong>)</span>
              </button>
              <button
                onClick={() => {
                  wrapSelectedText('"', '"');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center gap-2"
              >
                <span className="text-emerald-400 font-bold shrink-0">" "</span>
                <span>Wrap in Quotes ("...")</span>
              </button>
            </div>
          )}

          {/* 3. Standard Edit & Clipboard Actions */}
          <div className="py-1">
            {contextMenu.selectedText && (
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.selectedText);
                    const textarea = textareaRef.current;
                    if (textarea) {
                      const { selectionStart, selectionEnd, value } = textarea;
                      const nextVal = value.substring(0, selectionStart) + value.substring(selectionEnd);
                      onChangeContent(nextVal);
                    }
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-[#a0a0b0]" />
                    <span>Cut</span>
                  </span>
                  <span className="text-[10px] text-[#707080]">Ctrl+X</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contextMenu.selectedText);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-[#a0a0b0]" />
                    <span>Copy</span>
                  </span>
                  <span className="text-[10px] text-[#707080]">Ctrl+C</span>
                </button>
              </>
            )}
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  const textarea = textareaRef.current;
                  if (textarea) {
                    const { selectionStart, selectionEnd, value } = textarea;
                    const nextVal = value.substring(0, selectionStart) + text + value.substring(selectionEnd);
                    onChangeContent(nextVal);
                    setTimeout(() => {
                      textarea.focus();
                      textarea.selectionStart = textarea.selectionEnd = selectionStart + text.length;
                    }, 0);
                  }
                } catch {
                  // clipboard read blocked by browser permissions
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Clipboard className="w-3.5 h-3.5 text-[#a0a0b0]" />
                <span>Paste</span>
              </span>
              <span className="text-[10px] text-[#707080]">Ctrl+V</span>
            </button>
            <button
              onClick={() => {
                if (textareaRef.current) {
                  textareaRef.current.select();
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#33333d] flex items-center justify-between"
            >
              <span>Select All</span>
              <span className="text-[10px] text-[#707080]">Ctrl+A</span>
            </button>
          </div>

          {/* 4. Open full grammar checker footer */}
          {onOpenGrammarModal && (
            <div className="border-t border-[#33333d] p-1 bg-[#1a1a20]">
              <button
                onClick={() => {
                  onOpenGrammarModal();
                  setContextMenu(null);
                }}
                className="w-full text-left px-2.5 py-1 rounded hover:bg-[#282832] text-sky-400 flex items-center justify-between text-[11px]"
              >
                <span className="flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Grammar & Spell Settings...</span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

