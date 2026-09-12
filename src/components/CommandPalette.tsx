import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, FileText, Terminal, ArrowRight } from 'lucide-react';
import { CommandItem, TabItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  tabs,
  activeTabId,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Combined list of Tabs and Commands matching query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Matching tabs
    const matchedTabs = tabs
      .filter((tab) => !q || tab.title.toLowerCase().includes(q))
      .map((tab) => ({
        type: 'tab' as const,
        id: tab.id,
        title: tab.title,
        subtitle: `Open Tab ${tab.isDirty ? '• unsaved' : ''}`,
        shortcut: tab.id === activeTabId ? 'Active' : undefined,
        action: () => onSelectTab(tab.id),
      }));

    // Matching commands
    const matchedCommands = commands
      .filter((cmd) => {
        if (!q) return true;
        const inTitle = cmd.title.toLowerCase().includes(q);
        const inCategory = cmd.category.toLowerCase().includes(q);
        const inKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
        return inTitle || inCategory || inKeywords;
      })
      .map((cmd) => ({
        type: 'command' as const,
        id: cmd.id,
        title: cmd.title,
        subtitle: cmd.category,
        shortcut: cmd.shortcut,
        action: cmd.action,
      }));

    return [...matchedTabs, ...matchedCommands];
  }, [query, tabs, activeTabId, commands, onSelectTab]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) {
        item.action();
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#212128] border border-[#383846] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#30303c] bg-[#1a1a20]">
          <Search className="w-4 h-4 text-[#808090] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or file name (e.g. Markdown, Split, Table)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-[#f0f0f5] placeholder-[#606070] outline-none font-mono"
          />
          <span className="text-[10px] text-[#707080] border border-[#383848] rounded px-1.5 py-0.5">
            ESC to exit
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1 text-xs">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-[#707080]">
              No matching tabs or commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-600/20 text-white border-l-2 border-sky-400'
                      : 'text-[#c0c0cc] hover:bg-[#282832]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.type === 'tab' ? (
                      <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : (
                      <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className="font-medium truncate">{item.title}</span>
                    <span className="text-[10px] text-[#707080] truncate">
                      {item.subtitle}
                    </span>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-[#808090] bg-[#1a1a22] border border-[#323240] px-1.5 py-0.5 rounded ml-2 shrink-0">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-1.5 bg-[#1a1a20] border-t border-[#30303c] text-[10px] text-[#707080] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>SublimeMark Quick Open</span>
        </div>
      </div>
    </div>
  );
};
