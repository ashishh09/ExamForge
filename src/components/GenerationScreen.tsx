import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Loader2, Circle, AlertCircle } from 'lucide-react';
import { StepId } from '../types';

interface GenerationScreenProps {
  currentStepId: StepId;
  statusMessage: string;
  completedSteps: StepId[];
  onCancel?: () => void;
}

const STEPS_LIST: { id: StepId; label: string; detail: string }[] = [
  { id: 'reading_doc', label: 'Reading document', detail: 'Parsing document structure & core units' },
  { id: 'identifying_concepts', label: 'Identifying important concepts', detail: 'Locating high-frequency syllabus topics' },
  { id: 'generating_questions', label: 'Generating exam questions', detail: 'Categorizing by marks and exam probability' },
  { id: 'preparing_answers', label: 'Preparing answers', detail: 'Formulating step-by-step marking schemes' },
  { id: 'creating_paper', label: 'Creating question paper', detail: 'Formatting official university examination layout' },
];

export const GenerationScreen: React.FC<GenerationScreenProps> = ({
  currentStepId,
  statusMessage,
  completedSteps,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        {/* Header with subtle pulse */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-inner">
              <Sparkles className="w-8 h-8 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Analyzing your study material
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {statusMessage || 'ExamForge AI is formulating high-yield examination resources...'}
          </p>
        </div>

        {/* Live Step Progress List */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          {STEPS_LIST.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentStepId === step.id && !isCompleted;
            const isPending = !isCompleted && !isActive;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 shadow-2xs'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/40'
                    : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Status Indicator Icon */}
                  <div className="shrink-0 flex items-center justify-center">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <Circle className="w-2 h-2 text-transparent" />
                      </div>
                    )}
                  </div>

                  <div>
                    <span
                      className={`text-sm font-bold block ${
                        isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : isActive
                          ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                      {step.detail}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {isCompleted ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  ) : isActive ? (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                      Processing...
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-600">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational reassurance */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500">
          Synthesizing accurate academic content. This typically takes 5–15 seconds.
        </div>
      </div>
    </div>
  );
};
