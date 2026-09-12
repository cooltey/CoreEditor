import React, { useState } from 'react';
import { Table, X } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (markdownTable: string) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  if (!isOpen) return null;

  const handleGenerate = () => {
    const validRows = Math.max(1, Math.min(20, rows));
    const validCols = Math.max(1, Math.min(10, cols));

    // Headers
    const headers = Array.from({ length: validCols }, (_, i) => `Header ${i + 1}`);
    const headerRow = `| ${headers.join(' | ')} |`;

    // Divider with alignment
    const alignMark = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : ':---';
    const dividerRow = `| ${Array(validCols).fill(alignMark).join(' | ')} |`;

    // Content rows
    const dataRows = Array.from({ length: validRows }, (_, r) => {
      const rowCells = Array.from({ length: validCols }, (_, c) => `Item ${r + 1},${c + 1}`);
      return `| ${rowCells.join(' | ')} |`;
    });

    const markdown = ['\n', headerRow, dividerRow, ...dataRows, '\n'].join('\n');
    onInsertTable(markdown);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#24242c] border border-[#3c3c4a] rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#30303b] bg-[#1e1e24]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Table className="w-4 h-4 text-sky-400" />
            <span>Insert Markdown Table</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#888896] hover:text-white p-1 rounded hover:bg-[#30303b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs text-[#d0d0d8]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#9090a0] mb-1">Columns</label>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full bg-[#18181f] border border-[#3b3b48] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#9090a0] mb-1">Data Rows</label>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full bg-[#18181f] border border-[#3b3b48] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[#9090a0] mb-1">Column Alignment</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => setAlignment(align)}
                  className={`flex-1 py-1.5 rounded capitalize border text-xs transition-colors ${
                    alignment === align
                      ? 'bg-sky-600 border-sky-500 text-white font-medium'
                      : 'bg-[#1a1a20] border-[#343440] text-[#a0a0b0] hover:bg-[#282832]'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preview Matrix */}
          <div className="pt-2 border-t border-[#30303b]">
            <span className="text-[11px] text-[#7d7d8c] block mb-1.5">Grid Preview</span>
            <div className="grid gap-1 max-h-24 overflow-auto p-2 bg-[#18181f] rounded border border-[#2d2d38]">
              {Array.from({ length: Math.min(4, rows + 1) }).map((_, r) => (
                <div key={r} className="flex gap-1">
                  {Array.from({ length: Math.min(5, cols) }).map((_, c) => (
                    <div
                      key={c}
                      className={`h-4 flex-1 rounded-xs text-[9px] flex items-center justify-center ${
                        r === 0 ? 'bg-sky-500/20 text-sky-400' : 'bg-[#2b2b36] text-[#7d7d8c]'
                      }`}
                    >
                      {r === 0 ? `Col ${c + 1}` : '...'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 bg-[#1e1e24] border-t border-[#30303b]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#2c2c36] hover:bg-[#383846] text-[#c0c0cc] text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};
