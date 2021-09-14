const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const solveButton = document.querySelector('.push-button span');
const clearButton = document.querySelector('.clear-button');
const mobileInput = document.querySelector('.mobile-input');

let isInputMobile = false;
const { width, height } = canvas.getBoundingClientRect();

// resize canvas according to the DPI
canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;

// scale the drawing operations to match the DPI
context.scale(devicePixelRatio, devicePixelRatio);

// with css, render the canvas to look like the intended dimensions
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

/* function create2DArray(width, height) {
    return Array.from(Array(height), () => new Array(width).fill(0) );
}*/

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

// let board = new SudokuBoard(create2DArray(9, 9), 0, 0, width, height);

let board = new SudokuBoard(validMatrix, 0, 0, width, height);
let pointer = new SquarePointer(0, 0, width/9, height/9, width/9, height/9);

function loop() {
    render();
    requestAnimationFrame(loop);
}

function clear() {
    context.clearRect(0, 0, width, height);
}

function render() {
    clear();
    pointer.render(context);
    board.render(context);
}

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
	})
}


function keydownListener(event) {
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
	        if (board.getValueAt(pointer.x, pointer.y) == 0) {
	            if (pointer.x > 0) {
	                --pointer.x;
	            } else if (pointer.y > 0) {
	                pointer.x = 8;
	                --pointer.y;
	            }
	        } else {
	            board.setValueAt(pointer.x, pointer.y, 0);
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
	        board.setValueAt(pointer.x, pointer.y, digit);
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


canvas.addEventListener('click', function(event) {
    let boundingRectangle = canvas.getBoundingClientRect();
    let clickX = event.pageX - boundingRectangle.left;
    let clickY = event.pageY - boundingRectangle.top;

    let interpolatedX = Math.floor(clickX/width * 9);
    let interpolatedY = Math.floor(clickY/height * 9);

    pointer.x = interpolatedX;
    pointer.y = interpolatedY;
});

solveButton.addEventListener('click', function(){
	if (board.isValid()) board.solve();
});

clearButton.addEventListener('click', function() {
    clearButton.classList.add('disabled');
    board.clear();
});

loop();