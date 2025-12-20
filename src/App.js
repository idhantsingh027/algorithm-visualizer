import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import AlgorithmCard from './components/AlgorithmCard';
import SelectionSortVisualizer from './components/SelectionSortVisualizer';

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
      status: 'COMING SOON',
      complexity: 'O(N²)',
      languages: ['PYTHON', 'C', 'C++', 'O(N²)']
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
                onClick={() => {
                  if (algo.status !== 'COMING SOON') {
                    setSelectedAlgorithm(algo.id);
                  }
                }}
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
        </div>
      )}
    </div>
  );
}

export default App;
