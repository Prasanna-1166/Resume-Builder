import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATE_CATALOG, getTemplateComponent } from '@ai-resume/templates';
import { apiClient } from '../../services/api';
import { Download, Printer, ZoomIn, ZoomOut, RotateCcw, FileText, ChevronDown } from 'lucide-react';

interface LivePreviewProps {
  onOpenGallery?: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ onOpenGallery }) => {
  const { resumeData, setTemplate } = useResume();
  const [zoomLevel, setZoomLevel] = useState<number>(85); // Default 85% for comfortable dual-pane view
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const currentMeta = TEMPLATE_CATALOG.find(t => t.id === resumeData.templateId) || TEMPLATE_CATALOG[0];
  const TemplateComponent = getTemplateComponent(resumeData.templateId);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await apiClient.exportDocx(resumeData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const candidateName = resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'Resume';
      a.download = `${candidateName}_Resume.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      alert('Failed to generate DOCX. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 no-print">
        {/* Template Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Template:</span>
          <select
            value={resumeData.templateId}
            onChange={e => setTemplate(e.target.value)}
            className="px-2.5 py-1 text-xs bg-gray-50 border border-gray-300 rounded font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {TEMPLATE_CATALOG.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.pageSize.toUpperCase()} • {t.columns} Col)
              </option>
            ))}
          </select>

          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 underline"
            >
              Gallery
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded border border-gray-200">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded text-xs font-semibold shadow-2xs transition-colors"
            title="Download Word .DOCX"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{isExportingDocx ? 'Exporting...' : 'DOCX'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
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
          <TemplateComponent data={resumeData} />
        </div>
      </div>
    </div>
  );
};
