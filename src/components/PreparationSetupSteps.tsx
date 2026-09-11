import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Plus,
  Trash2,
  Sliders,
  Star,
  FileText,
  BookOpen,
  Pin,
  Zap,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Scale,
  Gauge,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PreparationSetup, ContentTypeId, DifficultyLevel, ExamSectionConfig } from '../types';

interface PreparationSetupStepsProps {
  setup: PreparationSetup;
  onUpdateSetup: (newSetup: PreparationSetup) => void;
  onStartGeneration: () => void;
  isGenerating: boolean;
  onBackToUpload?: () => void;
}

const AVAILABLE_MARKS = [2, 4, 5, 6, 8, 10];

const CONTENT_TYPES: {
  id: ContentTypeId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}[] = [
  {
    id: 'important_questions',
    label: 'Important Questions',
    description: 'High-yield questions categorized by exam priority & probability',
    icon: Star,
    badge: '⭐ Core Focus'
  },
  {
    id: 'short_notes',
    label: 'Short Notes',
    description: 'Concise, high-impact revision summaries and technical bullet points',
    icon: FileText,
    badge: '📝 Quick Revision'
  },
  {
    id: 'long_answers',
    label: 'Long Answers',
    description: 'Comprehensive 8–10 mark descriptive answers with headings',
    icon: BookOpen,
    badge: '📖 Deep Dive'
  },
  {
    id: 'definitions',
    label: 'Definitions',
    description: 'Precise 2-mark definitions with standard academic keywords',
    icon: Pin,
    badge: '📌 2 Marks Essential'
  },
  {
    id: 'key_points',
    label: 'Key Points',
    description: 'Fast-recall bullet comparisons, formulas, and fundamental laws',
    icon: Zap,
    badge: '⚡ Fast Recall'
  },
  {
    id: 'sample_questions',
    label: 'Sample Questions',
    description: 'Application & numerical questions with step-by-step solutions',
    icon: HelpCircle,
    badge: '❓ Practice Set'
  },
  {
    id: 'question_paper',
    label: 'Question Paper',
    description: 'University-standard printable model paper with section breakdown',
    icon: FileSpreadsheet,
    badge: '📄 University Format'
  },
  {
    id: 'answer_key',
    label: 'Answer Key',
    description: 'Step-by-step scoring schemes & model answers for the paper',
    icon: CheckCircle2,
    badge: '✅ Marking Scheme'
  }
];

const DIFFICULTY_OPTIONS: {
  id: DifficultyLevel;
  label: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: 'easy',
    label: 'Easy / Foundational',
    subtitle: 'Direct questions & basic definitions',
    description: 'Ideal for initial review, memory verification, and direct conceptual definitions.'
  },
  {
    id: 'moderate',
    label: 'Moderate / University Level',
    subtitle: 'Standard exam pattern with balanced depth',
    description: 'Accurately reflects typical university semester examinations with conceptual and analytical balance.'
  },
  {
    id: 'hard',
    label: 'Hard / In-Depth',
    subtitle: 'Analytical reasoning & complex derivations',
    description: 'Focuses on multi-part questions, edge cases, system architecture, and deep technical problems.'
  },
  {
    id: 'university',
    label: 'Competitive / University Board',
    subtitle: 'Strict past-paper rigorous pattern',
    description: 'Modeled after stringent autonomous university standards and competitive gatekeeper papers.'
  }
];

export const PreparationSetupSteps: React.FC<PreparationSetupStepsProps> = ({
  setup,
  onUpdateSetup,
  onStartGeneration,
  isGenerating,
  onBackToUpload,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [customMarkInput, setCustomMarkInput] = useState<string>('');
  const [showCustomMarkInput, setShowCustomMarkInput] = useState(false);

  // Compute Total Marks from sections
  const totalCalculatedMarks = setup.sections.reduce(
    (sum, sec) => sum + sec.questionCount * sec.marksPerQuestion,
    0
  );

  // Step 1: Toggle Marks
  const toggleMark = (mark: number) => {
    const exists = setup.selectedMarks.includes(mark);
    const updated = exists
      ? setup.selectedMarks.filter((m) => m !== mark)
      : [...setup.selectedMarks, mark].sort((a, b) => a - b);
    onUpdateSetup({ ...setup, selectedMarks: updated });
  };

  const handleAddCustomMark = () => {
    const num = parseInt(customMarkInput.trim(), 10);
    if (!isNaN(num) && num > 0 && !setup.selectedMarks.includes(num)) {
      const updated = [...setup.selectedMarks, num].sort((a, b) => a - b);
      onUpdateSetup({ ...setup, selectedMarks: updated });
      setCustomMarkInput('');
      setShowCustomMarkInput(false);
    }
  };

  // Sections management
  const updateSection = (id: string, field: keyof ExamSectionConfig, value: any) => {
    const updated = setup.sections.map((sec) => {
      if (sec.id === id) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    onUpdateSetup({ ...setup, sections: updated });
  };

  const addSection = () => {
    const nextIdx = setup.sections.length;
    const name = setup.startOptionNumberFromZero !== false ? `Section ${nextIdx}` : `Section ${String.fromCharCode(65 + nextIdx)}`;
    const newSection: ExamSectionConfig = {
      id: `sec-${Date.now()}`,
      name,
      questionCount: 3,
      marksPerQuestion: 5
    };
    onUpdateSetup({ ...setup, sections: [...setup.sections, newSection] });
  };

  const removeSection = (id: string) => {
    if (setup.sections.length <= 1) return;
    const updated = setup.sections.filter((sec) => sec.id !== id);
    onUpdateSetup({ ...setup, sections: updated });
  };

  // Step 3: Toggle Content Type
  const toggleContent = (id: ContentTypeId) => {
    const exists = setup.selectedContent.includes(id);
    const updated = exists
      ? setup.selectedContent.filter((c) => c !== id)
      : [...setup.selectedContent, id];
    onUpdateSetup({ ...setup, selectedContent: updated });
  };

  const selectAllContent = () => {
    onUpdateSetup({
      ...setup,
      selectedContent: CONTENT_TYPES.map((c) => c.id)
    });
  };

  const stepsList = [
    { num: 1, label: '01 — Marks', title: 'Marks & Section Builder' },
    { num: 2, label: '02 — Difficulty', title: 'Difficulty & Academic Tone' },
    { num: 3, label: '03 — Content', title: 'Content Pack Selection' },
    { num: 4, label: '04 — Generate', title: 'Review & Compile Pack' }
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* MODERN STEP PROGRESS INDICATOR */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {stepsList.map((st) => {
            const isActive = activeStep === st.num;
            const isCompleted = activeStep > st.num;

            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num as any)}
                className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500/80 ring-2 ring-blue-500/20 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
                    : 'bg-transparent border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                  {isCompleted && (
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold truncate ${
                    isActive
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: MARKS & QUESTION PAPER BUILDER */}
      {activeStep === 1 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 01
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Marks Selection & Question Paper Builder
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select question mark tiers and customize sections for your official university model paper.
            </p>
          </div>

          {/* MARKS INTERACTIVE CARDS */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 block">
              Marks Hierarchy (Select Mark Weights)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {AVAILABLE_MARKS.map((mark) => {
                const isSelected = setup.selectedMarks.includes(mark);
                return (
                  <button
                    key={mark}
                    type="button"
                    onClick={() => toggleMark(mark)}
                    className={`relative p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </span>
                    )}
                    <span className="text-2xl font-black block leading-none">{mark}</span>
                    <span className="text-[11px] font-semibold opacity-85 mt-1 block uppercase tracking-wider">
                      Marks
                    </span>
                  </button>
                );
              })}

              {/* Custom Mark Card */}
              {showCustomMarkInput ? (
                <div className="p-3 rounded-2xl border border-blue-400 bg-blue-50/50 dark:bg-slate-800 flex flex-col justify-between">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 15"
                    value={customMarkInput}
                    onChange={(e) => setCustomMarkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomMark()}
                    className="w-full text-center text-lg font-bold bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                    autoFocus
                  />
                  <div className="flex gap-1 mt-2">
                    <button
                      type="button"
                      onClick={handleAddCustomMark}
                      className="flex-1 py-1 text-[11px] font-bold bg-blue-600 text-white rounded-md"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomMarkInput(false)}
                      className="px-2 py-1 text-[11px] bg-slate-200 dark:bg-slate-700 rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomMarkInput(true)}
                  className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center cursor-pointer"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Custom</span>
                </button>
              )}
            </div>
          </div>

          {/* QUESTION PAPER BUILDER INTERFACE */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Question Paper Builder
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Design section breakdown. Total marks recalculate automatically in real-time.
                </p>
              </div>

              {/* Total Marks Pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white shadow-sm self-start sm:self-auto">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                  Total Marks:
                </span>
                <span className="text-xl font-black">{totalCalculatedMarks}</span>
              </div>
            </div>

            {/* Zero-Indexed Numbering Control */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Question & Option Numbering Starts from 0
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {setup.startOptionNumberFromZero !== false ? 'Enabled (Q0, Sec 0)' : 'Disabled (Q1, Sec A)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  When enabled, questions begin at <strong className="text-blue-600 dark:text-blue-400">Q0</strong>, sections begin at <strong className="text-blue-600 dark:text-blue-400">Section 0</strong>, and alternative choices start at Option 0.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = setup.startOptionNumberFromZero !== false;
                  const nextVal = !current;
                  // Update section names accordingly if default
                  const updatedSections = setup.sections.map((sec, idx) => {
                    if (nextVal && sec.name.startsWith('Section ')) {
                      return { ...sec, name: `Section ${idx}` };
                    } else if (!nextVal && sec.name.startsWith('Section ')) {
                      return { ...sec, name: `Section ${String.fromCharCode(65 + idx)}` };
                    }
                    return sec;
                  });
                  onUpdateSetup({ ...setup, startOptionNumberFromZero: nextVal, sections: updatedSections });
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  setup.startOptionNumberFromZero !== false ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={setup.startOptionNumberFromZero !== false}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    setup.startOptionNumberFromZero !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sections List */}
            <div className="space-y-3">
              {setup.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {setup.startOptionNumberFromZero !== false ? idx : String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      value={sec.name}
                      onChange={(e) => updateSection(sec.id, 'name', e.target.value)}
                      className="text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 px-1 py-0.5 w-32 sm:w-40"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Questions count */}
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={sec.questionCount}
                        onChange={(e) =>
                          updateSection(sec.id, 'questionCount', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-10 text-center font-bold text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">questions</span>
                    </div>

                    <span className="text-slate-400 font-semibold">×</span>

                    {/* Marks per question */}
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={sec.marksPerQuestion}
                        onChange={(e) =>
                          updateSection(sec.id, 'marksPerQuestion', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-10 text-center font-bold text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">marks</span>
                    </div>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 min-w-[50px] text-right">
                      = {sec.questionCount * sec.marksPerQuestion} pts
                    </span>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeSection(sec.id)}
                      disabled={setup.sections.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto sm:ml-0 cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Section Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl border border-blue-200 dark:border-blue-900 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                {setup.sections.length} Sections configured
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {onBackToUpload ? (
              <button
                type="button"
                onClick={onBackToUpload}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
                title="Change or remove uploaded material"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Upload
              </button>
            ) : <div />}
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              Continue to Difficulty
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DIFFICULTY */}
      {activeStep === 2 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 02
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Exam Difficulty & Academic Rigor
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select the cognitive complexity level and academic expectations for generated questions.
            </p>
          </div>

          {/* Subject override option */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Subject Name (Optional Override)
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Networks & Security"
              value={setup.subjectName}
              onChange={(e) => onUpdateSetup({ ...setup, subjectName: e.target.value })}
              className="px-3.5 py-1.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 sm:w-72"
            />
          </div>

          {/* Difficulty Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFICULTY_OPTIONS.map((diff) => {
              const isSelected = setup.difficulty === diff.id;
              return (
                <div
                  key={diff.id}
                  onClick={() => onUpdateSetup({ ...setup, difficulty: diff.id })}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {diff.label}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {diff.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              Continue to Content
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTENT SELECTION */}
      {activeStep === 3 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Step 03
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Content Selection
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the examination preparation modules to generate from your study material.
              </p>
            </div>

            <button
              type="button"
              onClick={selectAllContent}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto cursor-pointer"
            >
              Select All (8 Modules)
            </button>
          </div>

          {/* INTERACTIVE CONTENT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CONTENT_TYPES.map((ct) => {
              const isSelected = setup.selectedContent.includes(ct.id);
              const Icon = ct.icon;

              return (
                <div
                  key={ct.id}
                  onClick={() => toggleContent(ct.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {ct.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {ct.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      {ct.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              disabled={setup.selectedContent.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              Review & Generate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: GENERATE / REVIEW */}
      {activeStep === 4 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Step 04
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Review & Launch AI Generation
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ExamForge AI is ready to synthesize your study material into an all-in-one preparation package.
            </p>
          </div>

          {/* SUMMARY REVIEW CARD */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Configuration Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-medium">Difficulty Level</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase mt-0.5">
                  {setup.difficulty}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-medium">Question Paper Total</span>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {totalCalculatedMarks} Marks ({setup.sections.length} Sections)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400 font-medium">Content Modules</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {setup.selectedContent.length} Modules Selected
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Active Modules:
              </span>
              <div className="flex flex-wrap gap-2">
                {setup.selectedContent.map((cid) => {
                  const item = CONTENT_TYPES.find((c) => c.id === cid);
                  return (
                    <span
                      key={cid}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                    >
                      {item?.label || cid}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN GENERATE ACTION BUTTON */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white text-center space-y-4 shadow-xl shadow-blue-500/15">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Ready to Forge Your Exam Pack
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto leading-relaxed">
              Synthesizing high-yield questions, model question paper, structured answers, and rapid revision notes.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onStartGeneration}
                disabled={isGenerating}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-base shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-blue-600" />
                Create Exam Preparation
              </button>
            </div>
          </div>

          <div className="flex items-center justify-start pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
