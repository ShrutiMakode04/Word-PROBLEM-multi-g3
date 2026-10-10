# Product Requirements Document (PRD)
## Word Problems from Multiplication
### Grade 3 Math | Lesson 3.5 | Intellia SG

---

## 1. Product Overview

**Product Name:** Word Problems from Multiplication — Grade 3 Gamified Learning Module  
**Platform:** Web (React SPA, embeddable in intelliasg.com/courses/grade-3-math/)  
**Target Users:** Grade 3 students (ages 7–9), worldwide  
**Lesson Reference:** Intellia SG Grade 3 Math — Section 3, Lesson 3.5  
**Version:** 1.0  

---

## 2. Problem Statement

Grade 3 students struggle to connect abstract multiplication facts to real-world problem-solving scenarios. Existing resources lack:
- Immersive, story-driven problem presentation
- Visual/animated simulations showing the math happening
- Multiple question patterns preventing rote memorisation
- Gamification elements to sustain engagement across 100 questions

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Improve problem comprehension | % correct on first attempt | ≥ 70% |
| Sustain engagement | Average session length | ≥ 12 minutes |
| Cover full syllabus | Topic coverage per session | All 8 types attempted |
| Replayability | Return visit rate | ≥ 60% in 7 days |
| Accessibility | Mobile usability score | ≥ 90/100 |

---

## 4. Scope

### In Scope
- **Topic:** Multiplication Word Problems (Lesson 3.5 only)
- **Sub-topics:** Equal groups, arrays & rows, finding the total, times-as-many comparisons, money, measurement, area, and time
- **100 randomised questions** across all 8 sub-topics
- **3 modes:** Learn → Simulate → Play
- **15+ question pattern types** in Play mode
- **Visual simulations** for every question type
- **Gamification:** Score, streak, lives, badges, star rain
- **Responsive design** for desktop, tablet, mobile

### Out of Scope
- User authentication / persistent progress (uses in-memory state only)
- Division word problems (separate lesson)
- Multi-language localisation (English only, v1)
- Teacher dashboard / analytics

---

## 5. User Stories

### Student (Primary User)
- As a Grade 3 student, I want animated story context so I understand what the word problem is asking.
- As a student, I want to see a visual simulation so I can confirm my thinking before answering.
- As a student, I want hints that guide me without giving away the answer.
- As a student, I want exciting feedback (star rain, score) when I get something right.
- As a student, I want a timer to make the game exciting but not stressful.
- As a student, I want multiple types of questions so each one feels fresh.

### Teacher / Parent
- As a teacher, I want all questions to be curriculum-aligned with Grade 3 multiplication.
- As a parent, I want the content to be safe, positive, and encouraging.

---

## 6. Feature Requirements

### 6.1 Navigation & Structure
- **Sticky navigation bar** with 5 tabs: Home, Learn, Simulate, Play, Trophy
- **Single-page app** — no page reloads, smooth scroll-to-top on tab switch
- **Best score** persisted in React state and shown in nav

### 6.2 Hero / Home Page
- Large animated emoji hero (floating animation)
- Gradient title with module name and curriculum reference
- 3 call-to-action buttons: Start Learning, Simulation Mode, Play & Practice
- 4 feature stat blocks (topics, questions, modes, audience)
- Decorative background blobs for visual richness

### 6.3 Learn Mode (8 lessons)
- Horizontal scrollable topic tabs (one per sub-topic)
- Each lesson contains:
  - **Story Phase:** Illustrated narrative with emoji characters and real-world context
  - **Key Rule:** Highlighted formula card
  - **Visual Simulation:** Toggle-able live simulation matching the topic
  - **Pro Tip:** Extra keyword/strategy guidance in a yellow callout box
- Forward / back navigation between lessons
- "Try Simulate" and "Play Now" escape buttons

### 6.4 Simulation Mode
- All questions paired with a live animated simulation
- Score tracker (correct / wrong / question number)
- Optional hint system (toggle)
- MCQ and fill-in-blank formats
- Animated feedback with correct equation display
- "Switch to Play Mode" escape button

### 6.5 Play Mode (Gamified)
- **50 questions** per session (from pool of 100)
- **Timer** per question (30s standard, 15s for Quick Fire)
- **Lives system** (3 hearts; lose life on wrong or timeout)
- **Streak counter** with +5 bonus points at streak ≥ 3
- **15+ question pattern types** (see Section 7)
- **Progress bar** with question counter
- **Animated feedback:** StarRain on streak milestone, bounce/shake animation on answer
- Game Over state with retry + view score options

### 6.6 Trophy Page
- Badge system (Bronze Explorer, Silver Solver, Gold Champion, Math Legend)
- Accuracy percentage with visual progress bar
- Stats: total score, questions answered, accuracy
- "What You Learned" recap with all 8 topic badges
- Play Again and New Game buttons

### 6.7 Visual Simulations (by type)
| Type | Visual |
|------|--------|
| Equal Groups | Emoji groups in colored bordered containers |
| Arrays | Rows × columns of emoji icons |
| Compare (Times as Many) | Side-by-side group comparison with ×N label |
| Money | Price tag cards with running total |
| Measurement | Bar chart per item, coloured by index |
| Area | Grid of colored squares (L × W) |
| Time | Day-by-day cards showing minutes/hours |

---

## 7. Question Pattern Types (15+)

| # | Pattern | Description |
|---|---------|-------------|
| 1 | Multiple Choice (MCQ4) | 4 options, tap to select |
| 2 | Fill in the Blank | Text input, submit button |
| 3 | True or False | Equation shown; student judges T/F |
| 4 | Missing Factor | `? × n = ans` or `n × ? = ans` |
| 5 | Word Bank | Pick the correct multiplication equation |
| 6 | Choose Two | 5 options, pick the correct one |
| 7 | Equation Build | Tap number tiles to complete `__ × __ = ans` |
| 8 | Quick Fire ⚡ | MCQ with 15-second timer |
| 9 | Image Count | Count emoji array, then pick answer |
| 10 | Number Sequence | Complete skip-counting to find answer |
| 11 | Story Select | MCQ phrased as narrative choice |
| 12 | Compare Pairs | Pick which multiplication sentence = answer |
| 13 | Estimation | Fill blank (accept close answer) |
| 14 | Array Tap | Visual array displayed, pick total |
| 15 | Equation Build (Alt) | Select from number pool to build equation |

---

## 8. Curriculum Alignment

Based on Intellia SG Grade 3 Math Curriculum (Section 3 — Multiplication):

| Lesson | Covered |
|--------|---------|
| 3.1 Multiplication tables 6–9 | ✅ Used as factors throughout |
| 3.2 Multiplication as repeated addition | ✅ Equal groups & sequence patterns |
| 3.3 3-digit × 1-digit | ✅ Some questions include larger products |
| 3.4 Arrays and grouping | ✅ Dedicated array question type |
| **3.5 Word problems** | ✅ Core topic |

Cross-topic alignment:
- **Money** (Section 6): price × quantity problems
- **Measurement** (Section 7): length × quantity, weight × quantity
- **Area** (Section 8.5): L × W area problems
- **Time** (Section 7.4): minutes/hours × days

---

## 9. Content Requirements

### Language & Tone
- Simple English, Grade 3 reading level (Flesch-Kincaid ≤ 65)
- Friendly, encouraging, never punishing
- Culturally neutral names and scenarios
- Diverse contexts: farm, school, home, market, garden, sports

### Question Diversity
- 100 questions generated programmatically using randomised parameters
- Each session shuffles questions (no two sessions identical)
- Questions cover all 8 topic types proportionally
- Numbers stay within Grade 3 multiplication range (2–9 × 2–12)

---

## 10. Gamification Design

| Element | Behaviour |
|---------|-----------|
| Score | +10 per correct, +5 streak bonus at ≥3 streak |
| Streak | Resets on wrong/timeout; shown with 🔥 |
| Lives | 3 hearts; lost on wrong answer or timeout |
| Timer | 30s standard, 15s Quick Fire |
| Star Rain | Particle animation on streak milestone |
| Badges | 4 tiers based on accuracy % |
| Trophy Page | Full summary with badge reveal |

---

## 11. Design System

**Primary colours:** Purple #7c3aed, Blue #2563eb, Green #16a34a, Yellow #d97706, Orange #ea580c, Teal #0d9488, Pink #db2777  
**Background:** Dark navy #0f1b2d with card layers #1a2d4a / #162340  
**Typography:** Fredoka One (headings), Nunito (body) — Google Fonts  
**Border radius:** 12–20px on cards, 50px on buttons  
**Animation:** Float, bounce, shake, fadeIn, starFall, pulse

---

## 12. Accessibility & Performance

- Keyboard-navigable inputs (Enter to submit)
- High contrast text (minimum 4.5:1 ratio)
- Responsive breakpoints: 640px (tablet/mobile collapse to 1-column grid)
- No external API dependencies — fully self-contained HTML
- All assets: emojis only (no external image requests)
- Initial load < 300KB (React CDN + Babel + inline)
