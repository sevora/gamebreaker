/*
 * This is the Sudoku Board Class
 * It is a renderable sudoku board with several options on rendering:
 * - render the numbers only 
 * - render the grid only
 * - render the whole thing
 *
 * and a recursive solve method, that uses a backtracking solution.
 */
class SudokuBoard {

    /*
     * constructor accepts
     * matrix: a 9x9 2D array of integers,
     * x: A number representing x-coordinate when rendered,
     * y: A number representing y-coordinate when rendered,
     * width: A number representing its width when rendered,
     * height: A number representing its height when rendered
     */
    constructor(matrix, x, y, width, height) {
        this.matrix = matrix;
        this.valid = this.isValid();

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.cellWidth = this.width/9;
        this.cellHeight = this.height/9;
    }

    /*
     * copies another SudokuBoard instance matrix unto itself, returns undefined
     * board: a different SudokuBoard instance
     */
    copyMatrix(board) {
        for(let y = 0; y < 9; ++y) {
            for(let x = 0; x < 9; ++x) {
                this.matrix[y][x] = board.matrix[y][x];
            }
        }
    }


    // used to fill the matrix back to 0s, returns undefined
    clear() {
    	for(let y = 0; y < 9; ++y) {
    		for(let x = 0; x < 9; ++x) {
    			this.matrix[y][x] = 0;
    		}
    	}
    }
    
    // returns the rows of the sudoku board as arrays within arrays
    getRows() {
        return this.matrix;
    }

    
    // returns the columns of the sudoku board as arrays within arrays
    getColumns() {
        let columns = [];
        
        for (let index = 0; index < 9; ++index) {
            columns.push(this.matrix.map(row => row[index]));
        }

        return columns;
    }

    /*
     * returns a flat array consisting of all the numbers in the given position's subgrid
     * the subgrid is according to the rules of sudoku
     */
    getSubgrid(x, y) {
        let anchorY = y - (y % 3);
        let anchorX = x - (x % 3);
        
        let subgrid = [];
        for (let currentY = anchorY; currentY < anchorY + 3; ++currentY) {
            for (let currentX = anchorX; currentX < anchorX + 3; ++currentX) {
                subgrid.push(this.matrix[currentY][currentX]);
            }
        }

        return subgrid;
    }

    // returns an array of arrays which represent the subgrids
    getSubgrids() {
 
        let subgrids = [];
        
        for (let anchorY = 0; anchorY < 9; anchorY += 3) {
            for (let anchorX = 0; anchorX < 9; anchorX += 3) {
                subgrids.push( this.getSubgrid(anchorX, anchorY) );

            }
        }

        return subgrids;
    }


    // returns the position of an empty cell, left-to-right top-to-bottom priority
    getEmptyCell() {
        
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                if (this.matrix[y][x] == 0) return { x, y };
            }
        }

        return { x: -1, y: -1 };
    }

    /* 
     * returns true if the given answer is valid at the 
     * given position false otherwise
     */
    testAnswerAt(x, y, answer) {

        let answerDoesExist = function(cell, index) {
            return cell == this.answer && index != this.position;
        }
 
        let anchorY = y - (y % 3);
        let anchorX = x - (x % 3);
        let flatIndex = (y - anchorY) * 3 + (x - anchorX);

        return !this.getRows()[y].some(answerDoesExist, { position: x, answer }) 
            && !this.getColumns()[x].some(answerDoesExist, { position: y, answer })
            && !this.getSubgrid(x, y).some(answerDoesExist, { position: flatIndex, answer });

        
    }
    
    /*
     * returns true if the board is valid (no repeating number 
     * per slot according to rows, columns, and subgrids) and false otherwise
     */
    isValid() {

        let hasRepeatingDigit = function(array) {
            let digits = [];
            for (let index = 0; index < array.length; ++index) {
                let element = array[index];
                if (digits.indexOf(element) > -1) return true;
                if (element != 0) digits.push(array[index]);
            }
            return false;
        }

        return !this.getRows().some(hasRepeatingDigit) 
            && !this.getColumns().some(hasRepeatingDigit)
            && !this.getSubgrids().some(hasRepeatingDigit);

    }

    // returns the numerical value at given position
    getValueAt(x, y) {
        return this.matrix[y][x];
    }

    // sets the numerical value at given position
    setValueAt(x, y, value) {
        this.matrix[y][x] = value;
        this.valid = this.isValid();
        return value;
    }

    /*
     * recursive backtracking algorithm that mutates the matrix array
     * returns true if there is a solution, otherwise false
     */
    solve() {

        let emptyCell = this.getEmptyCell();

        if (emptyCell.x == -1 && emptyCell.y == -1) {
            return true;
        }

        let { x, y } = emptyCell;
        for (let answer = 1; answer <= 9; ++answer) {
            if (this.testAnswerAt(x, y, answer)) {
                
                this.matrix[y][x] = answer;

                if (this.solve()) return true;

                this.matrix[y][x] = 0;
            }
        }

        return false;

    }

    // renders the grid via canvas API
    renderGrid(context) {
        context.save();

        context.fillStyle = 'black';

        // draw the horizontal lines, starting from the top to the bottom
        for (let y = 0; y < 10; ++y) {
            let currentHeight = y * this.cellHeight;
            context.lineWidth = y % 3 == 0 ? 2 : 1; 

            context.beginPath();
            context.moveTo(0, currentHeight);
            context.lineTo(this.width, currentHeight);
            context.stroke();
            context.closePath();
        }

        // draw the vertical lines, starting from left to right
        for (let x = 0; x < 10; ++x) {
            let currentWidth = x * this.cellWidth;

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

    // renders the numbers in the matrix through canvas API
    renderMatrix(context) {
        context.save();
        context.translate(this.x, this.y);

        context.font = `${this.width / 11}px Roboto`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';

        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                let text = this.matrix[y][x];
                // skip rendering all 0s
                if (text == 0) continue;        
                context.fillText(text, x * this.cellWidth + this.cellWidth / 2, y * this.cellHeight + this.cellHeight / 2);
            }
        }

        context.restore();
    }

    render(context) {
        this.renderGrid(context);
        this.renderMatrix(context);
    }

}
