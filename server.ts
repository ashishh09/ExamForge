import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Streaming generation endpoint with real SSE progress updates
  app.post('/api/exam/generate-stream', async (req, res) => {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const { textContent, setup, fileName, mimeType, base64Data } = req.body;

      if (!textContent && !base64Data) {
        sendEvent('error', { message: 'No document text or file content provided.' });
        res.end();
        return;
      }

      // Step 1: Reading document
      sendEvent('step', {
        stepId: 'reading_doc',
        message: 'Parsing document structure and extracting syllabus units...',
      });

      // Brief pause to simulate processing stage and send next event
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Identifying important concepts
      sendEvent('step', {
        stepId: 'identifying_concepts',
        message: 'Identifying high-frequency exam topics, definitions & core concepts...',
      });

      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Generating exam questions
      sendEvent('step', {
        stepId: 'generating_questions',
        message: 'Formulating categorized questions based on mark distribution...',
      });

      const ai = getGeminiClient();
      let generatedPack: any = null;

      if (ai) {
        try {
          const prompt = `You are an elite academic professor and examination board chair. 
Analyze the provided study material and generate a comprehensive, highly organized exam preparation package.

Subject Name Override: "${setup.subjectName || ''}"
Difficulty Level: "${setup.difficulty || 'moderate'}"
Selected Marks Hierarchy: ${JSON.stringify(setup.selectedMarks || [2, 5, 10])}
Selected Content Types: ${JSON.stringify(setup.selectedContent || [])}
Sections requested for Model Question Paper: ${JSON.stringify(setup.sections || [
            { name: 'SECTION A', questionCount: 5, marksPerQuestion: 2 },
            { name: 'SECTION B', questionCount: 4, marksPerQuestion: 5 },
            { name: 'SECTION C', questionCount: 2, marksPerQuestion: 10 },
          ])}

Study Material Excerpt:
"""
${(textContent || '').slice(0, 15000)}
"""

CRITICAL REQUIREMENTS:
Generate a valid JSON object strictly matching this schema:
{
  "metadata": {
    "subject": "Name of the subject (e.g. Computer Networks)",
    "difficulty": "${setup.difficulty || 'moderate'}",
    "totalMarks": 50
  },
  "importantQuestions": [
    {
      "id": "iq-1",
      "question": "Clear exam question",
      "marks": 10,
      "priority": "HIGH PRIORITY",
      "category": "Topic Name",
      "probability": "95% Exam Probability",
      "summaryAnswer": "Concise summary",
      "detailedAnswer": "Structured comprehensive markdown answer with ### headings, bold terminology, and bullet points"
    }
  ],
  "shortNotes": [
    {
      "id": "sn-1",
      "title": "Topic Title",
      "summary": "High yield summary",
      "bulletPoints": ["Key point 1", "Key point 2", "Key point 3"],
      "keyTerms": ["Term A", "Term B"]
    }
  ],
  "longAnswers": [
    {
      "id": "la-1",
      "question": "In-depth analytical or descriptive question",
      "marks": 10,
      "category": "Topic",
      "introduction": "Introductory conceptual background",
      "bodySections": [
        {
          "heading": "1. Core Mechanics",
          "points": ["Point 1", "Point 2"]
        }
      ],
      "conclusion": "Summary concluding statement",
      "diagramOrStructure": "Text diagram or ASCII flow where helpful"
    }
  ],
  "definitions": [
    {
      "id": "def-1",
      "term": "Key Concept",
      "definition": "Precise academic definition",
      "keyKeywords": ["Keyword 1", "Keyword 2"],
      "exampleOrFormula": "Formula or practical example",
      "marks": 2
    }
  ],
  "keyPoints": [
    {
      "id": "kp-1",
      "topic": "Topic Heading",
      "points": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "sampleQuestions": [
    {
      "id": "sq-1",
      "question": "Analytical question with solution",
      "marks": 4,
      "type": "Application",
      "hintOrGuideline": "Exam tip",
      "solution": "Step-by-step solution"
    }
  ],
  "questionPaper": {
    "institution": "EXAMFORGE UNIVERSITY MODEL EXAMINATION",
    "examination": "END-SEMESTER DEGREE EXAMINATION",
    "subject": "Extracted Subject Name",
    "timeAllowed": "3 Hours",
    "maximumMarks": 50,
    "instructions": [
      "Answer ALL questions from Section A.",
      "Answer the required number from Section B & C.",
      "Assume suitable data where necessary."
    ],
    "sections": [
      {
        "name": "SECTION A",
        "instruction": "Answer all questions (2 marks each).",
        "totalMarks": 10,
        "questions": [
          { "questionNumber": "Q1", "text": "Question text", "marks": 2 }
        ]
      }
    ]
  },
  "answerKey": [
    {
      "id": "ak-1",
      "questionNumber": "Q1",
      "sectionName": "SECTION A",
      "questionText": "Question text",
      "marks": 2,
      "markingScheme": [
        { "step": "Correct definition", "marksAllocated": "1 Mark" },
        { "step": "Key terminology", "marksAllocated": "1 Mark" }
      ],
      "modelAnswer": "Complete official model answer",
      "bulletPoints": ["Core takeaway 1", "Core takeaway 2"]
    }
  ]
}

Ensure high academic quality, correct university examination question phrasing ("Explain...", "Differentiate between...", "Calculate...", "Illustrate..."), and thorough answers.`;

          // Step 4: Preparing answers
          sendEvent('step', {
            stepId: 'preparing_answers',
            message: 'Synthesizing structured answers, definitions, and marking schemes...',
          });

          const geminiResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.4,
            },
          });

          const rawJson = geminiResponse.text?.trim() || '';
          if (rawJson) {
            generatedPack = JSON.parse(rawJson);
          }
        } catch (genErr) {
          console.error('Gemini call failed or timed out, falling back to local engine:', genErr);
        }
      }

      // Step 5: Creating question paper & assembling
      sendEvent('step', {
        stepId: 'creating_paper',
        message: 'Formatting official university model paper and compilation pack...',
      });

      await new Promise((r) => setTimeout(r, 600));

      // If Gemini returned a pack, format and ensure fields
      if (generatedPack && generatedPack.importantQuestions) {
        generatedPack.metadata = {
          generatedAt: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          subject: generatedPack.metadata?.subject || setup.subjectName || 'Study Material',
          fileName: fileName || 'Uploaded_Document.pdf',
          difficulty: setup.difficulty,
          totalMarks: setup.sections?.reduce(
            (acc: number, s: any) => acc + (s.questionCount || 0) * (s.marksPerQuestion || 0),
            0
          ) || 50,
        };
        sendEvent('complete', { pack: generatedPack });
      } else {
        // Fallback to our deterministic syllabus-analyzing pack
        sendEvent('fallback', {
          pack: null,
          reason: 'Using localized syllabus synthesis engine',
        });
      }

      res.end();
    } catch (err: any) {
      console.error('Error generating exam pack:', err);
      sendEvent('error', { message: err?.message || 'Failed to generate preparation pack.' });
      res.end();
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ExamForge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
