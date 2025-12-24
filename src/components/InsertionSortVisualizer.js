import React, { useState, useRef } from 'react';
import './Visualizer.css';

const insertionSortCode = {
  python: [
    { line: 1, code: 'def insertion_sort(arr):' },
    { line: 2, code: '    for i in range(1, len(arr)):' },
    { line: 3, code: '        key = arr[i]' },
    { line: 4, code: '        j = i - 1' },
    { line: 5, code: '        while j >= 0 and arr[j] > key:' },
    { line: 6, code: '            arr[j + 1] = arr[j]' },
    { line: 7, code: '            j -= 1' },
    { line: 8, code: '        arr[j + 1] = key' },
    { line: 9, code: '    return arr' }
  ],
  c: [
    { line: 1, code: 'void insertionSort(int arr[], int n) {' },
    { line: 2, code: '    int i, key, j;' },
    { line: 3, code: '    for (i = 1; i < n; i++) {' },
    { line: 4, code: '        key = arr[i];' },
    { line: 5, code: '        j = i - 1;' },
    { line: 6, code: '        while (j >= 0 && arr[j] > key) {' },
    { line: 7, code: '            arr[j + 1] = arr[j];' },
    { line: 8, code: '            j = j - 1;' },
    { line: 9, code: '        }' },
    { line: 10, code: '        arr[j + 1] = key;' },
    { line: 11, code: '    }' },
    { line: 12, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'void insertionSort(vector<int>& arr) {' },
    { line: 2, code: '    int n = arr.size();' },
    { line: 3, code: '    for (int i = 1; i < n; i++) {' },
    { line: 4, code: '        int key = arr[i];' },
    { line: 5, code: '        int j = i - 1;' },
    { line: 6, code: '        while (j >= 0 && arr[j] > key) {' },
    { line: 7, code: '            arr[j + 1] = arr[j];' },
    { line: 8, code: '            j--;' },
    { line: 9, code: '        }' },
    { line: 10, code: '        arr[j + 1] = key;' },
    { line: 11, code: '    }' },
    { line: 12, code: '}' }
  ]
};

function InsertionSortVisualizer() {
  const [array, setArray] = useState([12, 11, 13, 5, 6, 7]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(1000);
  const [language, setLanguage] = useState('python');
  const [highlightedIndices, setHighlightedIndices] = useState({
    key: null,
    comparing: null,
    sorted: []
  });
  const [inputValue, setInputValue] = useState('12, 11, 13, 5, 6, 7');
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
      
      setArray(values);
      setInputError('');
      resetVisualization();
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
      key: null,
      comparing: null,
      sorted: []
    });
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

  const insertionSort = async () => {
    setIsRunning(true);
    const arr = [...array];
    const n = arr.length;

    // Line mappings for different languages
    const lines = {
      python: { def: 1, forLoop: 2, key: 3, j: 4, while: 5, shift: 6, decrement: 7, place: 8, end: 9 },
      c: { def: 1, decl: 2, forLoop: 3, key: 4, j: 5, while: 6, shift: 7, decrement: 8, place: 10, end: 12 },
      cpp: { def: 1, n: 2, forLoop: 3, key: 4, j: 5, while: 6, shift: 7, decrement: 8, place: 10, end: 12 }
    };
    const l = lines[language];

    setCurrentLine(l.def);
    await sleep(speed);
    if (l.decl) {
      setCurrentLine(l.decl);
      await sleep(speed);
    }
    if (l.n) {
      setCurrentLine(l.n);
      await sleep(speed);
    }

    for (let i = 1; i < n; i++) {
      setCurrentLine(l.forLoop);
      await sleep(speed);

      const key = arr[i];
      setCurrentLine(l.key);
      // eslint-disable-next-line no-loop-func
      setHighlightedIndices({ key: i, comparing: null, sorted: Array.from({ length: i }, (_, idx) => idx) });
      await sleep(speed);

      let j = i - 1;
      setCurrentLine(l.j);
      await sleep(speed);

      while (j >= 0 && arr[j] > key) {
        setCurrentLine(l.while);
        // eslint-disable-next-line no-loop-func
        setHighlightedIndices({ key: j + 1, comparing: j, sorted: Array.from({ length: i }, (_, idx) => idx) });
        await sleep(speed);

        setCurrentLine(l.shift);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await sleep(speed);

        setCurrentLine(l.decrement);
        j--;
        await sleep(speed);
      }

      setCurrentLine(l.place);
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(speed);
    }

    setCurrentLine(l.end);
    setHighlightedIndices({
      key: null,
      comparing: null,
      sorted: Array.from({ length: n }, (_, i) => i)
    });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index) && highlightedIndices.key !== index) return '#4ade80';
    if (highlightedIndices.key === index) return '#f59e0b';
    if (highlightedIndices.comparing === index) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">INSERTION SORT</h1>
        <p className="algorithm-description">Builds sorted array one element at a time by inserting each element into its correct position.</p>
        <div className="complexity-info">
          <span className="complexity-badge">Time: O(N²)</span>
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
            {insertionSortCode[language].map((lineObj) => (
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
              <span>Key Element</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
              <span>Comparing</span>
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
                  onClick={insertionSort}
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

export default InsertionSortVisualizer;
