const boardSize = 4;
let board;
const boardElement = document.getElementById('board');

document.addEventListener('keydown', handleKeyPress);

function initializeBoard() {
  board = new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(0));
  spawnNewTile();
  spawnNewTile();
  updateBoard();
}

function updateBoard() {
  boardElement.innerHTML = '';
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const tileValue = board[row][col];
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if (tileValue > 0) {
        tile.textContent = tileValue;
        tile.setAttribute('data-value', tileValue);
      }
      boardElement.appendChild(tile);
    }
  }
}

function spawnNewTile() {
  let emptyTiles = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  if (emptyTiles.length === 0) return;
  
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[randomTile.row][randomTile.col] = Math.random() < 0.9 ? 2 : 4;
}

function handleKeyPress(event) {
  let moved = false;
  switch (event.key) {
    case 'ArrowUp':
      moved = moveUp();
      break;
    case 'ArrowDown':
      moved = moveDown();
      break;
    case 'ArrowLeft':
      moved = moveLeft();
      break;
    case 'ArrowRight':
      moved = moveRight();
      break;
  }

  if (moved) {
    spawnNewTile();
    updateBoard();
    if (checkGameOver()) {
      alert('Game Over!');
    }
  }
}

function moveUp() {
  return moveTiles((row, col) => ({ row: row - 1, col }), 'vertical');
}

function moveDown() {
  return moveTiles((row, col) => ({ row: row + 1, col }), 'vertical');
}

function moveLeft() {
  return moveTiles((row, col) => ({ row, col: col - 1 }), 'horizontal');
}

function moveRight() {
  return moveTiles((row, col) => ({ row, col: col + 1 }), 'horizontal');
}

function moveTiles(directionFn, axis) {
  let moved = false;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const { row: targetRow, col: targetCol } = directionFn(row, col);
      if (isWithinBounds(targetRow, targetCol)) {
        if (board[targetRow][targetCol] === 0 && board[row][col] !== 0) {
          board[targetRow][targetCol] = board[row][col];
          board[row][col] = 0;
          moved = true;
        } else if (board[targetRow][targetCol] === board[row][col] && board[row][col] !== 0) {
          board[targetRow][targetCol] *= 2;
          board[row][col] = 0;
          moved = true;
        }
      }
    }
  }
  return moved;
}

function isWithinBounds(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function checkGameOver() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === 0) return false;
      if (isWithinBounds(row - 1, col) && board[row - 1][col] === board[row][col]) return false;
      if (isWithinBounds(row + 1, col) && board[row + 1][col] === board[row][col]) return false;
      if (isWithinBounds(row, col - 1) && board[row][col - 1] === board[row][col]) return false;
      if (isWithinBounds(row, col + 1) && board[row][col + 1] === board[row][col]) return false;
    }
  }
  return true;
}

// Initialize game board
initializeBoard();
