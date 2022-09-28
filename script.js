function playerMaker(name, mark) {
  let score = 0;
  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const incrementScore = () => score++;

  const placeMark = (position) => {
    gameboard.grid[position] = mark;
  }

  return {
    getName,
    getMark,
    getScore,
    incrementScore,
    placeMark
  };
};

const gameboard = (function() {
  const grid = [0,0,0,0,0,0,0,0,0];

  const winningPatterns = [
    '111000000','000111000','000000111','100100100',
    '010010010','001001001','100010001','001010100'
  ];

  return {grid};
})();