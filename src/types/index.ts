export type ThemeMode = 'light' | 'dark' | 'system';

export type ActiveTab =
  | 'dashboard'
  | 'generator'
  | 'projects'
  | 'roadmap'
  | 'techstack'
  | 'codestudio'
  | 'readmestudio'
  | 'settings';

export type ProjectCategory =
  | 'fullstack-saas'
  | 'developer-tool'
  | 'ai-agent'
  | 'mobile-app'
  | 'realtime-collaborative'
  | 'web3-fintech'
  | 'marketplace'
  | 'api-microservice';

export type ProjectComplexity = 'mvp' | 'production-saas' | 'enterprise' | 'microservices';

export type ProjectStatus = 'planning' | 'in_progress' | 'architecture_ready' | 'completed';

export interface TechStackItem {
  category: 'Frontend' | 'Backend' | 'Database' | 'Auth & Security' | 'DevOps & Cloud' | 'Testing & Quality' | 'State & Cache';
  name: string;
  reason: string;
  popularity?: number; // 1-100 score
  version?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  status: 'planned' | 'in_progress' | 'completed';
}

export interface DatabaseField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  isNullable?: boolean;
  description?: string;
}

export interface DatabaseEntity {
  name: string;
  description: string;
  fields: DatabaseField[];
  relationships: string[];
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  authRequired: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  estimatedHours: number;
  tags: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetWeek: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  duration: string;
  goal: string;
  milestones: RoadmapMilestone[];
  tasks: RoadmapTask[];
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  explanation: string;
}

export interface StarterCodeBundle {
  folderStructure: string;
  frontendSnippet: CodeSnippet;
  backendSnippet: CodeSnippet;
  dbSchemaSnippet: CodeSnippet;
  envSnippet: CodeSnippet;
}

export interface SoftwareProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  category: ProjectCategory;
  targetAudience: string;
  primaryLanguage: string;
  complexity: ProjectComplexity;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  coreFeatures: FeatureItem[];
  advancedFeatures: FeatureItem[];
  techStack: TechStackItem[];
  databaseDesign: DatabaseEntity[];
  apiEndpoints: ApiEndpoint[];
  roadmap: RoadmapPhase[];
  starterCode: StarterCodeBundle;
  readmeMarkdown: string;
  userNotes?: string;
}

export interface GeneratorInput {
  idea: string;
  category: ProjectCategory;
  targetAudience: string;
  primaryLanguage: string;
  complexity: ProjectComplexity;
  additionalRequirements: string;
}

export interface UserProfile {
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  githubUsername?: string;
  bio?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'violet' | 'blue' | 'cyan' | 'emerald';
  defaultLanguage: string;
  defaultComplexity: ProjectComplexity;
  aiModel: string;
  autoSave: boolean;
  userProfile: UserProfile;
}

export interface StackRecommendationGroup {
  category: string;
  primary: {
    name: string;
    description: string;
    whyChoose: string;
    pros: string[];
    cons: string[];
  };
  alternatives: {
    name: string;
    tradeoff: string;
  }[];
}
