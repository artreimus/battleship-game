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
const ships = document.querySelectorAll('[data-ship]');

const playerSquares = [];
const computerSquares = [];
const width = 10;
let isHorizontal = true;
// let isGameOver = false;
// let currentPlayer = 'user';

let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;

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
    randomStart = Math.abs(Math.floor(Math.random()
    * computerSquares.length - (ship.directions[0].length * 1)));
  } else {
    randomStart = Math.abs(Math.floor(Math.random()
    * computerSquares.length - (ship.directions[0].length * 10)));
  }
  const isTaken = current.some((index) => computerSquares[randomStart + index].classList.contains('taken'));
  const isAtRightEdge = current.some((index) => (randomStart + index) % width === width - 1);
  const isAtLeftEdge = current.some((index) => (randomStart + index) % width === 0);

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

function dragStart() {
  draggedShip = this;
  draggedShipLength = this.children.length;
  console.log('drag start');
}

function dragOver(e) {
  e.preventDefault();
  console.log('drag over');
}

function dragEnter(e) {
  e.preventDefault();
  console.log('drag enter');
}

function dragLeave() {
  console.log('drag leave');
}

function dragEnd() {
  console.log('drag end');
}

function dragDrop() {
  const shipNameWithLastId = draggedShip.lastElementChild.id;
  const shipClass = shipNameWithLastId.slice(0, -2);
}

function dragShips(ships) {
  ships.forEach((ship) => ship.addEventListener('dragstart', dragStart));
  ships.forEach((ship) => ship.addEventListener('mousedown', (e) => {
    console.log('mouse down');
    selectedShipNameWithIndex = e.target.id;
    console.log(selectedShipNameWithIndex);
  }));
}

function dragSquares(playerSquares) {
  playerSquares.forEach((square) => square.addEventListener('dragstart', dragStart));
  playerSquares.forEach((square) => square.addEventListener('dragover', dragOver));
  playerSquares.forEach((square) => square.addEventListener('dragenter', dragEnter));
  playerSquares.forEach((square) => square.addEventListener('dragleave', dragLeave));
  playerSquares.forEach((square) => square.addEventListener('drop', dragDrop));
  playerSquares.forEach((square) => square.addEventListener('dragend', dragEnd));
}

function runGame() {
  displayBoard(userBoard, playerSquares);
  displayBoard(computerBoard, computerSquares);
  const battleShips = createShips();
  displayComputerShips(battleShips);
  rotateButton.addEventListener('click', rotateShips);
  console.log(ships);
  dragShips(ships);
  dragSquares(playerSquares);
}

runGame();
