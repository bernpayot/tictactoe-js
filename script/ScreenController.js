import GameController from "./GameController.js";

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