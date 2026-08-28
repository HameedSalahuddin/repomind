'use client';

import { useState } from 'react';
import { ArchitectureGraph, ArchitectureNode } from '@/types';

interface ArchitectureViewProps {
  data: ArchitectureGraph;
}

export default function ArchitectureView({ data }: ArchitectureViewProps) {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(data.nodes[0] || null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Position nodes spatially across layers to form a clear neural tree map
  const getSpatialCoords = (node: ArchitectureNode, idx: number, total: number) => {
    if (node.type === 'package') return { cx: 20 + idx * 30, cy: 25 };
    if (node.type === 'service') return { cx: 25 + idx * 25, cy: 50 };
    if (node.type === 'database') return { cx: 30 + idx * 40, cy: 75 };
    return { cx: 15 + (idx % 4) * 22, cy: 30 + Math.floor(idx / 4) * 25 };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">Architecture Spatial Neural Map</h1>
          <p className="text-xs text-[#8B929E]">
            Spatial AI-assisted node map of packages, modules, and data flow relationships.
          </p>
        </div>
        <div className="text-xs font-mono text-[#5A606C] flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Package</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06B6D4]" /> Service</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B929E]" /> Database</span>
        </div>
      </div>

      {/* Main Workspace Layout (~75% Spatial Graph Canvas, ~25% Details Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
        {/* ~75% Spatial Neural Canvas */}
        <div className="lg:col-span-8 p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] flex flex-col justify-between relative overflow-hidden">
          <div className="text-[10px] font-mono text-[#5A606C] uppercase tracking-wider mb-2 flex justify-between">
            <span>Spatial Repository Graph</span>
            <span>Hover or click node to trace relationships</span>
          </div>

          {/* SVG Connection Graph Canvas */}
          <div className="relative flex-1 min-h-[380px] my-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="spatialEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="activeSpatialEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Render Edges */}
              {data.edges.map((edge) => {
                const sIdx = data.nodes.findIndex((n) => n.id === edge.source);
                const tIdx = data.nodes.findIndex((n) => n.id === edge.target);

                if (sIdx === -1 || tIdx === -1) return null;

                const sCoords = getSpatialCoords(data.nodes[sIdx], sIdx, data.nodes.length);
                const tCoords = getSpatialCoords(data.nodes[tIdx], tIdx, data.nodes.length);

                const isConnected =
                  hoveredNodeId === edge.source ||
                  hoveredNodeId === edge.target ||
                  selectedNode?.id === edge.source ||
                  selectedNode?.id === edge.target;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sCoords.cx}
                      y1={sCoords.cy}
                      x2={tCoords.cx}
                      y2={tCoords.cy}
                      stroke={isConnected ? 'url(#activeSpatialEdge)' : 'url(#spatialEdge)'}
                      strokeWidth={isConnected ? 0.8 : 0.3}
                      strokeDasharray={isConnected ? 'none' : '1, 1'}
                      opacity={isConnected ? 1 : 0.4}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* Render Nodes */}
              {data.nodes.map((node, idx) => {
                const coords = getSpatialCoords(node, idx, data.nodes.length);
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNodeId === node.id;

                const isPkg = node.type === 'package';
                const isSvc = node.type === 'service';

                const radius = isPkg ? 5 : isSvc ? 4 : 3.5;
                const strokeColor = isSelected ? '#06B6D4' : isPkg ? '#7C3AED' : isSvc ? '#06B6D4' : '#5A606C';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Node Circle */}
                    <circle
                      cx={coords.cx}
                      cy={coords.cy}
                      r={isHovered || isSelected ? radius * 1.3 : radius}
                      fill={isSelected ? '#14171D' : '#08090B'}
                      stroke={strokeColor}
                      strokeWidth={isSelected || isHovered ? 0.8 : 0.4}
                      className="transition-all duration-200"
                    />
                    <circle
                      cx={coords.cx}
                      cy={coords.cy}
                      r={radius * 0.35}
                      fill={strokeColor}
                    />

                    {/* Node Text Label */}
                    <text
                      x={coords.cx}
                      y={coords.cy + radius + 3.5}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#E6E8EC' : '#8B929E'}
                      fontSize="2.2"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none pointer-events-none transition-colors"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-3 border-t border-[#1E222A] flex justify-between items-center text-xs font-mono text-[#5A606C]">
            <span>Click any node to open inspector panel</span>
            <span className="text-[#8B5CF6]">Active Neural Topology</span>
          </div>
        </div>

        {/* ~25% Contextual Inspector Panel */}
        <div className="lg:col-span-4 p-6 rounded-lg bg-[#0E1014] border border-[#1E222A] flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#1E222A] space-y-1">
                <span className="text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider">
                  Node Inspector
                </span>
                <h3 className="font-bold text-sm text-[#E6E8EC]">{selectedNode.label}</h3>
                <span className="inline-block text-[10px] font-mono text-[#8B929E] bg-[#14171D] px-2 py-0.5 rounded border border-[#1E222A]">
                  Semantic Depth: {selectedNode.type}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#5A606C] uppercase tracking-wider block">
                  Module Description
                </span>
                <p className="text-xs text-[#8B929E] leading-relaxed">
                  {selectedNode.description || 'Module boundary verified via static dependency parsing.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E222A] space-y-2">
                <span className="text-[11px] font-mono text-[#5A606C] uppercase tracking-wider block">
                  Active Connections
                </span>
                <div className="space-y-1.5 font-mono text-xs text-[#8B929E]">
                  {data.edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => (
                      <div key={edge.id} className="p-2 rounded bg-[#14171D] border border-[#1E222A] flex justify-between items-center">
                        <span>{edge.source === selectedNode.id ? `→ ${edge.target}` : `← ${edge.source}`}</span>
                        <span className="text-[10px] text-[#06B6D4]">{edge.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#5A606C] font-mono my-auto text-center">
              Select a node on the neural map to inspect relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
