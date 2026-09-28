import { Request, Response } from 'express';
import { generateDocxBlob, ResumeData } from '@ai-resume/core';

export async function exportDocx(req: Request, res: Response): Promise<void> {
  try {
    const resumeData: ResumeData = req.body?.resumeData || req.body;

    if (!resumeData || !resumeData.personalInfo) {
      res.status(400).json({ error: 'Valid ResumeData object is required for DOCX export.' });
      return;
    }

    const docxBuffer = await generateDocxBlob(resumeData);
    const candidateName = resumeData.personalInfo.fullName
      ? resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'Resume';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${candidateName}_Resume.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error('Export DOCX error:', error);
    res.status(500).json({ error: 'Failed to generate DOCX document.' });
  }
}

export async function exportPdf(req: Request, res: Response): Promise<void> {
  try {
    const resumeData: ResumeData = req.body?.resumeData || req.body;

    if (!resumeData || !resumeData.personalInfo) {
      res.status(400).json({ error: 'Valid ResumeData object is required for PDF export.' });
      return;
    }

    // High-resolution browser print engine is handled on client side with window.print() and CSS @page print-color-adjust.
    // For API server-side generation, we return status confirmation.
    res.json({
      success: true,
      message: 'Client-side PDF renderer prepared.',
      templateId: resumeData.templateId
    });
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({ error: 'Failed to export PDF.' });
  }
}
