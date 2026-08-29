import { RepositoryAnalysis } from '@/types/repo';

export interface SourceFileContent {
  path: string;
  content: string;
  fileType: 'source' | 'test' | 'documentation';
}

export interface InvestigationContext {
  issue: {
    number: number;
    title: string;
    body: string | null;
    labels: string[];
    comments: number;
    author: string;
    htmlUrl: string;
    contributionSignal: string;
    difficulty: string;
  };
  relatedArchitecture: Array<{
    id: string;
    label: string;
    type: string;
    description?: string;
  }>;
  sourceFiles: SourceFileContent[];
  relatedIssues: Array<{
    number: number;
    title: string;
    reason: string;
  }>;
}

const MAX_SOURCE_FILES = 6;
const MAX_FILE_CHARS = 5000;
const MAX_RELATED_ISSUES = 5;

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

function determineFileType(path: string): 'source' | 'test' | 'documentation' {
  const lower = path.toLowerCase();
  if (lower.includes('test') || lower.includes('spec') || lower.includes('fixture')) {
    return 'test';
  }
  if (lower.endsWith('.md') || lower.endsWith('.rst') || lower.startsWith('docs/')) {
    return 'documentation';
  }
  return 'source';
}

export async function buildIssueInvestigationContext(
  analysis: RepositoryAnalysis,
  issueNumber: number
): Promise<InvestigationContext> {
  const targetIssue = analysis.issues.find((i) => i.number === issueNumber);

  if (!targetIssue) {
    throw new Error(`Issue #${issueNumber} not found in repository analysis.`);
  }

  // 1. Gather Related Architecture Nodes
  const relatedNodeIds = targetIssue.relatedNodes || [];
  const relatedArchitecture = analysis.architecture.nodes
    .filter((node) => relatedNodeIds.includes(node.id) && node.id !== 'root')
    .map((node) => ({
      id: node.id,
      label: node.label,
      type: node.type,
      description: node.description,
    }));

  // 2. Extract Candidate Paths from Issue & Architecture
  const candidatePaths = new Set<string>();

  // Add paths from issue's relatedPaths
  (targetIssue.relatedPaths || []).forEach((p) => candidatePaths.add(p));

  // Add paths from related architecture nodes
  analysis.architecture.nodes
    .filter((node) => relatedNodeIds.includes(node.id))
    .forEach((node) => {
      (node.filePaths || []).forEach((fp) => {
        if (/\.[a-zA-Z0-9]+$/.test(fp)) {
          candidatePaths.add(fp);
        }
      });
    });

  // Search repository file tree for related test/doc candidates if issue references a module
  const issueText = `${targetIssue.title} ${targetIssue.body || ''}`.toLowerCase();
  const allTreePaths = analysis.fileTree.map((f) => f.path);

  // Match test files
  const testCandidates = allTreePaths.filter(
    (p) => (p.toLowerCase().includes('test') || p.toLowerCase().includes('spec')) &&
      Array.from(candidatePaths).some((cp) => {
        const baseName = cp.split('/').pop()?.split('.')[0].toLowerCase();
        return baseName && baseName.length > 3 && p.toLowerCase().includes(baseName);
      })
  );
  testCandidates.slice(0, 2).forEach((tp) => candidatePaths.add(tp));

  // Match doc files if issue refers to docs
  if (/doc|readme|guide|usage|advanced/i.test(issueText)) {
    const docCandidates = allTreePaths.filter(
      (p) => p.startsWith('docs/') || p.endsWith('.rst') || p.endsWith('.md')
    );
    docCandidates.slice(0, 2).forEach((dp) => candidatePaths.add(dp));
  }

  const selectedFilePaths = Array.from(candidatePaths).slice(0, MAX_SOURCE_FILES);

  // Fetch Source Code Contents concurrently from GitHub
  const headers = getGitHubHeaders();
  const sourceFiles: SourceFileContent[] = [];

  await Promise.all(
    selectedFilePaths.map(async (filePath) => {
      try {
        const rawContentUrl = `https://raw.githubusercontent.com/${analysis.owner}/${analysis.name}/${analysis.defaultBranch}/${filePath}`;
        const contentRes = await fetch(rawContentUrl, { headers });

        if (contentRes.ok) {
          const text = await contentRes.text();
          const cappedText = text.length > MAX_FILE_CHARS ? text.substring(0, MAX_FILE_CHARS) + '\n...[truncated]' : text;
          sourceFiles.push({
            path: filePath,
            content: cappedText,
            fileType: determineFileType(filePath),
          });
        }
      } catch {
        // Skip unreadable files
      }
    })
  );

  // 3. Search Potentially Related Open Issues
  const relatedIssues: InvestigationContext['relatedIssues'] = [];

  for (const otherIssue of analysis.issues) {
    if (otherIssue.number === targetIssue.number) continue;
    if (relatedIssues.length >= MAX_RELATED_ISSUES) break;

    const sharesPath = otherIssue.relatedPaths?.some((p) => targetIssue.relatedPaths?.includes(p));
    const sharesNode = otherIssue.relatedNodes?.some((n) => targetIssue.relatedNodes?.includes(n));

    if (sharesPath) {
      relatedIssues.push({
        number: otherIssue.number,
        title: otherIssue.title,
        reason: 'Shares identical file references',
      });
    } else if (sharesNode) {
      relatedIssues.push({
        number: otherIssue.number,
        title: otherIssue.title,
        reason: 'Belongs to the same architecture module',
      });
    }
  }

  return {
    issue: {
      number: targetIssue.number,
      title: targetIssue.title,
      body: targetIssue.body,
      labels: targetIssue.labels.map((l) => l.name),
      comments: targetIssue.comments,
      author: targetIssue.author,
      htmlUrl: targetIssue.htmlUrl,
      contributionSignal: targetIssue.contributionSignal,
      difficulty: targetIssue.difficulty,
    },
    relatedArchitecture,
    sourceFiles,
    relatedIssues,
  };
}
