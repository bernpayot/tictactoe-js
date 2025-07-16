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

export function Cell() {
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

export default Gameboard;
