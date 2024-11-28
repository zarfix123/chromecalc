document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.button');
    const display = document.getElementById('display');
    const radDegButton = document.getElementById('radDegBtn');
    
    let currentInput = ''; // Holds the current input value (string)
    let previousInput = ''; // Holds the previous input value (string)
    let operator = ''; // Holds the current operator
    let mode = 'rad'; // Default mode is radians
    let trigFunction = ''; // Holds the trigonometric function (sin, cos, tan)

    // Function to reset the display after a calculation
    function resetAfterCalculation() {
        if (operator === '=' && !['+', '-', '*', '/'].includes(currentInput)) {
            clearDisplay(); // Clear display if the operator is '=' and the next input isn't an operator
        }
    }

    // Add event listeners for all button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = button.innerText;

            // Handle different button cases
            if (value === "=" || value === "Enter") {
                calculate();
            } else if (value === "c") {
                clearDisplay();
            } else if (value === "Backspace") {
                backspace();
            } else if (['+', '-', '*', '/'].includes(value)) {
                setOperator(value);
            } else if (value === "sqrt") {
                calculateSqrt();
            } else if (value === "exp") {
                calculateExp();
            } else if (value === "sin" || value === "cos" || value === "tan") {
                setTrigFunction(value);
            } else if (value === "rad/deg") {
                toggleMode();
            } else if (value === "pi") {
                appendToDisplay(Math.PI);
            } else if (value === "e") {
                appendToDisplay(Math.E);
            } else {
                appendToDisplay(value);
            }
        });
    });

    // Add event listener for the Enter key
    document.addEventListener('keydown', function (event) {
        const value = event.key;
        if (value === 'Enter') {
            calculate();
        } else if (value === 'Backspace') {
            backspace();
        } else if (['+', '-', '*', '/'].includes(value)) {
            setOperator(value);
        } else if (value >= '0' && value <= '9') {
            appendToDisplay(value);
        } else if (value === '.') {
            appendToDisplay('.');
        }
    });

    // Function to append numbers or operators to the display
    function appendToDisplay(value) {
        resetAfterCalculation(); // Call resetAfterCalculation before appending the value
        // If it's a fresh start after an operator or result, clear the display
        if (display.innerText === '0' || operator === '=' || trigFunction) {
            display.innerText = value;
            currentInput = value;
        } else {
            display.innerText += value;
            currentInput += value;
        }
    }

    // Function to set the operator for arithmetic operations
    function setOperator(value) {
        resetAfterCalculation(); // Reset the display if needed before setting a new operator
        if (operator !== '') {
            return; // Prevent operator change if one already exists
        }

        // If there's an existing result and the next input is an operator, retain the result
        if (previousInput !== '' && currentInput !== '') {
            calculate(); // Perform calculation first if there's a pending operation
        }

        operator = value;
        previousInput = currentInput;
        currentInput = '';
        display.innerText += ` ${value} `;
    }

    // Function to calculate the result
    function calculate() {
        if (operator === '' || currentInput === '') return;

        let result;
        switch (operator) {
            case '+':
                result = parseFloat(previousInput) + parseFloat(currentInput);
                break;
            case '-':
                result = parseFloat(previousInput) - parseFloat(currentInput);
                break;
            case '*':
                result = parseFloat(previousInput) * parseFloat(currentInput);
                break;
            case '/':
                result = parseFloat(previousInput) / parseFloat(currentInput);
                if (currentInput === '0') result = 'Error';
                break;
            case '^':
                result = Math.pow(parseFloat(previousInput), parseFloat(currentInput));
                break;
            default:
                return;
        }

        display.innerText = result;
        currentInput = result.toString();
        previousInput = '';
        operator = '';
    }

    // Function for square root calculation
    function calculateSqrt() {
        const inputValue = parseFloat(currentInput);
        if (isNaN(inputValue) || inputValue < 0) {
            display.innerText = 'Error';
            return;
        }
        const result = Math.sqrt(inputValue);
        display.innerText = result;
        currentInput = result.toString();
    }

    // Function for exponentiation calculation (x^y)
    function calculateExp() {
        const parts = currentInput.split('^');
        if (parts.length !== 2) {
            display.innerText = 'Error';
            return;
        }
        const base = parseFloat(parts[0]);
        const exponent = parseFloat(parts[1]);
        if (isNaN(base) || isNaN(exponent)) {
            display.innerText = 'Error';
            return;
        }
        const result = Math.pow(base, exponent);
        display.innerText = result;
        currentInput = result.toString();
    }

    // Function to handle trigonometric functions
    function setTrigFunction(func) {
        trigFunction = func;
        display.innerText = func + '(';
        currentInput = '';
    }

    // Function to calculate the result of a trigonometric function
    function calculateTrig(func) {
        const inputValue = parseFloat(currentInput);
        if (isNaN(inputValue)) {
            display.innerText = 'Error';
            return;
        }

        let angle = inputValue;
        if (mode === 'deg') {
            angle = angle * (Math.PI / 180); // Convert degrees to radians
        }

        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(angle);
                break;
            case 'cos':
                result = Math.cos(angle);
                break;
            case 'tan':
                result = Math.tan(angle);
                break;
        }

        display.innerText = result;
        currentInput = result.toString();
        trigFunction = ''; // Reset after calculation
    }

    // Function to clear the display
    function clearDisplay() {
        display.innerText = '0';
        currentInput = '';
        previousInput = '';
        operator = '';
        trigFunction = '';
    }

    // Function to handle Backspace
    function backspace() {
        currentInput = currentInput.slice(0, -1);
        display.innerText = currentInput || '0';
    }

    // Function to toggle between radians and degrees
    function toggleMode() {
        mode = (mode === 'rad') ? 'deg' : 'rad';
        radDegButton.innerText = (mode === 'rad') ? 'rad' : 'deg';
    }
});
