import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileText,
  Star,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  PackageCheck,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { ExamPreparationPack } from '../types';
import {
  exportImportantQuestionsPDF,
  exportShortNotesPDF,
  exportLongAnswersPDF,
  exportQuestionPaperPDF,
  exportAnswerKeyPDF,
  exportCompletePackPDF,
} from '../utils/pdfExport';

interface DownloadMenuProps {
  pack: ExamPreparationPack;
  onDownloadSuccess: (title: string) => void;
  onDownloadError: (err: string) => void;
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({
  pack,
  onDownloadSuccess,
  onDownloadError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (type: string, exportFn: (pack: ExamPreparationPack) => void, title: string) => {
    try {
      setIsExporting(type);
      // Give UI 1 frame to render loading state
      await new Promise((resolve) => setTimeout(resolve, 60));
      exportFn(pack);
      onDownloadSuccess(`${title} downloaded successfully`);
      setIsOpen(false);
    } catch (err: any) {
      console.error('PDF export failed:', err);
      onDownloadError(err?.message || 'Failed to generate PDF document');
    } finally {
      setIsExporting(null);
    }
  };

  const options = [
    {
      id: 'full',
      label: 'Complete Preparation Pack',
      subtitle: 'All modules, question paper, answers & notes',
      icon: PackageCheck,
      highlight: true,
      action: () => handleDownload('full', exportCompletePackPDF, 'Complete Preparation Pack PDF'),
    },
    {
      id: 'paper',
      label: 'Question Paper',
      subtitle: 'University examination model paper layout',
      icon: FileSpreadsheet,
      action: () => handleDownload('paper', exportQuestionPaperPDF, 'Model Question Paper PDF'),
    },
    {
      id: 'answers',
      label: 'Answer Key & Schemes',
      subtitle: 'Step-by-step scoring rubric & model answers',
      icon: CheckCircle2,
      action: () => handleDownload('answers', exportAnswerKeyPDF, 'Answer Key & Schemes PDF'),
    },
    {
      id: 'important',
      label: 'Important Questions',
      subtitle: 'Curated high-priority exam questions',
      icon: Star,
      action: () => handleDownload('important', exportImportantQuestionsPDF, 'Important Questions PDF'),
    },
    {
      id: 'notes',
      label: 'Short Notes & Formulas',
      subtitle: 'Rapid review summaries and key bullets',
      icon: FileText,
      action: () => handleDownload('notes', exportShortNotesPDF, 'Short Notes PDF'),
    },
    {
      id: 'long',
      label: 'Long Answers',
      subtitle: 'Comprehensive 8–10 mark structured answers',
      icon: BookOpen,
      action: () => handleDownload('long', exportLongAnswersPDF, 'Structured Answers PDF'),
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting !== null}
        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>Download as PDF</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-40 py-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select PDF Export Format
            </span>
          </div>

          <div className="p-1.5 space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isLoadingThis = isExporting === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={opt.action}
                  disabled={isExporting !== null}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                    opt.highlight
                      ? 'bg-blue-50/70 dark:bg-blue-950/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      opt.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isLoadingThis ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold block leading-snug truncate">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight truncate">
                      {opt.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
