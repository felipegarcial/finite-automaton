/**
 * Mod-Three Finite Automaton.
 * Computes the remainder of an unsigned binary integer divided by 3.
 */

import { FiniteAutomaton } from "../lib";

const TRANSITIONS = new Map<string, Map<string, string>>([
  ["S0", new Map([["0", "S0"], ["1", "S1"]])],
  ["S1", new Map([["0", "S2"], ["1", "S0"]])],
  ["S2", new Map([["0", "S1"], ["1", "S2"]])],
]);

const OUTPUTS = new Map<string, number>([
  ["S0", 0],
  ["S1", 1],
  ["S2", 2],
]);

export function createModThreeFSM(): FiniteAutomaton<string, string> {
  return new FiniteAutomaton({
    states: new Set(["S0", "S1", "S2"]),
    alphabet: new Set(["0", "1"]),
    initialState: "S0",
    acceptingStates: new Set(["S0", "S1", "S2"]),
    transitions: TRANSITIONS,
    stateOutput: OUTPUTS,
  });
}

// Singleton instance - created once, reused for all calls
const MOD_THREE_FSM = createModThreeFSM();

export function modThree(binaryString: string): number {
  return MOD_THREE_FSM.compute<number>(binaryString);
}
