const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const { width, height } = canvas;

function create2DArray(width, height) {
    return Array.from(Array(height), () => new Array(width).fill(0) );
}

let board = new SudokuBoard(create2DArray(9, 9), 0, 0, width, height);
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

document.body.addEventListener('keydown', function(event) {
    switch(event.code) {
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
            let digit = parseInt(event.code.replace('Digit', ''));
            board.setValueAt(pointer.x, pointer.y, digit);
            if (pointer.x < 8) {
                ++pointer.x;
            } else if (pointer.y < 8) {
                pointer.x = 0;
                pointer.y++;
            }
            break;
    }
});

loop();
// render();
// document.body.addEventListener('load', loop); fix this so that loop only runs when body is loaded
