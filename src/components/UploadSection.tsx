import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  FileText,
  UploadCloud,
  FileCode,
  Trash2,
  FileCheck,
  AlertTriangle,
  RotateCw,
  Sparkles,
  BookMarked,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { UploadedFile } from '../types';
import { SAMPLE_STUDY_MATERIALS } from '../sampleData';

interface UploadSectionProps {
  uploadedFile: UploadedFile | null;
  onFileUpload: (file: UploadedFile) => void;
  onRemoveFile: () => void;
  onLoadSample: (sampleId: string) => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  uploadedFile,
  onFileUpload,
  onRemoveFile,
  onLoadSample,
  errorMessage,
  onClearError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPastingText, setIsPastingText] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.pptx', '.txt', '.md'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExt) {
      onClearError();
      return;
    }

    try {
      let textContent = '';
      let base64Data: string | undefined = undefined;

      if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        textContent = await file.text();
      } else {
        // Read file array buffer / base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });

        base64Data = await base64Promise;
        // Also provide descriptive text envelope
        textContent = `[Attached Document: ${file.name}, Type: ${file.type || 'Binary Document'}, Size: ${file.size} bytes]`;
      }

      const uploaded: UploadedFile = {
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        size: file.size,
        formattedSize: formatFileSize(file.size),
        textContent,
        base64Data,
        mimeType: file.type || 'application/octet-stream',
      };

      onFileUpload(uploaded);
    } catch (err) {
      console.error('File parsing error:', err);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    const title = pastedTitle.trim() || 'Pasted_Study_Notes.txt';
    const uploaded: UploadedFile = {
      name: title.endsWith('.txt') ? title : `${title}.txt`,
      type: 'TXT',
      size: new Blob([pastedText]).size,
      formattedSize: formatFileSize(new Blob([pastedText]).size),
      textContent: pastedText,
      mimeType: 'text/plain',
    };
    onFileUpload(uploaded);
    setIsPastingText(false);
  };

  return (
    <div className="w-full">
      {/* ERROR STATE */}
      {errorMessage && (
        <div className="mb-6 p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center animate-in fade-in duration-200 shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-100">
            We couldn't read this file
          </h3>
          <p className="text-sm text-rose-700 dark:text-rose-300 mt-1 max-w-md mx-auto">
            {errorMessage || 'Please upload a valid PDF, DOCX, PPTX or TXT file.'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                onClearError();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                onClearError();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}

      {/* FILE PREVIEW CARD (WHEN FILE IS UPLOADED) */}
      {uploadedFile ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {uploadedFile.type}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {uploadedFile.formattedSize}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 break-all">
                  {uploadedFile.name}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Document verified & ready for examination compilation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onRemoveFile}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Remove this file"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN LARGE UPLOAD CARD */
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-lg scale-[1.005]'
                : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/70 dark:hover:bg-slate-900 shadow-sm'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.pptx,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-5 tracking-tight">
              Upload Study Material
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              PDF, DOCX, PPTX or TXT
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                Drag & drop area
              </span>
              <span className="hidden sm:inline text-xs text-slate-300 dark:text-slate-600">OR</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                Browse Files
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
              Upload lecture slides, course syllabus, textbook chapters, or question banks
            </p>
          </div>

          {/* Quick Paste or Sample Materials */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Quick Sample Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Quick Test Samples:
              </span>
              {SAMPLE_STUDY_MATERIALS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookMarked className="w-3 h-3 text-blue-500" />
                  {sample.subject}
                </button>
              ))}
            </div>

            {/* Paste Text Option */}
            <button
              onClick={() => setIsPastingText(!isPastingText)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center sm:justify-start gap-1 py-1 cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              {isPastingText ? 'Hide Text Input' : 'Paste Notes Directly'}
            </button>
          </div>

          {/* Direct Text Paste Modal / Box */}
          {isPastingText && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Paste Study Notes / Syllabus Text
                </label>
                <button
                  onClick={() => setIsPastingText(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                placeholder="Subject / Chapter Name (e.g. Distributed Systems Unit 2)"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
              <textarea
                rows={5}
                placeholder="Paste your course syllabus, lecture transcript, or study summary here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed resize-y"
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePasteSubmit}
                  disabled={!pastedText.trim()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
                >
                  Confirm & Load Notes
                </button>
              </div>
            </div>
          )}

          {/* EMPTY STATE HELPER BANNER */}
          <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/60 text-center">
            <div className="w-10 h-10 mx-auto mb-2 text-slate-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Start your preparation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
              Upload your study material to generate exam-ready content, important questions, model papers, and answers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
