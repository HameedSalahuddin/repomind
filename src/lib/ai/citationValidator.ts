import { InvestigationResult } from '@/types/investigation';

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
    affectedAreas: validAffectedAreas,
    keyEvidence: validKeyEvidence,
    evidenceLimitations,
  };
}
