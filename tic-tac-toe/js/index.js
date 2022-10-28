/**
 * This is all of the code for the tic-tac-toe AI
 * interactive page where you fight against the minimax algorithm.
 * It can see all the 3^9 (~20,000) configuration of the game board,
 * and you really don't have a chance of winning.
 */
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();

const startButton = document.querySelector("button");
const playerFirstCheckbox = document.querySelector("input");
const controls = document.querySelector(".controls");
const gameMessage = document.querySelector(".game-message");

const width = canvasWidth/3;
const height = canvasHeight/3;
const fontSize = 64;

const X = -1;
const _ = 0;
const O = 1;

let isGameStarted;
let isPlayerFirst, isPlayerTurn;
let player, opponent;

let board = [
  [ _, _, _ ],
  [ _, _, _ ],
  [ _, _, _ ],
];

/**
 * The first function to run that sets up every thing in the gamebreaker.
 * @returns {void}
 */
function main() {
  // this fixes the issues of low-quality canvas on mobile devices
  // as they have a different DPI
  canvas.width = canvasWidth * devicePixelRatio;
  canvas.height = canvasHeight * devicePixelRatio;
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';
  context.scale(devicePixelRatio, devicePixelRatio);

  canvas.style.display = "none";
  startButton.addEventListener("click", handleStartClick); 
  canvas.addEventListener("click", handleCanvasClick);
  
  render();
}

/**
 * This is the update step in the game loop which
 * updates the game state internals.
 * @returns {void}
 */
function update() {
  let [y, x] = findBestMove(board, opponent, player);
  
  if (y != -1 && x != -1) {
    board[y][x] = opponent;
    isPlayerTurn = true;
  }
 
  // technically we have to check for a winner after every turn of the players
  // one check for player, and another for the opponent, but 
  // in here, we don't do that since we know the player can only lose or get a tie
  let winner = checkForWinner(board);

  // once there is a winner, or the board is filled
  // the condition is false by default and code
  // below will run
  if (!winner && !isBoardFilled(board)) return;
  let message;

  if (winner) {
    message = winner === player ? "Congratulations, you won!" : "Oops, you lost!";
  } else {
    message = "The game ends in a tie!";
  }

  gameMessage.innerText = message;
  controls.style.display = "block";
  startButton.innerText = "Play again";
  isGameStarted = false;
}

/**
 * This is the render part of the game loop where
 * the graphics are drawn in the canvas.
 * @returns {void}
 */
function render() {
  context.clearRect(0, 0, 300, 300);
  context.font = `${fontSize}px monospace`;
  context.textAlign = "center";

  forGrid( function(gridX, gridY, originX, originY) {
    let textX = originX + width/2;
    let textY = originY + height/2 + fontSize * 0.4;
    let symbol = board[gridY][gridX] === X ? "X" : "O";

    context.strokeStyle = "black";
    context.strokeRect(originX, originY, width, height);

    if (board[gridY][gridX] != _){
      context.fillText(symbol, textX, textY);
    }
  });
 
}

/**
 * This is a callback for when the start button
 * is clicked.
 * @param {ClickEvent} event - A click event.
 * @returns {void}
 */
function handleStartClick(event) {
  resetBoard(board);

  let { checked } = playerFirstCheckbox;
  isPlayerFirst = checked;
  isPlayerTurn = checked;

  player = X;
  opponent = O;

  if (!checked) {
    player = O;
    opponent = X;
    update();
  }

  isGameStarted = true;
  gameMessage.innerText = "";
  canvas.style.display = "block";
  controls.style.display = "none";
  render();
}

/**
 * The event listener for the canvas.
 * @param {ClickEvent} event - A click event.
 * @returns {void}
 */
function handleCanvasClick(event) {
  if (!isGameStarted || !isPlayerTurn) return null;

  let rectangle = canvas.getBoundingClientRect(); 
  let x = event.clientX - rectangle.left; 
  let y = event.clientY - rectangle.top;

  forGrid( function(gridX, gridY, originX, originY) {
    // conditions below simply check for point and rectangle
    // collisions, as in if the mouse clicked inside a box
    if (board[gridY][gridX] != _) return;
    if (originX < x && x < originX + width && 
        originY < y && y < originY + height) {
        board[gridY][gridX] = player;
        isPlayerTurn = false;
        update();
        render();
      }
  });
}

/**
 * A helper function that iterates over a 3x3 grid.
 * @param {callback} callback - A function that is called per cell in the grid.
 * @returns {void}
 */
function forGrid(callback) {
  for (let gridY = 0; gridY < 3; ++gridY) {
    for (let gridX = 0; gridX < 3; ++gridX) {
      let originX = gridX * width;
      let originY = gridY * height;
      callback(gridX, gridY, originX, originY);
    }
  }
}

/**
 * Sets all elements in the board to be empty.
 * @param {int[][]} board - a 3x3 array with the values of tic-tac-toe enums.
 * @returns {int[][]} the reference to the empty board.
 */
function resetBoard(board) {
  forGrid( function(gridY, gridX) {
    board[gridY][gridX] = _;
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
  // checks a win by row, as in horizontally
  for (let y = 0; y < 3; ++y) {
    let [ left, middle, right ] = board[y];
    if (left != _ && left === middle && middle === right) return left;
  }

  // checks a win by column, as in vertically
  for (let x = 0; x < 3; ++x) {
    let top = board[0][x];
    let middle = board[1][x];
    let bottom = board[2][x];
    if (top != _ && top === middle && middle === bottom) return top;
  }

  let topLeft = board[0][0];
  let topRight = board[0][2];
  let center = board[1][1];
  let bottomLeft = board[2][0];
  let bottomRight = board[2][2];

  // checks for a win diagonally, both the left diagonal and right diagonal
  if (topLeft != _ && topLeft === center && center === bottomRight) return topLeft;
  if (topRight != _ && topRight === center && center === bottomLeft) return topRight;

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
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      if (board[y][x] == _) return false;
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
      if (board[y][x] != _) continue;

      board[y][x] = isMaximizing ? maximizingPlayer : minimizingPlayer;

      // imagine this as the depth of the tree graph
      let minimaxResult = minimax(board, depth-1, alpha, beta, !isMaximizing, maximizingPlayer, minimizingPlayer);
      bestValue = (isMaximizing ? Math.max : Math.min)(bestValue, minimaxResult);

      board[y][x] = _; // we are simply testing the move, so we set it back to empty afterwards
      
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
  let bestValue = -1000;
  let bestMove = [-1, -1];

  // the callback is very similar to minimax algorithm, this is because
  // this is the step where we maximize to find the best move for our turn
  forGrid( function(gridX, gridY) {
    if (board[gridY][gridX] != _) return;
    
    board[gridY][gridX] = maximizingPlayer;
    
    // the parameter isMaximizing is False as this test move in this loop is our turn
    // and the next move would then be our opponent's hence they're gonna be minimizing
    // as they will pick the move with the least gains for us (equivalently most gains to them) 
    let moveValue = minimax(board, 9, -1000, 1000, false, maximizingPlayer, minimizingPlayer);

    if (moveValue > bestValue) {
      bestMove = [ gridY, gridX ];
      bestValue = moveValue;
    }

    board[gridY][gridX] = _;
  });

  return bestMove;
}

main();
