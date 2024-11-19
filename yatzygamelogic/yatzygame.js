const Dice = require('./dice');
const YatzyEngine = require('./yatzyengine');

class YatzyGame {
  constructor() {
    this.dice = new Dice();
    this.engine = new YatzyEngine();
    this.currentRound = 1;
  }

  startNewGame() {
    this.dice = new Dice();
    this.engine = new YatzyEngine();
    this.currentRound = 1;
  }

  rollDice() {
    return this.dice.roll();
  }

  holdDice(index) {
    this.dice.toggleHold(index);
  }

  scoreCategory(category) {
    const diceValues = this.dice.getDiceValues();
    if (this.engine.isValidSelection(category, diceValues)) {
      const score = this.engine.calculateScore(category, diceValues);
      this.engine.updateScore(category, score);
      this.dice.resetRolls(); 
      return score;
    }
    return null;
  }

  getGameState() {
    return {
      diceValues: this.dice.getDiceValues(),
      heldDice: this.dice.heldDice,
      rollsLeft: this.dice.getRollsLeft(),
      scores: this.engine.getScores(),
      totalScore: this.engine.getTotalScore(),
    };
  }
}

module.exports = YatzyGame;
