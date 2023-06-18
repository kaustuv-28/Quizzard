
var Feedback = (function () {
    'use strict';

    // placeholder for cached DOM elements
    var DOM = {};

    /* =================== private methods ================= */
    // cache DOM elements
    function cacheDOM() {
        DOM.feedbackContainer = document.getElementById('feedback');
        DOM.statsContainer = document.getElementById('stats');
        DOM.btnNextQuestion = document.getElementById('btnNextQuestion');
        DOM.summaryContainer = document.getElementById('js-summary');
        DOM.btnReturnSettings = document.getElementById('btnReturnSettings');
        DOM.btnTryAgain = document.getElementById('btnTryAgain');
    }

    // Negative Comments for wrong answers
    var negativeResponses = [
        'Oooh, bummmer. The correct answer is',
        'Man, you stink. The correct answer is',
        'Gosh, you\'not very good, are you? The correct answer is',
        'Sorry amigo, that\s not it. The correct answer is',
        'Nope, wrong. The correct answer is'
    ];

    // Positive Comments for right answers
    var positiveResponses = [
        'Nice job! The correct answer is',
        'Woo hoo, you\'re doing great! The correct answer is',
        'Sweet, you got it! The correct answer is',
        'Way to go! The correct answer is',
        'Not too shabby! That\'s right, the correct answer is'
    ];


    // Display the Success/Failure Message
    function displayFeedback(successStatus) {
        var feedbackTemplate = document.getElementById('feedbackTemplate').content.cloneNode(true);

        // Add fade classes to Feedback container
        Util.fadeElement(DOM.feedbackContainer);

        // Process the Feedback template if correct/incorrect
        if (successStatus === 0) {
            let response = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
            feedbackTemplate.querySelector('.feedback-response').innerHTML = `${response} <strong>${Question.getCorrectQuestion()}</strong>.`;
        } else {
            let response = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
            feedbackTemplate.querySelector('.feedback-response').innerHTML = `${response} <strong>${Question.getCorrectQuestion()}</strong>.`;
        }
        DOM.feedbackContainer.appendChild(feedbackTemplate);
    }

    // Get Next Question Button and add event listener
    function setNextQuestionBtn() {
        btnNextQuestion.addEventListener('click', function () {
            DOM.feedbackContainer.innerHTML = '';

            // Advance to next question, otherwise hide the main container and display the summary
            if ((Question.state.currentQuestionIndex + 1) < Prefs.config.amount) {
                // Add fade classes to Main container and increment the Question
                Question.incrementQuestion();
                Util.fadeElement(Question.DOM.mainContainer);
            } else {
                Question.DOM.mainContainer.classList.add('d-none');
                DOM.summaryContainer.classList.remove('d-none');
                Util.fadeElement(DOM.summaryContainer);
                displaySummary();

            }
        }, false);
    }

    // Diplay the Summary screen
    function displaySummary() {
        var summaryTemplate = document.getElementById('summaryTemplate').content.cloneNode(true);
        summaryTemplate.getElementById('js-finalScore').innerText = Stats.state.currentScore + '% (' + Stats.state.currentTotalCorrect + ' of ' + Prefs.config.amount + ' questions)';

        var prefs = Prefs.config;
        var output = '';
        for (var key in prefs) {
            if (key != 'category') {
                if (key == 'categoryName') {
                    output += '<li>' + 'Category' + ': ' + Util.ucFirst(prefs[key]) + '</li>';
                }
                else {
                    output += '<li>' + Util.ucFirst(key) + ': ' + Util.ucFirst(prefs[key]) + '</li>';
                }
            }         
        }

        summaryTemplate.getElementById('js-selectedPrefs').innerHTML = output;
        DOM.summaryContainer.appendChild(summaryTemplate);

        setSummaryBtns();
    }

    // Restart the game at the Settings screen or bypass and use previous preferences
    function restartGame(restartType) {
        Util.clearState();
        Prefs.checkCategories();
        if (restartType === 'new settings') {
            // reset the select dropdowns to default
            Util.selectReset(Prefs.DOM.qAmountSelect, Prefs.DOM.qCategorySelect, Prefs.DOM.qDifficultySelect, Prefs.DOM.qTypeSelect);
            Prefs.DOM.prefsContainer.classList.remove('d-none');
            Prefs.retrievePrefs();
            btnReturnSettings.removeEventListener('click', restartGame, false);
        } else {
            Prefs.sendQuery();
            btnTryAgain.removeEventListener('click', restartGame, false);
        }
        DOM.summaryContainer.classList.add('d-none');
        DOM.summaryContainer.innerHTML = '';
    }


    // Attach listeners to the Summary buttons
    function setSummaryBtns() {
        btnReturnSettings.addEventListener('click', function () {
            restartGame('new settings');
        }, false);
        btnTryAgain.addEventListener('click', function () {
            restartGame('same settings');
        }, false);
    }



    /* =================== public methods ================== */
    // main init method
    function init() {
        cacheDOM();
    }

    /* =============== export public methods =============== */
    return {
        init: init,
        displayFeedback: displayFeedback,
        setNextQuestionBtn: setNextQuestionBtn
    };
}());