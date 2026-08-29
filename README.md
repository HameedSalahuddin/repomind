# RepoMind

> AI-powered contribution workspace for open-source contributors and beginners — "RepoMind helps developers understand open-source repositories, discover issues, investigate problems, and start contributing."

[![Hackathon Project](https://img.shields.io/badge/Hackathon-RepoMind%20MVP-indigo)](#) [![Next.js](https://img.shields.io/badge/Next.js-16-black)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](#)

---

## 📌 Project Status

**Current Phase**: Technical Foundation Completed & Prepared for Public Submission.
The repository is set up with Next.js App Router, clean modular interfaces, open issue ingestion, AI investigation, and contribution planning.

---

## 🚀 Key Features

- **Repository Overview**: Instant metadata summary, detected tech stack, entry points, and open contribution opportunities.
- **Architecture Extraction**: Interactive visual graph of internal components, API handlers, and external services linked to active issues.
- **Contribution Opportunities**: Open issue ingestion, PR filtering, difficulty classification, and contribution signals.
- **AI Investigation & Planning**: Context-grounded issue investigation, affected file identification, step-by-step contribution plans, and beginner explanations.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Component Libraries**: React 19, Lucide Icons
- **Graphing & Visualization**: `@xyflow/react`

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js 18.x or later
- npm / pnpm / yarn

### 2. Installation & Startup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Repomind.git
cd Repomind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view RepoMind.

---

## 🔑 Environment Variables Setup

Create a `.env.local` file in the root directory (copied from `.env.example`). No real secrets are required to run the initial foundation and mock mode.

```env
# Optional: GitHub API access token to avoid rate limits on public repositories
GITHUB_TOKEN=

# Required for live LLM reasoning
OPENAI_API_KEY=
GEMINI_API_KEY=
```

---

## 🏛️ Architecture Overview

RepoMind runs entirely inside a unified Next.js application without requiring an external database:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RepoMind Workspace                              │
│         [ Overview ]   [ Architecture ]   [ Ask AI ]                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                API Routes (/api/analyze, /api/investigate, /api/qna)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RepoMind Core Engine                            │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│  GitHub Ingestion │ Code Analysis     │ AI Investigation │ AI Reasoning     │
│  (Octokit / REST) │ (AST & Tree)      │ (Issue Mapping)  │ (Context + LLM)  │
└───────────────────┴───────────────────┴──────────────────┴──────────────────┘
```

---

## 🏆 Hackathon Attribution

Developed as a hackathon project for RepoMind.
Designed for high demo impact, zero-hallucination AI principles, and developer clarity.
