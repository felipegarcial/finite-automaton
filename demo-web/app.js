/**
 * Mod Three FSM - Uses the bundled TypeScript implementation
 */

// Create FSM instance using the bundled FiniteAutomaton class
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
  stateOutput: new Map([
    ["S0", 0],
    ["S1", 1],
    ["S2", 2],
  ]),
});

function updateStateDisplay(activeState) {
  ['s0', 's1', 's2'].forEach(s => {
    document.getElementById(`state-${s}`).classList.remove('active');
  });

  if (activeState) {
    document.getElementById(`state-${activeState.toLowerCase()}`).classList.add('active');
  }
}

function calculate() {
  const input = document.getElementById('binary-input');
  const resultEl = document.getElementById('result');
  const decimalInfo = document.getElementById('decimal-info');
  const errorMessage = document.getElementById('error-message');

  const binaryString = input.value.trim();

  // Clear previous state
  errorMessage.textContent = '';
  input.classList.remove('error');

  try {
    const finalState = modThreeFSM.process(binaryString);
    const result = modThreeFSM.stateOutput.get(finalState);

    resultEl.textContent = result;
    updateStateDisplay(finalState);

    // Show decimal info
    if (binaryString) {
      const decimal = parseInt(binaryString, 2);
      decimalInfo.textContent = `${decimal} (decimal) mod 3 = ${result}`;
    } else {
      decimalInfo.textContent = 'Empty string = 0';
    }

  } catch (error) {
    resultEl.textContent = '-';
    decimalInfo.textContent = '';
    errorMessage.textContent = error.message;
    input.classList.add('error');
    updateStateDisplay(null);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('binary-input');

  // Calculate on every input change (real-time)
  input.addEventListener('input', () => {
    calculate();
  });

  // Initial state
  updateStateDisplay('S0');
});
