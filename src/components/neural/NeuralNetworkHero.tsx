'use client';

import { useState } from 'react';

interface Node {
  id: string;
  label: string;
  type: 'repository' | 'package' | 'module' | 'file';
  cx: number;
  cy: number;
  r: number;
  cluster: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  highlighted?: boolean;
}

// Conceptual repository architecture node network graph
const INITIAL_NODES: Node[] = [
  // Central Repository Core
  { id: 'repo-root', label: 'repository', type: 'repository', cx: 50, cy: 50, r: 12, cluster: 'core' },

  // Primary Architecture Clusters (Packages & Services)
  { id: 'core-pkg', label: 'core', type: 'package', cx: 32, cy: 35, r: 9, cluster: 'core' },
  { id: 'api-pkg', label: 'api', type: 'package', cx: 68, cy: 32, r: 9, cluster: 'api' },
  { id: 'ui-pkg', label: 'ui', type: 'package', cx: 48, cy: 75, r: 9, cluster: 'ui' },
  { id: 'db-pkg', label: 'db', type: 'package', cx: 22, cy: 65, r: 8, cluster: 'core' },

  // Modules & Services
  { id: 'auth-mod', label: 'auth/jwt', type: 'module', cx: 18, cy: 22, r: 6, cluster: 'core' },
  { id: 'config-mod', label: 'config/env', type: 'module', cx: 38, cy: 18, r: 5, cluster: 'core' },
  { id: 'router-mod', label: 'api/router', type: 'module', cx: 80, cy: 20, r: 6, cluster: 'api' },
  { id: 'ws-mod', label: 'api/websocket', type: 'module', cx: 85, cy: 45, r: 5, cluster: 'api' },
  { id: 'comp-mod', label: 'ui/components', type: 'module', cx: 35, cy: 88, r: 6, cluster: 'ui' },
  { id: 'hooks-mod', label: 'ui/hooks', type: 'module', cx: 62, cy: 85, r: 5, cluster: 'ui' },
  { id: 'prisma-mod', label: 'db/prisma', type: 'module', cx: 10, cy: 78, r: 6, cluster: 'core' },

  // Peripheral Edge Nodes (Extending off-screen to evoke depth)
  { id: 'token-file', label: 'auth/signer.ts', type: 'file', cx: 5, cy: 10, r: 4, cluster: 'core' },
  { id: 'cache-file', label: 'cache/redis.ts', type: 'file', cx: 94, cy: 62, r: 4, cluster: 'api' },
  { id: 'state-file', label: 'store/useBoard.ts', type: 'file', cx: 78, cy: 92, r: 4, cluster: 'ui' },
  { id: 'view-file', label: 'components/Canvas.tsx', type: 'file', cx: 20, cy: 95, r: 4, cluster: 'ui' },
  { id: 'grpc-file', label: 'net/grpc.go', type: 'file', cx: 96, cy: 12, r: 4, cluster: 'api' },
];

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'repo-root', target: 'core-pkg' },
  { id: 'e2', source: 'repo-root', target: 'api-pkg' },
  { id: 'e3', source: 'repo-root', target: 'ui-pkg' },
  { id: 'e4', source: 'core-pkg', target: 'auth-mod' },
  { id: 'e5', source: 'core-pkg', target: 'config-mod' },
  { id: 'e6', source: 'core-pkg', target: 'db-pkg' },
  { id: 'e7', source: 'api-pkg', target: 'router-mod' },
  { id: 'e8', source: 'api-pkg', target: 'ws-mod' },
  { id: 'e9', source: 'ui-pkg', target: 'comp-mod' },
  { id: 'e10', source: 'ui-pkg', target: 'hooks-mod' },
  { id: 'e11', source: 'db-pkg', target: 'prisma-mod' },
  { id: 'e12', source: 'auth-mod', target: 'token-file' },
  { id: 'e13', source: 'ws-mod', target: 'cache-file' },
  { id: 'e14', source: 'hooks-mod', target: 'state-file' },
  { id: 'e15', source: 'comp-mod', target: 'view-file' },
  { id: 'e16', source: 'router-mod', target: 'grpc-file' },
  { id: 'e17', source: 'auth-mod', target: 'router-mod' },
  { id: 'e18', source: 'prisma-mod', target: 'core-pkg' },
];

export default function NeuralNetworkHero() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Determine connected nodes and edges when a node is hovered
  const connectedNodeIds = new Set<string>();
  const connectedEdgeIds = new Set<string>();

  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    INITIAL_EDGES.forEach((edge) => {
      if (edge.source === hoveredNode || edge.target === hoveredNode) {
        connectedEdgeIds.add(edge.id);
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      }
    });
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* SVG Interactive Neural Canvas */}
      <svg
        className="w-full h-full pointer-events-auto"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Linear Gradients for Neural Connections */}
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
          </linearGradient>

          {/* Node Glow Filters */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Neural Connection Paths */}
        {INITIAL_EDGES.map((edge) => {
          const sourceNode = INITIAL_NODES.find((n) => n.id === edge.source);
          const targetNode = INITIAL_NODES.find((n) => n.id === edge.target);

          if (!sourceNode || !targetNode) return null;

          const isConnected = connectedEdgeIds.has(edge.id);
          const isDimmed = hoveredNode !== null && !isConnected;

          return (
            <g key={edge.id}>
              {/* Base Path */}
              <line
                x1={sourceNode.cx}
                y1={sourceNode.cy}
                x2={targetNode.cx}
                y2={targetNode.cy}
                stroke={isConnected ? 'url(#activeEdgeGradient)' : 'url(#edgeGradient)'}
                strokeWidth={isConnected ? 0.6 : 0.25}
                strokeDasharray={isConnected ? 'none' : '1, 1'}
                opacity={isDimmed ? 0.1 : isConnected ? 1 : 0.45}
                className="transition-all duration-300"
              />

              {/* Animated Data Pulse along the Path */}
              {!isDimmed && (
                <circle r="0.4" fill="#06B6D4" className="opacity-80">
                  <animateMotion
                    path={`M ${sourceNode.cx} ${sourceNode.cy} L ${targetNode.cx} ${targetNode.cy}`}
                    dur={`${3 + (edge.id.charCodeAt(1) % 4)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* 2. Neural Nodes */}
        {INITIAL_NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isConnected = connectedNodeIds.has(node.id);
          const isDimmed = hoveredNode !== null && !isConnected;

          const isRepoRoot = node.type === 'repository';
          const isPackage = node.type === 'package';

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-opacity duration-300"
              opacity={isDimmed ? 0.15 : 1}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulse Ring for Repo Core */}
              {isRepoRoot && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r * 1.6}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="0.2"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    values={`${node.r};${node.r * 2.2};${node.r}`}
                    dur="6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.05;0.4"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Node Outer Ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isHovered ? node.r * 1.3 : node.r}
                fill={isRepoRoot ? '#14171D' : isPackage ? '#0E1014' : '#08090B'}
                stroke={
                  isHovered
                    ? '#06B6D4'
                    : isRepoRoot
                    ? '#7C3AED'
                    : isPackage
                    ? '#8B5CF6'
                    : '#2A2F3A'
                }
                strokeWidth={isHovered ? 0.8 : isRepoRoot ? 0.6 : 0.3}
                filter={isHovered || isRepoRoot ? 'url(#nodeGlow)' : undefined}
                className="transition-all duration-300"
              />

              {/* Node Core Indicator */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 0.35}
                fill={
                  isHovered
                    ? '#06B6D4'
                    : isRepoRoot
                    ? '#7C3AED'
                    : isPackage
                    ? '#8B5CF6'
                    : '#5A606C'
                }
              />

              {/* Node Label (Visible on Hover or for Core Nodes) */}
              {(isHovered || isRepoRoot || isPackage) && (
                <text
                  x={node.cx}
                  y={node.cy + node.r + 3.5}
                  textAnchor="middle"
                  fill={isHovered ? '#06B6D4' : isRepoRoot ? '#E6E8EC' : '#8B929E'}
                  fontSize={isHovered ? '2.4' : '2.0'}
                  fontFamily="monospace"
                  fontWeight={isHovered || isRepoRoot ? 'bold' : 'normal'}
                  className="pointer-events-none transition-all duration-200"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
