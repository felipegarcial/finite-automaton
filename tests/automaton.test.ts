/**
 * Unit tests for the generic FiniteAutomaton class.
 */

import {
  FiniteAutomaton,
  InvalidConfigurationError,
  InvalidInputError,
} from "../src/fsm";

// =============================================================================
// Group 1: Valid Configuration (1 test, 4 assertions)
// =============================================================================

describe("TestValidConfiguration", () => {
  test("parity checker should have correct properties", () => {
    const parity = new FiniteAutomaton({
      states: new Set(["even", "odd"]),
      alphabet: new Set(["0", "1"]),
      initialState: "even",
      acceptingStates: new Set(["even"]),
      transitions: new Map([
        ["even", new Map([["0", "even"], ["1", "odd"]])],
        ["odd", new Map([["0", "odd"], ["1", "even"]])],
      ]),
    });

    expect(parity.states).toEqual(new Set(["even", "odd"]));
    expect(parity.alphabet).toEqual(new Set(["0", "1"]));
    expect(parity.initialState).toBe("even");
    expect(parity.acceptingStates).toEqual(new Set(["even"]));
  });
});

// =============================================================================
// Group 2: Invalid Configuration (7 tests)
// =============================================================================

describe("TestInvalidConfiguration", () => {
  test("empty states should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set<string>(),
        alphabet: new Set(["0", "1"]),
        initialState: "A",
        acceptingStates: new Set<string>(),
        transitions: new Map(),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("empty alphabet should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A"]),
        alphabet: new Set<string>(),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map(),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("initial state not in states should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A", "B"]),
        alphabet: new Set(["0"]),
        initialState: "C",
        acceptingStates: new Set(["A"]),
        transitions: new Map(),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("accepting states not subset of states should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A", "B"]),
        alphabet: new Set(["0"]),
        initialState: "A",
        acceptingStates: new Set(["C"]),
        transitions: new Map(),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("transition source not in states should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A"]),
        alphabet: new Set(["0"]),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map([["B", new Map([["0", "A"]])]]),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("transition symbol not in alphabet should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A"]),
        alphabet: new Set(["0"]),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map([["A", new Map([["1", "A"]])]]),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("transition target not in states should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A"]),
        alphabet: new Set(["0"]),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map([["A", new Map([["0", "B"]])]]),
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("missing state transitions should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A", "B"]),
        alphabet: new Set(["0"]),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map([["A", new Map([["0", "A"]])]]), // Missing transitions for B
      });
    }).toThrow(InvalidConfigurationError);
  });

  test("missing symbol transition should throw InvalidConfigurationError", () => {
    expect(() => {
      new FiniteAutomaton({
        states: new Set(["A"]),
        alphabet: new Set(["0", "1"]),
        initialState: "A",
        acceptingStates: new Set(["A"]),
        transitions: new Map([["A", new Map([["0", "A"]])]]), // Missing transition for "1"
      });
    }).toThrow(InvalidConfigurationError);
  });
});

// =============================================================================
// Group 3: process() (2 tests)
// =============================================================================

describe("TestProcess", () => {
  const createParityChecker = () =>
    new FiniteAutomaton({
      states: new Set(["even", "odd"]),
      alphabet: new Set(["0", "1"]),
      initialState: "even",
      acceptingStates: new Set(["even"]),
      transitions: new Map([
        ["even", new Map([["0", "even"], ["1", "odd"]])],
        ["odd", new Map([["0", "odd"], ["1", "even"]])],
      ]),
    });

  test("process should return correct final state for valid inputs", () => {
    const parity = createParityChecker();

    expect(parity.process("11")).toBe("even");
    expect(parity.process("1")).toBe("odd");
    expect(parity.process("0000")).toBe("even");
    expect(parity.process("")).toBe("even");
  });

  test("input with invalid symbol should throw InvalidInputError", () => {
    const parity = createParityChecker();

    expect(() => parity.process("102")).toThrow(InvalidInputError);
  });
});

// =============================================================================
// Group 4: accepts() (1 test, 2 assertions)
// =============================================================================

describe("TestAccepts", () => {
  test("accepts should return true/false based on accepting states", () => {
    const parity = new FiniteAutomaton({
      states: new Set(["even", "odd"]),
      alphabet: new Set(["0", "1"]),
      initialState: "even",
      acceptingStates: new Set(["even"]),
      transitions: new Map([
        ["even", new Map([["0", "even"], ["1", "odd"]])],
        ["odd", new Map([["0", "odd"], ["1", "even"]])],
      ]),
    });

    expect(parity.accepts("11")).toBe(true);
    expect(parity.accepts("1")).toBe(false);
  });
});

// =============================================================================
// Group 5: compute() (2 tests)
// =============================================================================

describe("TestCompute", () => {
  test("compute should return mapped output value", () => {
    const parity = new FiniteAutomaton({
      states: new Set(["even", "odd"]),
      alphabet: new Set(["0", "1"]),
      initialState: "even",
      acceptingStates: new Set(["even"]),
      transitions: new Map([
        ["even", new Map([["0", "even"], ["1", "odd"]])],
        ["odd", new Map([["0", "odd"], ["1", "even"]])],
      ]),
      stateOutput: new Map([
        ["even", "par"],
        ["odd", "impar"],
      ]),
    });

    expect(parity.compute("11")).toBe("par");
    expect(parity.compute("1")).toBe("impar");
  });

  test("FSM without stateOutput should throw Error on compute()", () => {
    const parity = new FiniteAutomaton({
      states: new Set(["even", "odd"]),
      alphabet: new Set(["0", "1"]),
      initialState: "even",
      acceptingStates: new Set(["even"]),
      transitions: new Map([
        ["even", new Map([["0", "even"], ["1", "odd"]])],
        ["odd", new Map([["0", "odd"], ["1", "even"]])],
      ]),
    });

    expect(() => parity.compute("11")).toThrow(Error);
  });
});
