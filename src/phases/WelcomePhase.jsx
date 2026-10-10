import { useState, useEffect } from 'react';
import { BookOpen, Star, Compass, Sparkles, Volume2, Play, Award } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function WelcomePhase({ onNext }) {
  const [step, setStep] = useState('start'); // 'start' | 'playing' | 'ready'

  useEffect(() => {
    return () => audioManager.stop();
  }, []);

  const handleStartLearning = () => {
    audioManager.play('welcome_start');
    setStep('playing');
    setTimeout(() => {
      setStep('ready');
    }, 6000); // 6 seconds intro
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Math Quest</div>
      <h1 className="intro-title" style={{ fontSize: '4.5rem', lineHeight: '1.2' }}>
        Word Problems:<br/>
        <span style={{ color: 'var(--gold)', textShadow: '0 0 20px rgba(255,193,7,0.5)', fontSize: '5rem' }}>Multiplication</span>
      </h1>
      <p className="intro-desc" style={{ fontSize: '1.6rem', lineHeight: '1.5', maxWidth: '800px', margin: '0 auto 30px' }}>
        Join Emma on her party-planning adventure! 
        Learn how to solve real-world problems using the magic of multiplication.
      </p>
      
      {step === 'start' && (
        <button className="btn btn-outline btn-lg intro-start-btn" onClick={handleStartLearning} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', padding: '15px 30px' }}>
          <Volume2 size={28} />
          Start Learning
        </button>
      )}

      {step === 'playing' && (
        <div style={{ padding: '15px', color: 'var(--gold)', fontSize: '1.2rem', animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Volume2 className="animate-spin-slow" /> Let's go!
        </div>
      )}

      {step === 'ready' && (
        <button className="btn btn-primary btn-lg intro-start-btn" onClick={onNext} style={{ animation: 'bounceIn 0.5s', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.6rem', padding: '15px 40px' }}>
          <Play size={28} />
          Begin Your Quest!
        </button>
      )}

      <div className="intro-journey-map" style={{ marginTop: '40px' }}>
        <div className="intro-journey-title" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Learning Path</div>
        <div className="intro-journey-steps" style={{ gap: '15px' }}>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Compass size={20} color="var(--gold)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.3rem' }}>Wonder</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Real World Math</div>
            </div>
          </div>
          <div className="intro-journey-arrow">→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><BookOpen size={20} color="var(--purple-light)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.3rem' }}>Story</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Emma's Party</div>
            </div>
          </div>
          <div className="intro-journey-arrow">→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Sparkles size={20} color="var(--blue-bright)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.3rem' }}>Simulate</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Equal Groups Magic</div>
            </div>
          </div>
          <div className="intro-journey-arrow">→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Star size={20} color="var(--green-light)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.3rem' }}>Practice</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Test your skills</div>
            </div>
          </div>
          <div className="intro-journey-arrow">→</div>
          <div className="intro-journey-step">
            <div className="intro-journey-icon"><Award size={20} color="var(--coral)" /></div>
            <div className="intro-journey-info">
              <div className="intro-journey-label" style={{ fontSize: '1.3rem' }}>Reflect</div>
              <div className="intro-journey-desc" style={{ fontSize: '1rem' }}>Review your journey</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
