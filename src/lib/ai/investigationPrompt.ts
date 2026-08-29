import { InvestigationContext } from './investigationContext';
import { LLMMessage } from './llmClient';

export function buildInvestigationMessages(context: InvestigationContext): LLMMessage[] {
  const systemPrompt = `You are RepoMind, an AI-powered open-source contribution investigation assistant.
Your job is to help a software developer understand a specific GitHub issue, map it to the repository's codebase, and plan a contribution.

IMPORTANT INVESTIGATION RULES:
1. Ground all claims strictly in supplied repository evidence (issue description, architecture nodes, source code).
2. NEVER invent non-existent file paths, line numbers, functions, modules, or commits.
3. If evidence is insufficient, explicitly state: "Insufficient repository evidence."
4. Distinguish clearly between confirmed evidence (What we know) and technical hypotheses (What we are trying to find out).
5. Do NOT generate a fictional fix code diff. Present 2 to 4 possible investigation directions.
6. Target audience: A beginner developer who is a first-time contributor to this repository. Explain concepts clearly.
7. LEARNING PATH: Build an ordered step-by-step Learning Path recommending 3 to 5 specific files to read first (from easiest prerequisite to deepest implementation). Never return generic root directory labels like "repository (root)".
8. CONCISE JSON FORMAT: Keep text concise so the complete JSON response fits comfortably. Do NOT use double quotes inside string property values — use single quotes or backticks for code references.

You MUST respond with a single, valid JSON object following this exact schema:
{
  "issueSummary": "Concise 2-sentence summary of what the issue reports",
  "whatIsHappening": "Facts: Detailed technical explanation of current behavior vs expected behavior based on evidence",
  "likelyCause": "Hypothesis explaining why this behavior occurs based on evidence",
  "confidence": "high" | "medium" | "low",
  "learningPath": {
    "goal": "One sentence describing what the contributor will learn from this reading sequence",
    "files": [
      {
        "path": "exact_file_path_from_evidence",
        "reason": "Why read this file first? What specific function or symbol to look for?",
        "relevance": "primary" | "supporting" | "context",
        "symbols": ["symbol_or_function_name"],
        "lineStart": number or null,
        "lineEnd": number or null,
        "estimatedMinutes": 5
      }
    ],
    "concepts": [
      "Concept Name: One-sentence beginner explanation"
    ],
    "questions": [
      "What is ...?",
      "Where is ... configured?"
    ]
  },
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
      "explanation": "what this code reference demonstrates"
    }
  ],
  "relatedIssues": [
    {
      "number": number,
      "reason": "why this issue is related"
    }
  ],
  "investigationSteps": [
    "Step 1: Read ...",
    "Step 2: Inspect ..."
  ],
  "suggestedFixDirection": "2 to 4 possible investigation directions to confirm before deciding what should change",
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
        .map((f) => `--- FILE: ${f.path} (${f.fileType.toUpperCase()}) ---\n${f.content}\n`)
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
