import { RepositoryAnalysis, RepositoryIssue, ArchitectureNode } from '@/types/repo';

export interface SourceFileContent {
  path: string;
  content: string;
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

const MAX_SOURCE_FILES = 5;
const MAX_FILE_CHARS = 12000;
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

  // 2. Select Up to 5 Candidate Source Files
  const candidatePaths = new Set<string>();

  // Add paths from relatedPaths
  (targetIssue.relatedPaths || []).forEach((p) => candidatePaths.add(p));

  // Add paths from related architecture nodes
  analysis.architecture.nodes
    .filter((node) => relatedNodeIds.includes(node.id))
    .forEach((node) => {
      (node.filePaths || []).forEach((fp) => {
        // If fp is a file extension, add directly; if folder, skip raw file fetch
        if (/\.[a-zA-Z0-9]+$/.test(fp) && !fp.toLowerCase().endsWith('.md')) {
          candidatePaths.add(fp);
        }
      });
    });

  // Filter out non-code or README files if code files exist
  let selectedFilePaths = Array.from(candidatePaths)
    .filter((p) => !p.toLowerCase().endsWith('.md') && !p.toLowerCase().endsWith('.json'))
    .slice(0, MAX_SOURCE_FILES);

  if (selectedFilePaths.length === 0) {
    selectedFilePaths = Array.from(candidatePaths).slice(0, MAX_SOURCE_FILES);
  }

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
