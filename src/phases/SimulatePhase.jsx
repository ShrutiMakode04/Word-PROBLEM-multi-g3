import { useState, useEffect, useRef } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function SimulatePhase({ onNext }) {
  const [station, setStation] = useState(1);
  const [round, setRound] = useState(1);
  const [interactiveState, setInteractiveState] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Configuration for 5 stations x 3 rounds
  const STATIONS = {
    1: { // Drag & Drop
      title: "Equal Groups: Packing Cupcakes",
      instruction: (g, s) => `Emma is packing ${g} boxes. Drag ${s} cupcakes into each box!`,
      rounds: [{ groups: 2, size: 3 }, { groups: 3, size: 4 }, { groups: 4, size: 2 }]
    },
    2: { // Slider
      title: "Measurement: Building a Bridge",
      instruction: (g, s) => `John is building a bridge with ${g} planks. Each plank is ${s}m long. Drag the slider to add planks!`,
      rounds: [{ groups: 3, size: 5 }, { groups: 4, size: 4 }, { groups: 5, size: 2 }]
    },
    3: { // Stamp Array
      title: "Arrays: Stamping Stars",
      instruction: (g, s) => `Drag the stamp to the paper to add a group of ${s} stars! Do this ${g} times.`,
      rounds: [{ groups: 3, size: 3 }, { groups: 4, size: 5 }, { groups: 2, size: 6 }]
    },
    4: { // Drag Weights Balance
      title: "Compare: Balance the Scale",
      instruction: (g, s) => `A melon weighs ${s} units. A golden melon weighs ${g} times as much. Drag ${s}-unit weights to balance it!`,
      rounds: [{ groups: 3, size: 2 }, { groups: 4, size: 3 }, { groups: 2, size: 5 }]
    },
    5: { // Toy Train Assembly
      title: "Length: Toy Train Assembly",
      instruction: (g, s) => `Connect ${g} train cars. Each car is ${s} meters long! Drag the car to the track.`,
      rounds: [{ groups: 3, size: 4 }, { groups: 4, size: 2 }, { groups: 5, size: 3 }]
    }
  };

  const currentStation = STATIONS[station];
  const currentRound = currentStation.rounds[round - 1];
  const g = currentRound.groups;
  const s = currentRound.size;
  const total = g * s;

  // Audio playing on station mount
  useEffect(() => {
    return () => audioManager.stop();
  }, []);

  useEffect(() => {
    const introKey = `sim_intro_${station}_${round}`;
    audioManager.play(introKey);
  }, [station, round]);

  const handleCompleteSimulation = () => {
    // When simulation mechanic is completed
  };

  const nextSimulation = () => {
    if (round < 3) {
      setRound(r => r + 1);
      setInteractiveState(0);
      setSolved(false);
      setWrongAttempt(false);
    } else if (station < 5) {
      setStation(st => st + 1);
      setRound(1);
      setInteractiveState(0);
      setSolved(false);
      setWrongAttempt(false);
    } else {
      onNext();
    }
  };



  // ---------------------------------------------------------
  // STATION 1: Drag & Drop (Boxes)
  // interactiveState will be an array mapping boxIndex -> current items inside
  const [boxState, setBoxState] = useState([]);
  useEffect(() => {
    setBoxState(Array(g).fill(0));
    setInteractiveState(0);
  }, [station, round, g]);

  const onDragStart = (e, itemType) => { e.dataTransfer.setData("item", itemType); };
  const onDropBox = (e, boxIndex) => {
    e.preventDefault();
    if (boxState[boxIndex] < s) {
      const newBoxes = [...boxState];
      newBoxes[boxIndex]++;
      setBoxState(newBoxes);
    }
  };

  // ---------------------------------------------------------
  // STATION 2: Slider (Planks)
  // interactiveState is the number of planks placed (0 to g)
  // ---------------------------------------------------------
  
  // STATION 3: Stamp (Arrays)
  // interactiveState is number of stamps placed
  const onDropStamp = (e) => {
    e.preventDefault();
    if (interactiveState < g) {
      setInteractiveState(interactiveState + 1);
    }
  };

  // ---------------------------------------------------------
  // STATION 4: Balance Scale
  // interactiveState is number of weights on right scale
  const onDropScale = (e) => {
    e.preventDefault();
    if (interactiveState < g) {
      setInteractiveState(interactiveState + 1);
    }
  };

  // ---------------------------------------------------------
  // STATION 5: Toy Train Assembly
  // interactiveState is number of cars connected
  const onDropTrain = (e) => {
    e.preventDefault();
    if (interactiveState < g) {
      setInteractiveState(interactiveState + 1);
    }
  };

  // Helper variables
  let isSimComplete = false;
  if (station === 1) isSimComplete = boxState.every(c => c === s) && boxState.length > 0;
  if (station === 2) isSimComplete = interactiveState === g;
  if (station === 3) isSimComplete = interactiveState === g;
  if (station === 4) isSimComplete = interactiveState === g;
  if (station === 5) isSimComplete = interactiveState === g;

  useEffect(() => {
    if (isSimComplete && !solved) {
      audioManager.play('very_good');
      setSolved(true);
    }
  }, [isSimComplete, solved]);

  return (
    <div className="simulate-phase" style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }} onMouseUp={() => setIsMouseDown(false)} onMouseLeave={() => setIsMouseDown(false)}>
      <div className="simulate-header" style={{ flexShrink: 0 }}>
        <div className="simulate-label">Station {station} of 5 — Round {round} of 3</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', margin: '10px 0', fontSize: '2rem' }}>{currentStation.title}</h2>
        <div className="simulate-tip" style={{ fontSize: '1.2rem', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {currentStation.instruction(g, s)}
        </div>
      </div>

      <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '20px', width: '100%', maxWidth: '900px', alignSelf: 'center' }}>
        
        {/* STATION 1: Drag & Drop */}
        {station === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
            {/* Draggable Cupcake Pile */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', border: '2px dashed var(--gold)' }}>
              {!isSimComplete && (
                <div draggable onDragStart={(e) => onDragStart(e, 'cupcake')} style={{ fontSize: '3.5rem', cursor: 'grab', transition: 'transform 0.2s' }} onMouseOver={e=>e.target.style.transform='scale(1.2)'} onMouseOut={e=>e.target.style.transform='scale(1)'}>
                  🧁 <span style={{fontSize:'1rem', display:'block', textAlign:'center'}}>Drag Me!</span>
                </div>
              )}
              {isSimComplete && <div style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>All packed!</div>}
            </div>

            {/* Target Boxes */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {boxState.map((count, i) => (
                <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropBox(e, i)} style={{ width: '130px', minHeight: '150px', background: 'rgba(255, 152, 0, 0.2)', border: count === s ? '3px solid #4caf50' : '3px dashed var(--gold)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', transition: '0.3s' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#fff' }}>Box {i + 1}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                    {Array.from({length: count}).map((_, j) => (
                      <span key={j} style={{ fontSize: '2rem', animation: 'bounceIn 0.3s' }}>🧁</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: '0.9rem', color: count === s ? '#4caf50' : '#aaa' }}>
                    {count}/{s}
                  </div>
                </div>
              ))}
            </div>

            {solved && (
              <div style={{ animation: 'bounceIn 1s', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--gold)', background: 'rgba(0,0,0,0.5)', padding: '15px 35px', borderRadius: '15px', marginTop: '20px', textAlign: 'center' }}>
                {g} boxes × {s} cupcakes = {total} cupcakes
              </div>
            )}
          </div>
        )}

        {/* STATION 2: Slider */}
        {station === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
            <div style={{ display: 'flex', width: '100%', maxWidth: '700px', height: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
              {Array.from({length: interactiveState}).map((_, i) => (
                <div key={i} style={{ width: `${100 / g}%`, height: '100%', background: '#8d6e63', borderRight: '2px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', animation: 'fadeIn 0.3s' }}>
                  {s}m Plank
                </div>
              ))}
            </div>
            
            {!isSimComplete && (
              <div style={{ width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>0 planks</span>
                  <span>{g} planks</span>
                </div>
                <input type="range" min="0" max={g} value={interactiveState} onChange={(e) => setInteractiveState(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--gold)' }} />
              </div>
            )}



            {solved && (
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--blue-bright)', animation: 'bounceIn 0.5s', background: 'rgba(0,0,0,0.5)', padding: '15px 35px', borderRadius: '15px', marginTop: '20px', textAlign: 'center' }}>
                {g} planks × {s}m = {total}m
              </div>
            )}
          </div>
        )}

        {/* STATION 3: Stamping Stars */}
        {station === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
            
            <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Draggable Stamp */}
              {!isSimComplete && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div draggable onDragStart={(e) => onDragStart(e, 'stamp')} style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', border: '3px solid var(--gold)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'grab', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                     <span style={{ fontSize: '3rem' }}>🌟</span>
                     <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>x{s}</span>
                  </div>
                  <div style={{ color: 'var(--gold)', marginTop: '10px' }}>Drag Me!</div>
                </div>
              )}

              {/* Target Paper */}
              <div onDragOver={(e) => e.preventDefault()} onDrop={onDropStamp} style={{ width: '100%', maxWidth: '400px', minHeight: '300px', background: '#fff', border: '5px solid #ccc', borderRadius: '5px', display: 'flex', flexDirection: 'column', padding: '20px', gap: '10px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)', position: 'relative' }}>
                {Array.from({length: interactiveState}).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', animation: 'bounceIn 0.3s' }}>
                    {Array.from({length: s}).map((_, j) => (
                      <span key={j} style={{ fontSize: '2rem', color: 'var(--gold)' }}>⭐</span>
                    ))}
                  </div>
                ))}
                {!isSimComplete && interactiveState === 0 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ccc', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    Drop Stamp Here
                  </div>
                )}
              </div>
            </div>

            {solved && (
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--green-light)', animation: 'bounceIn 0.5s', background: 'rgba(0,0,0,0.5)', padding: '15px 35px', borderRadius: '15px', marginTop: '20px', textAlign: 'center' }}>
                {g} stamps × {s} stars = {total} stars
              </div>
            )}
          </div>
        )}

        {/* STATION 4: Balance Scale */}
        {station === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
            
            {/* The Scale */}
            <div style={{ width: '100%', maxWidth: '400px', height: '200px', borderBottom: '10px solid #795548', position: 'relative', transition: 'transform 0.5s', transform: `rotate(${(g - interactiveState) * -5}deg)`, margin: '0 auto' }}>
              <div style={{ position: 'absolute', top: '-100px', left: '10%', width: '100px', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontSize: '4rem' }}>🍈</span>
              </div>
              <div onDragOver={(e) => e.preventDefault()} onDrop={onDropScale} style={{ position: 'absolute', top: '-100px', right: '5%', width: '150px', minHeight: '120px', background: 'rgba(255,255,255,0.1)', border: '3px dashed var(--gold)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '10px', zIndex: 5 }}>
                {Array.from({length: interactiveState}).map((_, i) => (
                  <div key={i} style={{ width: '60px', height: '20px', background: '#9e9e9e', border: '2px solid #616161', borderRadius: '5px', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{s}kg</div>
                ))}
              </div>
              {/* Fulcrum */}
              <div style={{ position: 'absolute', bottom: '-40px', left: 'calc(50% - 20px)', width: '0', height: '0', borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '40px solid #5d4037' }}></div>
            </div>

            {!isSimComplete && (
              <div style={{ display: 'flex', gap: '20px', marginTop: '60px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px' }}>
                <div draggable onDragStart={(e) => onDragStart(e, 'weight')} style={{ width: '80px', height: '40px', background: '#9e9e9e', border: '3px solid #616161', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'grab' }}>
                  {s}kg
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>Drag weight to the right scale!</div>
              </div>
            )}



            {solved && (
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--gold)', animation: 'bounceIn 0.5s', background: 'rgba(0,0,0,0.5)', padding: '15px 35px', borderRadius: '15px', marginTop: '40px', textAlign: 'center' }}>
                {g} weights × {s}kg = {total}kg
              </div>
            )}
          </div>
        )}

        {/* STATION 5: Toy Train Assembly */}
        {station === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
            
            <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Draggable Train Car */}
              {!isSimComplete && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div draggable onDragStart={(e) => onDragStart(e, 'train')} style={{ width: '120px', height: '80px', background: 'rgba(255,255,255,0.1)', border: '3px solid var(--gold)', borderRadius: '10px 10px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'grab', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', position: 'relative' }}>
                     <span style={{ fontSize: '2.5rem' }}>🚂</span>
                     <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>{s}m</span>
                     <div style={{ display: 'flex', gap: '20px', position: 'absolute', bottom: '-15px' }}>
                       <div style={{ width: '20px', height: '20px', background: '#333', borderRadius: '50%', border: '2px solid #aaa' }}></div>
                       <div style={{ width: '20px', height: '20px', background: '#333', borderRadius: '50%', border: '2px solid #aaa' }}></div>
                     </div>
                  </div>
                  <div style={{ color: 'var(--gold)', marginTop: '20px' }}>Drag Me!</div>
                </div>
              )}

              {/* Target Track */}
              <div onDragOver={(e) => e.preventDefault()} onDrop={onDropTrain} style={{ width: '100%', maxWidth: '600px', minHeight: '150px', background: 'rgba(0,0,0,0.2)', borderBottom: '6px solid #4e342e', display: 'flex', alignItems: 'flex-end', paddingBottom: '5px', paddingLeft: '10px', gap: '2px', position: 'relative', overflow: 'hidden' }}>
                {Array.from({length: interactiveState}).map((_, i) => (
                  <div key={i} style={{ width: `${100/g}%`, maxWidth: '120px', height: '80px', background: i === 0 ? '#ff9800' : '#2196f3', borderRadius: '10px 10px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'slideRight 0.3s ease-out', position: 'relative', border: '2px solid #fff' }}>
                     <span style={{ fontSize: '2rem' }}>{i === 0 ? '🚂' : '🚃'}</span>
                     <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>{s}m</span>
                     <div style={{ display: 'flex', gap: '20px', position: 'absolute', bottom: '-12px' }}>
                       <div style={{ width: '15px', height: '15px', background: '#333', borderRadius: '50%', border: '2px solid #aaa' }}></div>
                       <div style={{ width: '15px', height: '15px', background: '#333', borderRadius: '50%', border: '2px solid #aaa' }}></div>
                     </div>
                  </div>
                ))}
                {!isSimComplete && interactiveState === 0 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ccc', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    Drop Train Here
                  </div>
                )}
              </div>
            </div>

            {solved && (
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--green-light)', animation: 'bounceIn 0.5s', background: 'rgba(0,0,0,0.5)', padding: '15px 35px', borderRadius: '15px', marginTop: '20px', textAlign: 'center' }}>
                {g} cars × {s}m = {total}m
              </div>
            )}
          </div>
        )}

      </div>

      <div style={{ marginTop: '30px', height: '80px', display: 'flex', justifyContent: 'center' }}>
        {solved && (
          <button className="btn btn-primary btn-lg" onClick={nextSimulation} style={{ animation: 'bounceIn 0.5s', fontSize: '1.5rem', padding: '15px 40px' }}>
            {round === 3 && station === 5 ? 'To Practice Phase!' : round === 3 ? 'Next Station' : 'Next Round'} <ArrowRight size={24} />
          </button>
        )}
      </div>
      <style>{`
        @keyframes slideRight { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
