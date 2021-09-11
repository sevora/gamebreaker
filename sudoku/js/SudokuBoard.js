class SudokuBoard {

    constructor(matrix, x, y, width, height) {
        this.matrix = matrix;

        let hasValidWidth = this.matrix.length == 9;
        let hasValidHeight = this.matrix.every(row => row.length == 9);
        let hasValidCells = this.matrix.flat(1).every(element => typeof element == 'number' && element >= 0 && element <= 9);

        let currentWidth = this.matrix.length;
        let currentHeight = this.matrix[0] ? this.matrix[0].length : 0;
        let mainError = 'Matrix must be 2-dimensions of size 9x9.'

        if ( !hasValidWidth || !hasValidHeight ) {
            throw `${mainError} Current: (${currentWidth}, ${currentHeight}). Expected: (9, 9)`;
        }

        if ( !hasValidCells ) {
            throw `${mainError} All elements must be numbers ranging from 0 to 9.`;
        }

        this.valid = this.isValid(); // checks if the board has solutions
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    clear() {
    	for(let y = 0; y < this.matrix.length; ++y) {
    		for(let x = 0; x < this.matrix[y].length; ++x) {
    			this.matrix[y][x] = 0;
    		}
    	}
    }
    
    getRows() {
        return this.matrix;
    }

    getColumns() {
        let columns = [];
        
        for (let index = 0; index < 9; ++index) {
            columns.push(this.matrix.map(row => row[index]));
        }

        return columns;
    }

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

    // returns true if the given answer is valid at the given position
    // false otherwise
    testAnswerAt(x, y, answer) {

        /*
        let answerDoesNotExist = function(cell, index) {
            if (cell == this.answer && index != this.position) return false;
            return true;
        }

        let rowValid = this.matrix[y].every(answerDoesNotExist, { position: x, answer }); 
        let columnValid = this.matrix.map(row => row[x]).every(answerDoesNotExist, { position: y, answer });

        // rewrite to use answerDoesNotExist function by making getSubgrids better
        let subgridValid = true;
        let anchorY = y - (y % 3);
        let anchorX = x - (x % 3);

        for (let subgridY = anchorY; subgridY < anchorY + 3; ++subgridY) {
            for (let subgridX = anchorX; subgridX < anchorX + 3; ++subgridX) {
                
                if (subgridY == y && subgridX == x) continue;

                if (this.matrix[subgridY][subgridX] == answer) {
                    subgridValid = false;
                }
            }
        }

        return rowValid && columnValid && subgridValid; */

        let answerDoesExist = function(cell, index) {
            return cell == this.answer && index != this.position;
        }
 
        let anchorY = y - (y % 3);
        let anchorX = x - (x % 3);
        let flatIndex = (y - anchorY) * 3 + (x - anchorX);
        // console.log(flatIndex, this.getSubgrid(x, y)[flatIndex]);

        return !this.getRows()[y].some(answerDoesExist, { position: x, answer }) 
            && !this.getColumns()[x].some(answerDoesExist, { position: y, answer })
            && !this.getSubgrid(x, y).some(answerDoesExist, { position: flatIndex, answer });

        
    }
    
    // validity for a sudoku board filled with acceptable values
    // returns true if the board is valid (has solutions) and false otherwise
    isValid() {

        /* let noRepeatingDigit = function(array) {
            let digits = [];
            for (let index = 0; index < array.length; ++index) {
                let element = array[index];
                if (digits.indexOf(element) > -1) return false;
                if (element != 0) digits.push(array[index]);
            }
            return true;
        }

        let rowsValid = this.getRows().every(noRepeatingDigit);
        let columnsValid = this.getColumns().every(noRepeatingDigit);
        let subgridsValid = this.getSubgrids().every(noRepeatingDigit);

        return rowsValid && columnsValid && subgridsValid; */

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

    getValueAt(x, y) {
        return this.matrix[y][x];
    }

    setValueAt(x, y, value) {
        this.matrix[y][x] = value;
        this.valid = this.isValid();
        return value;
    }

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

    render(context) {

        let cellWidth = this.width/9;
        let cellHeight = this.height/9;

        context.save();
        context.translate(this.x, this.y);

        context.fillStyle = this.valid ? 'black' : 'red';
        context.strokeStyle = 'black';

        context.font = `${this.width / 11}px Roboto`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';

        // draw the numbers in the matrix
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                let text = this.matrix[y][x];
                if (text == 0) continue;
                context.fillText(text, x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
            }
        }

        context.fillStyle = 'black';

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
