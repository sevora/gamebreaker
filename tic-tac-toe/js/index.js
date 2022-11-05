/*
 * This is the main file where you can see in general how the 
 * interactive page works. For an in-depth look at how the AI
 * works specifically findBestMove function, check out the other file
 * tic-tac-toe.js
 */
import {
  getBoardDefinitions,
  createEmptyBoard,
  resetBoard,
  checkForWinner,
  evaluateBoard,
  isBoardFilled,
  minimax,
  findBestMove
} from './tic-tac-toe.js';

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

let isGameStarted;
let isPlayerFirst, isPlayerTurn;
let player, opponent;

let { X, _, O } = getBoardDefinitions();
let board = createEmptyBoard();

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


main();
