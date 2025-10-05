let score = 0;
let streak = 0;
let problem = {};
let attempts = 0;

// DOM-element
const problemEl = document.getElementById("problem");
const feedbackEl = document.getElementById("feedback");
const solutionEl = document.getElementById("solution");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const answerInput = document.getElementById("answer");
const form = document.getElementById("answer-form");

// Ladda ljudfiler
const sounds = {
  correct: new Audio("sounds/correct.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
  next: new Audio("sounds/nasta_uppgiften.mp3"),
  reset: new Audio("sounds/startaom.mp3"),
  streak: new Audio("sounds/hurra.mp3"),
};

// Händelser
document.getElementById("new-problem").addEventListener("click", () => {
  playSound("next");
  generateProblem();
});
document.getElementById("reset").addEventListener("click", resetGame);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkAnswer();
});

// =========================
// LJUDFUNKTION
// =========================
function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

// =========================
// MATTEUPPGIFTER
// =========================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRange(difficulty) {
  if (difficulty === "easy") return { min: 1, max: 10 };
  if (difficulty === "medium") return { min: 5, max: 50 };
  return { min: 10, max: 200 };
}

function generateProblem() {
  const op = document.getElementById("operation").value;
  const diff = document.getElementById("difficulty").value;
  const range = getRange(diff);

  let a = randInt(range.min, range.max);
  let b = randInt(range.min, range.max);

  if (op === "subtraction" && a < b) [a, b] = [b, a];
  if (op === "multiplication") {
    a = randInt(1, 12);
    b = randInt(1, 12);
  }
  if (op === "division") {
    b = randInt(1, 12);
    a = b * randInt(1, 12);
  }

  let text = "";
  let answer = 0;
  switch (op) {
    case "addition":
      text = `${a} + ${b}`;
      answer = a + b;
      break;
    case "subtraction":
      text = `${a} - ${b}`;
      answer = a - b;
      break;
    case "multiplication":
      text = `${a} × ${b}`;
      answer = a * b;
      break;
    case "division":
      text = `${a} ÷ ${b}`;
      answer = a / b;
      break;
  }

  problem = { text, answer };
  attempts = 0;
  problemEl.textContent = text;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  solutionEl.textContent = "";
  answerInput.value = "";
}

// =========================
// RÄTTNING OCH FEEDBACK
// =========================
function checkAnswer() {
  const userAnswer = parseFloat(answerInput.value);
  if (isNaN(userAnswer)) {
    feedbackEl.textContent = "Skriv ett tal!";
    feedbackEl.className = "feedback wrong";
    playSound("wrong");
    return;
  }

  attempts++;
  if (Math.abs(userAnswer - problem.answer) < 1e-9) {
    feedbackEl.textContent = "Rätt svar!";
    feedbackEl.className = "feedback correct";
    playSound("correct");

    score += 10;
    streak++;
    if (streak % 3 === 0) {
      playSound("streak");
    }

    updateStats();
    setTimeout(generateProblem, 1000);
  } else {
    feedbackEl.textContent = "Inte helt rätt, försök igen!";
    feedbackEl.className = "feedback wrong";
    playSound("wrong");

    streak = 0;
    updateStats();

    if (attempts >= 2) {
      solutionEl.textContent = `Rätt svar: ${problem.answer}`;
      playSound("correct"); // alternativt annan ljudfil för rätt svar
    }
  }
}

function updateStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
}

function resetGame() {
  score = 0;
  streak = 0;
  updateStats();
  feedbackEl.textContent = "";
  solutionEl.textContent = "";
  problemEl.textContent = "Tryck “Ny uppgift” för att börja!";
  playSound("reset");
}
