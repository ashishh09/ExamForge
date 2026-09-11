export type ContentTypeId =
  | 'important_questions'
  | 'short_notes'
  | 'long_answers'
  | 'definitions'
  | 'key_points'
  | 'sample_questions'
  | 'question_paper'
  | 'answer_key';

export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'university';

export interface ExamSectionConfig {
  id: string;
  name: string;
  questionCount: number;
  marksPerQuestion: number;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  formattedSize: string;
  textContent: string;
  base64Data?: string;
  mimeType: string;
}

export interface PreparationSetup {
  selectedMarks: number[];
  customMarks: number[];
  difficulty: DifficultyLevel;
  subjectName: string;
  examTitle: string;
  sections: ExamSectionConfig[];
  selectedContent: ContentTypeId[];
  startOptionNumberFromZero?: boolean;
}

export interface ImportantQuestion {
  id: string;
  question: string;
  marks: number;
  priority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'EXPECTED';
  category: string;
  probability: string;
  summaryAnswer: string;
  detailedAnswer: string;
}

export interface ShortNote {
  id: string;
  title: string;
  summary: string;
  bulletPoints: string[];
  keyTerms: string[];
}

export interface LongAnswerSection {
  heading: string;
  points: string[];
}

export interface LongAnswer {
  id: string;
  question: string;
  marks: number;
  category: string;
  introduction: string;
  bodySections: LongAnswerSection[];
  conclusion: string;
  diagramOrStructure?: string;
}

export interface Definition {
  id: string;
  term: string;
  definition: string;
  keyKeywords: string[];
  exampleOrFormula?: string;
  marks: number;
}

export interface KeyPointGroup {
  id: string;
  topic: string;
  points: string[];
}

export interface SampleQuestion {
  id: string;
  question: string;
  marks: number;
  type: 'Conceptual' | 'Application' | 'Numerical / Analytical' | 'Comparative';
  hintOrGuideline: string;
  solution: string;
}

export interface PaperQuestion {
  questionNumber: string;
  text: string;
  marks: number;
  hasChoice?: boolean;
  orQuestion?: string;
}

export interface PaperSection {
  name: string;
  instruction: string;
  totalMarks: number;
  questions: PaperQuestion[];
}

export interface QuestionPaper {
  institution: string;
  examination: string;
  subject: string;
  timeAllowed: string;
  maximumMarks: number;
  instructions: string[];
  sections: PaperSection[];
}

export interface AnswerKeyItem {
  id: string;
  questionNumber: string;
  sectionName: string;
  questionText: string;
  marks: number;
  markingScheme: { step: string; marksAllocated: string }[];
  modelAnswer: string;
  bulletPoints: string[];
}

export interface ExamPreparationPack {
  metadata: {
    generatedAt: string;
    subject: string;
    fileName: string;
    difficulty: DifficultyLevel;
    totalMarks: number;
  };
  importantQuestions: ImportantQuestion[];
  shortNotes: ShortNote[];
  longAnswers: LongAnswer[];
  definitions: Definition[];
  keyPoints: KeyPointGroup[];
  sampleQuestions: SampleQuestion[];
  questionPaper: QuestionPaper;
  answerKey: AnswerKeyItem[];
}

export type StepId =
  | 'reading_doc'
  | 'identifying_concepts'
  | 'generating_questions'
  | 'preparing_answers'
  | 'creating_paper';

export type ActiveTabId =
  | 'important'
  | 'notes'
  | 'answers'
  | 'definitions'
  | 'key_points'
  | 'sample_paper'
  | 'question_paper'
  | 'answer_key';

export type DefinitionItem = Definition;
export type SamplePracticeQuestion = SampleQuestion;

export interface ProgressStep {
  id: StepId;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}
