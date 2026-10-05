# 👑 ROYAL CROWN — Multiplayer Raja–Vajir–Chor–Sipahi Game

A real-time 4-player social deduction party game inspired by the classic traditional Indian game **Raja–Vajir–Chor–Sipahi** (King, Advisor, Thief, Soldier).

---

## 🌟 Game Highlights

- **4-Player Real-Time Multiplayer:** Full live room lobby with unique 5-character room codes (`X7K9P`), instant invite links, and live player presence.
- **Strict Role Privacy:** Server guarantees that secret chits/cards remain strictly hidden until each official declaration phase.
- **Classic 4 Roles & Custom Roles:**
  - 👑 **Raja (King):** Sovereign who proclaims majesty and earns **1000 pts** guaranteed.
  - ⚔️ **Vajir (Advisor):** Royal sleuth who steps up to identify the suspects and earns **+600 pts** (or 0 if tricked).
  - 🕵️ **Chor (Thief):** Master of deception who escapes with **+300 pts** if the Vajir fails.
  - 🛡️ **Sipahi (Soldier):** Royal sentry who earns **+400 pts** if the Vajir fails to deduce the suspects.
  - *Custom Roles Support:* Host can customize names for all 4 roles (e.g., *Mantri*, *Senapati*, *Emperor*, *Detective*, *Spy*).
- **Customizable Scoring Table:** Host can customize point allocations for all 4 roles before starting.
- **AI Bots Support:** Solo practice or filling missing seats with smart royal AI advisors (`+ Add AI Royal Bot`).
- **Interactive Court Flow:**
  1. **Role View:** 3D Flip Card with secret inspection.
  2. **Raja Proclamation:** Raja clicks *"I AM RAJA"* and asks *"Who is my Vajir?"*.
  3. **Vajir Reveal:** Vajir clicks *"I AM VAJIR"* and answers the King.
  4. **The Guess:** Vajir assigns the two suspects to Chor and Sipahi with dual-card slot picker and confirmation modal.
  5. **Round Result & Tally:** Dramatic role reveal, point badges, and cumulative tournament standings.
  6. **Final Standings & Podium:** Grand crowning ceremony, tournament stats, and replay options.
- **Synthesized Web Audio FX:** Trumpet fanfares, sword clashes, detective suspense chimes, card flips, and confetti showers.
- **Court Chat & Emoji Reactions:** Live in-game chat and floating emoji reactions (`👑`, `⚔️`, `🕵️`, `🛡️`, `😂`, `🔥`, etc.).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Development Server (Backend + Frontend Concurrently)
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:3000](http://localhost:3000)
- **Backend Server:** [http://localhost:3001](http://localhost:3001)

### 3. Production Build & Run
```bash
npm run build
npm start
```

---

## 🏛️ Project Structure

```
royal-crown/
├── client/                     # Vite + React 19 + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Royal header with audio toggle, room copy, rules
│   │   │   ├── HomeScreen.jsx          # Hero entry, create/join, solo practice vs bots
│   │   │   ├── LobbyScreen.jsx         # 4-Seat Court table, host controls, bot slots
│   │   │   ├── RoleViewScreen.jsx      # 3D interactive flip card with secret role lore
│   │   │   ├── RajaRevealScreen.jsx    # Proclamation phase ("I AM RAJA")
│   │   │   ├── VajirRevealScreen.jsx   # Summons phase ("I AM VAJIR")
│   │   │   ├── VajirGuessScreen.jsx    # Dual suspect selector & confirmation dialog
│   │   │   ├── RoundResultScreen.jsx   # Big reveal, score tally & cumulative leaderboard
│   │   │   ├── FinalStandingsScreen.jsx# Champion podium & tournament accolades
│   │   │   ├── CreateGameModal.jsx     # Custom roles & scoring rule editor
│   │   │   ├── JoinGameModal.jsx       # 5-character room code joiner
│   │   │   ├── HowToPlayModal.jsx      # Visual rules & scoring guide
│   │   │   └── ChatDrawer.jsx          # Court chat & floating reaction overlay
│   │   ├── context/
│   │   │   └── SocketContext.jsx       # Socket state manager, audio triggers, actions
│   │   ├── utils/
│   │   │   ├── audio.js                # Web Audio API royal synthesizer
│   │   │   └── confetti.js             # Celebratory particle explosions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express + Socket.IO Backend
│   ├── gameLogic.js            # Roles definition, scoring rules, state constants
│   ├── gameManager.js          # Room lifecycle, privacy filtering, bot autopilot
│   ├── index.js                # Socket event listeners & Express server
│   └── package.json
└── package.json                # Root concurrently workspace launcher
```
