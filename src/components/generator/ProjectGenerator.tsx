import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  Globe,
  Code2,
  Milestone,
  FileCode,
  Copy,
  Download,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Server,
  Zap,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import {
  GeneratorInput,
  ProjectCategory,
  ProjectComplexity,
  SoftwareProject,
} from '../../types';

const SAMPLE_IDEAS = [
  'Real-Time Collaborative Spatial Canvas for Engineering Teams',
  'Decentralized Edge Billing & Usage Metering Micro-SaaS',
  'AI-Powered Code Reviewer & Security Auditing Bot with PR Auto-Fixes',
  'Distributed Event-Driven Task Queue with Sub-Millisecond Latency',
  'Zero-Knowledge Passwordless Biometric Authentication Gateway',
];

const AUDIENCE_SUGGESTIONS = [
  'Enterprise Engineering Teams & CTOs',
  'Full-Stack Solo Developers & Startups',
  'DevOps & Site Reliability Engineers',
  'Data Engineers & Machine Learning Practitioners',
  'Tech Product Managers & Agencies',
];

export const ProjectGenerator: React.FC = () => {
  const { generateProject, isGenerating, generationStep, selectProject, setActiveTab, showToast, currentProject, openExportModal } =
    useProjects();

  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('fullstack-saas');
  const [targetAudience, setTargetAudience] = useState('Full-Stack Developers & Engineering Teams');
  const [primaryLanguage, setPrimaryLanguage] = useState('TypeScript');
  const [complexity, setComplexity] = useState<ProjectComplexity>('production-saas');
  const [additionalRequirements, setAdditionalRequirements] = useState(
    'Real-time WebSockets, Redis caching, OAuth 2.0 multi-tenant auth, Docker containerization'
  );

  const [generatedResult, setGeneratedResult] = useState<SoftwareProject | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'overview' | 'features' | 'techstack' | 'database' | 'api' | 'roadmap'>('overview');

  // Check if idea was prefilled from dashboard
  useEffect(() => {
    const prefilled = sessionStorage.getItem('nexora_prefilled_idea');
    if (prefilled) {
      setIdea(prefilled);
      sessionStorage.removeItem('nexora_prefilled_idea');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      showToast('Please describe your software idea first', 'error');
      return;
    }

    try {
      const input: GeneratorInput = {
        idea: idea.trim(),
        category,
        targetAudience,
        primaryLanguage,
        complexity,
        additionalRequirements,
      };

      const result = await generateProject(input);
      setGeneratedResult(result);
      setActiveResultTab('overview');
    } catch (err: any) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  const downloadProjectJSON = () => {
    if (!generatedResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${generatedResult.name.toLowerCase()}-architecture.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Architecture JSON exported', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent System Architecture Synthesizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Project Generator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
          Enter your software idea, target audience, and engineering constraints. Powered by Google Gemini AI,
          NEXORA transforms concepts into complete production-ready development plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-violet-500" />
              <span>Project Parameters</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Idea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  1. Project Concept / Idea <span className="text-violet-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your software concept (e.g. Distributed database with CRDT replication for edge runtimes)..."
                  className="w-full p-3 rounded-2xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all resize-none"
                  required
                />

                {/* Sample Idea Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IDEAS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIdea(sample)}
                        className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-violet-500/10 hover:text-violet-500 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5 transition-all cursor-pointer text-left truncate max-w-full"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category & Programming Language Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    2. Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    <option value="fullstack-saas">Full-Stack SaaS</option>
                    <option value="developer-tool">Developer Tool</option>
                    <option value="ai-agent">AI Agent / ML</option>
                    <option value="api-microservice">API / Microservice</option>
                    <option value="realtime-collaborative">Real-Time Collaborative</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="web3-fintech">Web3 / Fintech</option>
                    <option value="marketplace">Marketplace</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    3. Language
                  </label>
                  <select
                    value={primaryLanguage}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    <option value="TypeScript">TypeScript (Node / Next.js)</option>
                    <option value="Python">Python (FastAPI / PyTorch)</option>
                    <option value="Go">Go / Golang (Fiber / Gin)</option>
                    <option value="Rust">Rust (Axum / Tokio)</option>
                    <option value="Swift / Kotlin">Swift / Kotlin Mobile</option>
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  4. Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Enterprise Engineering Teams, Solo Developers..."
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {AUDIENCE_SUGGESTIONS.map((aud, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTargetAudience(aud)}
                      className="text-[9px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-violet-500"
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Complexity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  5. Project Complexity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mvp', label: 'MVP / Prototype', desc: 'Fast time-to-market' },
                    { id: 'production-saas', label: 'Production SaaS', desc: 'Robust & scalable' },
                    { id: 'enterprise', label: 'Enterprise Suite', desc: 'High scale & RBAC' },
                    { id: 'microservices', label: 'Microservices', desc: 'Decoupled mesh' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setComplexity(lvl.id as ProjectComplexity)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        complexity === lvl.id
                          ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-300 font-semibold'
                          : 'border-slate-200/80 dark:border-white/10 hover:border-violet-500/30 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl.label}</div>
                      <div className="text-[10px] opacity-75">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  6. Additional Architecture Requirements
                </label>
                <input
                  type="text"
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Real-time WebSockets, Redis caching, Stripe billing, Zero-Trust RBAC"
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize with Gemini AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Output / Live Stepper */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Generation Indicator */}
          {isGenerating && (
            <div className="p-8 rounded-3xl glass-surface border border-violet-500/40 shadow-2xl text-center space-y-5 animate-pulse">
              <div className="w-16 h-16 rounded-3xl bg-violet-600/20 text-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
                  Gemini 3.8 Flash Synthesizer
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Engineering System Architecture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {generationStep || 'Analyzing architectural patterns with Gemini AI...'}
                </p>
              </div>

              <div className="max-w-xs mx-auto w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 h-full w-2/3 animate-shimmer" />
              </div>
            </div>
          )}

          {/* Generated Result Showcase */}
          {!isGenerating && (generatedResult || currentProject) && (
            <div className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6">
              {(() => {
                const proj = generatedResult || currentProject!;
                return (
                  <>
                    {/* Project Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {proj.name}
                          </h2>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                            Synthesized
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                          {proj.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => selectProject(proj.id, 'roadmap')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Milestone className="w-3.5 h-3.5" />
                          <span>Roadmap</span>
                        </button>
                        <button
                          onClick={() => selectProject(proj.id, 'codestudio')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </button>
                        <button
                          onClick={() => openExportModal(proj)}
                          title="Export as PDF Document or JSON Specification"
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-violet-500" />
                          <span>Export PDF / JSON</span>
                        </button>
                      </div>
                    </div>

                    {/* Navigation Pills for Result Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: 'overview', label: 'Overview', icon: Zap },
                        { id: 'features', label: `Features (${proj.coreFeatures.length + proj.advancedFeatures.length})`, icon: Layers },
                        { id: 'techstack', label: `Tech Stack (${proj.techStack.length})`, icon: Cpu },
                        { id: 'database', label: `Database (${proj.databaseDesign.length})`, icon: Database },
                        { id: 'api', label: `APIs (${proj.apiEndpoints.length})`, icon: Globe },
                        { id: 'roadmap', label: `Roadmap (${proj.roadmap.length} Phases)`, icon: Milestone },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeResultTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveResultTab(tab.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              isActive
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Result Content */}
                    <div className="space-y-4 pt-1">
                      {/* OVERVIEW TAB */}
                      {activeResultTab === 'overview' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-500 font-mono">
                              System Description
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {proj.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-mono">
                                Problem Statement
                              </span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {proj.problemStatement}
                              </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-mono">
                                Proposed Technical Solution
                              </span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {proj.proposedSolution}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase">Category</span>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                                {proj.category.replace('-', ' ')}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase">Language</span>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {proj.primaryLanguage}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase">Complexity</span>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                                {proj.complexity.replace('-', ' ')}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5">
                              <span className="text-[10px] text-slate-400 font-mono uppercase">Target Audience</span>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                {proj.targetAudience.split(' ')[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FEATURES TAB */}
                      {activeResultTab === 'features' && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                              Core Architectural Features
                            </h3>
                            <div className="space-y-2">
                              {proj.coreFeatures.map((feat) => (
                                <div
                                  key={feat.id}
                                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 flex items-start justify-between gap-3"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {feat.title}
                                      </span>
                                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold bg-violet-500/10 text-violet-500">
                                        {feat.priority}
                                      </span>
                                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold bg-slate-200/60 dark:bg-white/10 text-slate-500">
                                        {feat.complexity}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {feat.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {proj.advancedFeatures.length > 0 && (
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                                Advanced & Predictive Capabilities
                              </h3>
                              <div className="space-y-2">
                                {proj.advancedFeatures.map((feat) => (
                                  <div
                                    key={feat.id}
                                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 flex items-start justify-between gap-3"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                          {feat.title}
                                        </span>
                                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-semibold bg-blue-500/10 text-blue-500">
                                          Advanced
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {feat.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TECH STACK TAB */}
                      {activeResultTab === 'techstack' && (
                        <div className="space-y-3">
                          {proj.techStack.map((tech, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                                    {tech.category}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {tech.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {tech.reason}
                                </p>
                              </div>
                              {tech.popularity && (
                                <div className="text-right shrink-0">
                                  <span className="text-xs font-mono font-bold text-emerald-500">
                                    {tech.popularity}%
                                  </span>
                                  <p className="text-[9px] text-slate-400">Industry Score</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* DATABASE TAB */}
                      {activeResultTab === 'database' && (
                        <div className="space-y-4">
                          {proj.databaseDesign.map((entity, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Database className="w-4 h-4 text-violet-500" />
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                                    {entity.name}
                                  </h4>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {entity.fields.length} attributes
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {entity.description}
                              </p>

                              {/* Fields Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] uppercase font-mono text-slate-400">
                                      <th className="pb-1.5 font-semibold">Field</th>
                                      <th className="pb-1.5 font-semibold">Type</th>
                                      <th className="pb-1.5 font-semibold">Constraints</th>
                                      <th className="pb-1.5 font-semibold">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                                    {entity.fields.map((field, fIdx) => (
                                      <tr key={fIdx} className="text-slate-700 dark:text-slate-300">
                                        <td className="py-1.5 font-mono font-semibold text-violet-500">
                                          {field.name}
                                        </td>
                                        <td className="py-1.5 font-mono text-slate-500">{field.type}</td>
                                        <td className="py-1.5 font-mono text-[10px]">
                                          {field.isPrimary && (
                                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold mr-1">
                                              PK
                                            </span>
                                          )}
                                          {field.isForeign && (
                                            <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 font-bold mr-1">
                                              FK
                                            </span>
                                          )}
                                          {field.isNullable && (
                                            <span className="text-slate-400">NULL</span>
                                          )}
                                        </td>
                                        <td className="py-1.5 text-slate-500 text-[11px]">
                                          {field.description || '—'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* API TAB */}
                      {activeResultTab === 'api' && (
                        <div className="space-y-3">
                          {proj.apiEndpoints.map((ep) => (
                            <div
                              key={ep.id}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
                                      ep.method === 'GET'
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : ep.method === 'POST'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : ep.method === 'PUT' || ep.method === 'PATCH'
                                        ? 'bg-amber-500/10 text-amber-500'
                                        : 'bg-rose-500/10 text-rose-500'
                                    }`}
                                  >
                                    {ep.method}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                                    {ep.path}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {ep.authRequired ? '🔒 Auth Required' : 'Public'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {ep.description}
                              </p>
                              {ep.responseBody && (
                                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                                  <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">
                                    Response Payload Sample:
                                  </span>
                                  <pre>{ep.responseBody}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ROADMAP PREVIEW TAB */}
                      {activeResultTab === 'roadmap' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              Estimated Delivery Schedule
                            </span>
                            <button
                              onClick={() => selectProject(proj.id, 'roadmap')}
                              className="text-xs font-bold text-violet-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Open Interactive Roadmap Builder</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {proj.roadmap.map((phase) => (
                              <div
                                key={phase.id}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-violet-600 text-white font-mono">
                                      Phase {phase.phaseNumber}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                      {phase.title}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400">{phase.duration}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{phase.goal}</p>

                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                                    Sprint Tasks:
                                  </span>
                                  {phase.tasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 py-0.5"
                                    >
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2
                                          className={`w-3.5 h-3.5 ${
                                            task.status === 'done' ? 'text-emerald-500' : 'text-slate-400'
                                          }`}
                                        />
                                        <span>{task.title}</span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {task.estimatedHours}h
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Empty state if nothing generated yet */}
          {!isGenerating && !generatedResult && !currentProject && (
            <div className="p-12 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-violet-500/10 text-violet-500 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ready to Synthesize Your Software Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Fill in the parameters on the left or select a quick suggestion, then click "Synthesize with Gemini AI".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
