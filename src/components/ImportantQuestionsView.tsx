import React, { useState } from 'react';
import { Star, Copy, Check, Download, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ImportantQuestion } from '../types';

interface ImportantQuestionsViewProps {
  questions: ImportantQuestion[];
  subject: string;
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const ImportantQuestionsView: React.FC<ImportantQuestionsViewProps> = ({
  questions,
  subject,
  onCopyText,
  onDownloadSection,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriorityStyle = (priority: string) => {
    if (priority.includes('HIGH')) {
      return {
        badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
        border: 'border-rose-200/70 dark:border-rose-900/40',
        indicator: 'HIGH PRIORITY'
      };
    }
    if (priority.includes('MEDIUM')) {
      return {
        badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        border: 'border-amber-200/70 dark:border-amber-900/40',
        indicator: 'MEDIUM PRIORITY'
      };
    }
    return {
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-blue-500',
      border: 'border-slate-200 dark:border-slate-800',
      indicator: 'EXPECTED QUESTION'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            High-Yield Important Questions ({questions.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Curated based on recurring examination frequency, mark weightage, and core academic concepts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const style = getPriorityStyle(q.priority);
          const isExpanded = expandedId === q.id;

          const copyFormattedText = `[${q.marks} Marks] ${q.question}\n\nCategory: ${q.category}\nProbability: ${q.probability}\n\nAnswer Summary:\n${q.summaryAnswer}`;

          return (
            <div
              key={q.id || index}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${style.border} shadow-2xs hover:shadow-sm`}
            >
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${style.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                    {style.indicator}
                  </span>

                  <span className="text-xs text-slate-400 dark:text-slate-500">•</span>

                  <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                    {q.marks} Marks
                  </span>

                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                    {q.category || subject}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {q.probability || 'High Probability'}
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {q.question}
              </h4>

              {/* Quick Summary or Preview */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                {q.summaryAnswer}
              </p>

              {/* Actions & Expand Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(q.id)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isExpanded ? 'Hide Model Answer' : 'View Model Answer'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCopyText(copyFormattedText, 'Question & summary')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    title="Copy question and summary to clipboard"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Expanded Detailed Answer */}
              {isExpanded && (
                <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 animate-in fade-in duration-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Detailed Model Answer ({q.marks} Marks Structure)
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopyText(q.detailedAnswer || q.summaryAnswer, 'Detailed answer')}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Answer
                    </button>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                    {q.detailedAnswer || q.summaryAnswer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
