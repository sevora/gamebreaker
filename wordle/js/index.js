import { getAllWords } from './five-letter-words.js';

const inputField = document.querySelector('input');
const grid = document.querySelector('.grid-container');
const submit = document.querySelector('.suggestion .submit');
const suggestionWord = document.querySelector('.suggestion .word');
const suggestionCount = document.querySelector('.suggestion .count');
const suggestionNext = document.querySelector('.suggestion .next');
let suggestionIndex = 0;

const maxColumn = 5;
const maxRow = 6;
let currentRow = 0;
let currentColumn = 0;

let words = getAllWords();

/*
 * These are all the functions to solve a wordle puzzle and
 * some logic to make UI logic easier to write
 */

// UI-based returns the current box in grid
function getCurrentBox() {
    return grid.children[maxColumn * currentRow + currentColumn];
}

// UI-based returns the first box of set row
function getFirstBoxAtRow() {
    return grid.children[maxColumn * currentRow];
}

// UI-based returns the last box of set row
function getLastBoxAtRow() {
    return grid.children[maxColumn * currentRow + (maxColumn - 1)];
}

// UI-based returns the boxes of a row
function getBoxesAtRow(row) {
    let startIndex = maxColumn * row;
    let endIndex = maxColumn * row + maxColumn;
    return Array.from(grid.children).slice(startIndex, endIndex);
}


function getRowParameters(row) {
    let boxes = getBoxesAtRow(row);
    let previousWord = '';
    let green = [];
    let yellow = [];
    let gray = [];

    for (let index = 0; index < boxes.length; ++index) {
        let box = boxes[index];

        previousWord += box.innerText.toLowerCase();
        if (box.classList.contains('green')) {
            green.push(index);
        } else if (box.classList.contains('yellow')) {
            yellow.push(index);
        } else {
            gray.push(index);
        }
    }

    return { previousWord, green, yellow, gray }
}

// This is used to solve wordle
function filterWordsByClues(words, previousWord, green, yellow, gray) {
    if (previousWord.length == 0) return words;    
    previousWord = previousWord.toLowerCase();

    let rightPlacement = green.map(index => previousWord[index]);
    let wrongPlacement = yellow.map(index => previousWord[index]);
    let nonExistent = gray.map(index => previousWord[index]);
    nonExistent = nonExistent.filter(letter => rightPlacement.concat(wrongPlacement).indexOf(letter) == -1);

    for (let index = words.length - 1; index >= 0; --index)  {
        let word = words[index];

        // skip and remove words with non-existent letters
        if (nonExistent.length > 0 && word.split('').some(letter => nonExistent.indexOf(letter) > -1)) {
            words.splice(index, 1);
            continue
        }

        // skip and remove words which do not have the right placement of green letters
        if (green.length > 0 && !green.every(greenIndex => word[greenIndex] == previousWord[greenIndex])) {
            words.splice(index, 1);
            continue
        }
 
        // delete words that have letters on wrong placement
        if (yellow.length > 0 && yellow.some(yellowIndex => word[yellowIndex] == previousWord[yellowIndex]) ) {
            words.splice(index, 1);
            continue
        }

        if (yellow.length > 0 && !wrongPlacement.every(letter => word.indexOf(letter) > -1)) {
            words.splice(index, 1);
            continue 
        }
    }

    return words;
}


/*
 * Below are all the event handlers for the solver.
 * This is the UI logic and it utilizes the functions above
 */

// used to paginate on the suggestions list
function updateSuggestion(index) {
    if (words.length > 0) {
        suggestionWord.innerText = words[index];
        suggestionCount.innerText = `${index + 1} of ${words.length}`;
    } else {
        suggestionWord.innerText = 'No more';
        suggestionCount.innerText = 'No solution';
    }
}

// updates the UI (words list, and even the boxes) according to the parameters given
function updateAnswersState(rowParameters) {
    let { previousWord, green, yellow, gray } = getRowParameters(currentRow);
    let boxes = getBoxesAtRow(currentRow);

    // set the remaining box colors to gray
    boxes.forEach(function(box, index) {
        if (gray.indexOf(index) > -1) box.classList.add('gray')
    });

    words = filterWordsByClues(words, previousWord, green, yellow, gray);
    suggestionIndex = 0;
    updateSuggestion(suggestionIndex);
}

// this submits the current row as an answer and moves on to the next row
// returns a boolean indicating whether the submission is successful or not
function submitCurrentRow() {
    let rowParameters = getRowParameters(currentRow);
    
    if (rowParameters.previousWord.length == 5 && 
        words.indexOf(rowParameters.previousWord) > -1) {
        updateAnswersState(rowParameters);
        currentColumn = 0;
        currentRow = Math.min(maxRow - 1, currentRow + 1);
        return true;
    }
    
    return false;
}

// handles input of letters
inputField.addEventListener('input', function(event) {
    let newLetter = inputField.value[0];
    inputField.value = '';

    // don't proceed with the column and row logic if the last box has been filled
    if (getLastBoxAtRow().innerText.length > 0) return false;       

    // only allow the input if it is from the alphabet
    if ( (/[a-zA-Z]/).test(newLetter) ) { 
        let box = getCurrentBox();
        box.innerText = newLetter.toUpperCase();
        box.classList.add('filled');
        currentColumn = Math.min(maxColumn - 1, currentColumn + 1);
    }
});

// handles backspace or delete
inputField.addEventListener('keydown', function(event) {

    // backspace or delete code
    if (event.keyCode == 8 || event.keyCode == 46) {

        // disable delete when first box has no text in the first place
        if (getFirstBoxAtRow().innerText.length < 1) return false;

        // fix delete at row
        if (getLastBoxAtRow().innerText.length < 1) {
            currentColumn = Math.max(0, currentColumn - 1);
        }

        let box = getCurrentBox();

        // other than removing the text inside, it also removes the color of 
        // the box when it is deleted
        box.innerText = '';
        box.classList.remove('green');
        box.classList.remove('yellow');
        box.classList.remove('filled');
    }

    // when enter is clicked code
    if (event.keyCode == 13) {
        submitCurrentRow();
    }
});

suggestionNext.addEventListener('click', function() {
    if (++suggestionIndex > words.length-1) {
        suggestionIndex = 0;
    }
    
    updateSuggestion(suggestionIndex);
});

submit.addEventListener('click', function() {
    submitCurrentRow();
});

// this loop properly assigns each box's designated column, row, and event listener for 
// setting color state
Array.from(grid.children).forEach(function(box, index) {
    let column = index % maxColumn;
    let row = (index - column) / (maxRow-1);
    
    box.dataset.row = row;
    box.dataset.column = column;

    box.addEventListener('click', function() {
        let lastBox = getLastBoxAtRow();

        // disable setting color of an empty box and box not at row
        if (box.dataset.row != currentRow || box.dataset.column > currentColumn-1 && lastBox.innerText.length < 1) {
            return false;
        }

        if (box.classList.contains('green')) {
            box.classList.replace('green', 'yellow');
        } else if (box.classList.contains('yellow')) {
            box.classList.remove('yellow');
        } else {
            box.classList.add('green');
        }
    });
});

// this is to allow user inputs
grid.addEventListener('click', function(event) {
    inputField.focus();
});

// this allows the user to input
inputField.focus();
updateSuggestion(0);
