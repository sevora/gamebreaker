/**
 * This is all of the code necessary for the tic-tac-toe AI
 * where you fight against the minimax algorithm.
 * It can see all the 3^9 (~20,000) configuration of the game board,
 * and you really don't have a chance of winning.
 */

/**
 * Returns an object with the keys being the symbols in tic-tac-toe,
 * and values as its set value to represent it in the 2d matrix board
 * @returns {Object} the key-value pairs to use in the tic-tac-toe board
 */
function getBoardDefinitions() {
  return { 
    X: -1, 
    _: 0, 
    O: 1 
  }
}

/**
 * Creates an empty tic-tac-toe board.
 * @returns {int[][]} a 3x3 array
 */
function createEmptyBoard() {
  let { _ : emptyCell } = getBoardDefinitions();
  return Array(3).fill().map( () => Array(3).fill(emptyCell) );
}

/**
 * Sets all elements in the board to be empty.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.
 * @returns {int[][]} the reference to the empty board.
 */
function resetBoard(board) { 
  let { _ : empty } = getBoardDefinitions();
  board.forEach(row => {
    row.forEach((cell, index)  => {
      row[index] = empty;
    });
  });

  return board;
}

/**
 * Checks for a win in a tic-tac-toe board and returns the winner.
 * To be more specific, it simply checks if there is any sort of non-empty (empty is 
 * defined from get_board_definitions) sequence forming a win in a traditional tic-tac-toe 
 * board.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.
 * @returns {int|null} a value of one of the enums or null.
 */
function checkForWinner(board) {
  let { _ : empty } = getBoardDefinitions();

  // checks a win by row, as in horizontally
  for (let y = 0; y < 3; ++y) {
    let [ left, middle, right ] = board[y];
    if (left != empty && left === middle && middle === right) return left;
  }

  // checks a win by column, as in vertically
  for (let x = 0; x < 3; ++x) {
    let top = board[0][x];
    let middle = board[1][x];
    let bottom = board[2][x];
    if (top != empty && top === middle && middle === bottom) return top;
  }

  let topLeft = board[0][0];
  let topRight = board[0][2];
  let center = board[1][1];
  let bottomLeft = board[2][0];
  let bottomRight = board[2][2];

  // checks for a win diagonally, both the left diagonal and right diagonal
  if (topLeft != empty && topLeft === center && center === bottomRight) return topLeft;
  if (topRight != empty && topRight === center && center === bottomLeft) return topRight;

  return null;
}

/**
 * Returns a score directly by looking only at the current state of the board.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.
 * @param {int} maximizeFor - a value of one of the enums (X or O).
 * @returns {int} a value signifying the score in the perspective of maximizeFor enum.
 */
function evaluateBoard(board, maximizeFor) {
  let winner = checkForWinner(board);
  if (!winner) return 0;
  return winner == maximizeFor ? 10 : -10;
}

/**
 * Determines whether the board still has empty cells.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums. 
 * @returns {boolean} signifies whether board is filled or not.
 */
function isBoardFilled(board) {
  let { _ : empty } = getBoardDefinitions();
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      if (board[y][x] == empty) return false;
    }
  }
  return true;
}

/**
 * Determines the score for a given state of the board using the minimax algorithm. It looks
 * as deep as given depth, and returns score from highest to lowest depending on the terminating state,
 * wins give +10, ties give 0, and loss gives -10.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.  
 * @param {int} depth - an integer representing the depth of the tree to be generated recursively.
 * @param {int} alpha - alpha for alpha-beta pruning.
 * @param {int} beta - beta for alpha-beta pruning.
 * @param {boolean} isMaximizing - refers to whether current is being maximized or not.
 * @param {int} maximizingPlayer - an enum referring to the maximizing player either X or O.
 * @param {int} minimizingPlayer - an enum referring to the minimizing player either X or O.
 * @returns {int} the score for the given state of the board.
 */
function minimax(board, depth, alpha, beta, isMaximizing, maximizingPlayer, minimizingPlayer) {
  let { _ : empty } = getBoardDefinitions();
  let score = evaluateBoard(board, maximizingPlayer);

  if (Math.abs(score) > 0 || depth == 0) {
    return score;
  } else if ( isBoardFilled(board) ) {
    return 0;
  }

  let bestValue = (isMaximizing ? -1 : 1) * 1000;

  // imagine this as the breadth of the tree graph
  outermostloop:
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      // simply skip cells which are not empty
      if (board[y][x] != empty) continue;

      board[y][x] = isMaximizing ? maximizingPlayer : minimizingPlayer;

      // imagine this as the depth of the tree graph
      let minimaxResult = minimax(board, depth-1, alpha, beta, !isMaximizing, maximizingPlayer, minimizingPlayer);
      bestValue = (isMaximizing ? Math.max : Math.min)(bestValue, minimaxResult);

      board[y][x] = empty; // we are simply testing the move, so we set it back to empty afterwards
      
      // this condition is for alpha beta pruning
      if (isMaximizing) {
        alpha = Math.max(alpha, minimaxResult);
      } else {
        beta = Math.min(beta, minimaxResult);
      }

      if (beta <= alpha) break outermostloop;
    }
  }

  return bestValue;
}

/**
 * Determines the best move the maximizingPlayer should make from a given board state.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.  
 * @param {int} maximizingPlayer - an enum referring to the maximizing player either X or O.
 * @param {int} minimizingPlayer - an enum referring to the minimizing player either X or O.
 * @returns {int[]} an array with 2 elements, y and x referring to grid coordinates for the best move.
 */
function findBestMove(board, maximizingPlayer, minimizingPlayer) {
  let { _ : empty } = getBoardDefinitions();
  let bestValue = -1000;
  let bestMove = [-1, -1];

  // this very similar to minimax algorithm, this is because
  // this is the step where we maximize to find the best move for our turn
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      if (board[y][x] != empty) continue;
      
      board[y][x] = maximizingPlayer;
      
      // the parameter isMaximizing is False as this test move in this loop is our turn
      // and the next move would then be our opponent's hence they're gonna be minimizing
      // as they will pick the move with the least gains for us (equivalently most gains to them) 
      let moveValue = minimax(board, 9, -1000, 1000, false, maximizingPlayer, minimizingPlayer);

      if (moveValue > bestValue) {
        bestMove = [ y, x ];
        bestValue = moveValue;
      }

      board[y][x] = empty;
    };
  }

  return bestMove;
}

export {
  getBoardDefinitions,
  createEmptyBoard,
  resetBoard,
  checkForWinner,
  evaluateBoard,
  isBoardFilled,
  minimax,
  findBestMove
}
