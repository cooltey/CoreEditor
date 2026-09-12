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
  fontSize: number;
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
  category: 'File' | 'Edit' | 'View' | 'Format' | 'Preferences' | 'Tabs' | 'AI Agent';
  shortcut?: string;
  keywords?: string[];
  action: () => void;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AiAgentConfig {
  provider: 'gemini' | 'custom';
  customEndpoint: string;
  customApiKey: string;
  customModel: string;
  systemInstruction: string;
  temperature: number;
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
