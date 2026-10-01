import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATE_CATALOG, getTemplateComponent } from '@ai-resume/templates';
import { apiClient } from '../../services/api';
import { Download, Printer, ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';
import { track } from '../../services/analytics';

interface LivePreviewProps {
  onOpenGallery?: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ onOpenGallery }) => {
  const { activeDocument, setTemplate } = useResume();
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const docType = activeDocument.documentType || 'RESUME';

  // Filter templates matching documentType
  const compatibleTemplates = TEMPLATE_CATALOG.filter(t => (t.documentType || 'RESUME') === docType);
  const currentMeta = TEMPLATE_CATALOG.find(t => t.id === activeDocument.templateId) || compatibleTemplates[0] || TEMPLATE_CATALOG[0];
  const TemplateComponent = getTemplateComponent(activeDocument.templateId);

  const handlePrintPdf = () => {
    track('PDF_EXPORTED', { templateId: activeDocument.templateId, status: 'SUCCESS', metadata: { documentType: docType } });
    window.print();
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await apiClient.exportDocx(activeDocument);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const candidateName = activeDocument.personalInfo.fullName?.replace(/\s+/g, '_') || 'Document';
      const fileSuffix = docType === 'COVER_LETTER' ? 'Cover_Letter' : (docType === 'CV' ? 'CV' : 'Resume');
      a.download = `${candidateName}_${fileSuffix}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      track('DOCX_EXPORTED', { templateId: activeDocument.templateId, status: 'SUCCESS', metadata: { documentType: docType } });
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      track('DOCX_EXPORTED', { templateId: activeDocument.templateId, status: 'ERROR' });
      alert('Failed to generate DOCX. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleTemplateSwitch = (newTemplateId: string) => {
    track('TEMPLATE_SWITCHED', { templateId: newTemplateId, metadata: { documentType: docType } });
    setTemplate(newTemplateId);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 no-print">
        {/* Template Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Template:</span>
          <select
            value={activeDocument.templateId}
            onChange={e => handleTemplateSwitch(e.target.value)}
            className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(compatibleTemplates.length > 0 ? compatibleTemplates : TEMPLATE_CATALOG).map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.pageSize.toUpperCase()})
              </option>
            ))}
          </select>

          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 underline"
            >
              Gallery
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          <button
            onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
            className="p-1 text-gray-600 hover:text-gray-900 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 text-gray-700">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
            className="p-1 text-gray-600 hover:text-gray-900 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(85)}
            className="p-1 text-gray-500 hover:text-gray-900 rounded ml-0.5"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            title="Download Word .DOCX"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isExportingDocx ? 'Exporting...' : 'DOCX'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="Download Vector PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Preview Canvas */}
      <div className="flex-1 bg-gray-200/80 rounded-xl border border-gray-300 p-4 sm:p-6 overflow-auto flex justify-center items-start min-h-[600px]">
        <div
          className="resume-print-container origin-top transition-transform duration-150 shadow-xl rounded-sm"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <TemplateComponent data={activeDocument} />
        </div>
      </div>
    </div>
  );
};
