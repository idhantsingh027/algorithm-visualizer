import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import AlgorithmCard from './components/AlgorithmCard';
import SelectionSortVisualizer from './components/SelectionSortVisualizer';
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import InsertionSortVisualizer from './components/InsertionSortVisualizer';
import MergeSortVisualizer from './components/MergeSortVisualizer';
import QuickSortVisualizer from './components/QuickSortVisualizer';
import HeapSortVisualizer from './components/HeapSortVisualizer';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  const algorithms = [
    {
      id: 'selection-sort',
      name: 'SELECTION SORT',
      code: '00000001',
      complexity: 'O(N²)',
      languages: ['PYTHON', 'C', 'C++', 'O(N²)']
    },
    {
      id: 'bubble-sort',
      name: 'BUBBLE SORT',
      code: '00000010',
      complexity: 'O(N²)',
      languages: ['PYTHON', 'C', 'C++', 'O(N²)']
    },
    {
      id: 'insertion-sort',
      name: 'INSERTION SORT',
      code: '00000011',
      complexity: 'O(N²)',
      languages: ['PYTHON', 'C', 'C++', 'O(N²)']
    },
    {
      id: 'merge-sort',
      name: 'MERGE SORT',
      code: '00000100',
      complexity: 'O(N log N)',
      languages: ['PYTHON', 'C', 'C++', 'O(N log N)']
    },
    {
      id: 'quick-sort',
      name: 'QUICK SORT',
      code: '00000101',
      complexity: 'O(N log N)',
      languages: ['PYTHON', 'C', 'C++', 'O(N log N)']
    },
    {
      id: 'heap-sort',
      name: 'HEAP SORT',
      code: '00000110',
      complexity: 'O(N log N)',
      languages: ['PYTHON', 'C', 'C++', 'O(N log N)']
    }
  ];

  return (
    <div className="App">
      <Header />
      
      {!selectedAlgorithm ? (
        <main className="main-content">
          <h1 className="main-title">ALGORITHM VISUALIZER</h1>
          
          <div className="algorithms-grid">
            {algorithms.map(algo => (
              <AlgorithmCard 
                key={algo.id}
                algorithm={algo}
                onClick={() => setSelectedAlgorithm(algo.id)}
              />
            ))}
          </div>
        </main>
      ) : (
        <div className="visualizer-container">
          <button 
            className="back-button"
            onClick={() => setSelectedAlgorithm(null)}
          >
            ← Back to Algorithms
          </button>
          {selectedAlgorithm === 'selection-sort' && <SelectionSortVisualizer />}
          {selectedAlgorithm === 'bubble-sort' && <BubbleSortVisualizer />}
          {selectedAlgorithm === 'insertion-sort' && <InsertionSortVisualizer />}
          {selectedAlgorithm === 'merge-sort' && <MergeSortVisualizer />}
          {selectedAlgorithm === 'quick-sort' && <QuickSortVisualizer />}
          {selectedAlgorithm === 'heap-sort' && <HeapSortVisualizer />}
        </div>
      )}
    </div>
  );
}

export default App;
