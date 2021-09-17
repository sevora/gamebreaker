/* 
 * I know this code is a bit unorganized, it's very open to improvements.
 * But I don't think that I'll touch this again for quite some time.
 * P.S. Ralph
 */

// very important in rendering the gamebreaker
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const { width, height } = canvas.getBoundingClientRect();

// important DOM Elements usually for controls and also feedbacks through DOM
const gameMessage = document.querySelector('.game-message');
const solveButton = document.querySelector('.push-button span');
const editButton = document.querySelector('.edit-button');
const clearButton = document.querySelector('.clear-button');
const mobileInput = document.querySelector('.mobile-input');

let isInputMobile = false;
let editMode = false;
let questionBoard;
let answerBoard;
let pointer;

// sample valid matrix with only one-solution
let validMatrix = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
];

// returns a 2D-array filled with 0s of given dimensions
function create2DArray(width, height) {
    return Array.from(Array(height), () => new Array(width).fill(0) );
}

/*
 * This is the part where the "game loop" is
 * The setup runs once and it runs the first,
 * then there is the render which runs repeatedly.
 */
function setup() {
    // resize canvas according to the DPI
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // scale the drawing operations to match the DPI
    context.scale(devicePixelRatio, devicePixelRatio);

    // with css, render the canvas to look like the intended dimensions
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    //
    questionBoard = new SudokuBoard(validMatrix, 0, 0, width, height);
    answerBoard = new SudokuBoard(create2DArray(9, 9), 0, 0, width, height);
    pointer = new SquarePointer(0, 0, width/9, height/9, width/9, height/9);
    
    // sets up the listeners depending on what kind of device it is
    if (window.matchMedia("(min-width: 600px)").matches) {
        // for laptops and personal computers
        document.body.addEventListener('keydown', keydownListener);
    } else {
        //for mobile
        isInputMobile = true;
        mobileInput.addEventListener('keydown', keydownListener);
        canvas.addEventListener('click', function() {
            mobileInput.focus();
        });
    }

    loop();
}

// This is the block where all the drawing 
// code should be put in
function render() {
    context.clearRect(0, 0, width, height);
    pointer.render(context);

    context.fillStyle = 'black';
    context.strokeStyle = 'black';
    questionBoard.render(context);

    context.fillStyle = 'blue';
    context.strokeStyle = 'blue';
    answerBoard.renderMatrix(context);
}

// a simple game loop, since the FPS doesn't matter
function loop() {
    render();
    requestAnimationFrame(loop);
}

/*
 * This is the user-control part section. It works using event API. 
 * All code below except for the last line is about user interaction and 
 * controls.
 *
 * Below you can find the code for:
 * - Moving the grid pointer through WASD or Arrow keys
 * - Inserting numbers on parts of the grid
 * - Functionality of the Edit Button
 * - Functionality of the Clear Button
 * - Functionality of the Solve Button
 */

// this is for keyboard event, specifically keydown
// which gets triggered whenever a key goes down.
// this whole part should allow the user to enter numbers and move 
// the pointer along the grid through arrow keys or WASD
// note: the order of events in an input is something like this,
// keydown -> keyup -> keypress -> (changeOfValue) -> input
// keydown is used for this since there is no input element in handling of desktop input
function keydownListener(event) {

    // apparently this should be the standard by now, and event.key as well
    // event.keyCode is deprecated (ironically, it is also the most supported)
	let eventCode = event.code;
	
	// mobile keyboard events are messed up and buggy therefore this is a workaround
	if (isInputMobile) {
		if (event.which == 8) {
			eventCode = 'Backspace';
		} else if (event.which >= 48 && event.which <= 57) {
			eventCode = "Digit" + (event.which - 48);
			
		}
	}

	switch(eventCode) {
	    case 'KeyW':
	    case 'ArrowUp':
	        pointer.y = Math.max(0, pointer.y - 1);
	        break;
	
	    case 'KeyS':
	    case 'ArrowDown':
	        pointer.y = Math.min(8, pointer.y + 1);
	        break;
	
	    case 'KeyA':
	    case 'ArrowLeft':
	        pointer.x = Math.max(0, pointer.x - 1);
	        break;
	
	    case 'KeyD':
	    case 'ArrowRight':
	        pointer.x = Math.min(8, pointer.x + 1);
	        break;
	
	    case 'Backspace':
                if (editMode) {
                    questionBoard.setValueAt(pointer.x, pointer.y, 0);
                } else if (questionBoard.getValueAt(pointer.x, pointer.y) == 0) {
                    answerBoard.setValueAt(pointer.x, pointer.y, 0);
                }

                if (pointer.x > 0) {
	                --pointer.x;
	            } else if (pointer.y > 0) {
	                pointer.x = 8;
	                --pointer.y;
	            }

	        break;
	
	    case 'Digit0':
	    case 'Digit1':
	    case 'Digit2':
	    case 'Digit3':
	    case 'Digit4':
	    case 'Digit5':
	    case 'Digit6':
	    case 'Digit7':
	    case 'Digit8':
	    case 'Digit9':
	        let digit = parseInt(eventCode.replace('Digit', ''));

            if (editMode) {
                questionBoard.setValueAt(pointer.x, pointer.y, digit);
            } else if (questionBoard.getValueAt(pointer.x, pointer.y) == 0) {
                answerBoard.setValueAt(pointer.x, pointer.y, digit);
            }

	        if (pointer.x < 8) {
	            ++pointer.x;
	        } else if (pointer.y < 8) {
	            pointer.x = 0;
	            ++pointer.y;
	        }
	        
	        if(clearButton.classList.contains('disabled') ) {
	        	clearButton.classList.remove('disabled');
	        }

	        break;
	}
}

// this code block allows the user to click on the grid and move the pointer 
// to that specific cell
canvas.addEventListener('click', function(event) {
    let boundingRectangle = canvas.getBoundingClientRect();
    let clickX = event.pageX - boundingRectangle.left;
    let clickY = event.pageY - boundingRectangle.top;

    let interpolatedX = Math.floor(clickX/width * 9);
    let interpolatedY = Math.floor(clickY/height * 9);

    pointer.x = interpolatedX;
    pointer.y = interpolatedY;
});

// this code should make the solve button work
// which fills in the grid with the correct answers
solveButton.addEventListener('click', function(){
    clearButton.classList.remove('disabled');

	if (editMode) {
        gameMessage.style.color = 'red';
        gameMessage.innerHTML = 'Cannot display solution on Edit Mode!';
        return;
    }

    let temporaryBoard = new SudokuBoard(create2DArray(9,9), 0, 0, width, height);
    temporaryBoard.copyMatrix(questionBoard);
    temporaryBoard.solve();

    for (let y = 0; y < 9; ++y) {
        for (let x = 0; x < 9; ++x) {
            if (questionBoard.getValueAt(x, y) > 0) continue;
            answerBoard.setValueAt(x,y, temporaryBoard.getValueAt(x, y) );
        }
    }

    gameMessage.style.color = 'green';
    gameMessage.innerHTML = 'Solution displayed!'

});

// this code block allows users to clear the grid
// instantaneously with the clear button
clearButton.addEventListener('click', function() {
    clearButton.classList.add('disabled');

    gameMessage.innerHTML = '';
    editMode ? questionBoard.clear() : answerBoard.clear();
});

// this code block allows users to toggle Edit mode
// edit mode is for the feature that seperates the puzzle sudoku
// and the user answers/solution
editButton.addEventListener('click', function() {
	editMode = !editMode;
	answerBoard.clear();

	if (!editMode) {

        let temporaryBoard = new SudokuBoard(create2DArray(9,9), 0, 0, width, height);
        temporaryBoard.copyMatrix(questionBoard);

        if (!temporaryBoard.isValid() || !temporaryBoard.solve()) {
            gameMessage.style.color = 'red';
            gameMessage.innerHTML = 'This board has no solutions, cannot exit Edit Mode!';

            editMode = true;
        } else {
            gameMessage.innerHTML = '';
        }
    }
    
    // should change the edit button text accordingly
    editButton.innerHTML = editMode ? 'Edit: On' : 'Edit: Off';

});

// starts the canvas
setup();
