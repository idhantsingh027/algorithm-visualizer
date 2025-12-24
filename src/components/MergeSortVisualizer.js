import React, { useState, useRef } from 'react';
import './Visualizer.css';

const mergeSortCode = {
  python: [
    { line: 1, code: 'def merge_sort(arr):' },
    { line: 2, code: '    if len(arr) <= 1:' },
    { line: 3, code: '        return arr' },
    { line: 4, code: '    mid = len(arr) // 2' },
    { line: 5, code: '    left = merge_sort(arr[:mid])' },
    { line: 6, code: '    right = merge_sort(arr[mid:])' },
    { line: 7, code: '    return merge(left, right)' },
    { line: 8, code: '' },
    { line: 9, code: 'def merge(left, right):' },
    { line: 10, code: '    result = []' },
    { line: 11, code: '    i = j = 0' },
    { line: 12, code: '    while i < len(left) and j < len(right):' },
    { line: 13, code: '        if left[i] <= right[j]:' },
    { line: 14, code: '            result.append(left[i])' },
    { line: 15, code: '            i += 1' },
    { line: 16, code: '        else:' },
    { line: 17, code: '            result.append(right[j])' },
    { line: 18, code: '            j += 1' },
    { line: 19, code: '    result.extend(left[i:])' },
    { line: 20, code: '    result.extend(right[j:])' },
    { line: 21, code: '    return result' }
  ],
  c: [
    { line: 1, code: 'void merge(int arr[], int l, int m, int r) {' },
    { line: 2, code: '    int n1 = m - l + 1;' },
    { line: 3, code: '    int n2 = r - m;' },
    { line: 4, code: '    int L[n1], R[n2];' },
    { line: 5, code: '    for (int i = 0; i < n1; i++)' },
    { line: 6, code: '        L[i] = arr[l + i];' },
    { line: 7, code: '    for (int j = 0; j < n2; j++)' },
    { line: 8, code: '        R[j] = arr[m + 1 + j];' },
    { line: 9, code: '    int i = 0, j = 0, k = l;' },
    { line: 10, code: '    while (i < n1 && j < n2) {' },
    { line: 11, code: '        if (L[i] <= R[j]) arr[k++] = L[i++];' },
    { line: 12, code: '        else arr[k++] = R[j++];' },
    { line: 13, code: '    }' },
    { line: 14, code: '    while (i < n1) arr[k++] = L[i++];' },
    { line: 15, code: '    while (j < n2) arr[k++] = R[j++];' },
    { line: 16, code: '}' },
    { line: 17, code: '' },
    { line: 18, code: 'void mergeSort(int arr[], int l, int r) {' },
    { line: 19, code: '    if (l < r) {' },
    { line: 20, code: '        int m = l + (r - l + 1) / 2 - 1;' },
    { line: 21, code: '        mergeSort(arr, l, m);' },
    { line: 22, code: '        mergeSort(arr, m + 1, r);' },
    { line: 23, code: '        merge(arr, l, m, r);' },
    { line: 24, code: '    }' },
    { line: 25, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'void merge(vector<int>& arr, int l, int m, int r) {' },
    { line: 2, code: '    vector<int> left(arr.begin() + l, arr.begin() + m + 1);' },
    { line: 3, code: '    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);' },
    { line: 4, code: '    int i = 0, j = 0, k = l;' },
    { line: 5, code: '    while (i < left.size() && j < right.size()) {' },
    { line: 6, code: '        if (left[i] <= right[j]) {' },
    { line: 7, code: '            arr[k++] = left[i++];' },
    { line: 8, code: '        } else {' },
    { line: 9, code: '            arr[k++] = right[j++];' },
    { line: 10, code: '        }' },
    { line: 11, code: '    }' },
    { line: 12, code: '    while (i < left.size()) arr[k++] = left[i++];' },
    { line: 13, code: '    while (j < right.size()) arr[k++] = right[j++];' },
    { line: 14, code: '}' },
    { line: 15, code: '' },
    { line: 16, code: 'void mergeSort(vector<int>& arr, int l, int r) {' },
    { line: 17, code: '    if (l < r) {' },
    { line: 18, code: '        int m = l + (r - l + 1) / 2 - 1;' },
    { line: 19, code: '        mergeSort(arr, l, m);' },
    { line: 20, code: '        mergeSort(arr, m + 1, r);' },
    { line: 21, code: '        merge(arr, l, m, r);' },
    { line: 22, code: '    }' },
    { line: 23, code: '}' }
  ]
};

function MergeSortVisualizer() {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(1000);
  const [language, setLanguage] = useState('python');
  const [highlightedIndices, setHighlightedIndices] = useState({
    dividing: [],
    merging: [],
    sorted: []
  });
  const [treeNodes, setTreeNodes] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('idle'); // 'dividing', 'merging', 'idle'
  const [resultArray, setResultArray] = useState([]);
  const [inputValue, setInputValue] = useState('38, 27, 43, 3, 9, 82, 10');
  const [inputError, setInputError] = useState('');

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
      setInputError('');
    } catch (error) {
      setInputError('Invalid input. Use comma-separated numbers (1-999)');
    }
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
    pausedResolve.current = null;
    setCurrentLine(null);
    setHighlightedIndices({
      dividing: [],
      merging: [],
      sorted: []
    });
    setTreeNodes([]);
    setCurrentPhase('idle');
    setResultArray([]);
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

  const merge = async (arr, left, mid, right, allIndices) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    const segmentLength = right - left + 1;
    const resultSlots = Array(segmentLength).fill(null);
    let resultPos = 0;
    
    // Line mappings for merge function
    const lines = {
      python: { def: 9, init: 10, whileLoop: 12, compare: 13, leftCopy: 14, rightCopy: 17, remainLeft: 19, remainRight: 20 },
      c: { def: 1, init: 9, whileLoop: 10, leftCopy: 11, rightCopy: 12, remainLeft: 14, remainRight: 15 },
      cpp: { def: 1, init: 4, whileLoop: 5, compare: 6, leftCopy: 7, rightCopy: 9, remainLeft: 12, remainRight: 13 }
    };
    const l = lines[language];

    setCurrentLine(l.def);
    await sleep(speed);

    setCurrentLine(l.init);
    setResultArray([...resultSlots]);
    await sleep(speed);

    while (i < leftArr.length && j < rightArr.length) {
      setCurrentLine(l.whileLoop);
      setHighlightedIndices({ 
        dividing: [], 
        merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: allIndices.sorted
      });
      await sleep(speed);

      if (language === 'python' || language === 'cpp') {
        setCurrentLine(l.compare);
        await sleep(speed);
      }

      if (leftArr[i] <= rightArr[j]) {
        setCurrentLine(l.leftCopy);
        arr[k] = leftArr[i];
        resultSlots[resultPos++] = leftArr[i];
        i++;
        setArray([...arr]);
        setResultArray([...resultSlots]);
        await sleep(speed);
      } else {
        setCurrentLine(l.rightCopy);
        arr[k] = rightArr[j];
        resultSlots[resultPos++] = rightArr[j];
        j++;
        setArray([...arr]);
        setResultArray([...resultSlots]);
        await sleep(speed);
      }
      k++;
    }

    while (i < leftArr.length) {
      setCurrentLine(l.remainLeft);
      arr[k] = leftArr[i];
      resultSlots[resultPos++] = leftArr[i];
      i++;
      k++;
      setArray([...arr]);
      setResultArray([...resultSlots]);
      await sleep(speed);
    }

    while (j < rightArr.length) {
      setCurrentLine(l.remainRight);
      arr[k] = rightArr[j];
      resultSlots[resultPos++] = rightArr[j];
      j++;
      k++;
      setArray([...arr]);
      setResultArray([...resultSlots]);
      await sleep(speed);
    }

    const newSorted = [...allIndices.sorted];
    for (let idx = left; idx <= right; idx++) {
      if (!newSorted.includes(idx)) newSorted.push(idx);
    }
    allIndices.sorted = newSorted;
  };

  const mergeSortHelper = async (arr, left, right, allIndices, depth = 0) => {
    if (left > right) return;

    // Base case: single element segment (leaf) should still be visible in the tree
    if (left === right) {
      const nodeId = `${left}-${right}-${depth}`;
      setTreeNodes(prev => [...prev, { id: nodeId, left, right, depth, values: [arr[left]], phase: 'merged' }]);
      return;
    }

    // Add node to tree for divide phase
    const nodeId = `${left}-${right}-${depth}`;
    const subarray = arr.slice(left, right + 1);
    setTreeNodes(prev => [...prev, { id: nodeId, left, right, depth, values: [...subarray], phase: 'dividing' }]);
    setCurrentPhase('dividing');

    // Line mappings for mergeSort function
    const lines = {
      python: { check: 2, mid: 4, leftCall: 5, rightCall: 6, mergeCall: 7 },
      c: { check: 19, mid: 20, leftCall: 21, rightCall: 22, mergeCall: 23 },
      cpp: { check: 17, mid: 18, leftCall: 19, rightCall: 20, mergeCall: 21 }
    };
    const l = lines[language];

    setCurrentLine(l.check);
    await sleep(speed);

    setCurrentLine(l.mid);
    const segmentLen = right - left + 1;
    const mid = left + Math.floor(segmentLen / 2) - 1;
    setHighlightedIndices({ 
      dividing: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      merging: [],
      sorted: allIndices.sorted
    });
    await sleep(speed);

    // Show left call
    setCurrentLine(l.leftCall);
    await sleep(speed);
    await mergeSortHelper(arr, left, mid, allIndices, depth + 1);
    
    // Return from left call
    setCurrentLine(l.leftCall);
    await sleep(speed);

    // Show right call
    setCurrentLine(l.rightCall);
    await sleep(speed);
    await mergeSortHelper(arr, mid + 1, right, allIndices, depth + 1);
    
    // Return from right call
    setCurrentLine(l.rightCall);
    await sleep(speed);

    // Show return merge line before calling merge
    setCurrentLine(l.mergeCall);
    await sleep(speed);

    // Update node to merging phase
    setTreeNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, phase: 'merging', values: arr.slice(left, right + 1) } : node
    ));
    setCurrentPhase('merging');

    // Now call merge function
    await merge(arr, left, mid, right, allIndices);

    // Mark node as merged and show result
    setTreeNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, phase: 'merged' } : node
    ));
  };

  const mergeSort = async () => {
    setIsRunning(true);
    setTreeNodes([]);
    setCurrentPhase('idle');
    setResultArray([]);
    const arr = [...array];
    const allIndices = { sorted: [] };

    // Starting line for each language
    const startLines = {
      python: 1,
      c: 18,
      cpp: 16
    };

    setCurrentLine(startLines[language]);
    await sleep(speed);

    await mergeSortHelper(arr, 0, arr.length - 1, allIndices);

    setHighlightedIndices({
      dividing: [],
      merging: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i)
    });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index)) return '#4ade80';
    if (highlightedIndices.merging.includes(index)) return '#3b82f6';
    if (highlightedIndices.dividing.includes(index)) return '#f59e0b';
    return '#6b7280';
  };

  const getMergeTreeLayout = () => {
    if (!treeNodes || treeNodes.length === 0) {
      return { width: 1000, height: 220, nodes: [], edges: [] };
    }

    const n = array.length;
    const width = 1000;
    const paddingX = 70;
    const paddingY = 40;
    const levelGap = 120;

    const maxDepth = Math.max(...treeNodes.map(n0 => n0.depth));
    const height = paddingY + (maxDepth + 1) * levelGap + 60;

    const nodes = treeNodes.map((node) => {
      const center = (node.left + node.right) / 2;
      const denom = Math.max(n - 1, 1);
      const frac = center / denom;
      const x = paddingX + frac * (width - 2 * paddingX);
      const y = paddingY + node.depth * levelGap;
      return { ...node, x, y };
    });

    const nodeByKey = new Map(nodes.map(n0 => [`${n0.left}-${n0.right}-${n0.depth}`, n0]));
    const edges = [];
    for (const node of nodes) {
      if (node.left === node.right) continue;
      const segLen = node.right - node.left + 1;
      const mid = node.left + Math.floor(segLen / 2) - 1;
      const leftKey = `${node.left}-${mid}-${node.depth + 1}`;
      const rightKey = `${mid + 1}-${node.right}-${node.depth + 1}`;
      const leftChild = nodeByKey.get(leftKey);
      const rightChild = nodeByKey.get(rightKey);
      if (leftChild) edges.push({ from: node, to: leftChild, key: `${node.id}->${leftChild.id}` });
      if (rightChild) edges.push({ from: node, to: rightChild, key: `${node.id}->${rightChild.id}` });
    }

    return { width, height, nodes, edges };
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">MERGE SORT</h1>
        <p className="algorithm-description">Divides array into halves, recursively sorts them, and merges the sorted halves together.</p>
        <div className="complexity-info">
          <span className="complexity-badge">Time: O(N log N)</span>
          <span className="complexity-badge">Space: O(N)</span>
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
            {mergeSortCode[language].map((lineObj) => (
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
          {treeNodes.length > 0 && (
            (() => {
              const layout = getMergeTreeLayout();
              return (
                <div className="tree-visualization merge-tree">
                  <h3 className="tree-title">Merge Tree</h3>
                  <div className="merge-tree-subtitle">
                    {currentPhase === 'dividing' ? 'Divide phase' : 'Merge phase'}
                  </div>

                  <div className="tree-container" style={{ height: `${layout.height}px` }}>
                    <svg
                      className="merge-connectors"
                      viewBox={`0 0 ${layout.width} ${layout.height}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {layout.edges.map((edge) => (
                        <line
                          key={edge.key}
                          x1={edge.from.x}
                          y1={edge.from.y + 34}
                          x2={edge.to.x}
                          y2={edge.to.y - 34}
                          className="merge-connector-line"
                        />
                      ))}
                    </svg>

                    {layout.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="tree-node-wrapper merge-node"
                        style={{ left: `${(node.x / layout.width) * 100}%`, top: `${node.y}px` }}
                      >
                        <div className={`tree-node ${node.phase}`}>
                          <div className="node-values">
                            {node.values.map((val, idx) => (
                              <span key={idx} className="node-value">{val}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          )}

          {resultArray.length > 0 && (
            <div className="result-array-section">
              <h3 className="result-title">📋 Result Array</h3>
              <div className="result-array-container">
                {resultArray.map((value, index) => (
                  <div key={index} className="result-item">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="array-container">
            {array.map((value, index) => (
              <div 
                key={index} 
                className="array-bar-wrapper"
              >
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
              <span>Dividing</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
              <span>Merging</span>
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
                    placeholder="e.g., 38, 27, 43, 3, 9"
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
                  onClick={mergeSort}
                  disabled={isRunning}
                >
                  {isRunning ? '⏸ Running...' : '▶ Start'}
                </button>

                {isRunning && (
                  <button 
                    className="control-btn secondary"
                    onClick={togglePause}
                  >
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

export default MergeSortVisualizer;
