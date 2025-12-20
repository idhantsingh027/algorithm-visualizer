import React, { useState } from 'react';
import './SelectionSortVisualizer.css';

const selectionSortCode = {
  python: [
    { line: 1, code: 'def selection_sort(arr):' },
    { line: 2, code: '    n = len(arr)' },
    { line: 3, code: '    for i in range(n):' },
    { line: 4, code: '        min_idx = i' },
    { line: 5, code: '        for j in range(i + 1, n):' },
    { line: 6, code: '            if arr[j] < arr[min_idx]:' },
    { line: 7, code: '                min_idx = j' },
    { line: 8, code: '        arr[i], arr[min_idx] = arr[min_idx], arr[i]' },
    { line: 9, code: '    return arr' }
  ],
  c: [
    { line: 1, code: 'void selectionSort(int arr[], int n) {' },
    { line: 2, code: '    int i, j, min_idx, temp;' },
    { line: 3, code: '    for (i = 0; i < n - 1; i++) {' },
    { line: 4, code: '        min_idx = i;' },
    { line: 5, code: '        for (j = i + 1; j < n; j++) {' },
    { line: 6, code: '            if (arr[j] < arr[min_idx]) {' },
    { line: 7, code: '                min_idx = j;' },
    { line: 8, code: '            }' },
    { line: 9, code: '        }' },
    { line: 10, code: '        temp = arr[min_idx];' },
    { line: 11, code: '        arr[min_idx] = arr[i];' },
    { line: 12, code: '        arr[i] = temp;' },
    { line: 13, code: '    }' },
    { line: 14, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'void selectionSort(vector<int>& arr) {' },
    { line: 2, code: '    int n = arr.size();' },
    { line: 3, code: '    for (int i = 0; i < n - 1; i++) {' },
    { line: 4, code: '        int min_idx = i;' },
    { line: 5, code: '        for (int j = i + 1; j < n; j++) {' },
    { line: 6, code: '            if (arr[j] < arr[min_idx]) {' },
    { line: 7, code: '                min_idx = j;' },
    { line: 8, code: '            }' },
    { line: 9, code: '        }' },
    { line: 10, code: '        swap(arr[min_idx], arr[i]);' },
    { line: 11, code: '    }' },
    { line: 12, code: '}' }
  ]
};

function SelectionSortVisualizer() {
  const [array, setArray] = useState([64, 25, 12, 22, 11, 90, 45, 33]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const [language, setLanguage] = useState('python');
  const [highlightedIndices, setHighlightedIndices] = useState({
    current: null,
    minIndex: null,
    comparing: null,
    sorted: []
  });
  const [inputValue, setInputValue] = useState('64, 25, 12, 22, 11, 90, 45, 33');
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
    setCurrentLine(null);
    setHighlightedIndices({
      current: null,
      minIndex: null,
      comparing: null,
      sorted: []
    });
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const selectionSort = async () => {
    setIsRunning(true);
    const arr = [...array];
    const n = arr.length;
    const sorted = [];

    setCurrentLine(1);
    await sleep(speed);

    for (let i = 0; i < n; i++) {
      setCurrentLine(3);
      setHighlightedIndices(prev => ({ ...prev, current: i }));
      await sleep(speed);

      let minIdx = i;
      setCurrentLine(4);
      setHighlightedIndices(prev => ({ ...prev, minIndex: i }));
      await sleep(speed);

      for (let j = i + 1; j < n; j++) {
        setCurrentLine(5);
        // eslint-disable-next-line no-loop-func
        setHighlightedIndices(prev => ({ ...prev, comparing: j }));
        await sleep(speed);

        setCurrentLine(6);
        await sleep(speed);

        if (arr[j] < arr[minIdx]) {
          setCurrentLine(7);
          minIdx = j;
          // eslint-disable-next-line no-loop-func
          setHighlightedIndices(prev => ({ ...prev, minIndex: minIdx, comparing: j }));
          await sleep(speed);
        }
      }

      setCurrentLine(8);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      sorted.push(i);
      setHighlightedIndices(prev => ({ ...prev, sorted: [...sorted], comparing: null }));
      await sleep(speed);
    }

    setCurrentLine(9);
    setHighlightedIndices({
      current: null,
      minIndex: null,
      comparing: null,
      sorted: Array.from({ length: n }, (_, i) => i)
    });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index)) return '#4ade80';
    if (highlightedIndices.current === index) return '#f59e0b';
    if (highlightedIndices.minIndex === index) return '#ef4444';
    if (highlightedIndices.comparing === index) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">SELECTION SORT</h1>
        <p className="algorithm-description">Finds minimum element from unsorted portion and moves it to sorted position.</p>
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
            {selectionSortCode[language].map((lineObj) => (
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
              <span>Current Position</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
              <span>Minimum</span>
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
                    placeholder="e.g., 64, 25, 12, 22, 11"
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
                  onClick={selectionSort}
                  disabled={isRunning}
                >
                  {isRunning ? '⏸ Running...' : '▶ Start'}
                </button>
                
                <div className="speed-control">
                  <label>Speed: <span className="value-badge">{speed}ms</span></label>
                  <input 
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={isRunning}
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

export default SelectionSortVisualizer;
