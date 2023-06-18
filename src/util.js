
var Util = (function () {
    'use strict';


    /* =================== public methods ================== */

    function getRand() {
        return Math.floor(Math.random() * (4 - 0)) + 0;
    }

    function decodeHTML(html) {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    function buildQueryString(parms) {
        var parts = [];
        for (var key in parms) {
            var str = key + '=' + parms[key];
            parts.push(str);
        }
        var result = parts.join('&');
        if (parts.length > 0) {
            result = '?' + result;
        }
        return result;
    }

    function ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getData(url, callback, error) {
        var xhr = new XMLHttpRequest();

        // Setup our listener to process compeleted requests
        xhr.onreadystatechange = function () {
            // Only run if the request is complete
            if (xhr.readyState !== 4) return;

            // Process our return data
            if (xhr.status === 200) {
                // What do when the request is successful
                if (callback) callback(xhr.response);
            } else {
                // What do when the request fails
                if (error) error();
                console.log('The request failed!');
            }
        };

        // Create and send a GET request
        xhr.open('GET', url);
        xhr.send();
    }

    function fadeElement(el) {
        el.classList.add('animated', 'fadeIn');
        setTimeout(function () {
            el.classList.remove('animated', 'fadeIn');
        }, 2000);
    }

    function clearState() {
        Question.state.correctIndex = 0;
        Question.state.currentQuestionIndex = 0;
        Question.state.currentQuestionState = 0;
        Question.state.correctQuestionText = '';
        Question.state.chosenAnswerID = '';
        Question.state.questions = [];
        Stats.state.currentTotalCorrect = 0;
        Stats.state.currentScore = 0;
    }

    function selectReset() {
        for (let i = 0; i < arguments.length; i++) {
            arguments[i].selectedIndex = null;
        }
    }


    /* =============== export public methods =============== */
    return {
        getRand: getRand,
        decodeHTML: decodeHTML,
        ucFirst: ucFirst,
        clearState: clearState,
        selectReset: selectReset,
        buildQueryString: buildQueryString,
        fadeElement: fadeElement,
        getData: getData
    };
}());