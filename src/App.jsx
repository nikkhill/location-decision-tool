import { useState, useMemo } from 'react'
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

  const analysis = useMemo(() => {
    const scores = { A: 0, B: 0, I: 0, N: 0 }
    const contributors = { A: [], B: [], I: [], N: [] }
    let totalWeight = 0

    criteria.forEach(criterion => {
      totalWeight += criterion.weight
      locations.forEach(loc => {
        const contribution = criterion.weight * criterion.scores[loc]
        scores[loc] += contribution
        contributors[loc].push({
          name: criterion.name,
          contribution: contribution,
          weight: criterion.weight,
          score: criterion.scores[loc]
        })
      })
    })

    const topContributors = {}
    locations.forEach(loc => {
      topContributors[loc] = contributors[loc]
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 2)
    })

    const sortedLocations = locations.sort((a, b) => scores[b] - scores[a])
    const bestLocation = sortedLocations[0]
    const worstLocation = sortedLocations[sortedLocations.length - 1]

    return { scores, totalWeight, topContributors, bestLocation, worstLocation }
  }, [criteria])

  const updateWeight = (id, newWeight) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, weight: Math.max(0, newWeight) } : c
    ))
  }

  const updateScore = (id, location, newScore) => {
    setCriteria(criteria.map(c => 
      c.id === id 
        ? { ...c, scores: { ...c.scores, [location]: Math.max(0, Math.min(5, newScore)) } }
        : c
    ))
  }

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

  const removeCriterion = (id) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  const resetToInitial = () => {
    setCriteria(initialCriteria)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📍 Location Decision Matrix</h1>
        <p>Compare locations based on what matters most to you</p>
      </header>

      <div className="container">
        <div className="scores-summary">
          <h2>Location Scores</h2>
          <div className="score-cards">
            {locations.map(loc => {
              const score = analysis.scores[loc]
              const maxScore = analysis.totalWeight * 5
              const percentage = (score / maxScore) * 100
              const isBest = loc === analysis.bestLocation
              const isWorst = loc === analysis.worstLocation

              return (
                <div 
                  key={loc} 
                  className={`score-card ${isBest ? 'best' : ''} ${isWorst ? 'worst' : ''}`}
                >
                  <div className="card-header">
                    <div className="location-letter">{loc}</div>
                    {isBest && <span className="badge best-badge">🏆 Best Match</span>}
                  </div>

                  <div className="score-value">{score.toFixed(0)}</div>
                  
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="top-contributors">
                    <div className="contributors-label">Top factors:</div>
                    {analysis.topContributors[loc].length > 0 ? (
                      <ul className="contributors-list">
                        {analysis.topContributors[loc].map((contrib, idx) => (
                          <li key={idx} className="contributor-item">
                            <span className="contributor-name">{contrib.name}</span>
                            <span className="contributor-value">+{contrib.contribution.toFixed(0)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-contributors">No data</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="matrix-section">
          <div className="matrix-header">
            <h2>Decision Criteria</h2>
            <span className="criteria-count">{criteria.length} criteria</span>
          </div>
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

        <div className="actions">
          <button onClick={resetToInitial} className="reset-btn">Reset to Original</button>
        </div>
      </div>
    </div>
  )
}

export default App
