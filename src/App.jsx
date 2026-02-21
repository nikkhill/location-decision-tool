import { useState } from 'react'
import './App.css'

function App() {
  const initialCriteria = [
    { id: 1, name: 'Stability # years', weight: 11, scores: { A: 1, B: 3, I: 5, N: 3 } },
    { id: 2, name: 'House', weight: 7, scores: { A: 2, B: 2, I: 5, N: 2 } },
    { id: 3, name: 'Easy travels', weight: 8, scores: { A: 2, B: 4, I: 3, N: 5 } },
    { id: 4, name: 'Family visits', weight: 10, scores: { A: 1, B: 3, I: 5, N: 3 } },
    { id: 5, name: 'Friends', weight: 6, scores: { A: 5, B: 2, I: 3, N: 1 } },
    { id: 6, name: 'Air quality', weight: 6, scores: { A: 5, B: 5, I: 1, N: 5 } },
    { id: 7, name: 'Outdoor activity', weight: 4, scores: { A: 5, B: 3, I: 2, N: 3 } },
    { id: 8, name: 'Low Bureaucracy', weight: 2, scores: { A: 4, B: 2, I: 1, N: 4 } },
    { id: 9, name: 'Tax outcome', weight: 4, scores: { A: 1, B: 2, I: 2, N: 3 } },
    { id: 10, name: 'Income', weight: 9, scores: { A: 4, B: 3, I: 1, N: 2 } },
  ]

  const locations = ['A', 'B', 'I', 'N']
  const [criteria, setCriteria] = useState(initialCriteria)
  const [newCriteriaName, setNewCriteriaName] = useState('')

  // Calculate weighted scores
  const calculateScores = () => {
    const scores = { A: 0, B: 0, I: 0, N: 0 }
    let totalWeight = 0

    criteria.forEach(criterion => {
      totalWeight += criterion.weight
      locations.forEach(loc => {
        scores[loc] += criterion.weight * criterion.scores[loc]
      })
    })

    return { scores, totalWeight }
  }

  const { scores: weightedScores, totalWeight } = calculateScores()

  // Update weight
  const updateWeight = (id, newWeight) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, weight: Math.max(0, newWeight) } : c
    ))
  }

  // Update score for a location
  const updateScore = (id, location, newScore) => {
    setCriteria(criteria.map(c => 
      c.id === id 
        ? { ...c, scores: { ...c.scores, [location]: Math.max(0, Math.min(5, newScore)) } }
        : c
    ))
  }

  // Add new criterion
  const addCriterion = () => {
    if (newCriteriaName.trim()) {
      const newId = Math.max(...criteria.map(c => c.id), 0) + 1
      setCriteria([...criteria, {
        id: newId,
        name: newCriteriaName,
        weight: 5,
        scores: { A: 3, B: 3, I: 3, N: 3 }
      }])
      setNewCriteriaName('')
    }
  }

  // Remove criterion
  const removeCriterion = (id) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  // Reset to initial
  const resetToInitial = () => {
    setCriteria(initialCriteria)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📍 Location Decision Matrix</h1>
        <p>Adjust weights and scores to find your best location match</p>
      </header>

      <div className="container">
        {/* Scores Summary */}
        <div className="scores-summary">
          <h2>Weighted Scores</h2>
          <div className="score-cards">
            {locations.map(loc => (
              <div key={loc} className="score-card">
                <div className="location-letter">{loc}</div>
                <div className="score-value">{weightedScores[loc].toFixed(0)}</div>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${(weightedScores[loc] / (totalWeight * 5)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria Matrix */}
        <div className="matrix-section">
          <h2>Decision Criteria</h2>
          <div className="criteria-list">
            {criteria.map(criterion => (
              <div key={criterion.id} className="criterion-row">
                <div className="criterion-name">
                  <input 
                    type="text" 
                    value={criterion.name}
                    onChange={(e) => {
                      setCriteria(criteria.map(c => 
                        c.id === criterion.id ? { ...c, name: e.target.value } : c
                      ))
                    }}
                    className="name-input"
                  />
                  <button 
                    onClick={() => removeCriterion(criterion.id)}
                    className="remove-btn"
                    title="Remove criterion"
                  >
                    ✕
                  </button>
                </div>

                <div className="weight-control">
                  <label>Weight</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={criterion.weight}
                    onChange={(e) => updateWeight(criterion.id, parseInt(e.target.value))}
                    className="slider"
                  />
                  <span className="weight-value">{criterion.weight}</span>
                </div>

                <div className="scores-row">
                  {locations.map(loc => (
                    <div key={loc} className="score-control">
                      <label>{loc}</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="5" 
                        value={criterion.scores[loc]}
                        onChange={(e) => updateScore(criterion.id, loc, parseInt(e.target.value))}
                        className="slider"
                      />
                      <span className="score-display">{criterion.scores[loc]}</span>
                    </div>
                  ))}
                </div>

                <div className="weighted-scores">
                  {locations.map(loc => (
                    <div key={loc} className="weighted-score">
                      <small>{(criterion.weight * criterion.scores[loc]).toFixed(0)}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Criterion */}
        <div className="add-criterion">
          <h3>Add New Criterion</h3>
          <div className="input-group">
            <input 
              type="text"
              value={newCriteriaName}
              onChange={(e) => setNewCriteriaName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
              placeholder="Enter criterion name..."
              className="criterion-input"
            />
            <button onClick={addCriterion} className="add-btn">Add</button>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button onClick={resetToInitial} className="reset-btn">Reset to Original</button>
        </div>
      </div>
    </div>
  )
}

export default App
