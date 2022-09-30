function playerMaker(name, mark) {
  let score = 0;
  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const incrementScore = () => score++;

  const playTurn = (position) => {
    if (gameboard.checkIfSquareEmpty(position)) {
      gameboard.placeMark(mark, position);
      gameboard.drawMark(mark, position);
      if (gameboard.checkIfWon(mark)) {
        incrementScore();
        game.updateScoreboard();
        game.endGame('win');
      } else if (gameboard.checkIfGridFull()) {
        game.endGame('draw');
      } else {
        game.switchCurrentPlayer();
      }
    }
  };

  return {
    getName,
    getMark,
    getScore,
    playTurn
  };
};

const gameboard = (function() {
  const grid = [0,0,0,0,0,0,0,0,0];

  const winningPatterns = [
    '111000000','000111000','000000111','100100100',
    '010010010','001001001','100010001','001010100'
  ];

  const checkIfSquareEmpty = (position) => {
    return grid[position] === 0;
  };

  const checkIfWon = (mark) => {
    // convert grid to same format as winning patterns
    const gridCopy = [...grid];
    grid.forEach((item, index) => {
      if (item === mark) {
        gridCopy[index] = '1';
      } else {
        gridCopy[index] = '0';
      }
    });

    // check if there is a corresponding winning pattern
    let globalMatch = false;
    for (pattern of winningPatterns) {
      let localMatch = true;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && gridCopy[index] !== '1') localMatch = false;
      });
      if (localMatch) globalMatch = true;
    }
    return globalMatch;
  };

  const checkIfGridFull = () => {
    return grid.every(item => item !== 0);
  };

  const placeMark = (mark, position) => {
    grid[position] = mark;
  };

  const drawMark = (mark, position) => {
    const markImg = document.createElement('img');
    if (mark === 'X') {
      markImg.src = './assets/x.svg';
      markImg.alt = 'x mark';
    }
    if (mark === 'O') {
      markImg.src = './assets/o.svg';
      markImg.alt = 'o mark';
    }
    document.querySelectorAll('.square')[position].appendChild(markImg);
  };

  const drawGameboard = () => {
    const gameboard = document.querySelector('#gameboard');
    gameboard.innerHTML = '';

    for (let i = 0; i < grid.length; i++) {
      const square = document.createElement('div');
      square.id = i;
      square.classList.add('square');
      gameboard.appendChild(square);
    }
  }

  const resetGrid = () => {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = 0;
    }
  };

  return {
    drawGameboard,
    checkIfSquareEmpty,
    placeMark,
    drawMark,
    checkIfWon,
    checkIfGridFull,
    resetGrid
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

  const startGame = () => {
    gameboard.resetGrid();
    gameboard.drawGameboard();
    currentPlayer = player1;
    updateScoreboard();
    setTurn();
  };

  const endGame = (endType) => {
    if (endType === 'win') {
      openEndModal('win');
    }
    if (endType === 'draw') {
      openEndModal('draw');
    }
  };

  const setTurn = () => {
    document.querySelectorAll('.square').forEach(square => {
      square.onclick = () => {
        currentPlayer.playTurn(square.id);
      };
    });
  };

  const openEndModal = (endType) => {
    const modal = document.querySelector('#modal');
    modal.classList.remove('hidden');

    const heading = document.createElement('h2');
    const button = document.createElement('button');
    button.addEventListener('click', () => {
      closeEndModal();
      startGame();
    });

    if (endType === 'win') {
      heading.textContent = `${getCurrentPlayer().getName()} won the game!`;
      button.textContent = 'PLAY AGAIN';
    }
    if (endType === 'draw') {
      heading.textContent = 'This is a draw!';
      button.textContent = 'RESTART';
    }

    modal.querySelector('.modal-content').innerHTML = '';
    modal.querySelector('.modal-content').appendChild(heading);
    modal.querySelector('.modal-content').appendChild(button);
  };

  const closeEndModal = () => {
    document.querySelector('#modal').classList.add('hidden');
  };

  const updateScoreboard = () => {
    const scoreboard = document.querySelector('#scoreboard');
    scoreboard.querySelector('div:nth-of-type(1) > .name').textContent = player1.getName();
    scoreboard.querySelector('div:nth-of-type(1) > .score').textContent = player1.getScore() + ' points';
    scoreboard.querySelector('div:nth-of-type(2) > .name').textContent = player2.getName();
    scoreboard.querySelector('div:nth-of-type(2) > .score').textContent = player2.getScore() + ' points';
  };

  return {
    getCurrentPlayer,
    switchCurrentPlayer,
    startGame,
    endGame,
    updateScoreboard
  };
})();

game.startGame();

document.querySelector('button#restart')
.addEventListener('click', game.startGame);