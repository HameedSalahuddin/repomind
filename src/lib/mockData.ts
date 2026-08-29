import { RepositoryAnalysis } from '@/types';

export const MOCK_REPO_ANALYSIS: RepositoryAnalysis = {
  owner: 'repomind-demo',
  name: 'task-craft-api',
  fullName: 'repomind-demo/task-craft-api',
  description: 'High-performance collaborative task management service with real-time updates and role-based authorization.',
  url: 'https://github.com/repomind-demo/task-craft-api',
  defaultBranch: 'main',

  stats: {
    stars: 1240,
    forks: 185,
    openIssues: 12,
    totalFiles: 42,
  },

  languages: {
    TypeScript: 85200,
    JavaScript: 12400,
  },
  primaryLanguage: 'TypeScript',
  techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'Redis'],
  entryPoints: [
    'src/app/page.tsx',
    'src/app/api/tasks/route.ts',
    'src/lib/auth/jwt.ts',
    'src/lib/db/prisma.ts'
  ],

  importantFiles: [
    {
      path: 'package.json',
      content: '{"name": "task-craft-api", "dependencies": {"next": "^14.0.0", "react": "^18.2.0"}}',
      size: 1120
    },
    {
      path: 'README.md',
      content: '# TaskCraft API\nCollaborative task management backend.',
      size: 2400
    }
  ],

  issues: [
    {
      id: 101,
      number: 42,
      title: 'Fix auth token expiration handling in JWT middleware',
      body: 'Token refresh fails when expiration header is set in `src/lib/auth.ts`.',
      state: 'open',
      htmlUrl: 'https://github.com/repomind-demo/task-craft-api/issues/42',
      author: 'alexdev',
      labels: [{ name: 'good first issue', color: '70c24a' }],
      comments: 3,
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-16T12:00:00Z',
      locked: false,
      isPullRequest: false,
      relatedPaths: ['src/lib/auth.ts'],
      difficulty: 'beginner',
      contributionSignal: 'good-first-issue',
    }
  ],

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
