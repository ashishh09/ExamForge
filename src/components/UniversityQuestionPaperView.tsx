import React from 'react';
import { Printer, Download, Copy, Share2, Award, FileSpreadsheet } from 'lucide-react';
import { QuestionPaper, ExamPreparationPack } from '../types';

interface UniversityQuestionPaperViewProps {
  pack: ExamPreparationPack;
  onDownloadPDF: () => void;
  onCopyText: (text: string, label: string) => void;
}

export const UniversityQuestionPaperView: React.FC<UniversityQuestionPaperViewProps> = ({
  pack,
  onDownloadPDF,
  onCopyText,
}) => {
  const paper = pack.questionPaper;

  const handlePrint = () => {
    window.print();
  };

  const formatPlainTextPaper = () => {
    let text = `====================================================\n`;
    text += `${paper.institution || 'EXAMFORGE AI UNIVERSITY'}\n`;
    text += `${paper.examination || 'MODEL SEMESTER EXAMINATION'}\n`;
    text += `Subject: ${paper.subject}\n`;
    text += `Time: ${paper.timeAllowed || '3 Hours'}      Maximum Marks: ${paper.maximumMarks || pack.metadata.totalMarks}\n`;
    text += `====================================================\n\n`;

    if (paper.instructions && paper.instructions.length > 0) {
      text += `General Instructions:\n`;
      paper.instructions.forEach((ins, idx) => {
        text += `${idx}. ${ins}\n`;
      });
      text += `\n----------------------------------------------------\n\n`;
    }

    paper.sections.forEach((sec) => {
      text += `${sec.name}\n`;
      text += `(${sec.instruction} - Total: ${sec.totalMarks} Marks)\n\n`;
      sec.questions.forEach((q) => {
        text += `${q.questionNumber}. ${q.text}  (${q.marks})\n`;
        if (q.hasChoice && q.orQuestion) {
          text += `     [OR]\n`;
          text += `   ${q.orQuestion}  (${q.marks})\n`;
        }
      });
      text += `\n----------------------------------------------------\n\n`;
    });

    return text;
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            University Model Question Paper
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Formatted to official university exam standards. Ready for printing or export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onCopyText(formatPlainTextPaper(), 'Question Paper')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Paper
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            onClick={onDownloadPDF}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* THE ACTUAL UNIVERSITY EXAMINATION PAPER CARD */}
      <div className="print-area p-8 sm:p-14 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-800 shadow-md max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:text-black">
        {/* Paper Header */}
        <div className="text-center space-y-1.5 pb-4">
          <p className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            {paper.institution || 'EXAMFORGE AI UNIVERSITY'}
          </p>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white print:text-black">
            {paper.examination || 'MODEL SEMESTER EXAMINATION'}
          </h2>
          <div className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 print:text-black pt-1">
            Subject: {paper.subject}
          </div>

          {/* Double Separator Line */}
          <div className="pt-3 space-y-1">
            <div className="w-full border-t-2 border-slate-900 dark:border-slate-300 print:border-black"></div>
            <div className="w-full border-t border-slate-400 dark:border-slate-600 print:border-black"></div>
          </div>

          {/* Time & Max Marks Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2 px-1 text-slate-800 dark:text-slate-200 print:text-black">
            <span>Time Allowed: {paper.timeAllowed || '3 Hours'}</span>
            <span>Maximum Marks: {paper.maximumMarks || pack.metadata.totalMarks}</span>
          </div>

          <div className="w-full border-t border-slate-300 dark:border-slate-700 print:border-black pt-2"></div>
        </div>

        {/* General Instructions */}
        {paper.instructions && paper.instructions.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 print:bg-transparent border border-slate-200 dark:border-slate-700/60 print:border-none space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-black block">
              General Instructions:
            </span>
            <ol start={0} className="text-xs space-y-1 text-slate-700 dark:text-slate-300 print:text-black font-medium pl-4 list-decimal">
              {paper.instructions.map((inst, i) => (
                <li key={i} value={i}>{inst}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8 pt-2">
          {paper.sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-4">
              {/* Section Title */}
              <div className="text-center space-y-0.5 border-b border-slate-200 dark:border-slate-800 print:border-black pb-2">
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
                  {sec.name}
                </h3>
                <p className="text-xs italic text-slate-500 dark:text-slate-400 print:text-black">
                  ({sec.instruction} — Total: {sec.totalMarks} Marks)
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {sec.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2">
                    <div className="flex items-start justify-between gap-4 text-xs sm:text-sm">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="font-extrabold text-slate-900 dark:text-white print:text-black min-w-[32px]">
                          {q.questionNumber}.
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 print:text-black leading-relaxed font-medium">
                          {q.text}
                        </p>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 print:text-black shrink-0">
                        ({q.marks})
                      </span>
                    </div>

                    {/* Choice / OR option */}
                    {q.hasChoice && q.orQuestion && (
                      <div className="pl-11 space-y-1">
                        <div className="text-xs font-bold uppercase italic text-slate-400 dark:text-slate-500 text-center py-0.5">
                          [ OR ]
                        </div>
                        <div className="flex items-start justify-between gap-4 text-xs sm:text-sm">
                          <p className="text-slate-800 dark:text-slate-200 print:text-black leading-relaxed font-medium">
                            {q.orQuestion}
                          </p>
                          <span className="font-bold text-slate-700 dark:text-slate-300 print:text-black shrink-0">
                            ({q.marks})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Paper End Mark */}
        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 print:border-black">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 print:text-black">
            *** END OF EXAMINATION PAPER ***
          </p>
        </div>
      </div>
    </div>
  );
};
