export type ViewMode = 'split' | 'editor' | 'preview';

export type SyntaxMode = 
  | 'Markdown'
  | 'Plain Text'
  | 'JavaScript'
  | 'TypeScript'
  | 'HTML'
  | 'CSS'
  | 'JSON'
  | 'Python'
  | 'SQL';

export type EditorTheme = 'sublime-dark' | 'one-dark' | 'windows-dark' | 'fluent-light';

export type PlatformStyle = 'windows' | 'macos';

export interface CursorPosition {
  line: number;
  col: number;
  selectionLength: number;
}

export interface TabItem {
  id: string;
  title: string;
  content: string;
  originalContent: string;
  isDirty: boolean;
  isPinned?: boolean;
  syntax: SyntaxMode;
  lineEndings: 'LF' | 'CRLF';
  encoding: string;
  createdAt: number;
  updatedAt: number;
}

export interface EditorSettings {
  fontSize: number;          // Editor code/text font size (e.g., 10-32px)
  uiFontSize: number;        // Global system / UI font size (e.g., 11-18px)
  previewFontSize: number;   // Markdown live preview font size (e.g., 12-24px)
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  syncScroll: boolean;
  formattingBarVisible: boolean;
  theme: EditorTheme;
  platformStyle: PlatformStyle;
  autoSave: boolean;
  spellCheck: boolean;
  grammarCheck: boolean;
}

export interface GrammarIssue {
  id: string;
  message: string;
  category: 'grammar' | 'spelling' | 'style' | 'punctuation' | 'redundancy';
  index: number;
  length: number;
  line: number;
  column: number;
  matchedText: string;
  replacements: string[];
}

export interface FindReplaceState {
  isOpen: boolean;
  isReplaceOpen: boolean;
  findText: string;
  replaceText: string;
  matchCase: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  currentMatchIndex: number;
  totalMatches: number;
}

export interface CommandItem {
  id: string;
  title: string;
  category: 'File' | 'Edit' | 'View' | 'Format' | 'Preferences' | 'Tabs';
  shortcut?: string;
  keywords?: string[];
  action: () => void;
}

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      platform: string;
    };
  }
}
