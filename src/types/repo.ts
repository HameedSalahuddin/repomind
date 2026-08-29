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

  // Metadata compatibility
  metadata: RepositoryMetadata;
  architecture: ArchitectureGraph;
  summary: string;
}
