import { useState, useEffect } from 'react';
import { Star, ArrowRight, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { audioManager } from '../utils/audio';

// 4 Worlds configuration for Practice Phase
const WORLDS = [
  { id: 1, name: 'Bakery Town', icon: '🧁', color: '#ff9800', desc: '10 dynamic questions', emojis: ['🧁', '🍞', '🍪', '🍎'], itemNames: ['cupcakes', 'breads', 'cookies', 'apples'] },
  { id: 2, name: 'Toy Factory', icon: '🧸', color: '#e91e63', desc: '10 dynamic questions', emojis: ['🧸', '🚗', '🤖', '🧩'], itemNames: ['bears', 'cars', 'robots', 'puzzles'] },
  { id: 3, name: 'School Supplies', icon: '📚', color: '#2196f3', desc: '10 dynamic questions', emojis: ['📚', '🖊️', '🖍️', '🎒'], itemNames: ['books', 'pens', 'crayons', 'backpacks'] },
  { id: 4, name: 'Camping Trip', icon: '⛺', color: '#4caf50', desc: '10 dynamic questions', emojis: ['⛺', '🧗', '🔥', '🔦'], itemNames: ['tents', 'ropes', 'campfires', 'flashlights'] }
];

const PATTERNS = ['equal_groups', 'arrays', 'money', 'compare', 'measure', 'time'];

function makeQuestion(type, groups, size, emoji, itemName, total) {
  const correct = `${total}`;
  let wrong1 = `${total + 1}`;
  let wrong2 = `${total - size > 0 ? total - size : total + 2}`;
  let wrong3 = `${groups + size}`;

  const options = ensureThreeUniqueOptions([correct, wrong1, wrong2, wrong3], correct, type);

  switch (type) {
    case 'equal_groups':
      return {
        prompt: `There are ${groups} bags. Each bag has ${size} ${itemName} ${emoji}. How many ${itemName} are there in total?`,
        answer: correct, options, explanation: `${groups} bags × ${size} = ${total}.`
      };
    case 'arrays':
      return {
        prompt: `The ${itemName} ${emoji} are arranged in ${groups} rows. There are ${size} in each row. What is the total?`,
        answer: correct, options, explanation: `${groups} rows × ${size} = ${total}.`
      };
    case 'money': {
      const moneyCorrect = `$${total}`;
      const moneyOptions = ensureThreeUniqueOptions([`$${total}`, `$${total + 1}`, `$${total - size > 0 ? total - size : total + 2}`, `$${groups + size}`], `$${total}`, 'money');
      return {
        prompt: `Emma buys ${groups} ${itemName} ${emoji}. Each costs $${size}. How much does she spend in total?`,
        answer: moneyCorrect, options: moneyOptions, explanation: `${groups} × $${size} = $${total}.`
      };
    }
    case 'compare':
      return {
        prompt: `John has ${size} ${itemName} ${emoji}. Emma has ${groups} times as many. How many does Emma have?`,
        answer: correct, options, explanation: `${size} × ${groups} times = ${total}.`
      };
    case 'measure': {
      const mCorrect = `${total} cm`;
      const mOptions = ensureThreeUniqueOptions([`${total} cm`, `${total + 1} cm`, `${total - size > 0 ? total - size : total + 2} cm`, `${groups + size} cm`], `${total} cm`, 'measure');
      return {
        prompt: `A piece of material is ${size} cm long. You have ${groups} pieces for the ${itemName}. What is the total length?`,
        answer: mCorrect, options: mOptions, explanation: `${groups} pieces × ${size} cm = ${total} cm.`
      };
    }
    case 'time': {
      const tCorrect = `${total} mins`;
      const tOptions = ensureThreeUniqueOptions([`${total} mins`, `${total + 1} mins`, `${total - size > 0 ? total - size : total + 2} mins`, `${groups + size} mins`], `${total} mins`, 'time');
      return {
        prompt: `Alex spends ${size} minutes looking at ${itemName} every day. How many minutes does he spend in ${groups} days?`,
        answer: tCorrect, options: tOptions, explanation: `${groups} days × ${size} mins = ${total} mins.`
      };
    }
    default: return makeQuestion('equal_groups', groups, size, emoji, itemName, total);
  }
}

function ensureThreeUniqueOptions(optsArr, answer, typeFallback) {
  let wrongOpts = [...new Set(optsArr)].filter(o => o !== answer);
  let fallbackNum = 2;
  while (wrongOpts.length < 2) {
    let fallback;
    if (typeFallback === 'money') fallback = `$${fallbackNum * 5}`;
    else if (typeFallback === 'measure') fallback = `${fallbackNum * 6} cm`;
    else if (typeFallback === 'time') fallback = `${fallbackNum * 10} mins`;
    else fallback = `${fallbackNum * 4}`;
    
    if (!wrongOpts.includes(fallback) && fallback !== answer) {
      wrongOpts.push(fallback);
    }
    fallbackNum++;
  }
  let finalOpts = [answer, ...wrongOpts.slice(0, 2)];
  return shuffle(finalOpts);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestions(world) {
  const qs = [];
  const seen = new Set();
  let i = 0;
  while (qs.length < 10) {
    const groups = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const size = Math.floor(Math.random() * 8) + 2;   // 2 to 9
    const emojiIdx = Math.floor(Math.random() * world.emojis.length);
    const emoji = world.emojis[emojiIdx];
    const itemName = world.itemNames[emojiIdx];
    const total = groups * size;
    const type = PATTERNS[i % PATTERNS.length];
    
    const key = `${type}-${groups}-${size}-${itemName}`;
    if (!seen.has(key)) {
      seen.add(key);
      const q = makeQuestion(type, groups, size, emoji, itemName, total);
      qs.push({ id: i, groups, size, emoji, total, type, ...q });
      i++;
    }
  }
  return qs;
}

export default function PlayPhase({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [view, setView] = useState('start'); // start, playing, complete
  const [activeWorld, setActiveWorld] = useState(null);
  const [completedWorlds, setCompletedWorlds] = useState([]);

  useEffect(() => {
    if (view === 'start') {
      audioManager.play('play_intro');
    }
  }, [view]);

  const startPractice = (world) => {
    setActiveWorld(world);
    setQuestions(generateQuestions(world));
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setView('playing');
    audioManager.stop();
  };

  const handleOptionSelect = (opt) => {
    if (feedback) return;
    const q = questions[qIndex];
    const isCorrect = opt === q.answer;
    
    if (isCorrect) {
      audioManager.play('very_good');
      setScore(s => s + 10);
      setTimeout(() => handleNext(), 1500);
    } else {
      audioManager.play('incorrect');
      setTimeout(() => handleNext(), 2500);
    }
    setFeedback({ result: isCorrect ? 'correct' : 'wrong', explanation: q.explanation, selected: opt, correct: q.answer });
  };

  const handleNext = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex(qi => qi + 1);
      setFeedback(null);
    } else {
      setCompletedWorlds(cw => [...new Set([...cw, activeWorld.id])]);
      setView('complete');
    }
  };

  if (view === 'start') {
    return (
      <div className="play-phase">
        <div className="play-header" style={{ marginBottom: '30px' }}>
          <div className="play-world-badge" style={{ fontSize: '1.2rem', padding: '8px 24px' }}>Practice Phase</div>
          <h2 className="play-title" style={{ fontSize: '2.5rem' }}>Select a World to Practice!</h2>
        </div>
        <div className="world-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          {WORLDS.map(world => (
            <div key={world.id} className="world-card unlocked" onClick={() => startPractice(world)} style={{ '--world-color': world.color, cursor: 'pointer', opacity: 1 }}>
              <div className="world-icon">{world.icon}</div>
              <div className="world-name">{world.name}</div>
              <div className="world-desc">{world.desc}</div>
              {completedWorlds.includes(world.id) && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', color: '#4caf50' }}><CheckCircle /></div>
              )}
              <button className="world-play-btn" style={{ marginTop: '20px' }}>Start ▶</button>
            </div>
          ))}
        </div>
        {completedWorlds.length === 4 && (
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={() => onComplete(score)} style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
              🎓 Finish Quest <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'complete') {
    return (
      <div className="play-phase">
        <div className="world-complete-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem' }}>🏆</div>
          <h2 className="world-complete-title">{activeWorld.name} Complete! 🎉</h2>
          <div style={{ fontSize: '2rem', color: 'var(--gold)', margin: '15px 0', fontWeight: 'bold' }}>Score: {score} / 100 XP</div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => setView('start')}>🗺️ Back to Map</button>
            <button className="btn btn-primary" onClick={() => onComplete(score)} style={{ fontSize: '1.1rem', padding: '12px 28px' }}>
              🎓 Finish Quest <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];
  
  return (
    <div className="play-phase" style={{ paddingTop: '10px' }}>
      <div className="hud">
        <div className="hud-item" style={{ background: '#ffc10726', color: '#ffc107' }}><Star size={16} /> {score}</div>
        <div className="hud-item">🎯 {activeWorld.name}</div>
        <div className="hud-item">Q {qIndex + 1} / 10</div>
      </div>

      <div className="question-card" style={{ marginTop: '16px', maxWidth: '820px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="question-text" style={{ fontSize: '1.8rem', marginBottom: '30px', lineHeight: '1.5' }}>{q.prompt}</div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
          {q.options.map((opt, i) => {
            let bgColor = 'var(--surface)';
            let borderColor = 'rgba(255,255,255,0.2)';
            let transform = 'none';
            let cursor = 'pointer';
            
            if (feedback) {
              cursor = 'default';
              if (opt === feedback.correct) {
                bgColor = 'rgba(76,175,80,0.2)';
                borderColor = '#4caf50';
                transform = 'scale(1.05)';
              }
              else if (opt === feedback.selected && feedback.result === 'wrong') {
                bgColor = 'rgba(244,67,54,0.2)';
                borderColor = '#f44336';
                transform = 'scale(0.95)';
              }
              else {
                bgColor = 'rgba(0,0,0,0.3)';
                borderColor = 'transparent';
              }
            }

            return (
              <button 
                key={i} 
                onClick={() => handleOptionSelect(opt)}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '30px 20px',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: bgColor,
                  border: `3px solid ${borderColor}`,
                  borderRadius: '20px',
                  cursor: cursor,
                  transition: 'all 0.3s ease',
                  transform: transform,
                  boxShadow: feedback ? 'none' : '0 10px 20px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => { if(!feedback) { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--gold)'; } }}
                onMouseOut={(e) => { if(!feedback) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div style={{
            marginTop: '20px', padding: '18px 22px', borderRadius: '14px',
            background: feedback.result === 'correct' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
            border: `2px solid ${feedback.result === 'correct' ? '#4caf50' : '#f44336'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 'bold', color: feedback.result === 'correct' ? '#81c784' : '#ef9a9a' }}>
              {feedback.result === 'correct' ? <CheckCircle size={24} /> : <XCircle size={24} />}
              {feedback.result === 'correct' ? 'Awesome! 🎉' : 'Not quite — here\'s why:'}
            </div>
            <p style={{ fontSize: '1.3rem', color: '#e0e0ff', margin: 0, textAlign: 'center', lineHeight: 1.65 }}>
              {feedback.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
