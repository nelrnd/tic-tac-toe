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
    gameboard.checkIfGameboardFull();
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
      if (match) {
        game.getCurrentPlayer().incrementScore();
        game.updateScoreboard();
        game.openModal('win')
      };
    }
  };

  const checkIfGameboardFull = () => {
    let full = true;
    grid.forEach(item => {
      if (item === 0) {
        full = false;
      }
    });
    if (full) game.openModal('draw');
  }

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

  const resetGameboard = () => {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = 0;
    }
  };

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
    insertMark,
    resetGameboard,
    checkIfGameboardFull
  };
})();

const game = (function() {
  const player1 = playerMaker('Player 1', 'X');
  const player2 = playerMaker('Player 2', 'O');

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
    gameboard.resetGameboard();
    gameboard.drawGameboard();
    currentPlayer = player1;
    closeModal();
  };

  const openModal = (result) => {
    const modal = document.querySelector('#modal');
    modal.classList.remove('hidden');

    const heading = document.createElement('h2');
    const button = document.createElement('button');
    button.addEventListener('click', game.start);

    if (result === 'win') {
      heading.textContent = `${getCurrentPlayer().getName()} won the game!`;
      button.textContent = 'PLAY AGAIN';
    }
    if (result === 'draw') {
      heading.textContent = 'This is a draw!';
      button.textContent = 'RESTART';
    }

    modal.firstElementChild.innerHTML = '';
    modal.firstElementChild.append(heading, button);
  };

  const closeModal = () => {
    const modal = document.querySelector('#modal');
    modal.classList.add('hidden');
  };

  const updateScoreboard = () => {
    const scoreboard = document.querySelector('#scoreboard');

    scoreboard.firstElementChild.querySelector('.score').textContent =
    player1.getScore() + ' points';

    scoreboard.lastElementChild.querySelector('.score').textContent =
    player2.getScore() + ' points';
  };

  return {
    getCurrentPlayer,
    switchCurrentPlayer,
    start,
    openModal,
    closeModal,
    updateScoreboard
  };
})();

game.start();

document.querySelector('button#restart').addEventListener('click', game.start);