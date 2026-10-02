# StudyCards – Flashcard & Quiz App

## Project Overview
StudyCards is a mobile-friendly web application designed to help students create and study flashcards, take quizzes, and track their learning progress. The app is built using HTML5, CSS3, and Vanilla JavaScript, with data stored locally in the browser's LocalStorage. It is suitable as a BSIT student project due to its simplicity, functionality, and clean code.

## Features
- **Home Screen**: Dashboard showing flashcard count, subject count, quizzes completed, and overall score.
- **Flashcard System**: Create, view, flip, shuffle, and mark flashcards as known or needing review.
- **Subject System**: Organize flashcards by subjects/categories.
- **Quiz Mode**: Generate multiple-choice quizzes from saved flashcards with score calculation.
- **Quiz Results**: View final score, percentage, and performance feedback.
- **Add Flashcard Form**: Input question, answer, subject, and optional difficulty.
- **Search**: Search flashcards by question, answer, or subject.
- **Statistics**: View study progress and quiz history.
- **Local Data Storage**: All data saved in LocalStorage for persistence.
- **User Profile**: Set student name, toggle dark mode, reset progress, clear data.
- **Responsive Design**: Works on mobile devices and desktop browsers.
- **Dark Mode**: Optional dark theme for better viewing in low light.

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage (for data persistence)

## How the Application Works
1. **Data Management**: The app stores flashcards, subjects, quiz history, and user settings in LocalStorage.
2. **Navigation**: A bottom navigation bar allows switching between Home, Flashcards, Quiz, Subjects, and Profile screens.
3. **Flashcards**: Users can add flashcards with a question and answer, assign them to a subject, and study them by flipping and marking mastery.
4. **Quiz**: When starting a quiz, the app generates multiple-choice questions using the user's flashcards, shuffles the options, and calculates the score.
5. **Persistence**: All data is saved automatically and retrieved when the app is reopened.

## Project Structure
```
StudyCards/
├── index.html      # Main HTML structure
├── style.css       # Styling for the application
├── script.js       # Application logic and functionality
└── README.md       # This file
```

## How to Run
1. Clone or download this repository to your local machine.
2. Open `index.html` in a web browser (Chrome, Firefox, Safari, Edge).
3. The app will load and be ready to use. No internet connection is required after the initial load.

## LocalStorage Usage
The application uses LocalStorage to store the following:
- `flashcards`: Array of flashcard objects
- `subjects`: Array of subject strings
- `studentName`: The user's name
- `darkMode`: Boolean indicating dark mode preference
- `quizHistory`: Array of quiz attempt objects

Data is saved automatically whenever changes are made and loaded when the app starts.

## Future Improvements
- Add edit and delete functionality for flashcards.
- Implement spaced repetition algorithm for more effective studying.
- Allow importing/exporting flashcards as CSV or JSON.
- Add more quiz formats (true/false, fill-in-the-blank).
- Include audio pronunciation for language learning.
- Add progress tracking per subject.

## Author
Created as a student project for BSIT program.

## License
This project is open source and available under the MIT License.