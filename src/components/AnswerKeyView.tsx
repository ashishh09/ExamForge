import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Check,
  Maximize2,
  Minimize2,
  ArrowDown
} from 'lucide-react';
import { AnswerKeyItem } from '../types';

interface AnswerKeyViewProps {
  answerKey: AnswerKeyItem[];
  onDownloadSection: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const AnswerKeyView: React.FC<AnswerKeyViewProps> = ({
  answerKey,
  onDownloadSection,
  onCopyText,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    answerKey.map((item) => item.id) // Default all expanded for rapid studying
  );

  const toggleExpand = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((i) => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const expandAll = () => {
    setExpandedIds(answerKey.map((item) => item.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const formatCopyAll = () => {
    let text = `OFFICIAL MODEL ANSWER KEY & MARKING SCHEMES\n\n`;
    answerKey.forEach((item) => {
      text += `----------------------------------------------------\n`;
      text += `${item.questionNumber} [${item.sectionName}] (${item.marks} Marks)\n`;
      text += `Question: ${item.questionText}\n\n`;
      if (item.markingScheme && item.markingScheme.length > 0) {
        text += `Marking Scheme:\n`;
        item.markingScheme.forEach((ms) => {
          text += `  • ${ms.step}: ${ms.marksAllocated}\n`;
        });
        text += `\n`;
      }
      text += `Model Answer:\n${item.modelAnswer}\n\n`;
    });
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Official Answer Key & Scoring Rubric ({answerKey.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Collapsible question-and-answer breakdown with step-by-step mark allocation schemes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand All
          </button>

          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Collapse All
          </button>

          <button
            onClick={() => onCopyText(formatCopyAll(), 'All Answers & Marking Schemes')}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy All
          </button>

          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Key PDF
          </button>
        </div>
      </div>

      {/* Collapsible Cards */}
      <div className="space-y-4">
        {answerKey.map((item) => {
          const isExpanded = expandedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-all"
            >
              {/* Question Header Accordion */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
                    {item.questionNumber}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.sectionName}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {item.marks} Marks
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {item.questionText}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {/* Collapsible Answer Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-150">
                  {/* Visual pointer */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />
                    Answer & Evaluation Schema
                  </div>

                  {/* Marking Scheme Rubric */}
                  {item.markingScheme && item.markingScheme.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        Marking Scheme Breakdown:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.markingScheme.map((ms, msIdx) => (
                          <div
                            key={msIdx}
                            className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80"
                          >
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {ms.step}
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-2 shrink-0">
                              {ms.marksAllocated}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model Answer text */}
                  <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                      Model Response:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      {item.modelAnswer}
                    </p>
                  </div>

                  {/* Copy Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        onCopyText(
                          `${item.questionNumber}: ${item.questionText}\n\nModel Answer:\n${item.modelAnswer}`,
                          `Answer for ${item.questionNumber}`
                        )
                      }
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Answer
                    </button>
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
