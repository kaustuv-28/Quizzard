var Prefs = (function () {
    'use strict';

    const baseURL = 'https://opentdb.com/api.php';
    const categoryURL = 'https://opentdb.com/api_category.php';

    var config = {
        amount: 10,
        category: '',
        categoryName: '',
        difficulty: '',
        type: ''
    };

    // placeholder for cached DOM elements
    var DOM = {};

    // cache DOM elements
    function cacheDOM() {
        DOM.prefsContainer = document.getElementById('js-preferences');
        DOM.qAmountSelect = document.getElementById('js-qAmount');
        DOM.qCategorySelect = document.getElementById('js-qCategory');
        DOM.qDifficultySelect = document.getElementById('js-qDifficulty');
        DOM.qTypeSelect = document.getElementById('js-qType');
        DOM.btnStartGame = document.getElementById('js-btnStartGame');
    }

    // Check session storage if Categories are pre-exisiting, otherwise fire getCategories()
    function checkCategories() {
        if (!sessionStorage.categories) {
            getCategories();
        } else {
            Question.state.categories = JSON.parse(sessionStorage.getItem('categories'));
            populateCategories();
        }
        // Add fade classes to Prefs for intial fade in
        Util.fadeElement(Prefs.DOM.prefsContainer);
        DOM.prefsContainer.classList.remove('hidden');
    }

    // Retrieve Categories and popluate the select dropdown
    function getCategories() {
        // Retrieve the categories and assign to State object
        var success = function (data) {
            Question.state.categories = JSON.parse(data).trivia_categories;

            // Set Session Storage flag
            sessionStorage.setItem('categories', JSON.stringify(Question.state.categories));
            populateCategories();
        };

        var error = function () {
            alert('Oops, couldn\'t get data right now. Try again later.');
        };

        Util.getData(categoryURL, success, error);
    }

    // Populate the Categories dropdown
    function populateCategories() {
        var categoryOption;
        for (let i = 0; i < Question.state.categories.length; i++) {
            categoryOption = document.createElement('option');
            categoryOption.text = Question.state.categories[i].name;
            categoryOption.value = Question.state.categories[i].id;
            DOM.qCategorySelect.add(categoryOption);
        }
    }

    // Gather quiz settings form values
    function retrievePrefs() {
        DOM.btnStartGame.addEventListener('click', function () {
            // Save settings to Config object
            config.amount = DOM.qAmountSelect.value;
            config.category = DOM.qCategorySelect.value;
            config.categoryName = DOM.qCategorySelect.options[DOM.qCategorySelect.selectedIndex].text;
            config.difficulty = DOM.qDifficultySelect.value;
            config.type = DOM.qTypeSelect.value;

            // Send off the Quiz query with selected prefs
            sendQuery();
        });
    }

    function sendQuery() {
        // Assemble the selected Prefs object
        var options = {};
        for (var key in config) {
            // Don't include the category name
            if (key != 'categoryName') {
                if (config[key] != 'any') {
                    options[key] = config[key];
                }
            }
        }

        // Assign the final concatenated query fragment
        var fragment = Util.buildQueryString(options);

        // The final assembled URL query string
        var url = baseURL + fragment;
        // Send off the AJAX call
        Util.getData(url, function (data) {

            var json = JSON.parse(data);

            // If there aren't not enough questions for the submitted query, throw an alert
            if (json.results.length == 0) {
                alert('Sorry, there aren\'t enough questions matching your request. Try reducing the number of questions and/or changing some of your settings.');
                return;
            }

            // Save the questions to the state object
            Question.state.questions = json.results;

            // Hide Prefs Container, add fade classes to main container, and fire off the 
            DOM.prefsContainer.classList.add('d-none');
            Util.fadeElement(Question.DOM.mainContainer);

            // Check if mainContainer is hidden, and if so show
            if (Question.DOM.mainContainer.classList.contains('d-none')) {
                Question.DOM.mainContainer.classList.remove('d-none');
            }

            // Display the first question
            Question.displayQuestion(0);
        });
    }


    /* =============== main init =============== */
    function init() {
        cacheDOM();
        checkCategories();
        retrievePrefs();
    }

    /* =============== export public methods =============== */
    return {
        init: init,
        DOM: DOM,
        cacheDOM: cacheDOM,
        checkCategories: checkCategories,
        retrievePrefs: retrievePrefs,
        sendQuery: sendQuery,
        config: config
    };
}());