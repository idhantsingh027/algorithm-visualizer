import React, { useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const BFS_CODE = {
  python: [
    { line: 1, code: 'from collections import deque' },
    { line: 2, code: '' },
    { line: 3, code: 'def bfs(adj, src):' },
    { line: 4, code: '    n = len(adj)' },
    { line: 5, code: '    visited = [False] * n' },
    { line: 6, code: '    q = deque()' },
    { line: 7, code: '    order = []' },
    { line: 8, code: '    visited[src] = True' },
    { line: 9, code: '    q.append(src)' },
    { line: 10, code: '    while q:' },
    { line: 11, code: '        v = q.popleft()' },
    { line: 12, code: '        order.append(v)' },
    { line: 13, code: '        for nei in adj[v]:' },
    { line: 14, code: '            if not visited[nei]:' },
    { line: 15, code: '                visited[nei] = True' },
    { line: 16, code: '                q.append(nei)' },
    { line: 17, code: '    return order' }
  ],
  c: [
    { line: 1, code: 'void bfs(int n, int adj[][MAX], int deg[], int src, int out[], int* outLen)' },
    { line: 2, code: '{' },
    { line: 3, code: '    int visited[MAX];' },
    { line: 4, code: '    for (int i = 0; i < n; i++)' },
    { line: 5, code: '    {' },
    { line: 6, code: '        visited[i] = 0;' },
    { line: 7, code: '    }' },
    { line: 8, code: '    int q[MAX];' },
    { line: 9, code: '    int front = 0;' },
    { line: 10, code: '    int back = 0;' },
    { line: 11, code: '    *outLen = 0;' },
    { line: 12, code: '    visited[src] = 1;' },
    { line: 13, code: '    q[back++] = src;' },
    { line: 14, code: '    while (front < back)' },
    { line: 15, code: '    {' },
    { line: 16, code: '        int v = q[front++];' },
    { line: 17, code: '        out[(*outLen)++] = v;' },
    { line: 18, code: '        for (int k = 0; k < deg[v]; k++)' },
    { line: 19, code: '        {' },
    { line: 20, code: '            int nei = adj[v][k];' },
    { line: 21, code: '            if (!visited[nei])' },
    { line: 22, code: '            {' },
    { line: 23, code: '                visited[nei] = 1;' },
    { line: 24, code: '                q[back++] = nei;' },
    { line: 25, code: '            }' },
    { line: 26, code: '        }' },
    { line: 27, code: '    }' },
    { line: 28, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'std::vector<int> bfs(const std::vector<std::vector<int>>& adj, int src)' },
    { line: 2, code: '{' },
    { line: 3, code: '    int n = (int)adj.size();' },
    { line: 4, code: '    std::vector<int> visited(n, 0);' },
    { line: 5, code: '    std::queue<int> q;' },
    { line: 6, code: '    std::vector<int> order;' },
    { line: 7, code: '    visited[src] = 1;' },
    { line: 8, code: '    q.push(src);' },
    { line: 9, code: '    while (!q.empty())' },
    { line: 10, code: '    {' },
    { line: 11, code: '        int v = q.front();' },
    { line: 12, code: '        q.pop();' },
    { line: 13, code: '        order.push_back(v);' },
    { line: 14, code: '        for (int nei : adj[v])' },
    { line: 15, code: '        {' },
    { line: 16, code: '            if (!visited[nei])' },
    { line: 17, code: '            {' },
    { line: 18, code: '                visited[nei] = 1;' },
    { line: 19, code: '                q.push(nei);' },
    { line: 20, code: '            }' },
    { line: 21, code: '        }' },
    { line: 22, code: '    }' },
    { line: 23, code: '    return order;' },
    { line: 24, code: '}' }
  ]
};

const LINE_MAP = {
  python: {
    initVisited: 5,
    initQueue: 6,
    initOrder: 7,
    markVisitedSrc: 8,
    enqueueSrc: 9,
    whileCond: 10,
    dequeue: 11,
    outputAppend: 12,
    forNeighbors: 13,
    readNeighbor: 13,
    ifNotVisited: 14,
    markVisited: 15,
    enqueueNeighbor: 16,
    done: 17
  },
  c: {
    initVisited: 6,
    initQueue: 8,
    initOrder: 11,
    markVisitedSrc: 12,
    enqueueSrc: 13,
    whileCond: 14,
    dequeue: 16,
    outputAppend: 17,
    forNeighbors: 18,
    readNeighbor: 20,
    ifNotVisited: 21,
    markVisited: 23,
    enqueueNeighbor: 24,
    done: 14
  },
  cpp: {
    initVisited: 4,
    initQueue: 5,
    initOrder: 6,
    markVisitedSrc: 7,
    enqueueSrc: 8,
    whileCond: 9,
    dequeue: 12,
    outputAppend: 13,
    forNeighbors: 14,
    readNeighbor: 14,
    ifNotVisited: 16,
    markVisited: 18,
    enqueueNeighbor: 19,
    done: 23
  }
};

const DEFAULT_GRAPH = {
  nodeCount: 8,
  adjacency: {
    0: [1, 2, 3],
    1: [4, 5],
    2: [5, 6],
    3: [6, 7],
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

function computeBfsStructure(adjacency, nodeCount, source) {
  const src = Number(source);
  const dist = Array.from({ length: nodeCount }, () => -1);
  const parent = Array.from({ length: nodeCount }, () => null);
  const q = [];

  if (Number.isInteger(src) && src >= 0 && src < nodeCount) {
    dist[src] = 0;
    parent[src] = null;
    q.push(src);
  }

  while (q.length > 0) {
    const v = q.shift();
    const neighbors = adjacency[v] ?? [];
    for (const nei of neighbors) {
      if (nei < 0 || nei >= nodeCount) continue;
      if (dist[nei] !== -1) continue;
      dist[nei] = dist[v] + 1;
      parent[nei] = v;
      q.push(nei);
    }
  }

  const maxDist = Math.max(...dist);
  const layers = [];
  for (let d = 0; d <= maxDist; d++) layers.push([]);
  const unreached = [];

  for (let i = 0; i < nodeCount; i++) {
    if (dist[i] === -1) unreached.push(i);
    else layers[dist[i]].push(i);
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

function buildBfsSteps(adjacency, source) {
  const steps = [];
  const visited = new Set();
  const processed = new Set();
  const queue = [];
  const order = [];

  const snapshot = (key, message, extra) => {
    steps.push({
      key,
      message,
      queue: [...queue],
      visited: new Set(visited),
      processed: new Set(processed),
      order: [...order],
      current: extra?.current ?? null,
      edge: extra?.edge ?? null
    });
  };

  snapshot('initVisited', 'Initialize visited[] to false.', { current: null });
  snapshot('initQueue', 'Initialize queue.', { current: null });
  snapshot('initOrder', 'Initialize output order list.', { current: null });

  visited.add(source);
  snapshot('markVisitedSrc', `Mark ${source} as visited.`, { current: source });

  queue.push(source);
  snapshot('enqueueSrc', `Enqueue source ${source}.`, { current: source });

  snapshot('whileCond', 'While queue is not empty…', { current: null });

  while (queue.length > 0) {
    const v = queue.shift();
    snapshot('dequeue', `Dequeue ${v}.`, { current: v });

    order.push(v);
    snapshot('outputAppend', `Visit ${v} (append to output).`, { current: v });

    const neighbors = adjacency[v] ?? [];
    if (neighbors.length > 0) {
      snapshot('forNeighbors', `Explore neighbors of ${v}: ${neighbors.join(', ')}.`, { current: v });
    } else {
      snapshot('forNeighbors', `Explore neighbors of ${v}: (none).`, { current: v });
    }

    for (const nei of neighbors) {
      snapshot('readNeighbor', `Check edge ${v} → ${nei}.`, { current: v, edge: { from: v, to: nei } });

      if (!visited.has(nei)) {
        snapshot('ifNotVisited', `${nei} is not visited.`, { current: v, edge: { from: v, to: nei } });

        visited.add(nei);
        snapshot('markVisited', `Mark ${nei} as visited.`, { current: v, edge: { from: v, to: nei } });

        queue.push(nei);
        snapshot('enqueueNeighbor', `Enqueue ${nei}.`, { current: v, edge: { from: v, to: nei } });
      } else {
        snapshot('ifNotVisited', `${nei} is already visited (skip).`, { current: v, edge: { from: v, to: nei } });
      }
    }

    processed.add(v);
    snapshot('whileCond', 'Continue while queue is not empty…', { current: null });
  }

  snapshot('done', `Done. BFS order: ${order.join(', ')}.`, { current: null });
  return steps;
}

function getGraphLayout(adjacency, layers, layerLabels, edgesInput) {
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

function BreadthFirstSearchVisualizer() {
  const [language, setLanguage] = useState('python');
  const [currentStepKey, setCurrentStepKey] = useState(null);

  const [graph, setGraph] = useState(DEFAULT_GRAPH);
  const [graphText, setGraphText] = useState(() => formatAdjacencyText(DEFAULT_GRAPH.adjacency, DEFAULT_GRAPH.nodeCount));
  const [graphError, setGraphError] = useState('');

  const [source, setSource] = useState(0);

  const [queue, setQueue] = useState([]);
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

  const structure = useMemo(() => computeBfsStructure(graph.adjacency, graph.nodeCount, source), [graph, source]);
  const layout = useMemo(
    () => getGraphLayout(graph.adjacency, structure.layers, structure.layerLabels, structure.treeEdges),
    [graph, structure]
  );
  const codeLines = BFS_CODE[language];
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
    setQueue([]);
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

    setQueue(step.queue);
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

    const steps = buildBfsSteps(graph.adjacency, Number(source));

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
        <h1 className="visualizer-title">BREADTH FIRST SEARCH (BFS)</h1>
        <p className="algorithm-description">Traverse nodes level-by-level using a queue, starting from a source node.</p>
        <div className="complexity-info">
          <div className="complexity-badge">Time: O(V + E)</div>
          <div className="complexity-badge">Space: O(V)</div>
          <div className="complexity-badge">DS: queue</div>
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
              <label className="control-label" htmlFor="bfs-graph">Graph (Adjacency List)</label>
              <div className="input-group" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                <textarea
                  id="bfs-graph"
                  className="array-input bfs-textarea"
                  value={graphText}
                  onChange={(e) => setGraphText(e.target.value)}
                  disabled={isRunning}
                  placeholder={'Example:\n0: 1, 2, 3\n1: 4, 5\n2: 5, 6\n3: 6, 7\n4:\n5:\n6:\n7:'}
                />
                <div className="controls-row" style={{ justifyContent: 'flex-start' }}>
                  <button onClick={applyGraphInput} disabled={isRunning} className="control-btn">Apply Graph</button>
                </div>
              </div>
              {graphError && <div className="error-message">{graphError}</div>}
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="bfs-source">Source Node</label>
              <div className="input-group">
                <select
                  id="bfs-source"
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
                <label className="control-label" htmlFor="bfs-speed">Speed</label>
                <span className="control-value">{speed}ms</span>
              </div>
              <input
                id="bfs-speed"
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

            <div className="bfs-summary">
              <div className="bfs-summary-row">
                <div className="bfs-summary-label">Queue</div>
                <div className="bfs-summary-value">
                  {queue.length === 0 ? '—' : queue.map((v, idx) => (
                    <span key={`${v}-${idx}`} className={`bfs-chip ${idx === 0 ? 'front' : ''}`}>{v}</span>
                  ))}
                </div>
              </div>
              <div className="bfs-summary-row">
                <div className="bfs-summary-label">Output</div>
                <div className="bfs-summary-value bfs-output">{order.length === 0 ? '—' : order.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="tree-visualization bfs-graph">
            <h3 className="tree-title">BFS Layers</h3>
            <div className="tree-container" style={{ height: `${layout.height}px` }}>
              <svg
                className="bfs-connectors"
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker id="bfsArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
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
                      className="bfs-layer-rect"
                    />
                    <text
                      x={r.x + 14}
                      y={r.y + 22}
                      className="bfs-layer-label"
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
                    className={`bfs-edge ${isEdgeActive(edge) ? 'active' : ''}`}
                    markerEnd="url(#bfsArrow)"
                  />
                ))}

                {activeEdgeLine && (
                  <line
                    key={`active-${activeEdge.from}-${activeEdge.to}`}
                    x1={activeEdgeLine.fromNode.x}
                    y1={activeEdgeLine.fromNode.y + 28}
                    x2={activeEdgeLine.toNode.x}
                    y2={activeEdgeLine.toNode.y - 28}
                    className="bfs-edge active"
                    markerEnd="url(#bfsArrow)"
                  />
                )}
              </svg>

              {layout.nodes.map((node) => (
                <div
                  key={node.id}
                  className="tree-node-wrapper bfs-node"
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

          <div className="bfs-area">
            <div className="bfs-col">
              <div className="bfs-title">Step Log</div>
              <br />
              <div className="bfs-log">
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

export default BreadthFirstSearchVisualizer;
