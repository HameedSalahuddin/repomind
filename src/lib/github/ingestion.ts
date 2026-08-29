import { RepositoryAnalysis, FileTreeNode, ImportantFile } from '@/types/repo';
import { parseGitHubUrl } from './urlParser';
import { getFromCache, setInCache } from './cache';
import { detectTechStack, detectEntryPoints } from '../analyzer/stackDetector';
import { extractArchitectureGraph } from '../analyzer/architectureExtractor';
import { fetchRepositoryIssues } from './issues';

const GITHUB_API_BASE = 'https://api.github.com';

export interface DiagnosticsInfo {
  authenticated: boolean;
  remainingRequests: number;
  resetTime?: string;
}

export interface IngestionResult {
  analysis: RepositoryAnalysis;
  diagnostics: DiagnosticsInfo;
  cached: boolean;
}

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

// Important manifest files to fetch contents for
const IMPORTANT_FILE_CANDIDATES = [
  'README.md',
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'next.config.ts',
  'next.config.mjs',
  'requirements.txt',
  'pyproject.toml',
  'Cargo.toml',
  'go.mod',
  'pom.xml',
  'build.gradle',
  'Dockerfile',
  'docker-compose.yml',
];

export async function fetchRepositoryAnalysis(rawUrl: string): Promise<IngestionResult> {
  const parsed = parseGitHubUrl(rawUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL format. Use https://github.com/owner/repository');
  }

  const cacheKey = `repo:${parsed.fullName.toLowerCase()}`;
  const cachedData = getFromCache<RepositoryAnalysis>(cacheKey);

  const isAuthenticated = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0);

  if (cachedData) {
    return {
      analysis: cachedData,
      diagnostics: {
        authenticated: isAuthenticated,
        remainingRequests: 5000,
      },
      cached: true,
    };
  }

  const headers = getGitHubHeaders();
  let remainingRequests = isAuthenticated ? 5000 : 60;
  let resetTime: string | undefined = undefined;

  const updateRateLimitsFromHeaders = (resHeaders: Headers) => {
    const remaining = resHeaders.get('x-ratelimit-remaining');
    const reset = resHeaders.get('x-ratelimit-reset');

    if (remaining !== null) {
      remainingRequests = parseInt(remaining, 10);
    }
    if (reset !== null) {
      const resetEpoch = parseInt(reset, 10) * 1000;
      resetTime = new Date(resetEpoch).toISOString();
    }
  };

  // 1. Fetch Repository Metadata
  const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${parsed.owner}/${parsed.repo}`, {
    headers,
    next: { revalidate: 300 },
  });

  updateRateLimitsFromHeaders(repoRes.headers);

  if (repoRes.status === 404) {
    throw new Error(`Repository '${parsed.fullName}' not found or is private.`);
  }

  if (repoRes.status === 403 || repoRes.status === 429) {
    if (remainingRequests === 0) {
      const resetMsg = resetTime ? ` Resets at ${resetTime}.` : '';
      throw new Error(
        `GitHub API rate limit exceeded.${resetMsg} Please ensure GITHUB_TOKEN is configured in .env.local.`
      );
    }
  }

  if (!repoRes.ok) {
    throw new Error(`GitHub API error (${repoRes.status}): ${repoRes.statusText}`);
  }

  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch || 'main';

  // 2. Fetch Languages Breakdown
  let languages: Record<string, number> = {};
  try {
    const langRes = await fetch(`${GITHUB_API_BASE}/repos/${parsed.owner}/${parsed.repo}/languages`, {
      headers,
    });
    updateRateLimitsFromHeaders(langRes.headers);
    if (langRes.ok) {
      languages = await langRes.json();
    }
  } catch {
    // Non-critical
  }

  const primaryLanguage = repoData.language || Object.keys(languages)[0] || 'Unknown';

  // 3. Fetch Recursive Tree (Single Call for Entire Tree)
  let flatTree: Array<{ path: string; type: string; size?: number }> = [];
  try {
    const treeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${parsed.owner}/${parsed.repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );
    updateRateLimitsFromHeaders(treeRes.headers);
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      flatTree = treeData.tree || [];
    }
  } catch {
    // Non-critical tree error
  }

  const filePaths = flatTree.filter((t) => t.type === 'blob').map((t) => t.path);
  const totalFiles = filePaths.length;

  if (totalFiles === 0 && flatTree.length === 0) {
    throw new Error(`Repository '${parsed.fullName}' returned no file tree. Verify branch '${defaultBranch}'.`);
  }

  // Build root directory file tree node list for UI
  const rootFileTree: FileTreeNode[] = flatTree
    .filter((item) => !item.path.includes('/') || item.path.split('/').length <= 2)
    .slice(0, 40)
    .map((item) => ({
      path: item.path,
      name: item.path.split('/').pop() || item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
      size: item.size,
    }));

  // 4. Fetch Contents ONLY for Verified Existing Candidate Manifests (Max 6)
  const existingCandidates = IMPORTANT_FILE_CANDIDATES.filter((candidate) =>
    filePaths.some((p) => p.toLowerCase() === candidate.toLowerCase())
  ).slice(0, 6);

  const importantFiles: ImportantFile[] = [];
  const importantContents: Record<string, string> = {};

  await Promise.all(
    existingCandidates.map(async (candidatePath) => {
      try {
        const rawContentUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${defaultBranch}/${candidatePath}`;
        const contentRes = await fetch(rawContentUrl, { headers });
        if (contentRes.ok) {
          const text = await contentRes.text();
          const cappedText = text.length > 30000 ? text.substring(0, 30000) + '\n...[truncated]' : text;
          importantFiles.push({
            path: candidatePath,
            content: cappedText,
            size: text.length,
          });
          importantContents[candidatePath] = cappedText;
        }
      } catch {
        // Skip unreadable files
      }
    })
  );

  // 5. Deterministic Tech Stack & Entry Points Detection
  const techStack = detectTechStack({
    fileTreePaths: filePaths,
    importantFileContents: importantContents,
    primaryLanguage,
    languages,
  });

  const entryPoints = detectEntryPoints(filePaths, importantContents);

  // 6. Fetch Open Repository Issues for Contributor Mapping
  const issues = await fetchRepositoryIssues(parsed.owner, parsed.repo, filePaths);

  // 7. Real Deterministic Architecture Graph Extraction with Issue Signals
  const architecture = extractArchitectureGraph({
    repoName: parsed.repo,
    filePaths,
    entryPoints,
    techStack,
    importantFiles: importantContents,
    issues,
  });

  const analysisResult: RepositoryAnalysis = {
    owner: parsed.owner,
    name: parsed.repo,
    fullName: parsed.fullName,
    description: repoData.description || 'Public GitHub Repository',
    url: parsed.cleanUrl,
    defaultBranch,

    stats: {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      openIssues: repoData.open_issues_count || 0,
      totalFiles,
    },

    languages,
    primaryLanguage,
    techStack,
    entryPoints,

    fileTree: rootFileTree,
    importantFiles,
    issues,

    metadata: {
      owner: parsed.owner,
      name: parsed.repo,
      fullName: parsed.fullName,
      description: repoData.description || 'Public GitHub Repository',
      url: parsed.cleanUrl,
      defaultBranch,
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      openIssues: repoData.open_issues_count || 0,
      license: repoData.license?.spdx_id || repoData.license?.name,
      updatedAt: repoData.updated_at,
      technologies: techStack,
      primaryLanguage,
    },
    architecture,
    summary: `${parsed.fullName} is a ${primaryLanguage} project with ${totalFiles} files. Tech stack includes ${techStack.slice(0, 4).join(', ')}.`,
  };

  setInCache(cacheKey, analysisResult);

  return {
    analysis: analysisResult,
    diagnostics: {
      authenticated: isAuthenticated,
      remainingRequests,
      resetTime,
    },
    cached: false,
  };
}
