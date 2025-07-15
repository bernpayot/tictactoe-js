// Gameboard module (IIFE)
const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const placeToken = (row, column, player) => {
    const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

    if (!availableCells.length) return;

    board[row][column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  const getBoard = () => board;

  return { placeToken, printBoard, getBoard };
})();

// Cell function, this is not wrapped in IIFE since this is a reusable function
function Cell() {
  const noTokenInSquare = 0;
  let value = noTokenInSquare;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

// GameController module (IIFE)
const GameController = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two") {
  const board = Gameboard;
  const players = [
    {
      name: playerOneName,
      token: "x"
    },
    {
      name: playerTwoName,
      token: "o"
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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    let hasWinner = 0;
    let currentPlayer = getActivePlayer();
    console.log(`${getActivePlayer().name} has put his token on row ${row}, column ${column}!`);
    board.placeToken(row, column, currentPlayer.token);

    for (let condition of winConditions) {
      const [a, b, c] = condition;

      const posA = board.getBoard()[a[0]][a[1]].getValue();
      const posB = board.getBoard()[b[0]][b[1]].getValue();
      const posC = board.getBoard()[c[0]][c[1]].getValue();

      if (posA === currentPlayer.token && posB === currentPlayer.token && posC === currentPlayer.token) {
        hasWinner = 1;
      }
    }

    if (hasWinner === 1) {
      board.printBoard();
      console.log(`${currentPlayer.name} has won!`);
      return;
    }

    const allCells = board.getBoard().flat();
    const isBoardFull = allCells.every(cell => cell.getValue() !== 0);

    if (isBoardFull) {
      board.printBoard();
      console.log("It's a draw!");
      return;
    }
    switchPlayerTurn();
    printNewRound();      
  };      
  
  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
})();

const game = GameController;




