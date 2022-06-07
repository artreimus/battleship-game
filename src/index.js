import './style.css';

const userBoard = document.querySelector('[data-user-board]');
const computerBoard = document.querySelector('[data-computer-board]');
const destroyer = document.querySelector('[data-destroyer-ship]');
const submarine = document.querySelector('[data-submarine-ship]');
const cruiser = document.querySelector('[data-cruiser-ship]');
const battleship = document.querySelector('[data-battleship-ship]');
const carrier = document.querySelector('[data-carrier-ship]');
const startButton = document.querySelector('[data-start-button]');
const rotateButton = document.querySelector('[data-rotate-button]');
const ships = document.querySelectorAll('.ship');
const shipsContainer = document.querySelector('[data-ships-container]');
const turnDisplay = document.querySelector('[data-turn-display]');
const infoDisplay = document.querySelector('[data-info-display]');
const playerSquares = [];
const computerSquares = [];
const width = 10;
let isHorizontal = true;
let isGameOver = false;
let currentPlayer = 'user';
let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;
let playerTotal;
let computerTotal;

// Create board
function displayBoard(grid, squares) {
  for (let i = 0; i < width * width; i += 1) {
    const square = document.createElement('div');
    square.dataset.id = i;
    grid.appendChild(square);
    squares.push(square);
  }
}

const createShips = () => [
  {
    name: 'destroyer',
    directions: [
      [0, 1],
      [0, width],
    ],
  },
  {
    name: 'submarine',
    directions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
  },
  {
    name: 'cruiser',
    directions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
  },
  {
    name: 'battleship',
    directions: [
      [0, 1, 2, 3],
      [0, width, width * 2, width * 3],
    ],
  },
  {
    name: 'carrier',
    directions: [
      [0, 1, 2, 3, 4],
      [0, width, width * 2, width * 3, width * 4],
    ],
  },
];

function displayShipsRandom(ship) {
  let randomStart;
  const randomDirection = Math.floor(Math.random() * 2); // 0 or 1
  const current = ship.directions[randomDirection];
  if (randomDirection === 0) {
    randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length - ship.directions[0].length * 1,
      ),
    );
  } else {
    randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length - ship.directions[0].length * 10,
      ),
    );
  }
  const isTaken = current.some((index) => computerSquares[randomStart + index].classList.contains('taken'));
  const isAtRightEdge = current.some(
    (index) => (randomStart + index) % width === width - 1,
  );
  const isAtLeftEdge = current.some(
    (index) => (randomStart + index) % width === 0,
  );

  if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
    current.forEach((index) => computerSquares[randomStart + index].classList.add('taken', ship.name));
  } else displayShipsRandom(ship);
}

function displayComputerShips(battleShips) {
  for (let i = 0; i < 5; i += 1) {
    displayShipsRandom(battleShips[i]);
  }
}

function rotateShips() {
  if (isHorizontal) {
    destroyer.classList.toggle('destroyer-container-vertical');
    submarine.classList.toggle('submarine-container-vertical');
    cruiser.classList.toggle('cruiser-container-vertical');
    battleship.classList.toggle('battleship-container-vertical');
    carrier.classList.toggle('carrier-container-vertical');
    isHorizontal = !isHorizontal;
  } else if (!isHorizontal) {
    destroyer.classList.toggle('destroyer-container-vertical');
    submarine.classList.toggle('submarine-container-vertical');
    cruiser.classList.toggle('cruiser-container-vertical');
    battleship.classList.toggle('battleship-container-vertical');
    carrier.classList.toggle('carrier-container-vertical');
    isHorizontal = !isHorizontal;
  }
}

function dragDrop() {
  // Get id of the last child of `${nameOfShip}-container`
  const shipNameWithLastId = draggedShip.lastElementChild.id;
  // Remove the last 2 letters of the string
  const shipClass = shipNameWithLastId.slice(0, -2);
  // Get the last letter of the string and convert to an Integer
  const lastShipIndex = parseInt(shipNameWithLastId.substr(-1), 10);
  // Last ship index - dataset of the div in which the div was placed
  let shipLastId = lastShipIndex + parseInt(this.dataset.id, 10);
  const notAllowedHorizontal = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81,
    91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83,
    93,
  ];
  const notAllowedVertical = [
    99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81,
    80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62,
    61, 60,
  ];
  // Return an array containing the first x amount of items (x = 0, 10 * lastShipIndex)
  const newNotAllowedHorizontal = notAllowedHorizontal.splice(
    0,
    10 * lastShipIndex,
  );
  const newNotAllowedVertical = notAllowedVertical.splice(
    0,
    10 * lastShipIndex,
  );
  // Get id of the child of the ship-container that was "mousedown" then get last char
  const selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1), 10);
  shipLastId -= selectedShipIndex;

  const shipHorizontal = [];
  const shipVertical = [];
  let isDivTaken;

  const checkArray = (array) => {
    if (array.includes(true)) return true;
    return false;
  };

  if (isHorizontal) {
    for (let i = 0; i < draggedShipLength; i += 1) {
      const isTaken = playerSquares[
        parseInt(this.dataset.id, 10) - selectedShipIndex + i
      ].classList.contains('taken');
      shipHorizontal.push(isTaken);
      isDivTaken = checkArray(shipHorizontal);
    }
  } else if (!isHorizontal) {
    for (let i = 0; i < draggedShipLength; i += 1) {
      const isTaken = playerSquares[
        parseInt(this.dataset.id, 10) - selectedShipIndex + width * i
      ].classList.contains('taken');
      shipVertical.push(isTaken);
      isDivTaken = checkArray(shipVertical);
    }
  }

  if (
    !isDivTaken
    && isHorizontal
    && !newNotAllowedHorizontal.includes(shipLastId)
  ) {
    for (let i = 0; i < draggedShipLength; i += 1) {
      playerSquares[
        parseInt(this.dataset.id, 10) - selectedShipIndex + i
      ].classList.add('taken', shipClass);
    }
  } else if (
    !isDivTaken
    && !isHorizontal
    && !newNotAllowedVertical.includes(shipLastId)
  ) {
    for (let i = 0; i < draggedShipLength; i += 1) {
      playerSquares[
        parseInt(this.dataset.id, 10) - selectedShipIndex + width * i
      ].classList.add('taken', shipClass);
    }
  } else return;

  shipsContainer.removeChild(draggedShip);
}

function dragStart() {
  draggedShip = this;
  draggedShipLength = this.children.length;
}

function preventEventDefault(e) {
  e.preventDefault();
}

function dragShips(ships) {
  ships.forEach((ship) => ship.addEventListener('dragstart', dragStart));
  ships.forEach((ship) => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id;
  }));
}

function dragSquares(playerSquares) {
  playerSquares.forEach((square) => square.addEventListener('dragstart', dragStart));
  playerSquares.forEach((square) => square.addEventListener('dragover', preventEventDefault));
  playerSquares.forEach((square) => square.addEventListener('dragenter', preventEventDefault));
  playerSquares.forEach((square) => square.addEventListener('drop', dragDrop));
}

function createShipsTally() {
  return {
    destroyer: 0,
    submarine: 0,
    cruiser: 0,
    battleship: 0,
    carrier: 0,
  };
}

const playerScore = createShipsTally();
const computerScore = createShipsTally();

function changeTurn() {
  if (currentPlayer === 'computer') {
    currentPlayer = 'user';
  } else if (currentPlayer === 'user') {
    currentPlayer = 'computer';
  }
}

function checkHit(square) {
  if (square.classList.contains('boom')) {
    if (square.classList.contains('destroyer')) playerScore.destroyer += 1;
    if (square.classList.contains('submarine')) playerScore.submarine += 1;
    if (square.classList.contains('cruiser')) playerScore.cruiser += 1;
    if (square.classList.contains('battleship')) playerScore.battleship += 1;
    if (square.classList.contains('carrier')) playerScore.carrier += 1;
    checkShips();
  }
}

function checkAccuracy(square) {
  if (!square.classList.contains('boom') && !square.classList.contains('miss')) {
    if (square.classList.contains('taken')) {
      square.classList.add('boom');
    } else {
      square.classList.add('miss');
    }
    checkHit(square);
    changeTurn();
  }
}

function revealSquare(square) {
  if (isGameOver) return;
  if (currentPlayer === 'user') {
    checkAccuracy(square);
    playTurn();
  }
}

function computerGo() {
  const random = Math.floor(Math.random() * playerSquares.length);
  if (!playerSquares[random].classList.contains('boom')) {
    playerSquares[random].classList.add('boom');
    if (playerSquares[random].classList.contains('destroyer')) {
      computerScore.destroyer += 1;
    }
    if (playerSquares[random].classList.contains('submarine')) {
      computerScore.submarine += 1;
    }
    if (playerSquares[random].classList.contains('cruiser')) {
      computerScore.cruiser += 1;
    }
    if (playerSquares[random].classList.contains('battleship')) {
      computerScore.battleship += 1;
    }
    if (playerSquares[random].classList.contains('carrier')) {
      computerScore.carrier += 1;
    }
  } else computerGo();
  checkShips();
  currentPlayer = 'user';
  turnDisplay.innerHTML = 'Your Go';
}

function playTurn() {
  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Go';
  } else if (currentPlayer === 'computer') {
    turnDisplay.innerHTML = 'Computers Go';
    setTimeout(computerGo, 100);
    checkForWins();
    changeTurn();
  }
}

function playGame() {
  computerSquares.forEach((square) => square.addEventListener('click', () => {
    revealSquare(square);
  }));
  playTurn();
}

function gameOver() {
  isGameOver = true;
  startButton.removeEventListener('click', playGame);
}

function runGame() {
  displayBoard(userBoard, playerSquares);
  displayBoard(computerBoard, computerSquares);
  const battleShips = createShips();
  displayComputerShips(battleShips);
  rotateButton.addEventListener('click', rotateShips);
  dragShips(ships);
  dragSquares(playerSquares);
  startButton.addEventListener('click', playGame);
}

runGame();

function checkComputerShips() {
  if (computerScore.destroyer === 2) {
    infoDisplay.innerHTML = 'Computer  sunk the computers Destroyer';
    computerScore.destroyer = 10;
  }
  if (computerScore.submarine === 3) {
    infoDisplay.innerHTML = 'Computer  sunk the computers Submarine';
    computerScore.submarine = 10;
  }
  if (computerScore.cruiser === 3) {
    infoDisplay.innerHTML = 'Computer  sunk the computers Cruiser';
    computerScore.cruiser = 10;
  }
  if (computerScore.battleship === 4) {
    infoDisplay.innerHTML = 'Computer  sunk the computers Battleship';
    computerScore.battleship = 10;
  }
  if (computerScore.carrier === 5) {
    infoDisplay.innerHTML = 'Computer sunk the computers Carrier';
    computerScore.carrier = 10;
  }
}

function checkPlayerShips() {
  if (playerScore.destroyer === 2) {
    infoDisplay.innerHTML = 'You sunk the computers destroyer';
    playerScore.destroyer = 10;
  }
  if (playerScore.submarine === 3) {
    infoDisplay.innerHTML = 'You sunk the computers submarine';
    playerScore.submarine = 10;
  }
  if (playerScore.cruiser === 3) {
    infoDisplay.innerHTML = 'You sunk the computers cruiser';
    playerScore.cruiser = 10;
  }
  if (playerScore.battleship === 4) {
    infoDisplay.innerHTML = 'You sunk the computers battleship';
    playerScore.battleship = 10;
  }
  if (playerScore.carrier === 5) {
    infoDisplay.innerHTML = 'You sunk the computers carrier';
    playerScore.carrier = 10;
  }
}

function checkShips() {
  checkPlayerShips();
  checkComputerShips();
  playerTotal = Object.values(playerScore).reduce((total, value) => total + value, 0);
  console.log(`Player Score: ${playerTotal}`);
  computerTotal = Object.values(computerScore).reduce((total, value) => total + value, 0);
  console.log(`Computer Score: ${computerTotal}`);
}

function checkForWins() {
  if (playerTotal === 50) {
    infoDisplay.innerHTML = 'Player One Wins!';
    gameOver();
  } else if (computerTotal === 50) {
    infoDisplay.innerHTML = 'Computer Wins!';
    gameOver();
  }
}
