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
  const [expandedCriteria, setExpandedCriteria] = useState(null)

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

    const sortedLocations = [...locations].sort((a, b) => scores[b] - scores[a])
    const bestLocation = sortedLocations[0]

    return { scores, totalWeight, topContributors, bestLocation }
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
        <h1>📍 Decision Matrix</h1>
        <p>Find your best location match</p>
      </header>

      <div className="container">
        {/* Scores Summary - Compact Cards */}
        <section className="scores-section">
          <h2>Scores</h2>
          <div className="score-cards">
            {locations.map(loc => {
              const score = analysis.scores[loc]
              const maxScore = analysis.totalWeight * 5
              const percentage = (score / maxScore) * 100
              const isBest = loc === analysis.bestLocation

              return (
                <div 
                  key={loc} 
                  className={`score-card ${isBest ? 'best' : ''}`}
                >
                  <div className="score-location">{loc}</div>
                  <div className="score-number">{score.toFixed(0)}</div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  {isBest && <div className="best-label">Best</div>}
                  
                  <div className="top-factors">
                    {analysis.topContributors[loc].map((contrib, idx) => (
                      <div key={idx} className="factor">
                        <span className="factor-name">{contrib.name}</span>
                        <span className="factor-value">+{contrib.contribution.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Criteria List - Accordion Style */}
        <section className="criteria-section">
          <div className="section-header">
            <h2>Criteria ({criteria.length})</h2>
            <button className="reset-btn" onClick={resetToInitial}>Reset</button>
          </div>
          
          <div className="criteria-list">
            {criteria.map(criterion => (
              <div 
                key={criterion.id} 
                className={`criterion-card ${expandedCriteria === criterion.id ? 'expanded' : ''}`}
              >
                <div 
                  className="criterion-header"
                  onClick={() => setExpandedCriteria(expandedCriteria === criterion.id ? null : criterion.id)}
                >
                  <div className="criterion-title">
                    <span className="criterion-name">{criterion.name}</span>
                    <span className="criterion-weight">Weight: {criterion.weight}</span>
                  </div>
                  <button 
                    className="expand-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCriterion(criterion.id)
                    }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>

                {expandedCriteria === criterion.id && (
                  <div className="criterion-content">
                    <div className="weight-slider">
                      <label>Importance</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={criterion.weight}
                        onChange={(e) => updateWeight(criterion.id, parseInt(e.target.value))}
                        className="slider"
                      />
                      <span className="value">{criterion.weight}</span>
                    </div>

                    <div className="scores-grid">
                      {locations.map(loc => (
                        <div key={loc} className="score-input">
                          <label>{loc}</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="5" 
                            value={criterion.scores[loc]}
                            onChange={(e) => updateScore(criterion.id, loc, parseInt(e.target.value))}
                            className="slider"
                          />
                          <span className="value">{criterion.scores[loc]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Add Criterion */}
        <section className="add-section">
          <div className="input-group">
            <input 
              type="text"
              value={newCriteriaName}
              onChange={(e) => setNewCriteriaName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
              placeholder="Add new criterion..."
              className="criterion-input"
            />
            <button onClick={addCriterion} className="add-btn">+</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
