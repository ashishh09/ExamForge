import React from 'react';
import { FileText, Download, Copy, Bookmark } from 'lucide-react';
import { ShortNote } from '../types';

interface ShortNotesViewProps {
  notes: ShortNote[];
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const ShortNotesView: React.FC<ShortNotesViewProps> = ({
  notes,
  onCopyText,
  onDownloadSection,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Quick Revision Short Notes ({notes.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key conceptual summaries, formulas, and high-frequency bullet points for rapid review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notes.map((note) => {
          const formattedNoteText = `${note.topic} [${note.category}]\n\nSummary:\n${note.summary}\n\nKey Points:\n${note.bulletPoints.map((b) => `• ${b}`).join('\n')}`;

          return (
            <div
              key={note.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    {note.category}
                  </span>
                  <button
                    onClick={() => onCopyText(formattedNoteText, `Note on ${note.topic}`)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy note"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {note.topic}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {note.summary}
                </p>

                <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {note.bulletPoints.map((pt, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {note.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                    >
                      #{tag}
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
