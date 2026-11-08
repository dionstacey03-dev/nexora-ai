import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Keep incoming JSON payloads small to reduce memory and abuse risk.
app.use(express.json({ limit: '1mb', strict: true }));

// Lightweight per-process API rate limiter. For multi-instance deployments,
// use a shared store such as Redis or a managed gateway-level limiter.
const API_RATE_WINDOW_MS = 15 * 60 * 1000;
const API_RATE_MAX_REQUESTS = 20;
const apiRequestCounts = new Map<string, { count: number; resetAt: number }>();

app.use('/api', (req: Request, res: Response, next) => {
  const now = Date.now();
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  let entry = apiRequestCounts.get(clientKey);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + API_RATE_WINDOW_MS };
    apiRequestCounts.set(clientKey, entry);
  }
  entry.count += 1;
  res.setHeader('RateLimit-Limit', API_RATE_MAX_REQUESTS);
  res.setHeader('RateLimit-Remaining', Math.max(0, API_RATE_MAX_REQUESTS - entry.count));
  res.setHeader('RateLimit-Reset', Math.ceil(entry.resetAt / 1000));
  if (entry.count > API_RATE_MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  if (apiRequestCounts.size > 1000) {
    for (const [key, value] of apiRequestCounts) {
      if (now >= value.resetAt) apiRequestCounts.delete(key);
    }
    if (apiRequestCounts.size > 5000) apiRequestCounts.clear();
  }
  next();
});

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isOptionalString(value: unknown, maxLength: number): boolean {
  return value === undefined || (typeof value === 'string' && value.length <= maxLength);
}

// Initialize Google GenAI on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    // Prevent stalled Gemini requests from holding a Vercel function open.
    timeout: 90_000,
    retryOptions: {
      attempts: 1,
    },
    headers: {
      'User-Agent': 'NEXORA-AI',
    },
  },
});

// Helper for fallback generation if API key is not present or rate limited
function buildFallbackProject(input: any) {
  const idea = input.idea || 'Full-Stack Intelligent Developer Platform';
  const category = input.category || 'fullstack-saas';
  const lang = input.primaryLanguage || 'TypeScript';
  const complexity = input.complexity || 'production-saas';
  const audience = input.targetAudience || 'Modern Software Engineering Teams & Technical Founders';
  const id = 'proj_' + Math.random().toString(36).substring(2, 9);

  const cleanName = idea
    .split(' ')
    .slice(0, 3)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).replace(/[^a-zA-Z0-9]/g, ''))
    .join('');
  const projectName = cleanName.length > 2 ? cleanName : 'OmniForge AI';

  return {
    id,
    name: projectName,
    tagline: `Intelligent ${category.replace('-', ' ').toUpperCase()} Architecture Built for Scale`,
    description: `A production-grade ${complexity} platform designed specifically for ${audience}, solving core workflow friction through automated orchestration, robust ${lang} services, and low-latency APIs.`,
    problemStatement: `${audience} currently struggle with fragmented tooling, high maintenance overhead, and lack of cohesive automation when attempting to execute: "${idea}".`,
    proposedSolution: `A purpose-built, high-performance architecture utilizing ${lang}, reactive frontends, resilient persistence, and event-driven pipelines to streamline ${idea} into an intuitive developer-first experience.`,
    category,
    targetAudience: audience,
    primaryLanguage: lang,
    complexity,
    status: 'architecture_ready',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    coreFeatures: [
      {
        id: 'f-core-1',
        title: 'Core Workflow Orchestrator',
        description: 'Automates end-to-end execution of primary user journeys with atomic state persistence.',
        priority: 'high',
        complexity: 'moderate',
        status: 'planned',
      },
      {
        id: 'f-core-2',
        title: 'Secure Multi-Tenant Auth & RBAC',
        description: 'Session management, role-based access control, and organization-scoped data isolation.',
        priority: 'high',
        complexity: 'moderate',
        status: 'planned',
      },
      {
        id: 'f-core-3',
        title: 'Real-Time Streaming Telemetry & Event Bus',
        description: 'WebSocket and SSE connections broadcasting live execution status and metric updates.',
        priority: 'high',
        complexity: 'complex',
        status: 'planned',
      },
      {
        id: 'f-core-4',
        title: 'Comprehensive Analytics & Audit Trail',
        description: 'Immutable ledger logging operations, usage metrics, and latency percentiles.',
        priority: 'medium',
        complexity: 'moderate',
        status: 'planned',
      },
    ],
    advancedFeatures: [
      {
        id: 'f-adv-1',
        title: 'Predictive Resource Scaling & Auto-Heal',
        description: 'Automated queue management and backpressure throttling during traffic spikes.',
        priority: 'medium',
        complexity: 'complex',
        status: 'planned',
      },
      {
        id: 'f-adv-2',
        title: 'Extensible Webhook & Plugin Gateway',
        description: 'Third-party developer ecosystem allowing custom transforms and event listeners.',
        priority: 'low',
        complexity: 'moderate',
        status: 'planned',
      },
    ],
    techStack: [
      {
        category: 'Frontend',
        name: 'React 19 + Vite + Tailwind CSS',
        reason: 'Optimal rendering performance, modular design system, and rapid prototyping.',
        popularity: 97,
      },
      {
        category: 'Backend',
        name: `${lang} + Express / Fastify Framework`,
        reason: 'Type-safe endpoints, battle-tested ecosystem, and high concurrency support.',
        popularity: 94,
      },
      {
        category: 'Database',
        name: 'PostgreSQL 16 with Relational Indexing',
        reason: 'ACID guarantees, JSONB flexibility, and robust data integrity for multi-tenant SaaS.',
        popularity: 96,
      },
      {
        category: 'State & Cache',
        name: 'Redis 7 In-Memory Cache',
        reason: 'Sub-millisecond session caching and distributed pub/sub event channels.',
        popularity: 91,
      },
      {
        category: 'Auth & Security',
        name: 'JWT + OAuth2 + Argon2 Hashing',
        reason: 'Cryptographically sound token handling with zero-trust perimeter verification.',
        popularity: 89,
      },
      {
        category: 'DevOps & Cloud',
        name: 'Docker + GitHub Actions CI/CD',
        reason: 'Hermetic containerized builds, automated test execution, and reproducible deployments.',
        popularity: 95,
      },
    ],
    databaseDesign: [
      {
        name: 'Organizations',
        description: 'Tenant isolation root entity for multi-tenant access.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true, description: 'Primary Key' },
          { name: 'name', type: 'VARCHAR(128)', description: 'Company or team name' },
          { name: 'slug', type: 'VARCHAR(64)', description: 'URL-friendly unique handle' },
          { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation timestamp' },
        ],
        relationships: ['Has many Users', 'Has many Projects'],
      },
      {
        name: 'Users',
        description: 'Authenticated accounts and credential references.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true },
          { name: 'org_id', type: 'UUID', isForeign: true, description: 'Organization foreign key' },
          { name: 'email', type: 'VARCHAR(255)', description: 'Unique user email' },
          { name: 'role', type: 'VARCHAR(32)', description: 'admin | member | viewer' },
          { name: 'created_at', type: 'TIMESTAMPTZ' },
        ],
        relationships: ['Belongs to Organization', 'Has many ActivityLogs'],
      },
      {
        name: 'Resources',
        description: 'Core domain data model managed by this software platform.',
        fields: [
          { name: 'id', type: 'UUID', isPrimary: true },
          { name: 'org_id', type: 'UUID', isForeign: true },
          { name: 'title', type: 'VARCHAR(255)' },
          { name: 'metadata', type: 'JSONB', isNullable: true },
          { name: 'status', type: 'VARCHAR(32)' },
          { name: 'updated_at', type: 'TIMESTAMPTZ' },
        ],
        relationships: ['Belongs to Organization'],
      },
    ],
    apiEndpoints: [
      {
        id: 'ep-f-1',
        method: 'POST',
        path: '/api/v1/resources',
        summary: 'Create and initialize a new domain resource',
        description: 'Validates input payload, verifies permissions, and broadcasts creation event.',
        requestBody: '{\n  "title": "Production Deployment Pipeline",\n  "metadata": { "region": "us-east-1" }\n}',
        responseBody: '{\n  "id": "res_849204",\n  "status": "initialized",\n  "created_at": "2026-11-08T05:00:00Z"\n}',
        authRequired: true,
      },
      {
        id: 'ep-f-2',
        method: 'GET',
        path: '/api/v1/resources',
        summary: 'Query domain resources with pagination and search',
        description: 'Returns filtered list scoped to the calling organization with cursor pagination.',
        responseBody: '{\n  "data": [\n    { "id": "res_849204", "title": "Pipeline", "status": "active" }\n  ],\n  "next_cursor": null\n}',
        authRequired: true,
      },
      {
        id: 'ep-f-3',
        method: 'GET',
        path: '/api/v1/health',
        summary: 'System health check and dependency connectivity',
        description: 'Pings database, Redis cache, and message queue returning latency metrics.',
        responseBody: '{\n  "status": "healthy",\n  "db_latency_ms": 2.4,\n  "cache_latency_ms": 0.8\n}',
        authRequired: false,
      },
    ],
    roadmap: [
      {
        id: 'phase-f-1',
        phaseNumber: 1,
        title: 'Architectural Foundation & Data Schemas',
        duration: 'Weeks 1 - 3',
        goal: 'Establish containerized environment, database migrations, and authentication middleware.',
        milestones: [
          { id: 'm-f-1', title: 'PostgreSQL schema & seed migrations running locally and in CI', completed: true, targetWeek: 'Week 1' },
          { id: 'm-f-2', title: 'Authentication endpoints & JWT session validation complete', completed: true, targetWeek: 'Week 2' },
          { id: 'm-f-3', title: 'Modular project skeleton and shared types package', completed: false, targetWeek: 'Week 3' },
        ],
        tasks: [
          { id: 't-f-1', title: 'Setup database ORM models and automated migration runner', description: 'Configure schema with strict foreign keys and audit timestamps', status: 'done', estimatedHours: 8, tags: ['Database', 'Setup'] },
          { id: 't-f-2', title: 'Build JWT signing, refresh token rotation, and auth middleware', description: 'Ensure secure cookie handling and CSRF protection', status: 'done', estimatedHours: 10, tags: ['Security'] },
          { id: 't-f-3', title: 'Implement structured JSON error response handler', description: 'Standardize error codes, validation error arrays, and request IDs', status: 'in_progress', estimatedHours: 6, tags: ['API'] },
        ],
      },
      {
        id: 'phase-f-2',
        phaseNumber: 2,
        title: 'Core Business Logic & API Endpoints',
        duration: 'Weeks 4 - 6',
        goal: 'Implement resource CRUD operations, validation schemas, and real-time event broadcasting.',
        milestones: [
          { id: 'm-f-4', title: 'All primary CRUD endpoints documented and tested with Vitest', completed: false, targetWeek: 'Week 5' },
          { id: 'm-f-5', title: 'Redis pub/sub event publisher operational', completed: false, targetWeek: 'Week 6' },
        ],
        tasks: [
          { id: 't-f-4', title: 'Implement resource creation with Zod payload validation', description: 'Prevent SQL injection and sanitize incoming fields', status: 'todo', estimatedHours: 8, tags: ['Backend'] },
          { id: 't-f-5', title: 'Build WebSocket gateway for streaming updates to clients', description: 'Emit instant socket events when resources change', status: 'todo', estimatedHours: 12, tags: ['Realtime'] },
        ],
      },
      {
        id: 'phase-f-3',
        phaseNumber: 3,
        title: 'User Interface & Production Hardening',
        duration: 'Weeks 7 - 9',
        goal: 'Ship responsive React client, configure CI/CD pipeline, and benchmark latency.',
        milestones: [
          { id: 'm-f-6', title: 'End-to-end integration tests passing in GitHub Actions', completed: false, targetWeek: 'Week 8' },
          { id: 'm-f-7', title: 'Production release deployment on Kubernetes / Cloud Run', completed: false, targetWeek: 'Week 9' },
        ],
        tasks: [
          { id: 't-f-6', title: 'Build modern responsive dashboard with Tailwind CSS', description: 'Implement dark/light themes, loading skeletons, and toast alerts', status: 'todo', estimatedHours: 16, tags: ['Frontend'] },
          { id: 't-f-7', title: 'Configure Docker multi-stage build and rate limiting', description: 'Minimize container size and add Redis sliding window rate limiter', status: 'todo', estimatedHours: 8, tags: ['DevOps'] },
        ],
      },
    ],
    starterCode: {
      folderStructure: `${projectName.toLowerCase()}/
├── src/
│   ├── server/
│   │   ├── controllers/
│   │   │   └── resourceController.ts
│   │   ├── routes/
│   │   │   └── api.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── server.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── client.ts
│   └── client/
│       ├── components/
│       │   └── ResourceDashboard.tsx
│       ├── App.tsx
│       └── main.tsx
├── docker-compose.yml
├── .env.example
├── README.md
└── package.json`,
      frontendSnippet: {
        filename: 'src/client/components/ResourceDashboard.tsx',
        language: 'typescript',
        code: `import React, { useState, useEffect } from 'react';
import { Layers, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResourceDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">${projectName} Workspace</h2>
          <p className="text-sm text-slate-400">Real-time status and operational metrics.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg transition-all">
          Create New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-violet-400">
            <Layers className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold">Active Workflows</span>
          </div>
          <div className="text-3xl font-bold text-white mt-2">24</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold">Pipeline Health</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">99.98%</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs uppercase font-semibold">Processed Events</span>
          </div>
          <div className="text-3xl font-bold text-white mt-2">1.4M</div>
        </div>
      </div>
    </div>
  );
};`,
        explanation: 'Responsive React TypeScript dashboard with real-time status metrics and action controls.',
      },
      backendSnippet: {
        filename: 'src/server/controllers/resourceController.ts',
        language: 'typescript',
        code: `import { Request, Response } from 'express';

export async function createResource(req: Request, res: Response) {
  try {
    const { title, metadata } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const newResource = {
      id: 'res_' + Math.random().toString(36).substring(2, 9),
      title,
      metadata: metadata || {},
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json(newResource);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function listResources(req: Request, res: Response) {
  return res.json({
    data: [
      { id: 'res_1', title: 'Default Service Queue', status: 'healthy' }
    ],
    timestamp: Date.now()
  });
}`,
        explanation: 'Typed Express controller handling validation, creation, and listing.',
      },
      dbSchemaSnippet: {
        filename: 'src/db/schema.ts',
        language: 'typescript',
        code: `import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  status: varchar('status', { length: 32 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});`,
        explanation: 'Drizzle ORM table definition for PostgreSQL with timezone-aware timestamps and JSONB fields.',
      },
      envSnippet: {
        filename: '.env.example',
        language: 'bash',
        code: `PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/${projectName.toLowerCase()}
REDIS_URL=redis://localhost:6379
JWT_SECRET=super_secret_jwt_key_change_in_production
NODE_ENV=development`,
        explanation: 'Sample environment variables configuration file.',
      },
    },
    readmeMarkdown: `# ${projectName}

> Intelligent ${category.replace('-', ' ').toUpperCase()} Architecture Built for Scale

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

## Overview
A production-grade platform designed for ${audience}, solving core workflow friction through automated orchestration, robust ${lang} services, and low-latency APIs.

## Problem Statement
${audience} currently struggle with fragmented tooling, high maintenance overhead, and lack of cohesive automation when attempting to execute: "${idea}".

## Proposed Solution
A purpose-built, high-performance architecture utilizing ${lang}, reactive frontends, resilient persistence, and event-driven pipelines.

## Tech Stack
* **Frontend**: React 19, Vite, Tailwind CSS
* **Backend**: ${lang}, Express / Fastify
* **Database**: PostgreSQL with Relational Indexing
* **Cache**: Redis 7
* **CI/CD**: Docker & GitHub Actions

## Quick Start
\`\`\`bash
# Install dependencies
npm install

# Setup env
cp .env.example .env

# Run development server
npm run dev
\`\`\`

## License
MIT © NEXORA AI Software Builder.`,
    userNotes: 'Generated via NEXORA AI Software Builder.',
  };
}

// 1. AI PROJECT GENERATOR ENDPOINT
app.post('/api/generate-project', async (req: Request, res: Response) => {
  try {
    if (!isPlainObject(req.body)) return res.status(400).json({ error: 'A valid JSON object is required.' });
    const { idea, category, targetAudience, primaryLanguage, complexity, additionalRequirements } = req.body;
    if (typeof idea !== 'string' || !idea.trim() || idea.length > 2000) {
      return res.status(400).json({ error: 'Project idea must be between 1 and 2000 characters.' });
    }
    if (!isOptionalString(category, 100) || !isOptionalString(targetAudience, 300) || !isOptionalString(primaryLanguage, 80) || !isOptionalString(complexity, 100) || !isOptionalString(additionalRequirements, 2000)) {
      return res.status(400).json({ error: 'One or more project fields are invalid or too long.' });
    }

    // Check if GEMINI_API_KEY is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY found, using intelligent fallback synthesizer');
      const fallback = buildFallbackProject(req.body);
      return res.json(fallback);
    }

    const systemPrompt = `You are NEXORA AI, a world-class Principal Software Architect and Systems Designer.
Your task is to take a software concept and transform it into an elite, production-grade architectural specification.
Respond with pure JSON conforming exactly to this structure:
{
  "name": "Catchy, professional, developer-friendly brand name (e.g. HyperSync, PulseGrid, OmniVault)",
  "tagline": "A punchy 6-10 word technical tagline",
  "description": "Comprehensive 2-3 sentence overview of what the software does, who it serves, and its primary capability.",
  "problemStatement": "Deep, realistic explanation of the engineering or industry friction this solves.",
  "proposedSolution": "Exact technical methodology, architectural paradigm, and approach used to eliminate this problem.",
  "category": "${category || 'fullstack-saas'}",
  "targetAudience": "${targetAudience || 'Software Developers'}",
  "primaryLanguage": "${primaryLanguage || 'TypeScript'}",
  "complexity": "${complexity || 'production-saas'}",
  "coreFeatures": [
    {
      "id": "f-1",
      "title": "Feature Name",
      "description": "Detailed technical description of feature capability",
      "priority": "high",
      "complexity": "moderate",
      "status": "planned"
    }
  ],
  "advancedFeatures": [
    {
      "id": "af-1",
      "title": "Advanced Feature Name",
      "description": "Deep capability description (e.g. AI-driven, distributed, caching)",
      "priority": "medium",
      "complexity": "complex",
      "status": "planned"
    }
  ],
  "techStack": [
    {
      "category": "Frontend",
      "name": "Technology name",
      "reason": "Clear architectural rationale for choosing it",
      "popularity": 95
    }
  ],
  "databaseDesign": [
    {
      "name": "EntityName",
      "description": "What this entity represents",
      "fields": [
        {
          "name": "id",
          "type": "UUID",
          "isPrimary": true,
          "isForeign": false,
          "isNullable": false,
          "description": "Unique record identifier"
        }
      ],
      "relationships": ["Belongs to User"]
    }
  ],
  "apiEndpoints": [
    {
      "id": "ep-1",
      "method": "POST",
      "path": "/api/v1/resource",
      "summary": "Short summary",
      "description": "What this endpoint does",
      "requestBody": "JSON example string",
      "responseBody": "JSON example string",
      "authRequired": true
    }
  ],
  "roadmap": [
    {
      "id": "phase-1",
      "phaseNumber": 1,
      "title": "Phase title",
      "duration": "Weeks 1-3",
      "goal": "Core objective of this phase",
      "milestones": [
        { "id": "m-1", "title": "Milestone title", "completed": false, "targetWeek": "Week 1" }
      ],
      "tasks": [
        { "id": "t-1", "title": "Task title", "description": "Specific implementation step", "status": "todo", "estimatedHours": 8, "tags": ["Backend"] }
      ]
    }
  ],
  "starterCode": {
    "folderStructure": "Project folder ASCII tree representation",
    "frontendSnippet": {
      "filename": "src/components/MainView.tsx",
      "language": "typescript",
      "code": "Complete, production-ready React component code",
      "explanation": "Why this component is structured this way"
    },
    "backendSnippet": {
      "filename": "src/api/handler.ts",
      "language": "typescript",
      "code": "Complete, production-ready backend route handler code",
      "explanation": "Why this endpoint handler is structured this way"
    },
    "dbSchemaSnippet": {
      "filename": "src/db/schema.ts",
      "language": "typescript",
      "code": "Complete database schema definition code",
      "explanation": "Why this schema design is optimal"
    },
    "envSnippet": {
      "filename": ".env.example",
      "language": "bash",
      "code": "Environment configuration file contents"
    }
  },
  "readmeMarkdown": "Full GitHub README.md markdown with badges, architecture, install, and usage"
}`;

    const userPrompt = `Project Concept: ${idea}
Category: ${category || 'Full-Stack SaaS'}
Target Audience: ${targetAudience || 'Developers & Engineering Teams'}
Preferred Programming Language: ${primaryLanguage || 'TypeScript'}
Complexity Level: ${complexity || 'Production-Ready SaaS'}
Additional Requirements: ${additionalRequirements || 'Modern cloud-native architecture, secure authentication, high performance'}`;

    try {
      const generationConfig = {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json' as const,
        // Keep the architecture response comprehensive but bounded for serverless execution.
        maxOutputTokens: 8192,
        temperature: 0.2,
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: generationConfig,
        });
      } catch (primaryError: any) {
        const status = primaryError?.status ?? primaryError?.error?.code;
        const message = String(primaryError?.message ?? primaryError?.error?.message ?? '');
        const isTemporaryCapacityError =
          status === 503 ||
          status === 504 ||
          status === 429 ||
          /UNAVAILABLE|DEADLINE_EXCEEDED|high demand|RESOURCE_EXHAUSTED|deadline expired/i.test(message);

        if (!isTemporaryCapacityError) throw primaryError;

        console.warn('Primary Gemini model is temporarily unavailable; retrying with Gemini 3.7 Flash.');
        response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: userPrompt,
          config: generationConfig,
        });
      }

      const text = response.text || '';
      let parsed = JSON.parse(text);

      // Ensure mandatory fields exist
      if (!parsed.id) parsed.id = 'proj_' + Math.random().toString(36).substring(2, 9);
      if (!parsed.createdAt) parsed.createdAt = Date.now();
      if (!parsed.updatedAt) parsed.updatedAt = Date.now();
      if (!parsed.status) parsed.status = 'architecture_ready';

      return res.json(parsed);
    } catch (genError: any) {
      console.error('Gemini generation error, falling back to intelligent blueprint:', genError.message);
      const fallback = buildFallbackProject(req.body);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Server error in /api/generate-project:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

// 2. TECH STACK RECOMMENDER ENDPOINT
app.post('/api/recommend-stack', async (req: Request, res: Response) => {
  try {
    if (!isPlainObject(req.body)) return res.status(400).json({ error: 'A valid JSON object is required.' });
    const { category = '', scale = '', language = '', requirements = '' } = req.body;
    if (!isOptionalString(category, 100) || !isOptionalString(scale, 100) || !isOptionalString(language, 80) || !isOptionalString(requirements, 2000)) {
      return res.status(400).json({ error: 'Tech stack inputs are invalid or too long.' });
    }

    const fallbackRecommendations = [
      {
        category: 'Frontend Framework & Styling',
        primary: {
          name: 'React 19 + Vite + Tailwind CSS',
          description: 'Industry-leading component model with instant HMR and utility-first styling.',
          whyChoose: 'Provides lowest time-to-market, extensive third-party library support, and superior type safety.',
          pros: ['Huge ecosystem', 'Ultra-fast Vite bundler', 'Seamless server-side and client-side integration'],
          cons: ['Requires deliberate state management architecture at enterprise scale'],
        },
        alternatives: [
          { name: 'Next.js 15 (App Router)', tradeoff: 'Better built-in SSR/SEO, but slightly higher runtime complexity' },
          { name: 'Vue 3 + Nuxt', tradeoff: 'More gentle learning curve, smaller ecosystem for niche enterprise integrations' },
        ],
      },
      {
        category: 'Backend & API Runtime',
        primary: {
          name: language === 'Python' ? 'FastAPI + Pydantic' : language === 'Go' ? 'Go + Fiber' : 'Node.js + Express / Fastify + TypeScript',
          description: 'High-performance asynchronous server runtime with schema validation.',
          whyChoose: 'Optimal balance of raw throughput, developer velocity, and robust ecosystem libraries.',
          pros: ['Asynchronous non-blocking I/O', 'End-to-end TypeScript sharing', 'Rich middleware ecosystem'],
          cons: ['Requires strict typing hygiene to avoid runtime object discrepancies'],
        },
        alternatives: [
          { name: 'Go (Golang) Microservices', tradeoff: 'Superior raw CPU concurrency, but slower feature iteration velocity' },
          { name: 'Rust (Axum)', tradeoff: 'Maximum memory safety and zero-cost abstractions, steep learning curve' },
        ],
      },
      {
        category: 'Persistence & Database',
        primary: {
          name: 'PostgreSQL 16 + Drizzle / Prisma ORM',
          description: 'The world’s most advanced open-source relational database with native JSONB.',
          whyChoose: 'Guarantees ACID transactions for billing/auth while enabling flexible document querying.',
          pros: ['Rock-solid reliability', 'JSONB semi-structured storage', 'Extensive extensions (pgvector, TimescaleDB)'],
          cons: ['Requires horizontal sharding or read-replicas for extreme distributed scale'],
        },
        alternatives: [
          { name: 'MongoDB / DocumentDB', tradeoff: 'Flexible schema, but lacks complex multi-table relational integrity' },
          { name: 'ClickHouse / Timescale', tradeoff: 'Unbeatable for massive time-series event telemetry, poor for OLTP' },
        ],
      },
      {
        category: 'State & Cache Layer',
        primary: {
          name: 'Redis 7 / Dragonfly',
          description: 'Ultra-low-latency in-memory data store for caching and pub/sub messaging.',
          whyChoose: 'Essential for sub-millisecond session validation, rate limiting, and temporary queues.',
          pros: ['Sub-millisecond read/writes', 'Rich native data structures (Hashes, Sorted Sets)', 'Pub/Sub built-in'],
          cons: ['Data is volatile unless configured with disk persistence snapshots'],
        },
        alternatives: [
          { name: 'Memcached', tradeoff: 'Simple key-value, lacks advanced data structures and pub/sub' },
        ],
      },
      {
        category: 'Auth & Security',
        primary: {
          name: 'OAuth 2.0 + JWT + Argon2 ID',
          description: 'Standardized token-based authentication with cryptographically modern key derivation.',
          whyChoose: 'Ensures zero-trust authorization, organization multi-tenancy, and seamless SSO integration.',
          pros: ['Stateless JWT verification', 'Resistant to GPU brute-force attacks', 'Compatible with Google/GitHub SSO'],
          cons: ['Token revocation requires token blocklist in Redis'],
        },
        alternatives: [
          { name: 'Session Cookies + Redis', tradeoff: 'Instant revocation, but requires database check on every request' },
        ],
      },
    ];

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ recommendations: fallbackRecommendations });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Evaluate the following software context and recommend an optimal tech stack matrix.
Category: ${category}
Scale: ${scale}
Language: ${language}
Requirements: ${requirements}
Return a JSON array with groups for: Frontend, Backend, Database, State & Cache, Auth & Security, and DevOps.
Conform to this JSON format:
[
  {
    "category": "Frontend Framework",
    "primary": {
      "name": "Technology Name",
      "description": "Short overview",
      "whyChoose": "Detailed rationale",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1"]
    },
    "alternatives": [
      { "name": "Alternative Tech", "tradeoff": "Why choose or not choose" }
    ]
  }
]`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ recommendations: parsed.length ? parsed : fallbackRecommendations });
    } catch {
      return res.json({ recommendations: fallbackRecommendations });
    }
  } catch (error: any) {
    console.error('Server error in /api/recommend-stack:', error);
    return res.status(500).json({ error: 'Unable to generate recommendations right now.' });
  }
});

// 3. CODE STUDIO GENERATOR ENDPOINT
app.post('/api/generate-code', async (req: Request, res: Response) => {
  try {
    if (!isPlainObject(req.body)) return res.status(400).json({ error: 'A valid JSON object is required.' });
    const { prompt, language = 'typescript', codeType = 'component', projectName = 'Project' } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 8000) {
      return res.status(400).json({ error: 'Prompt must be between 1 and 8000 characters.' });
    }
    if (!isOptionalString(language, 80) || !isOptionalString(codeType, 80) || !isOptionalString(projectName, 120)) {
      return res.status(400).json({ error: 'Code generation options are invalid or too long.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        code: `// Starter ${codeType} for ${projectName}\n// Language: ${language}\n\nexport interface ConfigProps {\n  id: string;\n  name: string;\n  enabled: boolean;\n}\n\nexport const execute = async (config: ConfigProps) => {\n  console.log("Executing", config.name);\n  return { success: true, timestamp: Date.now() };\n};`,
        explanation: 'Generated starter boilerplate for ' + codeType,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert ${language} engineer.
Generate clean, production-grade, fully-typed code for the following specification:
Project: ${projectName}
Type of code needed: ${codeType}
Prompt: ${prompt}

Return JSON:
{
  "code": "The raw code string with proper indentation and TypeScript types",
  "explanation": "Clear explanation of how the code works and key architectural decisions",
  "filename": "Suggested filename (e.g. src/controllers/userController.ts)"
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Server error in /api/generate-code:', error);
    return res.status(500).json({ error: 'Unable to generate code right now.' });
  }
});

// 4. README STUDIO GENERATOR ENDPOINT
app.post('/api/generate-readme', async (req: Request, res: Response) => {
  try {
    if (!isPlainObject(req.body) || !isPlainObject(req.body.project)) return res.status(400).json({ error: 'Valid project data is required.' });
    const { project } = req.body;
    if (JSON.stringify(project).length > 50000) return res.status(400).json({ error: 'Project data is too large.' });

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        markdown: `# ${project.name || 'Software Project'}\n\n> ${project.tagline || 'Intelligent Software Solution'}\n\n## Overview\n${project.description || ''}\n\n## Tech Stack\n${(project.techStack || []).map((t: any) => `- **${t.category}**: ${t.name}`).join('\n')}\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a world-class GitHub README.md markdown for this project:
${JSON.stringify({
  name: project.name,
  tagline: project.tagline,
  description: project.description,
  problemStatement: project.problemStatement,
  proposedSolution: project.proposedSolution,
  coreFeatures: project.coreFeatures,
  techStack: project.techStack,
  apiEndpoints: project.apiEndpoints,
})}
Include shields.io badges, ASCII architecture diagrams, clear installation steps, API documentation table, and contribution guidelines.
Return pure markdown.`,
    });

    return res.json({ markdown: response.text || '' });
  } catch (error: any) {
    console.error('Server error in /api/generate-readme:', error);
    return res.status(500).json({ error: 'Unable to generate the README right now.' });
  }
});

// Handle malformed and oversized JSON requests without exposing internals.
app.use((error: any, _req: Request, res: Response, next: (err?: any) => void) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Malformed JSON request.' });
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large.' });
  return next(error);
});

// MOUNT VITE IN DEV OR STATIC IN PROD
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`NEXORA AI Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
