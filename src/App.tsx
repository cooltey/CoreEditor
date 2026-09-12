import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  TabItem, 
  ViewMode, 
  EditorSettings, 
  FindReplaceState, 
  CursorPosition, 
  CommandItem, 
  SyntaxMode,
  EditorTheme
} from './types';
import { DEFAULT_TABS } from './data/defaultFiles';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { TabBar } from './components/TabBar';
import { FormattingBar } from './components/FormattingBar';
import { Editor } from './components/Editor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { StatusBar } from './components/StatusBar';
import { FindReplaceModal } from './components/FindReplaceModal';
import { TableModal } from './components/TableModal';
import { RenameModal } from './components/RenameModal';
import { CommandPalette } from './components/CommandPalette';
import { AboutModal } from './components/AboutModal';
import { PackageExeModal } from './components/PackageExeModal';
import { AiAgentSidebar } from './components/AiAgentSidebar';

const STORAGE_KEY_TABS = 'coreeditor_tabs_v1';
const STORAGE_KEY_ACTIVE = 'coreeditor_active_tab_v1';
const STORAGE_KEY_SETTINGS = 'coreeditor_settings_v1';

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: true,
  showLineNumbers: true,
  showMinimap: true,
  syncScroll: true,
  formattingBarVisible: true,
  theme: 'sublime-dark',
  platformStyle: 'windows',
  autoSave: true,
};

export default function App() {
  // Tabs State
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABS) || localStorage.getItem('sublimemark_tabs_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_TABS;
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE) || localStorage.getItem('sublimemark_active_tab_v1');
      if (saved && tabs.some(t => t.id === saved)) return saved;
    } catch {
      // fallback
    }
    return DEFAULT_TABS[0]?.id || 'tab-welcome';
  });

  // Settings State
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem('sublimemark_settings_v1');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // UI View States
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [splitRatio, setSplitRatio] = useState(50); // 50% / 50%
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modals & Panels
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [tabToRenameId, setTabToRenameId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Find & Replace
  const [findReplace, setFindReplace] = useState<FindReplaceState>({
    isOpen: false,
    isReplaceOpen: false,
    findText: '',
    replaceText: '',
    matchCase: false,
    wholeWord: false,
    useRegex: false,
    currentMatchIndex: 0,
    totalMatches: 0,
  });

  // Cursor & Scrolling References
  const [cursor, setCursor] = useState<CursorPosition>({
    line: 1,
    col: 1,
    selectionLength: 0,
  });

  // Auto-Save State & Timer
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronized state refs for timers and event listeners
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  const activeTabIdRef = useRef(activeTabId);
  activeTabIdRef.current = activeTabId;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorScrollRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isScrollingSyncRef = useRef<boolean>(false);

  // Active Tab derived
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0] || {
      id: 'tab-fallback',
      title: 'Untitled.txt',
      content: '',
      originalContent: '',
      isDirty: false,
      syntax: 'Plain Text' as SyntaxMode,
      lineEndings: 'CRLF' as const,
      encoding: 'UTF-8',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }, [tabs, activeTabId]);

  // Direct persistence helper for structural tab updates
  const persistTabsDirectly = useCallback((tabsToPersist: TabItem[], activeId?: string) => {
    try {
      localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(tabsToPersist));
      if (activeId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeId);
      }
    } catch (err) {
      console.error('Failed saving tabs to localStorage:', err);
    }
  }, []);

  // Settings persistence effect
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed saving settings to localStorage:', err);
    }
  }, [settings]);

  // Toast auto-clear
  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // Perform Auto-Save: commits dirty tab changes and writes to localStorage
  const performAutoSave = useCallback(() => {
    const currentTabs = tabsRef.current;
    const currentActiveId = activeTabIdRef.current;
    const currentSettings = settingsRef.current;

    const updatedTabs = currentTabs.map((tab) => {
      if (tab.id === currentActiveId && tab.isDirty) {
        return {
          ...tab,
          originalContent: tab.content,
          isDirty: false,
          updatedAt: Date.now(),
        };
      }
      return tab;
    });

    setTabs(updatedTabs);
    setSaveStatus('saved');

    try {
      localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(updatedTabs));
      localStorage.setItem(STORAGE_KEY_ACTIVE, currentActiveId);
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
    } catch (err) {
      console.error('AutoSave to localStorage failed:', err);
    }
  }, []);

  // Update content of active tab with 500ms auto-save debounce
  const handleUpdateContent = useCallback((newContent: string) => {
    const currentActiveId = activeTabIdRef.current;
    const isAutoSave = settingsRef.current.autoSave;

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === currentActiveId) {
          const isDirty = newContent !== tab.originalContent;
          return {
            ...tab,
            content: newContent,
            isDirty,
            updatedAt: Date.now(),
          };
        }
        return tab;
      })
    );

    if (isAutoSave) {
      setSaveStatus('saving');

      // Reset the 500ms timer on each keystroke
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Trigger auto-save 500ms after typing stops
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
        autoSaveTimerRef.current = null;
      }, 500);
    } else {
      setSaveStatus('dirty');
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    }
  }, [performAutoSave]);

  // Window beforeunload & unmount protection
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      try {
        const currentTabs = tabsRef.current;
        const currentActiveId = activeTabIdRef.current;
        const currentSettings = settingsRef.current;

        let toSave = currentTabs;
        if (currentSettings.autoSave) {
          toSave = currentTabs.map((t) =>
            t.id === currentActiveId && t.isDirty
              ? { ...t, originalContent: t.content, isDirty: false, updatedAt: Date.now() }
              : t
          );
        }
        localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(toSave));
        localStorage.setItem(STORAGE_KEY_ACTIVE, currentActiveId);
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
      } catch {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Switch Active Tab with pending save flush
  const handleSelectTab = useCallback((tabId: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
      if (settingsRef.current.autoSave) {
        performAutoSave();
      }
    }
    setActiveTabId(tabId);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, tabId);
    } catch {}

    const targetTab = tabsRef.current.find((t) => t.id === tabId);
    setSaveStatus(targetTab?.isDirty ? 'dirty' : 'saved');
  }, [performAutoSave]);

  // Toggle Auto Save setting
  const handleToggleAutoSave = useCallback(() => {
    setSettings((prev) => {
      const nextAutoSave = !prev.autoSave;
      const updated = { ...prev, autoSave: nextAutoSave };

      setSaveToast(`Auto Save ${nextAutoSave ? 'Enabled (500ms pause)' : 'Disabled'}`);

      if (nextAutoSave) {
        const currentActive = tabsRef.current.find((t) => t.id === activeTabIdRef.current);
        if (currentActive?.isDirty) {
          setSaveStatus('saving');
          if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
          autoSaveTimerRef.current = setTimeout(() => {
            performAutoSave();
            autoSaveTimerRef.current = null;
          }, 500);
        } else {
          setSaveStatus('saved');
        }
      } else {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
          autoSaveTimerRef.current = null;
        }
        const currentActive = tabsRef.current.find((t) => t.id === activeTabIdRef.current);
        setSaveStatus(currentActive?.isDirty ? 'dirty' : 'saved');
      }

      return updated;
    });
  }, [performAutoSave]);

  // Tab Management Handlers
  const handleNewTab = useCallback((customTitle?: string, initialContent: string = '') => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
      if (settingsRef.current.autoSave) {
        performAutoSave();
      }
    }
    const nextNum = tabs.length + 1;
    const newTitle = customTitle || `Untitled-${nextNum}.md`;
    const newTab: TabItem = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newTitle,
      content: initialContent,
      originalContent: initialContent,
      isDirty: false,
      syntax: newTitle.endsWith('.md') ? 'Markdown' : 'Plain Text',
      lineEndings: 'CRLF',
      encoding: 'UTF-8',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTabs((prev) => {
      const updated = [...prev, newTab];
      persistTabsDirectly(updated, newTab.id);
      return updated;
    });
    setActiveTabId(newTab.id);
    setSaveStatus('saved');
  }, [tabs.length, performAutoSave, persistTabsDirectly]);

  const handleCloseTab = useCallback((tabIdToClose: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    if (tabs.length === 1) {
      // If closing last tab, create an empty one
      const fallback: TabItem = {
        id: `tab-${Date.now()}`,
        title: 'Untitled.md',
        content: '',
        originalContent: '',
        isDirty: false,
        syntax: 'Markdown',
        lineEndings: 'CRLF',
        encoding: 'UTF-8',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setTabs([fallback]);
      setActiveTabId(fallback.id);
      persistTabsDirectly([fallback], fallback.id);
      setSaveStatus('saved');
      return;
    }

    const index = tabs.findIndex((t) => t.id === tabIdToClose);
    const newTabs = tabs.filter((t) => t.id !== tabIdToClose);
    const nextActive = activeTabId === tabIdToClose
      ? (newTabs[Math.max(0, index - 1)]?.id || newTabs[0].id)
      : activeTabId;

    setTabs(newTabs);
    setActiveTabId(nextActive);
    persistTabsDirectly(newTabs, nextActive);
    const nextActiveTab = newTabs.find((t) => t.id === nextActive);
    setSaveStatus(nextActiveTab?.isDirty ? 'dirty' : 'saved');
  }, [tabs, activeTabId, persistTabsDirectly]);

  const handleCloseOthers = useCallback((tabIdToKeep: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const kept = tabs.filter((t) => t.id === tabIdToKeep);
    setTabs(kept);
    setActiveTabId(tabIdToKeep);
    persistTabsDirectly(kept, tabIdToKeep);
  }, [tabs, persistTabsDirectly]);

  const handleCloseToRight = useCallback((targetTabId: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const targetIdx = tabs.findIndex((t) => t.id === targetTabId);
    if (targetIdx !== -1) {
      const kept = tabs.slice(0, targetIdx + 1);
      setTabs(kept);
      const nextActive = kept.some((t) => t.id === activeTabId) ? activeTabId : targetTabId;
      setActiveTabId(nextActive);
      persistTabsDirectly(kept, nextActive);
    }
  }, [tabs, activeTabId, persistTabsDirectly]);

  const handleCloseAll = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    const fresh: TabItem = {
      id: `tab-${Date.now()}`,
      title: 'Untitled.md',
      content: '',
      originalContent: '',
      isDirty: false,
      syntax: 'Markdown',
      lineEndings: 'CRLF',
      encoding: 'UTF-8',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTabs([fresh]);
    setActiveTabId(fresh.id);
    persistTabsDirectly([fresh], fresh.id);
    setSaveStatus('saved');
  }, [persistTabsDirectly]);

  const handleDuplicateTab = useCallback((tabId: string) => {
    const tabToDup = tabs.find((t) => t.id === tabId);
    if (!tabToDup) return;
    const dupTab: TabItem = {
      ...tabToDup,
      id: `tab-${Date.now()}`,
      title: `Copy_of_${tabToDup.title}`,
      isDirty: false,
      originalContent: tabToDup.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTabs((prev) => {
      const updated = [...prev, dupTab];
      persistTabsDirectly(updated, dupTab.id);
      return updated;
    });
    setActiveTabId(dupTab.id);
    setSaveStatus('saved');
  }, [tabs, persistTabsDirectly]);

  const handleTogglePinTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const updated = prev.map((t) => (t.id === tabId ? { ...t, isPinned: !t.isPinned } : t));
      persistTabsDirectly(updated);
      return updated;
    });
  }, [persistTabsDirectly]);

  const handleStartRename = useCallback((tabId: string) => {
    setTabToRenameId(tabId);
    setIsRenameModalOpen(true);
  }, []);

  const handleFinishRename = useCallback((newTitle: string) => {
    if (!tabToRenameId) return;
    setTabs((prev) => {
      const updated = prev.map((t) => {
        if (t.id === tabToRenameId) {
          const isMd = newTitle.endsWith('.md');
          return {
            ...t,
            title: newTitle,
            syntax: isMd ? 'Markdown' : t.syntax,
          };
        }
        return t;
      });
      persistTabsDirectly(updated);
      return updated;
    });
    setTabToRenameId(null);
  }, [tabToRenameId, persistTabsDirectly]);

  const handleReorderTabs = useCallback((sourceIdx: number, destIdx: number) => {
    setTabs((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(sourceIdx, 1);
      copy.splice(destIdx, 0, removed);
      persistTabsDirectly(copy);
      return copy;
    });
  }, [persistTabsDirectly]);

  // Save File manually (Ctrl+S or menu)
  const handleSaveFile = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    const currentActiveId = activeTabIdRef.current;
    const currentSettings = settingsRef.current;
    let savedTitle = activeTab.title;

    setTabs((prev) => {
      const updated = prev.map((t) => {
        if (t.id === currentActiveId) {
          savedTitle = t.title;
          return {
            ...t,
            originalContent: t.content,
            isDirty: false,
            updatedAt: Date.now(),
          };
        }
        return t;
      });

      try {
        localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY_ACTIVE, currentActiveId);
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }

      return updated;
    });

    setSaveStatus('saved');
    setSaveToast(`Saved "${savedTitle}"`);
  }, [activeTab.title]);

  // Export File as .md
  const handleExportMarkdown = useCallback(() => {
    const blob = new Blob([activeTab.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.title.endsWith('.md') ? activeTab.title : `${activeTab.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    handleSaveFile();
  }, [activeTab, handleSaveFile]);

  // Export File as .html
  const handleExportHtml = useCallback(() => {
    const previewEl = document.getElementById('rendered-markdown-body');
    const innerHtml = previewEl ? previewEl.innerHTML : activeTab.content;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${activeTab.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 860px; margin: 40px auto; padding: 0 20px; color: #24292f; }
    h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code { background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #d0d7de; padding: 8px 12px; }
    th { background: #f6f8fa; }
    blockquote { border-left: 4px solid #0969da; margin: 0; padding-left: 16px; color: #57606a; }
  </style>
</head>
<body>
  ${innerHtml}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.title.replace(/\.[^/.]+$/, '')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [activeTab]);

  // Open Local File
  const handleOpenFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      handleNewTab(file.name, text);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  }, [handleNewTab]);

  // Synchronized Scrolling Logic
  const handleEditorScroll = useCallback(() => {
    if (!settings.syncScroll || viewMode !== 'split' || isScrollingSyncRef.current) return;
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (!editor || !preview) return;

    isScrollingSyncRef.current = true;
    const editorScrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
    preview.scrollTop = editorScrollRatio * (preview.scrollHeight - preview.clientHeight);

    setTimeout(() => {
      isScrollingSyncRef.current = false;
    }, 50);
  }, [settings.syncScroll, viewMode]);

  const handlePreviewScroll = useCallback(() => {
    if (!settings.syncScroll || viewMode !== 'split' || isScrollingSyncRef.current) return;
    const editor = editorScrollRef.current;
    const preview = previewScrollRef.current;
    if (!editor || !preview) return;

    isScrollingSyncRef.current = true;
    const previewScrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
    editor.scrollTop = previewScrollRatio * (editor.scrollHeight - editor.clientHeight);

    setTimeout(() => {
      isScrollingSyncRef.current = false;
    }, 50);
  }, [settings.syncScroll, viewMode]);

  // Cursor and text selection tracking
  const handleCursorChange = useCallback((newCursor: CursorPosition) => {
    setCursor(newCursor);
    if (textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      if (selectionStart !== selectionEnd) {
        setSelectedText(value.substring(selectionStart, selectionEnd));
      } else {
        setSelectedText('');
      }
    }
  }, []);

  // AI Agent text insertion & replacement
  const handleInsertTextFromAgent = useCallback((textToInsert: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const { selectionStart, selectionEnd, value } = textarea;
      const nextVal = value.substring(0, selectionStart) + textToInsert + value.substring(selectionEnd);
      handleUpdateContent(nextVal);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = selectionStart + textToInsert.length;
        textarea.selectionEnd = selectionStart + textToInsert.length;
      }, 50);
    } else {
      handleUpdateContent(activeTab.content + '\n\n' + textToInsert);
    }
    setSaveToast('Core AI: 內容已插入編輯器');
  }, [activeTab.content, handleUpdateContent]);

  const handleReplaceTextFromAgent = useCallback((replacementText: string) => {
    const textarea = textareaRef.current;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      const { selectionStart, selectionEnd, value } = textarea;
      const nextVal = value.substring(0, selectionStart) + replacementText + value.substring(selectionEnd);
      handleUpdateContent(nextVal);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart + replacementText.length;
      }, 50);
      setSaveToast('Core AI: 已替換選取文字');
    } else {
      handleUpdateContent(replacementText);
      setSaveToast('Core AI: 已替換全文');
    }
  }, [handleUpdateContent]);

  // Formatting Engine
  const applyFormatting = useCallback((type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);

    let prefix = '';
    let suffix = '';
    let replacement = selectedText;

    switch (type) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        if (!selectedText) replacement = 'bold text';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        if (!selectedText) replacement = 'italic text';
        break;
      case 'strike':
        prefix = '~~';
        suffix = '~~';
        if (!selectedText) replacement = 'strikethrough text';
        break;
      case 'code':
        prefix = '`';
        suffix = '`';
        if (!selectedText) replacement = 'code';
        break;
      case 'h1':
        prefix = '# ';
        if (!selectedText) replacement = 'Heading 1';
        break;
      case 'h2':
        prefix = '## ';
        if (!selectedText) replacement = 'Heading 2';
        break;
      case 'h3':
        prefix = '### ';
        if (!selectedText) replacement = 'Heading 3';
        break;
      case 'bulletList':
        if (selectedText) {
          replacement = selectedText.split('\n').map((l) => `- ${l}`).join('\n');
        } else {
          replacement = '- List item';
        }
        break;
      case 'numberedList':
        if (selectedText) {
          replacement = selectedText.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n');
        } else {
          replacement = '1. First item';
        }
        break;
      case 'checklist':
        if (selectedText) {
          replacement = selectedText.split('\n').map((l) => `- [ ] ${l}`).join('\n');
        } else {
          replacement = '- [ ] New task';
        }
        break;
      case 'quote':
        if (selectedText) {
          replacement = selectedText.split('\n').map((l) => `> ${l}`).join('\n');
        } else {
          replacement = '> Quote text';
        }
        break;
      case 'codeBlock':
        prefix = '```typescript\n';
        suffix = '\n```';
        if (!selectedText) replacement = '// Code here\nconsole.log("Hello, world!");';
        break;
      case 'hr':
        prefix = '\n---\n';
        replacement = '';
        break;
      case 'link':
        prefix = '[';
        suffix = '](https://example.com)';
        if (!selectedText) replacement = 'link title';
        break;
      case 'image':
        prefix = '![';
        suffix = '](https://picsum.photos/600/300)';
        if (!selectedText) replacement = 'image description';
        break;
      case 'uppercase':
        replacement = (selectedText || value).toUpperCase();
        if (!selectedText) {
          handleUpdateContent(replacement);
          return;
        }
        break;
      case 'lowercase':
        replacement = (selectedText || value).toLowerCase();
        if (!selectedText) {
          handleUpdateContent(replacement);
          return;
        }
        break;
      case 'titlecase':
        replacement = (selectedText || value).replace(/\b\w/g, (c) => c.toUpperCase());
        if (!selectedText) {
          handleUpdateContent(replacement);
          return;
        }
        break;
      case 'cleanWhitespace':
        handleUpdateContent(
          value
            .split('\n')
            .map((line) => line.trimEnd())
            .join('\n')
        );
        return;
      case 'cleanEmptyLines':
        handleUpdateContent(value.replace(/\n{3,}/g, '\n\n'));
        return;
      case 'sortLines': {
        const target = selectedText || value;
        const sorted = target.split('\n').sort().join('\n');
        if (!selectedText) {
          handleUpdateContent(sorted);
        } else {
          const nextVal = value.substring(0, selectionStart) + sorted + value.substring(selectionEnd);
          handleUpdateContent(nextVal);
        }
        return;
      }
      case 'duplicateLine': {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const lineEnd = value.indexOf('\n', selectionEnd);
        const actualEnd = lineEnd === -1 ? value.length : lineEnd;
        const currentLine = value.substring(lineStart, actualEnd);
        const nextVal = value.substring(0, actualEnd) + '\n' + currentLine + value.substring(actualEnd);
        handleUpdateContent(nextVal);
        return;
      }
      case 'moveLineUp': {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        if (lineStart === 0) return; // already top
        const prevLineStart = value.lastIndexOf('\n', lineStart - 2) + 1;
        const lineEnd = value.indexOf('\n', selectionEnd);
        const actualEnd = lineEnd === -1 ? value.length : lineEnd;
        
        const prevLine = value.substring(prevLineStart, lineStart - 1);
        const currentLine = value.substring(lineStart, actualEnd);
        const nextVal = value.substring(0, prevLineStart) + currentLine + '\n' + prevLine + value.substring(actualEnd);
        handleUpdateContent(nextVal);
        return;
      }
      case 'moveLineDown': {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const lineEnd = value.indexOf('\n', selectionEnd);
        if (lineEnd === -1) return; // already bottom
        const nextLineEnd = value.indexOf('\n', lineEnd + 1);
        const actualNextEnd = nextLineEnd === -1 ? value.length : nextLineEnd;
        
        const currentLine = value.substring(lineStart, lineEnd);
        const nextLine = value.substring(lineEnd + 1, actualNextEnd);
        const nextVal = value.substring(0, lineStart) + nextLine + '\n' + currentLine + value.substring(actualNextEnd);
        handleUpdateContent(nextVal);
        return;
      }
      case 'insertMarkdownCheatsheet': {
        const cheatsheet = `\n\n# Markdown Quick Reference\n\n| Style | Syntax |\n| :--- | :--- |\n| Bold | \`**bold**\` |\n| Italic | \`*italic*\` |\n| Code | \`\` \`code\` \`\` |\n| Heading 1 | \`# Title\` |\n| Link | \`[Text](url)\` |\n| Quote | \`> Quote\` |\n| Table | \`| H1 | H2 |\` |\n`;
        handleUpdateContent(value + cheatsheet);
        return;
      }
      case 'undo':
        document.execCommand('undo');
        return;
      case 'redo':
        document.execCommand('redo');
        return;
      default:
        break;
    }

    const nextVal =
      value.substring(0, selectionStart) +
      prefix +
      replacement +
      suffix +
      value.substring(selectionEnd);

    handleUpdateContent(nextVal);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = selectionStart + prefix.length;
      textarea.selectionEnd = selectionStart + prefix.length + replacement.length;
    }, 0);
  }, [handleUpdateContent]);

  // Find & Replace match counter
  useEffect(() => {
    if (!findReplace.isOpen || !findReplace.findText) {
      setFindReplace((prev) => ({ ...prev, totalMatches: 0, currentMatchIndex: 0 }));
      return;
    }

    const content = activeTab.content;
    let flags = 'g';
    if (!findReplace.matchCase) flags += 'i';

    try {
      let pattern = findReplace.findText;
      if (!findReplace.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (findReplace.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const regex = new RegExp(pattern, flags);
      const matches = content.match(regex);
      const total = matches ? matches.length : 0;
      setFindReplace((prev) => ({
        ...prev,
        totalMatches: total,
        currentMatchIndex: total > 0 ? Math.min(prev.currentMatchIndex, total - 1) : 0,
      }));
    } catch {
      // invalid regex
    }
  }, [findReplace.isOpen, findReplace.findText, findReplace.matchCase, findReplace.wholeWord, findReplace.useRegex, activeTab.content]);

  // Find Next / Prev
  const handleFindNavigate = useCallback((direction: 'next' | 'prev') => {
    const textarea = textareaRef.current;
    if (!textarea || !findReplace.findText) return;

    const content = activeTab.content;
    let flags = 'g';
    if (!findReplace.matchCase) flags += 'i';

    try {
      let pattern = findReplace.findText;
      if (!findReplace.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (findReplace.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const regex = new RegExp(pattern, flags);
      const matchIndices: { start: number; end: number }[] = [];
      let m: RegExpExecArray | null;

      while ((m = regex.exec(content)) !== null) {
        matchIndices.push({ start: m.index, end: m.index + m[0].length });
      }

      if (matchIndices.length === 0) return;

      let nextIndex = 0;
      if (direction === 'next') {
        nextIndex = (findReplace.currentMatchIndex + 1) % matchIndices.length;
      } else {
        nextIndex = (findReplace.currentMatchIndex - 1 + matchIndices.length) % matchIndices.length;
      }

      setFindReplace((prev) => ({ ...prev, currentMatchIndex: nextIndex }));

      const match = matchIndices[nextIndex];
      textarea.focus();
      textarea.setSelectionRange(match.start, match.end);

      // Scroll cursor into view
      const textBefore = content.substring(0, match.start);
      const lineNumber = textBefore.split('\n').length;
      const approxLineHeight = settings.fontSize * 1.55;
      textarea.scrollTop = Math.max(0, (lineNumber - 5) * approxLineHeight);
    } catch {
      // Regex error
    }
  }, [findReplace, activeTab.content, settings.fontSize]);

  // Replace Current
  const handleReplaceCurrent = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !findReplace.findText) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.substring(selectionStart, selectionEnd);

    // If currently selected text matches search, replace it
    const isMatch = findReplace.matchCase 
      ? selected === findReplace.findText 
      : selected.toLowerCase() === findReplace.findText.toLowerCase();

    if (isMatch) {
      const nextVal = value.substring(0, selectionStart) + findReplace.replaceText + value.substring(selectionEnd);
      handleUpdateContent(nextVal);
      setTimeout(() => handleFindNavigate('next'), 50);
    } else {
      handleFindNavigate('next');
    }
  }, [findReplace, handleUpdateContent, handleFindNavigate]);

  // Replace All
  const handleReplaceAll = useCallback(() => {
    if (!findReplace.findText) return;

    let flags = 'g';
    if (!findReplace.matchCase) flags += 'i';

    try {
      let pattern = findReplace.findText;
      if (!findReplace.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      if (findReplace.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const regex = new RegExp(pattern, flags);
      const replaced = activeTab.content.replace(regex, findReplace.replaceText);
      handleUpdateContent(replaced);
    } catch {
      // Regex error
    }
  }, [findReplace, activeTab.content, handleUpdateContent]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewTab();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleCloseTab(activeTabId);
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveFile();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExportMarkdown();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpenFileClick();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFindReplace((prev) => ({ ...prev, isOpen: true, isReplaceOpen: false }));
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setFindReplace((prev) => ({ ...prev, isOpen: true, isReplaceOpen: true }));
      } else if (mod && (e.key.toLowerCase() === 'p' || (e.shiftKey && e.key.toLowerCase() === 'p'))) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyFormatting('bold');
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyFormatting('italic');
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setViewMode((m) => (m === 'split' ? 'editor' : m === 'editor' ? 'preview' : 'split'));
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiAgentOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, handleNewTab, handleCloseTab, handleSaveFile, handleExportMarkdown, handleOpenFileClick, applyFormatting]);

  // Split Divider Dragging
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplit) return;
      const totalWidth = window.innerWidth;
      const newPercent = Math.max(20, Math.min(80, (e.clientX / totalWidth) * 100));
      setSplitRatio(newPercent);
    };

    const handleMouseUp = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit]);

  // Command Palette Items
  const commandList: CommandItem[] = useMemo(() => [
    {
      id: 'cmd-new-tab',
      title: 'New File Tab',
      category: 'File',
      shortcut: 'Ctrl+N',
      keywords: ['create', 'document', 'empty'],
      action: () => handleNewTab(),
    },
    {
      id: 'cmd-open-file',
      title: 'Open File from Disk...',
      category: 'File',
      shortcut: 'Ctrl+O',
      keywords: ['import', 'disk', 'load'],
      action: handleOpenFileClick,
    },
    {
      id: 'cmd-save-file',
      title: 'Save Active File',
      category: 'File',
      shortcut: 'Ctrl+S',
      keywords: ['store', 'write'],
      action: handleSaveFile,
    },
    {
      id: 'cmd-export-md',
      title: 'Export as Markdown (.md)',
      category: 'File',
      shortcut: 'Ctrl+Shift+S',
      keywords: ['download', 'save as'],
      action: handleExportMarkdown,
    },
    {
      id: 'cmd-export-html',
      title: 'Export as HTML (.html)',
      category: 'File',
      keywords: ['web', 'download', 'render'],
      action: handleExportHtml,
    },
    {
      id: 'cmd-print',
      title: 'Print / Save to PDF',
      category: 'File',
      shortcut: 'Ctrl+P',
      action: () => window.print(),
    },
    {
      id: 'cmd-view-split',
      title: 'View: Split View (Editor + Live Preview)',
      category: 'View',
      shortcut: 'Ctrl+E',
      action: () => setViewMode('split'),
    },
    {
      id: 'cmd-view-editor',
      title: 'View: Editor Only',
      category: 'View',
      action: () => setViewMode('editor'),
    },
    {
      id: 'cmd-view-preview',
      title: 'View: Markdown Preview Only',
      category: 'View',
      action: () => setViewMode('preview'),
    },
    {
      id: 'cmd-format-table',
      title: 'Insert Markdown Table...',
      category: 'Format',
      action: () => setIsTableModalOpen(true),
    },
    {
      id: 'cmd-format-bold',
      title: 'Format: Bold Text',
      category: 'Format',
      shortcut: 'Ctrl+B',
      action: () => applyFormatting('bold'),
    },
    {
      id: 'cmd-format-italic',
      title: 'Format: Italic Text',
      category: 'Format',
      shortcut: 'Ctrl+I',
      action: () => applyFormatting('italic'),
    },
    {
      id: 'cmd-format-checklist',
      title: 'Format: Task Checklist (- [ ])',
      category: 'Format',
      action: () => applyFormatting('checklist'),
    },
    {
      id: 'cmd-format-uppercase',
      title: 'Transform: UPPERCASE',
      category: 'Format',
      action: () => applyFormatting('uppercase'),
    },
    {
      id: 'cmd-format-lowercase',
      title: 'Transform: lowercase',
      category: 'Format',
      action: () => applyFormatting('lowercase'),
    },
    {
      id: 'cmd-format-titlecase',
      title: 'Transform: Title Case',
      category: 'Format',
      action: () => applyFormatting('titlecase'),
    },
    {
      id: 'cmd-format-clean-spaces',
      title: 'Clean: Trim Trailing Spaces',
      category: 'Format',
      action: () => applyFormatting('cleanWhitespace'),
    },
    {
      id: 'cmd-format-sort-lines',
      title: 'Clean: Sort Selected Lines (A-Z)',
      category: 'Format',
      action: () => applyFormatting('sortLines'),
    },
    {
      id: 'cmd-theme-sublime',
      title: 'Theme: Sublime Monokai Dark',
      category: 'Preferences',
      action: () => setSettings((s) => ({ ...s, theme: 'sublime-dark' })),
    },
    {
      id: 'cmd-theme-one-dark',
      title: 'Theme: One Dark Pro',
      category: 'Preferences',
      action: () => setSettings((s) => ({ ...s, theme: 'one-dark' })),
    },
    {
      id: 'cmd-theme-windows',
      title: 'Theme: Windows 11 Dark',
      category: 'Preferences',
      action: () => setSettings((s) => ({ ...s, theme: 'windows-dark' })),
    },
    {
      id: 'cmd-theme-light',
      title: 'Theme: Windows Fluent Light',
      category: 'Preferences',
      action: () => setSettings((s) => ({ ...s, theme: 'fluent-light' })),
    },
    {
      id: 'cmd-toggle-minimap',
      title: 'Toggle Code Minimap',
      category: 'View',
      action: () => setSettings((s) => ({ ...s, showMinimap: !s.showMinimap })),
    },
    {
      id: 'cmd-toggle-linenums',
      title: 'Toggle Line Numbers',
      category: 'View',
      action: () => setSettings((s) => ({ ...s, showLineNumbers: !s.showLineNumbers })),
    },
    {
      id: 'cmd-toggle-autosave',
      title: `Toggle Auto Save (Currently: ${settings.autoSave ? 'ON - 500ms' : 'OFF'})`,
      category: 'Preferences',
      action: handleToggleAutoSave,
    },
    {
      id: 'cmd-package-win',
      title: 'Package as Windows Executable (.exe)',
      category: 'File',
      shortcut: 'Win .exe',
      keywords: ['windows', 'exe', 'package', 'build', 'installer'],
      action: () => setIsPackageModalOpen(true),
    },
    {
      id: 'cmd-ai-agent-toggle',
      title: 'AI Agent: Toggle Core Assistant Panel',
      category: 'AI Agent',
      shortcut: 'Ctrl+J',
      keywords: ['ai', 'agent', 'gemini', 'assistant', 'chat', 'copilot', 'doge'],
      action: () => setIsAiAgentOpen((prev) => !prev),
    },
    {
      id: 'cmd-ai-agent-continue',
      title: 'AI Agent: Continue Writing Markdown',
      category: 'AI Agent',
      keywords: ['ai', 'agent', 'continue', 'write', 'draft'],
      action: () => setIsAiAgentOpen(true),
    },
    {
      id: 'cmd-ai-agent-polish',
      title: 'AI Agent: Polish & Proofread',
      category: 'AI Agent',
      keywords: ['ai', 'agent', 'polish', 'grammar', 'proofread'],
      action: () => setIsAiAgentOpen(true),
    },
  ], [
    handleNewTab, 
    handleOpenFileClick, 
    handleSaveFile, 
    handleExportMarkdown, 
    handleExportHtml, 
    applyFormatting,
    handleToggleAutoSave,
    settings.autoSave,
  ]);

  // Active theme background style class
  const themeBgClass = useMemo(() => {
    switch (settings.theme) {
      case 'one-dark':
        return 'bg-[#21252b] text-[#abb2bf]';
      case 'windows-dark':
        return 'bg-[#1f1f1f] text-[#cccccc]';
      case 'fluent-light':
        return 'bg-[#f3f3f3] text-[#1e1e1e]';
      case 'sublime-dark':
      default:
        return 'bg-[#1e1e24] text-[#d4d4dc]';
    }
  }, [settings.theme]);

  return (
    <div 
      id="sublimemark-app-root"
      className={`w-screen h-screen flex flex-col overflow-hidden font-sans select-none ${themeBgClass}`}
    >
      {/* Hidden File Input for Native File Opening */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.markdown,.js,.ts,.html,.css,.json,.py,.sql"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* 1. TitleBar (CoreEditor Desktop Frame) */}
      <TitleBar
        fileName={activeTab.title}
        isDirty={activeTab.isDirty}
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        isAiAgentOpen={isAiAgentOpen}
        onToggleAiAgent={() => setIsAiAgentOpen(!isAiAgentOpen)}
      />

      {/* 2. Sublime Text Menu Bar */}
      <MenuBar
        onNewTab={() => handleNewTab()}
        onOpenFile={handleOpenFileClick}
        onSaveFile={handleSaveFile}
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onPrint={() => window.print()}
        onCloseTab={() => handleCloseTab(activeTabId)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenFind={() => setFindReplace((prev) => ({ ...prev, isOpen: true, isReplaceOpen: false }))}
        onOpenReplace={() => setFindReplace((prev) => ({ ...prev, isOpen: true, isReplaceOpen: true }))}
        onFormatAction={applyFormatting}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        showLineNumbers={settings.showLineNumbers}
        onToggleLineNumbers={() => setSettings((s) => ({ ...s, showLineNumbers: !s.showLineNumbers }))}
        showMinimap={settings.showMinimap}
        onToggleMinimap={() => setSettings((s) => ({ ...s, showMinimap: !s.showMinimap }))}
        wordWrap={settings.wordWrap}
        onToggleWordWrap={() => setSettings((s) => ({ ...s, wordWrap: !s.wordWrap }))}
        formattingBarVisible={settings.formattingBarVisible}
        onToggleFormattingBar={() => setSettings((s) => ({ ...s, formattingBarVisible: !s.formattingBarVisible }))}
        theme={settings.theme}
        onChangeTheme={(theme) => setSettings((s) => ({ ...s, theme }))}
        syntax={activeTab.syntax}
        onChangeSyntax={(syntax) => {
          setTabs((prev) =>
            prev.map((t) => (t.id === activeTabId ? { ...t, syntax } : t))
          );
        }}
        fontSize={settings.fontSize}
        onChangeFontSize={(delta) =>
          setSettings((s) => ({
            ...s,
            fontSize: Math.max(10, Math.min(28, s.fontSize + delta)),
          }))
        }
        autoSave={settings.autoSave}
        onToggleAutoSave={handleToggleAutoSave}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenPackageModal={() => setIsPackageModalOpen(true)}
        onToggleAiAgent={() => setIsAiAgentOpen(!isAiAgentOpen)}
        onAiPromptAction={(_prompt) => setIsAiAgentOpen(true)}
      />

      {/* 3. Tab Bar with Tab Management */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleNewTab()}
        onCloseOthers={handleCloseOthers}
        onCloseToRight={handleCloseToRight}
        onCloseAll={handleCloseAll}
        onDuplicateTab={handleDuplicateTab}
        onRenameTab={handleStartRename}
        onTogglePinTab={handleTogglePinTab}
        onReorderTabs={handleReorderTabs}
      />

      {/* 4. Enhanced Typesetting / Formatting Bar */}
      {settings.formattingBarVisible && (
        <FormattingBar
          onAction={applyFormatting}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onOpenTableModal={() => setIsTableModalOpen(true)}
        />
      )}

      {/* 5. Main Workspace Area */}
      <div id="app-workspace-area" className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            className="h-full relative overflow-hidden"
            style={{
              width: viewMode === 'split' ? `${splitRatio}%` : '100%',
            }}
          >
            <Editor
              content={activeTab.content}
              onChangeContent={handleUpdateContent}
              settings={settings}
              onCursorChange={handleCursorChange}
              textareaRef={textareaRef}
              scrollRef={editorScrollRef}
              onScroll={handleEditorScroll}
            />
          </div>
        )}

        {/* Resizable Divider (Only in Split View) */}
        {viewMode === 'split' && (
          <div
            id="split-view-divider"
            onMouseDown={handleSplitMouseDown}
            title="Drag to resize split view"
            className="w-1.5 hover:w-2 bg-[#25252f] hover:bg-sky-500 cursor-col-resize select-none shrink-0 transition-all z-20 flex items-center justify-center group"
          >
            <div className="h-6 w-0.5 bg-[#454556] group-hover:bg-white rounded" />
          </div>
        )}

        {/* Markdown Live Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className="h-full relative overflow-hidden"
            style={{
              width: viewMode === 'split' ? `${100 - splitRatio}%` : '100%',
            }}
          >
            <MarkdownPreview
              content={activeTab.content}
              onUpdateContent={handleUpdateContent}
              scrollRef={previewScrollRef}
              onScroll={handlePreviewScroll}
              theme={settings.theme}
            />
          </div>
        )}

        {/* AI Agent Assistant Sidebar */}
        <AiAgentSidebar
          isOpen={isAiAgentOpen}
          onClose={() => setIsAiAgentOpen(false)}
          editorContent={activeTab.content}
          selectedText={selectedText}
          onInsertText={handleInsertTextFromAgent}
          onReplaceText={handleReplaceTextFromAgent}
        />
      </div>

      {/* 6. Find and Replace Bar (Docked above status bar) */}
      <FindReplaceModal
        state={findReplace}
        onChangeState={setFindReplace}
        onFindNext={() => handleFindNavigate('next')}
        onFindPrev={() => handleFindNavigate('prev')}
        onReplaceCurrent={handleReplaceCurrent}
        onReplaceAll={handleReplaceAll}
        onClose={() => setFindReplace((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 7. Sublime Status Bar */}
      <StatusBar
        cursor={cursor}
        content={activeTab.content}
        syntax={activeTab.syntax}
        onChangeSyntax={(syntax) => {
          setTabs((prev) =>
            prev.map((t) => (t.id === activeTabId ? { ...t, syntax } : t))
          );
        }}
        lineEndings={activeTab.lineEndings}
        onToggleLineEndings={() => {
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId
                ? { ...t, lineEndings: t.lineEndings === 'CRLF' ? 'LF' : 'CRLF' }
                : t
            )
          );
        }}
        tabSize={settings.tabSize}
        insertSpaces={settings.insertSpaces}
        onToggleTabSize={() => {
          setSettings((s) => ({
            ...s,
            tabSize: s.tabSize === 4 ? 2 : 4,
            insertSpaces: !s.insertSpaces,
          }));
        }}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isDirty={activeTab.isDirty}
        autoSave={settings.autoSave}
        onToggleAutoSave={handleToggleAutoSave}
        saveStatus={saveStatus}
      />

      {/* Modals */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsertTable={(tableMd) => {
          const textarea = textareaRef.current;
          if (textarea) {
            const { selectionStart, value } = textarea;
            const nextVal = value.substring(0, selectionStart) + tableMd + value.substring(selectionStart);
            handleUpdateContent(nextVal);
          } else {
            handleUpdateContent(activeTab.content + tableMd);
          }
        }}
      />

      <RenameModal
        isOpen={isRenameModalOpen}
        currentTitle={
          tabs.find((t) => t.id === tabToRenameId)?.title || activeTab.title
        }
        onClose={() => {
          setIsRenameModalOpen(false);
          setTabToRenameId(null);
        }}
        onRename={handleFinishRename}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commandList}
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={(id) => {
          setActiveTabId(id);
          setIsCommandPaletteOpen(false);
        }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <PackageExeModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
      />

      {/* Save Notification Toast */}
      {saveToast && (
        <div 
          id="app-save-toast"
          className="fixed bottom-9 right-4 bg-[#23232c] border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
