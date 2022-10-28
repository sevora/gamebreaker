const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const startButton = document.querySelector("button");
const playerFirstCheckbox = document.querySelector("input");
const control = document.querySelector("#control");

const width = 300/3;
const height = 300/3;
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
  // DPI-hack
  canvas.width = 600;
  canvas.height = 600;
  canvas.style.width = "300px";
  canvas.style.height = "300px";
  context.scale(2,2);

  canvas.style.display = "none";

  startButton.addEventListener("click", handleStartClick); 
  canvas.addEventListener("click", handleCanvasClick);
  
  render();
}

function update() {
  // opponent turn
  isPlayerTurn = true;
}

function render() {
  context.clearRect(0, 0, 300, 300);
  context.font = `${fontSize}px monospace`;
  context.textAlign = "center";
 
  forGrid( function(gridX, gridY, originX, originY) {
    let textX = originX + width/2;
    let textY = originY + height/2 + fontSize * 0.4;
    let symbol = board[gridY][gridX] == X ? "X" : "O";

    context.strokeStyle = "black";
    context.strokeRect(originX, originY, width, height);

    if (board[gridY][gridX] != _){
      context.fillText(symbol, textX, textY);
    }
  });
 
}

function handleStartClick(event) {
  let { checked } = playerFirstCheckbox;
  isPlayerFirst = checked;
  isPlayerTurn = checked;

  player = O;
  opponent = X;

  if (checked) {
    player = X;
    opponent = O;
  }

  isGameStarted = true;
  canvas.style.display = "block";
  control.style.display = "none";
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

main();
