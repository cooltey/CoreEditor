import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, Pin, FileText, Check } from 'lucide-react';
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
}) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const [isQuickSwitchOpen, setIsQuickSwitchOpen] = useState(false);
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const quickSwitchRef = useRef<HTMLDivElement>(null);

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
    };
    if (isQuickSwitchOpen) {
      window.addEventListener('mousedown', handleOutside);
    }
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [isQuickSwitchOpen]);

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

    const sourceIndex = tabs.findIndex(t => t.id === draggedTabId);
    const targetIndex = tabs.findIndex(t => t.id === targetId);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      onReorderTabs(sourceIndex, targetIndex);
    }
    setDraggedTabId(null);
  };

  return (
    <div 
      id="app-tabbar"
      className="h-9 bg-[#18181c] border-b border-[#2b2b32] flex items-center select-none relative z-20 overflow-hidden"
    >
      {/* Scrollable Tabs Row */}
      <div 
        ref={tabListRef}
        className="flex-1 flex items-center h-full overflow-x-auto no-scrollbar scroll-smooth"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
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
              className={`group relative h-full flex items-center gap-1.5 px-3 min-w-[120px] max-w-[210px] text-xs cursor-pointer border-r border-[#26262e] transition-all
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
                  // Show dirty dot, but show close on hover
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

        {/* Plus Button: Add New Tab */}
        <button
          id="new-tab-plus-btn"
          onClick={onNewTab}
          title="New Tab (Ctrl+N)"
          className="h-full px-2.5 text-[#8e8e99] hover:text-white hover:bg-[#22222b] transition-colors flex items-center justify-center shrink-0 border-r border-[#26262e]"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab Overflow / Quick Switcher Dropdown */}
      <div className="relative shrink-0 flex items-center h-full px-1 bg-[#18181c]" ref={quickSwitchRef}>
        <button
          id="quick-tab-switcher-btn"
          onClick={() => setIsQuickSwitchOpen(!isQuickSwitchOpen)}
          title="All Open Tabs"
          className="h-7 px-2 flex items-center gap-1 text-xs text-[#8e8e99] hover:text-white hover:bg-[#24242c] rounded transition-colors"
        >
          <span className="text-[11px]">{tabs.length} tabs</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {isQuickSwitchOpen && (
          <div className="absolute right-1 top-8 min-w-[220px] max-h-72 overflow-y-auto bg-[#23232a] border border-[#383842] rounded shadow-2xl py-1 z-50 text-xs">
            <div className="px-3 py-1.5 text-[10px] text-[#8e8e99] font-medium uppercase tracking-wider border-b border-[#30303a] flex justify-between items-center">
              <span>Open Tabs</span>
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setIsQuickSwitchOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#32323c] ${
                  tab.id === activeTabId ? 'bg-[#2b2b34] text-white font-medium' : 'text-[#c8c8d0]'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">{tab.title}</span>
                  {tab.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                </div>
                {tab.id === activeTabId && <Check className="w-3 h-3 text-sky-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}
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
