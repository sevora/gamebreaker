class SudokuBoard {

    constructor(matrix, x, y, width, height) {
        this.matrix = matrix;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getValueAt(x, y) {
        return this.matrix[y][x];
    }

    setValueAt(x, y, value) {
        this.matrix[y][x] = value;
        return value;
    }

    render(context) {

        let cellWidth = this.width/9;
        let cellHeight = this.height/9;

        context.save();
        context.translate(this.x, this.y);

        context.fillStyle = 'black';
        context.strokeStyle = 'black';

        context.font = `${width / 10}px Roboto`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';

        // draw the numbers in the matrix
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                let text = this.matrix[y][x];
                context.fillText(text, x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
            }
        }

        // draw the horizontal lines, starting from the top to the bottom
        for (let y = 0; y < 10; ++y) {
            let currentHeight = y * cellHeight;
            context.lineWidth = y % 3 == 0 ? 2 : 1; 

            context.beginPath();
            context.moveTo(0, currentHeight);
            context.lineTo(this.width, currentHeight);
            context.stroke();
            context.closePath();
        }

        // draw the vertical lines, starting from left to right
        for (let x = 0; x < 10; ++x) {
            let currentWidth = x * cellWidth;

            // increases line width to emphasize vertical sub-grid lines
            context.lineWidth = x % 3 == 0 ? 2 : 1;
            context.beginPath();
            context.moveTo(currentWidth, 0);
            context.lineTo(currentWidth, this.height);
            context.stroke();
            context.closePath();
        }

        context.restore();
    }

}
