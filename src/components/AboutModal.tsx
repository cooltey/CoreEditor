import React from 'react';
import { X, Keyboard, User, Mail, ExternalLink, Github } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#24242c] border border-[#3c3c4a] rounded-lg shadow-2xl w-full max-w-md overflow-hidden text-xs text-[#d0d0d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30303b] bg-[#1e1e24]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-red-500/50 shadow-md bg-red-950/40 p-0.5">
              <AppLogo className="w-full h-full object-cover rounded-md" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                <span>CoreEditor</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30">v2.1</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#888896] hover:text-white p-1 rounded hover:bg-[#30303b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Author Card */}
          <div className="p-4 bg-[#1b1b22] rounded-lg border border-[#323240] space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-white text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Author</span>
            </div>
            <div className="space-y-2 text-[12px] text-[#c0c0cc] pt-0.5">
              <div className="text-sm font-medium text-white">
                Cooltey Feng
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#7d8590]" />
                <a 
                  href="mailto:coolteygame@gmail.com" 
                  className="text-sky-400 hover:underline hover:text-sky-300 select-text"
                >
                  coolteygame@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-[#7d8590]" />
                <a 
                  href="https://github.com/cooltey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline hover:text-sky-300 flex items-center gap-1 select-text"
                >
                  <span>https://github.com/cooltey</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Shortcuts */}
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5 text-xs">
              <Keyboard className="w-3.5 h-3.5 text-sky-400" />
              <span>Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + P</span>
                <span className="text-sky-400">Command Palette</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + E</span>
                <span className="text-[#8e8e9c]">Toggle Views</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + = / -</span>
                <span className="text-[#8e8e9c]">Font Zoom</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + S</span>
                <span className="text-[#8e8e9c]">Save File</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + N</span>
                <span className="text-[#8e8e9c]">New Tab</span>
              </div>
              <div className="p-2 bg-[#1b1b22] rounded border border-[#2d2d38] flex justify-between">
                <span>Ctrl + F</span>
                <span className="text-[#8e8e9c]">Find & Replace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-3 bg-[#1e1e24] border-t border-[#30303b]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
