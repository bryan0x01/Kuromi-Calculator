let displayElement = document.getElementById("display");
let errorSound = document.getElementById("error-sound");
let currentValue = "0";
let previousValue = null;
let currentOperator = null;
let shouldResetDisplay = false;

// Update the display text
function updateDisplay() {
  displayElement.textContent = currentValue;
}

// Play error sound
function playErrorSound() {
  if (errorSound) {
    errorSound.currentTime = 0;
    errorSound.play();
  }
}

// Clear everything
function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  currentOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

// Handle number button click
function handleNumber(number) {
  if (shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
  } else {
    if (currentValue === "0") {
      currentValue = number;
    } else {
      currentValue += number;
    }
  }
  updateDisplay();
}

// Handle decimal point
function handleDecimal() {
  if (shouldResetDisplay) {
    currentValue = "0.";
    shouldResetDisplay = false;
  } else if (currentValue.indexOf(".") === -1) {
    currentValue += ".";
  }
  updateDisplay();
}

// Changes sign
function toggleSign() {
  if (currentValue === "0") {
    return;
  }

  if (currentValue.charAt(0) === "-") {
    currentValue = currentValue.slice(1);
  } else {
    currentValue = "-" + currentValue;
  }
  updateDisplay();
}

// Backspace 
function handleBackspace() {
  if (shouldResetDisplay) {
    return;
  }

  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, currentValue.length - 1);
  } else {
    currentValue = "0";
  }
  updateDisplay();
}

// Set operator and prepare for next number
function handleOperator(operator) {
  if (currentOperator !== null && !shouldResetDisplay) {
    calculateResult();
  } else {
    previousValue = currentValue;
  }

  currentOperator = operator;
  shouldResetDisplay = true;
}

// Perform calculations
function calculateResult() {
  if (currentOperator === null || previousValue === null) {
    return;
  }

  let a = parseFloat(previousValue);
  let b = parseFloat(currentValue);
  let result;

  // Handle division by zero
  if (currentOperator === "/" && b === 0) {
    currentValue = "Error";
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = true;
    playErrorSound();
    updateDisplay();
    return;
  }

  if (currentOperator === "+") {
    result = a + b;
  } else if (currentOperator === "-") {
    result = a - b;
  } else if (currentOperator === "*") {
    result = a * b;
  } else if (currentOperator === "/") {
    result = a / b;
  }

  // If result is not a real number, treat as error
  if (!isFinite(result) || isNaN(result)) {
    currentValue = "Error";
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = true;
    playErrorSound();
  } else {
    currentValue = result.toString();
    previousValue = null;
    currentOperator = null;
    shouldResetDisplay = true;
  }

  updateDisplay();
}

// Handle button clicks
let buttons = document.querySelectorAll(".btn");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let number = button.getAttribute("data-number");
    let operator = button.getAttribute("data-operator");
    let decimal = button.getAttribute("data-decimal");
    let action = button.getAttribute("data-action");

    if (number !== null) {
      handleNumber(number);
    } else if (operator !== null) {
      handleOperator(operator);
    } else if (decimal !== null) {
      handleDecimal();
    } else if (action === "clear") {
      clearCalculator();
    } else if (action === "backspace") {
      handleBackspace();
    } else if (action === "sign") {
      toggleSign();
    } else if (action === "equal") {
      calculateResult();
    }
  });
});

// Keyboard support
document.addEventListener("keydown", function (event) {
  let key = event.key;

  if (key >= "0" && key <= "9") {
    handleNumber(key);
  }

  if (key === ".") {
    handleDecimal();
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    handleOperator(key);
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculateResult();
  }

  if (key === "Escape") {
    clearCalculator();
  }

  if (key === "Backspace") {
    handleBackspace();
  }
});

// Start with default display
updateDisplay();