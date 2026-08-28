import { 
  RepositoryAnalysis, 
  GitStoryResponse, 
  QnaResponse, 
  SkillPatchResponse 
} from '@/types';

export const MOCK_REPO_ANALYSIS: RepositoryAnalysis = {
  metadata: {
    owner: 'repomind-demo',
    name: 'task-craft-api',
    fullName: 'repomind-demo/task-craft-api',
    description: 'High-performance collaborative task management service with real-time updates and role-based authorization.',
    url: 'https://github.com/repomind-demo/task-craft-api',
    defaultBranch: 'main',
    stars: 1240,
    forks: 185,
    openIssues: 12,
    license: 'MIT',
    updatedAt: '2026-08-25T14:20:00Z',
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'Redis'],
    primaryLanguage: 'TypeScript'
  },
  summary: 'TaskCraft API is a full-stack Next.js project providing task workflows, real-time WebSocket syncing, and user team management.',
  entryPoints: [
    'src/app/page.tsx',
    'src/app/api/tasks/route.ts',
    'src/lib/auth/jwt.ts',
    'src/lib/db/prisma.ts'
  ],
  fileTree: [
    {
      name: 'src',
      path: 'src',
      type: 'directory',
      children: [
        {
          name: 'app',
          path: 'src/app',
          type: 'directory',
          children: [
            {
              name: 'api',
              path: 'src/app/api',
              type: 'directory',
              children: [
                {
                  name: 'auth',
                  path: 'src/app/api/auth',
                  type: 'directory',
                  children: [
                    { name: 'route.ts', path: 'src/app/api/auth/route.ts', type: 'file', size: 1420 }
                  ]
                },
                {
                  name: 'tasks',
                  path: 'src/app/api/tasks',
                  type: 'directory',
                  children: [
                    { name: 'route.ts', path: 'src/app/api/tasks/route.ts', type: 'file', size: 2100 }
                  ]
                }
              ]
            },
            { name: 'layout.tsx', path: 'src/app/layout.tsx', type: 'file', size: 850 },
            { name: 'page.tsx', path: 'src/app/page.tsx', type: 'file', size: 1200 }
          ]
        },
        {
          name: 'components',
          path: 'src/components',
          type: 'directory',
          children: [
            { name: 'TaskBoard.tsx', path: 'src/components/TaskBoard.tsx', type: 'file', size: 3400 },
            { name: 'UserNav.tsx', path: 'src/components/UserNav.tsx', type: 'file', size: 1100 }
          ]
        },
        {
          name: 'lib',
          path: 'src/lib',
          type: 'directory',
          children: [
            { name: 'auth.ts', path: 'src/lib/auth.ts', type: 'file', size: 2800 },
            { name: 'db.ts', path: 'src/lib/db.ts', type: 'file', size: 650 },
            { name: 'websocket.ts', path: 'src/lib/websocket.ts', type: 'file', size: 1950 }
          ]
        }
      ]
    },
    { name: 'package.json', path: 'package.json', type: 'file', size: 1120 },
    { name: 'README.md', path: 'README.md', type: 'file', size: 2400 },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file', size: 540 }
  ],
  architecture: {
    nodes: [
      { id: 'client', label: 'React Frontend', type: 'package', description: 'Next.js App Router UI & Board Components' },
      { id: 'api-routes', label: 'Next.js API Layer', type: 'module', description: 'REST routes for tasks, users, and auth' },
      { id: 'auth-service', label: 'Auth Engine', type: 'module', description: 'JWT verification and session handling' },
      { id: 'db-layer', label: 'Prisma ORM & PostgreSQL', type: 'database', description: 'Task state, user profiles, audit logs' },
      { id: 'redis', label: 'Redis Pub/Sub', type: 'service', description: 'Real-time sync for collaborative task boards' }
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'api-routes', label: 'HTTP / REST', relationType: 'calls' },
      { id: 'e2', source: 'api-routes', target: 'auth-service', label: 'validates token', relationType: 'imports' },
      { id: 'e3', source: 'api-routes', target: 'db-layer', label: 'queries/updates', relationType: 'depends_on' },
      { id: 'e4', source: 'api-routes', target: 'redis', label: 'publishes updates', relationType: 'data_flow' }
    ]
  }
};

export const MOCK_GITSTORY: GitStoryResponse = {
  repository: 'repomind-demo/task-craft-api',
  totalCommitsAnalyzed: 84,
  milestones: [
    {
      id: 'm1',
      title: 'Initial Monolith Architecture Initialized',
      category: 'initial_architecture',
      date: '2026-01-10',
      summary: 'Bootstrapped Next.js App Router, configured Prisma ORM, and defined initial database schemas.',
      explanation: 'The team selected Next.js App Router to unify API endpoints and SSR components into a single workspace.',
      affectedFiles: ['package.json', 'src/lib/db.ts', 'src/app/layout.tsx'],
      relatedCommits: [
        {
          sha: '7f2a10b',
          message: 'feat: bootstrap project with Next.js and Prisma ORM',
          author: { name: 'Alex Rivera', email: 'alex@dev.co', date: '2026-01-10' },
          htmlUrl: 'https://github.com/repomind-demo/task-craft-api/commit/7f2a10b'
        }
      ]
    },
    {
      id: 'm2',
      title: 'Authentication Migration to JWT Tokens',
      category: 'auth',
      date: '2026-02-14',
      summary: 'Replaced express-session cookie handling with stateless JWT authorization headers.',
      explanation: 'To prepare for multi-region micro-deployments, authentication was converted to signed JWTs.',
      affectedFiles: ['src/lib/auth.ts', 'src/app/api/auth/route.ts'],
      relatedCommits: [
        {
          sha: '3c8e91d',
          message: 'refactor(auth): replace session cookies with bearer JWT tokens',
          author: { name: 'Sam Chen', email: 'sam@dev.co', date: '2026-02-14' },
          htmlUrl: 'https://github.com/repomind-demo/task-craft-api/commit/3c8e91d'
        }
      ]
    },
    {
      id: 'm3',
      title: 'Real-time Multi-User Board Sync via Redis',
      category: 'major_feature',
      date: '2026-03-02',
      summary: 'Integrated Redis Pub/Sub and WebSocket handlers to allow instant board updates across active clients.',
      explanation: 'When multiple users edit a task board concurrently, WebSocket events push immediate updates without polling.',
      affectedFiles: ['src/lib/websocket.ts', 'src/components/TaskBoard.tsx'],
      relatedCommits: [
        {
          sha: '9b4f2a7',
          message: 'feat(ws): add redis pubsub event listener for task events',
          author: { name: 'Alex Rivera', email: 'alex@dev.co', date: '2026-03-02' },
          htmlUrl: 'https://github.com/repomind-demo/task-craft-api/commit/9b4f2a7'
        }
      ]
    }
  ]
};

export const MOCK_QNA_RESPONSE: QnaResponse = {
  question: 'How does authentication work in this codebase?',
  answer: 'Authentication is implemented statelessly using JSON Web Tokens (JWT) inside `src/lib/auth.ts`. Incoming API calls pass a Bearer token in the Authorization header, which is verified against secret signing keys before granting access to route handlers.',
  citations: [
    {
      type: 'file',
      path: 'src/lib/auth.ts',
      lines: [12, 45],
      description: 'JWT validation and token payload extraction logic'
    },
    {
      type: 'commit',
      sha: '3c8e91d',
      description: 'Milestone commit migrating from cookies to bearer JWTs'
    }
  ],
  suggestedFollowUps: [
    'Where are task permission scopes defined?',
    'What happens when a user token expires?',
    'Show me the user signup endpoint flow.'
  ]
};

export const MOCK_SKILLPATCH_RESPONSE: SkillPatchResponse = {
  skillId: 'wiki-architect',
  status: 'success',
  generatedAt: new Date().toISOString(),
  catalogue: {
    title: 'TaskCraft API Documentation Catalogue',
    name: 'task-craft-api',
    prompt: 'Root catalogue for TaskCraft API repository',
    children: [
      {
        title: 'Onboarding Guides',
        name: 'onboarding',
        prompt: 'Audience-tailored onboarding documentation',
        children: [
          { title: 'Contributor Guide', name: 'contributor-guide', prompt: 'Setup and first PR' },
          { title: 'Staff Engineer Guide', name: 'staff-engineer-guide', prompt: 'Architectural trade-offs' },
          { title: 'Executive Guide', name: 'executive-guide', prompt: 'Capability map & risk assessment' },
          { title: 'Product Manager Guide', name: 'product-manager-guide', prompt: 'User journey maps & feature flags' }
        ]
      },
      {
        title: 'Architecture Overview',
        name: 'architecture',
        prompt: 'Deep dive into modules and databases',
        children: [
          { title: 'API Layer & Routes', name: 'api-layer', prompt: 'Next.js App Router API design' },
          { title: 'Real-time Messaging', name: 'realtime', prompt: 'Redis PubSub & WebSockets' }
        ]
      }
    ]
  },
  artifacts: {
    contributorGuide: `# TaskCraft API Contributor Guide

Welcome to TaskCraft API! This guide will help you set up your development environment and make your first contribution.

## Architecture at a Glance
\`\`\`mermaid
graph TB
  Client[React TaskBoard] --> API[Next.js App Router]
  API --> Auth[src/lib/auth.ts]
  API --> DB[(Prisma / PostgreSQL)]
  API --> Redis[(Redis PubSub)]
\`\`\`

Cited from \`src/app/api/tasks/route.ts:15\`.`,
    staffEngineerGuide: `# Staff Engineer Architectural Overview

## Key System Tradeoffs
1. **Stateless JWTs vs Session Database**: Chosen to allow zero-downtime deployment without session storage overhead.
2. **Next.js API Routes**: Replaced dedicated Express instance to co-locate UI and API definitions.`,
    executiveGuide: `# Executive Summary & Risk Assessment

## Business Capabilities
- Real-time collaborative task tracking
- Role-based team authorization
- Low-latency status synchronization`,
    productManagerGuide: `# Product Manager Guide

## Core User Journeys
1. User logs in -> views dashboard -> creates board -> invites team member.`
  }
};
