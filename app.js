class NaturalNumber {
    #_digits;

    constructor(value) {
        if (typeof value === 'string') {
            this.#_digits = this.#fromString(value);
        } else if (typeof value === 'number') {
            this.#_digits = this.#fromNumber(value);
        } else {
            throw new Error('Некоректний тип даних. Очікується рядок або число.');
        }
    }

    static isValidNaturalNumber(str) {
        if (!str || typeof str !== 'string') return false;

        const trimmed = str.trim();
        if (!trimmed) return false;

        const naturalNumberRegex = /^[1-9][0-9]*$/;
        return naturalNumberRegex.test(trimmed);
    }

    static stripLeadingZeros(str) {
        if (!str) return '0';

        const stripped = str.replace(/^0+/, '');

        return stripped || '0';
    }

    #fromString(str) {
        const trimmed = str.trim();
        
        if (!NaturalNumber.isValidNaturalNumber(trimmed)) {
            throw new Error(`Некоректне натуральне число: "${str}". Натуральне число повинно бути додатним без провідних нулів.`);
        }
        
        return trimmed;
    }

    #fromNumber(num) {
        if (!Number.isInteger(num) || num <= 0) {
            throw new Error(`Некоректне натуральне число: ${num}. Натуральне число повинно бути додатним цілим числом.`);
        }
        
        return num.toString();
    }

    get length() {
        return this.#_digits.length;
    }

    get value() {
        return this.#_digits;
    }

    getDigit(index) {
        if (index < 0 || index >= this.#_digits.length) {
            return 0;
        }
        return parseInt(this.#_digits[index], 10);
    }

    countZeros() {
        let count = 0;
        for (let i = 0; i < this.#_digits.length; i++) {
            if (this.#_digits[i] === '0') {
                count++;
            }
        }
        return count;
    }

    reverseInPlace() {
        const reversed = this.#_digits.split('').reverse().join('');

        const stripped = NaturalNumber.stripLeadingZeros(reversed);

        this.#_digits = stripped;
        
        return this;
    }

    reversed() {
        const reversed = this.#_digits.split('').reverse().join('');

        const stripped = NaturalNumber.stripLeadingZeros(reversed);

        return new NaturalNumber(stripped);
    }

    toString() {
        return this.#_digits;
    }

    valueOf() {
        return this.#_digits;
    }
}

class NaturalNumberApp {
    constructor() {
        this.currentNumber = null;
        this.initializeElements();
        this.attachEventListeners();
        this.updateUI();
    }

    initializeElements() {

        this.numberInput = document.getElementById('numberInput');
        this.indexInput = document.getElementById('indexInput');

        this.inputError = document.getElementById('inputError');
        this.inputSuccess = document.getElementById('inputSuccess');

        this.numberInfo = document.getElementById('numberInfo');
        this.currentNumberDisplay = document.getElementById('currentNumber');
        this.numberLengthDisplay = document.getElementById('numberLength');

        this.countZerosBtn = document.getElementById('countZerosBtn');
        this.getDigitBtn = document.getElementById('getDigitBtn');
        this.reverseNewBtn = document.getElementById('reverseNewBtn');
        this.reverseInPlaceBtn = document.getElementById('reverseInPlaceBtn');

        this.zerosResult = document.getElementById('zerosResult');
        this.zerosCount = document.getElementById('zerosCount');
        this.digitResult = document.getElementById('digitResult');
        this.usedIndex = document.getElementById('usedIndex');
        this.digitValue = document.getElementById('digitValue');
        this.reverseNewResult = document.getElementById('reverseNewResult');
        this.reversedNumber = document.getElementById('reversedNumber');
        this.reverseInPlaceResult = document.getElementById('reverseInPlaceResult');
        this.updatedNumber = document.getElementById('updatedNumber');
    }

    attachEventListeners() {
        this.numberInput.addEventListener('input', () => this.validateInput());
        this.numberInput.addEventListener('blur', () => this.createNumber());

        this.countZerosBtn.addEventListener('click', () => this.countZeros());
        this.getDigitBtn.addEventListener('click', () => this.getDigit());
        this.reverseNewBtn.addEventListener('click', () => this.reverseNew());
        this.reverseInPlaceBtn.addEventListener('click', () => this.reverseInPlace());

        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createNumber();
            }
        });

        this.indexInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.getDigitBtn.disabled) {
                this.getDigit();
            }
        });
    }

    validateInput() {
        const value = this.numberInput.value.trim();
        
        if (!value) {
            this.hideMessages();
            this.numberInput.classList.remove('valid', 'invalid');
            return;
        }

        if (NaturalNumber.isValidNaturalNumber(value)) {
            this.showSuccess('Валідне натуральне число');
            this.numberInput.classList.remove('invalid');
            this.numberInput.classList.add('valid');
        } else {
            this.showError('Некоректне натуральне число. Введіть додатне число без провідних нулів.');
            this.numberInput.classList.remove('valid');
            this.numberInput.classList.add('invalid');
        }
    }

    createNumber() {
        const value = this.numberInput.value.trim();
        
        if (!value) {
            this.currentNumber = null;
            this.updateUI();
            return;
        }

        try {
            this.currentNumber = new NaturalNumber(value);
            this.showSuccess(`Створено число: ${this.currentNumber.toString()}`);
            this.numberInput.classList.remove('invalid');
            this.numberInput.classList.add('valid');
            this.updateUI();
            this.clearResults();
        } catch (error) {
            this.showError(error.message);
            this.numberInput.classList.remove('valid');
            this.numberInput.classList.add('invalid');
            this.currentNumber = null;
            this.updateUI();
        }
    }

    countZeros() {
        if (!this.currentNumber) return;
        
        try {
            const zerosCount = this.currentNumber.countZeros();
            this.zerosCount.textContent = zerosCount;
            this.zerosResult.classList.remove('hidden');
            this.zerosResult.classList.add('success');
        } catch (error) {
            this.showError(`Помилка при підрахунку нулів: ${error.message}`);
        }
    }

    getDigit() {
        if (!this.currentNumber) return;
        
        const index = parseInt(this.indexInput.value, 10);
        
        if (isNaN(index)) {
            this.showError('Введіть коректний індекс (число)');
            return;
        }

        try {
            const digit = this.currentNumber.getDigit(index);
            this.usedIndex.textContent = index;
            this.digitValue.textContent = digit;
            this.digitResult.classList.remove('hidden');
            
            if (index < 0 || index >= this.currentNumber.length) {
                this.digitResult.classList.add('error');
                this.digitResult.classList.remove('success');
            } else {
                this.digitResult.classList.add('success');
                this.digitResult.classList.remove('error');
            }
        } catch (error) {
            this.showError(`Помилка при отриманні цифри: ${error.message}`);
        }
    }

    reverseNew() {
        if (!this.currentNumber) return;
        
        try {
            const reversed = this.currentNumber.reversed();
            this.reversedNumber.textContent = reversed.toString();
            this.reverseNewResult.classList.remove('hidden');
            this.reverseNewResult.classList.add('success');
        } catch (error) {
            this.showError(`Помилка при створенні оберненого числа: ${error.message}`);
        }
    }

    reverseInPlace() {
        if (!this.currentNumber) return;
        
        try {
            this.currentNumber.reverseInPlace();
            this.updatedNumber.textContent = this.currentNumber.toString();
            this.reverseInPlaceResult.classList.remove('hidden');
            this.reverseInPlaceResult.classList.add('success');

            this.numberInput.value = this.currentNumber.toString();
            this.updateNumberInfo();
        } catch (error) {
            this.showError(`Помилка при оберненні числа: ${error.message}`);
        }
    }

    showError(message) {
        this.inputError.textContent = message;
        this.inputError.classList.remove('hidden');
        this.inputSuccess.classList.add('hidden');

        this.numberInput.classList.add('shake');
        setTimeout(() => {
            this.numberInput.classList.remove('shake');
        }, 500);
    }

    showSuccess(message) {
        this.inputSuccess.textContent = message;
        this.inputSuccess.classList.remove('hidden');
        this.inputError.classList.add('hidden');
    }

    hideMessages() {
        this.inputError.classList.add('hidden');
        this.inputSuccess.classList.add('hidden');
    }

    clearResults() {
        const results = [
            this.zerosResult,
            this.digitResult,
            this.reverseNewResult,
            this.reverseInPlaceResult
        ];
        
        results.forEach(result => {
            result.classList.add('hidden');
            result.classList.remove('success', 'error');
        });
    }

    updateNumberInfo() {
        if (this.currentNumber) {
            this.currentNumberDisplay.textContent = this.currentNumber.toString();
            this.numberLengthDisplay.textContent = this.currentNumber.length;
            this.numberInfo.classList.remove('hidden');
        } else {
            this.numberInfo.classList.add('hidden');
        }
    }

    updateUI() {
        const hasNumber = this.currentNumber !== null;

        this.countZerosBtn.disabled = !hasNumber;
        this.getDigitBtn.disabled = !hasNumber;
        this.reverseNewBtn.disabled = !hasNumber;
        this.reverseInPlaceBtn.disabled = !hasNumber;

        this.updateNumberInfo();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NaturalNumberApp();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NaturalNumber, NaturalNumberApp };
}