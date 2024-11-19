class YatzyEngine {
    constructor() {
      this.scores = {
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
      };
      this.totalScore = 0;
    }
  
    calculateScore(category, diceValues) {
      const counts = {};
      diceValues.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
      });
  
      switch (category) {
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes':
          const num = parseInt(category[0]);
          return diceValues.filter((v) => v === num).reduce((a, b) => a + b, 0);
        case 'threeOfKind':
          return Object.values(counts).some((count) => count >= 3)
            ? diceValues.reduce((a, b) => a + b, 0)
            : 0;
        case 'fourOfKind':
          return Object.values(counts).some((count) => count >= 4)
            ? diceValues.reduce((a, b) => a + b, 0)
            : 0;
        case 'fullHouse':
          const hasThree = Object.values(counts).some((count) => count === 3);
          const hasTwo = Object.values(counts).some((count) => count === 2);
          return hasThree && hasTwo ? 25 : 0;
        case 'smallStraight':
          return this.isSmallStraight(diceValues) ? 30 : 0;
        case 'largeStraight':
          return this.isLargeStraight(diceValues) ? 40 : 0;
        case 'yahtzee':
          return Object.values(counts).some((count) => count === 5) ? 50 : 0;
        case 'chance':
          return diceValues.reduce((a, b) => a + b, 0);
        default:
          return 0;
      }
    }
  
    calculatePossibleScores(diceValues) {
      const possibleScores = {};
      for (const category in this.scores) {
        if (this.scores[category] === null) {
          possibleScores[category] = this.calculateScore(category, diceValues);
        }
      }
      return possibleScores;
    }
  
    isValidSelection(category, diceValues) {
      return this.scores[category] === null;
    }
  
    updateScore(category, score) {
      this.scores[category] = score;
      this.totalScore += score;
    }
  
    getTotalScore() {
      return this.totalScore;
    }
  
    getScores() {
      return this.scores;
    }
  
    isSmallStraight(diceValues) {
      const uniqueValues = [...new Set(diceValues)].sort();
      const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
      ];
      return straights.some((straight) =>
        straight.every((num) => uniqueValues.includes(num))
      );
    }
  
    isLargeStraight(diceValues) {
      const sortedValues = [...new Set(diceValues)].sort();
      return (
        (sortedValues.length === 5 &&
          sortedValues.every((val, index) => val === index + 1)) ||
        sortedValues.every((val, index) => val === index + 2)
      );
    }
  }
  
  module.exports = YatzyEngine;
  