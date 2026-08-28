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

export interface RepositoryAnalysis {
  metadata: RepositoryMetadata;
  fileTree: FileTreeNode[];
  architecture: ArchitectureGraph;
  entryPoints: string[];
  summary: string;
}
