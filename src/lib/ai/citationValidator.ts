import { InvestigationResult, LearningPath, RelevantFile } from '@/types/investigation';

export function validateAndCleanCitations(
  result: InvestigationResult,
  validFilePaths: string[]
): InvestigationResult {
  const pathSet = new Set(validFilePaths.map((p) => p.toLowerCase()));

  const isPathValid = (testPath?: string): boolean => {
    if (!testPath) return false;
    const clean = testPath.trim().toLowerCase();
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

    // If Gemini provided valid files, keep them; otherwise fallback to validAffectedAreas
    if (validFiles.length > 0) {
      validLearningPath = {
        goal: result.learningPath.goal || 'Understand relevant codebase execution paths.',
        files: validFiles,
        concepts: result.learningPath.concepts || [],
        questions: result.learningPath.questions || [],
      };
    } else if (validAffectedAreas.length > 0) {
      validLearningPath = {
        goal: 'Understand the primary affected files in this repository.',
        files: validAffectedAreas.map((area, idx) => ({
          path: area.path,
          reason: area.reason,
          relevance: idx === 0 ? 'primary' : 'supporting',
          estimatedMinutes: 5,
        })),
        concepts: result.learningPath.concepts || [],
        questions: result.learningPath.questions || [],
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
