/**
 * Unit tests for the mod-three implementation.
 */

import { InvalidInputError } from "../lib";
import { modThree, createModThreeFSM } from "../examples/mod-three";

// =============================================================================
// Group 1: Examples from the exercise PDF (1 test, 5 assertions)
// =============================================================================

describe("TestExamplesFromPDF", () => {
  test("all examples from the exercise PDF should pass", () => {
    expect(modThree("110")).toBe(0);    // Example 1: 6 mod 3 = 0
    expect(modThree("1010")).toBe(1);   // Example 2: 10 mod 3 = 1
    expect(modThree("1101")).toBe(1);   // 13 mod 3 = 1
    expect(modThree("1110")).toBe(2);   // 14 mod 3 = 2
    expect(modThree("1111")).toBe(0);   // 15 mod 3 = 0
  });
});

// =============================================================================
// Group 2: Edge cases (1 test, 4 assertions)
// =============================================================================

describe("TestEdgeCases", () => {
  test("edge cases should return correct values", () => {
    expect(modThree("")).toBe(0);       // Empty string, initial state S0
    expect(modThree("0")).toBe(0);      // Single zero
    expect(modThree("1")).toBe(1);      // Single one
    expect(modThree("0000")).toBe(0);   // All zeros
  });

  test("leading zeros should not affect the result", () => {
    expect(modThree("0001101")).toBe(modThree("1101"));  // 13 mod 3 = 1
    expect(modThree("00110")).toBe(modThree("110"));     // 6 mod 3 = 0
    expect(modThree("0001010")).toBe(modThree("1010"));  // 10 mod 3 = 1
  });
});

// =============================================================================
// Group 3: Invalid input (3 tests)
// =============================================================================

describe("TestInvalidInput", () => {
  test("non-binary digit should throw InvalidInputError", () => {
    expect(() => modThree("102")).toThrow(InvalidInputError);
  });

  test("letters should throw InvalidInputError", () => {
    expect(() => modThree("abc")).toThrow(InvalidInputError);
  });

  test("space in input should throw InvalidInputError", () => {
    expect(() => modThree("10 01")).toThrow(InvalidInputError);
  });
});

// =============================================================================
// Group 4: Mass verification (1 test, 201 validations)
// =============================================================================

describe("TestMassVerification", () => {
  test("FSM should match % operator for numbers 0-200", () => {
    for (let n = 0; n <= 200; n++) {
      const binary = n.toString(2);
      expect(modThree(binary)).toBe(n % 3);
    }
  });
});

// =============================================================================
// Group 5: Large numbers with BigInt (1 test, 5 assertions)
// =============================================================================

describe("TestLargeNumbers", () => {
  test("FSM should handle very large numbers beyond Number.MAX_SAFE_INTEGER", () => {
    const largeBinaries = [
      "1".repeat(64),                   // 64 bits: 2^64 - 1
      "10".repeat(50),                  // 100 bits: alternating pattern
      "1101".repeat(25),                // 100 bits: repeating pattern
      "11110000".repeat(12) + "1111",   // 100 bits: block pattern
      "101010".repeat(17).slice(0, 80), // 80 bits: alternating
    ];

    for (const binary of largeBinaries) {
      const bigInt = BigInt("0b" + binary);
      const expected = Number(bigInt % 3n);
      expect(modThree(binary)).toBe(expected);
    }
  });
});

// =============================================================================
// Group 6: FSM Configuration (1 test, 3 assertions)
// =============================================================================

describe("TestFSMConfiguration", () => {
  test("FSM should have correct configuration", () => {
    const fsm = createModThreeFSM();

    expect(fsm.states.size).toBe(3);
    expect(fsm.initialState).toBe("S0");
    expect(fsm.alphabet).toEqual(new Set(["0", "1"]));
  });
});
