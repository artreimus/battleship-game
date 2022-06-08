"use strict";
(self["webpackChunkbattleship_game"] = self["webpackChunkbattleship_game"] || []).push([["index"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");

var userBoard = document.querySelector('[data-user-board]');
var computerBoard = document.querySelector('[data-computer-board]');
var destroyer = document.querySelector('[data-destroyer-ship]');
var submarine = document.querySelector('[data-submarine-ship]');
var cruiser = document.querySelector('[data-cruiser-ship]');
var battleship = document.querySelector('[data-battleship-ship]');
var carrier = document.querySelector('[data-carrier-ship]');
var startButton = document.querySelector('[data-start-button]');
var rotateButton = document.querySelector('[data-rotate-button]');
var ships = document.querySelectorAll('.ship');
var shipsContainer = document.querySelector('[data-ships-container]');
var infoContainer = document.querySelector('[data-info-container]');
var turnDisplay = document.querySelector('[data-turn-display]');
var buttonContainer = document.querySelector('[data-button-container]');
var playerSquares = [];
var computerSquares = [];
var width = 10;
var isHorizontal = true;
var isGameOver = false;
var currentPlayer = 'user';
var selectedShipNameWithIndex;
var draggedShip;
var draggedShipLength;
var playerTotal;
var computerTotal;
var winner;
var sunkShip; // Create board

function displayBoard(grid, squares) {
  for (var i = 0; i < width * width; i += 1) {
    var square = document.createElement('div');
    square.dataset.id = i;
    grid.appendChild(square);
    squares.push(square);
  }
}

var createShips = function createShips() {
  return [{
    name: 'destroyer',
    directions: [[0, 1], [0, width]]
  }, {
    name: 'submarine',
    directions: [[0, 1, 2], [0, width, width * 2]]
  }, {
    name: 'cruiser',
    directions: [[0, 1, 2], [0, width, width * 2]]
  }, {
    name: 'battleship',
    directions: [[0, 1, 2, 3], [0, width, width * 2, width * 3]]
  }, {
    name: 'carrier',
    directions: [[0, 1, 2, 3, 4], [0, width, width * 2, width * 3, width * 4]]
  }];
};

function displayShipsRandom(ship) {
  var randomStart;
  var randomDirection = Math.floor(Math.random() * 2); // 0 or 1

  var current = ship.directions[randomDirection];

  if (randomDirection === 0) {
    randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - ship.directions[0].length * 1));
  } else {
    randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - ship.directions[0].length * 10));
  }

  var isTaken = current.some(function (index) {
    return computerSquares[randomStart + index].classList.contains('taken');
  });
  var isAtRightEdge = current.some(function (index) {
    return (randomStart + index) % width === width - 1;
  });
  var isAtLeftEdge = current.some(function (index) {
    return (randomStart + index) % width === 0;
  });

  if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
    current.forEach(function (index) {
      return computerSquares[randomStart + index].classList.add('taken', ship.name);
    });
  } else displayShipsRandom(ship);
}

function displayComputerShips(battleShips) {
  for (var i = 0; i < 5; i += 1) {
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
  var shipNameWithLastId = draggedShip.lastElementChild.id; // Remove the last 2 letters of the string

  var shipClass = shipNameWithLastId.slice(0, -2); // Get the last letter of the string and convert to an Integer

  var lastShipIndex = parseInt(shipNameWithLastId.substr(-1), 10); // Last ship index - dataset of the div in which the div was placed

  var shipLastId = lastShipIndex + parseInt(this.dataset.id, 10);
  var notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93];
  var notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]; // Return an array containing the first x amount of items (x = 0, 10 * lastShipIndex)

  var newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
  var newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex); // Get id of the child of the ship-container that was "mousedown" then get last char

  var selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1), 10);
  shipLastId -= selectedShipIndex;
  var shipHorizontal = [];
  var shipVertical = [];
  var isDivTaken;

  var checkArray = function checkArray(array) {
    if (array.includes(true)) return true;
    return false;
  };

  if (isHorizontal) {
    for (var i = 0; i < draggedShipLength; i += 1) {
      var isTaken = playerSquares[parseInt(this.dataset.id, 10) - selectedShipIndex + i].classList.contains('taken');
      shipHorizontal.push(isTaken);
      isDivTaken = checkArray(shipHorizontal);
    }
  } else if (!isHorizontal) {
    for (var _i = 0; _i < draggedShipLength; _i += 1) {
      var _isTaken = playerSquares[parseInt(this.dataset.id, 10) - selectedShipIndex + width * _i].classList.contains('taken');

      shipVertical.push(_isTaken);
      isDivTaken = checkArray(shipVertical);
    }
  }

  if (!isDivTaken && isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    for (var _i2 = 0; _i2 < draggedShipLength; _i2 += 1) {
      var directionClass = void 0;
      if (_i2 === 0) directionClass = 'start';
      if (_i2 !== 0 && _i2 !== draggedShipLength - 1) directionClass = 'middle';
      if (_i2 === draggedShipLength - 1) directionClass = 'end';

      playerSquares[parseInt(this.dataset.id, 10) - selectedShipIndex + _i2].classList.add('taken', 'horizontal', directionClass, shipClass);
    }
  } else if (!isDivTaken && !isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    for (var _i3 = 0; _i3 < draggedShipLength; _i3 += 1) {
      var _directionClass = void 0;

      if (_i3 === 0) _directionClass = 'start';
      if (_i3 !== 0 && _i3 !== draggedShipLength - 1) _directionClass = 'middle';
      if (_i3 === draggedShipLength - 1) _directionClass = 'end';

      playerSquares[parseInt(this.dataset.id, 10) - selectedShipIndex + width * _i3].classList.add('taken', 'vertical', shipClass, _directionClass);
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

function dragShips() {
  ships.forEach(function (ship) {
    return ship.addEventListener('dragstart', dragStart);
  });
  ships.forEach(function (ship) {
    return ship.addEventListener('mousedown', function (e) {
      selectedShipNameWithIndex = e.target.id;
    });
  });
}

function dragSquares() {
  playerSquares.forEach(function (square) {
    return square.addEventListener('dragstart', dragStart);
  });
  playerSquares.forEach(function (square) {
    return square.addEventListener('dragover', preventEventDefault);
  });
  playerSquares.forEach(function (square) {
    return square.addEventListener('dragenter', preventEventDefault);
  });
  playerSquares.forEach(function (square) {
    return square.addEventListener('drop', dragDrop);
  });
}

function createAlert(message) {
  var infoDisplay = document.createElement('div');
  infoContainer.appendChild(infoDisplay);
  infoDisplay.className = 'info-display';
  infoDisplay.appendChild(document.createTextNode(message));
  setTimeout(function () {
    infoDisplay.remove();
  }, 2000);
}

function displayAlert(eventAlert) {
  var alertDisplay;

  if (eventAlert === 'alert-start-error') {
    alertDisplay = 'Cannot start the game without placing all ships.';
    createAlert(alertDisplay);
  } else if (eventAlert === 'alert-player-sunk') {
    alertDisplay = "You sunk a ".concat(sunkShip, "!");
    createAlert(alertDisplay);
  } else if (eventAlert === 'alert-computer-sunk') {
    alertDisplay = "Computer sunk a ".concat(sunkShip, "!");
    createAlert(alertDisplay);
  } else if (eventAlert === 'alert-player-hit') {
    alertDisplay = 'You hit a ship!';
    createAlert(alertDisplay);
  } else if (eventAlert === 'alert-computer-hit') {
    alertDisplay = 'The computer hit a ship!';
    createAlert(alertDisplay);
  } else if (eventAlert === 'alert-winner') {
    alertDisplay = "".concat(winner, " wins!");
    createAlert(alertDisplay);
  }
}

function createShipsTally() {
  return {
    destroyer: 0,
    submarine: 0,
    cruiser: 0,
    battleship: 0,
    carrier: 0
  };
}

var playerScore = createShipsTally();
var computerScore = createShipsTally();

function changeTurn() {
  if (currentPlayer === 'computer') {
    currentPlayer = 'user';
  } else if (currentPlayer === 'user') {
    currentPlayer = 'computer';
  }
}

function checkComputerShips() {
  if (computerScore.destroyer === 2) {
    sunkShip = 'Destroyer';
    displayAlert('alert-computer-sunk');
    computerScore.destroyer = 10;
  }

  if (computerScore.submarine === 3) {
    sunkShip = 'Submarine';
    displayAlert('alert-computer-sunk');
    computerScore.submarine = 10;
  }

  if (computerScore.cruiser === 3) {
    sunkShip = 'Cruiser';
    displayAlert('alert-computer-sunk');
    computerScore.cruiser = 10;
  }

  if (computerScore.battleship === 4) {
    sunkShip = 'Battleship';
    displayAlert('alert-computer-sunk');
    computerScore.battleship = 10;
  }

  if (computerScore.carrier === 5) {
    sunkShip = 'Carrier';
    displayAlert('alert-computer-sunk');
    computerScore.carrier = 10;
  }
}

function checkPlayerShips() {
  if (playerScore.destroyer === 2) {
    sunkShip = 'Destroyer';
    displayAlert('alert-player-sunk');
    playerScore.destroyer = 10;
  }

  if (playerScore.submarine === 3) {
    sunkShip = 'Submarine';
    displayAlert('alert-player-sunk');
    playerScore.submarine = 10;
  }

  if (playerScore.cruiser === 3) {
    sunkShip = 'Cruiser';
    displayAlert('alert-player-sunk');
    playerScore.cruiser = 10;
  }

  if (playerScore.battleship === 4) {
    sunkShip = 'Battleship';
    displayAlert('alert-player-sunk');
    playerScore.battleship = 10;
  }

  if (playerScore.carrier === 5) {
    sunkShip = 'Carrier';
    displayAlert('alert-player-sunk');
    playerScore.carrier = 10;
  }
}

function checkShips() {
  checkPlayerShips();
  checkComputerShips();
  playerTotal = Object.values(playerScore).reduce(function (total, value) {
    return total + value;
  }, 0);
  computerTotal = Object.values(computerScore).reduce(function (total, value) {
    return total + value;
  }, 0);
  console.log(computerTotal);
}

function checkHit(square) {
  if (square.classList.contains('boom')) {
    if (square.classList.contains('destroyer')) playerScore.destroyer += 1;
    if (square.classList.contains('submarine')) playerScore.submarine += 1;
    if (square.classList.contains('cruiser')) playerScore.cruiser += 1;
    if (square.classList.contains('battleship')) playerScore.battleship += 1;
    if (square.classList.contains('carrier')) playerScore.carrier += 1;
    displayAlert('alert-player-hit');
    checkShips();
  }
}

function computerGo() {
  var random = Math.floor(Math.random() * playerSquares.length);
  var hit = playerSquares[random].classList.contains('taken');
  playerSquares[random].classList.add(hit ? 'boom' : 'miss');

  if (!playerSquares[random].classList.contains('boom') || !playerSquares[random].classList.contains('miss')) {
    if (playerSquares[random].classList.contains('destroyer')) {
      computerScore.destroyer += 1;
      displayAlert('alert-computer-hit');
    }

    if (playerSquares[random].classList.contains('submarine')) {
      computerScore.submarine += 1;
      displayAlert('alert-computer-hit');
    }

    if (playerSquares[random].classList.contains('cruiser')) {
      computerScore.cruiser += 1;
      displayAlert('alert-computer-hit');
    }

    if (playerSquares[random].classList.contains('battleship')) {
      computerScore.battleship += 1;
      displayAlert('alert-computer-hit');
    }

    if (playerSquares[random].classList.contains('carrier')) {
      computerScore.carrier += 1;
      displayAlert('alert-computer-hit');
    }
  } else computerGo();

  checkShips();
  turnDisplay.innerHTML = 'Your turn';
}

function playTurn() {
  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Turn';
  } else if (currentPlayer === 'computer') {
    turnDisplay.innerHTML = 'Computer\'s Turn';
    setTimeout(computerGo, 1500);
    changeTurn();
    checkForWins();
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

function playGame() {
  if (shipsContainer.children.length === 0) {
    computerSquares.forEach(function (square) {
      return square.addEventListener('click', function () {
        revealSquare(square);
      });
    });
    buttonContainer.style.display = 'none';
    playTurn();
  } else {
    displayAlert('alert-start-error');
  }
}

function gameOver() {
  isGameOver = true;
  startButton.removeEventListener('click', playGame);
}

function checkForWins() {
  if (playerTotal === 50) {
    // infoDisplay.innerHTML = 'Player One Wins!';
    winner = 'Player One';
    displayAlert('alert-winner');
    gameOver();
  } else if (computerTotal === 50) {
    // infoDisplay.innerHTML = 'Computer Wins!';
    winner = 'Computer';
    displayAlert('alert-winner');
    gameOver();
  }
}

function runGame() {
  displayBoard(userBoard, playerSquares);
  displayBoard(computerBoard, computerSquares);
  var battleShips = createShips();
  displayComputerShips(battleShips);
  rotateButton.addEventListener('click', rotateShips);
  dragShips();
  dragSquares();
  startButton.addEventListener('click', playGame);
}

runGame();

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n:root {\n  /* --board-color: rgb(197, 196, 255); */\n  --board-color: rgb(169, 255, 255);\n  --grid-color: rgba(255, 255, 255, 0.5);\n  --ships-color: rgb(228, 228, 228);\n  --boom-color: rgb(255, 0, 0);\n  --miss-color: rgb(255, 255, 255);\n}\n\n* {\n  font-family: \"Press Start 2P\", cursive;\n}\n\n.title {\n  font-size: 2.5rem;\n}\n\n.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  width: 100%;\n  background-color: none;\n}\n\n.battleship-grid {\n  margin: 2vmin;\n  display: grid;\n  grid-template-rows: repeat(10, 4.6vmin);\n  grid-template-columns: repeat(10, 4.6vmin);\n  background-color: var(--board-color);\n}\n\n.battleship-grid div {\n  border: 1px solid var(--grid-color);\n}\n\n.computer-board {\n  cursor: pointer;\n}\n\n.taken,\n.ship {\n  background-color: var(--ships-color);\n  position: relative;\n}\n\n.taken.start.vertical,\n.taken.start.vertical::before {\n  border-top-left-radius: 50%;\n  border-top-right-radius: 50%;\n}\n\n.taken.end.vertical,\n.taken.end.vertical::before {\n  border-bottom-left-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.taken.start.horizontal,\n.taken.start.horizontal::before {\n  border-top-left-radius: 50%;\n  border-bottom-left-radius: 50%;\n}\n\n.taken.end.horizontal,\n.taken.end.horizontal::before {\n  border-top-right-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.computer-board > .taken {\n  background-color: var(--board-color);\n  border-radius: 0% !important;\n}\n\n.taken.vertical::before,\n.taken.horizontal::before {\n  content: \"\";\n  position: absolute;\n  border: 0.3vmin solid white;\n  top: -1px;\n  bottom: -1px;\n  left: -1px;\n  right: -1px;\n}\n\n.taken.horizontal::before {\n  border-left: none;\n  border-right: none;\n  animation: ripplesY 3s linear infinite;\n}\n\n.taken.vertical::before {\n  border-top: none;\n  border-bottom: none;\n  animation: ripplesX 3s linear infinite;\n}\n\n@keyframes ripplesX {\n  0% {\n    opacity: 1;\n    transform: scaleX(1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scaleX(1.5);\n  }\n}\n\n@keyframes ripplesY {\n  0% {\n    opacity: 1;\n    transform: scaleY(1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scaleY(1.5);\n  }\n}\n\n.turn-display {\n  font-size: 1.5rem;\n  font-weight: 900;\n  margin: 1rem 0;\n}\n\n.info-display {\n  display: flex;\n  align-items: center;\n  font-size: 1rem;\n  flex-direction: row;\n  max-width: 800px;\n  margin: 0.8rem 0;\n}\n\n.hidden-info {\n  align-items: center;\n  flex-direction: column;\n}\n\n.btn {\n  display: inline-block;\n  padding: 0.7em 1.2em;\n  margin: 0 0.1em 0.1em 0;\n  border: 0.16em solid rgba(255, 255, 255, 0);\n  border-radius: 2em;\n  box-sizing: border-box;\n  text-decoration: none;\n  font-family: inherit;\n  font-size: 1rem;\n  font-weight: 300;\n  color: #000000;\n  text-shadow: 0 0.04em 0.04em rgb(126, 255, 87);\n  text-align: center;\n  transition: all 0.2s;\n  cursor: pointer;\n  background-color: #a3ffa0;\n  transition: background-color 0.5s ease-in;\n}\n.btn:hover,\n.btn:focus {\n  background-color: #10ff08a8;\n}\n\n@media all and (max-width: 30em) {\n  .btn {\n    display: block;\n    margin: 0.2em auto;\n  }\n}\n\n.ships-container {\n  display: flex;\n}\n\n.ship > div {\n  width: 4.6vmin;\n  height: 4.6vmin;\n}\n\n.ship {\n  display: flex;\n  flex-wrap: wrap;\n  margin: 1vmin;\n  border-radius: 2.3vmin;\n}\n\n.destroyer-container {\n  width: calc(4.6vmin * 2);\n  height: calc(4.6vmin * 1);\n}\n.destroyer-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 2);\n}\n\n.submarine-container,\n.cruiser-container {\n  width: calc(4.6vmin * 3);\n  height: calc(4.6vmin * 1);\n}\n\n.submarine-container-vertical,\n.cruiser-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 3);\n}\n\n.battleship-container {\n  width: calc(4.6vmin * 4);\n  height: calc(4.6vmin * 1);\n}\n\n.battleship-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 4);\n}\n\n.carrier-container {\n  width: calc(4.6vmin * 5);\n  height: calc(4.6vmin * 1);\n}\n\n.carrier-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 5);\n}\n\n.miss,\n.boom {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.boom::after {\n  background-color: var(--boom-color);\n}\n\n.miss::after {\n  background-color: var(--miss-color);\n}\n\n.boom::after,\n.miss::after {\n  content: \"\";\n  position: absolute;\n  border-radius: 100%;\n  width: 2vmin;\n  height: 2vmin;\n}\n\n.miss::before,\n.computer-board .boom::before {\n  content: \"\";\n  position: absolute;\n  animation: hit 0.5s ease-out forwards;\n  border-width: 1vmin;\n  border-style: solid;\n  border-radius: 100%;\n  width: 2vmin;\n  height: 2vmin;\n}\n\n.computer-board .boom::before {\n  border-color: var(--boom-color);\n}\n\n.miss::before {\n  border-color: var(--miss-color);\n}\n\n.player-board .boom {\n  animation: boom 0.5s ease-out forwards;\n}\n\n@keyframes hit {\n  0% {\n    opacity: 1;\n    transform: scale(0);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(4);\n  }\n}\n\n@keyframes boom {\n  0% {\n    background-color: var(--boom-color);\n  }\n\n  100% {\n    background-color: var(--ships-color);\n  }\n}\n\n.hidden {\n  display: none;\n}\n", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n:root {\n  /* --board-color: rgb(197, 196, 255); */\n  --board-color: rgb(169, 255, 255);\n  --grid-color: rgba(255, 255, 255, 0.5);\n  --ships-color: rgb(228, 228, 228);\n  --boom-color: rgb(255, 0, 0);\n  --miss-color: rgb(255, 255, 255);\n}\n\n* {\n  font-family: \"Press Start 2P\", cursive;\n}\n\n.title {\n  font-size: 2.5rem;\n}\n\n.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  width: 100%;\n  background-color: none;\n}\n\n.battleship-grid {\n  margin: 2vmin;\n  display: grid;\n  grid-template-rows: repeat(10, 4.6vmin);\n  grid-template-columns: repeat(10, 4.6vmin);\n  background-color: var(--board-color);\n}\n\n.battleship-grid div {\n  border: 1px solid var(--grid-color);\n}\n\n.computer-board {\n  cursor: pointer;\n}\n\n.taken,\n.ship {\n  background-color: var(--ships-color);\n  position: relative;\n}\n\n.taken.start.vertical,\n.taken.start.vertical::before {\n  border-top-left-radius: 50%;\n  border-top-right-radius: 50%;\n}\n\n.taken.end.vertical,\n.taken.end.vertical::before {\n  border-bottom-left-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.taken.start.horizontal,\n.taken.start.horizontal::before {\n  border-top-left-radius: 50%;\n  border-bottom-left-radius: 50%;\n}\n\n.taken.end.horizontal,\n.taken.end.horizontal::before {\n  border-top-right-radius: 50%;\n  border-bottom-right-radius: 50%;\n}\n\n.computer-board > .taken {\n  background-color: var(--board-color);\n  border-radius: 0% !important;\n}\n\n.taken.vertical::before,\n.taken.horizontal::before {\n  content: \"\";\n  position: absolute;\n  border: 0.3vmin solid white;\n  top: -1px;\n  bottom: -1px;\n  left: -1px;\n  right: -1px;\n}\n\n.taken.horizontal::before {\n  border-left: none;\n  border-right: none;\n  animation: ripplesY 3s linear infinite;\n}\n\n.taken.vertical::before {\n  border-top: none;\n  border-bottom: none;\n  animation: ripplesX 3s linear infinite;\n}\n\n@keyframes ripplesX {\n  0% {\n    opacity: 1;\n    transform: scaleX(1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scaleX(1.5);\n  }\n}\n\n@keyframes ripplesY {\n  0% {\n    opacity: 1;\n    transform: scaleY(1);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scaleY(1.5);\n  }\n}\n\n.turn-display {\n  font-size: 1.5rem;\n  font-weight: 900;\n  margin: 1rem 0;\n}\n\n.info-display {\n  display: flex;\n  align-items: center;\n  font-size: 1rem;\n  flex-direction: row;\n  max-width: 800px;\n  margin: 0.8rem 0;\n}\n\n.hidden-info {\n  align-items: center;\n  flex-direction: column;\n}\n\n.btn {\n  display: inline-block;\n  padding: 0.7em 1.2em;\n  margin: 0 0.1em 0.1em 0;\n  border: 0.16em solid rgba(255, 255, 255, 0);\n  border-radius: 2em;\n  box-sizing: border-box;\n  text-decoration: none;\n  font-family: inherit;\n  font-size: 1rem;\n  font-weight: 300;\n  color: #000000;\n  text-shadow: 0 0.04em 0.04em rgb(126, 255, 87);\n  text-align: center;\n  transition: all 0.2s;\n  cursor: pointer;\n  background-color: #a3ffa0;\n  transition: background-color 0.5s ease-in;\n}\n.btn:hover,\n.btn:focus {\n  background-color: #10ff08a8;\n}\n\n@media all and (max-width: 30em) {\n  .btn {\n    display: block;\n    margin: 0.2em auto;\n  }\n}\n\n.ships-container {\n  display: flex;\n}\n\n.ship > div {\n  width: 4.6vmin;\n  height: 4.6vmin;\n}\n\n.ship {\n  display: flex;\n  flex-wrap: wrap;\n  margin: 1vmin;\n  border-radius: 2.3vmin;\n}\n\n.destroyer-container {\n  width: calc(4.6vmin * 2);\n  height: calc(4.6vmin * 1);\n}\n.destroyer-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 2);\n}\n\n.submarine-container,\n.cruiser-container {\n  width: calc(4.6vmin * 3);\n  height: calc(4.6vmin * 1);\n}\n\n.submarine-container-vertical,\n.cruiser-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 3);\n}\n\n.battleship-container {\n  width: calc(4.6vmin * 4);\n  height: calc(4.6vmin * 1);\n}\n\n.battleship-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 4);\n}\n\n.carrier-container {\n  width: calc(4.6vmin * 5);\n  height: calc(4.6vmin * 1);\n}\n\n.carrier-container-vertical {\n  width: calc(4.6vmin * 1);\n  height: calc(4.6vmin * 5);\n}\n\n.miss,\n.boom {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.boom::after {\n  background-color: var(--boom-color);\n}\n\n.miss::after {\n  background-color: var(--miss-color);\n}\n\n.boom::after,\n.miss::after {\n  content: \"\";\n  position: absolute;\n  border-radius: 100%;\n  width: 2vmin;\n  height: 2vmin;\n}\n\n.miss::before,\n.computer-board .boom::before {\n  content: \"\";\n  position: absolute;\n  animation: hit 0.5s ease-out forwards;\n  border-width: 1vmin;\n  border-style: solid;\n  border-radius: 100%;\n  width: 2vmin;\n  height: 2vmin;\n}\n\n.computer-board .boom::before {\n  border-color: var(--boom-color);\n}\n\n.miss::before {\n  border-color: var(--miss-color);\n}\n\n.player-board .boom {\n  animation: boom 0.5s ease-out forwards;\n}\n\n@keyframes hit {\n  0% {\n    opacity: 1;\n    transform: scale(0);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(4);\n  }\n}\n\n@keyframes boom {\n  0% {\n    background-color: var(--boom-color);\n  }\n\n  100% {\n    background-color: var(--ships-color);\n  }\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxPQUFPLE1BQU0sWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxNQUFNLFlBQVksYUFBYSxPQUFPLE1BQU0sWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksYUFBYSxNQUFNLE1BQU0sWUFBWSxPQUFPLEtBQUssS0FBSyxVQUFVLFlBQVksTUFBTSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sWUFBWSxhQUFhLE9BQU8sTUFBTSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLE1BQU0sVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLFdBQVcs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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDVmE7O0FBRWI7QUFDQTtBQUNBLGNBQWMsS0FBd0MsR0FBRyxzQkFBaUIsR0FBRyxDQUFJOztBQUVqRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ1hhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRDtBQUNsRDs7QUFFQTtBQUNBLDBDQUEwQztBQUMxQzs7QUFFQTs7QUFFQTtBQUNBLGlGQUFpRjtBQUNqRjs7QUFFQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTs7QUFFQTtBQUNBLHlEQUF5RDtBQUN6RCxJQUFJOztBQUVKOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNyRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3N0eWxlLmNzcyc7XG5cbmNvbnN0IHVzZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXVzZXItYm9hcmRdJyk7XG5jb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtY29tcHV0ZXItYm9hcmRdJyk7XG5jb25zdCBkZXN0cm95ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1kZXN0cm95ZXItc2hpcF0nKTtcbmNvbnN0IHN1Ym1hcmluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXN1Ym1hcmluZS1zaGlwXScpO1xuY29uc3QgY3J1aXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNydWlzZXItc2hpcF0nKTtcbmNvbnN0IGJhdHRsZXNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYXR0bGVzaGlwLXNoaXBdJyk7XG5jb25zdCBjYXJyaWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtY2Fycmllci1zaGlwXScpO1xuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGFydC1idXR0b25dJyk7XG5jb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1yb3RhdGUtYnV0dG9uXScpO1xuY29uc3Qgc2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hpcCcpO1xuY29uc3Qgc2hpcHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaGlwcy1jb250YWluZXJdJyk7XG5jb25zdCBpbmZvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtaW5mby1jb250YWluZXJdJyk7XG5jb25zdCB0dXJuRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR1cm4tZGlzcGxheV0nKTtcblxuY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYnV0dG9uLWNvbnRhaW5lcl0nKTtcbmNvbnN0IHBsYXllclNxdWFyZXMgPSBbXTtcbmNvbnN0IGNvbXB1dGVyU3F1YXJlcyA9IFtdO1xuY29uc3Qgd2lkdGggPSAxMDtcbmxldCBpc0hvcml6b250YWwgPSB0cnVlO1xubGV0IGlzR2FtZU92ZXIgPSBmYWxzZTtcbmxldCBjdXJyZW50UGxheWVyID0gJ3VzZXInO1xubGV0IHNlbGVjdGVkU2hpcE5hbWVXaXRoSW5kZXg7XG5sZXQgZHJhZ2dlZFNoaXA7XG5sZXQgZHJhZ2dlZFNoaXBMZW5ndGg7XG5sZXQgcGxheWVyVG90YWw7XG5sZXQgY29tcHV0ZXJUb3RhbDtcbmxldCB3aW5uZXI7XG5sZXQgc3Vua1NoaXA7XG5cbi8vIENyZWF0ZSBib2FyZFxuZnVuY3Rpb24gZGlzcGxheUJvYXJkKGdyaWQsIHNxdWFyZXMpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aWR0aCAqIHdpZHRoOyBpICs9IDEpIHtcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzcXVhcmUuZGF0YXNldC5pZCA9IGk7XG4gICAgZ3JpZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgIHNxdWFyZXMucHVzaChzcXVhcmUpO1xuICB9XG59XG5cbmNvbnN0IGNyZWF0ZVNoaXBzID0gKCkgPT4gW1xuICB7XG4gICAgbmFtZTogJ2Rlc3Ryb3llcicsXG4gICAgZGlyZWN0aW9uczogW1xuICAgICAgWzAsIDFdLFxuICAgICAgWzAsIHdpZHRoXSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgbmFtZTogJ3N1Ym1hcmluZScsXG4gICAgZGlyZWN0aW9uczogW1xuICAgICAgWzAsIDEsIDJdLFxuICAgICAgWzAsIHdpZHRoLCB3aWR0aCAqIDJdLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnY3J1aXNlcicsXG4gICAgZGlyZWN0aW9uczogW1xuICAgICAgWzAsIDEsIDJdLFxuICAgICAgWzAsIHdpZHRoLCB3aWR0aCAqIDJdLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnYmF0dGxlc2hpcCcsXG4gICAgZGlyZWN0aW9uczogW1xuICAgICAgWzAsIDEsIDIsIDNdLFxuICAgICAgWzAsIHdpZHRoLCB3aWR0aCAqIDIsIHdpZHRoICogM10sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdjYXJyaWVyJyxcbiAgICBkaXJlY3Rpb25zOiBbXG4gICAgICBbMCwgMSwgMiwgMywgNF0sXG4gICAgICBbMCwgd2lkdGgsIHdpZHRoICogMiwgd2lkdGggKiAzLCB3aWR0aCAqIDRdLFxuICAgIF0sXG4gIH0sXG5dO1xuXG5mdW5jdGlvbiBkaXNwbGF5U2hpcHNSYW5kb20oc2hpcCkge1xuICBsZXQgcmFuZG9tU3RhcnQ7XG4gIGNvbnN0IHJhbmRvbURpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpOyAvLyAwIG9yIDFcbiAgY29uc3QgY3VycmVudCA9IHNoaXAuZGlyZWN0aW9uc1tyYW5kb21EaXJlY3Rpb25dO1xuICBpZiAocmFuZG9tRGlyZWN0aW9uID09PSAwKSB7XG4gICAgcmFuZG9tU3RhcnQgPSBNYXRoLmFicyhcbiAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiBjb21wdXRlclNxdWFyZXMubGVuZ3RoIC0gc2hpcC5kaXJlY3Rpb25zWzBdLmxlbmd0aCAqIDEsXG4gICAgICApLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmFuZG9tU3RhcnQgPSBNYXRoLmFicyhcbiAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgIE1hdGgucmFuZG9tKCkgKiBjb21wdXRlclNxdWFyZXMubGVuZ3RoIC0gc2hpcC5kaXJlY3Rpb25zWzBdLmxlbmd0aCAqIDEwLFxuICAgICAgKSxcbiAgICApO1xuICB9XG4gIGNvbnN0IGlzVGFrZW4gPSBjdXJyZW50LnNvbWUoKGluZGV4KSA9PiBjb21wdXRlclNxdWFyZXNbcmFuZG9tU3RhcnQgKyBpbmRleF0uY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWtlbicpKTtcbiAgY29uc3QgaXNBdFJpZ2h0RWRnZSA9IGN1cnJlbnQuc29tZShcbiAgICAoaW5kZXgpID0+IChyYW5kb21TdGFydCArIGluZGV4KSAlIHdpZHRoID09PSB3aWR0aCAtIDEsXG4gICk7XG4gIGNvbnN0IGlzQXRMZWZ0RWRnZSA9IGN1cnJlbnQuc29tZShcbiAgICAoaW5kZXgpID0+IChyYW5kb21TdGFydCArIGluZGV4KSAlIHdpZHRoID09PSAwLFxuICApO1xuXG4gIGlmICghaXNUYWtlbiAmJiAhaXNBdFJpZ2h0RWRnZSAmJiAhaXNBdExlZnRFZGdlKSB7XG4gICAgY3VycmVudC5mb3JFYWNoKChpbmRleCkgPT4gY29tcHV0ZXJTcXVhcmVzW3JhbmRvbVN0YXJ0ICsgaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3Rha2VuJywgc2hpcC5uYW1lKSk7XG4gIH0gZWxzZSBkaXNwbGF5U2hpcHNSYW5kb20oc2hpcCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlDb21wdXRlclNoaXBzKGJhdHRsZVNoaXBzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSArPSAxKSB7XG4gICAgZGlzcGxheVNoaXBzUmFuZG9tKGJhdHRsZVNoaXBzW2ldKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByb3RhdGVTaGlwcygpIHtcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xuICAgIGRlc3Ryb3llci5jbGFzc0xpc3QudG9nZ2xlKCdkZXN0cm95ZXItY29udGFpbmVyLXZlcnRpY2FsJyk7XG4gICAgc3VibWFyaW5lLmNsYXNzTGlzdC50b2dnbGUoJ3N1Ym1hcmluZS1jb250YWluZXItdmVydGljYWwnKTtcbiAgICBjcnVpc2VyLmNsYXNzTGlzdC50b2dnbGUoJ2NydWlzZXItY29udGFpbmVyLXZlcnRpY2FsJyk7XG4gICAgYmF0dGxlc2hpcC5jbGFzc0xpc3QudG9nZ2xlKCdiYXR0bGVzaGlwLWNvbnRhaW5lci12ZXJ0aWNhbCcpO1xuICAgIGNhcnJpZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY2Fycmllci1jb250YWluZXItdmVydGljYWwnKTtcbiAgICBpc0hvcml6b250YWwgPSAhaXNIb3Jpem9udGFsO1xuICB9IGVsc2UgaWYgKCFpc0hvcml6b250YWwpIHtcbiAgICBkZXN0cm95ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZGVzdHJveWVyLWNvbnRhaW5lci12ZXJ0aWNhbCcpO1xuICAgIHN1Ym1hcmluZS5jbGFzc0xpc3QudG9nZ2xlKCdzdWJtYXJpbmUtY29udGFpbmVyLXZlcnRpY2FsJyk7XG4gICAgY3J1aXNlci5jbGFzc0xpc3QudG9nZ2xlKCdjcnVpc2VyLWNvbnRhaW5lci12ZXJ0aWNhbCcpO1xuICAgIGJhdHRsZXNoaXAuY2xhc3NMaXN0LnRvZ2dsZSgnYmF0dGxlc2hpcC1jb250YWluZXItdmVydGljYWwnKTtcbiAgICBjYXJyaWVyLmNsYXNzTGlzdC50b2dnbGUoJ2NhcnJpZXItY29udGFpbmVyLXZlcnRpY2FsJyk7XG4gICAgaXNIb3Jpem9udGFsID0gIWlzSG9yaXpvbnRhbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmFnRHJvcCgpIHtcbiAgLy8gR2V0IGlkIG9mIHRoZSBsYXN0IGNoaWxkIG9mIGAke25hbWVPZlNoaXB9LWNvbnRhaW5lcmBcbiAgY29uc3Qgc2hpcE5hbWVXaXRoTGFzdElkID0gZHJhZ2dlZFNoaXAubGFzdEVsZW1lbnRDaGlsZC5pZDtcbiAgLy8gUmVtb3ZlIHRoZSBsYXN0IDIgbGV0dGVycyBvZiB0aGUgc3RyaW5nXG4gIGNvbnN0IHNoaXBDbGFzcyA9IHNoaXBOYW1lV2l0aExhc3RJZC5zbGljZSgwLCAtMik7XG4gIC8vIEdldCB0aGUgbGFzdCBsZXR0ZXIgb2YgdGhlIHN0cmluZyBhbmQgY29udmVydCB0byBhbiBJbnRlZ2VyXG4gIGNvbnN0IGxhc3RTaGlwSW5kZXggPSBwYXJzZUludChzaGlwTmFtZVdpdGhMYXN0SWQuc3Vic3RyKC0xKSwgMTApO1xuICAvLyBMYXN0IHNoaXAgaW5kZXggLSBkYXRhc2V0IG9mIHRoZSBkaXYgaW4gd2hpY2ggdGhlIGRpdiB3YXMgcGxhY2VkXG4gIGxldCBzaGlwTGFzdElkID0gbGFzdFNoaXBJbmRleCArIHBhcnNlSW50KHRoaXMuZGF0YXNldC5pZCwgMTApO1xuICBjb25zdCBub3RBbGxvd2VkSG9yaXpvbnRhbCA9IFtcbiAgICAwLCAxMCwgMjAsIDMwLCA0MCwgNTAsIDYwLCA3MCwgODAsIDkwLCAxLCAxMSwgMjEsIDMxLCA0MSwgNTEsIDYxLCA3MSwgODEsXG4gICAgOTEsIDIsIDIyLCAzMiwgNDIsIDUyLCA2MiwgNzIsIDgyLCA5MiwgMywgMTMsIDIzLCAzMywgNDMsIDUzLCA2MywgNzMsIDgzLFxuICAgIDkzLFxuICBdO1xuICBjb25zdCBub3RBbGxvd2VkVmVydGljYWwgPSBbXG4gICAgOTksIDk4LCA5NywgOTYsIDk1LCA5NCwgOTMsIDkyLCA5MSwgOTAsIDg5LCA4OCwgODcsIDg2LCA4NSwgODQsIDgzLCA4MiwgODEsXG4gICAgODAsIDc5LCA3OCwgNzcsIDc2LCA3NSwgNzQsIDczLCA3MiwgNzEsIDcwLCA2OSwgNjgsIDY3LCA2NiwgNjUsIDY0LCA2MywgNjIsXG4gICAgNjEsIDYwLFxuICBdO1xuICAvLyBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgZmlyc3QgeCBhbW91bnQgb2YgaXRlbXMgKHggPSAwLCAxMCAqIGxhc3RTaGlwSW5kZXgpXG4gIGNvbnN0IG5ld05vdEFsbG93ZWRIb3Jpem9udGFsID0gbm90QWxsb3dlZEhvcml6b250YWwuc3BsaWNlKFxuICAgIDAsXG4gICAgMTAgKiBsYXN0U2hpcEluZGV4LFxuICApO1xuICBjb25zdCBuZXdOb3RBbGxvd2VkVmVydGljYWwgPSBub3RBbGxvd2VkVmVydGljYWwuc3BsaWNlKFxuICAgIDAsXG4gICAgMTAgKiBsYXN0U2hpcEluZGV4LFxuICApO1xuICAvLyBHZXQgaWQgb2YgdGhlIGNoaWxkIG9mIHRoZSBzaGlwLWNvbnRhaW5lciB0aGF0IHdhcyBcIm1vdXNlZG93blwiIHRoZW4gZ2V0IGxhc3QgY2hhclxuICBjb25zdCBzZWxlY3RlZFNoaXBJbmRleCA9IHBhcnNlSW50KHNlbGVjdGVkU2hpcE5hbWVXaXRoSW5kZXguc3Vic3RyKC0xKSwgMTApO1xuICBzaGlwTGFzdElkIC09IHNlbGVjdGVkU2hpcEluZGV4O1xuXG4gIGNvbnN0IHNoaXBIb3Jpem9udGFsID0gW107XG4gIGNvbnN0IHNoaXBWZXJ0aWNhbCA9IFtdO1xuICBsZXQgaXNEaXZUYWtlbjtcblxuICBjb25zdCBjaGVja0FycmF5ID0gKGFycmF5KSA9PiB7XG4gICAgaWYgKGFycmF5LmluY2x1ZGVzKHRydWUpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHJhZ2dlZFNoaXBMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgaXNUYWtlbiA9IHBsYXllclNxdWFyZXNbXG4gICAgICAgIHBhcnNlSW50KHRoaXMuZGF0YXNldC5pZCwgMTApIC0gc2VsZWN0ZWRTaGlwSW5kZXggKyBpXG4gICAgICBdLmNsYXNzTGlzdC5jb250YWlucygndGFrZW4nKTtcbiAgICAgIHNoaXBIb3Jpem9udGFsLnB1c2goaXNUYWtlbik7XG4gICAgICBpc0RpdlRha2VuID0gY2hlY2tBcnJheShzaGlwSG9yaXpvbnRhbCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCFpc0hvcml6b250YWwpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRyYWdnZWRTaGlwTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGlzVGFrZW4gPSBwbGF5ZXJTcXVhcmVzW1xuICAgICAgICBwYXJzZUludCh0aGlzLmRhdGFzZXQuaWQsIDEwKSAtIHNlbGVjdGVkU2hpcEluZGV4ICsgd2lkdGggKiBpXG4gICAgICBdLmNsYXNzTGlzdC5jb250YWlucygndGFrZW4nKTtcbiAgICAgIHNoaXBWZXJ0aWNhbC5wdXNoKGlzVGFrZW4pO1xuICAgICAgaXNEaXZUYWtlbiA9IGNoZWNrQXJyYXkoc2hpcFZlcnRpY2FsKTtcbiAgICB9XG4gIH1cblxuICBpZiAoXG4gICAgIWlzRGl2VGFrZW5cbiAgICAmJiBpc0hvcml6b250YWxcbiAgICAmJiAhbmV3Tm90QWxsb3dlZEhvcml6b250YWwuaW5jbHVkZXMoc2hpcExhc3RJZClcbiAgKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkcmFnZ2VkU2hpcExlbmd0aDsgaSArPSAxKSB7XG4gICAgICBsZXQgZGlyZWN0aW9uQ2xhc3M7XG4gICAgICBpZiAoaSA9PT0gMCkgZGlyZWN0aW9uQ2xhc3MgPSAnc3RhcnQnO1xuICAgICAgaWYgKGkgIT09IDAgJiYgaSAhPT0gZHJhZ2dlZFNoaXBMZW5ndGggLSAxKSBkaXJlY3Rpb25DbGFzcyA9ICdtaWRkbGUnO1xuICAgICAgaWYgKGkgPT09IGRyYWdnZWRTaGlwTGVuZ3RoIC0gMSkgZGlyZWN0aW9uQ2xhc3MgPSAnZW5kJztcbiAgICAgIHBsYXllclNxdWFyZXNbXG4gICAgICAgIHBhcnNlSW50KHRoaXMuZGF0YXNldC5pZCwgMTApIC0gc2VsZWN0ZWRTaGlwSW5kZXggKyBpXG4gICAgICBdLmNsYXNzTGlzdC5hZGQoJ3Rha2VuJywgJ2hvcml6b250YWwnLCBkaXJlY3Rpb25DbGFzcywgc2hpcENsYXNzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgIWlzRGl2VGFrZW5cbiAgICAmJiAhaXNIb3Jpem9udGFsXG4gICAgJiYgIW5ld05vdEFsbG93ZWRWZXJ0aWNhbC5pbmNsdWRlcyhzaGlwTGFzdElkKVxuICApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRyYWdnZWRTaGlwTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGxldCBkaXJlY3Rpb25DbGFzcztcbiAgICAgIGlmIChpID09PSAwKSBkaXJlY3Rpb25DbGFzcyA9ICdzdGFydCc7XG4gICAgICBpZiAoaSAhPT0gMCAmJiBpICE9PSBkcmFnZ2VkU2hpcExlbmd0aCAtIDEpIGRpcmVjdGlvbkNsYXNzID0gJ21pZGRsZSc7XG4gICAgICBpZiAoaSA9PT0gZHJhZ2dlZFNoaXBMZW5ndGggLSAxKSBkaXJlY3Rpb25DbGFzcyA9ICdlbmQnO1xuICAgICAgcGxheWVyU3F1YXJlc1tcbiAgICAgICAgcGFyc2VJbnQodGhpcy5kYXRhc2V0LmlkLCAxMCkgLSBzZWxlY3RlZFNoaXBJbmRleCArIHdpZHRoICogaVxuICAgICAgXS5jbGFzc0xpc3QuYWRkKCd0YWtlbicsICd2ZXJ0aWNhbCcsIHNoaXBDbGFzcywgZGlyZWN0aW9uQ2xhc3MpO1xuICAgIH1cbiAgfSBlbHNlIHJldHVybjtcblxuICBzaGlwc0NvbnRhaW5lci5yZW1vdmVDaGlsZChkcmFnZ2VkU2hpcCk7XG59XG5cbmZ1bmN0aW9uIGRyYWdTdGFydCgpIHtcbiAgZHJhZ2dlZFNoaXAgPSB0aGlzO1xuICBkcmFnZ2VkU2hpcExlbmd0aCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBwcmV2ZW50RXZlbnREZWZhdWx0KGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBkcmFnU2hpcHMoKSB7XG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZHJhZ1N0YXJ0KSk7XG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICBzZWxlY3RlZFNoaXBOYW1lV2l0aEluZGV4ID0gZS50YXJnZXQuaWQ7XG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gZHJhZ1NxdWFyZXMoKSB7XG4gIHBsYXllclNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZHJhZ1N0YXJ0KSk7XG4gIHBsYXllclNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBwcmV2ZW50RXZlbnREZWZhdWx0KSk7XG4gIHBsYXllclNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgcHJldmVudEV2ZW50RGVmYXVsdCkpO1xuICBwbGF5ZXJTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4gc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBkcmFnRHJvcCkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbGVydChtZXNzYWdlKSB7XG4gIGNvbnN0IGluZm9EaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGluZm9Db250YWluZXIuYXBwZW5kQ2hpbGQoaW5mb0Rpc3BsYXkpO1xuICBpbmZvRGlzcGxheS5jbGFzc05hbWUgPSAnaW5mby1kaXNwbGF5JztcbiAgaW5mb0Rpc3BsYXkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobWVzc2FnZSkpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGluZm9EaXNwbGF5LnJlbW92ZSgpO1xuICB9LCAyMDAwKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUFsZXJ0KGV2ZW50QWxlcnQpIHtcbiAgbGV0IGFsZXJ0RGlzcGxheTtcblxuICBpZiAoZXZlbnRBbGVydCA9PT0gJ2FsZXJ0LXN0YXJ0LWVycm9yJykge1xuICAgIGFsZXJ0RGlzcGxheSA9ICdDYW5ub3Qgc3RhcnQgdGhlIGdhbWUgd2l0aG91dCBwbGFjaW5nIGFsbCBzaGlwcy4nO1xuICAgIGNyZWF0ZUFsZXJ0KGFsZXJ0RGlzcGxheSk7XG4gIH0gZWxzZSBpZiAoZXZlbnRBbGVydCA9PT0gJ2FsZXJ0LXBsYXllci1zdW5rJykge1xuICAgIGFsZXJ0RGlzcGxheSA9IGBZb3Ugc3VuayBhICR7c3Vua1NoaXB9IWA7XG4gICAgY3JlYXRlQWxlcnQoYWxlcnREaXNwbGF5KTtcbiAgfSBlbHNlIGlmIChldmVudEFsZXJ0ID09PSAnYWxlcnQtY29tcHV0ZXItc3VuaycpIHtcbiAgICBhbGVydERpc3BsYXkgPSBgQ29tcHV0ZXIgc3VuayBhICR7c3Vua1NoaXB9IWA7XG4gICAgY3JlYXRlQWxlcnQoYWxlcnREaXNwbGF5KTtcbiAgfSBlbHNlIGlmIChldmVudEFsZXJ0ID09PSAnYWxlcnQtcGxheWVyLWhpdCcpIHtcbiAgICBhbGVydERpc3BsYXkgPSAnWW91IGhpdCBhIHNoaXAhJztcbiAgICBjcmVhdGVBbGVydChhbGVydERpc3BsYXkpO1xuICB9IGVsc2UgaWYgKGV2ZW50QWxlcnQgPT09ICdhbGVydC1jb21wdXRlci1oaXQnKSB7XG4gICAgYWxlcnREaXNwbGF5ID0gJ1RoZSBjb21wdXRlciBoaXQgYSBzaGlwISc7XG4gICAgY3JlYXRlQWxlcnQoYWxlcnREaXNwbGF5KTtcbiAgfSBlbHNlIGlmIChldmVudEFsZXJ0ID09PSAnYWxlcnQtd2lubmVyJykge1xuICAgIGFsZXJ0RGlzcGxheSA9IGAke3dpbm5lcn0gd2lucyFgO1xuICAgIGNyZWF0ZUFsZXJ0KGFsZXJ0RGlzcGxheSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU2hpcHNUYWxseSgpIHtcbiAgcmV0dXJuIHtcbiAgICBkZXN0cm95ZXI6IDAsXG4gICAgc3VibWFyaW5lOiAwLFxuICAgIGNydWlzZXI6IDAsXG4gICAgYmF0dGxlc2hpcDogMCxcbiAgICBjYXJyaWVyOiAwLFxuICB9O1xufVxuXG5jb25zdCBwbGF5ZXJTY29yZSA9IGNyZWF0ZVNoaXBzVGFsbHkoKTtcbmNvbnN0IGNvbXB1dGVyU2NvcmUgPSBjcmVhdGVTaGlwc1RhbGx5KCk7XG5cbmZ1bmN0aW9uIGNoYW5nZVR1cm4oKSB7XG4gIGlmIChjdXJyZW50UGxheWVyID09PSAnY29tcHV0ZXInKSB7XG4gICAgY3VycmVudFBsYXllciA9ICd1c2VyJztcbiAgfSBlbHNlIGlmIChjdXJyZW50UGxheWVyID09PSAndXNlcicpIHtcbiAgICBjdXJyZW50UGxheWVyID0gJ2NvbXB1dGVyJztcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0NvbXB1dGVyU2hpcHMoKSB7XG4gIGlmIChjb21wdXRlclNjb3JlLmRlc3Ryb3llciA9PT0gMikge1xuICAgIHN1bmtTaGlwID0gJ0Rlc3Ryb3llcic7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC1jb21wdXRlci1zdW5rJyk7XG4gICAgY29tcHV0ZXJTY29yZS5kZXN0cm95ZXIgPSAxMDtcbiAgfVxuICBpZiAoY29tcHV0ZXJTY29yZS5zdWJtYXJpbmUgPT09IDMpIHtcbiAgICBzdW5rU2hpcCA9ICdTdWJtYXJpbmUnO1xuICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtY29tcHV0ZXItc3VuaycpO1xuICAgIGNvbXB1dGVyU2NvcmUuc3VibWFyaW5lID0gMTA7XG4gIH1cbiAgaWYgKGNvbXB1dGVyU2NvcmUuY3J1aXNlciA9PT0gMykge1xuICAgIHN1bmtTaGlwID0gJ0NydWlzZXInO1xuICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtY29tcHV0ZXItc3VuaycpO1xuICAgIGNvbXB1dGVyU2NvcmUuY3J1aXNlciA9IDEwO1xuICB9XG4gIGlmIChjb21wdXRlclNjb3JlLmJhdHRsZXNoaXAgPT09IDQpIHtcbiAgICBzdW5rU2hpcCA9ICdCYXR0bGVzaGlwJztcbiAgICBkaXNwbGF5QWxlcnQoJ2FsZXJ0LWNvbXB1dGVyLXN1bmsnKTtcbiAgICBjb21wdXRlclNjb3JlLmJhdHRsZXNoaXAgPSAxMDtcbiAgfVxuICBpZiAoY29tcHV0ZXJTY29yZS5jYXJyaWVyID09PSA1KSB7XG4gICAgc3Vua1NoaXAgPSAnQ2Fycmllcic7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC1jb21wdXRlci1zdW5rJyk7XG4gICAgY29tcHV0ZXJTY29yZS5jYXJyaWVyID0gMTA7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tQbGF5ZXJTaGlwcygpIHtcbiAgaWYgKHBsYXllclNjb3JlLmRlc3Ryb3llciA9PT0gMikge1xuICAgIHN1bmtTaGlwID0gJ0Rlc3Ryb3llcic7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC1wbGF5ZXItc3VuaycpO1xuICAgIHBsYXllclNjb3JlLmRlc3Ryb3llciA9IDEwO1xuICB9XG4gIGlmIChwbGF5ZXJTY29yZS5zdWJtYXJpbmUgPT09IDMpIHtcbiAgICBzdW5rU2hpcCA9ICdTdWJtYXJpbmUnO1xuICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtcGxheWVyLXN1bmsnKTtcbiAgICBwbGF5ZXJTY29yZS5zdWJtYXJpbmUgPSAxMDtcbiAgfVxuICBpZiAocGxheWVyU2NvcmUuY3J1aXNlciA9PT0gMykge1xuICAgIHN1bmtTaGlwID0gJ0NydWlzZXInO1xuICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtcGxheWVyLXN1bmsnKTtcbiAgICBwbGF5ZXJTY29yZS5jcnVpc2VyID0gMTA7XG4gIH1cbiAgaWYgKHBsYXllclNjb3JlLmJhdHRsZXNoaXAgPT09IDQpIHtcbiAgICBzdW5rU2hpcCA9ICdCYXR0bGVzaGlwJztcbiAgICBkaXNwbGF5QWxlcnQoJ2FsZXJ0LXBsYXllci1zdW5rJyk7XG4gICAgcGxheWVyU2NvcmUuYmF0dGxlc2hpcCA9IDEwO1xuICB9XG4gIGlmIChwbGF5ZXJTY29yZS5jYXJyaWVyID09PSA1KSB7XG4gICAgc3Vua1NoaXAgPSAnQ2Fycmllcic7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC1wbGF5ZXItc3VuaycpO1xuICAgIHBsYXllclNjb3JlLmNhcnJpZXIgPSAxMDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1NoaXBzKCkge1xuICBjaGVja1BsYXllclNoaXBzKCk7XG4gIGNoZWNrQ29tcHV0ZXJTaGlwcygpO1xuICBwbGF5ZXJUb3RhbCA9IE9iamVjdC52YWx1ZXMocGxheWVyU2NvcmUpLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB0b3RhbCArIHZhbHVlLCAwKTtcbiAgY29tcHV0ZXJUb3RhbCA9IE9iamVjdC52YWx1ZXMoY29tcHV0ZXJTY29yZSkucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApO1xuICBjb25zb2xlLmxvZyhjb21wdXRlclRvdGFsKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tIaXQoc3F1YXJlKSB7XG4gIGlmIChzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdib29tJykpIHtcbiAgICBpZiAoc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnZGVzdHJveWVyJykpIHBsYXllclNjb3JlLmRlc3Ryb3llciArPSAxO1xuICAgIGlmIChzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWJtYXJpbmUnKSkgcGxheWVyU2NvcmUuc3VibWFyaW5lICs9IDE7XG4gICAgaWYgKHNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2NydWlzZXInKSkgcGxheWVyU2NvcmUuY3J1aXNlciArPSAxO1xuICAgIGlmIChzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdiYXR0bGVzaGlwJykpIHBsYXllclNjb3JlLmJhdHRsZXNoaXAgKz0gMTtcbiAgICBpZiAoc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnY2FycmllcicpKSBwbGF5ZXJTY29yZS5jYXJyaWVyICs9IDE7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC1wbGF5ZXItaGl0Jyk7XG4gICAgY2hlY2tTaGlwcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVyR28oKSB7XG4gIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllclNxdWFyZXMubGVuZ3RoKTtcbiAgY29uc3QgaGl0ID0gcGxheWVyU3F1YXJlc1tyYW5kb21dLmNsYXNzTGlzdC5jb250YWlucygndGFrZW4nKTtcbiAgcGxheWVyU3F1YXJlc1tyYW5kb21dLmNsYXNzTGlzdC5hZGQoaGl0ID8gJ2Jvb20nIDogJ21pc3MnKTtcbiAgaWYgKCFwbGF5ZXJTcXVhcmVzW3JhbmRvbV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdib29tJykgfHwgIXBsYXllclNxdWFyZXNbcmFuZG9tXS5jbGFzc0xpc3QuY29udGFpbnMoJ21pc3MnKSkge1xuICAgIGlmIChwbGF5ZXJTcXVhcmVzW3JhbmRvbV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXN0cm95ZXInKSkge1xuICAgICAgY29tcHV0ZXJTY29yZS5kZXN0cm95ZXIgKz0gMTtcbiAgICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtY29tcHV0ZXItaGl0Jyk7XG4gICAgfVxuICAgIGlmIChwbGF5ZXJTcXVhcmVzW3JhbmRvbV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWJtYXJpbmUnKSkge1xuICAgICAgY29tcHV0ZXJTY29yZS5zdWJtYXJpbmUgKz0gMTtcbiAgICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtY29tcHV0ZXItaGl0Jyk7XG4gICAgfVxuICAgIGlmIChwbGF5ZXJTcXVhcmVzW3JhbmRvbV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdjcnVpc2VyJykpIHtcbiAgICAgIGNvbXB1dGVyU2NvcmUuY3J1aXNlciArPSAxO1xuICAgICAgZGlzcGxheUFsZXJ0KCdhbGVydC1jb21wdXRlci1oaXQnKTtcbiAgICB9XG4gICAgaWYgKHBsYXllclNxdWFyZXNbcmFuZG9tXS5jbGFzc0xpc3QuY29udGFpbnMoJ2JhdHRsZXNoaXAnKSkge1xuICAgICAgY29tcHV0ZXJTY29yZS5iYXR0bGVzaGlwICs9IDE7XG4gICAgICBkaXNwbGF5QWxlcnQoJ2FsZXJ0LWNvbXB1dGVyLWhpdCcpO1xuICAgIH1cbiAgICBpZiAocGxheWVyU3F1YXJlc1tyYW5kb21dLmNsYXNzTGlzdC5jb250YWlucygnY2FycmllcicpKSB7XG4gICAgICBjb21wdXRlclNjb3JlLmNhcnJpZXIgKz0gMTtcbiAgICAgIGRpc3BsYXlBbGVydCgnYWxlcnQtY29tcHV0ZXItaGl0Jyk7XG4gICAgfVxuICB9IGVsc2UgY29tcHV0ZXJHbygpO1xuICBjaGVja1NoaXBzKCk7XG4gIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9ICdZb3VyIHR1cm4nO1xufVxuXG5mdW5jdGlvbiBwbGF5VHVybigpIHtcbiAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09ICd1c2VyJykge1xuICAgIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9ICdZb3VyIFR1cm4nO1xuICB9IGVsc2UgaWYgKGN1cnJlbnRQbGF5ZXIgPT09ICdjb21wdXRlcicpIHtcbiAgICB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSAnQ29tcHV0ZXJcXCdzIFR1cm4nO1xuICAgIHNldFRpbWVvdXQoY29tcHV0ZXJHbywgMTUwMCk7XG4gICAgY2hhbmdlVHVybigpO1xuICAgIGNoZWNrRm9yV2lucygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrQWNjdXJhY3koc3F1YXJlKSB7XG4gIGlmICghc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYm9vbScpICYmICFzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaXNzJykpIHtcbiAgICBpZiAoc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygndGFrZW4nKSkge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2Jvb20nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcbiAgICB9XG4gICAgY2hlY2tIaXQoc3F1YXJlKTtcbiAgICBjaGFuZ2VUdXJuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmV2ZWFsU3F1YXJlKHNxdWFyZSkge1xuICBpZiAoaXNHYW1lT3ZlcikgcmV0dXJuO1xuICBpZiAoY3VycmVudFBsYXllciA9PT0gJ3VzZXInKSB7XG4gICAgY2hlY2tBY2N1cmFjeShzcXVhcmUpO1xuICAgIHBsYXlUdXJuKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGxheUdhbWUoKSB7XG4gIGlmIChzaGlwc0NvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICBjb21wdXRlclNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICByZXZlYWxTcXVhcmUoc3F1YXJlKTtcbiAgICB9KSk7XG4gICAgYnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgcGxheVR1cm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5QWxlcnQoJ2FsZXJ0LXN0YXJ0LWVycm9yJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gIGlzR2FtZU92ZXIgPSB0cnVlO1xuICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYXlHYW1lKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JXaW5zKCkge1xuICBpZiAocGxheWVyVG90YWwgPT09IDUwKSB7XG4gICAgLy8gaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gJ1BsYXllciBPbmUgV2lucyEnO1xuICAgIHdpbm5lciA9ICdQbGF5ZXIgT25lJztcbiAgICBkaXNwbGF5QWxlcnQoJ2FsZXJ0LXdpbm5lcicpO1xuICAgIGdhbWVPdmVyKCk7XG4gIH0gZWxzZSBpZiAoY29tcHV0ZXJUb3RhbCA9PT0gNTApIHtcbiAgICAvLyBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSAnQ29tcHV0ZXIgV2lucyEnO1xuICAgIHdpbm5lciA9ICdDb21wdXRlcic7XG4gICAgZGlzcGxheUFsZXJ0KCdhbGVydC13aW5uZXInKTtcbiAgICBnYW1lT3ZlcigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkdhbWUoKSB7XG4gIGRpc3BsYXlCb2FyZCh1c2VyQm9hcmQsIHBsYXllclNxdWFyZXMpO1xuICBkaXNwbGF5Qm9hcmQoY29tcHV0ZXJCb2FyZCwgY29tcHV0ZXJTcXVhcmVzKTtcbiAgY29uc3QgYmF0dGxlU2hpcHMgPSBjcmVhdGVTaGlwcygpO1xuICBkaXNwbGF5Q29tcHV0ZXJTaGlwcyhiYXR0bGVTaGlwcyk7XG4gIHJvdGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJvdGF0ZVNoaXBzKTtcbiAgZHJhZ1NoaXBzKCk7XG4gIGRyYWdTcXVhcmVzKCk7XG4gIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxheUdhbWUpO1xufVxuXG5ydW5HYW1lKCk7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbjpyb290IHtcXG4gIC8qIC0tYm9hcmQtY29sb3I6IHJnYigxOTcsIDE5NiwgMjU1KTsgKi9cXG4gIC0tYm9hcmQtY29sb3I6IHJnYigxNjksIDI1NSwgMjU1KTtcXG4gIC0tZ3JpZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xcbiAgLS1zaGlwcy1jb2xvcjogcmdiKDIyOCwgMjI4LCAyMjgpO1xcbiAgLS1ib29tLWNvbG9yOiByZ2IoMjU1LCAwLCAwKTtcXG4gIC0tbWlzcy1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpO1xcbn1cXG5cXG4qIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiUHJlc3MgU3RhcnQgMlBcXFwiLCBjdXJzaXZlO1xcbn1cXG5cXG4udGl0bGUge1xcbiAgZm9udC1zaXplOiAyLjVyZW07XFxufVxcblxcbi5jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbm9uZTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtZ3JpZCB7XFxuICBtYXJnaW46IDJ2bWluO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCA0LjZ2bWluKTtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCA0LjZ2bWluKTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvYXJkLWNvbG9yKTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtZ3JpZCBkaXYge1xcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZ3JpZC1jb2xvcik7XFxufVxcblxcbi5jb21wdXRlci1ib2FyZCB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi50YWtlbixcXG4uc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwcy1jb2xvcik7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi50YWtlbi5zdGFydC52ZXJ0aWNhbCxcXG4udGFrZW4uc3RhcnQudmVydGljYWw6OmJlZm9yZSB7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1MCU7XFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNTAlO1xcbn1cXG5cXG4udGFrZW4uZW5kLnZlcnRpY2FsLFxcbi50YWtlbi5lbmQudmVydGljYWw6OmJlZm9yZSB7XFxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA1MCU7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogNTAlO1xcbn1cXG5cXG4udGFrZW4uc3RhcnQuaG9yaXpvbnRhbCxcXG4udGFrZW4uc3RhcnQuaG9yaXpvbnRhbDo6YmVmb3JlIHtcXG4gIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDUwJTtcXG4gIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDUwJTtcXG59XFxuXFxuLnRha2VuLmVuZC5ob3Jpem9udGFsLFxcbi50YWtlbi5lbmQuaG9yaXpvbnRhbDo6YmVmb3JlIHtcXG4gIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiA1MCU7XFxuICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogNTAlO1xcbn1cXG5cXG4uY29tcHV0ZXItYm9hcmQgPiAudGFrZW4ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYm9hcmQtY29sb3IpO1xcbiAgYm9yZGVyLXJhZGl1czogMCUgIWltcG9ydGFudDtcXG59XFxuXFxuLnRha2VuLnZlcnRpY2FsOjpiZWZvcmUsXFxuLnRha2VuLmhvcml6b250YWw6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvcmRlcjogMC4zdm1pbiBzb2xpZCB3aGl0ZTtcXG4gIHRvcDogLTFweDtcXG4gIGJvdHRvbTogLTFweDtcXG4gIGxlZnQ6IC0xcHg7XFxuICByaWdodDogLTFweDtcXG59XFxuXFxuLnRha2VuLmhvcml6b250YWw6OmJlZm9yZSB7XFxuICBib3JkZXItbGVmdDogbm9uZTtcXG4gIGJvcmRlci1yaWdodDogbm9uZTtcXG4gIGFuaW1hdGlvbjogcmlwcGxlc1kgM3MgbGluZWFyIGluZmluaXRlO1xcbn1cXG5cXG4udGFrZW4udmVydGljYWw6OmJlZm9yZSB7XFxuICBib3JkZXItdG9wOiBub25lO1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG4gIGFuaW1hdGlvbjogcmlwcGxlc1ggM3MgbGluZWFyIGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHJpcHBsZXNYIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMSk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMS41KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyByaXBwbGVzWSB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEuNSk7XFxuICB9XFxufVxcblxcbi50dXJuLWRpc3BsYXkge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBmb250LXdlaWdodDogOTAwO1xcbiAgbWFyZ2luOiAxcmVtIDA7XFxufVxcblxcbi5pbmZvLWRpc3BsYXkge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIG1hcmdpbjogMC44cmVtIDA7XFxufVxcblxcbi5oaWRkZW4taW5mbyB7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLmJ0biB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwYWRkaW5nOiAwLjdlbSAxLjJlbTtcXG4gIG1hcmdpbjogMCAwLjFlbSAwLjFlbSAwO1xcbiAgYm9yZGVyOiAwLjE2ZW0gc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTtcXG4gIGJvcmRlci1yYWRpdXM6IDJlbTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxuICBjb2xvcjogIzAwMDAwMDtcXG4gIHRleHQtc2hhZG93OiAwIDAuMDRlbSAwLjA0ZW0gcmdiKDEyNiwgMjU1LCA4Nyk7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhM2ZmYTA7XFxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuNXMgZWFzZS1pbjtcXG59XFxuLmJ0bjpob3ZlcixcXG4uYnRuOmZvY3VzIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMGZmMDhhODtcXG59XFxuXFxuQG1lZGlhIGFsbCBhbmQgKG1heC13aWR0aDogMzBlbSkge1xcbiAgLmJ0biB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBtYXJnaW46IDAuMmVtIGF1dG87XFxuICB9XFxufVxcblxcbi5zaGlwcy1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLnNoaXAgPiBkaXYge1xcbiAgd2lkdGg6IDQuNnZtaW47XFxuICBoZWlnaHQ6IDQuNnZtaW47XFxufVxcblxcbi5zaGlwIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxuICBtYXJnaW46IDF2bWluO1xcbiAgYm9yZGVyLXJhZGl1czogMi4zdm1pbjtcXG59XFxuXFxuLmRlc3Ryb3llci1jb250YWluZXIge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDIpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiAxKTtcXG59XFxuLmRlc3Ryb3llci1jb250YWluZXItdmVydGljYWwge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDEpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiAyKTtcXG59XFxuXFxuLnN1Ym1hcmluZS1jb250YWluZXIsXFxuLmNydWlzZXItY29udGFpbmVyIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiAzKTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogMSk7XFxufVxcblxcbi5zdWJtYXJpbmUtY29udGFpbmVyLXZlcnRpY2FsLFxcbi5jcnVpc2VyLWNvbnRhaW5lci12ZXJ0aWNhbCB7XFxuICB3aWR0aDogY2FsYyg0LjZ2bWluICogMSk7XFxuICBoZWlnaHQ6IGNhbGMoNC42dm1pbiAqIDMpO1xcbn1cXG5cXG4uYmF0dGxlc2hpcC1jb250YWluZXIge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDQpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiAxKTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtY29udGFpbmVyLXZlcnRpY2FsIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiAxKTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogNCk7XFxufVxcblxcbi5jYXJyaWVyLWNvbnRhaW5lciB7XFxuICB3aWR0aDogY2FsYyg0LjZ2bWluICogNSk7XFxuICBoZWlnaHQ6IGNhbGMoNC42dm1pbiAqIDEpO1xcbn1cXG5cXG4uY2Fycmllci1jb250YWluZXItdmVydGljYWwge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDEpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiA1KTtcXG59XFxuXFxuLm1pc3MsXFxuLmJvb20ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLmJvb206OmFmdGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvb20tY29sb3IpO1xcbn1cXG5cXG4ubWlzczo6YWZ0ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWlzcy1jb2xvcik7XFxufVxcblxcbi5ib29tOjphZnRlcixcXG4ubWlzczo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xcbiAgd2lkdGg6IDJ2bWluO1xcbiAgaGVpZ2h0OiAydm1pbjtcXG59XFxuXFxuLm1pc3M6OmJlZm9yZSxcXG4uY29tcHV0ZXItYm9hcmQgLmJvb206OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGFuaW1hdGlvbjogaGl0IDAuNXMgZWFzZS1vdXQgZm9yd2FyZHM7XFxuICBib3JkZXItd2lkdGg6IDF2bWluO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XFxuICB3aWR0aDogMnZtaW47XFxuICBoZWlnaHQ6IDJ2bWluO1xcbn1cXG5cXG4uY29tcHV0ZXItYm9hcmQgLmJvb206OmJlZm9yZSB7XFxuICBib3JkZXItY29sb3I6IHZhcigtLWJvb20tY29sb3IpO1xcbn1cXG5cXG4ubWlzczo6YmVmb3JlIHtcXG4gIGJvcmRlci1jb2xvcjogdmFyKC0tbWlzcy1jb2xvcik7XFxufVxcblxcbi5wbGF5ZXItYm9hcmQgLmJvb20ge1xcbiAgYW5pbWF0aW9uOiBib29tIDAuNXMgZWFzZS1vdXQgZm9yd2FyZHM7XFxufVxcblxcbkBrZXlmcmFtZXMgaGl0IHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDQpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvb20ge1xcbiAgMCUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ib29tLWNvbG9yKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGlwcy1jb2xvcik7XFxuICB9XFxufVxcblxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsdUNBQXVDO0VBQ3ZDLGlDQUFpQztFQUNqQyxzQ0FBc0M7RUFDdEMsaUNBQWlDO0VBQ2pDLDRCQUE0QjtFQUM1QixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxzQ0FBc0M7QUFDeEM7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUN2QixXQUFXO0VBQ1gsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGFBQWE7RUFDYix1Q0FBdUM7RUFDdkMsMENBQTBDO0VBQzFDLG9DQUFvQztBQUN0Qzs7QUFFQTtFQUNFLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7O0VBRUUsb0NBQW9DO0VBQ3BDLGtCQUFrQjtBQUNwQjs7QUFFQTs7RUFFRSwyQkFBMkI7RUFDM0IsNEJBQTRCO0FBQzlCOztBQUVBOztFQUVFLDhCQUE4QjtFQUM5QiwrQkFBK0I7QUFDakM7O0FBRUE7O0VBRUUsMkJBQTJCO0VBQzNCLDhCQUE4QjtBQUNoQzs7QUFFQTs7RUFFRSw0QkFBNEI7RUFDNUIsK0JBQStCO0FBQ2pDOztBQUVBO0VBQ0Usb0NBQW9DO0VBQ3BDLDRCQUE0QjtBQUM5Qjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLDJCQUEyQjtFQUMzQixTQUFTO0VBQ1QsWUFBWTtFQUNaLFVBQVU7RUFDVixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0U7SUFDRSxVQUFVO0lBQ1Ysb0JBQW9CO0VBQ3RCOztFQUVBO0lBQ0UsVUFBVTtJQUNWLHNCQUFzQjtFQUN4QjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxVQUFVO0lBQ1Ysb0JBQW9CO0VBQ3RCOztFQUVBO0lBQ0UsVUFBVTtJQUNWLHNCQUFzQjtFQUN4QjtBQUNGOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUNoQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLG9CQUFvQjtFQUNwQix1QkFBdUI7RUFDdkIsMkNBQTJDO0VBQzNDLGtCQUFrQjtFQUNsQixzQkFBc0I7RUFDdEIscUJBQXFCO0VBQ3JCLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGNBQWM7RUFDZCw4Q0FBOEM7RUFDOUMsa0JBQWtCO0VBQ2xCLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YseUJBQXlCO0VBQ3pCLHlDQUF5QztBQUMzQztBQUNBOztFQUVFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFO0lBQ0UsY0FBYztJQUNkLGtCQUFrQjtFQUNwQjtBQUNGOztBQUVBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsY0FBYztFQUNkLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLGFBQWE7RUFDYixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSx3QkFBd0I7RUFDeEIseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSx3QkFBd0I7RUFDeEIseUJBQXlCO0FBQzNCOztBQUVBOztFQUVFLHdCQUF3QjtFQUN4Qix5QkFBeUI7QUFDM0I7O0FBRUE7O0VBRUUsd0JBQXdCO0VBQ3hCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHdCQUF3QjtFQUN4Qix5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSx3QkFBd0I7RUFDeEIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0Usd0JBQXdCO0VBQ3hCLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHdCQUF3QjtFQUN4Qix5QkFBeUI7QUFDM0I7O0FBRUE7O0VBRUUsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQix1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRSxtQ0FBbUM7QUFDckM7O0FBRUE7O0VBRUUsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGFBQWE7QUFDZjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLHFDQUFxQztFQUNyQyxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osYUFBYTtBQUNmOztBQUVBO0VBQ0UsK0JBQStCO0FBQ2pDOztBQUVBO0VBQ0UsK0JBQStCO0FBQ2pDOztBQUVBO0VBQ0Usc0NBQXNDO0FBQ3hDOztBQUVBO0VBQ0U7SUFDRSxVQUFVO0lBQ1YsbUJBQW1CO0VBQ3JCOztFQUVBO0lBQ0UsVUFBVTtJQUNWLG1CQUFtQjtFQUNyQjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxtQ0FBbUM7RUFDckM7O0VBRUE7SUFDRSxvQ0FBb0M7RUFDdEM7QUFDRjs7QUFFQTtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG46cm9vdCB7XFxuICAvKiAtLWJvYXJkLWNvbG9yOiByZ2IoMTk3LCAxOTYsIDI1NSk7ICovXFxuICAtLWJvYXJkLWNvbG9yOiByZ2IoMTY5LCAyNTUsIDI1NSk7XFxuICAtLWdyaWQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcXG4gIC0tc2hpcHMtY29sb3I6IHJnYigyMjgsIDIyOCwgMjI4KTtcXG4gIC0tYm9vbS1jb2xvcjogcmdiKDI1NSwgMCwgMCk7XFxuICAtLW1pc3MtY29sb3I6IHJnYigyNTUsIDI1NSwgMjU1KTtcXG59XFxuXFxuKiB7XFxuICBmb250LWZhbWlseTogXFxcIlByZXNzIFN0YXJ0IDJQXFxcIiwgY3Vyc2l2ZTtcXG59XFxuXFxuLnRpdGxlIHtcXG4gIGZvbnQtc2l6ZTogMi41cmVtO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IG5vbmU7XFxufVxcblxcbi5iYXR0bGVzaGlwLWdyaWQge1xcbiAgbWFyZ2luOiAydm1pbjtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgNC42dm1pbik7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgNC42dm1pbik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ib2FyZC1jb2xvcik7XFxufVxcblxcbi5iYXR0bGVzaGlwLWdyaWQgZGl2IHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWdyaWQtY29sb3IpO1xcbn1cXG5cXG4uY29tcHV0ZXItYm9hcmQge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4udGFrZW4sXFxuLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcHMtY29sb3IpO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4udGFrZW4uc3RhcnQudmVydGljYWwsXFxuLnRha2VuLnN0YXJ0LnZlcnRpY2FsOjpiZWZvcmUge1xcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNTAlO1xcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDUwJTtcXG59XFxuXFxuLnRha2VuLmVuZC52ZXJ0aWNhbCxcXG4udGFrZW4uZW5kLnZlcnRpY2FsOjpiZWZvcmUge1xcbiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNTAlO1xcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDUwJTtcXG59XFxuXFxuLnRha2VuLnN0YXJ0Lmhvcml6b250YWwsXFxuLnRha2VuLnN0YXJ0Lmhvcml6b250YWw6OmJlZm9yZSB7XFxuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1MCU7XFxuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiA1MCU7XFxufVxcblxcbi50YWtlbi5lbmQuaG9yaXpvbnRhbCxcXG4udGFrZW4uZW5kLmhvcml6b250YWw6OmJlZm9yZSB7XFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNTAlO1xcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDUwJTtcXG59XFxuXFxuLmNvbXB1dGVyLWJvYXJkID4gLnRha2VuIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvYXJkLWNvbG9yKTtcXG4gIGJvcmRlci1yYWRpdXM6IDAlICFpbXBvcnRhbnQ7XFxufVxcblxcbi50YWtlbi52ZXJ0aWNhbDo6YmVmb3JlLFxcbi50YWtlbi5ob3Jpem9udGFsOjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3JkZXI6IDAuM3ZtaW4gc29saWQgd2hpdGU7XFxuICB0b3A6IC0xcHg7XFxuICBib3R0b206IC0xcHg7XFxuICBsZWZ0OiAtMXB4O1xcbiAgcmlnaHQ6IC0xcHg7XFxufVxcblxcbi50YWtlbi5ob3Jpem9udGFsOjpiZWZvcmUge1xcbiAgYm9yZGVyLWxlZnQ6IG5vbmU7XFxuICBib3JkZXItcmlnaHQ6IG5vbmU7XFxuICBhbmltYXRpb246IHJpcHBsZXNZIDNzIGxpbmVhciBpbmZpbml0ZTtcXG59XFxuXFxuLnRha2VuLnZlcnRpY2FsOjpiZWZvcmUge1xcbiAgYm9yZGVyLXRvcDogbm9uZTtcXG4gIGJvcmRlci1ib3R0b206IG5vbmU7XFxuICBhbmltYXRpb246IHJpcHBsZXNYIDNzIGxpbmVhciBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyByaXBwbGVzWCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEuNSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgcmlwcGxlc1kge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxLjUpO1xcbiAgfVxcbn1cXG5cXG4udHVybi1kaXNwbGF5IHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgZm9udC13ZWlnaHQ6IDkwMDtcXG4gIG1hcmdpbjogMXJlbSAwO1xcbn1cXG5cXG4uaW5mby1kaXNwbGF5IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gIG1heC13aWR0aDogODAwcHg7XFxuICBtYXJnaW46IDAuOHJlbSAwO1xcbn1cXG5cXG4uaGlkZGVuLWluZm8ge1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxufVxcblxcbi5idG4ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcGFkZGluZzogMC43ZW0gMS4yZW07XFxuICBtYXJnaW46IDAgMC4xZW0gMC4xZW0gMDtcXG4gIGJvcmRlcjogMC4xNmVtIHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7XFxuICBib3JkZXItcmFkaXVzOiAyZW07XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBmb250LXdlaWdodDogMzAwO1xcbiAgY29sb3I6ICMwMDAwMDA7XFxuICB0ZXh0LXNoYWRvdzogMCAwLjA0ZW0gMC4wNGVtIHJnYigxMjYsIDI1NSwgODcpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTNmZmEwO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjVzIGVhc2UtaW47XFxufVxcbi5idG46aG92ZXIsXFxuLmJ0bjpmb2N1cyB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTBmZjA4YTg7XFxufVxcblxcbkBtZWRpYSBhbGwgYW5kIChtYXgtd2lkdGg6IDMwZW0pIHtcXG4gIC5idG4ge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgbWFyZ2luOiAwLjJlbSBhdXRvO1xcbiAgfVxcbn1cXG5cXG4uc2hpcHMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5zaGlwID4gZGl2IHtcXG4gIHdpZHRoOiA0LjZ2bWluO1xcbiAgaGVpZ2h0OiA0LjZ2bWluO1xcbn1cXG5cXG4uc2hpcCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgbWFyZ2luOiAxdm1pbjtcXG4gIGJvcmRlci1yYWRpdXM6IDIuM3ZtaW47XFxufVxcblxcbi5kZXN0cm95ZXItY29udGFpbmVyIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiAyKTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogMSk7XFxufVxcbi5kZXN0cm95ZXItY29udGFpbmVyLXZlcnRpY2FsIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiAxKTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogMik7XFxufVxcblxcbi5zdWJtYXJpbmUtY29udGFpbmVyLFxcbi5jcnVpc2VyLWNvbnRhaW5lciB7XFxuICB3aWR0aDogY2FsYyg0LjZ2bWluICogMyk7XFxuICBoZWlnaHQ6IGNhbGMoNC42dm1pbiAqIDEpO1xcbn1cXG5cXG4uc3VibWFyaW5lLWNvbnRhaW5lci12ZXJ0aWNhbCxcXG4uY3J1aXNlci1jb250YWluZXItdmVydGljYWwge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDEpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiAzKTtcXG59XFxuXFxuLmJhdHRsZXNoaXAtY29udGFpbmVyIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiA0KTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogMSk7XFxufVxcblxcbi5iYXR0bGVzaGlwLWNvbnRhaW5lci12ZXJ0aWNhbCB7XFxuICB3aWR0aDogY2FsYyg0LjZ2bWluICogMSk7XFxuICBoZWlnaHQ6IGNhbGMoNC42dm1pbiAqIDQpO1xcbn1cXG5cXG4uY2Fycmllci1jb250YWluZXIge1xcbiAgd2lkdGg6IGNhbGMoNC42dm1pbiAqIDUpO1xcbiAgaGVpZ2h0OiBjYWxjKDQuNnZtaW4gKiAxKTtcXG59XFxuXFxuLmNhcnJpZXItY29udGFpbmVyLXZlcnRpY2FsIHtcXG4gIHdpZHRoOiBjYWxjKDQuNnZtaW4gKiAxKTtcXG4gIGhlaWdodDogY2FsYyg0LjZ2bWluICogNSk7XFxufVxcblxcbi5taXNzLFxcbi5ib29tIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5ib29tOjphZnRlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ib29tLWNvbG9yKTtcXG59XFxuXFxuLm1pc3M6OmFmdGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1pc3MtY29sb3IpO1xcbn1cXG5cXG4uYm9vbTo6YWZ0ZXIsXFxuLm1pc3M6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm9yZGVyLXJhZGl1czogMTAwJTtcXG4gIHdpZHRoOiAydm1pbjtcXG4gIGhlaWdodDogMnZtaW47XFxufVxcblxcbi5taXNzOjpiZWZvcmUsXFxuLmNvbXB1dGVyLWJvYXJkIC5ib29tOjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBhbmltYXRpb246IGhpdCAwLjVzIGVhc2Utb3V0IGZvcndhcmRzO1xcbiAgYm9yZGVyLXdpZHRoOiAxdm1pbjtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xcbiAgd2lkdGg6IDJ2bWluO1xcbiAgaGVpZ2h0OiAydm1pbjtcXG59XFxuXFxuLmNvbXB1dGVyLWJvYXJkIC5ib29tOjpiZWZvcmUge1xcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ib29tLWNvbG9yKTtcXG59XFxuXFxuLm1pc3M6OmJlZm9yZSB7XFxuICBib3JkZXItY29sb3I6IHZhcigtLW1pc3MtY29sb3IpO1xcbn1cXG5cXG4ucGxheWVyLWJvYXJkIC5ib29tIHtcXG4gIGFuaW1hdGlvbjogYm9vbSAwLjVzIGVhc2Utb3V0IGZvcndhcmRzO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGhpdCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSg0KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBib29tIHtcXG4gIDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYm9vbS1jb2xvcik7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpcHMtY29sb3IpO1xcbiAgfVxcbn1cXG5cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07Il0sIm5hbWVzIjpbInVzZXJCb2FyZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNvbXB1dGVyQm9hcmQiLCJkZXN0cm95ZXIiLCJzdWJtYXJpbmUiLCJjcnVpc2VyIiwiYmF0dGxlc2hpcCIsImNhcnJpZXIiLCJzdGFydEJ1dHRvbiIsInJvdGF0ZUJ1dHRvbiIsInNoaXBzIiwicXVlcnlTZWxlY3RvckFsbCIsInNoaXBzQ29udGFpbmVyIiwiaW5mb0NvbnRhaW5lciIsInR1cm5EaXNwbGF5IiwiYnV0dG9uQ29udGFpbmVyIiwicGxheWVyU3F1YXJlcyIsImNvbXB1dGVyU3F1YXJlcyIsIndpZHRoIiwiaXNIb3Jpem9udGFsIiwiaXNHYW1lT3ZlciIsImN1cnJlbnRQbGF5ZXIiLCJzZWxlY3RlZFNoaXBOYW1lV2l0aEluZGV4IiwiZHJhZ2dlZFNoaXAiLCJkcmFnZ2VkU2hpcExlbmd0aCIsInBsYXllclRvdGFsIiwiY29tcHV0ZXJUb3RhbCIsIndpbm5lciIsInN1bmtTaGlwIiwiZGlzcGxheUJvYXJkIiwiZ3JpZCIsInNxdWFyZXMiLCJpIiwic3F1YXJlIiwiY3JlYXRlRWxlbWVudCIsImRhdGFzZXQiLCJpZCIsImFwcGVuZENoaWxkIiwicHVzaCIsImNyZWF0ZVNoaXBzIiwibmFtZSIsImRpcmVjdGlvbnMiLCJkaXNwbGF5U2hpcHNSYW5kb20iLCJzaGlwIiwicmFuZG9tU3RhcnQiLCJyYW5kb21EaXJlY3Rpb24iLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJjdXJyZW50IiwiYWJzIiwibGVuZ3RoIiwiaXNUYWtlbiIsInNvbWUiLCJpbmRleCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiaXNBdFJpZ2h0RWRnZSIsImlzQXRMZWZ0RWRnZSIsImZvckVhY2giLCJhZGQiLCJkaXNwbGF5Q29tcHV0ZXJTaGlwcyIsImJhdHRsZVNoaXBzIiwicm90YXRlU2hpcHMiLCJ0b2dnbGUiLCJkcmFnRHJvcCIsInNoaXBOYW1lV2l0aExhc3RJZCIsImxhc3RFbGVtZW50Q2hpbGQiLCJzaGlwQ2xhc3MiLCJzbGljZSIsImxhc3RTaGlwSW5kZXgiLCJwYXJzZUludCIsInN1YnN0ciIsInNoaXBMYXN0SWQiLCJub3RBbGxvd2VkSG9yaXpvbnRhbCIsIm5vdEFsbG93ZWRWZXJ0aWNhbCIsIm5ld05vdEFsbG93ZWRIb3Jpem9udGFsIiwic3BsaWNlIiwibmV3Tm90QWxsb3dlZFZlcnRpY2FsIiwic2VsZWN0ZWRTaGlwSW5kZXgiLCJzaGlwSG9yaXpvbnRhbCIsInNoaXBWZXJ0aWNhbCIsImlzRGl2VGFrZW4iLCJjaGVja0FycmF5IiwiYXJyYXkiLCJpbmNsdWRlcyIsImRpcmVjdGlvbkNsYXNzIiwicmVtb3ZlQ2hpbGQiLCJkcmFnU3RhcnQiLCJjaGlsZHJlbiIsInByZXZlbnRFdmVudERlZmF1bHQiLCJlIiwicHJldmVudERlZmF1bHQiLCJkcmFnU2hpcHMiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0IiwiZHJhZ1NxdWFyZXMiLCJjcmVhdGVBbGVydCIsIm1lc3NhZ2UiLCJpbmZvRGlzcGxheSIsImNsYXNzTmFtZSIsImNyZWF0ZVRleHROb2RlIiwic2V0VGltZW91dCIsInJlbW92ZSIsImRpc3BsYXlBbGVydCIsImV2ZW50QWxlcnQiLCJhbGVydERpc3BsYXkiLCJjcmVhdGVTaGlwc1RhbGx5IiwicGxheWVyU2NvcmUiLCJjb21wdXRlclNjb3JlIiwiY2hhbmdlVHVybiIsImNoZWNrQ29tcHV0ZXJTaGlwcyIsImNoZWNrUGxheWVyU2hpcHMiLCJjaGVja1NoaXBzIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwidG90YWwiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciLCJjaGVja0hpdCIsImNvbXB1dGVyR28iLCJoaXQiLCJpbm5lckhUTUwiLCJwbGF5VHVybiIsImNoZWNrRm9yV2lucyIsImNoZWNrQWNjdXJhY3kiLCJyZXZlYWxTcXVhcmUiLCJwbGF5R2FtZSIsInN0eWxlIiwiZGlzcGxheSIsImdhbWVPdmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJ1bkdhbWUiXSwic291cmNlUm9vdCI6IiJ9