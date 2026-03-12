// Function to switch between content sections when a tab button is clicked
// Switch between sections (tabs) // The buttons
function showDashboard(dashboardId, button) {
    // Hide all dashboards
    const allDashboards = document.querySelectorAll('.dashboard');
    allDashboards.forEach((dash) => dash.classList.remove('active'));

    // Remove active state from all buttons
    const allButtons = document.querySelectorAll('.nav-btn');
    allButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // Show the selected dashboard
    const targetDashboard = document.getElementById(dashboardId);
    if (targetDashboard) targetDashboard.classList.add('active');

    // Highlight the clicked button
    if (button) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
    }

    // If the quiz tab is opened, make sure quiz is ready
    if (dashboardId === 'dash4') ensureQuizReady();
}

// -------------------------
// Kid-friendly Quiz Game
// -------------------------
const quizQuestions = [
    { q: "What does HTML do?", choices: ["It adds colors", "It makes the structure", "It makes sound effects"], answerIndex: 1 },
    { q: "What does CSS do?", choices: ["It decorates the website", "It cooks pasta", "It builds robots"], answerIndex: 0 },
    { q: "What does JavaScript do?", choices: ["It makes the website interactive", "It paints the walls", "It makes ice cream"], answerIndex: 0 },
    { q: "Which one is a good first step to learn?", choices: ["HTML + CSS", "Only passwords", "Only math homework"], answerIndex: 0 },
    { q: "A website is like a…", choices: ["Digital playground", "Flying car", "Sandwich"], answerIndex: 0 }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function ensureQuizReady() {
    const questionEl = document.getElementById('questionText');
    const choicesEl = document.getElementById('choices');
    if (!questionEl || !choicesEl) return;
    renderQuestion();
    updateStars();
}

function renderQuestion() {
    const questionEl = document.getElementById('questionText');
    const choicesEl = document.getElementById('choices');
    const feedbackEl = document.getElementById('feedback');
    if (!questionEl || !choicesEl || !feedbackEl) return;

    quizAnswered = false;
    feedbackEl.textContent = "";
    feedbackEl.classList.remove('good', 'bad');

    const item = quizQuestions[quizIndex];
    questionEl.textContent = item.q;
    choicesEl.innerHTML = "";

    item.choices.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.addEventListener('click', () => chooseAnswer(idx, btn));
        choicesEl.appendChild(btn);
    });
}

function chooseAnswer(idx, buttonEl) {
    if (quizAnswered) return;
    quizAnswered = true;

    const item = quizQuestions[quizIndex];
    const feedbackEl = document.getElementById('feedback');
    const choicesEl = document.getElementById('choices');
    if (!feedbackEl || !choicesEl) return;

    const allChoiceButtons = choicesEl.querySelectorAll('button.choice-btn');
    allChoiceButtons.forEach((btn) => (btn.disabled = true));

    if (idx === item.answerIndex) {
        quizScore = Math.min(5, quizScore + 1);
        feedbackEl.textContent = "Correct! Great job!";
        feedbackEl.classList.add('good');
        buttonEl.classList.add('correct');
    } else {
        feedbackEl.textContent = "Oops! Try the next one — you can do it!";
        feedbackEl.classList.add('bad');
        buttonEl.classList.add('wrong');
        const correctBtn = allChoiceButtons[item.answerIndex];
        if (correctBtn) correctBtn.classList.add('correct');
    }

    updateStars();
}

function updateStars() {
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star${i}`);
        if (!star) continue;
        star.classList.toggle('on', i <= quizScore);
    }
    const starText = document.getElementById('starText');
    if (starText) starText.textContent = `${quizScore} / 5`;
}

function nextQuestion() {
    quizIndex = (quizIndex + 1) % quizQuestions.length;
    renderQuestion();
}

function restartQuiz() {
    quizIndex = 0;
    quizScore = 0;
    renderQuestion();
    updateStars();
}

document.addEventListener('DOMContentLoaded', () => {
    // If the user opens quiz later, showDashboard calls ensureQuizReady()
    // But we can also initialize safely here.
    ensureQuizReady();
});
