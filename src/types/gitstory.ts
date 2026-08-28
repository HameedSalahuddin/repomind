export interface GitCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  htmlUrl: string;
  filesChanged?: string[];
}

export type MilestoneCategory = 
  | 'initial_architecture' 
  | 'major_feature' 
  | 'refactor' 
  | 'migration' 
  | 'auth' 
  | 'performance' 
  | 'security';

export interface GitStoryMilestone {
  id: string;
  title: string;
  category: MilestoneCategory;
  date: string;
  summary: string;
  explanation: string;
  relatedCommits: GitCommit[];
  affectedFiles: string[];
}

export interface GitStoryResponse {
  repository: string;
  totalCommitsAnalyzed: number;
  milestones: GitStoryMilestone[];
}

export interface GitStoryQueryRequest {
  repoUrl: string;
  query: string;
  milestoneId?: string;
}

export interface GitStoryQueryResponse {
  answer: string;
  relevantMilestones: GitStoryMilestone[];
  relevantCommits: GitCommit[];
  evidenceFiles: string[];
}
