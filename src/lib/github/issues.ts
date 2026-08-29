import { RepositoryIssue } from '@/types/repo';

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

export function classifyDifficulty(labels: string[], title: string, body: string): RepositoryIssue['difficulty'] {
  const lowerLabels = labels.map((l) => l.toLowerCase());
  const combinedText = `${title} ${body}`.toLowerCase();

  // 1. Check explicit label signals
  for (const label of lowerLabels) {
    if (BEGINNER_LABELS.has(label)) return 'beginner';
    if (ADVANCED_LABELS.has(label)) return 'advanced';
  }

  // 2. Check text keywords
  if (/good first issue|good-first-issue|beginner-friendly|easy fix/i.test(combinedText)) {
    return 'beginner';
  }
  if (/breaking change|security vulnerability|architectural redesign/i.test(combinedText)) {
    return 'advanced';
  }

  // 3. Heuristic based on intermediate tags
  if (lowerLabels.some((l) => ['bug', 'enhancement', 'feature'].includes(l))) {
    return 'intermediate';
  }

  return 'unknown';
}

export function extractRelatedPaths(title: string, body: string | null, validPaths: string[]): string[] {
  if (!validPaths || validPaths.length === 0) return [];

  const text = `${title} ${body || ''}`;
  const pathSet = new Set(validPaths);
  const matchedPaths = new Set<string>();

  // Regex to extract backtick paths or standard path strings with extensions
  const pathCandidates = text.match(/`([^`]+)`|([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./-]+\.[a-zA-Z0-9]+)/g) || [];

  for (let candidate of pathCandidates) {
    // Strip surrounding backticks or whitespace
    candidate = candidate.replace(/`/g, '').trim();

    // Check exact path match
    if (pathSet.has(candidate)) {
      matchedPaths.add(candidate);
      continue;
    }

    // Check suffix match (e.g. "router/index.ts" matching "src/router/index.ts")
    if (candidate.includes('/')) {
      const match = validPaths.find((vp) => vp.endsWith(candidate) || vp.includes(candidate));
      if (match) {
        matchedPaths.add(match);
      }
    }
  }

  return Array.from(matchedPaths);
}

export async function fetchRepositoryIssues(
  owner: string,
  repo: string,
  validFilePaths: string[] = []
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

    // Filter out pull requests and format into RepositoryIssue
    const filteredIssues: RepositoryIssue[] = [];

    for (const raw of rawIssues) {
      // GitHub Issues API returns PRs with a `pull_request` object property
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
      const relatedPaths = extractRelatedPaths(title, body, validFilePaths);

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
        difficulty,
      });
    }

    return filteredIssues;
  } catch (error) {
    // Return empty array on network or parsing error to keep ingestion resilient
    return [];
  }
}
