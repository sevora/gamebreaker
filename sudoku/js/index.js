// these are pretty much all constant, there is no need to manipulate this later on
const canvas = document.querySelector('canvas');
const context = new EasyContext(canvas);
const { width, height } = canvas;

// these are the variables important for sudoku
let cellWidth = width / 9;
let cellHeight = height / 9;
let activeCell = { x: 0, y: 0 }

// this loop is meant to be a game loop
function loop() {
    render();
    requestAnimationFrame(loop);
}

// render is supposed to display one frame of the display
function render() {

    context.clear();        
    context.setProperty('fillStyle', 'rgb(220, 220, 220)');
    context.rectangle(activeCell.x * cellWidth, activeCell.y * cellHeight, cellWidth, cellHeight);

    // render the horizontal lines
    for (let y = 0; y < 10; ++y) {
        let currentHeight = y * cellHeight;

        // increases line width to emphasize horizontal sub-grid lines
        context.setProperty('lineWidth', 1); 
        if (y % 3 == 0) {
            context.setProperty('lineWidth', 2)
        }

        context.line(0, currentHeight, width, currentHeight);
    }

    // render the vertical lines
    for (let x = 0; x < 10; ++x) {
        let currentWidth = x * cellWidth;

        // increases line width to emphasize vertical sub-grid lines
        context.setProperty('lineWidth', 1);
        if (x % 3 == 0) {
            context.setProperty('lineWidth', 2)
        }

        context.line(currentWidth, 0, currentWidth, height);
    }

}

loop();
// render();
// document.body.addEventListener('load', loop); fix this so that loop only runs when body is loaded
