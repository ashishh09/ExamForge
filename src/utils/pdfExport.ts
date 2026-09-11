import { jsPDF } from 'jspdf';
import { ExamPreparationPack } from '../types';

function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(26, 36, 56);
  doc.text(title, 20, 20);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 20, 26);
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);
}

function checkPageBreak(doc: jsPDF, currentY: number, neededSpace = 25): number {
  if (currentY + neededSpace > 275) {
    doc.addPage();
    return 25;
  }
  return currentY;
}

export function exportQuestionPaperPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    const paper = pack.questionPaper;

    // Header banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(paper.institution || 'EXAMFORGE AI MODEL EXAMINATION', 105, 18, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(paper.examination || 'SEMESTER EXAMINATION', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(`Subject: ${paper.subject}`, 105, 32, { align: 'center' });

    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    // Meta row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Time Allowed: ${paper.timeAllowed || '3 Hours'}`, 20, 42);
    doc.text(`Maximum Marks: ${paper.maximumMarks || pack.metadata.totalMarks}`, 190, 42, { align: 'right' });

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    let y = 52;

    // Instructions
    if (paper.instructions && paper.instructions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('General Instructions:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      paper.instructions.forEach((inst, idx) => {
        const lines = doc.splitTextToSize(`${idx + 1}. ${inst}`, 168);
        doc.text(lines, 24, y);
        y += lines.length * 4.5;
      });
      y += 3;
      doc.line(20, y, 190, y);
      y += 6;
    }

    // Sections
    paper.sections.forEach((sec) => {
      y = checkPageBreak(doc, y, 30);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(sec.name, 105, y, { align: 'center' });
      y += 5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${sec.instruction} - Total: ${sec.totalMarks} Marks)`, 105, y, { align: 'center' });
      y += 7;

      sec.questions.forEach((q) => {
        y = checkPageBreak(doc, y, 15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${q.questionNumber}.`, 20, y);

        doc.setFont('helvetica', 'normal');
        const qLines = doc.splitTextToSize(q.text, 145);
        doc.text(qLines, 30, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(`(${q.marks})`, 190, y, { align: 'right' });

        y += Math.max(qLines.length * 5, 6) + 3;

        if (q.hasChoice && q.orQuestion) {
          y = checkPageBreak(doc, y, 15);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          doc.text('[OR]', 105, y, { align: 'center' });
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          const orLines = doc.splitTextToSize(q.orQuestion, 145);
          doc.text(orLines, 30, y);
          doc.setFont('helvetica', 'bold');
          doc.text(`(${q.marks})`, 190, y, { align: 'right' });
          y += orLines.length * 5 + 4;
        }
      });
      y += 4;
    });

    const safeName = (pack.metadata.subject || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Model_Question_Paper.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Question Paper PDF:', err);
    return false;
  }
}

export function exportImportantQuestionsPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    addHeader(doc, `${pack.metadata.subject} - High Yield Important Questions`, `Generated for ${pack.metadata.difficulty.toUpperCase()} level exam preparation`);

    let y = 38;

    pack.importantQuestions.forEach((q, idx) => {
      y = checkPageBreak(doc, y, 35);

      // Priority Badge
      doc.setFillColor(q.priority === 'HIGH PRIORITY' ? 254 : 241, q.priority === 'HIGH PRIORITY' ? 242 : 245, q.priority === 'HIGH PRIORITY' ? 242 : 249);
      doc.rect(20, y, 170, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(q.priority === 'HIGH PRIORITY' ? 185 : 51, q.priority === 'HIGH PRIORITY' ? 28 : 65, q.priority === 'HIGH PRIORITY' ? 28 : 85);
      doc.text(`[${q.priority}]  •  ${q.category}  •  ${q.marks} Marks  •  ${q.probability}`, 24, y + 5);

      y += 11;

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`Q${idx + 1}. ${q.question}`, 168);
      doc.text(qLines, 20, y);
      y += qLines.length * 5 + 3;

      // Answer summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const ansLines = doc.splitTextToSize(`Model Answer: ${q.summaryAnswer}`, 168);
      doc.text(ansLines, 20, y);
      y += ansLines.length * 4.5 + 6;

      doc.setDrawColor(241, 245, 249);
      doc.line(20, y - 2, 190, y - 2);
    });

    const safeName = (pack.metadata.subject || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Important_Questions.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Important Questions PDF:', err);
    return false;
  }
}

export function exportShortNotesPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    addHeader(doc, `${pack.metadata.subject} - High-Yield Revision Notes`, 'Concise revision points and core technical terminology');

    let y = 38;

    pack.shortNotes.forEach((note) => {
      y = checkPageBreak(doc, y, 35);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(note.title, 20, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const sumLines = doc.splitTextToSize(note.summary, 168);
      doc.text(sumLines, 20, y);
      y += sumLines.length * 4.8 + 3;

      doc.setFontSize(9);
      note.bulletPoints.forEach((bp) => {
        y = checkPageBreak(doc, y, 12);
        const bpLines = doc.splitTextToSize(`•  ${bp}`, 162);
        doc.text(bpLines, 24, y);
        y += bpLines.length * 4.5;
      });

      if (note.keyTerms && note.keyTerms.length > 0) {
        y += 2;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 58, 138);
        doc.text(`Key Terminology: ${note.keyTerms.join('  |  ')}`, 24, y);
        y += 4;
      }

      y += 6;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, y - 3, 190, y - 3);
    });

    const safeName = (pack.metadata.subject || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Short_Notes.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Short Notes PDF:', err);
    return false;
  }
}

export function exportLongAnswersPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    addHeader(doc, `${pack.metadata.subject} - Structured Long Answers`, 'Comprehensive analytical answers with headings and structured breakdowns');

    let y = 38;

    pack.longAnswers.forEach((la, idx) => {
      y = checkPageBreak(doc, y, 40);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      const qLines = doc.splitTextToSize(`Question ${idx + 1}: ${la.question} (${la.marks} Marks)`, 168);
      doc.text(qLines, 20, y);
      y += qLines.length * 5.5 + 4;

      // Intro
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const introLines = doc.splitTextToSize(`Introduction: ${la.introduction}`, 168);
      doc.text(introLines, 20, y);
      y += introLines.length * 4.8 + 4;

      // Body sections
      la.bodySections.forEach((sec) => {
        y = checkPageBreak(doc, y, 20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(sec.heading, 20, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        sec.points.forEach((pt) => {
          y = checkPageBreak(doc, y, 12);
          const ptLines = doc.splitTextToSize(`• ${pt}`, 162);
          doc.text(ptLines, 24, y);
          y += ptLines.length * 4.5;
        });
        y += 2;
      });

      // Conclusion
      if (la.conclusion) {
        y = checkPageBreak(doc, y, 15);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const conLines = doc.splitTextToSize(`Conclusion: ${la.conclusion}`, 168);
        doc.text(conLines, 20, y);
        y += conLines.length * 4.5 + 5;
      }

      y += 5;
      doc.setDrawColor(203, 213, 225);
      doc.line(20, y - 2, 190, y - 2);
    });

    const safeName = (pack.metadata.subject || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Long_Answers.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Long Answers PDF:', err);
    return false;
  }
}

export function exportAnswerKeyPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    addHeader(doc, `${pack.metadata.subject} - Official Model Answer Key`, 'Step-by-step marking schemes and model responses');

    let y = 38;

    pack.answerKey.forEach((item) => {
      y = checkPageBreak(doc, y, 35);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.questionNumber} [${item.sectionName}] (${item.marks} Marks)`, 20, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const qLines = doc.splitTextToSize(item.questionText, 168);
      doc.text(qLines, 20, y);
      y += qLines.length * 4.8 + 3;

      // Marking scheme
      if (item.markingScheme && item.markingScheme.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 58, 138);
        doc.text('Marking Scheme Distribution:', 20, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        item.markingScheme.forEach((ms) => {
          doc.text(`- ${ms.step}: ${ms.marksAllocated}`, 24, y);
          y += 4;
        });
        y += 2;
      }

      // Model answer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('Model Response:', 20, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      const ansLines = doc.splitTextToSize(item.modelAnswer, 168);
      doc.text(ansLines, 20, y);
      y += ansLines.length * 4.5 + 6;

      doc.setDrawColor(226, 232, 240);
      doc.line(20, y - 2, 190, y - 2);
    });

    const safeName = (pack.metadata.subject || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Answer_Key.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Answer Key PDF:', err);
    return false;
  }
}

export function exportCompletePackPDF(pack: ExamPreparationPack): boolean {
  try {
    const doc = new jsPDF();
    const subject = pack.metadata.subject || 'Exam';

    // Title Page
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('EXAMFORGE AI', 105, 90, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(148, 163, 184);
    doc.text('COMPLETE EXAMINATION PREPARATION PACK', 105, 105, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor(56, 189, 248);
    doc.text(subject, 105, 125, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(203, 213, 225);
    doc.text(`Difficulty: ${pack.metadata.difficulty.toUpperCase()}  •  Total Marks: ${pack.metadata.totalMarks}`, 105, 140, { align: 'center' });
    doc.text(`Generated on: ${pack.metadata.generatedAt}`, 105, 148, { align: 'center' });

    // Next page: Question paper
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    addHeader(doc, 'Part 1: University Model Question Paper', `Subject: ${subject} | Time: ${pack.questionPaper.timeAllowed}`);
    let y = 40;

    pack.questionPaper.sections.forEach((sec) => {
      y = checkPageBreak(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(sec.name, 20, y);
      y += 5;

      sec.questions.forEach((q) => {
        y = checkPageBreak(doc, y, 15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`${q.questionNumber}.`, 20, y);
        doc.setFont('helvetica', 'normal');
        const qLines = doc.splitTextToSize(q.text, 145);
        doc.text(qLines, 30, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${q.marks})`, 190, y, { align: 'right' });
        y += qLines.length * 4.8 + 3;
      });
      y += 4;
    });

    // Next page: Important Questions
    doc.addPage();
    addHeader(doc, 'Part 2: High Yield Important Questions', 'Prioritized by occurrence probability');
    y = 40;

    pack.importantQuestions.slice(0, 6).forEach((q, idx) => {
      y = checkPageBreak(doc, y, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`Q${idx + 1}. ${q.question} (${q.marks} Marks)`, 168);
      doc.text(qLines, 20, y);
      y += qLines.length * 4.8 + 2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const ansLines = doc.splitTextToSize(q.summaryAnswer, 168);
      doc.text(ansLines, 20, y);
      y += ansLines.length * 4.2 + 5;
    });

    // Next page: Definitions
    if (pack.definitions.length > 0) {
      doc.addPage();
      addHeader(doc, 'Part 3: Core Technical Definitions', 'Two-mark concise definitions');
      y = 40;

      pack.definitions.forEach((def) => {
        y = checkPageBreak(doc, y, 22);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 58, 138);
        doc.text(def.term, 20, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const defLines = doc.splitTextToSize(def.definition, 168);
        doc.text(defLines, 20, y);
        y += defLines.length * 4.2 + 2;

        if (def.exampleOrFormula) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Note: ${def.exampleOrFormula}`, 20, y);
          y += 4.5;
        }
        y += 2;
      });
    }

    const safeName = subject.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_Complete_Exam_Pack.pdf`);
    return true;
  } catch (err) {
    console.error('Error generating Complete Pack PDF:', err);
    return false;
  }
}
