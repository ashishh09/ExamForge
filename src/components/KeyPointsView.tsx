import React from 'react';
import { Zap, Copy, Download, HelpCircle, CheckCircle } from 'lucide-react';
import { KeyPointGroup, SamplePracticeQuestion } from '../types';

interface KeyPointsViewProps {
  groups: KeyPointGroup[];
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const KeyPointsView: React.FC<KeyPointsViewProps> = ({
  groups,
  onCopyText,
  onDownloadSection,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            Fast-Recall Key Points & Formulae ({groups.length} Concepts)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rapid-fire takeaway bullets, vital rules, equations, and high-impact memory triggers.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((grp) => {
          const title = (grp as any).title || grp.topic || 'Core Concept';
          const category = (grp as any).category || 'Key Concept';
          const textToCopy = `${title} [${category}]\n\n` + grp.points.map((p) => `• ${p}`).join('\n');

          return (
            <div
              key={grp.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                  {category}
                </span>
                <button
                  onClick={() => onCopyText(textToCopy, `Key points on ${title}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy group"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h4>

              <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {grp.points.map((pt, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SampleQuestionsViewProps {
  questions: SamplePracticeQuestion[];
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const SampleQuestionsView: React.FC<SampleQuestionsViewProps> = ({
  questions,
  onCopyText,
  onDownloadSection,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Applied Practice Questions & Scenarios ({questions.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scenario-based problems and numerical calculations with worked solutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {q.type}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {q.marks} Marks
                </span>
              </div>
              <button
                onClick={() =>
                  onCopyText(
                    `Practice Q${idx + 1}: ${q.question}\n\nSolution:\n${q.solution}\n\nGuideline / Hint:\n${q.hintOrGuideline || (q as any).explanation || ''}`,
                    `Practice Question ${idx + 1}`
                  )
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Q{idx + 1}. {q.question}
            </h4>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Step-by-Step Solution:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {q.solution}
              </p>
            </div>

            {(q.hintOrGuideline || (q as any).explanation) && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Guideline / Hint: {q.hintOrGuideline || (q as any).explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
