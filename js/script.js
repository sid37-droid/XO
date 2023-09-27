// Создание игрового поля
const board = document.getElementById('board');
const cells = Array.from(document.getElementsByClassName('cell'));
const restartBtn = document.getElementById('restart');
const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1;
let gameOver = false;
// Добавленные переменные и элементы
const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');
const saveBtn = document.getElementById('save');
const loadBtn = document.getElementById('load');
const difficultyСhoice = document.querySelector('.difficulty__choice');
let mode = 'computer'; // По умолчанию выбран режим против компьютера
let difficulty = 'easy'; // По умолчанию выбран простой уровень сложности
// Инициализация игры
startNewGame();
// Обработчики событий
board.addEventListener('click', handleClick);
restartBtn.addEventListener('click', startNewGame);
modeSelect.addEventListener('change', handleModeChange);
difficultySelect.addEventListener('change', handleDifficultyChange);
saveBtn.addEventListener('click', saveGame);
loadBtn.addEventListener('click', loadGame);
// Функция обработки хода игрока
function handleClick(event) {
  const cell = event.target;
  const currentIndex = cells.indexOf(cell);
  if (cell.innerText === '' && !gameOver) {
    cell.innerText = currentPlayer;
    checkWin(currentPlayer);
    // Смена игрока
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    // Если выбран режим против компьютера, делаем ход компьютера
    if (mode === 'computer' && !gameOver && currentPlayer === player2) {
      makeComputerMove();
      // difficultyСhoice.style.display = "block"
    }
  }
}
// Функция проверки условия победы
function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные
    [0, 4, 8], [2, 4, 6] // диагональные
  ];
  for (let combination of winningCombinations) {
    if (cells[combination[0]].innerText === player &&
        cells[combination[1]].innerText === player &&
        cells[combination[2]].innerText === player) {
      gameOver = true;
      cells[combination[0]].classList.add('win');
      cells[combination[1]].classList.add('win');
      cells[combination[2]].classList.add('win');
      break;
    }
  }
}
// Функция начала новой игры
function startNewGame() {
  currentPlayer = player1;
  gameOver = false;
  // Очистка игрового поля
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('win');
  });
}
// Функция выбора режима игры
function handleModeChange(event) {
  if(mode === 'computer'){
    difficultyСhoice.style.display = "none"
    startNewGame()
  }else{
    difficultyСhoice.style.display = "block"
    startNewGame()
  }
  mode = event.target.value;
  if (mode === 'computer' && currentPlayer === player2 && !gameOver) {
    makeComputerMove();
  }
}
// Функция выбора уровня сложности
function handleDifficultyChange(event) {
  difficulty = event.target.value;
}
function minimax(newBoard, player) {
  const availableCells = newBoard.filter(cell => cell.innerText === '');
  if (checkWin(player1)) {
    return { score: -1 };
  } else if (checkWin(player2)) {
    return { score: 1 };
  } else if (availableCells.length === 0) {
    return { score: 0 };
  }
  const moves = [];
  for (let i = 0; i < availableCells.length; i++) {
    const move = {};
    move.index = cells.indexOf(availableCells[i]);
    newBoard[move.index].innerText = player;
    if (player === player2) {
      const result = minimax(newBoard, player1);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, player2);
      move.score = result.score;
    }
    newBoard[move.index].innerText = '';
    moves.push(move);
  }
  let bestMove;
  if (player === player2) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }
  return bestMove;
}
// Функция хода компьютера
function makeComputerMove() {
  const availableCells = cells.filter(cell => cell.innerText === '');
  if (availableCells.length > 0) {
    let selectedCell;
    if (difficulty === 'easy') {
      // Простой уровень сложности - случайный ход
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      selectedCell = availableCells[randomIndex];
    } else {
      // Сложный уровень сложности - использование определенной стратегии
      selectedCell = availableCells[0];
      // selectedCell = minimax(cells, player2).index;
    }
    selectedCell.innerText = currentPlayer;
    checkWin(currentPlayer);
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }
}// Функция сохранения текущего прогресса игры в localStorage



function saveGame() {
  const gameState = {
    currentPlayer,
    gameOver,
    cells: cells.map(cell => cell.innerText)
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}
// Функция загрузки сохраненного прогресса игры из localStorage
function loadGame() {
  const savedGameState = localStorage.getItem('gameState');
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    currentPlayer = gameState.currentPlayer;
    gameOver = gameState.gameOver;
    cells.forEach((cell, index) => {
      cell.innerText = gameState.cells[index];
    });
  }
}


