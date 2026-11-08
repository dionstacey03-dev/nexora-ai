import { SoftwareProject } from '../types';

export const INITIAL_SEED_PROJECTS: SoftwareProject[] = [
  {
    id: 'proj-nexora-1',
    name: 'DevPulse',
    tagline: 'Real-Time Team Velocity & DORA Metrics Intelligence Suite',
    description:
      'An automated developer telemetry and continuous delivery intelligence platform that integrates with GitHub, GitLab, and Jira to compute DORA metrics (Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore Service) in real time with AI-driven root-cause alerts.',
    problemStatement:
      'Engineering leaders lack unified, automated visibility into continuous delivery bottlenecks. Existing metrics tools require manual configuration, don’t correlate git pull requests with incident telemetry, and create dashboard fatigue without actionable engineering guidance.',
    proposedSolution:
      'DevPulse delivers zero-config webhook ingestion of CI/CD pipelines and pull requests, computes statistically rigorous DORA metrics across teams, and uses Gemini AI to detect velocity anomalies and suggest workflow optimizations.',
    category: 'developer-tool',
    targetAudience: 'Engineering Leaders, DevOps Engineers, and High-Velocity Tech Teams',
    primaryLanguage: 'TypeScript',
    complexity: 'production-saas',
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    coreFeatures: [
      {
        id: 'f-1',
        title: 'Zero-Config Git Webhook Ingestion',
        description: 'Secure webhook receivers for GitHub Actions, GitLab CI, and CircleCI events.',
        priority: 'high',
        complexity: 'moderate',
        status: 'completed',
      },
      {
        id: 'f-2',
        title: 'Automated 4 DORA Metrics Calculation',
        description: 'Streaming aggregations for Deployment Frequency, Lead Time, MTTR, and Change Failure Rate.',
        priority: 'high',
        complexity: 'complex',
        status: 'completed',
      },
      {
        id: 'f-3',
        title: 'Team-Based Performance Benchmarking',
        description: 'Hierarchical squads, repositories, and cross-team velocity comparison charts.',
        priority: 'medium',
        complexity: 'moderate',
        status: 'in_progress',
      },
      {
        id: 'f-4',
        title: 'AI Delivery Bottleneck Explainer',
        description: 'Gemini-powered natural language explanations of lead time spikes and flaky pull request reviews.',
        priority: 'high',
        complexity: 'complex',
        status: 'planned',
      },
    ],
    advancedFeatures: [
      {
        id: 'af-1',
        title: 'Predictive Release Risk Scoring',
        description: 'Machine learning heuristic on PR size, author tenure, and test coverage variance to predict rollback risk.',
        priority: 'medium',
        complexity: 'complex',
        status: 'planned',
      },
      {
        id: 'af-2',
        title: 'Automated Slack Incident Postmortem Drafts',
        description: 'Auto-generates markdown incident summaries and postmortem timelines from PagerDuty alerts.',
        priority: 'low',
        complexity: 'moderate',
        status: 'planned',
      },
    ],
    techStack: [
      {
        category: 'Frontend',
        name: 'React 19 + Vite + Tailwind CSS',
        reason: 'Ultra-fast HMR and reactive UI updates for high-density charts and metric heatmaps.',
        popularity: 98,
      },
      {
        category: 'Backend',
        name: 'Node.js + Express + TypeScript',
        reason: 'High I/O throughput for parsing thousands of concurrent webhook events with strict typing.',
        popularity: 92,
      },
      {
        category: 'Database',
        name: 'PostgreSQL + TimescaleDB extension',
        reason: 'Optimal for time-series event ingestion, deployment records, and fast percentile analytics.',
        popularity: 95,
      },
      {
        category: 'State & Cache',
        name: 'Redis 7',
        reason: 'In-memory caching for live dashboard metrics and distributed rate limiting on webhook endpoints.',
        popularity: 90,
      },
      {
        category: 'Auth & Security',
        name: 'OAuth 2.0 (GitHub & GitLab Apps)',
        reason: 'Fine-grained organization permissions and secure HMAC webhook verification.',
        popularity: 88,
      },
      {
        category: 'DevOps & Cloud',
        name: 'Docker + Kubernetes + GitHub Actions',
        reason: 'Containerized microservices with zero-downtime rolling deployments.',
        popularity: 94,
      },
    ],
    databaseDesign: [
      {
        name: 'Deployments',
        description: 'Stores every production release event captured from CI/CD webhooks.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true, description: 'Unique identifier' },
          { name: 'repository_id', type: 'VARCHAR(128)', isForeign: true, description: 'Target git repo' },
          { name: 'commit_sha', type: 'VARCHAR(40)', description: 'Deployed git SHA' },
          { name: 'environment', type: 'VARCHAR(32)', description: 'production | staging' },
          { name: 'status', type: 'VARCHAR(24)', description: 'success | failed | rolled_back' },
          { name: 'duration_seconds', type: 'INTEGER', description: 'Pipeline execution time' },
          { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Deployment timestamp' },
        ],
        relationships: ['Belongs to Repository', 'Has many Incidents'],
      },
      {
        name: 'PullRequests',
        description: 'Stores pull request lifecycle events for Lead Time calculation.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true },
          { name: 'pr_number', type: 'INTEGER' },
          { name: 'author', type: 'VARCHAR(64)' },
          { name: 'opened_at', type: 'TIMESTAMPTZ' },
          { name: 'first_review_at', type: 'TIMESTAMPTZ', isNullable: true },
          { name: 'merged_at', type: 'TIMESTAMPTZ', isNullable: true },
          { name: 'lines_added', type: 'INTEGER' },
          { name: 'lines_deleted', type: 'INTEGER' },
        ],
        relationships: ['Belongs to Repository'],
      },
      {
        name: 'Incidents',
        description: 'Records production failure incidents linked to deployments for MTTR & CFR.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true },
          { name: 'deployment_id', type: 'UUID', isForeign: true, isNullable: true },
          { name: 'severity', type: 'VARCHAR(16)' },
          { name: 'resolved_at', type: 'TIMESTAMPTZ', isNullable: true },
          { name: 'downtime_minutes', type: 'INTEGER' },
        ],
        relationships: ['Belongs to Deployment'],
      },
    ],
    apiEndpoints: [
      {
        id: 'ep-1',
        method: 'POST',
        path: '/api/v1/webhooks/github',
        summary: 'Ingest GitHub webhook payloads',
        description: 'Receives deployment, release, and pull_request events with HMAC signature validation.',
        requestBody: '{\n  "action": "closed",\n  "pull_request": { "merged": true, "number": 142 }\n}',
        responseBody: '{\n  "status": "accepted",\n  "job_id": "job_94103"\n}',
        authRequired: false,
      },
      {
        id: 'ep-2',
        method: 'GET',
        path: '/api/v1/metrics/dora',
        summary: 'Fetch computed DORA metrics summary',
        description: 'Returns four key metrics aggregated across time range with team filters.',
        responseBody: '{\n  "deployment_frequency": "3.8/day",\n  "lead_time_hours": 14.2,\n  "change_failure_rate": "4.1%",\n  "mttr_minutes": 28\n}',
        authRequired: true,
      },
      {
        id: 'ep-3',
        method: 'GET',
        path: '/api/v1/reports/insights',
        summary: 'Get AI-generated velocity insights',
        description: 'Returns AI recommendations for reducing review cycle latency.',
        responseBody: '{\n  "insights": [\n    "PR review turnaround averaged 18h for backend repo.",\n    "Deployment cadence increased by 22% after branch merge rule update."\n  ]\n}',
        authRequired: true,
      },
    ],
    roadmap: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Core Ingestion & DB Architecture',
        duration: 'Week 1-3',
        goal: 'Establish robust webhook listeners and PostgreSQL schema with HMAC verification.',
        milestones: [
          { id: 'm-1', title: 'Complete GitHub app manifest & HMAC verification', completed: true, targetWeek: 'Week 1' },
          { id: 'm-2', title: 'Deploy PostgreSQL TimescaleDB schema migrations', completed: true, targetWeek: 'Week 2' },
          { id: 'm-3', title: 'Build background worker queue with Redis', completed: true, targetWeek: 'Week 3' },
        ],
        tasks: [
          { id: 't-1', title: 'Implement Express webhook route with cryptographic signature check', description: 'Verify X-Hub-Signature-256 header against organization webhook secrets', status: 'done', estimatedHours: 8, tags: ['Security', 'API'] },
          { id: 't-2', title: 'Write Drizzle ORM schemas for deployments & PRs', description: 'Define primary keys, indexes on repository_id and created_at', status: 'done', estimatedHours: 6, tags: ['Database'] },
          { id: 't-3', title: 'Setup BullMQ worker for asynchronous event parsing', description: 'Offload raw JSON payload parsing from HTTP server', status: 'done', estimatedHours: 10, tags: ['Architecture'] },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'DORA Metric Calculation Engine',
        duration: 'Week 4-6',
        goal: 'Implement standard DORA calculation algorithms with 7d, 30d, and 90d rolling windows.',
        milestones: [
          { id: 'm-4', title: 'Lead time median calculation verified against test fixtures', completed: true, targetWeek: 'Week 4' },
          { id: 'm-5', title: 'Change Failure Rate linking engine ready', completed: false, targetWeek: 'Week 5' },
          { id: 'm-6', title: 'Grafana-style reactive dashboard UI', completed: false, targetWeek: 'Week 6' },
        ],
        tasks: [
          { id: 't-4', title: 'Write SQL aggregate queries for deployment frequency percentiles', description: 'Compute daily releases and categorise into Elite/High/Medium/Low tiers', status: 'done', estimatedHours: 8, tags: ['Metrics', 'SQL'] },
          { id: 't-5', title: 'Build incident correlation matcher algorithm', description: 'Match PagerDuty incident timestamps to closest preceding deployment', status: 'in_progress', estimatedHours: 12, tags: ['Algorithms'] },
          { id: 't-6', title: 'Create interactive Recharts metric trend components in React', description: 'Sparklines, gauge charts, and trend diff indicators', status: 'in_progress', estimatedHours: 14, tags: ['Frontend'] },
        ],
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'AI Intelligence & Predictive Alerts',
        duration: 'Week 7-9',
        goal: 'Integrate Gemini API for proactive engineering bottleneck diagnosis.',
        milestones: [
          { id: 'm-7', title: 'Gemini reasoning agent pipeline for PR review analysis', completed: false, targetWeek: 'Week 8' },
          { id: 'm-8', title: 'Slack & Teams webhook alert dispatcher', completed: false, targetWeek: 'Week 9' },
        ],
        tasks: [
          { id: 't-7', title: 'Configure server-side Gemini 3.8 Flash prompt pipeline', description: 'Feed aggregated lead time data and receive concise, actionable sprint retro tips', status: 'todo', estimatedHours: 10, tags: ['AI', 'Gemini'] },
          { id: 't-8', title: 'Build Slack bot notifications for sudden MTTR degradation', description: 'Send automated alert when change failure rate exceeds 15% threshold', status: 'todo', estimatedHours: 8, tags: ['Integrations'] },
        ],
      },
    ],
    starterCode: {
      folderStructure: `devpulse-platform/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── webhooks.ts
│   │   │   ├── metrics.ts
│   │   │   └── auth.ts
│   │   └── middleware/
│   │       ├── hmacValidator.ts
│   │       └── errorHandler.ts
│   ├── core/
│   │   ├── doraEngine.ts
│   │   └── geminiAdvisor.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   └── web/
│       ├── components/
│       │   ├── DoraCard.tsx
│       │   └── MetricTrendChart.tsx
│       ├── App.tsx
│       └── main.tsx
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json`,
      frontendSnippet: {
        filename: 'src/web/components/DoraCard.tsx',
        language: 'typescript',
        code: `import React from 'react';
import { TrendingUp, TrendingDown, Clock, ShieldAlert, Rocket, CheckCircle } from 'lucide-react';

interface DoraCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  tier: 'Elite' | 'High' | 'Medium' | 'Low';
  icon: 'deploy' | 'leadTime' | 'mttr' | 'cfr';
}

export const DoraCard: React.FC<DoraCardProps> = ({
  title,
  value,
  trend,
  isPositive,
  tier,
  icon,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'deploy': return <Rocket className="w-5 h-5 text-violet-400" />;
      case 'leadTime': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'mttr': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'cfr': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    }
  };

  const tierColors = {
    Elite: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    High: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Low: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md hover:border-violet-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
          {getIcon()}
        </div>
        <span className={\`text-xs font-semibold px-2.5 py-0.5 rounded-full border \${tierColors[tier]}\`}>
          {tier} Performer
        </span>
      </div>
      <div className="mt-4">
        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-medium">{title}</h4>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
          <span className={\`text-xs font-medium flex items-center \${isPositive ? 'text-emerald-400' : 'text-rose-400'}\`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
};`,
        explanation: 'React component rendering real-time DORA metric card with DORA tier badge and trend delta.',
      },
      backendSnippet: {
        filename: 'src/api/routes/webhooks.ts',
        language: 'typescript',
        code: `import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../../db';
import { deploymentsTable } from '../../db/schema';

export const webhookRouter = Router();

function verifyGitHubSignature(req: Request, secret: string): boolean {
  const signature = req.headers['x-hub-signature-256'] as string;
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

webhookRouter.post('/github', async (req: Request, res: Response) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
  if (!verifyGitHubSignature(req, secret)) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const event = req.headers['x-github-event'];
  if (event === 'deployment_status') {
    const { deployment, deployment_status, repository } = req.body;
    if (deployment_status.state === 'success') {
      await db.insert(deploymentsTable).values({
        repositoryId: repository.full_name,
        commitSha: deployment.sha,
        environment: deployment.environment,
        status: 'success',
        createdAt: new Date(deployment_status.created_at),
      });
    }
  }

  return res.status(202).json({ received: true });
});`,
        explanation: 'Express webhook endpoint with constant-time HMAC validation and automated deployment ingestion.',
      },
      dbSchemaSnippet: {
        filename: 'src/db/schema.ts',
        language: 'typescript',
        code: `import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const deploymentsTable = pgTable('deployments', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: varchar('repository_id', { length: 128 }).notNull(),
  commitSha: varchar('commit_sha', { length: 40 }).notNull(),
  environment: varchar('environment', { length: 32 }).notNull().default('production'),
  status: varchar('status', { length: 24 }).notNull(),
  durationSeconds: integer('duration_seconds'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});`,
        explanation: 'PostgreSQL schema with Drizzle ORM mapping deployment telemetry with timezone-aware timestamps.',
      },
      envSnippet: {
        filename: '.env.example',
        language: 'bash',
        code: `PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/devpulse
REDIS_URL=redis://localhost:6379
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GEMINI_API_KEY=your_gemini_api_key_here`,
        explanation: 'Environment variables for database connection, webhook security, and Gemini intelligence.',
      },
    },
    readmeMarkdown: `# DevPulse

> Real-Time Team Velocity & DORA Metrics Intelligence Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![DORA Metrics](https://img.shields.io/badge/DORA-Automated-purple)](https://cloud.google.com/devops)

## Problem Statement
Engineering leaders lack unified, automated visibility into continuous delivery bottlenecks. Existing metrics tools require manual configuration, don’t correlate git pull requests with incident telemetry, and create dashboard fatigue without actionable engineering guidance.

## Proposed Solution
DevPulse delivers zero-config webhook ingestion of CI/CD pipelines and pull requests, computes statistically rigorous DORA metrics across teams, and uses Gemini AI to detect velocity anomalies and suggest workflow optimizations.

## Core Features
* **Zero-Config Git Webhook Ingestion**: Secure webhooks for GitHub Actions, GitLab CI, and CircleCI.
* **Automated 4 DORA Metrics**: Real-time aggregation of Deployment Frequency, Lead Time, MTTR, and Change Failure Rate.
* **Squad & Repository Benchmarking**: Cross-team comparative telemetry with privacy-respecting aggregate data.
* **AI Root-Cause Diagnostics**: Gemini 3.8 Flash explanations for review bottlenecks and rollback anomalies.

## Tech Stack
* **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons
* **Backend**: Node.js, Express, TypeScript, BullMQ
* **Database**: PostgreSQL with TimescaleDB, Redis 7
* **AI Engine**: Google Gemini API

## Quick Start

\`\`\`bash
# 1. Clone repository
git clone https://github.com/organization/devpulse.git
cd devpulse

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Run database migrations
npm run db:push

# 5. Start dev server
npm run dev
\`\`\`

## Architecture
\`\`\`
[GitHub/GitLab CI] ---> [HMAC Webhook Ingestion]
                                 │
                                 ▼
                         [Redis BullMQ]
                                 │
                                 ▼
                     [PostgreSQL TimescaleDB]
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
     [DORA Metrics Engine]                [Gemini AI Analyzer]
             │                                       │
             └───────────────────┬───────────────────┘
                                 ▼
                    [Real-time React Dashboard]
\`\`\`

## License
MIT © 2026 NEXORA AI Software Builder.`,
    userNotes: 'Project architecture validated. Ingesting sample GitHub webhook payloads for sprint testing.',
  },
  {
    id: 'proj-nexora-2',
    name: 'HyperKV',
    tagline: 'Distributed Edge Key-Value Store with CRDT Conflict Resolution',
    description:
      'A high-throughput, low-latency globally distributed key-value cache built for edge runtimes (Cloudflare Workers, Deno, Node.js) featuring Conflict-Free Replicated Data Types (CRDTs), time-to-live TTL tiers, and sub-5ms read latencies.',
    problemStatement:
      'Modern microservices deployed across multiple cloud regions suffer from severe cross-region database query latency and complex split-brain synchronization issues when edge nodes become temporarily disconnected.',
    proposedSolution:
      'HyperKV provides a multi-region distributed memory store with State-based CRDTs, automated gossip protocol replication, and HTTP/REST and WebSocket APIs for instant edge cache synchronization.',
    category: 'api-microservice',
    targetAudience: 'Infrastructure Engineers, Cloud Architects, and Edge Computing Developers',
    primaryLanguage: 'TypeScript',
    complexity: 'microservices',
    status: 'in_progress',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 20,
    coreFeatures: [
      { id: 'h-1', title: 'State-based PN-Counter & LWW-Register CRDTs', description: 'Deterministic conflict-free synchronization across multi-region nodes without global locks.', priority: 'high', complexity: 'complex', status: 'completed' },
      { id: 'h-2', title: 'Sub-millisecond Local Memory Tier', description: 'LRU eviction with fine-grained TTL support and memory pressure backoff.', priority: 'high', complexity: 'moderate', status: 'completed' },
      { id: 'h-3', title: 'REST & gRPC Client Interfaces', description: 'Fast HTTP/2 and gRPC transport protocols for low-overhead network serialization.', priority: 'medium', complexity: 'moderate', status: 'in_progress' },
      { id: 'h-4', title: 'Peer-to-Peer Gossip Replication', description: 'Decentralized peer node discovery and heartbeats using UDP/WebSocket mesh.', priority: 'high', complexity: 'complex', status: 'planned' },
    ],
    advancedFeatures: [
      { id: 'haf-1', title: 'Encrypted Zero-Knowledge Edge Buckets', description: 'Client-side AES-256-GCM envelope encryption before replication.', priority: 'medium', complexity: 'complex', status: 'planned' },
    ],
    techStack: [
      { category: 'Backend', name: 'Node.js + Fastify + TypeScript', reason: 'Near zero-overhead JSON serialization and fast async I/O pipeline.', popularity: 93 },
      { category: 'State & Cache', name: 'In-Memory CRDT Engine + RocksDB', reason: 'High sequential write performance with disk persistence layer.', popularity: 91 },
      { category: 'DevOps & Cloud', name: 'Docker + Fly.io Anycast DNS', reason: 'Deploying edge nodes globally across 35+ physical cloud locations.', popularity: 89 },
    ],
    databaseDesign: [
      {
        name: 'KV_Entries',
        description: 'Primary storage record containing key, payload, version vector, and expiration.',
        fields: [
          { name: 'key', type: 'VARCHAR(512)', isPrimary: true },
          { name: 'value', type: 'BLOB / JSONB' },
          { name: 'version_vector', type: 'JSONB', description: 'Node clock map for causality' },
          { name: 'ttl_epoch', type: 'BIGINT', isNullable: true },
        ],
        relationships: ['Mapped by Namespace'],
      },
    ],
    apiEndpoints: [
      { id: 'ep-h1', method: 'GET', path: '/api/v1/kv/:key', summary: 'Retrieve key value', description: 'Reads from local memory tier with fallback to peers.', responseBody: '{\n  "key": "session:user_891",\n  "value": { "role": "admin" },\n  "version": 4\n}', authRequired: true },
      { id: 'ep-h2', method: 'PUT', path: '/api/v1/kv/:key', summary: 'Set or update key value', description: 'Applies CRDT LWW update and initiates gossip broadcast.', requestBody: '{\n  "value": { "role": "admin" },\n  "ttlSeconds": 3600\n}', responseBody: '{\n  "success": true,\n  "clock": { "node_us_east": 14 }\n}', authRequired: true },
    ],
    roadmap: [
      {
        id: 'hphase-1',
        phaseNumber: 1,
        title: 'CRDT Core & Memory Management',
        duration: 'Week 1-4',
        goal: 'Implement LWW Register and LRU cache with deterministic conflict resolution.',
        milestones: [
          { id: 'hm-1', title: 'Verify CRDT commutative properties in unit tests', completed: true, targetWeek: 'Week 2' },
          { id: 'hm-2', title: 'Benchmark 50,000 ops/sec local throughput', completed: true, targetWeek: 'Week 4' },
        ],
        tasks: [
          { id: 'ht-1', title: 'Implement Lamport Clock & Vector Clock structures', description: 'Logical clock tracking per node', status: 'done', estimatedHours: 12, tags: ['Core', 'CRDT'] },
          { id: 'ht-2', title: 'Build memory-bounded LRU map with TTL eviction ticker', description: 'Efficient O(1) doubly linked list map', status: 'done', estimatedHours: 8, tags: ['Memory'] },
        ],
      },
    ],
    starterCode: {
      folderStructure: `hyperkv/
├── src/
│   ├── crdt/
│   │   ├── vectorClock.ts
│   │   └── lwwRegister.ts
│   ├── storage/
│   │   ├── memoryTier.ts
│   │   └── diskTier.ts
│   ├── network/
│   │   ├── gossip.ts
│   │   └── server.ts
│   └── index.ts
├── Dockerfile
└── package.json`,
      frontendSnippet: {
        filename: 'src/web/KVViewer.tsx',
        language: 'typescript',
        code: `// Edge cache inspector dashboard component
import React, { useState } from 'react';
export const KVViewer = () => <div className="p-4 bg-slate-900 rounded-xl text-white">HyperKV Node Inspector Active</div>;`,
        explanation: 'Inspector component for active key-value entries.',
      },
      backendSnippet: {
        filename: 'src/crdt/lwwRegister.ts',
        language: 'typescript',
        code: `export class LWWRegister<T> {
  constructor(
    public readonly id: string,
    public value: T,
    public timestamp: number
  ) {}

  merge(other: LWWRegister<T>): void {
    if (other.timestamp > this.timestamp) {
      this.value = other.value;
      this.timestamp = other.timestamp;
    }
  }
}`,
        explanation: 'Deterministic Last-Write-Wins Register implementation for multi-node conflict resolution.',
      },
      dbSchemaSnippet: {
        filename: 'src/storage/schema.sql',
        language: 'sql',
        code: `CREATE TABLE IF NOT EXISTS kv_records (
  key VARCHAR(512) PRIMARY KEY,
  value BYTEA NOT NULL,
  clock_json JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);`,
        explanation: 'PostgreSQL storage fallback table.',
      },
      envSnippet: {
        filename: '.env.example',
        language: 'bash',
        code: `NODE_ID=node_us_east_1\nPORT=8080\nPEER_NODES=node_eu_west_1:8080,node_ap_southeast_1:8080`,
        explanation: 'Node network peering config.',
      },
    },
    readmeMarkdown: `# HyperKV\n\n> Distributed Edge Key-Value Store with CRDT Conflict Resolution\n\nHigh-throughput edge cache for global applications.`,
  },
  {
    id: 'proj-nexora-3',
    name: 'Synthetix AI',
    tagline: 'Automated Test Suite & Mock Data Intelligence Platform',
    description:
      'A developer tool that analyzes TypeScript types, GraphQL schemas, and OpenAPI specs to auto-generate end-to-end Playwright tests, edge-case unit tests, and realistic synthetic mock databases using Google Gemini AI.',
    problemStatement:
      'Developers spend 40% of sprint time manually writing repetitive boilerplate test fixtures and synthetic seed data, leading to low test coverage and missing brittle edge-case bugs in production.',
    proposedSolution:
      'Synthetix parses repository ASTs, identifies untested code paths and API contracts, and synthesizes complete, runnable Vitest and Playwright test suites alongside relational mock datasets.',
    category: 'ai-agent',
    targetAudience: 'Frontend & Full-Stack Developers, QA Engineers',
    primaryLanguage: 'TypeScript',
    complexity: 'production-saas',
    status: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
    coreFeatures: [
      { id: 's-1', title: 'OpenAPI & TypeScript AST Parser', description: 'Extracts full request/response schemas and boundary conditions.', priority: 'high', complexity: 'moderate', status: 'completed' },
      { id: 's-2', title: 'Gemini Edge-Case Generator', description: 'Produces boundary inputs (Unicode, max integers, null transitions).', priority: 'high', complexity: 'complex', status: 'completed' },
      { id: 's-3', title: 'Playwright & Vitest Code Exporter', description: 'Outputs ready-to-run test files that plug directly into CI/CD.', priority: 'high', complexity: 'moderate', status: 'completed' },
    ],
    advancedFeatures: [
      { id: 'saf-1', title: 'Self-Healing Test Selector Auto-Fixer', description: 'Uses visual diffing and DOM tree similarity to update broken CSS selectors.', priority: 'medium', complexity: 'complex', status: 'completed' },
    ],
    techStack: [
      { category: 'Frontend', name: 'React 19 + Tailwind CSS', reason: 'High responsiveness for viewing generated test trees.', popularity: 96 },
      { category: 'Backend', name: 'TypeScript + AST Morph + Gemini API', reason: 'Fast AST extraction and code transformation.', popularity: 94 },
      { category: 'Testing & Quality', name: 'Vitest + Playwright', reason: 'Industry gold standard modern testing frameworks.', popularity: 97 },
    ],
    databaseDesign: [
      {
        name: 'TestRuns',
        description: 'Records of generated and executed test suites.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true },
          { name: 'repository', type: 'VARCHAR(128)' },
          { name: 'tests_generated', type: 'INTEGER' },
          { name: 'coverage_boost', type: 'VARCHAR(16)' },
        ],
        relationships: ['Belongs to User'],
      },
    ],
    apiEndpoints: [
      { id: 'ep-s1', method: 'POST', path: '/api/v1/generate-tests', summary: 'Generate tests from schema', description: 'Analyzes input contract and outputs test code.', responseBody: '{\n  "tests_created": 12,\n  "coverage_delta": "+28%"\n}', authRequired: true },
    ],
    roadmap: [
      {
        id: 'sphase-1',
        phaseNumber: 1,
        title: 'Engine Stabilization & Playwright Integration',
        duration: 'Completed',
        goal: 'Ship production AST parser and test generator.',
        milestones: [{ id: 'sm-1', title: 'Ship v1.0.0 CLI to npm', completed: true, targetWeek: 'Week 4' }],
        tasks: [{ id: 'st-1', title: 'Implement CLI generator interface', description: 'Terminal command npx synthetix-ai generate', status: 'done', estimatedHours: 16, tags: ['CLI'] }],
      },
    ],
    starterCode: {
      folderStructure: `synthetix/
├── src/
│   ├── parser/
│   │   └── schemaParser.ts
│   ├── generator/
│   │   └── testSynthesizer.ts
│   └── cli.ts
└── package.json`,
      frontendSnippet: {
        filename: 'src/web/TestRunner.tsx',
        language: 'typescript',
        code: `export const TestRunner = () => <div>Synthetix AI Test Runner Completed</div>;`,
        explanation: 'Test runner view component.',
      },
      backendSnippet: {
        filename: 'src/generator/testSynthesizer.ts',
        language: 'typescript',
        code: `export async function synthesizeTestSuite(schema: string) {\n  return 'describe("Auto-Generated Tests", () => { it("handles null boundary", () => {}); });';\n}`,
        explanation: 'Core test synthesis orchestrator.',
      },
      dbSchemaSnippet: {
        filename: 'src/db/schema.ts',
        language: 'typescript',
        code: `export const testRuns = {};`,
        explanation: 'Test run logging schema.',
      },
      envSnippet: {
        filename: '.env.example',
        language: 'bash',
        code: `GEMINI_API_KEY=your_key_here`,
        explanation: 'Gemini API key configuration.',
      },
    },
    readmeMarkdown: `# Synthetix AI\n\n> Automated Test Suite & Mock Data Intelligence Platform\n\nAuto-generates end-to-end tests and boundary data.`,
  },
];
