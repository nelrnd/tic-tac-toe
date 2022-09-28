function playerMaker(name, mark) {
  let score = 0;
  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const incrementScore = () => score++;

  const placeMark = (position) => {
    if (!gameboard.checkIfSquareEmpty(position)) return;
    gameboard.grid[position] = mark;
    gameboard.insertMark(position, mark);
    gameboard.checkWinningPatterns(mark);
    game.switchCurrentPlayer();
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

  const checkIfSquareEmpty = (position) => {
    if (grid[position] === 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkWinningPatterns = (mark) => {
    // convert grid to same format as winning patterns
    const gridCopy = [...grid];
    gridCopy.forEach((item, index) => {
      if (item === mark) {
        gridCopy[index] = '1';
      } else {
        gridCopy[index] = '0';
      }
    });

    // check if there is a corresponding winning pattern
    for (pattern of winningPatterns) {
      let match = true;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && gridCopy[index] != '1') {
          match = false;
        }
      });
      if (match) console.log('We have a winner!');
    }
  };

  const drawGameboard = () => {
    const gameboard = document.querySelector('#gameboard');
    gameboard.innerHTML = '';

    for (let i = 0; i < grid.length; i++) {
      const square = document.createElement('div');
      square.id = i;
      square.classList.add('square');
      square.addEventListener('click', () => {
        game.getCurrentPlayer().placeMark(i);
      });
      gameboard.appendChild(square);
    }
  }

  const insertMark = (position, mark) => {
    const squares = document.querySelectorAll('.square');
    const markImg = document.createElement('img');
    markImg.src = `./assets/${mark.toLowerCase()}.svg`;
    markImg.alt = 'mark icon';
    squares[position].appendChild(markImg);
  };

  return {
    grid,
    checkIfSquareEmpty,
    checkWinningPatterns,
    drawGameboard,
    insertMark
  };
})();

const game = (function() {
  const player1 = playerMaker('Nami', 'X');
  const player2 = playerMaker('Sanji', 'O');

  let currentPlayer;
  const getCurrentPlayer = () => currentPlayer;
  const switchCurrentPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const start = () => {
    gameboard.drawGameboard();
    currentPlayer = player1;
  };

  return {
    getCurrentPlayer,
    switchCurrentPlayer,
    start
  };
})();

game.start();