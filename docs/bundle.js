"use strict";
var FSM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.ts
  var ts_advanced_fsm_exports = {};
  __export(ts_advanced_fsm_exports, {
    FiniteAutomaton: () => FiniteAutomaton,
    InvalidConfigurationError: () => InvalidConfigurationError,
    InvalidInputError: () => InvalidInputError
  });

  // lib/exceptions.ts
  var InvalidConfigurationError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidConfigurationError";
    }
  };
  var InvalidInputError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidInputError";
    }
  };

  // lib/automaton.ts
  var FiniteAutomaton = class {
    constructor(config) {
      this.validate(config);
      this._states = new Set(config.states);
      this._alphabet = new Set(config.alphabet);
      this._initialState = config.initialState;
      this._acceptingStates = new Set(config.acceptingStates);
      this._transitions = new Map(config.transitions);
      this._stateOutput = config.stateOutput ? new Map(config.stateOutput) : /* @__PURE__ */ new Map();
    }
    validate(config) {
      const { states, alphabet, initialState, acceptingStates, transitions } = config;
      if (states.size === 0) {
        throw new InvalidConfigurationError("States set Q cannot be empty.");
      }
      if (alphabet.size === 0) {
        throw new InvalidConfigurationError("Alphabet \u03A3 cannot be empty.");
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
              `Transition symbol '${symbol}' is not in \u03A3.`
            );
          }
          if (!states.has(target)) {
            throw new InvalidConfigurationError(
              `Transition target '${target}' is not in Q.`
            );
          }
        }
      }
      for (const state of states) {
        if (!transitions.has(state)) {
          throw new InvalidConfigurationError(
            `No transitions defined for state '${state}'.`
          );
        }
        const symbolMap = transitions.get(state);
        for (const symbol of alphabet) {
          if (!symbolMap.has(symbol)) {
            throw new InvalidConfigurationError(
              `Missing transition \u03B4(${state}, ${symbol}).`
            );
          }
        }
      }
    }
    process(inputSymbols) {
      let current = this._initialState;
      for (const symbol of inputSymbols) {
        if (!this._alphabet.has(symbol)) {
          throw new InvalidInputError(`Symbol '${symbol}' is not in alphabet \u03A3.`);
        }
        const symbolMap = this._transitions.get(current);
        if (!symbolMap || !symbolMap.has(symbol)) {
          throw new InvalidInputError(
            `No transition defined for \u03B4(${current}, ${symbol}).`
          );
        }
        current = symbolMap.get(symbol);
      }
      return current;
    }
    accepts(inputSymbols) {
      return this._acceptingStates.has(this.process(inputSymbols));
    }
    compute(inputSymbols) {
      const finalState = this.process(inputSymbols);
      if (!this._stateOutput.has(finalState)) {
        throw new Error(`No output mapping for state '${finalState}'.`);
      }
      return this._stateOutput.get(finalState);
    }
    get states() {
      return new Set(this._states);
    }
    get alphabet() {
      return new Set(this._alphabet);
    }
    get initialState() {
      return this._initialState;
    }
    get acceptingStates() {
      return new Set(this._acceptingStates);
    }
    get stateOutput() {
      return new Map(this._stateOutput);
    }
  };
  return __toCommonJS(ts_advanced_fsm_exports);
})();
