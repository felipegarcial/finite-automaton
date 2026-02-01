# Finite Automaton - Advanced Exercise (TypeScript)

A generic Finite State Machine library with the mod-three function as an example.

**[Live Demo](https://felipegarcial.github.io/finite-automaton/)**

## Overview

This project implements a reusable Finite Automaton based on the formal definition:

**FA = (Q, Σ, q0, F, δ)** where:
- **Q**: finite set of states
- **Σ**: finite input alphabet
- **q0 ∈ Q**: initial state
- **F ⊆ Q**: set of accepting/final states
- **δ: Q × Σ → Q**: transition function

## What's Included

1. **Generic FSM Library** (`lib/`) - A reusable TypeScript library for creating any Deterministic Finite Automaton.

2. **Mod-Three Example** (`examples/mod-three.ts`) - An implementation of the mod-three function using the generic FSM library.

3. **Web Demo** (`docs/`) - A vanilla JavaScript UI that demonstrates the library usage in the browser. Hosted on GitHub Pages.

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

# 4. Open the web demo
open docs/index.html
```

## Usage

### Generic Finite Automaton

```typescript
import { FiniteAutomaton } from "./lib";

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
import { modThree } from "./examples/mod-three";

modThree("1101");  // Returns 1 (13 mod 3 = 1)
modThree("1110");  // Returns 2 (14 mod 3 = 2)
modThree("1111");  // Returns 0 (15 mod 3 = 0)
```

### Web Demo (Vanilla JS)

The `docs/` folder contains a browser-based demo that uses the TypeScript library:

- `bundle.js` - The TypeScript library bundled as an IIFE, exposing `FSM` global
- `app.js` - Vanilla JavaScript that creates a mod-three FSM instance and handles UI interactions
- `index.html` - Simple form with binary input and state visualization

```javascript
// Example from docs/app.js - using the bundled TypeScript library
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

## API Reference

### `FiniteAutomaton<StateType, SymbolType>`

#### Constructor

```typescript
new FiniteAutomaton(config: FSMConfig)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `states` | `Set<StateType>` | Finite set of states (Q) |
| `alphabet` | `Set<SymbolType>` | Input alphabet (Σ) |
| `initialState` | `StateType` | Initial state (q0) |
| `acceptingStates` | `Set<StateType>` | Accepting/final states (F) |
| `transitions` | `Map<StateType, Map<SymbolType, StateType>>` | Transition function (δ) |
| `stateOutput` | `Map<StateType, unknown>` | Optional output mapping |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `process(input: Iterable<SymbolType>)` | `StateType` | Processes input and returns final state |
| `accepts(input: Iterable<SymbolType>)` | `boolean` | Returns true if final state is accepting |
| `compute<OutputType>(input: Iterable<SymbolType>)` | `OutputType` | Returns mapped output for final state |

#### Getters

| Getter | Returns | Description |
|--------|---------|-------------|
| `states` | `Set<StateType>` | Copy of states set |
| `alphabet` | `Set<SymbolType>` | Copy of alphabet set |
| `initialState` | `StateType` | Initial state |
| `acceptingStates` | `Set<StateType>` | Copy of accepting states |
| `stateOutput` | `Map<StateType, unknown>` | Copy of output mapping |

## Error Handling

### `InvalidConfigurationError`

Thrown when FSM configuration is invalid:

- Empty states set (Q)
- Empty alphabet (Σ)
- Initial state not in Q
- Accepting states not subset of Q
- Incomplete transition table (δ not fully defined)

### `InvalidInputError`

Thrown when processing input with invalid symbols:

- Symbol not in alphabet Σ
- For mod-three: non-binary characters like `'2'`, `'a'`, `' '`

## Testing

I include 24 unit tests covering:

| Category | Validations | Description |
|----------|-------------|-------------|
| PDF Examples | 5 | Examples from exercise specification |
| Edge Cases | 7 | Empty string, single chars, leading zeros |
| Invalid Input | 3 | Non-binary, letters, spaces |
| Mass Verification | 201 | Numbers 0-200 vs `%` operator |
| Large Numbers | 5 | 64-100 bit numbers using BigInt |
| FSM Configuration | 3 | Validates FSM properties |

Run tests:
```bash
npm test
```

## Design Decisions

1. **Generic Types** - `FiniteAutomaton<StateType, SymbolType>` allows any state/symbol types, not just strings.

2. **Complete Transition Validation** - Constructor validates that δ is defined for all (state, symbol) pairs, as required by the exercise.

3. **Singleton Pattern** - `modThree()` reuses a single FSM instance for efficiency.

4. **Immutable Getters** - All getters return copies to prevent external mutation.

5. **Separation of Concerns** - Generic library (`lib/`) separated from examples (`examples/`) and demo (`docs/`).

## Scripts

```bash
npm install      # Install dependencies
npm test         # Run tests (24 tests)
npm run build    # Compile TypeScript to dist/
npm run bundle   # Bundle for browser (generates docs/bundle.js)
npm run clean    # Clean dist and node_modules
```

## Project Structure

```
ts-advanced-fsm/
├── lib/                       # FSM Library
│   ├── automaton.ts           # Generic FiniteAutomaton class
│   ├── exceptions.ts          # Custom exceptions
│   └── index.ts               # Library exports
├── examples/                  # Example implementations
│   └── mod-three.ts           # Mod-three using the library
├── tests/                     # Unit tests
│   ├── automaton.test.ts      # Tests for generic FSM (15 tests)
│   └── mod-three.test.ts      # Tests for mod-three (9 tests)
├── docs/                      # Web demo (GitHub Pages)
│   ├── index.html             # User interface
│   ├── style.css              # Styles
│   ├── app.js                 # Vanilla JS application
│   └── bundle.js              # Bundled TypeScript library
├── index.ts                   # Main exports
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

> **Note:** The `docs/` folder contains the web demo, not documentation. GitHub Pages only allows serving static files from `/` (root) or `/docs`. I chose `/docs` to keep the demo separate from the library source code, maintaining a clear separation of concerns.
