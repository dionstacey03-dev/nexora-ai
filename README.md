# NEXORA AI

> **Ideas Into Intelligence. Intelligence Into Reality.**

NEXORA AI is an AI-powered software project planning workspace that helps turn an initial idea into a structured engineering blueprint. Powered by **Google Gemini**, it brings project generation, architecture planning, technology recommendations, development roadmaps, code generation, and README creation into one workspace.

<p align="center">
  <a href="https://nexora-ai-topaz-eight.vercel.app/"><strong>Live Application</strong></a>
  ·
  <a href="https://github.com/dionstacey03-dev/nexora-ai"><strong>Source Code</strong></a>
</p>

---

## Overview

Starting a software project often means moving between notes, architecture documents, technology comparisons, task boards, and code examples. NEXORA AI brings these early planning activities together.

Describe what you want to build, provide a few project preferences, and use the generated blueprint as a starting point for implementation. You remain in control of the project decisions and can refine the generated material as your idea develops.

## Features

| Workspace | What it helps you do |
| --- | --- |
| **AI Project Generator** | Turn a project idea and its requirements into a structured project blueprint. |
| **My Projects** | Review and manage saved project blueprints. |
| **Roadmap Builder** | Organise development into phases, milestones, and tasks. |
| **Tech Stack Recommender** | Explore technology recommendations based on project context and requirements. |
| **Code Studio** | Generate starter code snippets from a development prompt. |
| **README Studio** | Create professional Markdown documentation from project information. |
| **Export & Backup** | Export project plans and download a JSON backup of projects and settings. |
| **Personalisation** | Configure profile details, generator defaults, and light, dark, or system theme. |

Additional interface features include responsive navigation, keyboard shortcuts, toast notifications, and sample project blueprints.

## How It Works

1. **Describe your idea** — provide the project concept, category, target audience, preferred language, complexity, and any additional requirements.
2. **Generate a blueprint** — use the AI-generated project outline as a first draft for planning.
3. **Refine the architecture** — review features, database design, API concepts, and technology choices.
4. **Plan the work** — organise implementation with the roadmap builder.
5. **Start building** — use Code Studio for starter snippets and README Studio for project documentation.
6. **Keep your work** — manage projects locally and export plans or a JSON backup.

AI-generated output is a starting point. Review architectural decisions, generated code, dependencies, and security-sensitive details before using them in a production system.

## Technology Stack

### Frontend
- **React 19** — component-based user interface
- **TypeScript** — typed application code
- **Vite 8** — development server and production build tooling
- **Tailwind CSS 4** — utility-first styling
- **Lucide React** — interface icons
- **Motion** — interface animation
- **Recharts** — chart visualisation

### Backend & AI
- **Node.js** — JavaScript runtime
- **Express 4** — API server
- **TypeScript / tsx** — server implementation and execution
- **Google GenAI SDK** (`@google/genai`) — Gemini integration
- **dotenv** — environment variable loading

### Supporting Libraries
- **jsPDF** — PDF generation
- **JSZip** — ZIP archive utilities
- **qrcode** — QR code generation
- **jsqr** — QR code decoding
- **canvas-confetti** — celebratory UI effects

## Architecture

NEXORA AI uses a React single-page application served by an Express server. The browser communicates with server-side API routes for AI-assisted generation. The Gemini API key is read by the server from an environment variable; it should not be placed in frontend source code.

```text
nexora-ai/
├── server.ts                 # Express server and AI API routes
├── index.html                # Application HTML entry point
├── vite.config.ts            # Vite and React configuration
├── package.json              # Scripts and dependencies
├── .env.example              # Environment variable template
└── src/
    ├── App.tsx               # Application shell and view routing
    ├── main.tsx              # React entry point
    ├── components/
    │   ├── codestudio/       # Code generation workspace
    │   ├── common/           # Shared UI, modals, and utilities
    │   ├── dashboard/        # Dashboard
    │   ├── generator/        # AI project generator
    │   ├── layout/           # Navigation and layout
    │   ├── projects/         # Saved projects
    │   ├── readmestudio/     # README generation workspace
    │   ├── roadmap/          # Roadmap builder
    │   ├── settings/         # User preferences
    │   └── techstack/        # Technology recommendations
    ├── context/              # Project and theme state
    ├── data/                 # Sample project data
    ├── hooks/                # Application hooks
    ├── types/                # Shared TypeScript types
    └── utils/                # Export and helper utilities
```

## Getting Started

### Prerequisites

- Node.js (a current LTS release is recommended)
- npm
- A Google Gemini API key for AI-powered generation

### 1. Clone the repository

```bash
git clone https://github.com/dionstacey03-dev/nexora-ai.git
cd nexora-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

The application uses `GEMINI_API_KEY` on the server. Keep your real key private and never commit your `.env` file. The repository includes an `.env.example` template.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal (the Express server defaults to port `3000`).

### 5. Create a production build

```bash
npm run build
npm start
```

The build command creates the frontend production assets in `dist/`. The Express server serves those assets when running in production.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the TypeScript Express server for local development. |
| `npm run build` | Build the frontend with Vite. |
| `npm start` | Start the Express server. |
| `npm run preview` | Preview the Vite production build. |
| `npm run lint` | Run the TypeScript compiler in no-emit mode. |
| `npm run clean` | Remove generated build and server output directories (Unix-style command). |

## API Routes

The Express server currently exposes the following AI-related POST endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/generate-project` | Generate a structured software project blueprint. |
| `POST` | `/api/recommend-stack` | Recommend technologies based on project requirements. |
| `POST` | `/api/generate-code` | Generate starter code from a prompt. |
| `POST` | `/api/generate-readme` | Generate README Markdown from project data. |

The API includes request validation, a JSON payload size limit, and a lightweight in-memory per-IP rate limiter. AI generation has fallback responses for selected cases where a Gemini response is unavailable. The limiter is process-local; a multi-instance deployment should use a shared rate-limiting solution.

## Data & Privacy Notes

- Project blueprints and application preferences are stored in the browser's `localStorage` in the current implementation.
- The application does not currently provide a server-backed project database or account synchronisation.
- Gemini requests are made through the Express backend.
- Configure secrets in the deployment provider's environment settings. Do not expose API keys in client-side variables or commit them to Git.
- Avoid submitting confidential, personal, or otherwise sensitive information to an AI service unless you are authorised to do so.

Clearing browser storage can remove locally saved projects and preferences. Export a backup periodically if you need to preserve your work.

## Deployment

The live application is available at:

**[https://nexora-ai-topaz-eight.vercel.app](https://nexora-ai-topaz-eight.vercel.app)**

For a deployment that uses the Express API, configure the hosting environment to run the Node.js server and provide `GEMINI_API_KEY` as a server-side environment variable. The project currently has a combined Express/Vite setup; verify the deployment platform's Node server and routing configuration before deploying changes. A static-only frontend deployment will not provide the Express API endpoints.

## Roadmap

Potential areas for future development include:

- Add automated tests for API routes and core user workflows.
- Add optional server-side persistence and authenticated project synchronisation.
- Introduce shared rate limiting for multi-instance deployments.
- Add import and restore workflows for exported backups.
- Improve deployment documentation for supported hosting configurations.

These are future improvement areas, not claims that the features are already implemented.

## Contributing

Contributions, bug reports, and improvement suggestions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "feat: describe your change"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request with a clear description and relevant screenshots or test notes.

## License

No license file is currently included in this repository. Unless a license is added, the project should be treated as having no explicit open-source reuse permissions.

## Author

**Dion Stacey Sellar**

- GitHub: [@dionstacey03-dev](https://github.com/dionstacey03-dev)
- Project: [NEXORA AI](https://github.com/dionstacey03-dev/nexora-ai)

---

<p align="center">
  Built to help turn software ideas into actionable engineering plans.
</p>
