# RepoMind

> Guided AI workspace for understanding open-source repositories and preparing human developers to make confident contributions.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](#) [![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-violet)](#)

---

## 📌 Product Mission

RepoMind helps open-source contributors — especially beginners — go from **"I want to contribute"** to **"I understand this issue, I know where it lives in the codebase, and I have a clear plan to fix it."**

The human developer remains the contributor. RepoMind acts as the researcher, mentor, and navigator.

---

## 🚀 Core Features

- **Issue Discovery & Signals**: Ingests open GitHub issues with difficulty classification (`good-first-issue`, `intermediate`, `advanced`) and contribution indicators.
- **Issue-to-Code Mapping**: Multi-signal path matching linking GitHub issues to specific source code files and architectural modules.
- **Bounded AI Issue Investigation**: Uses Google Gemini to analyze issue context, affected source code, and existing module boundaries without hallucinated file paths.
- **Interactive Contribution Workspace**: Guided step-by-step contribution flow:
  1. **Understand**: Plain-English & technical issue explanations.
  2. **Explore**: Code file explorer & spatial architecture graph.
  3. **Reproduce**: Step-by-step issue reproduction guide.
  4. **Contribution Plan**: Interactive checklist with verified source citations, fix direction, and testing strategies.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **AI Provider**: Google Gemini API (`gemini-3.5-flash-lite` / `gemini-3.5-flash`)
- **API Ingestion**: GitHub REST API

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js 18.x or later
- npm / pnpm / yarn

### 2. Installation & Startup
```bash
# Clone the repository
git clone https://github.com/HameedSalahuddin/repomind.git
cd repomind

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

Create a `.env.local` file in the root directory (copied from `.env.example`).

```env
# Optional: GitHub access token to avoid unauthenticated API rate limits
GITHUB_TOKEN=

# Required for AI Issue Investigations
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
```

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RepoMind Contributor Workspace                        │
│     [ Start Contributing ]   [ Issues ]   [ Investigation ]   [ Plan ]      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    API Routes (/api/analyze, /api/investigate)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RepoMind Core Engine                            │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│  GitHub Ingestion │ Code Analysis     │ Issue Matcher    │ AI Investigation │
│  (Octokit / REST) │ (AST & Tree)      │ (Multi-Signal)   (Gemini + Context) │
└───────────────────┴───────────────────┴──────────────────┴──────────────────┘
```
