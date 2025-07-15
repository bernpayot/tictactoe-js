// Gameboard module (IIFE)
const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell()); // adds a new Cell() object to the current row, one for each column
    }
  }

  const placeToken = (row, column, player) => {
    // checks whether the cell is filled
    if (board[row][column].getValue() !== 0) return false;

    board[row][column].addToken(player);
    return true;
  };

  const getBoard = () => board;

  const resetBoard = () => {
    board.forEach(row => {
      row.forEach(cell => cell.resetCell());
    });
  };

  return { placeToken, getBoard, resetBoard };
})();

// Cell function, this is not wrapped in IIFE since this is a reusable function
function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const resetCell = () => value = 0;
  
  return {
    addToken,
    getValue,
    resetCell
  };
}

// GameController module (IIFE)
const GameController = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two") {
  let gameOver = false;
  const board = Gameboard;
  const players = [
    {
      name: playerOneName,
      token: "✖"
    },
    {
      name: playerTwoName,
      token: "◯"
    }
  ];

  // array containing positions of winning triplets
  const winConditions = [ 
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
  ]

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    if (gameOver) return "Game is already over.";
    let hasWinner = false;
    let boardValue = board.getBoard();    
    let currentPlayer = getActivePlayer();
    const success = board.placeToken(row, column, currentPlayer.token);
    if (!success) return "Cell is already filled. Choose another.";

    for (let condition of winConditions) {
      const [a, b, c] = condition;

      // checks the positions of tokens and see if there are winning triplets
      const posA = boardValue[a[0]][a[1]].getValue();
      const posB = boardValue[b[0]][b[1]].getValue();
      const posC = boardValue[c[0]][c[1]].getValue();

      if (posA === currentPlayer.token && posB === currentPlayer.token && posC === currentPlayer.token) {
        hasWinner = true;
      }
    }

    if (hasWinner === true) {
      gameOver = true;
      return `${currentPlayer.name} has won!`;
    }

    const allCells = boardValue.flat();
    const isBoardFull = allCells.every(cell => cell.getValue() !== 0); // checks if each cell has a value

    if (isBoardFull) { 
      gameOver = true;
      return `It's a draw!`;
    }
    switchPlayerTurn();     

    return `${getActivePlayer().name}'s turn.`
  };   
  
  const resetGame = () => {
    gameOver = false;
    board.resetBoard();
    activePlayer = players[0];
  };

  return {
    playRound,
    getActivePlayer,
    resetGame,
    getBoard: board.getBoard
  };
})();

function ScreenController () {
  const game = GameController;
  const gameBoard = document.querySelector(".board");
  const gameMessage = document.querySelector(".turn");
  const restartButton = document.querySelector(".restart");
  restartButton.addEventListener("click", () => {
    game.resetGame();
    updateScreen();
    gameMessage.textContent = `${game.getActivePlayer().name}'s turn.`;
  });

  const updateScreen = () => {
    gameBoard.textContent = "";

    let currentBoard = game.getBoard();

    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue(); // if the value of a cell is 0, its changed to a string ""
        cellButton.disabled = false;        
        gameBoard.appendChild(cellButton);
      })
    })
  }

  function boardClickHandler(e) {
    const { row, column } = e.target.dataset; // extracts the data-row and data-column attributes from the clicked element using destructuring
    if (row === undefined || column === undefined) return; // checks if the clicked element has valid data-row and data-column attributes

    const result = game.playRound(+row, +column);
    updateScreen();
    gameMessage.textContent = result;

    if (result.includes("won") || result.includes("draw")) {
      document.querySelectorAll(".cell").forEach(cell => cell.disabled = true);
    }
  }
  gameBoard.addEventListener("click", boardClickHandler);

  gameMessage.textContent = `${game.getActivePlayer().name}'s turn.`;
  updateScreen();
}

ScreenController();





