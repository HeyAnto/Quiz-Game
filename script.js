let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
const timerDuration = 30;

const selectionPage = document.getElementById('selection-page');
const quizPage = document.getElementById('quiz-page');
const scorePage = document.getElementById('score-page');
const quizTitle = document.getElementById('quiz-title');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('quiz-question-title');
const questionImage = document.getElementById('quiz-question-image');
const answerButtons = document.querySelectorAll('#quiz-btn .quiz-answer-btn');
const nextButton = document.getElementById('next-btn');
const timer = document.getElementById('quiz-timer');
const scoreText = document.getElementById('score');
const backButton = document.getElementById('back-btn');

let quizzes = {};

async function loadQuizzes() {
    const response = await fetch('quizzes.json');
    quizzes = await response.json();
    displayQuizSelection();
}

function displayQuizSelection() {
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML ='';
    for (const quizKey in quizzes) {
        const quiz = quizzes[quizKey];
        const button = document.createElement('button');
        button.innerText = quiz.title;
        button.onclick = () => startQuiz(quizKey);
        quizList.appendChild(button);
    }
}

function startQuiz(quizKey) {
    currentQuiz = quizzes[quizKey];
    currentQuestionIndex = 0;
    score = 0;

    selectionPage.style.display = 'none';
    quizPage.style.display = 'flex';

    quizTitle.innerText = currentQuiz.title;
    showQuestion();
}

function showQuestion() {
    clearInterval(timerInterval);
    const questionData = currentQuiz.questions[currentQuestionIndex];
    
    questionText.innerText = questionData.question;
    if (questionData.image) {
        questionImage.src = questionData.image;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

    answerButtons.forEach((button, index) => {
        button.innerText = questionData.answers[index];
        button.classList.remove('selected', 'correct', 'incorrect', 'disabled');

        button.onclick = () => selectAnswer(index);
    });

    nextButton.classList.add('inactive');
    nextButton.style.pointerEvents = 'none';
    updateQuestionCounter();
    startTimer();
}

function startTimer() {
    let timeRemaining = timerDuration;
    timer.innerText = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timer.innerText = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showCorrectAnswer();
            nextButton.classList.remove('inactive');
            nextButton.style.pointerEvents = 'auto';
            nextButton.style.cursor = 'pointer';
        }
    }, 1000);
}

function selectAnswer(selectedIndex) {
    clearInterval(timerInterval);
    const questionData = currentQuiz.questions[currentQuestionIndex];

    answerButtons.forEach((button, index) => {
        button.classList.add('disabled');
        if (index === questionData.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
    });

    nextButton.classList.remove('inactive');
    nextButton.style.pointerEvents = 'auto';
    nextButton.style.cursor = 'pointer';

    if (selectedIndex === questionData.correct) {
        score++;
    }
}

function showCorrectAnswer() {
    const questionData = currentQuiz.questions[currentQuestionIndex];

    answerButtons.forEach((button, index) => {
        button.classList.add('disabled');
        if (index === questionData.correct) {
            button.classList.add('correct');
        }
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    clearInterval(timerInterval);
    quizPage.style.display = 'none';
    scorePage.style.display = 'flex';
    scoreText.innerText = `You got ${score} correct answers out of ${currentQuiz.questions.length}.`;
}

function goToSelection() {
    clearInterval(timerInterval);
    scorePage.style.display = 'none';
    selectionPage.style.display = 'flex';
}

function updateQuestionCounter() {
    const totalQuestions = currentQuiz.questions.length;
    questionCounter.innerText = ` ${currentQuestionIndex + 1} of ${totalQuestions} questions`;
}

backButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    quizPage.style.display = 'none';
    selectionPage.style.display = 'flex';
});

window.onload = loadQuizzes;