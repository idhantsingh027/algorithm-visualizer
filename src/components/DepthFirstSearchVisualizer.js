import React, { useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const DFS_CODE = {
  python: [
    { line: 1, code: 'def dfs(adj, src):' },
    { line: 2, code: '    n = len(adj)' },
    { line: 3, code: '    visited = [False] * n' },
    { line: 4, code: '    stack = []' },
    { line: 5, code: '    order = []' },
    { line: 6, code: '    visited[src] = True' },
    { line: 7, code: '    stack.append(src)' },
    { line: 8, code: '    while stack:' },
    { line: 9, code: '        v = stack.pop()' },
    { line: 10, code: '        order.append(v)' },
    { line: 11, code: '        for nei in reversed(adj[v]):' },
    { line: 12, code: '            if not visited[nei]:' },
    { line: 13, code: '                visited[nei] = True' },
    { line: 14, code: '                stack.append(nei)' },
    { line: 15, code: '    return order' }
  ],
  c: [
    { line: 1, code: 'void dfs(int n, int adj[][MAX], int deg[], int src, int out[], int* outLen)' },
    { line: 2, code: '{' },
    { line: 3, code: '    int visited[MAX];' },
    { line: 4, code: '    for (int i = 0; i < n; i++)' },
    { line: 5, code: '    {' },
    { line: 6, code: '        visited[i] = 0;' },
    { line: 7, code: '    }' },
    { line: 8, code: '    int st[MAX];' },
    { line: 9, code: '    int top = 0;' },
    { line: 10, code: '    *outLen = 0;' },
    { line: 11, code: '    visited[src] = 1;' },
    { line: 12, code: '    st[top++] = src;' },
    { line: 13, code: '    while (top > 0)' },
    { line: 14, code: '    {' },
    { line: 15, code: '        int v = st[--top];' },
    { line: 16, code: '        out[(*outLen)++] = v;' },
    { line: 17, code: '        for (int k = deg[v] - 1; k >= 0; k--)' },
    { line: 18, code: '        {' },
    { line: 19, code: '            int nei = adj[v][k];' },
    { line: 20, code: '            if (!visited[nei])' },
    { line: 21, code: '            {' },
    { line: 22, code: '                visited[nei] = 1;' },
    { line: 23, code: '                st[top++] = nei;' },
    { line: 24, code: '            }' },
    { line: 25, code: '        }' },
    { line: 26, code: '    }' },
    { line: 27, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'std::vector<int> dfs(const std::vector<std::vector<int>>& adj, int src)' },
    { line: 2, code: '{' },
    { line: 3, code: '    int n = (int)adj.size();' },
    { line: 4, code: '    std::vector<int> visited(n, 0);' },
    { line: 5, code: '    std::vector<int> st;' },
    { line: 6, code: '    std::vector<int> order;' },
    { line: 7, code: '    visited[src] = 1;' },
    { line: 8, code: '    st.push_back(src);' },
    { line: 9, code: '    while (!st.empty())' },
    { line: 10, code: '    {' },
    { line: 11, code: '        int v = st.back();' },
    { line: 12, code: '        st.pop_back();' },
    { line: 13, code: '        order.push_back(v);' },
    { line: 14, code: '        for (int i = (int)adj[v].size() - 1; i >= 0; i--)' },
    { line: 15, code: '        {' },
    { line: 16, code: '            int nei = adj[v][i];' },
    { line: 17, code: '            if (!visited[nei])' },
    { line: 18, code: '            {' },
    { line: 19, code: '                visited[nei] = 1;' },
    { line: 20, code: '                st.push_back(nei);' },
    { line: 21, code: '            }' },
    { line: 22, code: '        }' },
    { line: 23, code: '    }' },
    { line: 24, code: '    return order;' },
    { line: 25, code: '}' }
  ]
};

const LINE_MAP = {
  python: {
    initVisited: 3,
    initStack: 4,
    initOrder: 5,
    markVisitedSrc: 6,
    pushSrc: 7,
    whileCond: 8,
    pop: 9,
    outputAppend: 10,
    forNeighbors: 11,
    readNeighbor: 11,
    ifNotVisited: 12,
    markVisited: 13,
    pushNeighbor: 14,
    done: 15
  },
  c: {
    initVisited: 6,
    initStack: 8,
    initOrder: 10,
    markVisitedSrc: 11,
    pushSrc: 12,
    whileCond: 13,
    pop: 15,
    outputAppend: 16,
    forNeighbors: 17,
    readNeighbor: 19,
    ifNotVisited: 20,
    markVisited: 22,
    pushNeighbor: 23,
    done: 13
  },
  cpp: {
    initVisited: 4,
    initStack: 5,
    initOrder: 6,
    markVisitedSrc: 7,
    pushSrc: 8,
    whileCond: 9,
    pop: 12,
    outputAppend: 13,
    forNeighbors: 14,
    readNeighbor: 16,
    ifNotVisited: 17,
    markVisited: 19,
    pushNeighbor: 20,
    done: 24
  }
};

const DEFAULT_GRAPH = {
  nodeCount: 8,
  adjacency: {
    0: [1, 2, 3],
    1: [4, 5],
    2: [6],
    3: [7],
    4: [],
    5: [],
    6: [],
    7: []
  }
};

function formatAdjacencyText(adjacency, nodeCount) {
  const lines = [];
  for (let i = 0; i < nodeCount; i++) {
    const neighbors = adjacency[i] ?? [];
    lines.push(`${i}: ${neighbors.join(', ')}`);
  }
  return lines.join('\n');
}

function parseAdjacencyText(text) {
  const rawLines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (rawLines.length === 0) {
    throw new Error('Please enter an adjacency list.');
  }

  const adjacency = new Map();
  let maxNode = -1;

  for (const line of rawLines) {
    const cleaned = line.replace(/(#|\/\/).*$/, '').trim();
    if (cleaned.length === 0) continue;

    let parts;
    if (cleaned.includes('->')) {
      parts = cleaned.split('->');
    } else {
      parts = cleaned.split(':');
    }

    if (parts.length !== 2) {
      throw new Error(`Invalid line: "${line}". Use "u: v1, v2" format.`);
    }

    const left = parts[0].trim();
    const right = parts[1].trim();

    const u = Number(left);
    if (!Number.isInteger(u) || u < 0) {
      throw new Error(`Invalid node id: "${left}". Nodes must be non-negative integers.`);
    }

    maxNode = Math.max(maxNode, u);

    const neighbors = right.length === 0
      ? []
      : right
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => Number(s));

    const seen = new Set();
    const list = [];
    for (const v of neighbors) {
      if (!Number.isInteger(v) || v < 0) {
        throw new Error(`Invalid neighbor in line: "${line}". Neighbors must be non-negative integers.`);
      }
      maxNode = Math.max(maxNode, v);
      if (!seen.has(v)) {
        seen.add(v);
        list.push(v);
      }
    }

    adjacency.set(u, list);
  }

  if (maxNode < 0) {
    throw new Error('No nodes found.');
  }

  const nodeCount = maxNode + 1;
  if (nodeCount > 25) {
    throw new Error('Too many nodes. Please use 25 or fewer nodes.');
  }

  const normalized = {};
  for (let i = 0; i < nodeCount; i++) {
    const list = adjacency.get(i) ?? [];
    normalized[i] = list.filter(v => v >= 0 && v < nodeCount);
  }

  return { nodeCount, adjacency: normalized };
}

function computeDfsStructure(adjacency, nodeCount, source) {
  const src = Number(source);
  const depth = Array.from({ length: nodeCount }, () => -1);
  const parent = Array.from({ length: nodeCount }, () => null);
  const visited = Array.from({ length: nodeCount }, () => false);
  const st = [];

  if (Number.isInteger(src) && src >= 0 && src < nodeCount) {
    depth[src] = 0;
    parent[src] = null;
    visited[src] = true;
    st.push(src);
  }

  while (st.length > 0) {
    const v = st.pop();
    const neighbors = adjacency[v] ?? [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const nei = neighbors[i];
      if (nei < 0 || nei >= nodeCount) continue;
      if (visited[nei]) continue;
      visited[nei] = true;
      parent[nei] = v;
      depth[nei] = depth[v] + 1;
      st.push(nei);
    }
  }

  const maxDepth = Math.max(...depth);
  const layers = [];
  for (let d = 0; d <= maxDepth; d++) layers.push([]);
  const unreached = [];

  for (let i = 0; i < nodeCount; i++) {
    if (depth[i] === -1) unreached.push(i);
    else layers[depth[i]].push(i);
  }

  const layerLabels = layers.map((_, idx) => `Layer ${idx}`);
  if (unreached.length > 0) {
    layers.push(unreached);
    layerLabels.push('Unreached');
  }

  const treeEdges = [];
  for (let i = 0; i < nodeCount; i++) {
    const p = parent[i];
    if (p === null || p === undefined) continue;
    if (i === src) continue;
    treeEdges.push({ from: p, to: i });
  }

  return { layers, layerLabels, parent, treeEdges };
}

function buildDfsSteps(adjacency, source) {
  const steps = [];
  const visited = new Set();
  const processed = new Set();
  const stack = [];
  const order = [];

  const snapshot = (key, message, extra) => {
    steps.push({
      key,
      message,
      stack: [...stack],
      visited: new Set(visited),
      processed: new Set(processed),
      order: [...order],
      current: extra?.current ?? null,
      edge: extra?.edge ?? null
    });
  };

  snapshot('initVisited', 'Initialize visited[] to false.', { current: null });
  snapshot('initStack', 'Initialize stack.', { current: null });
  snapshot('initOrder', 'Initialize output order list.', { current: null });

  visited.add(source);
  snapshot('markVisitedSrc', `Mark ${source} as visited.`, { current: source });

  stack.push(source);
  snapshot('pushSrc', `Push source ${source} onto the stack.`, { current: source });

  snapshot('whileCond', 'While stack is not empty…', { current: null });

  while (stack.length > 0) {
    const v = stack[stack.length - 1];
    stack.pop();
    snapshot('pop', `Pop ${v}.`, { current: v });

    order.push(v);
    snapshot('outputAppend', `Visit ${v} (append to output).`, { current: v });

    const neighbors = adjacency[v] ?? [];
    if (neighbors.length > 0) {
      snapshot('forNeighbors', `Explore neighbors of ${v} (reverse order): ${[...neighbors].reverse().join(', ')}.`, { current: v });
    } else {
      snapshot('forNeighbors', `Explore neighbors of ${v}: (none).`, { current: v });
    }

    for (let i = neighbors.length - 1; i >= 0; i--) {
      const nei = neighbors[i];
      snapshot('readNeighbor', `Check edge ${v} → ${nei}.`, { current: v, edge: { from: v, to: nei } });

      if (!visited.has(nei)) {
        snapshot('ifNotVisited', `${nei} is not visited.`, { current: v, edge: { from: v, to: nei } });

        visited.add(nei);
        snapshot('markVisited', `Mark ${nei} as visited.`, { current: v, edge: { from: v, to: nei } });

        stack.push(nei);
        snapshot('pushNeighbor', `Push ${nei} onto the stack.`, { current: v, edge: { from: v, to: nei } });
      } else {
        snapshot('ifNotVisited', `${nei} is already visited (skip).`, { current: v, edge: { from: v, to: nei } });
      }
    }

    processed.add(v);
    snapshot('whileCond', 'Continue while stack is not empty…', { current: null });
  }

  snapshot('done', `Done. DFS order: ${order.join(', ')}.`, { current: null });
  return steps;
}

function getGraphLayout(layers, layerLabels, edgesInput) {
  const width = 1000;
  const paddingX = 110;
  const startY = 85;
  const levelGap = 150;

  const nodes = [];
  for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
    const layer = layers[layerIdx];
    const count = layer.length;
    for (let i = 0; i < count; i++) {
      const id = layer[i];
      const frac = (i + 0.5) / count;
      const x = paddingX + frac * (width - 2 * paddingX);
      const y = startY + layerIdx * levelGap;
      nodes.push({ id, x, y, layer: layerIdx });
    }
  }

  const nodeById = new Map(nodes.map(n0 => [n0.id, n0]));
  const edges = [];

  const edgesToUse = Array.isArray(edgesInput) ? edgesInput : [];
  for (const e of edgesToUse) {
    const fromNode = nodeById.get(e.from);
    const toNode = nodeById.get(e.to);
    if (!fromNode || !toNode) continue;
    edges.push({ from: e.from, to: e.to, fromNode, toNode });
  }

  const height = startY + (layers.length - 1) * levelGap + 90;

  const layerRects = layers.map((layer, idx) => {
    const layerNodes = layer.map(id => nodeById.get(id)).filter(Boolean);
    if (layerNodes.length === 0) return null;

    const minX = Math.min(...layerNodes.map(n0 => n0.x));
    const maxX = Math.max(...layerNodes.map(n0 => n0.x));
    const y = startY + idx * levelGap;
    const padX = 95;
    const padY = 54;

    return {
      idx,
      x: Math.max(10, minX - padX),
      y: Math.max(10, y - padY),
      w: Math.min(width - 20, (maxX - minX) + 2 * padX),
      h: 108,
      label: layerLabels?.[idx] ?? `Layer ${idx}`
    };
  }).filter(Boolean);

  return { width, height, nodes, edges, layerRects, nodeById };
}

function DepthFirstSearchVisualizer() {
  const [language, setLanguage] = useState('python');
  const [currentStepKey, setCurrentStepKey] = useState(null);

  const [graph, setGraph] = useState(DEFAULT_GRAPH);
  const [graphText, setGraphText] = useState(() => formatAdjacencyText(DEFAULT_GRAPH.adjacency, DEFAULT_GRAPH.nodeCount));
  const [graphError, setGraphError] = useState('');

  const [source, setSource] = useState(0);

  const [stack, setStack] = useState([]);
  const [order, setOrder] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [processed, setProcessed] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [log, setLog] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);

  const [speed, setSpeed] = useState(700);
  const speedRef = useRef(700);

  const runIdRef = useRef(0);

  const structure = useMemo(() => computeDfsStructure(graph.adjacency, graph.nodeCount, source), [graph, source]);
  const layout = useMemo(
    () => getGraphLayout(structure.layers, structure.layerLabels, structure.treeEdges),
    [structure]
  );
  const codeLines = DFS_CODE[language];
  const currentLine = useMemo(() => {
    if (!currentStepKey) return null;
    return LINE_MAP[language][currentStepKey] ?? null;
  }, [language, currentStepKey]);

  const reset = () => {
    runIdRef.current += 1;
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }

    setCurrentStepKey(null);
    setStack([]);
    setOrder([]);
    setVisited(new Set());
    setProcessed(new Set());
    setCurrent(null);
    setActiveEdge(null);
    setLog([]);
  };

  const pause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const resume = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
  };

  const waitIfPaused = async () => {
    if (!isPausedRef.current) return;
    await new Promise(resolve => {
      pausedResolve.current = resolve;
    });
  };

  const sleep = async (ms) => {
    await new Promise(resolve => setTimeout(resolve, ms));
  };

  const applyStep = (step) => {
    setCurrentStepKey(step.key);

    setStack(step.stack);
    setOrder(step.order);
    setVisited(step.visited);
    setProcessed(step.processed);
    setCurrent(step.current);
    setActiveEdge(step.edge);

    setLog(prev => {
      const next = [...prev, step.message];
      return next.length > 60 ? next.slice(next.length - 60) : next;
    });
  };

  const start = async () => {
    if (isRunning) return;

    reset();
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;

    const steps = buildDfsSteps(graph.adjacency, Number(source));

    for (let i = 0; i < steps.length; i++) {
      if (runIdRef.current !== runId) return;

      applyStep(steps[i]);

      await sleep(speedRef.current);
      await waitIfPaused();
    }

    setIsRunning(false);
    setIsPaused(false);
    setActiveEdge(null);
  };

  const getNodePhase = (id) => {
    if (current === id) return 'current';
    if (processed.has(id)) return 'visited';
    if (visited.has(id)) return 'discovered';
    return 'unvisited';
  };

  const isEdgeActive = (edge) => {
    if (!activeEdge) return false;
    return activeEdge.from === edge.from && activeEdge.to === edge.to;
  };

  const activeEdgeLine = useMemo(() => {
    if (!activeEdge) return null;
    const fromNode = layout.nodeById?.get(activeEdge.from);
    const toNode = layout.nodeById?.get(activeEdge.to);
    if (!fromNode || !toNode) return null;
    return { fromNode, toNode };
  }, [activeEdge, layout]);

  const applyGraphInput = () => {
    try {
      const parsed = parseAdjacencyText(graphText);
      setGraph(parsed);
      setGraphError('');

      reset();
      if (Number(source) < 0 || Number(source) >= parsed.nodeCount) {
        setSource(0);
      }
    } catch (e) {
      setGraphError(e?.message || 'Invalid graph input.');
    }
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">DEPTH FIRST SEARCH (DFS)</h1>
        <p className="algorithm-description">Traverse as deep as possible along each branch before backtracking, using a stack.</p>
        <div className="complexity-info">
          <div className="complexity-badge">Time: O(V + E)</div>
          <div className="complexity-badge">Space: O(V)</div>
          <div className="complexity-badge">DS: stack</div>
        </div>
      </div>

      <div className="visualizer-content">
        <div className="code-section">
          <div className="code-header">
            <div className="language-tabs">
              <button
                className={`language-tab ${language === 'python' ? 'active' : ''}`}
                onClick={() => setLanguage('python')}
              >
                PYTHON
              </button>
              <button
                className={`language-tab ${language === 'c' ? 'active' : ''}`}
                onClick={() => setLanguage('c')}
              >
                C
              </button>
              <button
                className={`language-tab ${language === 'cpp' ? 'active' : ''}`}
                onClick={() => setLanguage('cpp')}
              >
                C++
              </button>
            </div>
          </div>

          <div className="code-display">
            {codeLines.map(({ line, code }) => (
              <div key={line} className={`code-line ${currentLine === line ? 'highlighted' : ''}`}>
                <span className="line-number">{String(line).padStart(2, '0')}</span>
                <span className="line-code">{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="visualization-section">
          <div className="controls">
            <div className="control-group">
              <label className="control-label" htmlFor="dfs-graph">Graph (Adjacency List)</label>
              <div className="input-group" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <textarea
                  id="dfs-graph"
                  className="array-input dfs-textarea"
                  value={graphText}
                  onChange={(e) => setGraphText(e.target.value)}
                  disabled={isRunning}
                  placeholder={'Example:\n0: 1, 2, 3\n1: 4, 5\n2: 6\n3: 7\n4:\n5:\n6:\n7:'}
                />
                <div className="controls-row" style={{ justifyContent: 'flex-start' }}>
                  <button onClick={applyGraphInput} disabled={isRunning} className="control-btn">Apply Graph</button>
                </div>
              </div>
              {graphError && <div className="error-message">{graphError}</div>}
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="dfs-source">Source Node</label>
              <div className="input-group">
                <select
                  id="dfs-source"
                  className="select-input"
                  value={source}
                  onChange={(e) => setSource(Number(e.target.value))}
                  disabled={isRunning}
                >
                  {Array.from({ length: graph.nodeCount }, (_, i) => i).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <button onClick={start} disabled={isRunning} className="control-btn primary">Run</button>
                <button onClick={reset} disabled={isRunning && !isPaused} className="control-btn">Reset</button>
              </div>
            </div>

            <div className="control-group">
              <div className="controls-row">
                <button onClick={pause} disabled={!isRunning || isPaused} className="control-btn">Pause</button>
                <button onClick={resume} disabled={!isRunning || !isPaused} className="control-btn">Resume</button>
              </div>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label className="control-label" htmlFor="dfs-speed">Speed</label>
                <span className="control-value">{speed}ms</span>
              </div>
              <input
                id="dfs-speed"
                className="slider"
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setSpeed(s);
                  speedRef.current = s;
                }}
              />
              <div className="slider-labels"><span>Fast</span><span>Slow</span></div>
            </div>

            <div className="dfs-summary">
              <div className="dfs-summary-row">
                <div className="dfs-summary-label">Stack</div>
                <div className="dfs-summary-value">
                  {stack.length === 0 ? '—' : stack.map((v, idx) => (
                    <span key={`${v}-${idx}`} className={`dfs-chip ${idx === stack.length - 1 ? 'top' : ''}`}>{v}</span>
                  ))}
                </div>
              </div>
              <div className="dfs-summary-row">
                <div className="dfs-summary-label">Output</div>
                <div className="dfs-summary-value dfs-output">{order.length === 0 ? '—' : order.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="tree-visualization dfs-graph">
            <h3 className="tree-title">DFS Layers</h3>
            <div className="tree-container" style={{ height: `${layout.height}px` }}>
              <svg
                className="dfs-connectors"
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker id="dfsArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.45)" />
                  </marker>
                </defs>

                {layout.layerRects.map((r) => (
                  <g key={`layer-${r.idx}`}>
                    <rect
                      x={r.x}
                      y={r.y}
                      width={r.w}
                      height={r.h}
                      rx={14}
                      ry={14}
                      className="dfs-layer-rect"
                    />
                    <text
                      x={r.x + 14}
                      y={r.y + 22}
                      className="dfs-layer-label"
                    >
                      {r.label}
                    </text>
                  </g>
                ))}

                {layout.edges.map((edge) => (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={edge.fromNode.x}
                    y1={edge.fromNode.y + 28}
                    x2={edge.toNode.x}
                    y2={edge.toNode.y - 28}
                    className={`dfs-edge ${isEdgeActive(edge) ? 'active' : ''}`}
                    markerEnd="url(#dfsArrow)"
                  />
                ))}

                {activeEdgeLine && (
                  <line
                    key={`active-${activeEdge.from}-${activeEdge.to}`}
                    x1={activeEdgeLine.fromNode.x}
                    y1={activeEdgeLine.fromNode.y + 28}
                    x2={activeEdgeLine.toNode.x}
                    y2={activeEdgeLine.toNode.y - 28}
                    className="dfs-edge active"
                    markerEnd="url(#dfsArrow)"
                  />
                )}
              </svg>

              {layout.nodes.map((node) => (
                <div
                  key={node.id}
                  className="tree-node-wrapper dfs-node"
                  style={{ left: `${(node.x / layout.width) * 100}%`, top: `${node.y}px` }}
                >
                  <div className={`tree-node ${getNodePhase(node.id)}`}>
                    <div className="node-values">
                      <span className="node-value">{node.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dfs-area">
            <div className="dfs-col">
              <div className="dfs-title">Step Log</div>
              <br />
              <div className="dfs-log">
                {log.length === 0 ? (
                  <div className="stackviz-empty">(no steps yet)</div>
                ) : (
                  log.map((line, idx) => (
                    <div key={idx} className="stackviz-log-line">{line}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepthFirstSearchVisualizer;
