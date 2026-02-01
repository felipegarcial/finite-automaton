/**
 * Generic Finite Automaton library.
 * Implements the formal 5-tuple definition: FA = (Q, Σ, q0, F, δ)
 */

import { InvalidConfigurationError, InvalidInputError } from "./exceptions";

export interface FSMConfig<StateType, SymbolType> {
  states: Set<StateType>;
  alphabet: Set<SymbolType>;
  initialState: StateType;
  acceptingStates: Set<StateType>;
  transitions: Map<StateType, Map<SymbolType, StateType>>;
  stateOutput?: Map<StateType, unknown>;
}

/**
 * A generic Deterministic Finite Automaton.
 *
 * FA = (Q, Σ, q0, F, δ) where:
 *   Q  = finite set of states
 *   Σ  = finite input alphabet
 *   q0 = initial state (must be in Q)
 *   F  = accepting states (must be subset of Q)
 *   δ  = transition function: state → symbol → state
 */
export class FiniteAutomaton<StateType, SymbolType> {
  private readonly _states: Set<StateType>;
  private readonly _alphabet: Set<SymbolType>;
  private readonly _initialState: StateType;
  private readonly _acceptingStates: Set<StateType>;
  private readonly _transitions: Map<StateType, Map<SymbolType, StateType>>;
  private readonly _stateOutput: Map<StateType, unknown>;

  constructor(config: FSMConfig<StateType, SymbolType>) {
    this.validate(config);

    this._states = new Set(config.states);
    this._alphabet = new Set(config.alphabet);
    this._initialState = config.initialState;
    this._acceptingStates = new Set(config.acceptingStates);
    this._transitions = new Map(config.transitions);
    this._stateOutput = config.stateOutput ? new Map(config.stateOutput) : new Map();
  }

  private validate(config: FSMConfig<StateType, SymbolType>): void {
    const { states, alphabet, initialState, acceptingStates, transitions } = config;

    if (states.size === 0) {
      throw new InvalidConfigurationError("States set Q cannot be empty.");
    }

    if (alphabet.size === 0) {
      throw new InvalidConfigurationError("Alphabet Σ cannot be empty.");
    }

    if (!states.has(initialState)) {
      throw new InvalidConfigurationError(
        `Initial state '${initialState}' is not a member of Q.`
      );
    }

    for (const state of acceptingStates) {
      if (!states.has(state)) {
        throw new InvalidConfigurationError(
          `Accepting state '${state}' is not a member of Q.`
        );
      }
    }

    for (const [state, symbolMap] of transitions) {
      if (!states.has(state)) {
        throw new InvalidConfigurationError(
          `Transition source '${state}' is not in Q.`
        );
      }
      for (const [symbol, target] of symbolMap) {
        if (!alphabet.has(symbol)) {
          throw new InvalidConfigurationError(
            `Transition symbol '${symbol}' is not in Σ.`
          );
        }
        if (!states.has(target)) {
          throw new InvalidConfigurationError(
            `Transition target '${target}' is not in Q.`
          );
        }
      }
    }

    // Validate complete transition table
    for (const state of states) {
      if (!transitions.has(state)) {
        throw new InvalidConfigurationError(
          `No transitions defined for state '${state}'.`
        );
      }
      const symbolMap = transitions.get(state)!;
      for (const symbol of alphabet) {
        if (!symbolMap.has(symbol)) {
          throw new InvalidConfigurationError(
            `Missing transition δ(${state}, ${symbol}).`
          );
        }
      }
    }
  }

  process(inputSymbols: Iterable<SymbolType>): StateType {
    let current: StateType = this._initialState;

    for (const symbol of inputSymbols) {
      if (!this._alphabet.has(symbol)) {
        throw new InvalidInputError(`Symbol '${symbol}' is not in alphabet Σ.`);
      }

      const symbolMap = this._transitions.get(current);
      if (!symbolMap || !symbolMap.has(symbol)) {
        throw new InvalidInputError(
          `No transition defined for δ(${current}, ${symbol}).`
        );
      }

      current = symbolMap.get(symbol)!;
    }

    return current;
  }

  accepts(inputSymbols: Iterable<SymbolType>): boolean {
    return this._acceptingStates.has(this.process(inputSymbols));
  }

  compute<OutputType>(inputSymbols: Iterable<SymbolType>): OutputType {
    const finalState = this.process(inputSymbols);

    if (!this._stateOutput.has(finalState)) {
      throw new Error(`No output mapping for state '${finalState}'.`);
    }

    return this._stateOutput.get(finalState) as OutputType;
  }

  get states(): Set<StateType> {
    return new Set(this._states);
  }

  get alphabet(): Set<SymbolType> {
    return new Set(this._alphabet);
  }

  get initialState(): StateType {
    return this._initialState;
  }

  get acceptingStates(): Set<StateType> {
    return new Set(this._acceptingStates);
  }

  get stateOutput(): Map<StateType, unknown> {
    return new Map(this._stateOutput);
  }
}
