import React, { useState, useRef } from 'react';
import './Visualizer.css';

const bubbleSortCode = {
  python: [
    { line: 1, code: 'def bubble_sort(arr):' },
    { line: 2, code: '    n = len(arr)' },
    { line: 3, code: '    for i in range(n):' },
    { line: 4, code: '        for j in range(0, n - i - 1):' },
    { line: 5, code: '            if arr[j] > arr[j + 1]:' },
    { line: 6, code: '                arr[j], arr[j + 1] = arr[j + 1], arr[j]' },
    { line: 7, code: '    return arr' }
  ],
  c: [
    { line: 1, code: 'void bubbleSort(int arr[], int n) {' },
    { line: 2, code: '    int i, j, temp;' },
    { line: 3, code: '    for (i = 0; i < n - 1; i++) {' },
    { line: 4, code: '        for (j = 0; j < n - i - 1; j++) {' },
    { line: 5, code: '            if (arr[j] > arr[j + 1]) {' },
    { line: 6, code: '                temp = arr[j];' },
    { line: 7, code: '                arr[j] = arr[j + 1];' },
    { line: 8, code: '                arr[j + 1] = temp;' },
    { line: 9, code: '            }' },
    { line: 10, code: '        }' },
    { line: 11, code: '    }' },
    { line: 12, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'void bubbleSort(vector<int>& arr) {' },
    { line: 2, code: '    int n = arr.size();' },
    { line: 3, code: '    for (int i = 0; i < n - 1; i++) {' },
    { line: 4, code: '        for (int j = 0; j < n - i - 1; j++) {' },
    { line: 5, code: '            if (arr[j] > arr[j + 1]) {' },
    { line: 6, code: '                swap(arr[j], arr[j + 1]);' },
    { line: 7, code: '            }' },
    { line: 8, code: '        }' },
    { line: 9, code: '    }' },
    { line: 10, code: '}' }
  ]
};

function BubbleSortVisualizer() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(1000);
  const [language, setLanguage] = useState('python');
  const [highlightedIndices, setHighlightedIndices] = useState({
    comparing: [],
    sorted: []
  });
  const [inputValue, setInputValue] = useState('64, 34, 25, 12, 22, 11, 90');
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
      comparing: [],
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

  const bubbleSort = async () => {
    setIsRunning(true);
    const arr = [...array];
    const n = arr.length;
    const sorted = [];

    // Line mappings for different languages
    const lines = {
      python: { def: 1, outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, end: 7 },
      c: { def: 1, decl: 2, outerLoop: 3, innerLoop: 4, compare: 5, swap1: 6, swap2: 7, swap3: 8, end: 12 },
      cpp: { def: 1, n: 2, outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, end: 10 }
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

    for (let i = 0; i < n - 1; i++) {
      setCurrentLine(l.outerLoop);
      await sleep(speed);

      for (let j = 0; j < n - i - 1; j++) {
        setCurrentLine(l.innerLoop);
        // eslint-disable-next-line no-loop-func
        setHighlightedIndices({ comparing: [j, j + 1], sorted });
        await sleep(speed);

        setCurrentLine(l.compare);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          if (language === 'c') {
            setCurrentLine(l.swap1);
            await sleep(speed);
            setCurrentLine(l.swap2);
            await sleep(speed);
            setCurrentLine(l.swap3);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            await sleep(speed);
          } else {
            setCurrentLine(l.swap);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            await sleep(speed);
          }
        }
      }
      sorted.push(n - i - 1);
      setHighlightedIndices({ comparing: [], sorted: [...sorted] });
    }

    sorted.push(0);
    setCurrentLine(l.end);
    setHighlightedIndices({
      comparing: [],
      sorted: Array.from({ length: n }, (_, i) => i)
    });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index)) return '#4ade80';
    if (highlightedIndices.comparing.includes(index)) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">BUBBLE SORT</h1>
        <p className="algorithm-description">Repeatedly swaps adjacent elements if they are in wrong order until the array is sorted.</p>
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
            {bubbleSortCode[language].map((lineObj) => (
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
                    placeholder="e.g., 64, 34, 25, 12, 22"
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
                  onClick={bubbleSort}
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

export default BubbleSortVisualizer;
