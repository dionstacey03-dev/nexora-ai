import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Milestone,
  Cpu,
  Code2,
  FileCode,
  Settings,
  Sun,
  Moon,
  Plus,
  Command,
  ChevronRight,
  Workflow,
  Search,
  Download,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';
import { NexoraLogo } from '../common/NexoraLogo';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  shortcut: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '⌘1' },
  { id: 'generator', label: 'AI Generator', icon: Sparkles, shortcut: '⌘2', badge: 'AI' },
  { id: 'projects', label: 'My Projects', icon: FolderKanban, shortcut: '⌘3' },
  { id: 'roadmap', label: 'Roadmap Builder', icon: Milestone, shortcut: '⌘4' },
  { id: 'techstack', label: 'Tech Stack', icon: Cpu, shortcut: '⌘5' },
  { id: 'codestudio', label: 'Code Studio', icon: Code2, shortcut: '⌘6' },
  { id: 'readmestudio', label: 'README Studio', icon: FileCode, shortcut: '⌘7' },
  { id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘8' },
];

/**
 * Desktop Top Navigation Bar
 * Houses breadcrumbs, search trigger, active project indicator, and Sun/Moon toggle.
 */
export const DesktopTopNav: React.FC<{ onOpenShortcuts?: () => void }> = ({ onOpenShortcuts }) => {
  const { activeTab, setActiveTab, currentProject, projects, openExportModal } = useProjects();
  const { resolvedTheme, toggleTheme } = useTheme();

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Architecture metrics, velocity & recent blueprints' };
      case 'generator':
        return { title: 'AI Project Architect', subtitle: 'Transform ideas into comprehensive technical specifications' };
      case 'projects':
        return { title: 'Project Repository', subtitle: 'Managed architectures, specifications & status tracking' };
      case 'roadmap':
        return { title: 'Development Roadmap', subtitle: 'Phased milestones, task breakdown & visual timelines' };
      case 'techstack':
        return { title: 'Tech Stack Recommender', subtitle: 'Architecture matrix, tradeoffs & comparative rationale' };
      case 'codestudio':
        return { title: 'Code Studio', subtitle: 'Scaffolded starter repositories, controllers & schema generator' };
      case 'readmestudio':
        return { title: 'README Studio', subtitle: 'Production-ready GitHub documentation generator' };
      case 'settings':
        return { title: 'System & Profile Preferences', subtitle: 'Theme configuration, AI models & data management' };
    }
  };

  const section = getSectionTitle();

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-3.5 glass-surface border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30 transition-all duration-200">
      {/* Left: Section Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 font-mono">
              NEXORA AI
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {section.title}
            </h1>
            {currentProject && (
              <>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 font-medium border border-violet-500/20">
                  {currentProject.name}
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {section.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick actions, Hotkeys, Sun/Moon Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Quick Launch Generator Button */}
        {activeTab !== 'generator' && (
          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-md shadow-violet-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthesize New Project</span>
          </button>
        )}

        {/* Export Plan Button */}
        {currentProject && (
          <button
            onClick={() => openExportModal(currentProject)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer"
            title="Export as PDF or JSON"
          >
            <Download className="w-3.5 h-3.5 text-violet-500" />
            <span className="hidden xl:inline">Export Plan</span>
          </button>
        )}

        {/* Hotkeys helper */}
        <button
          onClick={onOpenShortcuts}
          aria-label="View keyboard shortcuts"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-white/[0.04] hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-white/10 transition-colors cursor-pointer"
        >
          <Command className="w-3.5 h-3.5 text-violet-500" />
          <span className="hidden xl:inline">Shortcuts</span>
          <kbd className="font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-xs text-slate-600 dark:text-slate-300">
            ?
          </kbd>
        </button>

        {/* Sun/Moon Theme Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group"
          >
            {resolvedTheme === 'dark' ? (
              <>
                <div className="w-5 h-5 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Moon className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-slate-200 font-semibold group-hover:text-white">Dark</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center transition-transform group-hover:rotate-45">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-slate-700 font-semibold group-hover:text-slate-900">Light</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const DesktopSidebar: React.FC<{ onOpenShortcuts?: () => void }> = ({ onOpenShortcuts }) => {
  const { activeTab, setActiveTab, currentProject, projects, selectProject } = useProjects();
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-slate-200/80 dark:border-white/10 glass-surface p-5 z-30 transition-all duration-200">
      {/* Brand Header */}
      <div
        onClick={() => setActiveTab('dashboard')}
        className="cursor-pointer pb-5 border-b border-slate-200/80 dark:border-white/10"
      >
        <NexoraLogo size="md" showWordmark={true} showTagline={false} />
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
          Ideas Into Intelligence. <br />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Intelligence Into Reality.</span>
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4">
        <button
          onClick={() => setActiveTab('generator')}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-md shadow-violet-500/20 transition-all cursor-pointer group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Software Project</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1.5 font-mono">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-violet-500'
                }`}
              />
              <span className="truncate">{item.label}</span>

              <div className="ml-auto flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-violet-500/10 text-violet-500 dark:text-violet-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.id === 'projects' && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {projects.length}
                  </span>
                )}
                <kbd
                  className={`text-[10px] font-mono px-1 py-0.5 rounded transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                >
                  {item.shortcut}
                </kbd>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Active Project Card / Switcher in Sidebar Footer */}
      {currentProject && (
        <div className="pt-3 pb-3 border-t border-slate-200/80 dark:border-white/10">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-1 pb-1 font-mono flex items-center justify-between">
            <span>Active Project</span>
            <span className="text-[9px] text-violet-500 cursor-pointer" onClick={() => setActiveTab('projects')}>
              Switch
            </span>
          </div>
          <div
            onClick={() => setActiveTab('roadmap')}
            className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentProject.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {currentProject.tagline}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Profile / Hotkeys & Theme */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-2">
        <button
          onClick={toggleTheme}
          aria-label={`Toggle theme (currently ${resolvedTheme})`}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-violet-500/40 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {resolvedTheme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-violet-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono capitalize">{theme}</span>
        </button>
      </div>
    </aside>
  );
};

export const MobileTopBar: React.FC = () => {
  const { activeTab, setActiveTab } = useProjects();
  const { resolvedTheme, toggleTheme } = useTheme();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'generator': return 'AI Generator';
      case 'projects': return 'My Projects';
      case 'roadmap': return 'Roadmap';
      case 'techstack': return 'Tech Stack';
      case 'codestudio': return 'Code Studio';
      case 'readmestudio': return 'README';
      case 'settings': return 'Settings';
    }
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full glass-surface border-b border-slate-200/80 dark:border-white/10 px-4 py-3 flex items-center justify-between transition-all duration-200">
      <div onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2.5 cursor-pointer">
        <NexoraLogo size="sm" showWordmark={true} />
        {activeTab !== 'dashboard' && (
          <span className="text-xs text-slate-400 font-medium">/ {getTitle()}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('generator')}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 flex items-center gap-1 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>

        <button
          onClick={toggleTheme}
          aria-label={`Toggle theme (currently ${resolvedTheme})`}
          className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-violet-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export const MobileFloatingNav: React.FC = () => {
  const { activeTab, setActiveTab } = useProjects();

  const mobileNavItems = NAV_ITEMS.filter((item) => item.id !== 'settings');

  return (
    <nav className="lg:hidden fixed bottom-3 left-2 right-2 z-50 glass-floating-nav rounded-2xl p-1 max-w-lg mx-auto shadow-2xl">
      <div className="grid grid-cols-7 items-center gap-0.5">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-all duration-150 relative px-0.5 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white scale-105' : 'text-slate-600 dark:text-slate-400'} transition-transform`} />
              <span className="text-[8.5px] mt-0.5 tracking-tight font-medium truncate max-w-full">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
