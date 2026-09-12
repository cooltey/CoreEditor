import React, { useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Copy, Check, BookOpen, Clock, FileText } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  onUpdateContent?: (newContent: string) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  theme: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  onUpdateContent,
  scrollRef,
  onScroll,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = React.useState<number | null>(null);

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    const lines = content.split('\n').length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, lines, readingTimeMinutes };
  }, [content]);

  // Convert markdown to sanitized HTML
  const sanitizedHtml = useMemo(() => {
    try {
      const rawHtml = marked.parse(content) as string;
      return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['target', 'id', 'checked', 'type'],
      });
    } catch (err) {
      console.error('Markdown parse error:', err);
      return '<p class="text-rose-400">Error rendering Markdown preview.</p>';
    }
  }, [content]);

  // Handle interactive checkboxes in preview
  const handleCheckboxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox' && onUpdateContent) {
      // Find which checkbox was clicked
      const checkboxes = containerRef.current?.querySelectorAll('input[type="checkbox"]');
      if (!checkboxes) return;

      let index = -1;
      checkboxes.forEach((cb, idx) => {
        if (cb === target) index = idx;
      });

      if (index !== -1) {
        // Find the n-th "- [ ]" or "- [x]" in markdown and toggle it
        let count = 0;
        const newContent = content.replace(/- \[( |x|X)\]/g, (match) => {
          if (count === index) {
            count++;
            return match.includes('x') || match.includes('X') ? '- [ ]' : '- [x]';
          }
          count++;
          return match;
        });

        onUpdateContent(newContent);
      }
    }
  };

  const isLight = theme === 'fluent-light';

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (scrollRef) {
          (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      onScroll={onScroll}
      id="markdown-live-preview-container"
      className={`h-full overflow-y-auto px-6 py-6 transition-colors select-text ${
        isLight
          ? 'bg-[#ffffff] text-[#24292f] border-l border-[#e1e4e8]'
          : 'bg-[#1b1b22] text-[#e6edf3] border-l border-[#282833]'
      }`}
    >
      {/* Document Quick Stats Header */}
      <div 
        id="preview-stats-bar"
        className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b text-xs ${
          isLight ? 'border-[#e1e4e8] text-[#57606a]' : 'border-[#2d2d3a] text-[#8b949e]'
        }`}
      >
        <div className="flex items-center gap-1.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Markdown Live Preview</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-[#7d8590]" />
            {stats.words} words
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#7d8590]" />
            ~{stats.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Rendered Markdown Output */}
      <div
        id="rendered-markdown-body"
        onClick={handleCheckboxClick}
        className={`markdown-body ${isLight ? 'light-markdown' : 'dark-markdown'}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};
