import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronLeft, ChevronRight, Pin, FileText, Check, History, RotateCcw } from 'lucide-react';
import { TabItem } from '../types';

interface TabBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onCloseOthers: (id: string) => void;
  onCloseToRight: (id: string) => void;
  onCloseAll: () => void;
  onDuplicateTab: (id: string) => void;
  onRenameTab: (id: string) => void;
  onTogglePinTab: (id: string) => void;
  onReorderTabs: (sourceIndex: number, destIndex: number) => void;
  recentlyClosedTabs?: TabItem[];
  onReopenClosedTab?: (tabToRestore?: TabItem) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseOthers,
  onCloseToRight,
  onCloseAll,
  onDuplicateTab,
  onRenameTab,
  onTogglePinTab,
  onReorderTabs,
  recentlyClosedTabs = [],
  onReopenClosedTab,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(false);
  const [isRecentlyClosedOpen, setIsRecentlyClosedOpen] = useState(false);
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeTabElRef = useRef<HTMLDivElement | null>(null);
  const quickSwitchRef = useRef<HTMLDivElement>(null);
  const recentlyClosedRef = useRef<HTMLDivElement>(null);

  // Auto scroll active tab into view whenever activeTabId changes
  useEffect(() => {
    if (activeTabElRef.current) {
      activeTabElRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeTabId]);

  // Close context menu on external click
  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Close quick switcher on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (quickSwitchRef.current && !quickSwitchRef.current.contains(e.target as Node)) {
        setIsQuickSwitchOpen(false);
      }
      if (recentlyClosedRef.current && !recentlyClosedRef.current.contains(e.target as Node)) {
        setIsRecentlyClosedOpen(false);
      }
    };
    if (isQuickSwitchOpen || isRecentlyClosedOpen) {
      window.addEventListener('mousedown', handleOutside);
    }
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [isQuickSwitchOpen, isRecentlyClosedOpen]);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: e.clientY,
      tabId,
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTabId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTabId || draggedTabId === targetId) return;

    const sourceIndex = tabs.findIndex((t) => t.id === draggedTabId);
    const targetIndex = tabs.findIndex((t) => t.id === targetId);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      onReorderTabs(sourceIndex, targetIndex);
    }
    setDraggedTabId(null);
  };

  // Convert mouse wheel to horizontal scroll on Windows
  const handleTabsWheel = (e: React.WheelEvent) => {
    if (tabListRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        tabListRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const handleScrollLeft = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="app-tabbar"
      className="h-9 bg-[#18181c] border-b border-[#2b2b32] flex items-center select-none relative z-20 shrink-0"
    >
      {/* Scrollable Tabs Row */}
      <div 
        ref={tabListRef}
        onWheel={handleTabsWheel}
        className="flex-1 flex items-center h-full overflow-x-auto scroll-smooth shrink"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.15) transparent',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              ref={isActive ? activeTabElRef : null}
              draggable
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tab.id)}
              onClick={() => onSelectTab(tab.id)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              onAuxClick={(e) => {
                // Middle-click to close
                if (e.button === 1) {
                  e.preventDefault();
                  onCloseTab(tab.id);
                }
              }}
              title={`${tab.title}${tab.isDirty ? ' (modified)' : ''} — Right-click for options`}
              className={`shrink-0 group relative h-full flex items-center gap-1.5 px-3 min-w-[130px] max-w-[220px] text-xs cursor-pointer border-r border-[#26262e] transition-all
                ${isActive 
                  ? 'bg-[#1e1e24] text-[#f4f4f5] font-medium border-t-2 border-t-amber-500 shadow-inner' 
                  : 'bg-[#18181c] text-[#8e8e99] hover:bg-[#1f1f26] hover:text-[#d4d4dc]'
                }
              `}
            >
              {/* File / Pin Icon */}
              {tab.isPinned ? (
                <Pin className="w-3 h-3 text-amber-400 shrink-0 rotate-45" />
              ) : (
                <FileText className={`w-3 h-3 shrink-0 ${tab.title.endsWith('.md') ? 'text-sky-400' : 'text-[#8e8e99]'}`} />
              )}

              {/* Tab Title */}
              <span className="truncate flex-1 text-[11.5px] tracking-tight">
                {tab.title}
              </span>

              {/* Status / Close Button */}
              <div className="flex items-center justify-center w-4 h-4 shrink-0">
                {tab.isDirty ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:hidden transition-all" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="hidden group-hover:flex w-3.5 h-3.5 rounded items-center justify-center hover:bg-[#3a3a46] text-[#b0b0ba] hover:text-white"
                      title="Close"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center hover:bg-[#3a3a46] text-[#b0b0ba] hover:text-white transition-opacity ${
                      isActive ? 'opacity-80 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Close Tab (Ctrl+W)"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Blank area inside tab row: Click to create new tab */}
        <div
          id="tab-bar-blank-area"
          onClick={onNewTab}
          className="flex-1 h-full min-w-[50px] cursor-pointer"
          title="Click to open a new tab"
        />
      </div>

      {/* Navigation Controls: Scroll Buttons, New Tab (+), and Tab Switcher */}
      <div className="shrink-0 flex items-center h-full bg-[#18181c] border-l border-[#26262e]">
        {/* Scroll Left Button */}
        <button
          onClick={handleScrollLeft}
          title="Scroll Tabs Left"
          className="h-full px-1.5 text-[#7e7e8c] hover:text-white hover:bg-[#24242c] transition-colors flex items-center justify-center"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={handleScrollRight}
          title="Scroll Tabs Right"
          className="h-full px-1.5 text-[#7e7e8c] hover:text-white hover:bg-[#24242c] transition-colors flex items-center justify-center border-r border-[#26262e]"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Plus Button: Add New Tab */}
        <button
          id="new-tab-plus-btn"
          onClick={onNewTab}
          title="New Tab (Ctrl+N)"
          className="h-full px-2 text-[#8e8e99] hover:text-white hover:bg-[#22222b] transition-colors flex items-center justify-center border-r border-[#26262e]"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Recently Closed Notes Dropdown */}
        {onReopenClosedTab && (
          <div className="relative flex items-center h-full border-r border-[#26262e]" ref={recentlyClosedRef}>
            <button
              id="recently-closed-tabs-btn"
              onClick={() => setIsRecentlyClosedOpen(!isRecentlyClosedOpen)}
              title={
                recentlyClosedTabs.length > 0
                  ? `Recently Closed Notes (${recentlyClosedTabs.length}) — Click to restore or press Ctrl+Shift+T`
                  : 'Recently Closed Notes (Empty) — Closed tabs will appear here'
              }
              className={`h-full px-2 flex items-center justify-center transition-colors ${
                isRecentlyClosedOpen
                  ? 'bg-[#2a2a34] text-sky-400'
                  : recentlyClosedTabs.length > 0
                  ? 'text-[#8e8e99] hover:text-sky-400 hover:bg-[#22222b]'
                  : 'text-[#626270] hover:text-[#9090a0] hover:bg-[#202028]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
            </button>

            {isRecentlyClosedOpen && (
              <div 
                className="absolute right-0 top-9 w-72 max-h-80 overflow-y-auto bg-[#23232a] border border-[#3c3c48] rounded-md shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)' }}
              >
                <div className="px-3 py-1.5 text-[10px] text-[#8e8e99] font-medium uppercase tracking-wider border-b border-[#30303a] flex justify-between items-center bg-[#1c1c22]">
                  <span>Recently Closed Notes</span>
                  <span className="text-[10px] text-sky-400">Ctrl+Shift+T</span>
                </div>
                {recentlyClosedTabs.length === 0 ? (
                  <div className="px-4 py-4 text-center text-[#7e7e8c] text-[11px] leading-relaxed">
                    <p>No recently closed notes.</p>
                    <p className="text-[10px] text-[#606070] mt-1">Closed notes will be preserved here for 1-click recovery.</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-[#2a2a34]">
                      {recentlyClosedTabs.map((closedTab) => (
                        <button
                          key={closedTab.id}
                          onClick={() => {
                            onReopenClosedTab(closedTab);
                            setIsRecentlyClosedOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#32323c] text-[#c8c8d0] hover:text-white transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${closedTab.title.endsWith('.md') ? 'text-sky-400' : 'text-[#8e8e99]'}`} />
                            <span className="truncate">{closedTab.title}</span>
                          </div>
                          <span className="text-[10px] text-sky-400 opacity-0 group-hover:opacity-100 shrink-0 font-medium flex items-center gap-1">
                            <RotateCcw className="w-2.5 h-2.5" /> Restore
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-[#30303a] bg-[#1a1a20]">
                      <button
                        onClick={() => {
                          onReopenClosedTab();
                          setIsRecentlyClosedOpen(false);
                        }}
                        className="w-full py-1 rounded text-center text-[11px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-medium transition-colors"
                      >
                        Reopen Last Closed Note (Ctrl+Shift+T)
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Overflow / Quick Switcher Dropdown */}
        <div className="relative flex items-center h-full px-1" ref={quickSwitchRef}>
          <button
            id="quick-tab-switcher-btn"
            onClick={() => setIsQuickSwitchOpen(!isQuickSwitchOpen)}
            title="View All Open Tabs"
            className={`h-7 px-2 flex items-center gap-1 text-xs rounded transition-colors ${
              isQuickSwitchOpen ? 'bg-[#2a2a34] text-white' : 'text-[#8e8e99] hover:text-white hover:bg-[#24242c]'
            }`}
          >
            <span className="text-[11px] font-mono">{tabs.length} tabs</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isQuickSwitchOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {/* High z-index popup menu */}
          {isQuickSwitchOpen && (
            <div 
              className="absolute right-0 top-9 w-64 max-h-80 overflow-y-auto bg-[#23232a] border border-[#3c3c48] rounded-md shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65)',
              }}
            >
              <div className="px-3 py-1.5 text-[10px] text-[#8e8e99] font-medium uppercase tracking-wider border-b border-[#30303a] flex justify-between items-center bg-[#1c1c22]">
                <span>All Open Tabs ({tabs.length})</span>
                <button 
                  onClick={() => {
                    onCloseAll();
                    setIsQuickSwitchOpen(false);
                  }} 
                  className="text-rose-400 hover:underline lowercase text-[10px]"
                >
                  close all
                </button>
              </div>
              <div className="divide-y divide-[#2a2a34]">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsQuickSwitchOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#32323c] transition-colors ${
                      tab.id === activeTabId ? 'bg-[#2b2b36] text-white font-medium' : 'text-[#c8c8d0]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-[10px] text-[#6b6b78] font-mono w-3.5 shrink-0 text-right">{idx + 1}</span>
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${tab.title.endsWith('.md') ? 'text-sky-400' : 'text-[#8e8e99]'}`} />
                      <span className="truncate">{tab.title}</span>
                      {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />}
                      {tab.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400 shrink-0 rotate-45" />}
                    </div>
                    {tab.id === activeTabId && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#23232a] border border-[#3b3b46] rounded-md shadow-2xl py-1 z-50 text-xs text-[#d0d0d8] min-w-[170px]"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onCloseTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440] flex justify-between"
          >
            <span>Close</span>
            <span className="text-[10px] text-[#80808c]">Ctrl+W</span>
          </button>
          {onReopenClosedTab && recentlyClosedTabs.length > 0 && (
            <button
              onClick={() => {
                onReopenClosedTab();
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-1 hover:bg-[#343440] flex justify-between text-sky-400 font-medium"
            >
              <span>Reopen Closed Tab</span>
              <span className="text-[10px] text-[#80808c]">Ctrl+Shift+T</span>
            </button>
          )}
          <button
            onClick={() => {
              onCloseOthers(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440]"
          >
            Close Others
          </button>
          <button
            onClick={() => {
              onCloseToRight(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440]"
          >
            Close to the Right
          </button>
          <div className="h-px bg-[#32323c] my-1" />
          <button
            onClick={() => {
              onRenameTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440]"
          >
            Rename Tab...
          </button>
          <button
            onClick={() => {
              onDuplicateTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440]"
          >
            Duplicate Tab
          </button>
          <button
            onClick={() => {
              onTogglePinTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440]"
          >
            Pin / Unpin Tab
          </button>
          <div className="h-px bg-[#32323c] my-1" />
          <button
            onClick={() => {
              onCloseAll();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#343440] text-rose-400"
          >
            Close All Tabs
          </button>
        </div>
      )}
    </div>
  );
};
