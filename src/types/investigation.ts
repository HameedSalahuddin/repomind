export interface InvestigationAffectedArea {
  path: string;
  reason: string;
}

export interface InvestigationKeyEvidence {
  path: string;
  lineStart: number | null;
  lineEnd: number | null;
  explanation: string;
}

export interface InvestigationRelatedIssue {
  number: number;
  reason: string;
}

export interface InvestigationDifficulty {
  level: 'beginner' | 'intermediate' | 'advanced';
  reason: string;
}

export interface InvestigationResult {
  issueSummary: string;
  whatIsHappening: string;
  likelyCause: string;
  confidence: 'high' | 'medium' | 'low';
  affectedAreas: InvestigationAffectedArea[];
  keyEvidence: InvestigationKeyEvidence[];
  relatedIssues: InvestigationRelatedIssue[];
  investigationSteps: string[];
  suggestedFixDirection: string;
  testingStrategy: string[];
  difficultyAssessment: InvestigationDifficulty;
  evidenceLimitations: string[];
}

export interface InvestigationRequest {
  owner: string;
  repo: string;
  issueNumber: number;
}
