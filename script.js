function playerMaker(name, mark, type) {
  let score = 0;
  const getName = () => name;
  const getMark = () => mark;
  const getType = () => type;
  const getScore = () => score;
  const incrementScore = () => score++;

  const playTurn = (position) => {
    if (gameboard.checkIfSquareEmpty(position)) {
      gameboard.placeMark(mark, position);
      gameboard.drawMark(mark, position);
      if (gameboard.checkIfWon()) {
        incrementScore();
        game.updateScoreboard();
        game.endGame('win');
      } else if (gameboard.checkIfGridFull()) {
        game.endGame('draw');
      } else {
        game.switchCurrentPlayer();
        game.setTurn();
      }
    }
  };

  return {
    getName,
    getMark,
    getType,
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

  const checkIfWon = () => {
    const grid = convertGridFormat();

    // check if there is a corresponding winning pattern
    let globalMatch = false;
    for (pattern of winningPatterns) {
      let localMatch = true;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && grid[index] !== '1') localMatch = false;
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

  const convertGridFormat = () => {
    const newGrid = [...grid];
    grid.forEach((item, index) => {
      if (item === game.getCurrentPlayer().getMark()) {
        newGrid[index] = '1';
      } else if (item !== 0) {
        newGrid[index] = '2';
      } else {
        newGrid[index] = '0';
      }
    });
    return newGrid;
  };

  const resetGrid = () => {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = 0;
    }
  };

  const preventFromClickingSquares = () => {
    document.querySelectorAll('.square').forEach(square => {
      square.onclick = null;
    });
  };

  return {
    grid,
    winningPatterns,
    drawGameboard,
    checkIfSquareEmpty,
    placeMark,
    drawMark,
    checkIfWon,
    checkIfGridFull,
    resetGrid,
    convertGridFormat,
    preventFromClickingSquares
  };
})();

const game = (function() {
  let gamemode, player1, player2, currentPlayer, lastBeginner;

  const openGamemodeModal = () => {
    const modal = document.querySelector('#modal');

    const heading = document.createElement('h2');
    heading.textContent = 'Choose a gamemode :';

    const button1 = document.createElement('button');
    button1.textContent = 'Player vs Player';
    button1.classList.add('full');
    button1.addEventListener('click', () => {
      setGamemode(button1.textContent);
      closeModal();
      game.startGame();
    });
    
    const button2 = document.createElement('button');
    button2.textContent = 'Player vs Computer';
    button2.classList.add('full');
    button2.addEventListener('click', () => {
      setGamemode(button2.textContent);
      closeModal();
      game.startGame();
    });

    modal.querySelector('.modal-content').appendChild(heading);
    modal.querySelector('.modal-content').appendChild(button1);
    modal.querySelector('.modal-content').appendChild(button2);
    modal.classList.remove('hidden');
  };

  const setGamemode = (mode) => {
    if (mode === 'Player vs Player') {
      player1 = playerMaker('Player 1', 'X', 'human');
      player2 = playerMaker('Player 2', 'O', 'human');
    }
    if (mode === 'Player vs Computer') {
      player1 = playerMaker('You', 'X', 'human');
      player2 = playerMaker('Computer', 'O', 'computer');
    }
    gamemode = mode;
  };

  const getCurrentPlayer = () => currentPlayer;

  const setBeginnerPlayer = () => {
    if (lastBeginner === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const showBeginnerPlayer = () => {
    const modal = document.querySelector('#modal');
    modal.classList.remove('hidden');

    const heading = document.createElement('h2');
    heading.textContent = `${getCurrentPlayer().getName()} begins`;
    modal.querySelector('.modal-content').innerHTML = '';
    modal.querySelector('.modal-content').appendChild(heading);

    setTimeout(() => {
      modal.classList.add('hidden');
    }, 1000);
  };

  const setLastBeginner = () => {
    lastBeginner = getCurrentPlayer();
  };

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
    setBeginnerPlayer();
    showBeginnerPlayer();
    updateScoreboard();
    setTurn();
    setLastBeginner();
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
    gameboard.preventFromClickingSquares();

    if (currentPlayer.getType() === 'human') {
      document.querySelectorAll('.square').forEach(square => {
        square.onclick = () => {
          currentPlayer.playTurn(square.id);
        };
      });
    }
    if (currentPlayer.getType() === 'computer') {
      let computerChoice = computer.makeDecision();
      setTimeout(() => {
        currentPlayer.playTurn(computerChoice);
      }, 1000);
    }
  };
  
  const openEndModal = (endType) => {
    const modal = document.querySelector('#modal');

    const heading = document.createElement('h2');
    const button = document.createElement('button');
    button.addEventListener('click', () => {
      closeModal();
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
    modal.classList.remove('hidden');
  };

  const closeModal = () => {
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
    setTurn,
    endGame,
    updateScoreboard,
    openGamemodeModal,
    setGamemode
  };
})();

const computer = (function() {
  const checkWinInOneMove = () => {
    const grid = gameboard.convertGridFormat();
    let canWin = false;

    for (pattern of gameboard.winningPatterns) {
      let i = 0;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && grid[index] !== '2') {
          if (grid[index] === '1') i++;
        }
      });
      if (i === 2) canWin = true;
    }
    return canWin;
  };

  const makeRandomDecision = () => {
    let emptySquares = [];
    gameboard.grid.forEach((item, index) => {
      if (item === 0) emptySquares.push(index);
    });
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const makeDefensiveDecision = () => {
    const grid = gameboard.convertGridFormat();

    let choice = -1;

    for (pattern of gameboard.winningPatterns) {
      let i = 0;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && grid[index] === '2') {
          i++;
        } else if (item === '1' && grid[index] === '1') {
          i--;
        }
      });
      if (i === 2) {
        pattern.split('').forEach((item, index) => {
          if (item === '1' && grid[index] === '0') {
            choice = index;
          }
        });
      }
    }

    return choice;
  };

  const makeOffensiveDecision = () => {
    const grid = gameboard.convertGridFormat();

    let choice = -1;

    for (pattern of gameboard.winningPatterns) {
      let i = 0;
      pattern.split('').forEach((item, index) => {
        if (item === '1' && grid[index] !== '2') {
          if (grid[index] === '1') {
            i++;
          }
        }
      });
      if (i === 2) {
        pattern.split('').forEach((item, index) => {
          if (item === '1' && grid[index] === '0') {
            choice = index;
          }
        });
      }
    }
    return choice;
  };

  const makeDecision = () => {
    if (checkWinInOneMove() && makeOffensiveDecision() !== -1) {
      console.log('Computer can win in one move');
      return makeOffensiveDecision();
    }
    // If it is worth making a defensive decision, make one
    if (makeDefensiveDecision() !== -1) {
      return makeDefensiveDecision();
    }
    // If it is worth making an offensive decision, make one
    if (makeOffensiveDecision() !== -1) {
      return makeOffensiveDecision();
    }
    // Otherwise, make a random decision
    return makeRandomDecision();
  };

  return {
    makeDecision
  };
})();

window.addEventListener('load', () => {
  gameboard.drawGameboard(),
  game.openGamemodeModal()
});

document.querySelector('button#restart')
.addEventListener('click', game.startGame);