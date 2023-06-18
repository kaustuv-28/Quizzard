var Question = (function () {
    'use strict';

    var state = {
        correctIndex: 0,
        currentQuestionIndex: 0,
        currentQuestionState: 0,
        correctQuestionText: '',
        highlightChosenAnswer: '',
        questions: [],
        categories: {}
    };

    // placeholder for cached DOM elements
    var DOM = {};

    // cache DOM elements
    function cacheDOM() {
        DOM.mainContainer = document.getElementById('js-main');
        DOM.questionElement = document.getElementById('question');
        DOM.answerList = document.getElementById('answers');
    }

    //  Displays the Question and Possible Answers
    function displayQuestion(idx) {

        // Reset the Answer UL to empty
        DOM.answerList.innerHTML = '';

        // Display the Question
        var questionObject = state.questions[idx];
        DOM.questionElement.innerHTML = questionObject.question;

        // Get Type of Question and Correct/Incorrect Answers
        var questionType = questionObject.type;
        var correctAnswer = questionObject.correct_answer;
        var incorrectAnswers = questionObject.incorrect_answers;
        var answers;
        var correctIndex;

        // Check to see if multiple choice or true/false question
        if (questionType == 'multiple') {
            // Randomly merge the Incorrect Answer array with the Correct Answer and it's index
            answers = incorrectAnswers.slice();
            correctIndex = Util.getRand();
            answers.splice(correctIndex, 0, correctAnswer);

            // Set the current correctIndex in the state object
            state.correctIndex = correctIndex;
            state.correctQuestionText = correctAnswer;
        } else {
            // Combine Answers and put in correct order
            if (correctAnswer == "True") {
                answers = [correctAnswer, incorrectAnswers];
                correctIndex = 0;
            } else {
                answers = [incorrectAnswers, correctAnswer];
                correctIndex = 1;
            }

            // Set the current correctIndex in the state object
            state.correctIndex = correctIndex;
            state.correctQuestionText = correctAnswer;
        }

        // Define and set an answerID for each Answer Button
        var answerID = 0;
        // Process the Answer Template
        for (let i = 0; i < answers.length; i++) {
            let decoded = Util.decodeHTML(answers[i]);
            let answerTemplate = document.getElementById('answerTemplate').content.cloneNode(true);
            let answerButton = answerTemplate.querySelector('.answer button');
            answerButton.innerText = decoded;
            answerButton.value = answerID;
            DOM.answerList.appendChild(answerTemplate);
            answerID++;
        }

        // Init the Question index
        Stats.displayStats();
    }


    // Validate Answer Radio Buttons
    function processAnswer(chosenAnswerID) {
        if (parseInt(chosenAnswerID) !== state.correctIndex) {
            Feedback.displayFeedback(0);
            state.currentQuestionState = 0;
        } else {
            Feedback.displayFeedback(1);
            state.currentQuestionState = 1;
        }

        highlightCorrectAnswer();
        highlightChosenAnswer(chosenAnswerID);
        disableAnswers();
        Feedback.setNextQuestionBtn();
    }

    // Add class to button w/ correct answer
    function highlightCorrectAnswer() {
        var correctAnswerButton = document.querySelector('.answer button[value="' + state.correctIndex + '"]');
        correctAnswerButton.classList.add('btn-success');
        correctAnswerButton.classList.remove('btn-secondary');
    }

    // Add class to chosen button (if it wasn't the correct answer)
    function highlightChosenAnswer(chosenAnswerID) {
        var chosenAnswerButton = document.querySelector('.answer button[value="' + chosenAnswerID + '"]');
        if (chosenAnswerID == state.correctIndex) return;
        chosenAnswerButton.classList.remove('btn-secondary');
        chosenAnswerButton.classList.add('btn-warning');
    }


    // Disable the Answer Buttons after User Clicks
    function disableAnswers() {
        var answerButtons = document.querySelectorAll('.answer button');

        // Set the 'disabled' attribute on answer buttons
        for (let i = 0; i < answerButtons.length; i++) {
            answerButtons[i].setAttribute('disabled', '');
        }
    }

    // Increments on displayed question on click
    function incrementQuestion() {
        var currentQuestion = state.currentQuestionIndex;
        currentQuestion++;

        // Set the new Current Question Index in the State object
        state.currentQuestionIndex = currentQuestion;
        displayQuestion(currentQuestion);
        Stats.displayStats();
    }

    // Attach increment button listeners
    function bindButtonListener() {
        DOM.answerList.addEventListener('click', function (e) {
            if (e.target.type !== 'button') return;
            state.chosenAnswerID = e.target.value;
            processAnswer(state.chosenAnswerID);

            // Calculate the current score and display
            Stats.calculateScore();
            document.querySelector('.stats-score').innerText = Stats.state.currentScore + '%';
        });
    }


    /* =============== main init =============== */
    function init() {
        cacheDOM();
        bindButtonListener();
    }

    /* =============== export public methods =============== */
    return {
        init: init,
        state: state,
        DOM: DOM,
        incrementQuestion: incrementQuestion,
        getQuestionIndex: function () {
            return state.currentQuestionIndex;
        },
        getCorrectQuestion: function () {
            return state.correctQuestionText;
        },
        displayQuestion: displayQuestion
    };
}());
