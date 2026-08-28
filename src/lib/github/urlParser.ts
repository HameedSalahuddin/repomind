export interface ParsedRepoUrl {
  owner: string;
  repo: string;
  fullName: string;
  cleanUrl: string;
}

export function parseGitHubUrl(rawUrl: string): ParsedRepoUrl | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  let cleaned = rawUrl.trim();

  // Strip protocol prefix if present
  cleaned = cleaned.replace(/^https?:\/\//i, '');

  // Strip trailing slashes or .git suffix
  cleaned = cleaned.replace(/\/+$/, '').replace(/\.git$/i, '');

  // Handle formats: github.com/owner/repo or owner/repo
  const parts = cleaned.split('/');

  let owner = '';
  let repo = '';

  if (parts.length >= 3 && parts[0].toLowerCase().includes('github.com')) {
    owner = parts[1];
    repo = parts[2];
  } else if (parts.length === 2 && !parts[0].includes('.')) {
    owner = parts[0];
    repo = parts[1];
  } else {
    return null;
  }

  // Validate owner and repo naming constraints
  const validNameRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!owner || !repo || !validNameRegex.test(owner) || !validNameRegex.test(repo)) {
    return null;
  }

  return {
    owner,
    repo,
    fullName: `${owner}/${repo}`,
    cleanUrl: `https://github.com/${owner}/${repo}`,
  };
}
