import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { PreparationSetupSteps } from './components/PreparationSetupSteps';
import { GenerationScreen } from './components/GenerationScreen';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { OfflineBanner } from './components/OfflineBanner';
import { GetTheAppSection } from './components/GetTheAppSection';
import { PWAInstallButton } from './components/PWAInstallButton';
import { UploadedFile, PreparationSetup, ExamPreparationPack, StepId } from './types';
import { SAMPLE_STUDY_MATERIALS, generatePackLocally } from './sampleData';
import { registerSW } from 'virtual:pwa-register';

const DEFAULT_SETUP: PreparationSetup = {
  selectedMarks: [2, 5, 10],
  customMarks: [],
  difficulty: 'moderate',
  subjectName: '',
  examTitle: 'Model Semester Examination',
  startOptionNumberFromZero: true,
  sections: [
    { id: 'sec-0', name: 'Section 0', questionCount: 5, marksPerQuestion: 2 },
    { id: 'sec-1', name: 'Section 1', questionCount: 4, marksPerQuestion: 5 },
    { id: 'sec-2', name: 'Section 2', questionCount: 2, marksPerQuestion: 10 },
  ],
  selectedContent: [
    'important_questions',
    'short_notes',
    'long_answers',
    'definitions',
    'key_points',
    'sample_questions',
    'question_paper',
    'answer_key',
  ],
};

export function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('examforge_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main state
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [setup, setSetup] = useState<PreparationSetup>(DEFAULT_SETUP);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStepId, setCurrentStepId] = useState<StepId>('reading_doc');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [pack, setPack] = useState<ExamPreparationPack | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to <html>, <body>, and style color-scheme
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
      localStorage.setItem('examforge_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
      localStorage.setItem('examforge_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Copy helper
  const handleCopyText = useCallback(
    async (text: string, label: string) => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          addToast('success', 'Copied to clipboard', `${label} is ready to paste.`);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          addToast('success', 'Copied to clipboard', `${label} is ready to paste.`);
        }
      } catch (err) {
        addToast('error', 'Copy failed', 'Please allow clipboard permissions.');
      }
    },
    [addToast]
  );

  // Register PWA Service Worker for app-shell caching
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        registerSW({
          immediate: true,
          onNeedRefresh() {
            addToast('info', 'Update Available', 'A new version of ExamForge AI is available.');
          },
          onOfflineReady() {
            addToast('success', 'Offline Ready', 'ExamForge AI app shell cached for offline access.');
          },
        });
      } catch (e) {
        console.warn('PWA service worker registration notice:', e);
      }
    }
  }, [addToast]);

  // File handling
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setErrorMessage(null);
    // If subject is blank, set from file name
    if (!setup.subjectName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setSetup((prev) => ({ ...prev, subjectName: cleanName }));
    }
    addToast('info', 'File Uploaded', `${file.name} ready for configuration.`);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPack(null);
    setErrorMessage(null);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_STUDY_MATERIALS.find((s) => s.id === sampleId);
    if (!sample) return;

    const file: UploadedFile = {
      name: sample.name,
      type: 'TXT',
      size: new Blob([sample.content]).size,
      formattedSize: `${(new Blob([sample.content]).size / 1024).toFixed(1)} KB`,
      textContent: sample.content,
      mimeType: 'text/plain',
    };

    setUploadedFile(file);
    setSetup((prev) => ({ ...prev, subjectName: sample.subject }));
    setErrorMessage(null);
    addToast('success', 'Sample Material Loaded', `${sample.subject} ready for preparation.`);
  };

  const handleReset = () => {
    setPack(null);
    setUploadedFile(null);
    setErrorMessage(null);
    setSetup(DEFAULT_SETUP);
  };

  const handleBackToSetup = () => {
    setPack(null);
    setIsGenerating(false);
    setErrorMessage(null);
  };

  // Generation Handler
  const handleStartGeneration = async () => {
    if (!uploadedFile) {
      setErrorMessage('Please upload or select study material before generating.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setCompletedSteps([]);
    setCurrentStepId('reading_doc');
    setStatusMessage('Reading document and parsing syllabus structure...');

    try {
      // Initiate streaming request to server
      const response = await fetch('/api/exam/generate-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: uploadedFile,
          setup,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let receivedCompletePack: ExamPreparationPack | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventType = 'message';
          let eventData = '';

          const blockLines = block.split('\n');
          for (const line of blockLines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              eventData = line.slice(6).trim();
            }
          }

          if (eventType === 'step') {
            try {
              const stepPayload = JSON.parse(eventData);
              setCurrentStepId(stepPayload.stepId);
              setStatusMessage(stepPayload.message);

              // Mark previous steps complete
              setCompletedSteps((prev) => {
                if (stepPayload.completedStepId && !prev.includes(stepPayload.completedStepId)) {
                  return [...prev, stepPayload.completedStepId];
                }
                return prev;
              });
            } catch (e) {
              console.error('Error parsing step event:', e);
            }
          } else if (eventType === 'complete') {
            try {
              const completePayload = JSON.parse(eventData);
              if (completePayload.pack) {
                receivedCompletePack = completePayload.pack;
                setCompletedSteps([
                  'reading_doc',
                  'identifying_concepts',
                  'generating_questions',
                  'preparing_answers',
                  'creating_paper',
                ]);
              }
            } catch (e) {
              console.error('Error parsing complete event:', e);
            }
          } else if (eventType === 'error') {
            try {
              const errPayload = JSON.parse(eventData);
              console.warn('Server generation notice:', errPayload.message);
            } catch (e) {
              console.error('Error parsing error event:', e);
            }
          }
        }
      }

      // If we received a pack from the AI server
      if (receivedCompletePack) {
        setPack(receivedCompletePack);
        setIsGenerating(false);
        addToast(
          'success',
          'Exam Pack Ready',
          `Generated comprehensive pack for ${receivedCompletePack.metadata.subject}`
        );
      } else {
        // Fallback local deterministic synthesis
        console.info('Generating pack locally via fallback engine...');
        const localPack = generatePackLocally(uploadedFile, setup);
        setPack(localPack);
        setIsGenerating(false);
        addToast(
          'success',
          'Exam Pack Ready',
          `Successfully compiled examination pack for ${localPack.metadata.subject}`
        );
      }
    } catch (err: any) {
      console.warn('Streaming error, activating deterministic local engine:', err);
      // Graceful fallback to client generation engine
      try {
        const localPack = generatePackLocally(uploadedFile, setup);
        setPack(localPack);
        setIsGenerating(false);
        addToast(
          'success',
          'Exam Pack Ready',
          `Generated model paper and study pack for ${localPack.metadata.subject}`
        );
      } catch (fallbackErr) {
        setIsGenerating(false);
        setErrorMessage('Failed to generate exam material. Please try uploading another document.');
        addToast('error', 'Generation Error', 'Unable to complete exam preparation.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Toast Notifications container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        onReset={handleReset}
        hasPack={!!pack}
        onBack={
          pack
            ? handleBackToSetup
            : isGenerating
            ? handleBackToSetup
            : uploadedFile
            ? handleRemoveFile
            : undefined
        }
        backLabel={
          pack
            ? 'Back to Setup'
            : isGenerating
            ? 'Cancel'
            : uploadedFile
            ? 'Back to Upload'
            : undefined
        }
      />

      {/* Offline connectivity banner */}
      <OfflineBanner />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 sm:pb-16">
        {/* VIEW 1: GENERATING STATE */}
        {isGenerating ? (
          <GenerationScreen
            currentStepId={currentStepId}
            statusMessage={statusMessage}
            completedSteps={completedSteps}
            onCancel={handleBackToSetup}
          />
        ) : pack ? (
          /* VIEW 2: RESULTS DASHBOARD */
          <ResultsDashboard
            pack={pack}
            onCopyText={handleCopyText}
            onDownloadSuccess={(msg) => addToast('success', 'PDF downloaded successfully', msg)}
            onDownloadError={(err) => addToast('error', 'Download Failed', err)}
            onStartNewPrep={handleReset}
            onBackToSetup={handleBackToSetup}
          />
        ) : (
          /* VIEW 3: HOME / UPLOAD & SETUP */
          <div className="space-y-10">
            {/* Intro Hero banner */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                Autonomous University Preparation Engine
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ExamForge AI
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Turn your study material into exam-ready preparation.
              </p>

              {/* Prominent Home Screen Install App Button */}
              <div className="pt-2 flex justify-center">
                <PWAInstallButton variant="primary" showInstalledState={true} />
              </div>
            </div>

            {/* Upload Section */}
            <UploadSection
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
              onLoadSample={handleLoadSample}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />

            {/* Step Configuration Setup (Shown when document is uploaded) */}
            {uploadedFile && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <PreparationSetupSteps
                  setup={setup}
                  onUpdateSetup={setSetup}
                  onStartGeneration={handleStartGeneration}
                  isGenerating={isGenerating}
                  onBackToUpload={handleRemoveFile}
                />
              </div>
            )}

            {/* Get the App Section */}
            <GetTheAppSection />
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
