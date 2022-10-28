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

function main() {
  // fix DPI
  canvas.width = canvasWidth * devicePixelRatio;
  canvas.height = canvasHeight * devicePixelRatio;
  context.scale(devicePixelRatio, devicePixelRatio);
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';

  canvas.style.display = "none";

  startButton.addEventListener("click", handleStartClick); 
  canvas.addEventListener("click", handleCanvasClick);
  
  render();
}

function update() {
  let [y, x] = findBestMove(board, opponent, player);
  
  if (y != -1 && x != -1) {
    board[y][x] = opponent;
    isPlayerTurn = true;
  }

  // once there is a winner, or the board is filled
  // the condition is false by default and code
  // below will run
  
  // technically we have to check for a winner after every turn of the players
  // a.k.a. one check for player, and another for the opponent, but 
  // in here, we don't do that since we know the player can only lose or get a tie
  let winner = checkForWinner(board);
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

function handleCanvasClick(event) {
  if (!isGameStarted || !isPlayerTurn) return null;

  let rectangle = canvas.getBoundingClientRect(); 
  let x = event.clientX - rectangle.left; 
  let y = event.clientY - rectangle.top;

  forGrid( function(gridX, gridY, originX, originY) {
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

function forGrid(callback) {
  for (let gridY = 0; gridY < 3; ++gridY) {
    for (let gridX = 0; gridX < 3; ++gridX) {
      let originX = gridX * width;
      let originY = gridY * height;
      callback(gridX, gridY, originX, originY);
    }
  }
}

function resetBoard(board) {
  forGrid( function(gridY, gridX) {
    board[gridY][gridX] = _;
  });
}

function checkForWinner(board) {
  for (let y = 0; y < 3; ++y) {
    let [ left, middle, right ] = board[y];
    if (left != _ && left === middle && middle === right) return left;
  }

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

  if (topLeft != _ && topLeft === center && center === bottomRight) return topLeft;
  if (topRight != _ && topRight === center && center === bottomLeft) return topRight;

  return null;
}

function evaluateBoard(board, maximizeFor) {
  let winner = checkForWinner(board);
  if (!winner) return 0;
  return winner == maximizeFor ? 10 : -10;
}

function isBoardFilled(board) {
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      if (board[y][x] == _) return false;
    }
  }
  return true;
}

function minimax(board, depth, alpha, beta, isMaximizing, maximizingPlayer, minimizingPlayer) {
  let score = evaluateBoard(board, maximizingPlayer);

  if (Math.abs(score) > 0 || depth == 0) {
    return score;
  } else if ( isBoardFilled(board) ) {
    return 0;
  }

  let bestValue = (isMaximizing ? -1 : 1) * 1000;

  outermostloop:
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 3; ++x) {
      if (board[y][x] != _) continue;

      board[y][x] = isMaximizing ? maximizingPlayer : minimizingPlayer;

      let minimaxResult = minimax(board, depth-1, alpha, beta, !isMaximizing, maximizingPlayer, minimizingPlayer);
      bestValue = (isMaximizing ? Math.max : Math.min)(bestValue, minimaxResult);

      board[y][x] = _;

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

function findBestMove(board, maximizingPlayer, minimizingPlayer) {
  let bestValue = -1000;
  let bestMove = [-1, -1];

  forGrid( function(gridX, gridY) {
    if (board[gridY][gridX] != _) return;
    
    board[gridY][gridX] = maximizingPlayer;
    
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
