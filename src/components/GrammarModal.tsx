import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Wand2, 
  Check, 
  Eye, 
  SpellCheck, 
  BookOpen, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { GrammarIssue } from '../types';

interface GrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: GrammarIssue[];
  onApplyFix: (issue: GrammarIssue, replacement: string) => void;
  onApplyAllFixes: (issues: GrammarIssue[]) => void;
  onLocateIssue: (issue: GrammarIssue) => void;
  nativeSpellCheck: boolean;
  onToggleNativeSpellCheck: () => void;
  grammarCheckEnabled: boolean;
  onToggleGrammarCheck: () => void;
  onInsertSampleText?: () => void;
}

export const GrammarModal: React.FC<GrammarModalProps> = ({
  isOpen,
  onClose,
  issues,
  onApplyFix,
  onApplyAllFixes,
  onLocateIssue,
  nativeSpellCheck,
  onToggleNativeSpellCheck,
  grammarCheckEnabled,
  onToggleGrammarCheck,
  onInsertSampleText,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredIssues = useMemo(() => {
    if (selectedCategory === 'all') return issues;
    return issues.filter((i) => i.category === selectedCategory);
  }, [issues, selectedCategory]);

  const categoryCounts = useMemo(() => {
    return {
      all: issues.length,
      grammar: issues.filter((i) => i.category === 'grammar').length,
      spelling: issues.filter((i) => i.category === 'spelling').length,
      style: issues.filter((i) => i.category === 'style').length,
      punctuation: issues.filter((i) => i.category === 'punctuation').length,
    };
  }, [issues]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#22222a] border border-[#3b3b48] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#d4d4dc]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30303c] bg-[#1a1a22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <SpellCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span>English Grammar & Spell Check</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/25">
                  Offline • Zero API Key
                </span>
              </div>
              <div className="text-[11px] text-[#8e8e9e]">
                Browser native spellcheck + real-time offline grammar analysis
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888898] hover:text-white p-1 rounded hover:bg-[#30303c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Switches & Action Bar */}
        <div className="px-5 py-2.5 bg-[#1e1e26] border-b border-[#2d2d38] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            {/* Native Spell Check switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#b0b0be] hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={nativeSpellCheck}
                onChange={onToggleNativeSpellCheck}
                className="rounded border-[#424252] bg-[#292934] text-sky-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Native Red Squiggles (Browser)</span>
            </label>

            {/* Offline Grammar Engine switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#b0b0be] hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={grammarCheckEnabled}
                onChange={onToggleGrammarCheck}
                className="rounded border-[#424252] bg-[#292934] text-sky-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Grammar & Style Rules</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {onInsertSampleText && (
              <button
                onClick={onInsertSampleText}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2a2a36] hover:bg-[#383846] text-[#c0c0d0] hover:text-white rounded border border-[#404050] text-xs transition-colors"
                title="Load a test passage with common grammar & spelling errors to test the checker"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Grammar Demo</span>
              </button>
            )}

            {issues.length > 0 && (
              <button
                onClick={() => onApplyAllFixes(issues)}
                className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium text-xs transition-colors shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Fix All Issues ({issues.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 pb-2 border-b border-[#2d2d38] bg-[#1a1a20] text-xs">
          {[
            { id: 'all', label: 'All Issues', count: categoryCounts.all },
            { id: 'grammar', label: 'Grammar', count: categoryCounts.grammar },
            { id: 'spelling', label: 'Spelling', count: categoryCounts.spelling },
            { id: 'style', label: 'Style & Clarity', count: categoryCounts.style },
            { id: 'punctuation', label: 'Punctuation', count: categoryCounts.punctuation },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                selectedCategory === tab.id
                  ? 'bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30'
                  : 'text-[#8e8e9c] hover:text-[#d0d0dc] hover:bg-[#282832]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                tab.count > 0 
                  ? selectedCategory === tab.id ? 'bg-sky-500/40 text-white' : 'bg-[#2e2e3a] text-[#a0a0b0]'
                  : 'opacity-40'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Issue List or Clean State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium text-sm">No issues detected!</h4>
              <p className="text-xs text-[#8e8e9c] mt-1 max-w-sm">
                Your English writing is clean. No common grammar confusions, spelling mistakes, or redundant phrasing were found.
              </p>
              {onInsertSampleText && (
                <button
                  onClick={onInsertSampleText}
                  className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium text-xs transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert Sample Mistakes to Test Checker</span>
                </button>
              )}
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const categoryBadge = {
                grammar: { bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', label: 'Grammar' },
                spelling: { bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30', label: 'Spelling' },
                style: { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: 'Style' },
                punctuation: { bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', label: 'Punctuation' },
                redundancy: { bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', label: 'Redundancy' },
              }[issue.category] || { bg: 'bg-gray-500/15 text-gray-300 border-gray-500/30', label: 'Check' };

              return (
                <div
                  key={issue.id}
                  className="p-3.5 bg-[#1c1c24] border border-[#2f2f3c] hover:border-[#3d3d4e] rounded-lg transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${categoryBadge.bg}`}>
                        {categoryBadge.label}
                      </span>
                      <span className="text-[#888898] font-mono text-[11px]">
                        Line {issue.line}, Col {issue.column}
                      </span>
                    </div>

                    <button
                      onClick={() => onLocateIssue(issue)}
                      className="text-[#8e8e9e] hover:text-white flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded hover:bg-[#2c2c38] transition-colors"
                      title="Jump to location in editor"
                    >
                      <Eye className="w-3 h-3 text-sky-400" />
                      <span>Locate</span>
                    </button>
                  </div>

                  {/* Problem snippet & message */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[12px]">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 line-through">
                        {issue.matchedText}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#6c6c7c]" />
                      {issue.replacements.map((rep, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                          {rep}
                        </span>
                      ))}
                    </div>
                    <div className="text-[#a8a8b8] text-[12px] pt-0.5">
                      {issue.message}
                    </div>
                  </div>

                  {/* Quick Fix Button */}
                  <div className="pt-1 flex items-center gap-2">
                    {issue.replacements.map((rep, idx) => (
                      <button
                        key={idx}
                        onClick={() => onApplyFix(issue, rep)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Replace with "{rep}"</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#30303c] bg-[#1a1a22] flex items-center justify-between text-xs text-[#8e8e9c]">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#6e6e7e]" />
            <span>Checks duplicate words, then/than, its/it's, their/there, modal have, articles & style.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#2e2e3a] hover:bg-[#3b3b4a] text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
