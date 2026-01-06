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
import SinglyLinkedListVisualizer from './components/SinglyLinkedListVisualizer';
import DoublyLinkedListVisualizer from './components/DoublyLinkedListVisualizer';
import CircularLinkedListVisualizer from './components/CircularLinkedListVisualizer';
import CircularDoublyLinkedListVisualizer from './components/CircularDoublyLinkedListVisualizer';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  // Sorting algorithms
  const sortingAlgorithms = [
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

  // Data structures (separate section from sorting)
  const dataStructureAlgorithms = [
    {
      id: 'singly-linked-list',
      name: 'SINGLY LINKED LIST',
      code: '00000111',
      complexity: '—',
      languages: ['PYTHON', 'C', 'C++']
    },
    {
      id: 'doubly-linked-list',
      name: 'DOUBLY LINKED LIST',
      code: '00001000',
      complexity: '—',
      languages: ['PYTHON', 'C', 'C++']
    },
    {
      id: 'circular-singly-linked-list',
      name: 'CIRCULAR SINGLY LINKED LIST',
      code: '00001001',
      complexity: '—',
      languages: ['PYTHON', 'C', 'C++']
    },
    {
      id: 'circular-doubly-linked-list',
      name: 'CIRCULAR DOUBLY LINKED LIST',
      code: '00001010',
      complexity: '—',
      languages: ['PYTHON', 'C', 'C++']
    }
  ];

  return (
    <div className="App">
      <Header />
      
      {!selectedAlgorithm ? (
        <main className="main-content">
          <h1 className="main-title">ALGORITHM VISUALIZER</h1>
          
          <h2 className="section-title">Sorting Algorithms</h2>
          <div className="algorithms-grid">
            {sortingAlgorithms.map(algo => (
              <AlgorithmCard
                key={algo.id}
                algorithm={algo}
                onClick={() => setSelectedAlgorithm(algo.id)}
              />
            ))}
          </div>

          <h2 className="section-title" style={{ marginTop: '48px' }}>Data Structures</h2>
          <div className="algorithms-grid">
            {dataStructureAlgorithms.map(algo => (
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
          {selectedAlgorithm === 'singly-linked-list' && <SinglyLinkedListVisualizer />}
          {selectedAlgorithm === 'doubly-linked-list' && <DoublyLinkedListVisualizer />}
          {selectedAlgorithm === 'circular-singly-linked-list' && <CircularLinkedListVisualizer />}
          {selectedAlgorithm === 'circular-doubly-linked-list' && <CircularDoublyLinkedListVisualizer />}
        </div>
      )}
    </div>
  );
}

export default App;
