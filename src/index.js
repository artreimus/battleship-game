// import './style.css';

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

let destroyerCount = 0;
let submarineCount = 0;
let cruiserCount = 0;
let battleshipCount = 0;
let carrierCount = 0;
let cpuDestroyerCount = 0;
let cpuSubmarineCount = 0;
let cpuCruiserCount = 0;
let cpuBattleshipCount = 0;
let cpuCarrierCount = 0;

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

function revealSquare(square) {
  if (!isGameOver) {
    if (!square.classList.contains('boom')) {
      if (square.classList.contains('destroyer')) destroyerCount += 1;
      else if (square.classList.contains('submarine')) submarineCount += 1;
      else if (square.classList.contains('cruiser')) cruiserCount += 1;
      else if (square.classList.contains('battleship')) battleshipCount += 1;
      else if (square.classList.contains('carrier')) carrierCount += 1;
    }
    if (square.classList.contains('taken')) {
      square.classList.add('boom');
    } else {
      square.classList.add('miss');
    }
    checkForWins();
    currentPlayer = 'computer';
    playGame();
  }
}

function playGame() {
  if (isGameOver) return;
  console.log('game is not over');
  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Go';
    computerSquares.forEach((square) => square.addEventListener('click', () => {
      revealSquare(square);
    }));
  }
  if (currentPlayer === 'computer') {
    turnDisplay.innerHTML = 'Computers Go';
    setTimeout(computerGo, 1000);
  }
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

function computerGo() {
  const random = Math.floor(Math.random() * playerSquares.length);
  if (!playerSquares[random].classList.contains('boom')) {
    playerSquares[random].classList.add('boom');
    if (playerSquares[random].classList.contains('destroyer')) {
      cpuDestroyerCount += 1;
    }
    if (playerSquares[random].classList.contains('submarine')) {
      cpuSubmarineCount += 1;
    }
    if (playerSquares[random].classList.contains('cruiser')) {
      cpuCruiserCount += 1;
    }
    if (playerSquares[random].classList.contains('battleship')) {
      cpuBattleshipCount += 1;
    }
    if (playerSquares[random].classList.contains('carrier')) {
      cpuCarrierCount += 1;
    }
  } else computerGo();
  checkForWins();
  currentPlayer = 'user';
  turnDisplay.innerHTML = 'Your Go';
}

function checkForWins() {
  if (destroyerCount === 2) {
    infoDisplay.innerHTML = 'You sunk the computers destroyer';
    destroyerCount = 10;
  }
  if (submarineCount === 3) {
    infoDisplay.innerHTML = 'You sunk the computers submarine';
    submarineCount = 10;
  }
  if (cruiserCount === 3) {
    infoDisplay.innerHTML = 'You sunk the computers cruiser';
    cruiserCount = 10;
  }
  if (battleshipCount === 4) {
    infoDisplay.innerHTML = 'You sunk the computers battleship';
    battleshipCount = 10;
  }
  if (carrierCount === 5) {
    infoDisplay.innerHTML = 'You sunk the computers carrier';
    carrierCount = 10;
  }
  if (cpuDestroyerCount === 2) {
    infoDisplay.innerHTML = 'You sunk the computers Destroyer';
    cpuDestroyerCount = 10;
  }
  if (cpuSubmarineCount === 3) {
    infoDisplay.innerHTML = 'You sunk the computers Submarine';
    cpuSubmarineCount = 10;
  }
  if (cpuCruiserCount === 3) {
    infoDisplay.innerHTML = 'You sunk the computers Cruiser';
    cpuCruiserCount = 10;
  }
  if (cpuBattleshipCount === 4) {
    infoDisplay.innerHTML = 'You sunk the computers Battleship';
    cpuBattleshipCount = 10;
  }
  if (cpuCarrierCount === 5) {
    infoDisplay.innerHTML = 'You sunk the computers Carrier';
    cpuCarrierCount = 10;
  }
  if (
    destroyerCount
      + submarineCount
      + cruiserCount
      + battleshipCount
      + carrierCount
    === 50
  ) {
    infoDisplay.innerHTML = 'YOU WIN';
    gameOver();
  }
  if (
    cpuDestroyerCount
      + cpuSubmarineCount
      + cpuCruiserCount
      + cpuBattleshipCount
      + cpuCarrierCount
    === 50
  ) {
    infoDisplay.innerHTML = 'COMPUTER WINS';
    gameOver();
  }
}
