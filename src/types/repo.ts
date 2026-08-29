export interface RepositoryMetadata {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number;
  license?: string;
  updatedAt: string;
  technologies: string[];
  primaryLanguage: string;
}

export interface FileTreeNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'package' | 'module' | 'service' | 'database' | 'external';
  description?: string;
  filePaths?: string[];
  path?: string;
  level?: number;
  fileCount?: number;

  // Contributor / Issue signals
  issueCount?: number;
  issueIds?: number[];
  issues?: number[]; // Kept for backward compatibility
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType?: 'imports' | 'calls' | 'depends_on' | 'data_flow';
}

export interface ArchitectureGraph {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ImportantFile {
  path: string;
  content: string;
  size?: number;
}

export type ContributionSignal = 
  | 'good-first-issue'
  | 'help-wanted'
  | 'bug'
  | 'enhancement'
  | 'documentation'
  | 'performance'
  | 'security'
  | 'unknown';

export interface RepositoryIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  htmlUrl: string;
  author: string;
  labels: {
    name: string;
    color?: string;
  }[];
  comments: number;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  isPullRequest: boolean;

  relatedPaths: string[];
  relatedNodes?: string[];

  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
  contributionSignal: ContributionSignal;
}

export interface InternalIssueMatchScore {
  issueNumber: number;
  nodeId: string;
  confidence: number;
  matchedSignals: string[];
}

export interface RepositoryAnalysis {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  defaultBranch: string;

  stats: {
    stars: number;
    forks: number;
    openIssues: number;
    totalFiles: number;
  };

  languages: Record<string, number>;
  primaryLanguage: string;
  techStack: string[];
  entryPoints: string[];

  fileTree: FileTreeNode[];
  importantFiles: ImportantFile[];
  issues: RepositoryIssue[];

  // Metadata compatibility
  metadata: RepositoryMetadata;
  architecture: ArchitectureGraph;
  summary: string;
}
