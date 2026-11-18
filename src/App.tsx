/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClerkProvider, Show, SignInButton, SignUpButton } from '@clerk/react';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import {
  DesktopSidebar,
  DesktopTopNav,
  MobileTopBar,
  MobileFloatingNav,
} from './components/layout/Navbar';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { ProjectGenerator } from './components/generator/ProjectGenerator';
import { MyProjects } from './components/projects/MyProjects';
import { RoadmapBuilder } from './components/roadmap/RoadmapBuilder';
import { TechStackRecommender } from './components/techstack/TechStackRecommender';
import { CodeStudio } from './components/codestudio/CodeStudio';
import { ReadmeStudio } from './components/readmestudio/ReadmeStudio';
import { SettingsView } from './components/settings/SettingsView';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { ExportPlanModal } from './components/common/ExportPlanModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Command, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useProjects();

  return (
    <main className="flex-1 w-full pb-24 lg:pb-12 pt-2 sm:pt-4 overflow-y-auto">
      {activeTab === 'dashboard' && <DashboardHome />}
      {activeTab === 'generator' && <ProjectGenerator />}
      {activeTab === 'projects' && <MyProjects />}
      {activeTab === 'roadmap' && <RoadmapBuilder />}
      {activeTab === 'techstack' && <TechStackRecommender />}
      {activeTab === 'codestudio' && <CodeStudio />}
      {activeTab === 'readmestudio' && <ReadmeStudio />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
};

const AppShell: React.FC = () => {
  const { activeTab, setActiveTab, toast, showToast, exportModalProject, closeExportModal } = useProjects();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  useKeyboardShortcuts({
    activeTab,
    setActiveTab,
    toggleShortcutsModal: () => setShowShortcutsModal((prev) => !prev),
    closeAllModals: () => setShowShortcutsModal(false),
    showToast: (msg) => showToast(msg, 'info'),
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#080c16] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative liquid-mesh-bg selection:bg-blue-500/25 selection:text-blue-700 dark:selection:text-cyan-200">
      {/* Desktop Navigation Sidebar with shortcuts trigger */}
      <DesktopSidebar onOpenShortcuts={() => setShowShortcutsModal(true)} />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Desktop Top Navigation Bar */}
        <DesktopTopNav onOpenShortcuts={() => setShowShortcutsModal(true)} />

        {/* Mobile Top App Bar */}
        <MobileTopBar />

        {/* Dynamic View Content */}
        <MainContent />
      </div>

      {/* Mobile Bottom Floating Nav */}
      <MobileFloatingNav />

      {/* Keyboard Shortcuts Guide Modal */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Export Plan Modal */}
      <ExportPlanModal
        isOpen={!!exportModalProject}
        onClose={closeExportModal}
        project={exportModalProject}
        onShowToast={showToast}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 glass-floating-nav px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/20 animate-fade-in pointer-events-none">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkSetupRequired() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">NEXORA AI · V2</div>
        <h1 className="mt-3 text-3xl font-bold">Authentication setup required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Add the Clerk publishable key to this Vercel environment to enable secure sign-in.
          The workspace stays locked until authentication is configured.
        </p>
        <p className="mt-5 rounded-xl bg-black/30 p-3 font-mono text-xs text-cyan-200">
          VITE_CLERK_PUBLISHABLE_KEY
        </p>
      </section>
    </main>
  );
}

function ClerkAuthExperience() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Show when="signed-in">
        <ThemeProvider>
          <ProjectProvider>
            <AppShell />
          </ProjectProvider>
        </ThemeProvider>
      </Show>
      <Show when="signed-out">
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 text-white">
          <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">NEXORA AI</div>
            <h1 className="mt-3 text-3xl font-bold">Your software command centre</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Sign in to access your projects, architecture plans, roadmaps and AI tools.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <SignInButton mode="modal">
                <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Create account</button>
              </SignUpButton>
            </div>
          </section>
        </main>
      </Show>
    </ClerkProvider>
  );
}

export default function App() {
  if (!clerkPublishableKey) return <ClerkSetupRequired />;
  return <ClerkAuthExperience />;
}
