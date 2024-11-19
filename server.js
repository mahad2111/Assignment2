
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const YatzyGame = require('./yatzygamelogic/yatzygame'); // uncomment if you have this module

const app = express();
const game = new YatzyGame(); 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// initialize game state
let gameState = {
  diceValues: [0, 0, 0, 0, 0],
  heldDice: [false, false, false, false, false],
  rollsLeft: 3,
  scores: {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfKind: null,
    fourOfKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
  },
  totalScore: 0,
  possibleScores: {},
};

// endpoint to roll dice
app.post('/roll', (req, res) => {
  if (gameState.rollsLeft > 0) {
    for (let i = 0; i < 5; i++) {
      if (!gameState.heldDice[i]) {
        gameState.diceValues[i] = Math.floor(Math.random() * 6) + 1;
      }
    }
    gameState.rollsLeft--;

    // calculate possible scores
    gameState.possibleScores = calculatePossibleScores(gameState.diceValues, gameState.scores);

    res.json({
      diceValues: gameState.diceValues,
      rollsLeft: gameState.rollsLeft,
      possibleScores: gameState.possibleScores,
    });
  } else {
    res.status(400).json({ message: 'No rolls left. Please select a category to score.' });
  }
});

// endpoint to hold or release a die
app.put('/hold/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (gameState.rollsLeft < 3) {
    gameState.heldDice[index] = !gameState.heldDice[index];
    res.json({ heldDice: gameState.heldDice });
  } else {
    res.status(400).json({ message: 'You need to roll the dice first.' });
  }
});

// endpoint to score a category
app.post('/score/:category', (req, res) => {
  const category = req.params.category;
  if (gameState.scores[category] === null) {
    const score = calculateScore(category, gameState.diceValues);
    gameState.scores[category] = score;
    gameState.totalScore += score;
    // reset for next turn
    gameState.diceValues = [0, 0, 0, 0, 0];
    gameState.heldDice = [false, false, false, false, false];
    gameState.rollsLeft = 3;
    gameState.possibleScores = {};
    res.json({
      scores: gameState.scores,
      totalScore: gameState.totalScore,
    });
  } else {
    res.status(400).json({ message: 'Category already scored.' });
  }
});

// endpoint to get the current game state
app.get('/state', (req, res) => {
  res.json(gameState);
});

// serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// function to calculate possible scores without altering game state
function calculatePossibleScores(diceValues, scoredCategories) {
  let possibleScores = {};
  for (let category in gameState.scores) {
    if (scoredCategories[category] === null) {
      possibleScores[category] = calculateScore(category, diceValues);
    } else {
      possibleScores[category] = null;
    }
  }
  return possibleScores;
}

// function to calculate the score based on the category
function calculateScore(category, diceValues) {
  let counts = Array(7).fill(0); // Indices from 0 to 6
  diceValues.forEach((die) => counts[die]++);
  let score = 0;

  switch (category) {
    case 'ones':
    case 'twos':
    case 'threes':
    case 'fours':
    case 'fives':
    case 'sixes':
      const numMap = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: 6,
      };
      const num = numMap[category];
      score = counts[num] * num;
      break;

    case 'threeOfKind':
      if (counts.some((count) => count >= 3)) {
        score = diceValues.reduce((a, b) => a + b, 0);
      } else {
        score = 0;
      }
      break;

    case 'fourOfKind':
      if (counts.some((count) => count >= 4)) {
        score = diceValues.reduce((a, b) => a + b, 0);
      } else {
        score = 0;
      }
      break;

    case 'fullHouse':
      if (counts.includes(3) && counts.includes(2)) {
        score = 25;
      } else {
        score = 0;
      }
      break;

    case 'smallStraight':
      if (hasSmallStraight(counts)) {
        score = 30;
      } else {
        score = 0;
      }
      break;

    case 'largeStraight':
      if (hasLargeStraight(counts)) {
        score = 40;
      } else {
        score = 0;
      }
      break;

    case 'yahtzee':
      if (counts.some((count) => count === 5)) {
        score = 50;
      } else {
        score = 0;
      }
      break;

    case 'chance':
      score = diceValues.reduce((a, b) => a + b, 0);
      break;

    default:
      score = 0;
      break;
  }

  return score;
}

// helper functions to check for straights
function hasSmallStraight(counts) {
  const pattern = counts.slice(1).map((count) => (count > 0 ? '1' : '0')).join('');
  const smallStraights = ['1111', '01111', '11110', '011110'];
  return smallStraights.some((seq) => pattern.includes(seq));
}

function hasLargeStraight(counts) {
  const pattern = counts.slice(1).map((count) => (count > 0 ? '1' : '0')).join('');
  return pattern.includes('11111');
}

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
