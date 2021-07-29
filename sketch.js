let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let ai = 'X';
let human = 'O';
let currentPlayer = human;
let w;
let h;

function setup() {
  createCanvas(500, 500);
  w = width/3;
  h = height/3;
  bestTurn();
}

function equals3(a, b, c) {
  return a == b && b == c && a !== "";
}

function checkWinner() {
  let winner = null;

  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][2], board[i][1])) {
      winner = board[i][0];
    }
  }

  for (let j = 0; j < 3; j++) {
    if (equals3(board[0][j], board[2][j], board[1][j])) {
      winner = board[0][j];
    }
  }

  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }

  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }
  
  if (winner == null && openSpots == 0) {
    return "tie";
  } else {
    return winner;
  }
}

let scores = {
  X: 1,
  O: -1,
  tie: 0,
};

function miniMax(board, depth, isMax) {
  let result = checkWinner();
  if (result !== null) {
    if(scores[result] != 0)
      return scores[result]/depth;
    else 
      return 0;
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = ai;
          let score = miniMax(board, depth + 1, false);
          board[i][j] = "";
          bestScore = max(bestScore, score);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = human;
          let score = miniMax(board, depth + 1, true);
          board[i][j] = "";
          bestScore = min(bestScore, score);
        }
      }
    }
    return bestScore;
  }
}

function bestTurn() 
{
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        board[i][j] = ai;
        let score = miniMax(board, 0, false);
        board[i][j] = "";
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  console.log(bestScore);
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

function mousePressed() {
  if (currentPlayer == human) {
    let i = floor(mouseX / (width / 3));
    let j = floor(mouseY / (height / 3));
    
    if (board[i][j] == "") {
      board[i][j] = human;
      currentPlayer = ai;
      bestTurn();
    }
  }
}

function draw() {
  background(240);
  let w = width / 3;
  let h = height / 3;

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      strokeWeight(4);
      if (spot == human) {
        noFill();
        ellipse(x, y, w / 2);
      } else if (spot == ai) {
        let xr = w / 4;
        line(x - xr, y - xr, x + xr, y + xr);
        line(x + xr, y - xr, x - xr, y + xr);
      }
    }
  }

  let result = checkWinner();

  if (result !== null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
    
  }
}
