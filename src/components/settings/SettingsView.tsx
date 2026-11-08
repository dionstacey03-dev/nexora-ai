import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Cpu,
  User,
  ShieldCheck,
  Save,
  Download,
  RotateCcw,
  Sparkles,
  Palette,
  Sliders,
  Check,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useTheme } from '../../context/ThemeContext';
import { ProjectComplexity, ThemeMode } from '../../types';
import { INITIAL_SEED_PROJECTS } from '../../data/seedProjects';

export const SettingsView: React.FC = () => {
  const { userSettings, updateUserSettings, showToast, projects } = useProjects();
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Form states
  const [profileName, setProfileName] = useState(userSettings.userProfile.name);
  const [profileRole, setProfileRole] = useState(userSettings.userProfile.role);
  const [profileOrg, setProfileOrg] = useState(userSettings.userProfile.organization);
  const [profileBio, setProfileBio] = useState(userSettings.userProfile.bio || '');
  const [profileGithub, setProfileGithub] = useState(userSettings.userProfile.githubUsername || '');

  const [defaultLang, setDefaultLang] = useState(userSettings.defaultLanguage);
  const [defaultComplexity, setDefaultComplexity] = useState<ProjectComplexity>(userSettings.defaultComplexity);
  const [autoSave, setAutoSave] = useState(userSettings.autoSave);
  const [accentColor, setAccentColor] = useState(userSettings.accentColor);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({
      defaultLanguage: defaultLang,
      defaultComplexity,
      autoSave,
      accentColor,
      userProfile: {
        name: profileName.trim() || 'Alex Rivera',
        role: profileRole.trim() || 'Lead Systems Architect',
        organization: profileOrg.trim() || 'Nexora Systems',
        bio: profileBio.trim(),
        githubUsername: profileGithub.trim(),
      },
    });
  };

  const handleExportBackup = () => {
    const backup = {
      timestamp: Date.now(),
      version: '2.0',
      projects,
      settings: userSettings,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `nexora-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Configuration & project backup exported', 'success');
  };

  const handleResetSeedData = () => {
    if (window.confirm('Reset all projects back to realistic seed blueprints?')) {
      localStorage.setItem('nexora_projects_v2', JSON.stringify(INITIAL_SEED_PROJECTS));
      window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure appearance, AI model orchestration, application defaults, and developer identity.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Theme Preferences */}
        <div className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <Palette className="w-4 h-4 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Theme & Appearance
            </h2>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase">
              Application Theme
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'light', label: 'Light Mode', icon: Sun },
                { id: 'system', label: 'System Auto', icon: Laptop },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as ThemeMode)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold shadow-xs'
                        : 'border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-violet-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Active mode: <strong className="capitalize text-slate-700 dark:text-slate-300">{resolvedTheme}</strong>. 
              Preferences are saved locally in localStorage.
            </p>
          </div>
        </div>

        {/* 2. AI Model Configuration */}
        <div className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <Cpu className="w-4 h-4 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Engine & Model Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Active Reasoning Model
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  gemini-3.8-flash
                </span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Google GenAI modern SDK with server-side proxy route protection. No client-side key exposure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Security & Telemetry
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero-Key Exposure Guarantee</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini API calls execute securely inside Express endpoints using server-side authorization.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Developer Profile & Defaults */}
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <User className="w-4 h-4 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Developer Profile & Generator Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                Developer Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                Role / Title
              </label>
              <input
                type="text"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                Organization / Team
              </label>
              <input
                type="text"
                value={profileOrg}
                onChange={(e) => setProfileOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                GitHub Handle
              </label>
              <input
                type="text"
                value={profileGithub}
                onChange={(e) => setProfileGithub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                Default Programming Language
              </label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Go">Go / Golang</option>
                <option value="Rust">Rust</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-500 uppercase">
                Default Complexity Target
              </label>
              <select
                value={defaultComplexity}
                onChange={(e) => setDefaultComplexity(e.target.value as ProjectComplexity)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="mvp">MVP / Prototype</option>
                <option value="production-saas">Production SaaS</option>
                <option value="enterprise">Enterprise Suite</option>
                <option value="microservices">Microservices</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile & Defaults</span>
            </button>
          </div>
        </form>

        {/* 4. Data Management & Backups */}
        <div className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <Sliders className="w-4 h-4 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Backup
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Export Project Blueprints & Roadmaps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download a single JSON file containing all generated architectures, schemas, and tasks.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup JSON</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Reset Sample Projects
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore the initial set of enterprise developer projects (DevPulse, HyperKV, Synthetix AI).
              </p>
            </div>
            <button
              onClick={handleResetSeedData}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Blueprints</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
