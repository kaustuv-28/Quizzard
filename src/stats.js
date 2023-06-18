
var Stats = (function () {
    'use strict';

    var state = {
        currentTotalCorrect: 0,
        currentScore: 0
    };

    // placeholder for cached DOM elements
    var DOM = {};

    // cache DOM elements
    function cacheDOM() {
        DOM.statsContainer = document.getElementById('stats');
    }

    // Display the Current Question Index
    function displayStats(idx) {
        DOM.statsContainer.innerHTML = '';
        var statsTemplate = document.getElementById('statsTemplate').content.cloneNode(true);
        statsTemplate.querySelector('.stats-index').innerText = Question.getQuestionIndex() + 1 + ' of ' + Prefs.config.amount;
        statsTemplate.querySelector('.stats-score').innerText = state.currentScore + '%';
        DOM.statsContainer.appendChild(statsTemplate);
    }

    // Calculate the current score and save to state object
    function calculateScore() {
        var currentState = Question.state.currentQuestionState;
        if (currentState === 1) {
            state.currentTotalCorrect += 1;
        }
        state.currentScore = Math.round(((state.currentTotalCorrect / (Question.state.currentQuestionIndex + 1)) * 100));
    }


    /* =============== main init =============== */
    function init() {
        cacheDOM();
    }

    /* =============== export public methods =============== */
    return {
        init: init,
        state: state,
        displayStats: displayStats,
        calculateScore: calculateScore
    };
}());