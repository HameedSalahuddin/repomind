import { InvestigationResult, LearningPath, RelevantFile } from '@/types/investigation';

export function validateAndCleanCitations(
  result: InvestigationResult,
  validFilePaths: string[]
): InvestigationResult {
  const pathSet = new Set(validFilePaths.map((p) => p.toLowerCase()));

  const isPathValid = (testPath?: string): boolean => {
    if (!testPath) return false;
    const clean = testPath.trim().toLowerCase();
    // Reject generic root descriptors that are not actual file paths
    if (clean.includes('(root)') || clean === 'root' || clean.endsWith('/')) return false;

    if (pathSet.has(clean)) return true;
    return validFilePaths.some((vp) => vp.toLowerCase().endsWith(clean) || clean.endsWith(vp.toLowerCase()));
  };

  // Validate Affected Areas
  const validAffectedAreas = (result.affectedAreas || []).filter((area) =>
    area && isPathValid(area.path)
  );

  // Validate Key Evidence Paths
  const validKeyEvidence = (result.keyEvidence || []).filter((ev) =>
    ev && isPathValid(ev.path)
  );

  // Validate Learning Path Files
  let validLearningPath: LearningPath | undefined = undefined;

  if (result.learningPath) {
    const validFiles: RelevantFile[] = (result.learningPath.files || []).filter((f) =>
      f && isPathValid(f.path)
    );

    if (validFiles.length > 0) {
      validLearningPath = {
        goal: result.learningPath.goal || 'Understand relevant codebase execution paths.',
        files: validFiles,
        concepts: result.learningPath.concepts || [],
        questions: result.learningPath.questions || [],
      };
    } else {
      // Construct fallback learning path from valid repository files
      const fallbackFiles = (validAffectedAreas.length > 0 ? validAffectedAreas : validFilePaths.slice(0, 3)).map(
        (item, idx) => ({
          path: typeof item === 'string' ? item : item.path,
          reason: typeof item === 'string' ? 'Primary module file for repository exploration' : item.reason,
          relevance: (idx === 0 ? 'primary' : 'supporting') as 'primary' | 'supporting',
          estimatedMinutes: 5,
        })
      );

      validLearningPath = {
        goal: 'Understand the primary files in this repository before making changes.',
        files: fallbackFiles,
        concepts: result.learningPath.concepts || [
          'Module Structure: Understand where request handling and responses are routed.',
        ],
        questions: result.learningPath.questions || [
          'Where does execution enter this component?',
          'How are response objects returned to callers?',
        ],
      };
    }
  }

  // Track if LLM attempted hallucinated paths
  const invalidPathsDetected: string[] = [];

  (result.affectedAreas || []).forEach((area) => {
    if (area && area.path && !isPathValid(area.path)) {
      invalidPathsDetected.push(area.path);
    }
  });

  const evidenceLimitations = [...(result.evidenceLimitations || [])];
  if (invalidPathsDetected.length > 0) {
    evidenceLimitations.push(
      `Filtered ${invalidPathsDetected.length} unverified file path reference(s) not found in repository tree.`
    );
  }

  return {
    ...result,
    learningPath: validLearningPath,
    affectedAreas: validAffectedAreas,
    keyEvidence: validKeyEvidence,
    evidenceLimitations,
  };
}
