/**
 * Custom exceptions for the Finite Automaton library.
 */

/**
 * Thrown when FSM configuration is invalid.
 *
 * Examples:
 * - Empty states set (Q)
 * - Empty alphabet (Σ)
 * - Initial state not in Q
 * - Accepting states not subset of Q
 * - Incomplete transition table (δ not fully defined)
 */
export class InvalidConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidConfigurationError";
  }
}

/**
 * Thrown when processing input that contains invalid symbols.
 *
 * Examples:
 * - Symbol not in alphabet Σ
 * - For mod-three: non-binary characters like '2', 'a', ' '
 */
export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}
