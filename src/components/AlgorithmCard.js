import React from 'react';
import './AlgorithmCard.css';

function AlgorithmCard({ algorithm, onClick }) {
  return (
    <div 
      className={`algorithm-card ${algorithm.status === 'COMING SOON' ? 'disabled' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <span className="code-label">{algorithm.code}</span>
      </div>
      
      <h2 className="algorithm-name">{algorithm.name}</h2>
      
      {algorithm.status ? (
        <div className="status-badge">{algorithm.status}</div>
      ) : (
        <div className="languages">
          {algorithm.languages.map((lang, index) => (
            <span key={index} className="language-badge">
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlgorithmCard;
