import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Settings,
  Copy,
  Check,
  ArrowDownToLine,
  RefreshCw,
  FileText,
  RotateCcw,
  Zap,
  Globe,
  Table,
  CheckCheck,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { AiChatMessage, AiAgentConfig } from '../types';

interface AiAgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  editorContent: string;
  selectedText?: string;
  onInsertText: (text: string) => void;
  onReplaceText: (text: string) => void;
}

const STORAGE_KEY_AGENT_CONFIG = 'coreeditor_agent_config_v1';

const DEFAULT_CONFIG: AiAgentConfig = {
  provider: 'gemini',
  customEndpoint: '',
  customApiKey: '',
  customModel: 'gpt-4o-mini',
  systemInstruction:
    'You are CoreEditor AI Agent, an expert Markdown authoring assistant. Always output cleanly formatted, professional Markdown without conversational filler.',
  temperature: 0.7,
};

const PROMPT_TEMPLATES = [
  {
    label: '✍️ Continue Writing',
    prompt: 'Please continue writing seamlessly and professionally based on the current Markdown context.',
  },
  {
    label: '✨ Polish & Improve',
    prompt: 'Please polish this text, improving clarity, flow, and elegance while preserving Markdown structure.',
  },
  {
    label: '🌐 Translate to English',
    prompt: 'Please translate the content into professional, natural English while preserving Markdown structure.',
  },
  {
    label: '📊 Convert to Table',
    prompt: 'Please structure the key data and points from this content into a clean, well-formatted Markdown table.',
  },
  {
    label: '📝 Generate Summary',
    prompt: 'Please summarize the core takeaways of this Markdown document into 3-5 concise bullet points.',
  },
];

export const AiAgentSidebar: React.FC<AiAgentSidebarProps> = ({
  isOpen,
  onClose,
  editorContent,
  selectedText,
  onInsertText,
  onReplaceText,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your **CoreEditor AI Agent** 🐕🎯\n\nI can help you with:\n- ✍️ Continuing text & expanding document sections\n- ✨ Proofreading grammar & polishing style\n- 🌐 Multilingual translation\n- 📊 Generating clean Markdown tables & outlines\n\nEnter your prompt below or click any quick action above!',
      timestamp: Date.now(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  // Agent Config
  const [config, setConfig] = useState<AiAgentConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AGENT_CONFIG);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  // Test Connection status
  const [testStatus, setTestStatus] = useState<{
    state: 'idle' | 'testing' | 'success' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AGENT_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ state: 'testing' });
    try {
      const payload: Record<string, unknown> = {};
      if (config.provider === 'custom') {
        payload.customEndpoint = config.customEndpoint;
        payload.customApiKey = config.customApiKey;
        payload.customModel = config.customModel;
      }

      const res = await fetch('/api/agent/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus({
          state: 'success',
          message: `Connected! (${data.provider} - ${data.model || 'Ready'})`,
        });
      } else {
        setTestStatus({
          state: 'error',
          message: data.error || 'Connection failed. Please check endpoint and API key.',
        });
      }
    } catch (err) {
      setTestStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Connection timeout or network error',
      });
    }
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Prepare context
      const contextToSend = includeContext
        ? selectedText && selectedText.trim().length > 0
          ? `[Selected Snippet]:\n${selectedText}`
          : editorContent
        : undefined;

      const payload: Record<string, unknown> = {
        prompt: text,
        context: contextToSend,
        systemInstruction: config.systemInstruction,
        history: messages
          .filter((m) => m.id !== 'welcome')
          .slice(-6)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
      };

      if (config.provider === 'custom') {
        payload.customEndpoint = config.customEndpoint;
        payload.customApiKey = config.customApiKey;
        payload.customModel = config.customModel;
      }

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const assistantMsg: AiChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '(No response received)',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: AiChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Agent Connection Error**: ${err instanceof Error ? err.message : 'Please check your network connection or API settings.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (content: string, id: string) => {
    onInsertText(content);
    setInsertedId(id);
    setTimeout(() => setInsertedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat history cleared. How can I assist you with your Markdown writing? 🐕🎯',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div
      id="coreeditor-ai-agent-sidebar"
      className="w-80 sm:w-96 bg-[#1b1b22] border-l border-[#2e2e3a] flex flex-col h-full select-none text-xs text-[#d0d0d8] shadow-2xl relative z-30 transition-all"
    >
      {/* Sidebar Header */}
      <div className="h-10 bg-[#17171d] border-b border-[#2a2a36] px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Doge Bullseye Logo mark */}
          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-red-500/40 shadow-xs flex items-center justify-center bg-red-950/40">
            <img
              src="/doge-target-icon.svg"
              alt="CoreEditor Doge Target"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            Core AI Agent
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded-full font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {config.provider === 'gemini' ? 'Gemini 3.8' : 'Custom'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="agent-settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Agent Connection Settings"
            className={`p-1.5 rounded hover:bg-[#282834] transition-colors ${
              showSettings ? 'text-sky-400 bg-[#282834]' : 'text-[#8e8e9c]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            id="agent-clear-btn"
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 rounded hover:bg-[#282834] text-[#8e8e9c] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            id="agent-close-btn"
            onClick={onClose}
            title="Close AI Agent Sidebar"
            className="p-1.5 rounded hover:bg-[#282834] text-[#8e8e9c] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Modal Drawer */}
      {showSettings && (
        <div className="p-3.5 bg-[#15151a] border-b border-[#2e2e3c] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-white font-medium text-[11px]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              AI Agent Connection Settings
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-[#8e8e9c] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Provider Selector */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#9a9aa8] block">Connection Provider</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, provider: 'gemini' }))}
                className={`px-2 py-1.5 rounded border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  config.provider === 'gemini'
                    ? 'border-sky-500 bg-sky-950/40 text-sky-300'
                    : 'border-[#2d2d3a] bg-[#1d1d26] text-[#8e8e9c] hover:border-[#3d3d4e]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                Built-in Gemini
              </button>
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, provider: 'custom' }))}
                className={`px-2 py-1.5 rounded border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  config.provider === 'custom'
                    ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                    : 'border-[#2d2d3a] bg-[#1d1d26] text-[#8e8e9c] hover:border-[#3d3d4e]'
                }`}
              >
                <Globe className="w-3 h-3 text-purple-400" />
                External / Ollama
              </button>
            </div>
          </div>

          {/* Custom Settings fields */}
          {config.provider === 'custom' && (
            <div className="space-y-2 pt-1 border-t border-[#262632]">
              <div>
                <label className="text-[10px] text-[#9a9aa8] block mb-0.5">
                  Endpoint URL (Supports Ollama / LM Studio / OpenAI API)
                </label>
                <input
                  type="text"
                  placeholder="http://localhost:11434/v1/chat/completions"
                  value={config.customEndpoint}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, customEndpoint: e.target.value }))
                  }
                  className="w-full bg-[#1b1b24] border border-[#30303e] rounded px-2 py-1 text-[11px] text-white focus:outline-hidden focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#9a9aa8] block mb-0.5">Model Name</label>
                  <input
                    type="text"
                    placeholder="llama3 / gpt-4o-mini"
                    value={config.customModel}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, customModel: e.target.value }))
                    }
                    className="w-full bg-[#1b1b24] border border-[#30303e] rounded px-2 py-1 text-[11px] text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#9a9aa8] block mb-0.5">API Key (Optional for local)</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={config.customApiKey}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, customApiKey: e.target.value }))
                    }
                    className="w-full bg-[#1b1b24] border border-[#30303e] rounded px-2 py-1 text-[11px] text-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Connection Button & Indicator */}
          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={handleTestConnection}
              disabled={testStatus.state === 'testing'}
              className="px-2.5 py-1 bg-[#232330] hover:bg-[#2b2b3b] text-sky-400 rounded border border-[#373748] flex items-center gap-1 text-[11px] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3 h-3 ${testStatus.state === 'testing' ? 'animate-spin' : ''}`}
              />
              Test Connection
            </button>

            {testStatus.state === 'success' && (
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <CheckCheck className="w-3 h-3" />
                {testStatus.message}
              </span>
            )}
            {testStatus.state === 'error' && (
              <span className="text-rose-400 text-[10px] flex items-center gap-1 truncate max-w-[170px]" title={testStatus.message}>
                <AlertCircle className="w-3 h-3 shrink-0" />
                {testStatus.message}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="p-2 border-b border-[#252530] bg-[#17171e] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {PROMPT_TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(tmpl.prompt)}
            disabled={isLoading}
            className="px-2 py-1 rounded-full bg-[#20202a] hover:bg-[#2b2b3a] text-[#a8a8b8] hover:text-white border border-[#2e2e3c] whitespace-nowrap text-[10px] transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1"
          >
            {tmpl.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 select-text">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] rounded-lg px-3 py-2.5 text-[11px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-[#21212a] text-[#d6d6e2] border border-[#2f2f3d]'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans break-words">{msg.content}</div>

              {/* Action Buttons for Assistant Responses */}
              {msg.role === 'assistant' && msg.id !== 'welcome' && (
                <div className="mt-2 pt-2 border-t border-[#2e2e3a] flex items-center justify-end gap-1 select-none">
                  <button
                    onClick={() => handleInsert(msg.content, msg.id)}
                    className="px-1.5 py-0.5 rounded bg-[#17171e] hover:bg-[#2d2d3c] text-[#a4a4b6] hover:text-sky-300 flex items-center gap-1 text-[10px] transition-colors"
                    title="Insert content at current cursor position"
                  >
                    {insertedId === msg.id ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Inserted</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-2.5 h-2.5" />
                        <span>Insert at Cursor</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onReplaceText(msg.content)}
                    className="px-1.5 py-0.5 rounded bg-[#17171e] hover:bg-[#2d2d3c] text-[#a4a4b6] hover:text-amber-300 flex items-center gap-1 text-[10px] transition-colors"
                    title="Replace selected text or entire document"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Replace</span>
                  </button>

                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="px-1.5 py-0.5 rounded bg-[#17171e] hover:bg-[#2d2d3c] text-[#a4a4b6] hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                    title="Copy Markdown content"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-2.5 h-2.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#6b6b78] mt-0.5 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[#8e8e9c] text-[11px] p-2 bg-[#1b1b24] rounded border border-[#2b2b38] w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Core AI Agent is thinking and drafting Markdown...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Execution Box */}
      <div className="p-2.5 bg-[#15151b] border-t border-[#2a2a36] space-y-2">
        {/* Context Attachment Options */}
        <div className="flex items-center justify-between px-1 text-[10px] text-[#8e8e9c]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="rounded bg-[#202028] border-[#373748] text-sky-500 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <FileText className="w-3 h-3 text-sky-400" />
            <span>
              {selectedText && selectedText.trim().length > 0
                ? `Include selected text (${selectedText.length} chars)`
                : `Include document context (${editorContent.length} chars)`}
            </span>
          </label>
          <span className="text-[#646472]">Shift+Enter for newline</span>
        </div>

        <div className="relative flex items-end bg-[#1e1e26] border border-[#323242] focus-within:border-sky-500 rounded-lg p-1 transition-colors">
          <textarea
            ref={inputRef}
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Core AI Agent or enter writing prompt..."
            className="w-full bg-transparent text-white text-[11px] placeholder-[#6b6b7a] resize-none px-2 py-1 focus:outline-hidden leading-relaxed"
          />
          <button
            id="agent-send-prompt-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-1.5 rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-white transition-colors shrink-0 mb-0.5 mr-0.5"
            title="Send prompt (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
