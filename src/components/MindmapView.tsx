'use client';
import { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  type NodeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

type MindNode = { label: string; children?: MindNode[] };

// 节点配色:根/一级/二级/三级 共 4 套
const NODE_COLORS = [
  { bg: '#10b981', text: '#fff', border: '#047857', shadow: '0 4px 12px rgba(16,185,129,0.4)' },  // 根:深绿
  { bg: '#3b82f6', text: '#fff', border: '#1d4ed8', shadow: '0 2px 8px rgba(59,130,246,0.3)' },  // 一级:蓝
  { bg: '#fbbf24', text: '#7c2d12', border: '#d97706', shadow: '0 2px 6px rgba(251,191,36,0.3)' }, // 二级:金
  { bg: '#e0e7ff', text: '#1e1b4b', border: '#a5b4fc', shadow: '0 1px 4px rgba(165,180,252,0.2)' }  // 三级:浅紫
];

function MindNodeView({ data }: NodeProps) {
  const depth = Math.min((data as any).depth as number, NODE_COLORS.length - 1);
  const c = NODE_COLORS[depth];
  const isRoot = depth === 0;
  const isLevel1 = depth === 1;
  return (
    <div
      style={{
        background: c.bg,
        color: c.text,
        border: `2px solid ${c.border}`,
        borderRadius: isRoot ? 16 : isLevel1 ? 12 : 8,
        padding: isRoot ? '12px 24px' : isLevel1 ? '8px 16px' : '6px 12px',
        fontSize: isRoot ? 18 : isLevel1 ? 14 : 12,
        fontWeight: isRoot ? 700 : isLevel1 ? 600 : 400,
        whiteSpace: 'nowrap',
        boxShadow: c.shadow,
        cursor: 'grab',
        textAlign: 'center'
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: c.border, width: 4, height: 4, opacity: 0.5 }} />
      {(data as any).label}
      <Handle type="source" position={Position.Right} style={{ background: c.border, width: 4, height: 4, opacity: 0.5 }} />
    </div>
  );
}

const nodeTypes = { mind: MindNodeView };

// dagre 自动布局:从左到右(LR),给每节点固定尺寸让它撑开间距
function layoutWithDagre(root: MindNode) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 30, ranksep: 80, edgesep: 10, marginx: 30, marginy: 30 });
  g.setDefaultEdgeLabel(() => ({}));

  // 估节点尺寸(按 depth 不同)
  const nodeSize = (depth: number) => {
    if (depth === 0) return { width: 180, height: 56 };
    if (depth === 1) return { width: 140, height: 40 };
    return { width: 110, height: 32 };
  };

  let id = 0;
  const allNodes: { id: string; label: string; depth: number }[] = [];
  const allEdges: { source: string; target: string }[] = [];

  function walk(node: MindNode, depth: number, parentId?: string) {
    const myId = `n${id++}`;
    allNodes.push({ id: myId, label: node.label, depth });
    const { width, height } = nodeSize(depth);
    g.setNode(myId, { width, height });
    if (parentId) {
      allEdges.push({ source: parentId, target: myId });
      g.setEdge(parentId, myId);
    }
    (node.children || []).forEach(c => walk(c, depth + 1, myId));
  }
  walk(root, 0);

  dagre.layout(g);

  const rfNodes = allNodes.map(n => {
    const pos = g.node(n.id);
    const { width, height } = nodeSize(n.depth);
    return {
      id: n.id,
      type: 'mind',
      position: { x: pos.x - width / 2, y: pos.y - height / 2 },
      data: { label: n.label, depth: n.depth }
    };
  });
  const rfEdges = allEdges.map((e, i) => ({
    id: `e${i}`,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    style: { stroke: '#94a3b8', strokeWidth: 1.5, opacity: 0.7 }
  }));
  return { rfNodes, rfEdges };
}

function MindmapInner({ data }: { data: MindNode }) {
  const { fitView } = useReactFlow();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { rfNodes, rfEdges, stats } = useMemo(() => {
    // 折叠处理
    function filter(node: MindNode, parentCollapsed: boolean): MindNode | null {
      if (parentCollapsed) return null;
      const isCollapsed = collapsed[node.label];
      const children = node.children?.map(c => filter(c, isCollapsed)).filter(Boolean) as MindNode[] | undefined;
      return { label: node.label, children: children && children.length > 0 ? children : undefined };
    }
    const filtered = filter(data, false)!;
    const { rfNodes, rfEdges } = layoutWithDagre(filtered);
    const count = (n: MindNode): number => 1 + (n.children || []).reduce((s, c) => s + count(c), 0);
    return { rfNodes, rfEdges, stats: { count: count(filtered) } };
  }, [data, collapsed]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);
  useEffect(() => { setNodes(rfNodes); }, [rfNodes, setNodes]);

  const onInit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 150);
  }, [fitView]);

  const toggleCollapse = useCallback((label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  }, []);

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 180px)', minHeight: 500 }}>
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-md text-sm text-gray-700 flex items-center gap-3">
        <span className="font-semibold">📊 {stats.count} 个节点</span>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-500">点击节点收起/展开 · 拖拽移动 · 滚轮缩放</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        onNodeClick={(_, node) => {
          const lbl = (node.data as any)?.label;
          if (lbl) toggleCollapse(lbl);
        }}
        fitView
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#d1d5db" />
        <Controls position="bottom-right" />
        <MiniMap position="bottom-left" pannable zoomable nodeColor={(n) => {
          const d = (n.data as any)?.depth ?? 0;
          return NODE_COLORS[Math.min(d, NODE_COLORS.length - 1)].border;
        }} maskColor="rgba(0,0,0,0.05)" />
      </ReactFlow>
    </div>
  );
}

export default function MindmapView({ data }: { data: MindNode }) {
  return (
    <ReactFlowProvider>
      <MindmapInner data={data} />
    </ReactFlowProvider>
  );
}
