# RepoMind

> AI-powered developer tool that helps developers understand unfamiliar GitHub repositories instantly — "Understand what the code does, and understand how it got there."

[![Hackathon Project](https://img.shields.io/badge/Hackathon-RepoMind%20MVP-indigo)](#) [![Next.js](https://img.shields.io/badge/Next.js-16-black)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](#) [![SkillPatch](https://img.shields.io/badge/SkillPatch-wiki--architect-emerald)](#)

---

## 📌 Project Status

**Current Phase**: Technical Foundation Completed & Prepared for Public Submission.
The repository is set up with Next.js App Router, clean modular interfaces, API placeholders, mock datasets, and SkillPatch `wiki-architect` integration.

---

## 🚀 Planned MVP Features

- **Repository Overview**: Instant metadata summary, detected tech stack, and key entry point identification.
- **Architecture Visualization**: Interactive graph of internal components, API handlers, and external services using `@xyflow/react`.
- **Codebase Exploration**: Navigable directory tree and source file inspection with line-number references.
- **AI Repository Q&A**: Natural-language reasoning powered by LLMs with strict evidence-grounded citations to avoid hallucinations.
- **GitStory**: Visual history feature explaining how the project evolved across major architectural milestones.
- **SkillPatch Onboarding Wiki**: Automated generation of role-specific onboarding documentation using the SkillPatch `wiki-architect` skill.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Component Libraries**: React 19, Lucide Icons
- **Graphing & Visualization**: `@xyflow/react`
- **Agent Capabilities**: SkillPatch `wiki-architect` skill

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

# Required for live LLM reasoning in Phase 3
OPENAI_API_KEY=
GEMINI_API_KEY=

# Optional: SkillPatch API key for registry operations
SKILLPATCH_API_KEY=
SKILLPATCH_BASE=https://skillpatch.dev
```

---

## 🏛️ Architecture Overview

RepoMind runs entirely inside a unified Next.js application without requiring an external database:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RepoMind Dashboard                              │
│         [ Overview ]   [ Architecture ]   [ GitStory ]   [ SkillPatch ]     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    API Routes (/api/analyze, /api/qna, /api/gitstory)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RepoMind Core Engine                            │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│  GitHub Ingestion │ Code Analysis     │ GitStory Engine  │ AI Reasoning     │
│  (Octokit / REST) │ (AST & Tree)      │ (Commit Parsing) │ (Context + LLM)  │
└───────────────────┴───────────────────┴──────────────────┴──────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SkillPatch Capability Bridge                        │
│                   (.latentcode/skills/wiki-architect)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 SkillPatch & `wiki-architect` Integration

RepoMind natively integrates the **`wiki-architect`** SkillPatch skill installed at `.latentcode/skills/wiki-architect/SKILL.md`.

`wiki-architect` analyzes repository structures to produce:
1. **Hierarchical Documentation Catalogues** (`items[].children[]` schema).
2. **Four Role-Tailored Onboarding Guides**:
   - **Contributor Guide**: Setup, request lifecycle, dark-mode Mermaid sequence diagrams.
   - **Staff Engineer Guide**: Tradeoff logs, core architectural insights, class/ER diagrams.
   - **Executive Guide**: Zero-code capability map and risk assessment.
   - **Product Manager Guide**: User journey maps, feature flag tables, and product FAQ.

---

## 🏆 Hackathon Attribution

Developed as a 2-person hackathon project for RepoMind & SkillPatch challenge track.
Designed for high demo impact, zero-hallucination AI principles, and developer clarity.
