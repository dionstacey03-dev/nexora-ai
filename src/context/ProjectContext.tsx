import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  SoftwareProject,
  GeneratorInput,
  UserSettings,
  RoadmapTask,
  StackRecommendationGroup,
  ProjectStatus,
} from '../types';
import { INITIAL_SEED_PROJECTS } from '../data/seedProjects';

interface ProjectContextType {
  projects: SoftwareProject[];
  currentProject: SoftwareProject | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isGenerating: boolean;
  generationStep: string;
  userSettings: UserSettings;
  selectProject: (id: string, switchTab?: ActiveTab) => void;
  generateProject: (input: GeneratorInput) => Promise<SoftwareProject>;
  updateProject: (id: string, updates: Partial<SoftwareProject>) => void;
  deleteProject: (id: string) => void;
  toggleTaskStatus: (projectId: string, phaseId: string, taskId: string) => void;
  addRoadmapTask: (projectId: string, phaseId: string, task: Omit<RoadmapTask, 'id'>) => void;
  updateUserSettings: (updates: Partial<UserSettings>) => void;
  recommendTechStack: (params: { category: string; scale: string; language: string; requirements: string }) => Promise<StackRecommendationGroup[]>;
  generateCode: (params: { prompt: string; language: string; codeType: string; projectName: string }) => Promise<{ code: string; explanation: string; filename?: string }>;
  generateReadme: (project: SoftwareProject) => Promise<string>;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  exportModalProject: SoftwareProject | null;
  openExportModal: (project?: SoftwareProject) => void;
  closeExportModal: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECTS_STORAGE_KEY = 'nexora_projects_v2';
const SETTINGS_STORAGE_KEY = 'nexora_user_settings_v2';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: 'violet',
  defaultLanguage: 'TypeScript',
  defaultComplexity: 'production-saas',
  aiModel: 'gemini-3.8-flash',
  autoSave: true,
  userProfile: {
    name: 'Alex Rivera',
    role: 'Principal Software Architect',
    organization: 'Nexora Systems',
    bio: 'Building hyper-scalable distributed cloud platforms & intelligent developer tooling.',
    githubUsername: 'arivera-dev',
  },
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<SoftwareProject[]>(() => {
    if (typeof window === 'undefined') return INITIAL_SEED_PROJECTS;
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored projects:', e);
    }
    return INITIAL_SEED_PROJECTS;
  });

  const [currentProject, setCurrentProject] = useState<SoftwareProject | null>(() => {
    return projects.length > 0 ? projects[0] : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [exportModalProject, setExportModalProject] = useState<SoftwareProject | null>(null);

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects:', e);
    }
  }, [projects]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(userSettings));
    } catch {}
  }, [userSettings]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const selectProject = (id: string, switchTab?: ActiveTab) => {
    const found = projects.find((p) => p.id === id);
    if (found) {
      setCurrentProject(found);
      if (switchTab) {
        setActiveTab(switchTab);
      }
    }
  };

  const generateProject = async (input: GeneratorInput): Promise<SoftwareProject> => {
    setIsGenerating(true);
    setGenerationStep('Analyzing architectural patterns with Gemini AI...');

    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Synthesizing relational data schema & entities...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Formulating API specifications & development phases...');
    }, 2400);

    try {
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with HTTP status ${response.status}`);
      }

      const newProject: SoftwareProject = await response.json();

      setProjects((prev) => [newProject, ...prev]);
      setCurrentProject(newProject);
      showToast(`Successfully synthesized "${newProject.name}" architecture!`, 'success');
      return newProject;
    } catch (error: any) {
      console.error('Generation request failed:', error);
      showToast('Encountered an issue during AI generation. Fallback generated.', 'info');
      throw error;
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const updateProject = (id: string, updates: Partial<SoftwareProject>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: Date.now() };
          if (currentProject?.id === id) {
            setCurrentProject(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Project updated successfully', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (currentProject?.id === id) {
        setCurrentProject(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
    showToast('Project removed', 'info');
  };

  const toggleTaskStatus = (projectId: string, phaseId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const updatedRoadmap = proj.roadmap.map((phase) => {
          if (phase.id !== phaseId) return phase;

          const updatedTasks: RoadmapTask[] = phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const nextStatus: 'todo' | 'in_progress' | 'done' =
              task.status === 'todo'
                ? 'in_progress'
                : task.status === 'in_progress'
                ? 'done'
                : 'todo';
            return { ...task, status: nextStatus };
          });

          return { ...phase, tasks: updatedTasks };
        });

        const updatedProj = { ...proj, roadmap: updatedRoadmap, updatedAt: Date.now() };
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProj);
        }
        return updatedProj;
      })
    );
  };

  const addRoadmapTask = (projectId: string, phaseId: string, task: Omit<RoadmapTask, 'id'>) => {
    const newTask: RoadmapTask = {
      ...task,
      id: 'task_' + Math.random().toString(36).substring(2, 8),
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const updatedRoadmap = proj.roadmap.map((phase) => {
          if (phase.id !== phaseId) return phase;
          return { ...phase, tasks: [...phase.tasks, newTask] };
        });

        const updatedProj = { ...proj, roadmap: updatedRoadmap, updatedAt: Date.now() };
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProj);
        }
        return updatedProj;
      })
    );
    showToast('New roadmap task added', 'success');
  };

  const updateUserSettings = (updates: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...updates }));
    showToast('Preferences updated', 'success');
  };

  const recommendTechStack = async (params: {
    category: string;
    scale: string;
    language: string;
    requirements: string;
  }): Promise<StackRecommendationGroup[]> => {
    try {
      const response = await fetch('/api/recommend-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      return data.recommendations || [];
    } catch (e) {
      console.error('Stack recommendation failed:', e);
      return [];
    }
  };

  const generateCode = async (params: {
    prompt: string;
    language: string;
    codeType: string;
    projectName: string;
  }) => {
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (e) {
      console.error('Code generation failed:', e);
      return {
        code: '// Generation error occurred. Check network connection.',
        explanation: 'Could not generate code snippet.',
      };
    }
  };

  const generateReadme = async (project: SoftwareProject): Promise<string> => {
    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      const data = await response.json();
      return data.markdown || project.readmeMarkdown;
    } catch {
      return project.readmeMarkdown;
    }
  };

  const openExportModal = (project?: SoftwareProject) => {
    setExportModalProject(project || currentProject || (projects.length > 0 ? projects[0] : null));
  };

  const closeExportModal = () => {
    setExportModalProject(null);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        activeTab,
        setActiveTab,
        isGenerating,
        generationStep,
        userSettings,
        selectProject,
        generateProject,
        updateProject,
        deleteProject,
        toggleTaskStatus,
        addRoadmapTask,
        updateUserSettings,
        recommendTechStack,
        generateCode,
        generateReadme,
        toast,
        showToast,
        exportModalProject,
        openExportModal,
        closeExportModal,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
