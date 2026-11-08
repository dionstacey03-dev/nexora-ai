import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Copy,
  Kanban,
  ListOrdered,
  Sparkles,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { RoadmapPhase, RoadmapTask } from '../../types';

export const RoadmapBuilder: React.FC = () => {
  const { projects, currentProject, selectProject, toggleTaskStatus, addRoadmapTask, showToast, setActiveTab, openExportModal } =
    useProjects();

  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('');

  // Add Task Form state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [targetPhaseId, setTargetPhaseId] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(6);
  const [newTaskTags, setNewTaskTags] = useState('Backend, API');

  const activeProject = currentProject || (projects.length > 0 ? projects[0] : null);

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/10 text-violet-500 mx-auto flex items-center justify-center">
          <Milestone className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Projects Available</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Create an architecture plan with the AI generator first to inspect and track development roadmaps.
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

  // Calculate project statistics
  let totalTasks = 0;
  let doneTasks = 0;
  let inProgressTasks = 0;
  let todoTasks = 0;
  let totalHours = 0;
  let completedHours = 0;
  let totalMilestones = 0;
  let completedMilestones = 0;

  activeProject.roadmap.forEach((phase) => {
    phase.milestones.forEach((m) => {
      totalMilestones += 1;
      if (m.completed) completedMilestones += 1;
    });

    phase.tasks.forEach((t) => {
      totalTasks += 1;
      totalHours += t.estimatedHours || 4;
      if (t.status === 'done') {
        doneTasks += 1;
        completedHours += t.estimatedHours || 4;
      } else if (t.status === 'in_progress') {
        inProgressTasks += 1;
      } else {
        todoTasks += 1;
      }
    });
  });

  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !targetPhaseId) {
      showToast('Please specify task title and select a phase', 'error');
      return;
    }

    const tagsArray = newTaskTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addRoadmapTask(activeProject.id, targetPhaseId, {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: 'todo',
      estimatedHours: Number(newTaskHours) || 4,
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTaskModal(false);
  };

  const copyRoadmapMarkdown = () => {
    let md = `# Development Roadmap: ${activeProject.name}\n\n`;
    activeProject.roadmap.forEach((phase) => {
      md += `## Phase ${phase.phaseNumber}: ${phase.title} (${phase.duration})\n`;
      md += `> Goal: ${phase.goal}\n\n`;
      md += `### Milestones:\n`;
      phase.milestones.forEach((m) => {
        md += `- [${m.completed ? 'x' : ' '}] ${m.title} (Target: ${m.targetWeek})\n`;
      });
      md += `\n### Tasks:\n`;
      phase.tasks.forEach((t) => {
        const mark = t.status === 'done' ? 'x' : t.status === 'in_progress' ? '/' : ' ';
        md += `- [${mark}] **${t.title}** (${t.estimatedHours}h) - ${t.description}\n`;
      });
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    showToast('Roadmap markdown copied to clipboard', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Top Bar: Project Selector & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
            <Milestone className="w-3.5 h-3.5" />
            <span>Interactive Development Execution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Roadmap Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track development phases, manage milestones, and toggle task completion.
          </p>
        </div>

        {/* Project Dropdown & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
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

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Phases</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTargetPhaseId(activeProject.roadmap[0]?.id || '');
              setShowAddTaskModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={() => openExportModal(activeProject)}
            title="Export Plan as PDF Document or JSON"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-violet-500" />
            <span>Export Plan</span>
          </button>

          <button
            onClick={copyRoadmapMarkdown}
            title="Copy Roadmap as Markdown"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Overall Progress</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completionPct}%
            </span>
            <span className="text-xs text-slate-400">({doneTasks}/{totalTasks} done)</span>
          </div>
          <div className="mt-2 w-full bg-slate-200/70 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, completionPct)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Estimated Hours</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completedHours}h
            </span>
            <span className="text-xs text-slate-400">/ {totalHours}h total</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">
            {totalHours - completedHours}h remaining
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Milestones</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completedMilestones}
            </span>
            <span className="text-xs text-slate-400">/ {totalMilestones} reached</span>
          </div>
          <p className="text-[10px] text-emerald-500 mt-2 font-mono font-semibold">
            {activeProject.roadmap.length} distinct phases
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Sprint Breakdown</span>
          <div className="mt-1 flex items-center gap-3 text-xs font-mono font-semibold">
            <span className="text-emerald-500">{doneTasks} done</span>
            <span className="text-blue-500">{inProgressTasks} active</span>
            <span className="text-slate-400">{todoTasks} todo</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Click tasks to cycle status
          </p>
        </div>
      </div>

      {/* VIEW 1: TIMELINE / PHASES VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {activeProject.roadmap.map((phase) => {
            const phaseTotal = phase.tasks.length;
            const phaseDone = phase.tasks.filter((t) => t.status === 'done').length;
            const phasePct = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;

            return (
              <div
                key={phase.id}
                className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-5"
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-xs">
                        Phase {phase.phaseNumber}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {phase.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Goal:</strong> {phase.goal}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {phasePct}%
                      </span>
                      <p className="text-[10px] text-slate-400">Phase complete</p>
                    </div>
                    <div className="w-24 bg-slate-200/80 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${phasePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Horizontal Row */}
                {phase.milestones.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Key Deliverables & Milestones:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {phase.milestones.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                            m.completed
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              m.completed ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate">{m.title}</div>
                            <span className="text-[10px] font-mono text-slate-400">{m.targetWeek}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks Section */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Sprint Task Checklist:
                    </span>
                    <button
                      onClick={() => {
                        setTargetPhaseId(phase.id);
                        setShowAddTaskModal(true);
                      }}
                      className="text-xs font-semibold text-violet-500 hover:text-violet-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task to Phase {phase.phaseNumber}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskStatus(activeProject.id, phase.id, task.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          task.status === 'done'
                            ? 'bg-slate-50/50 dark:bg-white/[0.02] border-emerald-500/20 text-slate-500'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500/5 border-blue-500/30'
                            : 'bg-slate-50/90 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 hover:border-violet-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {task.status === 'done' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : task.status === 'in_progress' ? (
                            <Clock className="w-5 h-5 text-blue-500 shrink-0 animate-spin" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400 group-hover:text-violet-500 shrink-0" />
                          )}

                          <div className="space-y-0.5 min-w-0">
                            <span
                              className={`text-xs sm:text-sm font-semibold truncate block ${
                                task.status === 'done'
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            {task.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hidden sm:inline"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500">
                            {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* TO DO COLUMN */}
          <div className="p-4 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  To Do ({todoTasks})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeProject.roadmap.flatMap((phase) =>
                phase.tasks
                  .filter((t) => t.status === 'todo')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(activeProject.id, phase.id, task.id)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 shadow-xs transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{task.estimatedHours}h</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-slate-400">
                        <span>Phase {phase.phaseNumber}</span>
                        <span className="text-violet-500 group-hover:underline">Tap to advance →</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="p-4 rounded-3xl glass-surface border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 font-mono">
                  In Progress ({inProgressTasks})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeProject.roadmap.flatMap((phase) =>
                phase.tasks
                  .filter((t) => t.status === 'in_progress')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(activeProject.id, phase.id, task.id)}
                      className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 shadow-xs transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </span>
                        <span className="text-[10px] font-mono text-blue-500 font-bold">
                          {task.estimatedHours}h
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-slate-400">
                        <span>Phase {phase.phaseNumber}</span>
                        <span className="text-emerald-500 font-bold group-hover:underline">
                          Tap to Complete ✓
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="p-4 rounded-3xl glass-surface border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">
                  Completed ({doneTasks})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {activeProject.roadmap.flatMap((phase) =>
                phase.tasks
                  .filter((t) => t.status === 'done')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(activeProject.id, phase.id, task.id)}
                      className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 shadow-xs transition-all cursor-pointer space-y-2 group opacity-85"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold line-through text-slate-500">
                          {task.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500">
                          {task.estimatedHours}h
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-slate-400">
                        <span>Phase {phase.phaseNumber}</span>
                        <span className="text-slate-400">Done</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="glass-surface p-6 rounded-3xl max-w-md w-full border border-slate-200/80 dark:border-white/15 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-500" />
              <span>Add Custom Roadmap Task</span>
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">Target Phase</label>
                <select
                  value={targetPhaseId}
                  onChange={(e) => setTargetPhaseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                >
                  {activeProject.roadmap.map((p) => (
                    <option key={p.id} value={p.id}>
                      Phase {p.phaseNumber}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement OAuth 2.0 PKCE flow"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Technical acceptance criteria..."
                  className="w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Hours Estimate</label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    min={1}
                    max={200}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTaskTags}
                    onChange={(e) => setNewTaskTags(e.target.value)}
                    placeholder="API, Auth, UI"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-sm cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
