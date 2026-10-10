import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { audioManager } from '../utils/audio';

export default function WonderPhase({ onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    audioManager.play('wonder_intro');
    
    const t1 = setTimeout(() => setRevealed(true), 500);
    const t2 = setTimeout(() => setShowButton(true), 1500);
    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      audioManager.stop();
    };
  }, []);

  return (
    <div className="wonder-phase">
      {/* Phase Title */}
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff', margin: 0 }}>
          Wonder Phase 🤔
        </h2>
      </div>

      <div className="wonder-content" style={{ maxWidth: '650px', width: '100%' }}>
        <div className={`wonder-question-card ${revealed ? 'visible' : ''}`} style={{ padding: '32px 36px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤔</div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--gold)', marginBottom: '14px', fontWeight: 'bold' }}>
            Have you ever found a word problem hard to solve?
          </div>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
            Emma wants to buy <strong style={{ color: '#fff' }}>4 boxes</strong> with <strong style={{ color: '#fff' }}>6 cupcakes</strong> each.
            Instead of adding them slowly:
          </p>

          <div style={{ background: 'rgba(255,193,7,0.12)', border: '2px solid var(--gold)', borderRadius: '12px', padding: '12px 20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold)', marginBottom: '14px' }}>
            6 + 6 + 6 + 6 = 24
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            The word <strong style={{ color: '#fff' }}>"each"</strong> tells us we can use a <strong style={{ color: '#fff' }}>magic shortcut</strong> — <strong style={{ color: 'var(--gold)' }}>Multiplication!</strong>
          </p>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(100,200,255,0.2) 0%, rgba(100,200,255,0.05) 100%)', 
            border: '2px solid rgba(100,200,255,0.5)', 
            borderRadius: '16px', 
            padding: '20px 30px', 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#FFFFFF', 
            marginTop: '20px',
            boxShadow: '0 0 30px rgba(100,200,255,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div>4 × 6 = 24 ⚡</div>
            <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                  <span style={{ fontSize: '1rem' }}>🧁</span>
                </div>
              ))}
            </div>
          </div>

          <div className="story-mascot" style={{ justifyContent: 'center', marginTop: '18px' }}>
            <div className="mascot">👧</div>
            <div className="speech-bubble" style={{ fontSize: '0.95rem' }}>
              "I'm Emma! Multiplication makes solving word problems SO much faster!"
            </div>
          </div>
        </div>

        <button
          className={`btn btn-wonder ${showButton ? 'visible' : ''}`}
          onClick={onNext}
          style={{ marginTop: '18px' }}
        >
          <span>✨</span> See the Story! <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
