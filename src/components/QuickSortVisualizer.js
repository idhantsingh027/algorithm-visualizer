import React, { useState, useRef } from 'react';
import './Visualizer.css';

const quickSortCode = {
  python: [
    { line: 1, code: 'def quick_sort(arr, low, high):' },
    { line: 2, code: '    if low < high:' },
    { line: 3, code: '        pi = partition(arr, low, high)' },
    { line: 4, code: '        quick_sort(arr, low, pi - 1)' },
    { line: 5, code: '        quick_sort(arr, pi + 1, high)' },
    { line: 6, code: '' },
    { line: 7, code: 'def partition(arr, low, high):' },
    { line: 8, code: '    pivot = arr[high]' },
    { line: 9, code: '    i = low - 1' },
    { line: 10, code: '    for j in range(low, high):' },
    { line: 11, code: '        if arr[j] < pivot:' },
    { line: 12, code: '            i += 1' },
    { line: 13, code: '            arr[i], arr[j] = arr[j], arr[i]' },
    { line: 14, code: '    arr[i + 1], arr[high] = arr[high], arr[i + 1]' },
    { line: 15, code: '    return i + 1' }
  ],
  c: [
    { line: 1, code: 'int partition(int arr[], int low, int high) {' },
    { line: 2, code: '    int pivot = arr[high];' },
    { line: 3, code: '    int i = low - 1;' },
    { line: 4, code: '    for (int j = low; j < high; j++) {' },
    { line: 5, code: '        if (arr[j] < pivot) {' },
    { line: 6, code: '            i++;' },
    { line: 7, code: '            int temp = arr[i];' },
    { line: 8, code: '            arr[i] = arr[j];' },
    { line: 9, code: '            arr[j] = temp;' },
    { line: 10, code: '        }' },
    { line: 11, code: '    }' },
    { line: 12, code: '    int temp = arr[i + 1];' },
    { line: 13, code: '    arr[i + 1] = arr[high];' },
    { line: 14, code: '    arr[high] = temp;' },
    { line: 15, code: '    return i + 1;' },
    { line: 16, code: '}' },
    { line: 17, code: '' },
    { line: 18, code: 'void quickSort(int arr[], int low, int high) {' },
    { line: 19, code: '    if (low < high) {' },
    { line: 20, code: '        int pi = partition(arr, low, high);' },
    { line: 21, code: '        quickSort(arr, low, pi - 1);' },
    { line: 22, code: '        quickSort(arr, pi + 1, high);' },
    { line: 23, code: '    }' },
    { line: 24, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'int partition(vector<int>& arr, int low, int high) {' },
    { line: 2, code: '    int pivot = arr[high];' },
    { line: 3, code: '    int i = low - 1;' },
    { line: 4, code: '    for (int j = low; j < high; j++) {' },
    { line: 5, code: '        if (arr[j] < pivot) {' },
    { line: 6, code: '            i++;' },
    { line: 7, code: '            swap(arr[i], arr[j]);' },
    { line: 8, code: '        }' },
    { line: 9, code: '    }' },
    { line: 10, code: '    swap(arr[i + 1], arr[high]);' },
    { line: 11, code: '    return i + 1;' },
    { line: 12, code: '}' },
    { line: 13, code: '' },
    { line: 14, code: 'void quickSort(vector<int>& arr, int low, int high) {' },
    { line: 15, code: '    if (low < high) {' },
    { line: 16, code: '        int pi = partition(arr, low, high);' },
    { line: 17, code: '        quickSort(arr, low, pi - 1);' },
    { line: 18, code: '        quickSort(arr, pi + 1, high);' },
    { line: 19, code: '    }' },
    { line: 20, code: '}' }
  ]
};

function QuickSortVisualizer() {
  const [array, setArray] = useState([10, 7, 8, 9, 1, 5]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(1000);
  const [language, setLanguage] = useState('python');
  const [highlightedIndices, setHighlightedIndices] = useState({
    pivot: null,
    comparing: [],
    sorted: []
  });
  const [inputValue, setInputValue] = useState('10, 7, 8, 9, 1, 5');
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
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
    setCurrentLine(null);
    setHighlightedIndices({
      pivot: null,
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

  const partition = async (arr, low, high, allIndices) => {
    // Line mappings for partition function
    const lines = {
      python: { def: 7, pivot: 8, i: 9, forLoop: 10, compare: 11, increment: 12, swap: 13, finalSwap: 14, return: 15 },
      c: { def: 1, pivot: 2, i: 3, forLoop: 4, compare: 5, increment: 6, swap1: 7, swap2: 8, swap3: 9, finalSwap1: 12, finalSwap2: 13, finalSwap3: 14, return: 15 },
      cpp: { def: 1, pivot: 2, i: 3, forLoop: 4, compare: 5, increment: 6, swap: 7, finalSwap: 10, return: 11 }
    };
    const l = lines[language];

    setCurrentLine(l.def);
    await sleep(speed);

    setCurrentLine(l.pivot);
    const pivot = arr[high];
    // eslint-disable-next-line no-loop-func
    setHighlightedIndices({ pivot: high, comparing: [], sorted: allIndices.sorted });
    await sleep(speed);

    setCurrentLine(l.i);
    let i = low - 1;
    await sleep(speed);

    for (let j = low; j < high; j++) {
      setCurrentLine(l.forLoop);
      // eslint-disable-next-line no-loop-func
      setHighlightedIndices({ pivot: high, comparing: [j], sorted: allIndices.sorted });
      await sleep(speed);

      setCurrentLine(l.compare);
      await sleep(speed);

      if (arr[j] < pivot) {
        setCurrentLine(l.increment);
        i++;
        await sleep(speed);

        if (language === 'c') {
          setCurrentLine(l.swap1);
          await sleep(speed);
          setCurrentLine(l.swap2);
          await sleep(speed);
          setCurrentLine(l.swap3);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(speed);
        } else {
          setCurrentLine(l.swap);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
    }

    if (language === 'c') {
      setCurrentLine(l.finalSwap1);
      await sleep(speed);
      setCurrentLine(l.finalSwap2);
      await sleep(speed);
      setCurrentLine(l.finalSwap3);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      allIndices.sorted.push(i + 1);
      setHighlightedIndices({ pivot: null, comparing: [], sorted: allIndices.sorted });
      await sleep(speed);
    } else {
      setCurrentLine(l.finalSwap);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      allIndices.sorted.push(i + 1);
      setHighlightedIndices({ pivot: null, comparing: [], sorted: allIndices.sorted });
      await sleep(speed);
    }

    setCurrentLine(l.return);
    return i + 1;
  };

  const quickSortHelper = async (arr, low, high, allIndices) => {
    if (low >= high) {
      if (low === high && !allIndices.sorted.includes(low)) {
        allIndices.sorted.push(low);
      }
      return;
    }

    // Line mappings for quickSort function
    const lines = {
      python: { check: 2, partition: 3, leftCall: 4, rightCall: 5 },
      c: { check: 19, partition: 20, leftCall: 21, rightCall: 22 },
      cpp: { check: 15, partition: 16, leftCall: 17, rightCall: 18 }
    };
    const l = lines[language];

    setCurrentLine(l.check);
    await sleep(speed);

    setCurrentLine(l.partition);
    const pi = await partition(arr, low, high, allIndices);

    setCurrentLine(l.leftCall);
    await quickSortHelper(arr, low, pi - 1, allIndices);

    setCurrentLine(l.rightCall);
    await quickSortHelper(arr, pi + 1, high, allIndices);
  };

  const quickSort = async () => {
    setIsRunning(true);
    const arr = [...array];
    const allIndices = { sorted: [] };

    // Starting line for each language
    const startLines = {
      python: 1,
      c: 18,
      cpp: 14
    };

    setCurrentLine(startLines[language]);
    await sleep(speed);

    await quickSortHelper(arr, 0, arr.length - 1, allIndices);

    setHighlightedIndices({
      pivot: null,
      comparing: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i)
    });
    await sleep(speed);

    setIsRunning(false);
    setCurrentLine(null);
  };

  const getBarColor = (index) => {
    if (highlightedIndices.sorted.includes(index)) return '#4ade80';
    if (highlightedIndices.pivot === index) return '#ef4444';
    if (highlightedIndices.comparing.includes(index)) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">QUICK SORT</h1>
        <p className="algorithm-description">Picks a pivot element and partitions array around it, recursively sorting the partitions.</p>
        <div className="complexity-info">
          <span className="complexity-badge">Time: O(N log N)</span>
          <span className="complexity-badge">Space: O(log N)</span>
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
            {quickSortCode[language].map((lineObj) => (
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
              <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
              <span>Pivot</span>
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
                    placeholder="e.g., 10, 7, 8, 9, 1, 5"
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
                  onClick={quickSort}
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

export default QuickSortVisualizer;
