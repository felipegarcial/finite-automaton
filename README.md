# Modulo Three FSM - Advanced Exercise (TypeScript)

A generic Finite State Machine library with the mod-three function as an example.

## Overview

This project implements a reusable Finite Automaton based on the formal definition:

**FA = (Q, Σ, q0, F, δ)** where:
- **Q**: finite set of states
- **Σ**: finite input alphabet
- **q0 ∈ Q**: initial state
- **F ⊆ Q**: set of accepting/final states
- **δ: Q × Σ → Q**: transition function

## What's Included

1. **Generic FSM Library** (`src/fsm/`) - A reusable TypeScript library for creating any Deterministic Finite Automaton.

2. **Mod-Three Example** (`src/examples/mod-three.ts`) - An implementation of the mod-three function using the generic FSM library.

3. **Web Interface** (`demo-web/`) - A vanilla JavaScript UI that demonstrates the library usage in the browser. The TypeScript code is bundled using esbuild and consumed by `app.js`.

## Requirements

- Node.js 18+
- npm

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Bundle TypeScript for browser
npm run bundle

# 4. Open the web interface
open demo-web/index.html
```

## Usage

### Generic Finite Automaton

```typescript
import { FiniteAutomaton } from "./src/fsm";

// Parity checker - detects odd number of 1s
const parity = new FiniteAutomaton({
  states: new Set(["even", "odd"]),
  alphabet: new Set(["0", "1"]),
  initialState: "even",
  acceptingStates: new Set(["odd"]),
  transitions: new Map([
    ["even", new Map([["0", "even"], ["1", "odd"]])],
    ["odd", new Map([["0", "odd"], ["1", "even"]])],
  ]),
});

parity.accepts("101");  // true (odd number of 1s)
parity.accepts("11");   // false (even number of 1s)
```

### Mod Three Function

```typescript
import { modThree } from "./src/examples/mod-three";

modThree("1101");  // Returns 1 (13 mod 3 = 1)
modThree("1110");  // Returns 2 (14 mod 3 = 2)
modThree("1111");  // Returns 0 (15 mod 3 = 0)
```

### Web Interface (Vanilla JS)

The `demo-web/` folder contains a browser-based demo that uses the TypeScript library:

- `bundle.js` - The TypeScript library bundled as an IIFE, exposing `FSM` global
- `app.js` - Vanilla JavaScript that creates a mod-three FSM instance and handles UI interactions
- `index.html` - Simple form with binary input and state visualization

```javascript
// Example from demo-web/app.js - using the bundled TypeScript library
const modThreeFSM = new FSM.FiniteAutomaton({
  states: new Set(["S0", "S1", "S2"]),
  alphabet: new Set(["0", "1"]),
  initialState: "S0",
  acceptingStates: new Set(["S0", "S1", "S2"]),
  transitions: new Map([
    ["S0", new Map([["0", "S0"], ["1", "S1"]])],
    ["S1", new Map([["0", "S2"], ["1", "S0"]])],
    ["S2", new Map([["0", "S1"], ["1", "S2"]])],
  ]),
  stateOutput: new Map([["S0", 0], ["S1", 1], ["S2", 2]]),
});

const result = modThreeFSM.compute("1101"); // Returns 1
```

## Scripts

```bash
npm install      # Install dependencies
npm test         # Run tests (24 tests)
npm run build    # Compile TypeScript to dist/
npm run bundle   # Bundle for browser (generates demo-web/bundle.js)
npm run clean    # Clean dist and node_modules
```

## Project Structure

```
ts-advanced-fsm/
├── src/
│   ├── fsm/
│   │   ├── index.ts           # Package exports
│   │   ├── automaton.ts       # Generic FiniteAutomaton class
│   │   └── exceptions.ts      # Custom exceptions
│   ├── examples/
│   │   └── mod-three.ts       # Mod-three implementation (TypeScript)
│   └── index.ts               # Main exports
├── tests/
│   ├── automaton.test.ts      # Tests for generic FSM (15 tests)
│   └── mod-three.test.ts      # Tests for mod-three (9 tests)
├── demo-web/
│   ├── index.html             # User interface
│   ├── style.css              # Styles
│   ├── app.js                 # Vanilla JS application logic
│   └── bundle.js              # Bundled TypeScript (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```
