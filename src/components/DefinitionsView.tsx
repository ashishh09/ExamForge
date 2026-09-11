import React from 'react';
import { Pin, Copy, Download } from 'lucide-react';
import { DefinitionItem } from '../types';

interface DefinitionsViewProps {
  definitions: DefinitionItem[];
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const DefinitionsView: React.FC<DefinitionsViewProps> = ({
  definitions,
  onCopyText,
  onDownloadSection,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pin className="w-5 h-5 text-amber-500" />
            Standard 2-Mark Definitions ({definitions.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Exact, point-blank academic definitions crafted for 2-mark university questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Grid of Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {definitions.map((def) => {
          const kws = def.keyKeywords || (def as any).keywords || [];
          const textToCopy = `${def.term} (${def.marks || 2} Marks)\n\nDefinition:\n${def.definition}\n\nKeywords: ${kws.join(', ')}`;

          return (
            <div
              key={def.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                    {def.marks || 2} Marks Essential
                  </span>
                  <button
                    onClick={() => onCopyText(textToCopy, `Definition for ${def.term}`)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                    title="Copy definition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {def.term}
                </h4>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {def.definition}
                </p>
              </div>

              {kws && kws.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Keys:
                  </span>
                  {kws.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
