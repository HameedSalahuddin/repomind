import { RepositoryIssue, ContributionSignal, ArchitectureNode, InternalIssueMatchScore } from '@/types/repo';

const GITHUB_API_BASE = 'https://api.github.com';

function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoMind-App/1.0',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  return headers;
}

// Beginner and advanced label heuristics
const BEGINNER_LABELS = new Set([
  'good first issue',
  'good-first-issue',
  'first issue',
  'beginner',
  'easy',
  'help wanted',
  'documentation',
  'starter',
]);

const ADVANCED_LABELS = new Set([
  'breaking',
  'architecture',
  'security',
  'performance',
  'complex',
  'refactor',
  'core',
  'compiler',
]);

// Generic filenames to ignore for filename-only matching to avoid false positives
const GENERIC_FILENAMES = new Set([
  'index.ts',
  'index.js',
  'index.tsx',
  'index.jsx',
  'page.tsx',
  'layout.tsx',
  'route.ts',
  'package.json',
  'tsconfig.json',
  'readme.md',
  'types.ts',
  'main.go',
  'main.rs',
  'app.py',
  'mod.rs',
]);

// Generic directory names to ignore for directory-only matching
const GENERIC_DIRNAMES = new Set([
  'src',
  'lib',
  'app',
  'pages',
  'components',
  'utils',
  'helpers',
  'tests',
  'test',
  'docs',
  'build',
  'dist',
  'code',
  'file',
  'data',
]);

export function classifyDifficulty(labels: string[], title: string, body: string): RepositoryIssue['difficulty'] {
  const lowerLabels = labels.map((l) => l.toLowerCase());
  const combinedText = `${title} ${body}`.toLowerCase();

  for (const label of lowerLabels) {
    if (BEGINNER_LABELS.has(label)) return 'beginner';
    if (ADVANCED_LABELS.has(label)) return 'advanced';
  }

  if (/good first issue|good-first-issue|beginner-friendly|easy fix/i.test(combinedText)) {
    return 'beginner';
  }
  if (/breaking change|security vulnerability|architectural redesign/i.test(combinedText)) {
    return 'advanced';
  }

  if (lowerLabels.some((l) => ['bug', 'enhancement', 'feature'].includes(l))) {
    return 'intermediate';
  }

  return 'unknown';
}

export function classifyContributionSignal(labels: string[], title: string, body: string): ContributionSignal {
  const lowerLabels = labels.map((l) => l.toLowerCase());
  const combinedText = `${title} ${body}`.toLowerCase();

  if (lowerLabels.some((l) => ['good first issue', 'good-first-issue', 'starter', 'easy'].includes(l))) {
    return 'good-first-issue';
  }
  if (lowerLabels.some((l) => ['help wanted', 'help-wanted'].includes(l))) {
    return 'help-wanted';
  }
  if (lowerLabels.some((l) => ['bug', 'defect', 'fix', 'error'].includes(l)) || /bug:|error:|crash/i.test(combinedText)) {
    return 'bug';
  }
  if (lowerLabels.some((l) => ['enhancement', 'feature', 'proposal'].includes(l)) || /feature request|enhancement/i.test(combinedText)) {
    return 'enhancement';
  }
  if (lowerLabels.some((l) => ['documentation', 'docs'].includes(l)) || /doc|readme/i.test(combinedText)) {
    return 'documentation';
  }
  if (lowerLabels.some((l) => ['performance', 'perf', 'speed', 'memory'].includes(l)) || /leak|performance/i.test(combinedText)) {
    return 'performance';
  }
  if (lowerLabels.some((l) => ['security', 'vulnerability', 'cve'].includes(l)) || /security/i.test(combinedText)) {
    return 'security';
  }

  return 'unknown';
}

export interface PathIndex {
  exactPaths: Set<string>;
  filenameToPaths: Map<string, string[]>;
  nodesByPath: Map<string, ArchitectureNode>;
  nodesByDirName: Map<string, ArchitectureNode[]>;
}

export function buildPathIndex(validPaths: string[], architectureNodes: ArchitectureNode[] = []): PathIndex {
  const exactPaths = new Set<string>();
  const filenameToPaths = new Map<string, string[]>();
  const nodesByPath = new Map<string, ArchitectureNode>();
  const nodesByDirName = new Map<string, ArchitectureNode[]>();

  validPaths.forEach((path) => {
    exactPaths.add(path);
    const filename = path.split('/').pop()?.toLowerCase();
    if (filename) {
      if (!filenameToPaths.has(filename)) {
        filenameToPaths.set(filename, []);
      }
      filenameToPaths.get(filename)!.push(path);
    }
  });

  architectureNodes.forEach((node) => {
    if (node.filePaths) {
      node.filePaths.forEach((fp) => {
        nodesByPath.set(fp, node);
        const dirName = fp.split('/').pop()?.toLowerCase();
        if (dirName && !GENERIC_DIRNAMES.has(dirName)) {
          if (!nodesByDirName.has(dirName)) {
            nodesByDirName.set(dirName, []);
          }
          nodesByDirName.get(dirName)!.push(node);
        }
      });
    }
  });

  return { exactPaths, filenameToPaths, nodesByPath, nodesByDirName };
}

export function extractRelatedPathsAndNodes(
  issueNumber: number,
  title: string,
  body: string | null,
  index: PathIndex,
  architectureNodes: ArchitectureNode[] = []
): { relatedPaths: string[]; relatedNodes: string[]; matchScores: InternalIssueMatchScore[] } {
  const text = `${title} ${body || ''}`;
  const matchedPaths = new Set<string>();
  const matchedNodes = new Set<string>();
  const matchScores: InternalIssueMatchScore[] = [];

  // Minimum confidence threshold to avoid noise
  const CONFIDENCE_THRESHOLD = 0.70;

  // 1. Signal A: Explicit Path or File:Line References
  // Pattern: path/to/file.ext or path/to/file.ext:123
  const pathMatches = text.match(/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+)(?::\d+)?/g) || [];
  for (let match of pathMatches) {
    const candidatePath = match.split(':')[0].trim();
    if (index.exactPaths.has(candidatePath)) {
      matchedPaths.add(candidatePath);

      // Find matching architecture node
      const matchingNode = architectureNodes.find((n) =>
        n.filePaths?.some((fp) => candidatePath === fp || candidatePath.startsWith(`${fp}/`) || fp.includes(candidatePath))
      );
      if (matchingNode) {
        matchedNodes.add(matchingNode.id);
        matchScores.push({
          issueNumber,
          nodeId: matchingNode.id,
          confidence: 0.95,
          matchedSignals: ['exact-path-reference'],
        });
      }
    }
  }

  // 2. Signal B: Backtick Code-Style Path/Module References
  const backtickMatches = text.match(/`([^`]+)`/g) || [];
  for (let match of backtickMatches) {
    const candidate = match.replace(/`/g, '').trim();
    if (index.exactPaths.has(candidate)) {
      matchedPaths.add(candidate);
      const matchingNode = architectureNodes.find((n) =>
        n.filePaths?.some((fp) => candidate === fp || candidate.startsWith(`${fp}/`) || fp.includes(candidate))
      );
      if (matchingNode) {
        matchedNodes.add(matchingNode.id);
        matchScores.push({
          issueNumber,
          nodeId: matchingNode.id,
          confidence: 0.90,
          matchedSignals: ['backtick-path-reference'],
        });
      }
    }
  }

  // 3. Signal C: Filename References (Excluding generic filenames)
  const filenameMatches = text.match(/\b([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)\b/g) || [];
  for (let rawFn of filenameMatches) {
    const filename = rawFn.toLowerCase().trim();
    if (!GENERIC_FILENAMES.has(filename) && index.filenameToPaths.has(filename)) {
      const candidates = index.filenameToPaths.get(filename)!;
      candidates.forEach((cand) => {
        matchedPaths.add(cand);
        const matchingNode = architectureNodes.find((n) =>
          n.filePaths?.some((fp) => cand === fp || cand.startsWith(`${fp}/`) || fp.includes(cand))
        );
        if (matchingNode) {
          matchedNodes.add(matchingNode.id);
          matchScores.push({
            issueNumber,
            nodeId: matchingNode.id,
            confidence: 0.80,
            matchedSignals: ['filename-reference'],
          });
        }
      });
    }
  }

  // 4. Signal D: Architecture Directory & Module Terminology References
  architectureNodes.forEach((node) => {
    if (!node.filePaths) return;
    node.filePaths.forEach((fp) => {
      const dirName = fp.split('/').pop()?.toLowerCase();
      if (dirName && !GENERIC_DIRNAMES.has(dirName) && dirName.length >= 4) {
        // Regex word boundary match for directory name
        const dirRegex = new RegExp(`\\b${dirName.replace(/[^a-z0-9]/gi, '\\$&')}\\b`, 'i');
        if (dirRegex.test(text)) {
          matchedNodes.add(node.id);
          matchScores.push({
            issueNumber,
            nodeId: node.id,
            confidence: 0.75,
            matchedSignals: ['architecture-dir-terminology'],
          });
        }
      }
    });
  });

  // Filter match scores by confidence threshold
  const validScores = matchScores.filter((ms) => ms.confidence >= CONFIDENCE_THRESHOLD);

  return {
    relatedPaths: Array.from(matchedPaths),
    relatedNodes: Array.from(matchedNodes),
    matchScores: validScores,
  };
}

export async function fetchRepositoryIssues(
  owner: string,
  repo: string,
  validFilePaths: string[] = [],
  architectureNodes: ArchitectureNode[] = []
): Promise<RepositoryIssue[]> {
  const headers = getGitHubHeaders();

  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&per_page=100&sort=updated`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      return [];
    }

    const rawIssues: any[] = await res.json();

    if (!Array.isArray(rawIssues)) {
      return [];
    }

    // Build fast indexed path lookup
    const index = buildPathIndex(validFilePaths, architectureNodes);

    const filteredIssues: RepositoryIssue[] = [];

    for (const raw of rawIssues) {
      // Exclude pull requests
      if (raw.pull_request) {
        continue;
      }

      const labels = (raw.labels || []).map((l: any) => ({
        name: typeof l === 'string' ? l : l.name || '',
        color: typeof l === 'object' ? l.color : undefined,
      }));

      const labelNames = labels.map((l: { name: string; color?: string }) => l.name);
      const title = raw.title || '';
      const body = raw.body || '';

      const difficulty = classifyDifficulty(labelNames, title, body);
      const contributionSignal = classifyContributionSignal(labelNames, title, body);

      const { relatedPaths, relatedNodes } = extractRelatedPathsAndNodes(
        raw.number,
        title,
        body,
        index,
        architectureNodes
      );

      filteredIssues.push({
        id: raw.id,
        number: raw.number,
        title,
        body,
        state: raw.state === 'closed' ? 'closed' : 'open',
        htmlUrl: raw.html_url,
        author: raw.user?.login || 'ghost',
        labels,
        comments: raw.comments || 0,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        locked: Boolean(raw.locked),
        isPullRequest: false,
        relatedPaths,
        relatedNodes,
        difficulty,
        contributionSignal,
      });
    }

    return filteredIssues;
  } catch (error) {
    return [];
  }
}
