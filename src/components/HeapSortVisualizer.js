import React, { useRef, useState } from 'react';
import './Visualizer.css';

const heapSortCode = {
  python: [
    { line: 1, code: 'def heap_sort(arr):' },
    { line: 2, code: '    n = len(arr)' },
    { line: 3, code: '    for i in range(n // 2 - 1, -1, -1):' },
    { line: 4, code: '        heapify(arr, n, i)' },
    { line: 5, code: '    for i in range(n - 1, 0, -1):' },
    { line: 6, code: '        arr[i], arr[0] = arr[0], arr[i]' },
    { line: 7, code: '        heapify(arr, i, 0)' },
    { line: 8, code: '    return arr' },
    { line: 9, code: '' },
    { line: 10, code: 'def heapify(arr, n, i):' },
    { line: 11, code: '    largest = i' },
    { line: 12, code: '    l = 2 * i + 1' },
    { line: 13, code: '    r = 2 * i + 2' },
    { line: 14, code: '    if l < n and arr[l] > arr[largest]:' },
    { line: 15, code: '        largest = l' },
    { line: 16, code: '    if r < n and arr[r] > arr[largest]:' },
    { line: 17, code: '        largest = r' },
    { line: 18, code: '    if largest != i:' },
    { line: 19, code: '        arr[i], arr[largest] = arr[largest], arr[i]' },
    { line: 20, code: '        heapify(arr, n, largest)' }
  ],
  c: [
    { line: 1, code: 'void heapify(int arr[], int n, int i) {' },
    { line: 2, code: '    int largest = i;' },
    { line: 3, code: '    int l = 2 * i + 1;' },
    { line: 4, code: '    int r = 2 * i + 2;' },
    { line: 5, code: '    if (l < n && arr[l] > arr[largest])' },
    { line: 6, code: '        largest = l;' },
    { line: 7, code: '    if (r < n && arr[r] > arr[largest])' },
    { line: 8, code: '        largest = r;' },
    { line: 9, code: '    if (largest != i) {' },
    { line: 10, code: '        int temp = arr[i];' },
    { line: 11, code: '        arr[i] = arr[largest];' },
    { line: 12, code: '        arr[largest] = temp;' },
    { line: 13, code: '        heapify(arr, n, largest);' },
    { line: 14, code: '    }' },
    { line: 15, code: '}' },
    { line: 16, code: '' },
    { line: 17, code: 'void heapSort(int arr[], int n) {' },
    { line: 18, code: '    for (int i = n / 2 - 1; i >= 0; i--)' },
    { line: 19, code: '        heapify(arr, n, i);' },
    { line: 20, code: '    for (int i = n - 1; i > 0; i--) {' },
    { line: 21, code: '        int temp = arr[0];' },
    { line: 22, code: '        arr[0] = arr[i];' },
    { line: 23, code: '        arr[i] = temp;' },
    { line: 24, code: '        heapify(arr, i, 0);' },
    { line: 25, code: '    }' },
    { line: 26, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'void heapify(vector<int>& arr, int n, int i) {' },
    { line: 2, code: '    int largest = i;' },
    { line: 3, code: '    int l = 2 * i + 1;' },
    { line: 4, code: '    int r = 2 * i + 2;' },
    { line: 5, code: '    if (l < n && arr[l] > arr[largest]) largest = l;' },
    { line: 6, code: '    if (r < n && arr[r] > arr[largest]) largest = r;' },
    { line: 7, code: '    if (largest != i) {' },
    { line: 8, code: '        swap(arr[i], arr[largest]);' },
    { line: 9, code: '        heapify(arr, n, largest);' },
    { line: 10, code: '    }' },
    { line: 11, code: '}' },
    { line: 12, code: '' },
    { line: 13, code: 'void heapSort(vector<int>& arr) {' },
    { line: 14, code: '    int n = arr.size();' },
    { line: 15, code: '    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);' },
    { line: 16, code: '    for (int i = n - 1; i > 0; i--) {' },
    { line: 17, code: '        swap(arr[0], arr[i]);' },
    { line: 18, code: '        heapify(arr, i, 0);' },
    { line: 19, code: '    }' },
    { line: 20, code: '}' }
  ]
};

function HeapSortVisualizer() {
  const [array, setArray] = useState([12, 11, 13, 5, 6, 7]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);

  const [heapSize, setHeapSize] = useState(6);

  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(1000);
  const [language, setLanguage] = useState('python');

  const [highlightedIndices, setHighlightedIndices] = useState({
    comparing: [],
    swapping: [],
    heapRoot: null,
    sorted: []
  });

  const [inputValue, setInputValue] = useState('3, 5, 1, 10, 2, 7');
  const [inputError, setInputError] = useState('');

  const resetVisualization = () => {
    setIsRunning(false);
    setHasStarted(false);
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
    setCurrentLine(null);
    setHeapSize(array.length);
    setHighlightedIndices({ comparing: [], swapping: [], heapRoot: null, sorted: [] });
  };

  const handleArrayInput = () => {
    try {
      const values = inputValue.split(',').map(val => {
        const num = parseInt(val.trim());
        if (isNaN(num)) throw new Error('Invalid number');
        if (num < 1 || num > 999) throw new Error('Numbers must be between 1-999');
        return num;
      });

      if (values.length < 3 || values.length > 15) {
        setInputError('Array must have 3-15 elements');
        return;
      }

      resetVisualization();
      setArray(values);
      setHeapSize(values.length);
      setHasStarted(false);
      setInputError('');
    } catch {
      setInputError('Invalid input. Use comma-separated numbers (1-999)');
    }
  };

  const togglePause = () => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      setIsPaused(false);
      if (pausedResolve.current) {
        pausedResolve.current();
        pausedResolve.current = null;
      }
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
    }
  };

  const sleep = async (_ms) => {
    await new Promise(resolve => setTimeout(resolve, speedRef.current));
    if (isPausedRef.current) {
      await new Promise(resolve => {
        pausedResolve.current = resolve;
      });
    }
  };

  const heapify = async (arr, n, i, allIndices) => {
    setHeapSize(n);
    const lines = {
      python: {
        def: 10,
        largest: 11,
        left: 12,
        right: 13,
        leftIf: 14,
        leftSet: 15,
        rightIf: 16,
        rightSet: 17,
        swapIf: 18,
        swap: 19,
        recurse: 20
      },
      c: {
        def: 1,
        largest: 2,
        left: 3,
        right: 4,
        leftIf: 5,
        leftSet: 6,
        rightIf: 7,
        rightSet: 8,
        swapIf: 9,
        swap1: 10,
        swap2: 11,
        swap3: 12,
        recurse: 13
      },
      cpp: {
        def: 1,
        largest: 2,
        left: 3,
        right: 4,
        leftIf: 5,
        rightIf: 6,
        swapIf: 7,
        swap: 8,
        recurse: 9
      }
    };
    const l = lines[language];

    setCurrentLine(l.def);
    await sleep(speed);

    let largest = i;
    setCurrentLine(l.largest);
    setHighlightedIndices({ comparing: [], swapping: [], heapRoot: i, sorted: allIndices.sorted });
    await sleep(speed);

    const left = 2 * i + 1;
    setCurrentLine(l.left);
    await sleep(speed);

    const right = 2 * i + 2;
    setCurrentLine(l.right);
    await sleep(speed);

    if (left < n) {
      setCurrentLine(l.leftIf);
      setHighlightedIndices({ comparing: [largest, left], swapping: [], heapRoot: i, sorted: allIndices.sorted });
      await sleep(speed);
      if (arr[left] > arr[largest]) {
        largest = left;
        if (l.leftSet) {
          setCurrentLine(l.leftSet);
          await sleep(speed);
        }
      }
    }

    if (right < n) {
      setCurrentLine(l.rightIf);
      setHighlightedIndices({ comparing: [largest, right], swapping: [], heapRoot: i, sorted: allIndices.sorted });
      await sleep(speed);
      if (arr[right] > arr[largest]) {
        largest = right;
        if (l.rightSet) {
          setCurrentLine(l.rightSet);
          await sleep(speed);
        }
      }
    }

    setCurrentLine(l.swapIf);
    await sleep(speed);

    if (largest !== i) {
      setHighlightedIndices({ comparing: [], swapping: [i, largest], heapRoot: i, sorted: allIndices.sorted });

      if (language === 'c') {
        setCurrentLine(l.swap1);
        await sleep(speed);
        setCurrentLine(l.swap2);
        await sleep(speed);
        setCurrentLine(l.swap3);
        await sleep(speed);
      } else {
        setCurrentLine(l.swap);
        await sleep(speed);
      }

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(speed);

      setCurrentLine(l.recurse);
      await sleep(speed);
      await heapify(arr, n, largest, allIndices);
    }
  };

  const heapSort = async () => {
    setHasStarted(true);
    setIsRunning(true);
    const arr = [...array];
    const n = arr.length;
    const allIndices = { sorted: [] };

    setHeapSize(n);

    const mainLines = {
      python: { start: 1, n: 2, buildLoop: 3, buildCall: 4, extractLoop: 5, swap: 6, extractCall: 7, end: 8 },
      c: { start: 17, buildLoop: 18, buildCall: 19, extractLoop: 20, swap1: 21, swap2: 22, swap3: 23, extractCall: 24, end: 26 },
      cpp: { start: 13, n: 14, buildLoop: 15, buildCall: 15, extractLoop: 16, swap: 17, extractCall: 18, end: 20 }
    };
    const l = mainLines[language];

    setCurrentLine(l.start);
    await sleep(speed);

    if (l.n) {
      setCurrentLine(l.n);
      await sleep(speed);
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      setCurrentLine(l.buildLoop);
      setHighlightedIndices({ comparing: [], swapping: [], heapRoot: i, sorted: allIndices.sorted });
      setHeapSize(n);
      await sleep(speed);

      if (l.buildCall) {
        setCurrentLine(l.buildCall);
        await sleep(speed);
      }
      await heapify(arr, n, i, allIndices);
    }

    for (let end = n - 1; end > 0; end--) {
      setCurrentLine(l.extractLoop);
      setHighlightedIndices({ comparing: [], swapping: [0, end], heapRoot: 0, sorted: allIndices.sorted });
      setHeapSize(end + 1);
      await sleep(speed);

      if (language === 'c') {
        setCurrentLine(l.swap1);
        await sleep(speed);
        setCurrentLine(l.swap2);
        await sleep(speed);
        setCurrentLine(l.swap3);
        await sleep(speed);
      } else {
        setCurrentLine(l.swap);
        await sleep(speed);
      }

      [arr[0], arr[end]] = [arr[end], arr[0]];
      setArray([...arr]);

      allIndices.sorted.push(end);
      setHeapSize(end);
      setHighlightedIndices({ comparing: [], swapping: [], heapRoot: null, sorted: [...allIndices.sorted] });
      await sleep(speed);

      setCurrentLine(l.extractCall);
      await sleep(speed);
      await heapify(arr, end, 0, allIndices);
    }

    setCurrentLine(l.end);
    setHeapSize(0);
    setHighlightedIndices({ comparing: [], swapping: [], heapRoot: null, sorted: Array.from({ length: n }, (_, idx) => idx) });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index)) return '#4ade80';
    if (highlightedIndices.swapping.includes(index)) return '#ef4444';
    if (highlightedIndices.comparing.includes(index)) return '#3b82f6';
    if (highlightedIndices.heapRoot === index) return '#f59e0b';
    return '#6b7280';
  };

  const getHeapNodePhase = (index) => {
    if (index >= heapSize) return 'merged';
    if (highlightedIndices.swapping.includes(index)) return 'merging';
    if (highlightedIndices.comparing.includes(index)) return 'comparing';
    if (highlightedIndices.heapRoot === index) return 'dividing';
    return 'idle';
  };

  const getHeapLayout = () => {
    const n = array.length;
    if (n === 0) return { width: 1000, height: 220, nodes: [], edges: [] };

    const width = 1000;
    const paddingX = 70;
    const paddingY = 40;
    const levelGap = 120;

    const maxDepth = Math.floor(Math.log2(n));
    const height = paddingY + (maxDepth + 1) * levelGap + 40;

    const nodes = [];
    for (let idx = 0; idx < n; idx++) {
      const depth = Math.floor(Math.log2(idx + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const posInLevel = idx - levelStart;
      const count = Math.pow(2, depth);
      const frac = (posInLevel + 0.5) / count;

      const x = paddingX + frac * (width - 2 * paddingX);
      const y = paddingY + depth * levelGap;
      nodes.push({ idx, x, y, depth });
    }

    const nodeByIdx = new Map(nodes.map(n0 => [n0.idx, n0]));
    const edges = [];
    for (let idx = 0; idx < n; idx++) {
      const parent = nodeByIdx.get(idx);
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < n) {
        const child = nodeByIdx.get(left);
        edges.push({ from: parent, to: child });
      }
      if (right < n) {
        const child = nodeByIdx.get(right);
        edges.push({ from: parent, to: child });
      }
    }

    return { width, height, nodes, edges };
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">HEAP SORT</h1>
        <p className="algorithm-description">Builds a max-heap and repeatedly extracts the maximum element to sort the array.</p>
        <div className="complexity-info">
          <span className="complexity-badge">Time: O(N log N)</span>
          <span className="complexity-badge">Space: O(1)</span>
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
            {heapSortCode[language].map((lineObj) => (
              <div
                key={lineObj.line}
                className={`code-line ${currentLine === lineObj.line ? 'highlighted' : ''}`}
              >
                <span className="line-number">{lineObj.line}</span>
                <span className="line-code">{lineObj.code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="visualization-section">
          {hasStarted && (() => {
            const layout = getHeapLayout();
            return (
              <div className="tree-visualization heap-tree">
                <h3 className="tree-title">Heap Tree</h3>
                <div className="tree-container" style={{ height: `${layout.height}px` }}>
                  <svg
                    className="heap-connectors"
                    viewBox={`0 0 ${layout.width} ${layout.height}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {layout.edges.map((edge) => (
                      <line
                        key={`${edge.from.idx}-${edge.to.idx}`}
                        x1={edge.from.x}
                        y1={edge.from.y + 28}
                        x2={edge.to.x}
                        y2={edge.to.y - 28}
                        className="heap-connector-line"
                      />
                    ))}
                  </svg>

                  {layout.nodes.map((node) => (
                    <div
                      key={node.idx}
                      className="tree-node-wrapper heap-node"
                      style={{ left: `${(node.x / layout.width) * 100}%`, top: `${node.y}px` }}
                    >
                      <div className={`tree-node ${getHeapNodePhase(node.idx)}`}>
                        <div className="node-values">
                          <span className="node-value">{array[node.idx]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="array-container">
            {array.map((value, index) => (
              <div key={index} className="array-bar-wrapper">
                <div
                  className="array-bar"
                  style={{
                    height: `${(value / Math.max(...array)) * 300}px`,
                    backgroundColor: getBarColor(index)
                  }}
                >
                  <span className="bar-value">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
              <span>Heap Root</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
              <span>Comparing</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
              <span>Swapping</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4ade80' }}></span>
              <span>Sorted</span>
            </div>
          </div>

          <div className="controls">
            <div className="controls-compact">
              <div className="input-section">
                <label className="input-label">Enter Array (comma-separated, 3-15 numbers)</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="array-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isRunning}
                    placeholder="e.g., 12, 11, 13, 5, 6"
                  />
                  <button
                    className="control-btn apply-btn"
                    onClick={handleArrayInput}
                    disabled={isRunning}
                  >
                    Apply
                  </button>
                </div>
                {inputError && <span className="error-message">{inputError}</span>}
              </div>

              <div className="controls-row">
                <button
                  className="control-btn primary"
                  onClick={heapSort}
                  disabled={isRunning}
                >
                  {isRunning ? '⏸ Running...' : '▶ Start'}
                </button>

                {isRunning && (
                  <button className="control-btn secondary" onClick={togglePause}>
                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                )}

                <div className="speed-control">
                  <label>Speed: <span className="value-badge">{speed}ms</span></label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setSpeed(next);
                      speedRef.current = next;
                    }}
                    className="slider-compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeapSortVisualizer;
