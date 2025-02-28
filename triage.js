// Emergency Triage Decision-Making Mini-Simulation
const { useState } = React;

// Icons (simplified for this version)
const Icons = {
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  RefreshCw: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Award: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  )
};

const TriageSimulation = () => {
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'results'
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scenarioStartTime, setScenarioStartTime] = useState(null);
  
  // Simplified triage scenarios
  const scenarios = [
    {
      id: 1,
      description: "Male, 45, clutching chest, sweating profusely, reports 8/10 pain radiating to left arm. HR 110, BP 160/95, oxygen saturation 94%.",
      vitals: {
        hr: 110,
        bp: "160/95",
        o2: "94%",
        resp: 22,
        temp: 37.2
      },
      options: [
        { id: 'red', text: "RED - Immediate attention required", correct: true },
        { id: 'yellow', text: "YELLOW - Urgent but can wait briefly", correct: false },
        { id: 'green', text: "GREEN - Non-urgent, stable condition", correct: false },
      ],
      explanation: "These are classic symptoms of a myocardial infarction (heart attack) requiring immediate intervention."
    },
    {
      id: 2,
      description: "Female, 32, twisted ankle 30 minutes ago. Moderate swelling, pain 5/10, can bear some weight. Vital signs normal.",
      vitals: {
        hr: 72,
        bp: "120/80",
        o2: "99%",
        resp: 16,
        temp: 36.8
      },
      options: [
        { id: 'red', text: "RED - Immediate attention required", correct: false },
        { id: 'yellow', text: "YELLOW - Urgent but can wait briefly", correct: false },
        { id: 'green', text: "GREEN - Non-urgent, stable condition", correct: true },
      ],
      explanation: "This is a typical soft tissue injury with stable vital signs and moderate pain."
    },
    {
      id: 3,
      description: "Child, 4, high fever (39.5°C), lethargic, purple rash that doesn't blanch when pressed. Parent reports rapid onset within last hour.",
      vitals: {
        hr: 135,
        bp: "90/60",
        o2: "96%",
        resp: 28,
        temp: 39.5
      },
      options: [
        { id: 'red', text: "RED - Immediate attention required", correct: true },
        { id: 'yellow', text: "YELLOW - Urgent but can wait briefly", correct: false },
        { id: 'green', text: "GREEN - Non-urgent, stable condition", correct: false },
      ],
      explanation: "The non-blanching rash combined with fever and lethargy suggests possible meningococcal infection, which can be rapidly fatal."
    },
    {
      id: 4,
      description: "Female, 67, sudden onset of facial drooping, right arm weakness, and slurred speech. Symptoms began 35 minutes ago.",
      vitals: {
        hr: 92,
        bp: "178/100",
        o2: "95%",
        resp: 20,
        temp: 37.1
      },
      options: [
        { id: 'red', text: "RED - Immediate attention required", correct: true },
        { id: 'yellow', text: "YELLOW - Urgent but can wait briefly", correct: false },
        { id: 'green', text: "GREEN - Non-urgent, stable condition", correct: false },
      ],
      explanation: "These are classic signs of a stroke. With symptom onset within the last hour, this patient may be a candidate for thrombolytic therapy."
    }
  ];
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setAnswers([]);
    setScenarioStartTime(Date.now());
  };
  
  // Handle answer selection
  const selectAnswer = (optionId) => {
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(option => option.id === optionId);
    const responseTime = (Date.now() - scenarioStartTime) / 1000;
    
    // Calculate points
    const isCorrect = selectedOption.correct;
    let pointsEarned = 0;
    
    if (isCorrect) {
      // Base points for correct answer
      pointsEarned = 100;
      
      // Time bonus
      if (responseTime < 5) {
        pointsEarned += 50;
      } else if (responseTime < 10) {
        pointsEarned += 30;
      } else if (responseTime < 15) {
        pointsEarned += 10;
      }
    }
    
    // Save the answer
    setAnswers([...answers, {
      scenarioId: scenario.id,
      selected: optionId,
      correct: isCorrect,
      responseTime,
      pointsEarned
    }]);
    
    // Update score
    setScore(score + pointsEarned);
    
    // Move to next scenario or end game
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setScenarioStartTime(Date.now());
    } else {
      setGameState('results');
    }
  };
  
  // Restart the game
  const restartGame = () => {
    startGame();
  };
  
  // Render functions
  const renderIntro = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto" style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "24px", maxWidth: "500px", margin: "0 auto"}}>
      <h2 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2c5282"}}>Emergency Triage Decision-Making</h2>
      <p style={{marginBottom: "16px"}}>
        This mini-simulation will test your ability to quickly assess patients and assign 
        appropriate triage categories in an emergency setting.
      </p>
      
      <div style={{backgroundColor: "#ebf8ff", borderLeft: "4px solid #4299e1", padding: "16px", marginBottom: "24px"}}>
        <h3 style={{fontWeight: "bold", color: "#2c5282", marginBottom: "4px"}}>How to Play:</h3>
        <ol style={{paddingLeft: "20px"}}>
          <li>You'll be presented with patient scenarios</li>
          <li>For each patient, you must decide their triage category</li>
          <li>Respond as quickly as possible - time affects your score</li>
          <li>At the end, you'll see how you performed and explanations</li>
        </ol>
      </div>
      
      <div style={{marginBottom: "24px"}}>
        <h3 style={{fontWeight: "bold", color: "#2c5282", marginBottom: "4px"}}>Triage Categories:</h3>
        <ul style={{margin: "0", paddingLeft: "0", listStyle: "none"}}>
          <li style={{display: "flex", alignItems: "center", marginBottom: "8px"}}>
            <div style={{width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#f56565", marginRight: "8px"}}></div>
            <span><strong>RED</strong> - Immediate, life-threatening</span>
          </li>
          <li style={{display: "flex", alignItems: "center", marginBottom: "8px"}}>
            <div style={{width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ecc94b", marginRight: "8px"}}></div>
            <span><strong>YELLOW</strong> - Urgent, but can briefly wait</span>
          </li>
          <li style={{display: "flex", alignItems: "center"}}>
            <div style={{width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#48bb78", marginRight: "8px"}}></div>
            <span><strong>GREEN</strong> - Non-urgent, stable condition</span>
          </li>
        </ul>
      </div>
      
      <button 
        onClick={startGame}
        style={{
          backgroundColor: "#3182ce", 
          color: "white", 
          padding: "12px 24px", 
          borderRadius: "8px", 
          width: "100%", 
          fontWeight: "bold", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          border: "none",
          cursor: "pointer"
        }}
      >
        Start Simulation <span style={{marginLeft: "8px"}}><Icons.ChevronRight /></span>
      </button>
    </div>
  );
  
  const renderPlaying = () => {
    const scenario = scenarios[currentScenario];
    
    return (
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "24px", maxWidth: "500px", margin: "0 auto"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
          <div style={{fontSize: "14px", fontWeight: "500", color: "#718096"}}>
            Scenario {currentScenario + 1} of {scenarios.length}
          </div>
          <div style={{display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "500", color: "#dd6b20"}}>
            <span style={{marginRight: "4px"}}><Icons.Clock /></span> Decide quickly!
          </div>
        </div>
        
        <div style={{marginBottom: "24px", backgroundColor: "#f7fafc", padding: "16px", borderRadius: "6px", border: "1px solid #e2e8f0"}}>
          <h3 style={{fontWeight: "bold", color: "#2d3748", marginBottom: "8px"}}>Patient Presentation:</h3>
          <p style={{color: "#4a5568"}}>{scenario.description}</p>
        </div>
        
        <div style={{marginBottom: "24px"}}>
          <h3 style={{fontWeight: "bold", color: "#2d3748", marginBottom: "8px"}}>Vital Signs:</h3>
          <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px"}}>
            <div style={{backgroundColor: "#ebf8ff", padding: "8px", borderRadius: "4px", textAlign: "center"}}>
              <div style={{fontSize: "12px", color: "#718096"}}>HR</div>
              <div style={{fontWeight: "bold", color: "#2c5282"}}>{scenario.vitals.hr}</div>
            </div>
            <div style={{backgroundColor: "#ebf8ff", padding: "8px", borderRadius: "4px", textAlign: "center"}}>
              <div style={{fontSize: "12px", color: "#718096"}}>BP</div>
              <div style={{fontWeight: "bold", color: "#2c5282"}}>{scenario.vitals.bp}</div>
            </div>
            <div style={{backgroundColor: "#ebf8ff", padding: "8px", borderRadius: "4px", textAlign: "center"}}>
              <div style={{fontSize: "12px", color: "#718096"}}>O₂</div>
              <div style={{fontWeight: "bold", color: "#2c5282"}}>{scenario.vitals.o2}</div>
            </div>
            <div style={{backgroundColor: "#ebf8ff", padding: "8px", borderRadius: "4px", textAlign: "center"}}>
              <div style={{fontSize: "12px", color: "#718096"}}>RESP</div>
              <div style={{fontWeight: "bold", color: "#2c5282"}}>{scenario.vitals.resp}</div>
            </div>
            <div style={{backgroundColor: "#ebf8ff", padding: "8px", borderRadius: "4px", textAlign: "center"}}>
              <div style={{fontSize: "12px", color: "#718096"}}>TEMP</div>
              <div style={{fontWeight: "bold", color: "#2c5282"}}>{scenario.vitals.temp}°C</div>
            </div>
          </div>
        </div>
        
        <h3 style={{fontWeight: "bold", color: "#2d3748", marginBottom: "8px"}}>Assign Triage Category:</h3>
        <div>
          {scenario.options.map(option => (
            <button
              key={option.id}
              onClick={() => selectAnswer(option.id)}
              style={{
                width: "100%", 
                textAlign: "left", 
                padding: "16px", 
                marginBottom: "12px",
                borderRadius: "6px", 
                border: "1px solid",
                transition: "background-color 0.2s",
                cursor: "pointer",
                backgroundColor: option.id === 'red' ? "#fed7d7" : 
                                 option.id === 'yellow' ? "#fefcbf" : 
                                 "#c6f6d5",
                borderColor: option.id === 'red' ? "#feb2b2" : 
                             option.id === 'yellow' ? "#faf089" : 
                             "#9ae6b4"
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const totalCorrect = answers.filter(a => a.correct).length;
    const percentCorrect = (totalCorrect / scenarios.length) * 100;
    const avgResponseTime = answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length;
    
    let feedback;
    if (percentCorrect >= 80) {
      feedback = "Excellent work! Your triage decisions were fast and accurate.";
    } else if (percentCorrect >= 60) {
      feedback = "Good job! With more practice, you can improve your accuracy and speed.";
    } else {
      feedback = "This is challenging! Review the explanations and try again to improve your score.";
    }
    
    return (
      <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "24px", maxWidth: "500px", margin: "0 auto"}}>
        <h2 style={{fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2c5282"}}>Simulation Results</h2>
        
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", backgroundColor: "#ebf8ff", padding: "16px", borderRadius: "8px"}}>
          <div style={{textAlign: "center"}}>
            <div style={{fontSize: "14px", color: "#718096"}}>Final Score</div>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#2c5282"}}>{score}</div>
          </div>
          <div style={{textAlign: "center"}}>
            <div style={{fontSize: "14px", color: "#718096"}}>Accuracy</div>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#2c5282"}}>{percentCorrect.toFixed(0)}%</div>
          </div>
          <div style={{textAlign: "center"}}>
            <div style={{fontSize: "14px", color: "#718096"}}>Avg Response</div>
            <div style={{fontSize: "24px", fontWeight: "bold", color: "#2c5282"}}>{avgResponseTime.toFixed(1)}s</div>
          </div>
        </div>
        
        <div style={{marginBottom: "24px"}}>
          <p style={{fontStyle: "italic", color: "#4a5568"}}>{feedback}</p>
        </div>
        
        <div style={{marginBottom: "24px"}}>
          <h3 style={{fontWeight: "bold", color: "#2d3748", marginBottom: "12px"}}>Your Answers:</h3>
          {answers.map((answer, index) => {
            const scenario = scenarios.find(s => s.id === answer.scenarioId);
            return (
              <div 
                key={index} 
                style={{
                  marginBottom: "16px", 
                  padding: "16px", 
                  borderRadius: "6px", 
                  backgroundColor: answer.correct ? "#f0fff4" : "#fff5f5",
                  borderLeft: "4px solid",
                  borderLeftColor: answer.correct ? "#48bb78" : "#f56565"
                }}
              >
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{fontWeight: "500"}}>Scenario {index + 1}</div>
                  <div style={{fontSize: "14px", color: "#718096"}}>
                    {answer.responseTime.toFixed(1)}s • {answer.pointsEarned} pts
                  </div>
                </div>
                <p style={{fontSize: "14px", color: "#4a5568", marginTop: "4px", marginBottom: "8px"}}>
                  {scenario.description.substring(0, 100)}...
                </p>
                <div style={{
                  fontSize: "14px", 
                  color: answer.correct ? "#2f855a" : "#c53030",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <span style={{marginRight: "4px"}}>
                    {answer.correct ? <Icons.Award /> : <Icons.AlertCircle />}
                  </span>
                  {answer.correct ? "Correct decision" : "Incorrect decision"}
                </div>
                <div style={{marginTop: "8px", fontSize: "14px", color: "#4a5568"}}>
                  <strong>Why:</strong> {scenario.explanation}
                </div>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={restartGame}
          style={{
            backgroundColor: "#3182ce", 
            color: "white", 
            padding: "12px 24px", 
            borderRadius: "8px", 
            width: "100%", 
            fontWeight: "bold", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            marginBottom: "24px"
          }}
        >
          <span style={{marginRight: "8px"}}><Icons.RefreshCw /></span> Try Again
        </button>
        
        <div style={{marginTop: "24px", fontSize: "14px", color: "#718096", textAlign: "center"}}>
          <p>This is a simplified demo. Medical professionals use much more sophisticated VR training with realistic 3D environments and complex patient scenarios.</p>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div style={{padding: "16px"}}>
      {gameState === 'intro' && renderIntro()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'results' && renderResults()}
    </div>
  );
};

// Render the app
ReactDOM.render(<TriageSimulation />, document.getElementById('app'));
