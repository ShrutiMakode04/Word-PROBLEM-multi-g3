import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import WelcomePhase from './phases/WelcomePhase';
import WonderPhase from './phases/WonderPhase';
import StoryPhase from './phases/StoryPhase';
import SimulatePhase from './phases/SimulatePhase';
import PlayPhase from './phases/PlayPhase';
import ReflectPhase from './phases/ReflectPhase';
import GlobalHeader from './components/GlobalHeader';
import { audioManager } from './utils/audio';

export default function App() {
  const [phase, setPhase] = useState('welcome');
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  const handleNext = (nextPhase) => {
    setPhase(nextPhase);
  };

  const handleComplete = (finalScore) => {
    setScore(finalScore);
    setPhase('reflect');
  };

  const handleRestart = () => {
    setScore(0);
    setPhase('welcome');
  };

  const toggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="app-container">
      <GlobalHeader onHome={handleRestart} />
      
      {/* Floating Background Elements */}
      <div className="floating-numbers">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-number"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `-${Math.random() * 20}s`,
              opacity: Math.random() * 0.15 + 0.05,
              fontSize: `${Math.random() * 3 + 2}rem`,
              color: i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--purple-light)' : 'var(--blue-bright)'
            }}
          >
            {['+', '×', '=', '20', '15', '4', '5'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {phase === 'welcome' && <WelcomePhase onNext={() => handleNext('wonder')} />}
      {phase === 'wonder' && <WonderPhase onNext={() => handleNext('story')} />}
      {phase === 'story' && <StoryPhase onNext={() => handleNext('simulate')} />}
      {phase === 'simulate' && <SimulatePhase onNext={() => handleNext('play')} />}
      {phase === 'play' && <PlayPhase onComplete={handleComplete} />}
      {phase === 'reflect' && <ReflectPhase score={score} onRestart={handleRestart} />}

      {/* Global Speaker Icon */}
      <button 
        onClick={toggleMute}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.6)',
          border: '2px solid var(--gold)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold)',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
      </button>
    </div>
  );
}
