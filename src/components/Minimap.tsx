import React, { useMemo, useRef } from 'react';

interface MinimapProps {
  content: string;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  onMinimapScroll: (targetRatio: number) => void;
  theme: string;
}

export const Minimap: React.FC<MinimapProps> = ({
  content,
  scrollTop,
  scrollHeight,
  clientHeight,
  onMinimapScroll,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate lightweight line abstraction for the minimap
  const lines = useMemo(() => {
    return content.split('\n').slice(0, 350); // Cap at 350 lines for rendering efficiency
  }, [content]);

  // Calculate viewport slider position
  const viewportRatio = scrollHeight > 0 ? clientHeight / scrollHeight : 1;
  const sliderHeightPercent = Math.max(8, Math.min(100, viewportRatio * 100));
  const sliderTopPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = clickY / rect.height;
    onMinimapScroll(Math.max(0, Math.min(1, ratio)));
  };

  const isLight = theme === 'fluent-light';

  return (
    <div
      ref={containerRef}
      id="editor-minimap"
      onClick={handleClick}
      className={`w-16 sm:w-20 md:w-24 shrink-0 h-full select-none cursor-pointer overflow-hidden relative border-l ${
        isLight ? 'bg-[#f7f7f9] border-[#e2e2e8]' : 'bg-[#18181c] border-[#25252e]'
      }`}
      title="Minimap — Click to jump"
    >
      {/* Visual representation of code lines */}
      <div className="p-1 space-y-[2.5px] pointer-events-none opacity-60">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-[2px]" />;
          }

          // Indentation simulation
          const leadingSpaces = line.search(/\S|$/);
          const indentWidth = Math.min(leadingSpaces * 2.5, 20);

          // Different colors for Markdown headings, comments, lists, or code
          let barColor = isLight ? 'bg-neutral-400' : 'bg-neutral-600';
          let height = 'h-[2px]';

          if (trimmed.startsWith('#')) {
            barColor = isLight ? 'bg-sky-600 font-bold' : 'bg-sky-400';
            height = 'h-[3px]';
          } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('<!--')) {
            barColor = isLight ? 'bg-emerald-600' : 'bg-emerald-500';
          } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.match(/^\d+\./)) {
            barColor = isLight ? 'bg-amber-600' : 'bg-amber-400';
          } else if (trimmed.startsWith('```')) {
            barColor = isLight ? 'bg-purple-600' : 'bg-purple-400';
          }

          const widthPercent = Math.min(100, Math.max(15, trimmed.length * 2.5));

          return (
            <div key={idx} className="flex items-center" style={{ paddingLeft: `${indentWidth}px` }}>
              <div
                className={`${height} ${barColor} rounded-xs`}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Viewport Slider Overlay */}
      <div
        className={`absolute left-0 right-0 pointer-events-none border transition-all duration-75 ${
          isLight
            ? 'bg-blue-500/15 border-blue-400/40 shadow-sm'
            : 'bg-white/10 border-white/20 shadow'
        }`}
        style={{
          top: `${sliderTopPercent}%`,
          height: `${sliderHeightPercent}%`,
        }}
      />
    </div>
  );
};
