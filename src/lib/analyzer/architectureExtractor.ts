import { ArchitectureGraph, ArchitectureNode, ArchitectureEdge, RepositoryIssue } from '@/types/repo';

export interface ArchitectureExtractionInput {
  repoName: string;
  filePaths: string[];
  entryPoints: string[];
  techStack: string[];
  importantFiles?: Record<string, string>;
  issues?: RepositoryIssue[];
}

// Common ignored or generated directory patterns
const IGNORED_PATH_SEGMENTS = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.cache',
  'target',
  'vendor',
  '.git',
  '.github',
  '.idea',
  '.vscode',
  'tmp',
  'temp',
  '__pycache__',
  '.pytest_cache',
]);

export function extractArchitectureGraph(input: ArchitectureExtractionInput): ArchitectureGraph {
  const { repoName, filePaths, entryPoints, techStack, issues = [] } = input;

  // Filter out noise / ignored paths
  const cleanPaths = filePaths.filter((path) => {
    const parts = path.split('/');
    return !parts.some((part) => IGNORED_PATH_SEGMENTS.has(part));
  });

  // Calculate file counts per directory
  const dirFileCounts: Record<string, number> = {};
  const subDirsMap: Record<string, Set<string>> = {};

  cleanPaths.forEach((path) => {
    const parts = path.split('/');
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        const dirPath = parts.slice(0, i).join('/');
        dirFileCounts[dirPath] = (dirFileCounts[dirPath] || 0) + 1;

        const parentDir = i === 1 ? '' : parts.slice(0, i - 1).join('/');
        if (!subDirsMap[parentDir]) {
          subDirsMap[parentDir] = new Set();
        }
        subDirsMap[parentDir].add(dirPath);
      }
    }
  });

  const nodes: ArchitectureNode[] = [];
  const edges: ArchitectureEdge[] = [];
  const addedNodeIds = new Set<string>();

  // 1. Root Node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    label: `${repoName} (root)`,
    type: 'package',
    description: `Repository root with ${cleanPaths.length} source files`,
    filePaths: [repoName],
    issueCount: 0,
    issues: [],
  });
  addedNodeIds.add(rootId);

  // 2. Detect Monorepo Packages or Top-Level Directories
  const topDirs = Array.from(subDirsMap[''] || []).sort(
    (a, b) => (dirFileCounts[b] || 0) - (dirFileCounts[a] || 0)
  );

  const monorepoContainers = topDirs.filter((dir) =>
    ['packages', 'apps', 'modules', 'services', 'crates', 'components'].includes(dir.toLowerCase())
  );

  let primaryArchitecturalNodes: string[] = [];

  if (monorepoContainers.length > 0) {
    monorepoContainers.forEach((container) => {
      const containerSubDirs = Array.from(subDirsMap[container] || []);
      const subDirList = containerSubDirs
        .sort((a, b) => (dirFileCounts[b] || 0) - (dirFileCounts[a] || 0))
        .slice(0, 8);

      subDirList.forEach((subDir) => {
        primaryArchitecturalNodes.push(subDir);
      });

      if (subDirList.length === 0) {
        primaryArchitecturalNodes.push(container);
      }
    });
  }

  topDirs.forEach((dir) => {
    if (!monorepoContainers.includes(dir) && primaryArchitecturalNodes.length < 12) {
      if ((dirFileCounts[dir] || 0) >= 2) {
        primaryArchitecturalNodes.push(dir);
      }
    }
  });

  const selectedDirs = primaryArchitecturalNodes.slice(0, 12);

  selectedDirs.forEach((dirPath) => {
    const dirName = dirPath.split('/').pop() || dirPath;
    const count = dirFileCounts[dirPath] || 1;
    const nodeType: ArchitectureNode['type'] = dirPath.includes('db') || dirPath.includes('database') || dirPath.includes('models')
      ? 'database'
      : dirPath.includes('api') || dirPath.includes('services') || dirPath.includes('routes')
      ? 'service'
      : 'module';

    const nodeId = `dir-${dirPath.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

    if (!addedNodeIds.has(nodeId)) {
      nodes.push({
        id: nodeId,
        label: dirPath,
        type: nodeType,
        description: `Directory '${dirName}' containing ${count} files`,
        filePaths: [dirPath],
        issueCount: 0,
        issues: [],
      });
      addedNodeIds.add(nodeId);

      edges.push({
        id: `e-${rootId}-${nodeId}`,
        source: rootId,
        target: nodeId,
        label: 'contains',
        relationType: 'depends_on',
      });
    }

    const nestedSubDirs = Array.from(subDirsMap[dirPath] || [])
      .sort((a, b) => (dirFileCounts[b] || 0) - (dirFileCounts[a] || 0))
      .slice(0, 2);

    nestedSubDirs.forEach((subPath) => {
      const subName = subPath.split('/').pop() || subPath;
      const subCount = dirFileCounts[subPath] || 1;
      const subNodeId = `dir-${subPath.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

      if (!addedNodeIds.has(subNodeId)) {
        nodes.push({
          id: subNodeId,
          label: subPath,
          type: 'module',
          description: `Submodule '${subName}' (${subCount} files)`,
          filePaths: [subPath],
          issueCount: 0,
          issues: [],
        });
        addedNodeIds.add(subNodeId);

        edges.push({
          id: `e-${nodeId}-${subNodeId}`,
          source: nodeId,
          target: subNodeId,
          label: 'contains',
          relationType: 'imports',
        });
      }
    });
  });

  // 3. Add Key Entry Point File Nodes
  entryPoints.slice(0, 3).forEach((epPath, idx) => {
    const epName = epPath.split('/').pop() || epPath;
    const epNodeId = `ep-${idx}-${epName.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

    if (!addedNodeIds.has(epNodeId)) {
      nodes.push({
        id: epNodeId,
        label: epName,
        type: 'module',
        description: `Verified entry point (${epPath})`,
        filePaths: [epPath],
        issueCount: 0,
        issues: [],
      });
      addedNodeIds.add(epNodeId);

      const epParentDir = epPath.split('/').slice(0, -1).join('/');
      const parentNode = nodes.find((n) => n.id.endsWith(epParentDir.replace(/[^a-zA-Z0-9_-]/g, '-')));

      const sourceId = parentNode ? parentNode.id : rootId;
      edges.push({
        id: `e-${sourceId}-${epNodeId}`,
        source: sourceId,
        target: epNodeId,
        label: 'entry point',
        relationType: 'calls',
      });
    }
  });

  // 4. Add Database Service Node
  if (techStack.includes('Prisma') || techStack.includes('PostgreSQL') || techStack.includes('Redis') || techStack.includes('MongoDB')) {
    const dbNodeId = 'db-service';
    if (!addedNodeIds.has(dbNodeId)) {
      nodes.push({
        id: dbNodeId,
        label: 'Database / Storage',
        type: 'database',
        description: `Inferred storage layer (${techStack.filter(t => ['Prisma', 'PostgreSQL', 'Redis', 'MongoDB'].includes(t)).join(', ')})`,
        issueCount: 0,
        issues: [],
      });
      addedNodeIds.add(dbNodeId);

      const serviceNode = nodes.find((n) => n.type === 'service') || nodes[0];
      edges.push({
        id: `e-${serviceNode.id}-${dbNodeId}`,
        source: serviceNode.id,
        target: dbNodeId,
        label: 'persists to',
        relationType: 'data_flow',
      });
    }
  }

  // 5. Map Issues to Architecture Nodes based on relatedPaths
  issues.forEach((issue) => {
    if (!issue.relatedPaths || issue.relatedPaths.length === 0) return;

    issue.relatedPaths.forEach((relatedPath) => {
      // Find matching node whose filePaths matches or is a prefix of relatedPath
      const targetNode = nodes.find((n) => {
        if (!n.filePaths) return false;
        return n.filePaths.some(
          (fp) => relatedPath === fp || relatedPath.startsWith(`${fp}/`) || fp.includes(relatedPath)
        );
      });

      if (targetNode) {
        targetNode.issueCount = (targetNode.issueCount || 0) + 1;
        if (!targetNode.issues) targetNode.issues = [];
        if (!targetNode.issues.includes(issue.number)) {
          targetNode.issues.push(issue.number);
        }
      } else {
        // Fallback: Increment root issue count
        const rootNode = nodes.find((n) => n.id === rootId);
        if (rootNode) {
          rootNode.issueCount = (rootNode.issueCount || 0) + 1;
          if (!rootNode.issues) rootNode.issues = [];
          if (!rootNode.issues.includes(issue.number)) {
            rootNode.issues.push(issue.number);
          }
        }
      }
    });
  });

  return { nodes, edges };
}
