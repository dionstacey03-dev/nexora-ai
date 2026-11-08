import React, { useState } from 'react';
import {
  Sparkles,
  Rocket,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  Code2,
  Milestone,
  FileCode,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Terminal,
  Download,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { SoftwareProject, ProjectStatus } from '../../types';

export const DashboardHome: React.FC = () => {
  const { projects, setActiveTab, selectProject, userSettings, openExportModal } = useProjects();
  const [quickIdea, setQuickIdea] = useState('');

  // Calculate statistics
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p) => p.status === 'in_progress').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const architectureReady = projects.filter((p) => p.status === 'architecture_ready').length;

  // Calculate total roadmap tasks across all projects
  let totalTasks = 0;
  let completedTasks = 0;
  projects.forEach((p) => {
    p.roadmap.forEach((phase) => {
      phase.tasks.forEach((task) => {
        totalTasks += 1;
        if (task.status === 'done') completedTasks += 1;
      });
    });
  });
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleQuickSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickIdea.trim()) return;
    // Store quick idea in sessionStorage or pass through state
    sessionStorage.setItem('nexora_prefilled_idea', quickIdea);
    setActiveTab('generator');
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'architecture_ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Cpu className="w-3 h-3" /> Architecture Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers className="w-3 h-3" /> Planning
          </span>
        );
    }
  };

  const calculateProjectProgress = (p: SoftwareProject) => {
    let pTotal = 0;
    let pDone = 0;
    p.roadmap.forEach((phase) => {
      phase.tasks.forEach((task) => {
        pTotal += 1;
        if (task.status === 'done') pDone += 1;
      });
    });
    return pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 25;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-surface border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Systems Architecture Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Transform Ideas Into Production-Ready Systems.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
              Welcome back, <span className="font-semibold text-violet-600 dark:text-violet-400">{userSettings.userProfile.name}</span>. 
              NEXORA AI orchestrates complete system designs, relational schemas, REST APIs, and granular roadmaps in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-lg shadow-violet-500/30 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Project</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer"
            >
              <Milestone className="w-4 h-4 text-violet-500" />
              <span>View Active Roadmap</span>
            </button>
          </div>
        </div>

        {/* Quick Idea Launch Bar */}
        <form onSubmit={handleQuickSynthesize} className="mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Terminal className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={quickIdea}
              onChange={(e) => setQuickIdea(e.target.value)}
              placeholder="e.g. Distributed edge rate-limiter with Redis, or Multi-tenant billing SaaS..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-violet-500/20"
          >
            <span>Launch Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Projects */}
        <div className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm relative group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalProjects}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Total Projects Generated
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>{architectureReady} architecture ready</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm relative group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-blue-500">In Sprint</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {inProgressProjects}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Projects In Progress
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>Tracking active milestones</span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm relative group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">Shipped</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completedProjects}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Completed Systems
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>Production deployed</span>
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm relative group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Milestone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-indigo-500 font-mono">
              {completedTasks}/{totalTasks} Tasks
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {overallProgress}%
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Development Velocity
            </p>
          </div>
          <div className="mt-3 w-full bg-slate-200/70 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Development Activity & System Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Recent Projects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any project to explore full roadmap, code studio, and technical specifications.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => {
              const progress = calculateProjectProgress(project);
              return (
                <div
                  key={project.id}
                  onClick={() => selectProject(project.id, 'roadmap')}
                  className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {project.name}
                        </h3>
                        {getStatusBadge(project.status)}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                          {project.primaryLanguage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {progress}%
                        </span>
                        <p className="text-[10px] text-slate-400">Progress</p>
                      </div>
                      <div className="w-20 bg-slate-200/80 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-violet-500 transition-all" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.techStack.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300"
                        >
                          {t.name.split('+')[0].trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectProject(project.id, 'codestudio');
                        }}
                        className="text-[11px] font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
                      >
                        <Code2 className="w-3 h-3" /> Code
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectProject(project.id, 'readmestudio');
                        }}
                        className="text-[11px] font-semibold text-violet-500 hover:text-violet-400 flex items-center gap-1"
                      >
                        <FileCode className="w-3 h-3" /> README
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openExportModal(project);
                        }}
                        className="text-[11px] font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Architect Capabilities & Quick Launch */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            AI Engine Capabilities
          </h2>

          <div className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Google Gemini 3.8 Flash
                </h3>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Server-Side AI Proxy Active
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every project generates production-ready assets:
            </p>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span><strong>Relational DB Schemas</strong>: Typed PostgreSQL/Drizzle entity definitions & foreign keys.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span><strong>REST & GraphQL APIs</strong>: Typed payload schemas and HTTP status specifications.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span><strong>Phased Roadmaps</strong>: Milestone estimation, sprint tasks, and timeline checklists.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span><strong>Starter Code</strong>: Express controllers, React components, and environment files.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('techstack')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100/90 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                <span>Explore Tech Stack Matrix</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/10 via-indigo-600/10 to-blue-600/10 border border-violet-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-500" />
              <span>Architectural Philosophy</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              "Simple architectures scale best. NEXORA AI enforces decoupled microservices, typed contracts, and zero-trust security from day one."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
