import { InvestigationContext } from './investigationContext';
import { LLMMessage } from './llmClient';

export function buildInvestigationMessages(context: InvestigationContext): LLMMessage[] {
  const systemPrompt = `You are RepoMind, an AI-powered open-source contribution investigation assistant.
Your job is to help a software developer understand a specific GitHub issue, map it to the repository's codebase, and plan a contribution.

IMPORTANT INVESTIGATION RULES:
1. Ground all claims strictly in supplied repository evidence (issue description, architecture nodes, source code).
2. NEVER invent non-existent file paths, line numbers, functions, modules, or commits.
3. If evidence is insufficient, explicitly state: "Insufficient repository evidence."
4. Distinguish clearly between confirmed evidence and reasonable technical inferences.
5. Do NOT generate a fictional fix code diff. Suggest fix direction and testing strategy.
6. Target audience: A developer who may be a first-time contributor to this repository. Explain module concepts clearly.

You MUST respond with a single, valid JSON object following this exact schema:
{
  "issueSummary": "Clear 2-sentence summary of what the issue is reporting",
  "whatIsHappening": "Detailed technical explanation of current behavior vs expected behavior",
  "likelyCause": "Technical hypothesis explaining why this behavior occurs based on evidence",
  "confidence": "high" | "medium" | "low",
  "affectedAreas": [
    {
      "path": "exact_file_path_from_evidence",
      "reason": "why this file is involved"
    }
  ],
  "keyEvidence": [
    {
      "path": "exact_file_path_from_evidence",
      "lineStart": number or null,
      "lineEnd": number or null,
      "explanation": "what this code snippet or reference demonstrates"
    }
  ],
  "relatedIssues": [
    {
      "number": number,
      "reason": "why this other issue is related"
    }
  ],
  "investigationSteps": [
    "Step 1: Read ...",
    "Step 2: Inspect ..."
  ],
  "suggestedFixDirection": "High-level architectural recommendation on how to approach fixing the issue",
  "testingStrategy": [
    "Test 1: Run unit test ...",
    "Test 2: Verify scenario ..."
  ],
  "difficultyAssessment": {
    "level": "beginner" | "intermediate" | "advanced",
    "reason": "why this issue is rated at this level"
  },
  "evidenceLimitations": [
    "Limitation 1: Need to inspect additional test files ...",
    "Limitation 2: ..."
  ]
}`;

  const userPrompt = `Investigate GitHub Issue #${context.issue.number} for repository.

### ISSUE METADATA
- Title: #${context.issue.number} ${context.issue.title}
- Author: @${context.issue.author}
- Labels: ${context.issue.labels.join(', ') || 'None'}
- Signal: ${context.issue.contributionSignal}
- Difficulty: ${context.issue.difficulty}
- Body:
"""
${context.issue.body || 'No description provided.'}
"""

### RELATED ARCHITECTURE MODULES
${JSON.stringify(context.relatedArchitecture, null, 2)}

### SUPPLIED SOURCE CODE EVIDENCE
${
  context.sourceFiles.length > 0
    ? context.sourceFiles
        .map((f) => `--- FILE: ${f.path} ---\n${f.content}\n`)
        .join('\n')
    : 'No source file content fetched directly.'
}

### RELATED REPOSITORY ISSUES
${JSON.stringify(context.relatedIssues, null, 2)}

Perform the contribution investigation and output ONLY the JSON object.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}
