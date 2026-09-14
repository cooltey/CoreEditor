import React, { useRef, useEffect, useState, useMemo } from 'react';
import { EditorSettings, CursorPosition } from '../types';
import { Minimap } from './Minimap';

interface EditorProps {
  content: string;
  onChangeContent: (value: string) => void;
  settings: EditorSettings;
  onCursorChange: (pos: CursorPosition) => void;
  scrollRef?: React.RefObject<HTMLTextAreaElement | null>;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChangeContent,
  settings,
  onCursorChange,
  scrollRef,
  onScroll,
  textareaRef,
}) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
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

  // Handle Tab key and Auto-closing quotes/brackets
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

    // Auto-pairing brackets and quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '`': '`',
      '"': '"',
      '*': '*',
    };

    if (pairs[e.key] && selectionStart === selectionEnd) {
      // If user typed opening char, insert both and place cursor in middle
      e.preventDefault();
      const closeChar = pairs[e.key];
      const nextVal = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      onChangeContent(nextVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
      return;
    }
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
          onScroll={handleTextareaScroll}
          spellCheck={false}
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
    </div>
  );
};
