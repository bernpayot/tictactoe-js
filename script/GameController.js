import Gameboard from "./Gameboard.js";

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

export default GameController;
