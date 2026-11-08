import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileCode,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Loader2,
} from 'lucide-react';
import { SoftwareProject } from '../../types';
import { exportProjectAsPDF, exportProjectAsJSON, printProjectExecutiveReport } from '../../utils/exportPlan';

interface ExportPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: SoftwareProject | null;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExportPlanModal: React.FC<ExportPlanModalProps> = ({
  isOpen,
  onClose,
  project,
  onShowToast,
}) => {
  if (!isOpen || !project) return null;

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [showJSONPreview, setShowJSONPreview] = useState(false);

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      exportProjectAsPDF(project);
      onShowToast(`Generated PDF for "${project.name}"!`, 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      onShowToast('Could not generate PDF document.', 'error');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportJSON = () => {
    try {
      exportProjectAsJSON(project);
      onShowToast(`Exported "${project.name}" as JSON!`, 'success');
    } catch (err) {
      console.error('JSON export error:', err);
      onShowToast('Could not export JSON.', 'error');
    }
  };

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJSON(true);
    onShowToast('JSON copied to clipboard!', 'success');
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handlePrint = () => {
    try {
      printProjectExecutiveReport(project);
      onShowToast('Opening printable report...', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Intelligence Exporter
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-400">Save Locally</span>
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight mt-0.5">
              Export {project.name} Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Save your generated intelligence locally as a formatted PDF document or machine-readable JSON.
            </p>
          </div>
        </div>

        {/* 3 Main Export Format Cards */}
        <div className="space-y-4">
          {/* 1. PDF Document Card */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 transition-all space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Executive PDF Document
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Multi-page styled blueprint with executive cover, problem/solution, tech stack matrix, schemas, and roadmap.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-mono">
              <span>• Executive Cover Page</span>
              <span>• Database Entities Table</span>
              <span>• API Catalog</span>
              <span>• Phased Sprints</span>
            </div>
          </div>

          {/* 2. JSON Specification File Card */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 transition-all space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Complete JSON Specification
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                      Machine-Readable
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Complete project state with starter code snippets, database models, raw README markdown, and task lists.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyJSON}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedJSON ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                {JSON.stringify(project).length} bytes • Fully typed schema
              </span>
              <button
                type="button"
                onClick={() => setShowJSONPreview(!showJSONPreview)}
                className="text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
              >
                {showJSONPreview ? 'Hide JSON preview' : 'Inspect JSON preview'}
              </button>
            </div>

            {showJSONPreview && (
              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] max-h-48 overflow-y-auto mt-2">
                <pre>{JSON.stringify(project, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* 3. Printable Executive Report */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Printable Executive Report
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500">
                      Paper / PDF Print
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Opens a clean, printer-optimized document formatted for standard A4/Letter paper with browser print dialog.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Files are synthesized and saved locally on your machine.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
