import React, { useState } from 'react';
import {
  Code2,
  FolderTree,
  FileCode,
  Database,
  Terminal,
  Copy,
  Check,
  Download,
  Sparkles,
  Loader2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

type CodeTab = 'folder' | 'frontend' | 'backend' | 'schema' | 'env' | 'ai_custom';

interface DisplaySnippet {
  filename: string;
  language: string;
  code: string;
  explanation: string;
}

export const CodeStudio: React.FC = () => {
  const { projects, currentProject, selectProject, generateCode, showToast, setActiveTab } = useProjects();

  const activeProject = currentProject || (projects.length > 0 ? projects[0] : null);

  const [activeTab, setActiveTabLocal] = useState<CodeTab>('frontend');
  const [copied, setCopied] = useState(false);

  // Custom AI Code Generator state
  const [customPrompt, setCustomPrompt] = useState(
    'Create a secure authentication module for a multi-tenant student management SaaS. Use server-side tenant context, prevent public ADMIN registration, validate inputs, hash passwords safely, use explicit JWT algorithms/issuer/audience, implement atomic refresh-token rotation with reuse detection and revocation, enforce token-version checks, scope every database query by tenant, and include tests. Inspect existing dependencies and repository interfaces; do not invent database methods or claim production readiness without verification.'
  );
  const [customCodeType, setCustomCodeType] = useState('middleware');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customSnippet, setCustomSnippet] = useState<DisplaySnippet | null>(null);

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/10 text-violet-500 mx-auto flex items-center justify-center">
          <Code2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Projects Available</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Synthesize an architecture with the AI generator first to generate starter code files.
        </p>
        <button
          onClick={() => setActiveTab('generator')}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Generator</span>
        </button>
      </div>
    );
  }

  // Get current snippet to show based on active tab
  const getActiveCode = (): DisplaySnippet => {
    switch (activeTab) {
      case 'folder':
        return {
          filename: 'repository-structure.txt',
          language: 'markdown',
          code: activeProject.starterCode?.folderStructure || 'src/\n├── components/\n└── server.ts',
          explanation: 'Standard monorepo/polyrepo directory layout designed for scalable software development.',
        };
      case 'frontend':
        return (
          activeProject.starterCode?.frontendSnippet || {
            filename: 'src/components/MainView.tsx',
            language: 'typescript',
            code: '// Frontend component starter\nexport const Main = () => <div>Ready</div>;',
            explanation: 'React 19 TypeScript view with clean state handling.',
          }
        );
      case 'backend':
        return (
          activeProject.starterCode?.backendSnippet || {
            filename: 'src/server/routes/api.ts',
            language: 'typescript',
            code: '// Backend route starter\nexport const route = () => {};',
            explanation: 'Express route handler with error boundaries.',
          }
        );
      case 'schema':
        return (
          activeProject.starterCode?.dbSchemaSnippet || {
            filename: 'src/db/schema.ts',
            language: 'typescript',
            code: '// Database schema definition\nexport const schema = {};',
            explanation: 'Relational database schema with timezone-aware types.',
          }
        );
      case 'env':
        return (
          activeProject.starterCode?.envSnippet || {
            filename: '.env.example',
            language: 'bash',
            code: 'PORT=3000\nDATABASE_URL=postgres://localhost:5432/app',
            explanation: 'Environment variable definitions for local and production deployment.',
          }
        );
      case 'ai_custom':
        return (
          customSnippet || {
            filename: 'custom-snippet.ts',
            language: 'typescript',
            code: '// Click "Synthesize Code Snippet" below to generate custom logic with Gemini 3.8 Flash.',
            explanation: 'Custom AI code generation sandbox.',
          }
        );
    }
  };

  const currentSnippet = getActiveCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentSnippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentSnippet.filename.split('/').pop() || 'code.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${currentSnippet.filename}`, 'success');
  };

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGeneratingCustom(true);
    try {
      const res = await generateCode({
        prompt: customPrompt,
        language: activeProject.primaryLanguage || 'TypeScript',
        codeType: customCodeType,
        projectName: activeProject.name,
      });

      setCustomSnippet({
        code: res.code || '// No code returned',
        explanation: res.explanation || 'Custom generated logic',
        filename: res.filename || 'src/custom.ts',
        language: activeProject.primaryLanguage || 'typescript',
      });
      setActiveTabLocal('ai_custom');
      showToast('Custom code synthesized with Gemini AI!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to generate custom code', 'error');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Production Code Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Code Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Export production-ready starter code, folder hierarchies, and API endpoints tailored to your project.
          </p>
        </div>

        {/* Project Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Project:</span>
          <select
            value={activeProject.id}
            onChange={(e) => selectProject(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-violet-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs and File Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
          {[
            { id: 'folder', label: 'Folder Tree', icon: FolderTree },
            { id: 'frontend', label: 'Frontend Component', icon: FileCode },
            { id: 'backend', label: 'Backend Route', icon: Terminal },
            { id: 'schema', label: 'Database Schema', icon: Database },
            { id: 'env', label: '.env Config', icon: Layers },
            { id: 'ai_custom', label: 'AI Custom Generator', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabLocal(tab.id as CodeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      {/* Custom AI Code Generator Input Panel (Shown when on ai_custom tab or expanded) */}
      {activeTab === 'ai_custom' && (
        <form
          onSubmit={handleGenerateCustom}
          className="p-5 rounded-3xl glass-surface border border-violet-500/30 shadow-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-500 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Prompt Gemini 3.8 Flash for Custom Code</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Target: {activeProject.primaryLanguage}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Generate an automated Vitest test suite for the DORA metrics calculation engine..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            />
            <select
              value={customCodeType}
              onChange={(e) => setCustomCodeType(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="middleware">Middleware</option>
              <option value="test_suite">Test Suite (Vitest)</option>
              <option value="hook">React Hook</option>
              <option value="sql_migration">SQL Migration</option>
              <option value="service">Domain Service</option>
            </select>
            <button
              type="submit"
              disabled={isGeneratingCustom}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
            >
              {isGeneratingCustom ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Code</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Syntax-Highlighted Code Editor View */}
      <div className="rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Editor Title Bar */}
        <div className="px-5 py-3 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              {currentSnippet.filename}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>{currentSnippet.language}</span>
            <span>•</span>
            <span>{currentSnippet.code.split('\n').length} lines</span>
          </div>
        </div>

        {/* Code Content Area with Line Numbers */}
        <div className="p-4 sm:p-6 bg-slate-950 text-slate-100 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {currentSnippet.code.split('\n').map((line, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03]">
                  <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-slate-200">
                    {line || '\n'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code Explanation Footer Callout */}
        <div className="p-4 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-200/80 dark:border-white/10 flex items-start gap-3">
          <Cpu className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[10px]">
              Architecture Rationale:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentSnippet.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
