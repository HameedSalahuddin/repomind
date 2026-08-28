export interface AICitation {
  type: 'file' | 'commit';
  path?: string;
  lines?: [number, number];
  sha?: string;
  description: string;
  url?: string;
}

export interface QnaRequest {
  repoUrl: string;
  question: string;
  activeFilePath?: string;
}

export interface QnaResponse {
  question: string;
  answer: string;
  citations: AICitation[];
  suggestedFollowUps?: string[];
}
