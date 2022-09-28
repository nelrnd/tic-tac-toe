function playerMaker(name, mark) {
  let score = 0;
  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const incrementScore = () => score++;

  return {
    getName,
    getMark,
    getScore,
    incrementScore
  };
};