export interface SkillPatchRequest {
  skillId: string;
  repoUrl: string;
  options?: {
    includeMermaid?: boolean;
    audience?: 'contributor' | 'staff_engineer' | 'executive' | 'product_manager' | 'all';
  };
}

export interface WikiCatalogueItem {
  title: string;
  name: string;
  prompt: string;
  children?: WikiCatalogueItem[];
}

export interface SkillPatchArtifacts {
  contributorGuide?: string;
  staffEngineerGuide?: string;
  executiveGuide?: string;
  productManagerGuide?: string;
}

export interface SkillPatchResponse {
  skillId: string;
  status: 'success' | 'error' | 'pending';
  catalogue: WikiCatalogueItem;
  artifacts: SkillPatchArtifacts;
  generatedAt: string;
}
