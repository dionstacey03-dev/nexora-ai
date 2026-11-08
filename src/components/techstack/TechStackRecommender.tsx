import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Database,
  Globe,
  ShieldCheck,
  Zap,
  Server,
  Copy,
  Download,
  Loader2,
  Check,
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { StackRecommendationGroup } from '../../types';

export const TechStackRecommender: React.FC = () => {
  const { recommendTechStack, currentProject, updateProject, showToast } = useProjects();

  const [category, setCategory] = useState('Full-Stack SaaS');
  const [scale, setScale] = useState('Production SaaS (100k+ Users)');
  const [language, setLanguage] = useState('TypeScript');
  const [requirements, setRequirements] = useState(
    'Sub-20ms latency, ACID transaction guarantees, WebSocket real-time event streaming, and OAuth 2.0 multi-tenant isolation'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<StackRecommendationGroup[] | null>(null);

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const results = await recommendTechStack({
        category,
        scale,
        language,
        requirements,
      });

      setRecommendations(results);
      showToast('Tech stack evaluation synthesized!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Evaluation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load recommendation if none yet
  React.useEffect(() => {
    if (!recommendations) {
      handleEvaluate();
    }
  }, []);

  const handleApplyToCurrentProject = () => {
    if (!currentProject || !recommendations) return;

    const newStack = recommendations.map((group) => {
      let mappedCat: any = 'Frontend';
      if (group.category.toLowerCase().includes('backend')) mappedCat = 'Backend';
      else if (group.category.toLowerCase().includes('database')) mappedCat = 'Database';
      else if (group.category.toLowerCase().includes('cache') || group.category.toLowerCase().includes('state'))
        mappedCat = 'State & Cache';
      else if (group.category.toLowerCase().includes('auth') || group.category.toLowerCase().includes('security'))
        mappedCat = 'Auth & Security';
      else if (group.category.toLowerCase().includes('devops') || group.category.toLowerCase().includes('cloud'))
        mappedCat = 'DevOps & Cloud';

      return {
        category: mappedCat,
        name: group.primary.name,
        reason: group.primary.whyChoose,
        popularity: 95,
      };
    });

    updateProject(currentProject.id, { techStack: newStack });
    showToast(`Applied recommended stack to "${currentProject.name}"!`, 'success');
  };

  const copyStackMarkdown = () => {
    if (!recommendations) return;
    let md = `# Recommended Architecture & Tech Stack Matrix\n\n`;
    md += `**Domain:** ${category} | **Scale:** ${scale} | **Primary Language:** ${language}\n\n`;

    recommendations.forEach((g) => {
      md += `### ${g.category}: ${g.primary.name}\n`;
      md += `* **Overview:** ${g.primary.description}\n`;
      md += `* **Why Choose:** ${g.primary.whyChoose}\n`;
      md += `* **Key Advantages:** ${g.primary.pros.join(', ')}\n`;
      md += `* **Trade-offs:** ${g.primary.cons.join(', ')}\n`;
      if (g.alternatives?.length > 0) {
        md += `* **Alternatives:** ${g.alternatives.map((a) => `${a.name} (${a.tradeoff})`).join(', ')}\n`;
      }
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    showToast('Tech stack matrix markdown copied to clipboard', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Architecture Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Tech Stack Recommender
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deep technical recommendations with architectural rationale, pros, trade-offs, and industry pairings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentProject && (
            <button
              onClick={handleApplyToCurrentProject}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to {currentProject.name}</span>
            </button>
          )}

          <button
            onClick={copyStackMarkdown}
            title="Copy as Markdown"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Parameters Box */}
      <form
        onSubmit={handleEvaluate}
        className="p-5 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase">Domain Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Full-Stack SaaS">Full-Stack SaaS</option>
              <option value="Developer Tools & Telemetry">Developer Tools & Telemetry</option>
              <option value="AI Agent & LLM Pipeline">AI Agent & LLM Pipeline</option>
              <option value="Real-Time Collaborative Platform">Real-Time Collaborative</option>
              <option value="Mobile App & Edge Gateway">Mobile App & Edge Gateway</option>
              <option value="High-Throughput Microservices">High-Throughput Microservices</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase">Target Scale</label>
            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="MVP / Rapid Prototype">MVP / Rapid Prototype</option>
              <option value="Production SaaS (100k+ Users)">Production SaaS (100k+ Users)</option>
              <option value="High-Throughput (1M+ Active Users)">High-Throughput (1M+ Active Users)</option>
              <option value="Global Multi-Region Distributed">Global Multi-Region Distributed</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase">Primary Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="TypeScript">TypeScript (End-to-End)</option>
              <option value="Python">Python (FastAPI / Data)</option>
              <option value="Go">Go / Golang (High Concurrency)</option>
              <option value="Rust">Rust (Maximum Performance)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Specific constraints (e.g. Sub-20ms latency, ACID guarantees, WebSocket streaming)..."
            className="flex-1 w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-Evaluate Stack</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recommendations Cards Grid */}
      {isLoading ? (
        <div className="p-12 rounded-3xl glass-surface border border-violet-500/30 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">
            Synthesizing optimal tech stack matrix with Gemini 3.8 Flash...
          </p>
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="space-y-5">
          {recommendations.map((group, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4 hover:border-violet-500/30 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-xs font-mono uppercase font-bold text-violet-500">
                    {group.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {group.primary.name}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                  ★ Recommended Selection
                </span>
              </div>

              {/* Rationale & Description */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {group.primary.description}
                </p>
                <div className="p-3.5 rounded-2xl bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/15 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-violet-500 block">
                    Architectural Rationale:
                  </span>
                  <p className="leading-relaxed">{group.primary.whyChoose}</p>
                </div>
              </div>

              {/* Pros & Cons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages:
                  </span>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {group.primary.pros.map((pro, pIdx) => (
                      <li key={pIdx}>{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Architectural Trade-offs:
                  </span>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {group.primary.cons.map((con, cIdx) => (
                      <li key={cIdx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alternatives Row */}
              {group.alternatives && group.alternatives.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
                    Industry Alternatives & Trade-offs:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.alternatives.map((alt, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400"
                      >
                        <strong className="text-slate-800 dark:text-slate-200">{alt.name}:</strong>{' '}
                        <span>{alt.tradeoff}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
