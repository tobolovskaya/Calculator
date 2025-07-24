const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const toggleTheme = document.getElementById("toggleTheme");
const historyList = document.getElementById("historyList");

let output = "";
let history = [];

// Перевірка на оператор
const isOperator = (char) => ["+", "-", "*", "/", "%"].includes(char);

// Основна логіка калькулятора
const calculate = (value) => {
  if (value === "=") {
    try {
      const expression = output.replace(/%/g, "/100");
      const result = Function('"use strict";return (' + expression + ')')();
      addToHistory(output, result);
      output = result.toString();
    } catch (e) {
      output = "Помилка";
    }
  } else if (value === "AC") {
    output = "";
  } else if (value === "DEL") {
    output = output.slice(0, -1);
  } else {
    const lastChar = output[output.length - 1];
    if (isOperator(value) && isOperator(lastChar)) {
      output = output.slice(0, -1) + value;
    } else {
      output += value;
    }
  }
  display.value = output;
};

// Додавання в історію
const addToHistory = (expression, result) => {
  const entry = `${expression} = ${result}`;
  history.unshift(entry); // Додаємо зверху
  if (history.length > 10) history.pop(); // Обмеження до 10 записів
  renderHistory();
};

// Рендер історії в HTML
const renderHistory = () => {
  historyList.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      const exp = item.split("=")[0].trim();
      output = exp;
      display.value = output;
    });
    historyList.appendChild(li);
  });
};

// Події кнопок
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.dataset.value;
    if (value) calculate(value);
  });
});

// Клавіатура
document.addEventListener("keydown", (e) => {
  if ("0123456789.+-*/%".includes(e.key)) {
    calculate(e.key);
  } else if (e.key === "Enter") {
    calculate("=");
  } else if (e.key === "Backspace") {
    calculate("DEL");
  } else if (e.key === "Escape") {
    calculate("AC");
  }
});

// Темна тема
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
