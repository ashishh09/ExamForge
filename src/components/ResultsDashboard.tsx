import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  FileText,
  BookOpen,
  Pin,
  Zap,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
  Copy,
  Printer,
  ChevronRight,
  Layers,
  Award,
  Hash
} from 'lucide-react';
import { ExamPreparationPack, ActiveTabId } from '../types';
import { ImportantQuestionsView } from './ImportantQuestionsView';
import { StructuredAnswersView } from './StructuredAnswersView';
import { UniversityQuestionPaperView } from './UniversityQuestionPaperView';
import { AnswerKeyView } from './AnswerKeyView';
import { ShortNotesView } from './ShortNotesView';
import { DefinitionsView } from './DefinitionsView';
import { KeyPointsView, SampleQuestionsView } from './KeyPointsView';
import { DownloadMenu } from './DownloadMenu';
import {
  exportImportantQuestionsPDF,
  exportShortNotesPDF,
  exportLongAnswersPDF,
  exportQuestionPaperPDF,
  exportAnswerKeyPDF,
} from '../utils/pdfExport';

interface ResultsDashboardProps {
  pack: ExamPreparationPack;
  onCopyText: (text: string, label: string) => void;
  onDownloadSuccess: (msg: string) => void;
  onDownloadError: (err: string) => void;
  onStartNewPrep: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  pack,
  onCopyText,
  onDownloadSuccess,
  onDownloadError,
  onStartNewPrep,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTabId>('important');

  const keyPointsList = pack.keyPoints || (pack as any).keyPointGroups || [];
  const sampleQuestionsList = pack.sampleQuestions || (pack as any).samplePracticeQuestions || [];

  const totalQuestionsCount =
    pack.importantQuestions.length +
    pack.longAnswers.length +
    sampleQuestionsList.length +
    pack.questionPaper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  const tabs: { id: ActiveTabId; label: string; count?: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'important', label: 'Important', count: pack.importantQuestions.length, icon: Star },
    { id: 'notes', label: 'Notes', count: pack.shortNotes.length, icon: FileText },
    { id: 'answers', label: 'Answers', count: pack.longAnswers.length, icon: BookOpen },
    { id: 'definitions', label: 'Definitions', count: pack.definitions.length, icon: Pin },
    { id: 'key_points', label: 'Key Points', count: keyPointsList.length, icon: Zap },
    { id: 'sample_paper', label: 'Sample Practice', count: sampleQuestionsList.length, icon: HelpCircle },
    { id: 'question_paper', label: 'Question Paper', count: pack.questionPaper.sections.length, icon: FileSpreadsheet },
    { id: 'answer_key', label: 'Answer Key', count: pack.answerKey.length, icon: CheckCircle2 },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              Exam Ready Pack
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {pack.metadata.difficulty.toUpperCase()} Level
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Your Exam Preparation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Subject: <strong className="text-slate-800 dark:text-slate-200">{pack.metadata.subject}</strong> • Synthesized from {pack.metadata.fileName}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          <DownloadMenu
            pack={pack}
            onDownloadSuccess={onDownloadSuccess}
            onDownloadError={onDownloadError}
          />
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 no-print">
        {/* Questions */}
        <div
          onClick={() => setActiveTab('important')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Questions
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Star className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
            {totalQuestionsCount}
          </p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1 block">
            {pack.importantQuestions.length} High-Yield
          </span>
        </div>

        {/* Notes */}
        <div
          onClick={() => setActiveTab('notes')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Notes
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
            {pack.shortNotes.length}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 block">
            Revision Summaries
          </span>
        </div>

        {/* Definitions */}
        <div
          onClick={() => setActiveTab('definitions')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Definitions
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Pin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
            {pack.definitions.length}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 block">
            2 Marks Core
          </span>
        </div>

        {/* Total Marks */}
        <div
          onClick={() => setActiveTab('question_paper')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Marks
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
            {pack.metadata.totalMarks}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            Model Exam Paper
          </span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="sticky top-18 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md py-2 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="min-h-[500px]">
        {activeTab === 'important' && (
          <ImportantQuestionsView
            questions={pack.importantQuestions}
            subject={pack.metadata.subject}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportImportantQuestionsPDF(pack);
                onDownloadSuccess('Important Questions PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'notes' && (
          <ShortNotesView
            notes={pack.shortNotes}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportShortNotesPDF(pack);
                onDownloadSuccess('Short Notes PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'answers' && (
          <StructuredAnswersView
            answers={pack.longAnswers}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportLongAnswersPDF(pack);
                onDownloadSuccess('Structured Answers PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'definitions' && (
          <DefinitionsView
            definitions={pack.definitions}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportShortNotesPDF(pack);
                onDownloadSuccess('Definitions PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'key_points' && (
          <KeyPointsView
            groups={keyPointsList}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportShortNotesPDF(pack);
                onDownloadSuccess('Key Points PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'sample_paper' && (
          <SampleQuestionsView
            questions={sampleQuestionsList}
            onCopyText={onCopyText}
            onDownloadSection={() => {
              try {
                exportImportantQuestionsPDF(pack);
                onDownloadSuccess('Sample Practice Questions PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
          />
        )}

        {activeTab === 'question_paper' && (
          <UniversityQuestionPaperView
            pack={pack}
            onDownloadPDF={() => {
              try {
                exportQuestionPaperPDF(pack);
                onDownloadSuccess('Question Paper PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
            onCopyText={onCopyText}
          />
        )}

        {activeTab === 'answer_key' && (
          <AnswerKeyView
            answerKey={pack.answerKey}
            onDownloadSection={() => {
              try {
                exportAnswerKeyPDF(pack);
                onDownloadSuccess('Answer Key PDF downloaded successfully');
              } catch (e: any) {
                onDownloadError(e.message || 'Failed to download PDF');
              }
            }}
            onCopyText={onCopyText}
          />
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around no-print shadow-lg">
        <button
          onClick={() => setActiveTab('important')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'important' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <Star className="w-4 h-4 mb-0.5" />
          Important
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'notes' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          Notes
        </button>
        <button
          onClick={() => setActiveTab('question_paper')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'question_paper' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 mb-0.5" />
          Paper
        </button>
        <button
          onClick={() => setActiveTab('answer_key')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'answer_key' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mb-0.5" />
          Key
        </button>
      </div>
    </div>
  );
};
