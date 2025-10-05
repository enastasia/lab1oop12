/**
 * Клас для роботи з натуральними числами з повною інкапсуляцією
 * Використовує ООП підхід ES6 з приватними полями
 */
class NaturalNumber {
    // Приватне поле для зберігання цифр
    #_digits;

    /**
     * Конструктор класу NaturalNumber
     * @param {string|number} value - Значення для створення натурального числа
     */
    constructor(value) {
        if (typeof value === 'string') {
            this.#_digits = this.#fromString(value);
        } else if (typeof value === 'number') {
            this.#_digits = this.#fromNumber(value);
        } else {
            throw new Error('Некоректний тип даних. Очікується рядок або число.');
        }
    }

    /**
     * Статичний метод для валідації рядка як натурального числа
     * @param {string} str - Рядок для перевірки
     * @returns {boolean} - true якщо рядок є валідним натуральним числом
     */
    static isValidNaturalNumber(str) {
        if (!str || typeof str !== 'string') return false;
        
        // Перевірка на порожній рядок або тільки пробіли
        const trimmed = str.trim();
        if (!trimmed) return false;
        
        // Перевірка регулярним виразом: перша цифра 1-9, решта 0-9
        const naturalNumberRegex = /^[1-9][0-9]*$/;
        return naturalNumberRegex.test(trimmed);
    }

    /**
     * Статичний метод для видалення провідних нулів
     * @param {string} str - Рядок з можливими провідними нулями
     * @returns {string} - Рядок без провідних нулів
     */
    static stripLeadingZeros(str) {
        if (!str) return '0';
        
        // Видаляємо провідні нулі
        const stripped = str.replace(/^0+/, '');
        
        // Якщо рядок став порожнім (тобто було тільки нулі), повертаємо '0'
        return stripped || '0';
    }

    /**
     * Приватний метод для створення з рядка
     * @param {string} str - Рядок для перетворення
     * @returns {string} - Валідований рядок цифр
     */
    #fromString(str) {
        const trimmed = str.trim();
        
        if (!NaturalNumber.isValidNaturalNumber(trimmed)) {
            throw new Error(`Некоректне натуральне число: "${str}". Натуральне число повинно бути додатним без провідних нулів.`);
        }
        
        return trimmed;
    }

    /**
     * Приватний метод для створення з числа
     * @param {number} num - Число для перетворення
     * @returns {string} - Рядок цифр
     */
    #fromNumber(num) {
        if (!Number.isInteger(num) || num <= 0) {
            throw new Error(`Некоректне натуральне число: ${num}. Натуральне число повинно бути додатним цілим числом.`);
        }
        
        return num.toString();
    }

    /**
     * Геттер для отримання довжини числа
     * @returns {number} - Довжина числа
     */
    get length() {
        return this.#_digits.length;
    }

    /**
     * Геттер для отримання значення як рядка
     * @returns {string} - Значення числа як рядок
     */
    get value() {
        return this.#_digits;
    }

    /**
     * Метод-"індексатор" для отримання цифри за індексом
     * @param {number} index - Індекс цифри (0-based)
     * @returns {number} - Цифра за вказаним індексом або 0 при виході за межі
     */
    getDigit(index) {
        if (index < 0 || index >= this.#_digits.length) {
            return 0;
        }
        return parseInt(this.#_digits[index], 10);
    }

    /**
     * Підрахунок кількості нулів у числі
     * @returns {number} - Кількість нулів
     */
    countZeros() {
        let count = 0;
        for (let i = 0; i < this.#_digits.length; i++) {
            if (this.#_digits[i] === '0') {
                count++;
            }
        }
        return count;
    }

    /**
     * Обернення числа на місці (змінює поточний об'єкт)
     * @returns {NaturalNumber} - Посилання на поточний об'єкт для method chaining
     */
    reverseInPlace() {
        // Обертаємо рядок
        const reversed = this.#_digits.split('').reverse().join('');
        
        // Видаляємо провідні нулі (які стали завершальними після обернення)
        const stripped = NaturalNumber.stripLeadingZeros(reversed);
        
        // Оновлюємо внутрішнє представлення
        this.#_digits = stripped;
        
        return this;
    }

    /**
     * Створення нового оберненого числа (не змінює поточний об'єкт)
     * @returns {NaturalNumber} - Новий об'єкт з оберненим числом
     */
    reversed() {
        // Обертаємо рядок
        const reversed = this.#_digits.split('').reverse().join('');
        
        // Видаляємо провідні нулі
        const stripped = NaturalNumber.stripLeadingZeros(reversed);
        
        // Створюємо новий об'єкт
        return new NaturalNumber(stripped);
    }

    /**
     * Перевизначення методу toString()
     * @returns {string} - Рядкове представлення числа
     */
    toString() {
        return this.#_digits;
    }

    /**
     * Перевизначення методу valueOf() для автоматичного перетворення
     * @returns {string} - Значення для порівнянь та операцій
     */
    valueOf() {
        return this.#_digits;
    }
}

/**
 * Основний клас додатку для управління UI та взаємодією з користувачем
 */
class NaturalNumberApp {
    constructor() {
        this.currentNumber = null;
        this.initializeElements();
        this.attachEventListeners();
        this.updateUI();
    }

    /**
     * Ініціалізація DOM елементів
     */
    initializeElements() {
        // Елементи вводу
        this.numberInput = document.getElementById('numberInput');
        this.indexInput = document.getElementById('indexInput');
        
        // Повідомлення про помилки та успіх
        this.inputError = document.getElementById('inputError');
        this.inputSuccess = document.getElementById('inputSuccess');
        
        // Інформація про число
        this.numberInfo = document.getElementById('numberInfo');
        this.currentNumberDisplay = document.getElementById('currentNumber');
        this.numberLengthDisplay = document.getElementById('numberLength');
        
        // Кнопки операцій
        this.countZerosBtn = document.getElementById('countZerosBtn');
        this.getDigitBtn = document.getElementById('getDigitBtn');
        this.reverseNewBtn = document.getElementById('reverseNewBtn');
        this.reverseInPlaceBtn = document.getElementById('reverseInPlaceBtn');
        
        // Області результатів
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

    /**
     * Прикріплення обробників подій
     */
    attachEventListeners() {
        // Валідація вводу в реальному часі
        this.numberInput.addEventListener('input', () => this.validateInput());
        this.numberInput.addEventListener('blur', () => this.createNumber());
        
        // Обробники кнопок
        this.countZerosBtn.addEventListener('click', () => this.countZeros());
        this.getDigitBtn.addEventListener('click', () => this.getDigit());
        this.reverseNewBtn.addEventListener('click', () => this.reverseNew());
        this.reverseInPlaceBtn.addEventListener('click', () => this.reverseInPlace());
        
        // Enter для створення числа
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createNumber();
            }
        });
        
        // Enter для отримання цифри
        this.indexInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.getDigitBtn.disabled) {
                this.getDigit();
            }
        });
    }

    /**
     * Валідація вводу користувача
     */
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

    /**
     * Створення об'єкта NaturalNumber з введеного значення
     */
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

    /**
     * Підрахунок нулів у числі
     */
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

    /**
     * Отримання цифри за індексом
     */
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

    /**
     * Створення нового оберненого числа
     */
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

    /**
     * Обернення поточного числа на місці
     */
    reverseInPlace() {
        if (!this.currentNumber) return;
        
        try {
            this.currentNumber.reverseInPlace();
            this.updatedNumber.textContent = this.currentNumber.toString();
            this.reverseInPlaceResult.classList.remove('hidden');
            this.reverseInPlaceResult.classList.add('success');
            
            // Оновлюємо поле вводу та інформацію про число
            this.numberInput.value = this.currentNumber.toString();
            this.updateNumberInfo();
        } catch (error) {
            this.showError(`Помилка при оберненні числа: ${error.message}`);
        }
    }

    /**
     * Показ повідомлення про помилку
     * @param {string} message - Текст помилки
     */
    showError(message) {
        this.inputError.textContent = message;
        this.inputError.classList.remove('hidden');
        this.inputSuccess.classList.add('hidden');
        
        // Анімація струсу для привернення уваги
        this.numberInput.classList.add('shake');
        setTimeout(() => {
            this.numberInput.classList.remove('shake');
        }, 500);
    }

    /**
     * Показ повідомлення про успіх
     * @param {string} message - Текст успіху
     */
    showSuccess(message) {
        this.inputSuccess.textContent = message;
        this.inputSuccess.classList.remove('hidden');
        this.inputError.classList.add('hidden');
    }

    /**
     * Приховування всіх повідомлень
     */
    hideMessages() {
        this.inputError.classList.add('hidden');
        this.inputSuccess.classList.add('hidden');
    }

    /**
     * Очищення всіх результатів операцій
     */
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

    /**
     * Оновлення інформації про поточне число
     */
    updateNumberInfo() {
        if (this.currentNumber) {
            this.currentNumberDisplay.textContent = this.currentNumber.toString();
            this.numberLengthDisplay.textContent = this.currentNumber.length;
            this.numberInfo.classList.remove('hidden');
        } else {
            this.numberInfo.classList.add('hidden');
        }
    }

    /**
     * Оновлення стану кнопок та UI
     */
    updateUI() {
        const hasNumber = this.currentNumber !== null;
        
        // Увімкнення/вимкнення кнопок
        this.countZerosBtn.disabled = !hasNumber;
        this.getDigitBtn.disabled = !hasNumber;
        this.reverseNewBtn.disabled = !hasNumber;
        this.reverseInPlaceBtn.disabled = !hasNumber;
        
        // Оновлення інформації про число
        this.updateNumberInfo();
    }
}

// Ініціалізація додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new NaturalNumberApp();
});

// Експорт класу для можливого використання в інших модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NaturalNumber, NaturalNumberApp };
}