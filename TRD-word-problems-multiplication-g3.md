# Technical Requirements Document (TRD)
## Word Problems from Multiplication
### Grade 3 Math | Lesson 3.5 | Intellia SG

---

## 1. Technical Overview

**Architecture:** Single-page React application delivered as a single `.html` file  
**Rendering:** Client-side only (React 18 + Babel Standalone via CDN)  
**State management:** React hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`)  
**Styling:** Inline CSS + global `<style>` block (no build step required)  
**Data:** All 100 questions generated at runtime using pure JS functions — no backend  
**Deployment:** Static file upload to intelliasg.com (works in any iframe or direct page embed)  

---

## 2. Tech Stack

| Layer | Technology | Version | Source |
|-------|-----------|---------|--------|
| UI Framework | React | 18.2.0 | cdnjs.cloudflare.com |
| DOM Renderer | ReactDOM | 18.2.0 | cdnjs.cloudflare.com |
| JSX Compiler | Babel Standalone | 7.23.5 | cdnjs.cloudflare.com |
| Fonts | Google Fonts | — | fonts.googleapis.com |
| Icons | Unicode Emoji | — | Native (no library) |
| Hosting | Static HTML | — | intelliasg.com |

**No npm, no webpack, no build pipeline required.**

---

## 3. File Structure

```
word-problems-multiplication-g3.html   ← single deliverable file
  ├── <head>
  │   ├── Google Fonts (Nunito + Fredoka One)
  │   ├── React 18 + ReactDOM (CDN)
  │   ├── Babel Standalone (CDN)
  │   └── <style> — global CSS custom properties + utility classes
  └── <body>
      ├── <div id="root"> — React mount point
      └── <script type="text/babel">
          ├── CONSTANTS — scene list, topic metadata
          ├── makeQuestions() — 100-question procedural generator
          ├── Simulation Components (7 types)
          ├── StarRain — particle animation component
          ├── HeroPage
          ├── LearnPage
          ├── SimulatePage
          ├── PlayPage + QuestionUI
          ├── TrophyPage
          └── App (root with routing state)
```

---

## 4. Component Architecture

```
App
├── <nav> (sticky, scene-based routing)
├── HeroPage
│   └── CTA buttons → navTo()
├── LearnPage
│   ├── Topic tabs (LEARN_CONTENT[0..7])
│   └── SimBox (toggled)
│       ├── GroupSim
│       ├── ArraySim
│       ├── CompareSim
│       ├── MoneySim
│       ├── MeasureSim
│       ├── AreaSim
│       └── TimeSim
├── SimulatePage
│   ├── Question card
│   ├── SimBox (always visible)
│   └── MCQ / Fill input
├── PlayPage
│   ├── HUD (progress, score, streak, lives, timer)
│   ├── QuestionUI (dispatches 15+ pattern components)
│   ├── Feedback overlay
│   ├── StarRain (on milestone)
│   └── GameOver screen
├── TrophyPage
│   ├── Badge reveal
│   ├── Stats display
│   └── Replay controls
└── <footer>
```

---

## 5. State Management

All state lives in React component state (no Redux, no Context API needed).

### App-level State
```js
const [scene, setScene] = useState('hero')        // current page
const [playScore, setPlayScore] = useState(0)      // last play score
const [playQs, setPlayQs] = useState(0)            // last play count
const [bestScore, setBestScore] = useState(0)      // session best
const [playKey, setPlayKey] = useState(0)          // forces PlayPage remount
```

### PlayPage State
```js
const [qIdx, setQIdx] = useState(0)               // current question index
const [answered, setAnswered] = useState(false)    // lockout after answer
const [correct, setCorrect] = useState(null)       // null | true | false
const [score, setScore] = useState(0)             // running score
const [streak, setStreak] = useState(0)           // current streak count
const [showCelebrate, setShowCelebrate] = useState(false)  // StarRain trigger
const [fillVal, setFillVal] = useState('')         // fill-in-blank input
const [timer, setTimer] = useState(30)             // countdown
const [timerActive, setTimerActive] = useState(true)
const [pattern, setPattern] = useState('mcq4')    // current question pattern
const [lives, setLives] = useState(3)             // remaining hearts
const [gameOver, setGameOver] = useState(false)
```

### SimulatePage State
```js
const [qIdx, setQIdx] = useState(0)
const [answered, setAnswered] = useState(false)
const [correct, setCorrect] = useState(null)
const [fillVal, setFillVal] = useState('')
const [showHint, setShowHint] = useState(false)
const [score, setScore] = useState({ right: 0, wrong: 0 })
```

---

## 6. Question Generation Algorithm

```js
function makeQuestions() {
  // Word pools for randomisation
  const animals, items, containers, people = [...]

  // Helper functions
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
  const pick = arr => arr[Math.floor(Math.random() * arr.length)]
  const shuffle = arr => [...arr].sort(() => Math.random() - .5)

  // MCQ question factory
  function mcq(stem, ans, type, sim, hint) {
    // Generate 3 wrong answers (non-zero, non-duplicate, ±3-15 range)
    const wrong = new Set()
    while (wrong.size < 3) {
      let w = ans + pick([-12,-9,-6,-3,3,6,9,12,15,-15])
      if (w > 0 && w !== ans) wrong.add(w)
    }
    return { id, stem, ans, type, sim, hint,
      options: shuffle([ans, ...wrong]), format: 'mcq' }
  }

  // Fill-in-blank factory
  function fillBlank(stem, ans, type, sim, hint) {
    return { id, stem, ans, type, sim, hint, format: 'fill' }
  }

  // 8 topic generators × 10-20 questions each → 100 total
  // Topics: equal(20), array(15), total(15), compare(10),
  //         money(10), measure(10), area(10), time(10)
  
  return questions.slice(0, 100).map((x, i) => ({ ...x, id: i + 1 }))
}
```

**Key properties of every question object:**
```js
{
  id: Number,           // 1–100
  stem: String,         // the word problem text
  ans: Number,          // correct integer answer
  type: String,         // 'equal'|'array'|'total'|'compare'|'money'|'measure'|'area'|'time'
  sim: Object,          // simulation props (type + parameters)
  hint: String,         // equation hint e.g. "3 × 7 = ?"
  options: Number[],    // shuffled [correct, wrong, wrong, wrong]
  format: 'mcq'|'fill'  // base format
}
```

---

## 7. Simulation Component Interface

Each simulation component receives destructured props from `question.sim`:

```js
// GroupSim
{ type: 'groups', groups: Number, perGroup: Number, item: String, container: String }

// ArraySim
{ type: 'array', rows: Number, cols: Number, item: String }

// CompareSim
{ type: 'compare', base: Number, times: Number, item: String }

// MoneySim
{ type: 'money', n: Number, price: Number, item: String }

// MeasureSim
{ type: 'measure', n: Number, each: Number, unit: String }

// AreaSim
{ type: 'area', length: Number, width: Number, unit: String }

// TimeSim
{ type: 'time', n: Number, each: Number, unit: String, item: String }
```

The `SimBox` dispatcher:
```jsx
function SimBox({ sim, answer }) {
  if (!sim) return null
  const t = sim.type
  return (
    <div className="sim-box fade-in">
      {t === 'groups'  && <GroupSim {...sim} />}
      {t === 'array'   && <ArraySim {...sim} />}
      {t === 'compare' && <CompareSim {...sim} />}
      {t === 'money'   && <MoneySim {...sim} />}
      {t === 'measure' && <MeasureSim {...sim} />}
      {t === 'area'    && <AreaSim {...sim} />}
      {t === 'time'    && <TimeSim {...sim} />}
    </div>
  )
}
```

---

## 8. Question Pattern Dispatch (QuestionUI)

`QuestionUI` receives `{ pattern, q, onSubmit, fillVal, setFillVal }` and renders the appropriate UI:

```js
const PLAY_PATTERNS = [
  'mcq4', 'fill', 'truefalse', 'dragmatch', 'missing_factor',
  'word_bank', 'choose2', 'equation_build', 'quick_fire',
  'image_count', 'sequence', 'story_select', 'compare_pair',
  'estimation', 'array_tap'
]

// Pattern assigned cyclically: PLAY_PATTERNS[qIdx % PLAY_PATTERNS.length]
```

Each pattern implementation derives its visuals and interactions from the question's `sim`, `hint`, `options`, and `ans` fields — no additional data needed.

---

## 9. Timer Implementation

```js
useEffect(() => {
  if (!timerActive || answered || gameOver) return
  const interval = setInterval(() => {
    setTimer(t => {
      if (t <= 1) {
        clearInterval(interval)
        handleTimeout()
        return 0
      }
      return t - 1
    })
  }, 1000)
  return () => clearInterval(interval)
}, [timerActive, answered, gameOver, qIdx])
```

Timeout triggers `handleTimeout()` → marks answered=false, removes a life, resets streak.

---

## 10. Scoring Algorithm

```
Base score per correct: +10 points
Streak bonus: if streak >= 3, add +5 per correct
Wrong answer / timeout: streak resets to 0, lives -= 1
Game over: lives === 0

Accuracy % = (score / (questionsAnswered × 10)) × 100
```

**Badge thresholds:**
| Badge | Min Accuracy |
|-------|-------------|
| 🥉 Bronze Explorer | 0% |
| 🥈 Silver Solver | 40% |
| 🥇 Gold Champion | 70% |
| 🏆 Math Legend | 90% |

---

## 11. CSS Architecture

### Design Tokens (CSS Custom Properties)
```css
:root {
  --purple: #7c3aed; --purple-light: #a855f7;
  --blue: #2563eb; --blue-light: #60a5fa;
  --green: #16a34a; --green-light: #4ade80;
  --yellow: #d97706; --yellow-light: #fbbf24;
  --orange: #ea580c; --pink: #db2777; --teal: #0d9488; --red: #dc2626;
  --bg-dark: #0f1b2d; --bg-card: #1a2d4a; --bg-card2: #162340;
  --text-muted: #94a3b8; --border: #2d4a6a;
}
```

### Utility Classes
- `.btn` + `.btn-{color}` — 9 button variants
- `.card`, `.card2` — 2 card elevations
- `.grid-2`, `.grid-4` — responsive grids
- `.fade-in`, `.bounce`, `.shake`, `.spin`, `.pulse`, `.float` — animations
- `.correct-flash`, `.wrong-flash` — feedback animations
- `.option-btn`, `.option-btn.correct`, `.option-btn.wrong` — answer buttons
- `.nav-tab.active`, `.nav-tab.inactive` — navigation states

### Responsive Breakpoints
```css
@media (max-width: 640px) {
  .grid-2 { grid-template-columns: 1fr }
  .grid-4 { grid-template-columns: repeat(2, 1fr) }
  .section-title { font-size: 24px }
}
```

---

## 12. Animation Keyframes

| Class | Keyframe | Duration | Use |
|-------|----------|----------|-----|
| `.fade-in` | opacity 0→1, translateY 10→0 | 0.4s | Page/card transitions |
| `.bounce` | scale 1→1.15→1 | 0.6s | Correct answer |
| `.shake` | translateX ±8px | 0.4s | Wrong answer |
| `.float` | translateY 0→-10→0 | 3s ∞ | Hero emoji |
| `.pulse` | scale 1→1.05→1 | 2s ∞ | Active elements |
| `.spin` | rotate 360° | 1s ∞ | Loading states |
| `.star-particle` | translateY fall + rotate | 2s | StarRain particles |
| `.correct-flash` | bg colour pulse green | 0.5s | Feedback overlay |
| `.wrong-flash` | bg colour pulse red | 0.5s | Feedback overlay |

---

## 13. StarRain Particle System

```jsx
function StarRain() {
  const [stars, setStars] = useState([])
  useEffect(() => {
    const arr = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,          // % from left
      delay: Math.random() * 1.5,      // stagger delay
      icon: ['⭐','🌟','✨','🎉','🎊'][Math.floor(Math.random() * 5)]
    }))
    setStars(arr)
    const t = setTimeout(() => setStars([]), 2500)
    return () => clearTimeout(t)
  }, [])
  // Renders fixed-position overlay with 20 falling emoji particles
}
```

Triggered when `streak` reaches a milestone (≥ 3 consecutive correct answers).

---

## 14. Deployment Instructions

### Upload to intelliasg.com (WordPress/Elementor)
1. Upload `word-problems-multiplication-g3.html` via Media Library or FTP to `/wp-content/uploads/grade3/`
2. Create a new Lesson page under Lesson 3.5
3. Add an Elementor HTML element with:
   ```html
   <iframe src="/wp-content/uploads/grade3/word-problems-multiplication-g3.html" 
     width="100%" height="900px" frameborder="0" style="border-radius:16px;"/>
   ```
4. Or link directly as a standalone page

### Alternative: Vercel / Netlify Static Deploy
```bash
# No build step needed
vercel --prod word-problems-multiplication-g3.html
# or drag-drop to netlify.com/drop
```

### CDN Dependencies (must be reachable)
- `cdnjs.cloudflare.com` — React 18, ReactDOM, Babel
- `fonts.googleapis.com` — Nunito + Fredoka One fonts

---

## 15. Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| iOS Safari 14+ | ✅ Full |
| Chrome Android | ✅ Full |

**Requires:** CSS Grid, CSS Custom Properties, ES2020, React 18  
**Does NOT require:** Node.js, npm, service workers, localStorage

---

## 16. Performance Targets

| Metric | Target |
|--------|--------|
| Initial HTML size | < 80 KB |
| Total load (with CDN) | < 300 KB |
| Time to interactive | < 3s on 3G |
| Frame rate (animations) | 60 fps |
| Memory usage | < 50 MB |

All 100 questions are generated at component mount via `useMemo` — zero network requests for question data.

---

## 17. Security Considerations

- No user data collected or transmitted
- No cookies, localStorage, or sessionStorage used
- No external API calls from the module
- CDN resources loaded over HTTPS only
- No `eval()` beyond Babel transpilation of JSX
- Content Security Policy compatible (CDN whitelisted domains only)
