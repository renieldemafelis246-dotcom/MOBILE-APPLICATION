// StudyCards - Flashcard & Quiz Application
// JavaScript logic for the application

// State variables
let flashcards = []; // Array of flashcard objects
let subjects = []; // Array of subject strings
let currentFlashcardIndex = 0; // Index of currently displayed flashcard
let quizState = {
    questions: [], // Array of quiz question objects
    currentQuestionIndex: 0,
    score: 0,
    answers: [] // User's answers
};
let studentName = ""; // Student's name
let isDarkMode = false; // Dark mode toggle

// Initialize the application
function initApp() {
    loadData();
    setupSampleDataIfNeeded();
    renderHomeScreen();
    renderFlashcardsScreen();
    renderSubjectsScreen();
    renderProfileScreen();
    updateBottomNavigation();
    applyDarkMode();
}

// Load data from LocalStorage
function loadData() {
    const savedFlashcards = localStorage.getItem('flashcards');
    const savedSubjects = localStorage.getItem('subjects');
    const savedStudentName = localStorage.getItem('studentName');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedFlashcards) {
        flashcards = JSON.parse(savedFlashcards);
    }
    if (savedSubjects) {
        subjects = JSON.parse(savedSubjects);
    }
    if (savedStudentName) {
        studentName = savedStudentName;
    }
    if (savedDarkMode !== null) {
        isDarkMode = savedDarkMode === 'true';
    }
}

// Save data to LocalStorage
function saveData() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('studentName', studentName);
    localStorage.setItem('darkMode', isDarkMode);
}

// Setup sample data if no data exists
function setupSampleDataIfNeeded() {
    if (flashcards.length === 0 && subjects.length === 0) {
        // Sample subjects
        const sampleSubjects = ['HTML', 'CSS', 'JavaScript', 'Computer Fundamentals'];
        subjects = [...sampleSubjects];

        // Sample flashcards
        const sampleFlashcards = [
            {
                question: "What does HTML stand for?",
                answer: "HyperText Markup Language",
                subject: "HTML",
                difficulty: "easy"
            },
            {
                question: "What does CSS stand for?",
                answer: "Cascading Style Sheets",
                subject: "CSS",
                difficulty: "easy"
            },
            {
                question: "What does JS stand for?",
                answer: "JavaScript",
                subject: "JavaScript",
                difficulty: "easy"
            },
            {
                question: "What is the brain of the computer?",
                answer: "Central Processing Unit (CPU)",
                subject: "Computer Fundamentals",
                difficulty: "medium"
            }
        ];
        flashcards = [...sampleFlashcards];

        // Save sample data
        saveData();
    }
}

// ===== SCREEN RENDERING FUNCTIONS =====

// Render home screen statistics
function renderHomeScreen() {
    document.getElementById('flashcard-count').textContent = flashcards.length;
    document.getElementById('subject-count').textContent = subjects.length;

    // Calculate overall quiz score (average of all quiz attempts)
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    if (quizHistory.length > 0) {
        const totalScore = quizHistory.reduce((sum, quiz) => sum + score, 0);
        const averageScore = Math.round((totalScore / quizHistory.length) * 100);
        document.getElementById('overall-score').textContent = averageScore + '%';
    } else {
        document.getElementById('overall-score').textContent = '0%';
    }

    // Update quiz count
    document.getElementById('quiz-count').textContent = quizHistory.length;
}

// Render flashcards screen
function renderFlashcardsScreen() {
    renderFlashcard();
    updateFlashcardNavigation();
    renderSubjectFilter();
}

// Render a single flashcard
function renderFlashcard() {
    const flashcardFront = document.getElementById('flashcard-front');
    const flashcardBack = document.getElementById('flashcard-back');

    if (flashcards.length === 0) {
        flashcardFront.textContent = 'No flashcards available';
        flashcardBack.textContent = 'Add some flashcards to get started!';
        return;
    }

    const currentCard = flashcards[currentFlashcardIndex];
    flashcardFront.textContent = currentCard.question;
    flashcardBack.textContent = currentCard.answer;
}

// Update flashcard position display
function updateFlashcardNavigation() {
    document.getElementById('flashcard-position').textContent =
        `${currentFlashcardIndex + 1} / ${flashcards.length}`;

    // Show/hide empty state
    const emptyState = document.getElementById('empty-flashcards-state');
    const flashcardDisplay = document.getElementById('flashcard-display');
    if (flashcards.length === 0) {
        emptyState.style.display = 'block';
        flashcardDisplay.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        flashcardDisplay.style.display = 'block';
    }
}

// Render subject filter dropdown
function renderSubjectFilter() {
    const subjectFilter = document.getElementById('subject-filter');
    // Clear current options except the first "All Subjects"
    subjectFilter.innerHTML = '<option value="all">All Subjects</option>';

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

// Render subjects screen
function renderSubjectsScreen() {
    const subjectsList = document.getElementById('subjects-list');
    subjectsList.innerHTML = '';

    if (subjects.length === 0) {
        document.getElementById('empty-subjects-state').style.display = 'block';
        return;
    } else {
        document.getElementById('empty-subjects-state').style.display = 'none';
    }

    subjects.forEach((subject, index) => {
        const subjectItem = document.createElement('div');
        subjectItem.className = 'subject-item';

        // Count flashcards for this subject
        const cardCount = flashcards.filter(card => card.subject === subject).length;

        subjectItem.innerHTML = `
            <span>${subject}</span>
            <div class="subject-count">${cardCount}</div>
            <button onclick="deleteSubject(${index})">×</button>
        `;

        subjectsList.appendChild(subjectItem);
    });
}

// Render profile screen
function renderProfileScreen() {
    document.getElementById('student-name').value = studentName;
    document.getElementById('dark-mode-toggle').checked = isDarkMode;
}

// Render quiz screen (called when starting quiz)
function renderQuizScreen() {
    // This will be handled by startQuiz() and nextQuizQuestion()
}

// ===== NAVIGATION FUNCTIONS =====

function showHome() {
    activateScreen('home');
}

function showFlashcards() {
    activateScreen('flashcards');
    renderFlashcardsScreen();
}

function showQuiz() {
    activateScreen('quiz');
}

function showSubjects() {
    activateScreen('subjects');
    renderSubjectsScreen();
}

function showAddFlashcardForm() {
    activateScreen('add-flashcard-form');
    // Reset form
    document.getElementById('flashcard-form').reset();
    document.getElementById('form-error').textContent = '';
    // Update subject dropdown in form
    updateFlashcardFormSubjects();
}

function hideAddFlashcardForm() {
    showHome(); // Go back to home screen
}

function showProfile() {
    activateScreen('profile');
    renderProfileScreen();
}

function activateScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const activeScreen = document.getElementById(`${screenId}-screen`);
    if (activeScreen) {
        activeScreen.classList.add('active');
    }

    // Update bottom navigation
    updateBottomNavigation(screenId);
}

function updateBottomNavigation(activeScreenId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.screen === activeScreenId) {
            button.classList.add('active');
        }
    });
}

// ===== FLASHCARD FUNCTIONS =====

function flipFlashcard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

function previousFlashcard() {
    if (flashcards.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
    renderFlashcard();
    updateFlashcardNavigation();
    // Reset flip state
    document.getElementById('flashcard').classList.remove('flipped');
}

function nextFlashcard() {
    if (flashcards.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
    renderFlashcard();
    updateFlashcardNavigation();
    // Reset flip state
    document.getElementById('flashcard').classList.remove('flipped');
}

function shuffleFlashcards() {
    if (flashcards.length === 0) return;
    // Fisher-Yates shuffle algorithm
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentFlashcardIndex = 0;
    renderFlashcard();
    updateFlashcardNavigation();
    // Reset flip state
    document.getElementById('flashcard').classList.remove('flipped');
}

function markAsKnown() {
    // In a more advanced app, we might track this per card
    // For now, we'll just show a brief visual feedback
    const knownBtn = document.querySelector('.btn-mark.known');
    knownBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        knownBtn.style.transform = 'scale(1)';
    }, 200);
}

function markAsNeedReview() {
    const reviewBtn = document.querySelector('.btn-mark.review');
    reviewBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        reviewBtn.style.transform = 'scale(1)';
    }, 200);
}

// ===== SEARCH AND FILTER FUNCTIONS =====

function searchFlashcards() {
    const searchTerm = document.getElementById('flashcard-search').value.toLowerCase();
    // In a full implementation, we would filter the flashcards array
    // For simplicity, we'll just note that this would be implemented
    alert(`Search for: ${searchTerm}\n(In a full app, this would filter flashcards)`);
}

function filterFlashcardsBySubject() {
    const selectedSubject = document.getElementById('subject-filter').value;
    // In a full implementation, we would filter flashcards by subject
    // For simplicity, we'll just note that this would be implemented
    alert(`Filter by subject: ${selectedSubject}\n(In a full app, this would filter flashcards)`);
    // For now, we'll just render the current flashcard (which may be from any subject)
    renderFlashcard();
}

// ===== SUBJECT FUNCTIONS =====

function addSubject() {
    const subjectInput = document.getElementById('new-subject-input');
    const subjectName = subjectInput.value.trim();

    if (subjectName === '') {
        alert('Please enter a subject name');
        return;
    }

    if (subjects.includes(subjectName)) {
        alert('Subject already exists');
        return;
    }

    subjects.push(subjectName);
    subjectInput.value = '';
    saveData();
    renderSubjectsScreen();
    updateFlashcardFormSubjects(); // Update the subject dropdown in add flashcard form
}

function deleteSubject(index) {
    const subjectToDelete = subjects[index];

    // Check if any flashcards use this subject
    const hasFlashcards = flashcards.some(card => card.subject === subjectToDelete);
    if (hasFlashcards) {
        alert('Cannot delete subject that has flashcards. Please move or delete those flashcards first.');
        return;
    }

    if (confirm(`Are you sure you want to delete "${subjectToDelete}"?`)) {
        subjects.splice(index, 1);
        saveData();
        renderSubjectsScreen();
        updateFlashcardFormSubjects();
    }
}

// ===== FLASHCARD FORM FUNCTIONS =====

function updateFlashcardFormSubjects() {
    const subjectSelect = document.getElementById('flashcard-subject');
    // Clear current options
    subjectSelect.innerHTML = '<option value="">Select a subject</option>';

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

function saveFlashcard(event) {
    event.preventDefault(); // Prevent form submission

    const question = document.getElementById('flashcard-question').value.trim();
    const answer = document.getElementById('flashcard-answer').value.trim();
    const subject = document.getElementById('flashcard-subject').value;
    const difficulty = document.getElementById('flashcard-difficulty').value;

    // Validation
    if (question === '' || answer === '' || subject === '') {
        document.getElementById('form-error').textContent = 'Please fill in all required fields';
        return;
    }

    // Create new flashcard object
    const newFlashcard = {
        question: question,
        answer: answer,
        subject: subject,
        difficulty: difficulty
    };

    flashcards.push(newFlashcard);
    currentFlashcardIndex = flashcards.length - 1; // Show the newly added card
    saveData();

    // Reset form and go to flashcards screen
    document.getElementById('flashcard-form').reset();
    document.getElementById('form-error').textContent = '';
    showFlashcards();
}

// ===== QUIZ FUNCTIONS =====

function startQuiz() {
    if (flashcards.length === 0) {
        alert('Please add some flashcards before taking a quiz');
        return;
    }

    // Prepare quiz questions from flashcards
    quizState.questions = [...flashcards]; // Copy flashcards to quiz questions
    quizState.currentQuestionIndex = 0;
    quizState.score = 0;
    quizState.answers = [];

    // Shuffle questions for quiz
    for (let i = quizState.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizState.questions[i], quizState.questions[j]] = [quizState.questions[j], quizState.questions[i]];
    }

    showQuizScreen();
    renderQuizQuestion();
}

function showQuizScreen() {
    activateScreen('quiz');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-container').style.display = 'block';
}

function renderQuizQuestion() {
    if (quizState.questions.length === 0) {
        showQuizResults();
        return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    document.getElementById('quiz-question').textContent = currentQuestion.question;

    // Generate options: 1 correct + 3 incorrect answers
    const correctAnswer = currentQuestion.answer;
    const incorrectAnswers = generateIncorrectAnswers(correctAnswer, 3);
    const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = ''; // Clear previous options

    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => selectQuizAnswer(button, answer === correctAnswer);
        optionsContainer.appendChild(button);
    });

    // Update progress
    document.getElementById('quiz-current').textContent = quizState.currentQuestionIndex + 1;
    document.getElementById('quiz-total').textContent = quizState.questions.length;
}

function generateIncorrectAnswers(correctAnswer, count) {
    // Collect all possible answers from flashcards
    const allAnswers = flashcards.map(card => card.answer);
    // Remove the correct answer from the pool
    const incorrectPool = allAnswers.filter(answer => answer !== correctAnswer);

    // If we don't have enough incorrect answers, generate generic ones
    if (incorrectPool.length < count) {
        const needed = count - incorrectPool.length;
        const genericIncorrect = [];
        for (let i = 0; i < needed; i++) {
            genericIncorrect.push(`Incorrect Option ${i + 1}`);
        }
        return [...incorrectPool, ...genericIncorrect].slice(0, count);
    }

    // Shuffle and take the required number
    return shuffleArray([...incorrectPool]).slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectQuizAnswer(button, isCorrect) {
    // Disable all buttons
    const buttons = document.getElementById('quiz-options').querySelectorAll('button');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === button.textContent) {
            // This is the selected button
            if (isCorrect) {
                btn.classList.add('correct');
                quizState.score++;
            } else {
                btn.classList.add('incorrect');
            }
        } else {
            // Show correct answer for other buttons
            const correctAnswer = quizState.questions[quizState.currentQuestionIndex].answer;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        }
    });

    // Record answer
    quizState.answers.push({
        question: quizState.questions[quizState.currentQuestionIndex].question,
        selectedAnswer: button.textContent,
        correctAnswer: quizState.questions[quizState.currentQuestionIndex].answer,
        isCorrect: isCorrect
    });
}

function nextQuizQuestion() {
    // Check if an answer was selected
    const selectedButton = document.getElementById('quiz-options').querySelector('.correct, .incorrect');
    if (!selectedButton) {
        alert('Please select an answer before proceeding');
        return;
    }

    // Move to next question
    quizState.currentQuestionIndex++;

    if (quizState.currentQuestionIndex >= quizState.questions.length) {
        showQuizResults();
    } else {
        // Re-enable buttons for next question
        const buttons = document.getElementById('quiz-options').querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.className = ''; // Remove correct/incorrect classes
        });
        renderQuizQuestion();
    }
}

function showQuizResults() {
    document.getElementById('quiz-container').style.display = 'none';
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.classList.remove('hidden');

    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    document.getElementById('quiz-score').textContent = `Score: ${quizState.score} / ${quizState.questions.length}`;
    document.getElementById('quiz-percentage').textContent = `Percentage: ${percentage}%`;

    // Performance message
    let message = '';
    if (percentage >= 90) {
        message = 'Excellent work!';
    } else if (percentage >= 70) {
        message = 'Great job!';
    } else if (percentage >= 50) {
        message = 'Good effort!';
    } else {
        message = 'Keep studying!';
    }
    document.getElementById('quiz-message').textContent = message;

    // Save quiz to history
    saveQuizToHistory();
}

function saveQuizToHistory() {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    quizHistory.push({
        date: new Date().toISOString(),
        score: quizState.score,
        total: quizState.questions.length,
        percentage: Math.round((quizState.score / quizState.questions.length) * 100)
    });
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));

    // Update home screen stats
    renderHomeScreen();
}

function retakeQuiz() {
    startQuiz();
}

function reviewFlashcardsAfterQuiz() {
    showFlashcards();
}

// ===== PROFILE FUNCTIONS =====

function saveStudentName() {
    const nameInput = document.getElementById('student-name');
    studentName = nameInput.value.trim();
    if (studentName === '') {
        studentName = 'Student'; // Default name
    }
    saveData();
    alert('Name saved successfully!');
}

function resetProgress() {
    if (confirm('Are you sure you want to reset your study progress? This will reset quiz history and flashcard mastery data, but not your flashcards or subjects.')) {
        // Reset quiz history
        localStorage.removeItem('quizHistory');
        // Reset home screen stats
        renderHomeScreen();
        alert('Study progress has been reset!');
    }
}

function confirmClearData() {
    if (confirm('Are you sure you want to clear ALL data? This will delete all flashcards, subjects, quiz history, and settings. This action cannot be undone.')) {
        clearAllData();
    }
}

function clearAllData() {
    // Clear local storage
    localStorage.clear();
    // Reset state
    flashcards = [];
    subjects = [];
    studentName = '';
    isDarkMode = false;
    quizState = {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        answers: []
    };
    currentFlashcardIndex = 0;

    // Re-initialize with sample data
    setupSampleDataIfNeeded();

    // Update UI
    renderHomeScreen();
    renderFlashcardsScreen();
    renderSubjectsScreen();
    renderProfileScreen();
    showHome();

    alert('All data has been cleared. Sample data has been restored.');
}

// ===== DARK MODE FUNCTIONS =====

function toggleDarkMode() {
    isDarkMode = document.getElementById('dark-mode-toggle').checked;
    saveData();
    applyDarkMode();
}

function applyDarkMode() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ===== EVENT LISTENERS =====
// We'll attach event listeners for elements that are always present

// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);