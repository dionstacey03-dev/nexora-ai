import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  Milestone,
  Code2,
  FileCode,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Download,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { SoftwareProject, ProjectStatus, ProjectCategory } from '../../types';

export const MyProjects: React.FC = () => {
  const { projects, selectProject, setActiveTab, updateProject, deleteProject, showToast, openExportModal } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProjectCategory>('all');

  // Modal / Drawer state
  const [selectedDetailsProject, setSelectedDetailsProject] = useState<SoftwareProject | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState<ProjectStatus>('in_progress');
  const [editingName, setEditingName] = useState('');
  const [editingTagline, setEditingTagline] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openDetailsModal = (project: SoftwareProject) => {
    setSelectedDetailsProject(project);
    setEditingNotes(project.userNotes || '');
    setEditingStatus(project.status);
    setEditingName(project.name);
    setEditingTagline(project.tagline);
  };

  const handleSaveDetails = () => {
    if (!selectedDetailsProject) return;
    updateProject(selectedDetailsProject.id, {
      name: editingName.trim() || selectedDetailsProject.name,
      tagline: editingTagline.trim() || selectedDetailsProject.tagline,
      status: editingStatus,
      userNotes: editingNotes,
    });
    setSelectedDetailsProject((prev) =>
      prev
        ? {
            ...prev,
            name: editingName.trim() || prev.name,
            tagline: editingTagline.trim() || prev.tagline,
            status: editingStatus,
            userNotes: editingNotes,
          }
        : null
    );
    showToast('Project details saved', 'success');
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setDeleteConfirmId(null);
    if (selectedDetailsProject?.id === id) {
      setSelectedDetailsProject(null);
    }
  };

  const calculateProgress = (p: SoftwareProject) => {
    let total = 0;
    let done = 0;
    p.roadmap.forEach((phase) => {
      phase.tasks.forEach((t) => {
        total += 1;
        if (t.status === 'done') done += 1;
      });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'architecture_ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Cpu className="w-3 h-3" /> Architecture Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers className="w-3 h-3" /> Planning
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Project Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            My Software Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse, manage, filter, and inspect your AI-generated software architectures.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-md shadow-violet-500/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Architecture</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, stack, description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'architecture_ready', label: 'Architecture Ready' },
            { id: 'completed', label: 'Completed' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/[0.08]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-500 mx-auto flex items-center justify-center">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No projects match your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or generate a brand new project using the AI generator.
          </p>
          <button
            onClick={() => setActiveTab('generator')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch Generator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const progress = calculateProgress(project);
            return (
              <div
                key={project.id}
                className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                      {project.category.replace('-', ' ')}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Roadmap Progress</span>
                      <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(4, progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300"
                      >
                        {t.name.split('+')[0].trim()}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openDetailsModal(project)}
                    className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => selectProject(project.id, 'roadmap')}
                      title="Open Roadmap"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Milestone className="w-4 h-4 text-violet-500" />
                    </button>
                    <button
                      onClick={() => selectProject(project.id, 'codestudio')}
                      title="Open Code Studio"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => selectProject(project.id, 'readmestudio')}
                      title="Open README Studio"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => openExportModal(project)}
                      title="Export as PDF Document or JSON"
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-violet-500" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      title="Delete Project"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="glass-surface p-6 rounded-3xl max-w-sm w-full border border-rose-500/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Architecture Blueprint?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will remove the project, roadmap tasks, and generated code from your local storage.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Details Modal / Drawer */}
      {selectedDetailsProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="glass-surface p-6 sm:p-8 rounded-3xl max-w-3xl w-full border border-slate-200/80 dark:border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold text-violet-500">
                  Project Inspector
                </span>
                <span className="text-slate-400">/</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedDetailsProject.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedDetailsProject(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                    Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="architecture_ready">Architecture Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingTagline}
                  onChange={(e) => setEditingTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Problem & Proposed Solution
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Problem:</strong> {selectedDetailsProject.problemStatement}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Solution:</strong> {selectedDetailsProject.proposedSolution}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Developer Notes & Sprint Comments
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add implementation notes, deployment targets, or team remarks..."
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    selectProject(selectedDetailsProject.id, 'roadmap');
                    setSelectedDetailsProject(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Milestone className="w-3.5 h-3.5" />
                  <span>Roadmap</span>
                </button>
                <button
                  onClick={() => {
                    selectProject(selectedDetailsProject.id, 'codestudio');
                    setSelectedDetailsProject(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Studio</span>
                </button>
                <button
                  onClick={() => {
                    openExportModal(selectedDetailsProject);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-violet-500" />
                  <span>Export PDF / JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDetailsProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
