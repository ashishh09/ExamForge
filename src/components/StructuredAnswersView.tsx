import React, { useState } from 'react';
import { BookOpen, Copy, Download, Layers, CheckCircle } from 'lucide-react';
import { LongAnswer } from '../types';

interface StructuredAnswersViewProps {
  answers: LongAnswer[];
  onCopyText: (text: string, label: string) => void;
  onDownloadSection: () => void;
}

export const StructuredAnswersView: React.FC<StructuredAnswersViewProps> = ({
  answers,
  onCopyText,
  onDownloadSection,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (la: LongAnswer) => {
    let text = `Q. ${la.question} (${la.marks} Marks)\n\nAnswer\n\nIntroduction:\n${la.introduction}\n\n`;
    la.bodySections.forEach((sec) => {
      text += `${sec.heading}\n`;
      sec.points.forEach((p) => {
        text += `• ${p}\n`;
      });
      text += '\n';
    });
    if (la.conclusion) {
      text += `Conclusion:\n${la.conclusion}\n`;
    }

    onCopyText(text, 'Structured Answer');
    setCopiedId(la.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Structured Long Answers ({answers.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Designed for 8–10 mark university criteria with headings, numbered points, bullet points, and bold terminology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSection}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Answers list */}
      <div className="space-y-6">
        {answers.map((la, index) => (
          <div
            key={la.id || index}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            {/* Top Question banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Descriptive Answer
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {la.category}
                  </span>
                </div>
                <h4 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  Q{index + 1}. {la.question}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <span className="px-3 py-1 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  {la.marks} Marks
                </span>
                <button
                  onClick={() => handleCopy(la)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Copy formatted answer"
                >
                  {copiedId === la.id ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Answer
              </div>

              {/* Introduction */}
              {la.introduction && (
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                    Introduction:
                  </span>
                  {la.introduction}
                </div>
              )}

              {/* Structured Body Sections */}
              <div className="space-y-4 pt-1">
                {la.bodySections.map((sec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5"
                  >
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-blue-600"></span>
                      {sec.heading}
                    </h5>

                    <ul className="space-y-2 pt-1 pl-2 sm:pl-3">
                      {sec.points.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 shrink-0"></span>
                          <span className="flex-1 font-normal">
                            {/* Format bold keywords if syntax has ** */}
                            {pt.split(/(\*\*.*?\*\*)/g).map((segment, segIdx) => {
                              if (segment.startsWith('**') && segment.endsWith('**')) {
                                return (
                                  <strong
                                    key={segIdx}
                                    className="font-bold text-slate-900 dark:text-white"
                                  >
                                    {segment.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return segment;
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Diagram / Structure ASCII box if present */}
              {la.diagramOrStructure && (
                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                    Architectural Flow / Conceptual Diagram:
                  </span>
                  <pre className="leading-tight">{la.diagramOrStructure}</pre>
                </div>
              )}

              {/* Conclusion */}
              {la.conclusion && (
                <div className="pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-bold block mb-0.5">
                      Conclusion & Summary:
                    </strong>
                    {la.conclusion}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
